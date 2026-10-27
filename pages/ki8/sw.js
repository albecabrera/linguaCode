const CACHE_NAME = 'ki8-shell-v2';
const MISSION_ROUTES = Array.from({length: 19}, (_, index) => `./stunde-${index + 1}/`);
const SHELL_ASSETS = [
  './', './index.html', './style.css', './checkpoints.css', './app.mjs', './catalog.mjs', './checkpoints.mjs', './presentation.mjs', './manifest.webmanifest', './icon.svg',
  './mission/course-integration.css', './mission/course-integration.mjs', './mission/theme.mjs', './mission/mission.css', './mission/mission.mjs', './mission/progress.mjs', './mission/lesson-data.mjs', './mission/fruit-lab.mjs',
  '../assets/qrcode-generator.min.js',
  ...MISSION_ROUTES,
];
const ASSET_PATHS = new Set(SHELL_ASSETS.map((asset) => new URL(asset, self.location).pathname));

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith('ki8-shell-') && key !== CACHE_NAME).map((key) => caches.delete(key)),
    )).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const requestURL = new URL(event.request.url);
  const sameOrigin = requestURL.origin === self.location.origin;
  if (event.request.method !== 'GET' || !sameOrigin || !ASSET_PATHS.has(requestURL.pathname)) return;

  const networkAndCache = () => fetch(event.request).then((response) => {
    if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
    return response;
  });
  if (event.request.mode === 'navigate') {
    event.respondWith(networkAndCache().catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || networkAndCache()));
});
