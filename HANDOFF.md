# HANDOFF — softairmilano.it

Documento per riprendere il lavoro da zero contesto. Aggiornato: 14 settembre 2026.

## Obiettivo
Nuovo sito **softairmilano.it** (arena indoor di softair a Milano ~1.500mq) in **Astro statico + Tailwind v4 + Pages CMS**, deploy su **Cloudflare Pages**. Sostituisce il vecchio sito WordPress su Aruba.
Obiettivi di business in ordine: **1)** vendere le partite/sessioni di softair (prenotazioni via **TicketingHub**) — priorità n.1; **2)** far crescere il **corso softair**; **3)** recuperare la "fetta paintball" (chi cerca paintball → convertito al softair).
Vincoli forti: **standard qualità altissimo**; **impatto visivo "wow"/scenico su OGNI pagina**; **codice in inglese, contenuti in italiano**; **ogni contenuto editabile via Pages CMS** (la struttura solo da un tecnico).

## Stato attuale (progress)
- Repo GitHub **privato**: `Matt0472/softairmilano`, branch `main`, **working tree pulito, tutto pushato**. Commit a nome **Mattia Pedone** (email GitHub noreply, così risulta contributore) + `Co-Authored-By: Claude`.
- Ultimo commit: `2f3ef0d`. Storia: scaffold → design system → shell+Home → fix audit → aggiornamenti piano.
- **Fatto**: scaffold Astro (build ok), **design system** (approvato dal cliente via styleguide), **Home** + shell (Header/Footer/Button/Card), **fix dell'audit** applicati (a11y/SEO/GEO/responsive/perf), Pages CMS (`.pages.yml`) espone settings+navigation+home.
- **Design system**: dark tattico. Token in `src/styles/global.css` (`@theme`): fondo gunmetal `#0e1114`, accento **ambra `#f5a524`**, display **Oswald**, body **Inter**. Sorgente di verità: `design-system/softair-milano/MASTER.md`.
- **5 agenti** definiti in `.claude/agents/` (ui-designer + 4 auditor) con auto-invocazione — vedi "Cosa non ha funzionato".
- **Documenti**: `docs/piano-sviluppo.md` (13 pagine + collezioni + direzione artistica + feedback), `docs/cutover-checklist.md` (migrazione dominio), `docs/geo-e-indicizzazione.md` (GEO/AI/indicizzazione), `CLAUDE.md` (stack, convenzioni, team).
- **Dev server**: attualmente **spento**.

## Cosa ha funzionato
- **Build/dev con Node 22** via nvm: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 22.23.2` poi `npm run build` / `npm run dev`.
- `astro dev` parte come **daemon** su `http://localhost:4321`; si ferma con `./node_modules/.bin/astro dev stop`.
- Design system generato col skill: `python3 /home/mpedone/.claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --stack astro` (usato come input, poi adattato a mano alla direzione dark-tattica).
- Repo reso privato via API: `gh api -X PATCH repos/Matt0472/softairmilano -F private=true`.
- Gate noindex: build senza env = noindex (staging); produzione con `PUBLIC_SITE_INDEXABLE=true`.

## Cosa NON ha funzionato / trappole
- **Node 20 di default fa fallire il build** ("Node.js v20 is not supported by Astro, richiede >=22.12"). SEMPRE `nvm use 22.23.2` prima di build/dev.
- **Gli agenti in `.claude/agents/` non sono invocabili se creati durante la sessione**: il runtime li carica all'avvio. Errore visto: `Agent type 'accessibility-auditor' not found`. → **Riavviare Claude Code dentro `/home/mpedone/personal-projects/softairmilano`** per attivarli. Come workaround sono stati eseguiti come stand-in `general-purpose` che leggono il file dell'agente.
- `gh repo edit --visibility private` **fallisce** con questa versione di gh (mostra l'help) → usare l'API PATCH (sopra).
- `astro` **non è globale**: usare `./node_modules/.bin/astro ...`.
- **Browser interno (claude-in-chrome) disconnesso**: niente screenshot da parte dell'agente → l'anteprima si guarda col dev server su `localhost:4321`.
- **La prima Home è piaciuta poco al cliente**: "poco impatto, pochi elementi visivi, poco richiamo al softair, hero spento". Colori/contrasti OK. Il feedback dettagliato è in `docs/piano-sviluppo.md` → sezione "Impatto visivo — TUTTO IL SITO".

## File chiave
- `CLAUDE.md` — stack, convenzioni (lingua, CMS, Node 22), team agenti, GEO. Leggere per primo.
- `docs/piano-sviluppo.md` — struttura sito (13 pagine), contenuti, **direzione artistica + feedback "wow"** da realizzare, 404.
- `design-system/softair-milano/MASTER.md` — token, tipografia, libreria blocchi, Atomic Design.
- `src/styles/global.css` — token `@theme` (unica fonte colori/spazi/font) + base + `.shell`/skip-link/mobile-menu.
- `src/layouts/BaseLayout.astro` — head (meta, OG/Twitter, JSON-LD LocalBusiness, favicon, gate noindex), skip-link, Header/Footer.
- `src/components/organisms/Header.astro` / `Footer.astro` — shell globale; Header ha menu mobile accessibile (nav a `lg`).
- `src/components/atoms/Button.astro`, `src/components/molecules/Card.astro` — primi componenti base.
- `src/pages/index.astro` — Home (hero, attività, occasioni, rimando Ranger, CTA). **Da rifare con impatto visivo.**
- `src/data/*.json` — contenuti CMS: `settings.json` (ID TicketingHub/GA, ranger, contatti — telefono/indirizzo VUOTI), `navigation.json`, `home.json`.
- `.pages.yml` — config Pages CMS (settings + navigation + home esposti).
- `public/robots.txt` — **staging: `Disallow: /`** (da sostituire al go-live).

## Ambiente & comandi (verificati)
```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 22.23.2   # OBBLIGATORIO
cd /home/mpedone/personal-projects/softairmilano
npm install            # se node_modules mancante
npm run build          # build statica → dist/ (verificato: Perf Lighthouse 99)
npm run dev            # daemon su http://localhost:4321
./node_modules/.bin/astro dev stop   # ferma il daemon
```
- Produzione (indicizzabile): build con `PUBLIC_SITE_INDEXABLE=true`.
- **Regola Git: mai committare/pushare senza ok esplicito dell'utente.** Autore commit: `Mattia Pedone <47186300+Matt0472@users.noreply.github.com>` + trailer `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

## Prossimi passi (ordinati)
1. **[DECISIONE UTENTE APERTA] Direzione visiva "wow" su ogni pagina.** Scegliere la fonte degli asset: illustrazioni custom (personaggio che corre col fucile, gear), foto reali, animazioni SVG/Lottie (gear che "si monta da solo", granate), o un mix. Nulla di grafico procede senza questa scelta.
2. **Rifare la Home** con impatto visivo forte (hero ricco/scenico), poi estendere lo stesso livello a tutte le pagine.
3. **Costruire la libreria base di componenti** (atomi/molecole mancanti: Input, FormField, Accordion/FAQ, PriceRow, Badge, ecc.) + pagina interna `/styleguide` (noindex) per validarli.
4. **Costruire le 13 pagine** + collezioni (blog, esperienze, `pages/` a blocchi) + **404** on-brand.
5. **Manuale cliente** come campo-di-zucche: `docs/manuale-cliente.html` + `scripts/genera-manuale.mjs` (indice scrollspy, noindex).
6. **Riavviare Claude Code nel progetto** per attivare gli agenti nativi, poi eseguire i 4 auditor come quality-gate.
7. **Dati/asset dal cliente**: telefono, WhatsApp, indirizzo (`settings.json`), immagine OG reale 1200×630, ID TicketingHub, ID GA4, prezzi da confermare.
8. **Go-live**: seguire `docs/cutover-checklist.md` (DNS Cloudflare preservando l'email Aruba) e `docs/geo-e-indicizzazione.md` (robots produzione + AI crawler, IndexNow, GSC/Bing, rimozione noindex).

## Decisioni aperte
- Direzione visiva/fonte asset (punto 1) — **bloccante per la parte grafica**.
- Staging: con repo privato, GitHub Pages non serve → usare **Cloudflare Pages** anche per lo staging (sottodominio mapped-dev.it). Da confermare al deploy.
- Contenuti reali e prezzi definitivi delle pagine.
