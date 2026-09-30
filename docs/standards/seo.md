# SEO, GEO e indicizzazione — `SEO-`

Elenco dei crawler AI, procedura di go-live e checklist GEO: **`docs/geo-e-indicizzazione.md`**. Qui ci
sono le regole; lì il dettaglio operativo.

## On-page e tecnica

- **SEO-01** — **HTML semantico**: esattamente **un `<h1>` per pagina**, gerarchia dei titoli senza
  salti, landmark corretti (`header`, `nav`, `main`, `footer`).
- **SEO-02** — **`<title>` e meta description unici** per pagina, gestiti **da un solo punto**
  (`BaseLayout` via props) e alimentati dal CMS, mai scritti a mano nella pagina (`CMS-01`).
- **SEO-03** — **URL canonico** su ogni pagina, slug puliti, `lang="it"`, set di favicon completo e
  `theme-color`.
- **SEO-04** — **Open Graph + Twitter Card** su ogni pagina, con **immagine raster 1200×630**
  (PNG/JPG: i social non mostrano gli SVG).
- **SEO-05** — **JSON-LD** valido: `LocalBusiness` completo (indirizzo, `geo`, `openingHours`,
  `telephone`, dati da `settings.json`), `FAQPage` dove ci sono FAQ, `BreadcrumbList` sulle pagine
  interne, `Article` sui post del blog.
- **SEO-06** — **`sitemap.xml`** via `@astrojs/sitemap`; le **pagine legali** (privacy, cookie) sono
  `noindex` ed escluse dalla sitemap, come il manuale cliente (`CMS-13`).
- **SEO-07** — **Copy orientato alle ricerche locali** ("softair Milano", "softair indoor", "campo
  softair al coperto") in modo naturale, senza keyword stuffing. Le scelte di copy restano del cliente.

## GEO — farsi citare dagli assistenti AI

- **SEO-08** — Contenuto **answer-first**: risposte chiare e citabili (FAQ, prezzi, orari, città =
  Milano, entità esplicite) che un assistente AI possa estrarre.
- **SEO-09** — In produzione `robots.txt` **ammette esplicitamente gli AI crawler** elencati in
  `docs/geo-e-indicizzazione.md`; file chiave **IndexNow** in `public/`; Cloudflare Crawler Hints e AI
  Crawl Control con gli AI bot ammessi.

## Gate di indicizzazione (regola critica)

- **SEO-10** — **Fino allo switch su `softairmilano.it` il sito NON è indicizzabile**: `robots.txt`
  `Disallow: /` + `<meta name="robots" content="noindex, nofollow">` su ogni pagina. Lo decide un solo
  flag di build, `PUBLIC_SITE_INDEXABLE` (`CODE-15`). Il `noindex` si toglie **solo il giorno dello
  switch**, mai prima, e l'anteprima di staging non è mai indicizzabile.
- **SEO-11** — Il percorso del manuale cliente **non compare mai** in `robots.txt` (`CMS-13`).
