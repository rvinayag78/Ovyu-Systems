from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

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
from app.services.contract_service import ContractService
from app.services.email_service import EmailService

router = APIRouter()


@router.post("/begin-registration", response_model=BeginRegistrationResponse)
async def begin_registration(body: BeginRegistrationRequest) -> BeginRegistrationResponse:
    token = create_email_verification_token(body.model_dump(mode="json"))
    verify_url = f"{settings.frontend_url}/verify?token={token}"
    email_svc = EmailService()
    email_svc.send_maker_verification(str(body.maker_email), verify_url)
    return BeginRegistrationResponse(detail="Verification email sent")


@router.get("/verify-token", response_model=VerifyTokenResponse)
async def verify_token(token: str) -> VerifyTokenResponse:
    payload = decode_email_verification_token(token)
    if payload is None:
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
