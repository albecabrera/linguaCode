import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html = readFileSync(new URL('../pages/ki8/modul-4.html', import.meta.url), 'utf8');
const ui = readFileSync(new URL('../pages/ki8/module4-ui.mjs', import.meta.url), 'utf8');
for (const id of ['stunde-1', 'stunde-2', 'activities-1', 'activities-2']) assert.match(html, new RegExp(`id="${id}"`));
assert.match(html, /KI erkennt Muster/);
assert.match(html, /Muster/);
assert.match(html, /Ausreißer/);
assert.match(html, /type="module" src="\.\/module4-ui\.mjs"/);
assert.match(ui, /addEventListener\('submit'/);
for (const source of [html, ui]) {
  assert.doesNotMatch(source, /(?:localStorage|sessionStorage|fetch\(|https?:\/\/)/);
}
const {lessons, gradeChoice} = await import('../pages/ki8/module4-core.mjs');
assert.deepEqual(lessons.map(({id}) => id), ['stunde-1', 'stunde-2']);
assert.equal(lessons.every(({minutes, activities}) => minutes === 45 && activities.length === 2), true);
const prompts = lessons.flatMap(({activities}) => activities).map(({prompt}) => prompt).join(' ');
for (const term of ['Muster', 'Ähnlichkeit', 'Ausreißer']) assert.match(prompts, new RegExp(term));
for (const lesson of lessons) {
  for (const activity of lesson.activities) {
    assert.equal(gradeChoice(activity.id, activity.correct).correct, true);
    assert.equal(gradeChoice(activity.id, (activity.correct + 1) % activity.options.length).correct, false);
  }
}
assert.throws(() => gradeChoice('unknown', 0), RangeError);
console.log('PASS: module 4 has two original pattern-recognition hours with public-safe grading rules.');
