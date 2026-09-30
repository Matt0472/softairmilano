# softairmilano.it — sito

Guida per Claude Code in questo repository.

Questo file è un **indice**, non un regolamento. Le regole stanno in `docs/standards/`, che leggono
persone e assistenti: una copia sola, un solo posto dove cambiarle.

## Il progetto

Sito di **SoftAir Milano**, arena/villaggio militare indoor di ~1.500 mq a Milano. Contenuti in
**italiano**. Oggi `softairmilano.it` è un WordPress su Aruba: il nuovo sito Astro lo sostituisce allo
switch, mantenendo il dominio (procedura in `docs/cutover-checklist.md`).

**Obiettivo primario: vendere le partite/sessioni di softair**: tutto porta alla **prenotazione
(TicketingHub)**. Obiettivi secondari: **far crescere il corso** e **recuperare la fetta paintball**
(convertire al softair chi cerca il paintball). Sito **veloce**, **mobile-first**, aggiornabile in
autonomia dal cliente.

**Standard di qualità (non negoziabile): si lavora sempre al massimo.** Ogni pagina, contenuto e
componente dev'essere eccellente e curato nei dettagli. Solo cose meravigliose, mai riempitivi o
soluzioni "abbastanza buone".

**Principio fondante: se è contenuto sta nel CMS, se è struttura sta nel codice.** Il cliente cambia
tutto da Pages CMS; la struttura la tocca solo un tecnico (`docs/standards/contenuti-cms.md`).

## Leggi prima di lavorare

| Stai per | Leggi |
|---|---|
| Fare qualunque cosa | [`docs/standards/README.md`](docs/standards/README.md): indice, non negoziabili, debito noto |
| Scrivere un testo, aggiungere un'immagine, toccare `src/data` o `.pages.yml` | [`contenuti-cms.md`](docs/standards/contenuti-cms.md) |
| Scrivere componenti, layout, CSS, script | [`codice.md`](docs/standards/codice.md) |
| Progettare o ritoccare l'aspetto di qualcosa | [`design.md`](docs/standards/design.md), con le **decisioni del cliente da non riproporre** |
| Produrre foto, immagini AI, video, favicon | [`media.md`](docs/standards/media.md) |
| Toccare elementi interattivi, contrasti, motion | [`accessibilita.md`](docs/standards/accessibilita.md) |
| Toccare immagini, font, JS, hero | [`performance.md`](docs/standards/performance.md) |
| Toccare un layout | [`responsive.md`](docs/standards/responsive.md) |
| Toccare pagine, meta, JSON-LD, robots | [`seo.md`](docs/standards/seo.md) |
| Committare, pubblicare, andare online | [`git.md`](docs/standards/git.md) |

Il canone è l'autorità. Dove il tuo giudizio diverge, **vince il file**. Se una regola sembra sbagliata
per il caso, dillo e fermati: non improvvisare varianti.

Lo **stato del lavoro** (cosa è fatto, cosa manca, cosa manca dal cliente) è in `docs/in-development/HANDOFF.md`.

## Stack

- **Astro** `^7`, sito **statico** (nessun adapter SSR).
- **Tailwind CSS** `^4` via plugin Vite `@tailwindcss/vite` (non l'integrazione Astro).
- **@astrojs/sitemap**, **lenis** (smooth scroll globale), **@fontsource** (Inter, Oswald), **sharp** (dev).
- **Pages CMS** (pagescms.org), config in `.pages.yml`, contenuti in `src/data/*.json`.
- **Cloudflare Pages** in produzione (dominio gestito dalla dashboard Cloudflare, redirect in
  `_redirects`); **anteprima** su GitHub Pages: https://softairmilano-anteprima.mapped-dev.it.
- **GitHub** `Matt0472/softairmilano` (pubblico), **TicketingHub** (prenotazioni), **GA4** dopo consenso
  (opzionale: Cloudflare Web Analytics, senza cookie), video su **Cloudflare R2**, immagini AI con
  **Gemini** (`scripts/genera-immagine.mjs`).

## Comandi

Richiede **Node ≥ 22**: con Node 20 il build fallisce.

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 22.23.2
npm run dev        # sviluppo su http://localhost:4321 (ottimizza le immagini prima di partire)
npm run build      # build statica di produzione in dist/
npx astro preview --port 4322                                                    # anteprima della build
npx lighthouse http://127.0.0.1:4322/ --chrome-flags="--headless=new"            # Lighthouse sulla build
```

Produzione indicizzabile: `PUBLIC_SITE_INDEXABLE=true`, **solo il giorno dello switch**.

## Delega agli agenti

Gli agenti sono **specialisti di una materia**. Ognuno conosce un'area e serve qualunque fase:
costruire, rivedere, esplorare, correggere, rispondere a una domanda. Si usa quello la cui materia
corrisponde, **senza aspettare che l'utente lo chieda**; i lavori che toccano più materie li delegano a
più specialisti, in parallelo.

| Materia | Specialista |
|---|---|
| Aspetto: composizione, gerarchia, tipografia, motion, stati, navigazione, UX dei form | `design-specialist` |
| Contenuti: campi CMS, `src/data`, `.pages.yml`, manuale cliente, testi scritti nel codice | `cms-specialist` |
| Asset: foto reali, immagini AI, varianti mobile, video, logo, favicon | `asset-specialist` |
| Forma del codice: Astro, CSS, script, dipendenze | `code-standards-specialist` |
| Accessibilità WCAG 2.2 AA (**bloccante**) | `accessibility-specialist` |
| Performance e Core Web Vitals | `performance-specialist` |
| Responsive e mobile | `responsive-specialist` |
| SEO, GEO, gate di indicizzazione | `seo-specialist` |

### Revisione

- **Chi ha costruito qualcosa non lo rivede.** Dopo ogni modifica non banale: `code-standards-specialist`
  e `cms-specialist` sui file toccati.
- **A pagina finita** si fa `/audit` come quality-gate, con i quattro specialisti di qualità
  (accessibilità, performance, responsive, SEO) più design, CMS e codice. **Non a ogni componente**: in
  itinere bastano build, browser vero e la revisione qui sopra. L'esito dell'accessibilità è
  **bloccante**, e prima del lancio si fa `/audit lancio`.
- Si salta la revisione solo per modifiche banali e meccaniche (un refuso, un valore, una riga senza
  effetti).

## Usa queste skill senza che te lo chiedano

Chi lavora qui descrive il lavoro a parole e non sa che le skill esistono. Riconosci l'intento e agisci:
dì in una riga quale usi, poi usala.

| Dicono qualcosa come | Fai |
|---|---|
| "facciamo la pagina X" · "rifai la sezione Y" · "aggiungi Z" · "sistema W" | **`/ship`**: raccolta, domande, piano, costruzione, verifica, via libera, pubblicazione |
| "controlla la home" · "è pronta?" · "va bene così?" · una pagina appena finita | **`/audit`** |
| "dove va questo?" · "posso usare questo colore?" · "come lo chiamo?" | **Rispondi da `docs/standards/`** citando l'ID della regola, mai a memoria |
| "passiamo la mano" · "chiudiamo la sessione" · "salva i progressi" | **`/handoff`** |

- **Usala direttamente quando la richiesta corrisponde chiaramente.** Chiedere "uso una skill?" scarica
  la decisione su chi non sa cosa siano.
- **Proponi, non imporre, quando corrisponde solo in parte.** "Mi sembra un lavoro da `/ship`, lo faccio
  per bene?" è meglio che avviare in silenzio cinque fasi non richieste.
- Se una skill non è disponibile, fai il lavoro tu: contano i gate del canone, le skill sono il modo per
  raggiungerli in modo affidabile.

## Regole operative

Riguardano come si lavora qui, non come deve essere il codice (quello è in `docs/standards/`).

- **Mai commit né push senza un ok esplicito**: prima si mostrano le modifiche (screenshot, anteprima
  locale, diff), poi si aspetta (`GIT-01`). Ogni push su `main` va online sull'anteprima.
- **Il sito resta `noindex` fino allo switch** (`SEO-10`). Mai toccare il flag di indicizzazione, il
  DNS o Cloudflare di tua iniziativa: gli interruttori di produzione li aziona l'utente (`GIT-08`).
- **Mai segreti nei file**: la API key sta in `.env` e il repo è pubblico (`GIT-04`).
- **Verifica nel browser vero con Playwright MCP**, non nella pane dell'app: la pane congela le
  animazioni e non cattura sotto la piega. Screenshot in `.playwright-mcp/` (ignorata da git).
- **Uso efficiente di token e risorse, puntando al miglior risultato**: pianifica prima di agire, riusa
  ciò che è già noto, non rileggere file già letti, output concisi, evita errori che costringono a
  rifare. Massima qualità, minimo spreco.
- **Non creare documentazione non richiesta**, tranne il manuale cliente, che è obbligatorio e va
  tenuto allineato al CMS (`CMS-12`–`CMS-14`).
