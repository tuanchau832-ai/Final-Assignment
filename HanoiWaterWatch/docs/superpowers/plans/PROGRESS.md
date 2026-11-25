# HanoiWaterWatch redesign checkpoint

## Session, 24 November 2026

Git root D:/UTSTNE/CITP/Final-Assignment, project HanoiWaterWatch/, branch final-app, HEAD 8886aa2e. Pre-existing changes include deleted project blueprint files and untracked redesign instructions and plans. See TASKS.md for status and DECISIONS.md for integration choices. All work stays in the working tree.

## Milestones and next actions

- P0 audit in progress. Read the root instructions and all seven planning documents. Inspecting routes, data, media and baseline browser/build/test checks before editing source.
- Audit verified React 19/Vite/TypeScript, Router, TanStack Query, Leaflet/OSM, Recharts and lazy Three.js. FastAPI allows public reads and protects write actions by session/role. Registry supplies three illustrative locations. Validated sources are replay and Wokwi only. No versioned login media, separate logo or GLB was found. Reuse the droplet identity and the 2D model fallback. Baseline unit suite passed 12/12; build/browser checks underway.
- Foundation starts in main.tsx, WorkspaceHeader.tsx, navigation.ts and workspace.css. MapHome and LoginPage will integrate against /map?station=CODE, /overview and existing module URLs. Browser baseline uses the previous dist; hold the next production build until baseline capture completes. QA will verify each integrated slice.
- 25 November. New shell, legacy route integration, nav helpers and semantic CSS added. Navigation regression ran red before implementation. QA saved the original dist independently. Map and poster/login work are underway. Next integrate OverviewPage and contextual station links, filters, review and replay in the five module components, then run tsc/build and browser matrix.
- Baseline production build passed. Captured original overview/login at 390×840 and 1280×840 in %TEMP%/hww-redesign-screenshots. All three original Playwright cases and 22 backend SQLite tests passed. Original model chunk triggered Vite size advisory; no project lint script. New logo-disclosure test failed against the original bundle as expected.

## Resume, 25 November 2026

- Re-read project instructions and all seven plan files. Git HEAD remains 8886aa2e on final-app. The working tree contains the integrated shell, Map Home, login/poster, five module updates and expanded Playwright suite. Pre-existing blueprint deletions are still present.
- Fresh `npm.cmd test` passed 20/20. First unfinished gate is Phase 1–4 integration verification using Phase 5 browser checks. Build is running. Next run `npm.cmd run test:e2e` against the compiled bundle with the temporary SQLite Python venv and installed Chromium, fix verified failures and reconcile TASKS.md and the acceptance checklist.
- Fresh `npm.cmd run build` passed TypeScript and Vite. The main chunk is 116.72 kB gzip and the deferred map is 52.36 kB gzip. The existing 3D chunk retains the 258.84 kB gzip size advisory. Screenshots and lab samples at 390 and 1280 px found initial Dashboard layout shifts around .42 and mobile Overview around .23. Playwright captured a completed review with a hidden filter option being selected by its assertion. Next scope that assertion to review detail, address major layout shifts, and rerun the suite.
- First integrated Playwright result was 9/12. Two failures were selectors for the closed review and registry-retry status. Axe found that the sign-in language button's name omitted its visible label. Corrected all three, added touch and pointer-motion coverage, reserved space for chart and Overview loading states, and coordinated content focus with map search. Sign-out now clears authenticated query caches after the server confirms logout. Updated the README with guest access and login video configuration. Rebuild passed. Contract suite (5), generated schema check and simulator unit tests (2) passed. Rerunning all browser tests and collecting new layout measurements.
- Second browser pass finished 12/14, including all six target widths, landscape, compact keyboard viewport approximation, touch filters/layers, map attribution, matching station context, and a full replay → acknowledgment → review → closure → logout against FastAPI. Map inspector definition-list semantics and brand accessible name failed axe. The pointer test moved the mouse before the lazy login view was ready. Updated the markup and the test, and stabilized the model's initial layout. Fresh recheck next.
- Local Chrome samples use one navigation per screen/width, SQLite, and intentionally unavailable street tiles. LCP ranged .16–1.03 s. Dashboard CLS .09/.07 and Overview .07/.04 at 390/1280 px after sizing fixes. Mobile Model previously measured .12 and is pending remeasurement. These are lab values. Field p75 and INP require real traffic and remain unmeasured.
- Final production build, 20/20 frontend unit tests and 14/14 Playwright tests passed. Axe reported no serious/critical findings on the tested login, station inspector and model fallback screens. Validated pointer animation and reduced motion, plus the touch filter/layer flow. `git diff --check` passed with line-ending normalization notices. Final lab screenshot batch at 390/1280 px showed zero uncaught page exceptions and no horizontal overflow; LCP .16–.98 s and CLS 0–.092. The model now measures .092/.038 CLS at 390/1280 px.
- P3-04 and P5-07 follow-up. The configured-video browser probe used a temporary generated clip. First attempt failed to observe the Pause label after a minimal asset interception. Retesting with a range-capable VP8 fixture. Then reconcile residual evidence for physical keyboards, screen readers, optional GLB and live map tiles.
- Configured media probe passed using a temporary generated VP8/WebM served with byte ranges. Verified muted autoplay, pause/resume, failed-source poster and reduced-motion poster. No test clip is bundled. A last review found a possible cached-status gap when the transport goes offline without a rejected request. Running a focused disconnected Dashboard test against the verified build before any related edits.
- Offline regression reproduced in Playwright. After browser connectivity was disabled, zero cached dashboard cards were marked stale. Added a shared TanStack browser-connectivity subscription in api.ts. The shell now reports a lost connection, Dashboard and Model suppress cached current values, Overview excludes stale snapshots from its metrics, and Simulation disables server actions during disconnection. Rebuild and rerun all tests before closing P5-03, P5-06 and P5-07.
## External verification boundaries

- P3-04 and P5-01. The Chromium suite covers 360, 390, 768, 1024, 1280 and 1440 px, landscape, touch interaction, and the focused sign-in form in a reduced 360×430 visual viewport. No physical-phone keyboard session was available. Next external check is to open /login on an actual phone, focus both credentials in portrait and landscape, and submit with the native keyboard open.
- P5-02. Keyboard focus/activation, named controls, visible labels, accessibility landmarks, reduced motion and automated contrast passed in the tested views. Manual OS screen-reader interaction remains untested.
- The redesigned entry ships an original AI-generated river poster (209,306 bytes). Approved production footage is optional and configurable. A real 3D asset was absent. Model controls and the 2D fallback were exercised, while an asset-specific WebGL run requires the supplied GLB. Map interaction and attribution were verified with unavailable street tiles. Live tile delivery and field performance are external checks.
## Latest verified checkpoint

- Final working-tree verification on 25 November 2026. `npm.cmd run build` passed TypeScript and Vite. `npm.cmd test` passed 20/20. `npm.cmd run test:e2e` passed 15/15 against the built frontend and a disposable SQLite/FastAPI instance, including the previously failing offline dashboard regression. `git diff --check` passed. No lint script is defined. Earlier audit evidence covers 22 backend tests, 5 contract tests, generated schema parity and 2 simulator tests. Backend code and shared data were outside the redesign edits.
- DESIGN §13 was reconciled. Sections 13.1–13.6 are covered by poster/playback/motion, auth and route tests plus shell inspection. Sections 13.7–13.8 are covered by touchscreen filters and layers, keyboard search and inspector controls, station navigation, and OSM attribution. Sections 13.9–13.11 are covered by responsive module smoke and staff review/replay, provenance checks, a missing model, a failed station registry, and offline snapshot handling. Sections 13.12–13.13 pass the recorded Chromium viewport, focus, reduced-motion and accessibility checks, with physical keyboard and manual screen-reader evidence pending as described above. Sections 13.14–13.15 are covered by the original locally bundled poster, lazy media entry, retained attribution and source/data contract review.
- Next unfinished task is P3-04, followed by P5-01, for native mobile keyboard verification. Both depend on access to a physical phone. The complete redesign implementation and local checks are in the working tree on final-app at HEAD 8886aa2e. No release or deployment has been performed.
## Full-screen map homepage revision

- Started from the verified redesign working tree on final-app. Read the root and all seven planning files, the attached brief, and the React Router, Leaflet, query, CSS and Playwright integration. Existing app changes and pre-existing blueprint deletions remain in the working tree. M-01 begins with browser regression coverage for the viewport, centered logo and notification disclosure. Next edit main.tsx, WorkspaceHeader.tsx and shared floating-control styles. Use the previous verified production build as the negative baseline.
- M-01 red verified against the previous bundle. At 390 × 844, Leaflet reached 660.8 px high. The shell now has a map-specific overlay, shared reversible disclosure and alert list using the existing feed. M-02 next adapts MapHome, StationMap and responsive styles, then both slices can build and be tested together.
- M-02 integration is in place. MapHome exposes its existing Leaflet instance to the tool disclosure without remounting the map. Full-screen CSS keeps the cartography behind the floating control layers. Station selection shows a scrollable inspector and shifts scale/attribution above the mobile sheet. The simulated-data notice is a compact disclosure. Updated browser coverage for the new touch flow, fit/zoom and short viewport. Next run build and browser checks, capture the rendered map, and refine visual defects from the captures.
- Rendered local FastAPI app at 1440 × 900 and touch 390 × 844. Leaflet measured exactly the full viewport and no uncaught browser errors occurred. Inspected default, navigation, notifications and selected-station tool states. Street tile requests failed in both captures. The coordinate grid, registered stations, scale and attribution remained visible. Shortened the floating latest-frame text and kept full times in the inspector. Made notification heading and alert-list link sticky in the scrollable disclosure. Next rerun production verification after visual refinements.
- First full browser run passed 16/17, including the new viewport, zoom/reset, short-viewport scroll, motion, touch filters/layers, and real replay notification tests. One regression exposed a 6 px horizontal overflow in the shared content header at 360 px. Browser box measurements traced it to the 198 px wordmark plus three 48 px controls. The smallest content headers now use the compact mark and keep all controls. Aligned the notification popup with the account edge so it stays inside narrow viewports. Rebuild and rerun the full suite.
### Verified homepage checkpoint

- M-01 through M-03 complete for the homepage implementation. `npm.cmd run build` passed TypeScript and Vite. `npm.cmd test` passed 20/20. `npm.cmd run test:e2e` passed 17/17 against the built app and temporary SQLite database. `git diff --check` passed. The repo has no lint script. Vite retains its existing size advisory for the deferred 3D model bundle.
- Verified full-viewport geometry at 1440 × 900 and 390 × 844, the centered logo, independent notification and account controls, touch layers and filters, fit/zoom, a scrollable tool list, station-sheet clearance, and the 360 px content-header fix. Staff replay generated a real alert available through the notification list. The browser reported the 420 ms disclosure transition, 35 ms row delays, and reversed exit order. Reduced-motion and automated accessibility checks passed.
- Final captures are in `%TEMP%/hww-floating-map` with desktop/mobile home, navigation, notification and station tools states. Chromium reported `net::ERR_NAME_NOT_RESOLVED` from the existing street tile hostname. Inspected fallback map scale, station markers and attribution at both sizes. Next external check is street tile delivery in a browser with DNS access to OpenStreetMap.
## Interaction and demo revision

- Reconciled the new brief with the verified 17-test map checkpoint and read project planning documents. Next bound data lists and reorganize accessible map search. Previous tracked changes remain intentional. The API exposes pH, dissolved oxygen, turbidity and temperature. Existing public read permissions and staff mutation roles remain authoritative.
- R-01 through R-03 implemented shared scroll boundaries and flat selected rows, direct station search, centered workspace brand, independent zoom and reduced-motion camera behavior. Build and browser checks are pending. R-04 next replaces the dashboard layout around the existing history and timeline contracts. The 30-day and custom range controls use ICT inputs and enforce the supported query window.
- R-04 dashboard uses the observed API limits. Production history is capped by FastAPI at seven days, so 30 days is exposed only for the demo dataset. Custom ranges use the same limit as the selected provider. The dashboard has same-parameter comparison, series visibility, historical zoom, scoped alert records, current metrics and CSV/table access. Next add demo contract tests and provider, then verify both modes.
- R-05 through R-07 implementation is in the working tree. The test-first provider check reproduced the missing demo provider. The new provider uses deterministic registry-derived snapshots/history, seeded alerts/reviews and browser-only replay. Staff actions check the real local auth session and role. The Vite switch defaults off, blocks unintended production flags and puts opt-in demo builds in dist-demo. Next compile both modes, inspect production artifacts for demo code, and run the browser suites.
- Production compiled and all 22 unit tests passed. The negative Vite build rejected VITE_DEMO_MODE=true under production mode. Separate demo build and both browser suites are next. The existing production bundle retains the optional lazy 3D model size advisory.
- First API-backed browser run passed 17/19. An opening-focus check was slow and a deep-linked station inspector dismissed a newly opened brand menu by stealing focus after its query finished. The inspector now focuses only after an explicit station selection and the search sets focus after the opening frame. Added network totals from existing snapshot queries and stabilized the chart window between ticks. Rerun both builds, browser scenarios and screenshots.
- Inspected rendered demo search and comparison charts at 1440×1000 and 390×844. Both had zero horizontal overflow or page exceptions. Refined compact sensor layout, single-chart width and persistent demo provenance during scroll/search. The first demo workflow reached the shared dashboard then timed out on a form label selector. Its accessibility tree confirmed a named Sensor combobox, now used by the test.
- Both modes compiled after the UI and focus refinements. The final style check found the active-row background transition reset the closing cascade delay, so the cascade rows now declare their timing independently. Rebuilding production and demo assets, then running their respective browser suites against separate temporary SQLite instances. No API backend behavior or untracked user files were changed.
- The next API run verified both focus corrections and both new search/comparison regressions. Other navigation and auth checks timed out while two browser suites and screenshot capture ran concurrently. The final browser runs are serial with a bounded 12 s assertion allowance for this host. The last screenshot refinement keeps the search icon beside its input. No credential or API logic was changed to accommodate test timing.
- The serial demo workflow reached the simulation after passing shared map/search, station chart comparison, notification drill-down, review, overview, account and 2D model checks. Its final simulation assertion matched two visible provenance labels. Scoped it to the results panel. The production serial suite is in progress, followed by a rerun of this demo test.
- Production serial browser suite passed 19/19 against the final assets. Both previews answer HTTP 200. Final demo workflow rerun is active. The dedicated lab check will inspect chart readiness and accessibility on the local preview after that run.
- Demo browser scenario passed end to end against dist-demo using a temporary staff account. It classified the synthetic alert, compared station measurements, toggled a chart series, opened a data table, inspected the same station reading in the 2D model, and ran/stopped a replay. Observed zero monitoring API requests during the scenario. The auth session used the existing backend. Remaining R-08 step is the dedicated desktop/mobile chart and search lab check.
### Verified interaction and demo checkpoint

- R-01 through R-08 verified. TypeScript and both Vite builds passed. `npm.cmd test` passed 22/22. API-backed browser suites passed 19/19 and the isolated demo scenario passed 1/1 from dist-demo. The production build deliberately rejected an enabled demo flag. The standard dist contained no provider chunk or synthetic station identifiers. `git diff --check` passed. The manifest has no lint target.
- Inspected the demo station list and comparison chart in Chromium at 1440 and 390 px. The lab search audit waited for the disclosure to settle and found zero serious or critical axe findings on search or dashboard at either size. The 24-hour comparison chart appeared in 2.03 s and 0.90 s in one local run per width. These are lab timings. The map captures used the existing tile fallback.
- Local previews are available at http://127.0.0.1:8000/map for the API-backed app and http://127.0.0.1:4173/map for the explicit demonstration. Setup, isolation guarantees and removal steps are in frontend/src/demo/README.md. Local reviewer sign-in continues to use the existing API session.

## Underwater entry background
Reconciled the completed R checkpoint with the working tree. Next implement local looping media and an independent WebGL overlay in LoginPage, then verify interaction, fallback and navigation.

Generated the riverbed and pipe artwork, rendered a periodic film and implemented the independent WebGL current, touch/mouse handlers, shared pause control and preference fallbacks. Next check the production build and exercise the public route in Chromium.

Verified desktop ripple rendering and found that the compact form covered the mobile emitter. Reserved the first portrait viewport for the outfall and kept the form scrollable. Refined pause and resume to retain object positions. Rebuild and rerun the portrait touch probe and serial browser suite.

Verified the 758,208-byte MP4 decodes to 192 frames. Playback reports 8 seconds, muted and inline. The local sign-in and demo preview routes and film returned HTTP 200. Production and demo builds passed. The frontend unit suite passed 22/22. Browser probes observed pointer repulsion, desktop click and emulated touch ripples, visibility pause and static-only low-memory startup. Initial regression runs had intermittent timing failures in existing sign-in/replay and dashboard checks. Each passed again, and the final consolidated rerun is in progress.

U-01 verified. Final Chromium run completed with 20 first-pass successes and one dashboard comparison success on retry. Both new underwater tests passed first try. Phone touch evidence is Chromium emulation. No physical handset testing was performed. All underwater source, public media and tests are in the working tree.

## Underwater scale and pointer update, 25 November 2026

U-02 is in progress on `final-app`. The underwater current sets the size of the six trash and microorganism sprites, and `LoginPage` and `login.css` provide the mouse-following glow. Update those files and extend the existing Chromium pointer test. First verify that the new pointer expectation fails against the current implementation.

The pointer regression failed as expected against the original glow. Updated the six sprite sizes and added the decorative soap and bubbles beside the native pointer. Rebuild and run the frontend unit and underwater entry browser checks.

U-02 verified. `npm.cmd run build` passed. `npm.cmd test` passed 22 tests. The three Chromium checks in `redesign.spec.ts` and `underwater.spec.ts` passed against the production build. They cover the emoji state changes, form hover, reduced motion, film playback and the static fallback. No further U-02 action is pending.

## Underwater cursor replacement, 25 November 2026

U-03 is in progress. The current emoji sits beside the native cursor and hides over controls. Update the entry cursor and its existing test so the emoji replaces the native cursor across the page. The native cursor is the reduced-motion fallback.

The updated browser check confirmed the old entry still used `cursor: auto`. Centered the emoji on the mouse, hid the native cursor across the active entry, and extended emoji tracking to the form. Next rebuild and rerun unit and browser checks.

## Underwater current across the screen, 25 November 2026

U-04 is in progress. The current retires trash and microorganisms on a timer, so they fade before the right edge on wide screens. Update the WebGL current and add a browser check for both groups reaching the edge. Verify the pending U-03 cursor changes in the same final build.

The edge check failed against the old current. The updated current scales speed to the viewport and retires intact sprites off-screen. The production build and all 22 unit tests passed. A deterministic probe of the built renderer confirmed that both sprite groups reached the edge at 390, 1600 and 2560 px. The first Chromium run timed out during form hover and page setup. Retry the same browser coverage with trace recording disabled and a longer timeout.

U-03 and U-04 verified. The isolated Chromium cursor check passed once separated from video playback. The built renderer probe verified the edge behavior without relying on video. The combined browser run did not verify film playback or poster fallback because those checks timed out. No code change to film playback was made for U-03 or U-04.

U-05 is in progress. Scope the native cursor exception to the sign-in card and update the existing Chromium cursor check to cover entering and leaving the card.

## Background playback button removal

U-06 starts from the current entry page. Remove the button, its layout rules and manual pause state. Update the existing browser check to cover automatic playback and page visibility.

U-06 verified. Removed the control, translations and styles. Restored the English illustration disclosure, which was missing from the starting checkout. The production build, 22 frontend unit tests and both underwater Chromium checks passed. Chromium confirmed the button is absent and playback still responds to page visibility and reduced motion. The failed-film check triggered a local test server connection-reset message as the request was aborted.

## Larger drifting trash

U-07 starts from the verified underwater scene. Double the scale of the bottle, bag and wrapper sprites from their current size. Verify their rendered dimensions against the previous scale.

U-07 verified. The production build passed. A seeded Chromium WebGL comparison confirmed 2× dimensions for every trash type and 1× for every microorganism type.

## Stronger cursor interaction with trash

U-08 starts from the verified larger trash sprites. Measure the existing response to a short cursor movement, then extend reach and give trash a decaying push independent of its drift.

The baseline Chromium probe measured 2.3 px of extra travel after one second and no response 100 px from the sprite center. The updated current gives nearby trash a stronger push with a larger reach, bounded speed and gradual decay. Next rerun the probe and verify the production build.

The stronger push passed the first probe at 47.4 px after one second. The user then requested that trash travel in the direction of the cursor swipe. Measure all four directions with the cursor positioned on the same side of the sprite.

The directional probe reproduced the radial behavior, then confirmed about 47.4 px of displacement after one second in all four swipe directions. Next check touch coordinate tracking and rebuild the preview.

The touch coordinate probe also passed. The user added a 2.5-second wait between pushes. Apply the cooldown to each piece of trash and verify its first push is immediate, extra pushes have no effect during the wait and it responds again at 2.5 seconds.

The seeded Chromium probe reproduced a second push taking effect too early, then verified the fix. The first swipe moved trash on the next frame. Repeating it at 2,499 ms had no effect, and repeating it at 2,500 ms pushed the sprite in the new direction. The updated production build and route smoke checks are in progress.

U-08 verified. The production build and both underwater browser checks passed on the cooldown build. Direction and timing were checked with seeded mouse and touch events in Chromium.

## Longer trash movement

U-09 starts from the verified directional pushes. Increase swipe strength and reach, then measure the change against the 47.4 px baseline without changing the cooldown.

The Chromium probe measured 88.6 px of extra travel after one second for a two-pixel swipe near the sprite, up from 47.4 px. At a distance of 100 px, travel rose from 11.7 px to 32.9 px. All four directions and the exact cooldown boundary passed. Next verify the production build.

U-09 verified. The production build passed.

## Shorter per-piece cooldown

U-10 starts from the verified longer swipe response. Update the cooldown duration and verify the exact threshold and independent responses of two pieces.

The Chromium probe confirmed no second push at 1,499 ms and a renewed push at 1,500 ms. A separate piece responded while the first was still cooling down. The production build is in progress.

U-10 verified. The production build passed.

U-11 starts from the verified per-piece timer. Set the cooldown to 750 ms and check a repeat swipe on each side of the threshold.
