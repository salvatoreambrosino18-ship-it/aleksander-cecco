/*
  IL VIDEO DI APERTURA VA IN LOOP, ED È IL TITOLARE CHE LO DICE.

    node scripts/patch-arrival-loop.mjs            dice cosa farebbe
    node scripts/patch-arrival-loop.mjs --write    lo scrive nel database

  LA DECISIONE (2026-08-16, sezione 131). Il clip di apertura parte, arriva alla
  fine e si ferma. Il controllo automatico ha ragione a dire che non dovrebbe
  andare in loop — dura 1.50 secondi, sotto la soglia dei tre — e il titolare
  l'ha guardato e ha deciso lo stesso: lo vuole in loop, e si prende lo stacco
  che si vede quando ricomincia.

  PERCHÉ NON SI TOCCA IL VERDETTO DEL CONTROLLO. Il modo più corto sarebbe stato
  scrivere `loops: true` dentro il documento `videoCheck` di quell'asset. Sarebbe
  stata una bugia in un posto che serve a dire la verità: quel documento è il
  risultato di una misura, e un verdetto scritto a mano dentro un registro di
  misure toglie valore a tutti gli altri. Il permesso sta invece SULLA
  FOTOGRAFIA, in un campo suo (`videoLoopAlways`), che lui può togliere quando
  vuole e che vale per quel video e basta.

  IL FUOCO NON SI TOCCA QUI. Sta in scripts/patch-arrival-crop.mjs, che è
  l'unico posto dove si decide cosa si vede della fotografia. Questo script
  scriveva anche quello, e due script che scrivono lo stesso campo sono due
  risposte alla stessa domanda: rilanciando questo si sarebbe riportato indietro
  il taglio senza che nessuno se ne accorgesse.

  LEGGE E RISCRIVE L'OGGETTO INTERO (sezione 78).
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");

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

const settings = await client.fetch(/* groq */ `*[_id == "siteSettings"][0]{_id, openingMedia}`);
if (!settings?.openingMedia?.video) {
  console.error("\n  L'apertura non ha un video. Niente da fare.\n");
  process.exit(1);
}

const media = structuredClone(settings.openingMedia);
const before = {loop: media.videoLoopAlways === true};

media.videoLoopAlways = true;

console.log("\n  La fotografia di apertura");
console.table([{campo: "videoLoopAlways", prima: before.loop, dopo: true}]);

if (!WRITE) {
  console.log("\n  PROVA. Rilancia con --write per salvarlo.\n");
} else {
  await client.patch(settings._id).set({openingMedia: media}).commit();

  const anon = createClient({
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.PUBLIC_SANITY_DATASET,
    apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
    useCdn: false,
    perspective: "published",
  });
  await new Promise((r) => setTimeout(r, 2000));
  const seen = await anon.fetch(
    /* groq */ `*[_id == "siteSettings"][0].openingMedia{videoLoopAlways}`,
  );
  if (seen?.videoLoopAlways !== true) {
    console.error(`\n  ATTENZIONE: il sito legge ${JSON.stringify(seen)}.\n`);
    process.exit(1);
  }
  console.log("\n  Salvato, e il sito lo vede.\n");
}
