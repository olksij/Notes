var FluxAppBuild = '1014';

self.addEventListener('install', function(event) {
    console.log("Caching..");
    event.waitUntil(
        caches.open(FluxAppBuild).then(function(cache) {
            return cache.addAll([
                './',
                './index.html',
                './FluxUI.css',
                './main.css',
                './main.js',
                './404.html',
                './manifest.json',
                './Assets/AppIcon.ico',
                './Assets/AppIcon.png',
                './Assets/AppIcon512.png',
                './Assets/AppIconWhite.svg',
                './Fonts/GoogleSans-Medium.ttf',
                './Fonts/GoogleSans-Regular.ttf',
                './Fonts/GoogleSans-Bold.ttf',
                './firestore.js'
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    console.log(cacheName);
                    if (parseInt(cacheName)<parseInt(FluxAppBuild)) {
                        return true;
                    }
                    else{
                        return false;
                    }
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
  });

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        }).catch(function() {
            console.log('rip ' + event.request.url);
        })
    );
  });