# HANDOFF — softairmilano.it

Aggiornato: **2 ott 2026, ore 15:00**.

Cosa c'è di nuovo:
- commit `8516850` (online): fasce alternate, Missioni ridisegnate, `PhotoFrame`, `HudFrame` su tutte le aperture;
- **pagina /corso-softair** del 2 ott (questo commit): costruita con `/ship` e chiusa con `/audit` (`docs/audits/2026-10-02-corso.md`, nessun bloccante, maggiori e minori corretti). **L'immagine di apertura è provvisoria** (`scena-softair.jpeg`): quella vera aspetta la ricarica del credito Gemini (vedi «Prossimi passi»);
- commit `5bc74a3` «Prenota uguale su tutte le pagine» del 2 ott: la sezione finale «Sei pronto a scendere in campo?» (`FinalCta`) chiude ora anche le pagine attività e /paintball al posto di `BookingCta` (cancellato). Il testo sta in un posto solo, `settings.json` → `finalCta`, compresa la lista delle parole della fascia inclinata;
- commit `915029c` «Home finita» del 2 ott: la home rifatta da capo su richiesta dell'utente, più la voce «Home» nel menu. L'audit `docs/audits/2026-10-02-home.md` è chiuso: corretti bloccanti e maggiori, le revisioni di codice e CMS sono state fatte da un'istanza diversa e applicate. Dopo il push l'utente controlla la home dal telefono vero.

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

- **Repo**: `Matt0472/softairmilano` (pubblico), branch `main`. L'ultimo commit pushato è quello della home (2 ott 2026).
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

### Home (`src/pages/index.astro` + `src/data/home.json`)

Ogni sezione di contenuto sta su `.band`. Le tre sezioni guidate dallo scroll (video, attività, CTA finale) non sono mai una accanto all'altra.

1. **Hero**: invariato nell'impianto, con `HudFrame`, il voto Google e il sottotitolo accorciato. «Scopri l'arena» porta a `#arena` finché /l-arena non esiste.
2. **`ActionVideo` «Dentro l'azione»**: il video parte come una pillola e si allarga mentre la sezione è bloccata allo scroll. A video aperto compaiono «REC · CAM 01», gli angoli, i pulsanti pausa e audio (icone SVG) e, in basso a sinistra, il **chip YouTube** (link a `settings.social.youtube`, testo da `video.youtubeLabel` o dall'@ dell'indirizzo).
   - Sui riquadri stretti i due pulsanti si impilano, così il chip si legge per intero fino a 320 px.
   - **Autoplay sempre** (decisione dell'utente, 2 ott): parte appena è a schermo, anche con reduced motion e mentre è ancora una pillola; a mano si accende solo l'audio. Eccezione scritta in `A11Y-07` e nel debito noto.
   - L'audio è solo musica (confermato dall'utente il 2 ott): niente sottotitoli (WCAG 1.2.2 non si applica).
   - Video su R2: `dentro-l-azione.mp4` (1920×756, 38,6 s) e `dentro-l-azione-mobile.mp4` (604×756, 4:5, per i telefoni in verticale). I master sono in `~/Documenti/personal-projects/softairmilano/video/`. Il vecchio `softairmilano-home.mp4` su R2 non serve più: lo può togliere l'utente.
3. **`ArenaIntro`**: «1.500 m²» grande con i numeri a rullo (atomo `Odometer`), 4 caratteristiche con emblema tra le staffe (campo `arena.features.icon`), radar.
4. **`ActivitiesStory`**: la storia a scorrimento, ora con sonde `IntersectionObserver` invece di un listener di scroll; «Scopri X» è un bottone secondario con testo dal CMS (`activities[].label`); sotto i 560 px di altezza non si blocca.
5. **`TeaserBanner` paintball** subito dopo le attività (obiettivo 3).
6. **`Reviews`** con `page="home"` (nel campo «Pagine in cui compare» c'è la voce «Home»).
7. **`OccasionMosaic`**: una scheda grande e tre piccole. **Le foto sono segnaposto** (foto delle attività): «Ne parliamo dopo», decisione dell'utente.
8. **`CourseTeaser`**: breve introduzione al corso con dati chiave e «Scopri il corso» verso `/corso-softair`.
9. **`SocialChannels`**: tessere a X con il mirino al centro e Instagram, Facebook, YouTube, TikTok (loghi monocromi, ciano al passaggio).
10. **`RangerTeaser`**: tutta la sezione è un solo link a `settings.rangerUrl` (nuova scheda), senza bottoni; sfondo AI «Al riparo» (`ranger-bosco*`), palette Ranger con misura (`DES-12`, token `--color-ranger-*`).
11. **`FinalCta`** `#prenota`: sipario allo scroll, titolo con animazione d'ingresso, fascia diagonale di parole più in basso, azioni vere (chiama, scrivi, WhatsApp se compilato, orari, indirizzo, come arrivare). È la stessa su tutte le pagine (vedi sotto).

### Menu (`Header.astro`, `src/data/navigation.json`)

- **Desktop**: voce «Attività ▾», una tendina con Softair (badge «Il più richiesto»), Arcotag («Da provare»), Tiro dinamico e Nerf, ciascuno con una descrizione di una riga.
  - Si apre al clic e al passaggio del mouse, si chiude con Esc (anche con il focus fuori), si naviga con le frecce.
  - Solo la pagina corrente è in ciano.
- **Mobile**: menu a tutto schermo con un gruppo 2×2. È modale: tutti i figli di `body` diventano `inert` e Lenis si ferma.
- **Voci**: «Home» è la prima (richiesta dell'utente, 2 ott: si vede sempre dove si è), poi L'arena, Attività ▾, Corso, Gruppi & eventi, Softair VS Paintball, Contatti. Alte 44 px e su una riga fino a 1024 (verificato con «Home»).
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
  11. FinalCta `#prenota`, la stessa della home (testo da `settings.finalCta`).
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
  11. Prenota (FinalCta, come in home).
- **Tono**: confronto onesto e rispettoso. Viking Paintball Como è del cliente ma **non va nominato** (sua decisione).

### Pagina `/corso-softair` (`src/pages/corso-softair.astro` + `src/data/corso.json`)

- **Stesso indirizzo del sito attuale**, quindi niente redirect. I contenuti vengono da https://www.softairmilano.it/corso-softair/, riscritti senza aggiungere fatti (`CMS-10`) e senza le date passate (le prove del 9–30 settembre).
- **Sezioni:**
  1. apertura con il chip dello stato iscrizioni (`StatusChip`) e i dati: «Gratis» il primo allenamento, 21:00, 16+, 2 arene;
  2. In breve;
  3. «La prova gratuita» (`trial`, `SplitFeature`): **nascosta finché non ha la foto**;
  4. «Cosa trovi nel corso» (`ModeGrid`, 4 schede con le icone `map`, `shieldUser`, `trophy`, `tag`);
  5. calendario 2026–2027 (`StepTimeline` `#calendario`, con lo stesso chip sotto le tappe);
  6. recensioni generali (`Reviews page="corso"`; nel campo «Pagine in cui compare» c'è la voce «Corso»);
  7. FAQ;
  8. `FinalCta`.
- **Interruttore iscrizioni** (`enrollment.open` con `openText` e `closedText`), decisione dell'utente. Oggi è acceso, «aperte per la prima parte: si parte il 7 ottobre»; da spento dice che si riaprono per la seconda parte, dal 3 marzo. Ogni volta che lo si sposta vanno riscritti anche i testi: lo dice la descrizione del campo.
- **«Primo allenamento gratuito»** vale sempre (decisione dell'utente).
- **Niente prezzo**: il sito attuale non lo dà. Va chiesto al cliente, poi le FAQ «Quanto costa?» e «Come mi iscrivo?».
- **Niente form di contatto**: si prenota con la sezione finale comune (telefono, email).
- **Dati strutturati:** JSON-LD `Course` (name, description, url, provider = `/#business`), senza `hasCourseInstance` (Google ha chiuso i risultati arricchiti «Course info» nel 2025).

### Componenti nuovi (futuri blocchi CMS)

- **Organismi**: `PageHero`, `AnswerBlock`, `StepTimeline`, `SplitFeature`, `AudienceGrid`, `PriceTiers`, `Reviews`, `FaqAccordion`, `ActivityLinks`, `BookingCta`, `VsComparison`, `ImpactScale`, `TeaserBanner`; `FinalCta` in fondo a ogni pagina; per la home `ActionVideo`, `OccasionMosaic`, `CourseTeaser`, `SocialChannels`, `RangerTeaser`, `FinalCta`. Cancellati `VideoSection`, `molecules/Card` e `BookingCta`.
- **Molecole**: `Breadcrumb`, `FactStrip`, `IncludedList`, `LeadText`, `Reveal`, `SectionHead`, `Trajectory`.
- **Atomi**: `Icon`, `Picture`, `Badge`, `Odometer` (numeri a rullo, usato da `FactStrip` e `ArenaIntro`).
- **`StatusChip`** (molecola): una riga di stato su un chip scuro proprio, con il punto fermo, ciano «on» e grigio «off». La usano l'apertura (`PageHero`, prop `notice`) e il calendario del corso.
- **Molecole condivise nuove**: `StarMeter` (stelle a frazione esatta), `PhotoFrame` (cornice sottile interna di ogni foto), `HudFrame` (angoli, riga che scorre e scritta tattica delle aperture).
- **Ritmo delle sezioni**: ogni sezione di contenuto ha `.band`; le fasce si alternano da sole (`:nth-child(even of .band)` in `<main>`). Dentro una fascia le superfici si ricavano da `--plane`/`--lift`/`--lift-2`, mai da un colore fisso, altrimenti la parità si rompe quando il cliente svuota una sezione.
- **Primitiva `.corners`** in `global.css`: i quattro angoli a L dell'HUD in un solo strato (mirino degli emblemi, targa delle missioni, video); il componente ne decide `--arm`, colore e posizione.
- **Helper condivisi** in `src/lib/`: `phone.ts` (`toE164`, `telHref`, `waHref`), `fields.ts` (`has()`: un campo CMS è pieno solo se ha testo vero, perché Pages CMS salva i campi svuotati come `""`), `typography.ts` (`keepShortWords`: lega le parole di 1–2 lettere alla successiva nei titoli grandi), `jsonld.ts` (`toLd`, `breadcrumbLd`, `faqLd`), `nav.ts`, `reviews.ts` (voto unico e `reviewsFor(page)`).
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
| Home (audit del 2 ott, home nuova, prima delle correzioni) | 98 | 100 | 100 | 2,25 s | 0 | 0 |
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

- **Età minima arcotag**: **8 anni** (confermato dall'utente il 7 ott 2026; aggiornata anche la pill della home).
- **Correzioni del 7 ott 2026** (dall'utente):
  - **durata:** arcotag e Nerf durano come il softair, 1 ora e 45 tra briefing e gioco;
  - **regole:** **non scrivere mai «chi viene colpito esce/è eliminato»**: ogni partita ha le sue regole (si esce subito, si hanno più vite, si rientra all'infinito), quindi non si specifica;
  - **fotografo:** non c'è più, tolto ovunque;
  - **moduli:** sono **obbligatori per tutti**; i maggiorenni li compilano online, i minorenni portano il modulo cartaceo firmato da un genitore;
  - **pomeriggio** di arcotag e Nerf **dalle 14 alle 20**: l'ultima partita parte alle 18, alle 20 si esce;
  - **saletta per le feste** (softair, arcotag e Nerf; raccontata solo nella pagina /occasioni, tolta da arcotag e Nerf). Regole corrette dall'utente il 7 ott sera, che sostituiscono le precedenti:
    - le sale sono due, interna ed esterna;
    - lun–ven: la saletta è compresa nell'1 h 45 (chi gioca decide come dividere il tempo tra gioco e saletta), oppure si prolunga di 1 ora a 70 € (sala interna) o 50 € (sala esterna);
    - sab–dom: solo la sala esterna, compresa nell'1 h 45, riducendo il tempo di gioco.
- **Prezzo Recluta**: 35 € (pagina più recente del sito attuale) o 30 €?
- **Team building arcotag**: «fino a 20 persone», mentre il massimo dell'arcotag è 30 giocatori.
- **Recensioni**: voto **4,7**, numero **«500+»** (profilo Google, letto dall'utente il 30 set 2026). **Il numero lo aggiorna a mano il cliente dal CMS**: niente Places API né build programmate (decisione dell'utente). Il vecchio «347» veniva dal widget Trustindex del sito attuale e, secondo l'utente, appartiene a un'altra attività (Bosco della Luna).
  - **Niente import da Google**: l'export Takeout del profilo non è recuperabile (né dall'utente né dal cliente). Restano le 5 recensioni vere del sito attuale (agosto 2024, testo originale, refusi corretti, nome e iniziale del cognome); le nuove le aggiunge il cliente dal CMS.
  - `rating.url` è vuoto: serve dal cliente il link al profilo Google (la riga «500+ recensioni su Google» diventa un link appena c'è).
- **Turni, giorni e minimi** (dal cliente via l'utente, 30 set 2026, con una correzione successiva):
  - **arcotag e Nerf**: pomeriggio dalle 14 alle 20 (l'ultima partita parte alle 18, alle 20 si esce; aggiornato il 7 ott), sera dalle 20, turni lun–ven e sab–dom; minimo pagato 8 persone lun–ven e 15 sab–dom (in 5 si pagano comunque 8 o 15 quote); prezzi confermati: pomeriggio lun–ven 15 €, sera lun–ven 20 €, sab–dom 25 € (20 € oltre i 20);
  - **softair**: come sul sito attuale. Tutti i giorni (vale `settings.openingHours`, «14–24» dal 7 ott 2026), si parte da 8 giocatori e sotto gli 8 «vi uniamo a un altro gruppo», nessun minimo pagato; Recluta del martedì = «martedì pomeriggio», senza orari. Stesse regole su /paintball;
  - **tiro dinamico**: lun–ven **dalle 14 a mezzanotte** (aggiornato il 7 ott 2026); sab–dom **solo su richiesta** (i campi sono per il softair, decide chi gestisce i turni); nessun minimo pagato, 1–8 persone;
  - **massimo 30 giocatori** per softair, arcotag e Nerf.
- **Numeri di giocatori**: non esistono e non si possono avere. **Non pubblicare statistiche nazionali** (per esempio «decine di migliaia di giocatori»: fonte non affidabile).
- **Anzianità**: «attivi da oltre 10 anni» è confermato dall'utente.
- **Località nei testi** (decisione dell'utente, 30 set 2026): sopratitoli e presentazioni dicono «Milano», non «Settimo Milanese». L'indirizzo vero (Via Melegnano 26, 20019 Settimo Milanese) resta in `settings.json`, nella sezione Prenota, nelle FAQ «Dove si trova…» e nel JSON-LD: una «Via Melegnano» esiste anche a Milano, e l'indirizzo sbagliato porterebbe i clienti altrove.
- **Contenuti dell'arcotag**: nomi delle missioni, protezioni incluse.
- **Nerf** (dall'utente: dai 6 anni, il resto come l'arcotag, quindi anche la maschera protettiva inclusa, che si vede nella foto `att-nerf`): mancano i nomi di eventuali missioni.
- **Orari nella sezione Prenota**: `settings.openingHours` («tutti i giorni 14–24») è l'orario del softair e compare in ogni pagina; su arcotag, Nerf e tiro i turni stanno nella sezione prezzi. Da chiedere: a che ora parte l'ultima partita serale di arcotag, Nerf e tiro? Serve un orario per attività nella sezione Prenota?
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

- **`<path>` SVG senza `fill: none`** si riempie di nero: durante una modifica degli angoli dell'HUD l'apertura di tutte le pagine si è coperta di un triangolo nero. Ogni `path` decorativo va stilato insieme al markup.
- **`.band` sta in `@layer components`**, gli stili degli organismi sono `is:global` fuori layer: un `background` o un `border` sulla radice di una sezione con `.band` vince sempre sull'alternanza. Le superfici interne vanno ricavate da `--plane`/`--lift`/`--lift-2`.
- **Animazioni guidate dallo scroll solo con le proprietà estese** (`CODE-19`): con la scorciatoia `animation` il minifier la fonde con la timeline e Chrome la scarta, quindi in sviluppo funziona e nella build sparisce. Dopo ogni modifica controllare `dist/`.
- **Test «mobile» con estensioni di Chrome** (es. Mobile View): non emulano il touch né il viewport vero, e la storia delle attività può sembrare ferma. Si verifica con Playwright a 390×844 o sul telefono.
- **Sostituzioni automatiche nei CSS**: un `replace` di `44px` → `var(--btn)` ha riscritto anche la dichiarazione `--btn: 44px`, rendendola circolare. Escludere la riga che definisce la variabile.
- **Misurare le aperture almeno 2 s dopo il caricamento**: l'animazione d'ingresso tiene il testo 26 px più in basso, e falsa le distanze dagli angoli.

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

Piano dell'utente (2 ott 2026): la home è finita; **ora le pagine mancanti, con il Corso per primo, poi la rifinitura di tutte le pagine quando saranno tutte complete.**

1. **Immagini del corso, appena l'utente ricarica il credito Gemini** (https://ai.studio/projects; il 2 ott l'API rispondeva HTTP 402 «prepayment credits are depleted»):
   - **apertura**, soggetto scelto dall'utente: principianti in cerchio nell'arena, il coach al centro che spiega su una lavagna;
     - scena salvata in `scripts/genera-immagine.mjs` come `corso-hero`;
     - comando: `NODE_OPTIONS=--dns-result-order=ipv4first node scripts/genera-immagine.mjs --name corso-hero --ratio 16:9 --size 2K`;
     - poi la versione 9:16 ricomposta (`--from public/uploads/corso-hero.jpeg --ratio 9:16`), con coach e lavagna al centro in alto;
     - va controllata ingrandita: mani, impugnature, lavagna senza scritte;
     - va mostrata all'utente prima di collegarla (`MEDIA-04`);
     - poi in `corso.json` → `hero.image` e `hero.imageMobile`, con un alt nuovo;
   - **foto 4:5 della prova gratuita** (`trial.image`): la sezione compare da sola appena c'è; meglio una foto vera dal cliente;
   - **budget** (performance): 16:9 a 1600 px fino a 90 KB, 9:16 fino a 80 KB, w800 fino a 50 KB, nessun preload.
2. **Riscontro dell'utente sul telefono vero** dopo il push della home: in particolare la storia delle attività (con l'estensione Mobile View di Chrome sembrava ferma; con Playwright a 390×844, anche con il touch, avanza 0→1→2→3) e l'autoplay del video.
3. **Pagine mancanti**, sul sistema attuale (`PageHero` con HUD, fasce, `PhotoFrame`, `/ship` e `/audit` a pagina finita):
   - L'arena, Gruppi & eventi, compleanni, addii al celibato/nubilato, team building, contatti;
   - legali (servono prima l'opzione `noindex` per pagina in `BaseLayout` e `termini` nel filtro della sitemap);
   - 404;
   - landing SEO «cosa fare a Milano con gli amici»;
   - quando nascono le pagine delle occasioni, rimettere gli `href` nelle schede «Perfetto per» delle attività e in `home.json` → `occasions.items[].href`; quando nasce /l-arena, `hero.ctaSecondary.href` e `arena.cta`.
4. **Home, passi rimasti**:
   - leggere le attività dalla collezione invece di duplicarle in `home.json` (commit a parte, migrazione `CMS-09`/`GIT-07`);
   - foto vere delle occasioni (oggi segnaposto): foto di gruppi dal cliente, oppure AI dopo la ricarica del credito Gemini (HTTP 402 il 2 ott);
   - apertura su telefono in orizzontale (667×375): «Prenota» finisce 1 px sotto la piega; serve un layout orizzontale dedicato come quello di `PageHero`.
5. **Rifinitura di tutte le pagine**, a sito completo: un giro di `/audit` per pagina e la coerenza fra le pagine (ritmo, immagini, testi, dati ripetuti).
6. **Manuale cliente** (`CMS-12–14`, non esiste ancora). Sezioni da scrivere:
   - Impostazioni: orari, come arrivare, indirizzo per Google, footer Ranger, WhatsApp;
   - Home → Apertura: l'interruttore «Mostra il voto Google sotto i bottoni», con il rimando a «Recensioni»; immagine verticale 9:16 per i telefoni; i bottoni vogliono testo e link; le ancore `#prenota` e `#arena`;
   - Home → SEO e anteprima social: titolo, descrizione, immagine e testo alternativo, con i valori usati quando sono vuoti;
   - Home → Dentro l'azione: titolo, testo, i due video R2 (orizzontale 2,5:1 e verticale 4:5), i due poster, la descrizione del video, il testo del pulsante YouTube (il link sta in Impostazioni → Social; un testo più lungo dell'@ attuale si taglia con «…»); il video parte da solo senza audio; senza il video per computer la sezione sparisce;
   - Home → L'arena: la cifra (valore, unità, etichetta), il significato di ogni emblema, il link che resta vuoto finché la pagina non esiste; la cifra «1.500 m²» compare anche nella CTA finale;
   - Home → Attività: titolo della sezione, introduzione, testo e link del bottone di ogni attività; un'attività senza titolo o foto non compare;
   - Home → Rimando al paintball: i tre campi vanno compilati insieme;
   - Home → Recensioni: solo il titolo; quali recensioni compaiono si sceglie con «Pagine in cui compare» → «Home»;
   - Home → Occasioni: titolo, testo, bottone, da 2 a 4 schede, quella «In evidenza» è la grande (l'unica con l'immagine per telefono), link solo verso pagine che esistono;
   - Home → Il corso: sopratitolo, titolo, testo, da 2 a 4 dati, bottone, immagine;
   - Home → Social: titolo e testo; i link ai profili stanno in Impostazioni; senza nessun link la sezione sparisce;
   - Home → Ranger: sopratitolo (perché nomina l'altra arena), titolo, testo, immagini; link e dominio mostrato vengono da «Link arena outdoor»;
   - Impostazioni → «Prenota (fondo di ogni pagina)»: titolo, sottotitolo, testo del bottone «Scrivi», parole della fascia inclinata (le attività e «1.500 m²»: vanno aggiornate a mano se cambiano); è la stessa sezione in fondo a home, attività e /paintball; contatti, orari, indirizzo e «Come arrivare» sono i campi di Impostazioni; la scritta gigante è il «Nome sito»;
   - Corso softair:
     - sopratitolo da cambiare a ogni stagione;
     - apertura con immagine verticale e `focus`, bottoni `#prenota` e `#calendario`;
     - Dati chiave: da 2 a 4, il primo è il più importante;
     - **Iscrizioni, il giro dell'anno**: acceso con il testo della prima parte fino al 7 ottobre, spento dopo; riacceso con il testo della seconda parte prima del 3 marzo; spento dal 3 marzo con «riaprono a ottobre». Compare nell'apertura e sotto il calendario;
     - In breve: è anche la descrizione del corso per Google;
     - La prova gratuita compare solo con la foto;
     - Cosa trovi nel corso: da 3 a 6 voci, il significato delle icone, icona per tutte o per nessuna;
     - Calendario: togliere le date passate e aggiornare l'anno;
     - Recensioni: la voce «Corso» in «Pagine in cui compare»;
     - FAQ;
     - non toccare l'indirizzo della pagina, le ancore e la sezione Prenota (sta in Impostazioni);
   - Menu: la voce «Home» (`/`) è la prima;
   - Home, Attività e Softair VS Paintball → Apertura → «Scritta tattica sulla foto (HUD)» (`hudTag`): in basso a destra in home, in alto a destra nelle pagine interne, non sotto i 641 px di larghezza (telefoni in verticale); in maiuscolo da sola, massimo 32 caratteri, solo dati già scritti nella pagina; vuota = sparisce (cornice e riga che scorre restano: sono struttura);
   - Attività → Apertura: il campo «Dove sta il soggetto della foto» (`hero.focus`): «A destra» se la foto lascia libera la sinistra per il titolo, vuoto = «Al centro». Non ha effetto dove c'è una firma nell'apertura (la freccia dell'arcotag);
   - Attività → Per chi è: una scheda è cliccabile solo se ha un link (una pagina che esiste o `#prenota`); con tre occasioni quella «In evidenza» diventa la scheda grande;
   - Menu: sottomenu, badge, descrizione solo desktop, lunghezza massima delle etichette, bottone Prenota e `#prenota`;
   - Recensioni: solo vere, niente date; voto e numero «500+» a mano, in un punto solo (home e pagine); il campo «Pagine in cui compare» (prima le recensioni della pagina, poi «Tutte le pagine», al massimo 5); l'interruttore «Mostra il voto Google sotto i bottoni» nell'hero della home; se si accorcia una recensione, il taglio si segna con […]. Le scelte del campo pagine sono fisse in `.pages.yml`: una nuova attività creata dal cliente usa le recensioni generali finché un tecnico non aggiunge la sua voce;
   - Attività: come si crea una pagina, nomi riservati, rinomina, ogni sezione campo per campo, rapporti delle immagini, badge dei prezzi, FAQ esclusive;
   - Attività → Missioni / Percorsi → «Icona»: il significato di ogni simbolo; un'icona per tutte le voci o per nessuna; vuota = nessun simbolo; il tiro dinamico usa i numeri. Nota per il tecnico: un simbolo nuovo va aggiunto in `ICONS` di `Icon.astro`, in `EMBLEMS` di `ModeGrid.astro` e nei `values` di `.pages.yml`;
   - Attività → Missioni / Percorsi: compare dopo «Come si gioca»; «Numera le voci» solo se l'ordine conta; cifre facoltative (servono valore ed etichetta); titolo vuoto = sezione nascosta; le missioni del softair sono ripetute in «Softair VS Paintball → Cosa trovi da noi»;
   - Softair VS Paintball, compreso il «Bottone verso la pagina del softair» in «Cosa trovi da noi»;
   - riquadro «Dati ripetuti: dove cambiarli tutti»: il minimo pagato 8/15 (arcotag e Nerf, nota prezzi e FAQ), «30 giocatori» (dati chiave, SEO, serata, FAQ, «Perfetto per»), i turni (testo dei prezzi e FAQ del tiro), telefono ed email nelle FAQ «Come si prenota», indirizzo nelle FAQ «Dove…», le somme dei bersagli nella FAQ del tiro; il listino del softair (sezione prezzi, FAQ «Quanto costa», prezzi di /paintball), i prezzi di Nerf e tiro nelle loro FAQ, «si parte da 8 / vi uniamo» (note, FAQ del softair, primo passo di /paintball), «1 ora e 45» (softair e /paintball), la Tessera Élite (softair e /paintball), le età citate nelle FAQ di /paintball e nelle pill della home; le scritte tattiche (`hudTag`) che ripetono «30 giocatori», le età (12+, 8+, 6+), «3 percorsi · 1–8 persone», «6 mm / 17 mm» e «1.500 m²»; in home «1.500 m²» sta anche in `hero.subtitle`, `seo.description`, `arena.stat` e nella fascia della CTA finale, i dati del corso in `course.facts` e, per la pagina del corso, orari, età, date e indirizzo in SEO, sottotitolo, scritta tattica, dati, In breve, calendario e FAQ;
   - nelle sezioni Recensioni di attività e paintball si cambia solo il titolo: quali recensioni compaiono si sceglie con «Pagine in cui compare»;
   - nota per il tecnico: ogni nuova attività va aggiunta tra i valori del campo `pages` di `.pages.yml`;
   - Immagini: WebP e varianti automatiche, testo alternativo.
7. **Cookie consent** (vanilla-cookieconsent) per GA4 e TicketingHub, poi il widget TicketingHub nelle sezioni `#prenota`.
8. **Seguiti tecnici**:
   - una sola forma degli URL (`trailingSlash` in `astro.config.mjs` e link interni);
   - i `.webp` accanto agli originali sono in git: su un clone nuovo la verifica per data potrebbe non rigenerarli se il cliente sostituisce una foto con lo stesso nome (valutare di toglierli da git o di controllare l'hash);
   - intestazioni del footer («Menu», «Contatti») e link legali ancora nel codice;
   - il campo «Dove sta il soggetto della foto» (`hero.focus`) c'è solo nelle attività: estenderlo al paintball se la sua apertura cambia;
   - `hero-opt3-run`, `hero-opt4-prone` e le loro `-mobile` non sono usati: l'utente li ha scartati anche per il corso («pessime»), quindi si possono cancellare; `hero-opt2-breach` è ancora il segnaposto di «Team building» nelle occasioni della home;
   - dall'audit del corso, da fare su tutto il sito:
     - link interni senza la barra finale (`/corso-softair` contro il canonical `/corso-softair/`: un redirect a link);
     - link dal testo di /softair e /paintball verso il corso;
     - immagine social `corso-og.jpg`;
     - Lenis creato dopo il primo disegno (ricalcolo forzato di 43 ms in `SmoothScroll.astro`);
     - solo i caratteri latini nei `@font-face` (`global.css:2-4`, 0,9 KB gzip a pagina);
     - `SectionHead`: la barretta del sopratitolo senza `flex: none`;
     - `StepTimeline`: il subgrid per le etichette lunghe tra 900 e 960 px;
     - un `businessId()` condiviso in `jsonld.ts` (oggi in `BaseLayout` e nel corso);
     - un `menuLabel(path)` in `nav.ts` per le briciole di pane (paintball e corso);
     - il punto luminoso è copiato in `HudFrame`, `ActionVideo` e `StatusChip`: una classe sola;
   - stato premuto nell'atomo `Button`;
   - `pad` (numeri a due cifre, 01, 02…) è copiato in `StepTimeline`, `ActivitiesStory` e `ModeGrid`: al terzo uso va in `src/lib/` (`CODE-03`, `CODE-04`);
   - una sottile riga verticale sul bordo destro di `logo-white-120.webp` nel footer, da verificare;
   - nota di ImpactScale visibile anche quando le sfere non sono disegnate;
   - lo scroll «con Lenis se c'è, altrimenti nativo» è ripetuto in `ActionVideo`, `FinalCta`, `ActivitiesStory` e `ScrollToTop`: un helper `src/scripts/scroll.ts` con il tipo di `window.__lenis` (`CODE-03`, `CODE-04`);
   - `has()` ancora da usare negli organismi delle pagine interne (oggi `?.trim()` a mano); `[activity].astro` e `paintball.astro` lo importano già;
   - `[activity].astro:100`: `og:image:alt` ripiega sull'alt dell'apertura anche quando l'immagine social è quella predefinita (in home già corretto: ripiega sul nome del sito);
   - l'angolo in alto a sinistra di `HudFrame` tocca il logo dell'header nelle aperture (visibile a 1024);
   - `public/uploads/video-poster.jpg` e `.webp` non sono più usati;
   - il sottotitolo della CTA finale («Prenota la tua sessione di softair a Milano.») ora compare anche su arcotag, Nerf e tiro: valutare un testo che valga per tutte le attività;
   - «WhatsApp» nella CTA finale è scritto nel codice (nome del canale, `CMS-02`): un campo `finalCta.whatsappLabel` solo se il cliente lo vuole diverso;
   - un token `--radius-full` per i `999px` delle pillole;
   - le sei missioni stanno sia in `softair.json` (`modes`) sia in `paintball.json` (`arena.missions`): far leggere al paintball quelle del softair (tocca `paintball.astro` e `.pages.yml`, migrazione `CMS-09`);
   - la FAQ «Come si prenota» ripete telefono ed email in ogni pagina: se cambiano in `settings.json`, vanno corrette anche lì.
   - il CSS di `ModeGrid` è inline anche su arcotag e Nerf, che non lo usano (0,7 KB gzip): l'`<head>` è già oltre la prima finestra TCP;
   - gli h3 del footer («Menu», «Contatti», «Anche all'aperto») stanno sotto l'h2 della CTA finale: meglio h2;
   - transizioni di `color`/`background-color` al passaggio (bottoni, titoli): `CODE-07` ammette solo transform e opacity; decidere se aggiungerle alle eccezioni del canone o rifarle in opacità;
   - la formula del bordo della `.shell` è ripetuta in `global.css` e `PageHero.astro`: al terzo uso una `--shell-edge` su `:root`;
   - al go-live: 301 da `www.softairmilano.it` al dominio nudo (regola Cloudflare, non `_redirects`) e mappatura di `/partite-di-softair-teambulding/` e `/softair-milano-cose/` (fase 3 di `docs/cutover-checklist.md`).

## Da chiudere prima del go-live

- Immagine social della home ancora in SVG, da rasterizzare in 1200×630.
- JSON-LD con `geo` e orari strutturati (`openingHoursSpecification`), con i dati del cliente.
- Chiave IndexNow in `public/`; un solo interruttore per `robots.txt` e `noindex` (oggi `public/robots.txt` è statico).
- Pausa per il movimento continuo (WCAG 2.2.2): riga e puntino delle aperture, che per decisione dell'utente (2 ott 2026) girano sempre anche nelle pagine interne; il video della home ha la sua pausa ma parte sempre da solo, anche con reduced motion (eccezione in `A11Y-07`). Registrato nel debito noto del canone.
- Bordo `--color-border` sotto 3:1 (WCAG 1.4.11): più contrasto o un secondo segnale.
- Ogni link interno deve puntare a una pagina esistente (oggi /l-arena, /teambuilding, /contatti, le occasioni e le legali danno 404).
- Video R2 da `r2.dev` a un dominio proprio.
- Rich Results Test di Google; Search Console e Bing Webmaster (`docs/geo-e-indicizzazione.md`).

## Decisioni aperte

- **Cronometro nell'apertura del tiro dinamico** (proposta dell'audit di design): da valutare; le aperture hanno già angoli, riga che scorre e scritta tattica come la home.
- **«Provate anche» con un ordine per pagina** (per esempio sul Nerf prima l'arcotag, dagli 8 anni): oggi l'ordine è quello di Home › Attività; servirebbe un campo CMS.
- **H1 della home**: keyword «softair Milano» o l'attuale «Diventa protagonista di un film d'azione»? Decide il cliente.
- **Social**: TikTok è un profilo attivo? Il testo della sezione promette «consigli utili»: il cliente li pubblica davvero?
- **Testo del Ranger**: è quello dell'utente, lungo per una sezione-link; da accorciare se il cliente vuole.
- **Prezzo del corso**: dal cliente; poi le FAQ «Quanto costa?» e «Come mi iscrivo?». Chiedere anche 2–3 recensioni di allievi del corso.
- **Foto delle occasioni**: foto reali di gruppi dal cliente o immagini AI (serve la ricarica del credito Gemini).
- **Accento ciano sulle foto con luce ambra**: tenere, oppure rigenerare le foto con luce neutra.
- **Vecchie immagini del tiro dinamico** (`att-tiro-dinamico.jpeg`, `-2`): da eliminare quando il cliente conferma la versione «casetta».
