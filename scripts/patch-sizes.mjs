/*
  LE TAGLIE DI OGNI CAPO, messe una volta sola.

    node scripts/patch-sizes.mjs            dice cosa farebbe
    node scripts/patch-sizes.mjs --write    lo scrive nel database

  LA DECISIONE È DEL TITOLARE (2026-08-16): XS, S, M, L su tutto, e niente su
  misura. Questo script la applica ai capi che sono VESTITI, e mette TAGLIA
  UNICA sui cinque oggetti che una taglia di vestito non descrive.

  PERCHÉ NON TUTTI E TREDICI PRENDONO XS-S-M-L, e ognuno è stato guardato
  invece che dedotto dal nome:

  - STYRAX e STYRAX RED GOAT — **le sue parole, non le nostre**. La descrizione
    inglese, che è sua e non è segnata come nostra, dice "It features an
    adjustable choker for a secure, costumizable fit ... One Size." Metterci
    XS-S-M-L significherebbe che il selettore della taglia contraddice il
    paragrafo che gli sta sopra, sulla stessa pagina.
  - VESPER — **è una borsa.** Una borsa in pelle nera appesa a una catena. Una
    borsa non ha una taglia S.
  - VERTEX — **è un cappello**, fotografato sul banco accanto alla macchina da
    cucire.
  - GLOVYES — **sono ghette**, chiuse da cinghie e fibbie lungo tutta la gamba:
    si regolano addosso, esattamente come il choker dello Styrax.

  LE TRE LETTURE NOSTRE SONO SEGNATE COME NOSTRE. Styrax e Styrax Red Goat
  vengono da una frase sua, quindi non portano nessun segno. Vesper, Vertex e
  Glovyes sono una NOSTRA lettura di una fotografia — giusta, crediamo, ma pur
  sempre nostra — quindi `sizes` entra in `inventedFields` su quei tre e
  `npm run launch-check` continua a chiederglielo finché non conferma. È lo
  stesso trattamento della fotografia dei contatti (sezione 108).

  IDEMPOTENTE: riscrive gli stessi valori senza duplicare niente, e non tocca
  nessun altro campo del capo.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");

/*
  XS S M L, e non XL. È quello che ha deciso lui, alla lettera. Se un giorno
  aggiunge XL, si aggiunge qui e si rilancia.
*/
const CLOTHES = ["XS", "S", "M", "L"];
const ONE = ["ONE"];

/** slug -> [taglie, perché, è una nostra scelta?] */
const PLAN = {
  /* vestiti */
  "capo-01": [CLOTHES, "camicia in pelle", false],
  "capo-02": [CLOTHES, "camicia in pelle (Oblivion)", false],
  "capo-03": [CLOTHES, "gilet", false],
  "capo-05": [CLOTHES, "pantaloni", false],
  "capo-07": [CLOTHES, "pantaloni ampi", false],
  "capo-12": [CLOTHES, "top con collo alto", false],
  ghezard: [CLOTHES, "giacca", false],
  severya: [CLOTHES, "minigonna", false],
  /* le sue parole dicono taglia unica */
  styrax: [ONE, 'sua descrizione: "adjustable choker ... One Size"', false],
  "styrax-red": [ONE, 'sua descrizione: "adjustable choker ... One Size"', false],
  /* oggetti che una taglia di vestito non descrive: NOSTRA lettura, segnata */
  "capo-09": [ONE, "è una borsa", true],
  "capo-14": [ONE, "è un cappello", true],
  glovyes: [ONE, "ghette regolabili con cinghie e fibbie", true],
};

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

if (WRITE && !process.env.SANITY_WRITE_TOKEN) {
  console.error("\n  Manca SANITY_WRITE_TOKEN in .env, e con --write serve.\n");
  process.exit(1);
}

const garments = await client.fetch(
  /* groq */ `*[_type == "garment"]{_id, name, "slug": slug.current, sizes, availability, price, inventedFields}`,
);

const tx = client.transaction();
const rows = [];
let touched = 0;

for (const g of garments) {
  const plan = PLAN[g.slug];
  if (!plan) {
    /*
      Un capo non nel piano è un capo che non si può comprare: Rubedo, che non
      ha prezzo, e Monumentus Lux, che è ritirato. Una taglia su un capo che
      nessuno può ordinare non serve a niente e non si mette.
    */
    rows.push({capo: g.name ?? g.slug, taglie: "-", perche: "non acquistabile, saltato"});
    continue;
  }
  const [sizes, why, ours] = plan;

  const before = (g.sizes ?? []).join(" ");
  const after = sizes.join(" ");

  /*
    IL SEGNO SEGUE LA SCELTA, IN TUTTE E DUE LE DIREZIONI. Se è una nostra
    lettura, `sizes` entra fra i campi inventati; se è una decisione sua, ne
    esce, così un giro precedente non lascia un segno che non vale più.
  */
  const flags = new Set(g.inventedFields ?? []);
  if (ours) flags.add("sizes");
  else flags.delete("sizes");
  const inventedFields = [...flags];

  rows.push({
    capo: g.name ?? g.slug,
    prima: before || "(vuoto)",
    taglie: after,
    nostra: ours ? "SÌ, segnata" : "no",
    perche: why,
  });

  if (before === after && (g.inventedFields ?? []).join() === inventedFields.join()) continue;
  touched++;
  tx.patch(g._id, (p) => p.set({sizes, inventedFields}));
}

console.table(rows);

if (!WRITE) {
  console.log(`\n  PROVA. ${touched} capi da cambiare. Rilancia con --write per salvarlo.\n`);
} else if (touched === 0) {
  console.log("\n  Niente da cambiare: erano già tutti a posto.\n");
} else {
  await tx.commit();
  console.log(`\n  Salvato su ${touched} capi.\n`);
  /*
    E CONTROLLA CHE IL SITO LO VEDA, senza token, come lo legge la build. Una
    scrittura andata a buon fine che il lettore anonimo non vede è il guasto che
    check-videos.mjs ha già trovato una volta.
  */
  const anon = createClient({
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.PUBLIC_SANITY_DATASET,
    apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
    useCdn: false,
    perspective: "published",
  });
  await new Promise((r) => setTimeout(r, 2000));
  const missing = await anon.fetch(
    /* groq */ `*[_type == "garment" && count(coalesce(sizes, [])) == 0 && slug.current in $slugs].name`,
    {slugs: Object.keys(PLAN)},
  );
  if (missing.length > 0) {
    console.error(`\n  ATTENZIONE: il sito vede ancora senza taglia: ${missing.join(", ")}\n`);
    process.exit(1);
  }
  console.log("  E il sito le vede tutte.\n");
}
