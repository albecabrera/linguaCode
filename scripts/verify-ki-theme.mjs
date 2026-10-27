import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createThemeController, THEME_STORAGE_KEY} from '../pages/ki8/mission/theme.mjs';

function createHarness({storedTheme = null, systemTheme = 'light'} = {}) {
  const values = new Map();
  if (storedTheme) values.set(THEME_STORAGE_KEY, storedTheme);
  const attributes = new Map();
  const root = {
    getAttribute(name) { return attributes.get(name) ?? null; },
    setAttribute(name, value) { attributes.set(name, value); },
    removeAttribute(name) { attributes.delete(name); },
  };
  const buttonAttributes = new Map();
  const button = { setAttribute(name, value) { buttonAttributes.set(name, value); } };
  const listeners = new Map();
  const documentLike = {
    documentElement: root,
    querySelectorAll(selector) { return selector === '[data-theme-toggle]' ? [button] : []; },
    addEventListener(name, handler) { listeners.set(name, handler); },
    clickThemeButton() {
      listeners.get('click')({target: {closest: (selector) => selector === '[data-theme-toggle]' ? button : null}});
    },
  };
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
  };
  const matchMedia = () => ({matches: systemTheme === 'dark'});
  return {documentLike, storage, root, buttonAttributes, values, matchMedia};
}

const systemDark = createHarness({systemTheme: 'dark'});
const systemController = createThemeController(systemDark);
assert.equal(systemController.getTheme(), 'dark');
assert.equal(systemDark.root.getAttribute('data-theme'), 'dark', 'system preference should be applied without being persisted as an override');
assert.equal(systemDark.buttonAttributes.get('aria-pressed'), 'true');
assert.equal(systemDark.values.has(THEME_STORAGE_KEY), false);
systemDark.documentLike.clickThemeButton();
assert.equal(systemController.getTheme(), 'light');
assert.equal(systemDark.root.getAttribute('data-theme'), 'light');
assert.equal(systemDark.values.get(THEME_STORAGE_KEY), 'light');
assert.equal(systemDark.buttonAttributes.get('aria-pressed'), 'false');

const reload = createHarness({storedTheme: 'light', systemTheme: 'dark'});
const reloadController = createThemeController(reload);
assert.equal(reloadController.getTheme(), 'light', 'saved choice should override the system after reload');
assert.equal(reload.root.getAttribute('data-theme'), 'light');
reload.documentLike.clickThemeButton();
assert.equal(reloadController.getTheme(), 'dark');
assert.equal(reload.values.get(THEME_STORAGE_KEY), 'dark');
assert.equal(reload.buttonAttributes.get('aria-pressed'), 'true');

const catalogCss = readFileSync(new URL('../pages/ki8/style.css', import.meta.url), 'utf8');
const missionCss = readFileSync(new URL('../pages/ki8/mission/mission.css', import.meta.url), 'utf8');
assert.match(catalogCss, /:root\[data-theme="light"\]\s*\{[^}]*color-scheme:\s*light/);
assert.match(catalogCss, /:root\[data-theme="dark"\]\s*\{[^}]*--bg:\s*#101d29/);
assert.match(missionCss, /:root\[data-theme="light"\]\{color-scheme:light\}/);
assert.match(missionCss, /:root\[data-theme="dark"\]\{[^}]*--navy:#071425/);
assert.match(missionCss, /background:var\(--input-bg\)/, 'mission inputs use theme-aware surfaces');
assert.match(missionCss, /background:var\(--inset-bg\)/, 'mission examples use theme-aware surfaces');

console.log('PASS: system default, accessible theme toggle, local persistence, and explicit light/dark UI palettes.');
