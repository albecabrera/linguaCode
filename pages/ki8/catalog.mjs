import {createProgressStore} from './mission/progress.mjs';
import {LESSONS} from './mission/lesson-data.mjs';

export const PROGRESS_FILTERS = Object.freeze(['all', 'in-progress', 'completed']);
export const PROGRESS_LABELS = Object.freeze({
  'not-started': 'Noch nicht begonnen',
  'in-progress': 'In Bearbeitung',
  completed: 'Abgeschlossen',
  unavailable: 'Nicht verfügbar',
});

export const COURSE_CATALOG = Object.freeze([
  ['Grundlagen', 'KI-Grundlagen'], ['Grundlagen', 'Training'], ['Grundlagen', 'Daten'],
  ['Entscheidungsbäume', 'Training'], ['Entscheidungsbäume', 'Merkmale'], ['Entscheidungsbäume', 'Trainingsdaten'],
  ['Entscheidungsbäume', 'Testen'], ['Entscheidungsbäume', 'Regeln'], ['Muster erkennen', 'Muster'],
  ['Muster erkennen', 'Ausreißer'], ['Chatbots', 'Intents'], ['Chatbots', 'Training'],
  ['Chatbots', 'Fallbacks'], ['Kritisch & verantwortlich', 'Prüfen'], ['Kritisch & verantwortlich', 'Fehlinformation'],
  ['Kritisch & verantwortlich', 'Privatsphäre'], ['Kritisch & verantwortlich', 'Bias'], ['Kritisch & verantwortlich', 'Verantwortung'], ['Abschlussprojekt', 'Projekt'],
].map(([module, topic], index) => Object.freeze({
  id: `ki-${String(index + 1).padStart(2, '0')}`,
  mission: index + 1,
  module,
  topic,
  href: `./stunde-${index + 1}/`,
})))
;

function statusForState(state) {
  if (!state || typeof state !== 'object') return 'not-started';
  return state.completed || state.quizSubmitted ? 'completed' : 'in-progress';
}

export function missionDetailsForCard(card, progress = card) {
  const lesson = LESSONS[card.id];
  const status = progress?.status ?? 'not-started';
  return {
    card,
    objectives: lesson?.objectives ?? [],
    duration: lesson?.duration ?? 0,
    phases: lesson?.phases?.map(({title, minutes}) => ({title, minutes})) ?? [],
    status,
    statusLabel: PROGRESS_LABELS[status] ?? PROGRESS_LABELS.unavailable,
  };
}

function missionDetailsMarkup(details) {
  const objectives = details.objectives.map((objective) => `<li>${objective}</li>`).join('');
  const phases = details.phases.map(({title, minutes}) => `${title} (${minutes} Min.)`).join(' · ');
  return `<p class="mission-detail-status" data-detail-status>${details.statusLabel}</p>${sequenceMarkup(COURSE_CATALOG, details.card)}<dl class="mission-detail-list"><div><dt>Ziele</dt><dd><ul>${objectives}</ul></dd></div><div><dt>Dauer</dt><dd>${details.duration} Minuten</dd></div><div><dt>Lernphasen</dt><dd>${phases}</dd></div></dl>`;
}

export function createMissionSequence(cards, card) {
  const index = cards.findIndex(({id}) => id === card?.id);
  const previous = index > 0 ? cards[index - 1] : null;
  const next = index >= 0 ? cards[index + 1] ?? null : null;
  return {previous, next, position: index + 1, total: cards.length};
}

export function sequenceMarkup(cards, card, checkpoints = []) {
  const sequence = createMissionSequence(cards, card);
  const checkpoint = checkpoints.find(({afterMission}) => afterMission === card?.mission);
  const previousText = sequence.previous ? `Vorherige Mission: Mission ${String(sequence.previous.mission).padStart(2, '0')}.` : 'Das ist der Einstieg in die Missionsfolge.';
  const nextText = sequence.next ? `Danach: Mission ${String(sequence.next.mission).padStart(2, '0')}.` : 'Das ist die letzte Mission.';
  const checkpointText = checkpoint ? `Checkpoint ${checkpoint.number} folgt jetzt als Übergang.` : 'Der nächste Schritt folgt in der Missionsfolge.';
  return `<p class="mission-sequence"><strong>Sequenz:</strong> ${previousText} ${nextText} ${checkpointText}</p>`;
}

export function missionDetailsForCardWithSequence(card, progress = card, cards = COURSE_CATALOG, checkpoints = []) {
  return {details: missionDetailsForCard(card, progress), sequence: sequenceMarkup(cards, card, checkpoints)};
}

export function createSequenceGuidance(progress, checkpoints = []) {
  const ordered = [...progress];
  const recommendedNext = ordered.find(({status}) => status === 'in-progress' || status === 'not-started' || status === 'unavailable') ?? ordered[0] ?? null;
  const nextCheckpoint = checkpoints.find(({afterMission}) => recommendedNext && afterMission >= recommendedNext.mission) ?? checkpoints.at(-1) ?? null;
  const nextIndex = recommendedNext ? ordered.findIndex(({id}) => id === recommendedNext.id) : -1;
  const previousMission = nextIndex > 0 ? ordered[nextIndex - 1] : null;
  return {
    recommendedNext,
    previousMission,
    nextCheckpoint,
    relation: nextIndex <= 0 ? 'Der Kurs beginnt mit Mission 01.' : `Mission ${String(previousMission.mission ?? nextIndex).padStart(2, '0')} liegt davor und ordnet den nächsten Schritt ein.`,
    transition: nextCheckpoint ? `Nach Mission ${nextCheckpoint.afterMission} folgt Checkpoint ${nextCheckpoint.number}.` : 'Es ist kein weiterer Checkpoint hinterlegt.',
  };
}

export function createDashboardModel(progress, checkpoints = []) {
  const modules = [];
  for (const card of progress) {
    let module = modules.find(({name}) => name === card.module);
    if (!module) {
      module = {name: card.module, completed: 0, total: 0};
      modules.push(module);
    }
    module.total += 1;
    if (card.status === 'completed') module.completed += 1;
  }
  return {
    modules,
    nextMission: progress.find(({status}) => status === 'in-progress' || status === 'not-started' || status === 'unavailable') ?? progress[0] ?? null,
    sequence: createSequenceGuidance(progress, checkpoints),
    summary: {
      missionsCompleted: progress.filter(({status}) => status === 'completed').length,
      missionsTotal: progress.length,
      checkpointsCompleted: checkpoints.filter(({status}) => status === 'completed').length,
      checkpointsTotal: checkpoints.length,
    },
  };
}

export function readCatalogProgress(storage, cards = COURSE_CATALOG) {
  return cards.map((card) => {
    let result;
    try {
      result = createProgressStore(storage, card.id).load();
    } catch {
      result = {status: 'unavailable', reason: 'storage-error'};
    }
    if (!result || result.status !== 'success') {
      return {...card, status: 'unavailable', reason: result?.reason ?? 'storage-error'};
    }
    return {...card, status: statusForState(result.state), phase: Number.isInteger(result.state?.phase) ? result.state.phase : null, reason: null};
  });
}

export function filterCatalog(cards, {progress = 'all', module = '', topic = ''} = {}) {
  return cards.filter((card) => {
    const progressMatches = progress === 'all' || card.status === progress;
    const moduleMatches = !module || card.module === module;
    const topicMatches = !topic || card.topic === topic;
    return progressMatches && moduleMatches && topicMatches;
  });
}

export function selectContinuation(cards, progress = cards) {
  const byId = new Map(progress.map((card) => [card.id, card]));
  return cards.find((card) => byId.get(card.id)?.status === 'in-progress')
    ?? cards.find((card) => byId.get(card.id)?.status === 'not-started')
    ?? cards.find((card) => byId.get(card.id)?.status === 'unavailable')
    ?? cards[0];
}

export function createCatalogController({documentLike = globalThis.document, storage = null, cards = COURSE_CATALOG} = {}) {
  const nodes = [...(documentLike?.querySelectorAll?.('[data-catalog-card]') ?? [])];
  const state = {progress: 'all', module: '', topic: ''};
  const cardById = new Map(cards.map((card) => [card.id, card]));
  const progress = readCatalogProgress(storage, cards);
  const progressById = new Map(progress.map((card) => [card.id, card]));

  function apply(nextState = state) {
    Object.assign(state, nextState);
    for (const node of nodes) {
      const card = cardById.get(node.dataset.catalogCard);
      const current = progressById.get(card?.id);
      node.hidden = !current || !filterCatalog([current], state).length;
      if (current) {
        node.dataset.progress = current.status;
        const details = node.querySelector?.('[data-mission-details]') ?? node.missionDetails;
        if (details) details.innerHTML = missionDetailsMarkup(missionDetailsForCard(card, current));
        const label = node.querySelector?.('[data-progress-label]') ?? node.progressLabel;
        if (label) {
          label.textContent = PROGRESS_LABELS[current.status] ?? PROGRESS_LABELS['unavailable'];
          label.dataset.progress = current.status;
        }
      }
    }
    const empty = documentLike?.querySelector?.('#catalog-empty');
    if (empty) empty.hidden = nodes.some((node) => !node.hidden);
    return state;
  }

  for (const button of documentLike?.querySelectorAll?.('[data-progress-filter]') ?? []) {
    button.addEventListener('click', () => {
      apply({progress: button.dataset.progressFilter});
      for (const candidate of documentLike.querySelectorAll('[data-progress-filter]')) candidate.setAttribute('aria-pressed', String(candidate === button));
    });
  }
  for (const select of documentLike?.querySelectorAll?.('[data-module-filter], [data-topic-filter]') ?? []) {
    select.addEventListener('change', () => apply({[select.dataset.moduleFilter !== undefined ? 'module' : 'topic']: select.value}));
  }
  apply();
  return {apply, progress, continuation: selectContinuation(cards, progress)};
}
