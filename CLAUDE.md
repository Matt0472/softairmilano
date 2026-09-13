# softairmilano.it — sito

Sito di **SoftAir Milano** (arena/villaggio militare indoor ~1.500mq a Milano). Contenuti in **italiano**.

**Obiettivo primario: vendere le partite/sessioni di softair** dell'arena — tutto converte alla **prenotazione (TicketingHub)**. Obiettivi secondari: **far crescere il corso** e **recuperare la fetta paintball** (convertire chi cerca il paintball al softair). Sito **veloce**, **mobile-first**, aggiornabile in autonomia dal cliente.

**Standard di qualità (non negoziabile): si lavora sempre al massimo.** Ogni pagina, contenuto e componente dev'essere eccellente e curato nei dettagli. Creiamo solo cose meravigliose — mai contenuti di riempimento o soluzioni "abbastanza buone".

## Uso efficiente di token e risorse

Ottimizza sempre l'uso di token e delle risorse disponibili puntando comunque al **miglior risultato possibile**: pianifica prima di agire, riusa ciò che è già noto, **non rileggere file già letti né ripetere lavoro**, mantieni gli output concisi e non ridondanti, ed **evita errori che costringono a rifare**. Massima qualità, minimo spreco.

## Tutto gestibile da Pages CMS (principio fondamentale)

Ogni **contenuto** del sito — testi, titoli, immagini, video, prezzi, FAQ, recensioni, dati di contatto, meta/SEO, voci di menu, CTA, ecc. — deve essere **completamente modificabile dal cliente via Pages CMS**, senza toccare il codice. **Niente contenuto "in duro" nei componenti**: va in `src/data/*.json` (o in una collezione) ed esposto nel `.pages.yml`.

La **struttura** (layout, componenti, logica, stile, configurazione) resta modificabile **solo da una persona tecnicamente esperta**, mai dal cliente.

Regola pratica: **se è contenuto → sta nel CMS; se è struttura → sta nel codice.** Prima di scrivere qualunque testo o asset dentro un componente, chiedersi "il cliente vorrà cambiarlo?": se sì, va nei dati e nel `.pages.yml`.

## Stack tecnologico

- **Astro** `^7` — sito **statico** (nessun adapter SSR; `astro build` genera HTML statico)
- **Tailwind CSS** `^4` — via plugin Vite `@tailwindcss/vite` (NON l'integrazione Astro)
- **@astrojs/sitemap** — generazione sitemap
- **Pages CMS** (pagescms.org) — editing contenuti da parte del cliente, config in **`.pages.yml`**
- **Cloudflare Pages** — hosting (build statica)
- **GitHub** — repository del codice (owner `Matt0472`)
- **TicketingHub** — widget JS per le prenotazioni
- **Google Analytics 4** — analytics, caricato **solo dopo consenso** (Consent Mode v2, IP anonimizzato); Measurement ID come campo CMS. *(opzionale: Cloudflare Web Analytics, cookieless)*
- Librerie di contorno (usare solo se servono): **motion** (Framer Motion vanilla), **lenis** (smooth scroll), **vanilla-cookieconsent** (banner + policy, gestione fatta a mano), **@fontsource** (font self-hosted), **sharp** (dev, ottimizzazione immagini in build)

## Hosting e deploy

- **Cloudflare Pages** (build statica, in produzione). Dominio custom gestito dalla **dashboard Cloudflare** (non con un file `CNAME` nel repo).
- **Staging**: si pubblica **solo su GitHub Pages** sotto un sottodominio di **mapped-dev.it** (come la presentazione).
- Eventuali redirect: file **`_redirects`** nella root pubblicata.

## Indicizzazione e GEO (regola critica)

- **Fino allo switch il sito è NON indicizzabile**: `robots.txt` `Disallow: /` + `<meta name="robots" content="noindex, nofollow">` ovunque. Il **noindex si rimuove SOLO il giorno dello switch** su `softairmilano.it`, mai prima. Indicizzabilità gestita da un **flag di build/ambiente** (un solo punto).
- **GEO / agenti AI** (obiettivo: comparire e farsi **citare** nelle risposte AI): in produzione `robots.txt` che ammette esplicitamente gli AI crawler, **JSON-LD**, contenuto **answer-first**, **IndexNow**, Cloudflare **Crawler Hints** + **AI Crawl Control** (AI bot ammessi). Bing Webmaster + Google Search Console al go-live.
- Dettagli, elenco crawler e checklist go-live: **`docs/geo-e-indicizzazione.md`**.

## Gestione contenuti (Pages CMS)

- Config editor in **`.pages.yml`** (content types, campi, media).
- Contenuti come **file JSON in `src/data/*.json`** (un file per sezione), letti dai componenti Astro.
- Media caricati dal cliente in **`public/uploads`** (mappati come `/uploads` in output).
- `settings.commit.identity: user` (ogni salvataggio riporta nome/email dell'editor).
- Per pagine aggiungibili in autonomia: **collezioni** con schema predefinito e, dove serve, il campo **block** (blocchi selezionabili e riordinabili) → struttura libera ma sotto controllo.

## Manuale utente (obbligatorio)

Il progetto include un **manuale d'uso per il cliente**, realizzato **esattamente come su campo-di-zucche**:

- **Sorgente**: frammento HTML in `docs/manuale-cliente.html` (solo `<title>` + `<style>` + corpo, senza involucro del documento).
- **Generazione**: `scripts/genera-manuale.mjs` lo avvolge in una pagina completa **`noindex, nofollow`** + `no-referrer` e lo scrive in `public/<percorso-non-indovinabile>/index.html`. Eseguito da `npm run manuale`, incluso in `dev`/`build`.
- **Riservato**: non collegato da nessuna pagina, **non** in sitemap, **non** in `robots.txt` (che è pubblico) — raggiungibile solo da chi conosce l'URL.
- **Indice scrollspy**: `<nav class="toc">` con `aria-current` che **segue automaticamente la sezione** in cui si trova il lettore; sezioni numerate `<section id="...">` con `<h2><span class="num">NN</span> Titolo</h2>`.
- **Sincronizzato col sito**: ogni sezione e ogni contenuto modificabile via Pages CMS deve essere spiegato nel manuale (come accedere, cosa si cambia, cosa **non** si tocca). Va aggiornato ogni volta che il sito cambia.

Si costruisce insieme al sito, perché documenta i contenuti reali.

## Struttura del progetto

```
src/
  components/   componenti Astro — Atomic Design: atoms/, molecules/, organisms/ (gli organismi = blocchi CMS)
  layouts/      layout di pagina (template: BaseLayout, PageLayout a blocchi, ArticleLayout)
  pages/        rotte (.astro)
  data/         contenuti in JSON (editati via Pages CMS)
  scripts/      script client (es. animazioni)
  styles/       stili globali
scripts/        script di build (es. genera-manuale.mjs, ottimizzazione immagini)
docs/           sorgenti (es. manuale-cliente.html)
public/
  uploads/      media caricati dal cliente
.pages.yml      config Pages CMS
astro.config.mjs
_redirects      eventuali redirect (Cloudflare Pages)
```

## Comandi

Richiede **Node ≥ 22** (Astro 7) — versione fissata in `.nvmrc` (`nvm use`).

```bash
npm run dev       # sviluppo locale
npm run build     # build statica di produzione
npm run preview   # anteprima della build
npm run manuale   # (ri)genera il manuale cliente in public/
```

## Convenzioni

### Lingua
- **Il codice è interamente in inglese**: nomi di variabili, funzioni, componenti, file e cartelle, e **tutti i commenti**.
- **Solo i contenuti visibili all'utente sono in italiano** (testi delle pagine, copy, valori dei contenuti in `src/data`).
- Nel `.pages.yml` e nei dati: la **chiave** (`name` dei campi, nomi file) è in **inglese**; la **label** mostrata al cliente nel CMS e il **valore** del contenuto sono in **italiano**. Es. `{ name: "title", label: "Titolo" }` con valore italiano.

### Altre convenzioni
- **Dominio configurabile in un punto solo**: costante `SITE_URL` in `astro.config.mjs` (override con env `SITE_URL` per le anteprime) + `siteUrl` in `src/data/settings.json` + riga Sitemap in `public/robots.txt`.
- **Priorità**: SEO al massimo (meta, Open Graph, JSON-LD, sitemap) e responsive **mobile-first** perfetto.
- **Performance**: build con `inlineStylesheets` per ridurre le richieste; immagini ottimizzate (WebP/miniature).
- **Pagine legali** (privacy, cookie) in `noindex` ed escluse dalla sitemap.
- **Terze parti & consenso**: TicketingHub e GA4 si caricano **solo dopo consenso** (categorie del banner); i loro **ID sono campi CMS** (`settings.json`) — l'unica cosa che il cliente cambia. Cookie/privacy policy costruite a mano e allineate.
- **Git**: mai committare/pushare senza ok esplicito dell'utente.

## Team di agenti

Il progetto ha 5 agenti specialisti in `.claude/agents/`. **Vanno auto-invocati proattivamente quando serve** (senza aspettare che l'utente li chieda), delegando loro il rispettivo dominio:

| Agente | Quando auto-invocarlo |
|---|---|
| **ui-designer** | quando si progetta/costruisce una nuova pagina o componente, si scelgono stile/colori/tipografia/spaziature/motion/navigazione, o si rivede la qualità visiva. Possiede il **design system** (`design-system/softair-milano/MASTER.md`, via skill ui-ux-pro-max) |
| **seo-auditor** | ogni volta che si creano/modificano pagine, layout, metadata o si aggiungono articoli al blog |
| **responsive-auditor** | ogni volta che si costruisce/modifica il layout di una pagina o di un componente |
| **accessibility-auditor** | su ogni pagina/componente; è **bloccante** (WCAG 2.2 AA), quindi va sempre coinvolto prima di considerare "finito" un lavoro |
| **performance-auditor** | dopo modifiche significative (immagini, font, JS/CSS, hero) |

I domini sono **complementari e senza sovrapposizioni**: `ui-designer` cura il *design* (stile, token, gerarchia, motion, navigazione, UX form) e rimanda ai 4 auditor per accessibilità, performance, responsive e SEO.

**Regole di uso:**
- Quando un task tocca uno di questi domini, **delega all'agente competente** invece di fare da soli; per lavori che ne toccano più d'uno, invocali (anche **in parallelo**).
- **Prima del lancio**: eseguire i **4 auditor come quality-gate**. L'esito dell'accessibility-auditor è **bloccante**.
- Di default gli agenti fanno audit e propongono i fix; applicano modifiche solo se il task lo richiede esplicitamente.
