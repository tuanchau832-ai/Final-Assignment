# HanoiWaterWatch — Decision Log

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

## Open decisions to validate in Phase 0

- Actual frontend framework and route naming; retain compatible existing routes.
- Map provider, attribution, station fields and supported layers.
- Existing digital model, alert review and simulation workflows and permissions.
- Logo, video/poster source, licensing and performance budget.
- Available test commands and browser verification environment.

## Append template

### D-XXX — Short title

- Date:
- Status: Proposed / Accepted / Superseded / Blocked
- Task ID:
- Context and alternatives:
- Decision and rationale:
- Consequences / trade-offs:
- Files affected:
- Verification or follow-up:

### Accepted integration choices

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
