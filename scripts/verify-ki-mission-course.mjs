import assert from 'node:assert/strict';
import fs from 'node:fs';
import {derivePublicCourseUrl, getCourseProgress, initCourseIntegration, PROGRESS_KEY, renderQrSvg} from '../pages/ki8/mission/course-integration.mjs';
import {createProgressStore, PROGRESS_NAMESPACE} from '../pages/ki8/mission/progress.mjs';
import {classify, modules} from '../pages/ki8/course.mjs';
const html = fs.readFileSync(new URL('../pages/ki8/index.html', import.meta.url), 'utf8');
assert.match(html, /href="\.\/stunde-1\/"/);
assert.match(html, /id="course-progress"/);
assert.match(html, /id="course-url"/);
assert.match(html, /<a id="course-qr" class="course-qr" href="\.\/"/);
assert.match(html, /<a id="mission-03-qr" class="course-qr" href="\.\/stunde-3\/"/);
assert.match(html, /href="\.\/stunde-3\/">Mission 03 starten/);
assert.match(html, /\.\.\/assets\/qrcode-generator\.min\.js/);
assert.equal(modules.reduce((total, module) => total + module.hours, 0), 18);
const app = fs.readFileSync(new URL('../pages/ki8/app.mjs', import.meta.url), 'utf8');
assert.match(app, /item\.hours/);
assert.match(app, /#beispielkarte/);

assert.equal(derivePublicCourseUrl({href: 'https://example.test/linguaCode/ki8/'}), 'https://example.test/linguaCode/ki8/');
assert.equal(derivePublicCourseUrl({href: 'https://example.test/linguaCode/ki8/index.html'}), 'https://example.test/linguaCode/ki8/');
assert.equal(derivePublicCourseUrl({href: 'https://school.example/linguaCode/ki8/'}), 'https://school.example/linguaCode/ki8/');
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
  constructor() { this.nodes = new Map(['#course-url', '#course-qr', '#mission-03-qr', '#course-progress', '#copy-course-url', '#copy-course-status'].map((id) => [id, new FakeElement()])); }
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
const initialized = initCourseIntegration({documentLike: dom, locationLike: {href: 'https://example.test/linguaCode/ki8/'}, qrFactory: () => ({addData(value) { qrPayloads.push(value); }, make() {}, createSvgTag(options) { qrAlts.push(options.alt); return '<svg></svg>'; }})});
assert.equal(initialized.url, 'https://example.test/linguaCode/ki8/');
assert.deepEqual(qrPayloads, [initialized.url, 'https://example.test/linguaCode/ki8/stunde-3/']);
assert.deepEqual(qrAlts, ['QR-Code für die öffentliche Kursseite', 'QR-Code für Mission 03']);
assert.equal(dom.node('#course-qr').href, initialized.url);
assert.equal(dom.node('#mission-03-qr').href, 'https://example.test/linguaCode/ki8/stunde-3/');
assert.match(dom.node('#course-qr').innerHTML, /<svg/);
assert.match(dom.node('#mission-03-qr').innerHTML, /<svg/);
assert.match(dom.node('#course-progress').textContent, /abgeschlossen/);
await dom.node('#copy-course-url').events.click();
assert.equal(dom.node('#course-url').selected, true);
assert.match(dom.node('#copy-course-status').textContent, /nicht verfügbar/);
if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage); else delete globalThis.localStorage;
Object.defineProperty(globalThis, 'localStorage', {configurable: true, get: () => { throw new Error('blocked'); }});
const unavailableDom = new FakeDocument();
initCourseIntegration({documentLike: unavailableDom, locationLike: {href: 'https://example.test/linguaCode/ki8/'}, qrFactory: null});
assert.match(unavailableDom.node('#course-progress').textContent, /nicht verfügbar/);
assert.equal(unavailableDom.node('#course-qr').href, 'https://example.test/linguaCode/ki8/');
assert.equal(unavailableDom.node('#mission-03-qr').href, 'https://example.test/linguaCode/ki8/stunde-3/');
assert.match(unavailableDom.node('#mission-03-qr').innerHTML, /QR-Code konnte/);
if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage); else delete globalThis.localStorage;
if (originalNavigator) Object.defineProperty(globalThis, 'navigator', originalNavigator); else delete globalThis.navigator;

const links = modules.flatMap((module, moduleIndex) => Array.from({length: module.hours}, (_, hourIndex) => `./modul-${moduleIndex + 1}.html#stunde-${hourIndex + 1}`));
assert.equal(links.length, 18);
assert.equal(links.at(-1), './modul-6.html#stunde-5');
assert.equal(classify(8, 8), 'unter oder gleich');
assert.equal(classify(8, 7), 'über');
console.log('PASS: public course URL, QR payload, progress fallback, real init/copy events, 18 links, and threshold behavior.');
