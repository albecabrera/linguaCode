import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getLesson } from '../pages/ki8/mission/lesson-data.mjs';
import { createMission06, predict, renderTestCards, renderTrainingCards, score, training } from '../pages/ki8/stunde-6/mission06.mjs';

const source = fs.readFileSync(new URL('../pages/ki8/stunde-6/mission06.mjs', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../pages/ki8/stunde-6/index.html', import.meta.url), 'utf8');
assert.match(html, /src="\.\/mission06\.mjs"/);
assert.match(html, /href="\.\/mission06\.css"/);
const lesson = getLesson('ki-06');
assert.equal(lesson.media.video.url, 'https://publikationen.bibliothek.kit.edu/1000139088');
assert.match(source, /3:15–4:29/);
assert.match(source, /data-video-done/);
assert.match(source, /red.*square|square.*red/i);
assert.match(source, /blue.*circle|circle.*blue/i);
assert.match(source, /data-lock-rule/);
assert.match(source, /color|Farbe/);
assert.match(source, /shape|Form/);
assert.match(source, /data-reveal-labels/);
assert.match(source, /data-sandbox/);
assert.match(source, /green|grün/i);
assert.match(source, /known label|bekanntes Label|known-label/i);
assert.match(source, /data-quiz-submit/);
assert.match(source, /Weiter zum Lernbericht/);
assert.match(source, /data-summary-done/);
assert.match(source, /localStorage|createProgressStore/);
assert.doesNotMatch(source, /fetch\s*\(|sendBeacon|XMLHttpRequest/);
assert.deepEqual(lesson.phases.find(({ id }) => id === 'quiz').questions.map(({ correctIndex }) => correctIndex), [0, 0, 1]);
assert.equal(predict('color', { color: 'red', shape: 'square' }), 'A');
assert.equal(predict('color', { color: 'blue', shape: 'circle' }), 'B');
assert.equal(score('color'), 2);
assert.equal(predict('shape', { color: 'red', shape: 'square' }), 'B');
assert.equal(predict('shape', { color: 'blue', shape: 'circle' }), 'A');
assert.equal(score('shape'), 0);
assert.equal(training.filter(({ color }) => color === 'red').length, 2);
assert.equal(training.filter(({ color }) => color === 'blue').length, 2);
assert.ok(training.every((item) => predict('color', item) === item.label));
assert.ok(training.every((item) => predict('shape', item) === item.label));
const trainingMarkup = renderTrainingCards();
assert.equal((trainingMarkup.match(/data-card/g) ?? []).length, 4);
assert.match(trainingMarkup, /Rot · Kreis · klein/);
assert.match(trainingMarkup, /Blau · Quadrat · klein/);
assert.doesNotMatch(trainingMarkup, /Rot · Quadrat|Blau · Kreis/);
assert.match(renderTestCards('color'), /Rot Quadrat/);
assert.match(renderTestCards('color'), /Blau Kreis/);
class RenderRoot { constructor() { this.ownerDocument = {}; this.html = ''; } set innerHTML(value) { this.html = value; } get innerHTML() { return this.html; } querySelector() { return null; } querySelectorAll() { return []; } }
const memory = new Map();
const storage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: (key) => memory.delete(key) };
memory.set('linguacode:ki-wp8:mission-01:v1:ki-06', JSON.stringify({ version: 1, state: { phase: 1, rule: null, labelsRevealed: false } }));
const beforeLock = new RenderRoot();
createMission06({ root: beforeLock, storage });
assert.match(beforeLock.innerHTML, /Rot · Kreis/);
assert.doesNotMatch(beforeLock.innerHTML, /Unabhängige Testmerkmale|Sandbox: Neues Beispiel/);
memory.set('linguacode:ki-wp8:mission-01:v1:ki-06', JSON.stringify({ version: 1, state: { phase: 1, rule: 'color', labelsRevealed: false } }));
const afterLock = new RenderRoot();
createMission06({ root: afterLock, storage });
assert.match(afterLock.innerHTML, /Unabhängige Testmerkmale/);
assert.doesNotMatch(afterLock.innerHTML, /Sandbox: Neues Beispiel/);
let writes = 0;
const legacyBytes = JSON.stringify({ version: 1, state: { phase: 1, answers: { legacy: 'keep' } } });
const legacyStorage = { getItem: () => legacyBytes, setItem: () => { writes += 1; }, removeItem() {} };
const restored = createMission06({ root: new RenderRoot(), storage: legacyStorage });
assert.equal(restored.getState().phase, 1);
assert.equal(restored.getState().answers.legacy, 'keep');
assert.equal(writes, 0, 'loading legacy progress must not overwrite it');
class NavigationRoot extends RenderRoot {
  constructor() { super(); this.elements = []; }
  set innerHTML(value) { this.html = value; this.elements = [...value.matchAll(/<button[^>]*data-phase-target="(\d+)"[^>]*>/g)].map((match) => ({ dataset: { phaseTarget: match[1] }, listeners: {}, addEventListener(type, fn) { this.listeners[type] = fn; }, click() { this.listeners.click?.({ currentTarget: this, target: this }); } })); }
  get innerHTML() { return this.html; }
  querySelectorAll(selector) { return selector === '[data-phase-target]' ? this.elements : []; }
}
const navigationState = { phase: 3, completed: true, videoDone: true, rule: 'color', labelsRevealed: true, quizAnswers: [0, 0, 1], summaryDone: true };
const navMap = new Map([['linguacode:ki-wp8:mission-01:v1:ki-06', JSON.stringify({ version: 1, state: navigationState })]]);
const navStorage = { getItem: (key) => navMap.get(key) ?? null, setItem: (key, value) => navMap.set(key, value), removeItem: (key) => navMap.delete(key) };
const navRoot = new NavigationRoot();
const navigator = createMission06({ root: navRoot, storage: navStorage });
for (const [index, title] of [[0, 'video-title'], [1, 'lab-title'], [2, 'quiz-title'], [3, 'summary-title']]) {
  const button = navRoot.elements.find((el) => Number(el.dataset.phaseTarget) === index);
  assert.ok(button, `Phase ${index + 1} must be navigable`);
  button.click();
  assert.ok(navRoot.innerHTML.includes(`aria-labelledby="${title}"`));
  assert.equal(navigator.getState().phase, 3, 'review must not reduce saved progress');
  assert.equal(navigator.getState().completed, true);
  assert.deepEqual(navigator.getState().quizAnswers, [0, 0, 1]);
}
assert.equal(JSON.parse(navMap.get('linguacode:ki-wp8:mission-01:v1:ki-06')).state.phase, 3);
console.log('Mission 06 interaction contract GREEN: training cards, both fitting rules, reveal sequence, hidden sandbox, persistence, quiz, and local-only behavior verified.');
