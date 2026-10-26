// Public-safe, independently written sample values; not copied from the source PDFs.
export const modules = [
  {id: 'alltag', title: 'KI im Alltag entdecken', hours: 2, icon: '◎', color: 'blue'},
  {id: 'daten', title: 'Daten als Grundlage der KI', hours: 2, icon: '▦', color: 'mint'},
  {id: 'baeume', title: 'Entscheidungsbäume trainieren und testen', hours: 4, icon: '⑂', color: 'orange'},
  {id: 'muster', title: 'KI erkennt Muster', hours: 2, icon: '◈', color: 'violet'},
  {id: 'chatbot', title: 'Eigenen KI-Chatbot entwickeln', hours: 3, icon: '✦', color: 'coral'},
  {id: 'kritik', title: 'KI kritisch beurteilen und Wissen überprüfen', hours: 5, icon: '◇', color: 'teal'},
];

// Synthetic data only. These example labels are not nutritional recommendations.
export const trainingSamples = [
  {id: 'train-a', name: 'Beispiel A', value: 3, label: 'grün'},
  {id: 'train-b', name: 'Beispiel B', value: 11, label: 'rot'},
];
export const testSamples = [
  {id: 'test-a', name: 'Neues Beispiel', value: 8, label: 'grün'},
];

export function classify(value, threshold) {
  if (!Number.isFinite(value) || !Number.isFinite(threshold) || value < 0 || threshold < 0) {
    throw new RangeError('Merkmal und Schwellenwert müssen nichtnegative endliche Zahlen sein.');
  }
  return value <= threshold ? 'unter oder gleich' : 'über';
}
