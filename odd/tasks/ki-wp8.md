# KI WP8 feature record
Branch: `feature/wp8-ki-lernpfad`
Status: Inventory, public-safe course scaffold and isolated fictional teacher demo complete. No deployment or production data changes.

## Specs
1. **S1** — "Beginne jetzt mit der **Bestandsaufnahme des realen LinguaCode-Repositories**."
2. **S2** — "Keine Änderungen an Produktion und keine Veröffentlichung ohne ausdrückliche Zustimmung."
3. **S3** — "Erst danach entscheidest du, ob die benötigten Schülerzugänge über ein bestehendes Backend oder über einen neuen, datenschutzrechtlich geprüften Dienst umgesetzt werden."
4. **S4** — "Entpacke diesen .zip und nutze es für die Karteikarte '/Users/acabrera/Desktop/KI_WP8'"
5. **S5** — "si" (reply to the explicit question whether to build a teacher prototype using only fictional data, without activating real student tracking).

## Tasks
- T1 (S1-S4): inventory and prioritized plan, route: parent, commit: 670b9b8
- T2 (S2-S4): quarantine local materials, route: parent, commit: 670b9b8
- T3 (S1-S3): isolated public-safe prototype with tests, route: parent, commit: f200db9
- T4 (S2,S5): fictional teacher dashboard, isolated from Pages and real student records, route: parent, commit: 5a8a1c1

## Log
- L1: "Berücksichtige diese Schritte von Codex: 1. Lege in deinem Projekt einen Ordner teaching-materials/ki-wp8/source/ an und kopiere dort die hochgeladenen PDF- und ODS-Dateien hinein. Lasse sie zunächst lokal und füge den Ordner gegebenenfalls zu .gitignore hinzu, damit du nicht versehentlich fremde oder geschützte Materialien veröffentlichst."
- L2: The supplied path contains an already extracted KI_WP8 directory; no ZIP archive was present at the requested path during inventory. The package README identifies teacher solutions as non-public.
- L3: Existing unrelated working-tree changes were present before this feature branch was created and must remain untouched.
- L4: Evidence and prioritized gates recorded in `docs/ki-wp8/README.md`; no student backend selected. The source package contains 13 PDFs, no ODS or ZIP.
- L5: Inventory/quarantine committed as 670b9b8; prototype committed as f200db9. Prototype RED: ERR_MODULE_NOT_FOUND for course model; GREEN: node scripts/verify-ki-wp8.mjs. Existing Java and schema checks passed; native assessment was unassessable because of unrelated untracked files, but independent read-only verifier found all 13 PDFs ignored and no protected material under pages/.
- L6: Further authentication, protected assessments and deployment wait on the explicit service/data-protection decision described in docs/ki-wp8/README.md; not authorized or claimed complete in this slice.
- L7: User: "yo no quiero solicitar nada pues puedo relacionar WP8-014 con mis alumnos pues se los puedo asignar. Asi que quiero tener mi control como maestro y eso no afecta a los alumnos ni a mi escuela"
- L8: User: "si". This answered the focused question: "¿Aceptás que avance con ese prototipo docente usando únicamente datos ficticios?" No permission to use real records, store them, merge or publish was given.
- L9: T4 RED: missing `docs/ki-wp8/demo/model.mjs`; GREEN: focused model and DOM checks. Existing KI/Java/schema checks passed. Native assess unavailable with pre-existing unrelated untracked files. Demo remains outside Pages; no browser/device check performed.
- L10: T4 committed as 5a8a1c1. Review boundary: treat T1–T3 (public-safe scaffold) and T4 (fictional teacher demo) as separate slices; combined branch exceeds the ~400-line review target. Do not merge or publish without explicit authorization.
