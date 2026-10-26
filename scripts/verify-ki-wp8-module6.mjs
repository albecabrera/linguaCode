import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const {lessons, gradeChoice} = await import('../pages/ki8/module6-core.mjs');
assert.deepEqual(lessons.map(({id}) => id), ['stunde-1', 'stunde-2', 'stunde-3', 'stunde-4', 'stunde-5']);
assert.deepEqual(lessons.map(({minutes}) => minutes), [45, 45, 45, 45, 45]);
assert.equal(lessons.length, 5);
assert.deepEqual(lessons.map(({activities}) => activities.length), [2, 2, 2, 2, 2]);
for (const lesson of lessons) {
  for (const activity of lesson.activities) {
    assert.ok(activity.prompt.length > 30);
    assert.ok(activity.options.length >= 3);
    assert.equal(gradeChoice(activity.id, activity.correct).correct, true);
    const wrong = (activity.correct + 1) % activity.options.length;
    const result = gradeChoice(activity.id, wrong);
    assert.equal(result.correct, false);
    assert.ok(result.explanation.length > 20);
  }
}
assert.throws(() => gradeChoice('unbekannt', 0), RangeError);
assert.throws(() => gradeChoice(lessons[0].activities[0].id, -1), RangeError);
const html = readFileSync(new URL('../pages/ki8/modul-6.html', import.meta.url), 'utf8');
const ui = readFileSync(new URL('../pages/ki8/module6-ui.mjs', import.meta.url), 'utf8');
for (let index = 1; index <= 5; index += 1) {
  assert.match(html, new RegExp(`id="stunde-${index}"`));
  assert.match(html, new RegExp(`id="activities-${index}"`));
  assert.match(html, new RegExp(`id="progress-${index}"`));
}
for (const topic of ['kritisch', 'Fehlinformation', 'Privatsphäre', 'Vorurteil', 'verantwort']) assert.match(`${html}\n${ui}`, new RegExp(topic, 'i'));
assert.match(html, /type="module" src="\.\/module6-ui\.mjs"/);
assert.match(ui, /addEventListener\('submit'/);
for (const source of [html, ui]) assert.doesNotMatch(source, /(?:localStorage|sessionStorage|fetch\(|https?:\/\/)/);
console.log('PASS: module 6 has five 45-minute German lessons with original graded activities and no storage or network.');
