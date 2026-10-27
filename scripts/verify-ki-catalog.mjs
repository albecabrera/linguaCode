import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createCatalogController, createDashboardModel, filterCatalog, missionDetailsForCard, readCatalogProgress, selectContinuation} from '../pages/ki8/catalog.mjs';
import {createPresentationController} from '../pages/ki8/presentation.mjs';

const entry = readFileSync(new URL('../pages/ki8/index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../pages/ki8/app.mjs', import.meta.url), 'utf8');
const style = readFileSync(new URL('../pages/ki8/style.css', import.meta.url), 'utf8');
const presentation = readFileSync(new URL('../pages/ki8/presentation.mjs', import.meta.url), 'utf8');

assert.match(entry, /id="continue-course"/);
assert.match(entry, /Kurs (fortsetzen|starten)/);
assert.match(entry, /id="student-dashboard"/);
assert.match(entry, /data-dashboard-summary/);
assert.match(entry, /data-dashboard-modules/);
assert.match(entry, /id="catalog-filters"/);
assert.match(entry, /data-progress-filter="all"/);
assert.match(entry, /data-progress-filter="in-progress"/);
assert.match(entry, /data-progress-filter="completed"/);
assert.match(entry, /data-module-filter/);
assert.match(entry, /id="module-filter"/);
assert.match(entry, /for="module-filter"/);
assert.match(entry, /id="topic-filter"/);
assert.match(entry, /for="topic-filter"/);
assert.match(entry, /aria-controls="mission-list"/);
assert.match(entry, /data-presentation-toggle/);
assert.match(entry, /Smartboard-Modus/);
assert.match(app, /createPresentationController/);
assert.match(presentation, /localStorage|storage/);
assert.doesNotMatch(presentation, /fetch|XMLHttpRequest|sendBeacon/);
assert.match(style, /data-presentation/);
assert.match(style, /prefers-reduced-motion: reduce/);
assert.match(style, /:focus-visible/);
assert.match(style, /forced-colors: active/);
assert.match(entry, /href="\.\/teacher\/"[^>]*>Lokale Lehransicht öffnen/);
assert.match(app, /createCatalogController/);
assert.match(style, /catalog-filters/);
assert.match(style, /student-dashboard/);
assert.match(style, /mission-details/);
assert.equal((entry.match(/data-progress-label/g) ?? []).length, 19, 'each catalog card exposes a local progress label');
assert.equal((entry.match(/data-mission-details/g) ?? []).length, 19, 'each catalog card exposes expanded local details');
assert.equal(missionDetailsForCard({id: 'ki-01', mission: 1, topic: 'KI-Grundlagen'}, {status: 'completed'}).statusLabel, 'Abgeschlossen');
assert.match(style, /\.mission-panel\[data-progress="not-started"\]/);
assert.match(style, /\.mission-panel\[data-progress="in-progress"\]/);
assert.match(style, /\.mission-panel\[data-progress="completed"\]/);
assert.match(style, /\.mission-panel\[data-progress="unavailable"\]/);
assert.match(entry, /Noch nicht begonnen|Lokaler Fortschritt wird geladen/);

const cards = [
  {id: 'ki-01', module: 'Grundlagen', topic: 'KI', href: './stunde-1/', status: 'in-progress'},
  {id: 'ki-02', module: 'Grundlagen', topic: 'Training', href: './stunde-2/', status: 'in-progress'},
  {id: 'ki-03', module: 'Daten', topic: 'Daten', href: './stunde-3/', status: 'completed'},
];
assert.deepEqual(filterCatalog(cards, {progress: 'all'}), cards);
assert.deepEqual(filterCatalog(cards, {progress: 'in-progress', module: 'Grundlagen'}), [cards[0], cards[1]]);
assert.deepEqual(filterCatalog(cards, {progress: 'completed', topic: 'Daten'}), [cards[2]]);
const dashboard = createDashboardModel(cards, [{status: 'completed'}, {status: 'open'}]);
assert.deepEqual(dashboard.summary, {missionsCompleted: 1, missionsTotal: 3, checkpointsCompleted: 1, checkpointsTotal: 2});
assert.equal(dashboard.nextMission.id, 'ki-01');
assert.equal(dashboard.modules[0].completed, 0);

class Storage {
  constructor(values = {}) { this.values = new Map(Object.entries(values)); }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
}
const prefix = 'linguacode:ki-wp8:mission-01:v1:';
const storage = new Storage({
  [`${prefix}ki-01`]: JSON.stringify({version: 1, state: {phase: 1}}),
  [`${prefix}ki-02`]: JSON.stringify({version: 1, state: {completed: true}}),
  [`${prefix}ki-03`]: JSON.stringify({version: 99, state: {completed: true}}),
});
const progress = readCatalogProgress(storage, cards);
assert.equal(progress[0].status, 'in-progress');
assert.equal(progress[1].status, 'completed');
assert.equal(progress[2].status, 'unavailable');
assert.equal(storage.getItem(`${prefix}ki-03`), JSON.stringify({version: 99, state: {completed: true}}));
assert.equal(selectContinuation(cards, progress).href, './stunde-1/');
assert.equal(selectContinuation(cards, [{...progress[0], status: 'completed'}, ...progress.slice(1)]).href, './stunde-3/');

const presentationToggle = { attrs: {}, textContent: '', addEventListener(type, handler) { this.handler = handler; }, setAttribute(name, value) { this.attrs[name] = value; } };
const presentationDocument = { documentElement: { dataset: {} }, querySelector(selector) { return selector === '[data-presentation-toggle]' ? presentationToggle : null; } };
const presentationMemory = new Map();
const presentationStorage = { getItem: (key) => presentationMemory.get(key) ?? null, setItem: (key, value) => presentationMemory.set(key, value) };
const presentationController = createPresentationController({documentLike: presentationDocument, storage: presentationStorage});
presentationController.bind();
assert.equal(presentationDocument.documentElement.dataset.presentation, 'false');
assert.equal(presentationToggle.attrs['aria-pressed'], 'false');
presentationToggle.handler();
assert.equal(presentationDocument.documentElement.dataset.presentation, 'true');
assert.equal(presentationMemory.size, 1);
assert.match(presentationToggle.textContent, /beenden/i);
presentationToggle.handler();
assert.equal(presentationMemory.size, 1);
assert.equal(presentationDocument.documentElement.dataset.presentation, 'false');

const nodes = cards.map((card) => ({dataset: {...card, catalogCard: card.id, progress: 'not-started'}, hidden: false, progressLabel: {textContent: '', dataset: {}}}));
const controller = createCatalogController({documentLike: {
  querySelectorAll(selector) {
    if (selector === '[data-catalog-card]') return nodes;
    if (selector === '[data-progress-filter]') return [];
    return [];
  },
  querySelector() { return null; },
}, storage, cards});
assert.equal(typeof controller.apply, 'function');
controller.apply({progress: 'all', module: 'Grundlagen', topic: ''});
assert.equal(nodes[0].hidden, false);
assert.equal(nodes[2].hidden, true);
assert.equal(nodes[0].progressLabel.textContent, 'In Bearbeitung');
assert.equal(nodes[1].progressLabel.textContent, 'Abgeschlossen');
assert.equal(nodes[2].progressLabel.textContent, 'Nicht verfügbar');

console.log('PASS: continuation, local progress filters, metadata filters, malformed/future progress preservation, and local Smartboard preference.');
