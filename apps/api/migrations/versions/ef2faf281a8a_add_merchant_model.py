"""add merchant model

Revision ID: ef2faf281a8a
Revises: 22566866436d
Create Date: 2025-06-22 17:51:35.988392

"""
from collections.abc import Sequence

import sqlalchemy as sa
import sqlmodel.sql.sqltypes
from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'ef2faf281a8a'
down_revision: str | None = '22566866436d'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('merchant',
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('name', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('category', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('match_prefix', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('logo_url', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
    sa.Column('url', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
    sa.Column('id', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_merchant_match_prefix'), 'merchant', ['match_prefix'], unique=False)
    op.add_column('transaction', sa.Column('opposing_merchant_id', sqlmodel.sql.sqltypes.AutoString(), nullable=True))
    op.create_foreign_key("fk_transaction_opposing_merchant_id_merchant", 'transaction', 'merchant', ['opposing_merchant_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint("fk_transaction_opposing_merchant_id_merchant", 'transaction', type_='foreignkey')
    op.drop_column('transaction', 'opposing_merchant_id')
    op.drop_index(op.f('ix_merchant_match_prefix'), table_name='merchant')
    op.drop_table('merchant')
    # ### end Alembic commands ###
