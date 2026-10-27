# KI configurable rubric and responsive QA
Branch: `feature/ki-mission-cleanup` in `.ki-mission-01`.
Scope: Make the teacher rubric locally configurable and add repeatable responsive layout checks without touching browser QA artifacts.

## Specs
1. **S1** — User authorization verbatim: "si"

## Tasks
- T1 (S1): Add locally editable rubric criteria with a safe default template, local persistence, and explicit import/export; preserve existing evaluation schema compatibility where possible; route: `pages/ki8/teacher/`, verifier; commit: `e90e0dc`.
- T2 (S1): Add responsive QA coverage for catalog, portfolio, teacher view, and Mission 19 at desktop/tablet/mobile breakpoints without writing `.mission-qa/`; route: `scripts/verify-ki-responsive.mjs`, relevant styles/verifier; commit: `e90e0dc`.
- T3 (S1): Run privacy, accessibility, differential, and full KI/WP8 verification; route: verifier scripts/task log; commit: `e90e0dc`.

## Log
- L1: User request verbatim: "continua con las demas mejoras que propusistes"
- L2: Assistant proposed configurable teacher rubric and responsive visual QA as the next batch; PWA was deferred.
- L3: User authorization verbatim: "si"
- L4: T1 implemented with a versioned local rubric configuration, fixed three editable labels, strict JSON import/export, and unchanged v1 evaluation/progress schemas.
- L5: T2 implemented with deterministic structural responsive checks for catalog, portfolio, teacher view, and Mission 19 at 320/390/820/1440px without browser artifacts.
- L6: Full KI/WP8 privacy/accessibility/differential QA passed, including syntax and `git diff --check`. Implementation committed as `e90e0dc`; the cumulative branch exceeds the approximate 400-line review target because prior authorized slices are included, and the boundary is recorded here. `.mission-qa/` remains untouched and excluded.
