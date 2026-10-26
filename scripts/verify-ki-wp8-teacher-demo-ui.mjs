import assert from 'node:assert/strict';

class Element {
  constructor(tag = '') {
    this.tag = tag;
    this.children = [];
    this.events = new Map();
    this.dataset = {};
    this.textContent = '';
    this.value = '';
    this.hidden = false;
    this.focused = false;
  }
  append(child) { this.children.push(child); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(key, value) { this[key] = value; }
  addEventListener(name, handler) { this.events.set(name, handler); }
  fire(name, target = this) {
    assert.ok(this.events.has(name), `${name} handler absent`);
    this.events.get(name)({target, preventDefault() {}});
  }
  closest(selector) { return selector === 'button[data-code]' && this.tag === 'button' ? this : null; }
  focus() { this.focused = true; }
}

const ids = ['summary', 'learners', 'detail', 'detail-title', 'detail-progress', 'detail-answer', 'detail-feedback', 'feedback-form', 'feedback-input', 'feedback-status'];
const nodes = Object.fromEntries(ids.map((id) => [id, new Element()]));
globalThis.document = {
  getElementById: (id) => nodes[id],
  createElement: (tag) => new Element(tag),
};
await import('../docs/ki-wp8/demo/app.mjs');
assert.equal(nodes.learners.children.length, 3);
assert.match(nodes.summary.textContent, /7 von 18 Musterkarten/);
const select = nodes.learners.children[0].children.at(-1).children[0];
nodes.learners.fire('click', select);
assert.equal(nodes.detail.hidden, false);
assert.equal(nodes['detail-title'].focused, true);
assert.match(nodes['detail-answer'].textContent, /Grenzwert/);
assert.match(nodes['detail-feedback'].textContent, /Noch keine/);
nodes['feedback-input'].value = '   ';
nodes['feedback-form'].fire('submit');
assert.match(nodes['feedback-status'].textContent, /1 bis 500 Zeichen/);
assert.match(nodes['detail-feedback'].textContent, /Noch keine/);
assert.match(nodes.summary.textContent, /1 Rückmeldung\(en\)/);
nodes['feedback-input'].value = '  Erfundener Hinweis <script>kein HTML</script>  ';
nodes['feedback-form'].fire('submit');
assert.equal(nodes['detail-feedback'].textContent, 'Erfundener Hinweis <script>kein HTML</script>');
assert.match(nodes['feedback-status'].textContent, /nach dem Neuladen gelöscht/);
assert.equal(nodes.learners.children.length, 3);
assert.match(nodes.summary.textContent, /2 Rückmeldung\(en\)/);
assert.equal(nodes['detail-answer'].children.length, 0);
console.log('PASS: fictional teacher overview, detail and in-memory feedback through DOM handlers.');
