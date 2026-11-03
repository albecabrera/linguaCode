import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source = readFileSync(new URL('../pages/assets/theme.js', import.meta.url), 'utf8');
function setup(saved, dark = false, unavailable = false) {
  const root = { dataset: {} }; let handler; let value = saved;
  const button = { textContent: '', setAttribute(key, val) { this[key] = val; }, addEventListener(type, fn) { handler = fn; } };
  const localStorage = { getItem() { if (unavailable) throw Error('blocked'); return value; }, setItem(key, val) { if (unavailable) throw Error('blocked'); value = val; } };
  runInNewContext(source, { document: { documentElement: root, querySelector: () => button }, localStorage, matchMedia: () => ({ matches: dark }) });
  return { root, button, click: () => handler(), stored: () => value };
}
const system = setup(null, true); assert.equal(system.root.dataset.theme, 'dark');
system.click(); assert.equal(system.root.dataset.theme, 'light'); assert.equal(system.stored(), 'light'); assert.equal(system.button['aria-pressed'], 'false');
const saved = setup('dark', false); assert.equal(saved.root.dataset.theme, 'dark'); assert.equal(saved.button['aria-pressed'], 'true');
const blocked = setup(null, false, true); blocked.click(); assert.equal(blocked.root.dataset.theme, 'dark');
console.log('Site theme checks passed');

const css = readFileSync(new URL('../pages/assets/site.css', import.meta.url), 'utf8');
assert.match(css, /\.catalog \.grid article\.course-featured\s*\{[^}]*background:var\(--surface\)/);
