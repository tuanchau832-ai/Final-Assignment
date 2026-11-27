"""Keep station lifecycle and management history independent of sensor status."""
from alembic import op
from sqlalchemy import Column, String, inspect
from app.models import AdminAudit, UTCStamp

revision = '0006_admin'
down_revision = '0005_notifications'
branch_labels = None
depends_on = None


def upgrade():
    connection = op.get_bind()
    columns = {c['name'] for c in inspect(connection).get_columns('stations')}
    if 'lifecycle' not in columns:
        op.add_column('stations', Column('lifecycle', String, nullable=False, server_default='active'))
    if 'monitoring_since' not in columns:
        op.add_column('stations', Column('monitoring_since', UTCStamp()))
    AdminAudit.__table__.create(connection, checkfirst=True)


def downgrade():
    raise RuntimeError('Forward-only project migration')
