# Audit: Softair, Tiro dinamico, Nerf
30 set 2026 · 17 file · /softair, /tiro-dinamico, /nerf · canone al commit d9210e2 (modifiche non committate)

Perimetro:
- rotta `src/pages/[activity].astro` e i tre file `src/data/activities/{softair,tiro-dinamico,nerf}.json`;
- l'organismo nuovo `ModeGrid.astro`;
- il campo `hero.focus` in `PageHero.astro`;
- le modifiche collegate:
  - `Reviews.astro`, `src/lib/reviews.ts` e `Hero.astro`;
  - `ActivitiesStory.astro` e `global.css` (`--font-mono`);
  - `.pages.yml` e `public/_redirects`;
  - i dati in `testimonials.json`, `home.json`, `paintball.json` e `arcotag.json`.

## Sintesi
| Gravità | Numero |
|---|---|
| Bloccante — AA fallito, build rotto, sito indicizzabile, contenuto perso | 2 |
| Maggiore — regola violata con effetto visibile al cliente o all'utente | 9 |
| Minore — convenzione | 16 |
| Debito noto — già registrato | 7 |

Lighthouse mobile, mediana di 3 run puliti:

| Pagina | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| /softair | 99 | 100 | 100 | 69 | 1,80 s | 0 | 0 ms |
| /tiro-dinamico | 99 | 100 | 100 | 69 | 1,80 s | 0 | 0 ms |
| /nerf | 98 | 100 | 100 | 69 | 2,18 s | 0 | 0 ms |

- Il SEO a 69 dipende solo dal `noindex` voluto (`SEO-10`).
- Scartati i run fatti con la macchina sotto carico:
  - load average fino a 14,7, benchmarkIndex 481–728 contro 1753–3228;
  - Lighthouse avvisa «slower CPU»;
  - byte e script identici a quelli dei run puliti, TBT fino a 1038 ms.

---

## A11Y-02 — Contrasto misurato (testo ≥ 4,5:1, grande ≥ 3:1), al punto più chiaro della foto
**Bloccante** · 2 occorrenze

- **Etichetta dei dati chiave «AL COPERTO» su /nerf, da 1024 a 1920 px**
  - Muted `#a6aeb8` su casetta e rete arancioni:

    | Larghezza | Minimo | Pixel del glifo sotto 4,5:1 |
    |---|---|---|
    | 1024 | 3,07 | 71% |
    | 1280 | 3,01 | 75% |
    | 1366 | 2,92 | 59% |
    | 1440 | 3,27 | 51% |
    | 1920 | 4,14 | 8% |

  - Su /tiro-dinamico la stessa etichetta è al limite: 4,40–4,48.
  - Il valore «1.500 m²» è a 3,39.
  - Causa: la striscia dei dati sta fuori da `.phero__content`. Da 1024 in su il gradiente della copia sfuma a destra (`PageHero.astro:210-222`, `:347-349`) e lo scrim in basso finisce entro il 20% (`:158-160`). Il quarto dato quindi poggia sulla foto nuda.
- **«Provate anche», titolo e descrizione del pannello aperto su tutte le pagine attività (anche /arcotag)**
  - A 1440 (valori senza ombra):

    | Scheda | Titolo | Descrizione |
    |---|---|---|
    | Softair | 1,00 | 1,00 |
    | Arcotag | 1,30 | 1,06 |
    | Nerf | 1,42 | 1,00 |
    | Tiro dinamico | 2,43 | 2,62 |

  - A 390 la descrizione dell'arcotag è a 1,00–1,01.
  - Causa: il gradiente di lettura `.xl__media::before` viene dipinto **sotto** il `<picture>`. Entrambi sono `absolute` con `z-index: auto`, e `::before` viene prima nel DOM (`ActivityLinks.astro:152-163`). Il velo `::after`, nel pannello aperto, è a opacità 0.

**Perché conta:** un visitatore su due non legge il nome della scheda aperta di «Provate anche», il link verso le altre attività. Sul Nerf da desktop «al coperto», uno dei quattro argomenti chiave, si confonde con la casetta.

**Perimetro (GIT-06):** fix sul posto, verificati nel browser iniettando il CSS.
- `PageHero.astro` (nel diff): allo scrim si aggiunge una fascia in basso, `linear-gradient(0deg, ink 82% 0 → 82% 6.5rem → trasparente 14rem)`. Dopo la correzione il minimo è 6,50 sul Nerf e 7,14 sul tiro.
- `ActivityLinks.astro`: una riga, `.xl__media::before, .xl__media::after { z-index: 1 }`. Dopo la correzione i titoli sono ≥ 5,13 e le descrizioni ≥ 6,36. È fuori dal diff, ma il difetto c'è su tutte le pagine attività e l'audit del 30/09 non l'aveva visto: va corretto in questa modifica.

## RESP-01 / DES-09 — Lo slot decorativo vuoto spegne le protezioni dell'apertura
**Maggiore** · /softair, /tiro-dinamico, /nerf

- `src/pages/[activity].astro:100` registra lo slot `decor` anche quando l'espressione vale `false`. Il build esce quindi con `class="phero phero--decor …"` e un `<div class="phero__decor">` vuoto.
- Tra 1024 e 1279 px non si applicano la colonna del testo a 40vw e il titolo lungo a 4,2vw (`PageHero.astro:355-361`).
- Sul softair a 1024 il paragrafo resta a circa 20 px dal soldato di sinistra: un testo più lungo inserito dal CMS gli finirebbe sopra.
- Su mobile il div vuoto aggiunge 0,5rem di margine.

**Perché conta:** la regola pensata per tenere il testo lontano dal soggetto oggi non vale su nessuna pagina attività, tranne l'arcotag.

**Perimetro:** fix sul posto, in `PageHero.astro`: `hasDecor` si calcola dall'HTML reso dello slot, non da `Astro.slots.has`. Nello stesso punto la regola `.phero--focus-right` si limita a `:not(.phero--decor)`: è la sua giustificazione, come segnala la revisione del codice.

## DES-02 — Fotografia protagonista
**Maggiore** · 2 occorrenze

- **/tiro-dinamico e /nerf**: l'immagine di «Come si gioca» mostra la stessa scena dell'apertura, cioè la stessa casetta con lo stesso giocatore e lo stesso ragazzo col blaster. A 390 i due ritagli sono quasi uguali.
  - `tiro-dinamico.json` `howto.image` = `att-tiro-dinamico-mobile`;
  - `nerf.json` `howto.image` = `att-nerf-mobile`.
- **/nerf su telefono basso** (375×667, e per metà a 320×700): il blaster finisce sotto il chip del sopratitolo.
  - Nel ritaglio verticale volto e blaster stanno tra il 28% e il 43% dell'altezza, mentre il blocco del testo parte al 36%.
  - `object-position` non può spostarli: l'immagine ha lo stesso rapporto dello schermo.

**Perché conta:** sulla pagina la stessa foto due volte fa sembrare il materiale scarso. Sul Nerf da telefono il soggetto, cioè la cosa da vendere, è coperto.

**Perimetro:** passo successivo, perché servono immagini nuove da approvare (`MEDIA-04`).
- Tiro: il tiratore a una tappa, davanti ai bersagli.
- Nerf: una foto reale diversa, meglio se di una festa.
- `nerf-hero-mobile`: nuova inquadratura, con giocatore e blaster entro il 30% dell'altezza. Come ripiego, CSS in `PageHero` per i telefoni bassi in verticale (`top:-12%; height:112%`, taglia il soffitto vuoto).

## Ritmo della pagina (DES, composizione)
**Maggiore** · /softair

- Dopo l'apertura vengono tre sezioni di solo testo a colonne: In breve, La vostra partita, Missioni.
- La prima foto arriva a circa 3.400 px su desktop e circa 4.000 px a 390, cioè dopo cinque schermate.
- Le Missioni da sole reggono, ma lì sono la terza griglia di testi brevi di fila.
- Sul softair i numeri 01–06 non vogliono dire niente: le missioni le «sceglie lo staff». Sul tiro seguono la progressione Alfa → Beta e funzionano.

**Perché conta:** la pagina ammiraglia è quella che si legge peggio nella prima metà.

**Perimetro:**
- Fix sul posto, in `[activity].astro`: le Missioni vanno dopo «Come si gioca». L'ordine diventa prima le regole e poi le varianti. Arcotag e Nerf non cambiano: non hanno `modes`.
- Da decidere: numeri solo dove l'ordine conta, con un interruttore nel CMS oppure senza numeri sul softair. Si rivede dopo lo spostamento.

## DES-06 — Tipografia
**Maggiore** · /softair a 320–390

- Su due righe, l'accento di «RECLUTA DEL MARTEDÌ» tocca la riga sopra.
- Causa: `PriceTiers.astro:165` ha `line-height: 1.05`. È lo stesso problema per cui `global.css` porta h1–h4 a 1,12.

**Perimetro:** fix sul posto, una riga. È un difetto visibile nato con i dati nuovi.

## A11Y-05 — Focus mai nascosto da elementi fissi
**Maggiore** · /tiro-dinamico, /nerf (desktop e mobile)

- Il «Torna su» fisso copre fino al 47% del bottone «Attività successiva», con Tab a 1440×900.
- Su mobile copre fino al 7% di FAQ e schede.
- Il 2.4.11 AA è formalmente rispettato: l'elemento non è mai nascosto del tutto. Non si rispetta però la lettera di A11Y-05.

**Perimetro:** fix sul posto: `html { scroll-padding-bottom: 5rem }` in `global.css` (tecnica C43).

## SEO-07 — Parole chiave del vecchio URL
**Maggiore** · /tiro-dinamico

- Title e H1 hanno perso «softair». Il vecchio title sullo stesso URL era «Tiro Dinamico Softair Milano in campo indoor».
- «Tiro dinamico Milano» da solo attira chi cerca il tiro sportivo con armi vere.

**Perimetro:** fix sul posto, nei dati.
- Title: «Tiro dinamico softair a Milano, a cronometro | SoftAir Milano».
- H1: «Tiro dinamico softair a Milano».

## Link interni verso il softair
**Maggiore** · /paintball

- La landing che deve convertire chi cerca il paintball non collega mai /softair dentro la pagina, solo da menu e footer.
- L'unico link di contenuto va a /arcotag.

**Perimetro:** passo successivo, da decidere con `cms-specialist`: un campo o il riuso di `hero.ctaSecondary`. Facoltativo il link inverso, da /softair a /paintball.

## Gerarchia di «Perfetto per» con 3 voci
**Maggiore** · /tiro-dinamico, /nerf da 1024 in su

- `AudienceGrid` dispone 7/5 + 12: la voce meno importante («Giocatori di softair», «Anche per i grandi») diventa la più larga della pagina.
- La voce in evidenza resta più piccola.

**Perimetro:** fix sul posto in `AudienceGrid.astro` (`spanFor`). Con un numero dispari di voci, quella in evidenza prende una cella alta e le altre due si impilano accanto. Va verificato che l'arcotag, che ha 4 voci, non cambi.

---

## Minori

**Contenuti e dati (`CMS-10`, `CMS-14`) · fix sul posto nei dati e nell'handoff**
- Citazione di Joshua F.: unisce due frasi non consecutive. Va segnato il taglio con «[…]»; nel manuale e nella descrizione del campo: «se accorci una recensione, segna i tagli».
- Tiro dinamico, frasi da ammorbidire o da far confermare:
  - «Si comincia dall'Alfa» → «Il Beta si sblocca dopo aver completato l'Alfa»;
  - il modulo online per il tiro, che il vecchio sito non cita.
- Descrizioni nel CMS:
  - `hero.focus`: dire cosa vale se vuoto («Al centro») e chiarire «schermi medi»;
  - esempio di `facts.value`: «6–25» → «30 o 12+».
- Handoff:
  - righe non più vere: il solo `arcotag.json`, le immagini `att-*`, le etichette «Mostra voto e recensioni» e «Cosa trovate»;
  - manca `hero.focus` e un riquadro «Dati ripetuti: dove cambiarli tutti» (minimo pagato, «ultima partita alle 18», «30 giocatori», FAQ «Dove si trova», somme dei percorsi).

**Testi · fix sul posto nei dati**
- Nerf: «Che siano in pochi o in 30» → «Che siate…».
- «Ultima partita alle 18» ripetuto tre volte nella stessa sezione prezzi: resta solo nel testo.
- Softair:
  - «la festa più adrenalinica che si possa regalare», cliché con superlativo;
  - sopratitolo «Il vostro sabato sera» su una pagina che vende anche il martedì pomeriggio.
- Tiro dinamico:
  - «stesso prezzo con la vostra attrezzatura» compare 5 volte;
  - «Oppure la vostra attrezzatura…» come voce spuntata.
- Nerf: «per chi non se la sente di provare il softair» presenta l'attività principale come qualcosa che spaventa.
- Recensione di Carla R. («i nostri figli…»): è taggata `all`, quindi è la prima anche sul tiro, dai 12 anni. Va taggata Nerf e Arcotag.
- Nerf, alt di «Come si gioca»: la foto mostra un solo giocatore → «Un giocatore con maschera protettiva spara un dardo con un blaster Nerf tra le casette di legno».

**Link e schede (DES, composizione) · fix sul posto nei dati**
- Tiro dinamico e Nerf: le schede di «Perfetto per» puntano tutte a `#prenota` con la freccia ↗, che promette un'altra pagina. Vanno lasciate senza link, salvo la voce in evidenza.
- Nerf: la voce in evidenza «Compleanni» porta a `/festa-di-compleanno`, che è ancora un 404. Fino alla pagina, meglio `#prenota`.

**SEO-05 / SEO-08 — FAQ · fix sul posto nei dati**
- Nerf: 5 risposte su 9 identiche all'arcotag.
- «Dove si trova» identica in 4 pagine.
- Mancano «Quanto costa…» su softair e Nerf.
- «Quanti giocatori servono?» del softair non mette la risposta in testa.

**SEO-01 — Badge dentro l'h3 del prezzo** (`PriceTiers.astro:50`) · fix sul posto, stesso file del line-height
- Il titolo diventa «ReclutaPer iniziare».
- Il badge va spostato come fratello dell'h3.

**RESP-08 — Prezzi schiacciati a 320–375** (`PriceTiers.astro`) · fix sul posto, stesso file
- Sotto circa 28rem la riga resta su due colonne:
  - l'etichetta va su 3 righe («Recluta / del / martedì»);
  - «Avete già giocato da noi, con la tessera» su 4;
  - «14:00– / 18:00» spezzato.
- Correzione:
  - container query: orario e nota sotto;
  - spazio non separabile in «6 €» e nei trattini degli orari.

**RESP-02 — Titolo tagliato in «Provate anche» a 320** (`ActivityLinks.astro:211, :250`) · fix sul posto, stesso file dello z-index
- Si legge «TIRO DINAMIC».
- Correzione: `font-size: min(1.7rem, 8.5vw)` su mobile.

**PERF-04 — Immagine della sezione del Nerf caricata prima dell'LCP**
- In laboratorio `att-nerf-mobile` (68 KB a w800, contro i 28 KB della sorella sul softair) parte prima dell'LCP: circa +375 ms.
- Su 4G resterebbe lazy.
- Perimetro: passo successivo, `asset-specialist`: ricompressione a ≤ 40 KB. L'immagine è condivisa con la home, quindi il guadagno vale anche lì.

**CODE-04 / CODE-05 / CODE-18 — Stelle del voto duplicate** (`Hero.astro:96-100, :373-382`; `Reviews.astro:38-45, :121-130`)
- `.hero__stars-row svg` è nello style scoped, quindi non raggiunge lo svg di `Icon`: le stelle della home sono più spesse di quelle di Reviews.
- Il riempimento si calcola sulla riga intera, spazi compresi: a 4,7 la quinta stella è accesa al 64% e non al 70%, sia in home sia in Reviews.
- Perimetro: fix sul posto. Una molecola `StarMeter` (props `score` e `size`) usata da Hero e Reviews, con il riempimento calcolato sulle stelle e non sugli spazi.

**CODE-17 — Commenti**
- `global.css:79`: «labels only, never body copy» è smentito dalla telescrivente della home.
- `ModeGrid.astro`: tre commenti che ripetono il cosa (:173, :222, :248).
- Perimetro: fix sul posto.

**Redirect** (`public/_redirects:2-3`)
- La destinazione `/softair` senza barra finale causa un secondo salto (308) verso `/softair/`.
- Perimetro: fix sul posto.

**Titolo del Nerf a 1024**
- «NERF A / MILANO» lascia la preposizione a fine riga.
- Perimetro: fix sul posto, `text-wrap: balance` o uno spazio non separabile.

---

## Fuori perimetro, da verificare subito
- **Home, possibile bloccante A11Y (4.1.2)**: in `ActivitiesStory.astro:64-65` dei `<button>` senza nome stanno dentro `aria-hidden="true"`. Sono focalizzabili da tastiera ma nascosti ai lettori di schermo. L'ha visto la revisione del codice; la home non era in questo audit.
- **Boy Scout su `ActivitiesStory.astro`** (nel diff solo per il font), da verificare nel browser:
  - l'animazione `width` (`CODE-07`);
  - durate ed easing scritti a mano (`CODE-06`/`DES-08`);
  - `border-radius: 16px`;
  - il commento «(client request)».

## Da decidere o chiedere al cliente
- **Orari**:
  - la sezione Prenota di ogni pagina dice «tutti i giorni 10–24» (`settings.openingHours`);
  - i turni nuovi sono 14–18 e dalle 20;
  - un assistente AI citerà l'uno o l'altro.
  - Cosa serve: sapere se si prenota anche la mattina e quando parte l'ultima partita serale.
- **Tiro dinamico**:
  - 60 € e 20 € valgono per un percorso o per la sessione?
  - Quanto dura una sessione?
- **Badge «Compleanni»** del Nerf sul Weekend: è la fascia più cara, con minimo di 15 quote. Le feste si prenotano davvero lì?
- **Firma nell'apertura del softair e del tiro dinamico**: un'etichetta di missione e un cronometro, entrambi statici con reduced motion. È una proposta del design, non un difetto.
- **«Provate anche» del Nerf**: ordine per pagina (prima l'arcotag, dagli 8 anni)? Sarebbe un campo CMS nuovo.

## Debito noto (non è una regressione)
- `--color-border` sotto 3:1 (1.4.11): in ModeGrid le righe sono decorative.
- Il video della home non ha il bottone di pausa (2.2.2).
- Link a pagine non ancora costruite: /l-arena, /corso-softair, /teambuilding, /contatti, /festa-di-compleanno, /addio-al-celibato-nubilato e le pagine legali.
- `robots.txt` statico, quindi gli interruttori allo switch sono due e non uno.
- JSON-LD senza `geo` né orari strutturati; `og-default.svg` come immagine dell'attività.
- `pad` copiato in tre componenti.
- Testo a 0,99rem in ModeGrid, StepTimeline e AudienceGrid: da portare a 1rem tutti insieme.

## Seguiti tecnici emersi
- Il CSS di `ModeGrid` è inline anche su arcotag e Nerf, che non lo usano (0,7 KB gzip). L'`<head>` è già oltre la prima finestra TCP.
- `ottimizza-immagini.mjs` crea le varianti `-w*` anche per le `*-og.jpg`, che nessuno usa.
- `og:image:type` e `twitter:image:alt` mancano; gli h3 del footer stanno sotto l'h2 della CTA finale.
- Al go-live:
  - 301 da `www` al dominio nudo con una regola Cloudflare;
  - mappare `/partite-di-softair-teambulding/` e `/softair-milano-cose/`, per quest'ultima probabilmente verso /softair.

## Verificato e corretto
- **Build e indicizzazione**:
  - il build passa;
  - un solo h1 per pagina;
  - title di 56, 62 e 60 caratteri, description di 157–159;
  - canonical con barra finale;
  - `noindex, nofollow` su tutte le pagine e `robots.txt` con `Disallow: /`;
  - `PUBLIC_SITE_INDEXABLE` non è impostato da nessuna parte.
- **JSON-LD**: SportsActivityLocation, BreadcrumbList e FAQPage validi, con 10, 9 e 9 domande identiche al testo visibile. Nessun AggregateRating.
- **Responsive**:
  - nessuno scroll orizzontale né elemento fuori schermo da 320 a 1920;
  - bersagli ≥ 44 px;
  - CTA e dati sopra la piega anche a 375×667;
  - ModeGrid progettato a ogni larghezza, con le righe sempre piene da 1 a 7 schede;
  - `focus: right` tiene il soggetto nell'inquadratura a 1024.
- **Accessibilità** (ai blocchi di A11Y-02 e alla sovrapposizione del «Torna su» ci pensano le sezioni sopra):
  - contrasti dell'apertura misurati su 13 viewport, con i minimi:

    | Elemento | Minimo |
    |---|---|
    | H1 | 3,96 senza ombra, 5,23 con |
    | Paragrafo | 5,34 |
    | Sopratitolo | 7,92 |
    | Breadcrumb | 5,27 |
    | Etichette dei dati 1–3 | 5,49 |

  - ModeGrid: region, h2, `ol` di h3, dati in una `ul`, numeri `aria-hidden`, contrasti 8,6–16,3;
  - tastiera: 57–59 tappe per pagina, in ordine, con anello visibile. Funzionano il menu a tendina e il menu mobile, le FAQ esclusive, lo squeeze da tastiera, Prenota → `#prenota` e il focus.
  - reduced motion: niente resta nascosto, Lenis è spento;
  - la riga del voto in home si legge «4,7 su 5, 500+ recensioni su Google».
- **Performance**:
  - aperture più leggere del set arcotag a ogni larghezza, `fetchpriority="high"`, LCP sul testo;
  - CLS 0 in tutti i 15 run;
  - un solo font precaricato, nessun CSS render-blocking, nessuna terza parte;
  - ModeGrid e recensioni non aggiungono JS.
- **CMS**:
  - JSON, `.pages.yml` e componenti allineati per `focus`, `modes`, `pages` e `showRating`;
  - nessun testo scritto nel codice;
  - i campi vuoti nascondono la sezione;
  - dati coerenti con le fonti: prezzi, percorsi, minimi, massimo 30, 6+/12+.
- **Design**:
  - aperture forti, con quella del softair migliore del gruppo;
  - sopratitoli ben sotto uno ogni tre sezioni;
  - listino a 4, 2 e 3 fasce equilibrato;
  - lato bambini del Nerf coerente;
  - coerenza con /arcotag e /paintball (DES-03/04/05/11).

## Casi limite lasciati stare
- ModeGrid ristila l'interno di SectionHead: un solo uso non giustifica una variante (`CODE-04`).
- `lib/reviews.ts` importa i dati: è la sua ragione d'essere, cioè una fonte sola per il voto.
- Scelte fisse del campo `pages`: un `reference` non potrebbe contenere «all» né «paintball».
- Spreco di 13 KB segnalato sul Nerf: nasce dal passo del `srcset` a DPR 1,75, non da `sizes`.

## Non verificato
- Screen reader reali (NVDA, VoiceOver), Safari/WebKit (`role="list"` su iOS), forced colors, axe.
- Dispositivi fisici: solo Chromium in emulazione.

Evidenze in `.playwright-mcp/audit/`:
- screenshot per pagina a ogni larghezza e con reduced motion;
- Lighthouse `lh-<pagina>-<n>.json`;
- misure di contrasto `a11y-*`, con gli script in `.playwright-mcp/a11y-scripts/`.
