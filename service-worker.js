// service-worker.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE_NAME = 'absensi-cache-v1';
const OFFLINE_PAGE = '/absensi/offline.html'; // pastikan file ini ada

// Aktifkan skipWaiting agar langsung aktif
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Cache saat install
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/absensi/',
        '/absensi/index.html',
        '/absensi/manifest.json',
        '/absensi/offline.html',
        '/absensi/icons/icon-192.png',
        '/absensi/icons/icon-192-maskable.png',
        '/absensi/icons/icon-512.png',
        '/absensi/icons/icon-512-maskable.png',
        // tambahkan file statis lainnya jika ada
      ]);
    })
  );
  self.skipWaiting();
});

// Aktivasi dan hapus cache lama
self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

// Fetch: gunakan cache dulu, fallback ke network, fallback ke offline.html
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((resp) => {
          return resp || caches.match(OFFLINE_PAGE);
        });
      })
  );
});


// ------------------------------
// ✅ Background Sync
// ------------------------------
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-form') {
    event.waitUntil(syncFormData());
  }
});

async function syncFormData() {
  // Logika kirim ulang data form yang tertunda
  console.log('[SW] Syncing form data...');
  // Misalnya ambil dari IndexedDB atau storage lokal lainnya
}

// ------------------------------
// ✅ Periodic Sync
// ------------------------------
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-data') {
    event.waitUntil(updateData());
  }
});

async function updateData() {
  console.log('[SW] Periodic Sync...');
  // Fetch atau update data dari API jika perlu
}

// ------------------------------
// ✅ Push Notification
// ------------------------------
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {
    title: "Pemberitahuan",
    body: "Ini adalah notifikasi push default.",
  };

  const options = {
    body: data.body,
    icon: '/absensi/icons/icon-192.png',
    badge: '/absensi/icons/icon-192-maskable.png'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
