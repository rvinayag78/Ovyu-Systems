import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Upload(Base):
    __tablename__ = "uploads"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contract_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("contracts.id", ondelete="CASCADE"), unique=True)
    maker_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    voice_status: Mapped[str] = mapped_column(String(20), default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class VoiceRecording(Base):
    __tablename__ = "voice_recordings"
    __table_args__ = (UniqueConstraint("upload_id", "type", name="uq_voice_recordings_upload_type"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    upload_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("uploads.id", ondelete="CASCADE"))
    type: Mapped[str] = mapped_column(String(20))  # 'name' | 'profile'
    s3_key: Mapped[str] = mapped_column(Text())
    duration_s: Mapped[float | None] = mapped_column(Float(), nullable=True)
    transcript: Mapped[str | None] = mapped_column(Text(), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending | processing | complete
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Dimension(Base):
    __tablename__ = "dimensions"
    __table_args__ = (UniqueConstraint("upload_id", "slug", name="uq_dimensions_upload_slug"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    upload_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("uploads.id", ondelete="CASCADE"))
    slug: Mapped[str] = mapped_column(String(50))
    structured: Mapped[dict | None] = mapped_column(JSON(), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class DimensionEntry(Base):
    __tablename__ = "dimension_entries"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dimension_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("dimensions.id", ondelete="CASCADE"))
    title: Mapped[str | None] = mapped_column(Text(), nullable=True)
    body: Mapped[str] = mapped_column(Text())
    entry_type: Mapped[str] = mapped_column(String(10), default="text")
    tags: Mapped[dict | None] = mapped_column(JSON(), nullable=True)
    media_s3_key: Mapped[str | None] = mapped_column(Text(), nullable=True)
    duration_s: Mapped[int | None] = mapped_column(Integer(), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Person(Base):
    __tablename__ = "people"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    upload_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("uploads.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(Text())
    role: Mapped[str | None] = mapped_column(Text(), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text(), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Year(Base):
    __tablename__ = "years"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    upload_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("uploads.id", ondelete="CASCADE"))
    year: Mapped[int | None] = mapped_column(Integer(), nullable=True)
    title: Mapped[str] = mapped_column(Text())
    body: Mapped[str | None] = mapped_column(Text(), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Place(Base):
    __tablename__ = "places"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    upload_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("uploads.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(Text())
    why: Mapped[str | None] = mapped_column(Text(), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class KeeperMessage(Base):
    __tablename__ = "keeper_messages"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contract_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("contracts.id", ondelete="CASCADE"))
    type: Mapped[str] = mapped_column(String(20))  # 'welcome' | 'for_when'
    trigger: Mapped[str | None] = mapped_column(Text(), nullable=True)
    body: Mapped[str] = mapped_column(Text())
    s3_key: Mapped[str | None] = mapped_column(Text(), nullable=True)  # voice recording, if any
    duration_s: Mapped[float | None] = mapped_column(Float(), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class KeeperProfile(Base):
    __tablename__ = "keeper_profile"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contract_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("contracts.id", ondelete="CASCADE"), unique=True)
    who_they_are: Mapped[str | None] = mapped_column(Text(), nullable=True)
    who_theyre_becoming: Mapped[str | None] = mapped_column(Text(), nullable=True)
    what_you_want: Mapped[str | None] = mapped_column(Text(), nullable=True)
    what_you_want_known: Mapped[str | None] = mapped_column(Text(), nullable=True)
    advice: Mapped[str | None] = mapped_column(Text(), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
