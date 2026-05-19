"""add email_verified to users

Revision ID: 0003
Revises: 0002
Create Date: 2026-04-26 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Column already exists in the 0001 initial schema on fresh installs — skip if present
    op.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name='users' AND column_name='email_verified'
            ) THEN
                ALTER TABLE users ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT true;
            END IF;
        END$$;
    """)


def downgrade() -> None:
    op.drop_column("users", "email_verified")
