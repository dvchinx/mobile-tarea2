const CACHE_NAME = 'snake-game-cache-v1';
// Agrega aquí el nombre de tu archivo HTML principal
const urlsToCache = [
  '/',
  'index.html', // O el nombre de tu archivo HTML
  'https://cdn-icons-png.flaticon.com/128/3895/3895186.png'
];

// Evento de instalación: se abre el caché y se guardan los archivos principales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de activación: limpia cachés antiguos si los hay
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento fetch: intercepta las peticiones y sirve desde el caché si es posible
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el recurso está en el caché, lo devuelve
        if (response) {
          return response;
        }
        // Si no, realiza la petición a la red
        return fetch(event.request);
      }
    )
  );
});
