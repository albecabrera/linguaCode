# Simple Past study/game public release
Branch: release/simple-past, based on origin/main; release only the Simple Past trainer update.

## Specs
- S1 — “veröffentliche die Seite”
- S2 — “mach dann ein commit + push der Änderungen”
- S3 — “bei to be => muss man => was / were schreiben, damit die Lösung richtig ist.”

## Tasks
- T1 (S1,S3): Isolate the updated Simple Past trainer, tests, and docs on the release worktree; verify locally; route: parent inline; commit: 5bf7da9; status: done.
- T2 (S1,S2,S3): Independently verify release boundary and grading; commit and push only the release to main; route: parent + item-5 verifier; commit: 5bf7da9; status: done.
- T3 (S1,S3): Confirm the Pages run and live site, then record evidence; route: parent; commit: 5bf7da9 (published release; evidence recorded in follow-up docs commit); status: done.

## Log
- L1: “dann veröffentliche die Seite und mach dann ein commit + push der Änderungen”
- L2: Previous user correction: “bei to be => muss man => was / were schreiben, damit die Lösung richtig ist. Implementiere dies und mach ein commit + push”
- L3: origin/main at 7ca8e03 already serves an earlier Simple Past release via .github/workflows/deploy-automaten.yml. feature/wp8-ki-lernpfad at 3ee67ee diverges (101 main-only and 32 feature-only commits); release worktree .simple-past-release is clean and already registered. Isolate paths rather than merging unrelated feature work. No build per project instructions.
- L4: T1 copied exactly five trainer files and three focused verifiers from the feature branch into the main-based release worktree; changed only its Simple Past README paragraph, leaving catalog/shortlink and other pages as in main. All three focused scripts, adjacent Kahoot/Java scripts, JS syntax and git diff --check pass. No build.
- L5: Independent verifier mvxxxp43-5-iw9q passed isolated release boundary and S3 in an isolated scratch copy; S1/S2 were pending publication as expected. RDD-off assessment escalated delivery item 5; native candidate unassessable because of untracked release artifacts, independent verifier used per plan. Single coherent 489-authored-line release unit is above ~400 review budget; tests/docs stay with the behavior rather than split by file type. Commit 5bf7da9 fast-forward pushed origin/main from 7ca8e03, starting the Pages workflow.
- L6: GitHub Pages run 41317899764 completed successfully for 5bf7da96d3ec3001a2677e728be02af8a1c23c4b. Public HTTPS checks byte-matched eight release files: catalog, /s/sp/, /simple-past/ HTML, app/core/study JS, CSS, and QR generator. Catalog share link, shortlink redirect and be prompt checked. No visual/browser device interaction or camera QR scan; no build. S1-S3 met.
