const CACHE='linguacode-v2';
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(['/','/assets/app.css','/assets/qrcode-generator.min.js','/assets/app.js','/manifest.webmanifest']))));
self.addEventListener('fetch', event => { if (event.request.method === 'GET') event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request))); });
