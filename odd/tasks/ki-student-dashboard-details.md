# KI student dashboard and mission details
Branch: `feature/ki-mission-cleanup` in `.ki-mission-01`.
Scope: Add a local student dashboard and richer mission detail previews without changing mission routes, progress envelopes, or privacy behavior.

## Specs
1. **S1** — User authorization verbatim: "si"

## Tasks
- T1 (S1): Add a local student dashboard with progress by module, next recommended mission, and checkpoint/mission completion summary; route: `pages/ki8/index.html`, `pages/ki8/app.mjs`, `pages/ki8/catalog.mjs`, dashboard styles/verifiers; commit: `be463f2`.
- T2 (S1): Add expanded mission details to catalog cards using existing lesson metadata: objectives, duration, phase summary, and local status; route: `pages/ki8/index.html`, `pages/ki8/app.mjs`, `pages/ki8/catalog.mjs`, styles/verifiers; commit: `be463f2`.
- T3 (S1): Run differential compatibility and accessibility verification, then record evidence; route: verifier scripts/task log; commit: `be463f2`.

## Log
- L1: User request verbatim: "continua con las demas mejoras que propusistes"
- L2: Assistant proposed a new batch: "1. Dashboard local del estudiante ... 2. Detalle ampliado de cada misión ..." and recommended implementing 1 + 2 first.
- L3: User authorization verbatim: "si"
- L4: T1/T2 implemented: local dashboard derives module progress, next recommendation, and mission/checkpoint totals from the existing versioned local progress store; catalog cards derive objectives, duration, phases, and status from `pages/ki8/mission/lesson-data.mjs` without duplicating lesson metadata.
- L5: RED evidence: `node scripts/verify-ki-catalog.mjs` initially failed because `createDashboardModel` and `missionDetailsForCard` were not yet exported. GREEN evidence: the same verifier passed after implementation.
- L6: Verification evidence: catalog, checkpoints, mission UI, theme, public/privacy, public-release, progress, lesson-data, course, `node --check` for changed modules, and `git diff --check` all passed. No build, deploy, commit, or `.mission-qa/` edit performed.
- L7: Implementation committed as `be463f2` (`feat(ki): add learner dashboard and mission details`). The commit contains only the dashboard/detail runtime, catalog styles/markup, and focused verifier updates; `.mission-qa/` remains untracked and excluded.
