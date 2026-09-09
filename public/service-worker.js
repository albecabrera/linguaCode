const CACHE='linguacode-v3';
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(['/offline.html','/assets/app.css','/assets/qrcode-generator.min.js','/assets/app.js','/manifest.webmanifest']))));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const cacheable = url.origin === self.location.origin && (url.pathname.startsWith('/e/') || url.pathname.startsWith('/assets/') || url.pathname === '/manifest.webmanifest');
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(response => {
    if (response.ok && cacheable) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
    return response;
  }).catch(() => caches.match('/offline.html'))));
});
