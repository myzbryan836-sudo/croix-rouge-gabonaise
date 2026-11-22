const CACHE_NAME = 'cr-terrain-v15';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './favicon-64.png',
  './apple-touch-icon.png',
  './logo-header.png',
  './alert-center.css',
  './alert-center.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

self.addEventListener('push', (event) => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch (_) {}
  const title = payload.title || 'Nouvelle alerte urgence';
  const options = {
    body: payload.body || 'Un nouveau signalement est disponible.',
    icon: './icon-192.png',
    badge: './icon-192.png',
    data: payload.data || {},
    tag: payload.tag || 'carnet-terrain-alert',
    requireInteraction: true,
    actions: [
      { action: 'open', title: 'Ouvrir' },
      { action: 'ack', title: 'Accuser reception' }
    ],
    vibrate: [300, 150, 300, 150, 800]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((items) => {
      const reportId = event.notification.data && event.notification.data.id;
      if (event.action === 'ack' && items.length) {
        return items[0].focus().then(() => {
          items[0].postMessage({ type: 'ACK_ALERT', id: reportId });
        });
      }
      const target = event.action === 'ack' && reportId
        ? './index.html?ack=' + encodeURIComponent(reportId)
        : './index.html';
      return clients.openWindow(target);
    })
  );
});
