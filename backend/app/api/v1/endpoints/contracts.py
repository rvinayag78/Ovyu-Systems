import logging
from uuid import UUID

from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.contract import (
    AcceptInvitationRequest,
    ContractCreate,
    ContractRead,
    InvitationPreview,
    SignContractRequest,
)
from app.services.contract_service import ContractService
from app.services.email_service import EmailService
from app.core.config import settings

router = APIRouter()


def _get_client_ip(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@router.post("", response_model=ContractRead, status_code=201)
async def create_contract(
    body: ContractCreate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ContractRead:
    svc = ContractService(db)
    contract, invitation = await svc.create_contract(current_user, body)

    invite_url = f"{settings.frontend_url}/invite/{invitation.token}"
    email_svc = EmailService()
    invitee_email = invitation.invitee_email
    invitee_name = body.keeper_name if invitation.invitee_role.value == "keeper" else (body.tc_name or "")
    try:
        email_svc.send_invitation(
            invitee_email=invitee_email,
            invitee_name=invitee_name,
            maker_name=current_user.full_name,
            invite_url=invite_url,
            role=invitation.invitee_role.value,
        )
    except Exception as exc:
        logger.error("send_invitation failed for %s: %s", invitee_email, exc, exc_info=True)
    return ContractRead.model_validate(contract)


@router.get("", response_model=list[ContractRead])
async def list_my_contracts(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[ContractRead]:
    from sqlalchemy import select as sa_select
    from app.models.invitation_token import InvitationToken
    from app.models.contract import ContractStatus as CS
    svc = ContractService(db)
    pairs = await svc.list_my_contracts(current_user)

    # Batch-load all unique maker User records
    maker_ids = list({c.maker_id for c, _ in pairs})
    makers: dict = {}
    if maker_ids:
        result = await db.execute(sa_select(User).where(User.id.in_(maker_ids)))
        for u in result.scalars().all():
            makers[u.id] = u.full_name

    # Load invite tokens for PENDING_KEEPER contracts where user is the keeper
    pending_contract_ids = [c.id for c, role in pairs if role == "keeper" and c.status == CS.PENDING_KEEPER]
    invite_tokens: dict = {}
    if pending_contract_ids:
        inv_result = await db.execute(
            sa_select(InvitationToken).where(
                InvitationToken.contract_id.in_(pending_contract_ids),
                InvitationToken.used == False,  # noqa: E712
            )
        )
        for inv in inv_result.scalars().all():
            invite_tokens[inv.contract_id] = inv.token

    out = []
    for contract, role in pairs:
        data = ContractRead.model_validate(contract)
        updates: dict = {"my_role": role, "maker_name": makers.get(contract.maker_id)}
        if contract.id in invite_tokens:
            updates["invite_token"] = invite_tokens[contract.id]
        out.append(data.model_copy(update=updates))
    return out


@router.get("/{contract_id}", response_model=ContractRead)
async def get_contract(
    contract_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ContractRead:
    from sqlalchemy import select as sa_select
    svc = ContractService(db)
    contract = await svc.get_contract(contract_id, current_user)
    data = ContractRead.model_validate(contract)
    maker_result = await db.execute(sa_select(User).where(User.id == contract.maker_id))
    maker = maker_result.scalar_one_or_none()
    return data.model_copy(update={"maker_name": maker.full_name if maker else None})


@router.post("/{contract_id}/sign", response_model=ContractRead)
async def sign_contract(
    contract_id: UUID,
    body: SignContractRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ContractRead:
    svc = ContractService(db)
    contract = await svc.sign_contract(
        contract_id=contract_id,
        maker=current_user,
        ip_address=_get_client_ip(request),
        typed_name=body.typed_name,
        user_agent=request.headers.get("user-agent", ""),
    )
    return ContractRead.model_validate(contract)


@router.get("/invite/{token}", response_model=InvitationPreview)
async def get_invite_preview(
    token: str,
    db: AsyncSession = Depends(get_db),
) -> InvitationPreview:
    svc = ContractService(db)
    preview = await svc.get_invitation_preview(token)
    return InvitationPreview(**preview)


@router.post("/invite/{token}/accept", response_model=ContractRead)
async def accept_invitation(
    token: str,
    body: AcceptInvitationRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> ContractRead:
    from sqlalchemy import select as sa_select
    from app.models.user import User as UserModel
    from app.models.invitation_token import InvitationToken as InvitationTokenModel, InviteeRole as InviteeRoleModel

    # Capture invitee email + role before the token is consumed
    inv_result = await db.execute(sa_select(InvitationTokenModel).where(InvitationTokenModel.token == token))
    invitation_record = inv_result.scalar_one_or_none()
    invitee_email = invitation_record.invitee_email if invitation_record else None
    is_tc = invitation_record and invitation_record.invitee_role == InviteeRoleModel.TC

    svc = ContractService(db)
    contract = await svc.accept_invitation(
        token_str=token,
        accepting_user=None,
        ip_address=_get_client_ip(request),
        typed_name=body.typed_name,
        user_agent=request.headers.get("user-agent", ""),
    )
    maker_result = await db.execute(sa_select(UserModel).where(UserModel.id == contract.maker_id))
    maker = maker_result.scalar_one_or_none()
    if maker:
        signer_name = body.typed_name.strip()
        try:
            EmailService().send_contract_locked(maker.email, signer_name, is_tc=is_tc)
        except Exception as exc:
            logger.error("send_contract_locked failed for %s: %s", maker.email, exc, exc_info=True)
        if is_tc and invitee_email:
            try:
                EmailService().send_tc_signed_confirmation(
                    tc_email=invitee_email,
                    maker_name=maker.full_name,
                    keeper_name=contract.keeper_name or "their Keeper",
                )
            except Exception as exc:
                logger.error("send_tc_signed_confirmation failed for %s: %s", invitee_email, exc, exc_info=True)
        if not is_tc and invitee_email:
            try:
                from app.core.config import settings as _settings
                EmailService().send_keeper_signed_confirmation(
                    keeper_email=invitee_email,
                    maker_name=maker.full_name,
                    login_url=f"{_settings.frontend_url}/login",
                )
            except Exception as exc:
                logger.error("send_keeper_signed_confirmation failed for %s: %s", invitee_email, exc, exc_info=True)
    return ContractRead.model_validate(contract)
