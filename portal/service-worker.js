const CACHE_NAME = 'dispatchanchor-portal-v2';
const ASSETS = [
  '/portal/',
  '/portal/index.html',
  '/portal/portal.css?v=2',
  '/portal/portal.js?v=2',
  '/portal/manifest.webmanifest',
  '/assets/dispatchanchor/icon-32.png',
  '/assets/dispatchanchor/icon-180.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== location.origin || !requestUrl.pathname.startsWith('/portal/')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('/portal/index.html')))
  );
});
