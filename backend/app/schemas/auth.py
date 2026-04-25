import uuid

from pydantic import BaseModel, EmailStr

from app.models.contract import ContractPath


class BeginRegistrationRequest(BaseModel):
    first_name: str
    last_name: str
    maker_email: EmailStr
    keeper_name: str
    keeper_email: EmailStr
    relationship: str
    path: ContractPath
    tc_name: str | None = None
    tc_email: EmailStr | None = None


class BeginRegistrationResponse(BaseModel):
    detail: str


class VerifyTokenResponse(BaseModel):
    first_name: str
    last_name: str
    maker_email: str
    keeper_name: str
    keeper_email: str
    relationship: str
    path: str
    tc_name: str | None = None
    tc_email: str | None = None


class UserSyncRequest(BaseModel):
    full_name: str


class UserRead(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str

    model_config = {"from_attributes": True}
