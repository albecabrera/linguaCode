import assert from 'node:assert/strict';
import { createMission05 } from '../pages/ki8/stunde-5/mission05.mjs';

class FakeElement {
  constructor(root, attrs = {}) { this.root = root; this.attrs = attrs; this.dataset = Object.fromEntries(Object.entries(attrs).filter(([key]) => key.startsWith('data-')).map(([key, value]) => [key.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase()), value ?? ''])); this.listeners = {}; }
  addEventListener(type, handler) { this.listeners[type] = handler; }
  dispatch(type) { this.listeners[type]?.({ target: this }); }
}
class FakeDocument { constructor() { this.documentElement = { setAttribute() {} }; } }
class FakeRoot {
  constructor() { this.ownerDocument = new FakeDocument(); this.html = ''; this.cache = []; }
  set innerHTML(value) { this.html = value; this.cache = [...value.matchAll(/<([a-z]+)([^>]*)>/gi)].map((match) => { const attrs = {}; for (const item of (match[2] || '').matchAll(/([\w-]+)(?:="([^"]*)")?/g)) attrs[item[1]] = item[2] ?? ''; return new FakeElement(this, attrs); }); }
  querySelector(selector) { if (selector === '[data-theme-toggle]') return this.cache.find((element) => element.dataset.themeToggle !== undefined); return new FakeElement(this); }
}

const root = new FakeRoot();
const renderer = createMission05({ root, storage: { getItem: () => null, setItem() {}, removeItem() {} } });
assert.match(root.html, /Arbeitsblatt bearbeiten/);
assert.match(root.html, /Aufgabe 1/);
assert.match(root.html, /Aufgabe 2/);
assert.match(root.html, /Welches Verkehrsmittel nehme ich zur Schule\?/);
assert.match(root.html, /https:\/\/app\.diagrams\.net/);
assert.equal(renderer.getState().completed, false);
assert.match(root.html, /nicht automatisch abgeschlossen/);
root.querySelector('[data-theme-toggle]').dispatch('click');
assert.match(root.html, /Arbeitsblatt herunterladen oder drucken/);
console.log('PASS: Mission 05 worksheet rendering, external-tool handoff, theme interaction, and explicit non-completion behavior.');
