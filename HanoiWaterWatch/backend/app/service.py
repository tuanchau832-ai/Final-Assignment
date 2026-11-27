import os,json,hashlib,hmac,secrets,uuid,statistics,threading
from pathlib import Path
from datetime import datetime,timezone,timedelta
from sqlalchemy import create_engine,select,delete,func,text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from argon2 import PasswordHasher
from .models import *
from .notifications import update_condition
ROOT=Path(__file__).resolve().parents[2]
def now(): return datetime.now(timezone.utc)
def stamp(t=None): return (t or now()).astimezone(timezone.utc).isoformat(timespec='milliseconds').replace('+00:00','Z')
def dt(s): return datetime.fromisoformat(s.replace('Z','+00:00')) if s else None
class Problem(Exception):
    def __init__(self,status,code,detail=None): self.status=status;self.code=code;self.detail=detail or code.replace('_',' ')

def rule_defaults():
    specs=[('VALID_RANGE','all','equipment','warning',{},1,2,'Instrument plausibility check'),('REF_PH_BAND','ph','water_quality','critical',{'min':6.,'max':9.},3,3,'Reference band from QCVN 40:2025/BTNMT (industrial wastewater), pH 6–9. Verification of the official text pending. This is not a river-water standard.'),('REF_TEMP_MAX','temp','water_quality','warning',{'max':40.},3,3,'Reference maximum from QCVN 40:2025/BTNMT (industrial wastewater), 40 °C. Verification of the official text pending.'),('CHG_TURB_SPIKE','turbidity','water_quality','warning',{'multiplier':3.,'delta':50.},2,5,'Demo heuristic: ≥3× five-minute median and ≥+50 NTU. No regulatory meaning.'),('CHG_DO_DROP','do','water_quality','warning',{'ratio':.5,'delta':2.,'clear_ratio':.8},3,5,'Demo heuristic: at or below half the median and down ≥2 mg/L. No regulatory meaning.'),('STN_OFFLINE','station','equipment','info',{},1,1,'Connectivity check')]
    return {c:dict(code=c,name={'en':c.replace('_',' ').title(),'vi':c.replace('_',' ').title()},applies_to=a,category=cat,severity=sev,params=params,persistence=p,clear_persistence=cp,basis_text={'en':basis,'vi':basis},is_regulatory=c.startswith('REF_'),basis_status='unverified' if c.startswith('REF_') else 'not_applicable',basis_reference=None,enabled=True) for c,a,cat,sev,params,p,cp,basis in specs}
class Service:
    def __init__(self,url,testing=False):
        url=url.replace('sqlite+aiosqlite:','sqlite:').replace('postgresql+asyncpg:','postgresql+psycopg:')
        if url.startswith('postgresql://'): url=url.replace('postgresql://','postgresql+psycopg://',1)
        self.engine=create_engine(url,connect_args={'check_same_thread':False} if url.startswith('sqlite:') else {},pool_pre_ping=True)
        self.DB=sessionmaker(self.engine,expire_on_commit=False); self.lock=threading.RLock(); self.testing=testing; self.auth_failures={}
        self.types=json.loads((ROOT/'shared/registry/sensor_types.json').read_text(encoding='utf-8-sig'))['types']
    def seed(self):
        Base.metadata.create_all(self.engine)
        with self.DB.begin() as db:
            for path in sorted((ROOT/'shared/registry').glob('HWW-*.json')):
                reg=json.loads(path.read_text(encoding='utf-8-sig')); code=reg['station']['code']; st=db.get(Station,code)
                if not st: db.add(Station(code=code,registry=reg,status='unavailable',status_since=stamp()))
                else: st.registry=reg
                db.flush()
                if reg.get('device'):
                    d=reg['device']
                    if not db.get(Device,d['code']): db.add(Device(code=d['code'],station=code,kind=d['kind']))
                for s in reg['sensors']:
                    if not db.get(Sensor,s['uid']): db.add(Sensor(uid=s['uid'],station=code,channel=s['channel'],status='unavailable',status_since=stamp(),rule_state={}))
                replay='replay-'+code.lower()
                if not db.get(Device,replay): db.add(Device(code=replay,station=code,kind='replay'))
            for code,data in rule_defaults().items():
                if not db.get(Rule,code): db.add(Rule(code=code,data=data))
        for role in ('operator','reviewer','admin'):
            user=os.getenv('DEMO_'+role.upper()+'_USERNAME'); password=os.getenv('DEMO_'+role.upper()+'_PASSWORD')
            if user and password: self.create_user(user,password,role)
    def create_user(self,username,password,role):
        with self.DB.begin() as db:
            if not db.get(User,username): db.add(User(username=username,display_name='Demo '+role.title(),role=role,password_hash=PasswordHasher().hash(password)))
    def rotate_key(self,code,key=None):
        key=key or 'hwwk_'+secrets.token_urlsafe(32)
        with self.DB.begin() as db:
            d=db.get(Device,code)
            if not d: raise Problem(404,'not_found')
            if d.kind=='replay': raise Problem(422,'validation_error','Replay devices cannot have external keys')
            d.key_prefix=key[:8];d.key_hash=hashlib.sha256(key.encode()).hexdigest();d.rotated_at=stamp()
            return dict(device_code=code,key=key,key_prefix=key[:8],rotated_at=d.rotated_at,is_simulated=True)
    def authenticate(self,key,claimed=None):
        with self.DB() as db:
            d=db.scalar(select(Device).where(Device.key_prefix==(key or '')[:8]))
            if not d or not key or not hmac.compare_digest(d.key_hash or '',hashlib.sha256(key.encode()).hexdigest()):
                if claimed: self.auth_failures.setdefault(claimed,[]).append(now())
                raise Problem(401,'invalid_device_key')
            if not d.enabled: raise Problem(403,'device_disabled')
            return d
    def event(self,db,station,kind,data=None,sensor=None,alert=None,actor=None,at=None):
        db.add(Event(station=station,sensor=sensor,alert_id=alert,at=at or stamp(),type=kind,actor=actor,data=data or {}))
    def station(self,db,code,lock=False):
        s=db.scalar(select(Station).where(Station.code==code).with_for_update()) if lock else db.get(Station,code)
        if not s: raise Problem(404,'not_found')
        return s
    def bump_snapshot(self,db,code):
        station=self.station(db,code,True);station.version+=1
    def open_alert(self,db,st,sensor,session,rule,t,value=None,baseline=None,threshold=None,late=False):
        a=Alert(station=st.code,sensor=sensor.uid if sensor else None,session=session.id if session else None,rule_code=rule['code'],category=rule['category'],severity=rule['severity'],opened_at=t,detected_at=stamp(),detected_late=late,observed_value=value,baseline_value=baseline,threshold_value=threshold,params_snapshot=rule['params'],basis_snapshot={k:rule[k] for k in ('basis_text','is_regulatory','basis_status','basis_reference')})
        db.add(a);db.flush();self.event(db,st.code,'alert_opened',{'alert_id':a.id,'rule_code':a.rule_code},a.sensor,a.id,at=t);return a
    def clear_alert(self,db,a,t):
        if a and not a.cleared_at: a.cleared_at=t; self.event(db,a.station,'alert_cleared',{'alert_id':a.id},a.sensor,a.id,at=t)
    def evaluate(self,db,st,sensor,session,m,rules,*,historical=False):
        states=json.loads(json.dumps(sensor.rule_state or {})); t=m.measured_at; value=m.value
        ready = pending = False
        changes = []
        for rule in rules:
            code=rule['code']
            if not rule['enabled'] or rule['applies_to'] not in ('all',sensor.channel): continue
            rs=states.setdefault(code,{'pending':0,'active':False,'clear_count':0})
            if rule['category']=='water_quality' and not historical:
                previous_at = rs.get('last_live_at')
                if previous_at and (dt(t) - dt(previous_at)).total_seconds() > float(os.getenv('OFFLINE_AFTER_S','15')) / session.speed:
                    rs['pending'] = rs['clear_count'] = 0
                rs['last_live_at'] = t
            if rule['category']=='water_quality' and m.quality!='ok':
                rs['pending']=0;rs['clear_count']=0;continue
            p=rule['params'];base=rs.get('frozen_baseline'); threshold=None
            if rs.get('active') and rs.get('alert_id'):
                episode=db.get(Alert,rs['alert_id'])
                if episode:p=episode.params_snapshot
            if code.startswith('CHG_') and not rs['active']:
                window=300/session.speed; gap=10/session.speed
                baseline_query = select(Measurement.value).where(Measurement.sensor==sensor.uid,Measurement.session==session.id,Measurement.quality=='ok',Measurement.measured_at>=stamp(dt(t)-timedelta(seconds=window)),Measurement.measured_at<=stamp(dt(t)-timedelta(seconds=gap)))
                if not historical:
                    baseline_query = baseline_query.where(Measurement.quality_eligible.is_(True))
                vals=db.scalars(baseline_query).all()
                if len(vals)<30 or (dt(t)-dt(session.started_at)).total_seconds()<60/session.speed: rs['warming_up']=True;rs['pending']=0;continue
                base=statistics.median(vals);rs['warming_up']=False
            if code=='VALID_RANGE': hit=m.quality!='ok';clear=not hit
            elif code=='REF_PH_BAND': hit=value<p['min'] or value>p['max'];clear=not hit;threshold=p['min'] if value<p['min'] else p['max']
            elif code=='REF_TEMP_MAX': hit=value>p['max'];clear=not hit;threshold=p['max']
            elif code=='CHG_TURB_SPIKE': threshold=max(p['multiplier']*base,base+p['delta']);hit=value>=threshold;clear=value<threshold
            elif code=='CHG_DO_DROP': threshold=p['ratio']*base;hit=value<=threshold and base-value>=p['delta'];clear=value>=p['clear_ratio']*base
            else: continue
            was_active = rs['active']
            if not rs['active']:
                rs['pending']=rs['pending']+1 if hit else 0
                if rs['pending']>=rule['persistence']:
                    a=self.open_alert(db,st,sensor,session,rule,t,value,base,threshold,historical);rs.update(active=True,clear_count=0,frozen_baseline=base,alert_id=a.id)
            else:
                rs['clear_count']=rs['clear_count']+1 if clear else 0
                if rs['clear_count']>=rule['clear_persistence']:
                    self.clear_alert(db,db.get(Alert,rs['alert_id']),t);rs.update(active=False,pending=0,clear_count=0,frozen_baseline=None)
            if rule['category'] == 'water_quality':
                ready = True
                pending |= bool(rs['pending'] and not rs['active'])
                if was_active != rs['active']:
                    changes.append(rs['alert_id'])
        sensor.rule_state=states
        return ready, pending, changes

    def evaluate_history(self, db, station, sensor, session, measurement, rules):
        # A later batch can contain readings from an already reconciled episode.
        at = measurement.measured_at
        covered_rules = set(db.scalars(select(Alert.rule_code).where(
            Alert.sensor == sensor.uid, Alert.session == session.id,
            Alert.opened_at <= at, Alert.cleared_at >= at, Alert.detected_late.is_(True),
        )))
        live_state = sensor.rule_state
        sensor.rule_state = sensor.historical_rule_state or {}
        try:
            self.evaluate(db, station, sensor, session, measurement,
                          [rule for rule in rules if rule['code'] not in covered_rules], historical=True)
            through = sensor.rule_state.get('_through', {}).get('at', at)
            sensor.historical_rule_state = {**sensor.rule_state, '_through': {'at': max(at, through)}}
        finally:
            sensor.rule_state = live_state

    def reconcile_history(self, db, station, sensor, session, rules):
        historical = sensor.historical_rule_state or {}
        active = {code for code, state in historical.items() if state.get('active')}
        if not active:
            return
        after = historical.get('_through', {}).get('at')
        if not after:
            return
        following = db.scalars(select(Measurement).where(
            Measurement.sensor == sensor.uid, Measurement.session == session.id,
            Measurement.measured_at > after,
        ).order_by(Measurement.measured_at, Measurement.id))
        live_state = sensor.rule_state
        sensor.rule_state = historical
        try:
            for measurement in following:
                self.evaluate(db, station, sensor, session, measurement,
                              [rule for rule in rules if rule['code'] in active])
                active = {code for code in active if sensor.rule_state[code].get('active')}
                if not active:
                    break
            # Keep incomplete recovery counters based on received backfill. A
            # later batch can fill the intervening gap and change the evidence.
            sensor.historical_rule_state = {
                code: historical[code] if code in active else state
                for code, state in sensor.rule_state.items()
            }
        finally:
            sensor.rule_state = live_state

    def recompute(self,db,st,t):
        sensors=db.scalars(select(Sensor).where(Sensor.station==st.code)).all()
        for s in sensors:
            old=s.status
            if not s.measured_at or st.registry['station']['data_mode']=='planned': status='unavailable'
            elif st.status=='offline': status='offline'
            elif s.quality in ('fault','invalid') or (s.rule_state or {}).get('VALID_RANGE',{}).get('active'): status='sensor_fault'
            elif any(v.get('active') for k,v in (s.rule_state or {}).items() if k!='VALID_RANGE'): status='abnormal'
            elif not any(k != 'VALID_RANGE' for k in (s.rule_state or {})) and any(
                v.get('active') for k,v in (s.historical_rule_state or {}).items() if k != 'VALID_RANGE'
            ): status='abnormal'
            else: status='normal'
            s.status=status
            if old!=status: s.status_since=t;self.event(db,st.code,'status_changed',{'from':old,'to':status},s.uid,at=t)
        old=st.status
        if st.registry['station']['data_mode']=='planned': status='unavailable'
        elif st.status=='offline': status='offline'
        elif any(s.status=='abnormal' for s in sensors): status='abnormal'
        elif any(s.status in ('sensor_fault','unavailable') for s in sensors): status='degraded'
        else: status='normal'
        st.status=status
        if old!=status: st.status_since=t;self.event(db,st.code,'status_changed',{'from':old,'to':status},at=t)
    def ingest(self,batch,device,received=None,speed=1,*,takeover=False,replay_name=None,expected_session=None):
        received=received or now(); rt=stamp(received)
        if batch.station_code!=device.station or batch.device_code!=device.code: raise Problem(403,'station_mismatch')
        with self.lock,self.DB.begin() as db:
            if db.bind.dialect.name == 'sqlite':
                db.execute(text('BEGIN IMMEDIATE'))
            st=self.station(db,batch.station_code,True)
            if st.lifecycle != 'active':
                raise Problem(409, 'station_inactive')
            if st.registry['station']['data_mode']=='planned': raise Problem(403,'station_mismatch')
            channels={s['channel'] for s in st.registry['sensors']}
            for f in batch.frames:
                for c,r in f.readings.items():
                    if c not in channels: raise Problem(422,'unknown_channel')
                    if r.u!=self.types[c]['unit']: raise Problem(422,'unit_mismatch')
            # Determine whether this request has any new, usable frames before
            # it can take ownership, supersede a boot, or touch rule counters.
            results=[];candidates=[];seen=set()
            for f in sorted(batch.frames,key=lambda x:x.seq):
                if f.seq in seen or db.scalar(select(FrameRow.id).where(FrameRow.device==device.code,FrameRow.boot_id==batch.boot_id,FrameRow.seq==f.seq)):
                    results.append({'seq':f.seq,'status':'duplicate'});continue
                measured=received-timedelta(milliseconds=batch.sent_uptime_ms-f.uptime_ms) if f.time_source=='uptime' else f.measured_at
                if st.monitoring_since and stamp(measured) < st.monitoring_since:
                    results.append({'seq': f.seq, 'status': 'rejected', 'reason': 'before_monitoring_restart'})
                    continue
                age=(received-measured).total_seconds()
                if age>86400 or age < -300:
                    results.append({'seq':f.seq,'status':'rejected','reason':'too_old' if age>86400 else 'future_timestamp'});continue
                seen.add(f.seq);candidates.append((stamp(measured),f));results.append({'seq':f.seq,'status':'accepted'})
            if not candidates:
                duplicates=sum(r['status']=='duplicate' for r in results)
                return dict(results=results,accepted=0,duplicates=duplicates,rejected=len(results)-duplicates,station_status=st.status,state_version=st.version,server_time=rt,next_min_interval_ms=int(os.getenv('FRAME_INTERVAL_MS','2000')),is_simulated=True)
            active=db.scalar(select(Session).where(Session.station==st.code,Session.ended_at.is_(None)))
            if active and not expected_session and active.last_frame_at and (
                received - dt(active.last_frame_at)
            ).total_seconds() > float(os.getenv('SESSION_END_AFTER_S', '60')) / active.speed:
                active.ended_at = rt
                active.end_reason = 'idle_timeout'
                self.event(db, st.code, 'session_ended', {'session_id': active.id, 'reason': active.end_reason})
                db.flush()
                active = None
            if expected_session and (not active or active.id != expected_session):
                raise Problem(409,'station_busy')
            if active and (active.device!=device.code or replay_name) and not takeover:
                raise Problem(409,'station_busy')
            session=active if active and active.boot_id==batch.boot_id else None
            if not session:
                if active:
                    active.ended_at=rt
                    active.end_reason='takeover' if takeover else 'superseded'
                    db.flush()
                    self.event(db,st.code,'session_ended',{'session_id':active.id,'reason':active.end_reason})
                source={'wokwi_esp32':'simulated_wokwi','sim_script':'simulated_script','replay':'simulated_replay'}[device.kind]
                session=Session(id=str(uuid.uuid4()),station=st.code,device=device.code,boot_id=batch.boot_id,source=source,fw_version=batch.fw_version,started_at=rt,last_seq=-1,speed=speed,replay_name=replay_name)
                db.add(session);db.flush();st.current_session=session.id;st.active_device=device.code;self.event(db,st.code,'session_started',{'session_id':session.id,'source':source,'boot_id':batch.boot_id})
                if takeover:self.event(db,st.code,'takeover_started',{'replay':replay_name})
                # New boot starts fresh rule counters; old active conditions end with their session.
                for sensor in db.scalars(select(Sensor).where(Sensor.station==st.code)):
                    for rs in (sensor.rule_state or {}).values():
                        if rs.get('active'): self.clear_alert(db,db.get(Alert,rs['alert_id']),rt)
                    sensor.rule_state={};sensor.historical_rule_state={}
            new=[]
            for t,f in candidates:
                row=FrameRow(session=session.id,device=device.code,boot_id=batch.boot_id,seq=f.seq,measured_at=t,received_at=rt,payload=f.model_dump(mode='json'))
                db.add(row);db.flush();new.append((t,f,row))
                if session.last_seq>=0 and f.seq>session.last_seq+1:self.event(db,st.code,'frames_missing',{'from_seq':session.last_seq+1,'to_seq':f.seq-1})
                session.last_seq=max(session.last_seq,f.seq)
            rules=[r.data for r in db.scalars(select(Rule))]
            touched_sensors = set()
            for t,f,row in sorted(new,key=lambda x:x[0]):
                ready = pending = False
                changes = []
                age = (received - dt(t)).total_seconds()
                freshness_window = float(os.getenv('OFFLINE_AFTER_S','15')) / session.speed
                fresh = not f.buffered and 0 <= age <= freshness_window
                for c,r in f.readings.items():
                    sensor=db.get(Sensor,st.code+':'+c);spec=self.types[c]
                    quality='fault' if r.q=='fault' else 'invalid' if not spec['valid_min']<=r.v<=spec['valid_max'] else 'ok'
                    m=Measurement(frame_id=row.id,sensor=sensor.uid,session=session.id,measured_at=t,received_at=rt,value=r.v,quality=quality,source=session.source,raw=r.raw,gen=r.gen,fault_reason=r.fr if quality=='fault' else 'out_of_range' if quality=='invalid' else None)
                    latest = not sensor.measured_at or t > sensor.measured_at
                    m.quality_eligible = fresh and latest and quality == 'ok'
                    db.add(m);db.flush()
                    touched_sensors.add(sensor.uid)
                    if not latest:
                        self.evaluate_history(db,st,sensor,session,m,rules)
                    elif not fresh:
                        # Historical readings can produce review evidence but never
                        # advance the persistence or recovery count of a live episode.
                        self.evaluate(db, st, sensor, session, m, [r for r in rules if r['category'] != 'water_quality'])
                        self.evaluate_history(db, st, sensor, session, m, [r for r in rules if r['category'] == 'water_quality'])
                    else:
                        eligible, confirming, changed = self.evaluate(db,st,sensor,session,m,rules)
                        ready |= eligible
                        pending |= confirming
                        changes.extend(changed)
                    if not sensor.measured_at or t>sensor.measured_at:
                        sensor.value=r.v;sensor.measured_at=t;sensor.received_at=rt;sensor.quality=quality;sensor.gen=r.gen;sensor.fault_reason=m.fault_reason
                        if quality=='ok':sensor.last_valid_value=r.v;sensor.last_valid_at=t
                db.flush()
                update_condition(db, st, session, t, ready=ready, pending=pending, changes=changes,
                                 freshness_window=freshness_window)
            for uid in touched_sensors:
                self.reconcile_history(db,st,db.get(Sensor,uid),session,rules)
            accepted=len(new); duplicates=sum(r['status']=='duplicate' for r in results);rejected=len(results)-accepted-duplicates
            session.frames_accepted+=accepted;session.frames_duplicate+=duplicates;session.frames_rejected+=rejected;session.last_diag=batch.diag.model_dump();session.last_batch=batch.model_dump(by_alias=True,mode='json')
            if accepted:
                session.last_frame_at=rt;st.last_frame=rt;st.last_measured=max([st.last_measured or '']+[t for t,_,_ in new]);st.version+=1
                offline=db.scalar(select(Alert).where(Alert.station==st.code,Alert.rule_code=='STN_OFFLINE',Alert.cleared_at.is_(None)))
                self.clear_alert(db,offline,rt)
                if st.status=='offline':st.status='degraded';self.event(db,st.code,'station_online')
                self.recompute(db,st,rt)
            return dict(results=results,accepted=accepted,duplicates=duplicates,rejected=rejected,station_status=st.status,state_version=st.version,server_time=rt,next_min_interval_ms=int(os.getenv('FRAME_INTERVAL_MS','2000')),is_simulated=True)
    def freshness(self,at=None):
        at=at or now();t=stamp(at)
        with self.lock,self.DB.begin() as db:
            for st in db.scalars(select(Station).where(Station.lifecycle == 'active').with_for_update()):
                if st.registry['station']['data_mode']=='planned':continue
                if not st.last_frame:
                    empty=db.scalar(select(Session).where(Session.station==st.code,Session.ended_at.is_(None)))
                    if empty and (at-dt(empty.started_at)).total_seconds()>float(os.getenv('SESSION_END_AFTER_S','60')):
                        empty.ended_at=t;empty.end_reason='idle_timeout';st.active_device=None;st.version+=1;self.event(db,st.code,'session_ended',{'reason':'idle_timeout','session_id':empty.id},at=t)
                    continue
                age=(at-dt(st.last_frame)).total_seconds()
                current=db.get(Session,st.current_session) if st.current_session else None
                scale=current.speed if current and current.source=='simulated_replay' and not current.ended_at else 1
                if age>float(os.getenv('OFFLINE_AFTER_S','15'))/scale and st.status!='offline':
                    st.status='offline';st.status_since=t;st.version+=1;self.recompute(db,st,t);self.event(db,st.code,'station_offline',at=t)
                    existing=db.scalar(select(Alert).where(Alert.station==st.code,Alert.rule_code=='STN_OFFLINE',Alert.cleared_at.is_(None)))
                    rule = db.get(Rule,'STN_OFFLINE').data
                    if not existing and rule['enabled']:self.open_alert(db,st,None,current,rule,t)
                if age>float(os.getenv('SESSION_END_AFTER_S','60'))/scale:
                    active=db.scalar(select(Session).where(Session.station==st.code,Session.ended_at.is_(None)))
                    if active:active.ended_at=t;active.end_reason='idle_timeout';st.active_device=None;st.version+=1;self.event(db,st.code,'session_ended',{'reason':'idle_timeout','session_id':active.id},at=t)
    def snapshot(self,code):
        with self.lock,self.DB() as db:
            st=self.station(db,code);session=db.get(Session,st.current_session) if st.current_session else None;sensors=[]
            for meta in st.registry['sensors']:
                s=db.get(Sensor,meta['uid']);spec=self.types[s.channel];hidden=s.status in ('sensor_fault','offline','unavailable')
                active=db.scalar(select(Alert).where(Alert.sensor==s.uid,Alert.cleared_at.is_(None),Alert.detected_late.is_(False)))
                sensors.append(dict(channel=s.channel,uid=s.uid,unit=spec['unit'],decimals=spec['decimals'],model_node=meta['model_node'],value=None if hidden else s.value,measured_at=s.measured_at,quality=s.quality,gen=s.gen,status=s.status,status_since=s.status_since,last_valid={'value':s.last_valid_value,'measured_at':s.last_valid_at} if hidden and s.last_valid_at else None,fault_reason=s.fault_reason,active_alert_id=active.id if active else None))
            alerts=db.scalars(select(Alert).where(Alert.station==code,Alert.review_status!='closed')).all()
            return dict(station_code=code,version=st.version,generated_at=stamp(),station_status=st.status,status_since=st.status_since,station_status_since=st.status_since,offline_after_s=int(os.getenv("OFFLINE_AFTER_S","15"))/(session.speed if session and session.source=="simulated_replay" and not session.ended_at else 1),data_source=session.source if session else None,last_frame_at=st.last_frame,last_measured_at=st.last_measured,freshness_s=max(0,(now()-dt(st.last_frame)).total_seconds()) if st.last_frame else None,is_simulated=True,session=self.session_dict(session) if session else None,sensors=sensors,open_alerts=[self.alert_dict(db,a) for a in alerts],open_alert_count=len(alerts))
    def session_dict(self,s):
        return dict(id=s.id,station_code=s.station,device_code=s.device,source=s.source,boot_id=s.boot_id,fw_version=s.fw_version,replay_name=s.replay_name,started_at=s.started_at,last_frame_at=s.last_frame_at,ended_at=s.ended_at,end_reason=s.end_reason,frames_accepted=s.frames_accepted,frames_duplicate=s.frames_duplicate,frames_rejected=s.frames_rejected)
    def alert_dict(self,db,a):
        rule=db.get(Rule,a.rule_code).data
        return dict(id=a.id,rule_code=a.rule_code,rule_name=rule['name'],station_code=a.station,sensor_uid=a.sensor,category=a.category,severity=a.severity,evidence_class=a.evidence_class,is_preliminary=a.is_preliminary,review_status=a.review_status,opened_at=a.opened_at,detected_at=a.detected_at,detected_late=a.detected_late,cleared_at=a.cleared_at,observed_value=a.observed_value,unit=self.types[a.sensor.split(':')[-1]]['unit'] if a.sensor else None,outcome=a.outcome,is_simulated=True)

    def purge(self,at=None):
        cutoff=stamp((at or now())-timedelta(days=int(os.getenv('RETENTION_DAYS','7'))))
        with self.lock,self.DB.begin() as db:
            ids=select(FrameRow.id).where(FrameRow.measured_at<cutoff)
            measurements=db.execute(delete(Measurement).where(Measurement.measured_at<cutoff)).rowcount
            frames=db.execute(delete(FrameRow).where(FrameRow.measured_at<cutoff)).rowcount
            events=db.execute(delete(Event).where(Event.at<cutoff,Event.alert_id.is_(None))).rowcount
            return {'measurements':measurements,'frames':frames,'events':events}
