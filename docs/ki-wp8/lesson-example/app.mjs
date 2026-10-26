const examples = [
  {id: 'a', name: 'Amsel-Beschreibung', description: 'kleiner Vogel mit Federn und Flügeln', wings: 'ja', trueClass: 'Vogel', expectedSplit: 'training', rulePrediction: 'Vogel'},
  {id: 'b', name: 'Pinguin-Beschreibung', description: 'Vogel mit Federn und Flügeln, der nicht fliegt', wings: 'ja', trueClass: 'Vogel', expectedSplit: 'training', rulePrediction: 'Vogel'},
  {id: 'c', name: 'Katze-Beschreibung', description: 'Säugetier ohne Flügel', wings: 'nein', trueClass: 'Säugetier', expectedSplit: 'test', rulePrediction: 'kein Vogel'},
  {id: 'd', name: 'Fledermaus-Beschreibung', description: 'Säugetier mit Flügeln', wings: 'ja', trueClass: 'Säugetier', expectedSplit: 'test', rulePrediction: 'Vogel'},
];

export function gradeActivity(assignments, predictions) {
  const errors = [];
  let score = 0;
  let modelTestCorrect = 0;
  let modelTestTotal = 0;
  const modelFalsePositives = [];
  for (const example of examples) {
    if (assignments[example.id] === example.expectedSplit) score += 1;
    else errors.push(`${example.name}: Datensatz prüfen`);
    if (predictions[example.id] === example.rulePrediction) score += 1;
    else errors.push(`${example.name}: Regelanwendung falsch: erwartet „${example.rulePrediction}“, gewählt „${predictions[example.id] || 'keine Klasse'}“.`);
    if (example.expectedSplit === 'test') {
      modelTestTotal += 1;
      if (example.rulePrediction === example.trueClass || (example.rulePrediction === 'kein Vogel' && example.trueClass !== 'Vogel')) modelTestCorrect += 1;
      if (example.rulePrediction === 'Vogel' && example.trueClass !== 'Vogel') modelFalsePositives.push(example.name);
    }
  }
  return {score, total: examples.length * 2, modelTestCorrect, modelTestTotal, modelFalsePositives, errors};
}

export function formatFeedback(result) {
  const accuracy = result.modelTestTotal ? Math.round(100 * result.modelTestCorrect / result.modelTestTotal) : 0;
  const ruleText = result.errors.some((error) => error.includes('Regelanwendung falsch')) ? 'Regelanwendung prüfen.' : 'Regelanwendung vollständig.';
  const details = result.errors.map((error) => error.replace(/^[^:]+: /, '')).join(' ');
  const falsePositiveText = result.modelFalsePositives.length
    ? ` Falsch-positiv des Modells: ${result.modelFalsePositives.join(', ')} (Flügelregel sagt „Vogel“, wahres Label „Säugetier“).`
    : '';
  return `${result.score} von ${result.total}. ${ruleText} Modell-Testgenauigkeit: ${result.modelTestCorrect} von ${result.modelTestTotal} (${accuracy} %).${falsePositiveText}${details ? ` ${details}` : ''}`;
}

function option(value, label) {
  const element = document.createElement('option');
  element.value = value;
  element.textContent = label;
  return element;
}

function render() {
  const container = document.getElementById('examples');
  for (const example of examples) {
    const row = document.createElement('div');
    row.className = 'example';
    row.dataset.example = example.id;
    const label = document.createElement('strong');
    label.textContent = `${example.name}: ${example.description} · wahres Label: ${example.trueClass}`;
    const split = document.createElement('select');
    split.name = `split-${example.id}`;
    split.setAttribute('aria-label', `${example.name}: Datensatz`);
    split.append(option('', 'Datensatz wählen'), option('training', 'Training'), option('test', 'Test'));
    const prediction = document.createElement('select');
    prediction.name = `class-${example.id}`;
    prediction.setAttribute('aria-label', `${example.name}: Regelvorhersage`);
    prediction.append(option('', 'Regelvorhersage wählen'), option('Vogel', 'Vogel'), option('kein Vogel', 'kein Vogel'));
    row.append(label, split, prediction);
    container.append(row);
  }
}

function init() {
  render();
  document.getElementById('activity-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const assignments = Object.fromEntries(examples.map(({id}) => [id, form.get(`split-${id}`)]));
    const predictions = Object.fromEntries(examples.map(({id}) => [id, form.get(`class-${id}`)]));
    document.getElementById('activity-status').textContent = formatFeedback(gradeActivity(assignments, predictions));
  });
}

if (typeof document !== 'undefined') init();
