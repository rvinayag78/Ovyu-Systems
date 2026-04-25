from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from app.core.config import settings

ALGORITHM = "HS256"


def create_email_verification_token(data: dict, expiry_hours: int = 24) -> str:
    payload = {
        **data,
        "exp": datetime.now(timezone.utc) + timedelta(hours=expiry_hours),
        "iat": datetime.now(timezone.utc),
        "purpose": "email_verify",
    }
    return jwt.encode(payload, settings.email_verification_secret, algorithm=ALGORITHM)


def decode_email_verification_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.email_verification_secret, algorithms=[ALGORITHM])
        if payload.get("purpose") != "email_verify":
            return {}
        return payload
    except JWTError:
        return {}


def create_session_token(user_id: str, email: str, role: str, expiry_hours: int = 72) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=expiry_hours),
        "iat": datetime.now(timezone.utc),
        "purpose": "session",
    }
    return jwt.encode(payload, settings.email_verification_secret, algorithm=ALGORITHM)


def decode_session_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, settings.email_verification_secret, algorithms=[ALGORITHM])
        if payload.get("purpose") != "session":
            return None
        return payload
    except JWTError:
        return None
