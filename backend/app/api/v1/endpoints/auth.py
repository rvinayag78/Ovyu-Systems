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
