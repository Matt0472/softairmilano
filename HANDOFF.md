# HANDOFF — softairmilano.it

Documento per riprendere il lavoro da zero contesto. Aggiornato: 22 settembre 2026 (sessione: sezione Attività come "scroll-story" con streaming militare + smooth scrolling globale + immagini reali/arena).

## Obiettivo
Nuovo sito **softairmilano.it** (arena indoor di softair a Milano ~1.500 mq) in **Astro statico + Tailwind v4 + Pages CMS**, deploy su **Cloudflare Pages**.

**Sito attuale e migrazione**: `softairmilano.it` è oggi **online** come sito **WordPress su Aruba** — è la fonte da cui **recuperiamo contenuti e asset durante la costruzione** (foto reali → solo Gallery, URL social, video, testi, prezzi, dati di contatto). Al **go-live** il nuovo sito Astro **sostituisce** quello WordPress **mantenendo lo stesso dominio** `softairmilano.it` (il vecchio WP diventa backup dormiente, l'email `@softairmilano.it` resta su Aruba). Procedura completa in **`docs/cutover-checklist.md`**.
Obiettivi di business in ordine: **1)** vendere le partite/sessioni di softair (prenotazioni via **TicketingHub**); **2)** far crescere il **corso softair**; **3)** recuperare la "fetta paintball" (chi cerca paintball → convertito al softair).
Vincoli forti: **standard qualità altissimo**; **impatto visivo "wow"/scenico su OGNI pagina**; **codice in inglese, contenuti in italiano**; **ogni contenuto editabile via Pages CMS** (la struttura solo da un tecnico).

## Stato attuale (progress)
- Repo GitHub **privato**: `Matt0472/softairmilano`, branch `main`. Commit a nome **Mattia Pedone** (email GitHub noreply) + trailer `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- Ultimi commit: `645b2f0` (attività: immagini reali/arena + immagini mobile dedicate + media più larga su desktop), `35ea6ac` (sezione Attività = scroll-story streaming militare + smooth scrolling globale/Lenis), `01c00fd` (skill di design "taste-skill" + asset), `bb9462b` (card Nerf), `d19d0ee` (video self-host R2), `0f27668` (voce nav "Softair VS Paintball"). Tutto pushato su `origin/main`.
- **Design system**: dark tattico. Token in `src/styles/global.css` (`@theme`): fondo gunmetal `#0e1114`, accento **ambra `#f5a524`** (valutato ma NON cambiato in arancio: le foto hanno luce ambra "cotta dentro"), display **Oswald**, body **Inter**. Contenitore `.shell` **max-width 1520px**.
- **Home rifatta con impatto visivo forte.** Ordine sezioni: **Hero → L'arena → Video → Attività (scroll-story) → Occasioni → Ranger → CTA finale**.
  - **Hero** (`Hero.astro`): immagine AI full-bleed (LCP), "still viva" in CSS (Ken Burns, fascio ambra, pulviscolo, grana, HUD, titolo cinetico, scrim + text-shadow). `<picture>` desktop 16:9 + mobile 9:16 (close-up sul soggetto). Perf Lighthouse 100, LCP ~1.7s.
  - **L'arena** (`ArenaIntro.astro`): "L'arena in breve" — 4 caratteristiche (Al coperto/Illuminato/Sempre nuova/Musica immersiva, icone da CMS fra 12) con animazione MIX (target-lock parentesi → icone che si assemblano), **radar** (dimensione FISSA 1800px desktop / 1600px centrato mobile, indipendente dalla larghezza, spin in place 8s), scanline singola, contatore m². Parte all'ingresso in viewport; `prefers-reduced-motion` statico.
  - **Video** (`VideoSection.astro`): sezione **split** (desktop copy + video HUD; mobile scritta sopra, video sotto). **`<video>` nativo self-hosted su Cloudflare R2** (muted autoplay loop playsinline, poster, HUD REC/CAM, bottone "Attiva audio") — l'embed YouTube è stato rimosso, quindi **nessuna terza parte da mettere dietro cookie consent** per questa sezione. Sorgente attuale: `https://pub-03634caa58304887b733482b0c916e61.r2.dev/softairmilano-home.mp4` (URL r2.dev, da migrare a custom domain prima del go-live — vedi Decisioni aperte). Il video master 317 MB è stato compresso a 12 MB (ffmpeg H.264 CRF23 + faststart) prima dell'upload. Badge **YouTube** (@softairmilano4590, da `settings.social.youtube`) sempre visibile in basso a sinistra del frame, cliccabile.
  - **Attività** (`ActivitiesStory.astro`): sezione "**scrolling story**" (pattern 21st.dev interactive-scrolling-story, scelto dal cliente). Track alto (400vh) che **pinna** uno stage full-viewport; scrollando cambia l'attività attiva (crossfade). Testo in **"streaming militare"** stile Call of Duty: eyebrow `// CANALE 0X · TRASMISSIONE`, il **titolo si digita (teletype)** e la **descrizione arriva in streaming monospace** con **cursore lampeggiante** (funzione `stream()`, setTimeout — NON congelata dalla pane). 4 attività (Softair, Tiro dinamico, Arcotag, Nerf), indicatori a trattini in basso. **CMS-driven** (`home.activities`: title/desc/pills/image/imageMobile/imageAlt/href). Desktop: split copy(sx)+immagine(dx, colonna ~60%), `align-items:start`. Mobile: stessa story pinnata ma **full-bleed** (immagine + copy in overlay, gradiente). `prefers-reduced-motion` → statico. **NIENTE auto scroll-snap** (era stato aggiunto e poi RIMOSSO: forzava lo scroll all'ingresso della sezione — da non reintrodurre).
  - **Smooth scrolling GLOBALE** (`molecules/SmoothScroll.astro` in `BaseLayout`): **Lenis** (ora **dipendenza vera**, `lenis ^1.3.x` — non più CDN) su **tutto il sito**, istanza esposta su `window.__lenis`. Disattivo con `prefers-reduced-motion`.
  - **Header** (`Header.astro`): **navbar floating a pillola** trasparente sull'hero (no barra classica), hover ambra, **menu mobile a tutto schermo**, **medaglia** (`aria-current`) sulla pagina attiva. Voci menu (`navigation.items`): L'arena, Softair, Corso, Gruppi & eventi, **Softair VS Paintball**, Contatti. ⚠️ Tutte puntano a **pagine ancora da costruire** (esiste solo la Home → per ora fanno 404). In particolare **`/paintball` = landing strategica "Softair VS Paintball"** (confronto onesto softair vs paintball + numeri per convertire chi cerca il paintball; dettagli in `docs/piano-sviluppo.md` pagina #9) — **da costruire**.
  - **Footer** (`Footer.astro`): **logo** bianco, **social** (Instagram/Facebook/YouTube/TikTok, URL reali dal sito attuale in `settings.social`), colonna Menu che rispecchia `navigation.items`, bottom-bar a 3 colonne (© / firma "Made with 🧡 by Mattia Pedone → mapped-dev.it" / note legali).
  - **ScrollToTop** globale (`molecules/ScrollToTop.astro`, in `BaseLayout`).
  - **Logo**: `public/logo/logo_softair_milano.png` (sorgente) → `logo-white.png` / `logo-dark.png` generati con `scripts/logo-recolor.mjs` (ricolore fedele, no AI-redraw).
- **Pipeline immagini AI (deciso e attivo)**: si generano via **Gemini 3 Pro Image** attraverso l'API Generative Language, **pilotata da Claude** con `scripts/genera-immagine.mjs` (applica lo "stile di casa" + reframe desktop→mobile close-up). Il cliente ha **attivato il billing su Google (~€10)**: il free tier NON copre le immagini. API key in `.env` (gitignored) come `GOOGLE_AI_STUDIO_SOFTAIRMILANO_PROJECT` (nonostante il nome è la key `AIza...`). `scripts/ottimizza-immagini.mjs` (sharp → WebP) è agganciato a `dev`/`build` via `npm run immagini`.
  - **Immagini attività (fatte, 22 set)**: **Softair** e **Arcotag** = **foto reali del cliente** (in `~/Documenti/personal-projects/softairmilano/immagini/`, copiate in `public/uploads`); **Nerf** e (candidato) **Tiro** = **AI in image-to-image sulla foto reale dell'arena** `~/Documenti/.../immagini/arena.jpg` (aggiungendo i soggetti mantenendo l'ambientazione vera). ⚠️ **`arena.jpg` va usata SOLO quando il cliente lo dice esplicitamente** per generare. Per il Nerf: giocatori con **maschera a rete** (come arcotag), **occhi/volto coperti**, 1-2 dardi che escono davvero dal blaster (no dardi a caso). Le immagini AI a soggetto singolo si generano con `genera-immagine.mjs` (stile scuro cinematografico); per soggetti "chiari/luminosi" (nerf/arcotag) o edit sull'arena si usano script one-off nello scratchpad (bypassano lo stile scuro).
  - **Immagini mobile**: ogni attività ha una **versione verticale dedicata** (`*-mobile.jpeg`, campo `imageMobile`). Softair usa `campo-2` (foto verticale-friendly), Arcotag usa `arcotag-milano-ridimensionata.jpg` (i due arcieri vicini). ⚠️ **Il mobile è ancora da rifinire**: alcune fonti sono piccole → upscaling **sgranato**; il full-bleed con testo copre la metà bassa → serve soggetto in alto. Fix definitivo previsto: immagini verticali a piena risoluzione.
- **Skill di design installate** (`npx skills add Leonxlnx/taste-skill`): in `.agents/skills` + symlink `.claude/skills` (high-end-visual-design, gpt-taste, redesign-existing-projects, ecc.). La sezione Attività è stata fatta ispirandosi a `/gpt-taste` (adattato allo stack: Astro, font di casa, immagini reali, ambra).
- **Verifica visiva con Playwright MCP** (`claude mcp add playwright npx @playwright/mcp@latest`): browser vero, **cattura anche sotto la piega** e vede le animazioni → usarlo per verificare desktop/mobile (la pane interna non basta). Screenshot in `.playwright-mcp/` (ripulire dopo, non committare).
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
- **3D abbandonato**: provato hero/attività in 3D (Three.js con primitive = "Lego" brutto; modello sample = generico/non-softair). **Gemini/Google NON generano 3D** (solo immagini 2D). La catena "budget zero" per un 3D vero (Gemini multi-vista → Tripo/Meshy image-to-3D → Mixamo rig) è troppo lunga/macchinosa → **il cliente ha detto di lasciar perdere il 3D**. La strada giusta per il "reale" sono le **foto/immagini AI fotorealistiche**, non il 3D real-time.
- **Crop immagini mobile**: un'immagine **orizzontale** in un full-bleed verticale mostra solo una fetta stretta (sembra "zoomata") e con **due soggetti distanti** ne taglia sempre uno. `object-fit: contain` (letterbox con bande) è stato **bocciato dal cliente**. Soluzione = **foto verticali dedicate** o crop mirati con `sharp` (`position:'right'`/`'left'`/`attention`, o `extract`), soggetto **in alto** (la metà bassa la copre il testo). Ancora da rifinire.
- **Streaming teletype**: usa `setTimeout` (NON `requestAnimationFrame`/CSS animation) → funziona anche nella pane. Lo scroll-snap "on idle" era fastidioso (forzava lo scroll) → **rimosso**, non reintrodurre.

## File chiave
- `CLAUDE.md` — stack, convenzioni, team agenti, GEO. Leggere per primo.
- `src/styles/global.css` — token `@theme` + `.shell` (max-width 1520px) + skip-link + mobile-menu.
- `src/layouts/BaseLayout.astro` — head (meta, OG/Twitter, JSON-LD LocalBusiness, gate noindex) + Header/Footer/ScrollToTop.
- `src/components/organisms/` — `Hero.astro`, `VideoSection.astro`, `ArenaIntro.astro`, `ActivitiesStory.astro`, `Header.astro`, `Footer.astro`.
- `src/components/molecules/` — `ScrollToTop.astro`, `SmoothScroll.astro` (Lenis globale).
- `src/pages/index.astro` — Home (ordine: Hero → ArenaIntro → VideoSection → ActivitiesStory → occasioni → ranger → CTA).
- `src/data/*.json` — contenuti CMS: `home.json` (hero/video/arena + attività con image/imageMobile/pills + occasioni/…), `settings.json` (contatti VUOTI, `social`), `navigation.json` (`items`).
- `.pages.yml` — Pages CMS (settings + navigation + home, con i campi hero/video/arena/social + attività image/imageMobile/pills).
- `scripts/` — `genera-immagine.mjs` (generatore AI), `ottimizza-immagini.mjs` (WebP), `logo-recolor.mjs`.
- `.env` — API key Gemini (gitignored, **mai committare**).
- `public/uploads/` — immagini hero (desktop + mobile + webp) + **immagini attività** `att-softair*`, `att-tiro-dinamico*`, `att-arcotag*`, `att-nerf*` (ognuna con `-mobile` dedicata) + il video poster. `public/logo/` — logo + versioni bianca/scura. Le **foto reali sorgente** del cliente sono in `~/Documenti/personal-projects/softairmilano/immagini/` (arena.jpg, softair-milano-campo-1/2, ArcoTag-milano-1, arcotag-milano-ridimensionata).

## Ambiente & comandi
```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 22.23.2   # OBBLIGATORIO
cd /home/mpedone/projects/personal/softairmilano
npm run build          # esegue anche 'immagini' (WebP) poi astro build → dist/
npm run dev            # daemon su http://localhost:4321
node scripts/genera-immagine.mjs --name hero-x --ratio 16:9 --scene "..."   # genera immagine AI (serve billing Google attivo)
```
- Produzione (indicizzabile): `PUBLIC_SITE_INDEXABLE=true`.
- **Regola Git: mai committare/pushare senza ok esplicito.**

## Prossimi passi (ordinati)
1. **Rifinire la sezione Attività** (fatta come scroll-story): (a) **MOBILE** — immagini verticali dedicate a piena risoluzione (togliere lo sgranato, soggetto ben centrato e non coperto dal testo); (b) **Tiro dinamico** — decidere se sostituire l'immagine attuale (`att-tiro-dinamico.jpeg`) con la nuova **coi bersagli** (candidato `att-tiro-dinamico-2.jpeg`, non ancora agganciato); (c) eventuale sezione **Corso** dedicata (ne avevamo parlato).
2. **Completare la Home**: ridisegnare **Occasioni** in coerenza, poi Pacchetti/prezzi, Recensioni, Galleria, FAQ, Dove siamo, box Ranger, CTA finale.
3. **Cookie consent** (vanilla-cookieconsent): gate per GA4 + TicketingHub (il video è self-host, niente YouTube da gestire).
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
