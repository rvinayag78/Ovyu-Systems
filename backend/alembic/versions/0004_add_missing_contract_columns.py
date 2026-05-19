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


def _add_if_missing(table: str, column: str, ddl: str) -> None:
    op.execute(f"""
        DO $$ BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_schema='public' AND table_name='{table}' AND column_name='{column}'
            ) THEN {ddl}; END IF;
        END$$;
    """)


def upgrade() -> None:
    _add_if_missing("contracts", "keeper_name", "ALTER TABLE contracts ADD COLUMN keeper_name VARCHAR(256)")
    _add_if_missing("contracts", "relationship", "ALTER TABLE contracts ADD COLUMN relationship VARCHAR(100)")
    _add_if_missing("contracts", "tc_name", "ALTER TABLE contracts ADD COLUMN tc_name VARCHAR(256)")
    _add_if_missing("contracts", "maker_signed_at", "ALTER TABLE contracts ADD COLUMN maker_signed_at TIMESTAMPTZ")
    _add_if_missing("contracts", "pending_expires_at", "ALTER TABLE contracts ADD COLUMN pending_expires_at TIMESTAMPTZ")


def downgrade() -> None:
    op.drop_column("contracts", "pending_expires_at")
    op.drop_column("contracts", "maker_signed_at")
    op.drop_column("contracts", "tc_name")
    op.drop_column("contracts", "relationship")
    op.drop_column("contracts", "keeper_name")
