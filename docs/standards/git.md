# Git, anteprima e go-live — `GIT-`

Si lavora su **`main`**: ogni push su `main` finisce online sull'anteprima pubblica.

## Commit e push

- **GIT-01** — **Mai commit né push senza un ok esplicito nella conversazione.** Finito un lavoro, si
  **mostra** cosa è cambiato (screenshot desktop e mobile, anteprima locale, riepilogo del diff) e ci si
  ferma. Vale anche per i fix piccoli. Un ok su una modifica non vale per la successiva.
- **GIT-02** — Ogni push su `main` fa partire `.github/workflows/pages.yml`, che pubblica in circa un
  minuto l'**anteprima** **https://softairmilano-anteprima.mapped-dev.it** (GitHub Pages, `noindex`).
  Dopo il push si segue la run (`gh run watch`) e si controlla l'anteprima online.
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
- **GIT-08** — **Gli interruttori di produzione li aziona l'utente**: DNS, dashboard Cloudflare,
  `PUBLIC_SITE_INDEXABLE=true` il giorno dello switch. Claude prepara i comandi esatti e verifica dopo.
  Procedura: `docs/cutover-checklist.md` + `docs/geo-e-indicizzazione.md`.
