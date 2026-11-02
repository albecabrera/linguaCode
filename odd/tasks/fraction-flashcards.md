# Fraction flashcards

Interactive Grade 6 mathematics learning experience based on the supplied source PDFs.

## Specs
1. **S1 — Source material:** “Erstelle aus Basis diese Dokumente, diese PDFs, eine Karteikarte zum Fach Mathematik, Klasse 6. Das Hauptthema sind Brüche.” Sources: `'/Users/acabrera/Downloads/01_Smartboardpraesentation.pdf''/Users/acabrera/Downloads/04_Alle_Arbeitsblaetter.pdf''/Users/acabrera/Downloads/05_Alle_Zusatzarbeitsblaetter.pdf'`
2. **S2 — Learning path:** “Finde eine logische Reihenfolge, auch mit Schwierigkeitsgrad von leicht zu mittel zu schwer”
3. **S3 — Experience and style:** “erstelle eine Premium-Karteikarte interaktiv, spielerisch für Schülerinnen und Schüler der 6. Klasse. Das sollte responsive für alle Devices sein und einen Hell- und Dunkelmodus haben, Style Minecraft.”
4. **S4 — Rewards:** “Wenn du die Schüler mehrere Aufgaben richtig erledigt haben, erhalten diese eine Belohnung, wie es immer in Minecraft ist. entweder eine besondere Ausrüstung oder....”
5. **S5 — Feedback:** “Es wäre super, wenn die Schülerinnen und Schüler eine Rückmeldung erhalten würden, wie sie waren, was sie wiederholen sollen, auch viel Lob, damit sie motiviert weiterhin lernen”

## Tasks
- T1 (S1–S2): Extract the fraction curriculum and create the ordered exercise model; route: `gentle-ai-explore`; commit: pending.
- T2 (S3): Create three accessible Minecraft-style directions and select the implementation board; route: parent inline; status: done; commit: pending.
- T3 (S1–S5): Implement the static, responsive flashcard game including modes, dark mode, reward progression, and per-topic feedback; route: `gentle-ai-worker`; status: done; commit: pending.
- T4 (S1–S5): Add focused checks and verify the public page structure and game behavior; route: parent inline; status: in progress; commit: pending.

## Log
- L1: “Erstelle aus Basis diese Dokumente, diese PDFs, eine Karteikarte zum Fach Mathematik, Klasse 6. Das Hauptthema sind Brüche. Finde eine logische Reihenfolge, auch mit Schwierigkeitsgrad von leicht zu mittel zu schwer und erstelle eine Premium-Karteikarte interaktiv, spielerisch für Schülerinnen und Schüler der 6. Klasse. Das sollte responsive für alle Devices sein und einen Hell- und Dunkelmodus haben, Style Minecraft. Wenn du die Schüler mehrere Aufgaben richtig erledigt haben, erhalten diese eine Belohnung, wie es immer in Minecraft ist. entweder eine besondere Ausrüstung oder.... '/Users/acabrera/Downloads/01_Smartboardpraesentation.pdf''/Users/acabrera/Downloads/04_Alle_Arbeitsblaetter.pdf''/Users/acabrera/Downloads/05_Alle_Zusatzarbeitsblaetter.pdf' Es wäre super, wenn die Schülerinnen und Schüler eine Rückmeldung erhalten würden, wie sie waren, was sie wiederholen sollen, auch viel Lob, damit sie motiviert weiterhin lernen”
- L2: Source mapping by `gentle-ai-explore`: follow the evidence-backed sequence Bruch-Detektiv (fair sharing, Zähler/Nenner, fraction types) → Gleich viel? (comparison, equivalence, expansion/reduction) → Rechen-Abenteuer (same-denominator addition/subtraction) → Endgegner (unlike denominators, mixed numbers, error correction). Do not introduce multiplication or division of fractions.
- L3: Created `design/fraction-quest/` with the Quest trail, Inventory cards, and Boss arena alternatives. Selected `01-quest-trail.html` because it best makes the full learning progression visible before the player begins an active card; the other boards supply patterns for rewards and difficult tasks. Canvas: `http://127.0.0.1:55106/9PuRQhoChn895Ecx-XU0cvfifKIfUiU5/d/fraction-quest/`.
- L4: T3 implementation: `pages/brueche/index.html` provides all four source-backed levels, immediate explanatory feedback, a session-only streak and rewards, a topic-oriented end report, responsive controls, dark mode, focus styling, and reduced-motion behavior. `scripts/verify-brueche.mjs` had RED evidence because the page did not exist; it now passes 16 checks (GREEN). README documents `/brueche/` and the command. No build run.
