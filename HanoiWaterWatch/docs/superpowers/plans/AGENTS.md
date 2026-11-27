# HanoiWaterWatch — Agent Operating Instructions

## Scope and entry point

These instructions apply to the HanoiWaterWatch redesign. The canonical planning directory, relative to the HanoiWaterWatch project root, is `docs/superpowers/plans/`. If launched from the parent repository, locate the HanoiWaterWatch project first and confirm the Git root and working directory. Do not assume that the project has its own Git repository.

A nested `AGENTS.md` may not automatically govern source files outside this directory. At the start of every redesign session, explicitly read this file. If the project already has a root `AGENTS.md`, respect it and any applicable nested agent instructions; ask the user to add a reference to this file or use the resume prompt. Do not replace existing instructions.

## Source of truth

1. User's latest explicit requirements and applicable repository instructions.
2. Existing source, tests, backend contracts, permissions and actual functionality.
3. `DESIGN.md` for visual and interaction targets.
4. `TASKS.md`, `PROGRESS.md` and `DECISIONS.md` for implementation state.

If these conflict, record the conflict and choose a reversible approach consistent with the user requirements; escalate decisions that materially change scope or contracts. No fabricated sensor data, unsupported thresholds, fake AI functionality or broken existing workflows.

## Start or resume a session

- Read all five planning files before editing application source.
- Inspect README, dependency manifests, routes, authentication, data services, existing tests, and actual Git status and recent commits. Detect pre-existing user changes; do not undo them.
- Compare the checkpoint to the working tree, including uncommitted changes. The files and current test results are more authoritative than stale notes.
- Select the next dependency-ready, unfinished task in `TASKS.md`. Resume any partially completed task before starting another unrelated one.
- Record the current task, intended files and baseline checks in `PROGRESS.md` before changing code.

## Implementation and quality rules

- Follow the current NW dependencies in `TASKS.md` and `DESIGN.md` §12. Work in small, independently verifiable increments.
- Preserve frameworks, compatible routes, API contracts, auth, data sources, Digital Model and Dashboard. Keep internal replay tools for data, maintenance and verification. Redirect retired Simulation, bare station and standalone Alerts URLs as specified in D-038 and D-039.
- Keep Map Home as the default authenticated destination. Use a static brand and one shared icon dock in the existing Map Home bottom safe-area placement, with independent account, notification and map controls.
- Keep measured, derived, predicted and simulated data clearly distinguished. Preserve map attribution and user permissions.
- Use real repository commands for lint, type checking, tests and builds. Document exact commands and results; do not claim success for unrun checks.
- Do not run destructive Git commands, overwrite user changes, commit, push, deploy, change credentials or add paid services without authorization. Leave changes in the working tree unless directed otherwise.

## Persistent checkpoints — mandatory

Do not depend on conversation memory, automatic context compaction or the ability to detect an imminent token/usage limit. Update the checkpoint proactively:

- Before each subtask begins: set its status to IN_PROGRESS and write the intended action.
- Before switching tasks, ending a session or approaching a known limit: update `TASKS.md`, `PROGRESS.md` and `DECISIONS.md` as applicable. Keep notes in sync even when no commit has been made.
- Use stable task IDs. Mark DONE only after the task's acceptance criteria are verified; otherwise use IN_PROGRESS or BLOCKED and record the missing evidence. Do not mark a phase complete while required tasks are unfinished.
- Keep the current checkpoint concise enough to read quickly. Retain significant earlier milestones in a short history; avoid duplicating the full design.

## Recovery after interruption

1. Re-read the planning files and inspect the actual working tree and Git history.
2. Reconcile unrecorded changes with the checkpoint. Do not assume unfinished code is correct or delete it merely because notes are stale.
3. Run the relevant existing verification commands, where possible.
4. Update the checkpoint to reflect verified reality, then resume the next exact action.
5. Continue dependency-ready tasks without asking the user to restate documented requirements. If blocked, record the blocker and proceed with independent work when safe.

A token or rate limit may stop execution without warning. These files support later recovery, not automatic execution after a quota reset. A user or authorized runner must start/resume the session.

## Definition of done

All mandatory tasks and `DESIGN.md` §13 acceptance checks are verified against the real application. Report remaining blockers and unverified checks explicitly. Do not claim the redesign is complete if mandatory items remain outstanding.

# Context and Token Management

## Context retrieval
- Never scan the entire repository by default.
- Start with .context/FILE_MAP.md and .context/TASKS.md.
- Read other context files only when relevant.
- Identify affected files before opening source code.
- Search for specific functions, classes and symbols.
- Read relevant line ranges instead of entire files.
- Expand the scope only when dependencies require it.
- Avoid rereading unchanged files already in context.

## Exclusions
Do not inspect these unless explicitly necessary:
- node_modules/
- dist/
- build/
- .git/
- .next/
- Generated files
- Binary files
- Large logs
- Lock files

## Implementation
- Make targeted changes.
- Avoid unrelated refactoring.
- Use git diff to inspect changes.
- Run targeted tests before broader verification.

## Session management
- Update PROGRESS.md after completing a task.
- Record significant decisions in DECISIONS.md.
- Update FILE_MAP.md when architecture changes.
- Maintain a compact RESUME.md for the next session.
- Do not duplicate information across context files.
