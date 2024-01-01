const CACHE_NAME = 'aplikacja-pogodowa';
const urlsToCache = [
    '',
    'index.html',
    'manifest.json',
    'script.js',
    'styles.js',
    'service-worker.js',
    'ico.png'
];

// Instalacja Service Worker'a
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Aktualizacja Service Worker'a
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});

// Obsługa zapytań sieciowych
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Zwróć odpowiedź z cache, jeśli istnieje
                if (response) {
                    return response;
                }

                // W przeciwnym razie pobierz zasób z sieci
                return fetch(event.request);
            })
    );
});
