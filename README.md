# LinguaCode

Selbst gehostete, datensparsame Plattform für interaktive Übungen in Spanisch und Informatik.

## Start (lokal)

```bash
php -S localhost:8091 -t public public/router.php
```

Die SQLite-Datenbank wird beim ersten Aufruf unter `data/linguacode.sqlite` angelegt. Lehransicht: `http://localhost:8091/`; veröffentlichte Übungen werden über ihre Freigabe-URL geöffnet.

## Öffentliche Schülerseite (GitHub Pages)

Alle Schülerübungen werden als reine statische Seite unter [https://albecabrera.github.io/linguaCode/](https://albecabrera.github.io/linguaCode/) veröffentlicht. Der Workflow `.github/workflows/deploy-automaten.yml` veröffentlicht dabei ausschließlich `pages/`; PHP-Code, SQLite-Datenbank und Lehrbereich bleiben auf dem eigenen Server.

Die Seite enthält nur öffentliche Übungen und keine Schülerdaten. Änderungen an `pages/` werden nach einem Push auf `main` automatisch veröffentlicht.

Alle dort hinterlegten Freigaben verwenden einstellige Pages-Pfade (`/s/a/`, `/s/z/` usw.). Dadurch entstehen keine `localhost`-Links. Noch nicht als statische Schülerübung veröffentlichte Dashboard-Entwürfe erhalten bewusst keinen fehlerhaften öffentlichen Link.

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

Hinterlege das Ergebnis vor einem öffentlichen Plesk-Deployment als Umgebungsvariable `LINGUACODE_TEACHER_PASSWORD_HASH`. Der integrierte lokale PHP-Entwicklungsserver lässt die bisherigen Lehrseiten bewusst ohne Anmeldung zu. **Ausnahme:** `/teacher/tastatur` und die dazugehörige Datenroute benötigen auch lokal einen Passwort-Hash und eine Anmeldung. Die allgemeine lokale Ausnahme gilt **nur** für `php -S`; auf jedem anderen Webserver bleibt der Lehrerbereich ohne Passwort-Hash gesperrt.

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

Das Java-Lab für Informatik EF/Q1/Q2 ist unter `/java` integriert. Architektur und Betrieb stehen in [`docs/java-lab.md`](docs/java-lab.md). Die sichere Java-Ausführung bleibt standardmäßig deaktiviert, bis ein administrativ geprüfter Docker-Runner eingerichtet ist.

Es werden keine Schülernamen oder Logins gespeichert. `exercise_sessions` ist für eine spätere, pseudonyme Fortschrittsauswertung vorbereitet.

## Tastatur-Profi · Informatik Klasse 6

- Schülertrainer: `/tastatur/` auf dem PHP-Testserver, `pages/tastatur/` auf GitHub Pages; öffentlicher Pages-Kurzlink: `s/b/`.
- Sechs Lernstufen, Korrekturübungen, Hilfe, Challenge und freies Schreiben. Die deutsche Windows-T1-Tastatur zeigt 105 Tasten inklusive Nummernblock und ISO-Enter.
- Lehrerübungen: `/teacher/tastatur`, geschützt durch den vorhandenen Lehrerzugang und CSRF. Auch lokal ist hierfür ein gesetzter `LINGUACODE_TEACHER_PASSWORD_HASH` erforderlich; ohne ihn antwortet die Route mit 503, selbst wenn andere lokale Lehrseiten ohne Anmeldung erreichbar sind. Eigene Wörter/Sätze anlegen, bearbeiten, löschen und direkt starten. Die additive Tabelle `keyboard_exercises` nutzt dieselbe SQLite-Datenbank; bestehende Engines bleiben unverändert.
- Eigene Übungen sind nur auf dem PHP-Host im Lehrerzugang verfügbar (z. B. Smartboard), nicht auf GitHub Pages. Schülertexte und Ergebnisse werden weder gespeichert noch übertragen.
- Die echte Tastatur verwendet die native Browser-Textbearbeitung. Windows-/Strg-/Alt-Kombinationen werden nicht abgefangen. Tab wechselt den Fokus; im freien Schreiben ist die Text-Tabulatorfunktion ausdrücklich zuschaltbar. Virtuelles Shift/Alt Gr gilt für das nächste Zeichen, Feststell bleibt aktiviert.
- Das deutsche Windows-Caps-Lock-Verhalten betrifft auch viele Zahlen und Satzzeichen. Belegung geprüft anhand von [Microsofts KBDGR-Tabelle](https://github.com/microsoft/Windows-driver-samples/blob/main/input/layout/all_kbds/kbdgr/kbdgr.c).
- Sterne hängen nur von der Genauigkeit ab: 98 % → 3, 90 % → 2, darunter → 1. Nachträglich korrigierte Fehler bleiben in der Statistik. Die Zeit gibt keine Punkte.

Prüfung ohne Build und ohne produktive Daten:

```bash
node scripts/verify-tastatur.mjs
node scripts/verify-tastatur-ui.mjs
php scripts/verify-tastatur.php
node scripts/verify-tastatur-auth.mjs
php scripts/verify-schema.php
```

`verify-tastatur.php` testet Validierung und CRUD ausschließlich mit SQLite im Arbeitsspeicher. Die Arbeitsblätter aus dem Briefing liegen nicht im Projekt; der Trainer übernimmt deshalb die vorhandenen LinguaCode-Farben. Ein echter Windows-11-Gerätetest und ein iPad-Touch-Test stehen noch aus.

## Java-Interaktiv · Informatik Oberstufe

- Neues eigenständiges Modul: `/java-interaktiv/`, öffentlicher Pages-Kurzlink `s/j/`. Das bestehende Java-Lab bleibt unverändert.
- 78 Karten aus `pages/java-interaktiv/cards.md`, zwölf Themen-Sets, individuelle Auswahl, Mischen, Lernmodus und vergrößerter Lehrermodus. Antworten bleiben zunächst verborgen.
- Quiz: sechs redaktionell hinterlegte Multiple-Choice-Fragen mit jeweils drei Distraktoren; alle anderen Fragen nutzen Selbsteinschätzung.
- Sechs begrenzte Simulationen: Array-Summe, Fakultät (0–7), lineare Suche, Bubble-Sort-Schritte, Stack/Queue, Suchaufwand. Kein beliebiger Java-Code wird ausgeführt.
- Lernstand ausschließlich lokal im Browser (`linguacode-java-cards-v1`), ohne Namen oder Serverübertragung. Fehlender Speicherzugriff blockiert das Lernen nicht.
- Bedienung per großen Touch-Schaltflächen, Tab, Pfeiltasten und Leertaste. Die Simulationen ersetzen keinen Java-Compiler; Originalbeispiele bleiben unverändert.

Prüfung ohne Build:

```bash
node scripts/verify-java-interaktiv.mjs
node scripts/verify-java-interaktiv-ui.mjs
php scripts/verify-java-lab.php
```

Der DOM-Test prüft Bedienlogik, nicht Browserlayout oder echte iPad-/Smartboard-Geräte.
