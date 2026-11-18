import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';
import { chromium } from '../.spiele-browser-qa/node_modules/playwright/index.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const evidence = join(root, '.spiele-browser-qa', 'evidence');
const basePath = '/linguaCode/';
const browsersPath = join(root, '.spiele-browser-qa', 'browsers');
const failures = [];
const consoleMessages = [];
const pageErrors = [];
const failedRequests = [];
const httpErrors = [];

const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
function fileFor(urlPath) {
  let pathname = decodeURIComponent(new URL(urlPath, 'http://127.0.0.1').pathname);
  if (!pathname.startsWith(basePath)) return null;
  pathname = pathname.slice(basePath.length - 1);
  if (pathname === '/' || pathname === '') pathname = '/pages/index.html';
  else if (pathname.endsWith('/')) pathname = `/pages${pathname}index.html`;
  else pathname = `/pages${pathname}`;
  const candidate = normalize(join(root, pathname));
  if (!candidate.startsWith(root)) return null;
  return candidate;
}
const server = createServer(async (request, response) => {
  try {
    const file = fileFor(request.url || '/');
    if (!file) { httpErrors.push({ url: request.url, status: 404 }); response.writeHead(404); response.end('Not found'); return; }
    const info = await stat(file);
    if (!info.isFile()) throw new Error('not file');
    response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(await readFile(file));
  } catch {
    httpErrors.push({ url: request.url, status: 404 });
    response.writeHead(404); response.end('Not found');
  }
});

function check(condition, message) { assert.ok(condition, message); }
function parseRgb(value) { const match = value.match(/rgba?\(([^)]+)\)/); if (!match) return null; const values = match[1].split(',').map(Number); return values.slice(0, 3); }
function contrastRatio(foreground, background) {
  const toLinear = value => { const channel = value / 255; return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4; };
  const luminance = rgb => { const [r, g, b] = rgb.map(toLinear); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const a = luminance(foreground); const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
async function screenshot(page, name) { await page.screenshot({ path: join(evidence, `${name}.png`), fullPage: true }); }
async function assertHeaderContrast(page, label) {
  const colors = await page.locator('.spiele-top .brand').evaluate(node => { const header = node.closest('.spiele-top'); const brand = getComputedStyle(node); const background = getComputedStyle(header); return { foreground: brand.color, background: background.backgroundColor }; });
  const ratio = contrastRatio(parseRgb(colors.foreground), parseRgb(colors.background));
  check(ratio >= 4.5, `${label}: header contrast ${ratio.toFixed(2)} is below AA`);
}
async function assertPlayLayout(page, label) {
  await expectNoOverflow(page, label);
  check(await page.locator('.play-panel button').count() > 0, `${label}: no visible controls`);
}
async function assertTugControlContrast(page) {
  const data = await page.locator('.tug-controls button, .tug-question-panel button').evaluateAll(nodes => nodes.filter(node => getComputedStyle(node).display !== 'none').map(node => ({ label: node.textContent.trim(), foreground: getComputedStyle(node).color, background: getComputedStyle(node).backgroundColor })));
  check(data.every(item => item.label.length > 0), 'tug controls must have nonempty labels');
  for (const item of data) check(contrastRatio(parseRgb(item.foreground), parseRgb(item.background)) >= 4.5, `tug control contrast below AA: ${item.label}`);
}
async function expectNoOverflow(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  check(!overflow, `${label}: horizontal overflow`);
}
async function fillLabel(page, label, value) {
  const field = page.getByLabel(label, { exact: true }).last();
  await field.fill(value);
}
async function addQuestion(page, prompt, answer, points = '100') {
  await page.getByRole('button', { name: 'Frage hinzufügen', exact: true }).click();
  await fillLabel(page, 'Frage / Impuls', prompt);
  await fillLabel(page, 'Antwort für die Lehrkraft', answer);
  await fillLabel(page, 'Punkte', points);
}
async function createGame(page, type, index) {
  const labels = { tug: 'Tauziehen', wheel: 'Glücksrad', jeopardy: 'Jeopardy', memory: 'Memory', matching: 'Zuordnen' };
  await page.locator('.tile').filter({ hasText: labels[type] }).click();
  await fillLabel(page, 'Titel', `Browser ${labels[type]}`);
  await fillLabel(page, 'Beschreibung', `Realistische Testinhalte für ${labels[type]}.`);
  await page.locator('select').selectOption(['Informatik', 'Spanisch', 'Sport', 'Mathematik'][index % 4]);
  await fillLabel(page, 'Klassenstufe', String(6 + index));
  if (type === 'tug' || type === 'wheel') {
    await addQuestion(page, `${labels[type]} Frage eins`, 'Antwort eins');
    await addQuestion(page, `${labels[type]} Frage zwei`, 'Antwort zwei', '200');
  } else if (type === 'jeopardy') {
    for (const [category, prompt] of [['Grundlagen', 'Was ist ein Algorithmus?'], ['Transfer', 'Was ist ein Test?']]) {
      await page.getByRole('button', { name: 'Kategorie hinzufügen', exact: true }).click();
      await fillLabel(page, 'Kategoriename', category);
      await page.getByRole('button', { name: 'Frage hinzufügen', exact: true }).last().click();
      await fillLabel(page, 'Frage / Impuls', prompt);
      await fillLabel(page, 'Antwort für die Lehrkraft', 'Eine überprüfbare Antwort');
    }
  } else if (type === 'memory') {
    for (const [first, second] of [['CPU', 'Prozessor'], ['RAM', 'Arbeitsspeicher']]) {
      await page.getByRole('button', { name: 'Paar hinzufügen', exact: true }).click();
      await fillLabel(page, 'Erste Karte', first);
      await fillLabel(page, 'Zweite Karte', second);
    }
  } else {
    for (const [group, item] of [['Gerät', 'Tastatur'], ['Programm', 'Browser']]) {
      await page.getByRole('button', { name: 'Gruppe hinzufügen', exact: true }).click();
      await fillLabel(page, 'Gruppenname', group);
      await page.getByRole('button', { name: 'Begriff hinzufügen', exact: true }).last().click();
      await fillLabel(page, 'Begriff', item);
    }
  }
  await page.getByRole('button', { name: 'Validieren', exact: true }).click();
  await checkText(page, 'Inhalt ist gültig.');
  await page.getByRole('button', { name: 'Lokal speichern', exact: true }).click();
  await page.getByRole('heading', { name: `Browser ${labels[type]}` }).waitFor();
}
async function checkText(page, text) { await page.getByText(text, { exact: true }).waitFor(); }
async function openGameCard(page, title) {
  const card = page.locator('.game-card').filter({ has: page.getByRole('heading', { name: title }) });
  await card.getByRole('button', { name: 'Spielen', exact: true }).click();
}
async function inspectCatalog(page, origin) {
  await page.goto(`${origin}${basePath}`);
  await page.getByRole('heading', { name: 'Spiele', exact: true }).waitFor();
  const edu = page.locator('article').filter({ has: page.getByRole('heading', { name: 'EduPlay', exact: true }) });
  // EduPlay may be present as separate local work; Spiele must not require it.
  if (await edu.count()) {
    check(await edu.getByRole('link', { name: 'Starten' }).getAttribute('href') === 'eduplay/', 'EduPlay base link changed');
  }
  check(await page.locator('a[href="ki8/"]').count() > 0, 'existing KI catalog entry missing');
  for (const subject of ['Spanisch', 'Englisch', 'Informatik', 'Mathematik', 'Sport']) {
    if (subject !== 'Alle') await page.getByRole('button', { name: subject, exact: true }).click();
    await page.getByRole('heading', { name: 'Spiele', exact: true }).waitFor();
    check(await page.getByRole('heading', { name: 'Spiele', exact: true }).isVisible(), `Spiele hidden for ${subject}`);
  }
  await page.getByRole('button', { name: 'Alle', exact: true }).click();
  await expectNoOverflow(page, 'catalog desktop');
  await screenshot(page, 'correction-catalog-1440');
}
async function playTug(page, title) {
  await openGameCard(page, title);
  await screenshot(page, 'correction-desktop-play-tug-open');
  await assertPlayLayout(page, 'desktop tug');
  await assertTugControlContrast(page);
  const rope = page.locator('.rope');
  const shared = page.locator('.tug-question-panel');
  check(await shared.getByText('Tauziehen Frage eins', { exact: true }).isVisible(), 'shared initial prompt missing');
  const initialMarker = await rope.evaluate(node => getComputedStyle(node, '::after').left);
  await shared.locator('#tug-shared-input').fill(' Antwort   eins ');
  await page.keyboard.press('Enter');
  check(await shared.getByText('Team Rot ist am Zug', { exact: false }).isVisible(), 'turn did not alternate');
  const movedMarker = await rope.evaluate(node => getComputedStyle(node, '::after').left);
  check(initialMarker !== movedMarker, 'tug marker did not move after correct answer');
  await shared.locator('#tug-shared-input').fill('falsch');
  await shared.getByRole('button', { name: 'Antwort prüfen' }).click();
  await shared.getByRole('button', { name: 'Weiter →' }).click();
  await shared.locator('#tug-shared-input').fill('Antwort zwei');
  await page.keyboard.press('Enter');
  await shared.getByRole('button', { name: 'Weiter →' }).click();
  await shared.locator('#tug-shared-input').fill('falsch');
  await shared.getByRole('button', { name: 'Antwort prüfen' }).click();
  check(await page.getByText('Team Blau gewinnt!').isVisible(), 'unequal tug winner missing');
  const ropeBox = await rope.boundingBox();
  const panel = await page.locator('.play-panel').boundingBox();
  check(ropeBox && ropeBox.height >= 20, 'rope has no visible rendered height');
  check(ropeBox && panel && ropeBox.x >= panel.x && ropeBox.x + ropeBox.width <= panel.x + panel.width, 'rope outside visible bounds');
  await assertHeaderContrast(page, 'desktop tug');
  await page.getByRole('button', { name: 'Zurück' }).click();
}
async function playWheel(page, title) {
  await openGameCard(page, title);
  await screenshot(page, 'correction-desktop-play-wheel-open');
  await assertPlayLayout(page, 'desktop wheel');
  const spin = page.getByRole('button', { name: 'Glücksrad drehen' });
  await spin.click();
  check(await page.getByText('Glücksrad Frage eins', { exact: true }).isVisible() || await page.getByText('Glücksrad Frage zwei', { exact: true }).isVisible(), 'wheel question content missing');
  check(await page.getByText(/1 von 2 Fragen gezogen/).isVisible(), 'wheel draw state missing');
  await spin.click();
  await spin.click();
  check(await page.getByText('Alle Fragen wurden gezogen. Das Glücksrad ist beendet.').isVisible(), 'wheel exhaustion missing');
  await page.getByRole('button', { name: 'Zurück' }).click();
}
async function playJeopardy(page, title) {
  await openGameCard(page, title);
  await screenshot(page, 'correction-desktop-play-jeopardy-open');
  await assertPlayLayout(page, 'desktop jeopardy');
  const tile = page.getByRole('button', { name: '100 Punkte' }).first();
  await tile.click();
  await page.getByRole('button', { name: 'Antwort einblenden' }).click();
  check(await page.getByText('Antwort: Eine überprüfbare Antwort').isVisible(), 'jeopardy answer not revealed');
  await page.getByRole('button', { name: 'Punkt vergeben' }).click();
  check(await tile.isDisabled(), 'jeopardy cell not one-use');
  check(await page.getByText('Punktestand: 100').isVisible(), 'jeopardy score missing');
  await page.getByRole('button', { name: 'Zurück' }).click();
}
async function playMemory(page, title) {
  await openGameCard(page, title);
  await screenshot(page, 'correction-desktop-play-memory-open');
  await assertPlayLayout(page, 'desktop memory');
  let cards = page.locator('.memory-card');
  const first = cards.first();
  await first.click();
  await first.click();
  check(await page.locator('.memory-card.revealed').count() === 1, 'same memory card accepted twice');
  await page.getByRole('button', { name: 'Zurück' }).click();
  await openGameCard(page, title);
  cards = page.locator('.memory-card');
  let pairIds = await cards.evaluateAll(nodes => nodes.map(node => node.dataset.pairId));
  const mismatchFirst = 0;
  const mismatchSecond = pairIds.findIndex((id, index) => index > 0 && id !== pairIds[0]);
  await cards.nth(mismatchFirst).click();
  await cards.nth(mismatchSecond).click();
  await page.waitForFunction(() => document.querySelectorAll('.memory-card.revealed').length === 0);
  await cards.nth(mismatchFirst).click();
  await cards.nth(mismatchSecond).click();
  await page.getByRole('button', { name: 'Zurück' }).click();
  await openGameCard(page, title);
  cards = page.locator('.memory-card');
  pairIds = await cards.evaluateAll(nodes => nodes.map(node => node.dataset.pairId));
  const indexes = new Map();
  pairIds.forEach((id, index) => { if (!indexes.has(id)) indexes.set(id, []); indexes.get(id).push(index); });
  for (const pair of indexes.values()) {
    await cards.nth(pair[0]).click();
    await cards.nth(pair[1]).click();
  }
  check(await page.getByText('Memory geschafft! Alle Paare gefunden.').isVisible(), 'memory completion missing');
  await page.getByRole('button', { name: 'Zurück' }).click();
}
async function playMatching(page, title) {
  await openGameCard(page, title);
  await screenshot(page, 'correction-desktop-play-matching-open');
  await assertPlayLayout(page, 'desktop matching');
  const items = page.locator('.choice-grid').first().getByRole('button');
  const groups = page.locator('.choice-grid').last().getByRole('button');
  await items.first().click();
  await groups.last().click();
  check(await page.getByText('gehört nicht', { exact: false }).isVisible(), 'matching wrong feedback missing');
  await items.first().click();
  await groups.first().click();
  await items.last().click();
  await groups.last().click();
  check(await page.getByText('Zuordnen geschafft! Alle Begriffe sind richtig sortiert.').isVisible(), 'matching completion missing');
  await page.getByRole('button', { name: 'Zurück' }).click();
}

await mkdir(evidence, { recursive: true });
const playwrightPackage = JSON.parse(await readFile(join(root, '.spiele-browser-qa', 'node_modules', 'playwright', 'package.json'), 'utf8'));
server.listen(0, '127.0.0.1');
await new Promise(resolve => server.once('listening', resolve));
const port = server.address().port;
const url = `http://127.0.0.1:${port}${basePath}`;
let browser;
try {
  browser = await chromium.launch({ headless: true, timeout: 15000, env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: browsersPath } });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', acceptDownloads: true, serviceWorkers: 'block' });
  context.setDefaultTimeout(10000);
  context.setDefaultNavigationTimeout(10000);
  const page = await context.newPage();
  page.on('console', message => { consoleMessages.push(`${message.type()}: ${message.text()}`); if (message.type() === 'error') failures.push(`console error: ${message.text()}`); });
  page.on('pageerror', error => { pageErrors.push(error.message); failures.push(`pageerror: ${error.message}`); });
  page.on('requestfailed', request => { failedRequests.push(`${request.url()} (${request.failure()?.errorText || 'failed'})`); failures.push(`asset/request failed: ${request.url()}`); });
  page.on('response', response => { if (response.status() >= 400) failures.push(`HTTP ${response.status()}: ${response.url()}`); });
  await page.request.get(`${url}deliberate-missing-resource.css`);
  check(httpErrors.some(error => error.status >= 400), 'HTTP >=400 response capture missing');

  await inspectCatalog(page, `http://127.0.0.1:${port}`);
  await page.goto(`${url}spiele/`);
  await page.getByRole('heading', { name: 'Spiele erstellen. Sofort spielen.' }).waitFor();
  await expectNoOverflow(page, 'games desktop');
  const types = ['tug', 'wheel', 'jeopardy', 'memory', 'matching'];
  for (let i = 0; i < types.length; i += 1) await createGame(page, types[i], i);
  check(await page.locator('.game-card').count() === 5, 'five saved games missing');
  await screenshot(page, 'correction-games-saved-1440');

  const exportCard = page.locator('.game-card').filter({ hasText: 'Browser Tauziehen' });
  const downloadPromise = page.waitForEvent('download');
  await exportCard.getByRole('button', { name: 'JSON exportieren' }).click();
  const download = await downloadPromise;
  const exportPath = join(evidence, 'spiele-tauziehen-export.json');
  await download.saveAs(exportPath);
  check((await stat(exportPath)).size > 0, 'export file empty');
  const chooser = page.locator('input[type=file]');
  await chooser.setInputFiles(exportPath);
  await page.getByRole('heading', { name: 'Browser Tauziehen' }).waitFor();
  await fillLabel(page, 'Titel', 'Browser Tauziehen');
  await page.getByRole('button', { name: 'Lokal speichern' }).click();
  await page.getByRole('heading', { name: 'Browser Tauziehen' }).waitFor();
  await page.reload();
  await page.locator('.game-card').filter({ hasText: 'Browser Tauziehen' }).getByRole('button', { name: 'Bearbeiten' }).click();
  check(await page.getByLabel('Titel').inputValue() === 'Browser Tauziehen', 'retained title missing after reload/import');
  check(await page.locator('select').inputValue() === 'Informatik', 'retained subject missing after reload/import');
  await page.getByRole('button', { name: 'Meine Spiele' }).click();

  const badFile = join(evidence, 'invalid.json');
  const hugeFile = join(evidence, 'over-1mb.json');
  await readFile(exportPath);
  await writeFile(badFile, '{not json');
  await writeFile(hugeFile, Buffer.alloc(1024 * 1024 + 1, 65));
  await chooser.setInputFiles(badFile);
  await checkText(page, 'Import abgebrochen: Ungültiges JSON.');
  check(await page.locator('.game-card').count() === 5, 'invalid import changed saved games');
  await chooser.setInputFiles(badFile);
  await checkText(page, 'Import abgebrochen: Ungültiges JSON.');
  await chooser.setInputFiles(hugeFile);
  await checkText(page, 'Import abgebrochen: JSON darf höchstens 1 MB groß sein.');
  check(await page.locator('.game-card').count() === 5, 'oversize import changed saved games');

  await playTug(page, 'Browser Tauziehen');
  await playWheel(page, 'Browser Glücksrad');
  await playJeopardy(page, 'Browser Jeopardy');
  await playMemory(page, 'Browser Memory');
  await playMatching(page, 'Browser Zuordnen');
  await screenshot(page, 'correction-games-final-1440');

  const narrow = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', hasTouch: true, acceptDownloads: true });
  const narrowPage = await narrow.newPage();
  narrowPage.on('console', message => { if (message.type() === 'error') failures.push(`narrow console error: ${message.text()}`); });
  narrowPage.on('pageerror', error => failures.push(`narrow pageerror: ${error.message}`));
  narrowPage.on('requestfailed', request => failures.push(`narrow request failed: ${request.url()}`));
  await narrowPage.goto(`${url}spiele/`);
  await narrowPage.getByRole('button', { name: 'Glücksrad' }).focus();
  await narrowPage.keyboard.press('Enter');
  await fillLabel(narrowPage, 'Titel', 'Touch Wheel');
  await fillLabel(narrowPage, 'Beschreibung', 'Persisted touch description.');
  await narrowPage.getByRole('button', { name: 'Frage hinzufügen' }).tap();
  await fillLabel(narrowPage, 'Frage / Impuls', 'Touch Frage');
  await fillLabel(narrowPage, 'Antwort für die Lehrkraft', 'Touch Antwort');
  await narrowPage.getByRole('button', { name: 'Lokal speichern' }).tap();
  check(await narrowPage.locator('.editor').count() === 0, 'narrow save still shows editor');
  const touchCard = narrowPage.locator('.game-card').filter({ hasText: 'Touch Wheel' });
  check(await touchCard.getByRole('button', { name: 'Bearbeiten' }).isVisible(), 'narrow saved card actions missing');
  await narrowPage.reload();
  await narrowPage.locator('.game-card').filter({ hasText: 'Touch Wheel' }).getByRole('button', { name: 'Bearbeiten' }).tap();
  check(await narrowPage.getByLabel('Titel').inputValue() === 'Touch Wheel', 'narrow title not persisted');
  check(await narrowPage.getByLabel('Beschreibung').inputValue() === 'Persisted touch description.', 'narrow description not persisted');
  check(await narrowPage.locator('.editor').isVisible(), 'narrow reopen did not open editor');
  await narrowPage.getByRole('button', { name: 'Meine Spiele' }).tap();
  await narrowPage.locator('.game-card').filter({ hasText: 'Touch Wheel' }).getByRole('button', { name: 'Spielen' }).tap();
  await assertPlayLayout(narrowPage, 'narrow wheel');
  await screenshot(narrowPage, 'correction-narrow-play-wheel');
  await narrowPage.getByRole('button', { name: 'Zurück' }).tap();
  await expectNoOverflow(narrowPage, 'games narrow');
  await screenshot(narrowPage, 'correction-narrow-saved');
  await narrow.close();

  const blocked = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  blocked.setDefaultTimeout(10000);
  blocked.setDefaultNavigationTimeout(10000);
  await blocked.addInitScript(() => { Object.defineProperty(window, 'localStorage', { configurable: true, value: { getItem() { throw new Error('simulated unavailable storage'); }, setItem() { throw new Error('simulated unavailable storage'); } } }); });
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(`${url}spiele/`);
  const blockedText = await blockedPage.locator('body').innerText();
  check(blockedText.includes('simulated unavailable storage'), `unavailable storage state not shown: ${blockedText}`);
  await blocked.close();
  const quota = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  quota.setDefaultTimeout(10000);
  await quota.addInitScript(() => { Object.defineProperty(window, 'localStorage', { configurable: true, value: { getItem() { return null; }, setItem() { throw new Error('simulated quota exceeded'); } } }); });
  const quotaPage = await quota.newPage();
  await quotaPage.goto(`${url}spiele/`);
  await quotaPage.getByRole('button', { name: 'Tauziehen', exact: false }).first().focus();
  await quotaPage.keyboard.press('Enter');
  await fillLabel(quotaPage, 'Titel', 'Quota Wheel');
  await fillLabel(quotaPage, 'Beschreibung', 'Quota retained editor contents.');
  await quotaPage.getByRole('button', { name: 'Frage hinzufügen', exact: true }).click();
  await fillLabel(quotaPage, 'Frage / Impuls', 'Quota Frage');
  await fillLabel(quotaPage, 'Antwort für die Lehrkraft', 'Quota Antwort');
  await quotaPage.getByRole('button', { name: 'Lokal speichern', exact: true }).click();
  check(await quotaPage.locator('.editor').isVisible(), 'quota failure discarded editor');
  check(await quotaPage.getByLabel('Beschreibung').inputValue() === 'Quota retained editor contents.', 'quota failure lost editor contents');
  check(await quotaPage.locator('.game-card').count() === 0, 'quota failure created success card');
  check(await quotaPage.getByText('simulated quota exceeded', { exact: false }).isVisible(), 'quota error not visible');
  await quota.close();
  const getterDenied = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  getterDenied.setDefaultTimeout(10000);
  const getterPage = await getterDenied.newPage();
  await getterDenied.addInitScript(() => { Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new Error('simulated getter denial'); } }); });
  await getterPage.goto(`${url}spiele/`);
  await getterPage.getByRole('heading', { name: 'Spiele erstellen. Sofort spielen.' }).waitFor();
  await getterPage.getByRole('button', { name: 'Tauziehen', exact: false }).first().click();
  await fillLabel(getterPage, 'Titel', 'Getter denied draft');
  await fillLabel(getterPage, 'Beschreibung', 'Draft remains after denied save.');
  await getterPage.getByRole('button', { name: 'Frage hinzufügen', exact: true }).click();
  await fillLabel(getterPage, 'Frage / Impuls', 'Denied storage question');
  await fillLabel(getterPage, 'Antwort für die Lehrkraft', 'Denied storage answer');
  await getterPage.getByRole('button', { name: 'Lokal speichern', exact: true }).click();
  check(await getterPage.locator('.editor').isVisible(), 'getter denial discarded editor');
  check(await getterPage.getByLabel('Titel').inputValue() === 'Getter denied draft', 'getter denial lost title');
  check(await getterPage.getByLabel('Beschreibung').inputValue() === 'Draft remains after denied save.', 'getter denial lost description');
  check(await getterPage.getByText('Lokaler Speicher ist nicht verfügbar. Nicht gespeichert.', { exact: true }).isVisible(), 'getter denial error missing');
  check(await getterPage.locator('.game-card').count() === 0, 'getter denial created success card');
  await screenshot(getterPage, 'correction-storage-getter-denied');
  await getterDenied.close();
  await context.close();

  if (failures.length) throw new Error(failures.join('\n'));
  console.log(JSON.stringify({ ok: true, playwright: playwrightPackage.version, chromium: browser.version(), url, gamesCreated: 5, screenshots: ['correction-catalog-1440.png', 'correction-games-saved-1440.png', 'correction-games-final-1440.png', 'correction-narrow-saved.png', 'correction-narrow-play-wheel.png', 'correction-desktop-play-tug-open.png', 'correction-desktop-play-wheel-open.png', 'correction-desktop-play-jeopardy-open.png', 'correction-desktop-play-memory-open.png', 'correction-desktop-play-matching-open.png', 'correction-storage-getter-denied.png'], consoleErrors: consoleMessages.filter(item => item.startsWith('error:')), pageErrors, failedRequests, httpErrors, storageSimulation: 'normal localStorage; unavailable getItem/setItem context; quota setItem failure with retained editor; getter denial functional save rejection' }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: error.message, consoleErrors: consoleMessages.filter(item => item.startsWith('error:')), pageErrors, failedRequests }, null, 2));
  process.exitCode = 1;
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
