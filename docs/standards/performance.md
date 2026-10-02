# Performance — `PERF-`

- **PERF-01** — **Lighthouse mobile ≥ 95** su Performance, Accessibility, Best Practices e SEO, misurato
  sulla **build di produzione** (`astro preview`), non sul dev server.
- **PERF-02** — **LCP** curato (obiettivo < 2.5 s; la home oggi sta a ~1.7 s): l'immagine dell'hero ha
  la priorità e non è lazy; **l'elemento LCP dell'hero non si anima** (`DES-08`). Un movimento composito
  sull'immagine di sfondo (lo zoom lento della home) è ammesso finché l'LCP resta il titolo e non costa
  rendering (decisione dell'utente, 2 ott 2026).
- **PERF-03** — **CLS ~0**: spazio riservato a immagini, video, embed e font.
- **PERF-04** — **Immagini** in formato moderno (WebP), dimensionate per il riquadro in cui finiscono,
  con `width`/`height`, **lazy sotto la piega** (`MEDIA-06`).
- **PERF-05** — **Font self-hosted** (`@fontsource`) con `font-display: swap`; si precarica solo il
  peso critico.
- **PERF-06** — **CSS/JS minimi**: `inlineStylesheets` nel build, nessun runtime di framework
  (`CODE-08`), TBT ~0.
- **PERF-07** — I **video** non partono al caricamento della pagina: sotto la piega si caricano quando
  entrano in viewport, sempre con poster.
- **PERF-08** — Le **terze parti** non pesano sul primo caricamento: arrivano dopo il consenso
  (`CODE-09`).
- **PERF-09** — **Gli effetti costosi non si fanno** (vedi il 3D rimosso, `DES-10`): la performance
  viene prima dello spettacolo (`DES-02`).
