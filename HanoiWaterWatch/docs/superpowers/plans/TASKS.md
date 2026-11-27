# HanoiWaterWatch — Implementation Tasks

## Current revision · 26 November 2026

Requirements and decision status are in [DECISIONS.md](DECISIONS.md), D-037–D-044. See [PROGRESS.md](PROGRESS.md) for verification evidence. NW-01 through NW-04 are verified. NW-05 through NW-07 remain in progress.

### NW-01 — Confirm the implementation baseline

- [x] Verify the parent Git root, status and HEAD. Preserve pre-existing changes. Read the root and planning `AGENTS.md` and the relevant portions of DESIGN.md. Record conflicting historical requirements and use the reconciliation in D-044.
- [x] Inventory the dock’s current geometry, frontend routes and login allowlist, station and alert links, backend rule configuration, between-poll delivery behavior, role boundaries and demo provider. Confirm the exact frontend, backend, migration, contract and browser test commands. Keep the unresolved broad browser cases and physical-device checks visible.
- [x] Record the exact next task, intended files and baseline test evidence. This inventory is complete when each revision item maps to source or a confirmed gap.

### NW-02 — Shared dock, brand and retired pages

Depends on NW-01. Start with `main.tsx`, `WorkspaceHeader.tsx`, `navigation.ts`, `NavArt.tsx`, `MapHome.tsx`, `theme.css`, `map.css`, the login destination helper and locale files.

- [x] Move the existing Map Home dock to shared workspace chrome and preserve its bottom safe-area placement and responsive fit. Render one dock and one static top logo/name. Remove duplicate tabs and destination disclosure. Keep only the four standard destinations and leave the Admin destination to NW-05.
- [x] Retire the Simulation page route and contextual entry points and any standalone Stations page. Preserve station data, map/search, station-scoped Model/Dashboard and compatible legacy redirects. Update return-to handling and regressions for the revised route set.
- [x] Verify dock geometry across Map Home, Overview, Digital Model and Dashboard at phone, tablet and desktop widths. Include 320 px, landscape and a selected station with its inspector open. Verify keyboard usage, localized accessible labels, active state and reduced motion. Check that dock, map attribution, station-search trigger, tool disclosure, right-hand zoom and content scroll/focus have room. Verify smooth marker/search focus, URL context and expected legacy redirects.

### NW-03 — Overview with alert and review workflows

Depends on NW-01. Coordinate route changes with NW-02 before the final browser run. Start with `OverviewPage.tsx`, `AlertsPage.tsx`, `main.tsx`, `MapHome.tsx`, `DashboardPage.tsx`, `WorkspaceHeader.tsx`, `AlertNotification.tsx` and the login destination helper.

- [x] Mount the reusable alert list and detail/review workflow in Overview. Preserve filters, paging if supported, evidence, historical timeline, notes, acknowledgement and submit flow. Reuse existing API query and mutation contracts.
- [x] Route legacy alert URLs to canonical Overview views with applicable station, filter and alert context. Update all navigable links and return-to handling while preserving browser back/forward, reload and direct open.
- [x] Verify responsive list/detail and scoped review flow for guest, operator, reviewer and admin using existing permissions and ownership rules. Check private-note visibility and confirm writes remain server-protected. Exercise a map/dashboard/bell link to the expected detail and back to its filtered list.

### NW-04 — Condition transitions and notification feed

Depends on NW-01. Coordinate notification links with NW-03. Start with `backend/app/service.py`, `main.py`, `models.py`, `schemas.py`, Alembic and backend tests, then `api.ts`, `main.tsx`, `AlertNotification.tsx`, `WorkspaceHeader.tsx` and the demo provider.

- [x] Pin the configured water-quality categories, thresholds, persistence, clear persistence and valid-data eligibility in backend checks. Implement the per-station classification and durable transition identity per D-040. Use the condition event feed for new notifications and keep the alert/review history accessible.
- [x] Use an authenticated, per-user delivery cursor and stable event IDs. Test silent startup, no replay on reload, ordered catch-up on reconnect, multiple events between polls, account switch/logout, retries, duplicate/out-of-order frames and concurrent deliveries. Confirm exactly one event for each qualifying escalation, de-escalation and recovery, including a repeated sequence of genuine new transitions.
- [x] Verify that same-class sensor/rule changes, stale/unknown states, faults, connectivity, lifecycle changes, historical reprocessing and review updates never cause automatic quality notifications. Exercise a valid clear while another qualifying rule remains active, and a real recovery after the final active rule clears. Check that public or shared caches cannot reveal private delivery data. Preserve source labels through the delivery UI.

### NW-05 — Admin permissions and station lifecycle

Depends on NW-01 and NW-02. Define and test its monitoring-state handoff with NW-04. Start with `backend/app/main.py`, `service.py`, `models.py`, `schemas.py`, Alembic and backend tests, then the shared workspace routes/nav, station query/cache, map and demo provider.

- [x] Add the Admin destination and protected route. Apply the existing admin session/role check to every privileged read and write. Verify guest/expired session gets 401 and operator/reviewer gets 403 at each protected API. Verify admin access, role removal, direct URL behavior, no protected-data flash and no stale admin state across account changes.
- [ ] Implement validated station creation, maintenance on/off and archive/removal with audit records and safe migrations. Confirm API/data contracts for active, maintenance and archived station visibility, historical lookup and map/search refresh. Preserve measurements, reviews and references. Validate safe handling of ingestion, freshness and active replay jobs during lifecycle changes, including duplicate/concurrent actions and restart/seed behavior.
- [x] Verify that maintenance and archival operations write audit events without emitting fake quality changes. Re-enable with a new baseline and allow the next genuine, verified change to notify. Cover an existing database migrated with station history as well as a clean database.

### NW-06 — Admin announcements and deeper statistics

Depends on NW-04 and NW-05.

- [x] Add the admin announcement flow to the authorized feed, with separate type/label, message validation, intended audience confirmation, server-side recipient selection and audit results. Verify duplicate requests, unauthorized send and cross-account read attempts, eligible user delivery, and handling when there are no eligible recipients or a queue/write fails.
- [ ] Add station, sensor and date comparisons, anomaly/trend drill-down and availability/coverage where the backend supports them. Verify reference counts, time ranges, missing and sparse data, maintenance exclusion or explicit reporting, units, source labels and access control. Reuse existing range limits and chart components. Verify the normal Dashboard interactions still work.
- [ ] Exercise both standard and explicit demo modes. Keep synthetic samples flagged and removable, with no demo mutations, announcements or fixture data reaching the real monitoring provider.

### NW-07 — Reconcile specifications and verify the release candidate

Depends on NW-02–NW-06.

- [x] Reconcile conflicting DESIGN and planning AGENTS directions as in D-044. Change those files only as part of an authorized reconciliation. Preserve unrelated guidance and historical evidence.
- [x] From the project root, run the applicable documented backend tests, contract tests and generated-schema checks, including `python -m pytest backend/tests -q` and `python scripts/generate_contracts.py --check`. Verify database migrations, including PostgreSQL when available for state/uniqueness and concurrency coverage. Use an isolated test database.
- [ ] From `frontend/`, run `npm.cmd test`, `npm.cmd run build` and `npm.cmd run test:e2e` on Windows, or their `npm` equivalents elsewhere. Verify the built demo separately with the repo’s test setup, and ensure the standard build contains no demo provider/dataset. Review intentionally changed route/notification assertions and rerun the remaining broad browser failures. Run `git diff --check`.
- [ ] Record real results and blockers in PROGRESS.md. Run guest-to-admin journey checks, responsive/accessibility checks and regressions for login, map/search, model, Dashboard, review and provenance. Keep physical keyboard, manual assistive-technology or other external checks open until exercised. Update task status and leave the next action in the checkpoint.

## Prior implementation checklist

Historical checkmarks apply to the earlier product behavior. Some checked tasks describe navigation or screens that the latest revision retires. Retain their evidence and use NW-01–NW-07 to track the new acceptance criteria. In the original checklist, M-01–M-03 appear in two revisions. Refer to the revision heading when citing those IDs.

Canonical design: `DESIGN.md`. Agent protocol: `AGENTS.md`. Current state: `PROGRESS.md`.

Status conventions: `[ ]` TODO; `[ ]` IN_PROGRESS or BLOCKED when explicitly labelled; `[x]` DONE only with evidence. Record evidence and blockers in `PROGRESS.md`. Initial checklist is unverified, not a claim about existing repository features.
