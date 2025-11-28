"""add_email_verification_fields

Revision ID: email_verification_001
Revises: 50216331c811
Create Date: 2025-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'email_verification_001'
down_revision = '50216331c811'  # Update this to match your latest migration
branch_labels = None
depends_on = None


def upgrade():
    # Add email verification fields
    op.add_column('users', sa.Column('email_verified', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('users', sa.Column('verification_token', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('verification_token_expires', sa.DateTime(), nullable=True))
    
    # Create index on verification_token for faster lookups
    op.create_index(op.f('ix_users_verification_token'), 'users', ['verification_token'], unique=False)


def downgrade():
    # Remove index
    op.drop_index(op.f('ix_users_verification_token'), table_name='users')
    
    # Remove columns
    op.drop_column('users', 'verification_token_expires')
    op.drop_column('users', 'verification_token')
    op.drop_column('users', 'email_verified')

