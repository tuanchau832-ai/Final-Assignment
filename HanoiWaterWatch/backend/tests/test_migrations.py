import os
from pathlib import Path
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine,inspect,select,func
from app.models import Base,Rule,Measurement,Station
from app.service import Service, stamp
from sqlalchemy.orm import Session
from sqlalchemy.schema import CreateTable
from sqlalchemy.dialects import postgresql

def test_empty_database_migrations(tmp_path,monkeypatch):
    url='sqlite:///'+str(tmp_path/'migrations.db');monkeypatch.setenv('DATABASE_URL',url)
    config=Config(str(Path(__file__).resolve().parents[1]/'alembic.ini'));command.upgrade(config,'head')
    engine=create_engine(url)
    assert set(Base.metadata.tables).issubset(set(inspect(engine).get_table_names()))
    with Session(engine) as db:assert db.scalar(select(func.count()).select_from(Rule))==6
    engine.dispose()

def test_postgres_ddl_uses_timezone_and_jsonb():
    ddl=str(CreateTable(Base.metadata.tables['measurements']).compile(dialect=postgresql.dialect()))
    assert 'TIMESTAMP WITH TIME ZONE' in ddl and 'simulated_wokwi' in ddl
    assert 'JSONB' in str(CreateTable(Base.metadata.tables['stations']).compile(dialect=postgresql.dialect()))


def test_upgrade_from_live_alert_index_preserves_existing_history(tmp_path, monkeypatch):
    url = 'sqlite:///' + str(tmp_path / 'prior-release.db')
    monkeypatch.setenv('DATABASE_URL', url)
    config = Config(str(Path(__file__).resolve().parents[1] / 'alembic.ini'))
    command.upgrade(config, '0004')
    service = Service(url)
    service.seed()
    with service.DB.begin() as db:
        db.add(Measurement(sensor='HWW-TLH-001:ph', measured_at=stamp(), received_at=stamp(),
                           source='simulated_wokwi', quality='valid', value=7.2))
    # The initial migration uses current ORM metadata. Recreate the schema that
    # an already-deployed 0004 database has before exercising the upgrade.
    with service.engine.begin() as connection:
        for table in ('notification_deliveries', 'notification_inboxes', 'notifications', 'water_conditions', 'admin_audit'):
            Base.metadata.tables[table].drop(connection)
        connection.exec_driver_sql('ALTER TABLE stations DROP COLUMN lifecycle')
        connection.exec_driver_sql('ALTER TABLE stations DROP COLUMN monitoring_since')
        connection.exec_driver_sql('ALTER TABLE measurements DROP COLUMN quality_eligible')
    command.upgrade(config, 'head')
    with service.DB() as db:
        assert db.get(Station, 'HWW-TLH-001').lifecycle == 'active'
        assert db.scalar(select(Measurement.value)) == 7.2
        assert db.scalar(select(Measurement.quality_eligible)) is False
        assert db.scalar(select(func.count()).select_from(Rule)) == 6
    service.engine.dispose()
