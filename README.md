# LinguaCode

Selbst gehostete, datensparsame Plattform für interaktive Übungen in Spanisch und Informatik.

## Start (lokal)

```bash
php -S localhost:8080 -t public public/router.php
```

Die SQLite-Datenbank wird beim ersten Aufruf unter `data/linguacode.sqlite` angelegt. Lehransicht: `http://localhost:8080/`; veröffentlichte Übungen werden über ihre Freigabe-URL geöffnet.

## Öffentliche Schülerseite (GitHub Pages)

Alle Schülerübungen werden als reine statische Seite unter [https://albecabrera.github.io/linguaCode/](https://albecabrera.github.io/linguaCode/) veröffentlicht. Der Workflow `.github/workflows/deploy-automaten.yml` veröffentlicht dabei ausschließlich `pages/`; PHP-Code, SQLite-Datenbank und Lehrbereich bleiben auf dem eigenen Server.

Die Seite enthält nur öffentliche Übungen und keine Schülerdaten. Änderungen an `pages/` werden nach einem Push auf `main` automatisch veröffentlicht.

## Öffentlicher PHP-Host und Kurzlinks

Der Lehrerbereich benötigt PHP und SQLite und wird daher **nicht** über GitHub Pages bereitgestellt. Auf dessen öffentlichem PHP-Host müssen vor dem Deployment diese Umgebungsvariablen gesetzt sein:

```text
LINGUACODE_TEACHER_PASSWORD_HASH=<Passwort-Hash>
LINGUACODE_PUBLIC_URL=https://DEINE-OEFFENTLICHE-DOMAIN
```

`LINGUACODE_PUBLIC_URL` sorgt dafür, dass QR-Codes und Kurzlinks immer die öffentliche Domain verwenden – niemals `localhost`. Für noch kürzere Links kann hier eine eigene kurze Domain eingetragen werden.

## Lehrerzugang

Setze auf dem Server ausschließlich einen Passwort-Hash, niemals ein Klartextpasswort:

```bash
php -r 'echo password_hash("DEIN-SICHERES-PASSWORT", PASSWORD_DEFAULT), PHP_EOL;'
```

Hinterlege das Ergebnis vor einem öffentlichen Plesk-Deployment als Umgebungsvariable `LINGUACODE_TEACHER_PASSWORD_HASH`. Der integrierte lokale PHP-Entwicklungsserver lässt den Lehrerbereich bewusst ohne Anmeldung zu. Das gilt **nur** für `php -S`; auf jedem Webserver bleibt der Lehrerbereich ohne Passwort-Hash gesperrt.

## Prüfung

```bash
php scripts/verify-schema.php
```

Die Prüfung validiert die SQLite-Tabellen sowie die Fremdschlüssel-Löschung von Inhalten und Freigabe-Links.

## Phase 1

- Lehr-Dashboard mit Anlegen, Bearbeiten, Aktivieren und Deaktivieren
- strukturierte Inhalte als JSON
- anonyme öffentliche Freigabe-Links mit QR-Code
- responsive Quiz-Engine als Referenz für weitere Engines

Die JSON-Formate der vier Engines stehen in [`docs/content-formats.md`](docs/content-formats.md).

Es werden keine Schülernamen oder Logins gespeichert. `exercise_sessions` ist für eine spätere, pseudonyme Fortschrittsauswertung vorbereitet.
