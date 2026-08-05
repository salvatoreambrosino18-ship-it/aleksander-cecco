/*
  HIS FIRST REAL DESCRIPTIONS (section 72), verbatim, spelling and rhythm
  untouched — including "costumizable". English is his and approved; the
  Italian is OUR faithful translation and is flagged `descriptionIt` per
  piece until he approves it. The Oblivion measurements are real and replace
  the invented ones. Never reads Drive, never touches media, never deletes.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));
const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const STYRAX_EN = (color, avail) =>
  `This piece is made from a single whole Sheepskin with natural hair. It features an adjustable choker for a secure, costumizable fit plus waxed lacing at the attachment points. It moves like resin slowly, Inevitably you become one Creature with it. One Size. ${avail}. Color: ${color}. Handmade piece each one is unique.`;
const STYRAX_IT = (color, avail) =>
  `Questo pezzo è realizzato da un'unica pelle intera di montone con pelo naturale. Ha un choker regolabile per una vestibilità sicura e personalizzabile, più lacci cerati nei punti di attacco. Si muove come resina, lentamente: inevitabilmente diventi una sola Creatura con lui. Taglia unica. ${avail}. Colore: ${color}. Pezzo fatto a mano, ognuno è unico.`;
const MONUMENTUS_EN =
  "This piece is made from a Veg - Tanned Sheepskin leather. Assembled with a semicircular raw cut, following natural shapes to be Comfortable and Monumental. Each creation is one of a kind, no two are the same. Made by order. Handmade in Italy.";
const MONUMENTUS_IT =
  "Questo pezzo è realizzato in pelle di montone conciata al vegetale. Assemblato con un taglio grezzo semicircolare, seguendo le forme naturali per essere Comodo e Monumentale. Ogni creazione è un pezzo unico, non ce ne sono due uguali. Su ordinazione. Fatto a mano in Italia.";

const PATCHES = {
  "capo-02": {
    description: {
      en: "Washed lambskin leather shirt, in black faded colour. 500 handmade scar-stitches, and the Oblivion hole on the back.",
      it: "Camicia in pelle di agnello lavata, in nero sbiadito. 500 punti-cicatrice fatti a mano, e il foro Oblivion sulla schiena.",
    },
    measurements: "Sleeves - 73 cm, Length - 56 cm, Shoulders - 40 cm, Armpit - 40 cm",
    clear: ["description", "measurements"],
  },
  "styrax-red": {
    description: {en: STYRAX_EN("Red", "One of One"), it: STYRAX_IT("Rosso", "Pezzo unico")},
    clear: ["description"],
  },
  "styrax": {
    description: {en: STYRAX_EN("Black", "Available"), it: STYRAX_IT("Nero", "Disponibile")},
    clear: [],
  },
  "capo-05": {description: {en: MONUMENTUS_EN, it: MONUMENTUS_IT}, clear: ["description"]},
  "capo-10": {description: {en: MONUMENTUS_EN, it: MONUMENTUS_IT}, clear: ["description"]},
  "capo-11": {description: {en: MONUMENTUS_EN, it: MONUMENTUS_IT}, clear: ["description"]},
};

for (const [slug, patch] of Object.entries(PATCHES)) {
  const doc = await client.fetch(
    `*[_type=="garment" && slug.current==$slug][0]{_id, inventedFields}`, {slug},
  );
  if (!doc) { console.error("MISSING:", slug); continue; }
  const flags = new Set(doc.inventedFields ?? []);
  for (const f of patch.clear) flags.delete(f);
  flags.add("descriptionIt"); // the Italian above is ours, every time
  const set = {
    "description.en": patch.description.en,
    "description.it": patch.description.it,
    inventedFields: [...flags],
  };
  if (patch.measurements) set.measurements = patch.measurements;
  await client.patch(doc._id).set(set).commit();
  console.log(`${slug}: description set, flags now [${[...flags].join(",")}]`);
}

// Confirmed by the owner: the name order is approved.
const s = await client.fetch(`*[_id=="siteSettings"][0]{inventedCopy}`);
const copy = (s.inventedCopy ?? []).filter((v) => v !== "aboutNameOrder");
await client.patch("siteSettings").set({inventedCopy: copy}).commit();
console.log("aboutNameOrder cleared");
