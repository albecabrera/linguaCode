import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '../.spiele-browser-qa/node_modules/playwright/index.mjs';
import { vocabulary } from '../pages/spanisch-tauziehen/core.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const basePath = '/linguaCode/';
const browsersPath = join(root, '.spiele-browser-qa', 'browsers');
const mime = { '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
const fileFor = url => {
  let pathname = decodeURIComponent(new URL(url, 'http://127.0.0.1').pathname);
  if (!pathname.startsWith(basePath)) return null;
  pathname = pathname.slice(basePath.length - 1);
  const candidate = normalize(join(root, pathname === '/' || pathname.endsWith('/') ? '/pages/spanisch-tauziehen/index.html' : `/pages${pathname}`));
  return candidate.startsWith(root) ? candidate : null;
};
const server = createServer(async (request, response) => {
  try {
    const file = fileFor(request.url || '/'); const info = file && await stat(file);
    if (!info?.isFile()) throw new Error('missing');
    response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(await readFile(file));
  } catch { response.writeHead(404); response.end('Not found'); }
});
const answersFor = prompt => {
  if (prompt.startsWith('Was bedeutet «')) {
    const spanish = prompt.match(/«(.*)»/)?.[1];
    return vocabulary.filter(pair => pair.spanish === spanish).map(pair => pair.german);
  }
  const german = prompt.match(/„(.*)“/)?.[1];
  return vocabulary.filter(pair => pair.german === german).map(pair => pair.spanish);
};
const clickCorrect = async page => {
  await page.waitForFunction(() => Boolean(document.querySelector('#shared-turn .shared-prompt')?.textContent));
  const data = await page.locator('#shared-turn').evaluate(node => ({ prompt: node.querySelector('.shared-prompt')?.textContent || '', labels: [...node.querySelectorAll('.shared-answers button')].map(button => button.textContent) }));
  const candidates = answersFor(data.prompt);
  const index = data.labels.findIndex(label => candidates.includes(label));
  assert.ok(index >= 0, `correct answer button missing for ${data.prompt}`);
  await page.locator('#shared-turn .shared-answers button').nth(index).click();
};
server.listen(0, '127.0.0.1');
await new Promise(resolve => server.once('listening', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true, timeout: 15000, env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: browsersPath } });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const pageErrors = []; page.on('pageerror', error => pageErrors.push(error.message));
  page.setDefaultTimeout(10000);
  await page.goto(`http://127.0.0.1:${server.address().port}${basePath}spanisch-tauziehen/`);
  await page.getByRole('button', { name: 'Duell starten →', exact: true }).click();
  const shared = page.locator('#shared-turn');
  assert.equal(pageErrors.length, 0, `standalone page errors: ${pageErrors.join('; ')}`);
  assert.equal(await shared.getAttribute('hidden'), null, 'shared panel is not hidden after start');
  assert.equal(await shared.isVisible(), true);
  await clickCorrect(page);
  await assert.match(await shared.locator('.feedback').textContent(), /Richtig/);
  await shared.getByRole('button', { name: /Weiter/ }).click();

  await shared.locator('p').first().waitFor();
  await assert.match(await shared.locator('h2').textContent(), /Equipo Naranja ist am Zug/);
  let rounds = 1;
  while (await shared.evaluate(node => node.querySelectorAll('.shared-answers button').length > 0) && rounds < 205) {
    await clickCorrect(page);
    await assert.match(await shared.locator('.feedback').textContent(), /Richtig/);
    const next = shared.getByRole('button', { name: /Weiter|Team abschließen/ });
    if (await next.count()) await next.click();
    rounds += 1;
  }
  assert.equal(await page.locator('#result').isVisible(), true, `completion result is visible after ${rounds} rounds`);
  assert.ok(await page.getByRole('button', { name: /Noch einmal spielen/ }).count(), 'restart control exists');
  await page.getByRole('button', { name: /Noch einmal spielen/ }).click();
  assert.equal(await page.locator('#score-0').textContent(), '0');
  assert.equal(await page.locator('#score-1').textContent(), '0');
  assert.ok(await page.getByRole('button', { name: /Vollbild/ }).count(), 'fullscreen control exists');
  console.log(`PASS: standalone Spanish browser probe — shared panel, wrong/correct turns, completion, restart and fullscreen (${rounds} rounds)`);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
