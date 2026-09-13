# Design System — SoftAir Milano (MASTER)

Fonte di verità del design. I token sono implementati in `src/styles/global.css` (`@theme` Tailwind v4): **nessun valore magico fuori da lì**. Direzione artistica completa: `docs/piano-sviluppo.md` → *Direzione artistica*.

## Sintesi
Estetica **tattico-militare cinematografica, dark-first, elegante (non kitsch)**: fondo gunmetal, testo chiaro, **un solo accento** ambra ad alto contrasto, tipografia forte, molto spazio negativo, fotografia protagonista. CTA primaria unica = **Prenota**.

## Palette (dark-first)
| Ruolo | Token | Hex | Uso |
|------|-------|-----|-----|
| Background | `--color-background` | `#0E1114` | fondo pagina (no puro nero) |
| Surface | `--color-surface` | `#161A1F` | card, sezioni |
| Surface 2 | `--color-surface-2` | `#1E242B` | livelli sopra le card |
| Foreground | `--color-foreground` | `#ECEEF1` | testo primario |
| Muted | `--color-muted` | `#A6AEB8` | testo secondario |
| Border | `--color-border` | `#2A313A` | bordi/divisori |
| Accent | `--color-accent` | `#F5A524` | CTA, accenti (ambra tattica) |
| Accent hover | `--color-accent-hover` | `#FFB53D` | hover CTA |
| On accent | `--color-on-accent` | `#0E1114` | testo su accento |
| Steel | `--color-steel` | `#5B6B7A` | secondario/steel |
| Success | `--color-success` | `#34C759` | conferme |
| Danger | `--color-danger` | `#E5484D` | errori |

Contrasto: testo/muted su background e testo-su-accento pensati per **AA su dark** (primario ≥4.5:1, secondario ≥3:1). Verifica puntuale a carico di `accessibility-auditor`. Testo sopra le foto → sempre **scrim/overlay**.

## Tipografia
- **Display**: `Oswald` (condensed, uppercase per i titoli) — cinematografico e tattico, elegante. Pesi 500/600/700.
- **Body**: `Inter` (variable) — pulito, altamente leggibile.
- Body ≥16px, line-height 1.6; titoli line-height ~1.1, letter-spacing lieve.
- Scala: xs .8 / sm .9 / base 1 / lg 1.125 / xl 1.375 / 2xl 1.75 / 3xl 2.25 / 4xl 3 / hero clamp.
- Cifre **tabellari** per prezzi/durate.

## Spaziatura & layout
- Ritmo **4/8px** (scala Tailwind). Tier sezioni: 16/24/32/48/64.
- Container max ~1200px, gutter laterale ≥16px (≥24px da desktop).
- Gerarchia con dimensione/spazio/contrasto, non col colore.

## Raggi, ombre, elevazione
- Radius: `--radius-sm .375rem`, `--radius-md .625rem`, `--radius-lg 1rem`.
- Ombre discrete su dark: `--shadow-sm`, `--shadow-md`. Elevazione soprattutto via step di surface + border.

## Motion
- Easing `--ease-out-expo` `cubic-bezier(.16,1,.3,1)`; durate 150/250/400ms.
- Reveal-on-scroll + stagger leggero; **solo transform/opacity**; niente CLS.
- **Hero: il contenuto non si anima** (LCP); si animano elementi secondari.
- `prefers-reduced-motion` → **statico pieno** (già gestito in `global.css`).
- Librerie: `motion` (vanilla) + `lenis` (smooth scroll) solo se servono.

## Icone
SVG only (**Lucide**), una sola famiglia, stroke coerente, dimensioni a token (sm/md/lg). Mai emoji come icone.

## Immagini
Formati moderni/WebP, `width`/`height` o `aspect-ratio` (no CLS), lazy sotto la piega, scrim per il testo sopra.

## Atomic Design
- **Atoms**: button (primary/secondary/ghost), link, input, label, badge, icon, heading.
- **Molecules**: form field, card, price row, FAQ item, nav item, testimonial.
- **Organisms = blocchi CMS** (vedi sotto).
- **Templates**: BaseLayout, PageLayout (a blocchi), ArticleLayout.

## Libreria blocchi (organismi / blocchi Pages CMS)
Hero, Header, Footer, Sezione testo, Testo + immagine, Galleria (con lightbox accessibile), Video, Elenco/feature, Prezzi/pacchetti, FAQ (accordion), Recensione/citazione, **CTA prenotazione (TicketingHub)**, Mappa/contatti.

## Regole d'oro
- Token = unica fonte di verità; **nessun hex/px sparso**.
- **Una sola CTA primaria per pagina** (Prenota).
- Dark-first coerente; contrasto AA verificato; motion accessibile.
