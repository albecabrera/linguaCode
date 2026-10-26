// Original fictional examples for the local course prototype; no source figures, wording or solutions.
export const lessons = [
  {
    id: 'stunde-1', minutes: 45, title: 'Merkmale, Labels und Schwellenwerte',
    activities: [
      {
        id: 'daten-1',
        prompt: 'Eine fiktive Klangkiste nutzt die Lautstärke eines Klatschens als Merkmal. Das Label „leise“ steht für Werte bis einschließlich 6, „laut“ für Werte über 6. Welche Aussage passt?',
        options: ['Das Merkmal ist die Lautstärke; „leise“ und „laut“ sind Labels.', 'Das Label ist der Name der Klangkiste; das Merkmal ist immer „laut“.', 'Ein Label ist eine Garantie, dass jede Einordnung stimmt.'],
        correct: 0,
        explanation: 'Das Merkmal ist der beobachtete Wert. Ein Label ist die zugeordnete Kategorie; die Regel kann trotzdem bei neuen Beispielen falsch liegen.',
      },
      {
        id: 'daten-2',
        prompt: 'Mit dem Schwellenwert 6 gilt: Wert ≤ 6 → „leise“, Wert > 6 → „laut“. Welches Label erhält das neue Testbeispiel mit Wert 7?',
        options: ['leise', 'laut', 'Das hängt davon ab, welches Trainingsbeispiel zuletzt kam.'],
        correct: 1,
        explanation: '7 ist größer als 6 und liegt deshalb nach dieser fiktiven Regel bei „laut“. Der Schwellenwert trennt die beiden Labels.',
      },
    ],
  },
  {
    id: 'stunde-2', minutes: 45, title: 'Trainieren, testen und Fehler untersuchen',
    activities: [
      {
        id: 'daten-3',
        prompt: 'Warum werden bei der Klangkiste Trainingsbeispiele und getrennte Testdaten verwendet?',
        options: ['Trainingsbeispiele helfen beim Festlegen der Regel; Testdaten zeigen, wie sie bei neuen Fällen funktioniert.', 'Testdaten werden immer zum nachträglichen Aussuchen des günstigsten Schwellenwerts benutzt.', 'Beide Mengen müssen identisch sein, damit keine Überraschung entsteht.'],
        correct: 0,
        explanation: 'Getrennte Testdaten liefern eine ehrlichere Probe für unbekannte Fälle. Wenn man sie zum Aussuchen der Regel benutzt, ist der Test nicht mehr unabhängig.',
      },
      {
        id: 'daten-4',
        prompt: 'Die Regel „Wert ≤ 6 → leise“ ordnet ein Testklatschen mit dem echten Label „leise“ und Wert 8 als „laut“ ein. Welche Fehlklassifikation ist passiert?',
        options: ['Eine Fehlklassifikation: Die Vorhersage passt nicht zum echten Label.', 'Die Regel hat automatisch richtig trainiert, weil der Wert neu war.', 'Es ist keine Fehlklassifikation, weil Testdaten kein Label haben dürfen.'],
        correct: 0,
        explanation: 'Das Modell sagt „laut“, das bekannte Test-Label lautet aber „leise“. Diese Abweichung ist eine Fehlklassifikation und zeigt eine Grenze der Regel.',
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
