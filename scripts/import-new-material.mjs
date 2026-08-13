/*
  THE MATERIAL THAT ARRIVED ON 2026-08-12, into the dataset.

    node scripts/import-new-material.mjs            DRY — says what it would do
    node scripts/import-new-material.mjs --write    does it

  WHAT IT PUTS IN, and every one of these was verified before it was written
  down. The verification is `docs/SURVEY-MATERIALE-NUOVO.md`; this file only
  carries out what that one concluded.

  1. THREE CUT-OUTS, into the new `cutoutMedia`. Three of the six figures the
     owner sent came back REDRAWN by the background-removal tool — a tidied
     hem, a zip without teeth, a fur remade as separate strands — and those
     three are not here and are not going anywhere near the site. A garment
     that was never made cannot be sold. The three that are here matched their
     source photographs at the hem, notch for notch.

  2. THREE FILMS, and NOT ONE LOOP. Every clip in the folder is hand-held: the
     folder was searched for any window of 2.5s or more whose two ends match
     and whose camera holds still, and the best one in it still fails. So
     nothing is put on `loop`. They go in as FILMS — poster, controls, plays
     once — which is what Vivienne Westwood does with a film (`VW26`) and is
     the only honest form for a clip that cannot come back to where it began.

  3. RUBEDO INTO THE WORN BAND, which is a link and an image the dataset
     already had; nothing is uploaded for it.

  WHY A SCRIPT AND NOT THE STUDIO. Nine assets, four documents, and a set of
  per-image polarity values that have to be MEASURED rather than picked from a
  dropdown by eye. Doing it by hand is how a wrong `overlay` gets in, and a
  wrong `overlay` is an invisible caption (DESIGN-PLAN section 58).

  THE POLARITY IS MEASURED HERE, not guessed. For each poster the script reads
  the pixels where a caption would sit and picks the value that survives them —
  the same arithmetic `npm run shots -- --audit` uses to check the result.
*/
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");
const token = process.env.SANITY_WRITE_TOKEN;
if (WRITE && !token) throw new Error("SANITY_WRITE_TOKEN missing");

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  useCdn: false,
  token,
});

/*
  WHERE THE PREPARED FILES ARE. They are cut, transcoded and trimmed outside
  this script (ffmpeg and sharp), because that work is slow and this script
  must be safe to re-run. If the directory is missing, say so and stop rather
  than writing half the material.
*/
const ASSETS = process.env.NEW_MATERIAL_DIR || path.join(ROOT, ".new-material");
if (!fs.existsSync(ASSETS)) {
  throw new Error(
    `No prepared assets at ${ASSETS}. Set NEW_MATERIAL_DIR to the directory holding ` +
      `the cut-outs, the mp4s and their posters.`,
  );
}
const asset = (f) => path.join(ASSETS, f);

const luminance = (r, g, b) => {
  const ch = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
};
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/*
  WHICH COLOUR SURVIVES THE BAND A CAPTION SITS IN.

  Paper is #fafaf8 and ink is #0a0a0a; there is no third value anywhere on this
  site (standing rule 11). The test is the WORST pixel in the band, not the
  average: an average is fine on a photograph that is half bright concrete and
  half black leather, and the caption on it is still unreadable.

  Returns the better of the two even when neither clears 4.5:1, and says so, so
  a frame that cannot carry a caption is a reported number rather than a
  surprise on the page.
*/
async function measurePolarity(file, band) {
  const meta = await sharp(file).metadata();
  const box = {
    left: Math.round(band.x * meta.width),
    top: Math.round(band.y * meta.height),
    width: Math.max(2, Math.round(band.w * meta.width)),
    height: Math.max(2, Math.round(band.h * meta.height)),
  };
  const {data, info} = await sharp(file)
    .extract(box)
    .removeAlpha()
    .raw()
    .toBuffer({resolveWithObject: true});
  let lo = 1;
  let hi = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const l = luminance(data[i], data[i + 1], data[i + 2]);
    if (l < lo) lo = l;
    if (l > hi) hi = l;
  }
  const paper = luminance(250, 250, 248);
  const ink = luminance(10, 10, 10);
  const paperWorst = Math.min(ratio(paper, lo), ratio(paper, hi));
  const inkWorst = Math.min(ratio(ink, lo), ratio(ink, hi));
  const overlay = paperWorst >= inkWorst ? "paper" : "ink";
  return {overlay, worst: Math.max(paperWorst, inkWorst)};
}

async function upload(kind, file, filename) {
  if (!WRITE) return {_id: `<${kind}:${filename}>`};
  const stream = fs.createReadStream(file);
  return client.assets.upload(kind, stream, {filename});
}

const key = (s) => `${s}-${Math.random().toString(36).slice(2, 10)}`;

/*
  A MEDIA OBJECT, built the way the schema expects it, with the fields that are
  load-bearing set explicitly rather than left to default:

  - `overlay` and `overlayCaption` are the measured values;
  - `captionPlacement` is "below" wherever the frame is a film, because a film
    carries controls along its bottom edge and a caption there would collide
    with them;
  - `altIsDraft` is TRUE on every alt text written here, because these were
    written by us from looking at the frame and nobody has checked them.
*/
function media({posterId, alt, overlay, overlayCaption, videoId, placement = "over", provisional}) {
  const m = {
    _type: "media",
    poster: {_type: "image", asset: {_type: "reference", _ref: posterId}},
    alt: {_type: "localeString", it: alt.it, en: alt.en},
    altIsDraft: true,
    overlay,
    overlayCaption: overlayCaption ?? overlay,
    captionPlacement: placement,
  };
  if (videoId) m.video = {_type: "file", asset: {_type: "reference", _ref: videoId}};
  if (provisional) m.isProvisional = true;
  return m;
}

const log = (...a) => console.log(" ", ...a);
console.log(`\n  ${WRITE ? "WRITING" : "DRY RUN"} — new material into ${client.config().dataset}\n`);

/*
  RE-RUNNABLE, BECAUSE THE FIRST RUN WAS HALF-APPLIED. Every step asks the
  dataset whether its own file is already there, by ORIGINAL FILENAME, and
  skips itself if it is. Without this, fixing the one-insert-per-patch bug
  meant either hand-editing in the studio or uploading nine assets twice.
*/
const usedIn = await client.fetch(`{
  "cutouts": *[_id=="siteSettings"][0].cutoutMedia[].media.poster.asset->originalFilename,
  "process": *[_id=="siteSettings"][0].processMedia[].video.asset->originalFilename,
  "worn": *[_id=="siteSettings"][0].homeSequence[].garment->slug.current,
  "vest": *[_type=="garment" && slug.current=="capo-03"][0].media[].video.asset->originalFilename
}`);
const already = (list, name) => (list ?? []).filter(Boolean).includes(name);

/* ------------------------------------------------------------------ 1. cut-outs */

const CUTOUTS = [
  {
    file: "cutout-mesh-and-cream.png",
    garment: "capo-11",
    alt: {
      it: "Monumentus Lux: pantaloni chiari e maglia bianca, il capo ritagliato su fondo chiaro.",
      en: "Monumentus Lux: pale trousers and a white mesh top, the piece cut out on pale ground.",
    },
  },
  {
    file: "cutout-black-shirt.png",
    garment: "capo-02",
    alt: {
      it: "Oblivion: camicia in pelle nera portata aperta sui jeans, ritagliata su fondo chiaro.",
      en: "Oblivion: the black leather shirt worn open over jeans, cut out on pale ground.",
    },
  },
  {
    file: "cutout-shirt-as-dress.png",
    garment: "capo-02",
    alt: {
      it: "Oblivion: la camicia in pelle nera portata come abito, seduta, ritagliata su fondo chiaro.",
      en: "Oblivion: the black leather shirt worn as a dress, seated, cut out on pale ground.",
    },
  },
];

const cutoutTiles = [];
for (const c of CUTOUTS) {
  const file = asset(c.file);
  if (!fs.existsSync(file)) throw new Error(`missing ${file}`);
  if (already(usedIn.cutouts, c.file)) {
    log(`cut-out  ${c.file.padEnd(30)} already in cutoutMedia — skipped`);
    continue;
  }
  /*
    A CUT-OUT SITS ON THE PAGE'S OWN PAPER, so a caption over it is ink and
    there is nothing to measure — but it is measured anyway, because the ground
    was painted by a tool and "it should be #fafaf8" is exactly the kind of
    assumption this project keeps getting caught by.
  */
  const {overlay, worst} = await measurePolarity(file, {x: 0.05, y: 0.75, w: 0.9, h: 0.2});
  const garmentId = await client.fetch(`*[_type=="garment" && slug.current==$s][0]._id`, {s: c.garment});
  if (!garmentId) throw new Error(`no garment ${c.garment}`);
  const posterId = (await upload("image", file, c.file))._id;
  log(`cut-out  ${c.file.padEnd(30)} -> ${c.garment}  overlay=${overlay} (${worst.toFixed(1)}:1)`);
  cutoutTiles.push({
    _type: "homeTile",
    _key: key("cut"),
    media: media({posterId, alt: c.alt, overlay, placement: "below"}),
    garment: {_type: "reference", _ref: garmentId},
  });
}

/* ------------------------------------------------------------------ 2. the films */

/*
  EVERY FILM IS MARKED `isProvisional` — NO.

  That flag means "a stopgap frame awaiting a real one" and these ARE the real
  ones: 4K60 camera originals, which is precisely what section 83 asked for and
  section 113 said was still missing. What they are not is LOOPS, and that is
  carried by the absence of a loop rather than by a flag on the asset.
*/
const FILMS = [
  {
    name: "drop film",
    video: "drop-film.mp4",
    poster: "drop-film-poster.jpg",
    alt: {
      it: "Il film del drop: la modella nel cortile, in pelle, alla luce del sole.",
      en: "The drop film: the model in the yard, in leather, in full sun.",
    },
  },
  {
    name: "process hands",
    video: "process-hands.mp4",
    poster: "process-hands-poster.jpg",
    alt: {
      it: "Le mani che sistemano un capo appeso al muro di cemento.",
      en: "Hands settling a piece hung on the concrete wall.",
    },
  },
  {
    name: "capo-03 zip",
    video: "capo-03-zip.mp4",
    poster: "capo-03-zip-poster.jpg",
    alt: {
      it: "Il gilet Monumentus chiuso con la cerniera, addosso.",
      en: "The Monumentus vest being zipped, worn.",
    },
  },
];

const films = {};
for (const f of FILMS) {
  const v = asset(f.video);
  const p = asset(f.poster);
  for (const x of [v, p]) if (!fs.existsSync(x)) throw new Error(`missing ${x}`);
  const landed = f.video === "capo-03-zip.mp4" ? usedIn.vest : usedIn.process;
  if (already(landed, f.video)) {
    log(`film     ${f.video.padEnd(30)} already in place — skipped`);
    continue;
  }
  /*
    THE CAPTION BAND OF A FILM IS THE TOP, NOT THE BOTTOM. The controls own the
    bottom edge, so anything the site writes on a film goes at the top and the
    polarity is measured there.
  */
  const {overlay, worst} = await measurePolarity(p, {x: 0, y: 0, w: 1, h: 0.18});
  const posterId = (await upload("image", p, f.poster))._id;
  const videoId = (await upload("file", v, f.video))._id;
  const bytes = (fs.statSync(v).size / 1024 / 1024).toFixed(1);
  log(`film     ${f.video.padEnd(30)} ${bytes}MB  overlay=${overlay} (${worst.toFixed(1)}:1)`);
  films[f.name] = media({posterId, alt: f.alt, overlay, videoId, placement: "below"});
}

/* ------------------------------------------------------------------ 3. the patches */

const settings = await client.fetch(
  `*[_id=="siteSettings"][0]{
     "process": processMedia[]{_key, "file": poster.asset->originalFilename, "hasVideo": defined(video)},
     "seq": homeSequence[]{_key}
   }`,
);

/* Rubedo's worn frame — already in the dataset; this is a link, not an upload. */
const rubedo = await client.fetch(
  `*[_type=="garment" && slug.current=="rubedo"][0]{
     _id, "frame": media[2]{poster, alt, overlay, overlayCaption, captionPlacement}
   }`,
);
if (!rubedo?.frame?.poster) throw new Error("Rubedo's worn frame not found");

const rubedoTile = already(usedIn.worn, "rubedo")
  ? null
  : {
      _type: "homeTile",
      _key: key("worn"),
      media: {_type: "media", ...rubedo.frame},
      garment: {_type: "reference", _ref: rubedo._id},
    };
log(rubedoTile ? `worn band  + RUBEDO (its own frame, already in the dataset)` : `worn band  RUBEDO already there — skipped`);

/*
  THE 464px COPY LEAVES THE SITE. The one entry in `processMedia` that carries a
  video is the messaging-app copy section 113 called the weakest frame on the
  site. Its poster and its video are both replaced by the camera original.
*/
const oldFilm = settings.process?.find((p) => p.hasVideo && p.file === "process-loop-poster.jpg");
if (oldFilm) log(`process    replacing the 464px copy at ${oldFilm.file}`);

/*
  ONE `insert` PER PATCH, AND THAT IS NOT A STYLE CHOICE (2026-08-12).

  The first version of this script chained four array operations onto a single
  patch — three appends and a set — and Sanity accepted it, returned success,
  and applied ONLY THE LAST INSERT. The cut-outs and Rubedo were silently
  dropped; the films landed, so the run looked like it had worked. **A patch
  carries at most one insert**, and `append()` is sugar for one.

  So each array gets its own patch, and they go in one transaction so the whole
  thing still lands or none of it does. The check afterwards is not optional:
  this failure mode is invisible from the response.
*/
const tx = client.transaction();

if (cutoutTiles.length) {
  tx.patch(client.patch("siteSettings").setIfMissing({cutoutMedia: []}).append("cutoutMedia", cutoutTiles));
}
if (rubedoTile) {
  tx.patch(client.patch("siteSettings").append("homeSequence", [rubedoTile]));
}
if (films["drop film"] && oldFilm) {
  tx.patch(
    client
      .patch("siteSettings")
      .set({[`processMedia[_key=="${oldFilm._key}"]`]: {_key: oldFilm._key, ...films["drop film"]}}),
  );
}
if (films["process hands"]) {
  tx.patch(client.patch("siteSettings").append("processMedia", [{_key: key("proc"), ...films["process hands"]}]));
}

/* A CREATURE'S SECOND FRAME: the vest being zipped, on the vest's own page. */
if (films["capo-03 zip"]) {
  const vest = await client.fetch(`*[_type=="garment" && slug.current=="capo-03"][0]{_id, "n": count(media)}`);
  if (!vest) throw new Error("capo-03 not found");
  log(`capo-03    inserting the film as frame 2 of ${vest.n}`);
  tx.patch(client.patch(vest._id).insert("after", "media[0]", [{_key: key("film"), ...films["capo-03 zip"]}]));
}

if (!WRITE) {
  console.log("\n  Nothing was written. Re-run with --write.\n");
} else {
  await tx.commit();
  /*
    READ IT BACK. See the note above: the response is not evidence.
  */
  const after = await client.fetch(
    `*[_id=="siteSettings"][0]{"cutouts": count(cutoutMedia), "worn": count(homeSequence),
      "films": count(processMedia[defined(video)])}`,
  );
  console.log(
    `\n  Written. Now: ${after.cutouts} cut-outs, ${after.worn} tiles in the worn band, ` +
      `${after.films} films on /process.\n`,
  );
}
