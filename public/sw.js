const SHELL_CACHE = 'ssr-shell-v1'
const RUNTIME_CACHE = 'ssr-runtime-v1'
const OFFLINE_URL = '/offline.html'

const SHELL_ASSETS = ['/', '/index.html', '/favicon.svg', '/robots.txt', '/sitemap.xml', OFFLINE_URL]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![SHELL_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request

  if (request.method !== 'GET') return

  const url = new URL(request.url)

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    )
    return
  }

  const shouldCacheRuntime =
    url.origin === self.location.origin ||
    url.hostname.includes('images.unsplash.com')

  if (!shouldCacheRuntime) return

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone))
          }
          return response
        })
        .catch(() => cached)

      return cached || networkFetch
    })
  )
})
