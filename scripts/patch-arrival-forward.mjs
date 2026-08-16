/*
  THE ARRIVAL PLAYS FORWARD.

    node scripts/patch-arrival-forward.mjs --fwd=<dir>            dry
    node scripts/patch-arrival-forward.mjs --fwd=<dir> --write

  The hero was the clip the ping-pong was invented for, and it is the clip the
  ping-pong was most obvious on: a hand on a jacket that goes down and then, an
  instant later, goes back up. Nothing does that. The owner has refused it.

  So it is a plain forward window, 0.00-1.20s of the 1.50s file, and it cuts:

    whole frame, as a narrow window shows it   seam 5.5   a blink
    the 28% band a 1728px hero shows at 1.92x  seam 6.4   a blink

  The band is the honest number, because that is what the page actually shows
  and it is magnified nearly twice. Both are inside "a blink" and neither is
  invisible; there is no window in this file that is. The best seam it holds is
  4.3, at 0.60s, and that is not worth taking: a 0.6s loop cuts a hundred times
  a minute where a 1.2s loop cuts fifty, so the shorter window is a smaller
  jump seen twice as often, which is worse. Length is the variable that matters
  once every candidate is already a blink.

  THE ORIGINAL POSTER COMES BACK. The window starts at 0.00s, so
  arrival-loop-poster.jpg is once again exactly the first frame, and the
  poster made yesterday for the ping-pong's in-point is dropped. Nothing is
  uploaded but the clip itself.
*/
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");
const FWD = process.argv.find((a) => a.startsWith("--fwd="))?.split("=")[1];
if (!FWD) throw new Error("usage: patch-arrival-forward.mjs --fwd=<dir> [--write]");

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

/* The poster that was here before the ping-pong: the clip's own frame 0. */
const ORIGINAL_POSTER = "image-0c88a7d5a4ba5219a18a2bae715742dd1b7e27ff-1440x2560-jpg";

const before = await client.fetch(
  `*[_type=="siteSettings"][0]{"poster":openingMedia.poster.asset->originalFilename,"video":openingMedia.video.asset->originalFilename}`,
);
console.log(`\n  before:  ${before.video}  +  ${before.poster}`);
console.log(`  after:   arrival-fwd.mp4 (forward-only 0.00-1.20s)  +  arrival-loop-poster.jpg (restored)`);
console.log(`  seam:    5.5 whole frame / 6.4 in the full-width band — a blink, both`);

if (!WRITE) {
  console.log("\n  DRY RUN. Re-run with --write.\n");
} else {
  const a = await client.assets.upload("file", fs.createReadStream(path.join(FWD, "arrival-fwd.mp4")), {
    filename: "arrival-fwd.mp4",
  });
  console.log(`\n  uploaded arrival-fwd.mp4 -> ${a._id}`);
  await client
    .patch("siteSettings")
    .set({
      "openingMedia.video.asset": {_type: "reference", _ref: a._id},
      "openingMedia.poster.asset": {_type: "reference", _ref: ORIGINAL_POSTER},
    })
    .commit();
  console.log("  openingMedia patched\n");
}
