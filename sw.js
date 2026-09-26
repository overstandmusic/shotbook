const C = 'shotbook-v15'; const CORE = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => { const u = new URL(e.request.url); if (e.request.method !== 'GET') return;
  if (u.pathname.endsWith('critiques.json')) { e.respondWith(fetch(e.request).catch(() => new Response('[]', { headers: { 'content-type': 'application/json' } }))); return; }
  if (u.origin === location.origin) { e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))); return; }
  if (u.hostname.includes('fonts.g')) e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put(e.request, cp)); return res; }).catch(() => new Response('', { status: 204 })))); });
