from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User

bearer = HTTPBearer(auto_error=False)


async def get_verified_claims(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
) -> dict:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    from app.core.security import decode_session_token
    # Try our own session JWT first
    payload = decode_session_token(credentials.credentials)
    if payload:
        return payload
    # Fall back to Cognito JWT (signature not verified in dev — replace with JWKS in prod)
    try:
        payload = jwt.decode(
            credentials.credentials,
            options={"verify_signature": False},
        )
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


async def get_current_user(
    claims: dict = Depends(get_verified_claims),
    db: AsyncSession = Depends(get_db),
) -> User:
    sub = claims.get("sub")
    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    result = await db.execute(select(User).where(User.cognito_sub == sub))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user
