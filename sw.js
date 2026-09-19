/* Service worker da Copa Rino.
   Guarda o app para abrir offline e busca os resultados sempre da rede.
   Ao publicar uma versão nova, troque o número em VERSAO. */

const VERSAO = "copa-rino-v11";

const CASCA = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./escudos/aaamc.png",
  "./escudos/t15.png",
  "./escudos/t18.png",
  "./escudos/t19.png",
  "./escudos/t20.png",
  "./escudos/t21.png",
  "./escudos/t23.png",
  "./escudos/t24.png",
  "./escudos/t25.png",
];

self.addEventListener("install", ev => {
  ev.waitUntil(
    caches.open(VERSAO)
      .then(c => c.addAll(CASCA))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", ev => {
  ev.waitUntil(
    caches.keys()
      .then(nomes => Promise.all(nomes.filter(n => n !== VERSAO).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", ev => {
  const req = ev.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  /* Resultados: sempre da rede; o cache é só o plano B quando está offline. */
  if (url.pathname.endsWith("dados.json")) {
    ev.respondWith(
      fetch(req)
        .then(res => {
          const copia = res.clone();
          caches.open(VERSAO).then(c => c.put(req, copia));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  /* Resto do app: do cache primeiro, com atualização em segundo plano. */
  ev.respondWith(
    caches.match(req).then(emCache => {
      const daRede = fetch(req).then(res => {
        if (res && res.status === 200) {
          const copia = res.clone();
          caches.open(VERSAO).then(c => c.put(req, copia));
        }
        return res;
      }).catch(() => emCache);
      return emCache || daRede;
    })
  );
});
