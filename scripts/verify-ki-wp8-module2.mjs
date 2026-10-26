import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html = readFileSync(new URL('../pages/ki8/modul-2.html', import.meta.url), 'utf8');
const ui = readFileSync(new URL('../pages/ki8/module2-ui.mjs', import.meta.url), 'utf8');
const app = readFileSync(new URL('../pages/ki8/app.mjs', import.meta.url), 'utf8');
assert.match(app, /modul-\$\{index \+ 1\}\.html/);
for (const id of ['stunde-1', 'stunde-2', 'activities-1', 'activities-2']) assert.match(html, new RegExp(`id="${id}"`));
assert.match(html, /Merkmal|Feature/);
assert.match(html, /Fehlklassifikation/);
assert.match(html, /type="module" src="\.\/module2-ui\.mjs"/);
assert.match(ui, /addEventListener\('submit'/);
for (const source of [html, ui]) {
  assert.doesNotMatch(source, /(?:localStorage|sessionStorage|fetch\(|https?:\/\/|Lösung_02_TrainingEinesEBaums)/);
}
const {lessons, gradeChoice} = await import('../pages/ki8/module2-core.mjs');
assert.deepEqual(lessons.map(({id}) => id), ['stunde-1', 'stunde-2']);
assert.equal(lessons.every(({activities}) => activities.length === 2), true);
assert.ok(lessons.flatMap(({activities}) => activities).some(({prompt}) => /Fehlklassifikation/.test(prompt)));
assert.ok(lessons.flatMap(({activities}) => activities).some(({prompt}) => /Trainings|Testdaten/.test(prompt)));
for (const lesson of lessons) {
  for (const activity of lesson.activities) {
    assert.equal(gradeChoice(activity.id, activity.correct).correct, true);
    assert.equal(gradeChoice(activity.id, (activity.correct + 1) % activity.options.length).correct, false);
  }
}
assert.throws(() => gradeChoice('unknown', 0), RangeError);
console.log('PASS: module 2 is reachable, original feature/label/threshold/train-test/misclassification activities are interactive, and page-only safeguards remain.');
