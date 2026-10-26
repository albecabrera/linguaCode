// Original fictional pattern examples for the local course prototype; no source figures, wording or pupil data.
export const lessons = [
  {
    id: 'stunde-1', minutes: 45, title: 'Muster in Beispielen entdecken',
    activities: [
      {
        id: 'muster-1',
        prompt: 'Eine fiktive Sortiermaschine sieht die Werte 2, 4, 6 und 8 und ordnet sie als „gerade“ ein. Was ist das gemeinsame Muster?',
        options: ['Alle Werte lassen sich ohne Rest durch 2 teilen.', 'Alle Werte sind größer als 10.', 'Die Werte wurden von einer echten Person eingegeben.'], correct: 0,
        explanation: 'Das gemeinsame Muster ist die Teilbarkeit durch 2. Ein Muster beschreibt eine wiederkehrende Eigenschaft mehrerer Beispiele.'
      },
      {
        id: 'muster-2',
        prompt: 'Eine fiktive KI vergleicht vier erfundene Geräusche. Drei haben die Merkmale „kurz“ und „hell“, eines ist „lang“ und „tief“. Welche Ähnlichkeit hilft beim Erkennen der Gruppe?',
        options: ['Die ähnlichen Merkmale der drei Beispiele vergleichen.', 'Nur den Namen der Geräuschdatei ansehen.', 'Das einzelne abweichende Beispiel einfach umbenennen.'], correct: 0,
        explanation: 'Ähnlichkeit entsteht durch gemeinsame Merkmale. Namen oder nachträgliches Umbenennen erklären kein beobachtetes Muster.'
      },
    ],
  },
  {
    id: 'stunde-2', minutes: 45, title: 'Muster prüfen und Ausreißer erkennen',
    activities: [
      {
        id: 'muster-3',
        prompt: 'Eine fiktive Lernkarten-KI erkennt das Muster „blauer Rand und drei Symbole“. Eine Karte hat einen blauen Rand, aber fünf Symbole. Ist das ein möglicher Ausreißer, und wie sollte sie mit dem Fall umgehen?',
        options: ['Sie prüft, ob die Karte ein Ausreißer oder ein neues Muster ist, statt sie blind einzuordnen.', 'Sie verändert alle anderen Beispiele, bis fünf Symbole passen.', 'Sie behauptet sicher, dass jedes Merkmal unwichtig ist.'], correct: 0,
        explanation: 'Ein abweichender Fall kann ein Ausreißer sein oder auf eine weitere Gruppe hinweisen. Er sollte untersucht und nicht einfach versteckt werden.'
      },
      {
        id: 'muster-4',
        prompt: 'Welche Aussage beschreibt eine faire Prüfung eines fiktiven Musters am besten?',
        options: ['Das Muster an neuen, erfundenen Beispielen prüfen und auch abweichende Fälle dokumentieren.', 'Nur die Beispiele zeigen, die zum Muster passen, und die anderen löschen.', 'Ein Muster gilt als sicher, sobald ein einziges Beispiel dazu passt.'], correct: 0,
        explanation: 'Neue Beispiele und dokumentierte Abweichungen zeigen, wie tragfähig ein Muster ist. Weglassen oder Verallgemeinern ohne Prüfung täuscht Sicherheit vor.'
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
