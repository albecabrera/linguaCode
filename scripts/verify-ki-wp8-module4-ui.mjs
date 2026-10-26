import assert from 'node:assert/strict';

class Element {
  constructor(tag = '') { this.tag = tag; this.children = []; this.events = new Map(); this.textContent = ''; this.selected = null; }
  append(...children) { this.children.push(...children); }
  addEventListener(name, handler) { this.events.set(name, handler); }
  setAttribute(key, value) { this[key] = value; }
  querySelector(selector) { return selector === 'input:checked' ? this.selected : null; }
  fire(name) { assert.ok(this.events.has(name)); this.events.get(name)({preventDefault() {}}); }
}

const nodes = Object.fromEntries(['activities-1', 'activities-2', 'progress-1', 'progress-2'].map((id) => [id, new Element()]));
globalThis.document = {getElementById: (id) => nodes[id], createElement: (tag) => new Element(tag)};
await import('../pages/ki8/module4-ui.mjs');
for (const hour of [1, 2]) assert.equal(nodes[`activities-${hour}`].children.length, 2);

const first = nodes['activities-1'].children[0];
first.fire('submit');
assert.equal(first.children[2].textContent, 'Wähle zuerst eine Antwort.');
assert.equal(nodes['progress-1'].textContent, '');
first.selected = {value: '1'};
first.fire('submit');
assert.match(first.children[2].textContent, /^Noch nicht\./);
assert.match(first.children[2].textContent, /Muster|Ähnlichkeit/);
assert.match(nodes['progress-1'].textContent, /1 von 2/);
first.selected = {value: '0'};
first.fire('submit');
assert.match(first.children[2].textContent, /^Richtig\./);

const secondHourLast = nodes['activities-2'].children[1];
secondHourLast.selected = {value: '1'};
secondHourLast.fire('submit');
assert.match(secondHourLast.children[2].textContent, /^Noch nicht\./);
assert.match(secondHourLast.children[2].textContent, /Ausreißer|Muster/);
assert.match(nodes['progress-2'].textContent, /1 von 2/);
secondHourLast.selected = {value: '0'};
secondHourLast.fire('submit');
assert.match(secondHourLast.children[2].textContent, /^Richtig\./);
assert.match(nodes['progress-2'].textContent, /nur für diese geöffnete Seite/);
console.log('PASS: module 4 DOM submissions provide corrective feedback and page-only progress across both hours.');
