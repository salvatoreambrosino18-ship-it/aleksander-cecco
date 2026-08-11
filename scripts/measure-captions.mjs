/*
  THE CAPTION BAND, MEASURED PER PHOTOGRAPH.

    npm run measure-captions            what it would change, and nothing else
    npm run measure-captions -- --write patch overlayCaption and captionPlacement

  This is the surviving half of a pair. `measure-chrome` measured the band at the
  TOP of a frame, where the signature and MENU used to float; it was deleted on
  2026-08-11 when the chrome stopped floating (section 87) and there was no
  longer a band up there to measure. The band at the BOTTOM is still real,
  because a caption still sits ON the photograph wherever the photograph can
  carry one.

  WHAT IT DECIDES, per frame, and the two answers are different questions:

    overlayCaption     if a caption sits here, is it white or black?
    captionPlacement   CAN a caption sit here at all?

  The second is the one that matters. A photograph that is bright at one end of
  the caption band and dark at the other has no legible text colour, and the
  honest answer is to take the words off the picture and set them on the page
  below it (section 58). Sixty-two of sixty-nine frames already say `below` for
  exactly that reason; this tool exists because the ones that do not were never
  measured.

  THE MEASURE IS WORST-CASE, and deliberately harsh: a caption-sized window is
  slid along the band at every container shape the site renders, and the worst
  position any word could land in decides the value. A band that averages safe
  and contains one bright patch is how a caption measures fine and renders at
  1.00:1 — which is what section 58 found the first time.

  THE THRESHOLD IS 8.0, not 4.5, and it was arrived at by measuring rather than
  by taste (see lib/measure-overlay.mjs): at 4.5 twelve captions still failed at
  desktop and at 6.0 six did, because a mean cannot model where a word falls.
  Above 8.0 the error is on the side of moving text off a photograph, which
  costs a composition; below it the error is an unreadable price.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import sharp from "sharp";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const L_PAPER = 0.9563; // #FAFAF8
const L_INK = 0.0033; // #0A0A0A
const SAFE_ON_IMAGE = 8.0;
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/*
  Every container shape a full-bleed frame is cropped to by object-fit: cover.
  A caption does not sit at a fixed place in the FILE — it sits at a fixed place
  in the BOX — so the same photograph must be measured once per shape.
*/
const CONTAINERS = [
  390 / 844, // a phone, one screen
  390 / 743, // a phone, 88svh
  390 / 523, // a phone, a 62svh short row
  1440 / 844, // desktop, one screen less the band
  1440 / 790, // desktop, 88svh
  720 / 790, // desktop, half a row
];

/*
  WHERE A CAPTION SITS inside its box: hard against the bottom, inset by
  --caption-inset, running from the left margin across most of the width.

  The band is deliberately TALL. On a Creature page a caption is one line, but
  the home arrival carries four — a drop name, his sentence, a price and the way
  in — and measuring only the last line would pass a block whose top line sits
  on something else entirely.
*/
/*
  WHERE THIS MODEL LOSES, AND WHO WINS WHEN IT DOES.

  This is a luminance model: it slides a window along a band and averages. The
  audit in `npm run shots` measures the pixels inside the ACTUAL rendered text
  box in a real browser, which is strictly better evidence, and on 2026-08-11
  the two disagreed on one frame — Vertex, the hat, whose only photograph is a
  900px crop of the designer portrait. The model called it safe at 8.0+; the
  browser measured the rendered caption at 4.35:1 and was right.

  So the browser is the authority and the disagreements are listed here rather
  than argued away. A frame in this list is forced off the picture whatever the
  model thinks. Add to it from an audit run, never from an opinion.
*/
const BROWSER_OVERRIDES = new Set([
  "capo-14#0", // Vertex: model 8.0+, rendered 4.35:1 at 1440
]);

const BAND_TOP = 0.62;
const BAND_BOTTOM = 0.99;
const BAND_LEFT = 0.03;
const BAND_RIGHT = 0.78;
const WINDOW_W = 0.16;
const WINDOW_H = 0.07;

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
  const buf = Buffer.from(await (await fetch(`${url}?w=900&fit=max`)).arrayBuffer());
  const {data, info} = await sharp(buf).removeAlpha().raw().toBuffer({resolveWithObject: true});
  const W = info.width;
  const H = info.height;

  const readings = [];
  for (const aspect of CONTAINERS) {
    let cw = W;
    let ch = W / aspect;
    if (ch > H) {
      ch = H;
      cw = H * aspect;
    }
    const cx = (W - cw) / 2;
    const cy = (H - ch) / 2;
    for (let wy = BAND_TOP; wy <= BAND_BOTTOM - WINDOW_H; wy += 0.06) {
      for (let wx = BAND_LEFT; wx <= BAND_RIGHT - WINDOW_W; wx += 0.06) {
        readings.push(
          meanLuminance(data, info, cx + cw * wx, cy + ch * wy, cw * WINDOW_W, ch * WINDOW_H),
        );
      }
    }
  }

  const worstPaper = Math.min(...readings.map((l) => ratio(L_PAPER, l)));
  const worstInk = Math.min(...readings.map((l) => ratio(L_INK, l)));
  const best = Math.max(worstPaper, worstInk);
  return {
    overlayCaption: worstPaper >= worstInk ? "paper" : "ink",
    contrast: Number(best.toFixed(2)),
    safeOnImage: best >= SAFE_ON_IMAGE,
  };
}

/*
  Every place a media object lives. Written out rather than discovered, because
  a field this misses is a photograph nobody measures and nobody notices.
*/
const DOCS = /* groq */ `*[_type in ["garment", "archivePiece", "collection"] || _id == "siteSettings"]{
  _id, _type, "name": coalesce(name, title, "site settings"), "slug": slug.current,
  "slots": [
    {"path": "media", "list": media[]{overlay, overlayCaption, captionPlacement, "url": poster.asset->url}},
    {"path": "cover", "one": cover{overlay, overlayCaption, captionPlacement, "url": poster.asset->url}},
    {"path": "openingMedia", "one": openingMedia{overlay, overlayCaption, captionPlacement, "url": poster.asset->url}},
    {"path": "aboutOpeningMedia", "one": aboutOpeningMedia{overlay, overlayCaption, captionPlacement, "url": poster.asset->url}},
    {"path": "designerPortrait", "one": designerPortrait{overlay, overlayCaption, captionPlacement, "url": poster.asset->url}},
    {"path": "makingMedia", "list": makingMedia[]{overlay, overlayCaption, captionPlacement, "url": poster.asset->url}},
    {"path": "processMedia", "list": processMedia[]{overlay, overlayCaption, captionPlacement, "url": poster.asset->url}},
    {"path": "aboutMedia", "list": aboutMedia[]{overlay, overlayCaption, captionPlacement, "url": poster.asset->url}},
    {"path": "homeSequence", "list": homeSequence[].media{overlay, overlayCaption, captionPlacement, "url": poster.asset->url}},
    {"path": "instagramFrames", "list": instagramFrames[].media{overlay, overlayCaption, captionPlacement, "url": poster.asset->url}}
  ]
}`;

async function main() {
  const docs = await client.fetch(DOCS);
  console.log(`\nCaption band: ${client.config().projectId}/${client.config().dataset}`);
  console.log(WRITE ? "  WRITING\n" : "  DRY RUN — nothing will be written\n");

  const changes = [];
  let measured = 0;

  for (const doc of docs) {
    for (const slot of doc.slots ?? []) {
      const items = slot.list ?? (slot.one ? [slot.one] : []);
      for (const [index, item] of items.entries()) {
        if (!item?.url) continue;
        /*
          MEASURE WHAT IS ON THE PICTURE; LEAVE ALONE WHAT IS ALREADY OFF IT.

          `overlayCaption` is read by exactly one branch of MediaSurface: the
          one that paints a caption ON the photograph. A frame already set to
          `below` renders its caption in page polarity, so its stored value is
          inert — and rewriting it would be thirty-odd document writes that
          change no pixel, over values the studio explicitly invites a human to
          disagree with. The first dry run wanted to do exactly that.
        */
        if ((item.captionPlacement ?? "over") === "below") continue;
        const m = await measure(item.url);
        measured++;
        const overridden = BROWSER_OVERRIDES.has(`${doc.slug}#${index}`);
        const wantPlacement = m.safeOnImage && !overridden ? item.captionPlacement || "over" : "below";
        const polarityChanged = (item.overlayCaption ?? null) !== m.overlayCaption;
        const placementChanged = (item.captionPlacement ?? "over") !== wantPlacement;
        if (!polarityChanged && !placementChanged) continue;
        changes.push({
          doc,
          path: slot.path,
          index: slot.list ? index : null,
          from: {caption: item.overlayCaption ?? null, placement: item.captionPlacement ?? "over"},
          to: {caption: m.overlayCaption, placement: wantPlacement},
          contrast: m.contrast,
          overridden,
        });
      }
    }
  }

  for (const c of changes) {
    const where = `${c.doc.name}`.slice(0, 22).padEnd(24);
    const slot = c.index === null ? c.path : `${c.path}[${c.index}]`;
    const move =
      c.from.placement !== c.to.placement
        ? `  ${c.from.placement} -> ${c.to.placement}${c.overridden ? " (browser)" : ""}`
        : "                ";
    console.log(
      `  ${where}${slot.padEnd(20)} ${String(c.contrast).padStart(6)}:1  ` +
        `${(c.from.caption ?? "unset").padEnd(6)} -> ${c.to.caption.padEnd(6)}${move}`,
    );
  }

  console.log(`\n  ${measured} frames measured, ${changes.length} would change.`);
  if (!WRITE) {
    console.log("  Re-run with --write to patch them.\n");
    return;
  }

  /*
    READ WHOLE, WRITE WHOLE. Addressing a nested object by a dotted path
    replaced four media objects with a bare string once (section 78), and the
    only thing that saved it was document history.
  */
  const byDoc = new Map();
  for (const c of changes) {
    const list = byDoc.get(c.doc._id) ?? [];
    list.push(c);
    byDoc.set(c.doc._id, list);
  }

  for (const [id, list] of byDoc) {
    const doc = await client.getDocument(id);
    const patch = {};
    for (const c of list) {
      if (c.path === "homeSequence") {
        const tiles = [...(doc.homeSequence ?? [])];
        const tile = tiles[c.index];
        if (!tile?.media) continue;
        tiles[c.index] = {...tile, media: {...tile.media, overlayCaption: c.to.caption, captionPlacement: c.to.placement}};
        patch.homeSequence = tiles;
      } else if (c.path === "instagramFrames") {
        const frames = [...(doc.instagramFrames ?? [])];
        const frame = frames[c.index];
        if (!frame?.media) continue;
        frames[c.index] = {...frame, media: {...frame.media, overlayCaption: c.to.caption, captionPlacement: c.to.placement}};
        patch.instagramFrames = frames;
      } else if (c.index === null) {
        const one = doc[c.path];
        if (!one) continue;
        patch[c.path] = {...one, overlayCaption: c.to.caption, captionPlacement: c.to.placement};
      } else {
        const list2 = patch[c.path] ?? [...(doc[c.path] ?? [])];
        const item = list2[c.index];
        if (!item) continue;
        list2[c.index] = {...item, overlayCaption: c.to.caption, captionPlacement: c.to.placement};
        patch[c.path] = list2;
      }
    }
    if (Object.keys(patch).length === 0) continue;
    await client.patch(id).set(patch).commit();
    console.log(`  patched ${doc.name ?? doc.title ?? id}`);
  }

  console.log("\n  Done. LOOK AT THE PAGES: this moves words on and off");
  console.log("  photographs, which is a change no build check can see.\n");
}

main().catch((error) => {
  console.error("\nCaption measurement failed:", error.message);
  process.exit(1);
});
