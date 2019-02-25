const CACHE_NAME = "Bolaku-121";

var urlToCache = [
    "/",
    "/index.html",
    "/idb.js",
    "/manifest.json",
    "/pages/teamfav.html",
    "/pages/team.html",
    "/pages/topscore.html",
    "/CSS/materialize.min.css",
    "/CSS/style.css",
    "/JS/materialize.min.js",
    "/JS/navbar.js",
    "/JS/APIteam.js",
    "/JS/APItopscore.js",
    "/JS/IDB.js",
    "/JS/TeamFavIDB.js",
    "/img/notfound.png",
    "/images/icons/icon-72x72.png",
    "/images/icons/icon-96x96.png",
    "/images/icons/icon-128x128.png",
    "/images/icons/icon-144x144.png",
    "/images/icons/icon-152x152.png",
    "/images/icons/icon-192x192.png",
    "/images/icons/icon-384x384.png",
    "/images/icons/icon-512x512.png",
];

//mendaftarkab cache
self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlToCache);
        })
    );
});

//If Cache Notfound then add Cache from server
self.addEventListener("fetch", function (event) {
    var base_url = "https://api.football-data.org/";

    if (event.request.url.indexOf(base_url) > -1) {

            caches.open(CACHE_NAME).then(function (cache) {
                return fetch(event.request).then(function (response) {
                    cache.put(event.request.url, response.clone());
                })
            });   

    } else {

        event.respondWith(
            caches.match(event.request).then(function (response) {
                return response || fetch(event.request);
            })
        );
    }
});


//If the Local CACHE_NAME different with the Server CACHE_NAME then previous the CACHE will be delete
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheName) {
            return Promise.all(
                cacheName.map(function (cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log("ServiceWorker: cache " + cacheName + " dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});


self.addEventListener('push', function (event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Notifikasi BolaKu';
    }
    var options = {
        body: body,
        icon: 'images/icons/icon-192x192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});