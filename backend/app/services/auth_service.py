from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_or_create_user(self, cognito_sub: str, email: str, full_name: str) -> tuple[User, bool]:
        result = await self.db.execute(select(User).where(User.cognito_sub == cognito_sub))
        user = result.scalar_one_or_none()
        created = False
        if user is None:
            user = User(cognito_sub=cognito_sub, email=email, full_name=full_name, email_verified=True)
            self.db.add(user)
            await self.db.commit()
            await self.db.refresh(user)
            created = True
        elif user.full_name != full_name:
            user.full_name = full_name
            await self.db.commit()
        return user, created
