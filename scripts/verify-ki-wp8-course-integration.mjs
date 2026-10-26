import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

class Element {
  constructor(tag = '') { this.tag = tag; this.children = []; this.events = new Map(); this.textContent = ''; this.href = ''; this.className = ''; }
  append(...children) { this.children.push(...children); }
  addEventListener(name, handler) { this.events.set(name, handler); }
}

const nodes = {
  modules: new Element('div'),
  'threshold-form': new Element('form'),
  threshold: new Element('input'),
  result: new Element('p'),
};
globalThis.document = {
  querySelector(selector) {
    return selector === '#modules' ? nodes.modules : selector === '#threshold-form' ? nodes['threshold-form'] : selector === '#threshold' ? nodes.threshold : nodes.result;
  },
  createElement(tag) { return new Element(tag); },
};
await import('../pages/ki8/app.mjs');

const cards = nodes.modules.children;
assert.equal(cards.length, 6, 'all six module cards must render');
const descendants = (node) => node.children.flatMap((child) => [child, ...descendants(child)]);
const links = cards.flatMap((card) => descendants(card).filter(({tag, href}) => tag === 'a' && href.includes('#stunde-')));
assert.equal(links.length, 18, 'all 18 lesson hours must be reachable from module cards');
for (const [index, card] of cards.entries()) {
  const hours = [2, 2, 4, 2, 3, 5][index];
  const cardLinks = descendants(card).filter(({tag, href}) => tag === 'a' && href.includes('#stunde-'));
  assert.equal(cardLinks.length, hours);
  for (const [hour, link] of cardLinks.entries()) {
    assert.equal(link.href, `./modul-${index + 1}.html#stunde-${hour + 1}`);
    assert.equal(link.textContent, `Stunde ${hour + 1} öffnen`);
  }
}
assert.ok(cards[2].children.some((child) => child.href === '#beispielkarte'), 'module 3 sample link must remain');
const indexHtml = readFileSync(new URL('../pages/ki8/index.html', import.meta.url), 'utf8');
assert.match(indexHtml, /id="beispielkarte"/);
for (let module = 1; module <= 6; module += 1) {
  assert.match(readFileSync(new URL(`../pages/ki8/modul-${module}.html`, import.meta.url), 'utf8'), new RegExp(`src="\\./module${module}-ui\\.mjs"`));
}
console.log('PASS: public course DOM exposes all 18 hour links, preserves module 3 sample, and references all UI modules.');
