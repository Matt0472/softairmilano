# Audit: pagine pilota /arcotag e /paintball

30 settembre 2026 · 33 file (+10 immagini) · route `/arcotag`, `/paintball` + menu «Attività», footer, layout, dati e `.pages.yml` · canone al commit `5d19553` (modifiche non ancora committate)

Specialisti: accessibility, responsive, performance, seo, design, cms, code-standards (tutti in sola lettura). Evidenze in `.playwright-mcp/audit/` e `.playwright-mcp/a11y/` (non versionate).

## Sintesi

| Gravità | Numero |
|---|---|
| Bloccante: AA fallito, build rotto, sito indicizzabile, contenuto perso | 7 |
| Maggiore: regola violata con effetto visibile al cliente o all'utente | 16 |
| Minore: convenzione | 14 |
| Debito noto: già registrato | 9 |

Lighthouse mobile (mediana di 3, build di produzione):

| Pagina | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| /arcotag | 95 | 100 | 100 | 69¹ | 2,78 s | 0,018 | 0 ms |
| /paintball | 97 | 100 | 100 | 69¹ | 1,95 s | 0,081 | 0 ms |

¹ Il 69 SEO è solo il `noindex` voluto sull'anteprima (SEO-10).

La misura Lighthouse di /arcotag precede le correzioni fatte durante l'audit: va ripetuta.

## Già corretto durante l'audit

- **Striscia «Provate anche» su mobile** (segnalata dall'utente): non si spostava col mouse perché la barra di scorrimento è nascosta.
  - Aggiunto il trascinamento col cursore a manina, con inerzia e posa morbida sulla scheda (easing `--ease-out-expo`).
  - Aggiunto l'indizio «Scorri», visibile solo se la striscia straborda.
  - Il touch nativo non è toccato (verificato con eventi touch reali).
- **Banner «Nel gruppo qualcuno non se la sente?»** (segnalato dall'utente): la foto tagliava le teste. Ora usa `arcotag-hero.jpeg` (approvata), con gli arcieri interi a 1625, 1024 e 390.
- **«Serata tra amici»** (richiesta dell'utente): è in evidenza, con campo CMS `featured`, gradino di superficie, filetto accento e titolo più grande, e porta a `#prenota`. Risolve anche l'osservazione di design «la tile più grande non porta da nessuna parte».
- **Date delle recensioni**: tolte da dati, schema e componente (richiesta dell'utente).
- **`ActivityLinks`**:
  - tolta la lettura sincrona di layout al caricamento (perf W2);
  - lo scorrimento scriptato rispetta `prefers-reduced-motion` (CODE-07);
  - rimosso l'attributo inutilizzato `data-xl-hint` (CODE-18).

---

## Bloccanti

### A11Y-02 — Testo dell'apertura sulle foto sotto 4,5:1
**Bloccante** · entrambe le pagine, più larghezze

Misure p95 dei pixel dietro il testo (p95 / minimo):

| Testo | Arcotag | Paintball |
|---|---|---|
| Sopratitolo accento, 12–13,6 px | 2,80 a 1024; ≈1,1 a 320; 3,3–3,8 a 1440/1920/375/390 | 3,82 a 1024; 3,22 a 375; 2,19 a 320 |
| Voce corrente del breadcrumb (`--color-muted`) | ≈2 su mobile | 1,0–1,2 sotto il fascio di luce |
| «Home» nel breadcrumb | 4,33 a 375 | 3,59 a 320 |
| Lede | 3,90 a 1024; 3,52 a 320 | — |

- Dove: `PageHero.astro:122-138`, `:282-291` (scrim), `:152`, `:177`, `:234`; `Breadcrumb.astro:52`, `:57`.

**Perché conta:** chi è su mobile o con la luce del sole non legge dove si trova né il sopratitolo. Sul paintball il breadcrumb è praticamente invisibile.

**Correzione (rispetta DES-09, niente scrim pesante sulla foto):**
- breadcrumb e sopratitolo su una piccola pastiglia scura locale (≥82% ink), come già il bottone secondario;
- gradiente ancorato al blocco di testo (`::before` di `.phero__content`), non all'altezza dell'hero;
- rimisurare con `.playwright-mcp/a11y/hero3.js`.

**Perimetro (GIT-06):** correzione sul posto.

### A11Y-05 — Focus invisibile su «Scopri l'arcotag»
**Bloccante** · `/paintball`

- Dove: `TeaserBanner.astro:53`, `:125-131`, `:136-137`. `outline: none` sul link e anello sul `::after`, che però è tagliato dall'`overflow: hidden` del pannello.

**Perché conta:** chi naviga da tastiera perde il punto in cui si trova.

**Correzione:** `outline-offset: -3px` sul `::after`, oppure `:has(:focus-visible)` sul pannello; replicare gli stati `:hover` su `:focus-visible`.

**Perimetro:** sul posto.

### A11Y-08 (WCAG 1.4.13) — La tendina «Attività» aperta col mouse non si chiude con Esc
**Bloccante** · tutte le pagine

- Dove: `Header.astro:369-395`. Esc è ascoltato solo dentro la tendina. Aperta al passaggio del mouse con il focus sulla pagina, resta aperta e copre il sopratitolo.

**Perché conta:** un contenuto comparso al passaggio deve poter essere chiuso senza spostare il puntatore.

**Correzione:** mentre è aperta, ascoltare Escape su `document`.

**Perimetro:** sul posto.

Stesso componente, **maggiori**:
- ArrowDown sul bottone salta «Softair» e va su «Arcotag»: l'evento si propaga. Serve `stopPropagation`.
- Passaggio del mouse e poi clic richiude la tendina: il clic va ignorato se la tendina è appena stata aperta al passaggio.
- Il bottone non ha lo stile di focus accento dei link fratelli.

### A11Y-08 — Il focus esce dal menu mobile aperto
**Bloccante** · tutte le pagine (difetto precedente, ma il file è in questa modifica)

- Dove: `Header.astro:333`.
- `inert` copre `main`, `footer` e la barra dell'header, ma non lo skip link né `#scroll-top`.
- Tab dal menu va su un «torna su» invisibile sotto il pannello, poi su «Salta al contenuto», che punta a un `main` inerte.

**Correzione:** rendere `inert` tutti i figli di `<body>` tranne l'header, oltre alla barra dell'header.

**Perimetro:** sul posto.

### A11Y-09 / WCAG 2.5.8 — «Torna su» copre il link «Termini»
**Bloccante** · tutte le pagine, da 768 a ~1580 px

- Dove: `Footer.astro:150` (bordo destro dei link legali) e `ScrollToTop.astro:10` (fisso a 20 px). A 1440 copre il 75% di «Termini».

**Correzione:** `md:pr-16` sulla barra in fondo al footer (`Footer.astro:123`), oppure nascondere il bottone quando la barra è a schermo.

**Perimetro:** sul posto (Footer è nella modifica).

### A11Y-07 — L'indizio «Scorri» si muove per più di 5 secondi
**Bloccante** · `/arcotag` (mobile)

- Dove: `ActivityLinks.astro:216`. Già ridotto da infinito a 3 × 1,8 s = 5,4 s durante l'audit: ancora sopra il limite di A11Y-07.

**Correzione:** 2 cicli (3,6 s). Nota di design: l'animazione parte al caricamento della pagina, molto sotto la piega; farla partire quando la sezione entra in vista.

**Perimetro:** sul posto.

### CMS-10 — Un campo svuotato dal cliente può rompere la build
**Bloccante** · collezione «Attività» e pagina paintball

- Dove: `ImpactScale.astro:32,33,58`. `diameterMm` vuoto → `mm(undefined).toLocaleString` lancia un'eccezione e la build fallisce.
- Dove: `paintball.astro:96,98` e altri `x.steps.length`, `x.rows.length`… senza `?.`, se una lista manca.

**Perché conta:** un salvataggio del cliente in Pages CMS può bloccare la pubblicazione di tutto il sito.

**Correzione:**
- disegnare le sfere solo con due numeri finiti maggiori di 0;
- `options: { min: 1 }` su `diameterMm` in `.pages.yml`;
- `?.length` ovunque.

**Perimetro:** sul posto.

---

## Maggiori

### PERF-02 — LCP di /arcotag 2,78 s (obiettivo < 2,5 s)
- L'elemento LCP è il **lede**, non la foto: Chromium esclude le immagini a tutto viewport. Il commento in `PageHero.astro:2-3` è sbagliato.
- Il ritardo nasce dai byte scaricati prima che il testo appaia:
  - `arcotag-hero-mobile.webp`: 148 KB, grana AI, 0,85 bit per pixel contro 0,36 del paintball;
  - `arcotag-azione.webp`: 151 KB a 1280×1600 per un riquadro di 721×901. È lazy ma rientra nella distanza di precaricamento di Chrome.
- Stime:
  - hero a ~76 KB (leggera sfocatura della grana sotto il gradiente) + foto «Come si gioca» a 800 px (~73 KB) → LCP ~2,2 s;
  - con una sola delle due correzioni resta sopra 2,5 s.
- Il `srcset` a due larghezze **da solo non basta**: sui telefoni 3× peggiorerebbe.

**Perimetro:**
- *sul posto:* ricompressione delle immagini, con verifica visiva dell'`asset-specialist`;
- *passo successivo:* `srcset` + `sizes` in `Picture.astro` con varianti generate da `scripts/ottimizza-immagini.mjs`, che è fuori da questa modifica.

### PERF-03 — CLS 0,081 su /paintball (0,018 su /arcotag)
- Unico spostamento: `div.phero__content` quando arrivano i font (Oswald 700/600, Inter).
- Il titolo lungo del paintball va a capo su più righe con il font di ripiego, e il blocco è ancorato in basso.

**Correzione:**
- *sul posto:* `preload` di Oswald 700 latin in `BaseLayout`;
- *passo successivo:* font di ripiego con metriche allineate (`size-adjust` / `ascent-override`) in `global.css`.

### SEO-04 — Immagini social non 1200×630
- `arcotag-hero.jpeg` e `paintball-hero.jpeg` sono 2400×1340 (1,79:1) e 471/251 KB. Facebook e LinkedIn le ritagliano e WhatsApp spesso non le mostra.

**Correzione:**
- JPEG dedicati 1200×630 di al massimo ~200 KB, puntati da `seo.image`;
- `og:image:width` e `og:image:height`;
- campo `seo.imageAlt` (anche CMS-08), con ripiego sull'alt dell'apertura.

**Perimetro:** sul posto.

### SEO-05 — JSON-LD dell'attività (`BaseLayout.astro:33-44`) da correggere
- `address` è una stringa: serve `PostalAddress`. I dati ci sono già, ma servono campi strutturati in `settings.json` e `.pages.yml`.
- `telephone` senza +39.
- `sameAs` punta a Ranger Softair: è un altro luogo, rischia la fusione delle due entità. Mettere lì i social.
- L'immagine cambia pagina per pagina: serve un'immagine fissa e un `@id` stabile.
- Il blocco non passa da `toLd`, quindi manca l'escape del testo del CMS (anche CODE-05).

**Perimetro:** sul posto. I campi strutturati dell'indirizzo sono un'aggiunta allo schema, non una rinomina.

### SEO-03 — URL con e senza barra finale mescolati
- Canonical e sitemap usano `/arcotag/`. Il breadcrumb JSON-LD e tutti i link interni usano `/arcotag`, e ogni clic costa un redirect.

**Perimetro:**
- *sul posto:* il breadcrumb nella stessa forma del canonical;
- *passo successivo:* una sola forma per tutto il sito (`trailingSlash` in `astro.config.mjs`).

### SEO-02 — Title e description troppo lunghi
- Paintball: title di 68 caratteri (il brand viene tagliato), description di 176.
- Arcotag: title di 62, description di 162, e manca l'intento «serata tra amici».

**Proposte del `seo-specialist`** (copy da validare):
- *title Arcotag:* «Arcotag Milano al coperto: serata tra amici | SoftAir Milano»;
- *title Paintball:* «Paintball a Milano? Prova il softair | SoftAir Milano»;
- *description:* ridotte a ~145 caratteri.

**Perimetro:** sul posto (dati).

### RESP-04 — Target del footer alti 17–20 px
- Dove: `Footer.astro:79,88,101-102,113,144,151-153`: link del menu, email, telefono, Ranger, crediti, link legali. TikTok è 43×43.
- Passano WCAG 2.5.8 AA grazie alla spaziatura, ma non lo standard del progetto (44 px).

**Correzione:**
- `inline-flex min-h-11 items-center` e `gap-0`;
- menu del footer in 2 colonne su mobile;
- icona TikTok a 20 px.

**Perimetro:** sul posto.

Anche «Home» nel breadcrumb è largo 38 px (`Breadcrumb.astro:48`, `min-width: 44px`).

### DES-09 / RESP-05 — Foto orizzontali in riquadri verticali
- Tablet in verticale (768×1024): l'apertura usa la foto orizzontale, tagliata al 42% e ingrandita 2,3× (`Picture.astro:20`).
  - Correzione: `mobileMedia` con anche `(max-width: 1023px) and (orientation: portrait)`.
- Prima scheda di «Provate anche» tra 768 e 1023: foto orizzontale in una scheda verticale, soldati tagliati (`ActivityLinks.astro:42`).
  - Correzione: `mobileMedia="(max-width: 1023px)"`.

**Perimetro:** sul posto.

### RESP — Composizioni da rifinire
- Paintball, «Cosa trovi…» tra 768 e 1023: foto piccola in alto e colonna vuota sotto (`SplitFeature.astro:185-190`). Correzione: foto a tutta larghezza sopra e missioni sotto (lo segnala anche il design).
- Paintball, apertura a 1024×768: titolo e lede passano sopra i due giocatori (`PageHero.astro:173`). Correzione: `object-position` e larghezza massima del testo tra 1024 e 1279.
- Sfera paintball più larga della sua colonna sotto 350 px (`ImpactScale.astro:81`). Correzione: scala ridotta sotto 360.
- Bottoni dell'apertura a 320: «Prenota» più piccolo del secondario (`PageHero.astro:296-299`). Correzione: righe piene quando vanno a capo.
- Telefoni in orizzontale (844×390): nessuna regola per l'apertura, la CTA del paintball finisce sotto la piega.
- Footer a 768 compresso in 4 colonne (`Footer.astro:20`). Correzione: `md:grid-cols-2 lg:grid-cols-4`.
- Menu desktop a 1024: resta su una riga con solo ~67 px di margine. Con voci modificabili da CMS serve una protezione strutturale, più un limite indicato nel manuale.

### CODE-10 — Lenis attivo con il menu mobile aperto
- `overflow: hidden` sul body non ferma Lenis. Tra 768 e 1023 px, con rotella o trackpad, la pagina dietro si muove e il pannello non si scorre.

**Correzione:** `window.__lenis?.stop()` e `start()` in `setOpen`, più `data-lenis-prevent` su `#mobile-menu`.

**Perimetro:** sul posto.

### DES — Ritmo della seconda metà delle pagine
- Tre sezioni di fila con titolo a sinistra e contenuto a destra su /arcotag (Prezzi, Recensioni, FAQ), cinque su /paintball.
- Correzione più economica: FAQ a colonna singola.
- Su /paintball, il teaser e il blocco Prenota sono due card identiche di fila: spostare il teaser dopo «Fa più male?», dove prosegue il discorso, oppure farne una fascia fotografica.

**Perimetro:** sul posto.

### DES — La tabella prezzi non è allineata
- La fascia in evidenza rientra di ~16 px: etichette e prezzi non sono in colonna con le altre (`PriceTiers.astro:297` contro `:352`).

**Correzione:** stesso `padding-inline` per tutte le righe.

**Perimetro:** sul posto.

### DES / CMS-01 — Descrizioni di «Provate anche» troncate a metà parola
- I testi di `home.json` vengono tagliati a 2 righe («bersag…»).

**Correzione:** riusare la descrizione di una riga del menu, o un campo breve dedicato.

**Perimetro:** sul posto.

### CMS-10 — Sezioni svuotate dal cliente mostrano titoli vuoti
- Le sezioni appaiono se esiste l'oggetto, non il contenuto. In Pages CMS l'oggetto resta sempre salvato: svuotarlo produce un `<h2>` vuoto.
- Stesso problema:
  - bottoni con testo vuoto (`PageHero.astro:85-90`, `PriceTiers.astro:63`, `TeaserBanner.astro:35-38`);
  - `src=""` sulle immagini svuotate;
  - campi SEO vuoti, che eliminano i valori predefiniti invece di usarli (`BaseLayout.astro:19-20`).

**Correzione:**
- mostrare una sezione solo se ha contenuto, e un bottone solo con testo e link;
- `||` nei valori predefiniti;
- `required: true` su title SEO, titolo, immagine e alt dell'apertura;
- descrizione «Se vuoto, la sezione non compare».

**Perimetro:** sul posto.

### CMS-01 — Footer ancora in parte scritto nel codice
- «Anche all'aperto», «Ranger Softair Milano», «La nostra arena boschiva outdoor.» (`Footer.astro:108-119`).
- Nome del sito nel copyright, nell'alt del logo e nell'`aria-label` (`:22,25,125`).

**Correzione:** oggetto `settings.footerRanger` e `settings.siteName`.

**Perimetro:** sul posto (boy scout).

### CMS-10 — Cinque stelle sempre piene
- `Reviews.astro:26-28`: un voto che il cliente non può correggere.

**Correzione:** campo `rating.value` (1–5) e stelle calcolate da quello; se vuoto, niente stelle.

**Perimetro:** sul posto.

### CODE-04/05 — Due modi diversi di costruire il link `tel:`
- `Footer.astro:15-16` e `BookingCta.astro:22-29` danno risultati diversi con «39 375…».

**Correzione:** un atomo `PhoneLink.astro`, riusato anche per il `telephone` del JSON-LD.

**Perimetro:** sul posto.

---

## Minori

- **CODE-06:**
  - colori grezzi nel CSS nuovo dell'Header (`rgb(255 255 255 / …)`, ombra a mano; `Header.astro:221,224,249,302-308`);
  - `1.25rem` di margine ripetuto (SplitFeature, ActivityLinks);
  - `22%` ripetuto tre volte (StepTimeline);
  - easing personalizzati senza motivazione (ImpactScale);
  - `ease` al posto del token in diversi punti.
- **CODE-04/05:**
  - icona medaglia e chevron in linea nell'Header invece che nell'atomo `Icon`;
  - `.teaser__link` ricostruisce il bottone secondario;
  - la classe `phero__btn--ghost` è applicata al bottone secondario.
- **CODE-18:** `data-dd-panel` mai letto; `.mm-group__link` dichiarata in due blocchi consecutivi (Header).
- **CODE-17:** commenti d'intestazione troppo lunghi e descrittivi (VsComparison, ActivityLinks, ImpactScale, PageHero, StepTimeline).
- **PERF-06:**
  - reflow forzato in `Reveal.astro:48-50` e `ScrollToTop.astro:50` (~16 ms prima dell'FCP, TBT 0);
  - filtro `drop-shadow` sulla traiettoria animata (`Trajectory.astro:56`), che si ridipinge a ogni frame.
- **PERF-04:**
  - `<img>` senza `width`/`height` in `Picture.astro` (oggi ogni riquadro riserva il suo spazio);
  - tile di «Provate anche» a 1280 px per riquadri da ~320 (passo successivo con `asset-specialist`).
- **A11Y:**
  - nella striscia, il Tab porta la seconda scheda quasi fuori schermo: serve `scrollIntoView` su `focusin`;
  - «Ø 6 mm» letto come «O barrata»: aggiungere «diametro» nascosto;
  - la «Ù» del titolo FAQ tocca la riga sopra (`FaqAccordion.astro:59`, `line-height: 1.02`).
- **DES (da valutare):**
  - su mobile le etichette del confronto sono tutte in ciano;
  - nella tendina, la voce corrente e quella al passaggio hanno lo stesso ciano;
  - il pannello della tendina sborda di ~15 px dalla pillola;
  - la striscia dei dati è stretta a 375;
  - troppe animazioni di comparsa riga per riga;
  - cornice ciano interna sulle foto delle sezioni divise;
  - il `:hover` delle tile non è limitato ai dispositivi con mouse.
- **SEO-08:**
  - la definizione dell'arcotag non dice dove si trova l'arena («a Settimo Milanese, alle porte di Milano»);
  - la FAQ «Come si prenota?» rimanda a «qui sotto», che citato da un assistente AI non punta a niente;
  - titoli generici come «Prezzi» e «Punto per punto»;
  - «60'» si legge meglio come «60 min».
- **Registro della pagina paintball:** mescola il tu e il voi («Quando ti colpiscono», «Lo dichiari tu» accanto a «Prenotate»). Il copy l'abbiamo scritto noi: da uniformare sul voi, lasciando il tu solo nell'H1, che riprende la ricerca.

## Proposte di modifica al canone (servono il tuo ok)

- **RESP-06:** ammettere `100svh` oltre a `100dvh`. `svh` non salta quando la barra del browser si chiude, ed è quello che usa già tutto il sito.
- **CODE-07:** eccezione per `stroke-dashoffset` nelle animazioni SVG di tracciamento. Hero, ArenaIntro e Trajectory lo usano già.
- **CODE-03:** una cartella per gli helper di build condivisi (es. `src/lib/`) per JSON-LD, tipi del menu e telefono, oppure un atomo `JsonLd.astro`.
- **DES-01 / MASTER.md:** le durate delle animazioni (150/250/400 ms) non hanno un token in `@theme`.

## Da confermare con il cliente

- **Età minima arcotag:** 8 anni (pagina arcotag, menu e modulistica del sito attuale) o 10 (home)?
- **Prezzo Recluta:** 35 € (pagina più recente) o 30 € (altre pagine)?
- **Fasce orarie dell'arcotag:** non coprono tutto l'orario di apertura. Quanto costa un martedì alle 21 o un lunedì alle 11?
- **Team building arcotag:** «fino a 20 persone» mentre la pagina dice 6–25.
- **Contenuti da confermare o da fornire:**
  - nomi delle missioni dell'arcotag;
  - protezioni incluse;
  - numero aggiornato delle recensioni (347 era ad agosto 2024) e link al profilo Google;
  - recensioni più recenti: le attuali hanno un autore «Mc» e due Zanaboni vicini.
- **Badge del menu:** «Il più richiesto» è un'affermazione da confermare; «Da provare» dice poco.
- **Fascia in evidenza:** oggi sono i 25 € del weekend (Arcotag) e i 35 € della Recluta (Paintball). Il cliente preferisce evidenziare il prezzo d'ingresso?
- **Sopratitolo «Il vostro sabato sera»:** restringe l'offerta al sabato, mentre i prezzi vendono anche i pomeriggi feriali.
- **Numeri tecnici del paintball** (≤1 J per legge, 6–12 J, 17 mm, circa 15 volte): vengono dagli articoli del sito attuale; confermare che il cliente li sottoscrive.

## Debito noto (già registrato, non nuovo)

- Voci del menu desktop alte 36 px e Prenota 40 px (RESP-04). È nell'handoff ma manca dalla tabella «Debito noto» del canone: va aggiunta.
- Bordo `--color-border` sotto 3:1 (WCAG 1.4.11).
- Immagine social SVG della home; JSON-LD senza `geo` né orari strutturati; manca la chiave IndexNow; `robots.txt` statico; H1 della home senza parole chiave.
- Marcatori «(DA COMPLETARE)», nomi italiani degli script, valori superati in MASTER.md.
- Link interni verso pagine non ancora costruite: /softair, /tiro-dinamico, /nerf, /l-arena, /corso-softair, /teambuilding, /contatti, le pagine occasioni e le legali. È lavoro in corso: Softair, Tiro e Nerf sono il prossimo giro. Prima dello switch devono esistere.
- `BaseLayout` senza opzione `noindex` per pagina, e `termini` escluso dal filtro della sitemap: da fare prima delle pagine legali.

## Verificato e corretto

- **Build:** passa con Node 22.
- **Gate di indicizzazione (SEO-10/11):** `noindex, nofollow` su tutte le pagine, `robots.txt` con `Disallow: /`, il flag letto in un solo punto, nessun percorso del manuale esposto.
- **HTML:** un solo `<h1>` per pagina, titoli senza salti, landmark corretti, `lang="it"`, canonical.
- **JSON-LD:** valido. Breadcrumb e `FAQPage` corrispondono parola per parola alle FAQ visibili (10/10 e 8/8). Le recensioni Google correttamente non sono marcate come AggregateRating.
- **Accessibilità:**
  - axe-core 4.13: 0 violazioni a 1440 e 390 su entrambe le pagine;
  - contrasti dei token tutti sopra soglia (testo secondario 6,98–8,45; accento come testo 8,25–9,99);
  - ordine di tabulazione logico e anelli di focus visibili (tranne B2);
  - tendina: pattern disclosure corretto;
  - menu mobile: focus in entrata e in uscita;
  - skip link, `<details>` nelle FAQ;
  - tabella VS esposta con intestazioni di riga e colonna anche su mobile;
  - con `reduced-motion` tutto è statico e leggibile;
  - le animazioni si fermano entro ~4 s.
- **Responsive:**
  - nessuno scroll orizzontale della pagina;
  - ogni layout a più colonne ha la sua versione sotto 768;
  - gutter corretti;
  - telefono basso (375×667) con apertura completa sopra la piega;
  - confronto VS pensato davvero per il mobile;
  - header assoluto, quindi non copre le ancore.
- **Performance:**
  - apertura in WebP, `eager` e `fetchpriority="high"`;
  - FCP 1,50 s, TBT 0, nessuna risorsa bloccante;
  - CSS inline di circa 14 KB gzip, accettabile;
  - nessuna terza parte;
  - /paintball pesa 171 KB in tutto.
- **CMS:**
  - corrispondenza JSON ↔ `.pages.yml` ↔ componenti completa, anche negli oggetti annidati;
  - tipi corretti;
  - configurazione della collezione valida per Pages CMS;
  - il microcopy d'interfaccia rilevato («VS», «Home», «Ø mm», «Scorri», testi per screen reader) è ammesso da CMS-02.
- **Design:**
  - la prima metà di /arcotag varia davvero le composizioni;
  - un solo accento, tema scuro;
  - l'apertura non si anima sull'LCP;
  - varianti mobile dedicate;
  - nessuna decisione bocciata dal cliente è tornata (DES-10);
  - ImpactScale e traiettoria sono elementi firma che reggono.

## Lasciato deliberatamente com'è

- **Builder JSON-LD duplicati nelle due pagine:** CODE-04 dice di aspettare il terzo uso (vedi la proposta su CODE-03).
- **Stato premuto nell'atomo `Button`:** toccherebbe anche la home, quindi è un passo successivo.
- **Id dei frammenti in italiano (`#serata`, `#prima-volta`):** compaiono nell'URL, e c'è il precedente `#prenota`.
- **Dimensioni fisse in px** su tap target e decorazioni.

## Non verificato

- Screen reader veri (NVDA, VoiceOver, TalkBack), Firefox e Safari, colori forzati, spaziatura del testo, zoom al 200%.
- Swipe su un telefono vero: è stato verificato solo con eventi touch emulati.
- Rich Results Test di Google: si fa al go-live.
- Lighthouse dopo le correzioni fatte durante l'audit.
