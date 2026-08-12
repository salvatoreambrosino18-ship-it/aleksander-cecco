/*
  ONE CAPTION: the first frame of BODY OF LIGHT says MONUMENTUS TENEBRAE
  (2026-08-12, owner's instruction, DESIGN-PLAN section 110).

    node scripts/patch-band-caption.mjs            DRY, prints what it would do
    node scripts/patch-band-caption.mjs --write

  WHY A CAPTION AND NOT A LINK, which is the whole question.

  The band renders a name from the LINKED PIECE (`WornBand.astro`), never from
  typed text, so that renaming a Creature renames it everywhere at once. That is
  the right mechanism and it is the one to prefer. It could not be used here:

    - `IMG_3485.PNG` is in NO garment's media. It was filed as the band's
      unidentified frame and section 103 made it first in BODY OF LIGHT because
      it is a person — Ferdinando — rather than a piece.
    - NO Creature in the catalogue is called Monumentus Tenebrae. The dataset
      has Monumentus Vest, Monumentus Pants and Monumentus Lux. Tenebrae is the
      dark half of the drop's own title, and Lux is the pale half, so the name
      is plainly his and plainly real — it simply is not a document yet.

  So this is a caption on the photograph, and it is the WEAKER of the two: if a
  Creature named Monumentus Tenebrae ever enters the catalogue, this caption
  must be deleted and the frame linked to it instead. THE SCRIPT ENFORCES THAT
  — it refuses to run if such a piece exists, and tells you to link it. That is
  the only way this decision survives the day it stops being true.

  It is the owner's own word, so it carries no invented-copy flag: we chose
  nothing here except which field holds it.

  Never reads Drive, never writes media, never deletes a document.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) throw new Error("SANITY_WRITE_TOKEN missing");
const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  token,
  useCdn: false,
});

/** His name for the piece. A proper noun, so it is the same in both languages. */
const NAME = "Monumentus Tenebrae";
/** The frame this is about, identified by its file rather than by its position. */
const FILE = "IMG_3485.PNG";

/*
  THE PIECE WINS IF IT EXISTS. Checked every run, not once: the whole reason
  this is a caption is that no such Creature exists, and the day one does, a
  caption is the wrong answer and this must stop being used.
*/
const piece = await client.fetch(
  `*[_type=="garment" && name match $n][0]{name,"slug":slug.current}`,
  {n: `*${NAME}*`},
);
if (piece) {
  throw new Error(
    `A Creature named "${piece.name}" (${piece.slug}) now EXISTS. Do not run this.\n` +
      `Link the band frame to that piece in the studio instead — the band takes its\n` +
      `name from the linked Creature, so it stays correct if the piece is renamed.\n` +
      `Then delete this frame's caption and delete this script.`,
  );
}

const band = await client.fetch(
  `*[_id=="siteSettings"][0].homeSequence[]{
     _key,
     "file": media.poster.asset->originalFilename,
     "garment": garment->name,
     "caption": media.caption
   }`,
);

const index = band.findIndex((f) => f.file === FILE);
if (index === -1) throw new Error(`${FILE} is not in homeSequence. Look at the band before forcing this.`);
const frame = band[index];

if (frame.garment) {
  throw new Error(
    `That frame is linked to "${frame.garment}". It already takes its name from a\n` +
      `piece, which is the better mechanism — do not add a caption on top of it.`,
  );
}
if (index !== 0) {
  console.log(`  NOTE: ${FILE} is frame ${index + 1}, not the first. The order is a studio`);
  console.log(`  drag order and he may have moved it. Captioning it anyway — the caption`);
  console.log(`  belongs to the PHOTOGRAPH, not to the position.\n`);
}

console.log(`  frame     ${index + 1} of ${band.length}, ${FILE}`);
console.log(`  linked    no piece — and none is named ${NAME}`);
console.log(`  caption   ${frame.caption ? JSON.stringify(frame.caption) : "— none —"}  ->  "${NAME}" (it and en)`);

if (!WRITE) {
  console.log("\n  DRY RUN. Nothing written. Re-run with --write.\n");
  process.exit(0);
}

/*
  READ WHOLE, WRITE WHOLE — section 78's first rule, and this script is exactly
  the shape that broke it.

  `set: {"homeSequence[_key==\"x\"].media.caption": …}` addresses a PLAIN NESTED
  OBJECT by a dotted path. Keyed array items are documented to work; the object
  INSIDE one is the case that replaced four media objects with a bare string —
  poster, alt text and caption placement gone, and the site rebuilt from
  placeholders. It was recovered only from Sanity's document history.

  So the whole `media` object is read, given its caption in memory, and written
  back entire. If the API decides to replace the object wholesale, the object it
  replaces it with is the complete one, and nothing can be lost.
*/
const media = await client.fetch(
  `*[_id=="siteSettings"][0].homeSequence[_key==$k][0].media`,
  {k: frame._key},
);
if (!media?.poster?.asset?._ref) {
  throw new Error("read back a media object with no poster — refusing to write it");
}

await client
  .patch("siteSettings")
  .set({
    [`homeSequence[_key=="${frame._key}"].media`]: {
      ...media,
      caption: {_type: "localeString", it: NAME, en: NAME},
    },
  })
  .commit();

/* Prove the siblings survived, because that is the failure this guards against. */
const after = await client.fetch(
  `*[_id=="siteSettings"][0].homeSequence[_key==$k][0]{
     "file": media.poster.asset->originalFilename,
     "alt": media.alt.it,
     "placement": coalesce(media.captionPlacement,"over"),
     "caption": media.caption.it
   }`,
  {k: frame._key},
);
console.log(`\n  written. Read back:`);
console.log(`    file       ${after.file}`);
console.log(`    alt        ${after.alt}`);
console.log(`    placement  ${after.placement}`);
console.log(`    caption    ${after.caption}\n`);
if (after.file !== FILE || !after.alt) throw new Error("SIBLINGS LOST — restore from document history");
