import assert from 'node:assert/strict';
import { createMission06 } from '../pages/ki8/stunde-6/mission06.mjs';

class RenderRoot {
  constructor() { this.ownerDocument = {}; this.html = ''; }
  set innerHTML(value) { this.html = value; }
  get innerHTML() { return this.html; }
  querySelector() { return null; }
  querySelectorAll() { return []; }
}

const memory = new Map();
const storage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: (key) => memory.delete(key) };
const root = new RenderRoot();
createMission06({ root, storage });
assert.equal((root.innerHTML.match(/class="journey-link"/g) ?? []).length, 19);
assert.match(root.innerHTML, /Alle 19 Missionen/);
assert.match(root.innerHTML, /href="\.\.\/stunde-1\/"/);
assert.match(root.innerHTML, /href="\.\.\/stunde-19\/"/);
assert.match(root.innerHTML, /href="\.\.\/stunde-6\/"[^>]*aria-current="page"/);
assert.match(root.innerHTML, /id="journey-nav"/);
assert.match(root.innerHTML, /Missionsfortschritt/);
console.log('PASS: Mission 06 restores the 19-mission course navigation without changing lab or progress storage behavior.');
