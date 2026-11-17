# Spiele

`pages/spiele/` ist ein nativer, build-freier Bereich für Unterrichtsspiele auf einem gemeinsamen Bildschirm. Die fünf Spiele und der Editor unterstützen Touch auf Tablets und Smartboards: native Buttons bleiben per Touch, Maus und Tastatur bedienbar, Eingabefelder öffnen die virtuelle Tastatur, und die Seite behält Scrollen sowie Pinch-Zoom bei.

## Formate

- **Tauziehen:** Fragen mit zwei Teams; die Lehrkraft entscheidet bei freien Antworten.
- **Glücksrad:** Fragen werden einmalig nacheinander gezogen.
- **Jeopardy:** Kategorien, Punkte und Fragen, die nach Auswahl deaktiviert werden.
- **Memory:** Eigene Kartenpaare aufdecken.
- **Zuordnen:** Begriffe passenden Gruppen zuordnen.

Für jedes Spiel können Titel, Beschreibung, Fach (Informatik, Spanisch, Sport, Mathematik), Klassenstufe und Inhalte bearbeitet werden.

## Speichern und Austausch

Spiele werden mit `localStorage` unter `linguacode.spiele.drafts.v1` gespeichert. Die Speicherung ist an den Browser und das Gerät gebunden. Sie veröffentlicht oder synchronisiert nichts automatisch. Wenn lokaler Speicher fehlt oder das Kontingent voll ist, wird kein Erfolg behauptet und der Entwurf bleibt im Editor erhalten. JSON-Export und -Import erlauben eine manuelle Sicherung bzw. Übertragung.

Importierte JSON-Dateien werden vor dem Öffnen vollständig validiert. Es werden keine externen Bilder oder ausführbaren Inhalte unterstützt.

## Verifikation

Deterministische Modell- und Speicherregeln:

```bash
node scripts/verify-spiele-model.mjs
```

Katalogregression und statische Sicherheitsregeln:

```bash
node scripts/verify-spiele-routes.mjs
```

DOM-UI-Prüfung ohne externe Abhängigkeiten (Editor, Import, Navigation und alle fünf Spiel-Handler):

```bash
node scripts/verify-spiele-ui.mjs
```
