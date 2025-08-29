const CACHE_NAME = 'getraenkerechner-cache-v8';
const urlsToCache = [
    '/manifest.json',
    '/manifest.webmanifest',
    '/index.html',
    '/tribuene.html',
    '/essen.html',
    '/vendor/driver_js/driver.js',
    '/vendor/driver_js/driver.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
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

self.addEventListener("message", (event) => {
    console.log("Message received in SW:", event.data);
    if (event.data && event.data.type === "GET_CONSTANT") {
        event.source.postMessage({
            type: "CONSTANT_RESPONSE",
            value: CACHE_NAME
        });
    }
});
