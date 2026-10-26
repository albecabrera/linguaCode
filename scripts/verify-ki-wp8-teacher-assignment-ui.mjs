import assert from 'node:assert/strict';

class Element {
  constructor(tag = '') { this.tag = tag; this.children = []; this.events = new Map(); this.dataset = {}; this.textContent = ''; this.value = ''; this.hidden = false; this.focused = false; }
  append(child) { this.children.push(child); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(key, value) { this[key] = value; }
  addEventListener(name, handler) { this.events.set(name, handler); }
  fire(name, target = this) { assert.ok(this.events.has(name), `${name} handler absent`); this.events.get(name)({target, preventDefault() {}}); }
  closest(selector) { return selector === 'button[data-code]' && this.tag === 'button' ? this : null; }
  focus() { this.focused = true; }
}

const ids = ['summary', 'learners', 'detail', 'detail-title', 'detail-progress', 'detail-answer', 'detail-feedback', 'feedback-form', 'feedback-input', 'feedback-status', 'lessons', 'assignment-form', 'assignment-lesson', 'assignment-group', 'assignment-preview', 'assignment-status'];
const nodes = Object.fromEntries(ids.map((id) => [id, new Element()]));
globalThis.document = {getElementById: (id) => nodes[id], createElement: (tag) => new Element(tag)};
await import('../docs/ki-wp8/demo/app.mjs');
assert.equal(nodes.lessons.children.length, 2);
assert.match(nodes.lessons.children[0].textContent, /Merkmale, Labels und Schwellenwerte/);
nodes['assignment-lesson'].value = 'stunde-2';
nodes['assignment-group'].value = 'Demo-Gruppe B';
nodes['assignment-form'].fire('submit');
assert.match(nodes['assignment-preview'].textContent, /Trainieren, testen und Fehler untersuchen/);
assert.match(nodes['assignment-preview'].textContent, /Demo-Gruppe B/);
assert.match(nodes['assignment-status'].textContent, /nicht gesendet|nur Vorschau/i);
console.log('PASS: teacher demo renders module 2 objectives and transient assignment preview through public DOM handlers.');
