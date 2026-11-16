# Mission 05 – Entscheidungsbäume im Affen-Labor

> **Status: lokale Implementierung.** Die Mission nutzt die bestehende Route `/ki8/stunde-5/` und den lokalen, versionierten Fortschrittsschlüssel `ki-05`.

## Lernziel und Ablauf

Die Schülerinnen und Schüler bauen einen einfachen Entscheidungsbaum aus Ja/Nein-Fragen zu zwei sichtbaren Merkmalen: „Lächelt der Mund?“ und „X-Augen?“. Sie sehen sechs fiktive Trainingsbeispiele, wählen die Fragen ihres Baums, verfolgen Testpfade und geben fünf getrennte Testvorhersagen ab.

| Schritt | Zeit | Inhalt |
|---|---:|---|
| Vom Merkmal zur Verzweigung | 10 Min. | Sichtbare, fiktive Trainingskarten vergleichen |
| Deinen Baum trainieren | 12 Min. | Wurzelfrage und zweite Frage wählen; tatsächlichen Baum anzeigen |
| Ungesehene Fälle testen | 17 Min. | Pfad verfolgen, Vorhersagen abgeben, Accuracy berechnen |
| Verstehen und übertragen | 6 Min. | Abschlusscheck zu Training, Test, Accuracy und widersprüchlichen Labels |

Die Genauigkeit wird aus der **ersten vollständigen Abgabe** berechnet. Nachträgliche Korrekturen verändern diesen Wert nicht. Leere Eingaben werden abgewiesen und verändern weder Daten noch Fortschritt.

## Datenherkunft und Grenzen

Die Beispiele sind ausdrücklich **vereinfacht erfunden und von der supplied PDF-Arbeitsblattidee inspiriert**. Die PDF-Figuren, exakten Zeichnungen und Daten werden nicht kopiert. „Beißt“ und „Beißt nicht“ sind hier künstliche Labels und keine Aussage über echtes Tierverhalten. Ein Testfall trägt absichtlich dieselben sichtbaren Merkmale wie ein anderer, aber ein widersprüchliches Label. Das zeigt: Mit den vorhandenen Merkmalen ist eine perfekte Trennung nicht möglich; zusätzliche Merkmale wären nötig und die Testgenauigkeit muss offengelegt werden.

## Technische Integration

- Kanonische Route: `/ki8/stunde-5/`
- Isoliertes Modul: `pages/ki8/stunde-5/mission05.mjs`
- Missionsspezifische Styles: `pages/ki8/stunde-5/mission05.css`
- Gemeinsame lokale Speicherung und Theme-Controller werden wiederverwendet; der gemeinsame Missionsrenderer bleibt unverändert.
- Keine Remote-Abhängigkeiten, keine eingebettete PDF und keine Übertragung persönlicher Antworten.
