# Design — `DES-`

Le **regole** del design system. Il mestiere (come si giudica una sezione, cosa la fa sembrare un
template) sta nell'agente `design-specialist`; i **valori** stanno in `src/styles/global.css`.

## Autorità

- **DES-01** — I valori dei token vivono in `@theme` di `src/styles/global.css`: è la fonte di verità.
  `design-system/softair-milano/MASTER.md` spiega l'intento; se i due divergono, vince `global.css` e
  MASTER.md si corregge.
- **DES-02** — Estetica **tattico-militare cinematografica, dark-first, elegante (non kitsch)**,
  fotografia protagonista, molto spazio negativo. **"Wow" su ogni pagina, ma la performance viene
  prima**: un effetto che pesa più di quanto comunica non si fa.

## Colore e tema

- **DES-03** — **Tema unico dark** su tutto il sito: le sezioni variano solo dentro la famiglia
  gunmetal (`background` / `surface` / `surface-2`), mai una sezione chiara in mezzo.
- **DES-04** — **Un solo accento**: `--color-accent` (ciano `#00CCFF`, hover `#33D6FF`, scelto dal
  cliente). Si usa solo tramite token, identico su tutto il sito; nessun secondo accento (badge, puntini
  di stato, icone colorate). La luce calda delle foto è l'unica nota calda, e sta nelle foto.

## Gerarchia e azione

- **DES-05** — **Una sola CTA primaria per pagina: Prenota** (TicketingHub). Le azioni secondarie sono
  subordinate. **Un'etichetta per intento** su tutto il sito: se l'intento è prenotare, l'etichetta è
  sempre la stessa (navbar, hero, footer).
- **DES-06** — Tipografia: **Oswald** per i titoli (maiuscolo), **Inter** per il testo (≥16px,
  interlinea ~1.6). **Cifre tabellari** per prezzi, orari e durate.
- **DES-07** — Icone **solo SVG**, una sola famiglia, tratto e dimensioni coerenti. **Mai emoji come
  icone.**

## Movimento

- **DES-08** — Il movimento ha uno scopo; si usano gli easing e le durate dei token (`--ease-out-expo`,
  `--duration-fast/base/slow`). **Il contenuto
  dell'hero che fa da LCP non si anima**: si animano gli elementi secondari. Con
  `prefers-reduced-motion` il sito è **statico pieno**.

## Immagini

- **DES-09** — Il testo sopra le foto è sempre leggibile, con text-shadow e gradiente leggero; il
  cliente non vuole scrim pesanti che anneriscono l'immagine. Su mobile si usano **immagini verticali
  dedicate** con il soggetto nel terzo alto; mai `object-fit: contain` con le bande (letterbox).

## Componenti

- **DES-11** — Gli **accordion** (FAQ e simili) sono **esclusivi**: aprire una voce chiude le altre, mai
  più di una aperta alla volta.

## Decisioni del cliente — non riproporre

- **DES-10** — Queste strade sono già state provate e **bocciate dal cliente**. Non si ripropongono
  nemmeno come alternativa, salvo che sia lui a riaprirle:

  | Bocciato | Al suo posto |
  |---|---|
  | Sezione 3D (three.js) in home | Niente 3D; la storia è in git (`64933b2`) |
  | Topbar classica + hamburger | Navbar **floating a pillola** |
  | Scrim pesante sull'hero | Immagine piena, text-shadow + gradiente sottile in basso |
  | `object-fit: contain` / letterbox su mobile | Immagini verticali dedicate |
  | Scroll-snap automatico nella scroll-story | Scroll libero |
  | Favicon ricavata dal logo (fucili illeggibili a 16px) | Mirino (`public/favicon.svg`) |
  | Embed YouTube | `<video>` self-hosted (`MEDIA-07`) |
  | Accento ambra `#f5a524` | Ciano `#00CCFF` |
