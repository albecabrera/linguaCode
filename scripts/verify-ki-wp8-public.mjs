import assert from 'node:assert/strict';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const catalog = readFileSync(new URL('../pages/index.html', import.meta.url), 'utf8');
const cards = [...catalog.matchAll(/<article\b[^>]*\bdata-subject="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g)];
const matches = cards.filter(([, , html]) => html.includes('<h2>UV Künstliche Intelligenz</h2>'));
assert.equal(matches.length, 1);
assert.equal(matches[0][1], 'Informatik');
assert.match(matches[0][2], /Informatik · WP 8 · 18 Missionen/);
assert.match(matches[0][2], /Achtzehn interaktive Missionen/);
assert.doesNotMatch(matches[0][2], /Zwei interaktive Unterrichtsstunden|Entwurf/);
assert.match(matches[0][2], /href="ki8\//);
assert.match(matches[0][2], /data-share="ki8\//);
assert.match(catalog, /<article\b[^>]*class="course-featured"[^>]*>[\s\S]*?<h2>UV Künstliche Intelligenz<\/h2>/);
const folder = new URL('../pages/ki8/', import.meta.url);
const expectedFiles = [
  'app.mjs', 'index.html', 'style.css', 'mission', 'stunde-1', 'stunde-2', 'stunde-3', 'stunde-4', 'stunde-5', 'stunde-6', 'stunde-7', 'stunde-8', 'stunde-9', 'stunde-10', 'stunde-11', 'stunde-12', 'stunde-13', 'stunde-14', 'stunde-15', 'stunde-16', 'stunde-17', 'stunde-18',
];
assert.deepEqual(readdirSync(folder).sort(), expectedFiles.sort());
const entry = readFileSync(new URL('index.html', folder), 'utf8');
assert.doesNotMatch(entry, /http-equiv="refresh"/);
assert.match(entry, /id="mission-list"/);
assert.match(entry, /Öffentlicher Lernpfad · 18 Missionen/);
assert.match(entry, /<button[^>]*data-theme-toggle[^>]*aria-pressed="false"[^>]*>[\s\S]*data-theme-icon/);
assert.match(entry, /id="course-roadmap"/);
assert.match(entry, /6 Module · 18 Missionen/);
for (const label of ['Grundlagen', 'Entscheidungsbäume', 'Muster erkennen', 'Chatbots', 'Kritisch &amp; verantwortlich']) assert.match(entry, new RegExp(`>${label}<`));
for (const hour of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]) assert.match(entry, new RegExp(`href="\\./stunde-${hour}/"`));
assert.doesNotMatch(entry, /href="\.\/modul-\d+\.html#stunde-\d+"|id="modules"|id="beispielkarte"/);
const catalogStyle = readFileSync(new URL('style.css', folder), 'utf8');
const integrationStyle = readFileSync(new URL('mission/course-integration.css', folder), 'utf8');
assert.match(catalogStyle, /main \{ max-width: none;/);
assert.match(catalogStyle, /padding: 1rem max\(1rem, calc\(\(100vw - 1760px\)\/2\)\)/);
assert.match(integrationStyle, /grid-template-columns: repeat\(auto-fit, minmax\(min\(100%, 18rem\), 1fr\)\)/);
for (const tone of [/mission-panel:nth-child\(6n \+ 1\)/, /mission-panel:nth-child\(6n \+ 2\)/, /mission-panel:nth-child\(6n \+ 3\)/]) assert.match(integrationStyle, tone);
const app = readFileSync(new URL('app.mjs', folder), 'utf8');
assert.match(app, /from '\.\/mission\/theme\.mjs'/);
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
const missionSixRoute = readFileSync(new URL('stunde-6/index.html', folder), 'utf8');
assert.match(missionSixRoute, /data-lesson-id="ki-06"/);
assert.match(missionSixRoute, /mission\.mjs/);
const missionSevenRoute = readFileSync(new URL('stunde-7/index.html', folder), 'utf8');
assert.match(missionSevenRoute, /data-lesson-id="ki-07"/);
assert.match(missionSevenRoute, /mission\.mjs/);
const missionEightRoute = readFileSync(new URL('stunde-8/index.html', folder), 'utf8');
assert.match(missionEightRoute, /data-lesson-id="ki-08"/);
assert.match(missionEightRoute, /mission\.mjs/);
const missionNineRoute = readFileSync(new URL('stunde-9/index.html', folder), 'utf8');
assert.match(missionNineRoute, /data-lesson-id="ki-09"/);
assert.match(missionNineRoute, /mission\.mjs/);
const missionTenRoute = readFileSync(new URL('stunde-10/index.html', folder), 'utf8');
assert.match(missionTenRoute, /data-lesson-id="ki-10"/);
assert.match(missionTenRoute, /mission\.mjs/);
const missionElevenRoute = readFileSync(new URL('stunde-11/index.html', folder), 'utf8');
assert.match(missionElevenRoute, /data-lesson-id="ki-11"/);
assert.match(missionElevenRoute, /mission\.mjs/);
const missionTwelveRoute = readFileSync(new URL('stunde-12/index.html', folder), 'utf8');
assert.match(missionTwelveRoute, /data-lesson-id="ki-12"/);
assert.match(missionTwelveRoute, /mission\.mjs/);
const missionThirteenRoute = readFileSync(new URL('stunde-13/index.html', folder), 'utf8');
assert.match(missionThirteenRoute, /data-lesson-id="ki-13"/);
assert.match(missionThirteenRoute, /mission\.mjs/);
const missionFourteenRoute = readFileSync(new URL('stunde-14/index.html', folder), 'utf8');
assert.match(missionFourteenRoute, /data-lesson-id="ki-14"/);
assert.match(missionFourteenRoute, /mission\.mjs/);
const missionFifteenRoute = readFileSync(new URL('stunde-15/index.html', folder), 'utf8');
assert.match(missionFifteenRoute, /data-lesson-id="ki-15"/);
assert.match(missionFifteenRoute, /mission\.mjs/);
const missionSixteenRoute = readFileSync(new URL('stunde-16/index.html', folder), 'utf8');
assert.match(missionSixteenRoute, /data-lesson-id="ki-16"/);
assert.match(missionSixteenRoute, /mission\.mjs/);
const missionSeventeenRoute = readFileSync(new URL('stunde-17/index.html', folder), 'utf8');
assert.match(missionSeventeenRoute, /data-lesson-id="ki-17"/);
assert.match(missionSeventeenRoute, /mission\.mjs/);
const missionEighteenRoute = readFileSync(new URL('stunde-18/index.html', folder), 'utf8');
assert.match(missionEighteenRoute, /data-lesson-id="ki-18"/);
assert.match(missionEighteenRoute, /mission\.mjs/);
const publicSources = [catalog, entry, app, missionTwoRoute, missionFourRoute, missionFiveRoute, missionSixRoute, missionSevenRoute, missionEightRoute, missionNineRoute, missionTenRoute, missionElevenRoute, missionTwelveRoute, missionThirteenRoute, missionFourteenRoute, missionFifteenRoute, missionSixteenRoute, missionSeventeenRoute, missionEighteenRoute];
for (const source of publicSources) {
  assert.doesNotMatch(source, /(?:localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|Lösung_02_TrainingEinesBaums|\.pdf|docs\/ki-wp8\/demo)/i);
}
assert.equal(existsSync(new URL('../docs/ki-wp8/demo/index.html', import.meta.url)), false);
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
console.log('PASS: public-only KI card, mission-only overview, 18 mission routes, local-only privacy rules and existing subject filter.');
