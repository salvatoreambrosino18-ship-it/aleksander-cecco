/*
  DOVE SI TIENE LA FOTOGRAFIA DI APERTURA QUANDO LO SCHERMO LA TAGLIA.

    node scripts/patch-arrival-crop.mjs            dice cosa farebbe
    node scripts/patch-arrival-crop.mjs --write    lo scrive nel database

  DOV'È IL SOGGETTO, guardando il video invece della fotografia (2026-08-16,
  sezione 132, sua correzione).

  Il punto di quel clip è IL LIQUIDO CHE COLA sul muro, e sta in basso: le
  striature scure scendono sul cemento sotto le due mani, fra il 75% e il 94%
  dell'altezza del fotogramma. Con il fuoco a 0.55 la finestra del desktop
  mostrava dal 32% al 74% — cioè la giacca e le mani, e del liquido niente.

  COME SI CALCOLA LA FASCIA. Su uno schermo largo se ne vede il 42%
  dell'altezza; `object-position: 50% Y` mette Y come frazione di quello che
  avanza, quindi la fascia visibile è [0.58 * Y, 0.58 * Y + 0.42]. A 0.90 fa
  52% - 94%: ci stanno dentro tutte e due le mani che stringono E tutta la
  colata sul muro.

  SUL TELEFONO QUESTO NON CAMBIA NIENTE, e va detto ogni volta. A 390 la
  fotografia viene scalata sull'ALTEZZA (743 su 743) e tagliata solo in
  larghezza: verticalmente non avanza niente, quindi la Y non ha alcun effetto e
  il liquido si è sempre visto. Questa correzione vale solo per gli schermi
  larghi, che erano gli unici rotti.

  IL VIDEO SEGUE LA FOTOGRAFIA. `MediaSurface` dà al <video> lo stesso
  `object-position` che dà all'immagine, letto da `poster.hotspot`: un solo
  punto governa tutti e due, ed è quello che lui trascina nello studio.

  IL FUOCO È UN CAMPO SUO. Sta nello studio, sulla fotografia, e si sposta
  trascinando un punto. Questo script corregge un valore che avevamo messo noi
  con l'import (width 0.9, height 0.5, la forma che genera lo script), non una
  sua scelta: se lo sposta lui, vince lui.

  LEGGE E RISCRIVE L'OGGETTO INTERO. Mai indirizzare un oggetto annidato con un
  percorso puntato in una mutation di Sanity: nella sezione 78 così sono stati
  sostituiti quattro media con una stringa.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");
const Y = 0.90;

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
if (!settings?.openingMedia) {
  console.error("\n  siteSettings.openingMedia non c'è. Niente da fare.\n");
  process.exit(1);
}

/* Letto intero, modificato, riscritto intero. */
const media = structuredClone(settings.openingMedia);
const spot = (existing) => ({
  _type: "sanity.imageHotspot",
  x: existing?.x ?? 0.5,
  y: Y,
  width: existing?.width ?? 0.9,
  height: existing?.height ?? 0.5,
});

const before = {
  strayField: media.hotspot ? "presente (da togliere)" : "assente",
  poster: media.poster?.hotspot?.y,
};

/*
  UN PUNTO SOLO, SULL'IMMAGINE. `objectPosition()` legge
  `media.poster.hotspot`, ed è l'unico che esiste: l'oggetto `media` NON ha un
  campo `hotspot` nel suo schema.

  La prima versione di questo script ne scriveva uno anche lì "per coerenza", e
  sarebbe stato un campo fuori schema nel pannello del titolare — di quelli che
  lo studio segnala in rosso e che nessuno sa più perché ci sono. Trovato
  guardando lo schema invece che il documento.
*/
if (media.poster) media.poster.hotspot = spot(media.poster.hotspot);
/* e toglie quello che il primo giro aveva scritto per sbaglio */
delete media.hotspot;

console.log("\n  Fuoco verticale della fotografia di apertura");
console.table([
  {campo: "openingMedia.poster.hotspot.y", prima: before.poster, dopo: media.poster?.hotspot?.y},
  {campo: "openingMedia.hotspot (fuori schema)", prima: before.strayField, dopo: "assente"},
]);

if (!WRITE) {
  console.log("\n  PROVA. Rilancia con --write per salvarlo.\n");
} else {
  await client.patch(settings._id).set({openingMedia: media}).commit();
  const check = await client
    .withConfig({useCdn: false, token: undefined, perspective: "published"})
    .fetch(/* groq */ `*[_id == "siteSettings"][0].openingMedia.poster.hotspot.y`);
  if (check !== Y) {
    console.error(`\n  ATTENZIONE: salvato ${Y} ma il sito legge ${check}.\n`);
    process.exit(1);
  }
  console.log(`\n  Salvato, e il sito lo vede: ${check}.\n`);
}
