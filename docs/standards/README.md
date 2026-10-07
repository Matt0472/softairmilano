# Standard del progetto

Questa cartella è **l'unica autorità** su come si costruisce softairmilano.it. È scritta per le persone
prima che per gli assistenti AI: entrambi la leggono, entrambi ne sono vincolati.

Se qualcosa qui contraddice un commento, un agente, il `CLAUDE.md`, l'handoff
(`docs/in-development/HANDOFF.md`) o un'abitudine, **vince questo file.** Se una regola sembra
sbagliata per il caso che hai davanti, dillo e fermati: non improvvisare una variante (vedi [Cambiare una regola](#cambiare-una-regola)).

Ogni regola ha un **ID** (`CMS-01`, `DES-04`, `A11Y-03`). Quando segnali qualcosa, cita l'ID: chi
legge può verificarlo invece di fidarsi sulla parola.

## Dove sta scritto cosa

| Posto | Contiene | Test |
|---|---|---|
| `docs/standards/` (qui) | Le **regole**: come deve essere il sito e il codice | "Violarla è un difetto" |
| `src/styles/global.css` (`@theme`) | I **valori** dei token di design (colori, font, raggi, ombre, easing) | "È un numero o un colore" |
| `design-system/softair-milano/MASTER.md` | L'**intento** del design system e il suo perché | "Spiega una scelta di design" |
| `docs/piano-sviluppo.md`, `docs/cutover-checklist.md`, `docs/geo-e-indicizzazione.md` | Piano delle pagine, procedura di go-live, elenco crawler e checklist GEO | "Descrive il progetto o una procedura" |
| `docs/in-development/HANDOFF.md` | Lo **stato** del lavoro in corso: cosa è fatto, cosa manca, trappole recenti | "Scade quando il lavoro finisce" |
| `docs/audits/` | Cosa ha trovato un audit **il giorno in cui è stato fatto** | "È un verbale" |

`docs/in-development/HANDOFF.md` (aggiornato con `/handoff`) e `docs/audits/` non sono documentazione:
non si mantengono una volta chiuso il lavoro e **nessun commento nel codice li cita**. Quando una lezione dell'handoff diventa una regola stabile, si
sposta qui.

## I file

| File | Copre |
|---|---|
| [`contenuti-cms.md`](contenuti-cms.md) | Contenuto vs struttura, Pages CMS, `src/data`, `.pages.yml`, manuale cliente — `CMS-` |
| [`codice.md`](codice.md) | Lingua, struttura, Atomic Design, token, JS client, dipendenze, terze parti, commenti — `CODE-` |
| [`design.md`](design.md) | Regole del design system e **decisioni del cliente da non riproporre** — `DES-` |
| [`media.md`](media.md) | Foto reali, immagini AI, video, logo, favicon, ottimizzazione — `MEDIA-` |
| [`accessibilita.md`](accessibilita.md) | WCAG 2.2 AA, **bloccante** — `A11Y-` |
| [`performance.md`](performance.md) | Lighthouse, Core Web Vitals, peso di immagini/font/JS — `PERF-` |
| [`responsive.md`](responsive.md) | Mobile-first, breakpoint, overflow, tap target — `RESP-` |
| [`seo.md`](seo.md) | SEO tecnica e on-page, JSON-LD, GEO, **gate di indicizzazione** — `SEO-` |
| [`git.md`](git.md) | Commit, push, anteprima online, segreti, go-live — `GIT-` |

## Non negoziabili

Le poche regole che, se violate, fanno danni difficili da vedere nel momento in cui accadono:

- **Ogni contenuto è modificabile dal cliente via Pages CMS**, mai scritto nel componente (`CMS-01`).
- **Mai commit o push senza un ok esplicito** dopo aver mostrato le modifiche (`GIT-01`).
- **Il sito resta `noindex` fino al giorno dello switch** su `softairmilano.it` (`SEO-10`).
- **WCAG 2.2 AA è bloccante** per il lancio (`A11Y-01`).
- **Le immagini AI non documentano l'arena reale** (`MEDIA-02`).
- **Le decisioni del cliente non si ripropongono** (`DES-10`).

## Cambiare una regola

Le regole si cambiano, non si aggirano. Una regola sbagliata si corregge qui, con l'ok dell'utente,
**prima** di scrivere codice che la viola; poi il codice si allinea. Una regola nuova nasce da una
decisione (del cliente o tecnica) che vale oltre il caso singolo: si aggiunge al file giusto con il
prossimo ID libero e una riga sul perché.

## Debito noto

Violazioni del canone accettate per ora, con il motivo. Un audit le riporta come **debito noto**, non
come regressioni. Si sistemano quando si tocca quel codice (`GIT-06`), non a vista.

| Dove | Regola | Perché è ancora lì |
|---|---|---|
| `scripts/genera-immagine.mjs`, `scripts/ottimizza-immagini.mjs`, script npm `immagini` | `CODE-01` (nomi in italiano) | Precedenti al canone; rinominarli tocca `package.json`, docs e handoff insieme |
| `public/og-default.svg` come immagine social | `SEO-04` | Da rasterizzare in PNG/JPG 1200×630 prima del go-live |
| `design-system/softair-milano/MASTER.md` (bordo `#2A313A`, container ~1200px) | `DES-01` | Valori superati da `global.css` (bordo `#3a434e`, `.shell` 1520px); vince `global.css` |
| Video «Dentro l'azione» della home in autoplay anche con reduced motion | `A11Y-07`, `DES-08` (statico pieno con reduced motion) | Decisione dell'utente del 2 ott 2026: il video parte sempre da solo, a mano si accende solo l'audio. Dal 7 ott il video è largo da subito e il pulsante di pausa è sempre visibile, quindi 2.2.2 è rispettato; resta solo l'autoplay con reduced motion |
| Movimento continuo senza pausa: riga che scorre e puntino delle aperture (`HudFrame`, home e pagine interne); in home anche zoom lento, polvere e grana dell'hero e radar di `ArenaIntro` (gira solo mentre la sezione è a schermo) | `A11Y-07` (WCAG 2.2.2) | Decisione dell'utente del 2 ott 2026: movimento continuo come in home, senza pulsante di pausa. Con reduced motion si ferma tutto. Va chiuso prima del lancio: un controllo di pausa o la rinuncia al loop |
