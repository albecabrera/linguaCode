// Original fictional decision-tree examples; no copied source figures, wording, solutions or student data.
export const lessons = [
  {
    id: 'stunde-1', minutes: 45, title: 'Vom Merkmal zur ersten Regel',
    activities: [
      {
        id: 'baum-1', prompt: 'Ein fiktiver Lieferroboter nutzt die Akkuladung als Merkmal: bis einschließlich 30 % bedeutet „Ladepause“, darüber „weiterfahren“. Was ist hier das Merkmal?',
        options: ['Die Akkuladung in Prozent.', 'Das Label „Ladepause“.', 'Der Name des Roboters.'], correct: 0,
        explanation: 'Die Akkuladung ist die beobachtete Eigenschaft, also das Merkmal. „Ladepause“ und „weiterfahren“ sind die Labels.'
      },
      {
        id: 'baum-2', prompt: 'Welche Regel mit einem Schwellenwert passt zu einem fiktiven Baum, der Lernkarten mit einer Punktzahl ab 7 als „bereit“ einordnet?',
        options: ['Wenn Punktzahl ≥ 7, dann „bereit“, sonst „üben“.', 'Wenn Label „bereit“, dann ist die Punktzahl immer 7.', 'Jede Karte wird zufällig einem Label zugeordnet.'], correct: 0,
        explanation: 'Ein Entscheidungsbaum stellt eine Wenn-dann-Regel mit einem Schwellenwert dar. Die Regel beschreibt den Weg von Merkmal zu Label.'
      },
    ],
  },
  {
    id: 'stunde-2', minutes: 45, title: 'Trainingsdaten und Aufteilungen',
    activities: [
      {
        id: 'baum-3', prompt: 'Eine fiktive Sortierkiste hat sechs bereits gelabelte Trainingsbeispiele. Wozu dienen Trainingsdaten beim Trainieren eines Entscheidungsbaums?',
        options: ['Sie helfen, passende Fragen und Schwellenwerte für Regeln zu finden.', 'Sie beweisen, dass der Baum bei jedem neuen Beispiel richtig liegt.', 'Sie ersetzen alle späteren Testdaten.'], correct: 0,
        explanation: 'Trainingsdaten geben Beispiele, aus denen Regeln abgeleitet werden. Sie garantieren keine fehlerfreie Vorhersage bei unbekannten Fällen.'
      },
      {
        id: 'baum-4', prompt: 'Warum bleiben einige gelabelte Beispiele als Testdaten für den Test eines fiktiven Baums zurück?',
        options: ['Damit die Regel an bisher ungesehenen Fällen überprüft wird.', 'Damit der Baum die Testlabels beim Training auswendig lernen kann.', 'Damit nur besonders einfache Beispiele gezählt werden.'], correct: 0,
        explanation: 'Getrennte Testdaten zeigen, wie die gelernte Regel bei neuen Fällen funktioniert. Sie dürfen nicht zum Aussuchen der Regel verwendet werden.'
      },
    ],
  },
  {
    id: 'stunde-3', minutes: 45, title: 'Regeln an Testbeispielen prüfen',
    activities: [
      {
        id: 'baum-5', prompt: 'Ein fiktiver Baum fragt zuerst „Temperatur ≥ 18?“ und sagt bei Ja „Fenster offen“, sonst „Fenster zu“. Welches Label sagt er für 21 °C voraus?',
        options: ['Fenster offen.', 'Fenster zu.', 'Kein Label, weil 21 kein Trainingswert ist.'], correct: 0,
        explanation: '21 ist mindestens 18. Der Entscheidungsweg endet deshalb beim Label „Fenster offen“.'
      },
      {
        id: 'baum-6', prompt: 'Der Baum sagt für ein Testbeispiel „Fenster offen“, das bekannte Testlabel lautet aber „Fenster zu“. Welche Fehlklassifikation ist passiert?',
        options: ['Eine Fehlklassifikation: Vorhersage und Testlabel unterscheiden sich.', 'Ein perfektes Ergebnis, weil Testdaten nie Labels haben.', 'Ein neues Merkmal wurde automatisch erfunden.'], correct: 0,
        explanation: 'Die Vorhersage stimmt nicht mit dem bekannten Label überein. Das ist eine Fehlklassifikation und ein Hinweis auf eine Grenze der Regel.'
      },
    ],
  },
  {
    id: 'stunde-4', minutes: 45, title: 'Verbessern, ohne den Test zu verraten',
    activities: [
      {
        id: 'baum-7', prompt: 'Ein fiktiver Baum macht bei einem Testbeispiel einen Fehler. Was ist ein sinnvoller nächster Schritt?',
        options: ['Trainingsdaten, Merkmal und Schwellenwert untersuchen und die Änderung mit neuen Testfällen prüfen.', 'Das Testlabel ändern, damit die Vorhersage stimmt.', 'Den Fehler löschen und nur passende Beispiele berichten.'], correct: 0,
        explanation: 'Eine Regel darf anhand der Trainingsdaten überarbeitet werden. Das echte Testlabel bleibt unverändert, damit die Überprüfung ehrlich bleibt.'
      },
      {
        id: 'baum-8', prompt: 'Welche Aussage fasst den Ablauf gut zusammen?',
        options: ['Merkmale und Labels geben Beispiele; Trainingsdaten helfen beim Regelentwurf; Testdaten prüfen den fertigen Baum.', 'Testdaten werden zuerst zum Aussuchen jeder Regel genutzt und danach umbenannt.', 'Ein Entscheidungsbaum ist immer richtig, sobald er eine Schwellenwertfrage enthält.'], correct: 0,
        explanation: 'Die Trennung von Training und Test macht sichtbar, ob Regeln auch bei neuen Fällen funktionieren. Ein Baum kann trotz klarer Regeln Fehler machen.'
      },
    ],
  },
];

export function gradeChoice(id, choice) {
  const activity = lessons.flatMap(({activities}) => activities).find((item) => item.id === id);
  if (!activity || !Number.isInteger(choice) || choice < 0 || choice >= activity.options.length) {
    throw new RangeError('Unbekannte Aufgabe oder Antwort.');
  }
  return {correct: choice === activity.correct, explanation: activity.explanation};
}
