# Codex — Start or Resume HanoiWaterWatch Redesign

Copy the following prompt into Codex with the HanoiWaterWatch repository open. The same prompt can be used for the first session or after a usage/context limit.

---

Act as a senior UI/UX designer, frontend engineer and AI engineer. Continue the HanoiWaterWatch redesign from the latest verified repository checkpoint, not from scratch.

First locate the HanoiWaterWatch project root and read the planning files under `docs/superpowers/plans/`: `AGENTS.md`, `DESIGN.md`, `TASKS.md`, `PROGRESS.md`, and `DECISIONS.md`. Respect all applicable existing repository instructions. If the current workspace is the parent Final-Assignment repository, resolve these paths under `HanoiWaterWatch/`.

Inspect the real working tree, branch, recent commits, source structure, dependencies and existing tests. Reconcile the saved checkpoint with actual uncommitted changes and verification results. Protect existing user changes. Identify and resume the next dependency-ready unfinished task. If this is the first session, begin Phase 0 audit.

Implement the design incrementally: common shell and logo dropdown, map-first home, video-background login with subtle pointer animation, then the Overview, Digital Model, Dashboard, Alerts & Review and Simulation modules. Preserve all existing features, authentication, data sources, API contracts and simulation logic. Support mobile and laptop layouts, accessibility and performance.

Before each task and after each meaningful implementation milestone or test batch, update TASKS.md and PROGRESS.md. Record significant decisions in DECISIONS.md. Keep an exact next action and actual verification results at all times, so another session can resume even after abrupt interruption. Do not rely on detecting the last available token. Do not restart completed work unless verification reveals a defect.

Continue through dependency-ready tasks within available execution limits. When blocked, document the blocker and proceed with independent tasks where safe. Do not fabricate data, overwrite user changes, run destructive Git commands, commit, push or deploy without authorization.

Before finishing the session, run the relevant existing checks, save the checkpoint, report actual changed files and verification results, and state the exact next unfinished task. Do not claim completion until the mandatory design acceptance checks have been verified.

---

## Optional project-root instruction

If the project root already has an `AGENTS.md`, merge the following sentence into it after reviewing existing instructions; do not overwrite that file. If no root file exists, the sentence can be added to a new one with the user's approval:

> For all HanoiWaterWatch redesign work, first read and follow `docs/superpowers/plans/AGENTS.md` and its checkpoint recovery protocol. Read `DESIGN.md`, `TASKS.md`, `PROGRESS.md` and `DECISIONS.md` in that directory before changing source files.

This makes the nested planning instructions discoverable for source changes outside the planning directory. The explicit resume prompt remains sufficient to tell an agent where to start if root instructions cannot be edited.

## Limitations

The repository checkpoint enables recovery when a new session starts. It cannot bypass usage limits, guarantee that the previous session saved its very last change, or automatically restart Codex when a quota resets. Reconcile the real working tree on every resume.
