/*
  MAKE EVERY CLIP ON THE SITE A CLIP THAT CAN ACTUALLY LOOP.

    node scripts/patch-loops.mjs            dry
    node scripts/patch-loops.mjs --write

  Section 120 deleted film mode and put every video on `loop`. That settled how
  a clip BEHAVES and left untouched the question film mode existed to answer:
  four of the five placements held footage with no loop in it. On `loop` they
  do not stop being unloopable, they just cut, every few seconds, forever.

  WHAT WAS MEASURED (2026-08-16). Every window of every clip, at every frame,
  scored the way scripts/find-loop.mjs scores — 160x160 greyscale MAD, under 4
  invisible, 20 and over a cut — and then again inside the crop each placement
  actually imposes, because at 1728px the arrival shows a 28% band of its frame
  at 1.92x and not the frame. That is the owner's own observation: the same
  clip, the same seam, invisible in a narrow window and a cut maximised.

    arrival-loop     best window 4.4   drop-film      best window 26.7
    process-hands    best window 5.0   capo-03-zip    best window 31.8
    process-loop     best window 4.7   process-granite best window 16.4

  Nothing in the folder reaches 4 by trimming. So the seam is not trimmed away,
  it is REMOVED: each surviving clip is cut to its quietest window and then run
  forward and back. A ping-pong ends on the frame it began on, so there is no
  wrap to see at all — measured at 0.6-1.6 against an ordinary frame step of
  0.3-0.8, which is to say the loop point is now quieter than the motion.

  What it costs is a reversal, and that is only free when the window is quiet
  enough to have no direction: the windows are chosen by NET TRAVEL, the
  furthest the picture gets from where it started, not by the seam.

  THE THREE THAT DO NOT SURVIVE lose their video and keep their photograph.
  capo-03-zip is a zip being pulled, drop-film is a model walking, granite is a
  pan: all three are directional, so reversing them reads as a rewind (net
  travel 20-40 where the arrival is 5), and no window is short enough to help.
  A pan cannot loop by construction — the camera leaves and never comes back.
  The asset stays in the dataset; only the reference goes, so re-shooting or
  re-attaching is one edit.

  drop-film is replaced rather than merely dropped, because /new and /process
  both point at it and /new's own note asks for "the film of him working" —
  which drop-film never was. process-loop is: him hanging a finished piece on
  the studio wall. It is still the 464px messaging-app copy section 90 refused,
  and the camera original is still the ask.

  THE POSTER IS THE LOOP'S OWN FIRST FRAME (section 83, and patch-loop.mjs
  before this): both new posters are cut from the new first frame at the new
  in-point, so the swap from still to motion stays invisible.
*/
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");
const LOOPS = process.argv.find((a) => a.startsWith("--loops="))?.split("=")[1];
if (!LOOPS) throw new Error("usage: patch-loops.mjs --loops=<dir with the built mp4/jpg> [--write]");

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const ref = (id) => ({_type: "reference", _ref: id});
const up = async (kind, file) => {
  const a = await client.assets.upload(kind, fs.createReadStream(path.join(LOOPS, file)), {filename: file});
  console.log(`    uploaded ${file} -> ${a._id}`);
  return a._id;
};

/* Him hanging a finished piece on the studio wall — the clip that replaces the
   lookbook film on /process and /new. */
const WORKSHOP_ALT = {
  _type: "localeString",
  en: "A black leather piece hanging on the studio wall, set straight by hand.",
  it: "Un capo di pelle nera appeso al muro dello studio, sistemato a mano.",
};
/* Both of these described MOTION that no longer plays. A still needs an alt
   that describes the picture, not the shot. */
const GRANITE_ALT = {
  _type: "localeString",
  en: "The raw edge of a leather piece resting on granite.",
  it: "Il bordo grezzo di un capo in pelle, appoggiato sul granito.",
};

async function main() {
  const settings = await client.getDocument("siteSettings");
  const process_ = settings.processMedia ?? [];
  const film = process_.findIndex((m) => m.video?.asset);
  const granite = process_.findIndex((m, i) => i > film && m.video?.asset);
  const vest = await client.getDocument("piece-gilet-zip");
  const zip = (vest.media ?? []).find((m) => m.video?.asset);

  console.log("\n  the arrival        openingMedia            -> arrival-loop-v2 (ping-pong, 1.97s)");
  console.log(`  the workshop clip  processMedia[${film}] '${process_[film]?._key}'   -> workshop-loop (ping-pong, 2.93s), was drop-film`);
  console.log(`  the granite pan    processMedia[${granite}] '${process_[granite]?._key}'   -> video removed, photograph stays`);
  console.log(`  the vest zip       piece-gilet-zip '${zip?._key}'  -> video removed, photographs stay`);

  if (!WRITE) {
    console.log("\n  DRY RUN. Re-run with --write.\n");
    return;
  }

  console.log("\n  uploading:");
  const [arrivalMp4, arrivalJpg, wsMp4, wsJpg] = [
    await up("file", "arrival-loop-v2.mp4"),
    await up("image", "arrival-loop-v2-poster.jpg"),
    await up("file", "workshop-loop.mp4"),
    await up("image", "workshop-loop-poster.jpg"),
  ];

  await client
    .patch("siteSettings")
    .set({
      "openingMedia.video.asset": ref(arrivalMp4),
      "openingMedia.poster.asset": ref(arrivalJpg),
      [`processMedia[_key=="${process_[film]._key}"].video.asset`]: ref(wsMp4),
      [`processMedia[_key=="${process_[film]._key}"].poster.asset`]: ref(wsJpg),
      [`processMedia[_key=="${process_[film]._key}"].alt`]: WORKSHOP_ALT,
      [`processMedia[_key=="${process_[granite]._key}"].alt`]: GRANITE_ALT,
    })
    .unset([`processMedia[_key=="${process_[granite]._key}"].video`])
    .commit();
  console.log("  siteSettings patched");

  await client.patch("piece-gilet-zip").unset([`media[_key=="${zip._key}"].video`]).commit();
  console.log("  piece-gilet-zip patched\n");
}

await main();
