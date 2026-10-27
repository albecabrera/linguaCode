# KI learning platform upgrade
Branch: `feature/ki-mission-cleanup` in `.ki-mission-01`.
Scope: Extend the public KI course with continuation, catalog filtering, integrative checkpoints, Mission 19, and a local/exportable teacher view while preserving local-only learner data.

## Specs
1. **S1** — User request verbatim: "1. Botón “Continuar curso”"
2. **S2** — User request verbatim: "2. Filtros del catálogo"
3. **S3** — User request verbatim: "3. Tres checkpoints integradores"
4. **S4** — User request verbatim: "4. Mission 19 como proyecto final"
5. **S5** — User request verbatim: "5. Vista docente local y exportable"

## Tasks
- T1 (S1,S2): Add a local-only continuation CTA and catalog filters without changing existing mission routes; route: `pages/ki8/index.html`, `pages/ki8/app.mjs`, catalog modules/styles/verifiers; commit: pending.
- T2 (S3): Add three integrative checkpoint definitions, progress-safe summaries, and learner-facing checkpoint UI; route: `pages/ki8/checkpoints.*`, catalog/mission integration/verifiers; commit: pending.
- T3 (S4): Add Mission 19 as the final integrative project with route, lesson data, catalog card, local progress, and public checks; route: `pages/ki8/stunde-19/`, mission data/runtime/catalog/verifiers; commit: pending.
- T4 (S5): Add an explicit local-only teacher view with privacy-labeled JSON/CSV/print export; route: `pages/ki8/teacher/`, local teacher modules/styles/verifiers; commit: pending.
- T5 (S1-S5): Run full local verification, differential checks for shared renderer/progress contracts, and record delivery evidence; route: verifier scripts/task log; commit: pending.

## Log
- L1: User request verbatim: "Empezamos con los cambios.
1. Botón “Continuar curso”
 2. Filtros del catálogo
 3. Tres checkpoints integradores
 4. Mission 19 como proyecto final
 5. Vista docente local y exportable"
- L2: Exploration mapped the current seams: continuation and KI catalog filters are absent; checkpoint definitions and Mission 19 are absent; progress is versioned localStorage per lesson; teacher export must be explicit, local-only, and privacy-labeled; `.mission-qa/` remains untouched and untracked.
- L3: T2/T3 implementation evidence: three checkpoints derive status read-only from existing mission progress; Mission 19 uses the shared lesson-data/mission renderer, route registry, catalog card, and local progress key `ki-19`; focused verifiers passed for checkpoints, lesson data, mission course, mission UI, progress, public routes, and public release routes. No backend state, network transmission, embeds, build, deploy, or `.mission-qa/` changes were introduced.
- L4: T1 implementation evidence: the catalog now has a local-only continuation CTA, progress/module/topic filters, card metadata, and safe malformed/future-progress handling. `verify-ki-catalog.mjs`, the progress verifier, syntax checks, and `git diff --check` passed. Existing mission hrefs remain unchanged.
- L5: T4 implementation evidence: the local teacher view reads only the 19 versioned mission progress keys and provides explicit JSON, CSV, and print actions with privacy labeling. `verify-ki-teacher-view.mjs` passed; the learner renderer remains untouched. The catalog now links to the teacher view, and focused catalog/teacher checks pass.
- L6: Parent integration verification passed: all seven existing mission/WP8 verifiers plus catalog, checkpoint, teacher, theme, and diff checks passed. Mission 19 and teacher progress coverage both include `ki-19`; no build, deploy, backend, or `.mission-qa/` changes were made.
