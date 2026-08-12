/*
  ONE CROP: the first frame of BODY OF LIGHT stops opening on a dead dark band
  (2026-08-12, DESIGN-PLAN section 112).

    node scripts/patch-band-crop.mjs            DRY
    node scripts/patch-band-crop.mjs --write [--top=0.12]

  WHAT IS WRONG, measured rather than guessed. `IMG_3485.PNG` is 1320x1778, a
  portrait frame, and the worn band's box is 416 x 702 at 1440 and 416 x 842 at
  1920 — narrower in proportion than the source. `object-fit: cover` therefore
  crops the WIDTH and shows the FULL HEIGHT, including the top of the picture,
  where the mean luminance of the first three hundred rows is 14–20 of 255.
  That is the "black strip along the top": not a bar baked into the file, and
  not a bug — the photograph's own shaded wall, shown because nothing was
  trimming it. The frames beside it are brighter at their top edge and so run
  clean.

  WHY A CROP AND NOT A HOTSPOT. `objectPosition` moves the picture along the
  axis being cropped. Here that axis is the WIDTH, so a hotspot cannot move the
  frame down at all; it would look like a fix and do nothing. The trim has to
  happen before the box, which means the asset's own `crop`, which
  @sanity/image-url applies for us because `poster` is projected whole.

  It is a CROP, not a re-upload: his file is untouched and the number is one
  value in the dataset he can change in the studio by dragging the crop handles.

  Never reads Drive, never writes media, never deletes.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const argv = process.argv.slice(2);
const WRITE = argv.includes("--write");
const TOP = Number(argv.find((a) => a.startsWith("--top="))?.split("=")[1] ?? 0.14);
if (!(TOP > 0 && TOP < 0.5)) throw new Error(`--top must be between 0 and 0.5, got ${TOP}`);

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) throw new Error("SANITY_WRITE_TOKEN missing");
const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  token,
  useCdn: false,
});

const FILE = "IMG_3485.PNG";

const band = await client.fetch(
  `*[_id=="siteSettings"][0].homeSequence[]{_key, "file": media.poster.asset->originalFilename}`,
);
const frame = band.find((f) => f.file === FILE);
if (!frame) throw new Error(`${FILE} is not in homeSequence — look at the band before forcing this.`);

/* READ WHOLE, WRITE WHOLE — section 78. The dotted path into `media` is the
   mutation that once replaced four media objects with a bare string. */
const media = await client.fetch(
  `*[_id=="siteSettings"][0].homeSequence[_key==$k][0].media`,
  {k: frame._key},
);
if (!media?.poster?.asset?._ref) throw new Error("read back a media object with no poster — refusing");

const crop = {
  _type: "sanity.imageCrop",
  top: TOP,
  bottom: 0,
  left: 0,
  right: 0,
};

console.log(`\n  frame     ${FILE}`);
console.log(`  was       crop ${media.poster.crop ? JSON.stringify(media.poster.crop) : "none"}`);
console.log(`  now       top ${TOP} — the first ${(TOP * 100).toFixed(0)}% of the picture is trimmed`);

if (!WRITE) {
  console.log("\n  DRY RUN. Nothing written. Re-run with --write.\n");
  process.exit(0);
}

await client
  .patch("siteSettings")
  .set({
    [`homeSequence[_key=="${frame._key}"].media`]: {
      ...media,
      poster: {...media.poster, crop},
    },
  })
  .commit();

const after = await client.fetch(
  `*[_id=="siteSettings"][0].homeSequence[_key==$k][0]{
     "file": media.poster.asset->originalFilename,
     "alt": media.alt.it,
     "caption": media.caption.it,
     "crop": media.poster.crop.top
   }`,
  {k: frame._key},
);
console.log(`\n  written. Read back: ${after.file} | alt ${after.alt ? "present" : "LOST"} | caption ${after.caption} | crop.top ${after.crop}\n`);
if (after.file !== FILE || !after.alt || !after.caption) {
  throw new Error("SIBLINGS LOST — restore from document history");
}
