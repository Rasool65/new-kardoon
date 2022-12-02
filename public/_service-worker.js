//Service Worker Function Below.
self.addEventListener('install', function (event) {
  console.log('Service Worker: Installing...');
});

self.addEventListener('fetch', function (event) {
  console.log('Service Worker: Fetching... ' + APP_NAME + '-' + APP_VER + ' files from Cache');
});

self.addEventListener('activate', function (event) {
  console.log('Service Worker: Activated...');
});
