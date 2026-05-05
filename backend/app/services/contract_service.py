import secrets
import unicodedata
from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.contract import Contract, ContractPath, ContractStatus
from app.models.invitation_token import InvitationToken, InviteeRole
from app.models.signature import Signature, SignerRole
from app.models.user import User
from app.schemas.contract import ContractCreate

INVITATION_TTL_DAYS = 7


def _normalize(name: str) -> str:
    return unicodedata.normalize("NFC", name.strip().lower())


class ContractService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_contract(self, maker: User, data: ContractCreate) -> tuple[Contract, InvitationToken]:
        if data.path == ContractPath.PRIVATE and not data.tc_email:
            raise HTTPException(status_code=422, detail="tc_email required for private path")

        initial_status = ContractStatus.PENDING_KEEPER if data.path == ContractPath.AWARE else ContractStatus.PENDING_TC

        contract = Contract(
            maker_id=maker.id,
            keeper_name=data.keeper_name,
            keeper_email=str(data.keeper_email),
            relationship=data.relationship,
            tc_name=data.tc_name,
            tc_email=str(data.tc_email) if data.tc_email else None,
            path=data.path,
            status=initial_status,
        )
        self.db.add(contract)
        await self.db.flush()

        invitee_email = str(data.keeper_email) if data.path == ContractPath.AWARE else str(data.tc_email)
        invitee_role = InviteeRole.KEEPER if data.path == ContractPath.AWARE else InviteeRole.TC

        raw_token = secrets.token_urlsafe(48)
        invitation = InvitationToken(
            contract_id=contract.id,
            token=raw_token,
            token_hash=InvitationToken.hash_token(raw_token),
            invitee_email=invitee_email,
            invitee_role=invitee_role,
            expires_at=datetime.now(timezone.utc) + timedelta(days=INVITATION_TTL_DAYS),
        )
        self.db.add(invitation)
        await self.db.commit()
        await self.db.refresh(contract)
        await self.db.refresh(invitation)
        return contract, invitation

    async def sign_contract(self, contract_id: UUID, maker: User, ip_address: str, typed_name: str, user_agent: str = "") -> Contract:
        contract = await self._get_or_404(contract_id)
        if contract.maker_id != maker.id:
            raise HTTPException(status_code=403, detail="Not your contract")

        if _normalize(typed_name) != _normalize(maker.full_name):
            raise HTTPException(status_code=422, detail="Typed name does not match your account name.")

        existing = await self.db.execute(
            select(Signature).where(Signature.contract_id == contract_id, Signature.role == SignerRole.MAKER)
        )
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=409, detail="Already signed")

        sig = Signature(
            contract_id=contract_id, user_id=maker.id, role=SignerRole.MAKER,
            typed_name=typed_name.strip(), matched_against=maker.full_name,
            ip_address=ip_address, user_agent=user_agent,
        )
        self.db.add(sig)
        contract.maker_signed_at = datetime.now(timezone.utc)
        contract.pending_expires_at = datetime.now(timezone.utc) + timedelta(days=365)
        await self.db.commit()
        await self.db.refresh(contract)
        return contract

    async def accept_invitation(self, token_str: str, accepting_user: User | None, ip_address: str, typed_name: str, user_agent: str = "") -> Contract:
        result = await self.db.execute(select(InvitationToken).where(InvitationToken.token == token_str))
        invitation = result.scalar_one_or_none()

        if invitation is None or invitation.used:
            raise HTTPException(status_code=404, detail="Invalid or expired invitation")
        if invitation.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
            raise HTTPException(status_code=410, detail="Invitation has expired")

        contract = await self._get_or_404(invitation.contract_id)

        if not contract.maker_signed_at:
            raise HTTPException(status_code=409, detail="Maker has not signed this contract yet.")

        is_keeper = invitation.invitee_role == InviteeRole.KEEPER
        canonical = contract.keeper_name if is_keeper else contract.tc_name

        if canonical and _normalize(typed_name) != _normalize(canonical):
            raise HTTPException(status_code=422, detail="Typed name does not match.")

        # Create a User record for keepers and TCs so they can log in via magic link later
        if accepting_user is None:
            role_label = "keeper" if is_keeper else "tc"
            full_name = (contract.keeper_name if is_keeper else contract.tc_name) or typed_name.strip()
            existing = await self.db.execute(select(User).where(User.email == invitation.invitee_email))
            invitee_user = existing.scalar_one_or_none()
            if invitee_user is None:
                invitee_user = User(
                    cognito_sub=f"{role_label}:{invitation.invitee_email}",
                    email=invitation.invitee_email,
                    full_name=full_name,
                    email_verified=True,
                )
                self.db.add(invitee_user)
                await self.db.flush()
            accepting_user = invitee_user

        role = SignerRole.KEEPER if is_keeper else SignerRole.TC
        sig = Signature(
            contract_id=contract.id, user_id=accepting_user.id if accepting_user else None,
            role=role, typed_name=typed_name.strip(), matched_against=canonical,
            ip_address=ip_address, user_agent=user_agent,
        )
        self.db.add(sig)

        if is_keeper:
            contract.keeper_id = accepting_user.id if accepting_user else None
        else:
            contract.tc_id = accepting_user.id if accepting_user else None

        contract.status = ContractStatus.LOCKED
        contract.locked_at = datetime.now(timezone.utc)
        contract.pending_expires_at = None
        now = datetime.now(timezone.utc)
        invitation.used = True
        invitation.used_at = now
        invitation.consumed_at = now

        await self.db.commit()
        await self.db.refresh(contract)
        return contract

    async def get_invitation_preview(self, token_str: str) -> dict:
        result = await self.db.execute(select(InvitationToken).where(InvitationToken.token == token_str))
        invitation = result.scalar_one_or_none()

        if invitation is None or invitation.used:
            raise HTTPException(status_code=404, detail="Invalid or expired invitation")
        if invitation.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
            raise HTTPException(status_code=410, detail="Invitation has expired")

        contract = await self._get_or_404(invitation.contract_id)
        maker_result = await self.db.execute(select(User).where(User.id == contract.maker_id))
        maker = maker_result.scalar_one_or_none()

        return {
            "invitee_role": invitation.invitee_role.value,
            "maker_name": maker.full_name if maker else None,
            "keeper_name": contract.keeper_name,
            "tc_name": contract.tc_name,
            "relationship": contract.relationship,
            "contract_id": invitation.contract_id,
        }

    async def list_my_contracts(self, user: User) -> list[tuple[Contract, str]]:
        """Return all active contracts where user is maker, keeper, or TC, with their role for each."""
        from sqlalchemy import and_
        result = await self.db.execute(
            select(Contract).where(
                or_(
                    Contract.maker_id == user.id,
                    Contract.keeper_id == user.id,
                    Contract.tc_id == user.id,
                    and_(
                        Contract.keeper_email == user.email,
                        Contract.status == ContractStatus.PENDING_KEEPER,
                    ),
                ),
                Contract.status.not_in([ContractStatus.WITHDRAWN_BY_MAKER, ContractStatus.WITHDRAWN_BY_KEEPER]),
            ).order_by(Contract.created_at.desc())
        )
        contracts = result.scalars().all()
        seen = set()
        out = []
        for c in contracts:
            if c.id in seen:
                continue
            seen.add(c.id)
            if c.maker_id == user.id:
                role = "maker"
            elif c.keeper_id == user.id:
                role = "keeper"
            elif c.tc_id == user.id:
                role = "tc"
            elif c.keeper_email == user.email:
                role = "keeper"
            else:
                role = "tc"
            out.append((c, role))
        return out

    async def get_contract(self, contract_id: UUID, requesting_user: User) -> Contract:
        contract = await self._get_or_404(contract_id)
        if requesting_user.id not in (contract.maker_id, contract.keeper_id, contract.tc_id):
            raise HTTPException(status_code=403, detail="Access denied")
        return contract

    async def _get_or_404(self, contract_id: UUID) -> Contract:
        result = await self.db.execute(select(Contract).where(Contract.id == contract_id))
        contract = result.scalar_one_or_none()
        if contract is None:
            raise HTTPException(status_code=404, detail="Contract not found")
        return contract
