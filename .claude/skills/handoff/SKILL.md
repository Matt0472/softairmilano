---
name: handoff
description: "Write or update the project handoff, docs/in-development/HANDOFF.md, so the next agent — starting with zero context — can continue the work on softairmilano.it. Use when the user asks to hand off, wrap up the session, save progress or prepare to continue in a new conversation — \"passiamo la mano\", \"chiudiamo la sessione\", \"salva i progressi\", \"aggiorna l'handoff\". This project's own version: one handoff for the whole project, in Italian, with the client-facing state (what the client has seen, approved and still owes us). Usage: /handoff"
user-invocable: true
---

# Handoff

Write or update the handoff so the next agent can continue without repeating mistakes or
re-discovering what is already known.

**This is the project's own version, and it wins over the personal `~/.claude/skills/handoff`** (the
personal skill defers to this file). What differs from the generic one: a single file for the whole
project instead of one per feature, written in Italian, with sections for the client-facing state,
and a sorting step that keeps rules out of the handoff.

## Where it lives

- Always **`docs/in-development/HANDOFF.md`**: **one file for the whole project**, not one folder per
  feature.
- A handoff found anywhere else (the project root, a `docs/in-development/<feature>/` folder) belongs
  here: merge it into this file and remove the other one (`git mv` / `git rm` if it is tracked).
- **Paths inside the handoff are always relative to the repository root** (`src/components/...`,
  `docs/standards/...`), because that is where Claude resolves them — never relative to the handoff
  file. An IDE that moves the file can rewrite them as `../../src/...`: put them back.

## What goes here, and what does not

The handoff is the **state of the work in flight**; it expires when the work is done
(`docs/standards/README.md`). Before writing, sort what the session learned:

| What was learned | Where it goes |
|---|---|
| A rule that holds beyond the current work: a client decision or rejection, a convention | `docs/standards/` — **propose** it; the canon changes only with the user's ok. The handoff links the rule ID |
| Craft for a specialist: a prompt that works, a verification trick, a trap in their area | the matching agent in `.claude/agents/` — propose it |
| How the user wants to work (a preference, a correction) | memory |
| What is done, in progress, waiting for the client, missing, next | **here** |

Never copy the canon into the handoff: link the rule (`DES-10`, `SEO-10`). Two copies drift apart.

## Steps

1. **Read the existing file in full** before touching it. Keep what is still valid; remove what is
   stale or resolved — a finished and published piece of work shrinks to one line in *Stato attuale*,
   a decision that moved into the canon becomes a link.

2. **Gather the real state. Do not write from memory:**
   - `git status`, `git log --oneline -10`, unpushed commits (`git log origin/main..HEAD --oneline`);
   - **what is online**: the last preview deploy (`gh run list --workflow pages.yml --limit 1`) — does
     https://softairmilano-anteprima.mapped-dev.it match `main`, or is some work only local?
   - the **last verified** build and Lighthouse, with the date — never claim a pass not seen in this
     session;
   - what the **client** saw in this session, what they approved, and what they rejected, with the
     reason in their words.

3. **Write or update the file** with these sections, in Italian:

   - **Titolo e riga di aggiornamento** — `Aggiornato: <data assoluta, ora>` and one line on what
     changed since the previous version.
   - **Obiettivo** — the site and its business goals in two or three lines, and the current focus.
   - **Stato attuale** — concrete: pages and sections done, key components, the relevant commits, and
     what is **online on the preview** versus only local.
   - **In attesa del cliente** — what has been shown and is waiting for an ok (assets `MEDIA-04`,
     changes `GIT-01`), and the open choices that are the client's (copy, the home `<h1>`, candidate
     images).
   - **Dati dal cliente** — everything still missing from the client (`CMS-10`): phone, WhatsApp,
     address, geo, opening hours, prices, TicketingHub and GA4 IDs, photos, final copy.
   - **Cosa ha funzionato** — approaches that worked, with enough detail to reproduce them (exact
     commands, key insight).
   - **Cosa NON ha funzionato / trappole** — what failed and **why**, so it is not repeated. The most
     valuable section; do not skip it. A trap that has become a rule is proposed for the canon and
     left here as a link.
   - **File chiave** — `path:line` references with one line on why each matters.
   - **Ambiente & comandi** — only commands verified in this session; Node 22 (`nvm use 22.23.2`);
     where secrets live (`.env`), never the secrets.
   - **Prossimi passi** — ordered and actionable; the first one startable immediately without further
     investigation. Include the follow-ups left out by the containment test (`GIT-06`) and the manual
     sections still to write (`CMS-14`).
   - **Da chiudere prima del go-live** — the list of what must be fixed before the switch. `/audit`
     reads it as **known debt**, so keep it complete and labelled exactly like this.
   - **Decisioni aperte** — what needs the user's or the client's input, with the options.

## Writing rules

- **Italian**, like the rest of the project's docs; code identifiers, paths and commands stay as they
  are.
- Write for a reader with **zero context**: no pronouns pointing at this conversation ("il bug che
  abbiamo trovato" → name the bug), no shorthand invented in this session.
- **Absolute dates** ("30 set 2026"), never "oggi" or "ieri".
- Specifics over prose: exact error messages, paths, commands.
- Keep it as short as completeness allows — the next agent reads it in full, so every stale or
  redundant line has a cost.
- **The repository is public (`GIT-04`)**: the handoff goes online with the next push. No secrets,
  tokens or keys — point to `.env` — and nothing about the client beyond business information.

## Finish

- **Do not commit** unless the user asks (`GIT-01`): the handoff goes into the next commit shown for
  approval.
- If step "What goes here" produced proposals for the canon, an agent or memory, list them and wait
  for the ok before applying them.
- Tell the user the path and that a fresh conversation can start with *"Leggi
  docs/in-development/HANDOFF.md e continua"*.
