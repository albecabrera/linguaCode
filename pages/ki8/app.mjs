import {modules, classify, testSamples} from './course.mjs';
import {initCourseIntegration} from './mission/course-integration.mjs';

initCourseIntegration();

const container = document.querySelector('#modules');
for (const [index, item] of modules.entries()) {
  const card = document.createElement('article');
  card.className = `module ${item.color}`;
  const heading = document.createElement('h3');
  heading.textContent = `${item.icon} ${index + 1}. ${item.title}`;
  const detail = document.createElement('p');
  detail.textContent = `${item.hours} Unterrichtsstunden · interaktive Stunden mit direktem Einstieg`;
  card.append(heading, detail);
  const hourLinks = document.createElement('nav');
  hourLinks.setAttribute('aria-label', 'Unterrichtsstunden');
  for (let hour = 1; hour <= item.hours; hour += 1) {
    const link = document.createElement('a');
    link.href = `./modul-${index + 1}.html#stunde-${hour}`;
    link.textContent = `Stunde ${hour} öffnen`;
    hourLinks.append(link);
  }
  card.append(hourLinks);
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
