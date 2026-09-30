# Codice — `CODE-`

## Lingua

- **CODE-01** — **Il codice è interamente in inglese**: variabili, funzioni, componenti, file, cartelle,
  classi CSS e **tutti i commenti**. In italiano c'è solo ciò che vede l'utente, e quello sta nei dati
  (`CMS-01`).

## Stack e struttura

- **CODE-02** — **Astro statico**: nessun adapter SSR, `astro build` produce HTML statico per
  Cloudflare Pages. **Tailwind CSS v4 via `@tailwindcss/vite`** (non l'integrazione Astro, nessun
  `tailwind.config`): prima di scrivere una utility, verificare la sintassi v4.
- **CODE-03** — Struttura:

  ```
  src/components/{atoms,molecules,organisms}/   Atomic Design (organismi = blocchi CMS)
  src/layouts/     template: BaseLayout, PageLayout (a blocchi), ArticleLayout
  src/pages/       rotte
  src/data/        contenuti JSON (Pages CMS)
  src/scripts/     script client condivisi
  src/lib/         helper di build condivisi (TypeScript puro: niente DOM, niente contenuti)
  src/styles/      stili globali e token
  scripts/         script di build e di servizio
  docs/            documentazione e sorgenti (es. manuale cliente)
  public/uploads/  media del cliente
  ```

- **CODE-04** — **Atomic Design pragmatico**: atomi (button, link, input, badge, icona), molecole
  (form field, card, price row, FAQ item), organismi (sezioni intere = **blocchi CMS**, 1:1 con la
  libreria di blocchi del cliente), template (layout). Un elemento si promuove ad atomo o molecola
  **quando si riusa**, non prima: niente astrazioni per un uso solo.
- **CODE-05** — **Imita il codice che c'è.** Prima di scrivere, trova il componente più simile e
  replicane struttura, nomi e stile. Il codice nuovo deve essere indistinguibile da quello esistente.

## Stile

- **CODE-06** — **Solo token.** Colori, font, raggi, ombre ed easing vengono da `@theme` in
  `src/styles/global.css`; i componenti usano i token (o un alias locale come `--accent`), **mai un hex
  o un valore magico**. Le durate delle animazioni hanno i loro token (`--duration-fast`, `--duration-base`,
  `--duration-slow`). Un valore fisso voluto (es. il radar a dimensione fissa in px, che non deve
  scalare con il contenitore) si commenta con il perché.
- **CODE-07** — Animazioni solo su **`transform` e `opacity`**. Eccezioni ammesse: `stroke-dashoffset`
  per le linee SVG che si disegnano (traiettorie, radar, icone tracciate) e `flex-grow` nella galleria a
  fisarmonica di «Provate anche» (`ActivityLinks`, poche schede, scelta del cliente). Non combinare la proprietà `rotate` con
  un `transform: translate` sullo stesso elemento: l'ordine si inverte e l'elemento orbita invece di
  girare sul posto. Ogni animazione non essenziale si spegne con `prefers-reduced-motion` (`A11Y-07`).

## JavaScript client

- **CODE-08** — JS minimo e **vanilla**: uno `<script>` nel componente che ne ha bisogno, nessun
  runtime di framework UI (React, Vue…). Nessuno script da CDN: le librerie sono dipendenze npm.
- **CODE-09** — **Terze parti** (TicketingHub, GA4) si caricano **solo dopo il consenso**, per
  categoria del banner (vanilla-cookieconsent, gestione fatta a mano), con Consent Mode v2 e IP
  anonimizzato per GA4. I loro ID arrivano da `settings.json` (`CMS-11`).
- **CODE-10** — **Scroll**: Lenis è globale (`molecules/SmoothScroll.astro`) ed esposto su
  `window.__lenis`. Lo scroll programmatico passa da `window.__lenis.scrollTo(...)` (un
  `window.scrollTo` smooth viene annullato da Lenis). Niente listener di `scroll` che lavorano a ogni
  frame: `IntersectionObserver` o animazioni CSS guidate dallo scroll.
- **CODE-11** — Il testo in "streaming" (teletype) usa `setTimeout`, non `requestAnimationFrame`, così
  resta verificabile anche dove rAF è sospeso.

## Dipendenze

- **CODE-12** — Una dipendenza entra solo se serve davvero; prima di importare, controlla
  `package.json`. Librerie ammesse se servono: **anime.js** (motion), **lenis** (smooth scroll),
  **vanilla-cookieconsent** (banner), **@fontsource** (font self-hosted), **sharp** (dev, immagini).
  Qualunque altra si propone prima di aggiungerla.
- **CODE-13** — Node **≥ 22** (versione in `.nvmrc`): con Node 20 il build fallisce. Un lavoro non è
  finito finché `npm run build` non passa.

## Configurazione in un punto solo

- **CODE-14** — **Dominio**: costante `SITE_URL` in `astro.config.mjs` (override con env `SITE_URL`
  per l'anteprima) + `siteUrl` in `src/data/settings.json` + riga `Sitemap` in `public/robots.txt`.
- **CODE-15** — **Indicizzabilità**: un solo flag di build, `PUBLIC_SITE_INDEXABLE` (`SEO-10`).
- **CODE-16** — I **segreti** stanno solo in `.env` (gitignored); il codice li legge, non li contiene
  (`GIT-04`).

## Commenti e pulizia

- **CODE-17** — Commenti con la **densità del codice intorno**, e che dicono il **perché**, non il
  cosa. Mai date, riferimenti alla conversazione o al cliente ("come chiesto il 22 set"): quelli vanno
  in `docs/in-development/HANDOFF.md` o nel canone.
- **CODE-18** — Niente codice commentato, `console.log` di debug, file di prova o import inutilizzati.
