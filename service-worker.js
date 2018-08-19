let currentCache = 'restaurant-reviews-v1';
const mapboxToken = 'pk.eyJ1Ijoic25vd3dvbGYzNSIsImEiOiJjamt1ZDhnanYwNXd0M2tycmx0NmY4NGRiIn0.4Y9hG-a0faSdafIauJCXVw';

let cachedFiles = [
    './',
    'index.html',
    'restaurant.html',
    'js/restaurant_info.js',
    'js/main.js',
    'js/dbhelper.js',
    'data/restaurants.json',
    'css/index.css',
    'css/responsive.css',
    'css/restaurant.css',
    'css/global.css',
    'img/1-min.jpg',
    'img/2-min.jpg',
    'img/3-min.jpg',
    'img/4-min.jpg',
    'img/5-min.jpg',
    'img/6-min.jpg',
    'img/7-min.jpg',
    'img/8-min.jpg',
    'img/9-min.jpg',
    'img/10-min.jpg',
    'restaurant-favicon.ico',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
    //map tiles around the restaurants area
    `https://api.tiles.mapbox.com/v4/mapbox.streets/12/1206/1539.jpg70?access_token=${mapboxToken}`,
    `https://api.tiles.mapbox.com/v4/mapbox.streets/12/1206/1540.jpg70?access_token=${mapboxToken}`,
    `https://api.tiles.mapbox.com/v4/mapbox.streets/12/1205/1539.jpg70?access_token=${mapboxToken}`,
    `https://api.tiles.mapbox.com/v4/mapbox.streets/12/1207/1539.jpg70?access_token=${mapboxToken}`,
    `https://api.tiles.mapbox.com/v4/mapbox.streets/12/1205/1540.jpg70?access_token=${mapboxToken}`,
    `https://api.tiles.mapbox.com/v4/mapbox.streets/12/1207/1540.jpg70?access_token=${mapboxToken}`,
    `https://api.tiles.mapbox.com/v4/mapbox.streets/12/1204/1539.jpg70?access_token=${mapboxToken}`,
    `https://api.tiles.mapbox.com/v4/mapbox.streets/12/1204/1540.jpg70?access_token=${mapboxToken}`,
    //marker icon
    'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon-2x.png',

];

self.addEventListener('install', (e) => {
    console.log('Service Worker installed');
    //add files to cache
    e.waitUntil(caches.open(currentCache)
        .then(cache => { return cache.addAll(cachedFiles); })
    );
});

self.addEventListener('activate', (e) => {
    console.log('Service Worker active');
    //Remove old cache
    e.waitUntil(caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((thisCache) => {
                if (thisCache !== currentCache)
                    return caches.delete(thisCache);
            }));
        })
    );
});

self.addEventListener('fetch', (e) => {
    //console.log('Fetching', e.request.url);

    e.respondWith(
        caches.match(e.request).then((response) => {
            //if response is found in the cache return it
            if (response) {
                console.log("Service Worker found in cache", e.request.url);
                return response;
            }

            //fetch if request is not already in the cache
            return fetch(e.request).then((fetchResponse) => {
                if (fetchResponse.status == 0) {
                    //don't cache if status = 0
                    return fetchResponse;
                }
                //add request to cache
                e.waitUntil(caches.open(currentCache)
                    .then(cache => {
                        if (!fetchResponse.bodyUsed) {
                            let responseClone = fetchResponse.clone();
                            cache.put(e.request.url, responseClone);
                        }
                        else {
                            cache.add(e.request.url);
                        }

                        return fetchResponse;
                    }).catch(err => console.error("Service Worker error fetching & caching new data: ", err))
                );
                return fetchResponse;
            });
        })
    );
});

