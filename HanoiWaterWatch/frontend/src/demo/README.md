# HanoiWaterWatch demonstration provider

The demo provider uses the same query and UI contracts as the API. Fixture station locations are illustrative. An instance anchors measurements to a two-second timestamp. Given the same timestamp, readings, alert evidence and histories repeat. Browser refresh resets local reviews, lifecycle changes, announcement delivery and internal replay runs.

## Run locally

Start the project's FastAPI service on port 8000 for the existing account and role checks. In `frontend/`, run:

```powershell
$env:VITE_DEMO_MODE = 'true'
npm.cmd run dev -- --mode demo
```

Open the loopback address printed by Vite. Public monitoring is read-only. Review and Admin actions require the same roles as the regular application. All demonstration mutations remain in the browser. The local announcement audience is limited to the signed-in admin profile. The static quality examples appear in Overview history with a silent notification baseline. Internal replay outputs use their own result envelope and leave station snapshots and history independent.

An explicit `npm.cmd run build -- --mode demo` writes `dist-demo/` for a local preview. The demo provider accepts loopback origins. A standard `npm.cmd run build` rejects `VITE_DEMO_MODE=true`.

## Disable or remove

1. Remove `VITE_DEMO_MODE` or set it to `false`. Build without `--mode demo`. Deploy the standard `dist/` output.
2. Verify the browser calls `/api/v1/stations`, `/api/v1/alerts` and the station history endpoints. Verify API failure surfaces as an error.
3. Confirm no demo badge, `HWW-DEMO-04` identifier or demo provider chunk appears in the deployed UI or bundle.
4. For permanent removal, delete this demo directory and any local `dist-demo/` output. Remove the lazy registration and loopback guard from `src/api.ts`, demo-specific labels and branches using `src/features.ts`, the explicit demo build case from `vite.config.ts`, and demo-only tests and setup instructions. Shared types, React Query, map layers and charts use the regular provider.

The production provider honors FastAPI's seven-day history limit. The demo provider supports up to 30 days. Demo deployments do not use the backend's legacy replay startup option as the frontend feature flag.

