# HanoiWaterWatch — Decision Log

## Navigation, notifications and Admin revision · 26 November 2026

This section records the latest product requirements and proposed implementation choices. See [TASKS.md](TASKS.md) for acceptance checks and [PROGRESS.md](PROGRESS.md) for evidence. Earlier entries record the decisions in effect at their original checkpoints.

### D-037 — One shared icon dock and a static brand

**User requirement and documented interpretation.** “Remove the floating destination lists” removes the logo-triggered destination dropdown and any duplicate destination strip, including the inline tabs on content pages. The top-centred HanoiWaterWatch brand consists of the existing logo and name. It has no destination disclosure, so remove the chevron, button behavior and associated menu state. Retain one icon-based dock in the shared workspace shell and use the existing Map Home dock placement as the reference for every workspace page. Today that dock sits on the bottom safe-area edge, centred at desktop widths and fitted between the station-search control and attribution on narrow maps. Reuse its responsive offsets and geometry on content pages, with clearance for their content and focus targets. Keep the sign-in page on its existing layout.

The shared dock shows Map Home, Overview, Digital Model and Dashboard. Add Admin only for sessions with the backend-confirmed admin role. Keep meaningful accessible names, visible focus and an active-page cue. Account and bell controls remain independent. The removal applies to destination lists. Station search, account, notification and map-tool disclosures continue to work.

### D-038 — Retire two standalone sections and preserve station context

**User requirement.** Remove Simulation and standalone Stations from user navigation and page routes. Remove contextual links that reopen Simulation. Retain the station registry, station APIs, identifiers, readings/history, station-specific Digital Model and Dashboard, map markers and search, and admin maintenance. Keep shared or internal replay/fixture logic where it supports existing data, evidence, tests or demos. The prior Simulation UI is superseded. Preserve provenance on historical or simulated records.

**Proposed route handling.** Keep the existing station-scoped Model and Dashboard URLs under `/stations/:code/`; that URL segment identifies their station. Treat the existing bare station URL as a compatibility redirect only, with a valid destination and preserved context. Replace `/simulation` with a safe redirect to Map Home when a shipped link needs compatibility, retaining a valid station selector. Record which legacy URLs get redirects and remove obsolete login return destinations or route them through the supported redirects. No retired URL renders a retired screen.

### D-039 — Overview owns Alerts & Review

**User requirement.** Overview contains the system snapshot and the alert/review workspace. Preserve alert filters, detail and evidence, notes, acknowledgement, incident-review submission and history under the existing visibility, role and ownership rules. Public read-only views must continue to omit private material.

**Proposed route handling.** Use an Overview child location for alert detail, such as `/overview/alerts/:id`. Retain old `/alerts` and `/alerts/:id` URLs only as redirects to the matching Overview section or detail, preserving supported filters and station context. Update map, notification, Dashboard and login return links to the canonical URLs. Preserve back/forward and refresh behavior. Keep the existing alert and review APIs.

### D-040 — Automatic delivery follows confirmed water-quality transitions

**User requirement.** Automatically notify users when a station’s water condition/quality changes. Notify on confirmed escalation, de-escalation and recovery, for example Normal → Warning, Warning → Critical and Critical → Normal. Initial baselines, unchanged classifications, routine readings and reconnect/reload of previously seen events are silent. Equipment and connectivity faults, maintenance changes, review actions and historical backfill stay available as applicable in the operational views without producing water-quality pushes.

**Proposed backend classification.** Derive a station-level Normal/Warning/Critical class from eligible, currently active `water_quality` episodes for the current monitoring context. Take the highest active eligible severity. Use Normal only after valid data establishes a baseline or confirms recovery. Treat unavailable, warming-up or stale evidence as unknown. Never infer a recovery when a feed goes quiet, an episode is administratively closed or monitoring is stopped. A new station or an explicitly restarted monitoring baseline starts silently after valid data returns. Track the classification independently of review workflow status.

Use the active backend Rules and their existing evidence, thresholds, persistence, clear persistence and episode snapshots. Inspect `backend/app/service.py` (`rule_defaults`, `evaluate`, `recompute`, replay/history and freshness handling), `backend/app/main.py` (`/api/v1/rules`) and the seeded/migrated Rules before implementing. The current defaults include `REF_PH_BAND`, `REF_TEMP_MAX`, `CHG_TURB_SPIKE` and `CHG_DO_DROP`. `VALID_RANGE` and `STN_OFFLINE` describe equipment/connectivity. Record the configured rules and exact open/clear boundaries used in verification. The reference rules and demo heuristics carry their existing caveats and simulated provenance. Use the backend policy without adding UI thresholds.

**Proposed delivery.** Persist each confirmed transition once with a stable event identity and ordered per-station state. Atomically advance the state and record the event so retries, concurrent ingestion and polling cannot produce duplicate transitions. A later genuine recurrence receives a new identity. Use an authenticated feed with a per-user delivery checkpoint that survives reload, logout and reconnect. Define and test ordered catch-up for eligible events created after the baseline, using IDs/cursors that cannot skip multiple events between polls. Scope delivery and caches to the authorized account. Preserve alert history as evidence independently of the event feed.

**Delivery assumption.** The audited client has an in-app toast and bell backed by alert polling. The SSE route is deferred. Use authenticated in-app delivery as the first implementation of “push.” Delivery while the app is closed requires a separate transport decision if the product intends it.

### D-041 — Separate admin announcements

**User requirement.** Give admins a way to compose and send manual announcements to authorized users independently of station conditions. Give announcements their own event type, label and stable ID. Verify the sender and resolve recipients on the server using account eligibility and the intended audience. Require explicit send confirmation, validate the message and use a request identity that makes retries safe. Audit actor, timestamp, audience and outcome. Recipients see only announcements addressed to them. A manual send leaves water-quality classification and incident evidence untouched.

### D-042 — Admin access and safe station lifecycle

**User requirement.** Provide an Admin dock destination for station add/remove, maintenance on/off, manual announcements and deeper analysis. Guard the page while the session loads and on direct access. Enforce admin permissions on every management, sending and privileged analytics API using the existing FastAPI session/role checks. Return the existing unauthenticated/forbidden responses for direct requests. Preserve existing operator/reviewer access to their own workflows.

**Proposed lifecycle.** Store station lifecycle separately from sensor and water-quality status. Validate station identity and registry fields on creation and make configured data sources explicit. “Off” enters maintenance and “on” ends it. Treat removal as archival/retirement so readings, alerts, review evidence, station codes and audit references survive. Define visibility for active, maintenance and archived stations in the map, search and historical views. A maintenance station should read as maintenance wherever it is shown. Gate routine ingestion, freshness and new replay runs for inactive stations, coordinate running sessions, and keep latest readings labelled stale or unavailable as appropriate. A re-enabled station establishes a fresh baseline. Store who changed what, when, why and the before/after state. Keep state and audit consistent on retries or concurrent actions. Confirm migrations, seed and registry behavior together so a restarter cannot resurrect an archived station.

### D-043 — Admin analysis uses supported evidence

**User requirement with proposed initial scope.** Provide station/time/sensor comparisons, anomaly episodes, availability and coverage, using supported measurements and units. Reuse Dashboard charting and comparison patterns. Use the API’s current seven-day history limit unless a separate, verified aggregation contract supports more. Label source, gaps, stale data and denominators. Keep maintenance/outage time distinct from water-quality classifications. Demo may show clearly marked synthetic examples through its existing isolated provider. Keep fixture-only history and metrics out of the standard build.

### D-044 — Reconcile prior specifications during implementation

Read both `AGENTS.md` files and [DESIGN.md](DESIGN.md). Record and reconcile the older logo dropdown, duplicate header destinations, separate Alerts, Simulation and bottom-dock restrictions against D-037–D-039. Check DESIGN §§2, 4, 6–9 and 11–16 and the planning AGENTS instructions on implementation order, preserved routes and definition of done. Retain their unrelated instructions and acceptance criteria. If later authorized to edit those files, update the affected text and checklist together. For this planning update, the four requested files carry the reconciliation. Historical decisions D-002, D-013, D-019–D-021 and D-033–D-036 still describe earlier checkpoints. Their conflicting UI, route or delivery provisions are superseded by the new decisions.

### D-046 — Implemented delivery and lifecycle contracts

The private feed uses durable recipient delivery rows. Automatic transitions are addressed to active staff who have initialized their inbox. The first condition baseline and inbox startup are silent for earlier quality events. Polls claim bounded, ordered batches under a stable request ID. The client retains an unfinished claim through reload and keeps the bell history available after delivery. Announcements use separate records with a confirmed audience and an audited recipient count.

Lifecycle and user-access checks run on the server. Maintenance remains visible in the station registry and map. Archived stations leave the registry list and remain accessible through existing historical links. Re-enabling starts a new monitoring context. Admin-created stations support a planned entry or the internal replay source. Analytics use the existing seven-day bound and distinguish periods of maintenance from expected monitoring time.

The explicit local demo only simulates announcements to the authorized profile present in that browser. The demo in-memory history resets on reload. Standard deployments exclude demo fixtures.

## Prior decision log

This log separates user requirements from proposed design choices. No implementation decisions have been validated against the existing repository yet.

| ID | Status | Decision | Rationale / verification |
| --- | --- | --- | --- |
| D-001 | User requirement | Authenticated home is an interactive map. | Map-first monitoring; preserve real geographic and station data. |
| D-002 | User requirement | Top logo opens dropdown navigation. | Access Map Home plus the five existing modules without a separate permanent navbar. |
| D-003 | User requirement | Public landing page is login with video background and mouse-movement animation. | Cinematic entry; retain accessible, touch and reduced-motion fallbacks. |
| D-004 | User requirement | Support laptop and mobile use. | Responsive experience across device widths. |
| D-005 | Proposed | Responsive web app, not a separate native app. | Reuse one application; native packaging requires separate scope. |
| D-006 | Proposed | Dark cinematic login, light navy/teal operational workspace. | Design direction in DESIGN.md; adjust to existing brand assets where warranted. |
| D-007 | Proposed | Reuse current frontend, mapping, charting and model stack. | Minimize regressions and avoid unnecessary migration; confirm in audit. |
| D-008 | Proposed | Shared tokens and desktop inspector/mobile bottom-sheet pattern. | Responsive progressive disclosure. |
| D-009 | User requirement | Persist progress across sessions and token/usage interruptions. | Checkpoint in planning files proactively; new sessions resume from repository state. |
| D-010 | Proposed | Existing backend contracts and data semantics remain authoritative. | Protect working features and avoid invented data or unsupported controls. |
| D-011 | Proposed | No automatic commits/pushes/deployments or destructive Git operations. | Protect team working tree and remote repository; user authorization required. |

### Open decisions to validate in Phase 0

- Actual frontend framework and route naming; retain compatible existing routes.
- Map provider, attribution, station fields and supported layers.
- Existing digital model, alert review and simulation workflows and permissions.
- Logo, video/poster source, licensing and performance budget.
- Available test commands and browser verification environment.

### Append template

#### D-XXX — Short title

- Date:
- Status: Proposed / Accepted / Superseded / Blocked
- Task ID:
- Context and alternatives:
- Decision and rationale:
- Consequences / trade-offs:
- Files affected:
- Verification or follow-up:

#### Accepted integration choices

- D-012. Preserve documented public read-only deep links. Anonymous root opens login, guest entry opens Map Home, and authenticated root opens Map Home. FastAPI continues to enforce all write permissions.
- D-013. Use /map, /overview and existing station, alert and simulation URLs. Station context travels in the URL. Reuse the versioned snapshot cache, registry coordinates and OSM attribution.
- D-014. Retain the bilingual interface, all-simulated provenance and functional schematic. Use original local artwork and a configurable video source because no licensed footage was supplied.
- D-015. The map uses the registry's coordinates, server status and active alert filters. If OpenStreetMap tile requests fail, use a projected coordinate grid with the same station markers and list. The service has no separate geospatial waterway dataset or prediction engine.
- D-016. Simulation keeps the existing replay engine and links its recorded results to station history. The engine supplies frame payloads and session diagnostics. The interface uses those outputs for inspection and comparison.
- D-017. Use browser connectivity alongside API errors to invalidate the presentation of current values. TanStack Query can pause fetching while offline and keep successful cached data, so a previously successful query alone is insufficient evidence of freshness.
- D-018. Verification records distinguish browser emulation from physical-device, manual assistive-technology and field measurements. Use the emulated viewport matrix for repeatable coverage and retain the native mobile keyboard check as the remaining tracked acceptance gate.
- D-019. Supersede the prior homepage header, standalone provenance strip and always-visible map actions with overlays on a full-viewport Leaflet canvas. Keep the six destinations and original droplet lockup. Content pages retain a sticky header and use the same cascading disclosure.
- D-020. The notification list reads the existing recent open-alert query. Any unread dot reflects new alerts since opening the list in the current workspace session. The backend has no persistent read-state contract. Map reset fits registry coordinates. Keep the product's supported actions and layers.
- D-021. Adopt a 420 ms disclosure with 35 ms stagger and reversed exit. Above the mobile station sheet, reserve space for the tool trigger, scale and attribution. Use the compact brand mark on the map and on content headers at 380 px or narrower, based on the measured 360 px overflow. Keep the existing geographic tile provider and coordinate fallback.
- D-022. Use React Query and the existing API contracts to synchronize dashboard filters, including a same-channel station comparison. Keep snapshot KPIs explicitly current, with history under its selected range.
- D-023. Select the demo provider centrally at build time. Authenticate through the existing session API and enforce the same roles inside the demo provider. Redirect all monitoring reads and demo mutations into an in-memory dataset. A standard production build rejects demo activation and drops the dataset.
- D-024. Supersede the map toolbar's previous zoom placement and inline station list. Zoom has permanent circular controls at bottom right. The station list opens from the search trigger, and the centered brand is shared with content routes. Implicit inspector autofocus is limited to explicit station selection to preserve other disclosures.
- D-025. Preserve the seven-day limit of the existing server history contract. Demo mode supports up to 30 days and excludes forecast, WQI and other unsupported sensor metrics. The lazily loaded demo provider is compiled only into the dedicated loopback build. Its replay outputs use a separate envelope, linked to the selected station without changing its snapshots.

- D-026. Apply the scene to the public entry where the background film lives. Keep discharge illustrative and independent of monitoring data. Anchor the emitter to the cropped film coordinates.
- D-027. Replace the desktop cursor with soap and bubbles across the public entry, including the form. Retain the native cursor for reduced motion and workspace routes.
- D-028. Restore the native cursor over the sign-in card. Keep the soap and bubbles outside the card on the public entry.
- D-029. Remove the manual background playback button. The film and current follow page visibility and the visitor’s reduced-motion preference.
- D-030. Apply cursor and touch pushes as a separate, decaying velocity on trash, directed along the swipe. Increase the reach for larger objects and time the 2.5-second cooldown independently for each piece.
- D-031. Shorten the trash cooldown to 1.5 seconds and keep the timer on each piece.
- D-032. Set the cooldown to 0.75 seconds per piece.
- D-033. Supersede the map control placement in D-024. Keep the workspace links, station list, zoom and map tools in one bottom row. Use icon-only navigation on narrow screens and position disclosures clear of the station inspector.
- D-034. Supersede the shared dock placement in D-033. Align the workspace navigation with Leaflet attribution. Place the station list and map tools on the lower left and stack the zoom controls on the lower right, above the footer and any mobile inspector.
- D-035. Align the station list trigger with the navigation and Leaflet attribution. Keep the map tools above the list and let the list panel open above the mobile inspector.
- D-036. Align the lower edges of the dock, station list trigger and Leaflet attribution at the map edge, accounting for the device safe area.
- D-045. Align Map Tools with Zoom In and Station Search with Zoom Out. Both stacks use a 7 px gap and clear the mobile inspector when it is open.
