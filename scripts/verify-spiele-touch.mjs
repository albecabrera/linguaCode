import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, webkit } from '../.spiele-browser-qa/node_modules/playwright/index.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const evidence = join(root, '.spiele-browser-qa', 'evidence');
const browsersPath = join(root, '.spiele-browser-qa', 'browsers');
const basePath = '/linguaCode/';
const profiles = [
  { id: 'portrait', viewport: { width: 768, height: 1024 } },
  { id: 'landscape', viewport: { width: 1024, height: 768 } },
  { id: 'smartboard', viewport: { width: 1920, height: 1080 } }
];
const labels = { tug: 'Tauziehen', wheel: 'Glücksrad', jeopardy: 'Jeopardy', memory: 'Memory', matching: 'Zuordnen' };
const types = Object.keys(labels);
const mime = { '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
const failures = [];
const httpErrors = [];
function fileFor(urlPath) {
  let pathname = decodeURIComponent(new URL(urlPath, 'http://127.0.0.1').pathname);
  if (!pathname.startsWith(basePath)) return null;
  pathname = pathname.slice(basePath.length - 1);
  if (pathname === '/' || pathname.endsWith('/')) pathname = `/pages${pathname}index.html`;
  else pathname = `/pages${pathname}`;
  const candidate = normalize(join(root, pathname));
  return candidate.startsWith(root) ? candidate : null;
}
const server = createServer(async (request, response) => {
  try {
    const file = fileFor(request.url || '/');
    const info = file && await stat(file);
    if (!info?.isFile()) throw new Error('missing');
    response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(await readFile(file));
  } catch {
    httpErrors.push(request.url);
    response.writeHead(404); response.end('Not found');
  }
});
const check = (value, message) => assert.ok(value, message);
const field = (page, label, value) => page.getByLabel(label, { exact: true }).last().fill(value);
async function noOverflow(page, label) { check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${label}: horizontal overflow`); }
async function targetSizes(page, label) {
  const data = await page.locator('button, input:not([type="file"]), textarea, select').evaluateAll(nodes => nodes.filter(node => {
    const style = getComputedStyle(node); const box = node.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0 && !node.disabled;
  }).map(node => ({ tag: node.tagName, className: node.className, size: Math.min(node.getBoundingClientRect().width, node.getBoundingClientRect().height) })));
  check(data.length > 0 && Math.min(...data.map(item => item.size)) >= 48, `${label}: interactive target below 48px (${JSON.stringify(data.filter(item => item.size < 48))})`);
}
async function addQuestion(page, prompt, answer) {
  await page.getByRole('button', { name: 'Frage hinzufügen', exact: true }).tap();
  await field(page, 'Frage / Impuls', prompt); await field(page, 'Antwort für die Lehrkraft', answer);
}
async function create(page, type, index, run) {
  await page.locator('.tile').filter({ hasText: labels[type] }).tap();
  await field(page, 'Titel', `Touch ${labels[type]}`); await field(page, 'Beschreibung', `Touch-Inhalt ${labels[type]}`);
  await page.locator('select').selectOption(['Informatik', 'Spanisch', 'Sport', 'Mathematik'][index % 4]); await field(page, 'Klassenstufe', String(index + 5));
  if (type === 'tug' || type === 'wheel') { await addQuestion(page, 'Frage eins', 'Antwort eins'); await addQuestion(page, 'Frage zwei', 'Antwort zwei'); }
  if (type === 'jeopardy') for (const name of ['Grundlagen', 'Transfer']) {
    await page.getByRole('button', { name: 'Kategorie hinzufügen', exact: true }).tap(); await field(page, 'Kategoriename', name);
    await page.getByRole('button', { name: 'Frage hinzufügen', exact: true }).last().tap(); await field(page, 'Frage / Impuls', `${name} Frage`); await field(page, 'Antwort für die Lehrkraft', `${name} Antwort`);
  }
  if (type === 'memory') for (const [first, second] of [['CPU', 'Prozessor'], ['RAM', 'Arbeitsspeicher']]) {
    await page.getByRole('button', { name: 'Paar hinzufügen', exact: true }).tap(); await field(page, 'Erste Karte', first); await field(page, 'Zweite Karte', second);
  }
  if (type === 'matching') for (const [name, item] of [['Gerät', 'Tastatur'], ['Programm', 'Browser']]) {
    await page.getByRole('button', { name: 'Gruppe hinzufügen', exact: true }).tap(); await field(page, 'Gruppenname', name);
    await page.getByRole('button', { name: 'Begriff hinzufügen', exact: true }).last().tap(); await field(page, 'Begriff', item);
  }
  await page.getByRole('button', { name: 'Lokal speichern', exact: true }).tap();
  await page.locator('.editor').waitFor({ state: 'detached' });
  const card = page.locator('.game-card').filter({ hasText: `Touch ${labels[type]}` });
  check(await card.isVisible(), `${run}: saved card missing after touch save`);
}
async function play(page, type, run) {
  const card = page.locator('.game-card').filter({ hasText: `Touch ${labels[type]}` }); await card.getByRole('button', { name: 'Spielen', exact: true }).tap();
  await targetSizes(page, `${run} ${type} play`); await noOverflow(page, `${run} ${type} play`);
  if (type === 'tug') { const shared = page.locator('.tug-question-panel'); await shared.locator('#tug-shared-input').fill('Antwort eins'); await shared.getByRole('button', { name: 'Antwort prüfen' }).tap(); check(await page.getByText(/Team A: 1 · Team B: 0/).isVisible(), `${run}: tug score missing`); check(await shared.getByText('Team B ist am Zug', { exact: false }).isVisible(), `${run}: shared turn did not alternate`); await shared.locator('#tug-shared-input').fill('falsch'); await shared.getByRole('button', { name: 'Antwort prüfen' }).tap(); await shared.getByRole('button', { name: 'Weiter →' }).tap(); }
  if (type === 'wheel') { await page.getByRole('button', { name: 'Glücksrad drehen' }).tap(); check(await page.locator('.question').isVisible(), `${run}: wheel question missing`); }
  if (type === 'jeopardy') { const tile = page.getByRole('button', { name: '100 Punkte' }).first(); await tile.tap(); await page.getByRole('button', { name: 'Antwort einblenden' }).tap(); check(await page.locator('.answer').isVisible(), `${run}: jeopardy answer hidden`); await page.getByRole('button', { name: 'Punkt vergeben' }).tap(); check(await page.getByText('Punktestand: 100').isVisible(), `${run}: jeopardy award missing`); }
  if (type === 'memory') { const cards = page.locator('.memory-card'); await cards.first().tap(); await cards.first().tap(); check(await page.locator('.memory-card.revealed').count() === 1, `${run}: same memory card self-matched`); }
  if (type === 'matching') { const items = page.locator('.choice-grid').first().getByRole('button'); const groups = page.locator('.choice-grid').last().getByRole('button'); await items.first().tap(); check(await items.first().evaluate(node => node.classList.contains('selected')), `${run}: matching selection missing`); await groups.first().tap(); check(await page.getByText('Richtig:', { exact: false }).isVisible(), `${run}: matching result missing`); }
  await page.screenshot({ path: join(evidence, `touch-${run}-${type}.png`), fullPage: true });
  await page.getByRole('button', { name: 'Zurück' }).tap();
}
async function runEngine(name, engine) {
  let browser;
  try {
    browser = await engine.launch({ headless: true, timeout: 15000, env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: browsersPath } });
    for (const profile of profiles) {
      const run = `${name}-${profile.id}`;
      const context = await browser.newContext({ viewport: profile.viewport, hasTouch: true, isMobile: true, reducedMotion: 'reduce', serviceWorkers: 'block' });
      try {
        context.setDefaultTimeout(10000); const page = await context.newPage();
        page.on('console', message => { if (message.type() === 'error') failures.push(`${run} console: ${message.text()}`); });
        page.on('pageerror', error => failures.push(`${run} pageerror: ${error.message}`));
        page.on('response', response => { if (response.status() >= 400) failures.push(`${run} HTTP ${response.status()}: ${response.url()}`); });
        await page.goto(`http://127.0.0.1:${server.address().port}${basePath}spiele/`); await page.getByRole('heading', { name: 'Spiele erstellen. Sofort spielen.' }).waitFor();
        await targetSizes(page, `${run} home`); await noOverflow(page, `${run} home`);
        check(!(await page.locator('meta[name="viewport"]').getAttribute('content')).includes('user-scalable=no'), `${run}: pinch zoom disabled`);
        const scrollState = await page.evaluate(() => { const scrolling = document.scrollingElement; window.scrollTo(0, 500); return { position: window.scrollY, scrollable: scrolling.scrollHeight > scrolling.clientHeight }; }); check(!scrollState.scrollable || scrollState.position > 0, `${run}: scrolling unavailable`);
        await page.getByRole('button', { name: 'Tauziehen', exact: false }).first().focus(); await page.keyboard.press('Enter');
        await targetSizes(page, `${run} editor`); await page.getByRole('button', { name: 'Meine Spiele' }).tap();
        await page.locator('.tile').filter({ hasText: 'Tauziehen' }).click(); await page.getByRole('button', { name: 'Meine Spiele' }).tap();
        await page.screenshot({ path: join(evidence, `touch-${run}-home.png`), fullPage: true });
        for (const [index, type] of types.entries()) await create(page, type, index, run);
        check(await page.locator('.game-card').count() === 5, `${run}: five touch-created games missing`);
        const title = 'Touch Glücksrad'; await page.locator('.game-card').filter({ hasText: title }).getByRole('button', { name: 'Bearbeiten' }).tap();
        check(await page.getByLabel('Titel').inputValue() === title, `${run}: saved editor did not reopen`); await targetSizes(page, `${run} reopened editor`); await page.getByRole('button', { name: 'Meine Spiele' }).tap();
        for (const type of types) await play(page, type, run);
      } finally { await context.close(); }
    }
  } finally { await browser?.close(); }
}
await mkdir(evidence, { recursive: true });
server.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve));
try {
  await runEngine('chromium', chromium); await runEngine('webkit', webkit);
  check(httpErrors.length === 0, `unexpected HTTP errors: ${httpErrors.join(', ')}`); if (failures.length) throw new Error(failures.join('\n'));
  console.log(JSON.stringify({ ok: true, engines: 2, profiles: profiles.length, gamesPerProfile: 5, screenshots: 'touch-<engine>-<profile>-<game>.png', realHardware: false }, null, 2));
} catch (error) { console.error(JSON.stringify({ ok: false, error: error.message }, null, 2)); process.exitCode = 1; }
finally { await new Promise(resolve => server.close(resolve)); }
