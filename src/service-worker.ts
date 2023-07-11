/// <reference lib="webworker" />
export default null;
declare let self: ServiceWorkerGlobalScope;

let CACHE_NAME = "cache-" + Date.now();

self.addEventListener("install", (event) => {
  console.log("Installed SW");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.add("/offline.html");
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Activated SW");
  event.waitUntil(
    // Loop through the cache
    caches.keys().then((keys) => {
      // We must return a promise so it gets awaited
      return Promise.all(
        keys.map((k) => {
          // If the key doesn't match the name of the current cache, delete it
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match("offline.html").then((response) => {
          return response || new Response("Offline page not found in cache.");
        });
      });
    })
  );
});

self.addEventListener("push", (e) => {
  const data = e.data?.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/favicons/android-chrome-192x192.png",
  });
});