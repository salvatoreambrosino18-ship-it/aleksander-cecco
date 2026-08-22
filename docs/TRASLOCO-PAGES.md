# Il trasloco del progetto Pages

Aggiornato 22/08/2026. **Sostituisce il punto 1 della sezione 136 del
DESIGN-PLAN**, che dava per scontato che dominio e progetto stessero nello
stesso account Cloudflare. Non è così, ed è stato verificato nel pannello:

- il dominio `aleksandercecco.com` è **nell'account del titolare**, `617759fe9c221aece88936c3f3537244`
- il progetto Pages è **nel nostro**, `0f406c1182fa9f5b822938dc3a3c708d`
- Cloudflare **rifiuta** un dominio personalizzato fra account diversi
- e **rifiuta** un secondo progetto Pages sullo stesso repository fra account diversi

Quindi il progetto si sposta: si cancella di qua e si ricrea di là. Non è un
trasferimento, perché Cloudflare non ne ha uno.

## Quello che sparisce insieme al progetto

Cancellato il progetto, questa roba non si recupera da nessuna parte.

| Cosa | Si ricostruisce da qui? |
| --- | --- |
| **Il deploy hook `sanity-publish`** | NO. L'URL contiene un UUID generato da Cloudflare. Quello attuale è `.../deploy_hooks/79409ee2-38c6-400b-a979-43c98f5da9a3` ed è quello che il webhook di Sanity chiama quando il titolare preme Pubblica. Il nuovo progetto ne genera uno **diverso**. |
| **Il sottodominio `aleksander-cecco.pages.dev`** | FORSE NO. Il nome del progetto decide il sottodominio, e un nome liberato non è detto torni disponibile subito in un altro account. Se non lo è, l'indirizzo di prova cambia. |
| **Le variabili d'ambiente** | In parte, vedi sotto. |
| **La configurazione di build** | SÌ, sta nel repository e nello snapshot: comando, cartella di uscita, cartella radice, ramo di produzione. |
| **Il collegamento a GitHub** | SÌ, si rifà: stesso repository, stesso ramo. |
| **Lo storico dei deployment** | NO, e non serve: il ripristino di una versione vecchia si fa ricostruendo da un commit. |
| **Domini personalizzati attaccati** | Nessuno. Non c'è niente da staccare. |

Quello che **non** sparisce, perché vive nel repository e non nel pannello:
`public/_redirects`, `public/_headers`, le Functions in `functions/`, e ogni
fotografia, che sta su `cdn.sanity.io`.

## Le variabili d'ambiente: quali si ricostruiscono e quali no

L'API di Cloudflare restituisce **oscurati** i valori marcati come segreti.
Vanno letti dal pannello PRIMA della cancellazione, non dopo.

**Ricostruibili da qui** (sono identificatori pubblici, stanno in `.env` e in
`.env.example`, e non sono segreti):

- `PUBLIC_SANITY_PROJECT_ID` — `lq2xg1yd`
- `PUBLIC_SANITY_DATASET` — `production`
- `PUBLIC_SANITY_API_VERSION` — `2026-03-01`
- `PUBLIC_SITE_URL` — nel nuovo progetto va messo `https://aleksandercecco.com`
- `PUBLIC_ALLOW_INDEXING` — oggi assente o `false`, e **deve restare così**
  finché non si decide di aprire il sito ai motori

**Da leggere a mano dal pannello** (o da dove sono già):

- `RESEND_API_KEY` — segreto. **Ma esiste una copia locale**:
  `~/.aleksander-cecco-resend.bak`, salvata l'11/08/2026, modo 600, contiene
  `RESEND_API_KEY`, `RESEND_FROM` e `ENQUIRY_TO_EMAIL`. Va confrontata con il
  pannello prima di fidarsene: se la chiave è stata rigenerata dopo l'11/08 la
  copia è vecchia e il pannello ha ragione.
- `RESEND_FROM` e `ENQUIRY_TO_EMAIL` — non sono segreti in sé, ma se sono stati
  inseriti come variabili cifrate tornano oscurati anche loro. Stessa copia
  locale.

## L'account sbagliato sul portatile

`wrangler whoami` su questa macchina risponde `ulissexchange@gmail.com`,
account `ee5a294124af281868199258a6a200a0`, con permesso `account (read)`.
**Non è nessuno dei due account che contano** e non può cancellare niente.

Non importa: `scripts/pages-purge.mjs` non usa la sessione di wrangler, usa
l'API REST con un `CLOUDFLARE_API_TOKEN` creato apposta. È la strada giusta
proprio perché non dipende da chi è loggato.

## Le due regole di questo trasloco

1. **Non si cancella niente finché lo snapshot non esiste e la chiave Resend
   non è in mano.**
2. **Il webhook di Sanity si ripunta nella stessa seduta.** È il guasto che
   marcisce in silenzio: il titolare preme Pubblica, non succede niente, e
   pensa che il sito sia rotto.
