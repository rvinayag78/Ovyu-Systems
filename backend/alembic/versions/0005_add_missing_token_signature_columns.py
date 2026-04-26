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


def upgrade() -> None:
    op.add_column("invitation_tokens", sa.Column("token_hash", sa.String(length=128), nullable=True))
    op.add_column("invitation_tokens", sa.Column("consumed_at", sa.DateTime(timezone=True), nullable=True))

    op.add_column("signatures", sa.Column("typed_name", sa.String(length=256), nullable=True))
    op.add_column("signatures", sa.Column("matched_against", sa.String(length=256), nullable=True))
    op.add_column("signatures", sa.Column("user_agent", sa.String(length=512), nullable=True))

    # Backfill token_hash from token (same value since no hashing was done on existing rows)
    op.execute("UPDATE invitation_tokens SET token_hash = encode(sha256(token::bytea), 'hex') WHERE token_hash IS NULL")

    # Add unique constraint on token_hash after backfill
    op.create_unique_constraint("uq_invitation_tokens_token_hash", "invitation_tokens", ["token_hash"])


def downgrade() -> None:
    op.drop_constraint("uq_invitation_tokens_token_hash", "invitation_tokens")
    op.drop_column("signatures", "user_agent")
    op.drop_column("signatures", "matched_against")
    op.drop_column("signatures", "typed_name")
    op.drop_column("invitation_tokens", "consumed_at")
    op.drop_column("invitation_tokens", "token_hash")
