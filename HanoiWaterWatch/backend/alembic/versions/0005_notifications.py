"""Persist station condition changes and addressed notification delivery."""
from alembic import op
import sqlalchemy as sa
from app.models import WaterCondition, Notification, NotificationInbox, NotificationDelivery

revision = '0005_notifications'
down_revision = '0004'
branch_labels = None
depends_on = None


def upgrade():
    if 'quality_eligible' not in {c['name'] for c in sa.inspect(op.get_bind()).get_columns('measurements')}:
        op.add_column('measurements', sa.Column('quality_eligible', sa.Boolean(), nullable=False, server_default=sa.false()))
    for model in (WaterCondition, Notification, NotificationInbox, NotificationDelivery):
        model.__table__.create(bind=op.get_bind(), checkfirst=True)


def downgrade():
    raise RuntimeError('Forward-only project migration')
