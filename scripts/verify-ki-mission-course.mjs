import assert from 'node:assert/strict';
import fs from 'node:fs';
import {derivePublicCourseUrl, getCourseProgress, initCourseIntegration, PROGRESS_KEY, renderQrSvg} from '../pages/ki8/mission/course-integration.mjs';
import {createProgressStore, PROGRESS_NAMESPACE} from '../pages/ki8/mission/progress.mjs';
import {classify, modules} from '../pages/ki8/course.mjs';
import {resolveMissionRoute} from '../pages/ki8/mission/mission.mjs';
const html = fs.readFileSync(new URL('../pages/ki8/index.html', import.meta.url), 'utf8');
assert.match(html, /href="\.\/stunde-1\/"/);
assert.match(html, /id="course-progress"/);
assert.match(html, /id="course-url"/);
assert.match(html, /<a id="course-qr" class="course-qr" href="https:\/\/albecabrera\.github\.io\/linguaCode\/ki8\/"/);
for (const mission of [1, 2, 3]) assert.match(html, new RegExp(`<a id="mission-0${mission}-qr" class="course-qr mission-qr" href="https://albecabrera\\.github\\.io/linguaCode/ki8/stunde-${mission}/"`));
assert.match(html, /<a class="mission-panel-link" href="\.\/stunde-4\/">/);
assert.match(html, /<a id="mission-04-qr" class="course-qr mission-qr" href="https:\/\/albecabrera\.github\.io\/linguaCode\/ki8\/stunde-4\//);
assert.match(html, /<a class="mission-panel-link" href="\.\/stunde-5\/">/);
assert.match(html, /<a id="mission-05-qr" class="course-qr mission-qr" href="https:\/\/albecabrera\.github\.io\/linguaCode\/ki8\/stunde-5\//);
assert.match(html, /<a class="mission-panel-link" href="\.\/stunde-6\/">/);
assert.match(html, /<a id="mission-06-qr" class="course-qr mission-qr" href="https:\/\/albecabrera\.github\.io\/linguaCode\/ki8\/stunde-6\//);
assert.match(html, /<a class="mission-panel-link" href="\.\/stunde-7\/">/);
assert.match(html, /<a id="mission-07-qr" class="course-qr mission-qr" href="https:\/\/albecabrera\.github\.io\/linguaCode\/ki8\/stunde-7\//);
assert.match(html, /<a class="mission-panel-link" href="\.\/stunde-8\/">/);
assert.match(html, /<a id="mission-08-qr" class="course-qr mission-qr" href="https:\/\/albecabrera\.github\.io\/linguaCode\/ki8\/stunde-8\//);
assert.deepEqual(resolveMissionRoute('/ki8/stunde-4/'), {path: '/ki8/stunde-4/', lessonId: 'ki-04', progressKey: 'ki-04'});
assert.deepEqual(resolveMissionRoute('/ki8/stunde-5/'), {path: '/ki8/stunde-5/', lessonId: 'ki-05', progressKey: 'ki-05'});
assert.deepEqual(resolveMissionRoute('/ki8/stunde-6/'), {path: '/ki8/stunde-6/', lessonId: 'ki-06', progressKey: 'ki-06'});
assert.deepEqual(resolveMissionRoute('/linguaCode/ki8/stunde-5/'), {path: '/ki8/stunde-5/', lessonId: 'ki-05', progressKey: 'ki-05'});
assert.deepEqual(resolveMissionRoute('/linguaCode/ki8/stunde-6/'), {path: '/ki8/stunde-6/', lessonId: 'ki-06', progressKey: 'ki-06'});
assert.deepEqual(resolveMissionRoute('/ki8/stunde-7/'), {path: '/ki8/stunde-7/', lessonId: 'ki-07', progressKey: 'ki-07'});
assert.deepEqual(resolveMissionRoute('/linguaCode/ki8/stunde-7/'), {path: '/ki8/stunde-7/', lessonId: 'ki-07', progressKey: 'ki-07'});
assert.deepEqual(resolveMissionRoute('/ki8/stunde-8/'), {path: '/ki8/stunde-8/', lessonId: 'ki-08', progressKey: 'ki-08'});
assert.deepEqual(resolveMissionRoute('/linguaCode/ki8/stunde-8/'), {path: '/ki8/stunde-8/', lessonId: 'ki-08', progressKey: 'ki-08'});
const mission04Shell = fs.readFileSync(new URL('../pages/ki8/stunde-4/index.html', import.meta.url), 'utf8');
assert.match(mission04Shell, /data-lesson-id="ki-04"/);
const mission05Shell = fs.readFileSync(new URL('../pages/ki8/stunde-5/index.html', import.meta.url), 'utf8');
assert.match(mission05Shell, /data-lesson-id="ki-05"/);
const mission06Shell = fs.readFileSync(new URL('../pages/ki8/stunde-6/index.html', import.meta.url), 'utf8');
assert.match(mission06Shell, /data-lesson-id="ki-06"/);
const mission07Shell = fs.readFileSync(new URL('../pages/ki8/stunde-7/index.html', import.meta.url), 'utf8');
assert.match(mission07Shell, /data-lesson-id="ki-07"/);
const mission08Shell = fs.readFileSync(new URL('../pages/ki8/stunde-8/index.html', import.meta.url), 'utf8');
assert.match(mission08Shell, /data-lesson-id="ki-08"/);
assert.doesNotMatch(html, /127\.0\.0\.1/);
assert.match(html, /<a class="mission-panel-link" href="\.\/stunde-3\/">/);
assert.match(html, /<span>Mission 03 starten →<\/span>/);
assert.match(html, /id="mission-list"/);
assert.equal([...html.matchAll(/<article class="mission-panel">/g)].length, 8);
assert.match(html, /href="\.\/stunde-1\/"/);
assert.match(html, /href="\.\/stunde-2\/"/);
assert.match(html, /href="\.\/stunde-5\/"/);
assert.match(html, /href="\.\/stunde-6\/"/);
assert.doesNotMatch(html, /href="\.\/modul-\d+\.html#stunde-\d+"/);
assert.doesNotMatch(html, /id="modules"|id="threshold-form"/);
assert.match(html, /id="course-page-link"/);
assert.match(html, /\.\.\/assets\/qrcode-generator\.min\.js/);
assert.equal(modules.reduce((total, module) => total + module.hours, 0), 18);
const app = fs.readFileSync(new URL('../pages/ki8/app.mjs', import.meta.url), 'utf8');
assert.match(app, /initCourseIntegration/);
assert.doesNotMatch(app, /item\.hours|#beispielkarte|threshold-form/);

const publicCourseUrl = 'https://albecabrera.github.io/linguaCode/ki8/';
assert.equal(derivePublicCourseUrl({href: 'http://127.0.0.1:8108/ki8/'}), publicCourseUrl);
assert.equal(derivePublicCourseUrl({href: 'https://example.test/linguaCode/ki8/index.html'}), publicCourseUrl);
assert.equal(derivePublicCourseUrl({href: 'https://school.example/linguaCode/ki8/'}), publicCourseUrl);
assert.equal(PROGRESS_KEY, 'ki-01');
const savedValues = new Map();
const savedStorage = {getItem: (key) => savedValues.get(key) ?? null, setItem: (key, value) => savedValues.set(key, value), removeItem: (key) => savedValues.delete(key)};
const savedStore = createProgressStore(savedStorage, 'ki-01');
assert.deepEqual(savedStore.save({phase: 'quiz', quizSubmitted: true}).status, 'success');
assert.deepEqual(getCourseProgress(savedStore), {available: true, completed: true, phase: 'quiz'});
assert.equal(savedValues.has(`${PROGRESS_NAMESPACE}:ki-01`), true);
assert.deepEqual(getCourseProgress({load: () => ({status: 'unavailable', reason: 'storage-error'})}), {available: false, reason: 'storage-error'});
assert.equal(renderQrSvg('https://example.test/linguaCode/ki8/', () => ({addData(value) { this.value = value; }, make() {}, createSvgTag() { return `<svg data-value="${this.value}"></svg>`; }})),  '<svg data-value="https://example.test/linguaCode/ki8/"></svg>');

class FakeElement {
  constructor() { this.events = {}; this.value = ''; this.innerHTML = ''; this.selected = false; this.focused = false; }
  addEventListener(type, handler) { this.events[type] = handler; }
  setAttribute(name, value) { this[name] = value; }
  focus() { this.focused = true; }
  select() { this.selected = true; }
}
class FakeDocument {
  constructor() { this.nodes = new Map(['#course-url', '#course-page-link', '#course-qr', '#mission-01-qr', '#mission-02-qr', '#mission-03-qr', '#mission-04-qr', '#mission-05-qr', '#mission-06-qr', '#mission-07-qr', '#mission-08-qr', '#course-progress', '#copy-course-url', '#copy-course-status'].map((id) => [id, new FakeElement()])); }
  querySelector(selector) { return this.nodes.get(selector) ?? null; }
  node(selector) { return this.nodes.get(selector); }
}
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
Object.defineProperty(globalThis, 'localStorage', {configurable: true, get: () => savedStorage});
Object.defineProperty(globalThis, 'navigator', {configurable: true, value: {clipboard: {writeText: async () => { throw new Error('denied'); }}}});
const dom = new FakeDocument();
const qrPayloads = [];
const qrAlts = [];
const initialized = initCourseIntegration({documentLike: dom, locationLike: {href: 'http://127.0.0.1:8108/ki8/'}, qrFactory: () => ({addData(value) { qrPayloads.push(value); }, make() {}, createSvgTag(options) { qrAlts.push(options.alt); return '<svg></svg>'; }})});
const missionUrls = Array.from({length: 8}, (_, index) => `${publicCourseUrl}stunde-${index + 1}/`);
assert.equal(initialized.url, publicCourseUrl);
assert.deepEqual(qrPayloads, [publicCourseUrl, ...missionUrls]);
assert.deepEqual(qrAlts, ['QR-Code für die öffentliche Kursseite', 'QR-Code für Mission 01', 'QR-Code für Mission 02', 'QR-Code für Mission 03', 'QR-Code für Mission 04', 'QR-Code für Mission 05', 'QR-Code für Mission 06', 'QR-Code für Mission 07', 'QR-Code für Mission 08']);
assert.equal(dom.node('#course-page-link').href, publicCourseUrl);
assert.equal(dom.node('#course-page-link').textContent, publicCourseUrl);
assert.equal(dom.node('#course-qr').href, publicCourseUrl);
for (const [index, url] of missionUrls.entries()) {
  const qr = dom.node(`#mission-0${index + 1}-qr`);
  assert.equal(qr.href, url);
  assert.match(qr.innerHTML, /<svg/);
  assert.doesNotMatch(qr.href, /127\.0\.0\.1|localhost/);
}
assert.match(dom.node('#course-qr').innerHTML, /<svg/);
assert.match(dom.node('#course-progress').textContent, /abgeschlossen/);
await dom.node('#copy-course-url').events.click();
assert.equal(dom.node('#course-url').selected, true);
assert.match(dom.node('#copy-course-status').textContent, /nicht verfügbar/);
if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage); else delete globalThis.localStorage;
Object.defineProperty(globalThis, 'localStorage', {configurable: true, get: () => { throw new Error('blocked'); }});
const unavailableDom = new FakeDocument();
initCourseIntegration({documentLike: unavailableDom, locationLike: {href: 'https://example.test/linguaCode/ki8/'}, qrFactory: null});
assert.match(unavailableDom.node('#course-progress').textContent, /nicht verfügbar/);
assert.equal(unavailableDom.node('#course-page-link').href, publicCourseUrl);
assert.equal(unavailableDom.node('#course-qr').href, publicCourseUrl);
for (const [index, url] of missionUrls.entries()) {
  assert.equal(unavailableDom.node(`#mission-0${index + 1}-qr`).href, url);
  assert.match(unavailableDom.node(`#mission-0${index + 1}-qr`).innerHTML, /QR-Code.*konnte/);
}
if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage); else delete globalThis.localStorage;
if (originalNavigator) Object.defineProperty(globalThis, 'navigator', originalNavigator); else delete globalThis.navigator;

assert.equal(classify(8, 8), 'unter oder gleich');
assert.equal(classify(8, 7), 'über');
console.log('PASS: mission-only overview, GitHub Pages link, QR payloads, progress fallback, 18 retained source hours, and threshold behavior.');
