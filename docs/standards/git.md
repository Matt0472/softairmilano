# Git, produzione e anteprime — `GIT-`

Si lavora su **`main`**: dal 21 ott 2026 ogni push su `main` va **in produzione** su
**https://softairmilano.it**, e lo stesso ogni salvataggio del cliente in Pages CMS.

## Commit e push

- **GIT-01** — **Mai commit né push senza un ok esplicito nella conversazione.** Finito un lavoro, si
  **mostra** cosa è cambiato (screenshot desktop e mobile, anteprima locale, riepilogo del diff) e ci si
  ferma. Vale anche per i fix piccoli. Un ok su una modifica non vale per la successiva.
- **GIT-02** — Ogni push su `main` pubblica in circa due minuti la **produzione**: Cloudflare Pages
  (progetto `softairmilano`, account del cliente) costruisce e pubblica da solo, e l'esito è il check
  «Cloudflare Pages» sul commit in GitHub. Dopo il push si controlla quel check e la pagina toccata su
  **https://softairmilano.it**; a deploy riuscito le pagine vengono segnalate a IndexNow
  (`.github/workflows/indexnow.yml`). Prima di lavorare in locale si fa `git pull`: il cliente salva su
  `main` dal CMS. Un lavoro da far vedere **prima** di pubblicarlo va su un branch: Cloudflare Pages ne
  pubblica un'anteprima `noindex` su `<branch>.softairmilano.pages.dev`, senza toccare la produzione;
  con l'ok si unisce a `main`. L'anteprima su GitHub Pages (`softairmilano-anteprima.mapped-dev.it`) è
  stata spenta il 21 ott 2026.
- **GIT-03** — Messaggi di commit **in italiano**, nello stile di quelli esistenti: `Area: cosa cambia`
  (es. "Favicon: torna il mirino, in ciano…"), con il trailer di attribuzione in fondo.
- **GIT-04** — **Il repository è pubblico.** Nessun segreto nei file tracciati: le chiavi stanno in
  `.env` (gitignored).
- **GIT-05** — Non si committano artefatti di lavoro: screenshot di Playwright (`.playwright-mcp/`),
  `dist/`, script usa e getta dello scratchpad.

## Perimetro

- **GIT-06** — **Regola del boy scout, con contenimento**: ciò che tocchi lo porti allo standard; se
  sistemarlo richiede di toccare file che la modifica non tocca già, non allargare il diff: annotalo
  come passo successivo nell'handoff.

## Modifiche delicate e go-live

- **GIT-07** — Sono **delicate**: il go-live e il cambio dominio, il flag di indicizzabilità, DNS e
  impostazioni Cloudflare, il passaggio di R2 a un dominio proprio, un campo CMS rinominato o rimosso
  (`CMS-09`), qualunque cosa non si annulli con un revert. Si fanno con un **runbook** i cui passi dicono
  chi li esegue, **[TU]** o **[CLAUDE]**, e si percorrono insieme un passo alla volta.
- **GIT-08** — **Gli interruttori di produzione li aziona l'utente**: DNS, dashboard Cloudflare e le
  variabili del progetto Pages (`PUBLIC_SITE_INDEXABLE=true`, impostata allo switch del 21 ott 2026).
  Claude prepara i comandi esatti e verifica dopo.
  Procedura: `docs/cutover-checklist.md` + `docs/geo-e-indicizzazione.md`.
