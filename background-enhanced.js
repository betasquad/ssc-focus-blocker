// Enhanced Service Worker Code
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('your-cache-name').then((cache) => {
            return cache.addAll([
                '/index.html',
                '/styles.css',
                '/script.js',
                '/images/image.png',
                // Add any other files needed
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['your-cache-name'];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});