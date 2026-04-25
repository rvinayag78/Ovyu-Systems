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
