# KI progress portfolio and sequence guidance
Branch: `feature/ki-mission-cleanup` in `.ki-mission-01`.
Scope: Add an explicit progress-only learner portfolio export and clearer pedagogical sequence guidance.

## Specs
1. **S1** — User authorization verbatim: "si"
2. **S2** — Privacy decision verbatim: "solo progreso"

## Tasks
- T1 (S1,S2): Add a local learner portfolio page/export containing only mission and checkpoint progress metadata, never answers or task content; route: `pages/ki8/portfolio/`, catalog link, portfolio verifier; commit: `7726e0c`.
- T2 (S1): Add sequence guidance with prerequisites/recommended-next explanations and checkpoint transitions, derived from existing mission order and local status; route: catalog/dashboard/mission metadata and verifiers; commit: `7726e0c`.
- T3 (S1,S2): Run privacy, differential, accessibility, and full KI/WP8 verification; route: verifier scripts/task log; commit: `7726e0c`.

## Log
- L1: User request verbatim: "continua con las demas mejoras que propusistes"
- L2: Assistant proposal accepted in context: implement portfolio local and pedagogical sequence improvements first.
- L3: User authorization verbatim: "si"
- L4: User privacy decision verbatim: "solo progreso"
- L5: T1/T2 implemented: local portfolio exposes progress-only JSON/Markdown controls; catalog/dashboard now show recommended-next, previous-mission relation, and checkpoint transition derived from local status/order. Portfolio/catalog/checkpoint, mission UI/theme/public-release/privacy/progress/teacher/course/lesson/fruit checks passed. `verify-ki-wp8-public.mjs` still expects the pre-portfolio directory list and fails only on the new `portfolio` entry; that verifier is outside the allowed edit surfaces.
- L6: Reconciled the public route contract by adding `portfolio/` and explicit portfolio route/privacy assertions to `verify-ki-wp8-public.mjs`. Full KI/WP8 privacy and differential QA passed, including M01-M18 lesson definitions and route resolution against `origin/main`. Implementation committed as `7726e0c`; `.mission-qa/` remains untouched and excluded.
