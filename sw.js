const CDN_BASE = 'https://cdn.jsdelivr.net/gh/zynhguwkpzu707-byte/christmas-particle-tree@main';
const CACHE_NAME = 'christmas-mediapipe-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname + 'mediapipe/')) {
    return;
  }

  const target = CDN_BASE + '/' + url.pathname.slice(scope.pathname.length);
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(target, { mode: 'cors', credentials: 'omit' });
      if (response.ok) cache.put(request, response.clone());
      return response;
    } catch (error) {
      return fetch(request);
    }
  })());
});
