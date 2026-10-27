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

### Mission 02: Regeln, Training und Grenzen

Die nächste Stunde ist lokal unter `/ki8/stunde-2/` verfügbar und wird aus derselben Lesson-Registry gerendert. Ihr Thema ist der Vergleich fester Regeln mit gelernten Mustern und die Rolle neuer Testdaten.

- [Experience AI: Maschinelles Lernen, Modul 1 Lektion 2](https://experience-ai.org/de/units/understanding-ai-11-14/lessons/13) – Quelle für 11- bis 14-Jährige, mit genauem Schwerpunkt auf regelbasierten und datenbasierten Verfahren.
- [Klickpunkt Schule: Maschinelles Lernen](https://klickpunktschule.bycs.de/digitalkompass/startseite/ki-kompass/ki-kompass-5-8-uebersicht/ki-kompass-5-8-begleitmaterial/modul-1-wie-funktionieren-ki-systeme-begleitmaterial/maschinelles-lernen-begleitmaterial) – Materialseite für Klassen 5–8 mit Weblektion und Materialpaket; die Seite nennt CC BY-SA 4.0.

Beide Quellen werden nur verlinkt. Arbeitsblätter werden nicht kopiert oder eingebettet. Ein spezifisches, passendes Video für diese Stunde wurde nicht bestätigt und ist deshalb nicht zugewiesen. Die HubbS-Ressource zu Trainingsdaten ist für eine berufliche KI-Zusatzqualifikation beschrieben; eine Eignung für WP 8 ist nicht belegt.

### Mission 03: Merkmale, Labels und Schwellenwerte

Die ergänzende Stunde ist lokal unter `/ki8/stunde-3/` verfügbar und über den CTA in Modul 2, Stunde 1 erreichbar. Die bisherigen Module-2-Inhalte, Aufgaben, der Abschnitt `#stunde-1` und die 18 Kursstundenanker bleiben erhalten.

- [inf-schule: „Entscheide wie eine KI“](https://inf-schule.de/kids/computerinalltag/entscheide-wie-eine-KI) – optionale Lernstrecke mit Beispielen zu überwachtem Lernen, Schwellenwerten und Entscheidungsbäumen. Die geprüfte Seite empfiehlt als Voraussetzung die Lernstrecke „Lernende Systeme“.

Die Quelle wird nur verlinkt. Auf der geprüften Seite sind Zieljahrgang und Lizenz nicht angegeben; die Eignung für WP 8 und eine Nachnutzungslizenz sind daher nicht verifiziert. Kein spezifisches, passendes Video für diese Stunde wurde bestätigt; keines ist zugewiesen. Externe Aufgaben, Texte und Medien werden nicht kopiert oder eingebettet.

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

Der Fortschritt wird ausschließlich lokal im Browser gespeichert. Die Speicherung ist namespaced und versioniert. Die Schlüssel lauten `linguacode:ki-wp8:mission-01:v1:ki-01`, `linguacode:ki-wp8:mission-01:v1:ki-02` und `linguacode:ki-wp8:mission-01:v1:ki-03`; die Missionen überschreiben einander nicht. Antworten, Phasen, Obst-Labor und Quizstatus werden nicht übertragen und es gibt kein Schülerkonto, keine Datenbank und kein zentrales Feedback.

Wichtige Grenzen:

- Gemeinsame Geräte können dieselben lokalen Daten für andere Nutzerinnen und Nutzer sichtbar machen.
- Privatmodus, Browser-Einstellungen, Gerätewechsel oder das Löschen der Browserdaten können Fortschritt verlieren oder Speicherung verhindern.
- Eine neue Kursversion soll alte Daten nicht unkontrolliert überschreiben; unbekannte zukünftige Versionen werden nicht überschrieben.
- „Mission zurücksetzen“ löscht nur die lokalen Daten dieser Mission. Ein Zurücksetzen ist auch bei vorhandenem Restfortschritt möglich.

## Statische Routen und Kurszugang

Für direkte Aufrufe auf GitHub Pages sind vorgesehen:

- `/ki8/` – Kursübersicht mit klickbarem Kurs-QR zur Übersicht und einem separaten klickbaren Mission-03-QR
- `/ki8/stunde-1/` – Mission 01
- `/ki8/stunde-2/` – Mission 02
- `/ki8/stunde-3/` – Mission 03

Der CTA für Mission 02 steht innerhalb von Modul 1, Stunde 2; der bisherige Abschnitt samt Aufgaben bleibt erhalten. Der Kurs-QR auf `/ki8/` führt weiterhin zur Kursübersicht; der zusätzliche klickbare QR und Link für Mission 03 führen direkt zu `/ki8/stunde-3/`. Die Kursübersicht enthält weiterhin einen QR-Code zum Kurs, einen kopierbaren Kurslink, sechs Modulübersichten und die lokale Fortschrittsanzeige. Die bestehenden 18 Stundenlinks sowie andere Fächer bleiben erhalten. QR-Scan und echte GitHub-Pages-Auslieferung sind nicht als Deployment verifiziert.

## Wiederverwendbare Datenstruktur: aktueller Stand

Eine Lesson-Definition verwendet derzeit mindestens:

- `id`, `module`, `title`, `description`, `objectives`, `duration`
- flexible `phases` mit `id`, `title`, `minutes` und `blocks`
- `contentBlocks`, `tasks`, `solutions`, `feedback`, `media`
- `progress` mit lokaler Versionsinformation

Die Daten liegen aktuell in `pages/ki8/mission/lesson-data.mjs`; die Renderer- und Validierungsoberfläche ist **noch nicht als finale öffentliche API festgeschrieben**.

### Bestehende Wiederverwendung und nächste Stunde

Die Registry enthält `ki-01`, `ki-02` und `ki-03`. Eine Lesson-ID wird durch statische Pfadzuordnung mit einer eigenen Browser-Speicherschlüsselung verbunden; alle drei behalten getrennten Fortschritt. Mission 02 nutzt bestehende Blocktypen (Medienlink, offene Antwort und Quiz), keine Sonderkopie des Renderers. Mission 03 ergänzt Modul 2 Stunde 1 mit Merkmalen, Labels und der bestehenden Schwellenwertregel; der CTA lässt die bisherige Stunde und ihre Interaktionen bestehen.

Für weitere Stunden:

1. eine eindeutige Lesson-ID und eigene Daten/Phasen definieren;
2. ausschließlich tatsächlich unterstützte Blocktypen nutzen oder den Renderer samt Tests erweitern;
3. einen expliziten statischen Routen-Eintrag und eigenen Fortschrittsschlüssel hinzufügen;
4. Kursübersicht und Materialstatus aktualisieren;
5. Tests für Definition, Antworten, isolierten Fortschritt und direkte Route ergänzen.

Ein automatischer Test rendert weiterhin eine synthetische zweite Stunde mit anderer Phasenfolge und eigenen Medienmetadaten. Mission 02 ist jetzt eine echte Registry-Definition; die übrigen Kursstunden bleiben über ihre bisherigen Modul-Anker erreichbar und werden nicht als neue Missionen ausgegeben, bevor sie implementiert und geprüft sind.

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
