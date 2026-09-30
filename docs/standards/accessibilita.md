# Accessibilità — `A11Y-`

- **A11Y-01** — **WCAG 2.2 livello AA è bloccante**: un fallimento AA blocca il lancio. Lighthouse
  Accessibility è solo un sottoinsieme superficiale; conta la verifica completa.

## Percepibile

- **A11Y-02** — **Contrasto** misurato, non stimato: ≥ **4.5:1** testo normale, ≥ **3:1** testo grande
  e componenti UI/bordi che servono a riconoscere un controllo (1.4.3, 1.4.11). Vale anche per il testo
  sopra le foto, misurato sul punto più chiaro dietro il testo.
- **A11Y-03** — **Testo alternativo**: descrittivo sulle immagini informative, `alt=""` su quelle
  decorative. Gli alt delle immagini del cliente sono campi CMS (`CMS-08`).
- **A11Y-04** — L'informazione non passa mai solo dal colore.

## Operabile

- **A11Y-05** — **100% operabile da tastiera**, ordine del focus logico, **focus sempre visibile** e mai
  nascosto da elementi fissi come la navbar (2.4.11).
- **A11Y-06** — **Skip link** "Salta al contenuto" funzionante.
- **A11Y-07** — `prefers-reduced-motion` spegne il movimento non essenziale. Il contenuto che si muove
  da solo per più di 5 secondi (video in autoplay, animazioni in loop) ha un **controllo per metterlo in
  pausa** (2.2.2).
- **A11Y-08** — Il **menu mobile** si apre e chiude da tastiera, si chiude con **Esc**, ha
  `aria-expanded` corretto sul pulsante e tiene il focus dentro finché è aperto (resto della pagina
  `inert`).
- **A11Y-09** — Dimensione minima dei target: 24×24 px per AA (2.5.8); lo standard del progetto è
  44 px (`RESP-04`).

## Comprensibile e robusto

- **A11Y-10** — **ARIA solo dove serve, e corretta**; prima gli elementi nativi.
- **A11Y-11** — Il testo animato (teletype, streaming) è disponibile **per intero** alle tecnologie
  assistive da subito, senza annunci ripetuti a ogni lettera.
- **A11Y-12** — **Form**: `<label>` associate, errori collegati con `aria-describedby` e
  `aria-invalid`, focus sul primo errore, messaggi che dicono causa e rimedio.
- **A11Y-13** — `lang="it"` sul documento.
