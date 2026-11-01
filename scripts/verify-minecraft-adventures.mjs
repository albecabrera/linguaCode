import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const catalog = read('../pages/index.html');
const entry = [...catalog.matchAll(/<article[^>]*data-subject="Informatik"[^>]*>([\s\S]*?)<\/article>/g)]
  .map(([, body]) => body)
  .filter((body) => body.includes('<h2>Blockprogrammierung mit Minecraft</h2>'));
assert.equal(entry.length, 1, 'Minecraft hub appears exactly once in the Informatik catalog');
assert.match(entry[0], /href="minecraft-adventures\/"/);
assert.match(entry[0], /data-share="s\/w\/"/);

const page = read('../pages/minecraft-adventures/index.html');
const cards = [...page.matchAll(/<article[^>]*data-adventure="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g)];
assert.deepEqual(cards.map(([, key]) => key), ['designer', 'aquatic', 'hero'], 'Adventure cards follow the user-provided difficulty order');
const expected = [
  ['designer', 'Minecraft Designer', 'https://studio.code.org/courses/minecraft/units/1?utm_source=chatgpt.com'],
  ['aquatic', 'Voyage Aquatic', 'https://studio.code.org/de/courses/aquatic/units/1?utm_source=chatgpt.com'],
  ['hero', 'Hero’s Journey', 'https://studio.code.org/courses/hero/units/1?utm_source=chatgpt.com'],
];
for (let index = 0; index < expected.length; index++) {
  const [key, title, url] = expected[index];
  assert.match(cards[index][2], new RegExp(`<h[23]>${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/h[23]>`));
  assert.ok(cards[index][2].includes(`href="${url}"`), `${title} opens its requested unit URL`);
  assert.ok(cards[index][2].includes(`data-share="${url}"`), `${title} QR shares its requested unit URL`);
  assert.ok(cards[index][2].includes('target="_blank" rel="noopener noreferrer"'));
  assert.equal(cards[index][1], key);
}
assert.match(cards[1][2], /https:\/\/studio\.code\.org\/de\/courses\/aquatic\/units\/1\/lessons\/1\/levels\/1/, 'Aquatic Level 1 remains available as the starter entry');
assert.match(cards[2][2], /https:\/\/studio\.code\.org\/s\/hero\/lessons\/1\/levels\/1\?utm_source=chatgpt\.com/, 'Hero direct Level 1 entry is available');
assert.match(page, /aria-label="Minecraft-Adventures nach Schwierigkeitsgrad"/);
assert.match(page, /<dialog id="share-dialog" aria-labelledby="share-title">/);

const shortlink = read('../pages/s/w/index.html');
assert.match(shortlink, /\.\.\/\.\.\/minecraft-adventures\//);
const oldShortlink = read('../pages/s/n/index.html');
assert.match(oldShortlink, /https:\/\/studio\.code\.org\/de\/courses\/aquatic\/units\/1\/lessons\/1\/levels\/1/);
const style = read('../pages/minecraft-adventures/style.css');
assert.match(style, /prefers-reduced-motion/);
assert.match(style, /:focus-visible/);
assert.match(page, /href="\.\.\/assets\/site\.css"/, 'hub loads the shared LinguaCode stylesheet');
const sharedStyle = read('../pages/assets/site.css');
const sharedTokens = new Set([...sharedStyle.matchAll(/--([\w-]+)\s*:/g)].map(([, name]) => name));
const localDeclarations = [...style.matchAll(/--([\w-]+)\s*:/g)];
assert.equal(localDeclarations.length, 0, 'hub does not define duplicate color tokens');
for (const [, token] of style.matchAll(/var\(--([\w-]+)\)/g)) {
  assert.ok(sharedTokens.has(token), `CSS token --${token} is defined in pages/assets/site.css`);
}

const events = new Map();
const shareButtons = expected.map(([key, title, url]) => ({
  dataset: {share: url, title},
  addEventListener(type, handler) { events.set(`${key}:${type}`, handler); },
  key,
}));
const image = {src: '', alt: ''};
const urlInput = {value: ''};
const titleNode = {textContent: ''};
const dialog = {opened: 0, closed: 0, showModal() { this.opened++; }, close() { this.closed++; }};
const closeButton = {addEventListener(type, handler) { events.set(`close:${type}`, handler); }};
const document = {
  querySelectorAll(selector) { assert.equal(selector, '[data-share]'); return shareButtons; },
  querySelector(selector) {
    return ({
      '#share-dialog': dialog,
      '#share-qr': image,
      '#share-url': urlInput,
      '#share-title': titleNode,
      '#share-close': closeButton,
    })[selector];
  },
};
let qrValue = '';
const qrcode = () => ({
  addData(value) { qrValue = value; },
  make() {},
  createDataURL() { return 'data:image/png;base64,qr'; },
});
runInNewContext(read('../pages/minecraft-adventures/app.js'), {document, qrcode, URL});
for (const [key, title, url] of expected) {
  events.get(`${key}:click`)();
  assert.equal(urlInput.value, url, `${title} share dialog exposes its exact URL`);
  assert.equal(titleNode.textContent, title, `${title} is identified in the share dialog`);
  assert.equal(image.alt, `QR-Code für ${title}`);
  assert.equal(image.src, 'data:image/png;base64,qr');
  assert.equal(qrValue, url, `${title} QR encodes its exact URL`);
}
assert.equal(dialog.opened, 3, 'each adventure opens its own QR dialog');
events.get('close:click')();
assert.equal(dialog.closed, 1, 'share dialog can be closed');
console.log('PASS: ordered adventure hub, exact Code.org links, retained Level 1 entries, QR interactions, shortlink and accessibility hooks.');
