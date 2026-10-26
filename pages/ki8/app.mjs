import {modules, classify, testSamples} from './course.mjs';

const container = document.querySelector('#modules');
for (const [index, item] of modules.entries()) {
  const card = document.createElement('article');
  card.className = `module ${item.color}`;
  const heading = document.createElement('h3');
  heading.textContent = `${item.icon} ${index + 1}. ${item.title}`;
  const detail = document.createElement('p');
  detail.textContent = `${item.hours} Unterrichtsstunden · ${index === 2 ? 'Beispielkarte verfügbar' : 'In Vorbereitung'}`;
  card.append(heading, detail);
  if (index === 2) {
    const link = document.createElement('a');
    link.href = '#beispielkarte';
    link.textContent = 'Beispielkarte öffnen';
    card.append(link);
  }
  container.append(card);
}

document.querySelector('#threshold-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const threshold = Number(document.querySelector('#threshold').value);
  const result = document.querySelector('#result');
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 20) {
    result.textContent = 'Wähle einen Schwellenwert zwischen 0 und 20.';
    return;
  }
  const sample = testSamples[0];
  result.textContent = `Testbeispiel ${sample.value} liegt ${classify(sample.value, threshold)} dem Schwellenwert ${threshold}. Ändere den Wert und vergleiche.`;
});
