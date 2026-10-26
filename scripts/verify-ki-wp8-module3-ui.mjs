import assert from 'node:assert/strict';

class Element {
  constructor(tag = '') { this.tag = tag; this.children = []; this.events = new Map(); this.textContent = ''; this.selected = null; }
  append(...children) { this.children.push(...children); }
  addEventListener(name, handler) { this.events.set(name, handler); }
  setAttribute(key, value) { this[key] = value; }
  querySelector(selector) { return selector === 'input:checked' ? this.selected : null; }
  fire(name) { assert.ok(this.events.has(name)); this.events.get(name)({preventDefault() {}}); }
}

const nodes = Object.fromEntries(['activities-1', 'activities-2', 'activities-3', 'activities-4', 'progress-1', 'progress-2', 'progress-3', 'progress-4'].map((id) => [id, new Element()]));
globalThis.document = {getElementById: (id) => nodes[id], createElement: (tag) => new Element(tag)};
await import('../pages/ki8/module3-ui.mjs');
for (const hour of [1, 2, 3, 4]) assert.equal(nodes[`activities-${hour}`].children.length, 2);

const first = nodes['activities-1'].children[0];
first.fire('submit');
assert.equal(first.children[2].textContent, 'Wähle zuerst eine Antwort.');
assert.equal(nodes['progress-1'].textContent, '');
first.selected = {value: '1'};
first.fire('submit');
assert.match(first.children[2].textContent, /^Noch nicht\./);
assert.match(first.children[2].textContent, /Merkmal|Schwellenwert|Regel/);
assert.match(nodes['progress-1'].textContent, /1 von 2/);
first.selected = {value: '0'};
first.fire('submit');
assert.match(first.children[2].textContent, /^Richtig\./);

const thirdHourLast = nodes['activities-3'].children[1];
thirdHourLast.selected = {value: '1'};
thirdHourLast.fire('submit');
assert.match(thirdHourLast.children[2].textContent, /^Noch nicht\./);
assert.match(thirdHourLast.children[2].textContent, /Fehlklassifikation|Testdaten/);
assert.match(nodes['progress-3'].textContent, /1 von 2/);

const fourthHourLast = nodes['activities-4'].children[1];
fourthHourLast.selected = {value: '0'};
fourthHourLast.fire('submit');
assert.match(fourthHourLast.children[2].textContent, /^Richtig\./);
assert.match(fourthHourLast.children[2].textContent, /Regel|Testdaten|Baum/);
assert.match(nodes['progress-4'].textContent, /nur für diese geöffnete Seite/);
console.log('PASS: module 3 DOM submissions provide corrective feedback and page-only progress across all four hours.');
