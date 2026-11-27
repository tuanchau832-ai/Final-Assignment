# Local demonstration runbook

All readings and station locations are simulated. Begin the presentation by pointing out the permanent simulated-data banner. The platform demonstrates a data pipeline; it makes no finding about water in Hanoi.

## Prepare

1. Run `scripts/dev.ps1` as described in the root README, or start Docker Desktop and use `docker compose up --build` with the private `.env` configuration.
2. Open `http://127.0.0.1:8000`. Check `/api/v1/health` or run `python scripts/smoke.py`.
3. Sign in with the reviewer account from the ignored local environment file. Keep passwords out of recordings.
4. Confirm the Tô Lịch station is updating from its replay and the planned Nhuệ station has no current readings.
5. The actual station GLB must be supplied and verified before presenting it as the team's 3D model. Until then, identify the model page as an illustrative 2D schematic.

## Replay demonstration

1. Use the authenticated local API workflow in `scripts/check_local_demo.py` to drive the `demo-golden` recording for Kim Ngưu. Keep this exercise on the isolated demo database.
2. Open the station Dashboard and Digital Model to inspect the shared server snapshot. The source identifies the replay.
3. The recording has a turbidity spike at 70–130 seconds, an injected sensor fault at 150–180 seconds, and a network gap at 200–230 seconds, followed by buffered recovery. The normal recording lasts 260 seconds. Faster speeds compress the rule windows and freshness timeouts consistently.
4. During the spike, open Alerts & Review inside Overview and inspect the preliminary simulated alert and its demo-heuristic basis. Acknowledge, start a review, choose an allowed simulated outcome, add context and submit.
5. During the fault, current turbidity must be a dash. Prior valid data is secondary information, and the fault alert is equipment-related.
6. During the outage, current readings must be hidden; after recovery the dashboard history backfills without duplicate frames.
7. Use the replay API to stop the run when finished. The source is released for a device connection.

`python scripts/check_local_demo.py` exercises this workflow through the local API using `.env.local`; it creates labelled simulated alerts. Use it only against the developer-created local demo database.

## Live Wokwi demonstration

Follow `firmware/README.md`. Configure a real reachable HTTPS endpoint, a scoped demo device key and the correct trusted root CA. Set `WOKWI_PROJECT_URL` on the API. Run the hardware scenarios in blueprint 04 against that endpoint before claiming live-device acceptance. If the connection fails, announce the switch to replay and use the local API workflow above.

After the demonstration, stop the device and replay, sign out, and rotate the public demo device key. The root README and blueprint 10 describe the deployment and operational checks still required.
