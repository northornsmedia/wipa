// WIPA PWA Service Worker
const CACHE_NAME = 'wipa-cache-v3';
const IMAGE_CACHE_NAME = 'wipa-images-v1';
const OFFLINE_URL = '/platform';

const STATIC_ASSETS = [
  '/',
  '/platform',
  '/manifest.json',
  '/wipaoffm.png',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== IMAGE_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Stale-while-revalidate lets previously seen images paint immediately,
  // including public Supabase Storage media and avatars.
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        const network = fetch(event.request)
          .then((response) => {
            if (response.ok || response.type === 'opaque') {
              cache.put(event.request, response.clone()).then(async () => {
                const keys = await cache.keys();
                if (keys.length > 120) await cache.delete(keys[0]);
              });
            }
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Exclude API calls, supabase auth, or chrome extensions from caching
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/auth/') ||
    url.hostname.includes('supabase') ||
    url.hostname.includes('clarity.ms')
  ) {
    return;
  }

  // Network first with cache fallback strategy for maximum freshness
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (url.pathname.startsWith('/_next/static/') || url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg') || url.pathname.endsWith('.svg'))
        ) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        });
      })
  );
});

// --- Native Background Push Notifications (Android & iOS Web Push) ---

const reportSWLog = (eventName, metadata = {}) => {
  try {
    fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: eventName,
        page_route: '/service-worker',
        page_title: 'Service Worker Background Execution',
        metadata
      })
    }).catch(() => {});
  } catch (e) {}
};

self.addEventListener('push', (event) => {
  reportSWLog('sw_push_event_received', { timestamp: Date.now() });

  let data = {
    title: 'New message',
    body: 'You have a new message.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    url: '/platform/messages',
    tag: 'wipa-chat-message'
  };

  try {
    if (event.data) {
      const json = event.data.json();
      data = { ...data, ...json };
      reportSWLog('sw_payload_parsed', { title: data.title, body: data.body });
    }
  } catch (err) {
    if (event.data) {
      data.body = event.data.text();
      reportSWLog('sw_payload_text_parsed', { body: data.body });
    }
  }

  // Minimal notification options for iOS WebKit & Android
  const notificationOptions = {
    body: data.body || 'You have a new message',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    tag: data.tag || 'wipa-chat-message',
    data: {
      url: data.url || '/platform/messages'
    }
  };

  reportSWLog('sw_show_notification_started', { title: data.title });

  const showPromise = self.registration
    .showNotification(data.title || 'WIPA', notificationOptions)
    .then(() => {
      reportSWLog('sw_show_notification_resolved', { title: data.title });
    })
    .catch((err) => {
      reportSWLog('sw_show_notification_rejected', { error: err?.message || String(err) });
    });

  event.waitUntil(showPromise);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/platform/messages';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it and navigate
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          if ('navigate' in client && targetUrl) {
            return client.navigate(targetUrl);
          }
          return client;
        }
      }
      // If no window is open, launch a new window straight to the chat
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
