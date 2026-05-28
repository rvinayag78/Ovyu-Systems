"""add title, entry_type, tags to dimension_entries

Revision ID: 0008
Revises: 0007
Create Date: 2026-05-28 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0008"
down_revision: Union[str, None] = "0007"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("dimension_entries", sa.Column("title", sa.Text(), nullable=True))
    op.add_column("dimension_entries", sa.Column("entry_type", sa.String(10), nullable=False, server_default="text"))
    op.add_column("dimension_entries", sa.Column("tags", sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column("dimension_entries", "tags")
    op.drop_column("dimension_entries", "entry_type")
    op.drop_column("dimension_entries", "title")
