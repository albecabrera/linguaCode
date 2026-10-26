import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';

const HOST = '127.0.0.1';
const ROOT = fileURLToPath(new URL('../', import.meta.url));
const allowed = new Map([
  ['/docs/ki-wp8/demo/index.html', 'text/html; charset=utf-8'],
  ['/docs/ki-wp8/demo/app.mjs', 'text/javascript; charset=utf-8'],
  ['/docs/ki-wp8/demo/model.mjs', 'text/javascript; charset=utf-8'],
  ['/docs/ki-wp8/demo/style.css', 'text/css; charset=utf-8'],
  ['/pages/ki8/module2-core.mjs', 'text/javascript; charset=utf-8'],
]);
const files = new Map([
  ['/docs/ki-wp8/demo/index.html', 'docs/ki-wp8/demo/index.html'],
  ['/docs/ki-wp8/demo/app.mjs', 'docs/ki-wp8/demo/app.mjs'],
  ['/docs/ki-wp8/demo/model.mjs', 'docs/ki-wp8/demo/model.mjs'],
  ['/docs/ki-wp8/demo/style.css', 'docs/ki-wp8/demo/style.css'],
  ['/pages/ki8/module2-core.mjs', 'pages/ki8/module2-core.mjs'],
]);

function safePath(requestUrl) {
  const rawPath = String(requestUrl || '').split('?', 1)[0];
  if (rawPath.includes('\\') || /(?:^|\/)\.\.(?:\/|$)/.test(rawPath)) return null;
  try {
    const decoded = decodeURIComponent(rawPath);
    if (decoded.includes('\\') || /(?:^|\/)\.\.(?:\/|$)/.test(decoded)) return null;
    return decoded;
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET') {
    response.writeHead(404);
    response.end();
    return;
  }
  const pathname = safePath(request.url);
  const contentType = pathname && allowed.get(pathname);
  const relativeFile = pathname && files.get(pathname);
  if (!contentType || !relativeFile) {
    response.writeHead(404);
    response.end();
    return;
  }
  try {
    const body = await readFile(join(ROOT, relativeFile));
    response.writeHead(200, {'content-type': contentType, 'cache-control': 'no-store'});
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end();
  }
});

const argumentIndex = process.argv.indexOf('--port');
const port = argumentIndex >= 0 ? Number(process.argv[argumentIndex + 1]) : 8099;
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new RangeError('Port must be between 0 and 65535.');
server.listen(port, HOST, () => {
  const address = server.address();
  console.log(`READY ${HOST}:${address.port}`);
});
