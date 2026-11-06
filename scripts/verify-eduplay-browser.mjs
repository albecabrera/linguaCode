import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { connect } from 'node:net';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { activities } from '../pages/eduplay/examples.mjs';

const root = join(process.cwd(), 'pages');
const chromeCandidates = [
  process.env.CHROME_PATH,
  'google-chrome',
  'google-chrome-stable',
  'chromium',
  'chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

// Avoid a shell dependency for PATH lookup when possible.
function findChrome() {
  for (const candidate of chromeCandidates) {
    if (candidate.startsWith('/') && existsSync(candidate)) return candidate;
    if (!candidate.startsWith('/')) {
      const paths = (process.env.PATH || '').split(':');
      for (const directory of paths) {
        const path = join(directory, candidate);
        try { if (statSync(path).isFile()) return path; } catch {}
      }
    }
  }
  return null;
}

function contentType(path) {
  return ({ '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' })[extname(path)] || 'application/octet-stream';
}

function startServer() {
  const server = createServer((request, response) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname); } catch { response.writeHead(400); response.end(); return; }
    if (!pathname.startsWith('/linguaCode/')) { response.writeHead(404); response.end('Not found'); return; }
    let relative = pathname.slice('/linguaCode/'.length);
    if (!relative || relative.endsWith('/')) relative += 'index.html';
    const file = normalize(join(root, relative));
    if (!file.startsWith(`${root}/`)) { response.writeHead(403); response.end(); return; }
    try { response.writeHead(200, { 'content-type': contentType(file) }); response.end(readFileSync(file)); }
    catch { response.writeHead(404); response.end('Not found'); }
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port })));
}

function waitFor(predicate, timeout = 10000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      Promise.resolve(predicate()).then(result => {
        if (result) return resolve();
        if (Date.now() - started > timeout) return reject(new Error('Timed out waiting for Chrome DevTools.'));
        setTimeout(tick, 50);
      }, reject);
    };
    tick();
  });
}

class DevToolsSocket {
  constructor(url) { this.url = new URL(url); this.buffer = Buffer.alloc(0); this.pending = new Map(); this.nextId = 1; }
  async connect() {
    const socket = await new Promise((resolve, reject) => {
      const request = connect(Number(this.url.port), this.url.hostname);
      request.once('error', reject);
      request.once('connect', () => {
        const key = Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64');
        request.write(`GET ${this.url.pathname} HTTP/1.1\r\nHost: ${this.url.host}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: ${key}\r\nSec-WebSocket-Version: 13\r\n\r\n`);
      });
      let handshake = Buffer.alloc(0);
      const onData = data => {
        handshake = Buffer.concat([handshake, data]);
        const boundary = handshake.indexOf('\r\n\r\n');
        if (boundary >= 0) { request.off('data', onData); request.on('data', chunk => this.onData(chunk)); resolve(request); }
      };
      request.on('data', onData);
    });
    this.socket = socket;
    this.socket.on('close', () => {
      for (const { reject } of this.pending.values()) reject(new Error('Chrome closed the DevTools connection.'));
      this.pending.clear();
    });
  }
  onData(data) {
    this.buffer = Buffer.concat([this.buffer, data]);
    while (this.buffer.length >= 2) {
      const first = this.buffer[0], second = this.buffer[1]; let length = second & 127; let header = 2;
      if (length === 126) { if (this.buffer.length < 4) return; length = this.buffer.readUInt16BE(2); header = 4; }
      else if (length === 127) { if (this.buffer.length < 10) return; length = Number(this.buffer.readBigUInt64BE(2)); header = 10; }
      if (this.buffer.length < header + length) return;
      const payload = this.buffer.subarray(header, header + length); this.buffer = this.buffer.subarray(header + length);
      if ((first & 0x0f) !== 1) continue;
      const message = JSON.parse(payload.toString());
      if (message.id && this.pending.has(message.id)) { const { resolve, reject } = this.pending.get(message.id); this.pending.delete(message.id); message.error ? reject(new Error(message.error.message)) : resolve(message.result); }
    }
  }
  send(method, params = {}) {
    const id = this.nextId++;
    const payload = Buffer.from(JSON.stringify({ id, method, params }));
    const mask = Buffer.from([1, 2, 3, 4]); const masked = Buffer.alloc(payload.length);
    for (let i = 0; i < payload.length; i++) masked[i] = payload[i] ^ mask[i % 4];
    const length = masked.length < 126 ? Buffer.from([0x80 | masked.length]) : Buffer.from([0x80 | 126, masked.length >> 8, masked.length & 255]);
    this.socket.write(Buffer.concat([Buffer.from([0x81]), length, mask, masked]));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  close() { this.socket?.end(); }
}

async function main() {
  const chrome = findChrome();
  if (!chrome) { console.log('EduPlay browser smoke checks skipped: installed headless Chrome was not found.'); return; }
  const { server, port } = await startServer();
  const legacyPath = join(process.cwd(), `.tmp-eduplay-browser-${process.pid}`);
  const ownsLegacyPath = !existsSync(legacyPath);
  if (ownsLegacyPath) { mkdirSync(legacyPath); writeFileSync(join(legacyPath, 'sentinel'), 'must survive'); }
  const temp = mkdtempSync(join(process.cwd(), '.tmp-eduplay-browser-'));
  assert.ok(existsSync(legacyPath), 'existing similarly named path remains untouched');
  if (ownsLegacyPath) assert.equal(readFileSync(join(legacyPath, 'sentinel'), 'utf8'), 'must survive');
  const browser = spawn(chrome, ['--headless=new', '--no-sandbox', '--disable-gpu', '--remote-allow-origins=*', '--remote-debugging-port=0', `--user-data-dir=${temp}`, 'about:blank'], { stdio: ['ignore', 'pipe', 'pipe'] });
  let stderr = '';
  browser.stdout.on('data', chunk => { stderr += chunk.toString(); });
  browser.stderr.on('data', chunk => { stderr += chunk.toString(); });
  let cleanupPromise;
  const cleanup = () => {
    if (cleanupPromise) return cleanupPromise;
    cleanupPromise = (async () => {
      const stopped = browser.exitCode !== null || browser.signalCode !== null
        ? Promise.resolve()
        : new Promise(resolve => browser.once('close', resolve));
      if (browser.exitCode === null && browser.signalCode === null) browser.kill('SIGTERM');
      await Promise.race([stopped, new Promise(resolve => setTimeout(resolve, 2000))]);
      server.close();
      rmSync(temp, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
      if (ownsLegacyPath) rmSync(legacyPath, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    })();
    return cleanupPromise;
  };
  const handleSignal = signal => cleanup().then(() => process.exit(signal === 'SIGTERM' ? 143 : 130));
  process.once('SIGTERM', handleSignal);
  process.once('SIGINT', handleSignal);
  try {
    await waitFor(() => /DevTools listening on (ws:\/\/\S+)/.test(stderr)).catch(error => { throw new Error(`${error.message} ${stderr.trim()}`); });
    const endpoint = stderr.match(/DevTools listening on (ws:\/\/\S+)/)[1];
    const endpointURL = new URL(endpoint);
    const targets = await (await fetch(`http://${endpointURL.host}/json/list`)).json();
    const pageTarget = targets.find(target => target.type === 'page');
    assert.ok(pageTarget?.webSocketDebuggerUrl, 'Chrome page target is available');
    const socket = new DevToolsSocket(pageTarget.webSocketDebuggerUrl); await socket.connect();
    await socket.send('Page.enable'); await socket.send('Runtime.enable');
    const base = `http://127.0.0.1:${port}/linguaCode/eduplay/`;
    const evaluate = async expression => (await socket.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.value;
    const open = async url => { await socket.send('Page.navigate', { url }); await waitFor(() => evaluate('document.readyState === "complete" && document.body.textContent.trim()').then(Boolean)).catch(error => { throw new Error(`${error.message} while opening ${url}`); }); };
    for (const activity of activities) {
      const url = `${base}?game=${encodeURIComponent(activity.id)}`;
      await open(url);
      assert.equal(await evaluate('document.querySelector(".game-heading h1")?.textContent'), activity.title, `${activity.id} direct URL`);
      await socket.send('Page.reload', { ignoreCache: true });
      await waitFor(() => evaluate('document.querySelector(".game-heading h1")?.textContent').then(value => value === activity.title));
    }
    await open(`${base}?studio=1`);
    await evaluate(`localStorage.setItem('linguacode.eduplay.drafts.v1', ${JSON.stringify(JSON.stringify([activities[0]]))})`);
    await socket.send('Page.reload', { ignoreCache: true });
    await waitFor(() => evaluate('document.body.textContent.includes("lokaler Entwurf")'));
    await evaluate('document.querySelector(".studio-card button:nth-of-type(2)")?.click()');
    await waitFor(() => evaluate('document.body.textContent.includes("Vorschau (lokaler Entwurf)")'));
    assert.equal(await evaluate('[...document.querySelectorAll("button")].some(button => button.textContent.includes("Link / QR-Code"))'), false, 'local draft has no share link');
    await open(`${base}?game=${encodeURIComponent(activities[0].id)}`);
    await evaluate('[...document.querySelectorAll("button")].find(button => button.textContent === "Link / QR-Code")?.click()');
    await waitFor(() => evaluate('document.querySelector("#share")?.open === true'));
    assert.equal(await evaluate('document.querySelector("#qr")?.src.startsWith("data:image/")'), true, 'packaged activity QR code');
    await open(`http://127.0.0.1:${port}/linguaCode/`);
    assert.equal(await evaluate('[...document.querySelectorAll("a")].some(link => link.textContent.trim() === "Starten" && link.getAttribute("href") === "eduplay/")'), true, 'catalog EduPlay link');
    console.log(`EduPlay browser smoke checks passed: ${activities.length} direct URLs, reloads, local-draft sharing, packaged QR, catalog link.`);
    socket.close();
  } finally {
    process.off('SIGTERM', handleSignal);
    process.off('SIGINT', handleSignal);
    await cleanup();
  }
}

await main();
