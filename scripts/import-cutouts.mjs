/*
  THE CUT-OUTS, INTO `cutoutMedia`.

    node scripts/import-cutouts.mjs <prepared-dir>            DRY
    node scripts/import-cutouts.mjs <prepared-dir> --write

  It REPLACES the whole array rather than appending, so re-running it after a
  re-verification leaves exactly the set named below and nothing stale behind.

  EACH ENTRY NAMES ITS GARMENT, and that is the part that cannot be automated:
  the mapping below was made by putting each cut-out beside the photograph it
  came from and matching the hem, the seams and the hardware. See
  docs/SURVEY-MATERIALE-NUOVO.md. A file that does not appear here is one that
  did not survive that comparison, and it is absent deliberately — not flagged,
  not provisional, absent.
*/
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const DIR = process.argv[2];
const WRITE = process.argv.includes("--write");
if (!DIR) throw new Error("usage: import-cutouts.mjs <prepared-dir> [--write]");

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

/*
  THE SIX THAT HOLD UP, in the order they should read across the site. `file` is
  the prepared PNG; `garment` is the slug the cut-out actually shows.
*/
const SET = [
  {
    file: "cut-06.png",
    as: "cutout-monumentus-lux.png",
    garment: "capo-11",
    alt: {
      it: "Monumentus Lux: pantaloni chiari e maglia bianca, il capo ritagliato su fondo chiaro.",
      en: "Monumentus Lux: pale trousers and a white mesh top, the piece cut out on pale ground.",
    },
  },
  {
    file: "cut-02.png",
    as: "cutout-oblivion-open.png",
    garment: "capo-02",
    alt: {
      it: "Oblivion: camicia in pelle nera portata aperta sui jeans, ritagliata su fondo chiaro.",
      en: "Oblivion: the black leather shirt worn open over jeans, cut out on pale ground.",
    },
  },
  {
    file: "cut-01.png",
    as: "cutout-oblivion-dress.png",
    garment: "capo-02",
    alt: {
      it: "Oblivion: la camicia in pelle nera portata come abito, seduta, ritagliata su fondo chiaro.",
      en: "Oblivion: the black leather shirt worn as a dress, seated, cut out on pale ground.",
    },
  },
  {
    file: "cut-04.png",
    as: "cutout-rubedo.png",
    garment: "rubedo",
    alt: {
      it: "Rubedo: la camicia in pelle rossa dalle maniche a campana, ritagliata su fondo chiaro.",
      en: "Rubedo: the red leather shirt with bell sleeves, cut out on pale ground.",
    },
  },
  {
    file: "cut-03.png",
    as: "cutout-styrax.png",
    garment: "styrax",
    alt: {
      it: "Styrax: il top in pelliccia nera col collare in pelle, ritagliato su fondo chiaro.",
      en: "Styrax: the black fur top with its leather collar, cut out on pale ground.",
    },
  },
  {
    file: "cut-05.png",
    as: "cutout-styrax-red.png",
    garment: "styrax-red",
    alt: {
      it: "Styrax Red Goat: il top in pelliccia rossa, ritagliato su fondo chiaro.",
      en: "Styrax Red Goat: the red goat fur top, cut out on pale ground.",
    },
  },
];

const key = (s) => `${s}-${Math.random().toString(36).slice(2, 10)}`;
console.log(`\n  ${WRITE ? "WRITING" : "DRY RUN"} — ${SET.length} cut-outs\n`);

const tiles = [];
for (const c of SET) {
  const file = path.join(DIR, c.file);
  if (!fs.existsSync(file)) throw new Error(`missing ${file}`);
  const garment = await client.fetch(`*[_type=="garment" && slug.current==$s][0]{_id,name}`, {s: c.garment});
  if (!garment) throw new Error(`no garment ${c.garment}`);

  /*
    ALWAYS UPLOAD, AND LET SANITY DEDUPE. The first version of this looked for
    an existing asset BY FILENAME and reused it — which silently re-attached the
    OLD images the moment the owner re-processed his cut-outs under the same
    names. Sanity's assets are content-addressed: uploading identical bytes
    returns the identical asset, so the filename check bought nothing and cost a
    whole batch. Re-running this is cheap and always lands the file on disk.
  */
  const assetId = WRITE
    ? (await client.assets.upload("image", fs.createReadStream(file), {filename: c.as}))._id
    : "<pending>";
  console.log(`  ${c.as.padEnd(30)} -> ${garment.name}`);
  tiles.push({
    _type: "homeTile",
    _key: key("cut"),
    media: {
      _type: "media",
      poster: {_type: "image", asset: {_type: "reference", _ref: assetId}},
      alt: {_type: "localeString", it: c.alt.it, en: c.alt.en},
      altIsDraft: true,
      /*
        A cut-out sits on the page's own paper, so any label under it is ink and
        `captionPlacement: below` keeps it off the shape. There is no band of
        photograph for a caption to fight with.
      */
      overlay: "ink",
      overlayCaption: "ink",
      captionPlacement: "below",
    },
    garment: {_type: "reference", _ref: garment._id},
  });
}

if (!WRITE) {
  console.log("\n  Nothing written. Re-run with --write.\n");
} else {
  await client.patch("siteSettings").set({cutoutMedia: tiles}).commit();
  const after = await client.fetch(
    `*[_id=="siteSettings"][0].cutoutMedia[]{"f": media.poster.asset->originalFilename, "g": garment->name}`,
  );
  console.log(`\n  Written. ${after.length} cut-outs:`);
  after.forEach((a) => console.log(`    ${String(a.g).padEnd(20)} ${a.f}`));
  console.log();
}
