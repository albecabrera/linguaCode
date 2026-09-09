# LinguaCode

Selbst gehostete, datensparsame Plattform für interaktive Übungen in Spanisch und Informatik.

## Start (lokal)

```bash
php -S localhost:8080 -t public public/router.php
```

Die SQLite-Datenbank wird beim ersten Aufruf unter `data/linguacode.sqlite` angelegt. Lehransicht: `http://localhost:8080/`; veröffentlichte Übungen werden über ihre Freigabe-URL geöffnet.

## Phase 1

- Lehr-Dashboard mit Anlegen, Bearbeiten, Aktivieren und Deaktivieren
- strukturierte Inhalte als JSON
- anonyme öffentliche Freigabe-Links mit QR-Code
- responsive Quiz-Engine als Referenz für weitere Engines

Es werden keine Schülernamen oder Logins gespeichert. `exercise_sessions` ist für eine spätere, pseudonyme Fortschrittsauswertung vorbereitet.
