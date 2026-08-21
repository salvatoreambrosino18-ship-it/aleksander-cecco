/*
  LA PRIMA FOTO DI TIBIA CUT E TOMAR, RITAGLIATA PIÙ IN ALTO. 21/08/2026.

    node scripts/patch-hotspot-apertura.mjs            mostra cosa farebbe
    node scripts/patch-hotspot-apertura.mjs --write    lo fa

  IL PROBLEMA, visto sul sito pubblicato e non immaginato. Le fotografie sono
  verticali (3:4) e la finestra di un portatile è orizzontale (1440x900), quindi
  `object-fit: cover` tiene una fascia centrale alta il 47% dell'immagine. Il
  centro di un capo appeso è la cintura: le due pagine si aprivano su una
  distesa di pelle nera senza forma. Sul telefono lo stesso file si legge
  benissimo, perché lì l'immagine è più larga della finestra e il taglio è
  orizzontale, non verticale.

  IL RIMEDIO COSTA ZERO E NON SPENDE RISOLUZIONE: il punto focale. `object-position`
  esce da `poster.hotspot` (src/lib/image.ts), quindi y=0.35 alza la fascia e
  fa rientrare la gruccia in Tibia Cut e la catena in Tomar. Con il gancio in
  quadro l'occhio capisce che è un capo appeso; senza, è una texture.

  SCELTO GUARDANDO, non a occhio nudo sul numero: le quattro posizioni
  candidate (0.35 / 0.5 / 0.65 / 0.8) sono state ritagliate e messe a confronto.

  DA SAPERE PER DOPO: `scripts/lib/measure-overlay.mjs` misura la polarità sul
  ritaglio del TELEFONO, dove y non ha effetto. Quindi questo non invalida le
  misure fatte al caricamento, ma vuol dire che al desktop la banda sotto il
  marchio adesso è un'altra. Su queste due è un muro chiaro, cioè il caso facile.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");
const HOTSPOT = {_type: "sanity.imageHotspot", x: 0.5, y: 0.35, width: 0.6, height: 0.6};
const PLAN = [
  {slug: "tibia-cut", key: "m0", file: "TIBIA.CUT.WEBP", gains: "la gruccia e la cintura, non solo la pelle"},
  {slug: "tomar", key: "m0", file: "TOMAR.WEBP", gains: "la catena e il gancio, così si vede che è appeso"},
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

console.log(`\n  ${WRITE ? "SCRIVO" : "PROVA A VUOTO"} su ${process.env.PUBLIC_SANITY_PROJECT_ID}/${process.env.PUBLIC_SANITY_DATASET}\n`);

const tx = client.transaction();
for (const item of PLAN) {
  const g = await client.fetch(
    /* groq */ `*[_type == "garment" && slug.current == $s][0]{_id, name, "first": media[0]{_key, "file": poster.asset->originalFilename, "spot": poster.hotspot}}`,
    {s: item.slug},
  );
  if (!g?._id) {
    console.error(`  Non trovo ${item.slug}. Niente è stato scritto.\n`);
    process.exit(1);
  }
  if (g.first?._key !== item.key || g.first?.file !== item.file) {
    console.error(`  ${item.slug}: la prima foto non è quella che mi aspetto (${g.first?.file}, _key ${g.first?._key}). Niente è stato scritto.\n`);
    process.exit(1);
  }
  tx.patch(g._id, (p) => p.set({[`media[_key=="${item.key}"].poster.hotspot`]: HOTSPOT}));
  console.log(`  ${g.name}`);
  console.log(`    ${item.file}`);
  console.log(`    object-position  ${g.first.spot ? `${g.first.spot.x} ${g.first.spot.y}` : "50% 50% (nessun punto focale)"} -> 50% 35%`);
  console.log(`    al desktop rientra: ${item.gains}\n`);
}

if (!WRITE) {
  console.log("  Niente è stato scritto. Rilancia con --write.\n");
  process.exit(0);
}
await tx.commit();
console.log("  Fatto. Il webhook di Sanity fa ripartire la build.\n");
