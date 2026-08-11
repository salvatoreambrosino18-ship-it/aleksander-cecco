/*
  HIS FOUR HOMEPAGE PHOTOGRAPHS, PLACED WHERE HE ASKED (section 103).

    node scripts/patch-homepage-photos.mjs           dry
    node scripts/patch-homepage-photos.mjs --write

  He sent four files named for their positions. Three turned out to be
  re-exports of photographs ALREADY in the dataset — sha1 said "new" because a
  re-export always does, and only comparing the pictures said otherwise. One is
  genuinely new and is uploaded here.

  This is the section 80 trap seen from the other side: there, a file that was
  new arrived behind a key that had not changed. Here, three files that look new
  by every cheap signal are the same photographs. **The only test that answered
  either question was looking at the picture.**

    hp1-meet-our-creatures      = homepage_homepage (1).jpg   -> openingMedia
    hp2-the-project             = 0d454a66-...jpg             -> makingMedia[0]
    hp3-body-of-light-ferdinando= IMG_3485.PNG                -> homeSequence
    hp4-our-skins               NEW, uploaded                 -> makingMedia[1]
*/
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");
const DIR = path.join(os.homedir(), "Google Drive/My Drive/Aleksander Cecco/HOMEPAGE-NUOVA");

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

/* Matched by looking at the pictures, not by hash. */
const EXISTING = {
  hp1: "homepage_homepage (1).jpg",
  hp2: "0d454a66-7c17-4d8d-a6f0-9872225ab82b.jpg",
  hp3: "IMG_3485.PNG",
};

const ALT = {
  hp1: "Dettaglio di due capi in pelle accostati, uno nero e uno grigio chiaro, con zip e passanti.",
  hp2: "La camicia in pelle nera increspata, appesa a un ramo contro il muro di calce.",
  hp3: "Ferdinando indossa un gilet nero e pantaloni corti in pelle, in cortile.",
  hp4: "Una gonna lunga in pelle nera appesa al muro bianco, con l'orlo tagliato vivo.",
};

const media = (assetId, alt, extra = {}) => ({
  _type: "media",
  _key: Math.random().toString(36).slice(2, 12),
  poster: {_type: "image", asset: {_type: "reference", _ref: assetId}},
  alt: {_type: "localeString", it: alt},
  altIsDraft: true,
  overlay: "paper",
  captionPlacement: "below",
  ...extra,
});

async function main() {
  const assets = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename in $names]{_id, originalFilename}`,
    {names: Object.values(EXISTING)},
  );
  const byName = new Map(assets.map((a) => [a.originalFilename, a._id]));
  for (const [slot, name] of Object.entries(EXISTING)) {
    if (!byName.get(name)) throw new Error(`${slot}: asset "${name}" not found in the dataset`);
  }

  const settings = await client.getDocument("siteSettings");
  console.log(`\nHomepage photographs: ${client.config().dataset}`);
  console.log(WRITE ? "  WRITING\n" : "  DRY RUN\n");
  console.log(`  hp1 -> openingMedia        (${EXISTING.hp1}, already in the dataset)`);
  console.log(`  hp2 -> makingMedia[0]      (${EXISTING.hp2}, already in the dataset)`);
  console.log(`  hp3 -> BODY OF LIGHT       (${EXISTING.hp3}, already in the dataset)`);
  console.log(`  hp4 -> makingMedia[1]      (NEW FILE, uploaded)`);
  console.log(`\n  makingMedia is ${settings.makingMedia?.length ?? 0} frames, homeSequence ${settings.homeSequence?.length ?? 0} tiles`);

  if (!WRITE) {
    console.log("\n  Re-run with --write.\n");
    return;
  }

  const uploaded = await client.assets.upload(
    "image",
    fs.createReadStream(path.join(DIR, "hp4-our-skins.jpg")),
    {filename: "hp4-our-skins.jpg"},
  );
  console.log(`  uploaded hp4 -> ${uploaded._id}`);

  /*
    Read whole, write whole (section 78). Each list keeps every frame it had
    except where he asked for a replacement.
  */
  const making = [...(settings.makingMedia ?? [])];
  making[0] = media(byName.get(EXISTING.hp2), ALT.hp2);
  making[1] = media(uploaded._id, ALT.hp4);

  /*
    BODY OF LIGHT: his replacement for the red shirt. It goes FIRST, where the
    red shirt was, rather than at the end — he replaced a frame, he did not
    append one. The tile carries no linked garment: it is a portrait of one of
    the two people who make the brand, not a piece for sale, and linking it to a
    Creature would send a reader to the wrong page.
  */
  const tiles = [{_key: Math.random().toString(36).slice(2, 12), media: media(byName.get(EXISTING.hp3), ALT.hp3)},
                 ...(settings.homeSequence ?? [])];

  await client
    .patch("siteSettings")
    .set({
      openingMedia: media(byName.get(EXISTING.hp1), ALT.hp1, {captionPlacement: "below"}),
      makingMedia: making,
      homeSequence: tiles,
    })
    .commit();

  console.log("\n  Placed. LOOK AT THE HOME PAGE in both languages and at both widths.\n");
}

main().catch((e) => {
  console.error("\npatch-homepage-photos failed:", e.message);
  process.exit(1);
});
