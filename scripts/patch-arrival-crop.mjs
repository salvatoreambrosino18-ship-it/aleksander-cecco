/*
  DOVE SI TIENE LA FOTOGRAFIA DI APERTURA QUANDO LO SCHERMO LA TAGLIA.

    node scripts/patch-arrival-crop.mjs            dice cosa farebbe
    node scripts/patch-arrival-crop.mjs --write    lo scrive nel database

  IL PROBLEMA, misurato e poi guardato (2026-08-16, sezione 130).

  La fotografia di apertura è verticale: 1440 x 2560, cioè 9:16, scattata col
  telefono. Su un telefono la finestra è 9:16 anche lei, quindi non si taglia
  quasi niente e la composizione si legge tutta — la giacca appesa al gancio,
  le due braccia, le mani che la prendono.

  Su un desktop la stessa fotografia sta in una finestra larga 1440 e alta
  88svh, cioè 792: un rettangolo 1.82:1. Per coprirlo, `object-fit: cover` la
  scala sulla LARGHEZZA e ne mostra 792 pixel su 2560 — **il 31% dell'altezza,
  e il 69% non si vede.**

  Con il fuoco al 42% quella striscia cadeva sul corpo della giacca: una massa
  nera senza un soggetto dentro, con un avambraccio che entra dal basso. Non si
  capiva cosa fosse. Al 52% la stessa striscia contiene il pendaglio di legno,
  il corpo della giacca E la mano che la afferra, che è la fotografia.

  QUATTRO POSIZIONI RESE E GUARDATE, non calcolate: 42 (quella di prima), 52,
  58, 64. A 58 e 64 le mani si leggono benissimo e la giacca sparisce; a 42 la
  giacca c'è e non si capisce; **52 è l'unica che tiene tutte e due.**

  IL TELEFONO NON CAMBIA DI UN PIXEL, ed è il motivo per cui questa correzione
  si può fare qui. Su 390x844 la fotografia viene scalata sull'ALTEZZA (743 su
  743) e ritagliata di 27 pixel in larghezza: verticalmente non avanza niente,
  quindi la coordinata Y del fuoco non ha nessun effetto. Cambiarla tocca solo
  gli schermi larghi, che sono quelli rotti.

  QUESTO NON RIPARA LA CAUSA, e va detto: una fotografia 9:16 su uno schermo
  16:9 mostrerà sempre un terzo di sé. Serve un fotogramma orizzontale, o 4:5,
  per l'apertura su desktop — è la voce 21 della LISTA APERTA, ed è sua.

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
const Y = 0.52;

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
