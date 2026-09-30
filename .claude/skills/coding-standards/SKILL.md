---
name: coding-standards
description: "Use before writing or reviewing anything on the site, and whenever someone asks how this project does something — \"dove va questo testo?\", \"posso usare questo colore?\", \"come chiamo il componente?\", \"si può indicizzare?\", \"posso usare questa foto?\", \"where should this live\". Loads the project standards: content vs structure and Pages CMS, code, design system and client decisions, media, accessibility, performance, responsive, SEO and indexing, git and go-live. Answer from these rather than from memory, and cite the rule ID."
user-invocable: true
---

# Coding standards

The standards live in `docs/standards/`. This skill is an index — it holds no rules of its own, so
there is only ever one copy to keep current.

**Read the file that matches what you are doing. Do not work from memory or from surrounding code.**

| Doing | Read |
|---|---|
| Anything | `docs/standards/README.md` — index, where things live, non-negotiables, known debt, how to change a rule |
| Adding copy, images, links or data; touching `src/data` or `.pages.yml`; the client manual | `docs/standards/contenuti-cms.md` — `CMS-` |
| Writing components, layouts, CSS or scripts; adding a dependency; config | `docs/standards/codice.md` — `CODE-` |
| Designing or restyling; colours, type, motion; anything the client may have already rejected | `docs/standards/design.md` — `DES-` (tokens in `src/styles/global.css`) |
| Photos, AI images, video, logo, favicon | `docs/standards/media.md` — `MEDIA-` |
| Any interactive element, contrast, motion, forms | `docs/standards/accessibilita.md` — `A11Y-` |
| Images, fonts, video, JS/CSS weight, the hero | `docs/standards/performance.md` — `PERF-` |
| Layout at any width | `docs/standards/responsive.md` — `RESP-` |
| Pages, metadata, structured data, robots, indexing | `docs/standards/seo.md` — `SEO-` (+ `docs/geo-e-indicizzazione.md`) |
| Committing, pushing, the preview, go-live | `docs/standards/git.md` — `GIT-` (+ `docs/cutover-checklist.md`) |

## How to use them

- The canon is the **authority**. Where your judgement differs, the file wins.
- Every rule has an ID (`CMS-01`, `DES-10`, `SEO-10`). Cite it when you raise something or answer a
  question.
- If a rule seems wrong for the task in front of you, **say so and stop.** Do not improvise a
  variation. `docs/standards/README.md` explains how a rule gets changed.
- Entries in the "Debito noto" table are accepted for now: they are fixed when that code is touched
  (`GIT-06`), not on sight.
