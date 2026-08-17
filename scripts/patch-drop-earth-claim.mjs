/*
  VIA LA FRASE SULLA PELLE CHE «TORNA NELLA TERRA».

    node scripts/patch-drop-earth-claim.mjs            dice cosa farebbe
    node scripts/patch-drop-earth-claim.mjs --write    lo scrive nel database

  PERCHE' (2026-08-16, sezione 135, sua decisione). Su /process una riga NOSTRA
  diceva che la pelle conciata al vegetale «alla fine torna nella terra». E'
  una dichiarazione di biodegradabilita', e quanto sia vera dipende dalle
  finiture, dalle tinture e da come il capo e' stato trattato. Non abbiamo la
  prova, e dal 2026 chi vende in Europa deve averla.

  E' esattamente il tipo di frase che la sezione 133 si e' rifiutata di
  scrivere per la sezione nuova su Chi siamo. Era gia' online da prima, ed e'
  stata segnalata invece di essere cancellata di nascosto; il titolare ha
  deciso di toglierla piuttosto che provare a qualificarla.

  E SE NE VA ANCHE LA FRASE CHE LE FACEVA DA CONTRASTO, ed e' il punto
  delicato di questa modifica. Subito dopo veniva «Quella conciata al cromo
  no.», e quel «no» rispondeva alla terra. Togliendo solo la prima meta', il
  «no» si sarebbe riattaccato a «si nutre, si ripara, si ritinge» e avrebbe
  detto una cosa NUOVA e non verificata, perche' anche la pelle al cromo si
  nutre e si ripara. Togliere una dichiarazione e lasciarne nascere un'altra
  per sbaglio non e' toglierla.

  QUELLO CHE RESTA e' la durata, che e' una proprieta' dell'oggetto e non un
  confronto con nessuno.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");

const REWRITES = [
  ["La pelle conciata al vegetale si nutre, si ripara, si ritinge, e alla fine torna nella terra. Quella conciata al cromo no. ",
   "La pelle conciata al vegetale si nutre, si ripara e si ritinge. "],
  ["Vegetable-tanned leather can be fed, repaired and re-dyed, and at the end it goes back into the ground. Chrome-tanned leather does not. ",
   "Vegetable-tanned leather can be fed, repaired and re-dyed. "],
];

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

const settings = await client.fetch(/* groq */ `*[_id == "siteSettings"][0]{_id, processNotes}`);
const notes = structuredClone(settings.processNotes ?? []);
const rows = [];

for (const note of notes) {
  for (const lang of ["it", "en"]) {
    const before = note?.text?.[lang];
    if (typeof before !== "string") continue;
    let after = before;
    for (const [from, to] of REWRITES) after = after.split(from).join(to);
    if (after !== before) {
      note.text[lang] = after;
      rows.push({lingua: lang, dopo: `…${after.slice(0, 78)}…`});
    }
  }
}

console.log("\n  /process, la riga QUELLO CHE RESTA");
console.table(rows.length ? rows : [{lingua: "-", dopo: "niente da togliere"}]);

if (!WRITE || rows.length === 0) {
  console.log(rows.length ? "\n  PROVA. Rilancia con --write per salvarlo.\n" : "\n  Niente da fare.\n");
} else {
  await client.patch(settings._id).set({processNotes: notes}).commit();

  const anon = createClient({
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.PUBLIC_SANITY_DATASET,
    apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
    useCdn: false,
    perspective: "published",
  });
  await new Promise((r) => setTimeout(r, 2000));
  const blob = JSON.stringify(await anon.fetch(/* groq */ `*[_id == "siteSettings"][0].processNotes`));
  const left = ["torna nella terra", "goes back into the ground", "conciata al cromo no", "Chrome-tanned leather does not"]
    .filter((w) => blob.includes(w));
  if (left.length) {
    console.error(`\n  ATTENZIONE: il sito lo dice ancora: ${left.join(", ")}\n`);
    process.exit(1);
  }
  console.log("\n  Salvato, e il sito non lo dice piu'.\n");
}
