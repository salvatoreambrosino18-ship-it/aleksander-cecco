/*
  MORE VIDEO: A SECOND CLIP ON /PROCESS, AND THE FIRST ONE ON /ABOUT.

    node scripts/patch-video.mjs --fwd=<dir>            dry
    node scripts/patch-video.mjs --fwd=<dir> --write

  THE DRIVE HAD A CAMERA ORIGINAL NOBODY HAD OPENED. `video (1)` holds
  d7eecca3...mov: 1080x1920, 26.1 seconds, the same take as `process-loop.mp4`
  which the plan has been calling "a 464px messaging-app copy" and asking to
  replace since section 90. It was in the folder the whole time. Everything
  below comes out of it, at four and a half times the pixels.

  ONE TAKE, TWO CLIPS, BECAUSE 26 SECONDS HOLDS MORE THAN ONE PICTURE. Frames
  203-233 are a wide shot, the whole figure hanging a finished piece on the
  wall; frames 493-531 are close, just the hands and the garment. Different
  scale, different framing: they do not read as the same clip twice.

    /about    the wide shot    1.03s   seam 3.7   INVISIBLE
    /process  the close shot   1.27s   seam 7.2   a blink

  The wide shot goes to /about because it IS the clip that was put on /process
  yesterday in the wrong slot: matching it frame by frame against the original
  puts that window at 6.03-7.53s, and this one is 6.77-7.77s of the same
  gesture. The owner asked for that clip to land on /about, and this is it,
  forward-only and no longer 464 pixels wide.

  The close shot is the second clip /process gains, and at 3.7 the wide one is
  the only window on the whole site whose cut is INVISIBLE on the project's
  scale. Neither is a ping-pong; both play forward and start again.

  WHAT IS LEFT OUT, AND WHY, because leaving it out is the judgement:

  - `video (1)/IMG_2045.mov`, a jacket hanging in the wind. Every window is a
    cut: 25.1 at 0.8s, 31.4 at 1.2s, 36.6 at 1.5s, and the drift is 21-48,
    which means the CAMERA is what moves, not the jacket. Nothing can be done
    with a handheld frame that never returns.
  - `capo-03-zip.mp4`, best window seam 38.8 and drift 29.1. It is a zip being
    pulled: directional by definition, and there is no quiet stretch in it.
  - `process-hands.mp4`, which loops well (seam 5.0) and is the same take as
    the home arrival. A second page showing the same wall, the same jacket and
    the same arm is a repeat, not a second clip.
  - `process-loop.mp4`, superseded: this is that footage, at 1080x1920.

  THE POLARITY IS MEASURED, not chosen from a dropdown by eye — a wrong
  `overlay` is an invisible caption (section 58), and the same arithmetic runs
  in import-new-material.mjs.
*/
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");
const FWD = process.argv.find((a) => a.startsWith("--fwd="))?.split("=")[1];
if (!FWD) throw new Error("usage: patch-video.mjs --fwd=<dir> [--write]");

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const lum = (r, g, b) => {
  const ch = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
};
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const L_PAPER = 0.9563, L_INK = 0.0033;

/* Worst pixel in the band, not the average: an average is fine on a frame that
   is half white wall and half black leather, and the caption on it is still
   unreadable. */
async function polarity(file, band) {
  const m = await sharp(file).metadata();
  const {data, info} = await sharp(file)
    .extract({
      left: Math.round(band.x * m.width), top: Math.round(band.y * m.height),
      width: Math.max(2, Math.round(band.w * m.width)), height: Math.max(2, Math.round(band.h * m.height)),
    })
    .removeAlpha().raw().toBuffer({resolveWithObject: true});
  let lo = 1, hi = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const l = lum(data[i], data[i + 1], data[i + 2]);
    if (l < lo) lo = l;
    if (l > hi) hi = l;
  }
  const paper = Math.min(ratio(L_PAPER, lo), ratio(L_PAPER, hi));
  const ink = Math.min(ratio(L_INK, lo), ratio(L_INK, hi));
  return {value: paper >= ink ? "paper" : "ink", paper: paper.toFixed(2), ink: ink.toFixed(2)};
}

const ADDITIONS = [
  {
    field: "processMedia", key: "proc-workshop-close", mp4: "workshop-close.mp4", jpg: "workshop-close-poster.jpg",
    seam: "7.2, a blink", note: "the close shot, frames 493-531",
    alt: {_type: "localeString",
      en: "Hands smoothing a finished piece flat against the studio wall.",
      it: "Le mani lisciano un capo finito contro il muro dello studio."},
  },
  {
    field: "aboutMedia", key: "about-workshop-wide", mp4: "workshop-wide.mp4", jpg: "workshop-wide-poster.jpg",
    seam: "3.7, INVISIBLE", note: "the wide shot, frames 203-233",
    alt: {_type: "localeString",
      en: "A finished piece hung on the studio wall and set straight by hand.",
      it: "Un capo finito appeso al muro dello studio e sistemato a mano."},
  },
];

const settings = await client.getDocument("siteSettings");
const patch = {};
console.log("");
for (const a of ADDITIONS) {
  const existing = settings[a.field] ?? [];
  if (existing.some((m) => m._key === a.key)) { console.log(`  ${a.field}: ${a.key} already there`); continue; }
  const jpg = path.join(FWD, a.jpg);
  // the caption band is the bottom sixth; the chrome band is the top left
  const cap = await polarity(jpg, {x: 0, y: 0.82, w: 1, h: 0.18});
  const chrome = await polarity(jpg, {x: 0, y: 0, w: 0.5, h: 0.14});
  console.log(`  ${a.field}  += ${a.mp4}  (${a.note}, seam ${a.seam})`);
  console.log(`      caption band -> ${cap.value}  (paper ${cap.paper}:1, ink ${cap.ink}:1)`);
  console.log(`      chrome  band -> ${chrome.value}`);
  a._measured = {cap, chrome};
  patch[a.field] = existing;
}

if (!WRITE) {
  console.log("\n  DRY RUN. Re-run with --write.\n");
} else {
  console.log("\n  uploading:");
  const tx = {};
  for (const a of ADDITIONS) {
    if (!a._measured) continue;
    const file = await client.assets.upload("file", fs.createReadStream(path.join(FWD, a.mp4)), {filename: a.mp4});
    const img = await client.assets.upload("image", fs.createReadStream(path.join(FWD, a.jpg)), {filename: a.jpg});
    console.log(`    ${a.mp4} -> ${file._id}`);
    tx[a.field] = [
      ...(settings[a.field] ?? []),
      {
        _key: a.key, _type: "media", alt: a.alt, altIsDraft: true,
        captionPlacement: "below",
        overlay: a._measured.chrome.value,
        overlayCaption: a._measured.cap.value,
        poster: {_type: "image", asset: {_type: "reference", _ref: img._id}},
        video: {_type: "file", asset: {_type: "reference", _ref: file._id}},
      },
    ];
  }
  await client.patch("siteSettings").set(tx).commit();
  console.log("\n  patched\n");
}
