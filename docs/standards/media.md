# Media — `MEDIA-`

Foto, immagini AI, video, logo e favicon. Il procedimento (prompt, script, parametri) sta nell'agente
`asset-specialist`; qui ci sono le regole.

## Fonti e fiducia

- **MEDIA-01** — **Budget zero, sempre**: nessun asset a pagamento. Si usano le foto del cliente, lo
  stock con licenza libera commerciale (Pexels, Pixabay, Unsplash) o si genera con l'AI.
- **MEDIA-02** — **Le immagini AI servono per atmosfera, mood e azione, mai come finta documentazione
  dell'arena reale**: per un'attività fisica locale sarebbe ingannevole. La verità sul posto la danno
  solo le **foto reali**, che vanno nella Gallery e ovunque serva autenticità.
- **MEDIA-03** — Una foto reale del cliente (in particolare `arena.jpg`) si usa come base per una
  generazione AI **solo quando il cliente lo chiede esplicitamente** per quella generazione.
- **MEDIA-04** — Ogni asset nuovo si **mostra al cliente e si fa approvare** prima di collegarlo al
  sito. Si procede un asset alla volta.
- **MEDIA-05** — **Coerenza**: ogni immagine segue la grade dark-tattica del brand, così tutto sembra
  girato per noi. Ogni sezione con immagine a tutto schermo ha la sua **variante mobile dedicata**
  (4:5 per le sezioni, 9:16 stretto sul soggetto per l'hero).

## Formati e peso

- **MEDIA-06** — I sorgenti (JPEG/PNG) stanno in `public/uploads`; il **WebP lo genera la pipeline**
  (`npm run immagini`, già dentro `dev` e `build`). Ogni `<img>` ha `width`/`height` o `aspect-ratio`.
- **MEDIA-07** — I **video sono self-hosted** su Cloudflare R2, compressi (H.264, CRF ~23,
  `+faststart`), con poster; niente embed YouTube. Prima del go-live, R2 passa da `r2.dev` a un
  **dominio proprio**.

## Identità

- **MEDIA-08** — Il **logo** si ricolora solo con `scripts/logo-recolor.mjs` (ricolore fedele), **mai
  ridisegnato dall'AI**.
- **MEDIA-09** — La **favicon** nasce da `public/favicon.svg`; `scripts/generate-favicons.mjs` produce
  ICO, PNG e manifest. Se cambia l'accento, si rilancia lo script.

## Segreti

- **MEDIA-10** — La API key di generazione sta solo in `.env` (`GOOGLE_AI_STUDIO_SOFTAIRMILANO_PROJECT`)
  e non compare mai in file, log o messaggi (`GIT-04`).
