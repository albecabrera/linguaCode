import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createCatalogController, filterCatalog, readCatalogProgress, selectContinuation} from '../pages/ki8/catalog.mjs';

const entry = readFileSync(new URL('../pages/ki8/index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../pages/ki8/app.mjs', import.meta.url), 'utf8');
const style = readFileSync(new URL('../pages/ki8/style.css', import.meta.url), 'utf8');

assert.match(entry, /id="continue-course"/);
assert.match(entry, /Kurs (fortsetzen|starten)/);
assert.match(entry, /id="catalog-filters"/);
assert.match(entry, /data-progress-filter="all"/);
assert.match(entry, /data-progress-filter="in-progress"/);
assert.match(entry, /data-progress-filter="completed"/);
assert.match(entry, /data-module-filter/);
assert.match(entry, /data-topic-filter/);
assert.match(entry, /href="\.\/teacher\/"[^>]*>Lokale Lehransicht öffnen/);
assert.match(app, /createCatalogController/);
assert.match(style, /catalog-filters/);

const cards = [
  {id: 'ki-01', module: 'Grundlagen', topic: 'KI', href: './stunde-1/', status: 'in-progress'},
  {id: 'ki-02', module: 'Grundlagen', topic: 'Training', href: './stunde-2/', status: 'in-progress'},
  {id: 'ki-03', module: 'Daten', topic: 'Daten', href: './stunde-3/', status: 'completed'},
];
assert.deepEqual(filterCatalog(cards, {progress: 'all'}), cards);
assert.deepEqual(filterCatalog(cards, {progress: 'in-progress', module: 'Grundlagen'}), [cards[0], cards[1]]);
assert.deepEqual(filterCatalog(cards, {progress: 'completed', topic: 'Daten'}), [cards[2]]);

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

const nodes = cards.map((card) => ({dataset: {...card, catalogCard: card.id, progress: 'not-started'}, hidden: false}));
const controller = createCatalogController({documentLike: {
  querySelectorAll(selector) {
    if (selector === '[data-catalog-card]') return nodes;
    if (selector === '[data-progress-filter]') return [];
    return [];
  },
  querySelector() { return null; },
}, cards});
assert.equal(typeof controller.apply, 'function');
controller.apply({progress: 'all', module: 'Grundlagen', topic: ''});
assert.equal(nodes[0].hidden, false);
assert.equal(nodes[2].hidden, true);

console.log('PASS: continuation, local progress filters, metadata filters, and malformed/future progress preservation.');
