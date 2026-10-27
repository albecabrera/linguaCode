import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve, sep} from 'node:path';

const root = resolve(new URL('../pages/ki8/', import.meta.url).pathname);
const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
  const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
  const file = resolve(root, relative);
  if (!file.startsWith(`${root}${sep}`) && file !== root) {
    response.writeHead(404).end();
    return;
  }
  try {
    const body = await readFile(file);
    response.writeHead(200, {'content-type': 'text/html; charset=utf-8'}).end(body);
  } catch {
    response.writeHead(404).end();
  }
});

await new Promise((resolveServer) => server.listen(0, '127.0.0.1', resolveServer));
try {
  const {port} = server.address();
  const origin = `http://127.0.0.1:${port}`;
  const entryResponse = await fetch(`${origin}/`);
  assert.equal(entryResponse.status, 200);
  const entry = await entryResponse.text();
  assert.match(entry, /id="mission-list"/);
  assert.match(entry, /href="\.\/stunde-1\/"/);
  assert.match(entry, /href="\.\/stunde-2\/"/);
  assert.match(entry, /href="\.\/stunde-3\/"/);
  assert.doesNotMatch(entry, /href="\.\/modul-\d+\.html#stunde-\d+"|id="modules"/);
  const appResponse = await fetch(`${origin}/app.mjs`);
  assert.equal(appResponse.status, 200);
  const app = await appResponse.text();
  assert.match(app, /initCourseIntegration/);
  assert.doesNotMatch(app, /modul-\$\{index \+ 1\}\.html#stunde-\$\{hour\}/);
  const style = await readFile(resolve(root, 'style.css'), 'utf8');
  assert.match(style, /header a span, \.eyebrow \{ color: var\(--accent\); \}/);
  assert.match(style, /\.activity input\[type=radio\] \{ min-width: 20px; min-height: 20px;/);
  assert.match(style, /\.activity button \{ margin: \.7rem 0; \}/);
  assert.match(style, /\.hero \{/);
  assert.match(style, /\.modules \{/);
  assert.match(style, /\.module \{/);
  assert.match(style, /input\[type=number\] \{/);
  assert.match(style, /#result \{/);
  assert.doesNotMatch(style, /(?:^|\n)input,button \{/);
  const hours = [2, 2, 4, 2, 3, 5];
  for (let module = 1; module <= 6; module += 1) {
    const pageResponse = await fetch(`${origin}/modul-${module}.html`);
    assert.equal(pageResponse.status, 200);
    const page = await pageResponse.text();
    for (let hour = 1; hour <= hours[module - 1]; hour += 1) {
      assert.match(page, new RegExp(`id="stunde-${hour}"`));
    }
  }
  assert.equal((await fetch(`${origin}/modul-1.html`)).status, 200);
  assert.equal((await fetch(`${origin}/../docs/ki-wp8/demo/index.html`)).status, 404);
  console.log('PASS: static /ki8/ mission-only entry and all 18 retained source-hour anchors are reachable; private demo path is absent.');
} finally {
  server.close();
}
