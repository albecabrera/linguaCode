// The model contains activity definitions only; player results are never exported.
export const MAX_COLLECTION_ITEMS = 1000;
export const MAX_TEXT_LENGTH = 10000;
export const MAX_IMAGE_DATA_BYTES = 256 * 1024;
export const MAX_CROSSWORD_WORDS = 60;
export const MAX_CROSSWORD_WORD_LENGTH = 24;
export const MAX_CROSSWORD_GRID_SIDE = 40;
const MAX_VALIDATION_NODES = 10000;
const MAX_VALIDATION_KEYS = 10000;
const text = value => typeof value === 'string' && value.trim().length > 0;
const imageData = /^data:image\/(png|jpeg|gif|webp);base64,([a-z0-9+/]*={0,2})$/i;
export function isSafeMemoryImage(value) {
  if (value === undefined || value === '') return true;
  if (typeof value !== 'string' || value.length > Math.ceil(MAX_IMAGE_DATA_BYTES * 4 / 3) + 100) return false;
  const data = value.match(imageData);
  if (data) return Math.floor(data[2].length * 3 / 4) <= MAX_IMAGE_DATA_BYTES;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('//') || /[\u0000-\u001f\\]/.test(value)) return false;
  try {
    const url = new URL(value, 'https://example.invalid/');
    return url.origin === 'https://example.invalid' && Boolean(url.pathname);
  } catch { return false; }
}
function limitErrors(value) {
  const errors = [];
  const seen = new WeakSet();
  let nodes = 0, stopped = false;
  function stop(message) {
    if (!stopped) errors.push(message);
    stopped = true;
  }
  function walk(item, key = '', depth = 0) {
    if (stopped) return;
    if (++nodes > MAX_VALIDATION_NODES) { stop('Datenstruktur überschreitet das Prüfbudget.'); return; }
    if (typeof item === 'string') {
      if (key !== 'image' && item.length > MAX_TEXT_LENGTH) errors.push('Text ist zu lang.');
      return;
    }
    if (!item || typeof item !== 'object') return;
    if (depth > 30) { stop('Datenstruktur ist zu tief.'); return; }
    if (seen.has(item)) { stop('Datenstruktur ist zirkulär.'); return; }
    seen.add(item);
    if (Array.isArray(item)) {
      if (item.length > MAX_COLLECTION_ITEMS) stop('Sammlung enthält zu viele Einträge.');
      else item.forEach(child => walk(child, '', depth + 1));
    } else {
      const entries = Object.entries(item);
      if (entries.length > MAX_VALIDATION_KEYS) stop('Objekt enthält zu viele Felder.');
      else entries.forEach(([name, child]) => walk(child, name, depth + 1));
    }
    seen.delete(item);
  }
  walk(value);
  return errors;
}
const unique = values => values.every(text) && new Set(values).size === values.length;
const array = value => Array.isArray(value) ? value : [];

export function validateActivity(activity) {
  const errors = limitErrors(activity);
  const fail = message => errors.push(message);
  if (!activity || typeof activity !== 'object' || Array.isArray(activity)) return [...errors, 'Aktivität muss ein Objekt sein.'];
  if (activity.schemaVersion !== 1) fail('Schema-Version wird nicht unterstützt.');
  for (const field of ['id','title','description','subject','grade','language','createdAt','updatedAt']) {
    if (!text(activity[field])) fail(`${field} fehlt.`);
  }
  if (!/^\d{4}-\d\d-\d\dT/.test(activity.createdAt || '') || Number.isNaN(Date.parse(activity.createdAt))) fail('createdAt ist ungültig.');
  if (!/^\d{4}-\d\d-\d\dT/.test(activity.updatedAt || '') || Number.isNaN(Date.parse(activity.updatedAt))) fail('updatedAt ist ungültig.');
  if (!activity.settings || typeof activity.settings !== 'object' || Array.isArray(activity.settings)) fail('Einstellungen fehlen.');
  else {
    for (const key of ['timerEnabled','shuffleQuestions','shuffleCards','showFeedback']) if (key in activity.settings && typeof activity.settings[key] !== 'boolean') fail(`${key} muss ein Wahrheitswert sein.`);
    if ('timerSeconds' in activity.settings && (!Number.isInteger(activity.settings.timerSeconds) || activity.settings.timerSeconds < 1 || activity.settings.timerSeconds > 3600)) fail('timerSeconds ist ungültig.');
  }
  const c = activity.content;
  if (!c || typeof c !== 'object' || Array.isArray(c)) return [...errors, 'Inhalt fehlt.'];
  if (activity.type === 'quiz') {
    const questions = array(c.questions);
    if (!questions.length || !unique(questions.map(q => q?.id))) fail('Fragen benötigen eindeutige IDs.');
    for (const q of questions) {
      const options = array(q?.options), ids = options.map(o => o?.id), correct = array(q?.correctOptionIds);
      if (!text(q?.question) || !['single-choice','multiple-choice','true-false'].includes(q?.type) || options.length < 2 || options.length > 4 || !unique(ids) || options.some(o => !text(o?.text)) || !correct.length || !unique(correct) || correct.some(id => !ids.includes(id)) || (q.type !== 'multiple-choice' && correct.length !== 1) || (q.type === 'true-false' && options.length !== 2)) fail('Eine Quizfrage ist ungültig.');
    }
  } else if (activity.type === 'memory') {
    const pairs = array(c.pairs);
    const settings = activity.settings && typeof activity.settings === 'object' && !Array.isArray(activity.settings) ? activity.settings : {};
    if ('pairCount' in settings && (!Number.isInteger(settings.pairCount) || settings.pairCount < 1 || settings.pairCount > pairs.length)) fail('pairCount ist ungültig.');
    if ('difficulty' in settings && !['easy','medium','hard'].includes(settings.difficulty)) fail('difficulty ist ungültig.');
    const imageOK = isSafeMemoryImage;
    const side = v => text(v) || (v && typeof v === 'object' && !Array.isArray(v) && (text(v.text) || text(v.image)) && (v.text === undefined || typeof v.text === 'string') && imageOK(v.image));
    if (!pairs.length || !unique(pairs.map(p => p?.id)) || pairs.some(p => !side(p?.first) || !side(p?.second))) fail('Memory-Paare sind ungültig.');
  } else if (activity.type === 'crossword') {
    const words = array(c.words);
    if (words.length > MAX_CROSSWORD_WORDS) return [...errors, `Kreuzworträtsel enthält zu viele Wörter (maximal ${MAX_CROSSWORD_WORDS}).`];
    const normalizedLength = value => String(value ?? '')
      .replace(/[äÄ]/g, 'AE').replace(/[öÖ]/g, 'OE').replace(/[üÜ]/g, 'UE').replace(/[ßẞ]/g, 'SS')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '').length;
    if (!words.length || !unique(words.map(w => w?.id)) || words.some(w => !text(w?.word) || normalizedLength(w.word) > MAX_CROSSWORD_WORD_LENGTH || !text(w?.clue))) fail(`Kreuzworträtsel-Wörter sind ungültig (maximal ${MAX_CROSSWORD_WORD_LENGTH} normalisierte Buchstaben pro Wort).`);
  } else if (activity.type === 'classification') {
    const categories = array(c.categories), items = array(c.items), ids = categories.map(x => x?.id);
    if (categories.length < 2 || categories.length > 6 || !unique(ids) || categories.some(x => !text(x?.name))) fail('Kategorien sind ungültig.');
    if (!items.length || !unique(items.map(x => x?.id)) || items.some(x => !text(x?.text) || !ids.includes(x?.categoryId))) fail('Begriffe sind ungültig.');
  } else fail('Spieltyp wird nicht unterstützt.');
  return errors;
}

export function migrateActivity(value) {
  if (value?.schemaVersion !== 1) throw new Error('Schema-Version wird nicht unterstützt.');
  return value;
}
export function importActivity(source) {
  if (typeof source !== 'string' || source.length > 1024 * 1024) throw new Error('JSON darf höchstens 1 MB groß sein.');
  let parsed;
  try { parsed = JSON.parse(source); } catch { throw new Error('Ungültiges JSON.'); }
  const value = migrateActivity(parsed);
  const errors = validateActivity(value);
  if (errors.length) throw new Error(errors.join(' '));
  return value;
}
export function exportActivity(activity) {
  const errors = validateActivity(activity);
  if (errors.length) throw new Error(errors.join(' '));
  return JSON.stringify(activity, null, 2);
}
