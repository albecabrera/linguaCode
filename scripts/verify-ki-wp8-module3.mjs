import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html = readFileSync(new URL('../pages/ki8/modul-3.html', import.meta.url), 'utf8');
const ui = readFileSync(new URL('../pages/ki8/module3-ui.mjs', import.meta.url), 'utf8');
const app = readFileSync(new URL('../pages/ki8/app.mjs', import.meta.url), 'utf8');
assert.match(app, /modul-\$\{index \+ 1\}\.html/);
for (const id of ['stunde-1', 'stunde-2', 'stunde-3', 'stunde-4', 'activities-1', 'activities-2', 'activities-3', 'activities-4']) assert.match(html, new RegExp(`id="${id}"`));
assert.match(html, /Entscheidungsbaum/);
assert.match(html, /Trainingsdaten/);
assert.match(html, /Testdaten/);
assert.match(html, /Fehlklassifikation/);
assert.match(html, /type="module" src="\.\/module3-ui\.mjs"/);
assert.match(ui, /addEventListener\('submit'/);
for (const source of [html, ui]) {
  assert.doesNotMatch(source, /(?:localStorage|sessionStorage|fetch\(|https?:\/\/|Lösung_02_TrainingEinesEBaumsZurKlassifikation)/);
}
const {lessons, gradeChoice} = await import('../pages/ki8/module3-core.mjs');
assert.deepEqual(lessons.map(({id}) => id), ['stunde-1', 'stunde-2', 'stunde-3', 'stunde-4']);
assert.equal(lessons.every(({minutes, activities}) => minutes === 45 && activities.length === 2), true);
const prompts = lessons.flatMap(({activities}) => activities).map(({prompt}) => prompt).join(' ');
for (const term of ['Merkmal', 'Schwellenwert', 'Regel', 'Trainingsdaten', 'Testdaten', 'Fehlklassifikation']) assert.match(prompts, new RegExp(term));
for (const lesson of lessons) {
  for (const activity of lesson.activities) {
    const grades = activity.options.map((_, choice) => gradeChoice(activity.id, choice).correct);
    assert.equal(grades.filter(Boolean).length, 1, `${activity.id} must have exactly one correct option`);
    assert.equal(grades[activity.correct], true);
  }
}
assert.throws(() => gradeChoice('unknown', 0), RangeError);
assert.throws(() => gradeChoice(lessons[0].activities[0].id, -1), RangeError);
assert.throws(() => gradeChoice(lessons[0].activities[0].id, lessons[0].activities[0].options.length), RangeError);
assert.throws(() => gradeChoice(lessons[0].activities[0].id, 0.5), RangeError);
console.log('PASS: module 3 has four original decision-tree hours with public-safe grading rules.');
