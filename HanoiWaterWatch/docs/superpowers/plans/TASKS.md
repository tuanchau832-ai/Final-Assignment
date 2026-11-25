# HanoiWaterWatch — Implementation Tasks

Canonical design: `DESIGN.md`. Agent protocol: `AGENTS.md`. Current state: `PROGRESS.md`.

Status conventions: `[ ]` TODO; `[ ]` IN_PROGRESS or BLOCKED when explicitly labelled; `[x]` DONE only with evidence. Record evidence and blockers in `PROGRESS.md`. Initial checklist is unverified, not a claim about existing repository features.

## Phase 0 — Audit

- [x] P0-01 — Locate project and Git roots; inspect branch, working tree and existing instructions.
- [x] P0-02 — Inventory frontend framework, routes, auth, API/data fields, map/chart/model libraries, permissions and all five existing modules.
- [x] P0-03 — Capture baseline screenshots where possible; run existing checks and distinguish pre-existing failures from regressions.
- [x] P0-04 — Inventory logo, video/poster assets and licenses; document unavailable assets and unsupported features.

**Exit gate:** Actual functionality and integration constraints recorded in the checkpoint; safe incremental approach identified.

## Phase 1 — Foundation and navigation

- [x] P1-01 — Implement shared tokens, typography, spacing, accessible semantic status colors and UI primitives.
- [x] P1-02 — Implement responsive application shell with top logo, utility controls and appropriate focus management.
- [x] P1-03 — Implement logo dropdown: Map Home, Overview, Digital Model, Dashboard, Alerts & Review, Simulation; keyboard and touch behavior.
- [x] P1-04 — Integrate existing routes and auth protections; preserve deep links and avoid adding permanent side/bottom navigation.

**Exit gate:** All existing destinations reachable on desktop and mobile; menu works with keyboard, pointer and touch.

## Phase 2 — Map Home

- [x] P2-01 — Make the Hanoi map the default authenticated destination while preserving valid deep links.
- [x] P2-02 — Reuse actual station data and map library; add or adapt markers, legend, search, available filters and supported layers.
- [x] P2-03 — Add desktop station inspector and mobile bottom sheet, preserving map controls and attribution.
- [x] P2-04 — Support station context navigation and existing functionality; handle loading, empty, stale, offline and error states.
- [x] P2-05 — Verify map interaction, accessibility alternatives and performance at representative breakpoints.

**Exit gate:** Real station information and supported map interactions work on desktop and mobile without fabricated data.

## Phase 3 — Login and landing experience

- [x] P3-01 — Redesign login layout and branding with existing auth workflow, validation and error states.
- [x] P3-02 — Integrate licensed/configurable video background and static poster fallback; keep video out of authenticated bundles where practical.
- [x] P3-03 — Implement subtle pointer-responsive animation with cleanup, reduced-motion and touch fallback.
- [ ] P3-04 — BLOCKED — Test mobile keyboard, portrait/landscape, video unavailable, reduced motion, login/logout and redirects.

**Exit gate:** Authentication remains functional with or without video; animation does not obstruct form use.

## Phase 4 — Existing modules

- [x] P4-01 — Overview: responsive system snapshot and geographic drill-down using available data.
- [x] P4-02 — Digital Model: responsive canvas and inspector; preserve the actual model and its controls.
- [x] P4-03 — Dashboard: responsive charts, filters, data units, freshness and available comparisons.
- [x] P4-04 — Alerts & Review: responsive alert list/detail, severity labels and existing review workflow/permissions.
- [x] P4-05 — Simulation: responsive configuration/results, explicit scenario labels and separation from live data.
- [x] P4-06 — Verify contextual links and cross-module consistency; do not invent backend capabilities.

**Exit gate:** Each existing module retains its functional behavior and follows the common design system.

## Phase 5 — Quality assurance and delivery

- [ ] P5-01 — BLOCKED — Test 360, 390, 768, 1024, 1280 and 1440 px, landscape and mobile keyboard.
- [x] P5-02 — Test keyboard, focus, labels, contrast, reduced motion and map accessibility.
- [x] P5-03 — Test stale/empty/error data, auth/deep links, permissions, all five module workflows and simulation separation.
- [x] P5-04 — Assess load performance, map/list rendering, animation cleanup and media optimization; document measured results or limitations.
- [x] P5-05 — Verify no fabricated production data, leaked secrets, unsupported controls or missing attribution; verify asset rights.
- [x] P5-06 — Run existing lint, type check, tests and production build; compare with baseline.
- [x] P5-07 — Review every `DESIGN.md` §13 item, reconcile checklist and checkpoint, and report changes, test evidence and remaining issues.

**Exit gate:** Mandatory acceptance criteria verified or explicitly marked blocked; no false completion claims.
## Full-screen map homepage revision

- [x] M-01 — Integrate the full-viewport shell, centered cascading logo, and independent account and notification controls. Add a failing browser regression, then verify dimensions, six destinations and focus/dismissal behavior.
- [x] M-02 — Replace visible map tools with the bottom-left circular disclosure, existing Leaflet actions and scrollable contextual lists. Preserve search, status, layers, sheet and attribution. Verify desktop and touch flows.
- [x] M-03 — Inspect rendered desktop and mobile maps, including a selected station and expanded menus. Run production build, unit and browser suites, and reconcile the homepage checklist.
## Interaction and demo revision

- [x] R-01 — Audit and bound overflow across headers, overlays, stations, alerts, dashboard data and simulation outputs.
- [x] R-02 — Anchor responsive search and fly to stations. Retain search URLs and bottom-right zoom.
- [x] R-03 — Unify active rows and center the brand across workspace routes.
- [x] R-04 — Build synchronized interactive dashboard charts, comparisons and current indicators for supported fields.
- [x] R-05 — Implement and test shared deterministic demo provider, records, alert review and replay.
- [x] R-06 — Add explicit demo flag and global data provenance.
- [x] R-07 — Validate production isolation, permissions and documented removal.
- [x] R-08 — Run local responsive, accessibility, functional and performance checks.

- U-01 DONE. Public underwater film, pooled interactive discharge, accessible fallback and browser verification.
- U-02 DONE. Enlarged drifting trash and microorganisms by 30% and replaced the mouse-following glow with soap and bubbles. Verified press, release, form hover and reduced motion in Chromium.
- U-03 DONE. Replaced the desktop cursor throughout the public entry with soap and bubbles. Verified cursor visibility, form focus and reduced motion in an isolated Chromium run.
- U-04 DONE. Kept intact trash and microorganisms in the current until they travel beyond the right edge. Verified both groups against the built renderer at three viewport widths.
- U-05 IN_PROGRESS. Restore the native mouse cursor over the sign-in card and resume the soap cursor when the pointer leaves it.
