// service-worker.js
self.addEventListener('install', function (e) {
  console.log('Service Worker: Installed');
  e.waitUntil(
    caches.open('v1').then(function (cache) {
      return cache.addAll([
        '/',
        '/absensi/index.html',
        '/absensi/manifest.json',
        '/absensi/icons/icon-192.png',
        '/absensi/icons/icon-192-maskable.png',
        '/absensi/icons/icon-512.png',
        '/absensi/icons/icon-512-maskable.png',
        // tambahkan semua file statis yang ingin di-cache
      ]);
    })
  );
});

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});
