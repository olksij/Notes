//importScripts('sw-cache-polyfill.js');

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('sw-notes-v1.1').then(function(cache) {
      return cache.addAll([
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
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});