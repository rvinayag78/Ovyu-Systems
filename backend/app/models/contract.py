import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class ContractStatus(str, enum.Enum):
    PENDING_KEEPER = "PENDING_KEEPER"
    PENDING_TC = "PENDING_TC"
    LOCKED = "LOCKED"
    EXPIRED = "EXPIRED"
    SUSPENDED_BY_MAKER = "SUSPENDED_BY_MAKER"
    WITHDRAWN_BY_MAKER = "WITHDRAWN_BY_MAKER"
    WITHDRAWN_BY_KEEPER = "WITHDRAWN_BY_KEEPER"
    TRANSFER_PENDING = "TRANSFER_PENDING"
    TRANSFER_COMPLETE = "TRANSFER_COMPLETE"


class ContractPath(str, enum.Enum):
    AWARE = "aware"
    PRIVATE = "private"


class Contract(Base):
    __tablename__ = "contracts"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    maker_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    keeper_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    tc_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    keeper_name: Mapped[str] = mapped_column(String(256))
    keeper_email: Mapped[str] = mapped_column(String(320))
    relationship: Mapped[str | None] = mapped_column(String(100), nullable=True)
    tc_name: Mapped[str | None] = mapped_column(String(256), nullable=True)
    tc_email: Mapped[str | None] = mapped_column(String(320), nullable=True)

    path: Mapped[ContractPath] = mapped_column(Enum(ContractPath))
    status: Mapped[ContractStatus] = mapped_column(Enum(ContractStatus), index=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    maker_signed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    locked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    pending_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
