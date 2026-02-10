// Basic Service Worker to enable PWA install prompt
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Pass through all requests. 
  // We strictly need a fetch event listener for Chrome to recognize this as an installable PWA.
  // We avoid complex caching here to ensure live updates are always seen in this dynamic app context.
  e.respondWith(fetch(e.request));
});