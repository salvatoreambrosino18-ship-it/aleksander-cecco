/*
  «SU ORDINAZIONE» ESCE DALLE DESCRIZIONI CHE ABBIAMO SCRITTO NOI.

    node scripts/patch-available-now.mjs            dice cosa farebbe
    node scripts/patch-available-now.mjs --write    lo scrive nel database

  LA DECISIONE È SUA (2026-08-16, sezione 131): **disponibile subito è quello
  che dice il sito.** Ogni pagina di un capo diceva «DISPONIBILE SUBITO.» e una
  riga sotto prometteva che il pezzo sarebbe stato FATTO dopo l'ordine. Due
  affermazioni sulle condizioni di vendita che non possono essere vere insieme,
  sulla pagina dove uno si impegna.

  QUESTO SCRIPT TOCCA SOLO LE FRASI NOSTRE. Due capi — Monumentus Pants e
  Monumentus Lux — hanno una descrizione italiana che finisce con «Su
  ordinazione. Lavorato a mano in Italia.» Quella descrizione italiana è
  segnata `descriptionIt` fra i campi inventati, cioè è una NOSTRA traduzione:
  si può correggere.

  QUELLA INGLESE NO, ED È IL PUNTO IMPORTANTE. Sugli stessi due capi l'inglese
  dice «Made by order. Handcrafted in Italy.» e NON è segnata come nostra: sono
  parole sue. Restano esattamente dove sono. Finché non le cambia lui, la
  versione inglese di quelle due pagine continua a dire una cosa che l'italiana
  non dice piu — e questo va detto a lui, non risolto qui.

  TOGLIE UNA FRASE E BASTA. Niente riscritture, niente aggiunte: sparisce «Su
  ordinazione.» e il resto della descrizione resta parola per parola.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");

/* La frase da togliere, con lo spazio che si porta dietro. */
const PHRASE = /\s*Su ordinazione\.\s*/;

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
  /* groq */ `*[_type == "garment" && defined(description.it)]{_id, name, "slug": slug.current, description, inventedFields}`,
);

const tx = client.transaction();
const rows = [];
const refused = [];
let touched = 0;

for (const g of garments) {
  const it = g.description?.it;
  if (!it || !PHRASE.test(it)) continue;

  /*
    IL CONTROLLO CHE CONTA. Se la descrizione italiana non è segnata come
    nostra, è sua, e non si tocca: si stampa e basta. Un campo suo che
    contraddice una sua decisione è comunque una domanda per lui, non un
    lavoro per noi.
  */
  const ours = (g.inventedFields ?? []).some((f) => f === "descriptionIt" || f === "description");
  if (!ours) {
    refused.push({capo: g.name ?? g.slug, perche: "descrizione italiana SUA: non si tocca"});
    continue;
  }

  /* Letto intero, modificato, riscritto intero (sezione 78). */
  const next = {...g.description, it: it.replace(PHRASE, " ").replace(/\s+/g, " ").trim()};
  rows.push({
    capo: g.name ?? g.slug,
    prima: `…${it.slice(-58)}`,
    dopo: `…${next.it.slice(-58)}`,
  });
  touched++;
  tx.patch(g._id, (p) => p.set({description: next}));
}

if (rows.length) console.table(rows);
if (refused.length) console.table(refused);
if (!rows.length && !refused.length) console.log("\n  Nessuna descrizione italiana dice «Su ordinazione».\n");

if (!WRITE) {
  console.log(`\n  PROVA. ${touched} descrizioni da cambiare. Rilancia con --write per salvarlo.\n`);
} else if (touched === 0) {
  console.log("\n  Niente da cambiare.\n");
} else {
  await tx.commit();
  const anon = createClient({
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.PUBLIC_SANITY_DATASET,
    apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
    useCdn: false,
    perspective: "published",
  });
  await new Promise((r) => setTimeout(r, 2000));
  const left = await anon.fetch(
    /* groq */ `*[_type == "garment" && description.it match "*Su ordinazione*"].name`,
  );
  if (left.length > 0) {
    console.error(`\n  ATTENZIONE: lo dicono ancora: ${left.join(", ")}\n`);
    process.exit(1);
  }
  console.log(`\n  Salvato su ${touched} descrizioni, e il sito non lo dice più.\n`);
}
