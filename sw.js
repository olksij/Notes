// Chrome's currently missing some useful cache methods,
// this polyfill adds them.
importScripts('sw-cache-polyfill.js');

// Here comes the install event!
// This only happens once, when the browser sees this
// version of the ServiceWorker for the first time.
self.addEventListener('install', function(event) {
  // We pass a promise to event.waitUntil to signal how 
  // long install takes, and if it failed
  event.waitUntil(
    // We open a cache…
    caches.open('sw-notes-v1.0.1').then(function(cache) {
      // And add resources to it
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

// The fetch event happens for the page request with the
// ServiceWorker's scope, and any request made within that
// page
self.addEventListener('fetch', function(event) {
  // Calling event.respondWith means we're in charge
  // of providing the response. We pass in a promise
  // that resolves with a response object
  event.respondWith(
    // First we look for something in the caches that
    // matches the request
    caches.match(event.request).then(function(response) {
      // If we get something, we return it, otherwise
      // it's null, and we'll pass the request to
      // fetch, which will use the network.
      return response || fetch(event.request);
    })
  );
});