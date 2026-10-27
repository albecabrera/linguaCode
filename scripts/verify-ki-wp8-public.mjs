import assert from 'node:assert/strict';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const catalog = readFileSync(new URL('../pages/index.html', import.meta.url), 'utf8');
const cards = [...catalog.matchAll(/<article data-subject="([^"]+)">([\s\S]*?)<\/article>/g)];
const matches = cards.filter(([, , html]) => html.includes('<h2>UV Künstliche Intelligenz</h2>'));
assert.equal(matches.length, 1);
assert.equal(matches[0][1], 'Informatik');
assert.match(matches[0][2], /href="ki8\//);
assert.match(matches[0][2], /data-share="ki8\//);
const folder = new URL('../pages/ki8/', import.meta.url);
const expectedFiles = [
  'app.mjs', 'course.mjs', 'index.html', 'modul-1.html', 'modul-2.html', 'modul-3.html',
  'modul-4.html', 'modul-5.html', 'modul-6.html', 'module1-core.mjs', 'module1-ui.mjs',
  'module2-core.mjs', 'module2-ui.mjs', 'module3-core.mjs', 'module3-ui.mjs',
  'module4-core.mjs', 'module4-ui.mjs', 'module5-core.mjs', 'module5-ui.mjs',
  'module6-core.mjs', 'module6-ui.mjs', 'style.css', 'mission', 'stunde-1', 'stunde-2', 'stunde-3', 'stunde-4', 'stunde-5',
];
assert.deepEqual(readdirSync(folder).sort(), expectedFiles.sort());
const entry = readFileSync(new URL('index.html', folder), 'utf8');
assert.doesNotMatch(entry, /http-equiv="refresh"/);
assert.match(entry, /id="mission-list"/);
for (const hour of [1, 2, 3, 4]) assert.match(entry, new RegExp(`href="\\./stunde-${hour}/"`));
assert.doesNotMatch(entry, /href="\.\/modul-\d+\.html#stunde-\d+"|id="modules"|id="beispielkarte"/);
const app = readFileSync(new URL('app.mjs', folder), 'utf8');
assert.match(app, /initCourseIntegration/);
assert.doesNotMatch(app, /modul-\$\{index \+ 1\}\.html#stunde-\$\{hour\}/);
const missionTwoRoute = readFileSync(new URL('stunde-2/index.html', folder), 'utf8');
assert.match(missionTwoRoute, /data-lesson-id="ki-02"/);
assert.match(missionTwoRoute, /mission\.mjs/);
assert.doesNotMatch(missionTwoRoute, /Lösung_02_TrainingEinesBaums|teacher-only/i);
const missionFourRoute = readFileSync(new URL('stunde-4/index.html', folder), 'utf8');
assert.match(missionFourRoute, /data-lesson-id="ki-04"/);
assert.match(missionFourRoute, /mission\.mjs/);
const missionFiveRoute = readFileSync(new URL('stunde-5/index.html', folder), 'utf8');
assert.match(missionFiveRoute, /data-lesson-id="ki-05"/);
assert.match(missionFiveRoute, /mission\.mjs/);
const publicSources = [catalog, entry, app, missionTwoRoute, missionFourRoute, missionFiveRoute, readFileSync(new URL('course.mjs', folder), 'utf8')];
for (let module = 1; module <= 6; module += 1) {
  const html = readFileSync(new URL(`modul-${module}.html`, folder), 'utf8');
  if (module === 1) assert.match(html, /href="stunde-2\/"[^>]*>Mission 02 starten[^<]*<\/a>/);
  if (module === 2) assert.match(html, /href="stunde-3\/"[^>]*>Mission 03 starten[^<]*<\/a>/);
  const hours = [2, 2, 4, 2, 3, 5][module - 1];
  for (let hour = 1; hour <= hours; hour += 1) {
    assert.match(html, new RegExp(`id="stunde-${hour}"`));
    assert.match(html, new RegExp(`id="activities-${hour}"`));
  }
  assert.match(html, new RegExp(`type="module" src="\\./module${module}-ui\\.mjs"`));
  publicSources.push(html, readFileSync(new URL(`module${module}-ui.mjs`, folder), 'utf8'), readFileSync(new URL(`module${module}-core.mjs`, folder), 'utf8'));
}
for (const source of publicSources) {
  assert.doesNotMatch(source, /(?:localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|Lösung_02_TrainingEinesBaums|\.pdf|docs\/ki-wp8\/demo)/i);
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
console.log('PASS: public-only KI card, mission-only overview, six retained module sources with 18 hour anchors, offline feedback rules and existing subject filter.');
