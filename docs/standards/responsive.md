# Responsive — `RESP-`

- **RESP-01** — **Mobile-first.** Ogni layout si verifica a **320, 375, 768, 1024, 1440 px**, più
  **1920** per il contenitore `.shell` (max 1520px) e un **telefono basso** (375×667) accanto a uno alto
  (390×844).
- **RESP-02** — **Nessuno scroll orizzontale** e nessun overflow a nessuna larghezza. Ciò che deve
  essere largo (tabelle, strisce di media) sta nel suo contenitore con `overflow-x: auto`.
- **RESP-03** — Gutter laterale **≥ 16px su mobile, ≥ 24px da desktop**.
- **RESP-04** — **Tap target ≥ 44px** per ogni elemento interattivo.
- **RESP-05** — **Immagini fluide** (`max-width: 100%`, `object-fit` corretto, nessuna larghezza fissa
  oltre il viewport); su mobile immagini verticali dedicate (`DES-09`).
- **RESP-06** — Sezioni a tutto schermo con **`min-height: 100svh`** (o `100dvh`), mai `100vh`: `svh`
  non salta quando la barra del browser si chiude e tiene la CTA sopra la piega.
- **RESP-07** — Le sezioni **pinnate** (scroll-story) si disattivano sugli schermi troppo bassi (sotto
  560px di altezza) e hanno una variante per i telefoni corti (`max-height: 700px`).
- **RESP-08** — Ogni layout a più colonne dichiara il suo **fallback sotto 768px nello stesso
  componente**.
- **RESP-09** — La **navigazione desktop sta su una riga**; su mobile c'è il menu a tutto schermo
  (`A11Y-08`).
