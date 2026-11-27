"""Durable SQLAlchemy domain model; JSON columns use JSONB on PostgreSQL."""
from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, ForeignKey, UniqueConstraint, CheckConstraint, Index
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import declarative_base
from sqlalchemy.types import TypeDecorator, DateTime
from datetime import datetime,timezone
class UTCStamp(TypeDecorator):
    impl=DateTime(timezone=True)
    cache_ok=True
    def process_bind_param(self,value,dialect):
        if value is None:return None
        return datetime.fromisoformat(value.replace("Z","+00:00")) if isinstance(value,str) else value
    def process_result_value(self,value,dialect):
        if value is None:return None
        if value.tzinfo is None:value=value.replace(tzinfo=timezone.utc)
        return value.astimezone(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00","Z")
Base=declarative_base()
J=JSON().with_variant(JSONB(),'postgresql')
class Station(Base):
    __tablename__='stations'
    lifecycle=Column(String,nullable=False,default='active',server_default='active')
    monitoring_since=Column(UTCStamp())
    code=Column(String,primary_key=True); registry=Column(J,nullable=False); active_device=Column(String); version=Column(Integer,default=0,nullable=False); status=Column(String,default='unavailable'); status_since=Column(UTCStamp()); last_frame=Column(UTCStamp()); last_measured=Column(UTCStamp()); current_session=Column(String)
class Device(Base):
    __tablename__='devices'
    code=Column(String,primary_key=True); station=Column(String,ForeignKey('stations.code'),nullable=False); kind=Column(String,nullable=False); key_prefix=Column(String,unique=True); key_hash=Column(String); enabled=Column(Boolean,default=True); rotated_at=Column(UTCStamp())
class Sensor(Base):
    __tablename__='sensor_state'
    historical_rule_state=Column(J,default=dict)
    uid=Column(String,primary_key=True); station=Column(String,ForeignKey('stations.code'),nullable=False); channel=Column(String,nullable=False); value=Column(Float); measured_at=Column(UTCStamp()); received_at=Column(UTCStamp()); quality=Column(String); gen=Column(String); fault_reason=Column(String); status=Column(String,default='unavailable'); status_since=Column(UTCStamp()); last_valid_value=Column(Float); last_valid_at=Column(UTCStamp()); rule_state=Column(J,default=dict)
class Session(Base):
    __tablename__='simulation_sessions'
    id=Column(String,primary_key=True); station=Column(String,ForeignKey('stations.code')); device=Column(String,ForeignKey('devices.code')); boot_id=Column(String); source=Column(String); fw_version=Column(String); started_at=Column(UTCStamp()); last_frame_at=Column(UTCStamp()); ended_at=Column(UTCStamp()); end_reason=Column(String); frames_accepted=Column(Integer,default=0); frames_duplicate=Column(Integer,default=0); frames_rejected=Column(Integer,default=0); last_seq=Column(Integer,default=-1); last_diag=Column(J); last_batch=Column(J); replay_name=Column(String); speed=Column(Integer,default=1)
class FrameRow(Base):
    __tablename__='frames'
    id=Column(Integer,primary_key=True); session=Column(String,ForeignKey('simulation_sessions.id')); device=Column(String,ForeignKey('devices.code')); boot_id=Column(String); seq=Column(Integer); measured_at=Column(UTCStamp()); received_at=Column(UTCStamp()); payload=Column(J)
    __table_args__=(UniqueConstraint('device','boot_id','seq'),)
class Measurement(Base):
    __tablename__='measurements'
    quality_eligible = Column(Boolean, nullable=False, default=False, server_default='0')
    id=Column(Integer,primary_key=True); frame_id=Column(Integer,ForeignKey('frames.id')); sensor=Column(String,ForeignKey('sensor_state.uid')); session=Column(String,ForeignKey('simulation_sessions.id')); measured_at=Column(UTCStamp(),index=True); received_at=Column(UTCStamp()); value=Column(Float); quality=Column(String); source=Column(String,nullable=False); is_simulated=Column(Boolean,default=True,nullable=False); raw=Column(Integer); gen=Column(String); fault_reason=Column(String)
    __table_args__=(UniqueConstraint('frame_id','sensor'),CheckConstraint("source IN ('simulated_wokwi','simulated_script','simulated_replay')"),CheckConstraint('is_simulated = true'),CheckConstraint("(quality = 'fault' AND value IS NULL) OR (quality <> 'fault' AND value IS NOT NULL)"))
class Rule(Base):
    __tablename__='alert_rules'
    code=Column(String,primary_key=True); data=Column(J,nullable=False)
class Alert(Base):
    __tablename__='alerts'
    id=Column(Integer,primary_key=True); station=Column(String,ForeignKey('stations.code')); sensor=Column(String,ForeignKey('sensor_state.uid')); session=Column(String,ForeignKey('simulation_sessions.id')); rule_code=Column(String,ForeignKey('alert_rules.code')); category=Column(String); severity=Column(String); evidence_class=Column(String,default='simulated_anomaly'); is_preliminary=Column(Boolean,default=True); review_status=Column(String,default='open'); opened_at=Column(UTCStamp()); detected_at=Column(UTCStamp()); detected_late=Column(Boolean,default=False); cleared_at=Column(UTCStamp()); observed_value=Column(Float); baseline_value=Column(Float); threshold_value=Column(Float); params_snapshot=Column(J); basis_snapshot=Column(J); outcome=Column(String); review_id=Column(Integer,ForeignKey('incident_reviews.id'))
    __table_args__=(CheckConstraint("evidence_class = 'simulated_anomaly'"),CheckConstraint("outcome IS NULL OR outcome IN ('confirmed_simulated_anomaly','sensor_or_equipment_fault','false_positive','test_or_calibration')"),)
class Event(Base):
    __tablename__='station_events'
    id=Column(Integer,primary_key=True); station=Column(String,ForeignKey('stations.code')); sensor=Column(String); alert_id=Column(Integer); at=Column(UTCStamp()); type=Column(String); actor=Column(String); data=Column(J)
class User(Base):
    __tablename__='users'
    username=Column(String,primary_key=True); display_name=Column(String); role=Column(String); password_hash=Column(String); is_active=Column(Boolean,default=True); last_login_at=Column(UTCStamp())
class Review(Base):
    __tablename__='incident_reviews'
    id=Column(Integer,primary_key=True); status=Column(String,default='in_progress'); alert_ids=Column(J); created_by=Column(String,ForeignKey('users.username')); started_at=Column(UTCStamp()); submitted_at=Column(UTCStamp()); note=Column(String); outcome=Column(String); lab_reference=Column(String)

class AdminAudit(Base):
    __tablename__ = 'admin_audit'
    id = Column(Integer, primary_key=True)
    request_id = Column(String, nullable=False)
    fingerprint = Column(String, nullable=False)
    actor = Column(String, ForeignKey('users.username'), nullable=False)
    action = Column(String, nullable=False)
    station = Column(String, ForeignKey('stations.code'), index=True)
    at = Column(UTCStamp(), nullable=False)
    reason = Column(String)
    before = Column(String)
    after = Column(String)
    audience = Column(String)
    recipient_count = Column(Integer)
    notification_id = Column(Integer)
    __table_args__ = (UniqueConstraint('actor', 'request_id'),)

class WaterCondition(Base):
    __tablename__ = 'water_conditions'
    station = Column(String, ForeignKey('stations.code'), primary_key=True)
    session = Column(String, ForeignKey('simulation_sessions.id'), nullable=False)
    condition = Column(String)
    deferred_alert = Column(Integer)
    sequence = Column(Integer, nullable=False, default=0)


class Notification(Base):
    __tablename__ = 'notifications'
    id = Column(Integer, primary_key=True)
    kind = Column(String, nullable=False)
    at = Column(UTCStamp(), nullable=False)
    station = Column(String, ForeignKey('stations.code'))
    sequence = Column(Integer)
    detail = Column(J, nullable=False)
    __table_args__ = (UniqueConstraint('station', 'sequence'), {'sqlite_autoincrement': True})


class NotificationInbox(Base):
    __tablename__ = 'notification_inboxes'
    username = Column(String, ForeignKey('users.username'), primary_key=True)


class NotificationDelivery(Base):
    __tablename__ = 'notification_deliveries'
    username = Column(String, ForeignKey('users.username'), primary_key=True)
    notification_id = Column(Integer, ForeignKey('notifications.id'), primary_key=True)
    claim = Column(String)

# At most one currently active episode; station-level alerts use a separate index because NULL is distinct.
live_sensor_alert = Alert.cleared_at.is_(None) & Alert.sensor.is_not(None) & Alert.detected_late.is_(False)
Index('uq_active_sensor_alert', Alert.sensor, Alert.rule_code, unique=True,
      sqlite_where=live_sensor_alert, postgresql_where=live_sensor_alert)
Index('uq_active_station_alert',Alert.station,Alert.rule_code,unique=True,sqlite_where=(Alert.cleared_at.is_(None)&Alert.sensor.is_(None)),postgresql_where=(Alert.cleared_at.is_(None)&Alert.sensor.is_(None)))
Index('uq_open_station_session',Session.station,unique=True,sqlite_where=Session.ended_at.is_(None),postgresql_where=Session.ended_at.is_(None))

