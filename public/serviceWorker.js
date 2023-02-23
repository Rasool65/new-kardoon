// const STATIC_CACHE_VERSION = 'static_1';
// const DYNAMIC_CACHE_VERSION = 'dynamic_1';

// const STATIC_ASSESTS = ['/', '/technician-missions', '/conversation/chat/0', '/images/placeholder.png', '/offline.html'];

// const cleanup = () => {
//   caches.keys().then((keys) => {
//     return Promise.all(
//       keys.map((key) => {
//         if (key !== STATIC_CACHE_VERSION && key !== DYNAMIC_CACHE_VERSION) {
//           console.log('[SW] Remove Old Cache ', key);
//           return caches.delete(key);
//         }
//       })
//     );
//   });
// };
// const preCache = () => {
//   caches
//     .open(STATIC_CACHE_VERSION)
//     .then((cache) => {
//       console.log('cache ready');
//       return cache.addAll(STATIC_ASSESTS);
//     })
//     .catch((e) => {
//       console.log('cache error');
//     });
// };

self.addEventListener('install', (event) => {
  console.log('[SW] installing Service Worker ...');
  // self.skipWaiting();
  // event.waitUntil(preCache());
});

self.addEventListener('activate', (event) => {
  console.log('[SW] activating Service Worker ...');
  // event.waitUntil(cleanup());
  // return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  console.log('[SW] fetching ...');
  // const request = event.request;
  // event.respondWith(
  //   fetch(request)
  //     .then((res) => {
  //       caches.open(DYNAMIC_CACHE_VERSION).then((cache) => {
  //         // if (event.request.url.indexOf('https') === 0) {
  //         cache.put(request, res).catch(() => {});
  //         // }
  //       });
  //       return res.clone();
  //     })
  //     .catch((err) => caches.match(request))
  // );

  // todo STRAGEY OF CACHING
  //? 1 Cache only
  // event.respondWith(
  //     caches.match(request)
  // );
  //? 2 Network Only
  // event.respondWith(
  //     fetch(event.request)
  // );

  //? 3 cache first , falling back to network
  // event.respondWith(
  //     caches.match(request)
  //     .then((res) => {
  //         return res || fetch(request)
  //         .then((newRes) => {
  //             caches.open(DYNAMIC_CACHE_VERSION)
  //             .then(cache => cache.put(request,newRes));
  //             return newRes.clone();
  //         });
  //     })
  // );

  //? 4 Network first , falling back to cache
  // event.respondWith(
  //   fetch(request)
  //     .then((res) => {
  //       caches.open(DYNAMIC_CACHE_VERSION).then((cache) => cache.put(request, res));
  //       return res.clone();
  //     })
  //     .catch((err) => caches.match(request))
  // );

  //? 5 Cache with newtork update
  // event.respondWith(
  //   caches.match(request).then((res) => {
  //     const UpdateResponse = fetch(request).then((newRes) => {
  //       cache.put(request, newRes.clone());
  //       return newRes;
  //     });

  //     return res || UpdateResponse;
  //   })
  // );

  //? 6 Cache & Network Race
  // let firstRejectionRecived = false;
  // const rejectOnce = () => {
  //   if (firstRejectionRecived) {
  //     reject('No Response Recived');
  //   } else {
  //     firstRejectionRecived = true;
  //   }
  // };
  // const promiseRace = new Promise((resolve, reject) => {
  //   fetch(request)
  //     .then((res) => (res.ok ? resolve(res) : rejectOnce()))
  //     .catch(rejectOnce);
  // });
  // event.respondWith(promiseRace);
});
