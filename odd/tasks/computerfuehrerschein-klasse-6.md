# Computerführerschein Klasse 6

Feature: interactive browser-safe PC simulation for Informatik Klasse 6.

## Specs

### S1 — Lernmodul und Ziel
> Entwickle für meine bestehende Lernplattform **LinguaCode** ein hochwertiges, interaktives Lernmodul mit dem Titel:
>
> **„Computerführerschein – Werde zum PC-Profi!“**
>
> **Fach:** Informatik
> **Jahrgang:** Klasse 6, Gesamtschule NRW
> **Thema:** Umgang mit dem Computer, Tastatur, Textverarbeitung und Dateimanagement
> **Betriebssystem:** Windows 11
> **Schwierigkeitsgrad:** Anfänger ohne Vorkenntnisse

### S2 — Sichere Simulation
> Das Modul soll wie ein echter Computer funktionieren, aber in einer sicheren Simulation innerhalb des Browsers. Aktionen dürfen keine echten Dateien des Geräts verändern oder löschen.

### S3 — Lernwelt und Missionen
> Die Lernwelt besteht aus sechs Missionen.
>
> Mission 1 – Entdecke deine Tastatur
> Mission 2 – Schreiben wie ein Profi
> Mission 3 – Dateien öffnen und speichern
> Mission 4 – Hauptordner und Unterordner
> Mission 5 – Dateien verwalten
> Mission 6 – Die große PC-Challenge

### S4 — Tatsächliche Handlungen prüfen
> Das Programm soll die tatsächlichen Formatierungen und Texteingaben überprüfen, nicht nur das Anklicken der richtigen Schaltfläche.
>
> Die Aufgaben sollen anhand der tatsächlichen Handlungen automatisch überprüft werden.
>
> **Besonderer Wert liegt auf der automatischen Kontrolle:** Die Anwendung muss beispielsweise erkennen können, ob ein Ordner am richtigen Ort erstellt, eine Datei tatsächlich verschoben oder ein bestimmtes Wort korrekt formatiert wurde.

### S5 — Motivation und Zertifikat
> Entwickle ein modernes Belohnungssystem mit:
>
> - Fortschrittsbalken
> - Sternen für erfolgreich abgeschlossene Aufgaben
> - Kleinen Animationen
> - Positiven Rückmeldungen
> - Freischaltbaren Missionen
> - Optionalen Zusatzaufgaben für schnelle Lernende
>
> Am Ende erhalten die Lernenden einen digitalen **„PC-Führerschein – Informatik Klasse 6“** mit ihrem selbst eingegebenen Namen.
>
> Das Zertifikat soll ausgedruckt oder als PDF gespeichert werden können.

### S6 — Architektur und Grenzen
> - Vorhandene Komponenten und Designs nach Möglichkeit wiederverwenden.
> - Keine externen kostenpflichtigen Dienste.
> - Keine Anmeldung erforderlich.
> - Kein echtes Löschen oder Ändern lokaler Dateien.
> - Der virtuelle Dateisystemzustand muss während der Übungen erhalten bleiben.
> - Fortschritte können lokal im Browser gespeichert werden.
> - Funktion für „Mission neu starten“ anbieten.
> - Optional eine vollständige Zurücksetzung ermöglichen.
> - Alle Übungen müssen ohne echte Microsoft-Office-Installation funktionieren.
> - Tastatureingaben müssen im aktiven Simulationsfenster korrekt verarbeitet werden.
> - Drag-and-drop sowie Kontextmenüs möglichst realitätsnah implementieren.
> - Desktop und simulierte Programme müssen aufeinander abgestimmt sein.

### S7 — Leitidee
> **Leitidee: Nicht nur darüber lesen – selbst klicken, schreiben, speichern und organisieren!**

## Tasks
- T1 · S1-S2 · Build standalone browser-safe learning module · commit: 4585db9
- T2 · S3-S4 · Implement six missions and verifiable virtual filesystem/editor state · commit: 4585db9
- T3 · S5 · Add progress, stars, local persistence, reset, and certificate · commit: 4585db9
- T4 · S6-S7 · Integrate catalog/public route and run focused verification · commit: 4585db9

## Log
- L1 · User request received verbatim in the conversation: „erstelle diese neue Kartei: # LinguaCode – Computerführerschein Klasse 6“ followed by the complete six-mission specification and technical requirements.
- L2 · User authorized design-system synchronization before implementation.
- L3 · Design system synchronization completed in `design/system.md` and `design/system.html`; structural and `git diff --check` checks passed.
- L4 · The six-mission simulation was implemented under `pages/computerfuehrerschein/`; `node --check`, `node scripts/verify-computerfuehrerschein.mjs`, and `git diff --check` passed.
- L5 · Catalog and `/computerfuehrerschein` integration completed; PHP syntax, route/MIME HTTP checks, and catalog/README structure checks passed.
- L6 · Browser-level interaction verification is unavailable in this environment because no Playwright/Chromium test runner is present.
- L7 · Work-unit commit `4585db9` created with the module, design sync, feature document, catalog card, route, README entry, and focused verifier; unrelated worktree changes were excluded.
