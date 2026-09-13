# GEO e indicizzazione — softairmilano.it

Obiettivo doppio: **(1)** non farci indicizzare finché non siamo live; **(2)** una volta live, essere trovati e **citati** dalle risposte degli agenti AI (ChatGPT, Claude, Perplexity, Copilot, Gemini, AI Overview di Google) e dai motori.

Playbook già applicato su **campo-di-zucche** (robots.txt che ammette gli AI crawler + chiave IndexNow in `public/`): qui lo replichiamo e adattiamo.

---

## Regola d'oro: staging → go-live

- Durante lo sviluppo pubblichiamo **solo su GitHub Pages**, sotto un sottodominio di **mapped-dev.it** (come la presentazione).
- In staging il sito è **completamente NON indicizzabile**: `robots.txt` con `Disallow: /` **e** `<meta name="robots" content="noindex, nofollow">` su **tutte** le pagine.
- Il **noindex si rimuove SOLO il giorno dello switch** sul dominio reale `softairmilano.it`. **Mai prima.**
- L'indicizzabilità è controllata da un **flag di build/ambiente** (un solo punto da cambiare): staging → noindex + `Disallow`; produzione → robots "aperto" + niente noindex. Così non si sbaglia e non si dimentica.

---

## GEO / leggibilità per gli agenti AI (in fase di build)

- **HTML statico e semantico** (Astro): il contenuto è nel testo HTML, non dietro JS → gli AI crawler lo leggono direttamente.
- **JSON-LD**: `LocalBusiness` (indirizzo, geo, orari, telefono), `FAQPage`, `Article` (blog), `BreadcrumbList`. *(competenza `seo-auditor`)*
- **Contenuto "answer-first"**: risposte chiare e concise, FAQ, definizioni; entità esplicite (attività, città = Milano, servizi, prezzi) → facili da estrarre e citare.
- **robots.txt che AMMETTE gli AI crawler** (in produzione), elencati esplicitamente.
- **llms.txt** (opzionale, standard emergente): `/llms.txt` che indicizza i contenuti chiave per gli LLM. Da valutare.

---

## robots.txt

**Produzione** (replica campo-di-zucche): `Allow: /` per tutti + Allow esplicito per gli AI crawler + riga `Sitemap:`.
AI crawler da ammettere: **GPTBot, OAI-SearchBot, ChatGPT-User** (OpenAI), **ClaudeBot, Claude-SearchBot, Claude-User** (Anthropic), **PerplexityBot, Perplexity-User**, **Google-Extended**, **Applebot-Extended** (Bingbot passa dalla regola generica).
⚠️ Il **percorso del manuale NON va nominato** in robots.txt (è pubblico): resta fuori solo col noindex.

**Staging**: `User-agent: *` + `Disallow: /` (blocco totale).

---

## IndexNow (indicizzazione rapida)

- File chiave IndexNow in `public/<chiave>.txt` (come campo-di-zucche, es. `c02bb187…txt`). **Generare una chiave nuova** per softairmilano.
- **Cloudflare → "Crawler Hints"**: ON → invia in automatico le notifiche IndexNow ai motori quando il contenuto cambia.

---

## Cloudflare — impostazioni AI (in produzione)

- **AI Crawl Control** (ex "AI Audit"): assicurarsi che i crawler AI siano **ammessi**, non bloccati. Cloudflare ha un toggle "Block AI bots": **NON** attivarlo — vogliamo essere letti e citati.
- **Crawler Hints**: ON (per IndexNow, vedi sopra).

*(Queste impostazioni valgono sull'ambiente di produzione su Cloudflare; in staging su GitHub Pages non si applicano.)*

---

## Checklist go-live (giorno dello switch)

1. Deploy in **produzione** e dominio `softairmilano.it` che punta al sito nuovo.
2. **Rimuovere il noindex** e pubblicare il `robots.txt` di produzione (allow + AI crawler + sitemap).
3. **Google Search Console**: verifica proprietà + invia sitemap.
4. **Bing Webmaster Tools**: verifica proprietà + invia sitemap (Bing alimenta Copilot e parte delle risposte AI).
5. **IndexNow**: chiave attiva + Cloudflare Crawler Hints ON.
6. **Cloudflare AI Crawl Control**: AI bot ammessi (non bloccati).
7. Verifica **JSON-LD** (Rich Results) e che le pagine chiave siano leggibili senza JS.
8. *(opzionale)* pubblicare `llms.txt`.

Coordinare con `docs/cutover-checklist.md` (il cambio dominio) e con l'agente `seo-auditor`.
