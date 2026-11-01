# Simple Past public release
Branch: release/simple-past from origin/main. Publish only the Simple Past trainer, not unrelated KI branch changes.

## Specs
1. **S1** — “dann macht es öffentlich”
2. **S2** — “führe alle 17 commits durch”
3. **S3** — “nur auf dem Grät der Schüler”
4. **S4** — “es müssen nur diese Verben vorkommen, du darfst sonst keine anderen Verben benutzen, die nicht auf der Liste stehen.”
5. **S5** — “Beachte bitte, dass du wie immer einen QR-Code und einen Kurzlink erstellst.”

## Tasks
- T1 (S1–S5): Inspect publication boundaries and isolate a release based on current origin/main; route: parent inline; status: done; commit: 432d293.
- T2 (S1–S5): Publish only the Simple Past public files through main and Pages; route: parent inline; status: done; commit: 432d293; Pages run: 41303628197 success.
- T3 (S1–S5): Verify live trainer, shortlink, QR target, and no unrelated release changes; route: parent and independent high-risk verification; status: done; commit: 432d293; evidence: Pages run 41303628197 and live curl check.

## Log
- L1: “dann macht es öffentlich”
- L2: User previously said: “führe alle 17 commits durch” (feature branch push, already completed).
- L3: Main and feature branch diverge (99 main-only commits and 27 branch-only commits); release must avoid merging unrelated feature changes. No build per project instructions.
- L4: Isolated worktree based on origin/main at 47b688b; copied only six new Simple Past paths from 5508755 and adapted catalog/README. Focused, JavaScript syntax, adjacent Kahoot and diff checks pass. No publish yet.
- L5: Branch push already confirmed by parent: origin/feature/wp8-ki-lernpfad == 5508755; the 17 earlier commits and Simple Past commit were pushed in the previous turn. Independent verifier mvxrn4rz-1-ne7k passed static S3-S5 and change boundary, and correctly left S1/live S5 pending deployment. S2 evidence is the separate feature branch, not this main-based release worktree.
- L6: Isolated commit 432d293 pushed to origin/main by fast-forward from 47b688b. GitHub Pages run 41303628197 completed successfully at 432d293. Initial Python urllib public check failed before an HTTP response with SSL CERTIFICATE_VERIFY_FAILED (local issuer chain); user authorized one alternative live check.
- L7: Authorized curl-based live check exited 0: catalog, `/s/sp/`, `/simple-past/`, app, core, CSS and QR generator all fetched over TLS; trainer page and JS/CSS byte-match release files. Catalog anchors point to `/s/sp/`, shortlink fallback/meta refresh target `/simple-past/`, and QR JS encodes the resolved shortlink. No physical camera scan or interactive browser run; static local exercise verifier and independent release verifier passed.
