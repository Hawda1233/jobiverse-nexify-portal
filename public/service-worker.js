
// Cache version identifier
const CACHE_VERSION = 'nexify-v1';

// List of assets to cache
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/og-image.png',
  '/placeholder.svg'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => {
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return cacheName !== CACHE_VERSION;
          })
          .map(cacheName => {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

// Fetch event - cache first strategy for static assets
self.addEventListener('fetch', event => {
  // Skip for API calls and other non-GET requests
  if (
    !event.request.url.startsWith(self.location.origin) || 
    event.request.method !== 'GET' ||
    event.request.url.includes('/api/') ||
    event.request.url.includes('chrome-extension')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(response => {
            // Don't cache if not valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_VERSION)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});
