---
name: ship
description: "Use whenever someone starts a piece of work on the site — \"facciamo la pagina paintball\", \"rifai la sezione Occasioni\", \"aggiungi le FAQ\", \"sistema l'hero su mobile\", \"let's build X\". Takes it from intake to the online preview: checks what is already decided, asks what is ambiguous before planning, plans it, builds it to the project standards with the right specialists, verifies it in a real browser, shows it and waits for the ok, then commits and publishes to staging — and walks a delicate change (go-live, indexing, DNS, CMS field changes) through a runbook. Usage: /ship <description of the work>"
user-invocable: true
---

# Ship

Five stages with real gates between them. Do not skip ahead: each gate exists because the failure it
prevents is expensive and invisible at the time it happens.

The gates are what matter. The specialists in `.claude/agents/` are how each part gets done well; if
one is unavailable, do its part yourself against the same file in `docs/standards/`.

---

## Stage 1 — Intake

**Get the work.** `$ARGUMENTS` is a description: a page, a section, a fix. Restate it in one line as
the job it does for the business — sell sessions, grow the course, or win over people searching for
paintball — because that decides what the section must push.

**Find out what is already decided.** Before asking anything, read:

- `docs/in-development/HANDOFF.md` — current state, what is in progress, what is missing from the client;
- `docs/piano-sviluppo.md` — the plan for that page (sections, goal, CTA);
- `docs/standards/design.md` → `DES-10` — what the client already **rejected**. Never re-propose it.

**Check it is actually ready.** Say precisely what is missing, and ask — do not fill the gap with a
plausible assumption:

- **content**: does the copy exist (old WordPress site, client, to be written)? Prices, phone, hours
  and reviews are the client's to give, never invented (`CMS-10`);
- **assets**: real photos available, or AI needed (`MEDIA-02`)?
- **dependencies**: does it need something not built yet (cookie consent before TicketingHub, the
  component library, the manual)?

**Check the working tree.** `git status` and `git pull`. Work happens on `main`; nothing goes online
until the push in stage 5 (`GIT-02`). If there are uncommitted changes that are not this work, say so
before touching anything.

---

## Stage 2 — Interrogate

Ask about every genuine ambiguity **before** planning. The test for a question worth asking: *would
different answers lead to materially different output?* If yes, ask. If no, decide and say what you
decided.

Not "shall I proceed" — that is not a question. Ask the ones like:

- which is the one action this page pushes, and where does it lead?
- is the copy ours to draft, or does it come from the client or the old site?
- real photo or AI image here — and if AI, may we start from one of the client's photos (`MEDIA-03`)?
- what does the section show when a CMS field is empty?
- does this replace something the client has already seen and approved?

Ask them **one at a time**. Read the relevant `docs/standards/` files first — half the questions answer
themselves there, and asking one the canon already answers wastes the person's trust.

---

## Stage 3 — Plan

Enter plan mode. The plan names, concretely:

- which **files** change and at which Atomic level (`CODE-04`);
- the **content model**: new fields in `src/data/*.json` and `.pages.yml`, their Italian labels, and the
  manual section that documents them (`CMS-03`, `CMS-04`, `CMS-14`);
- which **specialists** do which part (see the table in `CLAUDE.md`);
- which **canon rules** constrain the work, by ID;
- which **assets** are needed and where they come from;
- how it will be **verified**: widths, reduced motion, the flows to click through;
- whether the work **finishes a page** — then stage 4 ends with the `/audit` quality gate;
- whether the change is **delicate** (`GIT-07`), decided now rather than discovered at release.

**Get approval before writing code.** A rejected plan is not approval, and it is not permission to
start a smaller version of it.

---

## Stage 4 — Build

Normal workflow, bound by the canon.

- **Read the standards files that apply** before writing (`coding-standards` skill, or the paths
  directly). Do not infer the rules from nearby code — that is how divergence spreads.
- **Delegate to the specialist whose subject matches**: `design-specialist` for the composition,
  `asset-specialist` for images and video, `cms-specialist` for the fields, `seo-specialist` for
  metadata and structured data, `accessibility-specialist` for any non-trivial widget. Independent parts
  go in parallel.
- **Content goes in the CMS from the first line** (`CMS-01`), never "hardcoded for now".
- **Every new asset is shown to the client before it is wired in** (`MEDIA-04`).
- **Apply the Boy Scout rule within its containment test** (`GIT-06`): improve what you touch; what
  would spill into other files becomes a next step in the handoff.
- **Build**: `nvm use 22.23.2 && npm run build` must pass (`CODE-13`).
- **Verify in a real browser**: Playwright MCP, not the desktop pane (it freezes animations and cannot
  capture below the fold). Desktop 1440 and a phone (390×844, plus 375×667 when the layout is tall),
  `prefers-reduced-motion`, and a click through every interactive element you touched.
- **Review by a different instance.** The instance that built something never reviews it: run
  `code-standards-specialist` and `cms-specialist` on the changed files, in parallel. Skip only for a
  trivial, mechanical change (a typo, a value, a one-line edit with no behavioural effect).
- **When the work finishes a page**, run `/audit` on it as the quality gate. Not after every component:
  the four quality specialists run when the page is finished. The accessibility verdict is blocking.

---

## Stage 5 — Show, then release

### Show and stop

Show the user what changed (`GIT-01`): screenshots desktop and mobile, the local preview URL, a short
summary of the diff and of any open decision. Then **stop and wait**. An ok on a previous change is not
an ok on this one.

### On an explicit ok

1. Commit in Italian, in the style of the existing messages (`GIT-03`), without working artifacts
   (`.playwright-mcp/`, `dist/`, scratch files — `GIT-05`).
2. Push to `main`, follow the run with `gh run watch`, and check the change on
   **https://softairmilano-anteprima.mapped-dev.it** (`GIT-02`). Report what you checked, not "it's
   deployed".
3. Clean `.playwright-mcp/`, and offer `/handoff` if the session is ending.

### Delicate changes

Engage this only when the change is delicate (`GIT-07`): go-live and the domain switch, the indexing
flag, DNS or Cloudflare settings, moving R2 to its own domain, a CMS field renamed or removed. If none
apply, say so explicitly and stop after the release above.

Write a runbook and **label every step with who performs it — [TU] or [CLAUDE]**. A step whose owner is
ambiguous gets skipped or done twice.

```markdown
### Anteprima
1. **[CLAUDE]** Build con il flag di produzione in locale e verifica di robots.txt e meta robots
2. **[TU]** Controlla <il flusso specifico> sull'anteprima

### Produzione
3. **[TU]** <l'interruttore: DNS / dashboard Cloudflare / PUBLIC_SITE_INDEXABLE>
4. **[CLAUDE]** Verifica <controllo esatto> e riporta cosa hai visto
```

The rules this part exists to enforce:

- **The user throws the production switches** (`GIT-08`): DNS, Cloudflare, `PUBLIC_SITE_INDEXABLE=true`.
  Hand over the exact values and commands; do not flip them.
- **`noindex` comes off only on switch day** (`SEO-10`), following `docs/cutover-checklist.md` and
  `docs/geo-e-indicizzazione.md`.
- **A renamed CMS field migrates the client's data in the same commit** (`CMS-09`).
- **Walk it interactively**: preview first, confirm, then production. Do not hand over one wall of steps
  and disappear. A missing error is not evidence of success — say what you actually checked.
