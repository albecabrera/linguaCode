// Deliberately invented records. No real student identifiers or answers belong in this demo.
export const learners = [
  {code: 'DEMO-001', completed: 3, total: 6, current: 'Entscheidungsbäume', answer: 'Ich teste den Grenzwert mit einem neuen Beispiel.', feedback: ''},
  {code: 'DEMO-002', completed: 2, total: 6, current: 'Daten und Merkmale', answer: 'Training und Test sollten unterschiedliche Beispiele nutzen.', feedback: 'Bitte überprüfe deine Testdaten.'},
  {code: 'DEMO-003', completed: 2, total: 6, current: 'Daten und Merkmale', answer: 'Ein Merkmal beschreibt eine Eigenschaft.', feedback: ''},
];

export function summary(records) {
  const completed = records.reduce((sum, item) => sum + item.completed, 0);
  const possible = records.reduce((sum, item) => sum + item.total, 0);
  return {
    completed,
    possible,
    open: possible - completed,
    feedback: records.filter((item) => item.feedback !== '').length,
  };
}

export function addFeedback(record, input) {
  const feedback = input.trim();
  if (!feedback || feedback.length > 500) throw new RangeError('Rückmeldung muss 1 bis 500 Zeichen enthalten.');
  return {...record, feedback};
}
