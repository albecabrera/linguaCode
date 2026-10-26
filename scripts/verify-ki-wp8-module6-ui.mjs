import assert from 'node:assert/strict';

class Element {
  constructor(tag = '') { this.tag = tag; this.children = []; this.events = new Map(); this.textContent = ''; this.selected = null; }
  append(...children) { this.children.push(...children); }
  addEventListener(name, handler) { this.events.set(name, handler); }
  setAttribute(key, value) { this[key] = value; }
  querySelector(selector) { return selector === 'input:checked' ? this.selected : null; }
  fire(name) { assert.ok(this.events.has(name)); this.events.get(name)({preventDefault() {}}); }
}
const nodes = Object.fromEntries(Array.from({length: 5}, (_, index) => [`activities-${index + 1}`, new Element()]));
for (let index = 1; index <= 5; index += 1) nodes[`progress-${index}`] = new Element();
globalThis.document = {getElementById: (id) => nodes[id], createElement: (tag) => new Element(tag)};
await import('../pages/ki8/module6-ui.mjs');
for (let index = 1; index <= 5; index += 1) assert.equal(nodes[`activities-${index}`].children.length, 2);
const first = nodes['activities-1'].children[0];
first.fire('submit');
assert.equal(first.children[2].textContent, 'Wähle zuerst eine Antwort.');
assert.equal(nodes['progress-1'].textContent, '');
first.selected = {value: '0'};
first.fire('submit');
assert.match(first.children[2].textContent, /^Noch nicht\./);
assert.match(first.children[2].textContent, /Belegen/);
assert.match(nodes['progress-1'].textContent, /1 von 2/);
first.selected = {value: '1'};
first.fire('submit');
assert.match(first.children[2].textContent, /^Richtig\./);
assert.match(nodes['progress-1'].textContent, /1 von 2/);
const fifth = nodes['activities-5'];
for (const [index, form] of fifth.children.entries()) { form.selected = {value: index === 0 ? '0' : '1'}; form.fire('submit'); }
assert.match(nodes['progress-5'].textContent, /2 von 2/);
assert.match(nodes['progress-5'].textContent, /nur für diese geöffnete Seite/);
console.log('PASS: public UI renders all five hours, handles missing, incorrect and correct answers, and updates in-page progress.');
