import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const catalog = readFileSync(new URL('../pages/index.html', import.meta.url), 'utf8');
const cards = [...catalog.matchAll(/<article data-subject="([^"]+)">([\s\S]*?)<\/article>/g)];
const matches = cards.filter(([, , body]) => body.includes('<h2>Blockprogrammierung mit Minecraft</h2>'));
assert.equal(matches.length, 1, 'Minecraft card appears exactly once');
const [, subject, card] = matches[0];
assert.equal(subject, 'Informatik');
assert.match(card, /Informatik · Klasse 7–10/);
assert.match(card, /href="https:\/\/studio\.code\.org\/de\/courses\/aquatic\/units\/1\/lessons\/1\/levels\/1"/);
assert.match(card, /data-share="s\/n\/"/);
assert.match(card, /ohne LinguaCode-Anmeldung/);
const shortlink = readFileSync(new URL('../pages/s/n/index.html', import.meta.url), 'utf8');
assert.match(shortlink, /http-equiv="refresh" content="0; url=https:\/\/studio\.code\.org\/de\/courses\/aquatic\/units\/1\/lessons\/1\/levels\/1"/);
assert.match(shortlink, /location\.replace\('https:\/\/studio\.code\.org\/de\/courses\/aquatic\/units\/1\/lessons\/1\/levels\/1'\)/);
console.log('PASS: Minecraft card, direct lesson URL, shortlink redirect, and QR target.');
