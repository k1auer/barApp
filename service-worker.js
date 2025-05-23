const CACHE_NAME = 'getraenkerechner-cache-v4';
const urlsToCache = [
    '/',
    '/index.html',
    '/essen.html',
    '/vendor/driver_js/driver.js',
    '/vendor/driver_js/driver.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
        )
    );
});
