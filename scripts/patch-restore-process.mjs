/*
  PUT /PROCESS BACK: HIS TWO CLIPS, IN THEIR OWN SLOTS, FORWARD-ONLY.

    node scripts/patch-restore-process.mjs --fwd=<dir>            dry
    node scripts/patch-restore-process.mjs --fwd=<dir> --write

  What 2026-08-16 did to this page was a redesign nobody asked for. The brief
  was that the videos should play by themselves; instead one slot had its clip
  swapped for different footage and the other had its clip deleted and left as
  a still. The layout was never the problem.

  So both come back to the slot they were in:

    processMedia[8]  beside the red fur top cut-out   his drop film
    processMedia[9]  beside the light-leather detail  the granite pan

  FORWARD-ONLY, which is the one thing that does change. The ping-pong that
  removed the seam is out — it reads as a boomerang, and motion that never
  happened in front of the camera is a worse lie than a cut. So each clip is
  cut to the quietest window it has, played once, and started again, and the
  seam is reported rather than hidden:

    drop film   3.70-22.52s of 24.13   seam 26.8   A CUT      (was 53.0 whole)
    granite     0.00-1.50s  of 5.78    seam 17.7   VISIBLE    (was 38.9 whole)

  Neither is good and neither can be. The drop film's drift is 84.8 — the
  camera crosses the yard — and the granite is a pan, which by construction
  leaves and never comes back. The owner has accepted the cut; these are the
  numbers he is accepting.

  THE FILM KEEPS ALMOST ALL OF ITSELF. Its quietest window is 18.8s of 24.1,
  so trimming halves the seam and costs five seconds. A shorter window does
  not pay: the best 1s window scores 24.5, which is no better, for 17 seconds
  less film.

  POSTERS. Section 83 wants the poster to be the loop's own first frame. The
  granite window starts at 0.00s, so the poster already in Sanity IS that
  frame and nothing is uploaded — the original comes back untouched. The film
  starts at 3.70s, so its poster moves with it; it is the same shot, the same
  model, the same light, three and a half seconds later.

  THE ALT TEXT IS RESTORED VERBATIM, including the fact that its English says
  a pan and its Italian says a sewing machine. That disagreement was there
  before and is his to settle, not ours to quietly rewrite.
*/
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");
const FWD = process.argv.find((a) => a.startsWith("--fwd="))?.split("=")[1];
if (!FWD) throw new Error("usage: patch-restore-process.mjs --fwd=<dir of built mp4/jpg> [--write]");

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const ref = (id) => ({_type: "reference", _ref: id});
const up = async (kind, file) => {
  const a = await client.assets.upload(kind, fs.createReadStream(path.join(FWD, file)), {filename: file});
  console.log(`    ${file} -> ${a._id}`);
  return a._id;
};

/* His, from before 2026-08-16. Restored word for word. */
const FILM_ALT = {
  _type: "localeString",
  en: "The drop film: the model in the yard, in leather, in full sun.",
  it: "Il film del drop: la modella nel cortile, in pelle, alla luce del sole.",
};
const GRANITE_ALT = {
  _type: "localeString",
  en: "A pan across the raw edge of a leather piece resting on granite.",
  it: "La macchina da cucire passa sul bordo grezzo di un capo in pelle, sul granito.",
};

const settings = await client.getDocument("siteSettings");
const media = settings.processMedia ?? [];
const film = media[8];
const granite = media[9];
if (!film || !granite) throw new Error("processMedia is not the shape this expects");

console.log(`\n  processMedia[8] '${film._key}'  -> the drop film, forward-only 3.70-22.52s, seam 26.8 (a cut)`);
console.log(`  processMedia[9] '${granite._key}'  -> the granite pan, forward-only 0.00-1.50s, seam 17.7 (visible)`);
console.log(`     granite keeps the poster it already has (its window starts at 0.00s)`);

if (!WRITE) {
  console.log("\n  DRY RUN. Re-run with --write.\n");
} else {
  console.log("\n  uploading:");
  const filmMp4 = await up("file", "drop-film-fwd.mp4");
  const filmJpg = await up("image", "drop-film-fwd-poster.jpg");
  const graniteMp4 = await up("file", "granite-fwd.mp4");

  await client
    .patch("siteSettings")
    .set({
      [`processMedia[_key=="${film._key}"].video.asset`]: ref(filmMp4),
      [`processMedia[_key=="${film._key}"].poster.asset`]: ref(filmJpg),
      [`processMedia[_key=="${film._key}"].alt`]: FILM_ALT,
      [`processMedia[_key=="${granite._key}"].video`]: {_type: "file", asset: ref(graniteMp4)},
      [`processMedia[_key=="${granite._key}"].alt`]: GRANITE_ALT,
    })
    .commit();
  console.log("\n  /process restored\n");
}
