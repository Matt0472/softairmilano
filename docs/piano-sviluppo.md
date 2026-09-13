# Piano di sviluppo — softairmilano.it

Documento di pianificazione di **struttura e contenuti** del nuovo sito. Da approvare prima di iniziare lo sviluppo.

## Obiettivi di business (in ordine di priorità)
1. **Vendere le partite/sessioni di softair** nell'arena — **obiettivo primario**: tutto il sito converte alla **prenotazione (TicketingHub)**.
2. **Far crescere il corso softair** (pagina dedicata prioritaria).
3. **Recuperare la fetta paintball**: intercettare chi cerca il paintball a Milano e convertirlo al softair.

Principi guida (dal `CLAUDE.md`): sito veloce, mobile-first; **ogni contenuto editabile dal cliente via Pages CMS**; CTA primaria unica = **prenotazione (TicketingHub)**.

> **Standard di qualità — sempre al massimo**: ogni pagina, contenuto e componente dev'essere **eccellente e curato nei dettagli**. Creiamo solo cose meravigliose: niente contenuti di riempimento, niente "abbastanza buono".

> **Priorità strategica — fetta paintball**: la pagina *Paintball → prova il softair* (n.9) e gli articoli blog sul tema sono l'**obiettivo di business chiave** (recuperare i clienti che cercano il paintball e convertirli). Vanno curati con attenzione particolare: contenuto, SEO locale, link interni e CTA. Da non perdere mai di vista.

---

## Conteggio pagine

- **13 pagine principali** (indicizzabili)
- **2 collezioni** gestite dal cliente (Blog, Esperienze) + **1 collezione "Pagine"** a blocchi per pagine libere (vedi *Autonomia del cliente*)
- **3 pagine legali** (noindex): Privacy, Cookie, Termini
- **1 manuale** cliente (riservato, non indicizzato)

Totale pagine "vere" costruite: **~13 + 3 legali**, più i contenuti illimitati che il cliente aggiunge in autonomia nelle collezioni.

---

## Direzione artistica

Stile **specifico di questo sito** (ogni progetto avrà il suo). Guida il design system e il lavoro di `ui-designer`; i valori concreti (palette, scale, font) li fissa `design-system/softair-milano/MASTER.md`.

- **Estetica**: tattico-militare **cinematografica ma elegante**, mai kitsch. Palette **scura** con **un solo accento** ad alto contrasto; tipografia forte con gerarchia netta; ampio uso di **spazi negativi**. Anti-kitsch: niente camo come texture primaria, niente stencil ovunque (display condensato forte + neutro pulito per il corpo); la scena la fanno **fotografia + spazio**, non gli effetti.
- **Hero & micro-interazioni**: hero immersivo (immagine/gradiente), parallax leggero e reveal on-scroll, con vincoli: il contenuto hero (titolo + CTA) **visibile subito**, mai dipendente da JS/animazione (**non si anima l'LCP**); solo `transform`/`opacity`, **niente layout shift** (CLS ~0); `prefers-reduced-motion` → **statico pieno**.
- **Galleria arena**: griglia responsive + **lightbox accessibile da tastiera** (focus trap, `Esc`, frecce, aria); immagini **ottimizzate e lazy-load**; contenuto gestito da CMS. Il sito è fotografico → servono foto ottime (segnaposto di qualità nel frattempo).
- **Coerenza / token**: colori, spaziature, raggi, ombre e tipografia definiti **in un unico posto** (Tailwind v4 `@theme` / CSS custom properties) e riusati; gli atomi consumano solo token; **nessun valore magico** (hex/px) sparso nel codice.
- **Contrasto su dark/foto**: dark-first → testo primario ≥4.5:1, secondario ≥3:1; testo sopra le immagini con scrim/overlay dove serve (verifica `accessibility-auditor`).

## Elementi globali (presenti su tutte le pagine)

- **Header / menu**: logo + voci di navigazione + bottone **Prenota**. Voci menu (label) editabili via CMS.
- **Footer**: contatti, indirizzo, orari, social, link legali, mini-mappa. Tutto editabile via CMS.
- **CTA Prenota (TicketingHub)**: presente in header e ripetuta a fine pagina; su mobile valutare bottone sticky.
- **Contatti rapidi**: telefono/WhatsApp click-to-call.
- **Link all'arena outdoor — Ranger Softair Milano** *(importante)*: rimando visibile e curato a **https://www.rangersoftairmilano.it/**, presente **sempre nel footer** e richiamato nell'header/menu e in home. È cross-promozione tra le due arene dello stesso cliente (indoor ↔ outdoor) e rafforza l'ecosistema. URL + testo editabili via CMS (`settings.json`).
- **Cookie banner** (vanilla-cookieconsent) + policy.

---

## Le 13 pagine principali

### 1. Home
**Scopo**: presentare l'esperienza e spingere alla prenotazione. **Intento**: "softair Milano".
**Sezioni**:
1. **Hero** — immagine/video, titolo forte ("Diventa protagonista di un film d'azione"), sottotitolo, CTA Prenota.
2. **Cos'è in breve** — l'arena indoor ~1500mq, 2-3 frasi + link a *L'arena*.
3. **Attività** — card: Softair, Tiro dinamico, Arcotag (link alle pagine).
4. **Come funziona** — 3-4 step (prenoti → arrivi → briefing → giochi).
5. **Per chi / occasioni** — card: Teambuilding, Compleanni, **Addii al celibato/nubilato**, Eventi. Risalto anche al **Corso softair** (offerta da spingere).
6. **Pacchetti/prezzi in sintesi** — richiamo + CTA Prenota.
7. **Recensioni** — testimonianze/Trustindex.
8. **Galleria** — foto/video.
9. **FAQ** — accordion (le più frequenti).
10. **Dove siamo** — mappa, indirizzo, orari, come arrivare.
11. **Arena outdoor** — box di rimando a **Ranger Softair Milano** (l'arena all'aperto dello stesso gestore, link a rangersoftairmilano.it).
12. **CTA finale** — Prenota.
**CMS**: `home.json` (testi hero + intro di ogni sezione + toggle sezioni), attinge a `activities`, `testimonials`, `gallery`, `faq`, `settings`.

### 2. L'arena (cos'è)
**Scopo**: raccontare struttura ed esperienza, creare fiducia. **Intento**: "campo softair indoor Milano".
**Sezioni**: descrizione struttura (1500mq, edifici, torrette, ambientazione); come si svolge una partita; **sicurezza** (attrezzatura, staff, regole, età minima); perché sceglierci; galleria; CTA Prenota.
**CMS**: `arena.json`.

### 3. Softair (partite)
**Scopo**: la pagina-servizio principale. **Intento**: "partite softair Milano".
**Sezioni**: cos'è il softair da noi; modalità/missioni di gioco (lista); cosa è incluso (noleggio armi/maschera/pettorina); durata sessione; prezzi/pacchetti; abbigliamento consigliato; FAQ specifiche; CTA Prenota.
**CMS**: `activity-softair.json` (+ `packages.json` per i prezzi).

### 4. Tiro dinamico
**Scopo**: attività distinta. **Intento**: "tiro dinamico Milano".
**Sezioni**: cos'è, come si svolge, a chi è adatto, cosa è incluso, prezzi, CTA Prenota, galleria.
**CMS**: `activity-tiro-dinamico.json`.

### 5. Arcotag
**Scopo**: attività distinta (arco soft/archery tag). **Intento**: "arcotag / archery tag Milano".
**Sezioni**: cos'è, regole base, a chi è adatto (anche più giovani/famiglie), prezzi, CTA Prenota, galleria.
**CMS**: `activity-arcotag.json`.

### 6. Teambuilding
**Scopo**: convertire aziende (alto valore). **Intento**: "teambuilding Milano softair / aziendale".
**Sezioni**: perché il softair per il team; cosa offriamo (formule, gruppi, sala/area briefing, catering se previsto); benefici; casi/recensioni aziendali; form richiesta preventivo; CTA (prenota o richiedi preventivo).
**CMS**: `teambuilding.json`.

### 7. Feste di compleanno
**Scopo**: pacchetti compleanno. **Intento**: "festa di compleanno Milano / alternativa".
**Sezioni**: come funziona la festa, età, pacchetti, cosa è incluso (area, torta/rinfresco se previsto), regole, FAQ, CTA Prenota/Contatta.
**CMS**: `birthdays.json`.

### 8. Eventi / gruppi privati
**Scopo**: gruppi ed eventi speciali (amici, occasioni, gruppi). **Intento**: "eventi di gruppo softair Milano".
**Sezioni**: tipi di evento, formule, capienza gruppi, esclusiva arena, richiesta, CTA.
**CMS**: `events.json`.

### 9. Paintball a Milano? Prova il softair *(landing strategica)*
**Scopo**: intercettare chi cerca il paintball e convertirlo al softair. **Intento**: "paintball Milano".
**Sezioni**: risposta diretta a chi cerca paintball; **confronto onesto paintball vs softair** (tabella: armi, dolore/impatto, realismo, indoor/meteo, costi); perché provare il softair; cosa serve/come funziona; recensioni; **FAQ paintball vs softair**; CTA Prenota.
**Collega** agli articoli del blog sul tema. **CMS**: `paintball.json`.

### 10. Voucher regalo
**Scopo**: vendere voucher. **Intento**: "regalo softair / voucher".
**Sezioni**: cos'è, tagli/pacchetti, come si acquista e si usa (via TicketingHub), validità, CTA acquista.
**CMS**: `gift-voucher.json`.

### 11. Contatti e modulistica
**Scopo**: farsi trovare, contattare e fornire la modulistica. **Intento**: "softair Milano contatti / dove".
**Sezioni**: form contatti; telefono/WhatsApp/email; indirizzo + mappa + come arrivare/parcheggio; orari; **modulistica** scaricabile (liberatorie/consensi da compilare e portare); CTA Prenota.
**CMS**: `contact.json` + `settings.json`.

### 12. Corso softair ⭐ (pagina prioritaria — da spingere)
**Scopo**: far crescere le iscrizioni al corso — il cliente vuole puntarci molto, quindi **contenuto e cura al massimo livello**. **Intento**: "corso softair Milano".
**Sezioni**: hero dedicato con promessa di valore; a chi è rivolto (dai principianti agli avanzati); **programma dettagliato** per livelli/moduli; cosa imparerai (competenze concrete); calendario, durata, frequenza; **istruttori** (credibilità); cosa è incluso; prezzo o "su richiesta"; **testimonianze di allievi**; FAQ; **CTA di iscrizione forte e ripetuta**; galleria.
**CMS**: `course.json`.

---

### 13. Addio al celibato / nubilato
**Scopo**: pacchetto dedicato — oggi **non esiste** una pagina che lo descriva (come invece c'è per i compleanni). La **creiamo noi con contenuti al top**, come proposta da validare col cliente. **Intento**: "addio al celibato Milano / addio al nubilato / idee".
**Sezioni**: perché il softair per l'addio (adrenalina, gruppo, ricordo indimenticabile); come funziona il pacchetto; cosa è incluso (arena, formule gruppo, extra); numero partecipanti; personalizzazioni; foto/video ricordo; recensioni; FAQ; CTA prenota/richiedi.
**CMS**: `bachelor-party.json`.

## Collezioni (contenuti illimitati gestiti dal cliente)

### Blog
Articoli in italiano (incluso il filone paintball vs softair). Ogni articolo: titolo, slug, data, immagine, estratto, corpo (rich-text), categoria, SEO. JSON-LD `Article`.
**Uso**: contenuti per la ricerca + intercettazione paintball.

### Esperienze / scenari
Gli scenari tematici (es. *La Montagna della Morte*, *Terminator*, e futuri). Ogni scenario: nome, immagine, descrizione, difficoltà/durata, CTA Prenota. Il cliente ne aggiunge di nuovi in autonomia (schema predefinito).

---

## Autonomia del cliente: layout base e blocchi

Il cliente deve poter **creare nuove pagine e contenuti in totale autonomia**, gestendo il **contenuto** ma **non** la **struttura**. Per questo costruiamo dei **layout base riutilizzabili**:

1. **Layout Articolo (Blog)** — struttura fissa (titolo, data, immagine, corpo rich-text, SEO). Il cliente crea nuovi articoli dalla collezione *Blog*.
2. **Layout Pagina a blocchi (page builder)** — collezione *Pagine* con un campo **block**: il cliente compone una pagina nuova (promo, landing, scenario…) **scegliendo e riordinando blocchi predefiniti**, senza toccare il codice. Rotta dinamica `/[slug]`.

**Libreria blocchi predefiniti** (riutilizzabili, coerenti col design system): Hero, Testo, Testo + immagine, Galleria, Video, Elenco/feature, Prezzi/pacchetti, FAQ (accordion), Recensione/citazione, CTA prenotazione, Mappa/contatti.

Ogni nuova pagina eredita automaticamente header, footer, stile, responsive, SEO e accessibilità: il cliente inserisce solo i contenuti dentro blocchi già "a norma". La libreria blocchi è responsabilità dell'agente `ui-designer`.

## Cookie, consenso e terze parti

Gestione **costruita a mano** (come campo-di-zucche), con `vanilla-cookieconsent`:
- **Cookie banner** alla prima visita + pagina **Cookie policy** (con gestione preferenze) + pagina **Privacy policy**.
- **Categorie di consenso**: necessari (sempre attivi) / analytics / terze parti (embed). Gli script non necessari si caricano **solo dopo consenso**.

**TicketingHub** (prenotazioni) — esattamente come campo-di-zucche:
- widget/embed di **terze parti**, caricato **solo dopo consenso**; i suoi cookie dichiarati nella cookie policy.
- **L'ID dello script/embed è un campo Pages CMS** (`settings.json`): è **l'unica cosa che il cliente cambia** da CMS per aggiornarlo.

**Google Analytics (GA4)** — *novità rispetto a campo-di-zucche*:
- caricato **solo dopo consenso analytics**, con **Consent Mode v2** (denied di default) e IP anonimizzato.
- **Measurement ID come campo CMS** (`settings.json`), come per TicketingHub.
- dichiarato in cookie policy e privacy policy.
- *(opzionale, consigliato)* **Cloudflare Web Analytics** come baseline **cookieless** (nessun banner necessario), complementare a GA.

Le pagine legali devono riflettere sia TicketingHub sia GA.

## Pagine legali (noindex, escluse da sitemap)
- **Privacy policy**
- **Cookie policy** (con gestione preferenze)
- **Termini / regolamento**

---

## Manuale cliente
Manuale d'uso riservato (come da `CLAUDE.md`): sorgente `docs/manuale-cliente.html`, generato in `public/<path-riservato>/`, indice scrollspy, sincronizzato con le sezioni reali. Si scrive insieme al sito.

---

## Modello dati (Pages CMS)

**File singoli** (`src/data/`): `settings`, `navigation`, `home`, `arena`, `activity-softair`, `activity-tiro-dinamico`, `activity-arcotag`, `course`, `teambuilding`, `birthdays`, `bachelor-party`, `events`, `paintball`, `gift-voucher`, `contact`, `packages`, `faq`, `gallery`, `testimonials`.
**Collezioni**: `blog/` (articoli), `experiences/` (scenari), `pages/` (pagine libere a blocchi — page builder del cliente).
**Media**: `public/uploads/`.

Regola: ogni testo/immagine/prezzo qui sopra è un **campo CMS** (label italiana, chiave inglese), mai hardcoded.

---

## Decisioni confermate
- **Tiro dinamico** e **Arcotag**: entrambi attivi → pagine mantenute.
- **Corso softair**: pagina dedicata **prioritaria** (n.12) — offerta da spingere, contenuto al massimo.
- **Addii al celibato/nubilato**: **pagina dedicata nuova** (n.13), contenuto al top — oggi non esiste, la proponiamo noi al cliente.
- **Squadra ufficiale**: rimossa (sostituita dal Corso).
- **Prezzi**: pubblicati dove già presenti sul sito attuale — **Softair** 15/20/35€, **Tiro dinamico** 20/60€, **Arcotag** 15/20/25€ (valori da confermare col cliente); Corso/Compleanni/Teambuilding "su richiesta". Gestiti via CMS (`packages.json`), aggiornabili dal cliente.
- **Contatti + modulistica**: un'unica pagina "Contatti e modulistica" (n.11).

## Rimosso
- **Squadra ufficiale**: **rimossa** — sostituita dalla pagina *Corso softair*. La vecchia pagina non serve più.

---

## Ordine di sviluppo proposto
1. Design system (`ui-designer`) + impianto Astro + `.pages.yml`.
2. Elementi globali (header, footer, CTA, cookie) + `settings`.
3. Home → L'arena → Softair (le pagine cardine).
4. Attività (tiro dinamico, arcotag) + occasioni (teambuilding, compleanni, eventi).
5. Landing paintball + collezione Blog.
6. Voucher, Contatti, Esperienze, legali.
7. Manuale cliente + quality-gate (4 auditor) + preparazione cutover.
