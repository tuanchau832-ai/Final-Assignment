import os,json,asyncio,collections,time,hashlib
from contextlib import asynccontextmanager
from datetime import timedelta,datetime
from pathlib import Path
from fastapi import FastAPI,Request,Response
from fastapi.responses import JSONResponse,FileResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy import select,func,delete,text
from sqlalchemy.exc import SQLAlchemyError
from argon2.exceptions import VerificationError
from argon2 import PasswordHasher
import jwt
from .service import Service,Problem,now,stamp,dt,ROOT
from .schemas import Batch
from .models import *
from .notifications import notification_routes

def create_app(database_url=None,testing=False):
    service=Service(database_url or os.getenv('DATABASE_URL','sqlite:///./waterwatch.db'),testing)
    secret=os.getenv('JWT_SECRET','test-only-secret-32-characters-long' if testing else '')
    if len(secret)<32: raise RuntimeError('JWT_SECRET must contain at least 32 characters')
    runs={};tasks=set();limits={};login_limits={};started=time.monotonic()
    replay_control = asyncio.Lock()
    restart_tickets = {}
    def track(task):
        tasks.add(task);task.add_done_callback(tasks.discard);return task
    async def monitor():
        last_purge=None
        while True:
            await asyncio.sleep(1)
            try:
                await asyncio.to_thread(service.freshness)
                ict=now()+timedelta(hours=7)
                if ict.hour==3 and last_purge!=ict.date():
                    await asyncio.to_thread(service.purge);last_purge=ict.date()
            except SQLAlchemyError:pass
    @asynccontextmanager
    async def lifespan(app):
        service.seed()
        if not testing:
            track(asyncio.create_task(monitor()))
            if os.getenv('DEMO_MODE','true').lower()=='true' and os.getenv('REPLAY_TLH_ENABLED','true').lower()=='true' and (ROOT/'shared/fixtures/replays/tlh-loop.jsonl').exists():
                with service.DB() as db:
                    autorun = service.station(db, 'HWW-TLH-001').lifecycle == 'active'
                if autorun:
                    await start_replay('tlh-loop',{'station_code':'HWW-TLH-001','speed':1,'takeover':True,'loop':True})
        yield
        pending = list(tasks)
        for task in pending:task.cancel()
        await asyncio.gather(*pending,return_exceptions=True);service.engine.dispose()
    app=FastAPI(title='Hanoi WaterWatch',version='1.0.0',lifespan=lifespan,openapi_url='/api/v1/openapi.json',docs_url='/api/docs');app.state.service=service
    @app.exception_handler(Problem)
    async def problem(request,e):
        return JSONResponse({'type':os.getenv('PUBLIC_BASE_URL','')+'/problems/'+e.code,'title':e.code.replace('_',' ').title(),'status':e.status,'code':e.code,'detail':e.detail,'instance':request.url.path},status_code=e.status,media_type='application/problem+json',headers={'Retry-After':'1'} if e.status==429 else None)
    @app.exception_handler(RequestValidationError)
    async def validation(request,e):return await problem(request,Problem(422,'schema_invalid' if request.url.path.endswith('/ingest/frames') else 'validation_error'))
    @app.exception_handler(SQLAlchemyError)
    async def unavailable(request,e):return await problem(request,Problem(503,'db_unavailable'))
    @app.middleware('http')
    async def security(request,call_next):
        if request.method in ('POST','PUT','PATCH','DELETE') and request.url.path.startswith('/api/v1/') and not request.url.path.endswith('/ingest/frames'):
            if request.headers.get('X-Requested-With')!='hww' or not request.headers.get('Content-Type','').startswith('application/json'):return await problem(request,Problem(403,'forbidden','JSON and X-Requested-With: hww are required'))
        response=await call_next(request);response.headers.update({'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Strict-Transport-Security':'max-age=31536000; includeSubDomains'})
        if response.headers.get('Content-Type','').startswith('text/html'):response.headers['Content-Security-Policy']="default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://tile.openstreetmap.org; connect-src 'self'; frame-ancestors 'self'"
        return response
    def current(request,role=None):
        token=request.cookies.get('hww_session');user=None
        if token:
            try:
                claims=jwt.decode(token,secret,algorithms=['HS256'],options={'require':['exp','sub','jti']})
                with service.DB() as db:user=db.get(User,claims['sub'])
                if user and not user.is_active:user=None
            except jwt.InvalidTokenError:pass
        if role and not user:raise Problem(401,'unauthenticated')
        if role and ['operator','reviewer','admin'].index(user.role)<['operator','reviewer','admin'].index(role):raise Problem(403,'forbidden')
        return user
    def page(items,request):
        try:limit=min(100,max(1,int(request.query_params.get('limit',50))));offset=int(request.query_params.get('cursor',0))
        except ValueError:raise Problem(422,'validation_error')
        return dict(items=items[offset:offset+limit],total=len(items),next_cursor=str(offset+limit) if offset+limit<len(items) else None,is_simulated=True)
    async def payload(request):
        try:
            body=await request.json()
            if not isinstance(body,dict):raise ValueError()
            return body
        except (ValueError,UnicodeError):raise Problem(422,'validation_error')
    def parse_range(request):
        try:
            end=dt(request.query_params['to']) if 'to' in request.query_params else now();start=dt(request.query_params['from']) if 'from' in request.query_params else end-timedelta(hours=1)
            if start.tzinfo is None or end.tzinfo is None or end<=start or end-start>timedelta(days=7):raise ValueError()
            return start,end
        except (ValueError,TypeError):raise Problem(422,'range_too_large')
    @app.get('/api/v1/health')
    def health():
        with service.DB() as db:db.execute(text('SELECT 1'))
        return {'status':'ok','db':'ok','app_version':'1.0.0','uptime_s':time.monotonic()-started,'ingest_enabled':os.getenv('INGEST_ENABLED','true').lower()=='true','is_simulated':True}
    @app.get('/api/v1/meta')
    def meta():return dict(app_version='1.0.0',version='1.0.0',features={'sse':False},languages=['en','vi'],model={'glb_path':'/models/station-v1.glb','version':1},api_version='v1',registry_version=1,server_time=stamp(),frame_interval_ms=int(os.getenv('FRAME_INTERVAL_MS','2000')),offline_after_s=int(os.getenv('OFFLINE_AFTER_S','15')),session_end_after_s=int(os.getenv('SESSION_END_AFTER_S','60')),wokwi_project_url=os.getenv('WOKWI_PROJECT_URL') or None,sse_enabled=False,is_simulated=True)
    def metadata(st):return {**st.registry['station'],'lifecycle':st.lifecycle,'sensors':[{**s,**service.types[s['channel']]} for s in st.registry['sensors']],'model':st.registry['model'],'device':st.registry.get('device'),'registry_version':st.registry['registry_version'],'is_simulated':True}
    @app.get('/api/v1/stations')
    def stations():
        with service.DB() as db:return {'items':[metadata(s) for s in db.scalars(select(Station).where(Station.lifecycle != 'archived').order_by(Station.code))],'is_simulated':True}
    @app.get('/api/v1/stations/{code}')
    def station(code):
        with service.DB() as db:return metadata(service.station(db,code))
    @app.get('/api/v1/stations/{code}/state')
    def state(code,request:Request):
        snapshot=service.snapshot(code);etag='W/"'+code+':'+str(snapshot['version'])+'"';headers={'ETag':etag,'Cache-Control':'no-cache'}
        if request.headers.get('If-None-Match')==etag:return Response(status_code=304,headers=headers)
        return JSONResponse(snapshot,headers=headers)
    @app.post('/api/v1/ingest/frames')
    async def ingest(request:Request):
        maximum=int(os.getenv('INGEST_MAX_BYTES','65536'))
        try:
            if int(request.headers.get('Content-Length','0'))>maximum:raise Problem(413,'payload_too_large')
        except ValueError:raise Problem(422,'schema_invalid')
        body=bytearray()
        async for chunk in request.stream():
            body.extend(chunk)
            if len(body)>maximum:raise Problem(413,'payload_too_large')
        if os.getenv('INGEST_ENABLED','true').lower()!='true':raise Problem(503,'ingest_disabled')
        key=request.headers.get('X-Device-Key','');ip=request.client.host if request.client else 'unknown'
        if not testing:
            at = time.monotonic()
            burst = float(os.getenv('INGEST_BURST','10'))
            rate = float(os.getenv('INGEST_RATE_PER_S','2'))
            balances = {}
            for k in ('key:'+key[:8],'ip:'+ip):
                tokens,last = limits.get(k,(burst,at))
                balances[k] = min(burst,tokens+(at-last)*rate)
            if min(balances.values()) < 1:
                raise Problem(429,'rate_limited')
            limits.update({k:(tokens-1,at) for k,tokens in balances.items()})
        try:raw=json.loads(body)
        except (ValueError,UnicodeError):raise Problem(422,'schema_invalid')
        device=service.authenticate(key,raw.get('station_code') if isinstance(raw,dict) else None)
        try:batch=Batch.model_validate(raw)
        except ValueError:raise Problem(422,'schema_invalid')
        if len(batch.frames)>int(os.getenv('INGEST_MAX_FRAMES','50')):raise Problem(422,'schema_invalid')
        return await asyncio.to_thread(service.ingest,batch,device)
    @app.get('/api/v1/stations/{code}/measurements')
    def history(code,request:Request,channel:str):
        start,end=parse_range(request);bucket=request.query_params.get('bucket','auto');seconds=(end-start).total_seconds()
        if channel not in service.types:raise Problem(422,'unknown_channel')
        if bucket=='auto':bucket='raw' if seconds<=900 else '10s' if seconds<=3600 else '1m' if seconds<=21600 else '5m' if seconds<=86400 else '1h'
        width={'raw':0,'10s':10,'1m':60,'5m':300,'1h':3600}.get(bucket)
        if width is None:raise Problem(422,'validation_error')
        with service.DB() as db:
            service.station(db,code);rows=db.scalars(select(Measurement).where(Measurement.sensor==code+':'+channel,Measurement.measured_at>=stamp(start),Measurement.measured_at<=stamp(end)).order_by(Measurement.measured_at)).all();groups=collections.defaultdict(list)
            for r in rows:
                key=stamp(datetime.fromtimestamp(int(dt(r.measured_at).timestamp()//width)*width,tz=now().tzinfo)) if width else r.measured_at;groups[key].append(r)
            if len(groups)>5000:raise Problem(422,'range_too_large')
            points=[]
            for t,items in groups.items():
                vals=[x.value for x in items if x.quality=='ok'];points.append(dict(t=t,v=sum(vals)/len(vals) if vals else None,min=min(vals) if vals else None,max=max(vals) if vals else None,n=len(vals),faults=sum(x.quality!='ok' for x in items)))
            return dict(station_code=code,channel=channel,unit=service.types[channel]['unit'],decimals=service.types[channel]['decimals'],bucket=bucket,**{'from':stamp(start),'to':stamp(end)},points=points,is_simulated=True)
    @app.get('/api/v1/stations/{code}/timeline')
    def timeline(code,request:Request):
        start,end=parse_range(request);types=request.query_params.get('types','').split(',')
        with service.DB() as db:
            service.station(db,code);rows=db.scalars(select(Event).where(Event.station==code,Event.at>=stamp(start),Event.at<=stamp(end)).order_by(Event.at.desc(),Event.id.desc())).all();rows=[e for e in rows if e.type not in ('note','acknowledged','review_started','review_submitted') and (types==[''] or e.type in types)]
            received=db.scalar(select(func.count()).select_from(FrameRow).join(Session,FrameRow.session==Session.id).where(Session.station==code,FrameRow.measured_at>=stamp(start),FrameRow.measured_at<=stamp(end)));expected=int((end-start).total_seconds()*1000/int(os.getenv('FRAME_INTERVAL_MS','2000')))
            result=page([dict(at=e.at,type=e.type,sensor_uid=e.sensor,data=e.data) for e in rows],request);result['availability']={'from':stamp(start),'to':stamp(end),'expected_frames':expected,'received_frames':received,'pct':min(100,round(received/expected*100,1)) if expected else None};return result
    @app.get('/api/v1/stations/{code}/link')
    def link(code):
        with service.DB() as db:
            st=service.station(db,code);s=db.get(Session,st.current_session) if st.current_session else None;age=(now()-dt(st.last_frame)).total_seconds() if st.last_frame else 1e9;age*=s.speed if s and s.source=='simulated_replay' and not s.ended_at else 1;failures=[t for t in service.auth_failures.get(code,[]) if (now()-t).total_seconds()<60];service.auth_failures[code]=failures
            status='rejected' if failures else 'waiting' if not s else 'replay' if s.source=='simulated_replay' and not s.ended_at else 'receiving' if age<6 else 'delayed' if age<15 else 'offline'
            return dict(station_code=code,link_status=status,session=service.session_dict(s) if s else None,last_frame_received_at=st.last_frame,diag=s.last_diag if s else None,last_error={'code':'invalid_device_key'} if failures else None,recent_auth_failures=len(failures),last_batch=s.last_batch if s else None,is_simulated=True)
    @app.get('/api/v1/rules')
    def rules():
        with service.DB() as db:return dict(items=[r.data for r in db.scalars(select(Rule))],is_simulated=True)
    @app.get('/api/v1/alerts')
    def alerts(request:Request):
        with service.DB() as db:
            q=select(Alert).order_by(Alert.id.desc());p=request.query_params
            for param,col in [('station',Alert.station),('severity',Alert.severity),('category',Alert.category),('evidence_class',Alert.evidence_class),('rule',Alert.rule_code)]:
                if p.get(param):q=q.where(col==p[param])
            if p.get('review_status'):q=q.where(Alert.review_status.in_(p['review_status'].split(',')))
            if p.get('channel'):q=q.where(Alert.sensor.like('%:'+p['channel']))
            if p.get('active') in ('true','false'):q=q.where(Alert.cleared_at.is_(None) if p['active']=='true' else Alert.cleared_at.is_not(None))
            if p.get('from'):q=q.where(Alert.opened_at>=stamp(dt(p['from'])))
            if p.get('to'):q=q.where(Alert.opened_at<=stamp(dt(p['to'])))
            return page([service.alert_dict(db,a) for a in db.scalars(q)],request)
    def alert_detail(db,a,staff):
        if not a:raise Problem(404,'not_found')
        data=service.alert_dict(db,a);events=db.scalars(select(Event).where(Event.alert_id==a.id).order_by(Event.id)).all();s=db.get(Session,a.session) if a.session else None
        data.update(baseline_value=a.baseline_value,threshold_value=a.threshold_value,params_snapshot=a.params_snapshot,basis_snapshot=a.basis_snapshot,session=service.session_dict(s) if s else None,events=[{'type':e.type,'at':e.at,**({'actor':e.actor,'data':e.data} if staff else {'data':{k:v for k,v in (e.data or {}).items() if k!='note'}})} for e in events if staff or e.type!='note'],review=review_dict(db.get(Review,a.review_id),False) if a.review_id else None,related_alert_ids=list(db.scalars(select(Alert.id).where(Alert.session==a.session,Alert.id!=a.id,Alert.opened_at>=stamp(dt(a.opened_at)-timedelta(minutes=5)),Alert.opened_at<=stamp(dt(a.opened_at)+timedelta(minutes=5))))));return data
    @app.get('/api/v1/alerts/{id}')
    def alert(id:int,request:Request):
        with service.DB() as db:return alert_detail(db,db.get(Alert,id),current(request))
    @app.post('/api/v1/alerts/{id}/acknowledge')
    async def acknowledge(id:int,request:Request):
        user=current(request,'operator');body=await payload(request)
        with service.lock,service.DB.begin() as db:
            a=db.get(Alert,id)
            if not a:raise Problem(404,'not_found')
            if a.review_status!='open':raise Problem(409,'invalid_transition')
            note=body.get('note','')
            if not isinstance(note,str) or len(note)>2000:raise Problem(422,'validation_error')
            a.review_status='acknowledged';service.bump_snapshot(db,a.station);service.event(db,a.station,'acknowledged',{'note':note},a.sensor,a.id,user.username);db.flush();return alert_detail(db,a,user)
    @app.post('/api/v1/alerts/{id}/notes',status_code=201)
    async def note(id:int,request:Request):
        user=current(request,'operator');body=await payload(request);note=body.get('text')
        if not isinstance(note,str) or not 1<=len(note)<=2000:raise Problem(422,'validation_error')
        with service.DB.begin() as db:
            a=db.get(Alert,id)
            if not a:raise Problem(404,'not_found')
            t=stamp();service.event(db,a.station,'note',{'note':note},a.sensor,a.id,user.username,at=t);return {'event':{'type':'note','at':t,'actor':user.username,'data':{'note':note}},'is_simulated':True}
    @app.post('/api/v1/auth/login')
    async def login(request:Request,response:Response):
        body=await payload(request);username=body.get('username','');password=body.get('password','')
        if not isinstance(username,str) or not isinstance(password,str) or not 1<=len(username)<=200 or not 1<=len(password)<=2000:raise Problem(422,'validation_error')
        key=(request.client.host,username);attempts=[x for x in login_limits.get(key,[]) if time.monotonic()-x<60]
        if len(attempts)>=5:raise Problem(429,'rate_limited')
        login_limits[key]=attempts+[time.monotonic()]
        with service.DB.begin() as db:
            user=db.get(User,username)
            try:valid=user and user.is_active and PasswordHasher().verify(user.password_hash,password)
            except (VerificationError,TypeError):valid=False
            if not valid:raise Problem(401,'invalid_credentials')
            user.last_login_at=stamp();ttl=int(os.getenv('SESSION_TTL_MIN','480'))*60;token=jwt.encode({'sub':user.username,'role':user.role,'exp':now()+timedelta(seconds=ttl),'jti':os.urandom(16).hex()},secret,algorithm='HS256');response.set_cookie('hww_session',token,max_age=ttl,httponly=True,secure=os.getenv('COOKIE_SECURE','true').lower()=='true',samesite='strict',path='/api')
            return {'user':{'username':user.username,'display_name':user.display_name,'role':user.role},'is_simulated':True}
    @app.get('/api/v1/auth/me')
    def me(request:Request):
        user=current(request,'operator');return {'user':{'username':user.username,'display_name':user.display_name,'role':user.role},'is_simulated':True}
    @app.post('/api/v1/auth/logout',status_code=204)
    def logout(request:Request,response:Response):
        current(request,'operator');response.status_code=204;response.delete_cookie('hww_session',path='/api',secure=os.getenv('COOKIE_SECURE','true').lower()=='true',httponly=True,samesite='strict');return response
    @app.get('/api/v1/sessions')
    def sessions(request:Request):
        with service.DB() as db:
            q=select(Session).order_by(Session.started_at.desc())
            if request.query_params.get('station'):q=q.where(Session.station==request.query_params['station'])
            if request.query_params.get('source'):q=q.where(Session.source==request.query_params['source'])
            return page([service.session_dict(s) for s in db.scalars(q)],request)
    @app.get('/api/v1/sessions/{id}')
    def session(id:str):
        with service.DB() as db:
            s=db.get(Session,id)
            if not s:raise Problem(404,'not_found')
            return {**service.session_dict(s),'last_diag':s.last_diag,'alert_ids':list(db.scalars(select(Alert.id).where(Alert.session==id))),'is_simulated':True}
    @app.get('/api/v1/sessions/{id}/frames.jsonl')
    def export(id:str,request:Request):
        current(request,'operator')
        with service.DB() as db:
            s=db.get(Session,id)
            if not s:raise Problem(404,'not_found')
            rows=db.scalars(select(FrameRow).where(FrameRow.session==id).order_by(FrameRow.seq)).all();body=''.join(json.dumps({'t_offset_ms':max(0,int((dt(r.measured_at)-dt(s.started_at)).total_seconds()*1000)),'frames':[r.payload]})+'\n' for r in rows);return Response(body,media_type='application/x-ndjson')
    def review_dict(r,staff=True):
        if not r:raise Problem(404,'not_found')
        return dict(id=r.id,status=r.status,alert_ids=r.alert_ids,**({'created_by':r.created_by,'note':r.note,'lab_reference':r.lab_reference} if staff else {}),started_at=r.started_at,submitted_at=r.submitted_at,outcome=r.outcome,is_simulated=True)
    def review_owner(r,user):
        if not r:raise Problem(404,'not_found')
        if r.created_by!=user.username and user.role!='admin':raise Problem(403,'forbidden')
        if r.status!='in_progress':raise Problem(409,'invalid_transition')
    @app.get('/api/v1/incident-reviews')
    def reviews(request:Request):
        current(request,'operator')
        with service.DB() as db:
            rows=list(db.scalars(select(Review).order_by(Review.id.desc())))
            if request.query_params.get('status'):rows=[r for r in rows if r.status==request.query_params['status']]
            return page([review_dict(r) for r in rows],request)
    @app.post('/api/v1/incident-reviews',status_code=201)
    async def new_review(request:Request):
        user=current(request,'reviewer');body=await payload(request);ids=body.get('alert_ids',[])
        if not isinstance(ids,list) or not ids or any(type(i)!=int or i<1 for i in ids) or len(ids)!=len(set(ids)) or len(ids)>100:raise Problem(422,'validation_error')
        with service.lock,service.DB.begin() as db:
            alerts=[db.get(Alert,id) for id in ids]
            if any(a is None for a in alerts):raise Problem(404,'not_found')
            if any(a.review_status not in ('open','acknowledged') or a.review_id for a in alerts):raise Problem(409,'invalid_transition')
            r=Review(alert_ids=ids,created_by=user.username,started_at=stamp(),note=body.get('note',''));db.add(r);db.flush()
            for a in alerts:a.review_status='under_review';a.review_id=r.id;service.event(db,a.station,'review_started',{'review_id':r.id},a.sensor,a.id,user.username)
            for code in {a.station for a in alerts}:service.bump_snapshot(db,code)
            return review_dict(r)
    @app.get('/api/v1/incident-reviews/{id}')
    def review(id:int,request:Request):
        current(request,'operator')
        with service.DB() as db:return review_dict(db.get(Review,id))
    @app.patch('/api/v1/incident-reviews/{id}')
    async def edit_review(id:int,request:Request):
        user=current(request,'reviewer');body=await payload(request)
        with service.lock,service.DB.begin() as db:
            r=db.get(Review,id);review_owner(r,user);ids=list(r.alert_ids);affected=set()
            for aid in body.get('remove_alert_ids',[]):
                if aid not in ids:raise Problem(409,'invalid_transition')
                a=db.get(Alert,aid);affected.add(a.station);a.review_id=None;a.review_status='acknowledged';ids.remove(aid)
            for aid in body.get('add_alert_ids',[]):
                a=db.get(Alert,aid)
                if not a:raise Problem(404,'not_found')
                if a.review_id or a.review_status not in ('open','acknowledged'):raise Problem(409,'invalid_transition')
                affected.add(a.station);a.review_id=id;a.review_status='under_review';ids.append(aid)
            if not ids:raise Problem(422,'validation_error')
            r.alert_ids=ids;r.note=body.get('note',r.note)
            for code in affected:service.bump_snapshot(db,code)
            return review_dict(r)
    @app.post('/api/v1/incident-reviews/{id}/submit')
    async def submit_review(id:int,request:Request):
        user=current(request,'reviewer');body=await payload(request);outcome=body.get('outcome')
        if outcome not in ('confirmed_simulated_anomaly','sensor_or_equipment_fault','false_positive','test_or_calibration'):raise Problem(422,'outcome_not_allowed','Simulated observations cannot verify a field incident')
        with service.lock,service.DB.begin() as db:
            r=db.get(Review,id);review_owner(r,user);r.status='submitted';r.outcome=outcome;r.note=body.get('note',r.note);r.lab_reference=body.get('lab_reference');r.submitted_at=stamp()
            for aid in r.alert_ids:
                a=db.get(Alert,aid);a.review_status='closed';a.is_preliminary=False;a.outcome=outcome;service.event(db,a.station,'review_submitted',{'review_id':id,'outcome':outcome},a.sensor,a.id,user.username);service.event(db,a.station,'alert_closed',{'alert_id':aid},a.sensor,a.id,user.username)
            for code in {db.get(Alert,aid).station for aid in r.alert_ids}:service.bump_snapshot(db,code)
            return {**review_dict(r),'alerts':[service.alert_dict(db,db.get(Alert,aid)) for aid in r.alert_ids]}
    @app.post('/api/v1/admin/devices/{code}/rotate-key')
    def rotate(code,request:Request,response:Response):
        current(request,'admin');response.headers['Cache-Control']='no-store';return service.rotate_key(code)
    @app.put('/api/v1/admin/rules/{code}')
    async def edit_rule(code,request:Request):
        current(request,'admin');body=await payload(request)
        with service.DB.begin() as db:
            r=db.get(Rule,code)
            if not r:raise Problem(404,'not_found')
            if set(body)-{'enabled','severity','params','persistence','clear_persistence','basis_status','basis_reference'}:raise Problem(422,'validation_error')
            data={**r.data,**body}
            if data['severity'] not in ('info','warning','critical') or data['basis_status'] not in ('unverified','verified','not_applicable') or any(type(data[k])!=int or not 1<=data[k]<=100 for k in ('persistence','clear_persistence')) or type(data['enabled'])!=bool:raise Problem(422,'validation_error')
            if set(data['params'])!=set(r.data['params']) or any(type(v) not in (float,int) or not 0<=v<10000 for v in data['params'].values()):raise Problem(422,'validation_error')
            if code=='REF_PH_BAND' and data['params']['min']>=data['params']['max']:raise Problem(422,'validation_error')
            if data['basis_status']=='verified' and not data.get('basis_reference'):raise Problem(422,'validation_error')
            r.data=data;return {**data,'is_simulated':True}
    @app.post('/api/v1/admin/demo-reset',status_code=202)
    async def reset(request:Request):
        current(request,'admin');body=await payload(request)
        if os.getenv('DEMO_MODE','true').lower()!='true':raise Problem(403,'forbidden')
        if body.get('confirm')!='RESET':raise Problem(422,'validation_error')
        async with replay_control:
            restart_tickets.clear()
            stopped=list(runs.values())
            for task in stopped:task.cancel()
            await asyncio.gather(*stopped,return_exceptions=True)
            runs.clear()
            with service.lock,service.DB.begin() as db:
                quality_events = select(Notification.id).where(Notification.kind == 'water_quality')
                db.execute(delete(NotificationDelivery).where(NotificationDelivery.notification_id.in_(quality_events)))
                db.execute(delete(Notification).where(Notification.kind == 'water_quality'))
                db.execute(delete(WaterCondition))
                counts={name:db.scalar(select(func.count()).select_from(model)) for name,model in [('sessions',Session),('frames',FrameRow),('measurements',Measurement),('alerts',Alert)]};db.execute(delete(Event));db.execute(delete(Measurement));db.execute(delete(Alert));db.execute(delete(Review));db.execute(delete(FrameRow));db.execute(delete(Session))
                for s in db.scalars(select(Sensor)):s.value=None;s.measured_at=None;s.received_at=None;s.quality=None;s.gen=None;s.fault_reason=None;s.status='unavailable';s.status_since=stamp();s.last_valid_at=None;s.last_valid_value=None;s.rule_state={};s.historical_rule_state={}
                for s in db.scalars(select(Station)):s.version+=1;s.status='unavailable';s.status_since=stamp();s.active_device=None;s.current_session=None;s.last_frame=None;s.last_measured=None
                return {'deleted':counts,'is_simulated':True}
    def replay_catalog():
        result=[]
        for path in sorted((ROOT/'shared/fixtures/replays').glob('*.jsonl')):
            content=path.read_bytes();lines=[json.loads(x) for x in content.decode('utf-8-sig').splitlines() if x.strip()];duration=max((x.get('t_offset_ms',0) for x in lines),default=0)/1000;result.append(dict(name=path.stem,description={'en':'Deterministic simulated recording','vi':'Bản ghi mô phỏng'},frame_count=sum(len(x.get('frames',[x.get('frame')])) for x in lines),duration_s=duration,sha256=hashlib.sha256(content).hexdigest()))
        return result
    @app.get('/api/v1/replays')
    def replays(request:Request):
        current(request,'operator');return {'items':replay_catalog(),'is_simulated':True}
    def finish_replay(session_id, reason):
        with service.lock,service.DB.begin() as db:
            session = db.get(Session, session_id)
            if session and not session.ended_at:
                station = service.station(db, session.station, True)
                session.ended_at = stamp()
                session.end_reason = reason
                service.event(db,station.code,'session_ended',{'session_id':session_id,'reason':reason})
                service.event(db,station.code,'takeover_ended',{'session_id':session_id})
                if station.current_session == session_id:
                    station.active_device = None
                    station.version += 1
        runs.pop(session_id, None)

    async def cancel_replay(session_id, reason):
        task = runs.get(session_id)
        if task:
            task.cancel()
            await asyncio.gather(task, return_exceptions=True)
            # A task cancelled before its first instruction has no finally block.
            finish_replay(session_id, reason)

    async def start_replay(name,body,*,restart_of=None):
        async with replay_control:
            code = body.get('station_code')
            if not isinstance(code, str):
                raise Problem(422,'validation_error')
            if restart_of and restart_tickets.get(code) != restart_of:
                return None
            restart_tickets.pop(code, None)
            return await begin_replay(name,body,code)

    async def begin_replay(name,body,code):
        catalog={r['name']:r for r in replay_catalog()}
        if name not in catalog:raise Problem(404,'not_found')
        speed=body.get('speed',1)
        if type(speed)!=int or speed not in (1,2,5):raise Problem(422,'validation_error')
        takeover = body.get('takeover', False)
        loop = body.get('loop', False)
        if type(takeover) is not bool or type(loop) is not bool:
            raise Problem(422,'validation_error')
        lines=[json.loads(x) for x in (ROOT/'shared/fixtures/replays'/(name+'.jsonl')).read_text(encoding='utf-8-sig').splitlines() if x.strip()]
        if not lines:raise Problem(422,'validation_error')
        with service.DB() as db:
            station = service.station(db,code)
            if station.lifecycle != 'active':raise Problem(409,'station_inactive')
            if station.registry['station']['data_mode']=='planned':raise Problem(409,'station_busy')
            device = db.get(Device,'replay-'+code.lower())
            previous_id = station.current_session
        if takeover and previous_id:
            await cancel_replay(previous_id,'takeover')
        start=now();boot=os.urandom(4).hex()
        def envelope(frames):return {'schema':'hww.frames.v1','station_code':code,'device_code':device.code,'boot_id':boot,'fw_version':'replay-1','sent_at':stamp(),'sent_uptime_ms':max(f.get('uptime_ms',0) for f in frames),'diag':{},'frames':frames}
        first=json.loads(json.dumps(lines[0].get('frames',[lines[0].get('frame')])))
        for f in first:f['measured_at']=stamp(start);f['time_source']='server'
        with service.lock:
            service.ingest(Batch.model_validate(envelope(first)),device,start,speed,takeover=takeover,replay_name=name)
            with service.DB() as db:
                sid = service.station(db,code).current_session
        async def runner():
            reason='replay_finished'
            try:
                cycle=start
                for line in lines[1:]:
                    target=cycle+timedelta(milliseconds=line['t_offset_ms']/speed);await asyncio.sleep(max(0,(target-now()).total_seconds()));frames=json.loads(json.dumps(line.get('frames',[line.get('frame')])))
                    for f in frames:f['measured_at']=stamp(cycle+timedelta(milliseconds=f.get('uptime_ms',line['t_offset_ms'])/speed));f['time_source']='server'
                    # Join the write before cancellation can release the station.
                    write = asyncio.create_task(asyncio.to_thread(service.ingest,
                        Batch.model_validate(envelope(frames)),device,None,speed,expected_session=sid))
                    try:
                        await asyncio.shield(write)
                    except asyncio.CancelledError:
                        await asyncio.gather(write,return_exceptions=True)
                        raise
            except asyncio.CancelledError:reason='replay_stopped';raise
            except (Problem, SQLAlchemyError):reason='replay_failed';raise
            finally:
                finish_replay(sid,reason)
                if loop and reason=='replay_finished':
                    restart_tickets[code] = sid
                    track(asyncio.create_task(start_replay(name,body,restart_of=sid)))
        task=track(asyncio.create_task(runner()));runs[sid]=task
        return dict(session_id=sid,station_code=code,replay=name,started_at=stamp(start),expected_end_at=stamp(start+timedelta(seconds=catalog[name]['duration_s']/speed)),is_simulated=True)
    @app.post('/api/v1/replays/{name}/runs',status_code=202)
    async def run_replay(name,request:Request):current(request,'operator');return await start_replay(name,await payload(request))
    @app.post('/api/v1/replay-runs/{id}/stop')
    async def stop_replay(id,request:Request):
        current(request,'operator')
        async with replay_control:
            if id not in runs:raise Problem(404,'not_found')
            await cancel_replay(id,'replay_stopped')
            with service.DB() as db:return {**service.session_dict(db.get(Session,id)),'is_simulated':True}
    @app.get('/api/v1/stream')
    def stream():raise Problem(503,'sse_disabled','Polling is supported; SSE is deferred')
    notification_routes(app, service, current)
    from .admin import register_admin
    register_admin(app, service, current, payload, parse_range, metadata, replay_control,
                   restart_tickets, cancel_replay)
    @app.api_route('/{path:path}',methods=['GET','HEAD'],include_in_schema=False)
    def spa(path:str):
        if path.startswith('api/'):raise Problem(404,'not_found')
        dist=Path(os.getenv('FRONTEND_DIST',str(ROOT/'frontend/dist'))).resolve();file=(dist/path).resolve()
        if not file.is_relative_to(dist):raise Problem(404,'not_found')
        if file.is_file():return FileResponse(file,media_type='model/gltf-binary' if file.suffix=='.glb' else None)
        if path.startswith(('models/','assets/')):raise Problem(404,'not_found')
        if (dist/'index.html').exists():return FileResponse(dist/'index.html')
        raise Problem(404,'not_found','Build the frontend to serve the application')
    return app
