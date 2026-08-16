/*
  WINDOWS CHOSEN FOR THE MOTION IN THEM, AND THE ARRIVAL PLAYS ONCE.

    node scripts/patch-motion.mjs --dir=<built clips>            dry
    node scripts/patch-motion.mjs --dir=<built clips> --write

  WHAT WENT WRONG, because it is the whole reason this file exists. Section 123
  cut every clip to the window with the SMALLEST SEAM — the least difference
  between its first frame and its last. That is the wrong thing to minimise. In
  handheld footage the cheapest way to end where you began is to drift away and
  drift BACK, so the search selected out-and-back motion every time and scored
  it perfectly. Three clips shipped reading as Instagram boomerangs and the
  numbers said they were the best on the site.

  There is a second half no window can fix. A LOOP'S RESET IS ITSELF A RETURN:
  the picture travels for a second and snaps back to where it started. At one
  second the eye cannot tell that from a reversal, so a short loop of ANY
  moving footage reads as a boomerang whether the motion returns or not.

  So windows are chosen by NET/PATH now — how far the camera got, over how far
  it travelled — and they are LONG, because length is the only cure for the
  reset. What that costs is a real cut at the wrap, which is the trade the
  owner has already accepted, and the size of each one is written down here:

    the arrival     1.50s   plays once   travel 0.05   no wrap at all
    the granite pan 5.70s   loops        travel 1.00   seam 38.1
    the workshop   10.03s   loops        travel 0.47   seam 76.7
    the jacket      3.50s   loops        travel 0.87   seam 60.1

  THE ARRIVAL PLAYS ONCE AND STOPS ON ITS LAST FRAME, his instruction. It is
  the clip with the least travel in the folder — 0.05, which is to say it only
  ever wobbled — and no window of it could ever have looped. Playing once, that
  stops mattering: it never reaches a wrap, so it pays nothing, and it ends on
  a frame that is simply a photograph. It keeps the WHOLE 1.5s file now rather
  than the trimmed window, because there is no seam left to trim for, and its
  original poster is its first frame again.

  WHAT MOVED, AND WHY:

  - The granite pan was 1.48s and is 5.70s: the whole pan. It always travelled
    (1.00 at every length); it was simply too short for the reset to read as a
    cut rather than as a bounce.
  - The workshop close-up is gone. Every window of that take between 1.3s and
    5s wanders and comes home (travel 0.02 at the length that shipped), and at
    10s the camera repositions hard at 2.7s. The window here starts after that
    reposition: one continuous wide shot of a dyed piece lifted from the tub
    and hung on the wall. It is a man working rather than a gesture repeating.
  - /about's clip is now the jacket in the wind, which is the last unused file
    in the Drive. It was rejected in section 123 for its seam, and the seam is
    no longer the question: it travels 0.87, and what returns in it is fabric
    in wind, which is motion that happens in the world.

  Polarity is measured, not guessed, on the arithmetic import-new-material.mjs
  uses. Where a window starts at 0.00s the poster in Sanity is already its
  first frame and nothing is uploaded.
*/
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");
const DIR = process.argv.find((a) => a.startsWith("--dir="))?.split("=")[1];
if (!DIR) throw new Error("usage: patch-motion.mjs --dir=<built clips> [--write]");

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const ref = (id) => ({_type: "reference", _ref: id});
const up = async (kind, file) => {
  const a = await client.assets.upload(kind, fs.createReadStream(path.join(DIR, file)), {filename: file});
  console.log(`    ${file} -> ${a._id}`);
  return a._id;
};

const lum = (r, g, b) => {
  const ch = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
};
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
async function polarity(file, band) {
  const m = await sharp(file).metadata();
  const {data, info} = await sharp(file).extract({
    left: Math.round(band.x * m.width), top: Math.round(band.y * m.height),
    width: Math.max(2, Math.round(band.w * m.width)), height: Math.max(2, Math.round(band.h * m.height)),
  }).removeAlpha().raw().toBuffer({resolveWithObject: true});
  let lo = 1, hi = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const l = lum(data[i], data[i + 1], data[i + 2]);
    if (l < lo) lo = l;
    if (l > hi) hi = l;
  }
  return Math.min(ratio(0.9563, lo), ratio(0.9563, hi)) >= Math.min(ratio(0.0033, lo), ratio(0.0033, hi))
    ? "paper" : "ink";
}

const WORKSHOP_ALT = {
  _type: "localeString",
  en: "A freshly dyed piece lifted from the tub and hung on the studio wall.",
  it: "Un capo appena tinto sollevato dalla bacinella e appeso al muro dello studio.",
};
const JACKET_ALT = {
  _type: "localeString",
  en: "A black leather jacket hanging outside, moving in the wind.",
  it: "Una giacca di pelle nera appesa all'aperto, mossa dal vento.",
};

const settings = await client.getDocument("siteSettings");
const proc = settings.processMedia ?? [];
const about = settings.aboutMedia ?? [];
const granite = proc.find((m) => m._key === "proc-7noi4aai");
const workshop = proc.find((m) => m._key === "proc-workshop-close");
const aboutClip = about.find((m) => m._key === "about-workshop-wide");
for (const [n, v] of [["granite", granite], ["workshop", workshop], ["about clip", aboutClip]])
  if (!v) throw new Error(`${n} is not where this expects it`);

console.log(`
  openingMedia         -> arrival-once.mp4    1.50s  PLAYS ONCE, keeps its poster
  ${granite._key}       -> granite-pan.mp4     5.70s  loops, travel 1.00, seam 38.1, keeps its poster
  ${workshop._key} -> workshop-work.mp4  10.03s  loops, travel 0.47, seam 76.7, new poster
  ${aboutClip._key} -> jacket-wind.mp4     3.50s  loops, travel 0.87, seam 60.1, new poster`);

if (!WRITE) {
  console.log("\n  DRY RUN. Re-run with --write.\n");
} else {
  console.log("\n  uploading:");
  const arrival = await up("file", "arrival-once.mp4");
  const granitMp4 = await up("file", "granite-pan.mp4");
  const wsMp4 = await up("file", "workshop-work.mp4");
  const wsJpg = await up("image", "workshop-work-poster.jpg");
  const jaMp4 = await up("file", "jacket-wind.mp4");
  const jaJpg = await up("image", "jacket-wind-poster.jpg");

  const wsPol = {
    chrome: await polarity(path.join(DIR, "workshop-work-poster.jpg"), {x: 0, y: 0, w: 0.5, h: 0.14}),
    cap: await polarity(path.join(DIR, "workshop-work-poster.jpg"), {x: 0, y: 0.82, w: 1, h: 0.18}),
  };
  const jaPol = {
    chrome: await polarity(path.join(DIR, "jacket-wind-poster.jpg"), {x: 0, y: 0, w: 0.5, h: 0.14}),
    cap: await polarity(path.join(DIR, "jacket-wind-poster.jpg"), {x: 0, y: 0.82, w: 1, h: 0.18}),
  };
  console.log(`    measured polarity: workshop ${wsPol.chrome}/${wsPol.cap}, jacket ${jaPol.chrome}/${jaPol.cap}`);

  await client.patch("siteSettings").set({
    "openingMedia.video.asset": ref(arrival),
    [`processMedia[_key=="${granite._key}"].video.asset`]: ref(granitMp4),
    [`processMedia[_key=="${workshop._key}"].video.asset`]: ref(wsMp4),
    [`processMedia[_key=="${workshop._key}"].poster.asset`]: ref(wsJpg),
    [`processMedia[_key=="${workshop._key}"].alt`]: WORKSHOP_ALT,
    [`processMedia[_key=="${workshop._key}"].overlay`]: wsPol.chrome,
    [`processMedia[_key=="${workshop._key}"].overlayCaption`]: wsPol.cap,
    [`aboutMedia[_key=="${aboutClip._key}"].video.asset`]: ref(jaMp4),
    [`aboutMedia[_key=="${aboutClip._key}"].poster.asset`]: ref(jaJpg),
    [`aboutMedia[_key=="${aboutClip._key}"].alt`]: JACKET_ALT,
    [`aboutMedia[_key=="${aboutClip._key}"].overlay`]: jaPol.chrome,
    [`aboutMedia[_key=="${aboutClip._key}"].overlayCaption`]: jaPol.cap,
  }).commit();
  console.log("\n  patched\n");
}
