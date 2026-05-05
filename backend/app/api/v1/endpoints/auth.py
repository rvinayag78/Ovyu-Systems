import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

from app.core.config import settings
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_verified_claims
from app.core.security import create_email_verification_token, decode_email_verification_token
from app.models.user import User
from app.schemas.auth import (
    BeginRegistrationRequest,
    BeginRegistrationResponse,
    CompleteRegistrationRequest,
    CompleteRegistrationResponse,
    UserRead,
    UserSyncRequest,
    VerifyTokenResponse,
)
from app.services.auth_service import AuthService
from app.services.email_service import EmailService
from app.services.magic_link_service import MakerStage, get_maker_stage, request_magic_link, verify_magic_link

router = APIRouter()


def _client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


# ── Sign-up (email verification token) ──────────────────────────────────────

@router.post("/begin-registration", response_model=BeginRegistrationResponse)
async def begin_registration(body: BeginRegistrationRequest) -> BeginRegistrationResponse:
    token = create_email_verification_token(body.model_dump(mode="json"))
    verify_url = f"{settings.frontend_url}/verify?token={token}"
    try:
        EmailService().send_maker_verification(str(body.maker_email), verify_url)
    except Exception as exc:
        logger.error("begin_registration email send failed for %s: %s", body.maker_email, exc, exc_info=True)
    return BeginRegistrationResponse(detail="Verification email sent")


@router.get("/verify-token", response_model=VerifyTokenResponse)
async def verify_token(token: str) -> VerifyTokenResponse:
    payload = decode_email_verification_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")
    return VerifyTokenResponse(
        first_name=payload["first_name"],
        last_name=payload["last_name"],
        maker_email=payload["maker_email"],
        keeper_name=payload["keeper_name"],
        keeper_email=payload["keeper_email"],
        relationship=payload["relationship"],
        path=payload["path"],
        tc_name=payload.get("tc_name"),
        tc_email=payload.get("tc_email"),
    )


# ── Complete registration (no password — email-verified, magic-link only) ────

@router.post("/complete-registration", response_model=CompleteRegistrationResponse)
async def complete_registration(
    body: CompleteRegistrationRequest,
    db: AsyncSession = Depends(get_db),
) -> CompleteRegistrationResponse:
    import uuid as _uuid
    from sqlalchemy import select as _select
    from app.core.security import create_session_token
    from app.models.user import User
    from app.models.contract import ContractPath
    from app.schemas.contract import ContractCreate
    from app.services.contract_service import ContractService
    from app.services.email_service import EmailService

    payload = decode_email_verification_token(body.token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

    email = str(payload["maker_email"]).strip().lower()
    parts = [payload["first_name"]]
    if payload.get("middle_name"):
        parts.append(payload["middle_name"])
    parts.append(payload["last_name"])
    full_name = " ".join(p.strip() for p in parts if p.strip())

    # Create or update user — always sync full_name so signing validation matches
    result = await db.execute(_select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        uid = _uuid.uuid4()
        user = User(
            id=uid,
            cognito_sub=f"email-{uid}",
            email=email,
            full_name=full_name,
            email_verified=True,
        )
        db.add(user)
        await db.flush()
    else:
        user.full_name = full_name
        await db.flush()

    # Return existing active contract if one already exists (prevents duplicate entries)
    from app.models.contract import Contract, ContractStatus
    existing_result = await db.execute(
        _select(Contract).where(
            Contract.maker_id == user.id,
            Contract.status.not_in([ContractStatus.WITHDRAWN_BY_MAKER, ContractStatus.WITHDRAWN_BY_KEEPER]),
        ).order_by(Contract.created_at.desc()).limit(1)
    )
    existing_contract = existing_result.scalar_one_or_none()
    if existing_contract:
        await db.commit()
        session_jwt = create_session_token(str(user.id), user.email, "login")
        return CompleteRegistrationResponse(
            session_token=session_jwt,
            contract_id=str(existing_contract.id),
            full_name=full_name,
        )

    # Create contract + invitation token via service (handles token generation)
    svc = ContractService(db)
    contract_data = ContractCreate(
        keeper_name=payload["keeper_name"],
        keeper_email=payload["keeper_email"],
        relationship=payload.get("relationship"),
        path=ContractPath(payload["path"]),
        tc_name=payload.get("tc_name"),
        tc_email=payload.get("tc_email"),
    )
    contract, invitation = await svc.create_contract(user, contract_data)

    # Send invitation email
    from app.core.config import settings as _settings
    invite_url = f"{_settings.frontend_url}/invite/{invitation.token}"
    invitee_name = payload["keeper_name"] if invitation.invitee_role.value == "keeper" else (payload.get("tc_name") or "")
    try:
        EmailService().send_invitation(
            invitee_email=invitation.invitee_email,
            invitee_name=invitee_name,
            maker_name=full_name,
            invite_url=invite_url,
            role=invitation.invitee_role.value,
        )
    except Exception as exc:
        logger.error("send_invitation failed for %s: %s", invitation.invitee_email, exc, exc_info=True)

    session_jwt = create_session_token(str(user.id), user.email, "login")
    return CompleteRegistrationResponse(
        session_token=session_jwt,
        contract_id=str(contract.id),
        full_name=full_name,
    )


# ── Keeper account creation + email verification ─────────────────────────────

class KeeperBeginBody(BaseModel):
    invite_token: str
    first_name: str
    middle_name: str | None = None
    last_name: str
    email: EmailStr


class KeeperBeginResponse(BaseModel):
    ok: bool
    email: str


class KeeperVerifyResponse(BaseModel):
    session_token: str
    contract_id: str
    keeper_name: str
    maker_name: str


@router.post("/keeper-begin", response_model=KeeperBeginResponse)
async def keeper_begin(
    body: KeeperBeginBody,
    db: AsyncSession = Depends(get_db),
) -> KeeperBeginResponse:
    from sqlalchemy import select as _select
    from app.models.invitation_token import InvitationToken, InviteeRole

    result = await db.execute(
        _select(InvitationToken).where(
            InvitationToken.token == body.invite_token,
            InvitationToken.invitee_role == InviteeRole.KEEPER,
        )
    )
    invitation = result.scalar_one_or_none()
    if not invitation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invitation not found")

    payload = {
        "first_name": body.first_name,
        "last_name": body.last_name,
        "middle_name": body.middle_name,
        "keeper_email": str(body.email),
        "invite_token": body.invite_token,
        "role": "keeper",
    }
    jwt_token = create_email_verification_token(payload)
    verify_url = f"{settings.frontend_url}/keeper/verify?token={jwt_token}"
    try:
        EmailService().send_keeper_verification(str(body.email), verify_url)
    except Exception as exc:
        logger.error("keeper_begin email send failed for %s: %s", body.email, exc, exc_info=True)
    return KeeperBeginResponse(ok=True, email=str(body.email))


@router.get("/keeper-verify", response_model=KeeperVerifyResponse)
async def keeper_verify(
    token: str,
    db: AsyncSession = Depends(get_db),
) -> KeeperVerifyResponse:
    import uuid as _uuid
    from sqlalchemy import select as _select
    from app.core.security import create_session_token
    from app.models.invitation_token import InvitationToken
    from app.models.contract import Contract
    from app.models.user import User

    payload = decode_email_verification_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

    first_name = payload.get("first_name", "")
    last_name = payload.get("last_name", "")
    middle_name = payload.get("middle_name")
    keeper_email = str(payload.get("keeper_email", "")).strip().lower()
    invite_token = payload.get("invite_token", "")

    parts = [p.strip() for p in [first_name, middle_name, last_name] if p and p.strip()]
    full_name = " ".join(parts)

    inv_result = await db.execute(
        _select(InvitationToken).where(InvitationToken.token == invite_token)
    )
    invitation = inv_result.scalar_one_or_none()
    if not invitation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invitation not found")

    user_result = await db.execute(_select(User).where(User.email == keeper_email))
    user = user_result.scalar_one_or_none()
    if not user:
        uid = _uuid.uuid4()
        user = User(
            id=uid,
            cognito_sub=f"email-{uid}",
            email=keeper_email,
            full_name=full_name,
            email_verified=True,
        )
        db.add(user)
    else:
        user.full_name = full_name
        user.email_verified = True
    await db.flush()

    contract_result = await db.execute(
        _select(Contract).where(Contract.id == invitation.contract_id)
    )
    contract = contract_result.scalar_one_or_none()
    if not contract:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contract not found")

    maker_result = await db.execute(_select(User).where(User.id == contract.maker_id))
    maker = maker_result.scalar_one_or_none()
    maker_name = maker.full_name if maker else "the Maker"

    await db.commit()

    session_jwt = create_session_token(str(user.id), user.email, "login")
    return KeeperVerifyResponse(
        session_token=session_jwt,
        contract_id=str(invitation.contract_id),
        keeper_name=full_name,
        maker_name=maker_name,
    )


# ── Magic-link (passwordless login) ─────────────────────────────────────────

class RequestMagicLinkBody(BaseModel):
    email: EmailStr
    mode: str = "login"  # "login" | "tc"


class RequestMagicLinkResponse(BaseModel):
    detail: str


class VerifyMagicLinkResponse(BaseModel):
    session_token: str
    role: str
    maker_stage: str | None
    contract_id: str | None
    full_name: str


@router.post("/request-magic-link", response_model=RequestMagicLinkResponse)
async def request_magic_link_endpoint(
    body: RequestMagicLinkBody,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> RequestMagicLinkResponse:
    await request_magic_link(str(body.email), body.mode, _client_ip(request), db)
    return RequestMagicLinkResponse(detail="Check your inbox.")


@router.get("/magic-link/verify", response_model=VerifyMagicLinkResponse)
async def verify_magic_link_endpoint(
    token: str,
    db: AsyncSession = Depends(get_db),
) -> VerifyMagicLinkResponse:
    result = await verify_magic_link(token, db)
    return VerifyMagicLinkResponse(**result)


# ── Cognito sync + me ────────────────────────────────────────────────────────

@router.post("/sync", response_model=UserRead)
async def sync_user(
    body: UserSyncRequest,
    claims: dict = Depends(get_verified_claims),
    db: AsyncSession = Depends(get_db),
) -> UserRead:
    sub = claims.get("sub")
    email = claims.get("email", "")
    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    svc = AuthService(db)
    user, _ = await svc.get_or_create_user(sub, email, body.full_name)
    return UserRead.model_validate(user)


@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)) -> UserRead:
    return UserRead.model_validate(current_user)
