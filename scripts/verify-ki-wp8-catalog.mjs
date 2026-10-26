import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const catalog = readFileSync(new URL('../pages/index.html', import.meta.url), 'utf8');
const matches = [...catalog.matchAll(/<article data-subject="([^"]+)">([\s\S]*?)<\/article>/g)];
const course = matches.filter(([, , content]) => content.includes('<h2>UV Künstliche Intelligenz</h2>'));
assert.equal(course.length, 1, 'The course must appear exactly once in the LinguaCode catalog');
assert.equal(course[0][1], 'Informatik');
assert.match(course[0][2], /href="ki8\/"/);
assert.match(course[0][2], /data-share="ki8\/"/);
const coursePage = readFileSync(new URL('../pages/ki8/index.html', import.meta.url), 'utf8');
const courseApp = readFileSync(new URL('../pages/ki8/app.mjs', import.meta.url), 'utf8');
const module3Page = readFileSync(new URL('../pages/ki8/modul-3.html', import.meta.url), 'utf8');
assert.match(courseApp, /href = '#beispielkarte'/);
assert.match(coursePage, /id="beispielkarte"/);
for (const hour of [1, 2, 3, 4]) assert.match(module3Page, new RegExp(`id="stunde-${hour}"`));
assert.match(module3Page, /src="\.\/module3-ui\.mjs"/);
assert.ok(existsSync(new URL('../pages/ki8/index.html', import.meta.url)));
const dashboard = readFileSync(new URL('../public/index.php', import.meta.url), 'utf8');
const router = readFileSync(new URL('../public/router.php', import.meta.url), 'utf8');
assert.match(dashboard, /'title' => 'UV Künstliche Intelligenz'/);
assert.match(router, /\$path === '\/ki8'/);
const cards = matches.map(([, subject]) => ({dataset: {subject}, hidden: false}));
const buttons = ['all', 'Spanisch', 'Informatik'].map((filter) => ({
  dataset: {filter}, events: {}, classList: {toggle() {}}, setAttribute() {},
  addEventListener(name, handler) { this.events[name] = handler; },
  click() { this.events.click(); },
}));
const empty = {hidden: true};
const inert = {addEventListener() {}};
const document = {
  querySelectorAll(selector) {
    return selector === '[data-filter]' ? buttons : selector === '.grid article' ? cards : [];
  },
  querySelector(selector) { return selector === '#filter-empty' ? empty : inert; },
};
runInNewContext(readFileSync(new URL('../pages/assets/site.js', import.meta.url), 'utf8'), {document});
buttons[2].click();
assert.equal(cards[matches.findIndex(([, , content]) => content.includes('<h2>UV Künstliche Intelligenz</h2>'))].hidden, false);
assert.equal(cards[matches.findIndex(([, subject]) => subject === 'Spanisch')].hidden, true);
assert.equal(empty.hidden, true);
buttons[0].click();
assert.equal(cards.some(({hidden}) => hidden), false);
console.log('PASS: exact KI course card and Informatik filter, valid local route and teacher dashboard entry.');
