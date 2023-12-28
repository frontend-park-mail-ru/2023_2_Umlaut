const {assets} = global.serviceWorkerOption;
const CACHE_NAME = 'umlaut-cache-v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll([
                    ...assets,
                ]);
            }),
    );
});


self.addEventListener('fetch', (event) => {
    event.respondWith((() => {
        if (navigator.onLine) {
            return fetch(event.request)
                .then((response) => {
                    if (event.request.method !== 'GET' || response.status !== 200) {
                        return response;
                    }

                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            try {
                                cache.put(event.request, responseClone);
                            // eslint-disable-next-line
                            } catch {}
                        });

                    return response;
                });
        }


        return caches.match(event.request)
            .then((response) => {
                return response || new Response({status: 500}, {status: 500});
            });
    })());
});


self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys.map((key) => {
                if (key !== CACHE_NAME) {
                    caches.delete(key)
                        .then(() => {});
                }
            }),
        )),
    );
});
