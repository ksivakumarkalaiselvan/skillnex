/* SKILLNEX PWA Service Worker (v1.0) */

const CACHE_NAME = 'skillnex-v1.0.0';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/register.html',
  '/student-dashboard.html',
  '/teacher-dashboard.html',
  '/admin-dashboard.html',
  '/courses.html',
  '/assessments.html',
  '/study-planner.html',
  '/skills.html',
  '/ollama-ai.html',
  '/manifest.json',
  '/css/style.css',
  '/css/landing.css',
  '/css/dashboard.css',
  '/css/components.css',
  '/css/responsive.css',
  '/css/pwa.css',
  '/js/config.js',
  '/js/auth.js',
  '/js/api.js',
  '/js/components.js',
  '/js/dashboard.js',
  '/js/planner.js',
  '/js/assessment.js',
  '/js/skills.js',
  '/js/courses.js',
  '/js/ollama.js',
  '/js/pwa-installer.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-192.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
  '/icons/badge-96.png',
  '/icons/favicon.png',
  '/icons/icon.svg'
];

// Install Event — Pre-cache core app assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker & Caching Static Assets...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache partial warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event — Clean up outdated caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event — Stale-While-Revalidate for static assets, Network-First for API
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests or browser extension protocols
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // API Requests: Network First
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return new Response(
              JSON.stringify({
                success: false,
                offline: true,
                message: 'You are currently offline. Local cache active.'
              }),
              { headers: { 'Content-Type': 'application/json' } }
            );
          });
        })
    );
    return;
  }

  // Static Assets: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed, return cached response if present
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Push Notification Event Handler
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  let data = {
    title: '📲 Download SKILLNEX App',
    body: 'Tap to install SKILLNEX on your device for fast offline access & smart study alerts!',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-96.png',
    tag: 'pwa-install-notification',
    data: { url: '/?pwa_install=true', type: 'INSTALL_PWA' }
  };

  if (event.data) {
    try {
      data = Object.assign({}, data, event.data.json());
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192.png',
    badge: data.badge || '/icons/badge-96.png',
    image: data.image || null,
    tag: data.tag || 'skillnex-notification',
    renotify: true,
    vibrate: [100, 50, 100],
    data: data.data || { url: '/?pwa_install=true' },
    actions: [
      { action: 'install', title: '📲 Install PWA Now' },
      { action: 'open', title: '🚀 Open App' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Handler — Triggers PWA Download & Window Focus
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click detected, action:', event.action);
  event.notification.close();

  const action = event.action;
  const targetUrl = (event.notification.data && event.notification.data.url) 
    ? event.notification.data.url 
    : '/?pwa_install=true';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Find an open client window
      let matchingClient = null;
      for (const client of clientList) {
        if ('focus' in client) {
          matchingClient = client;
          break;
        }
      }

      if (matchingClient) {
        matchingClient.focus();
        matchingClient.postMessage({
          type: 'PWA_NOTIFICATION_CLICK',
          action: action || 'install',
          targetUrl: targetUrl
        });
      } else if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Listen to postMessage from Client scripts
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SHOW_LOCAL_NOTIFICATION') {
    const payload = event.data.payload || {};
    const title = payload.title || '📲 Install SKILLNEX App';
    const options = {
      body: payload.body || 'Click here to install SKILLNEX PWA directly onto your device!',
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-96.png',
      tag: 'pwa-install-prompt',
      renotify: true,
      vibrate: [150, 50, 150],
      data: { url: window ? window.location.href : '/', type: 'INSTALL_PWA' },
      actions: [
        { action: 'install', title: '📲 Install App Now' },
        { action: 'dismiss', title: 'Later' }
      ]
    };

    self.registration.showNotification(title, options);
  }
});
