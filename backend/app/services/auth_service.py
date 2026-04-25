import logging

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User

logger = logging.getLogger(__name__)


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_or_create_user(self, cognito_sub: str, email: str, full_name: str) -> tuple[User, bool]:
        result = await self.db.execute(select(User).where(User.cognito_sub == cognito_sub))
        user = result.scalar_one_or_none()
        created = False
        if user is None:
            # Check for email collision (different sub, same email)
            email_result = await self.db.execute(select(User).where(User.email == email))
            if email_result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="An account with this email already exists. Try logging in instead.",
                )
            user = User(cognito_sub=cognito_sub, email=email, full_name=full_name, email_verified=True)
            self.db.add(user)
            try:
                await self.db.commit()
                await self.db.refresh(user)
            except IntegrityError:
                await self.db.rollback()
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="An account with this email already exists. Try logging in instead.",
                )
            created = True
        elif user.full_name != full_name:
            user.full_name = full_name
            await self.db.commit()
        return user, created
