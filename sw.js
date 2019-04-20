const cacheName = 'f-notes-v1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(
        [
          './',
          './index.html',
          './FluxUI.css',
          './main.css',
          './main.js',
          './Assets/AppIcon.ico',
          './Assets/AppIcon.png',
          './Assets/AppIcon512.png',
          './Assets/AppIconWhite.svg',
          './Fonts/GoogleSans-Medium.ttf',
          './Fonts/GoogleSans-Regular.ttf',
          './Fonts/GoogleSans-Bold.ttf',
          './JS/buttons.js',
          './JS/firestore.js'
        ]
      );
    })
  );
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(cacheName).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}