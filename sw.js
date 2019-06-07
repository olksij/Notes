var FluxAppBuild = '1085';

self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(caches.open(FluxAppBuild).then(function(cache) {
        return cache.addAll(['./', 
            './index.html', 
            './FluxUI.css', 
            './main.css', 
            './main.js', 
            './404.html',
            './auth.js',
            './Assets/favicon.ico', 
            './Assets/AppIcon.png', 
            './Assets/AppIcon512.png', 
            './Assets/favicon-16x16.png', 
            './Assets/favicon-32x32.png', 
            './Fonts/GoogleSans-Medium.ttf',
            './Fonts/GoogleSans-Regular.ttf',
            './Fonts/GoogleSans-Bold.ttf',
            './firestore.js'
        ]);
    }));
});

self.addEventListener('activate', function(event) {
    event.waitUntil(caches.keys().then(function(cacheNames) {
        return Promise.all(cacheNames.filter(function(cacheName) {
            if (FluxAppBuild != cacheName) {
                return true;
            } else {
                return false;
            }
        }).map(function(cacheName) {
            console.log("%c[-]", 'color: red',' cache: ', cacheName);
            return caches.delete(cacheName);
        }));
    }));
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    event.respondWith(fetch(event.request).catch(function() {
        return caches.match(event.request);
    }));
});
