import assert from 'node:assert/strict';
import { createMission05, predictDecision, scorePredictions, validateQuizAnswers } from '../pages/ki8/stunde-5/mission05.mjs';
import { getLesson } from '../pages/ki8/mission/lesson-data.mjs';
import { PROGRESS_NAMESPACE } from '../pages/ki8/mission/progress.mjs';

class FakeElement {
  constructor(root, tag, attrs = {}) { this.root = root; this.tagName = tag; this.attrs = attrs; this.dataset = Object.fromEntries(Object.entries(attrs).filter(([key]) => key.startsWith('data-')).map(([key, value]) => [key.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase()), value ?? ''])); this.name = attrs.name; this.value = attrs.value ?? ''; this.checked = 'checked' in attrs; this.disabled = 'disabled' in attrs; this.listeners = {}; }
  addEventListener(type, handler) { this.listeners[type] = handler; }
  dispatch(type) { const event = { target: this, stopPropagation() {} }; this.listeners[type]?.(event); }
  focus() { this.root.activeElement = this; }
  setAttribute(name, value) { this.attrs[name] = value; }
  querySelector() { return null; }
  insertAdjacentHTML(_, html) { this.root.html += html; }
}
class FakeDocument {
  constructor() { this.documentElement = { setAttribute: (name, value) => { this[name] = value; this[name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value; } }; this.listeners = {}; this.root = null; }
  addEventListener(type, handler) { this.listeners[type] = handler; }
  removeEventListener() {}
  querySelectorAll(selector) { return this.root?.querySelectorAll(selector) ?? []; }
}
class FakeRoot {
  constructor(documentLike) { this.ownerDocument = documentLike; documentLike.root = this; this.html = ''; this.cache = []; this.activeElement = null; }
  set innerHTML(value) { this.html = value; this.cache = []; for (const match of value.matchAll(/<([a-z]+)([^>]*)>/gi)) { const attrs = {}; for (const item of (match[2] || '').matchAll(/([\w-]+)(?:="([^"]*)")?/g)) attrs[item[1]] = item[2] ?? ''; this.cache.push(new FakeElement(this, match[1], attrs)); } }
  get innerHTML() { return this.html; }
  matches(element, selector) { if (selector === '[data-theme-toggle]') return 'themeToggle' in element.dataset; const data = selector.match(/^\[data-([\w-]+)(?:="([^"]*)")?\]$/); if (data) { const key = data[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase()); return key in element.dataset && (data[2] === undefined || element.dataset[key] === data[2]); } if (selector === '.test-card input[type="radio"]') return element.tagName === 'input' && element.attrs.type === 'radio' && /^p\d$/.test(element.name); if (selector === '.quiz-question input') return element.tagName === 'input' && element.attrs.type === 'radio' && /^quiz-\d$/.test(element.name); const input = selector.match(/^input\[name="([^"]+)"\]\[value="([^"]+)"\]$/); if (input) return element.tagName === 'input' && element.name === input[1] && element.value === input[2]; if (selector === '.tree-wrap') return element.attrs.class === 'tree-wrap'; return false; }
  querySelectorAll(selector) { return this.cache.filter((element) => this.matches(element, selector)); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] ?? new FakeElement(this, 'div'); }
}

const lesson = getLesson('ki-05');
const questions = lesson.phases.at(-1).questions;
assert.equal(validateQuizAnswers([, , , , 0], questions), false, 'sparse quiz answers are incomplete');
assert.equal(predictDecision(lesson.interactive.testExamples[0], 'smile', 'xEyes'), 'Beißt');
assert.deepEqual(scorePredictions({ p1: 'Beißt', p2: 'Beißt nicht', p3: 'Beißt', p4: 'Beißt nicht', p5: 'Beißt' }), { correct: 4, total: 5, percent: 80 });

const memory = new Map();
const storage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: (key) => memory.delete(key) };
const documentLike = new FakeDocument();
const root = new FakeRoot(documentLike);
const renderer = createMission05({ root, storage });
assert.match(root.innerHTML, /monkey-face/);
assert.match(root.innerHTML, /Lächelt: Ja|Lächelt: Nein/);
assert.equal(root.querySelector('[data-advance="0"]').disabled, true, 'orientation cannot advance before acknowledgement');
root.querySelector('[data-orient-done]').checked = true;
root.querySelector('[data-orient-done]').dispatch('change');
root.querySelector('[data-advance="0"]').dispatch('click');
assert.equal(renderer.getState().phase, 1);
const themeBefore = documentLike.dataTheme;
root.querySelector('[data-theme-toggle]').dispatch('click');
assert.notEqual(documentLike.dataTheme, themeBefore, 'theme toggle changes the public theme state');
const childSelect = root.querySelector('[data-child-feature]');
childSelect.value = 'smile';
childSelect.dispatch('change');
root.querySelector('[data-train]').dispatch('click');
assert.equal(renderer.getState().trained, false, 'duplicate feature choices do not train an empty branch');
childSelect.value = 'xEyes';
childSelect.dispatch('change');
root.querySelector('[data-train]').dispatch('click');
assert.equal(renderer.getState().trained, true);
root.querySelector('[data-advance="1"]').dispatch('click');
assert.equal(renderer.getState().phase, 2);

const wrongRadio = root.querySelector('input[name="p1"][value="Beißt nicht"]');
wrongRadio.dispatch('change');
assert.equal(root.activeElement.name, 'p1', 'radio focus survives rerender');
assert.match(root.innerHTML, /Ausgabe: Beißt/);
assert.match(root.innerHTML, /Deine Vorhersage:<\/strong> Beißt nicht/);
for (const example of lesson.interactive.testExamples.filter(({ id }) => id !== 'p1')) { root.querySelector('input[name="' + example.id + '"][value="' + example.label + '"]').dispatch('change'); }
const beforeSubmit = memory.get(`${PROGRESS_NAMESPACE}:ki-05`);
root.querySelector('[data-submit-tests]').dispatch('click');
assert.deepEqual(renderer.getState().firstAccuracy, { correct: 4, total: 5, percent: 80 });
root.querySelector('[data-retry-tests]').dispatch('click');
assert.deepEqual(renderer.getState().firstAccuracy, { correct: 4, total: 5, percent: 80 });
for (const example of lesson.interactive.testExamples) root.querySelector('input[name="' + example.id + '"][value="' + example.label + '"]').dispatch('change');
root.querySelector('[data-submit-tests]').dispatch('click');
assert.deepEqual(renderer.getState().firstAccuracy, { correct: 4, total: 5, percent: 80 }, 'practice round cannot inflate first score');
assert.equal(renderer.getState().practiceAccuracy.percent, 100);
root.querySelector('[data-advance="2"]').dispatch('click');
const quizLast = root.querySelector('input[name="quiz-4"][value="0"]');
quizLast.dispatch('change');
const beforeQuizSubmit = memory.get(`${PROGRESS_NAMESPACE}:ki-05`);
root.querySelector('[data-submit-quiz]').dispatch('click');
assert.equal(renderer.getState().completed, false, 'last-question-only quiz stays incomplete');
assert.equal(memory.get(`${PROGRESS_NAMESPACE}:ki-05`), beforeQuizSubmit, 'rejected sparse quiz does not write progress');
assert.match(root.innerHTML, /Bitte beantworte alle fünf Fragen/);
const reloadedRoot = new FakeRoot(new FakeDocument());
const reloaded = createMission05({ root: reloadedRoot, storage });
assert.equal(reloaded.getState().phase, 3, 'custom progress reloads through the public mission API');
assert.deepEqual(reloaded.getState().firstAccuracy, { correct: 4, total: 5, percent: 80 });
assert.equal(reloaded.getState().completed, false);
console.log('PASS: Mission 05 interaction, focus, theme, sparse-quiz, trace, retry, duplicate-feature, and reload regressions.');
