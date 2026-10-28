const PRECACHE = "stoic-precache-v2";
const PAGES = "stoic-pages-v1";
const RUNTIME = "stoic-runtime-v2";

const PRECACHE_URLS = [
  "/",
  "/books",
  "/quotes",
  "/offline",
  "/favicon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/manifest.webmanifest",
];

function bypass(url) {
  const p = url.pathname;
  if (url.origin !== self.location.origin) {
    return !(
      url.hostname.includes("fonts.gstatic.com") || url.hostname.includes("fonts.googleapis.com")
    );
  }
  return (
    p.startsWith("/@") ||
    p.startsWith("/node_modules") ||
    p.startsWith("/src/") ||
    p.startsWith("/api/auth") ||
    p.includes(".hot-update") ||
    p === "/sw.js"
  );
}

async function fromCache(cacheName, request) {
  const cache = await caches.open(cacheName);
  return cache.match(request);
}

async function put(cacheName, request, response) {
  if (!response || !response.ok) return response;
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
  return response;
}

async function networkFirst(request, cacheName, fallbackUrl) {
  try {
    const fresh = await fetch(request);
    return put(cacheName, request, fresh);
  } catch {
    const cached = await fromCache(cacheName, request);
    if (cached) return cached;
    const precached = await caches.match(request);
    if (precached) return precached;
    if (fallbackUrl) {
      const offline = await caches.match(fallbackUrl);
      if (offline) return offline;
    }
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cached = await fromCache(cacheName, request);
  const network = fetch(request)
    .then((res) => put(cacheName, request, res))
    .catch(() => null);
  return cached || (await network) || new Response("", { status: 504 });
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => ![PRECACHE, PAGES, RUNTIME].includes(k)).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (bypass(url)) return;

  const isDoc = request.mode === "navigate" || request.destination === "document";
  if (isDoc) {
    event.respondWith(networkFirst(request, PAGES, "/offline"));
    return;
  }
  event.respondWith(staleWhileRevalidate(request, RUNTIME));
});
