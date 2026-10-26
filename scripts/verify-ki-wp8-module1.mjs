import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

class Element {
  constructor(tag) { this.tag = tag; this.children = []; this.textContent = ''; this.events = {}; this.hidden = false; }
  append(...children) { this.children.push(...children); }
  addEventListener(name, fn) { this.events[name] = fn; }
  get links() { return this.children.filter((child) => child.tag === 'a').map((child) => child.href); }
}
const modules = new Element('div');
const form = new Element('form');
globalThis.document = {
  querySelector(selector) { return selector === '#modules' ? modules : form; },
  createElement(tag) { return new Element(tag); },
};
await import('../pages/ki8/app.mjs');
assert.deepEqual(modules.children[0].links, ['./modul-1.html#stunde-1', './modul-1.html#stunde-2'], 'The first two hours must be independently openable');
assert.deepEqual(modules.children[2].links, ['#beispielkarte'], 'Existing decision-tree card must remain available');

const {lessons, gradeChoice} = await import('../pages/ki8/module1-core.mjs');
assert.deepEqual(lessons.map(({id}) => id), ['stunde-1', 'stunde-2']);
assert.deepEqual(lessons.map(({minutes}) => minutes), [45, 45]);
for (const lesson of lessons) {
  assert.equal(lesson.activities.length, 2);
  for (const activity of lesson.activities) {
    assert.equal(activity.options.length >= 2, true);
    assert.equal(gradeChoice(activity.id, activity.correct).correct, true);
    const wrong = (activity.correct + 1) % activity.options.length;
    assert.equal(gradeChoice(activity.id, wrong).correct, false);
    assert.ok(gradeChoice(activity.id, wrong).explanation.length > 20);
  }
}
assert.throws(() => gradeChoice('unknown', 0), RangeError);
assert.throws(() => gradeChoice(lessons[0].activities[0].id, -1), RangeError);
const html = readFileSync(new URL('../pages/ki8/modul-1.html', import.meta.url), 'utf8');
const ui = readFileSync(new URL('../pages/ki8/module1-ui.mjs', import.meta.url), 'utf8');
for (const id of ['stunde-1', 'stunde-2', 'activities-1', 'activities-2']) assert.match(html, new RegExp(`id="${id}"`));
assert.match(html, /type="module" src="\.\/module1-ui\.mjs"/);
assert.match(ui, /addEventListener\('submit'/);
assert.match(ui, /textContent/);
for (const source of [html, ui]) assert.doesNotMatch(source, /(?:localStorage|sessionStorage|fetch\(|https?:\/\/|Lösung_02_TrainingEinesEBaums)/);
console.log('PASS: both first hours open, have two graded interactions each, reject invalid answers, preserve module 3 and avoid storage/network.');
