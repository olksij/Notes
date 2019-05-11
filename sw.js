var FluxAppBuild = '1044';

self.addEventListener('install', function(event) {
    self.skipWaiting();
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
    console.log("Activated");
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    if (FluxAppBuild!=cacheName) {
                        return true;
                    }
                    else{
                        return false;
                    }
                }).map(function(cacheName) {
                    console.log("Delete cache: ", cacheName);
                    return caches.delete(cacheName);
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return caches.match(event.request);
        })
    );
});
