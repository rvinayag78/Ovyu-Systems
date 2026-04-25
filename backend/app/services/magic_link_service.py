import uuid
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import create_session_token
from app.models.contract import Contract, ContractStatus
from app.models.invitation_token import InvitationToken, InviteeRole
from app.models.magic_link_token import (
    MAGIC_LINK_TTL_MINUTES,
    AuthAttemptUnknown,
    MagicLinkToken,
)
from app.models.user import User

RATE_LIMIT_PER_HOUR = 5


class MakerStage:
    NO_CONTRACT = "no_contract"
    UNSIGNED = "unsigned"
    AWAITING_OTHER = "awaiting_other"
    READY_TO_UPLOAD = "ready_to_upload"
    ACTIVE = "active"


async def get_maker_stage(user: User, db: AsyncSession) -> tuple[str, uuid.UUID | None]:
    result = await db.execute(
        select(Contract)
        .where(Contract.maker_id == user.id)
        .order_by(Contract.created_at.desc())
        .limit(1)
    )
    contract = result.scalar_one_or_none()
    if contract is None:
        return MakerStage.NO_CONTRACT, None
    if contract.maker_signed_at is None:
        return MakerStage.UNSIGNED, contract.id
    if contract.status in (ContractStatus.PENDING_KEEPER, ContractStatus.PENDING_TC):
        return MakerStage.AWAITING_OTHER, contract.id
    if contract.status == ContractStatus.LOCKED:
        return MakerStage.READY_TO_UPLOAD, contract.id
    return MakerStage.AWAITING_OTHER, contract.id


async def _check_rate_limit(ip: str, db: AsyncSession) -> None:
    cutoff = datetime.now(timezone.utc) - timedelta(hours=1)
    result = await db.execute(
        select(func.count()).select_from(AuthAttemptUnknown).where(
            AuthAttemptUnknown.ip_address == ip,
            AuthAttemptUnknown.attempted_at >= cutoff,
        )
    )
    count = result.scalar_one()
    if count >= RATE_LIMIT_PER_HOUR:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many attempts. Try again later.")


async def request_magic_link(email: str, mode: str, ip: str, db: AsyncSession) -> None:
    """Send a magic-link email. Always shows 'check your inbox' to caller."""
    email = email.strip().lower()

    # Find user
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if user is None:
        # Anti-enumeration: log the attempt, do not send, do not reveal
        await _check_rate_limit(ip, db)
        attempt = AuthAttemptUnknown(ip_address=ip)
        db.add(attempt)
        await db.commit()
        return

    # For TC mode: verify the email is a named TC on an active contract
    if mode == "tc":
        tc_result = await db.execute(
            select(Contract).where(
                Contract.tc_email == email,
                Contract.status.in_([
                    ContractStatus.PENDING_TC,
                    ContractStatus.LOCKED,
                    ContractStatus.TRANSFER_PENDING,
                ]),
            )
        )
        if tc_result.scalar_one_or_none() is None:
            # Email exists as user but not as TC — still anti-enumerate
            return

    raw = MagicLinkToken.make_token()
    token = MagicLinkToken(
        email=email,
        mode=mode,
        token_hash=MagicLinkToken.hash_token(raw),
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=MAGIC_LINK_TTL_MINUTES),
        ip_address=ip,
    )
    db.add(token)
    await db.commit()

    from app.services.email_service import EmailService
    link_url = f"{settings.frontend_url}/magic-link/verify?token={raw}"
    EmailService().send_magic_link(email, link_url, mode)


async def verify_magic_link(raw_token: str, db: AsyncSession) -> dict:
    token_hash = MagicLinkToken.hash_token(raw_token)
    result = await db.execute(
        select(MagicLinkToken).where(MagicLinkToken.token_hash == token_hash)
    )
    token = result.scalar_one_or_none()

    if token is None or token.used:
        raise HTTPException(status_code=404, detail="Invalid or expired link")
    if token.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=410, detail="This link has expired. Request a new one.")

    user_result = await db.execute(select(User).where(User.email == token.email))
    user = user_result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="Account not found")

    token.used = True
    await db.commit()

    session_jwt = create_session_token(str(user.id), user.email, token.mode)

    if token.mode == "tc":
        return {
            "session_token": session_jwt,
            "role": "tc",
            "maker_stage": None,
            "contract_id": None,
        }

    # Maker flow: derive stage
    maker_stage, contract_id = await get_maker_stage(user, db)
    return {
        "session_token": session_jwt,
        "role": "maker",
        "maker_stage": maker_stage,
        "contract_id": str(contract_id) if contract_id else None,
    }
