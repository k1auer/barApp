const CACHE_NAME = 'getraenkerechner-cache-v1';
const urlsToCache = [
    '/',
    '/bar.html',
    '/manifest.json',
    '/img.png'
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
