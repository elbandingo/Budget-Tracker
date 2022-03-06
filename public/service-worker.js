//add prefix, version, and cache_name as a combination of those variables
const APP_PREFIX = "Budgeting-Tracker"
const VERSION = "V1";
const CACHE_NAME = APP_PREFIX + VERSION;

//select which files are going to be cached offline
const FILES_TO_CACHE = [
    './index.html',
    './css/styles.css',
    './js/index.js',
    './js/idb.js',
    './manifest.json',
    './icons/icon-72x72.png',
    './icons/icon-96x96.png',
    './icons/icon-128x128.png',
    './icons/icon-144x144.png',
    './icons/icon-152x152.png',
    './icons/icon-192x192.png',
    './icons/icon-384x384.png',
    './icons/icon-512x512.png',
];

//add an event listener to install the cache
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing your cache of data:' + CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE);
        })
    )
});

//add an event listener to activate cache

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(key) {
            let cacheKeep = key.filter(function(key) {
                return key.indexOf(APP_PREFIX);
            });
            cacheKeep.push(CACHE_NAME);

            return Promise.all(key.map(function(key, i) {
                if(cacheKeep.indexOf(key) === -1) {
                    console.log('removing cache:' + key[i]);
                    return caches.delete(key[i]);
                }
            }));
        })
    )
});