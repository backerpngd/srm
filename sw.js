// Bump VERSION on every release so installed apps pick up the update.
const VERSION='srm-v5.0.7',CORE=['./','index.html','manifest.json','css/fonts.css','css/app.css','js/app.js','icon-192.png','icon-512.png','apple-touch-icon.png','fonts/sg.woff2','fonts/inter.woff2','fonts/jbm.woff2','fonts/anek-ml.woff2','fonts/noto-ml.woff2','fonts/manjari-400.woff2','fonts/manjari-700.woff2','fonts/amiri.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(n=>{if(n.ok&&new URL(e.request.url).origin===location.origin){const c=n.clone();caches.open(VERSION).then(x=>x.put(e.request,c))}return n}).catch(()=>e.request.mode==='navigate'?caches.match('index.html'):undefined)))});
