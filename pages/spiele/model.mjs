const TYPES = new Set(['tug', 'wheel', 'jeopardy', 'memory', 'matching']);
const SUBJECTS = new Set(['Informatik', 'Spanisch', 'Sport', 'Mathematik']);
export const MAX_TEXT_LENGTH = 10000;
export const MAX_COLLECTION_ITEMS = 1000;
export const MAX_IMPORT_BYTES = 1024 * 1024;

const hasText = value => typeof value === 'string' && value.trim().length > 0 && value.length <= MAX_TEXT_LENGTH;
const uniqueIds = values => values.every(hasText) && new Set(values).size === values.length;
const stamp = () => new Date().toISOString();
export const id = () => globalThis.crypto?.randomUUID?.() || `game-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function createEmptyGame(type = 'tug') {
  const content = {
    tug: { questions: [] },
    wheel: { questions: [] },
    jeopardy: { categories: [] },
    memory: { pairs: [] },
    matching: { groups: [] }
  }[type];
  if (!content) throw new Error('Spieltyp wird nicht unterstützt.');
  return {
    id: id(), schemaVersion: 1, type, title: '', description: '',
    subject: 'Informatik', grade: '6', language: 'de',
    createdAt: stamp(), updatedAt: stamp(), settings: {}, content
  };
}

function baseErrors(game) {
  if (!game || typeof game !== 'object' || Array.isArray(game)) return ['Spiel muss ein Objekt sein.'];
  const errors = [];
  if (game.schemaVersion !== 1) errors.push('Schema-Version wird nicht unterstützt.');
  if (!hasText(game.id)) errors.push('ID fehlt.');
  if (!TYPES.has(game.type)) errors.push('Spieltyp wird nicht unterstützt.');
  for (const key of ['title', 'description', 'grade', 'language', 'createdAt', 'updatedAt']) {
    if (!hasText(game[key])) errors.push(`${key === 'title' ? 'Titel' : key} fehlt.`);
  }
  if (!SUBJECTS.has(game.subject)) errors.push('Fach ist ungültig.');
  if (Number.isNaN(Date.parse(game.createdAt || '')) || Number.isNaN(Date.parse(game.updatedAt || ''))) {
    errors.push('Zeitstempel sind ungültig.');
  }
  if (!game.settings || typeof game.settings !== 'object' || Array.isArray(game.settings)) errors.push('Einstellungen fehlen.');
  if (!game.content || typeof game.content !== 'object' || Array.isArray(game.content)) errors.push('Inhalt fehlt.');
  return errors;
}

function validCollection(value) {
  return Array.isArray(value) && value.length <= MAX_COLLECTION_ITEMS;
}

function questionErrors(questions, label = 'Fragen') {
  if (!validCollection(questions) || !questions.length) return [`${label} dürfen nicht leer sein.`];
  if (!uniqueIds(questions.map(question => question && question.id))) return [`${label} benötigen eindeutige IDs.`];
  return questions.flatMap(question => {
    if (!question || typeof question !== 'object' || Array.isArray(question)) return ['Eine Frage ist ungültig.'];
    if (!hasText(question.prompt) || !hasText(question.answer)) return ['Eine Frage ist ungültig.'];
    if (question.points !== undefined && (!Number.isInteger(question.points) || question.points < 1 || question.points > 10000)) return ['Eine Frage ist ungültig.'];
    return [];
  });
}

export function validateGame(game) {
  const errors = baseErrors(game);
  if (!game || typeof game !== 'object' || Array.isArray(game)) return errors;
  if (!game.content || typeof game.content !== 'object' || Array.isArray(game.content) || !TYPES.has(game.type)) return errors;
  if (game.type === 'tug' || game.type === 'wheel') errors.push(...questionErrors(game.content.questions));
  if (game.type === 'jeopardy') {
    const categories = game.content.categories;
    if (!validCollection(categories) || categories.length < 2) errors.push('Jeopardy benötigt mindestens zwei Kategorien.');
    else if (!uniqueIds(categories.map(category => category && category.id))) errors.push('Jeopardy-Kategorien sind ungültig.');
    else categories.forEach(category => {
      if (!category || typeof category !== 'object' || Array.isArray(category) || !hasText(category.name)) errors.push('Jeopardy-Kategorien sind ungültig.');
      else errors.push(...questionErrors(category.questions, 'Kategoriefragen'));
    });
  }
  if (game.type === 'memory') {
    const pairs = game.content.pairs;
    if (!validCollection(pairs) || pairs.length < 2 || !uniqueIds(pairs.map(pair => pair && pair.id)) || pairs.some(pair => !pair || typeof pair !== 'object' || Array.isArray(pair) || !hasText(pair.first) || !hasText(pair.second))) {
      errors.push('Memory-Paare sind ungültig.');
    }
  }
  if (game.type === 'matching') {
    const groups = game.content.groups;
    if (!validCollection(groups) || groups.length < 2 || !uniqueIds(groups.map(group => group && group.id))) {
      errors.push('Zuordnungsgruppen sind ungültig.');
    } else {
      const items = [];
      for (const group of groups) {
        if (!group || typeof group !== 'object' || Array.isArray(group) || !hasText(group.name) || !validCollection(group.items) || !group.items.length || !uniqueIds(group.items.map(item => item && item.id))) {
          errors.push('Zuordnungsgruppen sind ungültig.');
          continue;
        }
        for (const item of group.items) {
          if (!item || typeof item !== 'object' || Array.isArray(item) || !hasText(item.text)) errors.push('Zuordnungsbegriffe sind ungültig.');
          else items.push(item);
        }
      }
      if (!uniqueIds(items.map(item => item.id))) errors.push('Zuordnungsbegriffe benötigen eindeutige IDs.');
    }
  }
  return [...new Set(errors)];
}

export function importGame(source) {
  if (typeof source !== 'string' || source.length > MAX_IMPORT_BYTES) throw new Error('JSON darf höchstens 1 MB groß sein.');
  let parsed;
  try { parsed = JSON.parse(source); } catch { throw new Error('Ungültiges JSON.'); }
  const errors = validateGame(parsed);
  if (errors.length) throw new Error(errors.join(' '));
  return parsed;
}

export function exportGame(game) {
  const errors = validateGame(game);
  if (errors.length) throw new Error(errors.join(' '));
  const serialized = JSON.stringify(game, null, 2);
  importGame(serialized);
  return serialized;
}

export function createGameStore(storage) {
  const key = 'linguacode.spiele.drafts.v1';
  function list() {
    const raw = storage.getItem(key);
    if (raw === null) return [];
    let values;
    try { values = JSON.parse(raw); } catch { throw new Error('Lokale Spiele konnten nicht gelesen werden.'); }
    if (!Array.isArray(values) || values.length > MAX_COLLECTION_ITEMS || values.some(value => validateGame(value).length)) throw new Error('Lokale Spiele sind ungültig.');
    return values;
  }
  function save(game) {
    const errors = validateGame(game);
    if (errors.length) throw new Error(errors.join(' '));
    const values = list();
    const index = values.findIndex(value => value.id === game.id);
    if (index < 0) values.push(game); else values[index] = game;
    storage.setItem(key, JSON.stringify(values));
  }
  function remove(gameId) {
    storage.setItem(key, JSON.stringify(list().filter(game => game.id !== gameId)));
  }
  return { list, save, remove };
}

export function playWheel(game, usedIds) {
  const available = game.content.questions.filter(question => !usedIds.includes(question.id));
  const next = available.length ? available[Math.floor(Math.random() * available.length)] : null;
  return { question: next, used: next ? [...usedIds, next.id] : usedIds };
}

export function revealJeopardy(game, categoryId, questionId) {
  const category = game.content.categories.find(item => item.id === categoryId);
  const question = category?.questions.find(item => item.id === questionId);
  return { question: question || null, used: Boolean(question) };
}

export function matchMemory(game, firstCard, secondCard) {
  const validPair = game.content.pairs.some(pair => pair.id === firstCard?.pairId);
  return { matched: validPair && firstCard?.cardId !== secondCard?.cardId && firstCard?.pairId === secondCard?.pairId };
}

export function classifyItem(game, itemId, groupId) {
  const group = game.content.groups.find(item => item.id === groupId);
  return { correct: Boolean(group?.items.some(item => item.id === itemId)) };
}
