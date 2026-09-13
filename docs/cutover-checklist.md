# Checklist di cutover — softairmilano.it

**Migrazione: WordPress (Aruba) → Astro su Cloudflare Pages**
Ultimo aggiornamento: 13 settembre 2026

---

## Obiettivo e principi

Sostituire il vecchio sito WordPress con il nuovo sito Astro, **senza**:
- perdere il posizionamento su Google,
- avere downtime,
- rompere l'email `@softairmilano.it` (resta fisicamente su Aruba).

**Regole d'oro:**
1. **Costruisci e testa PRIMA** su staging. Si tocca il dominio solo a sito pronto.
2. **Un solo softairmilano.it**: dopo lo switch il dominio punta solo al sito nuovo. Il vecchio WordPress diventa file dormienti (backup), non un secondo sito online.
3. **L'email resta su Aruba**: quando il DNS passa a Cloudflare, tutti i record di posta vanno replicati o le mail si spengono.
4. **Backup prima di tutto**: con una copia completa del vecchio sito, puoi cancellarlo senza rischi.

---

## Stato di partenza (rilevato il 13/09/2026)

| Elemento | Valore attuale |
|---|---|
| Registrar / DNS | Aruba (nameserver `dns.technorail.com`, `dns2.technorail.com`, `dns3.arubadns.net`, `dns4.arubadns.cz`) |
| Sito web (A record root + www) | `89.46.107.228` (hosting WordPress Aruba) |
| Email | Attiva su Aruba — `MX 10 mx.softairmilano.it` |
| Nuovo host | Cloudflare Pages (come per campodizucchemilano.it) |

---

## FASE 0 — Preparazione e informazioni da confermare

- [ ] Confermato con il cliente: casella email `@softairmilano.it` in uso (**sì**).
- [ ] Verificare su Aruba se **email e hosting web sono nello stesso pacchetto** (se sì, il pacchetto NON si disdice: si dismette solo lo spazio web).
- [ ] Recuperare dal pannello DNS di Aruba il record **DKIM** (`<selettore>._domainkey.softairmilano.it`) — non rilevabile da fuori senza il nome del selettore.
- [ ] Accesso a: pannello Aruba (DNS + hosting), account Cloudflare, account TicketingHub, Google Search Console / Analytics.
- [ ] Elenco definitivo delle pagine e dei contenuti reali da migrare (vedi struttura ~11 pagine + collezioni).
- [ ] **Abbassare i TTL** dei record DNS su Aruba a 300s (5 min) 24-48h prima del cutover → switch e rollback più rapidi.

---

## FASE 1 — Backup del vecchio sito (rete di sicurezza)

- [ ] Export completo dei **file** del sito WordPress (via FTP/pannello Aruba).
- [ ] Export del **database** (phpMyAdmin / strumento Aruba).
- [ ] Salvare tutto in locale (es. in `docs/backup-wp/` o esterno al repo).
- [ ] Salvare uno **snapshot dei contenuti** utili (testi, immagini, recensioni, articoli blog buoni).
- [ ] Annotare la **lista completa dei vecchi URL** (dal sitemap: `https://www.softairmilano.it/sitemap_index.xml`) → serve per la mappa redirect.

> Con questo backup, il vecchio WordPress è cancellabile in qualsiasi momento senza perdere nulla.

---

## FASE 2 — Nuovo sito pronto su staging

- [ ] Sito Astro completo e testato su URL di staging (es. sottodominio `mapped-dev.it` o `*.pages.dev`).
- [ ] Contenuti reali inseriti (no placeholder).
- [ ] Pages CMS configurato (collezioni + blocchi) e provato dal cliente.
- [ ] Integrazione **prenotazioni TicketingHub** funzionante.
- [ ] SEO on-page: title, meta description, Open Graph, dati strutturati, sitemap, `robots.txt` (indicizzabile!).
- [ ] Performance verificata (PageSpeed mobile buono).
- [ ] Responsive/mobile ok su tutte le pagine chiave.
- [ ] Pagine legali: privacy, cookie, termini.

---

## FASE 3 — Mappa redirect 301 (fondamentale per la SEO)

- [ ] Mappare **ogni vecchio URL → nuovo URL**. Stessi slug dove possibile.
- [ ] Pagine morte (test, WooCommerce, doppioni) → redirect alla pagina più pertinente.
- [ ] Articoli blog buoni (es. paintball vs softair) → mantenuti o rediretti.
- [ ] Implementare i 301 su Cloudflare Pages tramite file **`_redirects`** nella root del progetto.
- [ ] Testare i redirect sullo staging prima del cutover.

Esempio `_redirects`:
```
/softair-milano-cose      /l-arena              301
/partite-di-softair       /softair              301
/negozio                  /                     301
/prodotto/*               /voucher-regalo       301
/home-test-mobile-rossa   /                     301
```

---

## FASE 4 — Cloudflare: dominio + DNS (con email preservata)

- [ ] Aggiungere `softairmilano.it` a Cloudflare → lascia che **scansioni e importi** i record esistenti.
- [ ] **PRIMA di cambiare i nameserver**, verificare che in Cloudflare ci siano TUTTI i record email qui sotto (confrontare col pannello Aruba, aggiungere i mancanti):

| Nome | Tipo | Valore | Proxy |
|---|---|---|---|
| `softairmilano.it` | MX | `10 mx.softairmilano.it` | DNS only |
| `mx` | A | IP Aruba: `62.149.128.74 / .72 / .160 / .154 / .166 / .157 / .163 / .151` | DNS only |
| `smtp` | CNAME | `smtps.aruba.it` | DNS only |
| `imap` | CNAME | `imaps.aruba.it` | DNS only |
| `pop3` | CNAME | `pop3s.aruba.it` | DNS only |
| `webmail` | CNAME | `webmail.aruba.it` | DNS only |
| `autodiscover` | CNAME | `autodiscover.aruba.it` | DNS only |
| `softairmilano.it` | TXT | `v=spf1 include:_spf.aruba.it ~all` | — |
| `_dmarc` | TXT | `v=DMARC1; p=none; adkim=r; aspf=r;` | — |
| `<selettore>._domainkey` | TXT | **DKIM da recuperare dal pannello Aruba** | — |

> ⚠️ Tutti i record di posta devono essere **"DNS only"** (nuvola grigia), mai proxati da Cloudflare.

- [ ] Aggiungere `softairmilano.it` (+ `www`) come **dominio personalizzato in Cloudflare Pages** → crea in automatico i record web verso il sito nuovo.
- [ ] Impostare il redirect `www → root` (o viceversa) in modo coerente col nuovo sito.

---

## FASE 5 — Il cambio (switch nameserver)

- [ ] Nel pannello **Aruba (registrar)**, cambiare i nameserver del dominio con quelli forniti da **Cloudflare**.
- [ ] Attendere la propagazione (con TTL abbassati, minuti/poche ore).
- [ ] Cloudflare conferma il dominio come "Active".
- [ ] Verificare l'emissione del **certificato HTTPS** per softairmilano.it (come fatto per la presentazione).
- [ ] Attivare il redirect da HTTP a HTTPS.

---

## FASE 6 — Verifiche post-cutover

**Sito web**
- [ ] `https://softairmilano.it` e `https://www.softairmilano.it` mostrano il sito nuovo.
- [ ] Certificato valido, redirect http→https attivo.
- [ ] Spot-check di 8-10 vecchi URL → redirettono correttamente (nessun 404).
- [ ] Prenotazioni **TicketingHub** funzionanti sul dominio.
- [ ] Form contatti / invio funzionante.

**Email (critico)**
- [ ] **Invio** di una mail da `@softairmilano.it` → arriva.
- [ ] **Ricezione** di una mail verso `@softairmilano.it` → arriva.
- [ ] Webmail Aruba raggiungibile.

**SEO**
- [ ] Google Search Console: verificare proprietà, **inviare la nuova sitemap**.
- [ ] Controllare copertura / errori 404 nei giorni successivi.
- [ ] Monitorare il posizionamento per 2-4 settimane.

---

## FASE 7 — Dismissione del vecchio (solo dopo stabilità)

- [ ] Aspettare **2-4 settimane** di funzionamento stabile del sito nuovo.
- [ ] Confermato che il backup (Fase 1) è completo e conservato.
- [ ] Verificato che l'email **non** dipende dallo spazio web che si vuole dismettere.
- [ ] Dismettere solo lo **spazio hosting WordPress** su Aruba (mantenere dominio + email).
- [ ] Rialzare i TTL DNS a valori normali (3600s) su Cloudflare.

---

## Piano di rollback (se qualcosa va storto dopo lo switch)

1. **Sito rotto ma email ok** → correggere sul nuovo host (i record di posta non c'entrano).
2. **Problema grave / email giù** → nel pannello Aruba, **ripristinare i nameserver originali** Aruba. Con i TTL bassi il vecchio sito + email tornano in pochi minuti (il vecchio WordPress è ancora integro finché non lo dismetti in Fase 7).
3. Analizzare a freddo, correggere, ritentare il cutover.

---

## Note

- **Un solo softairmilano.it**: dallo switch in poi il dominio serve esclusivamente il sito nuovo. Il vecchio WordPress resta come file di backup, non è un secondo sito online.
- **L'email non si tocca**: cambia solo *dove punta il sito*, non dove sta la posta.
- Valori DNS rilevati il 13/09/2026: verificarli di nuovo poco prima del cutover, nel caso Aruba li abbia modificati.
