"""
Test-only endpoints — active ONLY when TESTING=true env var is set.
Never mount this router in production.

Endpoints:
  POST /test/email-verify-token  → create email-verification JWT (no email sent)
  POST /test/magic-token         → create magic-link token in DB, return raw token
  GET  /test/invite-token        → return latest invite token for an invitee email
"""
import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.security import create_email_verification_token
from app.models.contract import Contract, ContractStatus
from app.models.invitation_token import InvitationToken
from app.models.magic_link_token import MAGIC_LINK_TTL_MINUTES, MagicLinkToken
from app.models.user import User
from app.schemas.auth import BeginRegistrationRequest

router = APIRouter()


def _guard() -> None:
    if not settings.testing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Not found",
        )


# ── Email verification token ─────────────────────────────────────────────────

class EmailVerifyTokenResponse(BaseModel):
    token: str


@router.post("/email-verify-token", response_model=EmailVerifyTokenResponse)
async def get_email_verify_token(body: BeginRegistrationRequest) -> EmailVerifyTokenResponse:
    """Return the JWT that /auth/begin-registration would email, without sending it."""
    _guard()
    token = create_email_verification_token(body.model_dump(mode="json"))
    return EmailVerifyTokenResponse(token=token)


# ── Magic-link token ─────────────────────────────────────────────────────────

class MagicTokenRequest(BaseModel):
    email: EmailStr
    mode: str = "login"


class MagicTokenResponse(BaseModel):
    token: str


@router.post("/magic-token", response_model=MagicTokenResponse)
async def get_magic_token(
    body: MagicTokenRequest,
    db: AsyncSession = Depends(get_db),
) -> MagicTokenResponse:
    """Create a magic-link token in the DB and return the raw token string."""
    _guard()
    raw = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw.encode()).hexdigest()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=MAGIC_LINK_TTL_MINUTES)

    db.add(MagicLinkToken(
        email=str(body.email).strip().lower(),
        mode=body.mode,
        token_hash=token_hash,
        expires_at=expires_at,
        ip_address="test",
    ))
    await db.commit()
    return MagicTokenResponse(token=raw)


# ── Invitation token ─────────────────────────────────────────────────────────

class InviteTokenResponse(BaseModel):
    token: str


@router.get("/invite-token", response_model=InviteTokenResponse)
async def get_invite_token(
    email: str,
    db: AsyncSession = Depends(get_db),
) -> InviteTokenResponse:
    """Return the most recent raw invitation token for the given invitee email."""
    _guard()
    result = await db.execute(
        select(InvitationToken)
        .where(InvitationToken.invitee_email == email.strip().lower())
        .where(InvitationToken.used == False)  # noqa: E712
        .order_by(InvitationToken.created_at.desc())
        .limit(1)
    )
    row = result.scalar_one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail=f"No pending invite for {email}")
    return InviteTokenResponse(token=row.token)


# ── Maker duplicate cleanup ───────────────────────────────────────────────────

class CleanupRequest(BaseModel):
    maker_email: EmailStr


class CleanupResponse(BaseModel):
    withdrawn: int
    kept_contract_id: str | None


@router.post("/cleanup-maker-contracts", response_model=CleanupResponse)
async def cleanup_maker_contracts(
    body: CleanupRequest,
    db: AsyncSession = Depends(get_db),
) -> CleanupResponse:
    """Withdraw all but the most recent active contract for a maker email. Test use only."""
    _guard()
    from sqlalchemy import select as sa_select

    user_result = await db.execute(sa_select(User).where(User.email == str(body.maker_email).strip().lower()))
    user = user_result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    result = await db.execute(
        sa_select(Contract).where(
            Contract.maker_id == user.id,
            Contract.status.not_in([ContractStatus.WITHDRAWN_BY_MAKER, ContractStatus.WITHDRAWN_BY_KEEPER]),
        ).order_by(Contract.created_at.desc())
    )
    active = result.scalars().all()

    if not active:
        return CleanupResponse(withdrawn=0, kept_contract_id=None)

    keep = active[0]
    withdrawn = 0
    for c in active[1:]:
        c.status = ContractStatus.WITHDRAWN_BY_MAKER
        withdrawn += 1

    await db.commit()
    return CleanupResponse(withdrawn=withdrawn, kept_contract_id=str(keep.id))
