# Mission 01 – Was ist künstliche Intelligenz?

> **Status: lokale Vorschau.** Mission 01 ist auf dem Feature-Branch implementiert und nicht veröffentlicht. Die Prüfung auf physischen iPads und Smartboards sowie ein QR-Kameratest stehen noch aus.

## Zweck und Ablauf

Mission 01 führt Lernende durch vier zeitlich festgelegte Phasen (insgesamt 45 Minuten):

| Phase | Zeit | Ziel und Abschluss |
|---|---:|---|
| 1. Film | 18 Min. | Offiziellen Film ansehen und die Selbstmeldung abgeben. Die Checkbox ist **kein technischer Nachweis** des Ansehens. |
| 2. Arbeitsblatt | 10 Min. | Offizielles Schüler-Arbeitsblatt bearbeiten; offene Antworten selbst vergleichen und Aufgabe C prüfen; anschließend Arbeitsblatt als bearbeitet markieren. |
| 3. KI-Labor | 11 Min. | Obst-Detektiv trainieren, Vergleich beobachten und Reflexionsantwort abgeben. |
| 4. Abschlussquiz | 6 Min. | Fünf Fragen beantworten, Feedback lesen und das Quiz bei Bedarf wiederholen. |

Die Phasen werden nacheinander freigeschaltet. Die Mission ist eine lokale, statische Lernanwendung; sie ersetzt keine Lehrkraft-Rückmeldung.

## Offizielle externe Quellen

- [Offiziellen Film bei Planet Schule öffnen](https://www.planet-schule.de/thema/dennis-und-die-ki-was-ist-ki-100.html)
- [Schüler-Arbeitsblatt bei Planet Schule öffnen](https://www.planet-schule.de/thema/dennis-ki-ab1-pdf-100.pdf)

Die Anwendung verlinkt nur auf diese externen Quellen. Es werden keine Download-, Kopier-, Spiegelungs-, Einbettungs- oder sonstigen Nutzungsrechte angenommen. Das Material wird nicht in `pages/` kopiert oder eingebettet.

**Nur für Lehrkräfte:** [Offizielle Lehrerhandreichung bei Planet Schule öffnen](https://www.planet-schule.de/thema/dennis-ki-kb1-pdf-100.pdf)

Dieser Lehrer-Link gehört ausschließlich in dieses lokale Repository-Dokument und darf nicht in öffentliche Seiten, den Renderer oder Schüleransichten übernommen werden.

## Aufgaben und Obst-Detektiv

Die Aufgaben A und B sind offene Antworten. „Meine Antwort prüfen“ ist ein Selbst-Check, keine automatische Bewertung; anschließend kann die Beispielantwort angezeigt und die eigene Antwort überarbeitet werden.

Aufgabe C lautet:

> Ein KI-Modell kann aus ______ Muster lernen. Anschließend kann es neue ______ untersuchen.

Akzeptierte Begriffe sind im ersten Feld **Beispiele** bzw. **Trainingsdaten** und im zweiten Feld **Daten** bzw. **Bilder**. Verneinungen oder unpassende Begriffe gelten nicht als Lösung.

Das KI-Labor ist bewusst ein vereinfachtes Modell:

1. Trainingsbeispiele: roter Apfel und gelbe Banane.
2. Die Ausgangsregel nutzt nur die Farbe: `Rot → Apfel`, `Gelb → Banane`.
3. Gelbe Testbanane → Banane.
4. Gelber Testapfel → zunächst Banane: Farbe allein führt zur Fehlklassifikation.
5. Mit der zusätzlichen Formregel wird der gelbe, runde Apfel → Apfel.
6. Eine grüne Banane dient als optionale offene Reflexion: Farbe kann irreführen; zusätzliche geeignete Merkmale helfen.

Das Beispiel demonstriert Regeln, Beispiele und Merkmale; es behauptet kein echtes Trainingsverfahren. Die Formregel verbessert das Beispiel, garantiert aber keine Fehlerfreiheit.

## Quiz: Antworten und Begründungen

Die korrekten Optionen sind **B, A, C, B, A**:

1. **B** – Geeignete Trainingsbilder liefern Muster, aus denen ein Bilderkennungsmodell typische Merkmale lernen kann.
2. **A** – Trainingsdaten beeinflussen die lernbaren Muster; sie garantieren kein immer richtiges Ergebnis.
3. **C** – Seltene oder ungewöhnliche Beispiele können außerhalb der vertrauten Daten schwieriger zuzuordnen sein.
4. **B** – Form und Farbe liefern hier gemeinsam nützlichere Informationen als die Farbe allein.
5. **A** – Auch ein trainiertes Modell kann sich bei neuen Beispielen irren.

Bewertungsbänder: **5/5** „Hervorragend! Du hast die Mission erfolgreich abgeschlossen.“; **3–4/5** „Gut gemacht! Du hast vieles verstanden.“; **0–2/5** „Du hast erste wichtige Dinge gelernt. Wiederhole die Lernkarten und probiere das Quiz erneut.“

## Lokaler Fortschritt und Datenschutzgrenzen

Der Fortschritt wird ausschließlich lokal im Browser gespeichert. Die Speicherung ist namespaced und versioniert (`linguacode:ki-wp8:mission-01:v1`); Antworten, Phasen, Obst-Labor und Quizstatus werden nicht übertragen und es gibt kein Schülerkonto, keine Datenbank und kein zentrales Feedback.

Wichtige Grenzen:

- Gemeinsame Geräte können dieselben lokalen Daten für andere Nutzerinnen und Nutzer sichtbar machen.
- Privatmodus, Browser-Einstellungen, Gerätewechsel oder das Löschen der Browserdaten können Fortschritt verlieren oder Speicherung verhindern.
- Eine neue Kursversion soll alte Daten nicht unkontrolliert überschreiben; unbekannte zukünftige Versionen werden nicht überschrieben.
- „Mission zurücksetzen“ löscht nur die lokalen Daten dieser Mission. Ein Zurücksetzen ist auch bei vorhandenem Restfortschritt möglich.

## Statische Routen und Kurszugang

Für direkte Aufrufe auf GitHub Pages sind vorgesehen:

- `/ki8/` – Kursübersicht
- `/ki8/stunde-1/` – Mission 01

Die Kursübersicht enthält einen QR-Code, einen kopierbaren Kurslink, sechs Modulübersichten und die lokale Fortschrittsanzeige. Bestehende 18 Stundenlinks sowie andere Fächer und Funktionen bleiben außerhalb dieser Mission unverändert. QR-Scan und echte GitHub-Pages-Auslieferung sind in diesem lokalen Arbeitsstand noch nicht als Deployment verifiziert.

## Wiederverwendbare Datenstruktur: aktueller Stand

Eine Lesson-Definition verwendet derzeit mindestens:

- `id`, `module`, `title`, `description`, `objectives`, `duration`
- flexible `phases` mit `id`, `title`, `minutes` und `blocks`
- `contentBlocks`, `tasks`, `solutions`, `feedback`, `media`
- `progress` mit lokaler Versionsinformation

Die Daten liegen aktuell in `pages/ki8/mission/lesson-data.mjs`; die Renderer- und Validierungsoberfläche ist **noch nicht als finale öffentliche API festgeschrieben**.

### Zweite Stunde ergänzen

Ein Entwickler sollte eine neue eindeutige Definition (zum Beispiel `ki-02`) im bestehenden Lesson-Registry-/Validierungspfad ergänzen, statt einen zweiten Sonder-Renderer zu bauen:

1. dieselben Pflichtfelder und die vorhandene Datenform verwenden;
2. eigene Phasen, Aufgaben, Lösungen, Medienquellen und Fortschritts-ID definieren;
3. die Registry um die Lesson ergänzen;
4. Tests für Definition, Antworten, Fortschritt und direkte Route ergänzen;
5. erst danach prüfen, ob die bestehenden Blocktypen den Inhalt tatsächlich rendern.

Ein automatischer Test rendert eine synthetische zweite Stunde mit anderer Phasenfolge und eigenen Medienmetadaten. Bewiesen sind die vorhandenen Blocktypen (Medienlink, offene Antwort, Lückentext, Obst-Labor, Quiz); für neue Blocktypen oder komplexere Interaktionen müssen Renderer und Tests gezielt erweitert werden. Keine neue Stunde als fertig ausgeben, bevor ihre Inhalte und Bedienung geprüft sind.

## Lokale Prüfung

Keine dieser Prüfungen baut oder veröffentlicht die Anwendung:

```bash
node scripts/verify-ki-wp8-public.mjs
node scripts/verify-ki-mission-lesson-data.mjs
node scripts/verify-ki-mission-progress.mjs
node scripts/verify-ki-mission-fruit-lab.mjs
node scripts/verify-ki-mission-course.mjs
node scripts/verify-ki-mission-ui.mjs
```

Die Prüfungen decken Daten, Gap-Fill-Regeln, Quiz, lokalen Speicher, Obst-Labor, Kurslink/QR-Integration und UI-Flows ab. Verbleibende Lücken: keine verlässliche Prüfung auf allen realen Desktop-, iPad- und Smartphone-Geräten, keine vollständige Screenreader-/Tastaturprüfung mit physischen Geräten und keine verifizierte GitHub-Pages-Auslieferung oder QR-Kamera-Prüfung. Diese Punkte dürfen nicht als erledigt behauptet werden.

## Arbeitsgrenzen

Der aktuelle Auftrag umfasst lokale Implementierung, Dokumentation und reviewbare Feature-Branch-Commits. **Kein Build** nach Projektregel und kein Push, keine Veröffentlichung und kein Deployment ohne ausdrückliche Freigabe. Bestehende öffentliche Stunden und andere Fächer bleiben erhalten.

Lokale Vorschau aus dem Worktree: `python3 -m http.server 8108 --bind 127.0.0.1 --directory pages`, dann `http://127.0.0.1:8108/ki8/stunde-1/` öffnen. Mit `Ctrl-C` beenden. Der Loopback-Server ist nur eine Vorschau, kein geschützter Dienst.
