// Original fictional chatbot examples; no copied source, private data or external services.
export const lessons = [
  {
    id: 'stunde-1', minutes: 45, title: 'Was soll ein Chatbot erkennen?',
    activities: [
      {
        id: 'chat-1', prompt: 'Ein fiktiver Schulhof-Bot reagiert auf „Pausenplan?“ mit einer gespeicherten Antwort. Was ist das hier?',
        options: ['Eine einfache Intent-Regel: Ein erkanntes Stichwort führt zu einer festen Antwort.', 'Ein selbstlernendes Modell, das ohne Beispiele automatisch alles versteht.', 'Eine persönliche Schülerakte, die der Bot dauerhaft speichert.'], correct: 0,
        explanation: 'Eine Intent-Regel verbindet ein Signal, zum Beispiel „Pausenplan“, mit einer vorher festgelegten Antwort. Sie lernt nicht selbstständig.'
      },
      {
        id: 'chat-2', prompt: 'Welche Aussage unterscheidet eine einfache Regel von gelernter KI am besten?',
        options: ['Die Regel folgt von Menschen festgelegten Bedingungen; ein Lernverfahren leitet Muster aus Beispielen ab.', 'Eine Regel ist immer klüger als ein gelerntes Modell.', 'Gelernte KI braucht keine Daten und kann jede Absicht sicher erkennen.'], correct: 0,
        explanation: 'Bei einer einfachen Regel werden Bedingungen direkt festgelegt. Ein gelerntes Modell nutzt Beispiele, kann aber trotzdem irren.'
      },
    ],
  },
  {
    id: 'stunde-2', minutes: 45, title: 'Beispiele zum Lernen und fair prüfen',
    activities: [
      {
        id: 'chat-3', prompt: 'Ein fiktiver Lernbot bekommt viele erfundene Nachrichten mit den Intents „Begrüßung“ und „Hilfe“. Wozu dienen solche gelabelten Beispiele?',
        options: ['Sie können einem Lernverfahren zeigen, welche Sprachmuster zu welchem Intent gehören.', 'Sie garantieren, dass jede spätere Nachricht richtig verstanden wird.', 'Sie ersetzen eine Prüfung mit neuen, bisher ungesehenen Nachrichten.'], correct: 0,
        explanation: 'Gelabelte Beispiele unterstützen das Lernen von Mustern. Sie sind keine Garantie und dürfen nicht mit einer unabhängigen Prüfung verwechselt werden.'
      },
      {
        id: 'chat-4', prompt: 'Warum sollte ein Chatbot auch mit neuen, erfundenen Testnachrichten geprüft werden?',
        options: ['Damit sichtbar wird, ob er Intents auch bei bisher ungesehenen Formulierungen erkennt.', 'Damit man falsche Antworten heimlich in die Trainingsbeispiele umwandelt.', 'Damit jede unbekannte Nachricht automatisch persönliche Daten liefert.'], correct: 0,
        explanation: 'Neue Testnachrichten zeigen, wie robust die Zuordnung ist. Private Daten sind dafür weder nötig noch erlaubt.'
      },
    ],
  },
  {
    id: 'stunde-3', minutes: 45, title: 'Unbekannte Eingaben und sichere Fallbacks',
    activities: [
      {
        id: 'chat-5', prompt: 'Eine unbekannte Nachricht passt zu keinem bekannten Intent. Welche Reaktion ist ein guter Fallback?',
        options: ['„Das habe ich noch nicht verstanden. Bitte formuliere es anders.“ – ohne eine Antwort zu erfinden.', 'Eine selbstbewusste, zufällige Antwort als sicher ausgeben.', 'Die Nachricht mit Namen und Klasse dauerhaft speichern.'], correct: 0,
        explanation: 'Ein Fallback macht Unsicherheit sichtbar und bittet um eine andere Formulierung. Er erfindet nichts und speichert keine privaten Angaben.'
      },
      {
        id: 'chat-6', prompt: 'Was sollte ein Team beim Entwurf eines fiktiven Chatbots prüfen, wenn eine Antwort falsch war?',
        options: ['Intent-Regel oder Trainingsbeispiele untersuchen, die Antwort verbessern und mit neuen Beispielen testen.', 'Die falsche Antwort behalten und den Testfall löschen.', 'Unbekannte Eingaben immer dem nächstbesten Intent zuordnen.'], correct: 0,
        explanation: 'Fehler sind Prüfhinweise. Das Team kann Regeln oder Beispiele überarbeiten und anschließend erneut mit unabhängigen, erfundenen Fällen testen.'
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
