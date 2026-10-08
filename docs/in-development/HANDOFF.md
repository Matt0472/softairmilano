# HANDOFF — softairmilano.it

Aggiornato: **8 ott 2026, ore 11:00**. Riscritto da capo. Rispetto alla versione del 2 ott ci sono:
- il giro del 7 ott, già online con il commit `e5c04c4`;
- il lavoro dell'8 ott, non ancora committato: banner dei cookie, pagine legali, blog con 22 articoli, interruttori «Pagina online», manuale del cliente e regole di gioco corrette.

## Obiettivo

**Il sito.** Nuovo **softairmilano.it**: arena indoor di softair a Milano, circa 1.500 m². È in Astro statico con Tailwind v4 e Pages CMS, e andrà su Cloudflare Pages. Sostituirà il WordPress su Aruba sullo stesso dominio (`docs/cutover-checklist.md`).

**Obiettivi di business:**
1. vendere partite (TicketingHub);
2. far crescere il corso;
3. convertire chi cerca il paintball.

**Vincoli.** Qualità altissima, ma prima la performance. **Tutto il contenuto si modifica da CMS.** Il codice è in inglese, i contenuti in italiano. Le regole stanno in `docs/standards/`, l'indice è in `CLAUDE.md`.

**Focus adesso:**
1. chiudere il giro dell'8 ott: copertine del blog, correzioni dalle revisioni, commit con l'ok dell'utente;
2. TicketingHub, appena l'utente porta gli snippet;
3. audit completo del sito (`/audit sito`) prima del lancio.

## Stato attuale

### Repo e anteprima
- **Repo:** `Matt0472/softairmilano` (pubblico), branch `main`.
- **Online sull'anteprima** https://softairmilano-anteprima.mapped-dev.it: commit **`e5c04c4`** del 7 ott, deploy riuscito. Il sito è `noindex` (`SEO-10`).
- **Solo in locale, circa 85 file:** tutto il lavoro dell'8 ott, elencato sotto. **Mai commit né push senza l'ok esplicito dell'utente** (`GIT-01`).

### Pagine (tutte su `BaseLayout`, con `FinalCta` `#prenota` in fondo)

**Home** (`src/pages/index.astro`, `home.json`):
- Hero: l'H1 contiene la riga piccola «Softair indoor a Milano».
- ActionVideo: largo da subito, autoplay.
- ArenaIntro: foto reali e tour a 360°.
- ActivitiesStory: soggetto della foto regolabile da CMS (`focus`). Per Arcotag e Nerf le foto delle loro aperture.
- Rimando al paintball.
- Occasioni.
- Voucher regalo: `VoucherTeaser` con il biglietto `VoucherTicket`.
- Corso.
- Social.
- Ranger: riquadro con la palette Ranger (`DES-12`).
- Recensioni: in fondo, per scelta dell'utente.
- FinalCta.

**Attività** (`src/pages/[activity].astro`, collezione `src/data/activities/*.json`): softair, arcotag, tiro-dinamico, nerf.
- Il passo «Arrivo» porta a /modulistica (campo `link` dei passi).
- Il blocco «Abbigliamento consigliato» sta nei prezzi (`settings.wear`).
- «Provate anche» ha un ordine per pagina (`related.order`, campo reference).
- Form di richiesta Web3Forms.

**Pagine fisse:**
- /corso-softair (`corso.json`): chip delle iscrizioni, ciano se aperte e rossa se chiuse.
- /softair-vs-paintball, con 301 da /paintball.
- /occasioni: sala feste con tre schede, invito PDF nuovo `/uploads/invito-festa-compleanno.pdf`.
- /teambuilding: loghi dei clienti, attività abbinabili.
- /voucher-regalo: 35 € e 15 €; l'acquisto aspetta TicketingHub.
- /contatti: mappa caricata su click.
- /modulistica: modulo dei minorenni nuovo, `/uploads/modulistica-minorenni.pdf`.
- /404.

**Nuove dell'8 ott:**
- **Pagine legali** /privacy, /cookie, /termini:
  - Markdown in `src/pages/*.md` con `src/layouts/LegalLayout.astro`, apertura `TextHero` e testo `Prose`;
  - `noindex` e fuori dalla sitemap;
  - **bozze nostre**, da far validare al consulente del cliente.
- **Blog:**
  - elenco `/blog/` (`src/pages/blog/[...page].astro`), 9 card per pagina (`POSTS_PER_PAGE`; la prima pagina ha in più l'articolo in evidenza), card alla stessa altezza, riassunto tagliato con «…» e bottone «Leggi l'articolo»;
  - articolo `/blog/<slug>/` (`[slug].astro`);
  - collezione `src/content.config.ts`, 22 articoli importati dal WordPress in `src/content/blog/*.md`;
  - redirect 301 dagli indirizzi vecchi alla radice in `public/_redirects`;
  - «Blog» nel menu, dentro «Info».
- **Banner dei cookie:**
  - vanilla-cookieconsent, `src/scripts/consent.ts` e `src/components/molecules/CookieConsent.astro`;
  - testi in `src/data/cookie.json`;
  - categorie Necessari, Statistiche (GA4 con Consent Mode v2, solo se c'è `settings.gaMeasurementId`) e Servizi esterni;
  - «Preferenze cookie» nel footer;
  - provato in Playwright: Google Analytics non parte prima del consenso, si spegne con il rifiuto, e la scelta resta.

### Meccanismi trasversali
- **Interruttore «Pagina online»** (`published` nei JSON delle pagine e nella front matter degli articoli; logica in `src/lib/pages.ts`).
  - Un plugin Vite in `astro.config.mjs` ripulisce i dati di `src/data/**`: le voci di menu e le attività della home verso pagine spente spariscono; altrove i link perdono l'indirizzo e i componenti li nascondono.
  - Un hook `astro:build:done` toglie da `dist/` le pagine spente, quindi l'hosting risponde 404. Anche la sitemap le esclude.
  - In home il corso e il voucher spariscono con la loro pagina (`isLive`).
  - Provato su una copia con Occasioni e Nerf spenti: nessun link residuo, cartelle assenti, fuori dalla sitemap.
  - In `npm run dev` le pagine spente si vedono ancora.
- **Immagini nel Markdown:** `src/lib/markdown-images.ts` aggiunge dopo la build width, height, lazy e WebP alle `<img>` di blog e pagine legali.
- **Manuale del cliente:**
  - sorgente `docs/manuale-cliente.html`;
  - generato da `scripts/genera-manuale.mjs` (`npm run manuale`, dentro `dev` e `build`) in `public/manuale-sam-3c9e/`, ignorato da git;
  - online su **`/manuale-sam-3c9e/`**: `noindex`, mai linkato, fuori da sitemap e robots (`CMS-12/13`);
  - 27 capitoli;
  - **si aggiorna nella stessa modifica di `.pages.yml`** (`CMS-14`).
- **Componenti nuovi:**
  - atomi: `ArrowLink`;
  - molecole: `VoucherTicket`, `CookieConsent`, `Prose`, `BlogCard`, `Marquee`;
  - organismi: `TextHero` (usato dalle pagine legali e dal blog; vanno ancora migrati modulistica, 404 e contatti), `VoucherTeaser`, `BlogPosts`, `ClientLogos`, `PartnerCards`, `BookingRequest`, `ContactHero`, `GettingHere`.
- **Helper:** `src/lib/pages.ts`, `blog.ts`, `fields.ts` (`has`), `jsonld.ts` (`businessId`, `blogPostingLd`), `typography.ts`, `nav.ts`, `phone.ts`.

### Qualità misurata
- **8 ott, revisioni sul giro di home e attività** (codice, CMS, accessibilità): nessun bloccante, AA passato, correzioni applicate.
- **Lighthouse dello specialista design, 8 ott:** CLS 0 su /blog/, articoli e pagine legali; Performance 0,97–1; Accessibility 1.
- **Le misure complete del 30 set** sono nei verbali `docs/audits/`.
- **Un audit dell'intero sito dopo il 7 ott non c'è ancora:** è il prossimo grande passo.

## In attesa del cliente / dell'utente
- **Risposte dell'utente dell'8 ott, già applicate:**
  - WhatsApp = numero del sito, più un bottone tondo solo su mobile (`WhatsAppButton`);
  - profilo Google in `testimonials.rating.url`;
  - ultima partita serale alle 22;
  - tiro dinamico: sessione di 1 h 30 con briefing, prezzo per sessione, sempre seguiti dallo staff;
  - missioni e pettorina protettiva anche per arcotag e Nerf;
  - «Squadra ufficiale» spento, con redirect al corso;
  - articoli verificati online (leggi, energia del paintball, prezzi);
  - tabella del confronto rifatta su mobile;
  - banner dei cookie **bloccante fino alla prima scelta**;
  - copertine del blog approvate.
- **Restano per l'utente:**
  - Pages CMS: l'invito va a info@softairmilano.it, se ne occupa l'utente;
  - GA4 e Search Console si configurano **al momento dello switch** (l'utente ha l'accesso a Google);
  - i testi legali li gira al consulente.
- **Copertine del blog chiuse l'8 ott:**
  - le 17 copertine AI sono approvate, e quella del «9 motivi» è rigenerata;
  - punta rossa corretta con un ritocco i2i sulle 4 copertine dove si vedeva;
  - nuova regola `MEDIA-11`: le repliche nelle immagini hanno sempre la punta rossa.

## Dati dal cliente (già dati, da rispettare)
- **Giocatori:**
  - softair, arcotag e Nerf da 8 a 20;
  - softair: più gruppi allo stesso orario e, sotto gli 8, uniti a un altro gruppo; l'esclusiva si chiede al telefono;
  - arcotag e Nerf: il gruppo gioca da solo e sotto gli 8 paga 8 quote;
  - team building fino a 30 con il torneo;
  - tiro dinamico da 1 a 8.
- **Sala feste:**
  - softair solo con l'arena in esclusiva, compresa nell'1 h 45;
  - arcotag e Nerf compresa nell'1 h 45 dal lunedì al venerdì; nel weekend solo la sala esterna, togliendo tempo di gioco;
  - per tutte, un'ora in più a 70 € (interna) o 50 € (esterna) solo se dopo non ci sono altre partite.
- **Prenotazioni:** si prenota tutti i giorni (il tiro dinamico nel weekend su richiesta); sotto le 4 ore vanno confermate; la caparra si recupera annullando almeno una settimana prima.
- **Orari:** 14–24 tutti i giorni. Arcotag e Nerf hanno il pomeriggio 14–20 (ultima partita alle 18) e la sera dalle 20. Tiro dinamico dal lunedì al venerdì, 14–24.
- **Età minime:** softair e tiro 12, arcotag 8, Nerf 6, corso 16.
- **Modulo** obbligatorio per tutti: online per i maggiorenni, su carta e firmato da un genitore per i minorenni, **senza documento d'identità**.
- **Voucher:** 35 € con noleggio, 15 € con il proprio fucile; valido 6 mesi; **da portare stampato**; **non rimborsabile**. Ricarica da 300 colpi a 3 €.
- **Corso:** il prezzo non si pubblica mai.
- **Mai scrivere** «chi viene colpito esce/è eliminato».
- **Fotografo:** non c'è più.
- **Indirizzo:** «Via Melegnano 26, 20019 Settimo Milanese (MI)»; nei testi «Milano». P.IVA 11358200969.
- **Recensioni:** 4,7 e «500+», aggiornate a mano dal cliente; 44 recensioni vere.

## Cosa ha funzionato
- **Specialisti in parallelo su file diversi:**
  - build serializzate con `flock <scratchpad>/build.lock npm run build`;
  - ogni agente usa **un contesto Playwright suo** (`page.context().browser().newContext()`);
  - un solo server di anteprima, sulla 4322: `preview_start` con la voce `astro-preview` di `.claude/launch.json`.
- **Contenuti dal WordPress:** `/wp-json/wp/v2/posts|pages|media` pubblici.
  - Gli articoli usano WPBakery: le immagini sono shortcode `[vc_single_image image="ID"]`, da risolvere con `/wp-json/wp/v2/media/<ID>`.
- **Prove sulle pagine spente:** si fanno su una copia del repo nello scratchpad, con `node_modules` collegato da un link simbolico, così non si disturbano gli altri agenti.
- **Da DOCX a PDF senza LibreOffice:** si converte il DOCX in HTML seguendo `styles.xml`, si stampa con Chrome headless, si confrontano le misure con il PDF Word precedente e si comprime con Ghostscript. Così è nato il modulo dei minorenni, 120 KB per 3 pagine.
- **Gemini** (`scripts/genera-immagine.mjs`), una generazione alla volta:
  - i2i «fedele» dalle foto reali;
  - rigenerare quando compaiono difetti: bossoli, scritte, volti scoperti, armi deformate.

## Cosa NON ha funzionato / trappole
- **La modalità piano della sessione principale ferma gli agenti in background:** è successo con il modulo PDF. Dopo `ExitPlanMode` vanno ripresi con `SendMessage`.
- **Astro 7 usa Sätteri come processore Markdown:** `markdown.rehypePlugins` fa fallire la build senza `@astrojs/markdown-remark`. Per questo le immagini del Markdown si trattano dopo la build.
- **Il CSS di vanilla-cookieconsent si carica dopo il nostro:** le sovrascritture vanno su `html #cc-main …` per vincere il pareggio.
- **Pipeline delle immagini:** legge solo `public/uploads/` senza sottocartelle, e `Picture` cerca le varianti per nome del file. Le immagini vanno messe piatte, per esempio `blog-<slug>.jpg`.
- **`pkill -f lighthouse`** uccide anche la shell che lo lancia: si fermano i task con `TaskStop`.
- **Il browser Playwright condiviso:** gli agenti si rubano le schede. Usare sempre un contesto proprio.
- **`npm run dev` dell'utente** (porta 4321) dopo modifiche agli stili `is:global` serve CSS vecchio: va riavviato.
- **Restano valide le trappole storiche:**
  - `CODE-19`: animazioni con le proprietà estese;
  - `fill: none` sui path SVG;
  - `.band` e le superfici `--plane`/`--lift`;
  - Node 22 obbligatorio;
  - `{lista?.length && …}` stampa «0»: usare `!!lista?.length`;
  - `process.cwd()` per i file di `public/`;
  - Lenis si ferma con `stop()` e `start()`;
  - Gemini inventa scritte e impugnature: controllare sempre.
- **Script Python di modifica:** mai `open(p,'w').write(f(open(p).read()))`, tronca il file prima di leggerlo.

## File chiave
- `CLAUDE.md` e `docs/standards/README.md`: indice, non negoziabili e debito noto.
- `src/lib/pages.ts` + `astro.config.mjs`: interruttori «Pagina online», plugin dei dati, hook di build, sitemap.
- `src/scripts/consent.ts` + `src/components/molecules/CookieConsent.astro`: consenso e GA4.
- `src/pages/[activity].astro`: modello delle pagine attività.
- `src/pages/blog/[...page].astro`, `[slug].astro`, `src/lib/blog.ts`, `src/content.config.ts`: il blog.
- `src/layouts/LegalLayout.astro`, `src/components/organisms/TextHero.astro`, `src/components/molecules/Prose.astro`: pagine di solo testo.
- `.pages.yml`: tutto il CMS. Ogni sua modifica aggiorna `docs/manuale-cliente.html` (`CMS-14`).
- `public/_redirects`: indirizzi vecchi del WordPress (valgono solo su Cloudflare).

## Ambiente & comandi
```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 22.23.2   # obbligatorio
npm run build        # immagini (WebP + public/_img) → manuale → astro build → dist/
npm run manuale      # rigenera solo il manuale
```
- **Anteprima della build:** `preview_start` con `astro-preview` (porta 4322).
- **Gemini:** `NODE_OPTIONS=--dns-result-order=ipv4first node scripts/genera-immagine.mjs --name x --ratio 16:9 --size 2K`.
- **Chiavi:** la chiave Gemini è in `.env`. La chiave Web3Forms è pubblica per natura, in `settings.json`.

## Prossimi passi
1. **Mostrare tutto all'utente e committare con il suo ok** (`GIT-01`). È una modifica delicata (`GIT-07`: redirect, consenso, interruttori): serve un runbook breve. Prima va mandato il **messaggio di prova del form** (Web3Forms → info@), che l'utente ha autorizzato.
2. **Pages CMS cancella i campi svuotati quando salva** (verificato nel sorgente: `sanitizeObject`): un campo vuoto diventa *assente*, non `""`. Banner, pagine legali e consenso sono già protetti. Va fatto un giro su tutto il sito per gli accessi `a.b.c` a oggetti facoltativi (`code-standards-specialist` + `cms-specialist`).
3. **Decisioni SEO sul blog, del cliente:**
   - cannibalizzazione con /softair-vs-paintball: fondere «Meglio paintball o softair?» nel «9 motivi» con un 301;
   - togliere dal «9 motivi» le FAQ doppie;
   - un blocco «Approfondimenti» sulla pagina paintball verso gli articoli.
4. **TicketingHub:**
   - widget nelle sezioni `#prenota` e acquisto dei voucher, con il consenso «Servizi esterni»;
   - `settings.ticketinghubId` oggi non è letto da nessun componente.
5. **`/audit sito`**, pagina per pagina. Poi la rifinitura.
6. **Seguiti tecnici:**
   - migrare modulistica, 404 e contatti su `TextHero` (sui telefoni il breadcrumb tocca l'angolo HUD);
   - interlinea dei titoli: 1.16 nelle card del blog, 1.12 in TextHero e global.css. Allinearle dopo una prova a occhio;
   - `ScrollToTop`: `transition-colors` viene sovrascritto dalla transizione locale, quindi l'hover cambia colore di colpo;
   - `VsComparison`: media query desktop-first (`max-width`), da far valutare al `responsive-specialist`;
   - un atomo «bottone con freccia», oggi copiato in CourseTeaser, TeaserBanner, VoucherTeaser e ActivitiesStory;
   - helper per slug, `menuLabel` e link di Google Maps;
   - `list: { max }` senza `collapsible` in `.pages.yml`: verificare nell'editor di Pages CMS se dà errore;
   - cannibalizzazione degli articoli paintball con /softair-vs-paintball (vedi la revisione SEO);
   - lo sticky dei prezzi sui portatili bassi (circa 768 px di altezza): verifica dello specialista responsive;
   - `lastmod` nella sitemap dalla data degli articoli; `dateModified` facoltativo negli articoli;
   - un campo facoltativo «Titolo per Google» negli articoli: oggi oltre i 65 caratteri cade solo il suffisso;
   - `/la-montagna-della-morte/` e `/la-montagna-della-morte-pagamento/` del vecchio sito, un evento esterno: decidere se mandarle a Ranger o a /softair;
   - TicketingHub: con lo snippet, collegare la categoria «Servizi esterni» (`window.__consent` / `consent-change`) e allineare banner, policy e manuale. Oggi mappa e voucher si caricano solo al click e ignorano la categoria;
   - il percorso del manuale (`/manuale-sam-3c9e/`) è leggibile nel repo pubblico: `CMS-13` lo presuppone segreto, quindi valutare di leggerlo da una variabile di CI oppure correggere la regola;
   - `npm run manuale` e `genera-manuale.mjs` sono in italiano per `CMS-12`, mentre `CODE-01` vuole nomi in inglese: va corretta una delle due regole.

## Da chiudere prima del go-live
- **Immagine social della home** in SVG: rasterizzarla in 1200×630.
- **JSON-LD:** `geo` e `openingHoursSpecification`.
- **Indicizzazione:** chiave IndexNow; un solo interruttore per `robots.txt` e `noindex`; `PUBLIC_SITE_INDEXABLE=true` **solo il giorno dello switch** (`SEO-10`, `GIT-08`).
- **Movimento continuo senza pausa** (WCAG 2.2.2): riga e puntino di `HudFrame`, ora anche su pagine legali e blog. È nel debito noto.
- **Bordo `--color-border`** sotto 3:1 (WCAG 1.4.11).
- **Video R2:** da `r2.dev` a un dominio proprio.
- **GA4:** l'ID del cliente in `settings.gaMeasurementId`; senza, il banner non offre le statistiche.
- **Testi legali** validati dal consulente del cliente.
- **Al go-live:** 301 da `www.` al dominio nudo con una regola Cloudflare; Search Console, Bing Webmaster e Rich Results Test (`docs/geo-e-indicizzazione.md`).
