import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr

from app.models.contract import ContractPath, ContractStatus


class ContractCreate(BaseModel):
    keeper_name: str
    keeper_email: EmailStr
    relationship: str | None = None
    path: ContractPath
    tc_name: str | None = None
    tc_email: EmailStr | None = None


class ContractRead(BaseModel):
    id: uuid.UUID
    path: ContractPath
    status: ContractStatus
    maker_signed_at: datetime | None = None
    locked_at: datetime | None = None
    keeper_name: str | None = None
    tc_name: str | None = None
    relationship: str | None = None

    model_config = {"from_attributes": True}


class SignContractRequest(BaseModel):
    typed_name: str


class AcceptInvitationRequest(BaseModel):
    typed_name: str


class InvitationPreview(BaseModel):
    invitee_role: str
    maker_name: str | None
    keeper_name: str | None
    tc_name: str | None
    relationship: str | None
    contract_id: uuid.UUID
