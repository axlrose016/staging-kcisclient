const CACHE_NAME = "site-static-v1";
const ASSETS = [
    "/", 
    "/manifest.json",
    "/personprofile/form" // Add the route to cache it
];

// Install event: Cache static assets safely
self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            try {
                await cache.addAll(ASSETS);
                console.log("Assets cached successfully!");
            } catch (error) {
                console.error("Failed to cache some assets:", error);
            }

            // Cache Google Fonts separately (workaround for CORS issues)
            try {
                const fontResponse = await fetch("https://fonts.googleapis.com/css?family=Roboto:300,400,500");
                const fontCss = await fontResponse.text();
                const fontCache = await caches.open(CACHE_NAME);
                await fontCache.put("https://fonts.googleapis.com/css?family=Roboto:300,400,500", new Response(fontCss, { headers: { "Content-Type": "text/css" } }));
            } catch (error) {
                console.error("Failed to cache Google Fonts:", error);
            }
        })()
    );
    self.skipWaiting();
});

// Activate event: Cleanup old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => 
            Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
        )
    );
    console.log("Service Worker activated");
    self.clients.claim();
});

// Fetch event: Serve cached assets and dynamically cache Next.js static files
self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate") {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return fetch(event.request)
                    .then((response) => {
                        cache.put(event.request, response.clone()); // Cache the visited page
                        return response;
                    })
                    .catch(() => caches.match(event.request) || caches.match("/")); // Serve cached version or fallback to home
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                return cachedResponse || fetch(event.request).catch(() => {
                    if (event.request.destination === "document") {
                        return caches.match("/"); // Fallback to home page if offline
                    }
                });
            })
        );
    }
});