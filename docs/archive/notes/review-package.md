# Implementation review package
Base: 7b6098a30fc70cdfa43272c258934d8b6ce218b2
Uncommitted implementation snapshot. Review source behavior against docs/blueprint/01,04,05,06,07 and implementation reports.

diff --git a/.gitattributes b/.gitattributes
index dfe0770..31e275d 100644
--- a/.gitattributes
+++ b/.gitattributes
@@ -1,2 +1,6 @@
-# Auto detect text files and perform LF normalization
-* text=auto
+* text=auto eol=lf
+*.glb binary
+*.png binary
+*.pdf binary
+*.docx binary
+
diff --git a/README.md b/README.md
index baad640..51b0dba 100644
--- a/README.md
+++ b/README.md
@@ -1,2 +1,81 @@
-# CITP
-HanoiWaterWatch
+# Hanoi WaterWatch
+
+A simulated water-monitoring platform for the CITP final assignment. React presents a station map, monitoring dashboard, digital station model, preliminary alerts and staff review, and a simulation demonstration. FastAPI validates incoming device frames, stores measurements, evaluates rules, and provides the shared versioned station snapshot.
+
+**Simulated data.** All readings on this site come from a Wokwi electronics simulation or a recorded replay. They are not measurements of water in Hanoi. Station locations are illustrative.
+
+## Run locally on Windows
+
+Requires Python 3.10+ and Node.js 22+. Python 3.12 is used in the container.
+
+```powershell
+powershell -ExecutionPolicy Bypass -File scripts/dev.ps1 -Python "C:/path/to/python.exe"
+```
+
+The launcher creates a project virtual environment, installs dependencies, builds the frontend, migrates and seeds a local SQLite database, and starts the app at **http://127.0.0.1:8000**. It generates random local account passwords in the ignored `.env.local` file. Read that file privately to sign in; credentials are never included in source or shown in the application. Subsequent launches can use `-SkipInstall -SkipBuild` when dependencies and frontend source have not changed.
+
+SQLite supports local development without Docker. PostgreSQL 16 is the deployment database; PostgreSQL-specific deployment checks require a running database.
+
+## Run with PostgreSQL
+
+1. Start Docker Desktop.
+2. Copy `.env.example` to `.env`. Supply a random `POSTGRES_PASSWORD` and `JWT_SECRET`, and set staff usernames and passwords.
+3. For HTTP localhost development, set `COOKIE_SECURE=false`. Keep it `true` behind HTTPS in deployment.
+4. Run `docker compose up --build` and open **http://localhost:8000**.
+
+The image builds the React app and serves it from FastAPI. The API runs one worker to keep the freshness and replay tasks coordinated. The database volume persists across restarts. The app binds to loopback locally; production requires an HTTPS container host and a separately configured database.
+
+## Development
+
+```powershell
+# API (with environment variables loaded and backend dependencies installed)
+cd backend
+python -m uvicorn app.main:create_app --factory --host 127.0.0.1 --port 8000
+
+# In another terminal
+cd frontend
+npm ci
+npm run dev
+```
+
+Vite proxies `/api` to port 8000. Public pages need no account. Operators can acknowledge alerts and run replays; reviewers can classify simulated anomalies; admins manage rules and device keys.
+
+## Verify
+
+```powershell
+python -m pytest backend/tests -q
+python -m unittest discover -s tools/tests
+python scripts/test_contracts.py
+python scripts/generate_contracts.py --check
+cd frontend
+npm test
+npm run build
+```
+
+Run `python scripts/smoke.py` against a running production build. The CI workflow also migrates and seeds PostgreSQL and builds the Docker image.
+
+## Connect a simulated device
+
+Use the seed/key CLI in `backend/` to create a scoped key for `wokwi-esp32-01`:
+
+```powershell
+python -m app.cli devices rotate-key wokwi-esp32-01
+```
+
+Store the returned key privately. Follow [firmware setup](firmware/README.md) to configure the firmware or use the software-device CLI in [tools/sim_device.py](tools/sim_device.py). Wokwi needs a reachable HTTPS endpoint and a trusted root CA. Set `WOKWI_PROJECT_URL` when the hosted simulation exists. The application links to Wokwi; it does not embed it.
+
+The Simulation page provides operator-controlled replay takeover when Wokwi is unavailable. The Tô Lịch station uses a looping replay; the Nhuệ station is planned and remains unavailable.
+
+## Add the station model
+
+The supplied model belongs at `frontend/public/models/station-v1.glb`. See [model preparation](blender/README.md) for OBJ/MTL conversion and required node names. Until the model is supplied, the model page displays the functional 2D station schematic with the same readings and sensor selection.
+
+## Project documentation
+
+- [Implementation blueprint](docs/blueprint/README.md)
+- [Implementation plan](docs/superpowers/plans/2026-11-18-platform.md)
+- [Reviewed source documents](docs/reports/document-review.md)
+- [GitHub team workflow](GITHUB_TEAM_WORKFLOW.md)
+- [Verification and remaining external checks](docs/reports/verification.md)
+
+This build must be verified with the uploaded model, a published Wokwi project, and the chosen HTTPS deployment before claiming the blueprint's live-demo acceptance criteria.

--- /dev/null
+++ .github/workflows/ci.yml
@@ -0,0 +1,71 @@
+name: Verify platform
+on: [push, pull_request]
+permissions:
+  contents: read
+jobs:
+  backend:
+    runs-on: ubuntu-latest
+    services:
+      postgres:
+        image: postgres:16-alpine
+        env:
+          POSTGRES_DB: hww
+          POSTGRES_USER: hww
+          POSTGRES_PASSWORD: ci-only-ephemeral-password
+        ports: ["5432:5432"]
+        options: >-
+          --health-cmd "pg_isready -U hww -d hww"
+          --health-interval 5s --health-timeout 3s --health-retries 20
+    env:
+      DATABASE_URL: postgresql+psycopg://hww:ci-only-ephemeral-password@localhost:5432/hww
+      JWT_SECRET: ci-only-ephemeral-signing-secret-do-not-deploy
+      REPLAY_TLH_ENABLED: "false"
+      COOKIE_SECURE: "false"
+      PYTHONPATH: backend
+    steps:
+      - uses: actions/checkout@v4
+      - uses: actions/setup-python@v5
+        with:
+          python-version: "3.12"
+      - run: pip install -r backend/requirements.txt pytest httpx
+      - run: python -m pytest backend/tests -q
+      - run: python -m unittest discover -s tools/tests
+      - run: python scripts/test_contracts.py
+      - run: python scripts/generate_contracts.py --check
+      - run: python tools/check_registry.py
+      - name: Migrate and seed PostgreSQL
+        working-directory: backend
+        run: |
+          alembic upgrade head
+          python -m app.cli seed
+  frontend:
+    runs-on: ubuntu-latest
+    steps:
+      - uses: actions/checkout@v4
+      - uses: actions/setup-node@v4
+        with:
+          node-version: "22"
+          cache: npm
+          cache-dependency-path: frontend/package-lock.json
+      - run: npm ci
+        working-directory: frontend
+      - run: npm test
+        working-directory: frontend
+      - run: npm run build
+        working-directory: frontend
+  image:
+    runs-on: ubuntu-latest
+    needs: [backend, frontend]
+    steps:
+      - uses: actions/checkout@v4
+      - run: docker build -t hanoi-waterwatch:verify .
+  firmware:
+    runs-on: ubuntu-latest
+    steps:
+      - uses: actions/checkout@v4
+      - uses: actions/setup-python@v5
+        with:
+          python-version: "3.12"
+      - run: pip install platformio==6.2.0
+      - run: g++ -std=c++17 -Ifirmware/src firmware/test/native.cpp -o /tmp/hww-native && /tmp/hww-native
+      - run: pio run -d firmware -e esp32

--- /dev/null
+++ Dockerfile
@@ -0,0 +1,22 @@
+FROM node:22-bookworm-slim AS frontend
+WORKDIR /build/frontend
+COPY frontend/package*.json ./
+RUN npm ci
+COPY frontend/ ./
+RUN npm run build
+
+FROM python:3.12-slim AS runtime
+ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
+WORKDIR /app
+COPY backend/requirements.txt ./backend/requirements.txt
+RUN pip install --no-cache-dir -r backend/requirements.txt && useradd --create-home --uid 10001 hww
+COPY backend/ ./backend/
+COPY shared/ ./shared/
+COPY --from=frontend /build/frontend/dist ./frontend/dist
+ENV PYTHONPATH=/app/backend FRONTEND_DIST=/app/frontend/dist
+RUN mkdir -p /app/.local && chown -R hww:hww /app
+USER hww
+EXPOSE 8000
+HEALTHCHECK --interval=30s --timeout=5s --start-period=30s CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/api/v1/health', timeout=3)"
+CMD ["sh", "-c", "cd /app/backend && alembic upgrade head && python -m app.cli seed && uvicorn app.main:create_app --factory --host 0.0.0.0 --port 8000 --workers 1"]
+

--- /dev/null
+++ Makefile
@@ -0,0 +1,15 @@
+.PHONY: help dev test build seed gen
+help:
+	@echo "dev: Docker Compose; test: backend and frontend; build: frontend production bundle"
+dev:
+	docker compose up --build
+build:
+	cd frontend && npm ci && npm run build
+test:
+	cd backend && python -m pytest -q
+	cd frontend && npm test -- --run
+seed:
+	cd backend && python -m app.cli seed
+gen:
+	python tools/gen_registry.py
+

--- /dev/null
+++ backend/alembic.ini
@@ -0,0 +1,4 @@
+[alembic]
+script_location = %(here)s/alembic
+prepend_sys_path = %(here)s
+sqlalchemy.url = sqlite:///./waterwatch.db

--- /dev/null
+++ backend/alembic/env.py
@@ -0,0 +1,15 @@
+import os
+from alembic import context
+from sqlalchemy import create_engine
+from app.models import Base
+config=context.config
+url=os.getenv('DATABASE_URL',config.get_main_option('sqlalchemy.url')).replace('sqlite+aiosqlite:','sqlite:').replace('postgresql+asyncpg:','postgresql+psycopg:')
+if url.startswith('postgresql://'):url=url.replace('postgresql://','postgresql+psycopg://',1)
+if context.is_offline_mode():
+ context.configure(url=url,target_metadata=Base.metadata,literal_binds=True)
+ with context.begin_transaction():context.run_migrations()
+else:
+ engine=create_engine(url)
+ with engine.connect() as connection:
+  context.configure(connection=connection,target_metadata=Base.metadata,render_as_batch=engine.dialect.name=='sqlite')
+  with context.begin_transaction():context.run_migrations()

--- /dev/null
+++ backend/alembic/versions/0001_initial.py
@@ -0,0 +1,10 @@
+"""Initial durable platform schema, including episode and idempotency constraints."""
+from alembic import op
+from app.models import Base
+revision='0001_initial'
+down_revision=None
+branch_labels=None
+depends_on=None
+
+def upgrade():Base.metadata.create_all(bind=op.get_bind())
+def downgrade():raise RuntimeError('Forward-only project migration')

--- /dev/null
+++ backend/alembic/versions/0002_seed_rules.py
@@ -0,0 +1,16 @@
+"""Initial rule catalogue. Subsequent seeding preserves administrative edits."""
+from alembic import op
+from sqlalchemy.orm import Session
+from app.models import Rule
+from app.service import rule_defaults
+revision='0002_seed_rules'
+down_revision='0001_initial'
+branch_labels=None
+depends_on=None
+
+def upgrade():
+ with Session(op.get_bind()) as db:
+  for code,data in rule_defaults().items():
+   if not db.get(Rule,code):db.add(Rule(code=code,data=data))
+  db.flush()
+def downgrade():raise RuntimeError('Forward-only project migration')

--- /dev/null
+++ backend/alembic/versions/0003_historical_rules.py
@@ -0,0 +1,13 @@
+"""Persist isolated historical rule counters on existing development databases."""
+from alembic import op
+from sqlalchemy import inspect,Column
+from app.models import J
+revision='0003_historical_rules'
+down_revision='0002_seed_rules'
+branch_labels=None
+depends_on=None
+
+def upgrade():
+ if 'historical_rule_state' not in {c['name'] for c in inspect(op.get_bind()).get_columns('sensor_state')}:
+  op.add_column('sensor_state',Column('historical_rule_state',J,nullable=True))
+def downgrade():raise RuntimeError('Forward-only project migration')


--- /dev/null
+++ backend/app/cli.py
@@ -0,0 +1,8 @@
+import argparse,json,os
+from .service import Service
+
+def main():
+    parser=argparse.ArgumentParser();sub=parser.add_subparsers(dest='command',required=True);sub.add_parser('seed');devices=sub.add_parser('devices').add_subparsers(dest='action',required=True);rotate=devices.add_parser('rotate-key');rotate.add_argument('device_code');args=parser.parse_args();svc=Service(os.getenv('DATABASE_URL','sqlite:///./waterwatch.db'));svc.seed()
+    if args.command=='devices':print(json.dumps(svc.rotate_key(args.device_code)))
+    else:print('Registry, rules and configured demo users seeded; existing passwords and rule edits preserved.')
+if __name__=='__main__':main()

--- /dev/null
+++ backend/app/main.py
@@ -0,0 +1,394 @@
+import os,json,asyncio,collections,time,hashlib
+from contextlib import asynccontextmanager
+from datetime import timedelta,datetime
+from pathlib import Path
+from fastapi import FastAPI,Request,Response
+from fastapi.responses import JSONResponse,FileResponse
+from fastapi.exceptions import RequestValidationError
+from sqlalchemy import select,func,delete,text
+from sqlalchemy.exc import SQLAlchemyError
+from argon2.exceptions import VerificationError
+from argon2 import PasswordHasher
+import jwt
+from .service import Service,Problem,now,stamp,dt,ROOT
+from .schemas import Batch
+from .models import *
+
+def create_app(database_url=None,testing=False):
+    service=Service(database_url or os.getenv('DATABASE_URL','sqlite:///./waterwatch.db'),testing)
+    secret=os.getenv('JWT_SECRET','test-only-secret-32-characters-long' if testing else '')
+    if len(secret)<32: raise RuntimeError('JWT_SECRET must contain at least 32 characters')
+    runs={};tasks=set();limits={};login_limits={};started=time.monotonic()
+    def track(task):
+        tasks.add(task);task.add_done_callback(tasks.discard);return task
+    async def monitor():
+        last_purge=None
+        while True:
+            await asyncio.sleep(1)
+            try:
+                await asyncio.to_thread(service.freshness)
+                ict=now()+timedelta(hours=7)
+                if ict.hour==3 and last_purge!=ict.date():
+                    await asyncio.to_thread(service.purge);last_purge=ict.date()
+            except SQLAlchemyError:pass
+    @asynccontextmanager
+    async def lifespan(app):
+        service.seed()
+        if not testing:
+            track(asyncio.create_task(monitor()))
+            if os.getenv('REPLAY_TLH_ENABLED','true').lower()=='true' and (ROOT/'shared/fixtures/replays/tlh-loop.jsonl').exists():await start_replay('tlh-loop',{'station_code':'HWW-TLH-001','speed':1,'takeover':True,'loop':True})
+        yield
+        for task in list(tasks):task.cancel()
+        await asyncio.gather(*tasks,return_exceptions=True);service.engine.dispose()
+    app=FastAPI(title='Hanoi WaterWatch',version='1.0.0',lifespan=lifespan,openapi_url='/api/v1/openapi.json',docs_url='/api/docs');app.state.service=service
+    @app.exception_handler(Problem)
+    async def problem(request,e):
+        return JSONResponse({'type':os.getenv('PUBLIC_BASE_URL','')+'/problems/'+e.code,'title':e.code.replace('_',' ').title(),'status':e.status,'code':e.code,'detail':e.detail,'instance':request.url.path},status_code=e.status,media_type='application/problem+json',headers={'Retry-After':'1'} if e.status==429 else None)
+    @app.exception_handler(RequestValidationError)
+    async def validation(request,e):return await problem(request,Problem(422,'schema_invalid' if request.url.path.endswith('/ingest/frames') else 'validation_error'))
+    @app.exception_handler(SQLAlchemyError)
+    async def unavailable(request,e):return await problem(request,Problem(503,'db_unavailable'))
+    @app.middleware('http')
+    async def security(request,call_next):
+        if request.method in ('POST','PUT','PATCH','DELETE') and request.url.path.startswith('/api/v1/') and not request.url.path.endswith('/ingest/frames'):
+            if request.headers.get('X-Requested-With')!='hww' or not request.headers.get('Content-Type','').startswith('application/json'):return await problem(request,Problem(403,'forbidden','JSON and X-Requested-With: hww are required'))
+        response=await call_next(request);response.headers.update({'X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','Strict-Transport-Security':'max-age=31536000; includeSubDomains'})
+        if response.headers.get('Content-Type','').startswith('text/html'):response.headers['Content-Security-Policy']="default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://tile.openstreetmap.org; connect-src 'self'; frame-ancestors 'none'"
+        return response
+    def current(request,role=None):
+        token=request.cookies.get('hww_session');user=None
+        if token:
+            try:
+                claims=jwt.decode(token,secret,algorithms=['HS256'],options={'require':['exp','sub','jti']})
+                with service.DB() as db:user=db.get(User,claims['sub'])
+                if user and not user.is_active:user=None
+            except jwt.InvalidTokenError:pass
+        if role and not user:raise Problem(401,'unauthenticated')
+        if role and ['operator','reviewer','admin'].index(user.role)<['operator','reviewer','admin'].index(role):raise Problem(403,'forbidden')
+        return user
+    def page(items,request):
+        try:limit=min(100,max(1,int(request.query_params.get('limit',50))));offset=int(request.query_params.get('cursor',0))
+        except ValueError:raise Problem(422,'validation_error')
+        return dict(items=items[offset:offset+limit],total=len(items),next_cursor=str(offset+limit) if offset+limit<len(items) else None,is_simulated=True)
+    async def payload(request):
+        try:
+            body=await request.json()
+            if not isinstance(body,dict):raise ValueError()
+            return body
+        except (ValueError,UnicodeError):raise Problem(422,'validation_error')
+    def parse_range(request):
+        try:
+            end=dt(request.query_params['to']) if 'to' in request.query_params else now();start=dt(request.query_params['from']) if 'from' in request.query_params else end-timedelta(hours=1)
+            if start.tzinfo is None or end.tzinfo is None or end<=start or end-start>timedelta(days=7):raise ValueError()
+            return start,end
+        except (ValueError,TypeError):raise Problem(422,'range_too_large')
+    @app.get('/api/v1/health')
+    def health():
+        with service.DB() as db:db.execute(text('SELECT 1'))
+        return {'status':'ok','db':'ok','app_version':'1.0.0','uptime_s':time.monotonic()-started,'ingest_enabled':os.getenv('INGEST_ENABLED','true').lower()=='true','is_simulated':True}
+    @app.get('/api/v1/meta')
+    def meta():return dict(app_version='1.0.0',version='1.0.0',features={'sse':False},languages=['en','vi'],model={'glb_path':'/models/station-v1.glb','version':1},api_version='v1',registry_version=1,server_time=stamp(),frame_interval_ms=int(os.getenv('FRAME_INTERVAL_MS','2000')),offline_after_s=int(os.getenv('OFFLINE_AFTER_S','15')),session_end_after_s=int(os.getenv('SESSION_END_AFTER_S','60')),wokwi_project_url=os.getenv('WOKWI_PROJECT_URL') or None,sse_enabled=False,is_simulated=True)
+    def metadata(st):return {**st.registry['station'],'sensors':[{**s,**service.types[s['channel']]} for s in st.registry['sensors']],'model':st.registry['model'],'device':st.registry.get('device'),'registry_version':st.registry['registry_version'],'is_simulated':True}
+    @app.get('/api/v1/stations')
+    def stations():
+        with service.DB() as db:return {'items':[metadata(s) for s in db.scalars(select(Station).order_by(Station.code))],'is_simulated':True}
+    @app.get('/api/v1/stations/{code}')
+    def station(code):
+        with service.DB() as db:return metadata(service.station(db,code))
+    @app.get('/api/v1/stations/{code}/state')
+    def state(code,request:Request):
+        snapshot=service.snapshot(code);etag='W/"'+code+':'+str(snapshot['version'])+'"';headers={'ETag':etag,'Cache-Control':'no-cache'}
+        if request.headers.get('If-None-Match')==etag:return Response(status_code=304,headers=headers)
+        return JSONResponse(snapshot,headers=headers)
+    @app.post('/api/v1/ingest/frames')
+    async def ingest(request:Request):
+        maximum=int(os.getenv('INGEST_MAX_BYTES','65536'))
+        try:
+            if int(request.headers.get('Content-Length','0'))>maximum:raise Problem(413,'payload_too_large')
+        except ValueError:raise Problem(422,'schema_invalid')
+        body=bytearray()
+        async for chunk in request.stream():
+            body.extend(chunk)
+            if len(body)>maximum:raise Problem(413,'payload_too_large')
+        if os.getenv('INGEST_ENABLED','true').lower()!='true':raise Problem(503,'ingest_disabled')
+        key=request.headers.get('X-Device-Key','');ip=request.client.host if request.client else 'unknown'
+        if not testing:
+            for k in ('key:'+key[:8],'ip:'+ip):
+                tokens,last=limits.get(k,(float(os.getenv('INGEST_BURST','10')),time.monotonic()));tokens=min(float(os.getenv('INGEST_BURST','10')),tokens+(time.monotonic()-last)*float(os.getenv('INGEST_RATE_PER_S','2')));limits[k]=(tokens-1,time.monotonic())
+                if tokens<1:raise Problem(429,'rate_limited')
+        try:raw=json.loads(body)
+        except (ValueError,UnicodeError):raise Problem(422,'schema_invalid')
+        device=service.authenticate(key,raw.get('station_code') if isinstance(raw,dict) else None)
+        try:batch=Batch.model_validate(raw)
+        except ValueError:raise Problem(422,'schema_invalid')
+        if len(batch.frames)>int(os.getenv('INGEST_MAX_FRAMES','50')):raise Problem(422,'schema_invalid')
+        return await asyncio.to_thread(service.ingest,batch,device)
+    @app.get('/api/v1/stations/{code}/measurements')
+    def history(code,request:Request,channel:str):
+        start,end=parse_range(request);bucket=request.query_params.get('bucket','auto');seconds=(end-start).total_seconds()
+        if channel not in service.types:raise Problem(422,'unknown_channel')
+        if bucket=='auto':bucket='raw' if seconds<=900 else '10s' if seconds<=3600 else '1m' if seconds<=21600 else '5m' if seconds<=86400 else '1h'
+        width={'raw':0,'10s':10,'1m':60,'5m':300,'1h':3600}.get(bucket)
+        if width is None:raise Problem(422,'validation_error')
+        with service.DB() as db:
+            service.station(db,code);rows=db.scalars(select(Measurement).where(Measurement.sensor==code+':'+channel,Measurement.measured_at>=stamp(start),Measurement.measured_at<=stamp(end)).order_by(Measurement.measured_at)).all();groups=collections.defaultdict(list)
+            for r in rows:
+                key=stamp(datetime.fromtimestamp(int(dt(r.measured_at).timestamp()//width)*width,tz=now().tzinfo)) if width else r.measured_at;groups[key].append(r)
+            if len(groups)>5000:raise Problem(422,'range_too_large')
+            points=[]
+            for t,items in groups.items():
+                vals=[x.value for x in items if x.quality=='ok'];points.append(dict(t=t,v=sum(vals)/len(vals) if vals else None,min=min(vals) if vals else None,max=max(vals) if vals else None,n=len(vals),faults=sum(x.quality!='ok' for x in items)))
+            return dict(station_code=code,channel=channel,unit=service.types[channel]['unit'],decimals=service.types[channel]['decimals'],bucket=bucket,**{'from':stamp(start),'to':stamp(end)},points=points,is_simulated=True)
+    @app.get('/api/v1/stations/{code}/timeline')
+    def timeline(code,request:Request):
+        start,end=parse_range(request);types=request.query_params.get('types','').split(',')
+        with service.DB() as db:
+            service.station(db,code);rows=db.scalars(select(Event).where(Event.station==code,Event.at>=stamp(start),Event.at<=stamp(end)).order_by(Event.at.desc(),Event.id.desc())).all();rows=[e for e in rows if e.type not in ('note','acknowledged','review_started','review_submitted') and (types==[''] or e.type in types)]
+            received=db.scalar(select(func.count()).select_from(FrameRow).join(Session,FrameRow.session==Session.id).where(Session.station==code,FrameRow.measured_at>=stamp(start),FrameRow.measured_at<=stamp(end)));expected=int((end-start).total_seconds()*1000/int(os.getenv('FRAME_INTERVAL_MS','2000')))
+            result=page([dict(at=e.at,type=e.type,sensor_uid=e.sensor,data=e.data) for e in rows],request);result['availability']={'from':stamp(start),'to':stamp(end),'expected_frames':expected,'received_frames':received,'pct':min(100,round(received/expected*100,1)) if expected else None};return result
+    @app.get('/api/v1/stations/{code}/link')
+    def link(code):
+        with service.DB() as db:
+            st=service.station(db,code);s=db.get(Session,st.current_session) if st.current_session else None;age=(now()-dt(st.last_frame)).total_seconds() if st.last_frame else 1e9;age*=s.speed if s and s.source=='simulated_replay' and not s.ended_at else 1;failures=[t for t in service.auth_failures.get(code,[]) if (now()-t).total_seconds()<60];service.auth_failures[code]=failures
+            status='rejected' if failures else 'waiting' if not s else 'replay' if s.source=='simulated_replay' and not s.ended_at else 'receiving' if age<6 else 'delayed' if age<15 else 'offline'
+            return dict(station_code=code,link_status=status,session=service.session_dict(s) if s else None,last_frame_received_at=st.last_frame,diag=s.last_diag if s else None,last_error={'code':'invalid_device_key'} if failures else None,recent_auth_failures=len(failures),last_batch=s.last_batch if s else None,is_simulated=True)
+    @app.get('/api/v1/rules')
+    def rules():
+        with service.DB() as db:return dict(items=[r.data for r in db.scalars(select(Rule))],is_simulated=True)
+    @app.get('/api/v1/alerts')
+    def alerts(request:Request):
+        with service.DB() as db:
+            q=select(Alert).order_by(Alert.id.desc());p=request.query_params
+            for param,col in [('station',Alert.station),('severity',Alert.severity),('category',Alert.category),('evidence_class',Alert.evidence_class),('rule',Alert.rule_code)]:
+                if p.get(param):q=q.where(col==p[param])
+            if p.get('review_status'):q=q.where(Alert.review_status.in_(p['review_status'].split(',')))
+            if p.get('channel'):q=q.where(Alert.sensor.like('%:'+p['channel']))
+            if p.get('active') in ('true','false'):q=q.where(Alert.cleared_at.is_(None) if p['active']=='true' else Alert.cleared_at.is_not(None))
+            if p.get('from'):q=q.where(Alert.opened_at>=stamp(dt(p['from'])))
+            if p.get('to'):q=q.where(Alert.opened_at<=stamp(dt(p['to'])))
+            return page([service.alert_dict(db,a) for a in db.scalars(q)],request)
+    def alert_detail(db,a,staff):
+        if not a:raise Problem(404,'not_found')
+        data=service.alert_dict(db,a);events=db.scalars(select(Event).where(Event.alert_id==a.id).order_by(Event.id)).all();s=db.get(Session,a.session) if a.session else None
+        data.update(baseline_value=a.baseline_value,threshold_value=a.threshold_value,params_snapshot=a.params_snapshot,basis_snapshot=a.basis_snapshot,session=service.session_dict(s) if s else None,events=[{'type':e.type,'at':e.at,**({'actor':e.actor,'data':e.data} if staff else {'data':{k:v for k,v in (e.data or {}).items() if k!='note'}})} for e in events if staff or e.type!='note'],review=review_dict(db.get(Review,a.review_id),False) if a.review_id else None,related_alert_ids=list(db.scalars(select(Alert.id).where(Alert.session==a.session,Alert.id!=a.id,Alert.opened_at>=stamp(dt(a.opened_at)-timedelta(minutes=5)),Alert.opened_at<=stamp(dt(a.opened_at)+timedelta(minutes=5))))));return data
+    @app.get('/api/v1/alerts/{id}')
+    def alert(id:int,request:Request):
+        with service.DB() as db:return alert_detail(db,db.get(Alert,id),current(request))
+    @app.post('/api/v1/alerts/{id}/acknowledge')
+    async def acknowledge(id:int,request:Request):
+        user=current(request,'operator');body=await payload(request)
+        with service.lock,service.DB.begin() as db:
+            a=db.get(Alert,id)
+            if not a:raise Problem(404,'not_found')
+            if a.review_status!='open':raise Problem(409,'invalid_transition')
+            note=body.get('note','')
+            if not isinstance(note,str) or len(note)>2000:raise Problem(422,'validation_error')
+            a.review_status='acknowledged';service.event(db,a.station,'acknowledged',{'note':note},a.sensor,a.id,user.username);db.flush();return alert_detail(db,a,user)
+    @app.post('/api/v1/alerts/{id}/notes',status_code=201)
+    async def note(id:int,request:Request):
+        user=current(request,'operator');body=await payload(request);note=body.get('text')
+        if not isinstance(note,str) or not 1<=len(note)<=2000:raise Problem(422,'validation_error')
+        with service.DB.begin() as db:
+            a=db.get(Alert,id)
+            if not a:raise Problem(404,'not_found')
+            t=stamp();service.event(db,a.station,'note',{'note':note},a.sensor,a.id,user.username,at=t);return {'event':{'type':'note','at':t,'actor':user.username,'data':{'note':note}},'is_simulated':True}
+    @app.post('/api/v1/auth/login')
+    async def login(request:Request,response:Response):
+        body=await payload(request);username=body.get('username','');password=body.get('password','')
+        if not isinstance(username,str) or not isinstance(password,str) or not 1<=len(username)<=200 or not 1<=len(password)<=2000:raise Problem(422,'validation_error')
+        key=(request.client.host,username);attempts=[x for x in login_limits.get(key,[]) if time.monotonic()-x<60]
+        if len(attempts)>=5:raise Problem(429,'rate_limited')
+        login_limits[key]=attempts+[time.monotonic()]
+        with service.DB.begin() as db:
+            user=db.get(User,username)
+            try:valid=user and user.is_active and PasswordHasher().verify(user.password_hash,password)
+            except (VerificationError,TypeError):valid=False
+            if not valid:raise Problem(401,'invalid_credentials')
+            user.last_login_at=stamp();ttl=int(os.getenv('SESSION_TTL_MIN','480'))*60;token=jwt.encode({'sub':user.username,'role':user.role,'exp':now()+timedelta(seconds=ttl),'jti':os.urandom(16).hex()},secret,algorithm='HS256');response.set_cookie('hww_session',token,max_age=ttl,httponly=True,secure=os.getenv('COOKIE_SECURE','true').lower()=='true',samesite='strict',path='/api')
+            return {'user':{'username':user.username,'display_name':user.display_name,'role':user.role},'is_simulated':True}
+    @app.get('/api/v1/auth/me')
+    def me(request:Request):
+        user=current(request,'operator');return {'user':{'username':user.username,'display_name':user.display_name,'role':user.role},'is_simulated':True}
+    @app.post('/api/v1/auth/logout',status_code=204)
+    def logout(request:Request,response:Response):
+        current(request,'operator');response.status_code=204;response.delete_cookie('hww_session',path='/api',secure=os.getenv('COOKIE_SECURE','true').lower()=='true',httponly=True,samesite='strict');return response
+    @app.get('/api/v1/sessions')
+    def sessions(request:Request):
+        with service.DB() as db:
+            q=select(Session).order_by(Session.started_at.desc())
+            if request.query_params.get('station'):q=q.where(Session.station==request.query_params['station'])
+            if request.query_params.get('source'):q=q.where(Session.source==request.query_params['source'])
+            return page([service.session_dict(s) for s in db.scalars(q)],request)
+    @app.get('/api/v1/sessions/{id}')
+    def session(id:str):
+        with service.DB() as db:
+            s=db.get(Session,id)
+            if not s:raise Problem(404,'not_found')
+            return {**service.session_dict(s),'last_diag':s.last_diag,'alert_ids':list(db.scalars(select(Alert.id).where(Alert.session==id))),'is_simulated':True}
+    @app.get('/api/v1/sessions/{id}/frames.jsonl')
+    def export(id:str,request:Request):
+        current(request,'operator')
+        with service.DB() as db:
+            s=db.get(Session,id)
+            if not s:raise Problem(404,'not_found')
+            rows=db.scalars(select(FrameRow).where(FrameRow.session==id).order_by(FrameRow.seq)).all();body=''.join(json.dumps({'t_offset_ms':max(0,int((dt(r.measured_at)-dt(s.started_at)).total_seconds()*1000)),'frames':[r.payload]})+'\n' for r in rows);return Response(body,media_type='application/x-ndjson')
+    def review_dict(r,staff=True):
+        if not r:raise Problem(404,'not_found')
+        return dict(id=r.id,status=r.status,alert_ids=r.alert_ids,**({'created_by':r.created_by,'note':r.note,'lab_reference':r.lab_reference} if staff else {}),started_at=r.started_at,submitted_at=r.submitted_at,outcome=r.outcome,is_simulated=True)
+    def review_owner(r,user):
+        if not r:raise Problem(404,'not_found')
+        if r.created_by!=user.username and user.role!='admin':raise Problem(403,'forbidden')
+        if r.status!='in_progress':raise Problem(409,'invalid_transition')
+    @app.get('/api/v1/incident-reviews')
+    def reviews(request:Request):
+        current(request,'operator')
+        with service.DB() as db:
+            rows=list(db.scalars(select(Review).order_by(Review.id.desc())))
+            if request.query_params.get('status'):rows=[r for r in rows if r.status==request.query_params['status']]
+            return page([review_dict(r) for r in rows],request)
+    @app.post('/api/v1/incident-reviews',status_code=201)
+    async def new_review(request:Request):
+        user=current(request,'reviewer');body=await payload(request);ids=body.get('alert_ids',[])
+        if not isinstance(ids,list) or not ids or any(type(i)!=int or i<1 for i in ids) or len(ids)!=len(set(ids)) or len(ids)>100:raise Problem(422,'validation_error')
+        with service.lock,service.DB.begin() as db:
+            alerts=[db.get(Alert,id) for id in ids]
+            if any(a is None for a in alerts):raise Problem(404,'not_found')
+            if any(a.review_status not in ('open','acknowledged') or a.review_id for a in alerts):raise Problem(409,'invalid_transition')
+            r=Review(alert_ids=ids,created_by=user.username,started_at=stamp(),note=body.get('note',''));db.add(r);db.flush()
+            for a in alerts:a.review_status='under_review';a.review_id=r.id;service.event(db,a.station,'review_started',{'review_id':r.id},a.sensor,a.id,user.username)
+            return review_dict(r)
+    @app.get('/api/v1/incident-reviews/{id}')
+    def review(id:int,request:Request):
+        current(request,'operator')
+        with service.DB() as db:return review_dict(db.get(Review,id))
+    @app.patch('/api/v1/incident-reviews/{id}')
+    async def edit_review(id:int,request:Request):
+        user=current(request,'reviewer');body=await payload(request)
+        with service.lock,service.DB.begin() as db:
+            r=db.get(Review,id);review_owner(r,user);ids=list(r.alert_ids)
+            for aid in body.get('remove_alert_ids',[]):
+                if aid not in ids:raise Problem(409,'invalid_transition')
+                a=db.get(Alert,aid);a.review_id=None;a.review_status='acknowledged';ids.remove(aid)
+            for aid in body.get('add_alert_ids',[]):
+                a=db.get(Alert,aid)
+                if not a:raise Problem(404,'not_found')
+                if a.review_id or a.review_status not in ('open','acknowledged'):raise Problem(409,'invalid_transition')
+                a.review_id=id;a.review_status='under_review';ids.append(aid)
+            if not ids:raise Problem(422,'validation_error')
+            r.alert_ids=ids;r.note=body.get('note',r.note);return review_dict(r)
+    @app.post('/api/v1/incident-reviews/{id}/submit')
+    async def submit_review(id:int,request:Request):
+        user=current(request,'reviewer');body=await payload(request);outcome=body.get('outcome')
+        if outcome not in ('confirmed_simulated_anomaly','sensor_or_equipment_fault','false_positive','test_or_calibration'):raise Problem(422,'outcome_not_allowed','Simulated observations cannot verify a field incident')
+        with service.lock,service.DB.begin() as db:
+            r=db.get(Review,id);review_owner(r,user);r.status='submitted';r.outcome=outcome;r.note=body.get('note',r.note);r.lab_reference=body.get('lab_reference');r.submitted_at=stamp()
+            for aid in r.alert_ids:
+                a=db.get(Alert,aid);a.review_status='closed';a.is_preliminary=False;a.outcome=outcome;service.event(db,a.station,'review_submitted',{'review_id':id,'outcome':outcome},a.sensor,a.id,user.username);service.event(db,a.station,'alert_closed',{'alert_id':aid},a.sensor,a.id,user.username)
+            return {**review_dict(r),'alerts':[service.alert_dict(db,db.get(Alert,aid)) for aid in r.alert_ids]}
+    @app.post('/api/v1/admin/devices/{code}/rotate-key')
+    def rotate(code,request:Request,response:Response):
+        current(request,'admin');response.headers['Cache-Control']='no-store';return service.rotate_key(code)
+    @app.put('/api/v1/admin/rules/{code}')
+    async def edit_rule(code,request:Request):
+        current(request,'admin');body=await payload(request)
+        with service.DB.begin() as db:
+            r=db.get(Rule,code)
+            if not r:raise Problem(404,'not_found')
+            if set(body)-{'enabled','severity','params','persistence','clear_persistence','basis_status','basis_reference'}:raise Problem(422,'validation_error')
+            data={**r.data,**body}
+            if data['severity'] not in ('info','warning','critical') or data['basis_status'] not in ('unverified','verified','not_applicable') or any(type(data[k])!=int or not 1<=data[k]<=100 for k in ('persistence','clear_persistence')) or type(data['enabled'])!=bool:raise Problem(422,'validation_error')
+            if set(data['params'])!=set(r.data['params']) or any(type(v) not in (float,int) or not 0<=v<10000 for v in data['params'].values()):raise Problem(422,'validation_error')
+            if code=='REF_PH_BAND' and data['params']['min']>=data['params']['max']:raise Problem(422,'validation_error')
+            if data['basis_status']=='verified' and not data.get('basis_reference'):raise Problem(422,'validation_error')
+            r.data=data;return {**data,'is_simulated':True}
+    @app.post('/api/v1/admin/demo-reset',status_code=202)
+    async def reset(request:Request):
+        current(request,'admin');body=await payload(request)
+        if os.getenv('DEMO_MODE','true').lower()!='true':raise Problem(403,'forbidden')
+        if body.get('confirm')!='RESET':raise Problem(422,'validation_error')
+        stopped=list(runs.values())
+        for task in stopped:task.cancel()
+        await asyncio.gather(*stopped,return_exceptions=True)
+        with service.lock,service.DB.begin() as db:
+            counts={name:db.scalar(select(func.count()).select_from(model)) for name,model in [('sessions',Session),('frames',FrameRow),('measurements',Measurement),('alerts',Alert)]};db.execute(delete(Event));db.execute(delete(Measurement));db.execute(delete(Alert));db.execute(delete(Review));db.execute(delete(FrameRow));db.execute(delete(Session))
+            for s in db.scalars(select(Sensor)):s.value=None;s.measured_at=None;s.received_at=None;s.quality=None;s.status='unavailable';s.status_since=stamp();s.last_valid_at=None;s.last_valid_value=None;s.rule_state={}
+            for s in db.scalars(select(Station)):s.version+=1;s.status='unavailable';s.status_since=stamp();s.active_device=None;s.current_session=None;s.last_frame=None;s.last_measured=None
+            return {'deleted':counts,'is_simulated':True}
+    def replay_catalog():
+        result=[]
+        for path in sorted((ROOT/'shared/fixtures/replays').glob('*.jsonl')):
+            content=path.read_bytes();lines=[json.loads(x) for x in content.decode('utf-8-sig').splitlines() if x.strip()];duration=max((x.get('t_offset_ms',0) for x in lines),default=0)/1000;result.append(dict(name=path.stem,description={'en':'Deterministic simulated recording','vi':'Bản ghi mô phỏng'},frame_count=sum(len(x.get('frames',[x.get('frame')])) for x in lines),duration_s=duration,sha256=hashlib.sha256(content).hexdigest()))
+        return result
+    @app.get('/api/v1/replays')
+    def replays(request:Request):
+        current(request,'operator');return {'items':replay_catalog(),'is_simulated':True}
+    async def start_replay(name,body):
+        catalog={r['name']:r for r in replay_catalog()}
+        if name not in catalog:raise Problem(404,'not_found')
+        code=body.get('station_code');speed=body.get('speed',1)
+        if type(speed)!=int or speed not in (1,2,5):raise Problem(422,'validation_error')
+        # Cancel the previous scheduler before taking over its durable session.
+        # Otherwise two replay tasks using the same station device can supersede
+        # each other's boot sessions on every frame.
+        if body.get('takeover'):
+            with service.DB() as db:
+                previous=db.scalar(select(Session).where(Session.station==code,Session.ended_at.is_(None)))
+                previous_task=runs.get(previous.id) if previous else None
+            if previous_task:
+                previous_task.cancel()
+                await asyncio.gather(previous_task,return_exceptions=True)
+        with service.lock,service.DB.begin() as db:
+            st=service.station(db,code,True)
+            if st.registry['station']['data_mode']=='planned':raise Problem(409,'station_busy')
+            active=db.scalar(select(Session).where(Session.station==code,Session.ended_at.is_(None)))
+            if active and not body.get('takeover'):raise Problem(409,'station_busy')
+            if active:active.ended_at=stamp();active.end_reason='takeover';db.flush();service.event(db,code,'session_ended',{'reason':'takeover','session_id':active.id})
+            device=db.get(Device,'replay-'+code.lower());st.active_device=device.code;service.event(db,code,'takeover_started',{'replay':name})
+        lines=[json.loads(x) for x in (ROOT/'shared/fixtures/replays'/(name+'.jsonl')).read_text(encoding='utf-8-sig').splitlines() if x.strip()]
+        if not lines:raise Problem(422,'validation_error')
+        start=now();boot=os.urandom(4).hex()
+        def envelope(frames):return {'schema':'hww.frames.v1','station_code':code,'device_code':device.code,'boot_id':boot,'fw_version':'replay-1','sent_at':stamp(),'sent_uptime_ms':max(f.get('uptime_ms',0) for f in frames),'diag':{},'frames':frames}
+        first=json.loads(json.dumps(lines[0].get('frames',[lines[0].get('frame')])))
+        for f in first:f['measured_at']=stamp(start);f['time_source']='server'
+        service.ingest(Batch.model_validate(envelope(first)),device,speed=speed)
+        with service.DB.begin() as db:
+            s=db.scalar(select(Session).where(Session.station==code,Session.ended_at.is_(None)));s.replay_name=name;s.started_at=stamp(start);sid=s.id
+        async def runner():
+            reason='replay_finished'
+            try:
+                cycle=start
+                for line in lines[1:]:
+                    target=cycle+timedelta(milliseconds=line['t_offset_ms']/speed);await asyncio.sleep(max(0,(target-now()).total_seconds()));frames=json.loads(json.dumps(line.get('frames',[line.get('frame')])))
+                    for f in frames:f['measured_at']=stamp(cycle+timedelta(milliseconds=f.get('uptime_ms',line['t_offset_ms'])/speed));f['time_source']='server'
+                    await asyncio.to_thread(service.ingest,Batch.model_validate(envelope(frames)),device,None,speed)
+            except asyncio.CancelledError:reason='replay_stopped';raise
+            finally:
+                with service.lock,service.DB.begin() as db:
+                    s=db.get(Session,sid);st=db.get(Station,code)
+                    if s and not s.ended_at:s.ended_at=stamp();s.end_reason=reason;service.event(db,code,'session_ended',{'session_id':sid,'reason':reason});service.event(db,code,'takeover_ended',{'session_id':sid});st.active_device=None
+                runs.pop(sid,None)
+                if body.get('loop') and reason=='replay_finished':track(asyncio.create_task(start_replay(name,body)))
+        task=track(asyncio.create_task(runner()));runs[sid]=task
+        return dict(session_id=sid,station_code=code,replay=name,started_at=stamp(start),expected_end_at=stamp(start+timedelta(seconds=catalog[name]['duration_s']/speed)),is_simulated=True)
+    @app.post('/api/v1/replays/{name}/runs',status_code=202)
+    async def run_replay(name,request:Request):current(request,'operator');return await start_replay(name,await payload(request))
+    @app.post('/api/v1/replay-runs/{id}/stop')
+    async def stop_replay(id,request:Request):
+        current(request,'operator');task=runs.get(id)
+        if not task:raise Problem(404,'not_found')
+        task.cancel()
+        try:await task
+        except asyncio.CancelledError:pass
+        with service.DB() as db:return {**service.session_dict(db.get(Session,id)),'is_simulated':True}
+    @app.get('/api/v1/stream')
+    def stream():raise Problem(503,'sse_disabled','Polling is supported; SSE is deferred')
+    @app.api_route('/{path:path}',methods=['GET','HEAD'],include_in_schema=False)
+    def spa(path:str):
+        if path.startswith('api/'):raise Problem(404,'not_found')
+        dist=Path(os.getenv('FRONTEND_DIST',str(ROOT/'frontend/dist'))).resolve();file=(dist/path).resolve()
+        if not file.is_relative_to(dist):raise Problem(404,'not_found')
+        if file.is_file():return FileResponse(file,media_type='model/gltf-binary' if file.suffix=='.glb' else None)
+        if path.startswith(('models/','assets/')):raise Problem(404,'not_found')
+        if (dist/'index.html').exists():return FileResponse(dist/'index.html')
+        raise Problem(404,'not_found','Build the frontend to serve the application')
+    return app

--- /dev/null
+++ backend/app/models.py
@@ -0,0 +1,60 @@
+"""Durable SQLAlchemy domain model; JSON columns use JSONB on PostgreSQL."""
+from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, ForeignKey, UniqueConstraint, CheckConstraint, Index
+from sqlalchemy.dialects.postgresql import JSONB
+from sqlalchemy.orm import declarative_base
+from sqlalchemy.types import TypeDecorator, DateTime
+from datetime import datetime,timezone
+class UTCStamp(TypeDecorator):
+    impl=DateTime(timezone=True)
+    cache_ok=True
+    def process_bind_param(self,value,dialect):
+        if value is None:return None
+        return datetime.fromisoformat(value.replace("Z","+00:00")) if isinstance(value,str) else value
+    def process_result_value(self,value,dialect):
+        if value is None:return None
+        if value.tzinfo is None:value=value.replace(tzinfo=timezone.utc)
+        return value.astimezone(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00","Z")
+Base=declarative_base()
+J=JSON().with_variant(JSONB(),'postgresql')
+class Station(Base):
+    __tablename__='stations'
+    code=Column(String,primary_key=True); registry=Column(J,nullable=False); active_device=Column(String); version=Column(Integer,default=0,nullable=False); status=Column(String,default='unavailable'); status_since=Column(UTCStamp()); last_frame=Column(UTCStamp()); last_measured=Column(UTCStamp()); current_session=Column(String)
+class Device(Base):
+    __tablename__='devices'
+    code=Column(String,primary_key=True); station=Column(String,ForeignKey('stations.code'),nullable=False); kind=Column(String,nullable=False); key_prefix=Column(String,unique=True); key_hash=Column(String); enabled=Column(Boolean,default=True); rotated_at=Column(UTCStamp())
+class Sensor(Base):
+    __tablename__='sensor_state'
+    historical_rule_state=Column(J,default=dict)
+    uid=Column(String,primary_key=True); station=Column(String,ForeignKey('stations.code'),nullable=False); channel=Column(String,nullable=False); value=Column(Float); measured_at=Column(UTCStamp()); received_at=Column(UTCStamp()); quality=Column(String); gen=Column(String); fault_reason=Column(String); status=Column(String,default='unavailable'); status_since=Column(UTCStamp()); last_valid_value=Column(Float); last_valid_at=Column(UTCStamp()); rule_state=Column(J,default=dict)
+class Session(Base):
+    __tablename__='simulation_sessions'
+    id=Column(String,primary_key=True); station=Column(String,ForeignKey('stations.code')); device=Column(String,ForeignKey('devices.code')); boot_id=Column(String); source=Column(String); fw_version=Column(String); started_at=Column(UTCStamp()); last_frame_at=Column(UTCStamp()); ended_at=Column(UTCStamp()); end_reason=Column(String); frames_accepted=Column(Integer,default=0); frames_duplicate=Column(Integer,default=0); frames_rejected=Column(Integer,default=0); last_seq=Column(Integer,default=-1); last_diag=Column(J); last_batch=Column(J); replay_name=Column(String); speed=Column(Integer,default=1)
+class FrameRow(Base):
+    __tablename__='frames'
+    id=Column(Integer,primary_key=True); session=Column(String,ForeignKey('simulation_sessions.id')); device=Column(String,ForeignKey('devices.code')); boot_id=Column(String); seq=Column(Integer); measured_at=Column(UTCStamp()); received_at=Column(UTCStamp()); payload=Column(J)
+    __table_args__=(UniqueConstraint('device','boot_id','seq'),)
+class Measurement(Base):
+    __tablename__='measurements'
+    id=Column(Integer,primary_key=True); frame_id=Column(Integer,ForeignKey('frames.id')); sensor=Column(String,ForeignKey('sensor_state.uid')); session=Column(String,ForeignKey('simulation_sessions.id')); measured_at=Column(UTCStamp(),index=True); received_at=Column(UTCStamp()); value=Column(Float); quality=Column(String); source=Column(String,nullable=False); is_simulated=Column(Boolean,default=True,nullable=False); raw=Column(Integer); gen=Column(String); fault_reason=Column(String)
+    __table_args__=(UniqueConstraint('frame_id','sensor'),CheckConstraint("source IN ('simulated_wokwi','simulated_script','simulated_replay')"),CheckConstraint('is_simulated = true'),CheckConstraint("(quality = 'fault' AND value IS NULL) OR (quality <> 'fault' AND value IS NOT NULL)"))
+class Rule(Base):
+    __tablename__='alert_rules'
+    code=Column(String,primary_key=True); data=Column(J,nullable=False)
+class Alert(Base):
+    __tablename__='alerts'
+    id=Column(Integer,primary_key=True); station=Column(String,ForeignKey('stations.code')); sensor=Column(String,ForeignKey('sensor_state.uid')); session=Column(String,ForeignKey('simulation_sessions.id')); rule_code=Column(String,ForeignKey('alert_rules.code')); category=Column(String); severity=Column(String); evidence_class=Column(String,default='simulated_anomaly'); is_preliminary=Column(Boolean,default=True); review_status=Column(String,default='open'); opened_at=Column(UTCStamp()); detected_at=Column(UTCStamp()); detected_late=Column(Boolean,default=False); cleared_at=Column(UTCStamp()); observed_value=Column(Float); baseline_value=Column(Float); threshold_value=Column(Float); params_snapshot=Column(J); basis_snapshot=Column(J); outcome=Column(String); review_id=Column(Integer,ForeignKey('incident_reviews.id'))
+    __table_args__=(CheckConstraint("evidence_class = 'simulated_anomaly'"),CheckConstraint("outcome IS NULL OR outcome IN ('confirmed_simulated_anomaly','sensor_or_equipment_fault','false_positive','test_or_calibration')"),)
+class Event(Base):
+    __tablename__='station_events'
+    id=Column(Integer,primary_key=True); station=Column(String,ForeignKey('stations.code')); sensor=Column(String); alert_id=Column(Integer); at=Column(UTCStamp()); type=Column(String); actor=Column(String); data=Column(J)
+class User(Base):
+    __tablename__='users'
+    username=Column(String,primary_key=True); display_name=Column(String); role=Column(String); password_hash=Column(String); is_active=Column(Boolean,default=True); last_login_at=Column(UTCStamp())
+class Review(Base):
+    __tablename__='incident_reviews'
+    id=Column(Integer,primary_key=True); status=Column(String,default='in_progress'); alert_ids=Column(J); created_by=Column(String,ForeignKey('users.username')); started_at=Column(UTCStamp()); submitted_at=Column(UTCStamp()); note=Column(String); outcome=Column(String); lab_reference=Column(String)
+# At most one currently active episode; station-level alerts use a separate index because NULL is distinct.
+Index('uq_active_sensor_alert',Alert.sensor,Alert.rule_code,unique=True,sqlite_where=(Alert.cleared_at.is_(None)&Alert.sensor.is_not(None)),postgresql_where=(Alert.cleared_at.is_(None)&Alert.sensor.is_not(None)))
+Index('uq_active_station_alert',Alert.station,Alert.rule_code,unique=True,sqlite_where=(Alert.cleared_at.is_(None)&Alert.sensor.is_(None)),postgresql_where=(Alert.cleared_at.is_(None)&Alert.sensor.is_(None)))
+Index('uq_open_station_session',Session.station,unique=True,sqlite_where=Session.ended_at.is_(None),postgresql_where=Session.ended_at.is_(None))
+

--- /dev/null
+++ backend/app/schemas.py
@@ -0,0 +1,50 @@
+from datetime import datetime
+from typing import Literal, Optional
+from pydantic import BaseModel, ConfigDict, Field, model_validator
+
+class Strict(BaseModel):
+    model_config=ConfigDict(extra='forbid',allow_inf_nan=False)
+class Reading(Strict):
+    v: Optional[float]=Field(strict=True)
+    u: str
+    q: Literal['ok','fault']
+    raw: Optional[int]=Field(default=None,ge=0,le=4095,strict=True)
+    gen: Literal['input','profile']
+    fr: Optional[Literal['injected','disconnected','out_of_range']]=None
+    @model_validator(mode='after')
+    def fault(self):
+        if (self.q=='fault') != (self.v is None) or (self.q=='fault' and self.fr is None): raise ValueError('fault requires null value and reason')
+        return self
+class Frame(Strict):
+    seq: int=Field(ge=0,le=2147483647,strict=True)
+    measured_at: Optional[datetime]
+    time_source: Literal['ntp','server','uptime']
+    uptime_ms: int=Field(ge=0,strict=True)
+    buffered: bool=Field(strict=True)
+    mode: Literal['manual','gradual_ph','spike_turb','do_drop']
+    readings: dict[str,Reading]=Field(min_length=1)
+    @model_validator(mode='after')
+    def clock(self):
+        if self.time_source=='uptime' and self.measured_at is not None: raise ValueError('uptime requires null timestamp')
+        if self.time_source!='uptime' and (self.measured_at is None or self.measured_at.utcoffset() is None or self.measured_at.utcoffset().total_seconds()!=0): raise ValueError('UTC measured_at required')
+        return self
+class Diag(Strict):
+    buffer_depth: int=Field(default=0,ge=0,strict=True)
+    dropped_frames: int=Field(default=0,ge=0,strict=True)
+    rejected_batches: int=Field(default=0,ge=0,strict=True)
+    wifi_rssi: Optional[int]=Field(default=None,strict=True)
+class Batch(Strict):
+    schema_version: Literal['hww.frames.v1']=Field(alias='schema')
+    station_code: str=Field(pattern=r'^HWW-[A-Z]{3}-\d{3}$')
+    device_code: str
+    boot_id: str=Field(pattern=r'^[0-9a-f]{8}$')
+    fw_version: str=Field(max_length=100)
+    sent_at: Optional[datetime]
+    sent_uptime_ms: int=Field(ge=0,strict=True)
+    diag: Diag
+    frames: list[Frame]=Field(min_length=1,max_length=50)
+    @model_validator(mode='after')
+    def uptime(self):
+        if any(f.uptime_ms>self.sent_uptime_ms for f in self.frames): raise ValueError('frame uptime exceeds sent uptime')
+        if self.sent_at is not None and (self.sent_at.utcoffset() is None or self.sent_at.utcoffset().total_seconds()!=0): raise ValueError('UTC sent_at required')
+        return self

--- /dev/null
+++ backend/app/service.py
@@ -0,0 +1,235 @@
+import os,json,hashlib,hmac,secrets,uuid,statistics,threading
+from pathlib import Path
+from datetime import datetime,timezone,timedelta
+from sqlalchemy import create_engine,select,delete,func
+from sqlalchemy.orm import sessionmaker
+from sqlalchemy.pool import StaticPool
+from argon2 import PasswordHasher
+from .models import *
+ROOT=Path(__file__).resolve().parents[2]
+def now(): return datetime.now(timezone.utc)
+def stamp(t=None): return (t or now()).astimezone(timezone.utc).isoformat(timespec='milliseconds').replace('+00:00','Z')
+def dt(s): return datetime.fromisoformat(s.replace('Z','+00:00')) if s else None
+class Problem(Exception):
+    def __init__(self,status,code,detail=None): self.status=status;self.code=code;self.detail=detail or code.replace('_',' ')
+
+def rule_defaults():
+    specs=[('VALID_RANGE','all','equipment','warning',{},1,2,'Instrument plausibility check'),('REF_PH_BAND','ph','water_quality','critical',{'min':6.,'max':9.},3,3,'Reference band from QCVN 40:2025/BTNMT (industrial wastewater), pH 6–9. Verification of the official text pending. This is not a river-water standard.'),('REF_TEMP_MAX','temp','water_quality','warning',{'max':40.},3,3,'Reference maximum from QCVN 40:2025/BTNMT (industrial wastewater), 40 °C. Verification of the official text pending.'),('CHG_TURB_SPIKE','turbidity','water_quality','warning',{'multiplier':3.,'delta':50.},2,5,'Demo heuristic: ≥3× five-minute median and ≥+50 NTU. No regulatory meaning.'),('CHG_DO_DROP','do','water_quality','warning',{'ratio':.5,'delta':2.,'clear_ratio':.8},3,5,'Demo heuristic: at or below half the median and down ≥2 mg/L. No regulatory meaning.'),('STN_OFFLINE','station','equipment','info',{},1,1,'Connectivity check')]
+    return {c:dict(code=c,name={'en':c.replace('_',' ').title(),'vi':c.replace('_',' ').title()},applies_to=a,category=cat,severity=sev,params=params,persistence=p,clear_persistence=cp,basis_text={'en':basis,'vi':basis},is_regulatory=c.startswith('REF_'),basis_status='unverified' if c.startswith('REF_') else 'not_applicable',basis_reference=None,enabled=True) for c,a,cat,sev,params,p,cp,basis in specs}
+class Service:
+    def __init__(self,url,testing=False):
+        url=url.replace('sqlite+aiosqlite:','sqlite:').replace('postgresql+asyncpg:','postgresql+psycopg:')
+        if url.startswith('postgresql://'): url=url.replace('postgresql://','postgresql+psycopg://',1)
+        self.engine=create_engine(url,connect_args={'check_same_thread':False} if url.startswith('sqlite:') else {},pool_pre_ping=True)
+        self.DB=sessionmaker(self.engine,expire_on_commit=False); self.lock=threading.RLock(); self.testing=testing; self.auth_failures={}
+        self.types=json.loads((ROOT/'shared/registry/sensor_types.json').read_text(encoding='utf-8-sig'))['types']
+    def seed(self):
+        Base.metadata.create_all(self.engine)
+        with self.DB.begin() as db:
+            for path in sorted((ROOT/'shared/registry').glob('HWW-*.json')):
+                reg=json.loads(path.read_text(encoding='utf-8-sig')); code=reg['station']['code']; st=db.get(Station,code)
+                if not st: db.add(Station(code=code,registry=reg,status='unavailable',status_since=stamp()))
+                else: st.registry=reg
+                db.flush()
+                if reg.get('device'):
+                    d=reg['device']
+                    if not db.get(Device,d['code']): db.add(Device(code=d['code'],station=code,kind=d['kind']))
+                for s in reg['sensors']:
+                    if not db.get(Sensor,s['uid']): db.add(Sensor(uid=s['uid'],station=code,channel=s['channel'],status='unavailable',status_since=stamp(),rule_state={}))
+                replay='replay-'+code.lower()
+                if not db.get(Device,replay): db.add(Device(code=replay,station=code,kind='replay'))
+            for code,data in rule_defaults().items():
+                if not db.get(Rule,code): db.add(Rule(code=code,data=data))
+        for role in ('operator','reviewer','admin'):
+            user=os.getenv('DEMO_'+role.upper()+'_USERNAME'); password=os.getenv('DEMO_'+role.upper()+'_PASSWORD')
+            if user and password: self.create_user(user,password,role)
+    def create_user(self,username,password,role):
+        with self.DB.begin() as db:
+            if not db.get(User,username): db.add(User(username=username,display_name='Demo '+role.title(),role=role,password_hash=PasswordHasher().hash(password)))
+    def rotate_key(self,code,key=None):
+        key=key or 'hwwk_'+secrets.token_urlsafe(32)
+        with self.DB.begin() as db:
+            d=db.get(Device,code)
+            if not d: raise Problem(404,'not_found')
+            if d.kind=='replay': raise Problem(422,'validation_error','Replay devices cannot have external keys')
+            d.key_prefix=key[:8];d.key_hash=hashlib.sha256(key.encode()).hexdigest();d.rotated_at=stamp()
+            return dict(device_code=code,key=key,key_prefix=key[:8],rotated_at=d.rotated_at,is_simulated=True)
+    def authenticate(self,key,claimed=None):
+        with self.DB() as db:
+            d=db.scalar(select(Device).where(Device.key_prefix==(key or '')[:8]))
+            if not d or not key or not hmac.compare_digest(d.key_hash or '',hashlib.sha256(key.encode()).hexdigest()):
+                if claimed: self.auth_failures.setdefault(claimed,[]).append(now())
+                raise Problem(401,'invalid_device_key')
+            if not d.enabled: raise Problem(403,'device_disabled')
+            return d
+    def event(self,db,station,kind,data=None,sensor=None,alert=None,actor=None,at=None):
+        db.add(Event(station=station,sensor=sensor,alert_id=alert,at=at or stamp(),type=kind,actor=actor,data=data or {}))
+    def station(self,db,code,lock=False):
+        s=db.scalar(select(Station).where(Station.code==code).with_for_update()) if lock else db.get(Station,code)
+        if not s: raise Problem(404,'not_found')
+        return s
+    def open_alert(self,db,st,sensor,session,rule,t,value=None,baseline=None,threshold=None,late=False):
+        a=Alert(station=st.code,sensor=sensor.uid if sensor else None,session=session.id if session else None,rule_code=rule['code'],category=rule['category'],severity=rule['severity'],opened_at=t,detected_at=stamp(),detected_late=late,observed_value=value,baseline_value=baseline,threshold_value=threshold,params_snapshot=rule['params'],basis_snapshot={k:rule[k] for k in ('basis_text','is_regulatory','basis_status','basis_reference')})
+        db.add(a);db.flush();self.event(db,st.code,'alert_opened',{'alert_id':a.id,'rule_code':a.rule_code},a.sensor,a.id,at=t);return a
+    def clear_alert(self,db,a,t):
+        if a and not a.cleared_at: a.cleared_at=t; self.event(db,a.station,'alert_cleared',{'alert_id':a.id},a.sensor,a.id,at=t)
+    def evaluate(self,db,st,sensor,session,m,rules):
+        states=json.loads(json.dumps(sensor.rule_state or {})); t=m.measured_at; value=m.value
+        for rule in rules:
+            code=rule['code']
+            if not rule['enabled'] or rule['applies_to'] not in ('all',sensor.channel): continue
+            rs=states.setdefault(code,{'pending':0,'active':False,'clear_count':0})
+            if rule['category']=='water_quality' and m.quality!='ok': rs['pending']=0;continue
+            p=rule['params'];base=rs.get('frozen_baseline'); threshold=None
+            if rs.get('active') and rs.get('alert_id'):
+                episode=db.get(Alert,rs['alert_id'])
+                if episode:p=episode.params_snapshot
+            if code.startswith('CHG_') and not rs['active']:
+                window=300/session.speed; gap=10/session.speed
+                vals=db.scalars(select(Measurement.value).where(Measurement.sensor==sensor.uid,Measurement.session==session.id,Measurement.quality=='ok',Measurement.measured_at>=stamp(dt(t)-timedelta(seconds=window)),Measurement.measured_at<=stamp(dt(t)-timedelta(seconds=gap)))).all()
+                if len(vals)<30 or (dt(t)-dt(session.started_at)).total_seconds()<60/session.speed: rs['warming_up']=True;rs['pending']=0;continue
+                base=statistics.median(vals);rs['warming_up']=False
+            if code=='VALID_RANGE': hit=m.quality!='ok';clear=not hit
+            elif code=='REF_PH_BAND': hit=value<p['min'] or value>p['max'];clear=not hit;threshold=p['min'] if value<p['min'] else p['max']
+            elif code=='REF_TEMP_MAX': hit=value>p['max'];clear=not hit;threshold=p['max']
+            elif code=='CHG_TURB_SPIKE': threshold=max(p['multiplier']*base,base+p['delta']);hit=value>=threshold;clear=value<threshold
+            elif code=='CHG_DO_DROP': threshold=p['ratio']*base;hit=value<=threshold and base-value>=p['delta'];clear=value>=p['clear_ratio']*base
+            else: continue
+            if not rs['active']:
+                rs['pending']=rs['pending']+1 if hit else 0
+                if rs['pending']>=rule['persistence']:
+                    a=self.open_alert(db,st,sensor,session,rule,t,value,base,threshold,bool(sensor.measured_at and t<sensor.measured_at));rs.update(active=True,clear_count=0,frozen_baseline=base,alert_id=a.id)
+            else:
+                rs['clear_count']=rs['clear_count']+1 if clear else 0
+                if rs['clear_count']>=rule['clear_persistence']:
+                    self.clear_alert(db,db.get(Alert,rs['alert_id']),t);rs.update(active=False,pending=0,clear_count=0,frozen_baseline=None)
+        sensor.rule_state=states
+    def recompute(self,db,st,t):
+        sensors=db.scalars(select(Sensor).where(Sensor.station==st.code)).all()
+        for s in sensors:
+            old=s.status
+            if not s.measured_at or st.registry['station']['data_mode']=='planned': status='unavailable'
+            elif st.status=='offline': status='offline'
+            elif s.quality in ('fault','invalid') or (s.rule_state or {}).get('VALID_RANGE',{}).get('active'): status='sensor_fault'
+            elif any(v.get('active') for k,v in (s.rule_state or {}).items() if k!='VALID_RANGE'): status='abnormal'
+            else: status='normal'
+            s.status=status
+            if old!=status: s.status_since=t;self.event(db,st.code,'status_changed',{'from':old,'to':status},s.uid,at=t)
+        old=st.status
+        if st.registry['station']['data_mode']=='planned': status='unavailable'
+        elif st.status=='offline': status='offline'
+        elif any(s.status=='abnormal' for s in sensors): status='abnormal'
+        elif any(s.status in ('sensor_fault','unavailable') for s in sensors): status='degraded'
+        else: status='normal'
+        st.status=status
+        if old!=status: st.status_since=t;self.event(db,st.code,'status_changed',{'from':old,'to':status},at=t)
+    def ingest(self,batch,device,received=None,speed=1):
+        received=received or now(); rt=stamp(received)
+        if batch.station_code!=device.station or batch.device_code!=device.code: raise Problem(403,'station_mismatch')
+        with self.lock,self.DB.begin() as db:
+            st=self.station(db,batch.station_code,True)
+            if st.registry['station']['data_mode']=='planned': raise Problem(403,'station_mismatch')
+            channels={s['channel'] for s in st.registry['sensors']}
+            for f in batch.frames:
+                for c,r in f.readings.items():
+                    if c not in channels: raise Problem(422,'unknown_channel')
+                    if r.u!=self.types[c]['unit']: raise Problem(422,'unit_mismatch')
+            active=db.scalar(select(Session).where(Session.station==st.code,Session.ended_at.is_(None)))
+            if active and active.device!=device.code: raise Problem(409,'station_busy')
+            session=active if active and active.boot_id==batch.boot_id else None
+            if not session:
+                if active: active.ended_at=rt;active.end_reason='superseded';db.flush();self.event(db,st.code,'session_ended',{'session_id':active.id,'reason':'superseded'})
+                source={'wokwi_esp32':'simulated_wokwi','sim_script':'simulated_script','replay':'simulated_replay'}[device.kind]
+                session=Session(id=str(uuid.uuid4()),station=st.code,device=device.code,boot_id=batch.boot_id,source=source,fw_version=batch.fw_version,started_at=rt,last_seq=-1,speed=speed)
+                db.add(session);db.flush();st.current_session=session.id;st.active_device=device.code;self.event(db,st.code,'session_started',{'session_id':session.id,'source':source,'boot_id':batch.boot_id})
+                # New boot starts fresh rule counters; old active conditions end with their session.
+                for sensor in db.scalars(select(Sensor).where(Sensor.station==st.code)):
+                    for rs in (sensor.rule_state or {}).values():
+                        if rs.get('active'): self.clear_alert(db,db.get(Alert,rs['alert_id']),rt)
+                    sensor.rule_state={}
+            results=[];new=[]
+            for f in sorted(batch.frames,key=lambda x:x.seq):
+                if db.scalar(select(FrameRow.id).where(FrameRow.device==device.code,FrameRow.boot_id==batch.boot_id,FrameRow.seq==f.seq)):
+                    results.append({'seq':f.seq,'status':'duplicate'});continue
+                measured=received-timedelta(milliseconds=batch.sent_uptime_ms-f.uptime_ms) if f.time_source=='uptime' else f.measured_at
+                age=(received-measured).total_seconds()
+                if age>86400 or age < -300:
+                    results.append({'seq':f.seq,'status':'rejected','reason':'too_old' if age>86400 else 'future_timestamp'});continue
+                t=stamp(measured)
+                row=FrameRow(session=session.id,device=device.code,boot_id=batch.boot_id,seq=f.seq,measured_at=t,received_at=rt,payload=f.model_dump(mode='json'))
+                db.add(row);db.flush();new.append((t,f,row));results.append({'seq':f.seq,'status':'accepted'})
+                if session.last_seq>=0 and f.seq>session.last_seq+1:self.event(db,st.code,'frames_missing',{'from_seq':session.last_seq+1,'to_seq':f.seq-1})
+                session.last_seq=max(session.last_seq,f.seq)
+            rules=[r.data for r in db.scalars(select(Rule))]
+            for t,f,row in sorted(new,key=lambda x:x[0]):
+                for c,r in f.readings.items():
+                    sensor=db.get(Sensor,st.code+':'+c);spec=self.types[c]
+                    quality='fault' if r.q=='fault' else 'invalid' if not spec['valid_min']<=r.v<=spec['valid_max'] else 'ok'
+                    m=Measurement(frame_id=row.id,sensor=sensor.uid,session=session.id,measured_at=t,received_at=rt,value=r.v,quality=quality,source=session.source,raw=r.raw,gen=r.gen,fault_reason=r.fr if quality=='fault' else 'out_of_range' if quality=='invalid' else None)
+                    db.add(m);db.flush()
+                    previous_rules=json.loads(json.dumps(sensor.rule_state or {}))
+                    late=bool(sensor.measured_at and t<sensor.measured_at)
+                    if late:
+                        # Historical episodes are evaluated separately so old faults cannot
+                        # rewind current persistence counters or the visible condition.
+                        sensor.rule_state=json.loads(json.dumps(sensor.historical_rule_state or {}))
+                    eligible_rules=rules
+                    if late:
+                        eligible_rules=[r for r in rules if not previous_rules.get(r['code'],{}).get('active')]
+                    self.evaluate(db,st,sensor,session,m,eligible_rules)
+                    if late:
+                        for rs in (sensor.rule_state or {}).values():
+                            if rs.get('active'):self.clear_alert(db,db.get(Alert,rs['alert_id']),t)
+                        sensor.historical_rule_state=json.loads(json.dumps(sensor.rule_state or {}))
+                        sensor.rule_state=previous_rules
+                    if not sensor.measured_at or t>sensor.measured_at:
+                        sensor.value=r.v;sensor.measured_at=t;sensor.received_at=rt;sensor.quality=quality;sensor.gen=r.gen;sensor.fault_reason=m.fault_reason
+                        if quality=='ok':sensor.last_valid_value=r.v;sensor.last_valid_at=t
+                db.flush()
+            accepted=len(new); duplicates=sum(r['status']=='duplicate' for r in results);rejected=len(results)-accepted-duplicates
+            session.frames_accepted+=accepted;session.frames_duplicate+=duplicates;session.frames_rejected+=rejected;session.last_diag=batch.diag.model_dump();session.last_batch=batch.model_dump(by_alias=True,mode='json')
+            if accepted:
+                session.last_frame_at=rt;st.last_frame=rt;st.last_measured=max([st.last_measured or '']+[t for t,_,_ in new]);st.version+=1
+                offline=db.scalar(select(Alert).where(Alert.station==st.code,Alert.rule_code=='STN_OFFLINE',Alert.cleared_at.is_(None)))
+                self.clear_alert(db,offline,rt)
+                if st.status=='offline':st.status='degraded';self.event(db,st.code,'station_online')
+                self.recompute(db,st,rt)
+            return dict(results=results,accepted=accepted,duplicates=duplicates,rejected=rejected,station_status=st.status,state_version=st.version,server_time=rt,next_min_interval_ms=int(os.getenv('FRAME_INTERVAL_MS','2000')),is_simulated=True)
+    def freshness(self,at=None):
+        at=at or now();t=stamp(at)
+        with self.lock,self.DB.begin() as db:
+            for st in db.scalars(select(Station).with_for_update()):
+                if not st.last_frame or st.registry['station']['data_mode']=='planned':continue
+                age=(at-dt(st.last_frame)).total_seconds()
+                current=db.get(Session,st.current_session) if st.current_session else None
+                scale=current.speed if current and current.source=='simulated_replay' and not current.ended_at else 1
+                if age>float(os.getenv('OFFLINE_AFTER_S','15'))/scale and st.status!='offline':
+                    st.status='offline';st.status_since=t;st.version+=1;self.recompute(db,st,t);self.event(db,st.code,'station_offline',at=t)
+                    existing=db.scalar(select(Alert).where(Alert.station==st.code,Alert.rule_code=='STN_OFFLINE',Alert.cleared_at.is_(None)))
+                    if not existing:self.open_alert(db,st,None,db.get(Session,st.current_session),db.get(Rule,'STN_OFFLINE').data,t)
+                if age>float(os.getenv('SESSION_END_AFTER_S','60'))/scale:
+                    active=db.scalar(select(Session).where(Session.station==st.code,Session.ended_at.is_(None)))
+                    if active:active.ended_at=t;active.end_reason='idle_timeout';st.active_device=None;self.event(db,st.code,'session_ended',{'reason':'idle_timeout','session_id':active.id},at=t)
+    def snapshot(self,code):
+        with self.lock,self.DB() as db:
+            st=self.station(db,code);session=db.get(Session,st.current_session) if st.current_session else None;sensors=[]
+            for meta in st.registry['sensors']:
+                s=db.get(Sensor,meta['uid']);spec=self.types[s.channel];hidden=s.status in ('sensor_fault','offline','unavailable')
+                active=db.scalar(select(Alert).where(Alert.sensor==s.uid,Alert.cleared_at.is_(None)))
+                sensors.append(dict(channel=s.channel,uid=s.uid,unit=spec['unit'],decimals=spec['decimals'],model_node=meta['model_node'],value=None if hidden else s.value,measured_at=s.measured_at,quality=s.quality,gen=s.gen,status=s.status,status_since=s.status_since,last_valid={'value':s.last_valid_value,'measured_at':s.last_valid_at} if hidden and s.last_valid_at else None,fault_reason=s.fault_reason,active_alert_id=active.id if active else None))
+            alerts=db.scalars(select(Alert).where(Alert.station==code,Alert.review_status!='closed')).all()
+            return dict(station_code=code,version=st.version,generated_at=stamp(),station_status=st.status,status_since=st.status_since,station_status_since=st.status_since,offline_after_s=int(os.getenv("OFFLINE_AFTER_S","15"))/(session.speed if session and session.source=="simulated_replay" and not session.ended_at else 1),data_source=session.source if session else None,last_frame_at=st.last_frame,last_measured_at=st.last_measured,freshness_s=max(0,(now()-dt(st.last_frame)).total_seconds()) if st.last_frame else None,is_simulated=True,session=self.session_dict(session) if session else None,sensors=sensors,open_alerts=[self.alert_dict(db,a) for a in alerts],open_alert_count=len(alerts))
+    def session_dict(self,s):
+        return dict(id=s.id,station_code=s.station,device_code=s.device,source=s.source,boot_id=s.boot_id,fw_version=s.fw_version,replay_name=s.replay_name,started_at=s.started_at,last_frame_at=s.last_frame_at,ended_at=s.ended_at,end_reason=s.end_reason,frames_accepted=s.frames_accepted,frames_duplicate=s.frames_duplicate,frames_rejected=s.frames_rejected)
+    def alert_dict(self,db,a):
+        rule=db.get(Rule,a.rule_code).data
+        return dict(id=a.id,rule_code=a.rule_code,rule_name=rule['name'],station_code=a.station,sensor_uid=a.sensor,category=a.category,severity=a.severity,evidence_class=a.evidence_class,is_preliminary=a.is_preliminary,review_status=a.review_status,opened_at=a.opened_at,detected_at=a.detected_at,detected_late=a.detected_late,cleared_at=a.cleared_at,observed_value=a.observed_value,unit=self.types[a.sensor.split(':')[-1]]['unit'] if a.sensor else None,outcome=a.outcome,is_simulated=True)
+
+    def purge(self,at=None):
+        cutoff=stamp((at or now())-timedelta(days=int(os.getenv('RETENTION_DAYS','7'))))
+        with self.lock,self.DB.begin() as db:
+            ids=select(FrameRow.id).where(FrameRow.measured_at<cutoff)
+            measurements=db.execute(delete(Measurement).where(Measurement.measured_at<cutoff)).rowcount
+            frames=db.execute(delete(FrameRow).where(FrameRow.measured_at<cutoff)).rowcount
+            events=db.execute(delete(Event).where(Event.at<cutoff,Event.alert_id.is_(None))).rowcount
+            return {'measurements':measurements,'frames':frames,'events':events}

--- /dev/null
+++ backend/tests/test_core.py
@@ -0,0 +1,174 @@
+import os
+import pytest
+from datetime import datetime, timezone, timedelta
+from fastapi.testclient import TestClient
+from app.main import create_app
+
+def batch(seq=0, value=7.2, at=None, **reading):
+    return {'schema':'hww.frames.v1','station_code':'HWW-KNG-001','device_code':'wokwi-esp32-01','boot_id':'abcdef01','fw_version':'0.4.0','sent_at':None,'sent_uptime_ms':100000,'diag':{},'frames':[{'seq':seq,'measured_at':(at or datetime.now(timezone.utc)).isoformat().replace('+00:00','Z'),'time_source':'ntp','uptime_ms':seq*2000,'buffered':False,'mode':'manual','readings':{'ph':{'v':value,'u':'pH','q':'ok','raw':2109,'gen':'input',**reading}}}]}
+
+@pytest.fixture
+def client(tmp_path):
+    app=create_app('sqlite:///'+str(tmp_path/'test.db'), testing=True)
+    with TestClient(app,base_url='https://testserver') as c:
+        app.state.service.rotate_key('wokwi-esp32-01', 'hwwk_test_device_secret')
+        yield c
+
+def ingest(c,b): return c.post('/api/v1/ingest/frames',json=b,headers={'X-Device-Key':'hwwk_test_device_secret'})
+def state(c): return c.get('/api/v1/stations/HWW-KNG-001/state').json()
+
+def test_idempotent_and_monotonic(client):
+    now=datetime.now(timezone.utc)
+    assert ingest(client,batch(10,7.2,now)).json()['accepted']==1
+    version=state(client)['version']
+    assert ingest(client,batch(10,7.2,now)).json()['duplicates']==1
+    assert state(client)['version']==version
+    assert ingest(client,batch(9,8.0,now-timedelta(seconds=2))).status_code==200
+    assert state(client)['sensors'][0]['value']==7.2
+
+def test_strict_provenance_unit_and_auth(client):
+    b=batch(); b['source']='field_observation'
+    assert ingest(client,b).status_code==422
+    b=batch(); b['frames'][0]['readings']['ph']['u']='NTU'
+    assert ingest(client,b).json()['code']=='unit_mismatch'
+    assert client.post('/api/v1/ingest/frames',json=batch()).status_code==401
+    assert state(client)['version']==0
+
+def test_persistence_fault_clear_and_review_guard(client):
+    now=datetime.now(timezone.utc)-timedelta(seconds=20)
+    for i in range(3): assert ingest(client,batch(i,5.4,now+timedelta(seconds=i*2))).status_code==200
+    alerts=client.get('/api/v1/alerts').json()['items']
+    assert len(alerts)==1 and alerts[0]['rule_code']=='REF_PH_BAND'
+    assert alerts[0]['evidence_class']=='simulated_anomaly'
+    assert state(client)['sensors'][0]['status']=='abnormal'
+    assert ingest(client,batch(3,None,now+timedelta(seconds=6),q='fault',fr='injected')).status_code==200
+    sensor=state(client)['sensors'][0]
+    assert sensor['value'] is None and sensor['last_valid']['value']==5.4
+    assert client.post('/api/v1/alerts/1/acknowledge',json={},headers={'X-Requested-With':'hww'}).status_code==401
+    svc=client.app.state.service
+    svc.create_user('reviewer','secret-password','reviewer')
+    assert client.post('/api/v1/auth/login',json={'username':'reviewer','password':'secret-password'},headers={'X-Requested-With':'hww'}).status_code==200
+    review=client.post('/api/v1/incident-reviews',json={'alert_ids':[1],'note':'Demo'},headers={'X-Requested-With':'hww'})
+    assert review.status_code==201
+    result=client.post('/api/v1/incident-reviews/'+str(review.json()['id'])+'/submit',json={'outcome':'verified_incident','lab_reference':'fake'},headers={'X-Requested-With':'hww'})
+    assert result.status_code==422
+
+def test_offline_nulls_and_recovery(client):
+    ingest(client,batch())
+    client.app.state.service.freshness(datetime.now(timezone.utc)+timedelta(seconds=16))
+    assert state(client)['station_status']=='offline'
+    assert state(client)['sensors'][0]['value'] is None
+    ingest(client,batch(1))
+    assert state(client)['station_status']!='offline'
+
+def test_backfill_cannot_replace_current_status(client):
+    now=datetime.now(timezone.utc)
+    ingest(client,batch(20,7.2,now))
+    ingest(client,batch(1,None,now-timedelta(seconds=20),q='fault',fr='injected'))
+    assert state(client)['sensors'][0]['status']=='normal'
+
+def test_baseline_frozen_and_clear(client):
+    from app.schemas import Batch
+    from app.service import stamp
+    svc=client.app.state.service;device=svc.authenticate('hwwk_test_device_secret');start=datetime.now(timezone.utc)-timedelta(seconds=200)
+    def send(seq,value):
+        b=batch(seq,7.2,start+timedelta(seconds=seq*2));b['sent_uptime_ms']=1000000;b['frames'][0]['readings']={'turbidity':{'v':value,'u':'NTU','q':'ok','raw':555,'gen':'input'}}
+        return svc.ingest(Batch.model_validate(b),device,received=start+timedelta(seconds=seq*2))
+    for i in range(36):send(i,18.4)
+    send(36,142.5);send(37,142.5)
+    alerts=client.get('/api/v1/alerts?rule=CHG_TURB_SPIKE').json()['items'];assert len(alerts)==1
+    a=client.get('/api/v1/alerts/'+str(alerts[0]['id'])).json();assert a['baseline_value']==pytest.approx(18.4);assert a['threshold_value']==pytest.approx(68.4)
+    for i in range(38,90):send(i,142.5)
+    assert client.get('/api/v1/alerts/'+str(a['id'])).json()['cleared_at'] is None
+    for i in range(90,95):send(i,18.4)
+    assert client.get('/api/v1/alerts/'+str(a['id'])).json()['cleared_at'] is not None
+
+def test_review_close_notes_csrf_and_roles(client):
+    now=datetime.now(timezone.utc)-timedelta(seconds=10)
+    for i in range(3):ingest(client,batch(i,5.4,now+timedelta(seconds=2*i)))
+    svc=client.app.state.service;svc.create_user('op','operator-password','operator');svc.create_user('rev','reviewer-password','reviewer');headers={'X-Requested-With':'hww'}
+    assert client.post('/api/v1/auth/login',json={'username':'op','password':'operator-password'}).status_code==403
+    client.post('/api/v1/auth/login',json={'username':'op','password':'operator-password'},headers=headers)
+    assert client.post('/api/v1/incident-reviews',json={'alert_ids':[1]},headers=headers).status_code==403
+    assert client.post('/api/v1/alerts/1/notes',json={'text':'Private operator note'},headers=headers).status_code==201
+    assert client.post('/api/v1/auth/logout',json={},headers=headers).status_code==204
+    detail=client.get('/api/v1/alerts/1').json();assert 'Private operator note' not in str(detail) and '"actor"' not in str(detail)
+    client.post('/api/v1/auth/login',json={'username':'rev','password':'reviewer-password'},headers=headers)
+    r=client.post('/api/v1/incident-reviews',json={'alert_ids':[1]},headers=headers).json()
+    result=client.post('/api/v1/incident-reviews/'+str(r['id'])+'/submit',json={'outcome':'confirmed_simulated_anomaly'},headers=headers)
+    assert result.status_code==200 and result.json()['alerts'][0]['review_status']=='closed'
+    assert result.json()['alerts'][0]['is_preliminary'] is False
+
+def test_batch_validation_atomic_and_temperature_fault(client):
+    b=batch();b['frames'].append(batch(1)['frames'][0]);b['frames'][1]['readings']['ph']['u']='bad'
+    assert ingest(client,b).status_code==422 and state(client)['version']==0
+    b=batch();b['frames'][0]['readings']={'temp':{'v':100.,'u':'degC','q':'ok','raw':None,'gen':'input'}}
+    assert ingest(client,b).status_code==200
+    alerts=client.get('/api/v1/alerts').json()['items'];assert [a['rule_code'] for a in alerts]==['VALID_RANGE']
+    assert state(client)['sensors'][3]['status']=='sensor_fault'
+
+def test_replay_catalog_start_stop_and_takeover(client):
+    svc=client.app.state.service;svc.create_user('op','operator-password','operator');h={'X-Requested-With':'hww'}
+    client.post('/api/v1/auth/login',json={'username':'op','password':'operator-password'},headers=h)
+    ingest(client,batch())
+    assert client.post('/api/v1/replays/demo-golden/runs',json={'station_code':'HWW-KNG-001','takeover':False},headers=h).status_code==409
+    r=client.post('/api/v1/replays/demo-golden/runs',json={'station_code':'HWW-KNG-001','speed':5,'takeover':True},headers=h)
+    assert r.status_code==202
+    assert ingest(client,batch(1)).status_code==409
+    assert client.get('/api/v1/stations/HWW-KNG-001/link').json()['link_status']=='replay'
+    stopped=client.post('/api/v1/replay-runs/'+r.json()['session_id']+'/stop',json={},headers=h)
+    assert stopped.status_code==200 and stopped.json()['end_reason']=='replay_stopped'
+
+def test_fixture_speed_same_alerts_and_do_drop(tmp_path):
+    import json
+    from app.service import Service,ROOT
+    from app.schemas import Batch
+    from app.models import Alert
+    from sqlalchemy import select
+    found=[]
+    for speed in (1,5):
+        svc=Service('sqlite:///'+str(tmp_path/('speed'+str(speed)+'.db')),True);svc.seed();svc.rotate_key('wokwi-esp32-01','hwwk_fixture');device=svc.authenticate('hwwk_fixture');start=datetime.now(timezone.utc)
+        lines=[json.loads(x) for x in (ROOT/'shared/fixtures/replays/demo-golden.jsonl').read_text().splitlines()]
+        for line in lines:
+            frames=line['frames'];received=start+timedelta(milliseconds=line['t_offset_ms']/speed)
+            for f in frames:f['measured_at']=(start+timedelta(milliseconds=f['uptime_ms']/speed)).isoformat().replace('+00:00','Z')
+            b=batch();b['frames']=frames;b['sent_uptime_ms']=max(f['uptime_ms'] for f in frames);svc.ingest(Batch.model_validate(b),device,received,speed)
+        with svc.DB() as db:found.append(sorted(a.rule_code for a in db.scalars(select(Alert))))
+    assert found[0]==found[1] and 'CHG_TURB_SPIKE' in found[0] and 'VALID_RANGE' in found[0]
+
+def test_do_drop_fault_suppression_and_clear(client):
+    from app.schemas import Batch
+    svc=client.app.state.service;device=svc.authenticate('hwwk_test_device_secret');start=datetime.now(timezone.utc)-timedelta(seconds=120)
+    def send(seq,value,q='ok'):
+        b=batch(seq,7.2,start+timedelta(seconds=seq*2));b['sent_uptime_ms']=1000000;r={'v':value,'u':'mg/L','q':q,'raw':1310 if q=='ok' else None,'gen':'input'}
+        if q=='fault':r['fr']='injected'
+        b['frames'][0]['readings']={'do':r};svc.ingest(Batch.model_validate(b),device,start+timedelta(seconds=seq*2))
+    for i in range(36):send(i,6.4)
+    send(36,None,'fault')
+    assert not client.get('/api/v1/alerts?rule=CHG_DO_DROP').json()['items']
+    send(37,1.8);send(38,1.8)
+    assert not client.get('/api/v1/alerts?rule=CHG_DO_DROP').json()['items']
+    send(39,1.8)
+    a=client.get('/api/v1/alerts?rule=CHG_DO_DROP').json()['items'][0]
+    for i in range(40,45):send(i,6.4)
+    assert client.get('/api/v1/alerts/'+str(a['id'])).json()['cleared_at'] is not None
+
+def test_database_persistence_restart(tmp_path):
+    from app.service import Service
+    from app.schemas import Batch
+    path='sqlite:///'+str(tmp_path/'restart.db');svc=Service(path,True);svc.seed();svc.rotate_key('wokwi-esp32-01','hwwk_restart');device=svc.authenticate('hwwk_restart');start=datetime.now(timezone.utc)-timedelta(seconds=10)
+    svc.ingest(Batch.model_validate(batch(0,5.4,start)),device);svc.ingest(Batch.model_validate(batch(1,5.4,start+timedelta(seconds=2))),device);svc.engine.dispose()
+    svc=Service(path,True);svc.seed();device=svc.authenticate('hwwk_restart');svc.ingest(Batch.model_validate(batch(2,5.4,start+timedelta(seconds=4))),device)
+    assert svc.snapshot('HWW-KNG-001')['sensors'][0]['status']=='abnormal'
+
+def test_scaled_replay_freshness_and_staff_reads(client):
+    from app.schemas import Batch
+    svc=client.app.state.service
+    with svc.DB() as db:
+        from app.models import Device
+        device=db.get(Device,'replay-hww-kng-001')
+    b=batch();b['device_code']=device.code;start=datetime.now(timezone.utc)
+    svc.ingest(Batch.model_validate(b),device,start,speed=5)
+    svc.freshness(start+timedelta(seconds=3.5))
+    assert state(client)['station_status']=='offline'
+    assert client.get('/api/v1/replays').status_code==401

--- /dev/null
+++ backend/tests/test_migrations.py
@@ -0,0 +1,22 @@
+import os
+from pathlib import Path
+from alembic import command
+from alembic.config import Config
+from sqlalchemy import create_engine,inspect,select,func
+from app.models import Base,Rule
+from sqlalchemy.orm import Session
+from sqlalchemy.schema import CreateTable
+from sqlalchemy.dialects import postgresql
+
+def test_empty_database_migrations(tmp_path,monkeypatch):
+    url='sqlite:///'+str(tmp_path/'migrations.db');monkeypatch.setenv('DATABASE_URL',url)
+    config=Config(str(Path(__file__).resolve().parents[1]/'alembic.ini'));command.upgrade(config,'head')
+    engine=create_engine(url)
+    assert set(Base.metadata.tables).issubset(set(inspect(engine).get_table_names()))
+    with Session(engine) as db:assert db.scalar(select(func.count()).select_from(Rule))==6
+    engine.dispose()
+
+def test_postgres_ddl_uses_timezone_and_jsonb():
+    ddl=str(CreateTable(Base.metadata.tables['measurements']).compile(dialect=postgresql.dialect()))
+    assert 'TIMESTAMP WITH TIME ZONE' in ddl and 'simulated_wokwi' in ddl
+    assert 'JSONB' in str(CreateTable(Base.metadata.tables['stations']).compile(dialect=postgresql.dialect()))

--- /dev/null
+++ blender/scripts/prepare_station.py
@@ -0,0 +1,74 @@
+"""Run inside Blender 4.x: import the user's OBJ, bind named nodes and export GLB.
+
+Material map is {"exact imported material name": "registry_node"}. Unknown
+materials and missing nodes fail rather than silently substituting geometry.
+"""
+import argparse
+import json
+from pathlib import Path
+import sys
+import bpy
+import bmesh
+from mathutils import Vector
+
+def main():
+    p=argparse.ArgumentParser(description=__doc__)
+    p.add_argument('--input',type=Path,required=True);p.add_argument('--map',type=Path,required=True)
+    p.add_argument('--registry',type=Path,required=True);p.add_argument('--out',type=Path,required=True)
+    p.add_argument('--scale',type=float,default=.001)
+    a=p.parse_args(sys.argv[sys.argv.index('--')+1:])
+    if not a.input.is_file():raise ValueError('Upload the station OBJ and associated MTL first: '+str(a.input))
+    mapping=json.loads(a.map.read_text(encoding='utf-8'));registry=json.loads(a.registry.read_text(encoding='utf-8'))
+    required={c['node']:c for c in registry['model']['components']}
+    for sensor in registry['sensors']:required[sensor['model_node']]={'kind':'sensor','hww_id':sensor['uid']}
+    if not mapping:raise ValueError('Fill material_map.json from the uploaded OBJ material names before running.')
+    if set(mapping.values())-set(required):raise ValueError('Unknown registry nodes: '+str(set(mapping.values())-set(required)))
+    bpy.ops.wm.read_factory_settings(use_empty=True)
+    bpy.ops.wm.obj_import(filepath=str(a.input.resolve()),global_scale=a.scale)
+    meshes=[obj for obj in bpy.context.scene.objects if obj.type=='MESH']
+    if not meshes:raise ValueError('Input contains no meshes')
+    bpy.ops.object.select_all(action='DESELECT')
+    for obj in meshes:obj.select_set(True)
+    bpy.context.view_layer.objects.active=meshes[0];bpy.ops.object.join()
+    bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.separate(type='MATERIAL');bpy.ops.object.mode_set(mode='OBJECT')
+    groups={}
+    for obj in list(bpy.context.scene.objects):
+        if obj.type!='MESH':continue
+        mats={obj.material_slots[polygon.material_index].material.name for polygon in obj.data.polygons
+              if polygon.material_index<len(obj.material_slots) and obj.material_slots[polygon.material_index].material}
+        if len(mats)!=1:raise ValueError(f'Expected one material per separated mesh: {obj.name}: {mats}')
+        material=next(iter(mats))
+        if material not in mapping:raise ValueError('Unmapped material: '+material)
+        groups.setdefault(mapping[material],[]).append(obj)
+    missing=set(required)-set(groups)
+    if missing:raise ValueError('Missing required nodes: '+', '.join(sorted(missing)))
+    report=[];total=0
+    for node,objects in sorted(groups.items()):
+        bpy.ops.object.select_all(action='DESELECT')
+        for obj in objects:obj.select_set(True)
+        bpy.context.view_layer.objects.active=objects[0]
+        if len(objects)>1:bpy.ops.object.join()
+        obj=bpy.context.object;obj.name=node;obj.data.name=node+'_mesh';obj['hww_id']=required[node].get('hww_id',node)
+        bpy.ops.object.transform_apply(location=False,rotation=True,scale=True)
+        bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY',center='BOUNDS')
+        mesh=bmesh.new();mesh.from_mesh(obj.data)
+        bmesh.ops.remove_doubles(mesh,verts=list(mesh.verts),dist=.0001)
+        bmesh.ops.recalc_face_normals(mesh,faces=list(mesh.faces))
+        mesh.to_mesh(obj.data);mesh.free();obj.data.update()
+        material=bpy.data.materials.new('mat_'+node);material.use_nodes=True
+        shader=material.node_tree.nodes.get('Principled BSDF');shader.inputs['Base Color'].default_value=(.584,.617,.673,1);shader.inputs['Roughness'].default_value=.5
+        if required[node].get('kind')=='indicator':
+            shader.inputs['Emission Color'].default_value=(.584,.617,.673,1);shader.inputs['Emission Strength'].default_value=.25
+        obj.data.materials.clear();obj.data.materials.append(material)
+        obj.data.calc_loop_triangles();triangles=len(obj.data.loop_triangles);total+=triangles
+        corners=[obj.matrix_world @ Vector(c) for c in obj.bound_box]
+        center=[sum(v[i] for v in corners)/8 for i in range(3)]
+        # Convert Blender Z-up coordinates to glTF Y-up for registry hotspots.
+        report.append({'node':node,'hww_id':obj['hww_id'],'triangles':triangles,'hotspot':[center[0],center[2],-center[1]]})
+    if total>=100000:raise ValueError(f'Triangle budget exceeded: {total}')
+    a.out.parent.mkdir(parents=True,exist_ok=True)
+    bpy.ops.wm.save_as_mainfile(filepath=str(a.out.with_suffix('.blend').resolve()))
+    bpy.ops.export_scene.gltf(filepath=str(a.out.resolve()),export_format='GLB',export_yup=True,export_extras=True,export_apply=True,export_cameras=False,export_lights=False)
+    report_path=a.out.with_suffix('.report.json');report_path.write_text(json.dumps({'triangles':total,'nodes':report},indent=2)+'\n',encoding='utf-8')
+    print('Prepared uploaded model:',a.out,'Report:',report_path)
+if __name__=='__main__':main()

--- /dev/null
+++ docker-compose.yml
@@ -0,0 +1,30 @@
+services:
+  db:
+    image: postgres:16-alpine
+    environment:
+      POSTGRES_DB: hww
+      POSTGRES_USER: hww
+      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?Set POSTGRES_PASSWORD in .env}
+    volumes:
+      - postgres_data:/var/lib/postgresql/data
+    healthcheck:
+      test: ["CMD-SHELL", "pg_isready -U hww -d hww"]
+      interval: 5s
+      timeout: 3s
+      retries: 20
+    restart: unless-stopped
+  api:
+    build: .
+    env_file: .env
+    environment:
+      DATABASE_URL: postgresql+asyncpg://hww:${POSTGRES_PASSWORD}@db:5432/hww
+      FRONTEND_DIST: /app/frontend/dist
+    ports:
+      - "127.0.0.1:8000:8000"
+    depends_on:
+      db:
+        condition: service_healthy
+    restart: unless-stopped
+volumes:
+  postgres_data:
+

--- /dev/null
+++ firmware/include/config.example.h
@@ -0,0 +1,7 @@
+#pragma once
+#define WIFI_SSID "Wokwi-GUEST"
+#define WIFI_PASSWORD ""
+#define INGEST_BASE_URL "https://your-host.example"
+#define DEVICE_KEY "replace-with-demo-scoped-device-key"
+// Paste the PEM root certificate of your HTTPS host. Never disable verification.
+#define ROOT_CA_PEM ""

--- /dev/null
+++ firmware/platformio.ini
@@ -0,0 +1,22 @@
+[platformio]
+src_dir = .
+
+[env:esp32]
+platform = espressif32@6.9.0
+board = esp32dev
+framework = arduino
+monitor_speed = 115200
+build_flags = -std=gnu++17
+build_unflags = -std=gnu++11
+build_src_filter = -<*> +<src/>
+lib_deps =
+  paulstoffregen/OneWire@2.3.8
+  milesburton/DallasTemperature@3.11.0
+  bblanchon/ArduinoJson@7.2.1
+  adafruit/Adafruit SSD1306@2.5.13
+  adafruit/Adafruit GFX Library@1.11.11
+
+[env:native]
+platform = native
+build_flags = -std=c++17 -Isrc
+build_src_filter = -<*> +<test/native.cpp>

--- /dev/null
+++ firmware/src/core.h
@@ -0,0 +1,40 @@
+#pragma once
+#include <array>
+#include <vector>
+#include <cmath>
+#include <cstdint>
+#include <algorithm>
+namespace hww {
+inline uint32_t crc32(const char* value){uint32_t crc=0xffffffff;while(*value){crc^=uint8_t(*value++);for(unsigned i=0;i<8;i++)crc=(crc>>1)^(0xedb88320u&uint32_t(-int32_t(crc&1)));}return ~crc;}
+inline double transfer(unsigned raw,double maximum,unsigned power,unsigned decimals) {
+  double scale=std::pow(10.,decimals);
+  return std::round(maximum*std::pow(std::min(raw,4095u)/4095.,power)*scale)/scale;
+}
+struct Reading { float value=0; int16_t raw=-1; uint8_t fault=0; bool profile=false; };
+struct Frame { uint32_t seq=0, uptime=0; int64_t epoch=0; uint8_t clock=0, mode=0; std::array<Reading,4> readings; };
+class Buffer {
+  std::array<Frame,600> frames{}; size_t count=0, head=0;
+public:
+  uint32_t dropped=0;
+  size_t size() const {return count;}
+  void push(const Frame& frame) { if(count==600){head=(head+1)%600; count--; dropped++;} frames[(head+count++)%600]=frame; }
+  std::vector<Frame> select(size_t limit) const {
+    std::vector<Frame> out; if(!count || !limit)return out;
+    out.push_back(frames[(head+count-1)%600]);
+    for(size_t i=0;i+1<count && out.size()<limit;i++)out.push_back(frames[(head+i)%600]);
+    return out;
+  }
+  void ack(uint32_t seq) {for(size_t i=0;i<count;i++)if(frames[(head+i)%600].seq==seq){for(size_t j=i;j+1<count;j++)frames[(head+j)%600]=frames[(head+j+1)%600];count--;break;}}
+};
+class Backoff { unsigned step=0; public:
+  unsigned next(unsigned random1000) {unsigned base=std::min(30000u,1000u<<std::min(step++,5u));return base*(800+std::min(random1000,1000u)*.4)/1000;}
+  void reset(){step=0;}
+};
+inline const char* modeName(unsigned mode){return mode==1?"gradual_ph":mode==2?"spike_turb":mode==3?"do_drop":"manual";}
+inline void profile(Frame& f,unsigned mode,uint32_t elapsed) {
+  f.mode=mode;
+  if(mode==1){f.readings[0].value=std::round((7.2f-1.8f*std::min(elapsed/120000.f,1.f))*100)/100;f.readings[0].profile=true;f.readings[0].raw=-1;}
+  if(mode==2){f.readings[2].value=180;f.readings[2].profile=true;f.readings[2].raw=-1;}
+  if(mode==3){f.readings[1].value=1.8;f.readings[1].profile=true;f.readings[1].raw=-1;}
+}
+}

--- /dev/null
+++ firmware/src/main.cpp
@@ -0,0 +1,174 @@
+#include <Arduino.h>
+#include <WiFi.h>
+#include <WiFiClientSecure.h>
+#include <HTTPClient.h>
+#include <ArduinoJson.h>
+#include <OneWire.h>
+#include <DallasTemperature.h>
+#include <Adafruit_SSD1306.h>
+#include <sys/time.h>
+#include <time.h>
+#include <esp_sntp.h>
+#include "core.h"
+#include "generated/registry.h"
+#if __has_include("config.h")
+#include "config.h"
+#else
+#include "config.example.h"
+#endif
+
+// Sampling and UI run independently of blocking HTTPS on core 0.
+hww::Buffer buffer;
+SemaphoreHandle_t guard;
+OneWire wire(4); DallasTemperature temperature(&wire);
+Adafruit_SSD1306 oled(128,64,&Wire,-1);
+const unsigned faultPins[]={16,17,18,19};
+volatile uint32_t lastAck=0,txAt=0; volatile int lastHttp=0;
+volatile bool authError=false; volatile uint8_t serverStatus=0;
+uint32_t seq=0, modeStart=0; unsigned mode=0; String boot;
+volatile uint8_t timeSource=0;
+
+String utc(int64_t milliseconds){
+  time_t seconds=milliseconds/1000;struct tm t;gmtime_r(&seconds,&t);
+  char out[32];strftime(out,sizeof(out),"%Y-%m-%dT%H:%M:%S",&t);
+  char frac[8];snprintf(frac,sizeof(frac),".%03dZ",int(milliseconds%1000));return String(out)+frac;
+}
+int64_t epochNow(){struct timeval t;gettimeofday(&t,nullptr);return int64_t(t.tv_sec)*1000+t.tv_usec/1000;}
+void syncServer(const String& stamp){
+  if(timeSource==1 || stamp.length()<19)return;
+  struct tm tm{};if(!strptime(stamp.c_str(),"%Y-%m-%dT%H:%M:%S",&tm))return;
+  time_t seconds=mktime(&tm);struct timeval tv{seconds,0};settimeofday(&tv,nullptr);timeSource=2;
+}
+void serializeFrame(JsonObject out,const hww::Frame& f,uint32_t now){
+  out["seq"]=f.seq;out["uptime_ms"]=f.uptime;out["buffered"]=uint32_t(now-f.uptime)>4000;
+  out["mode"]=hww::modeName(f.mode);out["time_source"]=f.clock==1?"ntp":f.clock==2?"server":"uptime";
+  if(f.clock)out["measured_at"]=utc(f.epoch);else out["measured_at"]=nullptr;
+  JsonObject readings=out["readings"].to<JsonObject>();
+  for(unsigned i=0;i<4;i++){
+    const auto& r=f.readings[i];JsonObject j=readings[registry::channels[i].name].to<JsonObject>();
+    if(r.fault)j["v"]=nullptr;else j["v"]=r.value;
+    j["u"]=registry::channels[i].unit;j["q"]=r.fault?"fault":"ok";
+    if(r.fault)j["fr"]=r.fault==1?"injected":r.fault==2?"disconnected":"out_of_range";
+    if(r.raw<0 || r.fault)j["raw"]=nullptr;else j["raw"]=r.raw;
+    j["gen"]=r.profile?"profile":"input";
+  }
+}
+void uplink(void*){
+  hww::Backoff backoff;unsigned limit=20,interval=2000;uint32_t due=0,lastConnect=0;bool metaDone=false;
+  WiFiClientSecure tls;WiFiClient local;tls.setCACert(ROOT_CA_PEM);
+  String base=INGEST_BASE_URL;
+  // HTTP is allowed only on the optional private Wokwi loopback gateway.
+  bool https=base.startsWith("https://");
+  bool allowed=https || base=="http://host.wokwi.internal:8000";
+  for(;;){
+    uint32_t now=millis();
+    if(digitalRead(23)==LOW){WiFi.disconnect();vTaskDelay(pdMS_TO_TICKS(100));continue;}
+    if(WiFi.status()!=WL_CONNECTED){
+      if(!lastConnect || now-lastConnect>=15000){WiFi.begin(WIFI_SSID,WIFI_PASSWORD,6);lastConnect=now;}
+      vTaskDelay(pdMS_TO_TICKS(100));continue;
+    }
+    if(!allowed || (https && !strlen(ROOT_CA_PEM))){lastHttp=-2;vTaskDelay(pdMS_TO_TICKS(1000));continue;}
+    if(int32_t(now-due)<0){vTaskDelay(pdMS_TO_TICKS(50));continue;}
+    HTTPClient http;http.setTimeout(8000);http.setConnectTimeout(8000);http.setReuse(true);
+    WiFiClient& client=https?static_cast<WiFiClient&>(tls):local;
+    if(!metaDone){
+      http.begin(client,base+"/api/v1/meta");int code=http.GET();
+      if(code==200){JsonDocument doc;if(!deserializeJson(doc,http.getString())){syncServer(doc["server_time"].as<String>());metaDone=true;}}
+      http.end();
+    }
+    xSemaphoreTake(guard,portMAX_DELAY);auto frames=buffer.select(limit);unsigned depth=buffer.size();unsigned dropped=buffer.dropped;xSemaphoreGive(guard);
+    if(frames.empty()){vTaskDelay(pdMS_TO_TICKS(50));continue;}
+    if(boot.isEmpty()){
+      String seed=String(esp_random())+":"+utc(epochNow())+":"+String(millis());
+      char id[9];snprintf(id,sizeof(id),"%08lx",(unsigned long)hww::crc32(seed.c_str()));boot=id;
+    }
+    now=millis();JsonDocument doc;doc["schema"]="hww.frames.v1";doc["station_code"]=registry::station;
+    doc["device_code"]=registry::device;doc["boot_id"]=boot;doc["fw_version"]="0.4.0";
+    doc["sent_uptime_ms"]=now;if(timeSource)doc["sent_at"]=utc(epochNow());else doc["sent_at"]=nullptr;
+    JsonObject diag=doc["diag"].to<JsonObject>();diag["buffer_depth"]=depth;diag["dropped_frames"]=dropped;
+    static unsigned rejected=0;diag["rejected_batches"]=rejected;diag["wifi_rssi"]=WiFi.RSSI();
+    JsonArray list=doc["frames"].to<JsonArray>();for(const auto& f:frames)serializeFrame(list.add<JsonObject>(),f,now);
+    String body;serializeJson(doc,body);http.begin(client,base+"/api/v1/ingest/frames");
+    const char* headers[]={"Retry-After"};http.collectHeaders(headers,1);
+    http.addHeader("Content-Type","application/json");http.addHeader("X-Device-Key",DEVICE_KEY);txAt=millis();
+    int code=http.POST(body);lastHttp=code;unsigned wait=backoff.next(esp_random()%1001);
+    if(code==200){
+      JsonDocument response;if(!deserializeJson(response,http.getString())){
+        xSemaphoreTake(guard,portMAX_DELAY);
+        for(JsonObject result:response["results"].as<JsonArray>()){
+          uint32_t acknowledged=result["seq"]; // Only acknowledge sequences actually submitted.
+          for(const auto& f:frames)if(f.seq==acknowledged)buffer.ack(acknowledged);
+        }xSemaphoreGive(guard);
+        String status=response["station_status"].as<String>();serverStatus=status=="abnormal"?3:status=="degraded"?2:status=="normal"?1:0;
+        syncServer(response["server_time"].as<String>());interval=std::max(2000u,response["next_min_interval_ms"].as<unsigned>());
+        lastAck=millis();authError=false;backoff.reset();wait=interval;
+      }
+    }else if(code==401 || code==403){authError=true;wait=60000;}
+    else if(code==409){xSemaphoreTake(guard,portMAX_DELAY);buffer.ack(frames[0].seq);xSemaphoreGive(guard);wait=10000;}
+    else if(code==413){limit=std::max(1u,limit/2);}
+    else if(code==422){xSemaphoreTake(guard,portMAX_DELAY);for(const auto& f:frames)buffer.ack(f.seq);xSemaphoreGive(guard);rejected++;}
+    else if(code==429 || code==503){unsigned seconds=http.header("Retry-After").toInt();if(seconds)wait=seconds*1000;}
+    http.end();due=millis()+std::max(interval,wait);
+  }
+}
+
+void setup(){
+  Serial.begin(115200);guard=xSemaphoreCreateMutex();
+  for(auto pin:faultPins)pinMode(pin,INPUT_PULLUP);
+  pinMode(23,INPUT_PULLUP);pinMode(33,INPUT_PULLUP);
+  for(int pin:{25,26,27,14,2,13})pinMode(pin,OUTPUT);
+  analogReadResolution(12);temperature.begin();temperature.setResolution(10);temperature.setWaitForConversion(false);temperature.requestTemperatures();
+  Wire.begin(21,22);oled.begin(SSD1306_SWITCHCAPVCC,0x3c);oled.setTextSize(1);oled.setTextColor(SSD1306_WHITE);
+  setenv("TZ","UTC0",1);tzset();
+  // A cold ESP32 has no RTC date. Bootstrap TLS certificate date checks from
+  // this build's date, but never label readings with that approximate clock.
+  // Until NTP or authenticated meta succeeds, they remain uptime-only.
+  if(time(nullptr)<1700000000){struct tm built{};strptime(__DATE__ " " __TIME__,"%b %d %Y %H:%M:%S",&built);struct timeval initial{mktime(&built),0};settimeofday(&initial,nullptr);}
+  sntp_set_time_sync_notification_cb([](struct timeval*){timeSource=1;});
+  WiFi.mode(WIFI_STA);configTime(0,0,"pool.ntp.org","time.google.com");
+  xTaskCreatePinnedToCore(uplink,"uplink",16384,nullptr,1,nullptr,0);
+}
+void loop(){
+  static uint32_t sampled=0,buttonChanged=0,uiAt=0,beepAt=0;static bool buttonRaw=true,buttonStable=true;
+  static unsigned samples=0,lastStatus=0;static uint32_t sums[3]={};static hww::Frame latest;
+  static float tempSum=0;static unsigned tempSamples=0,tempFault=0;
+  uint32_t now=millis();bool button=digitalRead(33);
+  if(button!=buttonRaw){buttonRaw=button;buttonChanged=now;}
+  if(button!=buttonStable && now-buttonChanged>=50){buttonStable=button;if(!button){mode=(mode+1)%4;modeStart=now;}}
+  if(mode && now-modeStart>=(mode==1?180000u:60000u))mode=0;
+  if(now-sampled>=250){
+    sampled=now;for(unsigned i=0;i<3;i++)sums[i]+=analogRead(registry::channels[i].pin);
+    float measured=temperature.getTempCByIndex(0);
+    if(measured==DEVICE_DISCONNECTED_C)tempFault=2;
+    else if(measured<-55 || measured>125)tempFault=3;
+    else{tempSum+=measured;tempSamples++;}
+    temperature.requestTemperatures();
+    samples++;
+    if(samples==8){
+      hww::Frame f;f.seq=seq++;f.uptime=now;f.clock=timeSource;f.epoch=f.clock?epochNow():0;
+      for(unsigned i=0;i<3;i++){auto c=registry::channels[i];f.readings[i].raw=(sums[i]+4)/8;f.readings[i].value=hww::transfer(f.readings[i].raw,c.maximum,c.power,c.decimals);sums[i]=0;}
+      f.readings[3].value=tempSamples?round(tempSum/tempSamples*100)/100:0;
+      f.readings[3].fault=tempFault;tempSum=0;tempSamples=0;tempFault=0;
+      hww::profile(f,mode,now-modeStart);
+      for(unsigned i=0;i<4;i++)if(digitalRead(faultPins[i])==LOW)f.readings[i].fault=1;
+      xSemaphoreTake(guard,portMAX_DELAY);buffer.push(f);xSemaphoreGive(guard);latest=f;samples=0;
+    }
+  }
+  unsigned status=serverStatus;
+  if(status==3 && lastStatus!=3)beepAt=now;lastStatus=status;
+  unsigned elapsed=now-beepAt;if(beepAt && (elapsed<120 || (elapsed>=240 && elapsed<360)))tone(13,1200);else noTone(13);
+  bool stale=!lastAck || now-lastAck>15000;
+  digitalWrite(25,!authError && !stale && status==1);
+  digitalWrite(26,!authError && (stale?(now/500)%2:status==2));
+  digitalWrite(27,authError?(now/250)%2:!stale && status==3);
+  digitalWrite(14,!authError && !stale && status==3);digitalWrite(2,txAt && now-txAt<50);
+  if(now-uiAt>=250){
+    uiAt=now;oled.clearDisplay();oled.setCursor(0,0);oled.printf("%s M%u\n",registry::station,mode);
+    for(unsigned i=0;i<4;i++){oled.print(registry::channels[i].name);oled.print(' ');if(latest.readings[i].fault)oled.print("FAULT");else oled.print(latest.readings[i].value,registry::channels[i].decimals);oled.print(i%2?'\n':' ');}
+    xSemaphoreTake(guard,portMAX_DELAY);unsigned depth=buffer.size();xSemaphoreGive(guard);
+    oled.printf("%s q:%u #%lu\n",authError?"AUTH ERR":stale?"LINK LOST":"LINK OK",depth,(unsigned long)latest.seq);
+    oled.printf("SRV %s %d\n",status==3?"ABNORMAL":status==2?"degraded":status==1?"normal":"unknown",lastHttp);
+    oled.println("SIMULATED DATA");oled.display();
+  }
+  delay(1);
+}

--- /dev/null
+++ firmware/test/native.cpp
@@ -0,0 +1,21 @@
+#include "core.h"
+#include <cassert>
+#include <cmath>
+#include <iostream>
+int main() {
+  assert(hww::crc32("123456789")==0xcbf43926u);
+  assert(std::abs(hww::transfer(2109,14,1,2)-7.21)<.001);
+  assert(std::abs(hww::transfer(555,1000,2,1)-18.4)<.001);
+  hww::Buffer b;
+  for(unsigned i=0;i<605;i++){ hww::Frame f{}; f.seq=i; b.push(f); }
+  assert(b.size()==600 && b.dropped==5);
+  auto batch=b.select(20);
+  assert(batch.size()==20 && batch[0].seq==604 && batch[1].seq==5 && batch[19].seq==23);
+  b.ack(604); b.ack(7); b.ack(999);
+  assert(b.size()==598 && b.select(1)[0].seq==603);
+  hww::Backoff back;
+  for(unsigned expected: {1000,2000,4000,8000,16000,30000,30000}) assert(back.next(500)==expected);
+  back.reset(); assert(back.next(0)==800); assert(back.next(1000)==2400);
+  hww::Frame f{};hww::profile(f,1,120000);assert(std::abs(f.readings[0].value-5.4)<.001 && f.readings[0].profile);
+  std::cout << "transfer, overflow, live-first batches, selective acknowledgements, backoff: passed\n";
+}

--- /dev/null
+++ frontend/src/AlertsPage.tsx
@@ -0,0 +1,4 @@
+import {useState} from 'react';import {Link,useParams,useSearchParams} from 'react-router-dom';import {useTranslation} from 'react-i18next';import {ArrowLeft,SlidersHorizontal,ShieldCheck,AlertTriangle} from 'lucide-react';import {useAlerts,useAlert,useAction,useUser,useStations} from './api';import {AlertRows,QueryState,Empty,useText} from './common';import {formatTime,formatValue} from './domain';
+export default function AlertsPage(){const {id}=useParams();return id?<Detail id={id}/>:<List/>}
+function List(){const {t}=useTranslation();const [params,setParams]=useSearchParams(),stations=useStations();const q=useAlerts(params.toString());const fields=[{key:'station',label:t('station'),values:stations.data?.items.map(s=>s.code)||[]},{key:'channel',label:t('sensor'),values:['ph','do','turbidity','temp']},{key:'review_status',label:t('status'),values:['open','acknowledged','under_review','closed']},{key:'severity',label:t('severity'),values:['info','warning','critical']},{key:'category',label:t('category'),values:['water_quality','equipment']},{key:'evidence_class',label:t('evidence'),values:['simulated_anomaly','environmental_observation','verified_incident']}];return <><div className="page-title"><div><div className="eyebrow">MONITORING / INCIDENT WORKSPACE</div><h1>{t('alerts')}</h1><p>{t('alertIntro')}</p></div><span className="badge amber"><ShieldCheck size={14}/>{t('preliminary')}</span></div><section className="panel filters"><div className="panel-head"><h2><SlidersHorizontal size={17}/>{t('filters')}</h2><button className="textlink" onClick={()=>setParams({})}>{t('clear')}</button></div><div className="filter-grid">{fields.map(f=><label key={f.key}>{f.label}<select value={params.get(f.key)||''} onChange={e=>{const next=new URLSearchParams(params);if(e.target.value)next.set(f.key,e.target.value);else next.delete(f.key);setParams(next)}}><option value="">{t('all')}</option>{f.values.map(v=><option key={v} value={v}>{v.replaceAll('_',' ')}</option>)}</select></label>)}</div></section><section className="panel"><div className="panel-head"><h2>{t('recent')}</h2><span className="badge">{q.data?.total??'—'} {t('results')}</span></div><QueryState loading={q.isLoading} error={q.error}/><AlertRows items={q.data?.items||[]}/>{q.data?.next_cursor&&<button className="button" onClick={()=>{const p=new URLSearchParams(params);p.set('cursor',q.data!.next_cursor!);setParams(p)}}>{t('nextPage')}</button>}</section></>}
+function Detail({id}:{id:string}){const {t}=useTranslation(),text=useText(),q=useAlert(id),user=useUser(),action=useAction();const [note,setNote]=useState(''),[outcome,setOutcome]=useState('confirmed_simulated_anomaly');const [reviewId,setReviewId]=useState<number>();const a=q.data;const role=user.data?.user.role;const canReview=role==='reviewer'||role==='admin';function act(path:string,body:unknown){action.mutate({path,body},{onSuccess:d=>{if(path==='/incident-reviews')setReviewId(d.id as number);setNote('')}})}return <><Link className="back-link" to="/alerts"><ArrowLeft size={15}/>{t('alerts')}</Link><QueryState loading={q.isLoading} error={q.error}/>{a&&<><div className="page-title"><div><div className="eyebrow">ALERT #{a.id} / {a.station_code}</div><h1>{text(a.rule_name)}</h1><p>{formatTime(a.opened_at)}</p></div><span className="badge amber">{a.review_status.replaceAll('_',' ')}</span></div><div className="detail-grid"><section className="panel"><div className="panel-head"><h2><AlertTriangle size={18}/>{t('simulatedAnomaly')}</h2><span className="badge">{t('source')}</span></div><div className="detail-body"><div className="evidence-values"><div><span>{t('observed')}</span><strong>{formatValue(a.observed_value,2)} <small>{a.unit}</small></strong></div><div><span>{t('baseline')}</span><strong>{formatValue(a.baseline_value,2)}</strong></div><div><span>{t('threshold')}</span><strong>{formatValue(a.threshold_value,2)}</strong></div></div><dl><div><dt>{t('rule')}</dt><dd>{a.rule_code}</dd></div><div><dt>{t('category')} / {t('severity')}</dt><dd>{a.category} · {a.severity}</dd></div><div><dt>{t('evidence')}</dt><dd>{a.evidence_class} {a.is_preliminary?'· '+t('preliminary'):''}</dd></div><div><dt>{t('cleared')}</dt><dd>{formatTime(a.cleared_at)}</dd></div></dl><h3>{t('ruleBasis')}</h3><div className="basis">{text(a.basis_snapshot?.basis_text)}<small>{a.basis_snapshot?.basis_status}</small></div><Link className="textlink" to={`/stations/${a.station_code}/dashboard`}>{t('dashboard')} →</Link></div></section><section className="panel"><div className="panel-head"><h2>{t('review')}</h2><ShieldCheck size={18}/></div><div className="detail-body"><p>{t('reviewOutcomeNotice')}</p>{!user.data?<><Link className="button primary" to={'/login?returnTo=/alerts/'+id}>{t('signInActions')}</Link><p className="muted">{t('notesHidden')}</p></>:<><label>{t('note')}<textarea value={note} maxLength={2000} rows={4} onChange={e=>setNote(e.target.value)}/></label><div className="action-row"><button className="button" disabled={action.isPending||a.review_status!=='open'} onClick={()=>act(`/alerts/${id}/acknowledge`,{note})}>{t('ack')}</button><button className="button" disabled={action.isPending||!note.trim()} onClick={()=>act(`/alerts/${id}/notes`,{text:note})}>{t('addNote')}</button></div>{a.review_status!=='closed'&&(a.review?.id||reviewId?<><label>{t('outcome')}<select value={outcome} onChange={e=>setOutcome(e.target.value)}>{['confirmed_simulated_anomaly','sensor_or_equipment_fault','false_positive','test_or_calibration'].map(o=><option value={o} key={o}>{t(o)}</option>)}</select></label><button className="button primary" disabled={!canReview||action.isPending||!note.trim()} onClick={()=>act(`/incident-reviews/${a.review?.id||reviewId}/submit`,{outcome,note,lab_reference:null})}>{t('submitReview')}</button></>:<button className="button primary" disabled={!canReview||action.isPending} title={!canReview?t('roleRequired'):undefined} onClick={()=>act('/incident-reviews',{alert_ids:[a.id],note})}>{t('startReview')}</button>)}{!canReview&&<small>{t('roleRequired')}</small>}</>}{action.isError&&<div role="alert" className="error">{action.error.message}</div>}{action.isSuccess&&<p className="success" role="status">{t('actionSaved')}</p>}</div></section></div><section className="panel"><div className="panel-head"><h2>{t('historyEvents')}</h2></div>{a.events?.length?<div className="timeline">{a.events.map((e,i)=><div className="timeline-item" key={i}><span className="timeline-dot"/><div><strong>{e.type.replaceAll('_',' ')}</strong><small>{formatTime(e.at)}{e.actor?' · '+e.actor:''}</small>{e.data?.note&&<p>{e.data.note}</p>}</div></div>)}</div>:<Empty>{t('noEvents')}</Empty>}</section></>}</>}

--- /dev/null
+++ frontend/src/DashboardPage.tsx
@@ -0,0 +1,7 @@
+import {useMemo,useState} from 'react';import {Link,useParams} from 'react-router-dom';import {useTranslation} from 'react-i18next';import {ResponsiveContainer,LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid} from 'recharts';import {Activity,Download,Box,Clock3} from 'lucide-react';import {useStationState,useStation,useHistory,useResource} from './api';import {SensorCard,QueryState,StatusBadge,Source,useText,Empty} from './common';import {formatTime,formatValue,withGaps,formatShortTime,historyCsv} from './domain';import type {Sensor} from './types';
+export default function DashboardPage(){const {code='HWW-KNG-001'}=useParams(),{t}=useTranslation(),text=useText();const q=useStationState(code),station=useStation(code);const [range,setRange]=useState('1');const to=useMemo(()=>new Date().toISOString(),[range]);const from=useMemo(()=>new Date(Date.parse(to)-Number(range)*3600000).toISOString(),[to,range]);const timeline=useResource<{availability:{pct:number;received_frames:number;expected_frames:number};items:Array<{at:string;type:string;sensor_uid:string|null;data:Record<string,unknown>}>}>('timeline',`/stations/${code}/timeline?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&limit=30`);return <><div className="page-title"><div><div className="eyebrow">{t('dashboard')} / {code}</div><h1>{text(station.data?.name)}</h1><p>{t('oneSnapshot')}</p></div><Link className="button" to={`/stations/${code}/model`}><Box size={16}/>{t('model')}</Link></div><QueryState loading={q.isLoading} error={q.error}/><div className="station-meta"><StatusBadge status={q.data?.station_status}/><Source state={q.data}/><span>{t('snapshot')} v{q.data?.version??'—'}</span><span>{t('lastFrame')}: {formatTime(q.data?.last_frame_at)}</span></div><div className="sensor-grid">{q.data?.sensors.map(s=><SensorCard key={s.uid} sensor={s} disconnected={q.isError}/>)}</div><div className="section-heading"><div><h2>{t('history')}</h2><p>{t('gapsVisible')}</p></div><label className="inline-label">{t('range')}<select value={range} onChange={e=>setRange(e.target.value)}><option value="0.25">{t('minutes15')}</option><option value="1">{t('hour1')}</option><option value="6">{t('hours6')}</option><option value="24">{t('hours24')}</option><option value="168">{t('days7')}</option></select></label></div><div className="chart-grid">{q.data?.sensors.map(s=><HistoryChart key={s.uid} sensor={s} code={code} from={from} to={to}/>)}</div><section className="panel"><div className="panel-head"><h2><Clock3 size={18}/>{t('timeline')}</h2><span className="badge">{t('availability')}: {timeline.data?formatValue(timeline.data.availability.pct,1)+'%':'—'}</span></div><QueryState loading={timeline.isLoading} error={timeline.error}/>{timeline.data?.items.length?<div className="timeline">{timeline.data.items.map((e,i)=><div className="timeline-item" key={i}><span className="timeline-dot"/><div><strong>{e.type.replaceAll('_',' ')}</strong><small>{e.sensor_uid||code} · {formatTime(e.at)}</small>{Boolean(e.data.alert_id)&&<Link to={'/alerts/'+e.data.alert_id}>Alert #{String(e.data.alert_id)}</Link>}</div></div>)}</div>:<Empty>{t('noEvents')}</Empty>}</section></>}
+export function HistoryChart({sensor,code,from,to}:{sensor:Sensor;code:string;from:string;to:string}){const {t}=useTranslation();const q=useHistory(code,sensor.channel,from,to);const [table,setTable]=useState(false);const interval=q.data?.bucket==='raw'?2000:q.data?.bucket==='10s'?10000:q.data?.bucket==='1m'?60000:q.data?.bucket==='5m'?300000:3600000;const data=withGaps(q.data?.points||[],interval);function csv(){const url=URL.createObjectURL(new Blob([historyCsv(q.data?.points||[],sensor.unit)],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`${code}-${sensor.channel}-simulated.csv`;a.click();URL.revokeObjectURL(url)}return <section className="panel chart-panel"><div className="panel-head"><div><h2>{sensor.channel==='do'?t('oxygenLabel'):sensor.channel==='temp'?t('tempLabel'):sensor.channel==='ph'?'pH':t('turbidityLabel')}</h2><p>{sensor.unit==='degC'?'°C':sensor.unit} · {t('source')} · {q.data?.bucket||'auto'}</p></div><div className="button-group"><button onClick={()=>setTable(!table)}>{t(table?'chart':'table')}</button><button disabled={!data.length} onClick={csv} aria-label={t('csv')}><Download size={14}/></button></div></div><QueryState loading={q.isLoading} error={q.error}/>{!q.isLoading&&!q.isError&&!data.length?<Empty>{t('noHistory')}</Empty>:table?<div className="table-wrap"><table><thead><tr><th>{t('time')}</th><th>{t('value')}</th><th>{t('faults')}</th></tr></thead><tbody>{q.data?.points.map(p=><tr key={p.t}><td>{formatTime(p.t)}</td><td>{formatValue(p.v,sensor.decimals)} {sensor.unit}</td><td>{p.faults}</td></tr>)}</tbody></table></div>:<div className="chart"><ResponsiveContainer width="100%" height={220}><LineChart data={data} margin={{left:0,right:20,top:20,bottom:5}}><CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false}/><XAxis dataKey="t" tickFormatter={v=>formatShortTime(v)} tick={{fontSize:10}} minTickGap={45}/><YAxis tick={{fontSize:10}} width={42}/><Tooltip labelFormatter={v=>formatTime(String(v))}/><Line type="linear" dataKey="v" name={sensor.channel} stroke="#0284c7" strokeWidth={2} dot={false} connectNulls={false} isAnimationActive={false}/></LineChart></ResponsiveContainer></div>}</section>}
+
+
+
+

--- /dev/null
+++ frontend/src/ModelCanvas.tsx
@@ -0,0 +1,4 @@
+import {Suspense,useEffect,useMemo,useRef} from 'react';import {Canvas,useThree} from '@react-three/fiber';import {Bounds,OrbitControls,useGLTF} from '@react-three/drei';import {Mesh,MeshStandardMaterial} from 'three';import type {OrbitControls as OrbitControlsType} from 'three-stdlib';import type {Sensor,Status} from './types';import {statusColor} from './common';
+function Asset({sensors,status,onSelect}:{sensors:Sensor[];status:Status;onSelect:(s:string)=>void}){const gltf=useGLTF('/models/station-v1.glb');const scene=useMemo(()=>{const clone=gltf.scene.clone(true);clone.traverse(o=>{if(o instanceof Mesh){o.material=Array.isArray(o.material)?o.material.map(m=>m.clone()):o.material.clone()}});return clone},[gltf.scene]);useEffect(()=>()=>{scene.traverse(o=>{if(o instanceof Mesh)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose())})},[scene]);useEffect(()=>{scene.traverse(o=>{if(o instanceof Mesh){const s=sensors.find(s=>s.model_node===o.name);const mats=(Array.isArray(o.material)?o.material:[o.material]) as MeshStandardMaterial[];if(s){mats.forEach(m=>{m.color.set(statusColor(s.status));m.transparent=true;m.opacity=['offline','unavailable'].includes(s.status)?.6:1});o.userData.channel=s.channel}const on=o.name==='beacon'?status==='abnormal':o.name==='led_red'?status==='abnormal':o.name==='led_yellow'?status==='degraded':o.name==='led_green'?status==='normal':null;if(on!==null)mats.forEach(m=>{m.emissive?.set(on?o.name==='led_green'?'#16a34a':o.name==='led_yellow'?'#d97706':'#dc2626':'#000000');m.emissiveIntensity=on?1:0})}})},[scene,sensors,status]);return <primitive object={scene} onClick={(e:{stopPropagation:()=>void;object:Mesh})=>{e.stopPropagation();if(e.object.userData.channel)onSelect(e.object.userData.channel)}}/>}
+function Controls(){const ref=useRef<OrbitControlsType>(null);const {camera,gl}=useThree();useEffect(()=>{const element=gl.domElement;element.tabIndex=0;element.setAttribute('aria-label','Station model: arrow keys rotate, plus and minus zoom, R resets');function key(e:KeyboardEvent){const c=ref.current;if(!c)return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','r','R'].includes(e.key)){e.preventDefault();if(e.key==='r'||e.key==='R')c.reset();else if(e.key==='+'||e.key==='-')camera.position.multiplyScalar(e.key==='+'?.9:1.1);else{const p=camera.position;const a=e.key==='ArrowLeft'?.1:e.key==='ArrowRight'?-.1:0;const x=p.x;p.x=x*Math.cos(a)-p.z*Math.sin(a);p.z=x*Math.sin(a)+p.z*Math.cos(a);if(e.key==='ArrowUp')p.y+=.15;if(e.key==='ArrowDown')p.y-=.15}c.update()}}element.addEventListener('keydown',key);return()=>element.removeEventListener('keydown',key)},[camera,gl]);return <OrbitControls ref={ref} makeDefault/>}
+export default function ModelCanvas({sensors,status,onSelect}:{sensors:Sensor[];status:Status;onSelect:(s:string)=>void}){return <Canvas camera={{position:[3,2,4],fov:45}} onCreated={({gl})=>{gl.domElement.addEventListener('webglcontextlost',()=>{gl.domElement.dispatchEvent(new CustomEvent('hww-context-lost',{bubbles:true}))})}} aria-label="Station digital model"><ambientLight intensity={1.5}/><directionalLight position={[4,6,2]} intensity={2}/><directionalLight position={[-4,3,-2]} intensity={1}/><Suspense fallback={null}><Bounds fit clip observe margin={1.3}><Asset sensors={sensors} status={status} onSelect={onSelect}/></Bounds></Suspense><Controls/></Canvas>}

--- /dev/null
+++ frontend/src/ModelPage.tsx
@@ -0,0 +1,9 @@
+import {Component,lazy,Suspense,useState,useEffect} from 'react';import {useTranslation} from 'react-i18next';import {Link,useParams,useSearchParams} from 'react-router-dom';import {Box,ArrowUpRight,RotateCcw} from 'lucide-react';import {useStationState,useStation} from './api';import {SensorCard,QueryState,StatusBadge,useText,Source,statusColor,Empty} from './common';import type {Sensor} from './types';import {displayCurrent,formatValue} from './domain';
+const ModelCanvas=lazy(()=>import('./ModelCanvas'));
+class Boundary extends Component<{children:React.ReactNode;fallback:React.ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?this.props.fallback:this.props.children}}
+export default function ModelPage(){const {code='HWW-KNG-001'}=useParams();const q=useStationState(code),meta=useStation(code);const {t}=useTranslation(),text=useText();const [params,setParams]=useSearchParams();const selected=params.get('sensor')||'turbidity';const select=(channel:string)=>{setParams({sensor:channel},{replace:true})};const [mode,setMode]=useState('2d');const [asset,setAsset]=useState<boolean|null>(null);const [reset,setReset]=useState(0);const sensors=q.data?.sensors||[];const sensor=sensors.find(s=>s.channel===selected)||sensors[0];const schematic=<div className='schematic-wrap'><Schematic sensors={sensors} selected={selected} onSelect={select}/><div className='schematic-buttons'>{['ph','do','turbidity','temp'].map((ch,i)=><button key={ch} className={selected===ch?'selected':''} style={{left:(23.68+i*8.68)+'%'}} onClick={()=>select(ch)} aria-label={'Select '+ch+' sensor'}>{ch.toUpperCase()}</button>)}</div></div>;async function open3d(){try{const r=await fetch('/models/station-v1.glb');const b=await r.arrayBuffer();const available=r.ok&&b.byteLength>4&&new DataView(b).getUint32(0,true)===0x46546c67;setAsset(available);if(available)setMode('3d')}catch{setAsset(false)}}useEffect(()=>{void open3d()},[]);useEffect(()=>{const handler=()=>{setMode('2d');setAsset(false)};document.addEventListener('hww-context-lost',handler);return()=>document.removeEventListener('hww-context-lost',handler)},[]);
+return <><div className="page-title"><div><div className="eyebrow">{t('model')} / {code}</div><h1>{text(meta.data?.name)}</h1><p>{t('selectSensor')}</p></div><Link className="button" to={`/stations/${code}/dashboard`}>{t('dashboard')} <ArrowUpRight size={16}/></Link></div><QueryState loading={q.isLoading} error={q.error}/><div className="station-meta"><StatusBadge status={q.data?.station_status}/><Source state={q.data}/><span>{t('snapshot')} v{q.data?.version??'—'}</span></div><div className={'model-layout '+(q.isError?'stale-state':'')}><section className="panel model-panel"><div className="panel-head"><h2><Box size={18}/>{t('model')}</h2><div className="button-group"><button className={mode==='2d'?'active':''} onClick={()=>setMode('2d')}>{t('schematic')}</button><button className={mode==='3d'?'active':''} onClick={()=>void open3d()}>{t('model3d')}</button><button aria-label={t('reset')} onClick={()=>setReset(v=>v+1)}><RotateCcw size={14}/></button></div></div><div className="model-viewport" aria-label={q.isError?t('error'):undefined}>{mode==='3d'?<Boundary fallback={schematic}><Suspense fallback={<Empty>{t('loading')}</Empty>}><ModelCanvas key={reset} sensors={sensors} status={q.data?.station_status||'unavailable'} onSelect={select}/></Suspense></Boundary>:schematic}</div><div className="model-foot">{q.isError?t('error'):asset===false?t('modelMissing'):mode==='2d'?t('selectSensor'):t('selectSensor')}</div></section><aside className="model-aside"><section className="panel"><div className="panel-head"><h2>{t('parameters')}</h2><span className="badge">4</span></div><div className="sensor-list">{sensors.map(s=><button className={s.channel===selected?'selected':''} key={s.uid} onClick={()=>select(s.channel)}><span><strong>{s.channel==='temp'?t('tempLabel'):s.channel==='do'?t('oxygenLabel'):s.channel==='ph'?'pH':t('turbidityLabel')}</strong><StatusBadge status={s.status}/></span><b>{formatValue(displayCurrent(s.value,s.status,q.isError),s.decimals)}<small>{s.unit==='degC'?'°C':s.unit}</small></b></button>)}</div></section>{sensor&&<SensorCard sensor={sensor} disconnected={q.isError}/>}</aside></div></>}
+function Schematic({sensors,selected,onSelect}:{sensors:Sensor[];selected:string;onSelect:(s:string)=>void}){return <svg className="schematic" viewBox="0 0 760 480" aria-hidden="true"><defs><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#cbd5e1"/></pattern><linearGradient id="water" x2="0" y2="1"><stop stopColor="#bae6fd"/><stop offset="1" stopColor="#e0f2fe"/></linearGradient></defs><rect width="760" height="480" fill="url(#grid)"/><path d="M0 355Q95 338 190 355T380 355T570 355T760 355V480H0Z" fill="url(#water)"/><path d="M70 380Q170 362 270 380T470 380T670 380" fill="none" stroke="#7dd3fc" strokeWidth="2"/><path d="M80 324H660" stroke="#64748b" strokeWidth="10" strokeLinecap="round"/><path d="M150 324V445M610 324V445" stroke="#94a3b8" strokeWidth="12"/><rect x="440" y="140" width="136" height="184" rx="8" fill="#e2e8f0" stroke="#64748b" strokeWidth="2"/><rect x="455" y="157" width="106" height="55" rx="4" fill="#0f172a"/><text x="508" y="180" textAnchor="middle" fill="#7dd3fc" fontSize="11">HANOI WATERWATCH</text><text x="508" y="200" textAnchor="middle" fill="#94a3b8" fontSize="10">ESP32 · SIMULATED</text><rect x="493" y="112" width="30" height="28" rx="8" fill="#cbd5e1" stroke="#64748b"/><path d="M508 140V94" stroke="#64748b"/><path d="M462 252H554M462 264H554M462 276H554" stroke="#94a3b8" strokeWidth="3"/>{['ph','do','turbidity','temp'].map((ch,i)=>{const s=sensors.find(s=>s.channel===ch),x=180+i*66,c=s?statusColor(s.status):'#cbd5e1';return <g key={ch}  aria-label={`Select ${ch} sensor, ${s?.status||'no data'}`} onClick={()=>onSelect(ch)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(ch)}}} style={{cursor:'pointer'}}><path d={`M${x} 365V240Q${x} 229 ${x+12} 229H440`} fill="none" stroke="#94a3b8" strokeWidth="2"/><rect x={x-12} y="360" width="24" height="56" rx="8" fill={c} stroke={selected===ch?'#0369a1':'#fff'} strokeWidth={selected===ch?4:2}/><circle cx={x} cy="291" r="18" fill="#fff" stroke={selected===ch?'#0284c7':'#cbd5e1'} strokeWidth="2"/><text x={x} y="295" textAnchor="middle" fontSize="10" fontWeight="700" fill="#334155">{ch.toUpperCase()}</text></g>})}<text x="80" y="68" fill="#64748b" fontSize="11" letterSpacing="2">STATION SCHEMATIC / ILLUSTRATIVE</text><text x="80" y="94" fill="#0f172a" fontSize="22" fontWeight="700">Connected water monitoring</text><text x="80" y="450" fill="#0369a1" fontSize="11">SIMULATED WATER INPUTS</text></svg>}
+
+
+

--- /dev/null
+++ frontend/src/SimulationPage.tsx
@@ -0,0 +1,3 @@
+import {useState} from 'react';import {useTranslation} from 'react-i18next';import {Cpu,Cloud,Database,Monitor,ArrowRight,ExternalLink,Play,Square,Radio} from 'lucide-react';import {useResource,useUser,useAction} from './api';import {QueryState,Empty} from './common';import {formatTime} from './domain';
+interface LinkData{link_status:string;session:{id:string;source:string;device_code:string;boot_id:string;fw_version:string;frames_accepted:number;frames_duplicate:number;frames_rejected:number}|null;last_frame_received_at:string|null;diag:Record<string,number>|null;last_error:unknown;last_batch:unknown}
+export default function SimulationPage(){const {t}=useTranslation(),user=useUser(),action=useAction();const [code,setCode]=useState('HWW-KNG-001'),[recording,setRecording]=useState('demo-golden'),[speed,setSpeed]=useState(1),[takeover,setTakeover]=useState(false),[run,setRun]=useState<string>();const link=useResource<LinkData>('link',`/stations/${code}/link`,2000),meta=useResource<{wokwi_project_url:string|null}>('meta','/meta'),replays=useResource<{items:Array<{name:string;duration_s:number}>}>('replays','/replays',30000,!!user.data);const d=link.data;return <><div className="page-title"><div><div className="eyebrow">SIMULATION / END-TO-END DEMONSTRATION</div><h1>{t('pipeline')}</h1><p>{t('pipelineIntro')}</p></div><span className="badge">{t('source')}</span></div><section className="pipeline">{[{icon:Cpu,title:'Wokwi ESP32',sub:t('simInputs')},{icon:Cloud,title:'HTTPS ingest',sub:t('validateDedupe')},{icon:Database,title:'PostgreSQL',sub:t('persistEvaluate')},{icon:Monitor,title:'WaterWatch',sub:t('oneState')}].map((p,i)=><div className="pipeline-item" key={p.title}><span className="pipeline-icon"><p.icon size={25}/></span><strong>{p.title}</strong><small>{p.sub}</small>{i<3&&<ArrowRight className="pipeline-arrow" size={20}/>}</div>)}</section><div className="detail-grid"><section className="panel"><div className="panel-head"><h2><Cpu size={18}/>{t('circuitTitle')}</h2></div><div className="detail-body"><p>{t('instructions')}</p><div className="circuit-board"><Cpu size={44}/><strong>ESP32</strong><span>pH · DO · Turbidity · Temperature</span><small>pot_ph → GPIO34 &nbsp; pot_do → GPIO35</small><small>pot_turb → GPIO32 &nbsp; DS18B20 → GPIO4</small></div>{meta.data?.wokwi_project_url?<a className="button primary" href={meta.data.wokwi_project_url} target="_blank" rel="noopener noreferrer">{t('wokwiLink')}<ExternalLink size={15}/></a>:<p className="muted">{t('noLink')}</p>}</div></section><section className="panel"><div className="panel-head"><h2><Radio size={18}/>{t('connection')}</h2><span className="badge">{d?.link_status||t('waiting')}</span></div><div className="detail-body"><label>{t('station')}<select value={code} onChange={e=>setCode(e.target.value)}><option>HWW-KNG-001</option><option>HWW-TLH-001</option><option>HWW-NHU-001</option></select></label><QueryState loading={link.isLoading} error={link.error}/><dl><div><dt>{t('lastFrame')}</dt><dd>{formatTime(d?.last_frame_received_at)}</dd></div><div><dt>{t('deviceLabel')}</dt><dd>{d?.session?`${d.session.source} / ${d.session.device_code}`:'—'}</dd></div><div><dt>{t('bootFirmware')}</dt><dd>{d?.session?`${d.session.boot_id} / ${d.session.fw_version}`:'—'}</dd></div><div><dt>{t('acceptedCounts')}</dt><dd>{d?.session?`${d.session.frames_accepted} / ${d.session.frames_duplicate} / ${d.session.frames_rejected}`:'—'}</dd></div><div><dt>{t('diagnostics')}</dt><dd>{d?.diag?JSON.stringify(d.diag):'—'}</dd></div><div><dt>{t('lastError')}</dt><dd>{d?.last_error?JSON.stringify(d.last_error):'—'}</dd></div></dl></div></section></div><section className="panel"><div className="panel-head"><h2>{t('scenario')}</h2><span className="badge">{t('warmUp')}</span></div><div className="scenarios">{[{n:'01',title:t('normalOperation'),body:t('normalInstructions')},{n:'02',title:t('spikeTitle'),body:t('spikeInstructions')},{n:'03',title:t('oxygenDrop'),body:t('oxygenInstructions')},{n:'04',title:t('faultTitle'),body:t('faultInstructions')},{n:'05',title:t('networkInterruption'),body:t('networkInstructions')},{n:'06',title:t('recovery'),body:t('recoveryInstructions')}].map(s=><article key={s.n}><span>{s.n}</span><h3>{s.title}</h3><p>{s.body}</p></article>)}</div></section><section className="panel"><div className="panel-head"><h2>{t('payload')}</h2><span className="badge">hww.frames.v1</span></div>{d?.last_batch?<pre className="payload">{JSON.stringify(d.last_batch,null,2)}</pre>:<Empty>{t('noPayload')}</Empty>}</section><section className="panel"><div className="panel-head"><h2><Play size={17}/>{t('replayControls')}</h2><span className="badge">STAFF</span></div><div className="detail-body">{!user.data?<p>{t('signInActions')}</p>:<><div className="replay-grid"><label>{t('recording')}<select value={recording} onChange={e=>setRecording(e.target.value)}>{replays.data?.items.map(r=><option key={r.name} value={r.name}>{r.name} · {r.duration_s}s</option>)}</select></label><label>{t('speed')}<select value={speed} onChange={e=>setSpeed(Number(e.target.value))}>{[1,2,5].map(s=><option key={s} value={s}>{s}×</option>)}</select></label><button className="button primary" disabled={action.isPending||!replays.data?.items.length||!!run} onClick={()=>action.mutate({path:`/replays/${recording}/runs`,body:{station_code:code,speed,takeover,loop:false}},{onSuccess:r=>setRun(r.session_id as string)})}><Play size={15}/>{t('run')}</button>{(run||d?.link_status==='replay')&&<button className="button" disabled={action.isPending} onClick={()=>action.mutate({path:`/replay-runs/${run||d?.session?.id}/stop`,body:{}},{onSuccess:()=>setRun(undefined)})}><Square size={15}/>{t('stop')}</button>}</div><label className="checkbox"><input type="checkbox" checked={takeover} onChange={e=>setTakeover(e.target.checked)}/>{t('takeover')}</label>{action.isError&&<div className="error" role="alert">{action.error.message}</div>}{action.isSuccess&&<p className="success" role="status">{t('replayAccepted')}</p>}</>}</div></section></>}

--- /dev/null
+++ frontend/src/StationMap.tsx
@@ -0,0 +1,2 @@
+import {useState} from 'react';import {MapContainer,TileLayer,CircleMarker,Tooltip} from 'react-leaflet';import {useNavigate} from 'react-router-dom';import type {Station,Snapshot} from './types';import {statusColor} from './common';import 'leaflet/dist/leaflet.css';
+export default function StationMap({stations,states}:{stations:Station[];states:(Snapshot|undefined)[]}){const nav=useNavigate();const [failed,setFailed]=useState(false);return <div className="map-wrap"><MapContainer center={[21.005,105.826]} zoom={12} scrollWheelZoom={false} aria-hidden="true"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" eventHandlers={{tileerror:()=>setFailed(true)}}/>{stations.map((s,i)=><CircleMarker key={s.code} center={[s.location.lat,s.location.lng]} radius={11} pathOptions={{color:'#fff',weight:3,fillColor:statusColor(states[i]?.station_status||'unavailable'),fillOpacity:1}} eventHandlers={{click:()=>nav(`/stations/${s.code}/model`)}}><Tooltip>{s.code} · {states[i]?.station_status||'unavailable'}</Tooltip></CircleMarker>)}</MapContainer>{failed&&<span className="map-notice">Map tiles unavailable · use the station list</span>}<span className="map-caption">Illustrative locations · Hanoi, Vietnam</span></div>}

--- /dev/null
+++ frontend/src/api.ts
@@ -0,0 +1,18 @@
+import {syncServerClock} from './clock';
+import {useQuery,useQueryClient,useMutation} from '@tanstack/react-query';
+import {acceptVersion} from './domain';
+import type {Snapshot,Station,Alert,History,User} from './types';
+export class ApiError extends Error{constructor(public status:number,message:string){super(message)}}
+export async function api<T>(path:string,body?:unknown):Promise<T>{const r=await fetch('/api/v1'+path,{credentials:'same-origin',signal:AbortSignal.timeout(8000),...(body!==undefined?{method:'POST',headers:{'Content-Type':'application/json','X-Requested-With':'hww'},body:JSON.stringify(body)}:{})});syncServerClock(r.headers.get('Date'));if(!r.ok){const p=await r.json().catch(()=>({}));throw new ApiError(r.status,typeof p.detail==='string'?p.detail:p.title||p.code||JSON.stringify(p.detail)||`Request failed (${r.status})`)}if(r.status===204)return undefined as T;return r.json()}
+export const useStations=()=>useQuery({queryKey:['stations'],queryFn:()=>api<{items:Station[]}>('/stations')});
+export const useStation=(code:string)=>useQuery({queryKey:['station',code],queryFn:()=>api<Station>('/stations/'+code)});
+export function useStationState(code:string){const client=useQueryClient();return useQuery({queryKey:['stationState',code],queryFn:async()=>acceptVersion(client.getQueryData<Snapshot>(['stationState',code]),await api<Snapshot>(`/stations/${code}/state`)),refetchInterval:2000,retry:false})}
+export const useAlerts=(filters='')=>useQuery({queryKey:['alerts',filters],queryFn:()=>api<{items:Alert[];next_cursor:string|null;total:number}>('/alerts?'+filters),refetchInterval:5000});
+export const useAlert=(id:string)=>useQuery({queryKey:['alert',id],queryFn:()=>api<Alert>('/alerts/'+id),refetchInterval:5000});
+export const useUser=()=>useQuery({queryKey:['user'],queryFn:()=>api<{user:User}>('/auth/me'),retry:false,staleTime:60000});
+export const useHistory=(code:string,channel:string,from:string,to:string)=>useQuery({queryKey:['history',code,channel,from,to],queryFn:()=>api<History>(`/stations/${code}/measurements?channel=${channel}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`),refetchInterval:10000});
+export function useAction(){const c=useQueryClient();return useMutation({mutationFn:({path,body}:{path:string;body:unknown})=>api<Record<string,unknown>>(path,body),onSuccess:()=>{void c.invalidateQueries()}})}
+export const useResource=<T,>(key:string,path:string,poll=10000,enabled=true)=>useQuery({queryKey:[key,path],queryFn:()=>api<T>(path),refetchInterval:poll,enabled});
+
+
+

--- /dev/null
+++ frontend/src/clock.ts
@@ -0,0 +1,5 @@
+import {useSyncExternalStore} from 'react';
+let now=Date.now();let offset=0;const listeners=new Set<()=>void>();let timer:ReturnType<typeof setInterval>|undefined;
+export function syncServerClock(date:string|null){if(date){const n=Date.parse(date);if(Number.isFinite(n))offset=n-Date.now()}}
+function subscribe(cb:()=>void){listeners.add(cb);if(!timer)timer=setInterval(()=>{now=Date.now()+offset;listeners.forEach(f=>f())},1000);return()=>{listeners.delete(cb);if(!listeners.size&&timer){clearInterval(timer);timer=undefined}}}
+export function useClock(){return useSyncExternalStore(subscribe,()=>now,()=>now)}

--- /dev/null
+++ frontend/src/common.tsx
@@ -0,0 +1,15 @@
+import {ApiError} from './api';
+import {useClock} from './clock';import {useTranslation} from 'react-i18next';import {AlertTriangle,CheckCircle2,WifiOff,Wrench,MinusCircle,AlertCircle,ArrowUpRight} from 'lucide-react';import {Link} from 'react-router-dom';import visuals from '../../shared/registry/status_visuals.json';import sensorTypes from '../../shared/registry/sensor_types.json';import {displayCurrent,formatTime,formatValue} from './domain';import type {Status,LocalText,Sensor,Snapshot,Alert} from './types';
+export function useText(){const {i18n}=useTranslation();return (s:LocalText|undefined)=>typeof s==='string'?s:s?.[i18n.language as 'en'|'vi']||s?.en||'—'}
+export function StatusBadge({status='unavailable'}:{status?:Status}){const {i18n}=useTranslation();const v=visuals.statuses[status];const I={normal:CheckCircle2,abnormal:AlertTriangle,sensor_fault:Wrench,offline:WifiOff,unavailable:MinusCircle,degraded:AlertCircle}[status];return <span className={'status status-'+status} style={{color:v.text}}><I size={13}/>{v.label[i18n.language as 'en'|'vi']||v.label.en}</span>}
+export const statusColor=(s:Status)=>visuals.statuses[s].fill;
+export function Clock({at}:{at:string|null|undefined}){const {i18n}=useTranslation();const now=useClock();return <time dateTime={at||undefined} title={formatTime(at,i18n.language)}>{at?`${formatTime(at,i18n.language)} · ${Math.max(0,Math.floor((now-Date.parse(at))/1000))}s`:'—'}</time>}
+export function Source({state}:{state?:Snapshot}){const {t}=useTranslation();return <span className="source"><span/>{t(!state?.session?'waiting':state.session.source==='simulated_replay'?'replay':'wokwi')}</span>}
+export function Empty({children}:{children?:React.ReactNode}){const {t}=useTranslation();return <div className="empty"><MinusCircle size={26}/><p>{children||t('noData')}</p></div>}
+export function QueryState({loading,error}:{loading:boolean;error:unknown}){const {t}=useTranslation();return loading?<div className="skeleton" aria-busy="true">{t('loading')}</div>:error?<div className="error" role="alert">{error instanceof ApiError&&error.status===404?<><p>{t('notFound')}</p><Link to='/'>{t('return')}</Link></>:t('error')}</div>:null}
+export function SensorCard({sensor,disconnected=false,onClick}:{sensor:Sensor;disconnected?:boolean;onClick?:()=>void}){const {t,i18n}=useTranslation();const text=useText();const types=sensorTypes.types as Record<string,{label:LocalText;unit_display:string}>;const v=displayCurrent(sensor.value,sensor.status,disconnected);return <article className={'sensor-card '+(disconnected?'stale-state ':'')+(onClick?'clickable':'')} onClick={onClick}><div className="between"><span className="eyebrow">{text(types[sensor.channel]?.label)||sensor.channel}</span><span className="sensor-dot" style={{background:statusColor(sensor.status)}}/></div><div className="reading">{formatValue(v,sensor.decimals,i18n.language)} <small>{types[sensor.channel]?.unit_display||sensor.unit}</small></div><StatusBadge status={sensor.status}/>{disconnected&&<small>{t('lastKnown')}</small>}<div className="measured"><Clock at={sensor.measured_at}/></div>{sensor.last_valid&&<small>{t('lastValid')}: {formatValue(sensor.last_valid.value,sensor.decimals)} · {formatTime(sensor.last_valid.measured_at)}</small>}{sensor.fault_reason&&<small>{sensor.fault_reason}</small>}{sensor.active_alert_id&&<Link className="textlink" to={'/alerts/'+sensor.active_alert_id}>#{sensor.active_alert_id} <ArrowUpRight size={12}/></Link>}</article>}
+export function AlertRows({items}:{items:Alert[]}){const {t}=useTranslation();const text=useText();return items.length?<div className="alert-rows">{items.map(a=><Link key={a.id} to={'/alerts/'+a.id} className="alert-row"><span className={'alert-symbol '+a.severity}><AlertTriangle size={18}/></span><div><strong>{text(a.rule_name)||a.rule_code}</strong><small>#{a.id} · {a.station_code} · {formatTime(a.opened_at)}</small></div><div className="alert-tags"><span className="badge amber">{a.severity}</span><span className="badge">{t('source')}</span><span className="badge">{a.review_status.replaceAll('_',' ')}</span></div><ArrowUpRight size={17}/></Link>)}</div>:<Empty>{t('noAlerts')}</Empty>}
+
+
+
+

--- /dev/null
+++ frontend/src/csv.test.ts
@@ -0,0 +1,2 @@
+import {it,expect} from 'vitest';import {historyCsv} from './domain';
+it('exports separate CSV records and leaves missing values empty',()=>{expect(historyCsv([{t:'2026-01-01T00:00:00Z',v:null},{t:'2026-01-01T00:00:02Z',v:0}],'NTU')).toBe('measured_at,value,unit,is_simulated\n2026-01-01T00:00:00Z,,NTU,true\n2026-01-01T00:00:02Z,0,NTU,true')});

--- /dev/null
+++ frontend/src/domain.test.ts
@@ -0,0 +1,7 @@
+import {describe,it,expect} from 'vitest';
+import {formatValue,acceptVersion,withGaps} from './domain';
+describe('honest monitoring presentation',()=>{
+it('does not turn missing or fault values into numbers',()=>{expect(formatValue(null,2)).toBe('—');expect(formatValue(0,2)).toBe('0.00')});
+it('rejects an older snapshot',()=>{expect(acceptVersion({version:5},{version:4})).toEqual({version:5});expect(acceptVersion({version:5},{version:6})).toEqual({version:6})});
+it('breaks history across missing samples',()=>{expect(withGaps([{t:'2026-01-01T00:00:00Z',v:3},{t:'2026-01-01T00:00:10Z',v:4}],2000)).toHaveLength(3);expect(withGaps([{t:'2026-01-01T00:00:00Z',v:3},{t:'2026-01-01T00:00:10Z',v:4}],2000)[1].v).toBeNull()});
+});

--- /dev/null
+++ frontend/src/domain.ts
@@ -0,0 +1,7 @@
+export const formatValue=(v:number|null|undefined,d=2,locale='en')=>v==null||!Number.isFinite(v)?'—':new Intl.NumberFormat(locale,{minimumFractionDigits:d,maximumFractionDigits:d}).format(v);
+export const formatTime=(v:string|null|undefined,locale='en')=>v?new Intl.DateTimeFormat(locale,{timeZone:'Asia/Ho_Chi_Minh',dateStyle:'medium',timeStyle:'medium'}).format(new Date(v))+' ICT':'—';
+export function acceptVersion<T extends {version:number}>(old:T|undefined,next:T):T{return old&&old.version>next.version?old:next}
+export function withGaps<T extends {t:string;v:number|null}>(points:T[],interval:number):(T|{t:string;v:null})[]{return points.flatMap((p,i)=>i&&Date.parse(p.t)-Date.parse(points[i-1].t)>interval*1.5?[{t:new Date(Date.parse(points[i-1].t)+interval).toISOString(),v:null},p]:[p])}
+export const displayCurrent=(value:number|null,status:string,disconnected:boolean):number|null=>disconnected||['sensor_fault','offline','unavailable'].includes(status)?null:value;
+export const formatShortTime=(v:string,locale='en')=>new Intl.DateTimeFormat(locale,{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(v));
+export function historyCsv(points:Array<{t:string;v:number|null}>,unit:string){return ['measured_at,value,unit,is_simulated',...points.map(p=>`${p.t},${p.v??''},${unit},true`)].join('\n')}

--- /dev/null
+++ frontend/src/honesty.test.ts
@@ -0,0 +1,4 @@
+import {it,expect} from 'vitest';import {displayCurrent,formatTime} from './domain';import en from './locales/en.json';import vi from './locales/vi.json';
+it('hides current values for sensor faults, offline and unavailable snapshots',()=>{expect(displayCurrent(8,'sensor_fault',false)).toBeNull();expect(displayCurrent(8,'offline',false)).toBeNull();expect(displayCurrent(8,'unavailable',false)).toBeNull();expect(displayCurrent(8,'normal',true)).toBeNull();expect(displayCurrent(0,'normal',false)).toBe(0)});
+it('always renders timestamps in ICT',()=>{expect(formatTime('2026-01-01T00:00:00Z')).toContain('7:00:00');expect(formatTime('2026-01-01T00:00:00Z')).toContain('ICT')});
+it('provides both languages for every translation key',()=>expect(Object.keys(en).sort()).toEqual(Object.keys(vi).sort()));

--- /dev/null
+++ frontend/src/i18n.ts
@@ -0,0 +1,2 @@
+import i18n from 'i18next';import {initReactI18next} from 'react-i18next';import en from './locales/en.json';import vi from './locales/vi.json';
+void i18n.use(initReactI18next).init({resources:{en:{translation:en},vi:{translation:vi}},lng:localStorage.getItem('hww-language')||(navigator.language.startsWith('vi')?'vi':'en'),fallbackLng:'en',interpolation:{escapeValue:false}});export default i18n;

--- /dev/null
+++ frontend/src/main.tsx
@@ -0,0 +1,12 @@
+import {lazy,Suspense,useEffect,useState} from 'react';import {createRoot} from 'react-dom/client';import {BrowserRouter,Routes,Route,NavLink,Link,useLocation,useNavigate,useParams} from 'react-router-dom';import {QueryClient,QueryClientProvider} from '@tanstack/react-query';import {useTranslation} from 'react-i18next';import {Activity,Droplets,LayoutDashboard,Box,Bell,FlaskConical,ArrowUpRight,ArrowRight,MapPin,Radio,ShieldCheck,LogIn,Globe,Menu,X} from 'lucide-react';import {useAlerts,useStations,useStationState,useUser,useAction,useResource} from './api';import {AlertRows,StatusBadge,Source,QueryState,useText,Clock,Empty} from './common';import type {Station,Snapshot} from './types';import './i18n';import './styles.css';
+const Model=lazy(()=>import('./ModelPage')),Dashboard=lazy(()=>import('./DashboardPage')),Alerts=lazy(()=>import('./AlertsPage')),Simulation=lazy(()=>import('./SimulationPage')),StationMap=lazy(()=>import('./StationMap'));
+const client=new QueryClient({defaultOptions:{queries:{staleTime:1500,retry:1,refetchOnWindowFocus:true}}});
+function App(){const {t,i18n}=useTranslation(),user=useUser(),action=useAction(),loc=useLocation(),nav=useNavigate();const health=useResource<{status:string}>('health','/health',5000);const alerts=useAlerts('review_status=open&limit=5');const [menu,setMenu]=useState(false);useEffect(()=>{setMenu(false)},[loc.pathname]);useEffect(()=>{document.documentElement.lang=i18n.language;localStorage.setItem('hww-language',i18n.language)},[i18n.language]);useEffect(()=>{document.title=(user.data&&alerts.data?.total?`(${alerts.data.total}) `:'')+'Hanoi WaterWatch'},[alerts.data?.total,user.data]);const navigation=[{to:'/',label:'overview',icon:LayoutDashboard},{to:'/stations/HWW-KNG-001/model',label:'model',icon:Box},{to:'/stations/HWW-KNG-001/dashboard',label:'dashboard',icon:Activity},{to:'/alerts',label:'alerts',icon:Bell},{to:'/simulation',label:'simulation',icon:FlaskConical}];return <div className="app"><a href="#main" className="skip">Skip to content</a><aside className={'sidebar '+(menu?'open':'')}><Link className="brand" to="/"><span className="brand-mark"><Droplets size={25}/></span><div>Hanoi<span>WATERWATCH</span></div></Link><div className="nav-caption">{t('monitoringPlatform')}</div><nav>{navigation.map(n=><NavLink end={n.to==='/'} key={n.to} to={n.to}><n.icon size={19}/>{t(n.label)}{n.label==='alerts'&&user.data&&!!alerts.data?.total&&<b>{alerts.data.total}</b>}</NavLink>)}</nav><div className="sidebar-bottom"><div className="demo-seal"><FlaskConical size={20}/><div><strong>{t('demoNetwork')}</strong><small>{t('simInputsOnly')}</small></div></div><p>Hanoi, Vietnam <span>21.0278° N · 105.8342° E</span></p><small className="version">PLATFORM v1.0.0</small></div></aside><div className="workspace"><header className="topbar"><button className="mobile-menu icon-button" aria-label="Toggle menu" onClick={()=>setMenu(!menu)}>{menu?<X size={20}/>:<Menu size={20}/>}</button><span className="breadcrumb">{t('workspace')} <span>/</span> <strong>{t(loc.pathname.includes('model')?'model':loc.pathname.includes('dashboard')?'dashboard':loc.pathname.startsWith('/alerts')?'alerts':loc.pathname==='/simulation'?'simulation':loc.pathname==='/login'?'login':'overview')}</strong></span><div className="top-actions"><span className={'connection '+(health.isSuccess&&!health.isError?'connected':'disconnected')}><i/>{health.isSuccess&&!health.isError?t('apiConnected'):health.isLoading?t('connecting'):t('disconnected')}</span><button className="language" onClick={()=>void i18n.changeLanguage(i18n.language==='vi'?'en':'vi')}><Globe size={15}/>{i18n.language.toUpperCase()}</button>{user.data?<><Link className="icon-button" aria-label="Open alerts" to="/alerts?review_status=open"><Bell size={18}/></Link><button className="user-button" onClick={()=>action.mutate({path:'/auth/logout',body:{}},{onSuccess:()=>nav('/')})}><span>{user.data.user.display_name.slice(0,1)}</span>{t('logout')}</button></>:<Link className="signin" to={'/login?returnTo='+encodeURIComponent(loc.pathname+loc.search)}><LogIn size={15}/>{t('login')}</Link>}</div></header><div className="sim-banner" role="note"><FlaskConical size={17}/><p>{t('banner')}</p><span className="badge">{t('source')}</span></div>{health.isError&&<div className="error global-error" role="alert">{t('error')}</div>}<main id="main"><Suspense fallback={<Empty>{t('loading')}</Empty>}><Routes><Route path="/" element={<Overview/>}/><Route path="/stations/:code/model" element={<Model/>}/><Route path="/stations/:code/dashboard" element={<Dashboard/>}/><Route path="/stations/:code" element={<RedirectStation/>}/><Route path="/alerts" element={<Alerts/>}/><Route path="/alerts/:id" element={<Alerts/>}/><Route path="/simulation" element={<Simulation/>}/><Route path="/login" element={<Login/>}/><Route path="*" element={<Empty><h1>{t('notFound')}</h1><Link to="/">{t('return')}</Link></Empty>}/></Routes></Suspense></main><footer>{t('simFooter')}<span>API v1 · Registry v1</span></footer></div></div>}
+function Overview(){const {t}=useTranslation(),text=useText(),registry=useStations(),alerts=useAlerts('limit=5');const q1=useStationState('HWW-KNG-001'),q2=useStationState('HWW-TLH-001'),q3=useStationState('HWW-NHU-001');const queries=[q1,q2,q3],states=queries.map(q=>q.data),stations=registry.data?.items||[];const metrics=[{label:t('stations'),value:registry.data?stations.length:'—',sub:t('threeSites'),icon:MapPin},{label:t('normal'),value:states.filter(s=>s?.station_status==='normal').length,sub:t('serverComputed'),icon:ShieldCheck},{label:t('attention'),value:states.filter(s=>s&&['abnormal','degraded','offline'].includes(s.station_status)).length,sub:t('anomaliesConnection'),icon:Activity},{label:t('openAlerts'),value:states.reduce((n,s)=>n+(s?.open_alert_count||0),0),sub:t('preliminarySimulated'),icon:Bell}];return <><div className="page-title"><div><div className="eyebrow">{t('liveWorkspace')}</div><h1>{t('network')}</h1><p>{t('intro')}</p></div><Link className="button primary" to="/simulation"><FlaskConical size={16}/>{t('simulation')}<ArrowUpRight size={16}/></Link></div><div className="metrics">{metrics.map(m=><article key={m.label} className="metric"><div className="between"><span>{m.label}</span><m.icon size={19}/></div><strong>{queries.some(q=>q.isLoading||q.isError)?'—':m.value}</strong><small>{m.sub}</small></article>)}</div><QueryState loading={registry.isLoading} error={registry.error}/><div className="overview-grid"><section className="panel map-panel"><div className="panel-head"><h2><MapPin size={17}/>{t('stations')}</h2><span className="badge">{t('illustrative')}</span></div><Suspense fallback={<Empty>{t('loading')}</Empty>}><StationMap stations={stations} states={stations.map(s=>states.find(st=>st?.station_code===s.code))}/></Suspense><div className="map-legend"><StatusBadge status="normal"/><StatusBadge status="abnormal"/><StatusBadge status="offline"/><StatusBadge status="unavailable"/></div></section><section className="panel station-panel"><div className="panel-head"><h2>{t('directory')}</h2><span className="count">03</span></div>{stations.map((s,i)=><StationRow key={s.code} station={s} state={states.find(st=>st?.station_code===s.code)} index={i}/>)}</section></div><section className="panel recent-panel"><div className="panel-head"><div><h2>{t('recent')}</h2><p>{t('awaitingContext')}</p></div><Link className="textlink" to="/alerts">{t('allAlerts')}<ArrowRight size={15}/></Link></div><QueryState loading={alerts.isLoading} error={alerts.error}/><AlertRows items={alerts.data?.items||[]}/><div className="panel-foot"><ShieldCheck size={15}/>{t('reviewOutcomeNotice')}</div></section><div className="evidence-note"><strong>{t('evidenceClasses')}</strong><span>{t('simulatedAnomaly')} · {t('available')}</span><span>{t('observationReserved')}</span><span>{t('incidentFieldOnly')}</span></div></>}
+function StationRow({station:s,state,index}:{station:Station;state?:Snapshot;index:number}){const {t}=useTranslation(),text=useText();return <article className="station-row"><div className="station-index">0{index+1}</div><div className="station-info"><span className="eyebrow">{s.code}</span><h3>{s.river} River</h3><StatusBadge status={state?.station_status}/><div className="station-source">{s.data_mode==='planned'?t('planned'):<Source state={state}/>}</div><small className="station-time"><Clock at={state?.last_frame_at}/></small><div className="station-links"><Link to={`/stations/${s.code}/model`}>{t('model')} <ArrowUpRight size={12}/></Link><Link to={`/stations/${s.code}/dashboard`}>{t('dashboard')} <ArrowUpRight size={12}/></Link></div><span className="sr-only">{text(s.name)}</span></div></article>}
+function RedirectStation(){const {code}=useParams(),nav=useNavigate();useEffect(()=>{void nav(`/stations/${code}/dashboard`,{replace:true})},[code,nav]);return null}
+function Login(){const {t}=useTranslation(),action=useAction(),nav=useNavigate(),loc=useLocation();const [username,setUsername]=useState(''),[password,setPassword]=useState('');return <div className="login-wrap"><section className="panel login-panel"><span className="login-icon"><ShieldCheck size={30}/></span><div className="eyebrow">HANOI WATERWATCH / STAFF</div><h1>{t('login')}</h1><p>{t('loginIntro')}</p><form onSubmit={e=>{e.preventDefault();action.mutate({path:'/auth/login',body:{username,password}},{onSuccess:()=>{const target=new URLSearchParams(loc.search).get('returnTo')||'/';nav(target.startsWith('/')&&!target.startsWith('//')&&!target.includes(String.fromCharCode(92))?target:'/')}})}}><label>{t('username')}<input value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username" required/></label><label>{t('password')}<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/></label>{action.isError&&<div className="error" role="alert">{action.error.message}</div>}<button className="button primary" disabled={action.isPending}>{t('login')}<ArrowRight size={16}/></button></form><Link className="textlink" to="/">{t('return')}</Link></section></div>}
+createRoot(document.getElementById('root')!).render(<QueryClientProvider client={client}><BrowserRouter><App/></BrowserRouter></QueryClientProvider>);
+
+
+

--- /dev/null
+++ frontend/src/styles.css
@@ -0,0 +1,7 @@
+:root{font-family:Inter,'Segoe UI',system-ui,sans-serif;color:#334155;background:#f6f8fb;font-synthesis:none;font-size:14px;font-variant-numeric:tabular-nums;--line:#e5eaf0}*{box-sizing:border-box}body{margin:0}button,input,select,textarea{font:inherit}button,a{touch-action:manipulation}button{cursor:pointer;color:inherit}button:disabled{cursor:not-allowed;opacity:.5}a{color:inherit;text-decoration:none}h1,h2,h3,p{margin:0}h1,h2,h3{color:#122238}h1{font-size:29px;letter-spacing:-1.1px;line-height:1.3;font-weight:750}h2{font-size:15px;letter-spacing:-.3px}h3{font-size:15px}p{line-height:1.7}small{font-size:11px}button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,svg g:focus-visible{outline:3px solid #38bdf8;outline-offset:3px}.app{display:flex;min-height:100vh}.sidebar{width:236px;background:#0e1d32;color:#a7b4c7;position:fixed;inset:0 auto 0 0;padding:32px 19px;display:flex;flex-direction:column;z-index:1100}.brand{display:flex;gap:12px;color:white;align-items:center;padding:0 10px;font-size:22px;font-weight:750;letter-spacing:-.8px}.brand span:not(.brand-mark){display:block;font-size:9px;letter-spacing:3.4px;font-weight:600;margin-top:3px;color:#7cb5d3}.brand-mark{width:40px;height:45px;background:#0574a4;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#b8e8fa}.nav-caption{font-size:9px;letter-spacing:1.5px;font-weight:700;color:#62758e;margin:48px 14px 17px}.sidebar nav{display:flex;flex-direction:column;gap:6px}.sidebar nav a{display:flex;align-items:center;gap:12px;padding:13px 15px;border-radius:7px;font-size:12px;font-weight:600}.sidebar nav a:hover{background:#172a42;color:white}.sidebar nav a.active{background:#123e57;color:#b4e6fc;box-shadow:inset 3px 0 #38bdf8}.sidebar nav b{font-size:10px;margin-left:auto;background:#254963;border-radius:4px;padding:2px 6px}.sidebar-bottom{margin-top:auto;padding:24px 9px 0}.demo-seal{display:flex;align-items:center;gap:11px;padding:17px 0;border-top:1px solid #27364a;border-bottom:1px solid #27364a}.demo-seal strong{display:block;color:#c8d4e2;font-size:10px}.demo-seal small{color:#71839a;font-size:10px;display:block;margin-top:5px}.sidebar-bottom p{font-size:11px;margin-top:20px;color:#c0ccdb}.sidebar-bottom p span{display:block;font-size:9px;color:#6e819b}.version{display:block;font-size:8px;letter-spacing:1.8px;margin-top:20px;color:#647993}.workspace{margin-left:236px;width:calc(100% - 236px)}.topbar{height:77px;background:#fff;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:0 38px}.breadcrumb{font-size:11px;color:#94a3b8;display:flex;gap:14px}.breadcrumb strong{color:#475569;font-weight:500}.top-actions{display:flex;align-items:center;gap:20px}.connection{display:flex;gap:7px;align-items:center;font-size:10px;font-weight:500}.connection i{width:6px;height:6px;border-radius:50%;background:#64748b}.connection.connected i{background:#16a34a;box-shadow:0 0 0 3px #ecfdf5}.connection.disconnected{color:#b45309}.language,.signin,.user-button{display:flex;gap:7px;align-items:center;background:none;border:none;font-size:11px}.language{border-left:1px solid var(--line);padding-left:20px}.signin{color:#0369a1;font-weight:700}.user-button span{display:flex;justify-content:center;align-items:center;border-radius:50%;width:28px;height:28px;background:#e0f2fe;color:#0369a1}.icon-button{display:inline-flex;align-items:center;justify-content:center;background:transparent;border:0;padding:8px}.sim-banner{display:flex;align-items:center;gap:12px;margin:23px 38px 0;padding:12px 17px;border:1px solid #cfe6f2;background:#edf6fb;border-radius:6px;color:#315a73}.sim-banner svg{flex-shrink:0;color:#0284c7}.sim-banner p{font-size:10px;line-height:1.65;flex:1}.sim-banner .badge{background:#dbeef8;color:#0369a1;font-size:8px;letter-spacing:1px;flex-shrink:0}main{padding:29px 38px 44px;max-width:1700px;margin:auto}.page-title{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-bottom:25px}.eyebrow{font-size:9px;letter-spacing:1.4px;font-weight:700;color:#708299;line-height:1.5}.page-title .eyebrow{margin-bottom:9px;color:#647c92}.page-title p{font-size:11px;color:#7b8a9d;margin-top:9px}.button{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:37px;padding:9px 15px;border:1px solid #dce3eb;background:white;border-radius:5px;color:#334155;font-size:10px;font-weight:700;white-space:nowrap}.button.primary{background:#0369a1;color:white;border-color:#0369a1;box-shadow:0 2px 3px #0369a115}.button:hover{filter:brightness(.97)}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:17px;margin:24px 0}.metric{padding:20px 21px 18px;background:white;border:1px solid var(--line);border-radius:7px}.between{display:flex;align-items:center;justify-content:space-between;gap:10px}.metric .between{color:#6e7f94;font-size:10px;font-weight:500}.metric svg{color:#6c97b0}.metric strong{display:block;font-size:31px;font-weight:750;line-height:1.2;color:#122238;margin:14px 0 7px;letter-spacing:-1px}.metric small{font-size:9px;color:#8a98a9}.panel{background:white;border:1px solid var(--line);border-radius:7px;overflow:hidden;margin-bottom:22px;box-shadow:0 2px 3px #0f172a02}.panel-head{padding:19px 21px;display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid #edf0f4;min-height:63px}.panel-head h2{display:flex;align-items:center;gap:9px;font-size:12px}.panel-head h2 svg{color:#6a859a}.panel-head p{font-size:10px;color:#94a3b8;margin-top:5px}.badge{font-size:8px;border:1px solid #e2e8f0;background:#f8fafc;border-radius:4px;padding:4px 7px;display:inline-flex;align-items:center;gap:5px;font-weight:600;white-space:nowrap;color:#64748b;letter-spacing:.25px}.badge.amber{color:#9a5d10;background:#fff8eb;border-color:#f9e7bf}.badge.green{color:#15803d;background:#f0fdf4;border-color:#bbf7d0}.overview-grid{display:grid;grid-template-columns:minmax(0,1.8fr) minmax(290px,1fr);gap:20px}.map-wrap{height:405px;position:relative;background:#e8edef}.leaflet-container{height:100%;font-family:inherit;z-index:1;filter:saturate(.55)}.map-caption,.map-notice{position:absolute;bottom:23px;left:16px;font-size:8px;font-weight:500;padding:7px 10px;border-radius:3px;background:#fffffff0;z-index:500;color:#475569}.map-notice{top:15px;bottom:auto;background:#fff7ed}.map-legend{padding:12px 17px;display:flex;gap:16px;align-items:center;flex-wrap:wrap;border-top:1px solid var(--line)}.status{font-size:9px;font-weight:500;display:inline-flex;gap:5px;align-items:center;white-space:nowrap}.status svg{flex-shrink:0}.station-row{display:flex;gap:13px;padding:18px 19px;border-bottom:1px solid #eef2f6}.station-row:last-child{border-bottom:0}.station-index{height:28px;width:28px;background:#f1f5f9;border:1px solid #e7edf3;color:#7e94a8;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:9px}.station-info{flex:1;min-width:0}.station-info .eyebrow{font-size:8px;letter-spacing:.7px}.station-info h3{font-size:13px;margin:4px 0 8px}.station-source{font-size:9px;color:#8291a5;margin-top:7px}.source{display:inline-flex;gap:5px;align-items:center;font-size:9px;color:#7a8ba0}.source span{width:4px;height:4px;background:#7f9bb1;border-radius:50%}.station-time{display:block;font-size:8px;color:#94a3b8;margin-top:6px;line-height:1.5}.station-links{display:flex;gap:18px;margin-top:10px}.station-links a,.textlink{display:inline-flex;align-items:center;gap:5px;color:#0369a1;font-size:9px;font-weight:600}.count{font-size:11px;color:#a6b4c4}.alert-row{padding:16px 21px;display:flex;align-items:center;gap:14px;border-bottom:1px solid #eef2f6}.alert-row:hover{background:#f8fafc}.alert-symbol{display:flex;justify-content:center;align-items:center;width:34px;height:34px;background:#fff7ed;color:#ca8a04;border-radius:7px;flex-shrink:0}.alert-symbol.critical{background:#fef2f2;color:#dc2626}.alert-row strong{font-size:11px;color:#334155;display:block}.alert-row small{display:block;font-size:9px;color:#94a3b8;margin-top:5px}.alert-tags{margin-left:auto;display:flex;gap:7px}.alert-row>svg{color:#94a3b8}.panel-foot{display:flex;align-items:center;gap:8px;padding:13px 21px;background:#fafbfd;font-size:9px;color:#8291a4}.evidence-note{display:flex;gap:20px;font-size:9px;color:#94a3b8;flex-wrap:wrap}.evidence-note strong{color:#64748b;font-weight:600}.empty{min-height:165px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:#a4b1bf;text-align:center;padding:25px}.empty p{font-size:11px;color:#7c8ba0}.skeleton{padding:25px;background:linear-gradient(110deg,#f1f5f9,#f8fafc,#f1f5f9);color:#8496aa;font-size:11px;min-height:70px}.error{padding:13px 17px;border-radius:5px;border:1px solid #fed7aa;background:#fff7ed;color:#9a3412;font-size:11px;margin:10px 0}.global-error{margin:15px 38px 0}.station-meta{display:flex;align-items:center;gap:20px;padding:0 0 24px;font-size:10px;color:#8a99a9;flex-wrap:wrap}.sensor-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:17px;margin-bottom:30px}.sensor-card{background:white;border:1px solid var(--line);border-radius:7px;padding:20px;min-width:0}.sensor-card .eyebrow{font-size:9px;letter-spacing:.6px;color:#667c92}.sensor-dot{width:7px;height:7px;border-radius:50%}.reading{font-size:33px;color:#132339;margin:18px 0 13px;font-weight:750;letter-spacing:-1px;white-space:nowrap}.reading small{font-size:12px;color:#94a3b8;font-weight:400;letter-spacing:0}.measured{font-size:8px;color:#8c9aac;margin-top:12px;line-height:1.7}.sensor-card>small{display:block;color:#8c9aac;margin-top:8px;line-height:1.7}.sensor-card .textlink{margin-top:9px}.section-heading{display:flex;justify-content:space-between;gap:16px;align-items:center;margin:25px 0 17px}.section-heading h2{font-size:18px}.section-heading p{font-size:10px;color:#94a3b8;margin-top:6px}.inline-label{display:flex;align-items:center;gap:10px;font-size:10px;color:#7c8ba0}.chart-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 20px}.chart{padding:5px 10px 15px}.button-group{display:flex;border:1px solid #e2e8f0;border-radius:4px;overflow:hidden}.button-group button{display:flex;justify-content:center;align-items:center;gap:4px;border:0;background:white;padding:7px 10px;font-size:9px;border-right:1px solid #e2e8f0}.button-group button:last-child{border:0}.button-group button.active{background:#edf7fc;color:#0369a1}.table-wrap{max-height:250px;overflow:auto}table{border-collapse:collapse;width:100%;font-size:9px}td,th{padding:11px 15px;text-align:left;border-bottom:1px solid #edf2f7}th{font-weight:600;color:#64748b;background:#f8fafc;position:sticky;top:0}.timeline{padding:24px}.timeline-item{display:flex;gap:15px;position:relative;padding-bottom:23px}.timeline-item:last-child{padding-bottom:0}.timeline-item:not(:last-child):before{content:'';position:absolute;left:4px;top:10px;bottom:0;width:1px;background:#e2e8f0}.timeline-dot{width:9px;height:9px;border:2px solid #93c5df;background:#fff;border-radius:50%;margin-top:4px;position:relative}.timeline-item strong{display:block;font-size:11px;text-transform:capitalize;color:#334155}.timeline-item small{display:block;font-size:9px;color:#94a3b8;margin-top:4px}.timeline-item p{font-size:11px;margin-top:7px}.timeline-item a{font-size:10px;color:#0369a1}.model-layout{display:grid;grid-template-columns:minmax(0,1fr) 295px;gap:20px}.model-viewport{height:440px;background:#f5f8fb}.schematic{width:100%;height:100%}.model-foot{font-size:10px;line-height:1.7;padding:14px 20px;color:#6d8297;border-top:1px solid var(--line);background:#fafcfd}.model-aside .sensor-card{margin-bottom:22px}.sensor-list button{border:0;background:#fff;border-bottom:1px solid #edf2f7;padding:18px;display:flex;align-items:center;justify-content:space-between;width:100%;text-align:left}.sensor-list button:last-child{border-bottom:0}.sensor-list button.selected{background:#f0f8fd;box-shadow:inset 3px 0 #0284c7}.sensor-list strong{display:block;font-size:11px;color:#334155;margin-bottom:7px}.sensor-list b{font-size:17px;color:#0f172a}.sensor-list b small{display:block;text-align:right;font-size:8px;color:#94a3b8;font-weight:400;margin-top:4px}.filter-grid{display:grid;grid-template-columns:repeat(3,1fr);padding:20px;gap:17px}label{display:flex;flex-direction:column;gap:8px;font-size:10px;font-weight:500;color:#667c92}input,select,textarea{border:1px solid #dce4ed;border-radius:5px;padding:10px 11px;background:#fff;color:#334155;width:100%;font-size:11px;min-height:37px}textarea{resize:vertical}select{cursor:pointer}.textlink{border:0;background:none;padding:0}.back-link{display:inline-flex;gap:8px;align-items:center;font-size:10px;color:#64748b;margin-bottom:20px}.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.detail-body{padding:23px}.detail-body>p{font-size:11px;color:#7a8c9e;margin-bottom:18px}.detail-body h3{font-size:12px;margin:20px 0 10px}.detail-body label{margin-bottom:18px}.evidence-values{display:flex;gap:24px;padding-bottom:25px;margin-bottom:12px;border-bottom:1px solid var(--line)}.evidence-values span{display:block;font-size:9px;color:#94a3b8;margin-bottom:10px}.evidence-values strong{font-size:23px;color:#1e293b}.evidence-values small{font-size:10px;color:#94a3b8;font-weight:400}dl{margin:0}dl>div{display:flex;justify-content:space-between;gap:20px;font-size:10px;border-bottom:1px solid #f1f5f9;padding:12px 0}dt{color:#8a9aae;flex-shrink:0}dd{margin:0;color:#475569;text-align:right;overflow-wrap:anywhere}.basis{padding:15px;background:#f8fafc;border-left:3px solid #94a3b8;font-size:11px;line-height:1.7;margin-bottom:20px}.basis small{display:block;color:#94a3b8;margin-top:5px}.action-row{display:flex;gap:8px;margin-bottom:20px}.success{font-size:10px;color:#15803d;margin-top:15px}.muted{color:#94a3b8!important;font-size:10px!important}.pipeline{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #dce9f2;background:linear-gradient(120deg,#eff8fd,#f9fcff);border-radius:7px;margin-bottom:24px;padding:30px 15px}.pipeline-item{text-align:center;position:relative;display:flex;flex-direction:column;align-items:center}.pipeline-icon{display:flex;align-items:center;justify-content:center;background:#fff;border:1px solid #dceaf4;border-radius:12px;width:54px;height:54px;color:#147ba9;margin-bottom:15px}.pipeline-item strong{font-size:12px;color:#243e54}.pipeline-item small{font-size:9px;color:#8498ab;margin-top:5px}.pipeline-arrow{position:absolute;right:-10px;top:27px;color:#b3cada}.circuit-board{padding:30px;background:#102c3e;color:#8ec8de;display:flex;flex-direction:column;align-items:center;gap:12px;margin-bottom:22px;border-radius:6px;border:8px solid #12374b}.circuit-board strong{font-size:18px;color:#d0e9f3;letter-spacing:3px}.circuit-board span{font-size:10px}.circuit-board small{font-size:9px}.scenarios{display:grid;grid-template-columns:repeat(3,1fr)}.scenarios article{padding:23px;border-right:1px solid #edf2f7;border-bottom:1px solid #edf2f7}.scenarios article>span{display:block;color:#7cb5d3;font-size:10px;letter-spacing:1px;margin-bottom:10px}.scenarios h3{font-size:12px}.scenarios p{font-size:10px;color:#94a3b8;margin-top:9px}.payload{background:#102438;color:#94c3d9;margin:0;padding:25px;font-family:Consolas,monospace;font-size:11px;max-height:400px;overflow:auto;line-height:1.8}.replay-grid{display:grid;grid-template-columns:1.7fr 1fr auto auto;align-items:end;gap:15px}.replay-grid label{margin-bottom:0}.checkbox{display:flex;flex-direction:row;align-items:center;margin-top:18px;font-size:10px}.checkbox input{width:15px;min-height:15px}.login-wrap{display:flex;justify-content:center;padding:40px 0 80px}.login-panel{width:420px;padding:35px}.login-icon{display:inline-flex;align-items:center;justify-content:center;width:60px;height:60px;background:#edf7fc;border:1px solid #d9edf8;border-radius:14px;color:#0369a1;margin-bottom:24px}.login-panel h1{font-size:27px;margin-top:8px}.login-panel p{font-size:11px;color:#8496a8;margin-top:10px}.login-panel form{margin:27px 0 20px}.login-panel label{margin-bottom:18px}.login-panel .button{width:100%;margin-top:5px}footer{border-top:1px solid #e7edf3;margin:0 38px;padding:19px 0;display:flex;justify-content:space-between;gap:20px;font-size:8px;color:#94a3b8}.mobile-menu{display:none}.skip{position:fixed;left:15px;top:-100px;background:white;color:#0369a1;padding:12px;z-index:9999}.skip:focus{top:10px}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
+@media(max-width:1150px){.sidebar{width:205px;padding:28px 12px}.workspace{margin-left:205px;width:calc(100% - 205px)}.topbar{padding:0 25px}main{padding:26px 25px}.sim-banner{margin:20px 25px 0}.metrics{gap:12px}.metric{padding:17px}.overview-grid{grid-template-columns:minmax(0,1.4fr) minmax(265px,1fr);gap:15px}.map-legend{gap:8px}.map-legend .status{font-size:8px}.model-layout{grid-template-columns:minmax(0,1fr) 260px}.top-actions{gap:12px}.sensor-grid{grid-template-columns:1fr 1fr}.sensor-card{padding:22px}.model-viewport{height:420px}.alert-tags .badge:nth-child(2){display:none}}
+@media(max-width:900px){.sidebar{width:180px}.brand{font-size:19px;padding:0 6px;gap:9px}.brand-mark{width:34px;height:39px}.brand span:not(.brand-mark){font-size:8px;letter-spacing:2.5px}.sidebar nav a{font-size:10px;padding:12px 11px;gap:9px}.workspace{margin-left:180px;width:calc(100% - 180px)}.overview-grid{grid-template-columns:1fr}.station-panel{display:grid;grid-template-columns:repeat(3,1fr)}.station-panel .panel-head{grid-column:1/-1}.station-row{padding:17px 13px;border-right:1px solid var(--line);gap:8px}.station-index{display:none}.station-links{gap:10px;flex-wrap:wrap}.map-wrap{height:345px}.station-time{font-size:7px}.station-info h3{font-size:12px}.metrics{grid-template-columns:1fr 1fr}.model-layout{grid-template-columns:1fr}.model-aside{display:grid;grid-template-columns:1.2fr 1fr;gap:18px}.model-aside .sensor-card{height:fit-content}.chart-grid,.detail-grid{grid-template-columns:1fr}.scenarios{grid-template-columns:1fr 1fr}.filter-grid{grid-template-columns:repeat(2,1fr)}.topbar .breadcrumb{font-size:10px;gap:8px}.connection{font-size:8px}.top-actions{gap:10px}.language{padding-left:10px}.page-title{align-items:flex-start}.page-title .button{margin-top:15px}h1{font-size:25px}.pipeline{padding:25px 8px}.pipeline-item strong{font-size:10px}.pipeline-item small{font-size:8px}.pipeline-icon{width:46px;height:46px}.replay-grid{grid-template-columns:1.5fr 1fr}.alert-tags{flex-wrap:wrap;max-width:125px}.alert-row{padding:16px}.alert-row strong{font-size:10px}.alert-row small{font-size:8px}.evidence-note{gap:10px}}
+@media(max-width:640px){.sidebar{display:none}.sidebar.open{display:flex;width:236px;top:65px;box-shadow:10px 0 30px #0f172a44}.workspace{margin-left:0;width:100%}.mobile-menu{display:inline-flex}.topbar{height:65px;padding:0 15px;gap:10px}.breadcrumb{display:none}.top-actions{margin-left:auto;gap:12px}.connection{font-size:9px}.language{font-size:10px}.sim-banner{margin:15px 15px 0;padding:11px;align-items:flex-start;gap:9px}.sim-banner p{font-size:9px}.sim-banner>.badge{display:none}.sim-banner svg{width:14px;height:14px;margin-top:2px}main{padding:24px 15px 35px}.page-title{display:block;margin-bottom:22px}.page-title .eyebrow{font-size:8px}.page-title h1{font-size:25px;letter-spacing:-.8px}.page-title p{font-size:10px;line-height:1.8}.page-title>.button{margin-top:15px}.page-title>.badge{margin-top:15px}.metrics{gap:10px;margin:21px 0}.metric{padding:16px}.metric .between{font-size:9px}.metric svg{width:16px}.metric strong{font-size:29px;margin:12px 0 7px}.metric small{font-size:8px}.overview-grid{display:flex;flex-direction:column}.station-panel{order:-1;display:block}.station-row{padding:19px;gap:14px}.station-index{display:flex}.station-info h3{font-size:14px}.station-info .eyebrow{font-size:9px}.station-time{font-size:8px}.station-links a{font-size:10px}.station-links{gap:20px}.station-info{display:block}.station-source{margin-top:8px}.station-panel .panel-head{min-height:58px}.panel-head{padding:17px}.panel-head h2{font-size:12px}.panel-head .textlink{font-size:8px}.map-wrap{height:310px}.map-legend{gap:13px;padding:13px}.alert-row{align-items:flex-start;gap:11px;flex-wrap:wrap}.alert-symbol{height:30px;width:30px}.alert-row>div:nth-child(2){flex:1;min-width:180px}.alert-row strong{font-size:11px}.alert-row small{font-size:8px;line-height:1.8}.alert-row .alert-tags{margin-left:41px;max-width:none;margin-top:-4px}.alert-row>svg{display:none}.panel-foot{font-size:8px;padding:13px 16px;line-height:1.8}.panel-foot svg{flex-shrink:0}.evidence-note{font-size:8px;line-height:1.8}.evidence-note strong{width:100%}.sensor-grid{grid-template-columns:1fr 1fr;gap:10px}.sensor-card{padding:17px 13px}.sensor-card .eyebrow{font-size:8px;letter-spacing:.2px}.reading{font-size:28px;margin:16px 0 12px}.reading small{font-size:10px}.sensor-card .status{font-size:8px}.sensor-card .measured{font-size:7px}.sensor-card>small{font-size:8px}.station-meta{gap:10px 16px;font-size:8px}.station-meta>span:last-child{max-width:100%;line-height:1.8}.section-heading{display:block}.section-heading h2{font-size:18px}.inline-label{margin-top:15px;justify-content:flex-end}.inline-label select{width:150px}.model-viewport{height:340px}.model-panel .panel-head{flex-wrap:wrap}.model-aside{display:block}.sensor-list button{padding:17px}.model-aside .sensor-card{margin-top:0}.filter-grid{gap:12px;padding:16px}.filter-grid label{font-size:9px}.filter-grid select{font-size:10px;padding:9px 7px}.detail-body{padding:19px}.evidence-values{gap:21px}.evidence-values strong{font-size:22px}.detail-body dl>div{font-size:9px}.action-row{flex-wrap:wrap}.pipeline{grid-template-columns:1fr 1fr;gap:30px 10px;padding:24px 10px}.pipeline-item:nth-child(2) .pipeline-arrow{display:none}.pipeline-item strong{font-size:11px}.pipeline-item small{font-size:9px}.scenarios{grid-template-columns:1fr}.scenarios article{padding:20px}.scenarios h3{font-size:13px}.scenarios p{font-size:11px}.replay-grid{grid-template-columns:1fr 1fr;gap:12px}.payload{font-size:9px;padding:17px}.login-wrap{padding:15px 0}.login-panel{padding:27px;width:100%}.global-error{margin:15px}.timeline{padding:20px}footer{margin:0 15px;padding:18px 0;font-size:7px;display:block;line-height:1.8}footer span{display:block;margin-top:5px}.sim-banner+.global-error{font-size:10px}.login-panel h1{font-size:25px}.source{font-size:8px}.button{min-height:37px}}@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
+.schematic-wrap{height:100%;position:relative}.schematic-buttons{position:absolute;inset:0;pointer-events:none}.schematic-buttons button{pointer-events:auto;position:absolute;top:56.5%;transform:translateX(-50%);border:2px solid #cbd5e1;background:#fff;border-radius:50%;width:36px;height:36px;min-width:24px;min-height:24px;font-size:9px;font-weight:700;box-shadow:0 2px 3px #0f172a0a}.schematic-buttons button.selected{border-color:#0284c7;color:#0369a1;background:#f0f9ff}
+.schematic-wrap{height:100%;width:100%}.schematic-buttons button{top:60.6%}.model-viewport{display:flex;align-items:center;justify-content:center}
+.stale-state .model-viewport,.stale-state .sensor-list,.sensor-card.stale-state{filter:grayscale(1);opacity:.6}.stale-state .model-foot{color:#9a3412;background:#fff7ed}.model-viewport .schematic{object-fit:contain}

--- /dev/null
+++ frontend/src/types.ts
@@ -0,0 +1,8 @@
+export type LocalText=string|{en:string;vi:string};
+export type Status='normal'|'abnormal'|'sensor_fault'|'offline'|'unavailable'|'degraded';
+export interface Sensor {channel:string;uid:string;unit:string;decimals:number;model_node:string;value:number|null;measured_at:string|null;status:Status;last_valid:{value:number;measured_at:string}|null;fault_reason:string|null;active_alert_id:number|null}
+export interface Station {code:string;name:LocalText;river:string;location:{lat:number;lng:number};data_mode:string;sensors?:Array<Sensor & {label?:LocalText;wokwi?:{pin:string;part_id:string}}>}
+export interface Snapshot {station_code:string;version:number;generated_at:string;station_status:Status;last_frame_at:string|null;session:{source:string;id:string}|null;sensors:Sensor[];open_alert_count:number}
+export interface Alert {id:number;rule_code:string;rule_name:LocalText;station_code:string;sensor_uid:string|null;category:string;severity:string;evidence_class:string;is_preliminary:boolean;review_status:string;opened_at:string;cleared_at:string|null;observed_value:number|null;unit:string;baseline_value?:number|null;threshold_value?:number|null;basis_snapshot?:{basis_text?:LocalText;basis_status?:string};events?:Array<{type:string;at:string;actor?:string;data?:{note?:string}}> ;review?:{id:number;status:string;outcome?:string}}
+export interface History {points:Array<{t:string;v:number|null;min:number|null;max:number|null;n:number;faults:number}>;bucket:string;unit:string;decimals:number}
+export interface User {username:string;display_name:string;role:string}

--- /dev/null
+++ frontend/vite.config.ts
@@ -0,0 +1,3 @@
+import { defineConfig } from 'vite';
+import react from '@vitejs/plugin-react';
+export default defineConfig({plugins:[react()],server:{proxy:{'/api':'http://localhost:8000'}}});

--- /dev/null
+++ scripts/check_local_demo.py
@@ -0,0 +1,74 @@
+"""Exercise the local demo API using credentials from ignored .env.local.
+
+Run only against the developer-created local demo database: this starts and
+stops a replay and creates simulated alerts for review.
+"""
+import http.cookiejar
+import json
+import time
+import urllib.error
+import urllib.request
+from pathlib import Path
+
+ROOT = Path(__file__).resolve().parents[1]
+BASE = 'http://127.0.0.1:8000/api/v1'
+
+
+def main():
+    config = dict(line.split('=', 1) for line in (ROOT / '.env.local').read_text().splitlines() if '=' in line)
+    cookies = http.cookiejar.CookieJar()
+    client = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cookies))
+
+    def call(path, body=None):
+        req = urllib.request.Request(BASE + path, data=json.dumps(body).encode() if body is not None else None,
+                                     headers={'Content-Type': 'application/json', 'X-Requested-With': 'hww'})
+        with client.open(req, timeout=15) as response:
+            return json.load(response) if response.status != 204 else None
+
+    user = call('/auth/login', {'username': config['DEMO_REVIEWER_USERNAME'], 'password': config['DEMO_REVIEWER_PASSWORD']})
+    assert user['user']['role'] == 'reviewer'
+    recordings = call('/replays')['items']
+    assert any(item['name'] == 'demo-golden' for item in recordings)
+    run = call('/replays/demo-golden/runs', {'station_code': 'HWW-KNG-001', 'speed': 5, 'takeover': True, 'loop': False})
+    seen = set()
+    deadline = time.monotonic() + 70
+    try:
+        while time.monotonic() < deadline:
+            state = call('/stations/HWW-KNG-001/state')
+            sensor = next(s for s in state['sensors'] if s['channel'] == 'turbidity')
+            seen.add(sensor['status'])
+            if sensor['status'] in ('sensor_fault', 'offline', 'unavailable'):
+                assert sensor['value'] is None
+            alerts = call('/alerts?station=HWW-KNG-001')['items']
+            if {'normal', 'abnormal', 'sensor_fault', 'offline'}.issubset(seen) and state['station_status'] != 'offline':
+                assert any(a['rule_code'] == 'CHG_TURB_SPIKE' for a in alerts)
+                assert any(a['rule_code'] == 'VALID_RANGE' for a in alerts)
+                assert any(a['rule_code'] == 'STN_OFFLINE' for a in alerts)
+                print('PASS: golden replay produced normal, spike, sensor fault, offline and recovery')
+                break
+            time.sleep(0.5)
+        else:
+            raise AssertionError('Golden replay did not reproduce every documented state: ' + str(sorted(seen)))
+        target = next(a for a in alerts if a['rule_code'] == 'CHG_TURB_SPIKE' and a['review_status'] == 'open')
+        call('/alerts/' + str(target['id']) + '/acknowledge', {'note': 'Local automated demo check'})
+        review = call('/incident-reviews', {'alert_ids': [target['id']], 'note': 'Local simulated-data review'})
+        result = call('/incident-reviews/' + str(review['id']) + '/submit', {'outcome': 'confirmed_simulated_anomaly', 'note': 'Expected deterministic replay'})
+        assert result['status'] == 'submitted'
+        alert = call('/alerts/' + str(target['id']))
+        assert alert['review_status'] == 'closed'
+        call('/auth/logout', {})
+        public = call('/alerts/' + str(target['id']))
+        assert 'Local automated demo check' not in json.dumps(public)
+        assert 'Expected deterministic replay' not in json.dumps(public)
+        print('PASS: acknowledge, review, close and anonymous note redaction')
+    finally:
+        try:
+            call('/auth/login', {'username': config['DEMO_REVIEWER_USERNAME'], 'password': config['DEMO_REVIEWER_PASSWORD']})
+            call('/replay-runs/' + run['session_id'] + '/stop', {})
+        except urllib.error.HTTPError as error:
+            if error.code != 404:
+                raise
+
+
+if __name__ == '__main__':
+    main()

--- /dev/null
+++ scripts/dev.ps1
@@ -0,0 +1,68 @@
+param(
+  [string]$Python = "python",
+  [switch]$SkipInstall,
+  [switch]$SkipBuild
+)
+$ErrorActionPreference = "Stop"
+$projectRoot = Split-Path -Parent $PSScriptRoot
+Set-Location -LiteralPath $projectRoot
+function New-DemoSecret {
+  $secretBytes = New-Object byte[] 32
+  $generator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
+  try { $generator.GetBytes($secretBytes) } finally { $generator.Dispose() }
+  return ([System.BitConverter]::ToString($secretBytes)).Replace("-", "").ToLowerInvariant()
+}
+if (-not (Test-Path -LiteralPath '.env.local')) {
+  $databasePath = (Join-Path $projectRoot '.local/waterwatch.db').Replace('\','/')
+  New-Item -ItemType Directory -Force -Path '.local' | Out-Null
+  $localSettings = @(
+    "DATABASE_URL=sqlite:///$databasePath",
+    "JWT_SECRET=$(New-DemoSecret)",
+    'COOKIE_SECURE=false',
+    'DEMO_MODE=true',
+    'REPLAY_TLH_ENABLED=true',
+    'DEMO_OPERATOR_USERNAME=demo.operator',
+    "DEMO_OPERATOR_PASSWORD=$(New-DemoSecret)",
+    'DEMO_REVIEWER_USERNAME=demo.reviewer',
+    "DEMO_REVIEWER_PASSWORD=$(New-DemoSecret)",
+    'DEMO_ADMIN_USERNAME=demo.admin',
+    "DEMO_ADMIN_PASSWORD=$(New-DemoSecret)"
+  )
+  [System.IO.File]::WriteAllLines((Join-Path $projectRoot '.env.local'), $localSettings)
+  Write-Host 'Created local demo accounts. Read .env.local for your private sign-in details.'
+}
+foreach ($settingLine in Get-Content -LiteralPath '.env.local') {
+  if ($settingLine -match '^([A-Z_]+)=(.*)$') {
+    [Environment]::SetEnvironmentVariable($Matches[1], $Matches[2], 'Process')
+  }
+}
+if (-not (Test-Path -LiteralPath '.venv/Scripts/python.exe')) {
+  & $Python -m venv .venv
+  if ($LASTEXITCODE -ne 0) { throw 'Python 3.10 or later is required. Supply -Python with its full executable path.' }
+}
+$projectPython = Join-Path $projectRoot '.venv/Scripts/python.exe'
+if (-not $SkipInstall) {
+  & $projectPython -m pip install -r backend/requirements.txt
+  if ($LASTEXITCODE -ne 0) { throw 'Backend dependency installation failed.' }
+}
+if (-not $SkipBuild) {
+  Push-Location frontend
+  try {
+    & npm.cmd ci
+    if ($LASTEXITCODE -ne 0) { throw 'Frontend dependency installation failed.' }
+    & npm.cmd run build
+    if ($LASTEXITCODE -ne 0) { throw 'Frontend build failed.' }
+  } finally { Pop-Location }
+}
+$env:PYTHONPATH = Join-Path $projectRoot 'backend'
+$env:FRONTEND_DIST = Join-Path $projectRoot 'frontend/dist'
+Push-Location backend
+try {
+  & $projectPython -m alembic upgrade head
+  if ($LASTEXITCODE -ne 0) { throw 'Database migration failed.' }
+  & $projectPython -m app.cli seed
+  if ($LASTEXITCODE -ne 0) { throw 'Database seeding failed.' }
+  Write-Host 'Hanoi WaterWatch: http://127.0.0.1:8000'
+  & $projectPython -m uvicorn app.main:create_app --factory --host 127.0.0.1 --port 8000 --workers 1
+} finally { Pop-Location }
+

--- /dev/null
+++ scripts/generate_contracts.py
@@ -0,0 +1,29 @@
+"""Export ingest JSON Schema from the authoritative Pydantic request model."""
+import json
+import sys
+from pathlib import Path
+
+ROOT = Path(__file__).resolve().parents[1]
+sys.path.insert(0, str(ROOT / 'backend'))
+from app.schemas import Batch
+
+
+def main():
+    output = ROOT / 'shared' / 'schemas'
+    output.mkdir(parents=True, exist_ok=True)
+    schema = Batch.model_json_schema(by_alias=True)
+    schema['$schema'] = 'https://json-schema.org/draft/2020-12/schema'
+    schema['$id'] = 'hww.frames.v1'
+    target = output / 'frame-batch.v1.schema.json'
+    text = json.dumps(schema, ensure_ascii=False, indent=2) + '\n'
+    if '--check' in sys.argv:
+        assert target.read_text(encoding='utf-8') == text, 'Regenerate the ingest schema'
+        print('PASS: ingest JSON Schema matches Pydantic')
+    else:
+        target.write_text(text, encoding='utf-8')
+        print('Generated shared/schemas/frame-batch.v1.schema.json')
+
+
+if __name__ == '__main__':
+    main()
+

--- /dev/null
+++ scripts/smoke.py
@@ -0,0 +1,39 @@
+"""Read-only smoke checks for a running deployment; no external packages needed."""
+import argparse
+import json
+import urllib.request
+
+
+def main():
+    parser = argparse.ArgumentParser()
+    parser.add_argument('--base-url', default='http://127.0.0.1:8000')
+    args = parser.parse_args()
+    base = args.base_url.rstrip('/')
+    def get(path):
+        with urllib.request.urlopen(base + path, timeout=10) as response:
+            assert response.status == 200
+            return json.load(response)
+    health = get('/api/v1/health')
+    assert health['db'] == 'ok', health
+    stations = get('/api/v1/stations')
+    assert len(stations['items']) == 3
+    assert stations['is_simulated'] is True
+    for station in stations['items']:
+        state = get('/api/v1/stations/' + station['code'] + '/state')
+        assert state['is_simulated'] is True
+        assert len(state['sensors']) == 4
+        for sensor in state['sensors']:
+            if sensor['status'] in ('sensor_fault', 'offline', 'unavailable'):
+                assert sensor['value'] is None
+        if station['data_mode'] == 'planned':
+            assert state['station_status'] == 'unavailable'
+    for route in ('/', '/simulation', '/alerts', '/stations/HWW-KNG-001/model'):
+        with urllib.request.urlopen(base + route, timeout=10) as response:
+            assert 'text/html' in response.headers['Content-Type']
+            assert '<div id="root"' in response.read().decode()
+    print('PASS: API health, three stations, provenance, null masking and SPA route serving')
+
+
+if __name__ == '__main__':
+    main()
+

--- /dev/null
+++ scripts/test_contracts.py
@@ -0,0 +1,53 @@
+"""Cross-subsystem checks on artifacts produced by independent implementations."""
+import json
+import sys
+import unittest
+from pathlib import Path
+
+ROOT = Path(__file__).resolve().parents[1]
+sys.path.insert(0, str(ROOT / 'backend'))
+from app.schemas import Batch
+
+
+class ContractTests(unittest.TestCase):
+    def test_replay_frames_validate_against_real_ingest_model(self):
+        recordings = list((ROOT / 'shared/fixtures/replays').glob('*.jsonl'))
+        self.assertGreaterEqual(len(recordings), 6)
+        types = json.loads((ROOT / 'shared/registry/sensor_types.json').read_text(encoding='utf-8-sig'))['types']
+        for path in recordings:
+            last_offset = -1
+            for line in path.read_text(encoding='utf-8-sig').splitlines():
+                if not line.strip():
+                    continue
+                record = json.loads(line)
+                self.assertGreaterEqual(record['t_offset_ms'], last_offset)
+                last_offset = record['t_offset_ms']
+                frames = record['frames']
+                batch = Batch.model_validate({
+                    'schema': 'hww.frames.v1', 'station_code': 'HWW-KNG-001',
+                    'device_code': 'wokwi-esp32-01', 'boot_id': '1234abcd',
+                    'fw_version': 'contract-test', 'sent_at': None,
+                    'sent_uptime_ms': max(frame['uptime_ms'] for frame in frames),
+                    'diag': {}, 'frames': frames,
+                })
+                for frame in batch.frames:
+                    for channel, reading in frame.readings.items():
+                        self.assertIn(channel, types)
+                        self.assertEqual(reading.u, types[channel]['unit'])
+
+    def test_station_identity_and_planned_station(self):
+        records = [json.loads(p.read_text(encoding='utf-8-sig')) for p in (ROOT / 'shared/registry').glob('HWW-*.json')]
+        self.assertEqual(len(records), 3)
+        self.assertEqual(len({r['station']['code'] for r in records}), 3)
+        for registry in records:
+            code = registry['station']['code']
+            self.assertEqual({s['channel'] for s in registry['sensors']}, {'ph', 'do', 'turbidity', 'temp'})
+            for sensor in registry['sensors']:
+                self.assertEqual(sensor['uid'], code + ':' + sensor['channel'])
+            self.assertEqual(registry['station']['location']['precision'], 'illustrative')
+            if registry['station']['data_mode'] == 'planned':
+                self.assertFalse(registry.get('device'))
+
+
+if __name__ == '__main__':
+    unittest.main()

--- /dev/null
+++ tools/build_diagram.py
@@ -0,0 +1,22 @@
+"""Create the complete, deterministic Wokwi circuit from blueprint 04."""
+import json
+from pathlib import Path
+ROOT=Path(__file__).resolve().parents[1]
+parts=[];connections=[]
+def part(kind,id,x,y,**attrs):parts.append(dict(type=kind,id=id,left=x,top=y,attrs=attrs))
+def wire(a,b,color='green'):connections.append([a,b,color,[]])
+def power(id):wire(id+':VCC','esp:3V3','red');wire(id+':GND','esp:GND.1','black')
+part('board-esp32-devkit-c-v4','esp',0,0)
+for id,pin,y,value in [('pot_ph',34,-180,527),('pot_do',35,-100,327),('pot_turb',32,-20,139)]:
+    part('wokwi-slide-potentiometer',id,-280,y,value=str(value),travelLength='30');power(id);wire(id+':SIG','esp:'+str(pin),'orange')
+part('wokwi-ds18b20','temp1',-200,130,temperature='27.25');power('temp1');wire('temp1:DQ','esp:4')
+part('wokwi-resistor','r_ow',-120,100,value='4700');wire('r_ow:1','temp1:DQ');wire('r_ow:2','esp:3V3','red')
+part('wokwi-dip-switch-8','dip1',160,260)
+for n,pin in enumerate([16,17,18,19,23],1):wire(f'dip1:{n}a',f'esp:{pin}');wire(f'dip1:{n}b','esp:GND.1','black')
+part('wokwi-pushbutton','btn_mode',-60,260,color='blue',label='MODE');wire('btn_mode:1.l','esp:33');wire('btn_mode:2.l','esp:GND.1','black')
+part('board-ssd1306','oled1',200,-180,i2cAddress='0x3c');power('oled1');wire('oled1:SDA','esp:21');wire('oled1:SCL','esp:22')
+for n,(id,pin,color) in enumerate([('led_g',25,'green'),('led_y',26,'yellow'),('led_r',27,'red'),('led_beacon',14,'red'),('led_tx',2,'blue')]):
+    x=220+n*65;part('wokwi-led',id,x,-20,color=color);part('wokwi-resistor','r_'+id,x,60,value='220')
+    wire('esp:'+str(pin),'r_'+id+':1');wire('r_'+id+':2',id+':A');wire(id+':C','esp:GND.1','black')
+part('wokwi-buzzer','bz1',350,150,volume='0.1');wire('bz1:2','esp:13');wire('bz1:1','esp:GND.1','black')
+if __name__=='__main__':(ROOT/'firmware/diagram.json').write_text(json.dumps(dict(version=1,author='Hanoi WaterWatch',editor='wokwi',parts=parts,connections=connections),indent=2)+'\n',encoding='utf-8')

--- /dev/null
+++ tools/bundle_wokwi_web.py
@@ -0,0 +1,18 @@
+"""Flatten PlatformIO sources into a Wokwi web sketch; credentials stay ignored."""
+import argparse
+from pathlib import Path
+ROOT=Path(__file__).resolve().parents[1]
+def main():
+    p=argparse.ArgumentParser();p.add_argument('--config',type=Path);args=p.parse_args()
+    dest=ROOT/'firmware/wokwi-web';dest.mkdir(parents=True,exist_ok=True)
+    for source in (ROOT/'firmware/src').rglob('*'):
+        if source.suffix not in ('.h','.cpp'):continue
+        name='sketch.ino' if source.name=='main.cpp' else source.name
+        text=source.read_text(encoding='utf-8').replace('"generated/registry.h"','"registry.h"')
+        (dest/name).write_text(text,encoding='utf-8')
+    for name in ('diagram.json',):(dest/name).write_bytes((ROOT/'firmware'/name).read_bytes())
+    (dest/'config.example.h').write_bytes((ROOT/'firmware/include/config.example.h').read_bytes())
+    if args.config:(dest/'config.h').write_bytes(args.config.read_bytes())
+    (dest/'libraries.txt').write_text('OneWire\nDallasTemperature\nArduinoJson\nAdafruit SSD1306\nAdafruit GFX Library\n',encoding='utf-8')
+    print('Created firmware/wokwi-web; configure the demo key, host and root CA before upload.')
+if __name__=='__main__':main()

--- /dev/null
+++ tools/check_glb.py
@@ -0,0 +1,36 @@
+"""Validate an uploaded GLB without a graphics stack (structure/identity/budgets)."""
+import argparse
+import json
+from pathlib import Path
+import struct
+ROOT=Path(__file__).resolve().parents[1]
+def check(path,registry_path):
+    raw=path.read_bytes()
+    if len(raw)>2*1024*1024:raise ValueError('GLB exceeds 2 MiB budget')
+    if len(raw)<20:raise ValueError('Not a GLB')
+    magic,version,total=struct.unpack_from('<III',raw)
+    if magic!=0x46546c67 or version!=2 or total!=len(raw):raise ValueError('Invalid GLB v2 header')
+    length,kind=struct.unpack_from('<II',raw,12)
+    if kind!=0x4e4f534a:raise ValueError('Missing JSON chunk')
+    doc=json.loads(raw[20:20+length]);nodes=doc.get('nodes',[])
+    names={n.get('name'):n for n in nodes}
+    registry=json.loads(registry_path.read_text(encoding='utf-8'))
+    expected={c['node']:c['node'] for c in registry['model']['components']}
+    expected.update({s['model_node']:s['uid'] for s in registry['sensors']})
+    for node,uid in expected.items():
+        if node not in names:raise ValueError('Missing node: '+node)
+        if sum(n.get('name')==node for n in nodes)!=1:raise ValueError('Duplicate required node: '+node)
+        if names[node].get('extras',{}).get('hww_id')!=uid:raise ValueError('Wrong hww_id: '+node)
+    triangles=0
+    for mesh in doc.get('meshes',[]):
+        for primitive in mesh.get('primitives',[]):
+            if primitive.get('mode',4)!=4:raise ValueError('Only TRIANGLES geometry is supported')
+            accessor=primitive.get('indices',primitive.get('attributes',{}).get('POSITION'))
+            if accessor is None:raise ValueError('Primitive lacks geometry accessor')
+            triangles+=doc['accessors'][accessor]['count']//3
+    if triangles>=100000:raise ValueError('Triangle budget exceeded')
+    print(f'GLB structure, {len(expected)} required identities, {triangles} triangles, {len(raw)} bytes: passed')
+    print('Visual orientation and hotspot-centre distances still require Blender/frontend verification.')
+def main():
+    p=argparse.ArgumentParser(description=__doc__);p.add_argument('path',type=Path);p.add_argument('--registry',type=Path,default=ROOT/'shared/registry/HWW-KNG-001.json');a=p.parse_args();check(a.path,a.registry)
+if __name__=='__main__':main()

--- /dev/null
+++ tools/check_registry.py
@@ -0,0 +1,26 @@
+"""Check channel mappings, complete circuit wiring and generated firmware freshness."""
+import json
+from pathlib import Path
+from gen_registry import generate
+ROOT=Path(__file__).resolve().parents[1]
+def check():
+    station=json.loads((ROOT/'shared/registry/HWW-KNG-001.json').read_text(encoding='utf-8'))
+    types=json.loads((ROOT/'shared/registry/sensor_types.json').read_text(encoding='utf-8'))['types']
+    diagram=json.loads((ROOT/'firmware/diagram.json').read_text(encoding='utf-8'))
+    ids=[p['id'] for p in diagram['parts']];assert len(ids)==len(set(ids)), 'duplicate part IDs'
+    edges={frozenset(c[:2]) for c in diagram['connections']}
+    for c in diagram['connections']:
+        for endpoint in c[:2]:assert endpoint.split(':')[0] in ids, endpoint
+    for sensor in station['sensors']:
+        assert sensor['channel'] in types
+        part=sensor['wokwi']['part_id'];pin=sensor['wokwi']['pin']
+        assert part in ids
+        signal='DQ' if sensor['channel']=='temp' else 'SIG'
+        assert frozenset([part+':'+signal,'esp:'+pin]) in edges
+        for name,target in [('VCC','esp:3V3'),('GND','esp:GND.1')]:assert frozenset([part+':'+name,target]) in edges
+    for i,pin in enumerate([16,17,18,19,23],1):
+        assert frozenset([f'dip1:{i}a',f'esp:{pin}']) in edges
+        assert frozenset([f'dip1:{i}b','esp:GND.1']) in edges
+    assert (ROOT/'firmware/src/generated/registry.h').read_text(encoding='utf-8')==generate(),'run tools/gen_registry.py'
+    print('Registry, generated constants, ADC1 pins, sensor power, fault and network wiring: passed')
+if __name__=='__main__':check()

--- /dev/null
+++ tools/gen_registry.py
@@ -0,0 +1,17 @@
+"""Generate firmware channel constants from the authoritative shared registry."""
+import json
+from pathlib import Path
+ROOT=Path(__file__).resolve().parents[1]
+def generate():
+    registry=json.loads((ROOT/'shared/registry/HWW-KNG-001.json').read_text(encoding='utf-8'))
+    types=json.loads((ROOT/'shared/registry/sensor_types.json').read_text(encoding='utf-8'))['types']
+    lines=['// Generated by tools/gen_registry.py; do not edit.','#pragma once','namespace registry {',
+           f'constexpr const char* station="{registry["station"]["code"]}";',f'constexpr const char* device="{registry["device"]["code"]}";',
+           'struct Channel {const char* name; const char* unit; unsigned pin, decimals, power; double maximum;};','constexpr Channel channels[] = {']
+    for sensor in registry['sensors']:
+        c=sensor['channel'];t=types[c];transfer=sensor['transfer']
+        lines.append(f'  {{"{c}","{t["unit"]}",{sensor["wokwi"]["pin"]},{t["decimals"]},{2 if transfer["kind"]=="quadratic" else 1},{transfer.get("out_max",125)}}},')
+    lines+=['};','}']
+    return '\n'.join(lines)+'\n'
+if __name__=='__main__':
+    target=ROOT/'firmware/src/generated/registry.h';target.parent.mkdir(parents=True,exist_ok=True);target.write_text(generate(),encoding='utf-8')

--- /dev/null
+++ tools/sim_device.py
@@ -0,0 +1,125 @@
+"""Deterministic simulated device. Never produces environmental evidence.
+
+--out emits hww.frames.v1 request JSONL. Replay fixtures wrap frames with
+t_offset_ms instead; regenerate them with --fixtures.
+"""
+import argparse
+import datetime as dt
+import json
+import os
+from pathlib import Path
+import secrets
+import random
+import time
+import urllib.request
+import urllib.error
+
+SCENARIOS=('demo-golden','tlh-loop','turbidity-spike','gradual-ph','sensor-fault','network-gap','do-drop','normal')
+UNITS={'ph':'pH','do':'mg/L','turbidity':'NTU','temp':'degC'}
+START=dt.datetime(2026,11,18,tzinfo=dt.timezone.utc)
+def iso(value): return value.isoformat(timespec='milliseconds').replace('+00:00','Z')
+def frame(seq, scenario='normal', start=START, clock='server'):
+    seconds=seq*2
+    vals={'ph':7.21,'do':6.4,'turbidity':18.4,'temp':27.25}
+    raws={'ph':2109,'do':1310,'turbidity':555,'temp':None}
+    readings={k:{'v':v,'u':UNITS[k],'q':'ok','raw':raws[k],'gen':'input'} for k,v in vals.items()}
+    mode='manual'
+    if scenario in ('turbidity-spike','demo-golden','tlh-loop') and 70<=seconds<130:
+        mode='spike_turb';readings['turbidity'].update(v=180,raw=None,gen='profile')
+    if scenario=='gradual-ph' and seconds<180:
+        mode='gradual_ph';readings['ph'].update(v=round(7.2-1.8*min(seconds/120,1),2),raw=None,gen='profile')
+    if scenario=='do-drop' and 70<=seconds<130:
+        mode='do_drop';readings['do'].update(v=1.8,raw=None,gen='profile')
+    if (scenario=='sensor-fault' and 70<=seconds<110) or (scenario=='demo-golden' and 150<=seconds<180):
+        readings['turbidity'].update(v=None,raw=None,q='fault',fr='injected')
+    return {'seq':seq,'measured_at':None if clock=='uptime' else iso(start+dt.timedelta(seconds=seconds)),
+            'time_source':clock,'uptime_ms':seconds*1000,'buffered':False,'mode':mode,'readings':readings}
+def envelope(frames,station,device,boot,sent_uptime=None,start=START,dropped=0):
+    uptime=max(f['uptime_ms'] for f in frames) if sent_uptime is None else sent_uptime
+    return {'schema':'hww.frames.v1','station_code':station,'device_code':device,'boot_id':boot,
+            'fw_version':'0.4.0','sent_at':iso(start+dt.timedelta(milliseconds=uptime)),
+            'sent_uptime_ms':uptime,'diag':{'buffer_depth':len(frames),'dropped_frames':dropped,'rejected_batches':0,'wifi_rssi':-42},'frames':frames}
+def fixtures(directory):
+    directory.mkdir(parents=True,exist_ok=True)
+    for scenario in SCENARIOS[:6]:
+        with (directory/(scenario+'.jsonl')).open('w',encoding='utf-8') as out:
+            backlog=[]
+            for seq in range(131 if scenario=='demo-golden' else 121):
+                f=frame(seq,scenario)
+                if (scenario=='network-gap' and 35<=seq<50) or (scenario=='demo-golden' and 100<=seq<115):
+                    backlog.append(f);continue
+                frames=[f]
+                if backlog:
+                    for old in backlog:old['buffered']=seq*2000-old['uptime_ms']>4000
+                    frames+=backlog;backlog=[]
+                out.write(json.dumps({'t_offset_ms':seq*2000,'frames':frames},separators=(',',':'))+'\n')
+def main():
+    p=argparse.ArgumentParser(description=__doc__)
+    p.add_argument('--scenario',default='normal',choices=SCENARIOS+('spike_turb','gradual_ph','do_drop'))
+    p.add_argument('--base-url');p.add_argument('--key',default=os.getenv('HWW_DEVICE_KEY'))
+    p.add_argument('--station',default='HWW-KNG-001');p.add_argument('--device',default='wokwi-esp32-01')
+    p.add_argument('--frames',type=int,default=121);p.add_argument('--out',type=Path)
+    p.add_argument('--recording',action='store_true',help='write --out as replay {t_offset_ms,frames}, instead of ingest envelopes')
+    p.add_argument('--fault',action='append',default=[],metavar='CHANNEL[:START:END]',help='inject channel fault; seconds window optional, repeatable')
+    p.add_argument('--outage',metavar='SECONDS|START:END',help='outage starting at 60 s for duration SECONDS, or explicit seconds window')
+    p.add_argument('--fixtures',type=Path);p.add_argument('--interval',type=float,default=2)
+    p.add_argument('--clock',choices=('server','ntp','uptime'),default='server')
+    a=p.parse_args()
+    if a.frames<1 or a.interval<0:p.error('--frames must be positive and --interval nonnegative')
+    if a.fixtures:fixtures(a.fixtures);return
+    if not a.out and not a.base_url:p.error('provide --out or --base-url')
+    if a.base_url and not a.key:p.error('--key or HWW_DEVICE_KEY required')
+    faults=[]
+    try:
+        for value in a.fault:
+            parts=value.split(':');channel=parts[0]
+            if channel not in UNITS:raise ValueError('unknown fault channel')
+            begin,end=(0,float('inf')) if len(parts)==1 else map(float,parts[1:])
+            if begin<0 or end<=begin:raise ValueError('invalid fault window')
+            faults.append((channel,begin,end))
+        outage=((60,60+float(a.outage)) if ':' not in a.outage else tuple(map(float,a.outage.split(':')))) if a.outage else None
+        if outage and (len(outage)!=2 or outage[0]<0 or outage[1]<=outage[0]):raise ValueError('invalid outage window')
+    except (ValueError,TypeError) as exc:p.error(str(exc))
+    scenario={'spike_turb':'turbidity-spike','gradual_ph':'gradual-ph','do_drop':'do-drop'}.get(a.scenario,a.scenario)
+    start=dt.datetime.now(dt.timezone.utc);boot=secrets.token_hex(4);pending=[];dropped=0;retry=1;batch_size=20
+    output=a.out.open('w',encoding='utf-8') if a.out else None
+    try:
+        for seq in range(a.frames):
+            pending.append(frame(seq,scenario,start,a.clock))
+            for channel,begin,end in faults:
+                if begin<=seq*2<end:pending[-1]['readings'][channel].update(v=None,raw=None,q='fault',fr='injected')
+            if len(pending)>600:pending.pop(0);dropped+=1
+            if ((scenario=='network-gap' and 35<=seq<50) or (scenario=='demo-golden' and 100<=seq<115)
+                    or (outage and outage[0]<=seq*2<outage[1])):
+                if a.base_url:time.sleep(a.interval)
+                continue
+            selected=[pending[-1]]+pending[:-1][:batch_size-1]
+            for f in selected:f['buffered']=seq*2000-f['uptime_ms']>4000
+            payload=envelope(selected,a.station,a.device,boot,seq*2000,start,dropped)
+            payload['diag']['buffer_depth']=len(pending)
+            if output:
+                record={'t_offset_ms':seq*2000,'frames':selected} if a.recording else payload
+                output.write(json.dumps(record,separators=(',',':'))+'\n')
+                sent={f['seq'] for f in selected};pending=[f for f in pending if f['seq'] not in sent]
+            if a.base_url:
+                req=urllib.request.Request(a.base_url.rstrip('/')+'/api/v1/ingest/frames',data=json.dumps(payload).encode(),headers={'Content-Type':'application/json','X-Device-Key':a.key})
+                delay=a.interval
+                try:
+                    with urllib.request.urlopen(req,timeout=8) as response:result=json.load(response)
+                    ack={r['seq'] for r in result['results']};pending=[f for f in pending if f['seq'] not in ack]
+                    delay=max(delay,result.get('next_min_interval_ms',2000)/1000);retry=1
+                    print(json.dumps({'seq':seq,'station_status':result.get('station_status'),'queued':len(pending)}))
+                except urllib.error.HTTPError as exc:
+                    if exc.code in (401,403):delay=60
+                    elif exc.code==409:pending=[f for f in pending if f['seq']!=seq];delay=10
+                    elif exc.code==413:batch_size=max(1,batch_size//2)
+                    elif exc.code==422:pending=[f for f in pending if f not in selected]
+                    elif exc.code==429:delay=float(exc.headers.get('Retry-After','30'))
+                    else:delay=retry*random.uniform(.8,1.2);retry=min(30,retry*2)
+                    print(f'HTTP {exc.code}; {len(pending)} retained',flush=True)
+                except OSError as exc:
+                    delay=retry*random.uniform(.8,1.2);retry=min(30,retry*2);print(f'Network: {exc}; {len(pending)} retained',flush=True)
+                time.sleep(delay)
+    finally:
+        if output:output.close()
+if __name__=='__main__':main()

--- /dev/null
+++ tools/tests/test_sim_device.py
@@ -0,0 +1,39 @@
+import sys, unittest
+from pathlib import Path
+sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
+import sim_device as sim
+class SimulatorTests(unittest.TestCase):
+    def test_registry_units_and_channel_order(self):
+        import json
+        root=Path(__file__).resolve().parents[2]
+        types=json.loads((root/'shared/registry/sensor_types.json').read_text(encoding='utf-8'))['types']
+        self.assertEqual(sim.UNITS,{channel:types[channel]['unit'] for channel in sim.UNITS})
+    def test_contract_and_fault(self):
+        f=sim.frame(40, 'sensor-fault')
+        self.assertEqual(f['readings']['turbidity']['q'],'fault')
+        self.assertIsNone(f['readings']['turbidity']['v'])
+        self.assertEqual(f['readings']['turbidity']['fr'],'injected')
+        p=sim.envelope([f], 'HWW-KNG-001', 'wokwi-esp32-01', '123456ab')
+        self.assertEqual(p['schema'],'hww.frames.v1')
+        self.assertNotIn('source',p)
+    def test_spike_and_recovery(self):
+        self.assertEqual(sim.frame(0,'turbidity-spike')['readings']['turbidity']['v'],18.4)
+        self.assertEqual(sim.frame(40,'turbidity-spike')['readings']['turbidity']['v'],180)
+        self.assertEqual(sim.frame(80,'turbidity-spike')['readings']['turbidity']['v'],18.4)
+    def test_profile_and_uptime(self):
+        f=sim.frame(60,'gradual-ph',clock='uptime')
+        self.assertEqual(f['readings']['ph']['v'],5.4)
+        self.assertIsNone(f['measured_at'])
+        self.assertEqual(f['readings']['ph']['gen'],'profile')
+    def test_golden_all_phases(self):
+        self.assertEqual(sim.frame(80,'demo-golden')['readings']['turbidity']['q'],'fault')
+        self.assertEqual(sim.frame(95,'demo-golden')['readings']['turbidity']['q'],'ok')
+        import tempfile,json
+        with tempfile.TemporaryDirectory() as tmp:
+            sim.fixtures(Path(tmp))
+            records=[json.loads(line) for line in (Path(tmp)/'demo-golden.jsonl').read_text().splitlines()]
+        self.assertFalse(any(200000<=r['t_offset_ms']<230000 for r in records))
+        recovery=next(r for r in records if r['t_offset_ms']==230000)
+        self.assertEqual(len(recovery['frames']),16)
+        self.assertTrue(recovery['frames'][1]['buffered'])
+if __name__=='__main__': unittest.main()
