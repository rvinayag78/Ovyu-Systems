"""add s3_key, duration_s to keeper_messages for voice recordings

Revision ID: 0010
Revises: 0009
Create Date: 2026-07-05 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0010"
down_revision: Union[str, None] = "0009"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("keeper_messages", sa.Column("s3_key", sa.Text(), nullable=True))
    op.add_column("keeper_messages", sa.Column("duration_s", sa.Float(), nullable=True))


def downgrade() -> None:
    op.drop_column("keeper_messages", "duration_s")
    op.drop_column("keeper_messages", "s3_key")
