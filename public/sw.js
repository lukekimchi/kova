const CACHE = 'kova-v2'
const PRECACHE = ['/', '/manifest.json']
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)))
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  // Let Supabase API requests go straight to the network
  if (e.request.url.includes('supabase.co')) return

  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request)
        .then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()))
          return res
        })
        .catch(() => cached)
      return cached || net
    })
  )
})
