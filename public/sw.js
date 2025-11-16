// Service Worker para caching de recursos estáticos
// Melhorar performance e experiência offline

const CACHE_NAME = 'asof-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/favicon.ico',
  // Adicionar outros assets importantes
];

// Install: Cache recursos essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Limpar caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch: Resposta com cache primeiro para recursos estáticos
self.addEventListener('fetch', (event) => {
  // Só cache requests do mesmo origin
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Cache responses válidas
        if (
          response.status === 200 &&
          response.type === 'basic'
        ) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }

        return response;
      }).catch(() => {
        // Fallback para offline se disponível
        return caches.match(STATIC_ASSETS[0]);
      });
    })
  );
});
