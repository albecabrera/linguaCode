import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { mountMemory } from '../pages/eduplay/memory.mjs';

class ClassList {
  constructor() { this.values = new Set(); }
  add(...values) { values.forEach(value => this.values.add(value)); }
  remove(...values) { values.forEach(value => this.values.delete(value)); }
  contains(value) { return this.values.has(value); }
}
class Element {
  constructor(tag) { this.tagName = tag.toUpperCase(); this.children = []; this.classList = new ClassList(); this.attributes = {}; this.listeners = {}; this._text = ''; this.disabled = false; }
  set className(value) { this.classList = new ClassList(); value.split(/\s+/).filter(Boolean).forEach(item => this.classList.add(item)); }
  get textContent() { return this.children.length ? this.children.map(child => typeof child === 'string' ? child : child.textContent).join('') : this._text; }
  set textContent(value) { this.children = []; this._text = String(value); }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  addEventListener(type, listener) { (this.listeners[type] ||= []).push(listener); }
  dispatch(type, event = {}) { for (const listener of this.listeners[type] || []) listener(event); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  querySelectorAll(selector) {
    const matches = [];
    const visit = node => {
      if (!(node instanceof Element)) return;
      if (selector === 'button' && node.tagName === 'BUTTON' || selector === '[aria-live]' && node.attributes['aria-live'] || selector === '.memory-card' && node.classList.contains('memory-card') || selector === '.memory-feedback' && node.classList.contains('memory-feedback') || selector === '.result' && node.classList.contains('result')) matches.push(node);
      node.children.forEach(visit);
    };
    visit(this);
    return matches;
  }
}

globalThis.document = { createElement: tag => new Element(tag), createTextNode: text => String(text), baseURI: 'https://example.test/' };
globalThis.setInterval = () => ({ });
globalThis.clearInterval = () => {};
const pendingTimeouts = [];
globalThis.setTimeout = callback => { pendingTimeouts.push(callback); return callback; };
globalThis.clearTimeout = callback => { const index = pendingTimeouts.indexOf(callback); if (index >= 0) pendingTimeouts.splice(index, 1); };
const activity = { settings: { shuffleCards: false, timerEnabled: false, difficulty: 'easy' }, content: { pairs: [
  { id: 'one', first: 'eins', second: 'one' },
  { id: 'two', first: 'zwei', second: 'two' },
] } };

const container = new Element('main');
mountMemory(container, activity);
const cards = container.querySelectorAll('.memory-card');
cards[0].dispatch('click');
assert.equal(cards[0].textContent, 'eins');
assert.ok(cards[0].classList.contains('memory-card--revealed'), 'revealed cards have a visible state');
assert.match(container.querySelector('.memory-feedback').textContent, /aufgedeckt/i);
cards[2].dispatch('click');
assert.ok(cards[0].classList.contains('incorrect'));
assert.ok(cards[2].classList.contains('incorrect'));
assert.match(container.querySelector('.memory-feedback').textContent, /Noch nicht/i);
pendingTimeouts.shift()();
assert.equal(cards[0].textContent, '?');
assert.ok(!cards[0].classList.contains('memory-card--revealed'));

cards[0].dispatch('click');
cards[1].dispatch('click');
assert.ok(cards[0].classList.contains('correct'));
assert.ok(cards[1].classList.contains('correct'));
assert.match(container.querySelector('.memory-feedback').textContent, /Paar gefunden/i);
cards[2].dispatch('click');
cards[3].dispatch('click');
const result = container.querySelector('.result');
assert.ok(result);
assert.match(result.textContent, /Punkte: 2 \/ 2/);
assert.match(result.textContent, /100 %/);
assert.match(result.textContent, /Versuche: 3/);
const retry = result.querySelector('button');
assert.equal(retry.textContent, 'Noch einmal spielen');
retry.dispatch('click');
assert.equal(container.querySelector('.result').textContent, '', 'retry starts a fresh game');
assert.match(container.querySelector('[aria-live]').textContent, /Treffer: 0 \/ 2 · Versuche: 0/);

const css = await readFile(new URL('../pages/eduplay/style.css', import.meta.url), 'utf8');
assert.match(css, /memory-card--revealed/);
assert.match(css, /memory-card-flip/);
assert.match(css, /prefers-reduced-motion:reduce/);
console.log('EduPlay memory UI checks passed');
