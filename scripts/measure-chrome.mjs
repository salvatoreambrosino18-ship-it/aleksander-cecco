/*
  MEASURE THE CHROME BAND, at every width, and write overlayChrome.

    npm run measure-chrome              measure and report, write nothing
    npm run measure-chrome -- --write   patch overlayChrome into the dataset

  WHY THIS EXISTS (section 77). `overlay` is the polarity of the signature and
  MENU as they pass over a photograph. It was measured ONCE, against a phone
  crop (scripts/lib/measure-overlay.mjs, VIEW = 390/844), and then used at every
  width. `object-fit: cover` crops a photograph differently at every aspect
  ratio, so at 1440x900 the pixels under the chrome are a different part of the
  file entirely — and a browser measured the corner mark below 1.5:1 on 48
  page/width combinations, worst 1.00:1, a white signature on pale concrete.

  This is exactly the mistake `overlayCaption` was invented to fix at the BOTTOM
  of the frame in section 58, one band higher up. So this borrows that fix's
  method wholesale rather than inventing a new one:

    - simulate the containers the site actually has, not one,
    - inside each, measure the rectangle the mark actually occupies,
    - slide a window across it and keep the WORST reading,
    - and let the better of the two polarities win.

  It measures with sharp against the CDN rather than with headless Chrome
  against seed-photos/, because the dataset is the truth: a frame uploaded in
  the studio has no local file, and a local file that was never uploaded is not
  on the site.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const project = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET;
const api = process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01";
const token = process.env.SANITY_WRITE_TOKEN;

const WRITE = process.argv.includes("--write");

const L_PAPER = 0.9563; // #FAFAF8
const L_INK = 0.0033; // #0A0A0A
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/*
  The containers a photograph is actually seen in, as aspect ratios. Same list
  the caption measurement uses, for the same reason: a reader meets exactly one
  of them, so the honest answer is the worst.
*/
const CONTAINERS = [
  390 / 844, // a phone, full screen
  390 / 743, // a phone, an 88svh block
  390 / 523, // a phone, a 62svh short row
  1440 / 900, // desktop, a full screen
  1440 / 790, // desktop, an 88svh block
  720 / 790, // desktop, half a row
];

/*
  WHERE THE MARK SITS inside its container, as fractions of the container.

  The chrome is the signature plus MENU: --chrome-h is --sig-corner-h plus two
  units of padding, under a one-line banner. That lands at roughly 4% to 16% of
  the viewport's height at both widths, starting at the left margin and running
  to a little past half way — MENU sits beside the mark, not under it.
*/
const BAND_TOP = 0.035;
const BAND_HEIGHT = 0.125;
const BAND_LEFT = 0.04;
const BAND_RIGHT = 0.56;

async function query(groq) {
  const url = `https://${project}.api.sanity.io/v${api}/data/query/${dataset}?query=${encodeURIComponent(groq)}`;
  const res = await fetch(url, token ? {headers: {Authorization: `Bearer ${token}`}} : undefined);
  const body = await res.json();
  if (body.error) throw new Error(JSON.stringify(body.error));
  return body.result;
}

/** Mean relative luminance of one rectangle of an already-decoded image. */
function meanLuminance(data, info, x, y, w, h) {
  const x0 = Math.max(0, Math.round(x));
  const y0 = Math.max(0, Math.round(y));
  const x1 = Math.min(info.width, Math.round(x + w));
  const y1 = Math.min(info.height, Math.round(y + h));
  if (x1 <= x0 || y1 <= y0) return 0.5;
  const lin = (v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  let sum = 0;
  let n = 0;
  for (let py = y0; py < y1; py++) {
    for (let px = x0; px < x1; px++) {
      const i = (py * info.width + px) * info.channels;
      sum += 0.2126 * lin(data[i]) + 0.7152 * lin(data[i + 1]) + 0.0722 * lin(data[i + 2]);
      n++;
    }
  }
  return n ? sum / n : 0.5;
}

async function measure(url) {
  // 900px is plenty: the band is a large region and this is a luminance mean,
  // not a detail measurement. It keeps a 40-image run to a few seconds.
  const buf = Buffer.from(await (await fetch(`${url}?w=900&fit=max`)).arrayBuffer());
  const {data, info} = await sharp(buf).removeAlpha().raw().toBuffer({resolveWithObject: true});
  const W = info.width;
  const H = info.height;

  const readings = [];
  for (const aspect of CONTAINERS) {
    // What object-fit: cover keeps of this file at that aspect.
    let cw = W;
    let ch = W / aspect;
    if (ch > H) {
      ch = H;
      cw = H * aspect;
    }
    const cx = (W - cw) / 2;
    const cy = (H - ch) / 2;
    /*
      Slide a mark-sized window across the band rather than averaging the whole
      of it. The signature is wide and MENU is narrow, and a band that is dark
      at one end and bright at the other averages to something neither of them
      sits on — which is how a value can measure safe and render at 1.00.
    */
    for (let wx = BAND_LEFT; wx <= BAND_RIGHT - 0.14; wx += 0.06) {
      readings.push(meanLuminance(data, info, cx + cw * wx, cy + ch * BAND_TOP, cw * 0.14, ch * BAND_HEIGHT));
    }
  }

  const worstPaper = Math.min(...readings.map((l) => ratio(L_PAPER, l)));
  const worstInk = Math.min(...readings.map((l) => ratio(L_INK, l)));
  return {
    overlayChrome: worstPaper >= worstInk ? "paper" : "ink",
    contrast: Number(Math.max(worstPaper, worstInk).toFixed(2)),
  };
}

/*
  EVERY PLACE A MEDIA OBJECT LIVES. Written out rather than discovered, because
  a media object that this list forgets is a photograph that silently keeps the
  old value, and a silent miss is exactly the failure section 74 was about.

  `_key` is what makes a nested array item patchable: Sanity addresses it as
  `media[_key=="abc"].overlayChrome`, which survives reordering, where an index
  does not.
*/
const SOURCES = [
  {
    type: "siteSettings",
    groq: `*[_id == "siteSettings"][0]{
      _id,
      "single": [
        {"path": "openingMedia", "url": openingMedia.poster.asset->url, "overlay": openingMedia.overlay, "object": openingMedia},
        {"path": "aboutOpeningMedia", "url": aboutOpeningMedia.poster.asset->url, "overlay": aboutOpeningMedia.overlay, "object": aboutOpeningMedia},
        {"path": "designerPortrait", "url": designerPortrait.poster.asset->url, "overlay": designerPortrait.overlay, "object": designerPortrait}
      ],
      "lists": [
        {"field": "makingMedia", "items": makingMedia[]{_key, "url": poster.asset->url, overlay, "has": defined(overlayChrome)}},
        {"field": "processMedia", "items": processMedia[]{_key, "url": poster.asset->url, overlay, "has": defined(overlayChrome)}},
        {"field": "aboutMedia", "items": aboutMedia[]{_key, "url": poster.asset->url, overlay, "has": defined(overlayChrome)}},
        {"field": "homeSequence", "items": homeSequence[]{_key, "url": media.poster.asset->url, "overlay": media.overlay, "has": defined(media.overlayChrome)}, "nested": "media"},
        {"field": "instagramFrames", "items": instagramFrames[]{_key, "url": media.poster.asset->url, "overlay": media.overlay, "has": defined(media.overlayChrome)}, "nested": "media"}
      ]
    }`,
  },
  {
    type: "garment",
    groq: `*[_type == "garment"]{_id, "lists": [
      {"field": "media", "items": media[]{_key, "url": poster.asset->url, overlay, "has": defined(overlayChrome)}}
    ]}`,
  },
  {
    type: "collection",
    groq: `*[_type == "collection"]{_id, "single": [
      {"path": "cover", "url": cover.poster.asset->url, "overlay": cover.overlay, "object": cover}
    ]}`,
  },
  {
    type: "archivePiece",
    groq: `*[_type == "archivePiece"]{_id, "lists": [
      {"field": "media", "items": media[]{_key, "url": poster.asset->url, overlay, "has": defined(overlayChrome)}}
    ]}`,
  },
];

async function collect() {
  const targets = [];
  for (const source of SOURCES) {
    const result = await query(source.groq);
    const docs = Array.isArray(result) ? result : result ? [result] : [];
    for (const doc of docs) {
      for (const item of doc.single ?? []) {
        if (item?.url) targets.push({doc: doc._id, field: item.path, ...item});
      }
      for (const list of doc.lists ?? []) {
        for (const item of list.items ?? []) {
          if (!item?.url) continue;
          const leaf = list.nested ? `${list.nested}.overlayChrome` : "overlayChrome";
          targets.push({doc: doc._id, path: `${list.field}[_key=="${item._key}"].${leaf}`, ...item});
        }
      }
    }
  }
  return targets;
}

async function main() {
  console.log(`\nChrome band: ${project}/${dataset}\n`);
  const targets = await collect();
  console.log(`  ${targets.length} photographs\n`);

  const patches = [];
  let flips = 0;
  let unreadable = 0;

  for (const target of targets) {
    const {overlayChrome, contrast} = await measure(target.url);
    const flipped = overlayChrome !== target.overlay;
    if (flipped) flips++;
    // Below 4.5 the mark cannot be made legible by choosing a side; the band
    // simply holds both extremes. Worth counting and worth saying out loud.
    if (contrast < 4.5) unreadable++;
    const name = target.url.split("/").pop().slice(0, 34);
    console.log(
      `  ${flipped ? "FLIP" : "keep"}  ${overlayChrome.padEnd(5)} ${String(contrast).padStart(6)}:1 ` +
        `${contrast < 4.5 ? "  (band holds both extremes)" : ""}  ${name}`,
    );
    /*
      TWO WAYS TO WRITE, AND ONLY ONE OF THEM IS SAFE HERE.

      An array item is addressed by key — `media[_key=="abc"].overlayChrome` —
      and that works: the mutation reaches the nested field and leaves the rest
      of the item alone.

      A PLAIN NESTED OBJECT IS NOT. Setting `openingMedia.overlayChrome` through
      this API REPLACED openingMedia with the string "paper" — the poster, the
      alt text, the caption placement, all of it gone, on four fields across two
      documents, and the site then built from placeholders. Restored from
      Sanity's document history, which is the only reason this was cheap.

      So a single object is never addressed by a dotted path. The object is read
      whole and written back whole with the one property added, which cannot
      lose a sibling field even if the API disagrees with me again.
    */
    if (target.field) {
      patches.push({
        patch: {id: target.doc, set: {[target.field]: {...target.object, overlayChrome}}},
      });
    } else {
      patches.push({patch: {id: target.doc, set: {[target.path]: overlayChrome}}});
    }
  }

  console.log(
    `\n  ${flips} of ${targets.length} disagree with the value measured for a phone.` +
      `\n  ${unreadable} sit under 4.5:1 whichever side is chosen.\n`,
  );

  if (!WRITE) {
    console.log("  Nothing written. Re-run with --write to patch overlayChrome.\n");
    return;
  }
  if (!token) throw new Error("SANITY_WRITE_TOKEN is not set");

  const res = await fetch(`https://${project}.api.sanity.io/v${api}/data/mutate/${dataset}`, {
    method: "POST",
    headers: {"content-type": "application/json", Authorization: `Bearer ${token}`},
    body: JSON.stringify({mutations: patches}),
  });
  const body = await res.json();
  if (body.error) throw new Error(JSON.stringify(body.error));
  console.log(`  Wrote overlayChrome to ${patches.length} photographs.\n`);
}

await main();
