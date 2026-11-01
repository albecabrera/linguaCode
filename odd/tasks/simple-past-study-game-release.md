# Simple Past study/game public release
Branch: release/simple-past, based on origin/main; release only the Simple Past trainer update.

## Specs
- S1 — “veröffentliche die Seite”
- S2 — “mach dann ein commit + push der Änderungen”
- S3 — “bei to be => muss man => was / were schreiben, damit die Lösung richtig ist.”

## Tasks
- T1 (S1,S3): Isolate the updated Simple Past trainer, tests, and docs on the release worktree; verify locally; route: parent inline; commit: pending release work unit; status: done.
- T2 (S1,S2,S3): Independently verify release boundary and grading; commit and push only the release to main; route: parent + item-5 verifier; commit: pending; status: in progress.
- T3 (S1,S3): Confirm the Pages run and live site, then record evidence; route: parent; commit: pending; status: pending.

## Log
- L1: “dann veröffentliche die Seite und mach dann ein commit + push der Änderungen”
- L2: Previous user correction: “bei to be => muss man => was / were schreiben, damit die Lösung richtig ist. Implementiere dies und mach ein commit + push”
- L3: origin/main at 7ca8e03 already serves an earlier Simple Past release via .github/workflows/deploy-automaten.yml. feature/wp8-ki-lernpfad at 3ee67ee diverges (101 main-only and 32 feature-only commits); release worktree .simple-past-release is clean and already registered. Isolate paths rather than merging unrelated feature work. No build per project instructions.
- L4: T1 copied exactly five trainer files and three focused verifiers from the feature branch into the main-based release worktree; changed only its Simple Past README paragraph, leaving catalog/shortlink and other pages as in main. All three focused scripts, adjacent Kahoot/Java scripts, JS syntax and git diff --check pass. No build.
