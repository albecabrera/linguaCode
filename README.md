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

Die meisten bisherigen Freigaben verwenden kurze Pages-Pfade (`/s/a/`, `/s/z/` usw.); der KI-WP8-Kurs nutzt die stabile öffentliche Route `/ki8/`. Dadurch entstehen keine `localhost`-Links. Noch nicht als statische Schülerübung veröffentlichte Dashboard-Entwürfe erhalten bewusst keinen fehlerhaften öffentlichen Link.

## UV Künstliche Intelligenz · WP Informatik 8

Die Karte steht im öffentlichen Katalog unter **Informatik**. Sie öffnet alle sechs Module mit 18 interaktiven Unterrichtsstunden, automatisch erklärten Auswahlaufgaben und Partnerarbeitsphasen. Antworten gelten nur für die offene Seite; es gibt weder Konto noch gespeicherten Lernstand oder einen geschützten Lehrerbereich. Original-PDFs und Lehrerlösungen sind nicht Teil der öffentlichen Ausgabe.

Lokale Prüfung ohne Build: `node scripts/verify-ki-wp8-public.mjs`, `node scripts/verify-ki-wp8-public-release.mjs` und die zehn Modul-/UI-Prüfungen für die Module 2–6. Der öffentliche Kurslink ist `https://albecabrera.github.io/linguaCode/ki8/`; die stabile Route führt zur Kursübersicht, während `/ki8/modul-1.html` unverändert direkt erreichbar bleibt. Veröffentlichung erfolgt ausschließlich über den bestehenden Pages-Workflow bei einem Push auf `main`.

## Bruch-Quest · Mathematik Klasse 6

- Öffentliche Schülerübung `/brueche/`, verlinkt im Mathematik-Katalog. Vier Stufen von fairer Teilung und Brucharten über Vergleich/Erweitern/Kürzen zu gleichnamigen und ungleichnamigen Rechenaufgaben.
- Die originale Blockwelt animiert Bewegung, Loot und Wächterkampf anhand richtiger Antworten. Hell-/Dunkelmodus, optionaler Ton und Fortschritt ausschließlich in der Browser-Sitzung; keine Anmeldung oder Übertragung.
- Prüfung ohne Build: `node scripts/verify-brueche.mjs`, `node scripts/verify-brueche-world.mjs`, `node scripts/verify-brueche-ui.mjs`.

## Simple Past · Englisch

Der Trainer unter `pages/simple-past/` verwendet ausschließlich die Verben der bereitgestellten Wörterliste (S. 292–293). Er bietet große Lernkarten und ein bildschirmfüllendes Spiel mit optionalen Tipps; beim Verb `be` zählt nur `was / were` als richtige Antwort. Fehlerübersicht und Wiederholung bleiben im aktuellen Browser-Tab; es gibt keine Übertragung oder dauerhafte Speicherung. Der Kurzlink `https://albecabrera.github.io/linguaCode/s/sp/` und der QR-Code im Katalog und auf der Übungsseite zeigen auf den Trainer. Prüfungen ohne Build: `node scripts/verify-simple-past.mjs`, `node scripts/verify-simple-past-study.mjs`, `node scripts/verify-simple-past-ui.mjs`.

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

Das Java-Lab für Informatik EF/Q1/Q2 ist unter `/java` integriert. Architektur und Betrieb stehen in [`docs/java-lab.md`](docs/java-lab.md). Die sichere Java-Ausführung bleibt standardmäßig deaktiviert, bis ein administrativ geprüfter Docker-Runner eingerichtet ist.

Es werden keine Schülernamen oder Logins gespeichert. `exercise_sessions` ist für eine spätere, pseudonyme Fortschrittsauswertung vorbereitet.

## Informatik · Minecraft Adventures · Klasse 7–10

- Öffentliche Abenteuer-Auswahl unter `/minecraft-adventures/`, verlinkt aus dem Schülerkatalog. Kurzlink `/s/w/` und QR-Code führen zur Auswahl; jede Adventure bietet zusätzlich einen QR-Code für die direkte Code.org-Unit.
- Reihenfolge nach der didaktischen Einschätzung des Nutzers: Minecraft Designer (Leicht–Mittel; Ereignisse, Wiederholungen, Zufall), Voyage Aquatic (Mittel; Schleifen, Bedingungen), Hero’s Journey (Mittel–Schwer; Schleifen, Funktionen, Fehlersuche). Keine offizielle Code.org-Rangliste.
- Aquatic Level 1 bleibt als direkter Einstieg innerhalb von Voyage Aquatic erhalten. Hero’s Journey bietet zusätzlich einen direkten Level-1-Start und den Hinweis auf den Diamond Path.
- Es ist keine LinguaCode-Anmeldung erforderlich; die Adventure-Inhalte werden extern von Code.org bereitgestellt.
- Prüfung ohne Build: `node scripts/verify-minecraft-adventures.mjs`, `node scripts/verify-ki-catalog.mjs`, `node scripts/verify-ki-wp8-public.mjs`.

## Computerführerschein · Informatik Klasse 6

- Öffentliche Katalogkarte für das eigenständige Modul `pages/computerfuehrerschein/`; lokal über `/computerfuehrerschein/` erreichbar.
- Sichere Windows-11-Simulation zum Klicken, Schreiben, Speichern und Organisieren mit lokalem Lernstand; echte Dateien werden nicht verändert.
- Prüfung ohne Build: `node scripts/verify-computerfuehrerschein.mjs`.

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
