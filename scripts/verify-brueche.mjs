import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const page = await readFile(new URL('../pages/brueche/index.html', import.meta.url), 'utf8');
const checks = [
  ['German document language', /<html[^>]+lang="de"/i],
  ['four ordered source-backed levels', /data-level="1"[\s\S]*data-level="2"[\s\S]*data-level="3"[\s\S]*data-level="4"/],
  ['fair sharing and fraction vocabulary', /faires Teilen[\s\S]*Zähler[\s\S]*Nenner[\s\S]*Brucharten/i],
  ['comparison and equivalent fractions', /Vergleichen[\s\S]*gleichwertig[\s\S]*Erweitern[\s\S]*Kürzen/i],
  ['same denominator operations', /gleichnamig[\s\S]*(?:Addieren|Subtrahieren)/i],
  ['unlike denominators and mixed numbers', /ungleichnamig[\s\S]*gemischt/i],
  ['practice task data', /const\s+TASKS\s*=|const\s+tasks\s*=/i],
  ['immediate feedback', /aria-live="polite"[\s\S]*feedback/i],
  ['session progress', /sessionStorage|localStorage/],
  ['reward progression', /Spitzhacke|Ausrüstung|Belohnung/i],
  ['end summary', /Stärken|Wiederholen|Zusammenfassung/i],
  ['dark mode control', /theme-toggle|dark/i],
  ['keyboard focus', /focus-visible/],
  ['reduced motion', /prefers-reduced-motion/],
  ['vertical fraction formatter', /fractionPattern[\s\S]*fraction-numerator[\s\S]*fraction-denominator/],
  ['accessible fraction values', /setAttribute\('aria-label',match\[0\]\)[\s\S]*setAttribute\('aria-label',source\)/],
  ['no fraction multiplication or division', /multipli(?:kation|zieren)|division|Brüche\s*(?:multiplizieren|dividieren)/i, true],
];
for (const [name, pattern, forbidden = false] of checks) {
  const matched = pattern.test(page);
  assert.equal(matched, !forbidden, `${name}: ${forbidden ? 'forbidden content found' : 'missing'}`);
}
assert.match(page, /<button[^>]+type="button"/i, 'interactive controls should be buttons');
const catalog = await readFile(new URL('../pages/index.html', import.meta.url), 'utf8');
const cards = [...catalog.matchAll(/<article\b[^>]*data-subject="Mathematik"[^>]*>([\s\S]*?)<\/article>/g)];
const fractionCards = cards.filter(([, body]) => body.includes('<h2>Bruch-Quest</h2>'));
assert.equal(fractionCards.length, 1, 'Bruch-Quest appears once in the Mathematik catalog');
assert.match(fractionCards[0][1], /href="brueche\/"/, 'catalog card opens the public game route');
assert.match(fractionCards[0][1], /data-share="brueche\/"/, 'catalog card shares the game route');
console.log(`Brüche verifier: ${checks.length + 4} checks passed`);
