// Independently authored classroom examples; no third-party media or student data.
export const lessons = [
  {
    id: 'stunde-1', minutes: 45, title: 'KI im Alltag erkennen',
    activities: [
      {
        id: 'alltag-1', prompt: 'Eine App wurde mit vielen Gegenstandsbildern trainiert und ordnet ein neues Foto einer Kategorie zu. Was trifft zu?',
        options: ['Das ist ein trainiertes Modell.', 'Das ist nur ein fester Wecker.', 'Ein Computer erkennt Gegenstände immer fehlerfrei.'],
        correct: 0,
        explanation: 'Das Modell nutzt Muster aus Trainingsbeispielen. Auch bei neuen Fotos kann es sich irren.',
      },
      {
        id: 'alltag-2', prompt: 'Ein Wecker klingelt täglich um 7 Uhr nach einer festgelegten Einstellung. Ist das schon maschinelles Lernen?',
        options: ['Ja, weil ein Gerät automatisch etwas tut.', 'Nein, er folgt hier einer festen Regel.', 'Ja, weil eine Uhr Daten anzeigt.'],
        correct: 1,
        explanation: 'Automatisierung allein ist keine KI: Dieser Wecker befolgt eine vorgegebene Regel und lernt nicht aus Beispielen.',
      },
    ],
  },
  {
    id: 'stunde-2', minutes: 45, title: 'Regeln, Training und Grenzen',
    activities: [
      {
        id: 'vergleich-1', prompt: 'Welches Programm passt zu einer ausdrücklich festgelegten Wenn-dann-Regel?',
        options: ['Ein mit vielen Bildern trainiertes Erkennungsmodell.', 'Ein Lüfter, der ab 26 °C eingeschaltet wird.', 'Ein Modell, das neue Tierfotos anhand gelernter Muster einordnet.'],
        correct: 1,
        explanation: 'Die Schwelle 26 °C steht direkt im Programm. Ein trainiertes Modell bildet seine Muster aus Beispielen.',
      },
      {
        id: 'vergleich-2', prompt: 'Warum prüfst du ein trainiertes Bildermodell mit neuen, getrennten Testbildern?',
        options: ['Damit es dieselben Trainingsbilder nur auswendig wiederholt.', 'Damit alle Ergebnisse automatisch richtig werden.', 'Damit du erkennst, ob das Modell auch bei unbekannten Bildern funktioniert.'],
        correct: 2,
        explanation: 'Unbekannte Testdaten zeigen Grenzen und mögliche Fehler. Die Testbilder dürfen nicht heimlich zum Trainieren benutzt werden.',
      },
    ],
  },
];

export function gradeChoice(id, choice) {
  const activity = lessons.flatMap((lesson) => lesson.activities).find((item) => item.id === id);
  if (!activity || !Number.isInteger(choice) || choice < 0 || choice >= activity.options.length) {
    throw new RangeError('Unbekannte Aufgabe oder Antwort.');
  }
  return {correct: choice === activity.correct, explanation: activity.explanation};
}
