/*
  TWO CORRECTIONS TO THE CATALOGUE, both the owner's (2026-08-13, section 118).

    node scripts/fix-catalogue.mjs            DRY
    node scripts/fix-catalogue.mjs --write

  1. MONUMENTUS PANTS AND MONUMENTUS LUX ARE ONE GARMENT, entered twice.
     `capo-10` holds five frames of the cream leather trousers on a hanger —
     front, back, the welt-pocket detail, hanging on the rail. `capo-11` holds
     four of the same trousers WORN. Same colour, same drawstring, same zip,
     same stage, same price. Verified by putting the two sets side by side.

     They merge into `capo-11`, which is the one already called Monumentus Lux:
     its four worn frames first, then capo-10's five, so the piece opens on a
     body and then shows itself alone. **Every photograph from both survives.**
     `capo-10` is then deleted, because a duplicate left in place is a second
     product page for one garment and the shop counts it twice.

     THE OTHER "Monumentus Pants" IS NOT THIS ONE. `capo-05` is the BLACK pair,
     stage tenebrae, and it is untouched. Checked before merging, because two
     documents sharing a name is exactly how the wrong one gets deleted.

  2. NOCTE IS NOT FOR SALE. The owner says it was an experiment. So it stops
     being a garment — which is what gives a thing a price, a size and an
     enquiry form — and becomes an `archivePiece`, the gallery type that exists
     for photographs that are not products. Its two frames land on /process,
     which is where the gallery renders.

  BOTH ARE DESTRUCTIVE, so both print what they will do first and neither runs
  without --write. Nothing else in the dataset references either document; that
  is checked at the top rather than assumed.
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
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

const log = (...a) => console.log(" ", ...a);
console.log(`\n  ${WRITE ? "WRITING" : "DRY RUN"} — catalogue corrections\n`);

const byslug = (s) =>
  client.fetch(
    `*[_type=="garment" && slug.current==$s][0]{_id, name, price, stage, media, "n": count(media),
      "files": media[].poster.asset->originalFilename}`,
    {s},
  );

const pants = await byslug("capo-10");
const lux = await byslug("capo-11");
const dark = await byslug("capo-05");
const nocte = await byslug("capo-13");
if (!pants || !lux || !nocte) throw new Error("expected capo-10, capo-11 and capo-13 to exist");

/* The safety check that stops the wrong "Monumentus Pants" being touched. */
log(`capo-05 is "${dark?.name}", stage ${dark?.stage} — LEFT ALONE`);
if (dark?.stage === lux.stage) {
  throw new Error("capo-05 shares a stage with capo-11; stop and look before merging");
}

/* Nothing may point at a document that is about to disappear. */
for (const doc of [pants, nocte]) {
  const refs = await client.fetch(`*[references($id)]{_id,_type}`, {id: doc._id});
  if (refs.length) throw new Error(`${doc._id} is referenced by ${refs.map((r) => r._id).join(", ")}`);
}

log("");
log(`MERGE  ${pants.name} (${pants.n} frames)  ->  ${lux.name} (${lux.n} frames)`);
pants.files.forEach((f) => log(`         + ${f}`));
log(`       result: ${lux.n + pants.n} frames on Monumentus Lux, capo-10 deleted`);
log("");
log(`MOVE   ${nocte.name} (${nocte.n} frames) out of the catalogue -> gallery image on /process`);
nocte.files.forEach((f) => log(`         ${f}`));

if (!WRITE) {
  console.log("\n  Nothing written. Re-run with --write.\n");
  process.exit(0);
}

/*
  A NEW `_key` FOR EVERY MOVED FRAME. Array item keys must be unique within
  their array; carrying capo-10's keys across risks a collision with capo-11's
  and Sanity rejects the whole patch if one lands.
*/
const rekey = (items, prefix) =>
  (items ?? []).map((m, i) => ({...m, _key: `${prefix}-${i}-${Math.random().toString(36).slice(2, 8)}`}));

/*
  The gallery orders by `orderRank`, so a new frame with none would sort
  unpredictably. Appending a character to the current last rank sorts it after
  everything, which is where a piece leaving the catalogue belongs.
*/
const lastRank = await client.fetch(
  `*[_type=="archivePiece"] | order(orderRank desc)[0].orderRank`,
);

await client
  .transaction()
  .patch(client.patch(lux._id).set({media: [...(lux.media ?? []), ...rekey(pants.media, "merged")]}))
  .create({
    _type: "archivePiece",
    title: nocte.name,
    media: rekey(nocte.media, "nocte"),
    orderRank: `${lastRank ?? "0"}z`,
  })
  .delete(pants._id)
  .delete(nocte._id)
  .commit();

const after = await client.fetch(`{
  "lux": *[_type=="garment" && slug.current=="capo-11"][0]{name,"n":count(media)},
  "capo10": *[_type=="garment" && slug.current=="capo-10"][0]._id,
  "capo13": *[_type=="garment" && slug.current=="capo-13"][0]._id,
  "gallery": *[_type=="archivePiece" && title=="Nocte"][0]{title,"n":count(media)},
  "garments": count(*[_type=="garment"])
}`);
console.log(`\n  Written.`);
console.log(`    ${after.lux.name}: ${after.lux.n} frames`);
console.log(`    capo-10 gone: ${after.capo10 === null}`);
console.log(`    capo-13 gone: ${after.capo13 === null}`);
console.log(`    gallery now holds: ${after.gallery?.title} (${after.gallery?.n} frames)`);
console.log(`    garments in the catalogue: ${after.garments}\n`);
