# KI mission-only cleanup
Branch: `feature/ki-mission-cleanup`, based on `main` at `d72a869`.
Scope: retain only public Missions 01–18, improve their catalog, and remove legacy module implementation without breaking mission routes, shared runtime, or visual design.

## Specs
1. **S1** — User request verbatim: “haz un roadmap de las sesiones para que sea mas claro y legible y pon la tarjeta a tamano completo”
2. **S2** — User clarification verbatim: “yo quiero que el panel se vea mas premium, las misiones de diferentes colores. Tambien la interfaz debe de ocupar todo el ancho de la pagina para que quepan mas misiones una al lado de la otra. Cuando termines con esto, elimina los modulos pues ya no me facen falta”
3. **S3** — User decision verbatim: “quiero que se queden solo las misiones del 01-018. Todo lo demas lo eliminas sin romper codigos ni diseñnos”

## Tasks
- T1 (S1,S2): Improve the mission catalog roadmap, premium visual hierarchy, mission color variation, and responsive full-width layout; route: `pages/ki8/index.html`, `pages/ki8/style.css`, `pages/ki8/mission/course-integration.css`, `pages/index.html`, `pages/assets/site.css`, `scripts/verify-ki-wp8-public.mjs`; status: complete; commit: pending.
- T2 (S3): Remove legacy module pages/runtime and replace affected tests and overview targets with mission-only contracts; route: `pages/ki8/modul-*.html`, `pages/ki8/module*-{core,ui}.mjs`, `pages/ki8/course.mjs`, `scripts/verify-ki-wp8*.mjs`, `scripts/verify-ki-mission-*.mjs`; commit: pending.
- T3 (S1,S2,S3): Verify the mission-only catalog, all M01–M18 public routes and QR contracts, and preserved shared design; route: `scripts/verify-ki-mission-*.mjs`, `scripts/verify-ki-wp8*.mjs`; commit: pending.

## Log
- L1: User request verbatim: “haz un roadmap de las sesiones para que sea mas claro y legible y pon la tarjeta a tamano completo”
- L2: User clarification verbatim: “si”
- L3: User request verbatim: “yo quiero que el panel se vea mas premium, las misiones de diferentes colores. Tambien la interfaz debe de ocupar todo el ancho de la pagina para que quepan mas misiones una al lado de la otra. Cuando termines con esto, elimina los modulos pues ya no me facen falta”
- L4: User decision verbatim: “quiero que se queden solo las misiones del 01-018. Todo lo demas lo eliminas sin romper codigos ni diseñnos”
- L5: Read-only exploration task `mvqzor0m-25-oukh` mapped the legacy-only surface: `pages/ki8/modul-{1..6}.html`, `module{1..6}-{core,ui}.mjs`, and `course.mjs`; it also identified test contracts that must be replaced before deletion. M01–M18 route shells and the mission runtime remain required. Historical module URLs will become unavailable under S3.
- L6: User instruction verbatim: “The todo plan has not been reviewed during several tool-use turns. Check whether it still matches the work performed and update tasks where needed. Do not mark work done without verification.” Reconciled: T1 is the sole in-progress task. Its focused RED check proved the roadmap/full-width/mission-tone contracts were absent; roadmap/card changes from the prior request exist, and the premium full-width CSS work is underway but unverified. T2 remains pending because no module files have been deleted. T3 remains pending.
- L7: T1 GREEN: the public verifier now confirms the five-stage roadmap, featured course card, full-width KI layout, 18-rem responsive mission columns, and six rotating mission tones. `verify-ki-wp8-public.mjs`, `verify-ki-mission-course.mjs`, `verify-ki-wp8-public-release.mjs`, and `git diff --check` passed. T1 is complete; T2 is next. No module file has been removed yet.
