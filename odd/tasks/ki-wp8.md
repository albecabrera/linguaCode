# KI WP8 feature record
Branch: `feature/wp8-ki-lernpfad`
Status: Phase 1 inventory only; no deployment or production data changes.

## Specs
1. **S1** — "Beginne jetzt mit der **Bestandsaufnahme des realen LinguaCode-Repositories**."
2. **S2** — "Keine Änderungen an Produktion und keine Veröffentlichung ohne ausdrückliche Zustimmung."
3. **S3** — "Erst danach entscheidest du, ob die benötigten Schülerzugänge über ein bestehendes Backend oder über einen neuen, datenschutzrechtlich geprüften Dienst umgesetzt werden."
4. **S4** — "Entpacke diesen .zip und nutze es für die Karteikarte '/Users/acabrera/Desktop/KI_WP8'"

## Tasks
- T1 (S1-S4): inventory and prioritized plan, route: parent, commit: pending
- T2 (S2-S4): quarantine local materials, route: parent, commit: pending
- T3 (S1-S3): isolated public-safe prototype with tests, route: parent, commit: pending
- T4 (S2-S3): architectural decision on protected student service, route: user, commit: none; pending user decision after findings

## Log
- L1: "Berücksichtige diese Schritte von Codex: 1. Lege in deinem Projekt einen Ordner teaching-materials/ki-wp8/source/ an und kopiere dort die hochgeladenen PDF- und ODS-Dateien hinein. Lasse sie zunächst lokal und füge den Ordner gegebenenfalls zu .gitignore hinzu, damit du nicht versehentlich fremde oder geschützte Materialien veröffentlichst."
- L2: The supplied path contains an already extracted KI_WP8 directory; no ZIP archive was present at the requested path during inventory. The package README identifies teacher solutions as non-public.
- L3: Existing unrelated working-tree changes were present before this feature branch was created and must remain untouched.
- L4: Evidence and prioritized gates recorded in `docs/ki-wp8/README.md`; no student backend selected. The source package contains 13 PDFs, no ODS or ZIP.
