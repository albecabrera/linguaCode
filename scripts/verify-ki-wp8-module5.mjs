import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html = readFileSync(new URL('../pages/ki8/modul-5.html', import.meta.url), 'utf8');
const ui = readFileSync(new URL('../pages/ki8/module5-ui.mjs', import.meta.url), 'utf8');
for (const id of ['stunde-1', 'stunde-2', 'stunde-3', 'activities-1', 'activities-2', 'activities-3']) assert.match(html, new RegExp(`id="${id}"`));
for (const term of ['Intent', 'Regel', 'gelernt', 'unbekannt', 'Fallback']) assert.match(html, new RegExp(term, 'i'));
assert.match(html, /type="module" src="\.\/module5-ui\.mjs"/);
assert.match(ui, /addEventListener\('submit'/);
for (const source of [html, ui]) {
  assert.doesNotMatch(source, /(?:localStorage|sessionStorage|fetch\(|https?:\/\/|WebSocket|indexedDB)/i);
}
const {lessons, gradeChoice} = await import('../pages/ki8/module5-core.mjs');
assert.deepEqual(lessons.map(({id}) => id), ['stunde-1', 'stunde-2', 'stunde-3']);
assert.equal(lessons.every(({minutes, activities}) => minutes === 45 && activities.length === 2), true);
const prompts = lessons.flatMap(({activities}) => activities).map(({prompt}) => prompt).join(' ');
for (const term of ['Intent', 'Regel', 'gelernt', 'unbekannt']) assert.match(prompts, new RegExp(term, 'i'));
for (const lesson of lessons) {
  for (const activity of lesson.activities) {
    assert.equal(gradeChoice(activity.id, activity.correct).correct, true);
    assert.equal(gradeChoice(activity.id, (activity.correct + 1) % activity.options.length).correct, false);
  }
}
assert.throws(() => gradeChoice('unknown', 0), RangeError);
console.log('PASS: module 5 has three original chatbot hours with intent rules, learned AI, and unknown-input fallback.');
