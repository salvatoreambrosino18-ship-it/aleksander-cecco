/*
  LA RIGA SUL RESO DICE COSA DICE LA LEGGE.

    node scripts/patch-returns-line.mjs            dice cosa farebbe
    node scripts/patch-returns-line.mjs --write    lo scrive nel database

  PERCHE' (2026-08-17, sezione 137). `shippingReturns` diceva «Per un reso,
  scrivici e lo organizziamo insieme». Era una frase NOSTRA, scritta quando
  sul sito non esisteva nessun documento legale, e faceva quello che si fa
  quando non si sa: prometteva gentilezza al posto di un fatto.

  ADESSO IL FATTO C'E'. Le condizioni di vendita dell'avvocato dicono tre cose
  che cambiano una decisione d'acquisto, e la vecchia riga non ne diceva
  nessuna:

    - quattordici giorni per recedere;
    - contati dal giorno in cui il consumatore prende possesso fisico del
      capo, non dall'ordine;
    - il costo diretto della restituzione e' a carico del consumatore.

  L'ULTIMO E' IL PUNTO. «Spedizione gratuita in tutto il mondo sopra i 500
  euro» sta sopra o accanto a questa riga su ogni pagina che vende, e da sola
  insegna che anche il ritorno sia gratis. Non lo e'. Una riga che invita a
  scrivere non corregge quella lettura: la lascia scoprire dopo.

  «DA QUANDO RICEVI IL CAPO» E' LA TRADUZIONE DI «dal giorno in cui acquisisce
  il possesso fisico del prodotto». E' piu' corta e vuol dire la stessa cosa a
  chi compra. Il testo integrale resta quello dell'avvocato, a un link di
  distanza, e questa riga non lo sostituisce.

  RESTA NOSTRA E RESTA SEGNATA. `shippingReturns` e' gia' in `inventedCopy` e
  ci rimane: il titolare puo' riscriverla, e launch-check continua a contarla
  fra le cose ancora nostre.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");

const NEXT = {
  it: "Quattordici giorni per cambiare idea, da quando ricevi il capo. La spedizione del reso è a tuo carico.",
  en: "Fourteen days to change your mind, from the day you receive the piece. Return shipping is at your expense.",
};

/*
  I DUE GUARDIANI DI QUESTO SCRIPT, entrambi nati da errori gia' commessi.

  1. NIENTE APOSTROFI AL POSTO DEGLI ACCENTI. Una patch precedente scrisse
     «e'» e «cosi'» dentro un campo live perche' il file sorgente evitava gli
     accenti per prudenza. In un commento va bene; in una frase che il sito
     mostra, no.
  2. NIENTE DUE PUNTI E NIENTE TRATTINI (sezione 134). Questa riga e' nostra,
     quindi la regola vale. I testi dell'avvocato ne sono esenti, questa no.
*/
for (const [lang, line] of Object.entries(NEXT)) {
  if (/[a-z]'(\s|$|\.)/i.test(line) && lang === "it") {
    console.error(`\n  ${lang}: sembra un accento scritto con l'apostrofo.\n`);
    process.exit(1);
  }
  if (/:|—|–| - /.test(line)) {
    console.error(`\n  ${lang}: due punti o trattino in una frase nostra.\n`);
    process.exit(1);
  }
}

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

const settings = await client.fetch(/* groq */ `*[_id == "siteSettings"][0]{_id, shippingReturns}`);
const before = settings?.shippingReturns ?? {};
const rows = [];

for (const lang of ["it", "en"]) {
  if (before[lang] !== NEXT[lang]) {
    rows.push({lingua: lang, prima: before[lang] ?? "(vuoto)", dopo: NEXT[lang]});
  }
}

console.log("\n  shippingReturns, su /contact, nel carrello e sul modulo d'ordine");
console.table(rows.length ? rows : [{lingua: "-", prima: "-", dopo: "già a posto"}]);

if (!WRITE || rows.length === 0) {
  console.log(rows.length ? "\n  PROVA. Rilancia con --write per salvarlo.\n" : "\n  Niente da fare.\n");
} else {
  await client
    .patch(settings._id)
    .set({shippingReturns: {_type: "localeText", it: NEXT.it, en: NEXT.en}})
    .commit();

  /* Riletto da anonimo, come ogni altra patch: pubblicato o non è successo. */
  const anon = createClient({
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.PUBLIC_SANITY_DATASET,
    apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
    useCdn: false,
    perspective: "published",
  });
  await new Promise((r) => setTimeout(r, 2000));
  const now = await anon.fetch(/* groq */ `*[_id == "siteSettings"][0].shippingReturns`);
  const wrong = ["it", "en"].filter((l) => now?.[l] !== NEXT[l]);
  if (wrong.length) {
    console.error(`\n  ATTENZIONE: non risulta pubblicato in ${wrong.join(", ")}\n`);
    process.exit(1);
  }
  console.log("\n  Salvato, e il sito lo dice.\n");
}
