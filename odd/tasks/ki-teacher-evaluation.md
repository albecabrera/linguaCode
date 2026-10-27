# KI teacher module summaries and local evaluation
Branch: `feature/ki-mission-cleanup` in `.ki-mission-01`.
Scope: Extend the local teacher view with module summaries, printable follow-up, and a local evaluation mode without transmitting learner data.

## Specs
1. **S1** — User authorization verbatim: "si"

## Tasks
- T1 (S1): Add teacher summaries grouped by module and checkpoint, with a printable follow-up view and existing JSON/CSV exports preserved; route: `pages/ki8/teacher/`, teacher verifier; commit: `a0d1f09`.
- T2 (S1): Add local evaluation mode with progress-derived evidence and an editable local rubric, exportable for review; route: `pages/ki8/teacher/`, teacher verifier; commit: `a0d1f09`.
- T3 (S1): Run privacy, accessibility, differential, and full KI/WP8 verification; route: verifier scripts/task log; commit: `a0d1f09`.

## Log
- L1: User request verbatim: "continua con las demas mejoras que propusistes"
- L2: Assistant proposed the remaining teacher module summary and local evaluation improvements.
- L3: User authorization verbatim: "si"
- L4: T1/T2 implemented with six aggregate module summaries, three checkpoint summaries, print-friendly follow-up, and preserved progress JSON/CSV exports.
- L5: Added local module-level rubric persistence at `linguacode:ki-wp8:teacher-evaluation:v1` and explicit evaluation JSON export; no learner-identifying or content fields are read.
- L6: Full KI/WP8 verification passed, including teacher, checkpoint, portfolio, catalog, theme, public, release, progress, syntax, diff, and M01-M18 differential checks. Native review assessment is unassessable only because untouched `.mission-qa/` is untracked. Implementation committed as `a0d1f09` (`feat(ki): add teacher module evaluation`).
