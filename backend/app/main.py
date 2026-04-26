import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from mangum import Mangum

from app.api.v1 import router as v1_router
from app.core.config import settings
from app.core.logging import configure_logging

configure_logging(level="DEBUG" if settings.debug else "INFO")
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ovyu API",
    version="1.0.0",
    docs_url="/docs" if settings.debug else None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_logger(request: Request, call_next):
    import time
    start = time.perf_counter()
    response = await call_next(request)
    ms = round((time.perf_counter() - start) * 1000)
    level = logging.ERROR if response.status_code >= 500 else (logging.WARNING if response.status_code >= 400 else logging.INFO)
    logger.log(level, "http", extra={
        "method": request.method,
        "path": request.url.path,
        "status": response.status_code,
        "ms": ms,
    })
    return response


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error(
        "Unhandled error",
        exc_info=exc,
        extra={"method": request.method, "path": request.url.path},
    )
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


app.include_router(v1_router, prefix="/api/v1")

handler = Mangum(app, lifespan="off")
