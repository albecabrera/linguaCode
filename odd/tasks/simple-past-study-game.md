# Simple Past study and game modes
Branch: feature/wp8-ki-lernpfad. Preserve the 83 photographed verbs, ten-verb mastery rounds, local-only answers and existing shortlink/QR.

## Specs
1. **S1** — “Ich möchte gerne in der Hauptansicht der interaktiven Karte zwei Optionen haben. Die erste Option heißt einfach die Verben mit der Simple-Past-Form zu schauen und mit der deutschen Übersetzung, damit man sich das gut merken kann. Das muss in einer großen Schrift, in einem großen Font hervorgehoben, damit man das richtig im Gehirn sich einprägen kann und man kann immer wieder von diesem Modus auf den Spielmodus wechseln.”
2. **S2** — “Ich möchte, dass man im Spielmodus die ganze Bildschirmfläche zur Verfügung hat.”
3. **S3** — “Wenn man das Verb nicht kennt oder weiß, könnte man unten nach Tipps erfragen.”
4. **S4** — “Implementiere dies und mach ein commit + push der Änderungen.”
5. **S5** — “es müssen nur diese Verben vorkommen, du darfst sonst keine anderen Verben benutzen, die nicht auf der Liste stehen.”
6. **S6** — “nur auf dem Grät der Schüler”

## Tasks
- T1 (S1–S6): Design mode choice, large study card, and full-viewport game directions using existing tokens; route: inline; commit: pending; status: done.
- T2 (S1,S3,S5,S6): Add test-first study navigation, mode switching without resetting progress, and non-scoring progressive tips; route: inline; commit: pending; status: done.
- T3 (S1–S3): Implement selected visual direction in trainer UI and CSS, preserving game, sounds, QR, and privacy; route: inline; commit: pending; status: done.
- T4 (S1–S6): Verify focused and adjacent behavior, independent delivery check, commit and push feature branch; route: parent and item-5 verifier; commit: pending; status: in progress.

## Log
- L1: “Ich möchte gerne in der Hauptansicht der interaktiven Karte zwei Optionen haben. Die erste Option heißt einfach die Verben mit der Simple-Past-Form zu schauen und mit der deutschen Übersetzung, damit man sich das gut merken kann. Das muss in einer großen Schrift, in einem großen Font hervorgehoben, damit man das richtig im Gehirn sich einprägen kann und man kann immer wieder von diesem Modus auf den Spielmodus wechseln. Ich möchte, dass man im Spielmodus die ganze Bildschirmfläche zur Verfügung hat. Wenn man das Verb nicht kennt oder weiß, könnte man unten nach Tipps erfragen. Implementiere dies und mach ein commit + push der Änderungen.”
- L2: Existing trainer already has the 83-verb whitelist, mastery rounds, block-world reward game, local-only state and QR at /s/sp/. The current public Pages version is older than this feature branch. `design/system.md` is up to date; no resync needed.
- L3: Created design/simple-past-study-game/01-split-portal.html, 02-stacked-archive.html and 03-world-gate.html. Selected and handed off 01-split-portal.html for implementation; the others remain alternatives. Canvas: http://127.0.0.1:58276/JB6aKAtz59RjTl4A5Lm6xq4ecka57t0n/d/simple-past-study-game/. Existing design system color/font and accessibility self-check passed.
- L4: T2 RED: `pages/simple-past/study.mjs` was absent. GREEN: `node scripts/verify-simple-past-study.mjs` passed study-card bounds, home/study/game state, quest identity/progress across switches, first-letter and length hints capped at two, and unchanged counters on hints. Existing `node scripts/verify-simple-past.mjs` passed.
- L5: T3 UI RED: #home-view missing. GREEN: two-mode home, oversized study cards and navigation, fixed 100dvh game, bottom tips and mode-switch wiring pass UI, study and baseline core checks; JS syntax and `git diff --check` pass. README updated. Local server at 127.0.0.1:8765 served all new view and tip IDs; chosen artboard handoff marked implemented with preview URL. No browser visual interaction or publish performed.
- L6: RDD-off native assess escalated item 5 for remote delivery; untracked artifacts made native risk unassessable. Independent verifier mvxtkew4-3-ckzb ran all focused checks in an isolated scratch copy, an 83-triple/state/tip probe, syntax and diff checks; S1–S3/S5–S6 met, S4 pending commit/push. Parent final checks passed focused trio, adjacent Kahoot and Java-Interaktiv scripts, JS syntax, artboard token/accessibility self-check and git diff --check. Browser visual/mobile interaction unavailable; no build.
