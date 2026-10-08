# Contenuti e Pages CMS — `CMS-`

Principio fondante del progetto: **se è contenuto sta nel CMS, se è struttura sta nel codice.** Il
cliente aggiorna il sito in autonomia da Pages CMS; la struttura (layout, componenti, logica, stile,
configurazione) la tocca solo un tecnico.

## Contenuto vs struttura

- **CMS-01** — Ogni **contenuto** è modificabile dal cliente via Pages CMS, **mai scritto nel
  componente**: testi, titoli, immagini, video, prezzi, FAQ, recensioni, contatti, meta/SEO, voci di
  menu, etichette delle CTA, testi alternativi, link esterni, ID di terze parti. Il test: *"il cliente
  vorrà cambiarlo?"* Se sì, va nei dati.
- **CMS-02** — Fa eccezione solo il **microcopy d'interfaccia** che fa parte del funzionamento del
  componente e che il cliente non ha motivo di cambiare: `aria-label` dei controlli ("Apri il menu",
  "Torna su"), testo dello skip link, etichette di stato. Nel dubbio è contenuto.

## Dove vivono i dati

- **CMS-03** — I contenuti sono **file JSON in `src/data/`** (un file per sezione o pagina) oppure
  **collezioni**; i componenti Astro li leggono. Per le pagine che il cliente può aggiungere da solo si
  usano collezioni con schema predefinito e, dove serve, il campo **block** (organismi selezionabili e
  riordinabili): struttura libera ma sotto controllo.
- **CMS-04** — Ogni chiave dei JSON è esposta in **`.pages.yml`**, e ogni campo di `.pages.yml` è
  letto da un componente. Una chiave nel JSON che manca nel `.pages.yml` è invisibile al cliente; un
  campo che nessun componente legge è un campo morto che lo confonde.
- **CMS-05** — **Chiave (`name`) in inglese, `label` e valore in italiano.** Es.
  `{ name: "title", label: "Titolo" }` con valore italiano.
- **CMS-06** — I media caricati dal cliente stanno in **`public/uploads`** (in output `/uploads`).
- **CMS-07** — `settings.commit.identity: user`: ogni salvataggio riporta nome ed email di chi modifica.

## Campi

- **CMS-08** — Ogni campo immagine ha accanto il suo **campo testo alternativo**, e la sua **variante
  mobile** (`imageMobile`) quando il layout la richiede (`MEDIA-05`).
- **CMS-09** — Rinominare o togliere un campo **migra i JSON esistenti nella stessa modifica**: il
  contenuto già inserito dal cliente non si perde mai. È una modifica delicata (`GIT-07`).
- **CMS-10** — I **dati del cliente non si inventano**: telefono, indirizzo, orari, prezzi, recensioni,
  numeri. Se mancano, il campo resta vuoto, il componente gestisce il vuoto con garbo e il dato mancante
  finisce nell'elenco "Dati dal cliente" dell'handoff.
- **CMS-11** — Gli **ID di terze parti** (TicketingHub, GA4) sono campi del CMS: sono l'unica cosa di
  quelle integrazioni che il cliente cambia (`CODE-09`). Stanno in `settings.json` quando valgono per
  tutto il sito (GA4, la prenotazione), oppure nella voce che vendono quando ce n'è uno per voce (il
  widget di ciascun voucher), così una voce nuova porta con sé il suo ID (decisione dell'utente,
  8 ott 2026).

## Manuale cliente

- **CMS-12** — Il progetto ha un **manuale d'uso per il cliente**, fatto come su campo-di-zucche:
  - sorgente: frammento HTML in `docs/manuale-cliente.html` (solo `<title>` + `<style>` + corpo);
  - generazione: `scripts/genera-manuale.mjs` lo avvolge in una pagina completa `noindex, nofollow` +
    `no-referrer` e la scrive in `public/<percorso-non-indovinabile>/index.html`; gira con
    `npm run manuale`, incluso in `dev` e `build`;
  - indice scrollspy: `<nav class="toc">` con `aria-current` che segue la sezione letta; sezioni
    `<section id="...">` con `<h2><span class="num">NN</span> Titolo</h2>`.
- **CMS-13** — Il manuale è **riservato**: non è linkato da nessuna pagina, non è in sitemap e **non
  compare in `robots.txt`** (che è pubblico). Lo raggiunge solo chi conosce l'URL.
- **CMS-14** — Il manuale è **sincronizzato col sito**: ogni sezione e ogni campo modificabile è
  spiegato (come si accede, cosa si cambia, cosa **non** si tocca). Si aggiorna **nella stessa
  modifica** che cambia il `.pages.yml`. Finché il manuale non esiste, la sezione da scrivere va
  annotata nell'handoff.
