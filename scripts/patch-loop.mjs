/*
  PUT THE ONE LOOP ON /PROCESS, PROVISIONALLY.

    node scripts/patch-loop.mjs <poster.jpg> <loop.mp4>        dry
    node scripts/patch-loop.mjs <poster.jpg> <loop.mp4> --write

  Section 90 surveyed the only video that exists and refused it: 464x832 against
  a 1200px floor, no seamless window in it, and a caption band that swings past
  both text colours. The owner has decided to ship it anyway, PROVISIONALLY, the
  way the hat's crop ships — visible on the page, marked in the studio, and
  named in the plan as something to replace.

  Two rules from section 83 are honoured even here:

  - THE POSTER IS THE LOOP'S OWN FIRST FRAME, extracted at the same timestamp
    the encode starts from, so the swap from still to motion is invisible. A
    poster that is a different picture makes the page cut when the loop plays.
  - NO AUDIO TRACK AT ALL, not merely muted.

  It appends rather than replacing: the eight making frames are a narrative in
  work order (section 85) and this is the garment being hung at the end of it,
  so it belongs after them and nowhere else.
*/
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const [posterPath, videoPath] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const WRITE = process.argv.includes("--write");
if (!posterPath || !videoPath) throw new Error("usage: patch-loop.mjs <poster> <loop.mp4> [--write]");

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const ALT =
  "Un capo di pelle nera appeso al muro bianco dello studio, ripreso mentre viene sistemato a mano.";

async function main() {
  const settings = await client.getDocument("siteSettings");
  const media = [...(settings.processMedia ?? [])];
  console.log(`\nprocessMedia has ${media.length} frames`);
  const already = media.find((m) => m.video?.asset);
  if (already) {
    console.log("  a loop is already on this page — nothing to do");
    return;
  }
  console.log(`  would append 1 provisional loop (${(fs.statSync(videoPath).size / 1024).toFixed(0)} KB)`);
  if (!WRITE) {
    console.log("  DRY RUN. Re-run with --write.\n");
    return;
  }

  const poster = await client.assets.upload("image", fs.createReadStream(posterPath), {
    filename: "process-loop-poster.jpg",
  });
  const video = await client.assets.upload("file", fs.createReadStream(videoPath), {
    filename: "process-loop.mp4",
    contentType: "video/mp4",
  });

  media.push({
    _type: "media",
    _key: Math.random().toString(36).slice(2, 12),
    poster: {_type: "image", asset: {_type: "reference", _ref: poster._id}},
    video: {_type: "file", asset: {_type: "reference", _ref: video._id}},
    alt: {_type: "localeString", it: ALT},
    altIsDraft: true,
    /*
      PROVISIONAL, and the page says so the way the hat's crop does. It is a
      messaging-app re-encode at 464px on a site whose floor is 1200; it ships
      because motion on the making page is worth more tonight than the sharpness
      it costs, and it comes out the moment the camera original arrives.
    */
    isProvisional: true,
    overlay: "paper",
    captionPlacement: "below",
  });

  await client.patch("siteSettings").set({processMedia: media}).commit();
  console.log("  appended. LOOK AT THE PAGE at 390 and 1440.\n");
}

main().catch((e) => {
  console.error("\npatch-loop failed:", e.message);
  process.exit(1);
});
