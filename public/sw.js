const CACHE_NAME = "stockit-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Basic pass-through fetch
  // We are not implementing complex caching strategies here to avoid interfering with Next.js
  // But a fetch handler is often required for PWA installability
  event.respondWith(fetch(event.request));
});
