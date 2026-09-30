# HANDOFF — softairmilano.it

Aggiornato: **30 set 2026, ore 18:15**.

Cosa c'è di nuovo:
- menu «Attività» a tendina e le prime due pagine interne, **/arcotag** (modello di tutte le pagine attività) e **/paintball**;
- audit completo e correzione di tutti i bloccanti e i maggiori;
- immagini responsive con varianti di larghezza e font di ripiego calibrati;
- canone aggiornato (`DES-11`, eccezioni a `CODE-07`, `src/lib/`, token delle durate);
- dopo il commit `d9210e2` (**tutto ancora da committare**):
  - voto unico 4,7 · 500+ per home e pagine, recensioni divise per pagina, `hero.proof` sostituito da `hero.showRating` (migrato in `home.json`, `CMS-09`);
  - pagine **/softair**, **/tiro-dinamico**, **/nerf** con la sezione nuova «Missioni / Percorsi» (`ModeGrid`) e il campo `hero.focus`;
  - audit delle tre pagine (`docs/audits/2026-09-30-softair-tiro-dinamico-nerf.md`) e correzione di bloccanti, maggiori e minori; le immagini nuove chieste dall'audit sono in attesa di approvazione.

## Obiettivo

**Il sito.** Nuovo sito **softairmilano.it** (arena indoor di softair a Milano, ~1.500 m²) in Astro statico + Tailwind v4 + Pages CMS, con deploy su Cloudflare Pages.

**La migrazione.** Oggi `softairmilano.it` è un WordPress su Aruba, ed è la fonte di contenuti e foto. Al go-live il sito nuovo lo sostituisce sullo stesso dominio (`docs/cutover-checklist.md`).

**Obiettivi di business, in ordine:**
1. vendere partite e sessioni (TicketingHub);
2. far crescere il corso;
3. convertire al softair chi cerca il paintball.

**Il pubblico da riconquistare:** i gruppi «non so cosa fare il sabato sera con gli amici» (arcotag e softair).

**Vincoli:**
- qualità altissima e «wow» su ogni pagina, ma la performance viene prima;
- tutto il contenuto editabile da CMS;
- codice in inglese, contenuti in italiano;
- le regole stanno in `docs/standards/` (indice in `CLAUDE.md`).

## Stato attuale

### Repo, deploy e metodo di lavoro

- **Repo**: `Matt0472/softairmilano` (pubblico), branch `main`. Il commit di questo lavoro segue `5d19553`, l'ultimo pushato.
- **Anteprima**: **https://softairmilano-anteprima.mapped-dev.it**, su GitHub Pages. Ogni push su `main` la aggiorna in circa 1 minuto (`gh run watch`). Il sito resta `noindex` (`SEO-10`).
- **Regola del cliente**: mai commit o push senza ok esplicito, dopo avergli mostrato le modifiche (`GIT-01`).
- **Metodo**: `/ship`, `/audit`, `/coding-standards` e `/handoff` sono skill di progetto in `.claude/skills/`. I **specialisti** sono in `.claude/agents/`: design, cms, asset, code-standards, accessibility, performance, responsive, seo.

### Design system

- **Regole**: `docs/standards/design.md`. Le decisioni bocciate dal cliente sono in `DES-10`, da non riproporre.
- **Valori**: `src/styles/global.css` (`@theme`):
  - accento ciano `#00ccff`;
  - font Oswald per i titoli, Inter per il testo, entrambi con **fallback calibrati** («Oswald Fallback», «Inter Fallback») per avere CLS 0;
  - easing `--ease-out-expo` e durate `--duration-fast/base/slow`;
  - `.shell` largo al massimo 1520 px, con `--shell-gutter` (1.25rem, 2rem da 768).
- **Titoli**: `h1–h4` hanno interlinea 1,12, perché gli accenti delle maiuscole di Oswald non tocchino la riga sopra.

### Home (`src/pages/index.astro`)

- **Ordine delle sezioni**:
  1. Hero (immagine AI «still viva»);
  2. L'arena (radar);
  3. Video (self-hosted su R2);
  4. Attività (scroll-story pinnata con testo «in streaming»);
  5. Occasioni, Ranger e CTA finale, ancora con i marcatori «(DA COMPLETARE)».
- **CTA finale**: ha `id="prenota"`, quindi il bottone Prenota del menu funziona anche in home.
- **Etichette**: tutte le CTA di prenotazione dicono «Prenota» (`DES-05`).

### Menu (`Header.astro`, `src/data/navigation.json`)

- **Desktop**: voce «Attività ▾», una tendina con Softair (badge «Il più richiesto»), Arcotag («Da provare»), Tiro dinamico e Nerf, ciascuno con una descrizione di una riga.
  - Si apre al clic e al passaggio del mouse, si chiude con Esc (anche con il focus fuori), si naviga con le frecce.
  - Solo la pagina corrente è in ciano.
- **Mobile**: menu a tutto schermo con un gruppo 2×2. È modale: tutti i figli di `body` diventano `inert` e Lenis si ferma.
- **Voci**: alte 44 px e su una riga fino a 1024.
- **Bottone Prenota del menu**: `navigation.cta` nel CMS.

### Footer (`Footer.astro`)

- Tutti i link sono almeno 44×44 px.
- La colonna Ranger viene da `settings.footerRanger`, il nome del sito da `siteName`, il telefono da `src/lib/phone.ts`.
- La barra in fondo lascia spazio al bottone «torna su».

### Pagine attività: collezione Pages CMS «Attività»

- **Dati**: un file per attività in `src/data/activities/<slug>.json`: `arcotag`, `softair`, `tiro-dinamico`, `nerf`.
- **Rotta**: `src/pages/[activity].astro` genera `/<slug>`.
- **Sezioni**, ognuna mostrata solo se ha titolo e contenuto (`CMS-10`):
  1. PageHero con i numeri a rullo, stile contachilometri, e la freccia firma per l'arcotag;
  2. AnswerBlock;
  3. StepTimeline `#serata` («La vostra serata»);
  4. SplitFeature «Come si gioca»;
  5. ModeGrid «Missioni / Percorsi» (`modes`, solo softair e tiro dinamico): numeri 01, 02… solo se `numbered` (tiro sì, softair no);
  6. AudienceGrid «Perfetto per», con la voce in evidenza tramite il campo `featured` (con 3 voci è la scheda alta a sinistra);
  7. PriceTiers: fasce tutte illuminate, badge facoltativo (h3 e badge separati), sui telefoni piccoli la cifra va sotto l'etichetta;
  8. Reviews;
  9. FaqAccordion, esclusivo (`DES-11`);
  10. ActivityLinks «Provate anche», una galleria **squeeze**.
     - Le schede sono le attività di Home › Attività meno la pagina corrente; le descrizioni brevi vengono dal menu.
     - La scheda attiva è larga e illuminata; clic o tocco su una striscia la apre, un secondo clic naviga.
     - Frecce e tastiera. Niente autoplay.
  11. BookingCta `#prenota`: telefono, email e WhatsApp se compilato, con orari e indirizzo.
- **Slot dei componenti**: `PageHero` (`decor`) e `SplitFeature` (default) guardano l'HTML reso dello slot, non `Astro.slots.has`: una condizione falsa passata come slot non accende più layout vuoti.

### Pagina `/paintball` (`src/pages/paintball.astro` + `src/data/paintball.json`)

- **Sezioni, in ordine**:
  1. apertura AI «due giocatori a confronto»;
  2. risposta breve;
  3. VsComparison `#confronto`, una tabella vera;
  4. ImpactScale, con le sfere da 6 e 17 mm in proporzione;
  5. TeaserBanner verso l'arcotag;
  6. «Cosa trovate», con una foto reale e 6 missioni;
  7. «La prima volta» `#prima-volta`;
  8. prezzi, con il badge «Per iniziare» sulla Recluta;
  9. recensioni;
  10. FAQ;
  11. Prenota.
- **Tono**: confronto onesto e rispettoso. Viking Paintball Como è del cliente ma **non va nominato** (sua decisione).

### Componenti nuovi (futuri blocchi CMS)

- **Organismi**: `PageHero`, `AnswerBlock`, `StepTimeline`, `SplitFeature`, `AudienceGrid`, `PriceTiers`, `Reviews`, `FaqAccordion`, `ActivityLinks`, `BookingCta`, `VsComparison`, `ImpactScale`, `TeaserBanner`.
- **Molecole**: `Breadcrumb`, `FactStrip`, `IncludedList`, `LeadText`, `Reveal`, `SectionHead`, `Trajectory`.
- **Atomi**: `Icon`, `Picture`, `Badge`.
- **Helper condivisi** in `src/lib/`: `phone.ts` (`toE164`, `telHref`), `jsonld.ts` (`toLd`, `breadcrumbLd`, `faqLd`), `nav.ts`, `reviews.ts` (voto unico e `reviewsFor(page)`).
- **Recensioni**: voto e numero hanno una fonte sola, `testimonials.json` → `rating`, letta dall'hero della home (`hero.showRating`, le stelle si riempiono fino alla frazione esatta) e da `Reviews.astro`. Ogni recensione ha `pages`: `Reviews` riceve lo slug della pagina (`page={activity}`, `page="paintball"`) e mostra prima le sue, poi quelle generali (`all` o nessuna), al massimo 5.
- **Link interni** alla pagina: spostano anche il focus (`SmoothScroll.astro`).

### SEO

`BaseLayout.astro`:
- valori predefiniti quando un campo SEO del CMS è vuoto;
- `og:image` con larghezza e altezza lette dal file, e `og:image:alt`;
- un JSON-LD `SportsActivityLocation` unico per tutto il sito: `@id` stabile, `PostalAddress` da `settings.postalAddress`, telefono E.164, social in `sameAs`;
- `BreadcrumbList` e `FAQPage` per pagina, con gli URL nella stessa forma del canonical (barra finale);
- precarico di Oswald 700.

Immagini social: `arcotag-og.jpg` e `paintball-og.jpg`, 1200×630.

### Immagini

- **Pipeline**: `scripts/ottimizza-immagini.mjs` crea il `.webp` accanto all'originale (massimo 1600 px) più le varianti `public/_img/<nome>-w{640,800,1024,1200}.webp`, ignorate da git e rigenerate a ogni build.
- **`Picture.astro`**: emette `srcset`, `sizes` e `width`/`height`.
- **Arcotag**: le immagini (`arcotag-hero*`, `arcotag-azione`) vengono dalle foto reali del cliente in i2i «fedele» (autorizzato), poi ammorbidite per zona per ridurre il peso. Gli originali pre-compressione sono in `~/Documenti/personal-projects/softairmilano/immagini/originali-sito/`.
- **Paintball**: l'apertura (`paintball-hero*`) è AI d'atmosfera (`MEDIA-02`).

### Qualità misurata (30 set, build di produzione, Lighthouse mobile, mediana di 3)

| Pagina | Performance | Accessibility | Best Practices | LCP | CLS | TBT |
|---|---|---|---|---|---|---|
| Home | 98 | 100 | 100 | 2,25 s | 0 | 0 |
| Arcotag | 98 | 100 | 100 | 2,25 s | 0 | 0 |
| Paintball | 99 | 100 | 100 | 1,95 s | 0 | 0 |
| Softair | 99 | 100 | 100 | 1,88 s | 0 | 0 |
| Tiro dinamico | 97–99 | 100 | 100 | 1,88 s | 0 | 0–170 ms |
| Nerf | 98–99 | 100 | 100 | 2,03 s | 0 | 0–100 ms |

- Il SEO è 69 solo per il `noindex`.
- axe: 0 violazioni.
- Contrasto dell'apertura misurato su 13 viewport: testo piccolo ≥ 5,04:1.
- Verbali: `docs/audits/2026-09-30-arcotag-paintball.md` e `docs/audits/2026-09-30-softair-tiro-dinamico-nerf.md` (misurati prima delle correzioni). Bloccanti e maggiori chiusi; dopo le correzioni i contrasti rimisurati sono ≥ 5,13 («Provate anche») e ≥ 7,32 (dati chiave del Nerf). Restano aperti i punti elencati sotto.
- **Lighthouse sotto carico**: con load average alto (benchmarkIndex < 1000) il TBT sale a 300–1000 ms senza cambiare byte né script. Scartare quei run e rifarli a macchina ferma.

## In attesa del cliente

- **Le due pagine pilota**: /arcotag il cliente l'ha già definita «stupenda». Deve vedere /paintball e lo squeeze di «Provate anche» sul telefono vero.
- **Immagini social** `arcotag-og.jpg` e `paintball-og.jpg`: ritagli delle aperture approvate, da confermare (`MEDIA-04`).
- **Apertura arcotag desktop**: dopo la ricompressione è un filo più morbida al 100% su uno schermo grande. Tenere, oppure rifare con meno sfocatura sullo sfondo (~102 KB).
- **Copy da validare**:
  - H1 della home senza «softair/Milano»;
  - badge del menu («Il più richiesto» è un'affermazione);
  - sopratitolo «Il vostro sabato sera» nell'arcotag e nel softair, mentre i prezzi vendono anche i pomeriggi feriali (sul softair regge meglio: nel weekend i campi sono suoi);
  - badge «Per iniziare» sul paintball;
  - numeri tecnici del paintball (≤ 1 J per legge, 6–12 J, 17 mm, circa 15 volte), presi dagli articoli del sito attuale.
- **Lede dell'apertura**: ora è bianco invece che grigio, per il contrasto. Scelta di design da confermare.

## Dati dal cliente

- **Età minima arcotag**: 8 anni (pagina arcotag, menu, modulistica del sito attuale) oppure 10 (`home.json`, pill «Dai 10 anni»)?
- **Prezzo Recluta**: 35 € (pagina più recente del sito attuale) o 30 €?
- **Team building arcotag**: «fino a 20 persone», mentre il massimo dell'arcotag è 30 giocatori.
- **Recensioni**: voto **4,7**, numero **«500+»** (profilo Google, letto dall'utente il 30 set 2026). **Il numero lo aggiorna a mano il cliente dal CMS**: niente Places API né build programmate (decisione dell'utente). Il vecchio «347» veniva dal widget Trustindex del sito attuale e, secondo l'utente, appartiene a un'altra attività (Bosco della Luna).
  - **Niente import da Google**: l'export Takeout del profilo non è recuperabile (né dall'utente né dal cliente). Restano le 5 recensioni vere del sito attuale (agosto 2024, testo originale, refusi corretti, nome e iniziale del cognome); le nuove le aggiunge il cliente dal CMS.
  - `rating.url` è vuoto: serve dal cliente il link al profilo Google (la riga «500+ recensioni su Google» diventa un link appena c'è).
- **Turni, giorni e minimi** (dal cliente via l'utente, 30 set 2026, con una correzione successiva):
  - **arcotag e Nerf**: pomeriggio dalle 14 alle 18 (le 18 sono l'inizio dell'ultima partita), sera dalle 20, turni lun–ven e sab–dom; minimo pagato 8 persone lun–ven e 15 sab–dom (in 5 si pagano comunque 8 o 15 quote); prezzi confermati: pomeriggio lun–ven 15 €, sera lun–ven 20 €, sab–dom 25 € (20 € oltre i 20);
  - **softair**: come sul sito attuale. Tutti i giorni (vale `settings.openingHours`, «10–24»), si parte da 8 giocatori e sotto gli 8 «vi uniamo a un altro gruppo», nessun minimo pagato; Recluta del martedì = «martedì pomeriggio», senza orari. Stesse regole su /paintball;
  - **tiro dinamico**: lun–ven negli stessi turni (14–18, dalle 20); sab–dom **solo su richiesta** (i campi sono per il softair, decide chi gestisce i turni); nessun minimo pagato, 1–8 persone;
  - **massimo 30 giocatori** per softair, arcotag e Nerf.
- **Numeri di giocatori**: non esistono e non si possono avere. **Non pubblicare statistiche nazionali** (per esempio «decine di migliaia di giocatori»: fonte non affidabile).
- **Anzianità**: «attivi da oltre 10 anni» è confermato dall'utente.
- **Località nei testi** (decisione dell'utente, 30 set 2026): sopratitoli e presentazioni dicono «Milano», non «Settimo Milanese». L'indirizzo vero (Via Melegnano 26, 20019 Settimo Milanese) resta in `settings.json`, nella sezione Prenota, nelle FAQ «Dove si trova…» e nel JSON-LD: una «Via Melegnano» esiste anche a Milano, e l'indirizzo sbagliato porterebbe i clienti altrove.
- **Contenuti dell'arcotag**: nomi delle missioni, protezioni incluse.
- **Nerf** (dall'utente: dai 6 anni, il resto come l'arcotag, quindi anche la maschera protettiva inclusa, che si vede nella foto `att-nerf`): mancano i nomi di eventuali missioni.
- **Orari nella sezione Prenota**: `settings.openingHours` («tutti i giorni 10–24») è l'orario del softair e compare in ogni pagina; su arcotag, Nerf e tiro i turni stanno nella sezione prezzi. Da chiedere: a che ora parte l'ultima partita serale di arcotag, Nerf e tiro? Serve un orario per attività nella sezione Prenota?
- **Badge «Compleanni» del Nerf** sulla fascia Weekend (la più cara, minimo 15 quote): le feste si prenotano davvero lì?
- **Schede «Perfetto per» senza link**: Compleanni, Addii al celibato/nubilato e Team building (softair, arcotag, Nerf) sono schede di solo testo finché le loro pagine non esistono; quando nascono `/festa-di-compleanno`, `/addio-al-celibato-nubilato` e `/teambuilding`, rimettere gli `href` nei JSON delle attività.
- **Recensione di Carla R.** («i nostri figli…», agosto 2024): taggata solo arcotag, perché il Nerf sul sito compare dal 2026; non è chiaro se parli di arcotag o di softair.
- **Tiro dinamico**: in pagina 12+ (come il softair) e 1–8 persone (dal listino), decisi con l'utente; manca la **durata** di una sessione, che non compare finché il cliente non la dà.
  - Il prezzo (60 € per 1–2 persone, 20 € a testa da 3 a 8) vale per un percorso o per la sessione? Il vecchio sito dice «da 20 €» per ciascun percorso.
  - Dedotti e scritti in modo prudente, da confermare: si possono fare tutti i percorsi da soli (il Double Team è per due), c'è una spiegazione delle regole prima di partire.
- **Contatti e integrazioni**: WhatsApp, coordinate geografiche, orari strutturati per il JSON-LD, ID di TicketingHub e GA4, prezzi di corso, feste e team building.

## Cosa ha funzionato

- **Contenuti dal sito attuale**: WP REST API (`/wp-json/wp/v2/pages|posts?per_page=100`) più sitemap. L'inventario completo era nello scratchpad della sessione. I dati chiave sono già nei JSON.
- **Specialisti in parallelo** su file diversi:
  - build serializzate con `flock <scratchpad>/build.lock npm run build`;
  - ogni agente usa **il suo contesto** Playwright (`page.context().browser().newContext()` in `browser_run_code_unsafe`), mai la pagina condivisa;
  - un solo server di anteprima: `astro preview` sulla 4322.
- **Gemini, dettagli che funzionano** (`asset-specialist`):
  - i2i «fedele» dalle foto reali;
  - estensione dell'inquadratura riempiendo il bordo aggiunto (zoom-out) per far entrare i soggetti interi;
  - un ritocco mirato quando la rigenerazione non corregge un dettaglio (per esempio l'impugnatura del fucile);
  - sfocatura per zona per ridurre il peso senza toccare volti e maschere.
- **Numeri a rullo solo in CSS**: le cifre sono disegnate con contenuto generato (nel DOM resta il valore vero) e l'animazione parte con `fill-mode: both`, quindi niente JavaScript e nessun flash del valore finale.
- **FAQ esclusive**: `<details name="…">` nativo più una piccola riserva per i browser vecchi.
- **Tempi di caricamento**: ricompressione, `srcset` e precarico del font hanno portato l'LCP di /arcotag da 2,78 a 2,25 s; i fallback calibrati hanno portato il CLS a 0.

## Cosa NON ha funzionato / trappole

- **Node 20 fa fallire la build**: sempre `nvm use 22.23.2`.
- **La pane interna dell'app** congela le animazioni e non cattura sotto la piega: verificare con Playwright MCP.
- **Nei test di Playwright**:
  - si scrolla con `window.__lenis.scrollTo(y, {immediate:true})`;
  - la toolbar di Astro compare in fondo agli screenshot del dev server;
  - dopo un `reload` l'`evaluate` va rifatto;
  - i contesti desktop hanno una **barra di scorrimento di 15 px**: per il mobile usare `isMobile: true`, altrimenti «375» misura in realtà 360.
  - Il touch va simulato con `Input.dispatchTouchEvent` (inizio, movimento, fine). `Input.synthesizeScrollGesture` qui non scorre nulla.
- **Server di sviluppo** (`npm run dev`, avviato dall'utente sulla 4321): dopo modifiche agli stili `is:global` può servire **CSS vecchio**. Ricaricare con Ctrl+Shift+R, oppure riavviarlo. Astro 7 non permette un secondo dev server sullo stesso progetto.
- **Spostare file con l'IDE** (JetBrains) riscrive i percorsi nei markdown come relativi al file (`../../src/…`). Claude li legge dalla radice del repo: rimetterli relativi alla radice.
- **Script Python di modifica**: mai `open(p,'w').write(f(open(p).read()))`. Il file viene troncato prima di essere letto; è già successo con l'HANDOFF, recuperato dalla copia in stage.
- **Astro/JSX**: `{lista?.length && <X/>}` con una lista vuota stampa «0». Usare `!!lista?.length`.
- **Percorsi nei componenti**: nella build `import.meta.url` punta al modulo compilato, non a `src/`. Per i file in `public/` usare `join(process.cwd(), 'public', …)`.
- **Focus e clic**: il clic del mouse dà il focus al link *prima* dell'evento click. Nello squeeze il focus deve aprire la scheda solo se viene da tastiera (`:focus-visible`), altrimenti il primo clic naviga.
- **Lenis**: `overflow: hidden` sul `body` non lo ferma; servono `__lenis.stop()` e `start()`, più `data-lenis-prevent` sugli overlay che scorrono.
- **Sfocatura per ridurre il peso delle immagini AI**: una sfocatura uniforme serve poco, perché il peso sta nel dettaglio vero (rete, travi). Serve la sfocatura per zona.
- **Gemini** tende a sbagliare l'impugnatura dei fucili e a inventare scritte (marchi, lavagne): controllare sempre ingrandendo.
- **Restano valide le trappole storiche**:
  - radar a dimensione fissa in px;
  - mai la proprietà `rotate` insieme a `transform: translate`;
  - teletype con `setTimeout`;
  - `NODE_OPTIONS=--dns-result-order=ipv4first` e una generazione Gemini alla volta;
  - niente scroll-snap automatico nella scroll-story.

## File chiave

- `CLAUDE.md`: indice di canone, agenti e skill. `docs/standards/README.md`: non negoziabili e debito noto.
- `src/pages/[activity].astro`: modello delle pagine attività e logica delle sezioni vuote. `src/pages/paintball.astro`: la landing.
- `src/data/activities/arcotag.json`, `src/data/paintball.json`, `src/data/testimonials.json`, `src/data/navigation.json` (con `children` e `cta`), `src/data/settings.json` (contatti, `postalAddress`, `footerRanger`, `openingHours`, `directions`).
- `.pages.yml`:
  - collezione «Attività» con `filename: { template: "{primary}.json", field: create }`;
  - pagina «Softair VS Paintball»;
  - «Recensioni»;
  - campi obbligatori e note «Se vuoto, la sezione non compare».
- `src/layouts/BaseLayout.astro`: head, OG, JSON-LD, precarico del font.
- `src/components/organisms/ActivityLinks.astro` (squeeze), `PageHero.astro` (contrasto e varianti per orientamento), `Header.astro` (tendina e menu mobile modale).
- `scripts/ottimizza-immagini.mjs` e `src/components/atoms/Picture.astro`: immagini responsive.
- `docs/audits/2026-09-30-arcotag-paintball.md`: il verbale dell'audit.

## Ambiente & comandi

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 22.23.2   # obbligatorio
npm run build                     # immagini (WebP + varianti in public/_img) poi astro build → dist/
npx astro preview --port 4322     # anteprima della build (usata da audit e Lighthouse)
npx lighthouse http://127.0.0.1:4322/arcotag --form-factor=mobile --chrome-flags="--headless=new"
NODE_OPTIONS=--dns-result-order=ipv4first node scripts/genera-immagine.mjs --name x --ratio 16:9 --scene "..."
```

- La API key di Gemini è in `.env` (`GOOGLE_AI_STUDIO_SOFTAIRMILANO_PROJECT`), con billing attivo.
- Le foto reali del cliente sono in `~/Documenti/personal-projects/softairmilano/immagini/`.

## Prossimi passi

1. **Commit e push** dopo l'ok dell'utente di tutto il lavoro dal commit `d9210e2` in poi: recensioni per pagina e voto unico, pagine Softair, Tiro dinamico e Nerf, correzioni dell'audit, immagini approvate (aperture, OG, «Come si gioca» di tiro e Nerf, `nerf-hero-mobile` rifatta, `att-nerf-mobile` ricompressa). I master pre-compressione sono in `~/Documenti/personal-projects/softairmilano/immagini/originali-sito/`.
   - Nota `MEDIA-03`: `att-nerf` e quindi `nerf-hero` sono un i2i di `arena.jpg` (capannone vero, giocatori AI); `nerf-come-si-gioca` e `tiro-dinamico-come-si-gioca` sono AI da testo, con un capannone generico.
2. **Manuale cliente** (`CMS-12–14`, non esiste ancora). Sezioni da scrivere:
   - Impostazioni: orari, come arrivare, indirizzo per Google, footer Ranger, WhatsApp;
   - Home → Apertura: l'interruttore «Mostra il voto Google sotto i bottoni», con il rimando a «Recensioni»;
   - Attività → Apertura: il campo «Dove sta il soggetto della foto» (`hero.focus`): «A destra» se la foto lascia libera la sinistra per il titolo, vuoto = «Al centro». Non ha effetto dove c'è una firma nell'apertura (la freccia dell'arcotag);
   - Attività → Per chi è: una scheda è cliccabile solo se ha un link (una pagina che esiste o `#prenota`); con tre occasioni quella «In evidenza» diventa la scheda grande;
   - Menu: sottomenu, badge, descrizione solo desktop, lunghezza massima delle etichette, bottone Prenota e `#prenota`;
   - Recensioni: solo vere, niente date; voto e numero «500+» a mano, in un punto solo (home e pagine); il campo «Pagine in cui compare» (prima le recensioni della pagina, poi «Tutte le pagine», al massimo 5); l'interruttore «Mostra il voto Google sotto i bottoni» nell'hero della home; se si accorcia una recensione, il taglio si segna con […]. Le scelte del campo pagine sono fisse in `.pages.yml`: una nuova attività creata dal cliente usa le recensioni generali finché un tecnico non aggiunge la sua voce;
   - Attività: come si crea una pagina, nomi riservati, rinomina, ogni sezione campo per campo, rapporti delle immagini, badge dei prezzi, FAQ esclusive;
   - Attività → Missioni / Percorsi: compare dopo «Come si gioca»; «Numera le voci» solo se l'ordine conta; cifre facoltative (servono valore ed etichetta); titolo vuoto = sezione nascosta; le missioni del softair sono ripetute in «Softair VS Paintball → Cosa trovi da noi»;
   - Softair VS Paintball, compreso il «Bottone verso la pagina del softair» in «Cosa trovi da noi»;
   - riquadro «Dati ripetuti: dove cambiarli tutti»: il minimo pagato 8/15 (arcotag e Nerf, nota prezzi e FAQ), «30 giocatori» (dati chiave, SEO, serata, FAQ, «Perfetto per»), i turni (testo dei prezzi e FAQ del tiro), telefono ed email nelle FAQ «Come si prenota», indirizzo nelle FAQ «Dove…», le somme dei bersagli nella FAQ del tiro; il listino del softair (sezione prezzi, FAQ «Quanto costa», prezzi di /paintball), i prezzi di Nerf e tiro nelle loro FAQ, «si parte da 8 / vi uniamo» (note, FAQ del softair, primo passo di /paintball), «1 ora e 45» (softair e /paintball), la Tessera Élite (softair e /paintball), le età citate nelle FAQ di /paintball e nelle pill della home;
   - nelle sezioni Recensioni di attività e paintball si cambia solo il titolo: quali recensioni compaiono si sceglie con «Pagine in cui compare»;
   - nota per il tecnico: ogni nuova attività va aggiunta tra i valori del campo `pages` di `.pages.yml`;
   - Immagini: WebP e varianti automatiche, testo alternativo.
3. **Home**:
   - leggere le attività dalla collezione invece di duplicarle in `home.json`;
   - rifare Occasioni, Ranger e CTA finale;
   - togliere i marcatori «(DA COMPLETARE)»;
   - il titolo «Le attività» è scritto in `src/pages/index.astro` e va spostato nel CMS (`CMS-01`).
4. **Cookie consent** (vanilla-cookieconsent) per GA4 e TicketingHub, poi il widget TicketingHub nelle sezioni `#prenota`.
5. **Altre pagine**:
   - L'arena, Corso (prioritaria), Gruppi & eventi, compleanni, addii al celibato/nubilato, contatti;
   - legali (servono prima l'opzione `noindex` per pagina in `BaseLayout` e `termini` nel filtro della sitemap);
   - 404;
   - landing SEO «cosa fare a Milano con gli amici».
6. **Seguiti tecnici**:
   - una sola forma degli URL (`trailingSlash` in `astro.config.mjs` e link interni);
   - i `.webp` accanto agli originali sono in git: su un clone nuovo la verifica per data potrebbe non rigenerarli se il cliente sostituisce una foto con lo stesso nome (valutare di toglierli da git o di controllare l'hash);
   - intestazioni del footer («Menu», «Contatti») e link legali ancora nel codice;
   - il campo «Dove sta il soggetto della foto» (`hero.focus`) c'è solo nelle attività: estenderlo al paintball se la sua apertura cambia;
   - `hero-opt2-breach`, `hero-opt3-run`, `hero-opt4-prone` e le loro `-mobile` in `public/uploads` non sono più usati (l'apertura del softair è la nuova `softair-hero`): da cancellare dopo la conferma del cliente, anche dagli originali in `~/Documenti/…/originali-sito/`;
   - stato premuto nell'atomo `Button`;
   - `pad` (numeri a due cifre, 01, 02…) è copiato in `StepTimeline`, `ActivitiesStory` e `ModeGrid`: al terzo uso va in `src/lib/` (`CODE-03`, `CODE-04`);
   - una sottile riga verticale sul bordo destro di `logo-white-120.webp` nel footer, da verificare;
   - nota di ImpactScale visibile anche quando le sfere non sono disegnate;
   - le sei missioni stanno sia in `softair.json` (`modes`) sia in `paintball.json` (`arena.missions`): far leggere al paintball quelle del softair (tocca `paintball.astro` e `.pages.yml`, migrazione `CMS-09`);
   - la FAQ «Come si prenota» ripete telefono ed email in ogni pagina: se cambiano in `settings.json`, vanno corrette anche lì.
   - il CSS di `ModeGrid` è inline anche su arcotag e Nerf, che non lo usano (0,7 KB gzip): l'`<head>` è già oltre la prima finestra TCP;
   - gli h3 del footer («Menu», «Contatti», «Anche all'aperto») stanno sotto l'h2 della CTA finale: meglio h2;
   - testo a 0,99rem in `ModeGrid`, `StepTimeline` e `AudienceGrid` (`DES-06` chiede 16 px): portarli a 1rem tutti insieme;
   - al go-live: 301 da `www.softairmilano.it` al dominio nudo (regola Cloudflare, non `_redirects`) e mappatura di `/partite-di-softair-teambulding/` e `/softair-milano-cose/` (fase 3 di `docs/cutover-checklist.md`).

## Da chiudere prima del go-live

- Immagine social della home ancora in SVG, da rasterizzare in 1200×630.
- JSON-LD con `geo` e orari strutturati (`openingHoursSpecification`), con i dati del cliente.
- Chiave IndexNow in `public/`; un solo interruttore per `robots.txt` e `noindex` (oggi `public/robots.txt` è statico).
- Bottone pausa sul video della home (WCAG 2.2.2).
- Bordo `--color-border` sotto 3:1 (WCAG 1.4.11): più contrasto o un secondo segnale.
- Marcatori «(DA COMPLETARE)» in `index.astro`.
- Ogni link interno deve puntare a una pagina esistente (oggi /l-arena, /corso-softair, /teambuilding, /contatti, le occasioni e le legali danno 404).
- Video R2 da `r2.dev` a un dominio proprio.
- Rich Results Test di Google; Search Console e Bing Webmaster (`docs/geo-e-indicizzazione.md`).

## Decisioni aperte

- **Firma nell'apertura di softair e tiro dinamico** (proposta dell'audit di design): un'etichetta HUD di missione per il softair, un cronometro per il tiro, entrambi statici con reduced motion.
- **«Provate anche» con un ordine per pagina** (per esempio sul Nerf prima l'arcotag, dagli 8 anni): oggi l'ordine è quello di Home › Attività; servirebbe un campo CMS.
- **H1 della home**: keyword «softair Milano» o l'attuale «Diventa protagonista di un film d'azione»? Decide il cliente.
- **Accento ciano sulle foto con luce ambra**: tenere, oppure rigenerare le foto con luce neutra.
- **Vecchie immagini del tiro dinamico** (`att-tiro-dinamico.jpeg`, `-2`): da eliminare quando il cliente conferma la versione «casetta».
