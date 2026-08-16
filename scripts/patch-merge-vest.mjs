/*
  THE TWO MONUMENTUS VESTS ARE ONE GARMENT.

    node scripts/patch-merge-vest.mjs            dry
    node scripts/patch-merge-vest.mjs --write

  The owner's call (2026-08-16). `piece-gilet-zip` (capo-03) and
  `piece-top-leggero` (capo-04) carry the same name, the same collection, the
  same price, the same stage and the same wornBy. They are the same vest, and
  the catalogue has been selling it twice.

  capo-03 SURVIVES because it holds more of the piece: three frames including
  the detail crop of the scrap panels around the zip, against capo-04's one.
  capo-04's photograph is appended rather than dropped — it is the only frame
  of the neck — and rekeyed, because both documents key their first frame `m0`
  and a merged array cannot carry the key twice.

  WHAT THE TWO DOCUMENTS DISAGREED ABOUT was invented by us, not written by
  him: `description` and `materials` are both in `inventedFields` on both
  documents. One said a zip and vegetable-tanned leather, the other snaps at
  the neck and crinkled lambskin. So the disagreement is not evidence of two
  garments — it is evidence of two guesses.

  The description is merged so that it does not contradict the photograph
  being added to it: a page describing a single zip above a frame of snaps at
  the neck is a visible error, and the two closures sit on one vest. Materials
  keeps capo-03's line and stays flagged, because there is no way to tell from
  here which guess was right and a third guess would not help. That line still
  needs him.

  Nothing in the dataset references either document, so the merge cannot
  orphan anything. The old URL is kept alive in public/_redirects — and unlike
  the Rubedo rule this one is safe to keep, because capo-04 is not coming back
  as a piece; it was never a piece.
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

const KEEP = "piece-gilet-zip";
const MERGE = "piece-top-leggero";

/* Covers both closures, so no frame on the page contradicts the sentence over
   it. Still ours, still flagged `description` in inventedFields. */
const DESCRIPTION = {
  _type: "localeText",
  en: "A vest cut from one hide, closed by a single zip and snapped at the neck. The hem follows the edge of the skin.",
};

const keep = await client.getDocument(KEEP);
const merge = await client.getDocument(MERGE);
if (!keep) throw new Error(`${KEEP} is gone`);
if (!merge) {
  console.log("  capo-04 is already merged — nothing to do\n");
  process.exit(0);
}

const used = new Set((keep.media ?? []).map((m) => m._key));
const brought = (merge.media ?? []).map((m, i) => ({
  ...m,
  _key: used.has(m._key) ? `capo04-${m._key}-${i}` : m._key,
}));
const media = [...(keep.media ?? []), ...brought];

const refs = await client.fetch(`*[references($a) || references($b)]{_id}`, {a: KEEP, b: MERGE});

console.log(`\n  keep    ${KEEP}  /${keep.slug.current}   ${(keep.media ?? []).length} photographs`);
console.log(`  merge   ${MERGE}  /${merge.slug.current}   ${(merge.media ?? []).length} photograph`);
console.log(`  result  ${media.length} photographs: ${media.map((m) => m._key).join(", ")}`);
console.log(`  materials kept: "${keep.materials?.en}"  (dropped: "${merge.materials?.en}")`);
console.log(`  description merged so the added frame is not contradicted`);
console.log(`  inbound references to either document: ${refs.length}`);

if (!WRITE) {
  console.log("\n  DRY RUN. Re-run with --write.\n");
} else {
  await client
    .transaction()
    .patch(KEEP, (p) => p.set({media, description: DESCRIPTION}))
    .delete(MERGE)
    .commit();
  console.log(`\n  ${KEEP} now holds ${media.length} photographs; ${MERGE} deleted\n`);
}
