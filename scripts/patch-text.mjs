/*
  TEXT-ONLY PATCHES, for when the Drive is unavailable.

    npm run patch-text

  The import is the source of truth and stays so: everything here is ALSO in
  `scripts/import-photos.mjs`, so a later import produces exactly this. What
  this script buys is independence from the Google Drive mount, which stalled
  completely on 2026-08-04 (an `ls` of the folder hung for minutes) and took the
  import down with it, because the import must read every photograph before it
  can write a single word.

  It touches ONLY fields that carry no photograph: text, names, flags. It never
  writes media, never deletes a document, and never reads the Drive.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  useCdn: false,
});

/*
  His approved text, verbatim, including the origin passage supplied 2026-08-04.

  WITH ONE MARKED EXCEPTION (2026-08-13, section 108): "Made to Measure, " /
  "Su Misura, " was DELETED from the making line, because the shop stopped
  selling made to measure on 2026-08-12 (section 98) and the sentence was false
  on a page a buyer reads. The originals were:

    In 100% vegetable-tanned leather, MADE TO MEASURE, handmade in South Italy.
    In pelle 100% conciata al vegetale, SU MISURA, fatta a mano nel Sud Italia.

  (Capitalised here only so a search-and-replace over this file cannot quietly
  eat the record of what it changed. He wrote them "Made to Measure" and
  "Su Misura".)

  The edit is flagged `aboutMadeToMeasure` in inventedCopy below, exactly as the
  name order was, and launch-check counts it until he approves the shorter line.
  If this file goes back to the original strings, an import silently republishes
  the false claim.
*/
const EN = {
  brand:
    "Aleksander Cecco is born to tell what is slowly being forgotten: nature and its unpredictable forms, its textures, its imperfect perfection.\nThe project lives between alchemy, esotericism and the primal link between human being and nature.",
  creature:
    'We call our pieces "Creature" because for us they are living.\nLiving textures. Entities with their own breath, born from the earth and worn on the body.',
  making:
    "In 100% vegetable-tanned leather, handmade in South Italy. Every process is Artisan.\nA work of repetition, patience, and precision.\nThis is what makes every piece similar, but never identical.",
  origin:
    "The project began as an experimental line between the knowledge and vision of the two creators, Ciro Cecco and Ferdinando Palmieri, in collaboration with Ferdressed.",
};
const IT = {
  brand:
    "Aleksander Cecco nasce per raccontare ciò che lentamente si sta dimenticando: la natura e le sue forme imprevedibili, le sue texture, la sua perfezione imperfetta.\nIl progetto vive tra alchimia, esoterismo e il legame primordiale tra essere umano e natura.",
  creature:
    'Chiamiamo i nostri pezzi "Creature" perché per noi sono vive.\nTexture viventi. Entità con un respiro proprio, nate dalla terra e indossate sul corpo.',
  making:
    "In pelle 100% conciata al vegetale, fatta a mano nel Sud Italia. Ogni processo è artigianale.\nUn lavoro di ripetizione, pazienza e precisione.\nÈ questo che rende ogni pezzo simile, ma mai identico.",
  // OURS, flagged as aboutOrigin. The names and Ferdressed are proper nouns.
  origin:
    "Il progetto nasce come linea sperimentale tra la conoscenza e la visione dei due creatori, Ciro Cecco e Ferdinando Palmieri, in collaborazione con Ferdressed.",
};

const about = {
  _type: "localeText",
  en: [EN.brand, EN.creature, EN.making, EN.origin].join("\n\n"),
  it: [IT.brand, IT.creature, IT.making, IT.origin].join("\n\n"),
};

const settings = await client.fetch(`*[_id == "siteSettings"][0]{inventedCopy}`);
const invented = new Set(settings?.inventedCopy ?? []);
invented.add("aboutOrigin");
// The one edit we have made to his own sentence (section 108). It stays flagged
// until he approves the shorter line, and this script writes `about`, so it has
// to carry the flag or a run of it would launder the edit.
invented.add("aboutMadeToMeasure");

await client
  .patch("siteSettings")
  .set({
    about,
    creators: ["Ciro Cecco", "Ferdinando Palmieri"],
    partnerName: "Ferdressed",
    partnerUrl: "https://ferdressed.com",
    inventedCopy: [...invented],
  })
  .commit();
console.log("site settings: about + creators + partner written");

/*
  THE 1 OF 1 PIECES ARE PRIVATE COMMISSIONS (owner, 2026-08-04). Each was made
  once, to someone's measurements. They can be bought only as they are, so the
  state must not be one that offers a remake.
*/
const oneOfOne = ["severya", "styrax-red"];
for (const slug of oneOfOne) {
  const doc = await client.fetch(`*[_type == "garment" && slug.current == $slug][0]{_id}`, {slug});
  if (!doc) continue;
  await client
    .patch(doc._id)
    .set({availability: "unique"})
    .commit();
  console.log(`${slug}: availability -> unique`);
}

/*
  WHO A PIECE IS FOR (2026-08-04), a catalogue filter and nothing else.

  THE EVIDENCE IS HIS, AND IT IS SUPERSEDED, which is why every value here is
  FLAGGED. On 2026-08-03 he described his folders as "MONUMENTUS = men's co-ord
  sets" and "OBLIVION = women's shirts". Those folders no longer exist: the
  2026-08-04 reorganisation files by status instead, and nothing in the current
  structure names a gender. So this applies his statement only where the piece
  still carries that family NAME, and leaves everything else unset.

  Unset is not a gap to fill later by guessing: an unset piece shows under every
  filter, which is the honest display when nobody has said.
*/
const WORN_BY = {
  "capo-02": "women", // Oblivion, and OBLIVION was his women's shirts
  "capo-03": "men", // Monumentus Vest
  "capo-04": "men", // Monumentus Vest
  "capo-05": "men", // Monumentus Pants
  "capo-10": "men", // Monumentus Pants (Lux)
  "capo-11": "men", // Monumentus Lux
};

for (const [slug, wornBy] of Object.entries(WORN_BY)) {
  const doc = await client.fetch(
    `*[_type == "garment" && slug.current == $slug][0]{_id, inventedFields}`,
    {slug},
  );
  if (!doc) continue;
  const fields = new Set(doc.inventedFields ?? []);
  fields.add("wornBy");
  await client.patch(doc._id).set({wornBy, inventedFields: [...fields]}).commit();
  console.log(`${slug}: wornBy -> ${wornBy} (flagged)`);
}

const counts = await client.fetch(
  `{"unique": count(*[_type=="garment" && availability=="unique"]),
    "sold": count(*[_type=="garment" && availability=="notOffered"]),
    "creators": count(*[_id=="siteSettings"][0].creators),
    "wornSet": count(*[_type=="garment" && defined(wornBy)]),
    "wornUnset": count(*[_type=="garment" && !defined(wornBy)])}`,
);
console.log(counts);
