"""add missing invitation_tokens and signatures columns

Revision ID: 0005
Revises: 0004
Create Date: 2026-04-26 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0005"
down_revision: Union[str, None] = "0004"
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
    _add_if_missing("invitation_tokens", "token_hash", "ALTER TABLE invitation_tokens ADD COLUMN token_hash VARCHAR(128)")
    _add_if_missing("invitation_tokens", "consumed_at", "ALTER TABLE invitation_tokens ADD COLUMN consumed_at TIMESTAMPTZ")
    _add_if_missing("signatures", "typed_name", "ALTER TABLE signatures ADD COLUMN typed_name VARCHAR(256)")
    _add_if_missing("signatures", "matched_against", "ALTER TABLE signatures ADD COLUMN matched_against VARCHAR(256)")
    _add_if_missing("signatures", "user_agent", "ALTER TABLE signatures ADD COLUMN user_agent VARCHAR(512)")

    op.execute("UPDATE invitation_tokens SET token_hash = encode(sha256(token::bytea), 'hex') WHERE token_hash IS NULL")

    op.execute("""
        DO $$ BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_constraint WHERE conname='uq_invitation_tokens_token_hash'
            ) THEN
                ALTER TABLE invitation_tokens ADD CONSTRAINT uq_invitation_tokens_token_hash UNIQUE (token_hash);
            END IF;
        END$$;
    """)


def downgrade() -> None:
    op.drop_constraint("uq_invitation_tokens_token_hash", "invitation_tokens")
    op.drop_column("signatures", "user_agent")
    op.drop_column("signatures", "matched_against")
    op.drop_column("signatures", "typed_name")
    op.drop_column("invitation_tokens", "consumed_at")
    op.drop_column("invitation_tokens", "token_hash")
