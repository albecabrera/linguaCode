import {COURSE_CATALOG, readCatalogProgress} from './catalog.mjs';

export const CHECKPOINTS = Object.freeze([
  Object.freeze({id: 'checkpoint-1', number: 1, afterMission: 6, title: 'Vom Problem zur Prüfung', prompt: 'Verbinde Regeln, Merkmale, Trainingsdaten und unabhängige Tests.', summary: 'Plane ein kleines Beispiel und erkläre, wie du es mit neuen Daten prüfst.', missionIds: Object.freeze(['ki-01', 'ki-03', 'ki-06']), localOnly: true}),
  Object.freeze({id: 'checkpoint-2', number: 2, afterMission: 12, title: 'Muster, Chatbots und Grenzen', prompt: 'Übertrage Mustererkennung auf Chatbot-Intents und sichere Fallbacks.', summary: 'Beschreibe, wie ein System bei neuen oder unbekannten Eingaben ehrlich bleibt.', missionIds: Object.freeze(['ki-09', 'ki-10', 'ki-12']), localOnly: true}),
  Object.freeze({id: 'checkpoint-3', number: 3, afterMission: 18, title: 'Verantwortungsvoll gestalten', prompt: 'Prüfe Daten, Bias, Privatsphäre und menschliche Verantwortung gemeinsam.', summary: 'Formuliere eine verantwortungsvolle Projektidee als Vorbereitung auf Mission 19.', missionIds: Object.freeze(['ki-15', 'ki-16', 'ki-17', 'ki-18']), localOnly: true}),
]);

function checkpointStatus(checkpoint, progress) {
  const relevant = checkpoint.missionIds.map((id) => progress.find((card) => card.id === id));
  return relevant.every((card) => card?.status === 'completed') ? 'completed' : relevant.some((card) => card?.status === 'in-progress') ? 'in-progress' : 'open';
}

export function createCheckpointController({storage = null, cards = readCatalogProgress(storage, COURSE_CATALOG)} = {}) {
  const statuses = CHECKPOINTS.map((checkpoint) => ({...checkpoint, status: checkpointStatus(checkpoint, cards)}));
  return {checkpoints: statuses, summary: {completed: statuses.filter(({status}) => status === 'completed').length, available: statuses.length}};
}

export function renderCheckpoints({storage = null, cards, documentLike = globalThis.document} = {}) {
  const controller = createCheckpointController({storage, cards: cards ?? readCatalogProgress(storage, COURSE_CATALOG)});
  const markup = `<section class="integrative-checkpoints" aria-labelledby="checkpoints-title"><div class="section-heading"><p class="eyebrow">Zusammenführen</p><h2 id="checkpoints-title">Integrative Checkpoints</h2><p>Drei kurze Haltepunkte verbinden mehrere Missionen. Sie speichern nichts zusätzlich und senden nichts an einen Server.</p></div><div class="checkpoint-grid">${controller.checkpoints.map((checkpoint) => `<article class="checkpoint-card" data-checkpoint="${checkpoint.id}" data-status="${checkpoint.status}"><p class="eyebrow">Checkpoint ${checkpoint.number} · nach Mission ${checkpoint.afterMission}</p><h3>${checkpoint.title}</h3><p>${checkpoint.prompt}</p><p class="checkpoint-summary"><strong>Arbeitsauftrag:</strong> ${checkpoint.summary}</p><p class="checkpoint-status" role="status">${checkpoint.status === 'completed' ? 'Die zugehörigen Missionen sind abgeschlossen.' : checkpoint.status === 'in-progress' ? 'Du hast bereits begonnen.' : 'Bereit, sobald du die Missionen bearbeitest.'}</p></article>`).join('')}</div><p class="shared-device-warning"><strong>Nur auf diesem Gerät:</strong> Der Status wird ausschließlich aus deinem vorhandenen lokalen Missionsfortschritt abgeleitet.</p></section>`;
  if (documentLike?.querySelector) { const target = documentLike.querySelector('#integrative-checkpoints'); if (target) target.outerHTML = markup; }
  return markup;
}

if (typeof document !== 'undefined') renderCheckpoints();
