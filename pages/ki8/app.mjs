import {modules, classify, testSamples} from './course.mjs';

const container = document.querySelector('#modules');
for (const [index, item] of modules.entries()) {
  const card = document.createElement('article');
  card.className = `module ${item.color}`;
  const heading = document.createElement('h3');
  heading.textContent = `${item.icon} ${index + 1}. ${item.title}`;
  const detail = document.createElement('p');
  detail.textContent = `${item.hours} Unterrichtsstunden · ${index === 0 || index === 1 ? '2 interaktive Stunden verfügbar' : index === 2 ? '4 interaktive Stunden · Beispielkarte verfügbar' : 'In Vorbereitung'}`;
  card.append(heading, detail);
  if (index === 0) {
    for (const hour of [1, 2]) {
      const link = document.createElement('a');
      link.href = `./modul-1.html#stunde-${hour}`;
      link.textContent = `Stunde ${hour} öffnen`;
      card.append(link);
    }
  }
  if (index === 1) {
    for (const hour of [1, 2]) {
      const link = document.createElement('a');
      link.href = `./modul-2.html#stunde-${hour}`;
      link.textContent = `Stunde ${hour} öffnen`;
      card.append(link);
    }
  }
  // The module 3 lesson is linked from the course page: ./modul-3.html
  if (index === 2) {
    const sample = document.createElement('a');
    sample.href = '#beispielkarte';
    sample.textContent = 'Beispielkarte öffnen';
    card.append(sample);
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
