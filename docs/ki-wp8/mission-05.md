# Mission 05 – Entscheidungsbäume erstellen

> **Status: lokale Implementierung.** Die Mission nutzt die bestehende Route `/ki8/stunde-5/` und den lokalen Kursfortschritt.

## Lernziel und Ablauf

Die Schülerinnen und Schüler bearbeiten zuerst das bereitgestellte Arbeitsblatt „Entscheidungsbäume erstellen“. Danach erstellen sie mit diagrams.net einen eigenen Entscheidungsbaum zum Schulweg.

| Schritt | Zeit | Inhalt |
|---|---:|---|
| Arbeitsblatt bearbeiten | 25 Min. | Aufgabe 1: drei Verständnisfragen; Aufgabe 2: Planung zum Thema „Welches Verkehrsmittel nehme ich zur Schule?“ |
| Praktische Aufgabe | 20 Min. | In diagrams.net einen Baum mit mindestens 3 Fragen und 4 möglichen Ergebnissen erstellen |

Die Partnerkontrolle ist optional. Die Mission markiert die Arbeit nicht automatisch als abgeschlossen.

## Arbeitsblatt

Das vom Auftraggeber bereitgestellte PNG liegt unter `pages/ki8/stunde-5/arbeitsblatt-entscheidungsbaeume.png`. Es wird im Unterricht als responsive, druckbare und herunterladbare Abbildung angezeigt; eine Texttranskription unterstützt die Zugänglichkeit.

## Praktische Aufgabe

Der externe Link [diagrams.net](https://app.diagrams.net) öffnet sich sicher in einem neuen Tab. Die Schülerinnen und Schüler erstellen dort einen Entscheidungsbaum zum Schulweg mit mindestens drei Fragen und vier möglichen Ergebnissen.

## Technische Integration

- Kanonische Route: `/ki8/stunde-5/`
- Isoliertes Modul: `pages/ki8/stunde-5/mission05.mjs`
- Missionsspezifische Styles: `pages/ki8/stunde-5/mission05.css`
- Lokales Arbeitsblatt: `pages/ki8/stunde-5/arbeitsblatt-entscheidungsbaeume.png`
- Service Worker: Bild und Missionsressourcen werden offline gecacht; diagrams.net bleibt ein externes Online-Werkzeug.
- Keine zusätzlichen Remote-Abhängigkeiten für die lokale Mission: Das Arbeitsblatt und die Missionslogik liegen lokal vor. `diagrams.net` ist die ausdrücklich verlinkte externe Online-Anwendung für die praktische Aufgabe; sie wird nicht eingebettet und benötigt Netzwerkzugriff.
