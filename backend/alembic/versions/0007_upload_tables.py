"""create upload tables

Revision ID: 0007
Revises: 0006
Create Date: 2026-05-24 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
from alembic import op

revision: str = "0007"
down_revision: Union[str, None] = "0006"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "uploads",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("contract_id", UUID(as_uuid=True), sa.ForeignKey("contracts.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("maker_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("voice_status", sa.String(20), nullable=False, server_default="pending"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "voice_recordings",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("upload_id", UUID(as_uuid=True), sa.ForeignKey("uploads.id", ondelete="CASCADE"), nullable=False),
        sa.Column("type", sa.String(20), nullable=False),
        sa.Column("s3_key", sa.Text(), nullable=False),
        sa.Column("duration_s", sa.Float(), nullable=True),
        sa.Column("transcript", sa.Text(), nullable=True),
        sa.Column("status", sa.String(20), nullable=False, server_default="pending"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("upload_id", "type", name="uq_voice_recordings_upload_type"),
    )

    op.create_table(
        "dimensions",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("upload_id", UUID(as_uuid=True), sa.ForeignKey("uploads.id", ondelete="CASCADE"), nullable=False),
        sa.Column("slug", sa.String(50), nullable=False),
        sa.Column("structured", sa.JSON(), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("upload_id", "slug", name="uq_dimensions_upload_slug"),
    )

    op.create_table(
        "dimension_entries",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("dimension_id", UUID(as_uuid=True), sa.ForeignKey("dimensions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("media_s3_key", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "people",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("upload_id", UUID(as_uuid=True), sa.ForeignKey("uploads.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.Text(), nullable=False),
        sa.Column("role", sa.Text(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "years",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("upload_id", UUID(as_uuid=True), sa.ForeignKey("uploads.id", ondelete="CASCADE"), nullable=False),
        sa.Column("year", sa.Integer(), nullable=True),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("body", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "places",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("upload_id", UUID(as_uuid=True), sa.ForeignKey("uploads.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.Text(), nullable=False),
        sa.Column("why", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "keeper_messages",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("contract_id", UUID(as_uuid=True), sa.ForeignKey("contracts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("type", sa.String(20), nullable=False),
        sa.Column("trigger", sa.Text(), nullable=True),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "keeper_profile",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("contract_id", UUID(as_uuid=True), sa.ForeignKey("contracts.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("who_they_are", sa.Text(), nullable=True),
        sa.Column("who_theyre_becoming", sa.Text(), nullable=True),
        sa.Column("what_you_want", sa.Text(), nullable=True),
        sa.Column("what_you_want_known", sa.Text(), nullable=True),
        sa.Column("advice", sa.Text(), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("keeper_profile")
    op.drop_table("keeper_messages")
    op.drop_table("places")
    op.drop_table("years")
    op.drop_table("people")
    op.drop_table("dimension_entries")
    op.drop_table("dimensions")
    op.drop_table("voice_recordings")
    op.drop_table("uploads")
