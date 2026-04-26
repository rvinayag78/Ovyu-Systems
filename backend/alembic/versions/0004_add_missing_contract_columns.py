"""add missing contract columns

Revision ID: 0004
Revises: 0003
Create Date: 2026-04-26 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("contracts", sa.Column("keeper_name", sa.String(length=256), nullable=True))
    op.add_column("contracts", sa.Column("relationship", sa.String(length=100), nullable=True))
    op.add_column("contracts", sa.Column("tc_name", sa.String(length=256), nullable=True))
    op.add_column("contracts", sa.Column("maker_signed_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("contracts", sa.Column("pending_expires_at", sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    op.drop_column("contracts", "pending_expires_at")
    op.drop_column("contracts", "maker_signed_at")
    op.drop_column("contracts", "tc_name")
    op.drop_column("contracts", "relationship")
    op.drop_column("contracts", "keeper_name")
