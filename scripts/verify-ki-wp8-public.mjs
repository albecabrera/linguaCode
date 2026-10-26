import assert from 'node:assert/strict';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const catalog = readFileSync(new URL('../pages/index.html', import.meta.url), 'utf8');
const cards = [...catalog.matchAll(/<article data-subject="([^"]+)">([\s\S]*?)<\/article>/g)];
const matches = cards.filter(([, , html]) => html.includes('<h2>UV Künstliche Intelligenz</h2>'));
assert.equal(matches.length, 1);
assert.equal(matches[0][1], 'Informatik');
assert.match(matches[0][2], /href="ki8\/"/);
assert.match(matches[0][2], /data-share="ki8\/"/);
const folder = new URL('../pages/ki8/', import.meta.url);
assert.deepEqual(readdirSync(folder).sort(), ['index.html', 'modul-1.html', 'module1-core.mjs', 'module1-ui.mjs', 'style.css']);
const entry = readFileSync(new URL('index.html', folder), 'utf8');
assert.match(entry, /content="0; url=\.\/modul-1\.html"/);
assert.match(entry, /href="\.\/modul-1\.html"/);
const html = readFileSync(new URL('modul-1.html', folder), 'utf8');
for (const anchor of ['stunde-1', 'stunde-2', 'activities-1', 'activities-2']) {
  assert.match(html, new RegExp(`id="${anchor}"`));
}
assert.equal((html.match(/href="\.\.\/"/g) || []).length, 3);
assert.match(html, /type="module" src="\.\/module1-ui\.mjs"/);
const ui = readFileSync(new URL('module1-ui.mjs', folder), 'utf8');
const core = readFileSync(new URL('module1-core.mjs', folder), 'utf8');
for (const source of [catalog, entry, html, ui, core]) {
  assert.doesNotMatch(source, /(?:localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|Lösung_02_TrainingEinesEBaums)/);
}
assert.equal(existsSync(new URL('../docs/ki-wp8/demo/index.html', import.meta.url)), false);
const {lessons, gradeChoice} = await import('../pages/ki8/module1-core.mjs');
assert.deepEqual(lessons.map(({id, minutes}) => [id, minutes]), [['stunde-1', 45], ['stunde-2', 45]]);
for (const lesson of lessons) {
  assert.equal(lesson.activities.length, 2);
  for (const item of lesson.activities) {
    assert.equal(gradeChoice(item.id, item.correct).correct, true);
    assert.equal(gradeChoice(item.id, (item.correct + 1) % item.options.length).correct, false);
  }
}
assert.throws(() => gradeChoice('unknown', 0), RangeError);
const exerciseCards = cards.map(([, subject]) => ({dataset: {subject}, hidden: false}));
const buttons = ['all', 'Informatik', 'Spanisch'].map((filter) => ({
  dataset: {filter}, events: {}, classList: {toggle() {}}, setAttribute() {},
  addEventListener(name, handler) { this.events[name] = handler; }, click() { this.events.click(); },
}));
const inert = {addEventListener() {}};
const doc = {
  querySelectorAll(selector) { return selector === '[data-filter]' ? buttons : selector === '.grid article' ? exerciseCards : []; },
  querySelector(selector) { return selector === '#filter-empty' ? {hidden: true} : inert; },
};
runInNewContext(readFileSync(new URL('../pages/assets/site.js', import.meta.url), 'utf8'), {document: doc});
buttons[1].click();
assert.equal(exerciseCards[cards.indexOf(matches[0])].hidden, false);
assert.equal(exerciseCards[cards.findIndex(([, subject]) => subject === 'Spanisch')].hidden, true);
buttons[0].click();
assert.equal(exerciseCards.some(({hidden}) => hidden), false);
console.log('PASS: public-only KI card, two hours, offline feedback rules, safe files and existing subject filter.');
