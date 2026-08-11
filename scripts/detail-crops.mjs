/*
  DETAIL CROPS: construction details cut from photographs he has already taken.

    npm run detail-crops              what it would do, and nothing else
    npm run detail-crops -- --write   upload the crops and insert them

  WHY THIS EXISTS (section 88). The site's weakness was named for weeks: his
  photography is atmosphere, and a buyer sending three body measurements for a
  four-figure made-to-measure piece cannot see the cut. The answer looked like a
  shoot — three new photographs per piece, an afternoon of his time — until
  every frame in the dataset was read at full resolution and 41 of 83 turned out
  to carry a construction detail croppable at 1200px or more on its long edge,
  which is the size of the smallest frames this site already publishes.

  So the details were already there. What is not there, and cannot be cut out of
  a file, is the SENTENCE under each one: "500 punti cicatrice, cuciti a mano" is
  a fact only he knows. Every crop is therefore imported with an EMPTY caption
  and marked `needsCaption`, and `npm run launch-check` names each one until he
  writes it.

  WHAT IT WILL NOT DO, and each refusal is deliberate:

  - It never touches the FIRST frame of a piece. That frame is the piece's
    arrival, the LCP image, and the share card; a crop belongs after it.
  - It never removes or reorders anything. Each crop is spliced in after the
    frame it was cut from, and every existing frame keeps its place.
  - It writes the caption EMPTY. Filling it would be inventing his voice, which
    is the one thing this project refuses everywhere else.
  - It is idempotent by asset id: a crop already in a piece's media array is
    skipped, so running it twice does not shear a page into duplicates.
  - It reads whole documents and writes whole media arrays. Addressing a nested
    object by a dotted path replaced four media objects with a bare string once
    (section 78) and document history is what saved it.

  THE CROPS THEMSELVES are declared below as fractions of their source frame, so
  the rectangle survives a re-export at a different size, and each one was cut
  and LOOKED AT before it was written down. `sourceIndex` is the frame in that
  piece's media array the crop comes from.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
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

/*
  ALT TEXT IS OURS, so every one of these ships flagged `altIsDraft`, exactly as
  the 56 generated descriptions already in the dataset do. It describes what is
  in the frame and claims nothing about how the piece was made — that claim is
  the caption, and the caption is his.
*/
const CROPS = [
  {
    slug: "rubedo",
    sourceIndex: 6,
    rect: [0.55, 0.6, 0.45, 0.4],
    detail: "the hand stitching down the front panel",
    alt: "Dettaglio della cucitura a mano che scende lungo il davanti della giacca rossa.",
  },
  {
    slug: "rubedo",
    sourceIndex: 6,
    rect: [0.28, 0.3, 0.44, 0.3],
    detail: "his handwriting inked inside the collar",
    alt: "Interno del collo della giacca rossa, con una scritta a mano sulla pelle.",
  },
  {
    slug: "rubedo",
    sourceIndex: 4,
    rect: [0.32, 0.2, 0.46, 0.38],
    detail: "the opening in the upper back",
    alt: "Apertura a mandorla sulla schiena della giacca rossa, tra le cuciture verticali.",
  },
  {
    slug: "rubedo",
    sourceIndex: 4,
    rect: [0.3, 0.55, 0.45, 0.28],
    detail: "the raw scalloped hem",
    alt: "Orlo grezzo e smerlato della giacca rossa, contro il muro di cemento.",
  },
  {
    slug: "capo-02",
    sourceIndex: 1,
    rect: [0.2, 0.25, 0.55, 0.45],
    detail: "the centre-back seam and its topstitching",
    alt: "Cucitura centrale sulla schiena della camicia in pelle nera, con impuntura visibile.",
  },
  {
    slug: "capo-02",
    sourceIndex: 4,
    rect: [0.25, 0.35, 0.5, 0.4],
    detail: "the cut hem, left raw",
    alt: "Orlo appuntito e non rifinito della camicia in pelle nera, contro il cemento chiaro.",
  },
  {
    slug: "capo-02",
    sourceIndex: 6,
    rect: [0.3, 0.3, 0.42, 0.35],
    detail: "the snaps and the stitched placket edge",
    alt: "Bottoni a pressione e bordo cucito dell'abbottonatura, sulla pelle nera.",
  },
  {
    slug: "capo-01",
    sourceIndex: 1,
    rect: [0.3, 0.2, 0.4, 0.35],
    detail: "the collar, the snaps and the crumpled grain",
    alt: "Collo e bottoni a pressione della camicia nera, con la pelle increspata.",
  },
  {
    slug: "capo-10",
    sourceIndex: 1,
    rect: [0.25, 0.3, 0.53, 0.3],
    detail: "the two welt zips at the back waist",
    alt: "Due tasche con zip a filetto sul dietro dei pantaloni chiari.",
  },
  {
    slug: "capo-05",
    sourceIndex: 1,
    rect: [0.3, 0.35, 0.45, 0.35],
    detail: "the waistband, the belt loops and the exposed zip",
    alt: "Cintura, passanti e zip a vista sui pantaloni in pelle nera.",
  },
  {
    slug: "capo-13",
    sourceIndex: 0,
    rect: [0.3, 0.35, 0.4, 0.35],
    detail: "a panel let into the leg, and the stamped tape",
    alt: "Pannello inserito nella gamba dei pantaloni, con nastro stampato lungo la cucitura.",
  },
  {
    slug: "capo-12",
    sourceIndex: 0,
    rect: [0.35, 0.15, 0.4, 0.35],
    detail: "the wrapped collar in crinkled leather",
    alt: "Collo alto avvolto in pelle increspata, sul manichino.",
  },
  {
    slug: "capo-03",
    sourceIndex: 0,
    rect: [0.27, 0.36, 0.51, 0.38],
    detail: "the scrap panels and their stitched edges",
    alt: "Pannelli di ritaglio cuciti sul davanti del gilet nero, attorno alla zip.",
  },
];

/* The floor every crop must clear: the smallest frame the site already ships. */
const MIN_LONG_EDGE = 1200;

const GARMENTS = /* groq */ `*[_type == "garment" && defined(slug.current)]{
  _id, name, "slug": slug.current,
  media[]{
    _key, alt, overlay, overlayCaption, captionPlacement, caption, altIsDraft,
    isProvisional, needsCaption,
    "assetId": poster.asset._ref,
    "url": poster.asset->url,
    "w": poster.asset->metadata.dimensions.width,
    "h": poster.asset->metadata.dimensions.height
  }
}`;

const key = () => Math.random().toString(36).slice(2, 12);

async function main() {
  const garments = await client.fetch(GARMENTS);
  const bySlug = new Map(garments.map((g) => [g.slug, g]));

  console.log(`\nDetail crops: ${client.config().projectId}/${client.config().dataset}`);
  console.log(WRITE ? "  WRITING\n" : "  DRY RUN — nothing will be written\n");

  const planned = new Map();
  let refused = 0;

  for (const crop of CROPS) {
    const garment = bySlug.get(crop.slug);
    if (!garment) {
      console.log(`  REFUSED  ${crop.slug}: no such Creature`);
      refused++;
      continue;
    }
    const source = garment.media?.[crop.sourceIndex];
    if (!source?.url) {
      console.log(`  REFUSED  ${crop.slug}#${crop.sourceIndex}: no such frame`);
      refused++;
      continue;
    }
    /*
      NEVER BEFORE THE FIRST FRAME — which the splice below guarantees by
      construction, because a crop always lands at sourceIndex + 1 and the
      lowest that can be is 1.

      The first version of this refused any crop cut from the ONLY frame a piece
      has, on the reasoning that a page would then open on a detail. The dry run
      showed that reasoning was simply wrong: the wide view stays exactly where
      it was and the detail follows it, which is the arrangement being asked
      for. Three pieces — capo-03, capo-12, capo-13 — were refused by it, and
      each has precisely one photograph and therefore the most to gain from a
      second. Recorded rather than quietly deleted: a guard that fires on the
      cases it was meant to help is worth remembering.
    */

    const [l, t, w, h] = crop.rect;
    const px = {
      left: Math.round(l * source.w),
      top: Math.round(t * source.h),
      width: Math.round(w * source.w),
      height: Math.round(h * source.h),
    };
    const longEdge = Math.max(px.width, px.height);
    if (longEdge < MIN_LONG_EDGE) {
      console.log(
        `  REFUSED  ${crop.slug} ${crop.detail}: ${px.width}x${px.height}, under the ${MIN_LONG_EDGE}px floor`,
      );
      refused++;
      continue;
    }

    const list = planned.get(garment.slug) ?? [];
    list.push({crop, garment, source, px});
    planned.set(garment.slug, list);
    console.log(
      `  ${crop.slug.padEnd(12)} ${String(px.width).padStart(4)}x${String(px.height).padEnd(4)}` +
        `  from frame ${crop.sourceIndex} (${source.w}x${source.h})  — ${crop.detail}`,
    );
  }

  if (!WRITE) {
    console.log(`\n  ${CROPS.length - refused} crops would be imported, ${refused} refused.`);
    console.log("  Re-run with --write to upload them.\n");
    return;
  }

  for (const [slug, items] of planned) {
    const garment = items[0].garment;
    /*
      Read the document WHOLE and write the media array WHOLE. Never a dotted
      path into a nested object (section 78).
    */
    const doc = await client.getDocument(garment._id);
    const media = [...(doc.media ?? [])];

    for (const {crop, source, px} of items) {
      const url = new URL(source.url);
      url.searchParams.set("rect", `${px.left},${px.top},${px.width},${px.height}`);
      url.searchParams.set("fm", "jpg");
      url.searchParams.set("q", "90");
      const response = await fetch(url);
      if (!response.ok) throw new Error(`crop fetch failed for ${slug}: ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());

      const filename = `${slug}-detail-${crop.detail.split(" ").slice(0, 3).join("-")}.jpg`;
      const asset = await client.assets.upload("image", buffer, {filename});

      if (media.some((m) => m.poster?.asset?._ref === asset._id)) {
        console.log(`  skip     ${slug}: ${crop.detail} is already in this piece`);
        continue;
      }

      const item = {
        _type: "media",
        _key: key(),
        poster: {_type: "image", asset: {_type: "reference", _ref: asset._id}},
        alt: {_type: "localeString", it: crop.alt},
        altIsDraft: true,
        /*
          The caption is EMPTY and marked as waiting. The sentence is his.
          `below` so that when he writes it, it lands on page ground where it is
          legible whatever the photograph does — a detail crop is a close-up and
          has no quiet corner to put words in.
        */
        needsCaption: true,
        captionPlacement: "below",
        overlay: "paper",
        isProvisional: false,
      };

      const at = media.findIndex((m) => m._key === source._key);
      const insertAt = at === -1 ? media.length : at + 1;
      media.splice(insertAt, 0, item);
      console.log(`  imported ${slug}: ${crop.detail} -> position ${insertAt}`);
    }

    await client.patch(garment._id).set({media}).commit();
  }

  console.log("\n  Done. Every crop went in with an EMPTY caption, on purpose.");
  console.log("  `npm run launch-check` now names each one until he writes it.");
  console.log("\n  LOOK AT THE PAGES. A crop is a photograph changing on a live");
  console.log("  page, which is exactly the class of change no build check sees.\n");
}

main().catch((error) => {
  console.error("\nDetail crops failed:", error.message);
  process.exit(1);
});
