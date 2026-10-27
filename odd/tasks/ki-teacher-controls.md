# KI teacher filters and local data controls
Branch: `feature/ki-mission-cleanup` in `.ki-mission-01`.
Scope: Add teacher module/checkpoint filters, partial exports, merge-only learner progress import, and selective local reset controls.

## Specs
1. **S1** — User authorization verbatim: "si"
2. **S2** — Import behavior verbatim: "fusionar"

## Tasks
- T1 (S1): Add teacher filters by module/checkpoint and partial progress/evaluation exports while preserving full exports; route: `pages/ki8/teacher/`, verifier; commit: `d0576eb`.
- T2 (S1,S2): Add portfolio progress import that validates the portfolio schema and merges only valid progress into existing versioned mission stores; rejected input must leave data unchanged; route: `pages/ki8/portfolio/`, verifier; commit: `d0576eb`.
- T3 (S1): Add selective reset controls for individual mission progress, local evaluation, or all learner progress with explicit confirmation; route: `pages/ki8/teacher/`, verifier; commit: `d0576eb`.
- T4 (S1,S2): Run high-risk privacy, differential, accessibility, and full KI/WP8 verification; route: verifier scripts/task log; commit: `d0576eb`.

## Log
- L1: User request verbatim: "continua con las demas mejoras que propusistes"
- L2: Assistant proposed teacher filters/partial export, progress-only portfolio import, and selective reset controls.
- L3: User authorization verbatim: "si"
- L4: User import behavior decision verbatim: "fusionar"
- L5: T1-T3 implemented with local German teacher filters/partial exports, schema-validated merge-only portfolio import, and confirmed selective resets; focused verifiers passed: `node scripts/verify-ki-teacher-view.mjs` and `node scripts/verify-ki-portfolio.mjs`.
- L6: Independent high-risk verification passed monotonic merge, stronger-state preservation, byte-identical rejected storage, filter intersections, partial scopes, and reset separation. Full KI/WP8 privacy, accessibility, syntax, diff, and M01-M18 differential checks passed. Implementation committed as `d0576eb`; the slice is above the approximate cumulative 400-line target because it follows earlier feature commits, and the boundary is recorded here. `.mission-qa/` remains untouched and excluded.
