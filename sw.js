const CACHE_NAME = 'secure-home-v4';
const APP_SHELL = [
  './index2.html',
  './top2.html',
  './manifest.webmanifest',
  './icons/app-icon-192.png',
  './icons/app-icon-512.png',
  './top2icons/chatgpt.webp',
  './top2icons/gemini.webp',
  './top2icons/calendar.webp',
  './top2icons/photo.webp',
  './top2icons/line.webp',
  './top2icons/googledrive.webp',
  './top2icons/youtube.webp',
  './top2icons/setting.webp',
  './top2icons/tel.webp',
  './top2icons/gmail.webp',
  './top2icons/chrome.webp',
  './top2icons/auth.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then(cached => cached || caches.match('./index2.html')))
  );
});
