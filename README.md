# LinguaCode

Selbst gehostete, datensparsame Plattform für interaktive Übungen in Spanisch und Informatik.

## Start (lokal)

```bash
php -S localhost:8080 -t public public/router.php
```

Die SQLite-Datenbank wird beim ersten Aufruf unter `data/linguacode.sqlite` angelegt. Lehransicht: `http://localhost:8080/`; veröffentlichte Übungen werden über ihre Freigabe-URL geöffnet.

## Öffentlicher Link: Zustandsautomaten Klasse 8

Die Übung wird als reine statische Seite unter [https://albecabrera.github.io/linguaCode/](https://albecabrera.github.io/linguaCode/) veröffentlicht. Der Workflow `.github/workflows/deploy-automaten.yml` veröffentlicht dabei ausschließlich `public/automaten/`; PHP-Code und Lehrbereich bleiben auf dem eigenen Server.

Falls die Zieladresse später wechselt, setzt der Server die Umgebungsvariable `LINGUACODE_AUTOMATA_PUBLIC_URL` auf die neue vollständige URL.

## Lehrerzugang

Setze auf dem Server ausschließlich einen Passwort-Hash, niemals ein Klartextpasswort:

```bash
php -r 'echo password_hash("DEIN-SICHERES-PASSWORT", PASSWORD_DEFAULT), PHP_EOL;'
```

Hinterlege das Ergebnis vor einem öffentlichen Plesk-Deployment als Umgebungsvariable `LINGUACODE_TEACHER_PASSWORD_HASH`. Der aktuelle Erststart lässt den Lehrerbereich bewusst ohne Anmeldung zu, damit die App lokal getestet werden kann. Das ist nur in einer privaten Testumgebung vertretbar; vor einer öffentlichen Bereitstellung muss die Anmeldung aktiviert werden.

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
