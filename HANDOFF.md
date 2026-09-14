# HANDOFF — softairmilano.it

Documento per riprendere il lavoro da zero contesto. Aggiornato: 14 settembre 2026 (sessione Home: hero + video + arena + shell).

## Obiettivo
Nuovo sito **softairmilano.it** (arena indoor di softair a Milano ~1.500 mq) in **Astro statico + Tailwind v4 + Pages CMS**, deploy su **Cloudflare Pages**.

**Sito attuale e migrazione**: `softairmilano.it` è oggi **online** come sito **WordPress su Aruba** — è la fonte da cui **recuperiamo contenuti e asset durante la costruzione** (foto reali → solo Gallery, URL social, video, testi, prezzi, dati di contatto). Al **go-live** il nuovo sito Astro **sostituisce** quello WordPress **mantenendo lo stesso dominio** `softairmilano.it` (il vecchio WP diventa backup dormiente, l'email `@softairmilano.it` resta su Aruba). Procedura completa in **`docs/cutover-checklist.md`**.
Obiettivi di business in ordine: **1)** vendere le partite/sessioni di softair (prenotazioni via **TicketingHub**); **2)** far crescere il **corso softair**; **3)** recuperare la "fetta paintball" (chi cerca paintball → convertito al softair).
Vincoli forti: **standard qualità altissimo**; **impatto visivo "wow"/scenico su OGNI pagina**; **codice in inglese, contenuti in italiano**; **ogni contenuto editabile via Pages CMS** (la struttura solo da un tecnico).

## Stato attuale (progress)
- Repo GitHub **privato**: `Matt0472/softairmilano`, branch `main`. Commit a nome **Mattia Pedone** (email GitHub noreply) + trailer `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- Ultimi commit: `02cc5ad` (arena + menu mobile full-screen), `cc02426` (logo + social + footer), `5524166` (hero cinematografico + navbar floating + pipeline immagini). **Nota**: c'è un blocco pronto da committare (video split + shell 1520 + fix radar/testi) al momento di scrivere.
- **Design system**: dark tattico. Token in `src/styles/global.css` (`@theme`): fondo gunmetal `#0e1114`, accento **ambra `#f5a524`** (valutato ma NON cambiato in arancio: le foto hanno luce ambra "cotta dentro"), display **Oswald**, body **Inter**. Contenitore `.shell` **max-width 1520px**.
- **Home rifatta con impatto visivo forte.** Ordine sezioni: **Hero → L'arena → Video → (Attività/Occasioni/Ranger/CTA già presenti dalla vecchia Home, da ridisegnare in coerenza)**.
  - **Hero** (`Hero.astro`): immagine AI full-bleed (LCP), "still viva" in CSS (Ken Burns, fascio ambra, pulviscolo, grana, HUD, titolo cinetico, scrim + text-shadow). `<picture>` desktop 16:9 + mobile 9:16 (close-up sul soggetto). Perf Lighthouse 100, LCP ~1.7s.
  - **L'arena** (`ArenaIntro.astro`): "L'arena in breve" — 4 caratteristiche (Al coperto/Illuminato/Sempre nuova/Musica immersiva, icone da CMS fra 12) con animazione MIX (target-lock parentesi → icone che si assemblano), **radar** (dimensione FISSA 1800px desktop / 1600px centrato mobile, indipendente dalla larghezza, spin in place 8s), scanline singola, contatore m². Parte all'ingresso in viewport; `prefers-reduced-motion` statico.
  - **Video** (`VideoSection.astro`): sezione **split** (desktop copy + video HUD; mobile scritta sopra, video sotto). **`<video>` nativo self-hosted su Cloudflare R2** (muted autoplay loop playsinline, poster, HUD REC/CAM, bottone "Attiva audio") — l'embed YouTube è stato rimosso, quindi **nessuna terza parte da mettere dietro cookie consent** per questa sezione. Sorgente attuale: `https://pub-03634caa58304887b733482b0c916e61.r2.dev/softairmilano-home.mp4` (URL r2.dev, da migrare a custom domain prima del go-live — vedi Decisioni aperte). Il video master 317 MB è stato compresso a 12 MB (ffmpeg H.264 CRF23 + faststart) prima dell'upload. Badge **YouTube** (@softairmilano4590, da `settings.social.youtube`) sempre visibile in basso a sinistra del frame, cliccabile.
  - **Header** (`Header.astro`): **navbar floating a pillola** trasparente sull'hero (no barra classica), hover ambra, **menu mobile a tutto schermo**, **medaglia** (`aria-current`) sulla pagina attiva. Voci menu (`navigation.items`): L'arena, Softair, Corso, Gruppi & eventi, **Softair VS Paintball**, Contatti. ⚠️ Tutte puntano a **pagine ancora da costruire** (esiste solo la Home → per ora fanno 404). In particolare **`/paintball` = landing strategica "Softair VS Paintball"** (confronto onesto softair vs paintball + numeri per convertire chi cerca il paintball; dettagli in `docs/piano-sviluppo.md` pagina #9) — **da costruire**.
  - **Footer** (`Footer.astro`): **logo** bianco, **social** (Instagram/Facebook/YouTube/TikTok, URL reali dal sito attuale in `settings.social`), colonna Menu che rispecchia `navigation.items`, bottom-bar a 3 colonne (© / firma "Made with 🧡 by Mattia Pedone → mapped-dev.it" / note legali).
  - **ScrollToTop** globale (`molecules/ScrollToTop.astro`, in `BaseLayout`).
  - **Logo**: `public/logo/logo_softair_milano.png` (sorgente) → `logo-white.png` / `logo-dark.png` generati con `scripts/logo-recolor.mjs` (ricolore fedele, no AI-redraw).
- **Pipeline immagini AI (deciso e attivo)**: si generano via **Gemini 3 Pro Image** attraverso l'API Generative Language, **pilotata da Claude** con `scripts/genera-immagine.mjs` (applica lo "stile di casa" + reframe desktop→mobile close-up). Il cliente ha **attivato il billing su Google (~€10)**: il free tier NON copre le immagini. API key in `.env` (gitignored) come `GOOGLE_AI_STUDIO_SOFTAIRMILANO_PROJECT` (nonostante il nome è la key `AIza...`). `scripts/ottimizza-immagini.mjs` (sharp → WebP) è agganciato a `dev`/`build` via `npm run immagini`.
- **Documenti**: `docs/piano-sviluppo.md`, `docs/cutover-checklist.md`, `docs/geo-e-indicizzazione.md`, `CLAUDE.md`.
- **Memoria progetto** (`.claude/.../memory/`): `asset-strategy`, `visual-references`, `feedback-audit-timing`.

## Cosa ha funzionato
- **Build/dev con Node 22** via nvm: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 22.23.2` poi `npm run build` / `npm run dev`.
- `astro dev` parte come **daemon** su `http://localhost:4321`.
- **I 5 agenti** (`.claude/agents/`) sono risultati **auto-invocabili in questa sessione** (accessibility/performance/responsive/seo auditor usati come quality-gate dell'hero — perf 84→100, LCP 4.5→1.7s dopo i fix WebP).
- **Feedback cliente sul processo**: lanciare i 4 auditor **solo a pagina finita**, non a ogni componente (vedi memoria `feedback-audit-timing`).
- Generazione immagini via API verificata: `gemini-3-pro-image`, `gemini-3.1-flash-image`, `gemini-2.5-flash-image`, più `veo-3.1` (video) disponibili sulla key.

## Cosa NON ha funzionato / trappole
- **Node 20 di default fa fallire il build**. SEMPRE `nvm use 22.23.2`.
- **La pane/browser interno CONGELA le animazioni** (`document.timeline` fermo, `animation currentTime` resta a 0 anche in primo piano) → **impossibile verificare il movimento negli screenshot/JS interni**; sul movimento ci si fida del browser reale del cliente.
- **La pane non cattura screenshot del contenuto sotto la piega** (esce nero); si verificano top-page e via ispezione JS (`getBoundingClientRect`, `getComputedStyle`).
- **YouTube**: il chrome (barra titolo/logo/correlati) **non si nasconde del tutto** senza croppare (e croppare taglia il video). Fix pulito = self-host.
- **Radar dimensionato in `%` del contenitore**: allargando `.shell` diventava enorme → ora è a **dimensione fissa in px** (indipendente dalla larghezza).
- Trappola CSS: `@keyframes { to { transform: rotate(360deg) } }` è lo spinner standard e funziona; NON usare la proprietà `rotate` insieme a un `transform: translate` (inverte l'ordine → orbita invece di girare sul posto).

## File chiave
- `CLAUDE.md` — stack, convenzioni, team agenti, GEO. Leggere per primo.
- `src/styles/global.css` — token `@theme` + `.shell` (max-width 1520px) + skip-link + mobile-menu.
- `src/layouts/BaseLayout.astro` — head (meta, OG/Twitter, JSON-LD LocalBusiness, gate noindex) + Header/Footer/ScrollToTop.
- `src/components/organisms/` — `Hero.astro`, `VideoSection.astro`, `ArenaIntro.astro`, `Header.astro`, `Footer.astro`.
- `src/pages/index.astro` — Home (ordine: Hero → ArenaIntro → VideoSection → attività/occasioni/ranger/CTA).
- `src/data/*.json` — contenuti CMS: `home.json` (hero/video/arena + attività/occasioni/…), `settings.json` (contatti VUOTI, `social`), `navigation.json` (`items` + `footerLinks`).
- `.pages.yml` — Pages CMS (settings + navigation + home, con i nuovi campi hero/video/arena/social/footerLinks).
- `scripts/` — `genera-immagine.mjs` (generatore AI), `ottimizza-immagini.mjs` (WebP), `logo-recolor.mjs`.
- `.env` — API key Gemini (gitignored, **mai committare**).
- `public/uploads/` — immagini hero (desktop + mobile + webp), varianti scartate (breach/run/prone). `public/logo/` — logo + versioni bianca/scura.

## Ambiente & comandi
```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 22.23.2   # OBBLIGATORIO
cd /home/mpedone/personal-projects/softairmilano
npm run build          # esegue anche 'immagini' (WebP) poi astro build → dist/
npm run dev            # daemon su http://localhost:4321
node scripts/genera-immagine.mjs --name hero-x --ratio 16:9 --scene "..."   # genera immagine AI (serve billing Google attivo)
```
- Produzione (indicizzabile): `PUBLIC_SITE_INDEXABLE=true`.
- **Regola Git: mai committare/pushare senza ok esplicito.**

## Prossimi passi (ordinati)
1. **Completare la Home**: **[IN CORSO] sezione Attività** — ora **4 attività** (Softair, Tiro dinamico, Arcotag, **Nerf**); layout attuale = griglia di `Card` a 4 colonne (interim), **da ridisegnare** con impatto scenico coerente con la sezione arena (linguaggio HUD/motion) — il cliente sta cercando un riferimento di layout. Poi **Occasioni** in coerenza, quindi Pacchetti/prezzi, Recensioni, Galleria, FAQ, Dove siamo, box Ranger, CTA finale.
2. **Video self-host** (vedi decisioni): sostituire l'embed YouTube con `<video>` da Cloudflare R2 quando il cliente fornisce l'mp4.
3. **Cookie consent** (vanilla-cookieconsent): gate per YouTube + GA4 + TicketingHub (ora YouTube carica diretto — da mettere dietro consenso prima del go-live).
4. **Libreria componenti** mancanti (Input, FormField, Accordion/FAQ, PriceRow, Badge…) + `/styleguide` noindex.
5. **Le 13 pagine** + collezioni (blog, esperienze, `pages/` a blocchi) + **404** on-brand. La medaglia in nav si attiverà su queste pagine.
6. **Manuale cliente** (come campo-di-zucche).
7. **Quality-gate**: i 4 auditor **a pagina finita** (a11y bloccante).
8. **Dati/asset dal cliente**: telefono, WhatsApp, indirizzo, geo, orari (`settings.json` → anche JSON-LD LocalBusiness), OG image reale (ora è un SVG che i social non renderizzano → rasterizzare o generarla da una hero), ID TicketingHub, ID GA4, prezzi.
9. **Go-live**: `docs/cutover-checklist.md` + `docs/geo-e-indicizzazione.md`.

## Decisioni aperte / note
- **VIDEO — FATTO (self-host su Cloudflare R2)**: il video della Home è ora un `<video>` nativo servito da R2 (bucket pubblico via URL **r2.dev**). **Da fare prima del go-live**: migrare da `pub-…r2.dev` a un **custom domain** (es. `video.softairmilano.it`) — Cloudflare sconsiglia r2.dev in produzione (non cacheabile su CDN come un dominio proprio). Cambio = un solo `videoSrc` in `home.json`.
- **H1 della Home** ("Diventa protagonista di un film d'azione") non contiene le keyword "softair/Milano" → il seo-auditor propone alternative keyword-rich (decisione copy del cliente, ancora aperta).
- **OG image è un SVG** → non renderizza nelle anteprime social; da rasterizzare (o generare da una hero) prima del go-live.
- **Accento colore**: resta **ambra `#f5a524`**; alternativa "arancio `#ff6a2b`" pronta se un domani si vuole staccare di più da Ranger (che usa giallo-oro `#e5a40f` su fondo chiaro), ma le foto AI hanno luce ambra quindi conviene restare caldi.
- Contenuti reali e prezzi definitivi.
