from fastapi import APIRouter

from app.api.v1.endpoints import auth, contracts, health, upload
from app.core.config import settings

router = APIRouter()

router.include_router(health.router, prefix="/health", tags=["health"])
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(contracts.router, prefix="/contracts", tags=["contracts"])
router.include_router(upload.router, tags=["upload"])

if settings.testing:
    from app.api.v1.endpoints import testing
    router.include_router(testing.router, prefix="/test", tags=["test"])
