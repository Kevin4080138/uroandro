// ─── PWA offline keshi ────────────────────────────────────
const KESH = 'urosfera-v1'
self.addEventListener('install', () => {
  self.skipWaiting()
})
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((nomlar) => Promise.all(nomlar.filter((n) => n !== KESH).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  )
})
// GET so'rovlar: navigatsiyada network-first (offline bo'lsa keshdan), statik fayllarда cache-first.
// Supabase va boshqa cross-origin so'rovlarga tegilmaydi.
self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return // supabase va h.k. — o'z holicha

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => { const nusxa = res.clone(); caches.open(KESH).then((c) => c.put(req, nusxa)); return res })
        .catch(() => caches.match(req).then((r) => r || caches.match('/')))
    )
    return
  }

  if (/\/_next\/static\/|\.(png|jpg|jpeg|svg|webp|ico|woff2?|css|js)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        const nusxa = res.clone(); caches.open(KESH).then((c) => c.put(req, nusxa)); return res
      }))
    )
  }
})

self.addEventListener('push', (event) => {
  let data = {}
  try { data = event.data ? event.data.json() : {} } catch (e) { data = { title: 'Urosfera', body: event.data ? event.data.text() : '' } }

  const title = data.title || 'Urosfera'
  const options = {
    body: data.body || '',
    data: { url: data.url || '/patient/dorilarim' },
    vibrate: [100, 50, 100],
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/patient/dorilarim'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})
