let CACHE_NAME = 'main-cache';
let urlsToCache = [
    '/',
];
// '/public/vendor/fontawesome/css/all.min.css',
self.addEventListener('install', ev => {
    console.log("Perform install steps ...");
    // Perform install steps
    ev.waitUntil(caches.open(CACHE_NAME)
        .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
    }));
});
//# sourceMappingURL=sw.js.map