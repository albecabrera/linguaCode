# Mission 06 – Trainingsdaten und Aufteilungen

> **Status: lokale Implementierung.** Die Mission wird aus Modul 3, Stunde 2 abgeleitet. Die bestehenden Moduldateien und Aktivitäten bleiben erhalten. Veröffentlichung erfolgt nach Prüfung und Commit über den no-build-GitHub-Pages-Workflow.

## Ziel und Ablauf

Die 45-minütige Mission führt durch:

| Phase | Zeit | Inhalt |
|---|---:|---|
| Trainingsdaten verstehen | 10 Min. | Externe Lernseite zu gelabelten Beispielen und Entscheidungsbäumen |
| Testdaten getrennt halten | 10 Min. | Externe Lektion zu Entscheidungsbäumen und Trainingseinfluss |
| Training und Test aufteilen | 19 Min. | Selbst-Checks zu Trainingsdaten und unabhängigen Testbeispielen |
| Abschlussquiz | 6 Min. | Fünf Fragen zu Trainings- und Testdaten |

Kernregel: Gelabelte Trainingsbeispiele helfen, Fragen und Schwellenwerte zu finden. Einige getrennte Beispiele bleiben ungesehen, bis der fertige Baum geprüft wird. Testbeispiele dürfen weder zum Training noch zur Regelwahl verwendet werden; sonst wäre die Prüfung nicht mehr unabhängig.

## Externe Quellen und Grenzen

- [inf-schule: Überwachtes Lernen mit Entscheidungsbäumen](https://inf-schule.de/ki/menueansicht/basiswissen_ki/lernarten/entscheidungsBaeume) erläutert Trainingsbeispiele, Schwellenwerte, Testobjekte und mögliche Fehler bei ungeeigneten Daten.
- [Experience AI: Lektion 4 – Entscheidungsbäume](https://experience-ai.org/de/units/foundations-of-ai-11-14/lessons/4) behandelt Entscheidungsbäume und zeigt, wie Trainingsdaten ein Modell beeinflussen; die Reihe ist für 11–14 Jahre ausgewiesen.
- [KIT: Jetzt geht's los mit dem Maschinellen Lernen!](https://publikationen.bibliothek.kit.edu/1000139088) ist ein deutschsprachiges Video von 6:28 Minuten. Der gezielte Ausschnitt **3:15–4:29** behandelt Datensplits, Trainingsdaten ab 3:32 und Testdaten ab 4:17. Der KIT-Eintrag nennt die Lizenz **CC BY-SA 4.0**, aber keine Zielgruppe. Spätere Teile zu Validierungsdaten und Fehlermetriken können für diese Stunde ausgelassen werden.
- [Universität des Saarlandes: Lebensmittel-KI – Unterrichtsstunde für Klasse 8](https://informatikdidaktik.cs.uni-saarland.de/lebensmittel-ki/) beschreibt einen Klassifikator, der mit Trainingskarten erstellt und mit getrennten Testkarten geprüft wird. Der Entwurf verweist auf [ProDaBi-Lebensmittelkarten](https://www.prodabi.de/wp-content/uploads/Druckvorlage.pdf); das zugrunde liegende Material wurde für Klasse 6 entwickelt und der Saarland-Entwurf überträgt es auf Klasse 8.

Die Quellen bleiben externe Links; es werden keine Texte, Abbildungen, Videos oder Arbeitsblätter kopiert oder eingebettet. Für den KIT-Clip ist CC BY-SA 4.0 angegeben. Für den Saarland-Unterrichtsentwurf, die ProDaBi-Karten und die übrigen verlinkten Lernseiten ist keine Lizenz angegeben. Die Saarland-Seite weist den Entwurf Klasse 8 zu; die Altersangabe der weiteren Quellen ist oben genannt, soweit verfügbar.

## Fortschritt und Route

- Route: `/ki8/stunde-6/`
- Lesson-ID und isolierter Fortschrittsschlüssel: `ki-06`
- Speicherung bleibt lokal und versioniert; keine Anmeldung, Schülerdatenbank, Fortschrittsübertragung oder persönlichen Eingabedaten.
- Der öffentliche Direktlink und QR-Code führen auf die kanonische GitHub-Pages-Route. Der vorhandene Modul-3-Unterricht bleibt daneben erhalten.
