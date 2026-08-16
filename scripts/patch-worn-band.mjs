/*
  RUBEDO OPENS THE WORN BAND, AND MONUMENTUS TENEBRAE LEAVES IT.

    node scripts/patch-worn-band.mjs            dry
    node scripts/patch-worn-band.mjs --write

  The owner's call (2026-08-16). Two edits to `homeSequence`, and they fix the
  same thing from both ends.

  The band was opening on its only tile that goes NOWHERE. Monumentus Tenebrae
  is the one frame here with no `garment` reference — it carries a caption
  instead of a link, so the first thing a reader met in a row of pieces was
  the one piece they could not reach. Every other tile is a way into a
  Creature. It comes out.

  Rubedo takes the front, and it is the strongest thing to open on: eleven
  photographs, more than any other piece has, and the only red in a band that
  is otherwise black and brown.

  This is the second half of the Rubedo repair — the first is in
  public/_redirects, where a stale rule was sending its page to /process. The
  band was pointing at a piece the redirect made unreachable, which is why the
  tile "went to the process page": the href was right the whole time.
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

const RUBEDO = "piece-giacca-rossa";
const TENEBRAE = "Monumentus Tenebrae";

const settings = await client.getDocument("siteSettings");
const band = settings.homeSequence ?? [];

const dropped = band.filter((t) => t.media?.caption?.en === TENEBRAE || t.media?.caption?.it === TENEBRAE);
const kept = band.filter((t) => !dropped.includes(t));
const rubedo = kept.find((t) => t.garment?._ref === RUBEDO);
if (!rubedo) throw new Error("Rubedo is not in the worn band — nothing to move");
const next = [rubedo, ...kept.filter((t) => t !== rubedo)];

const label = (t) => t.garment?._ref ?? `(no link) "${t.media?.caption?.en ?? "?"}"`;
console.log("\n  before:");
band.forEach((t, i) => console.log(`    ${i}  ${label(t)}`));
console.log("\n  after:");
next.forEach((t, i) => console.log(`    ${i}  ${label(t)}`));
console.log(`\n  ${dropped.length} removed, ${next.length} kept`);

if (!WRITE) {
  console.log("  DRY RUN. Re-run with --write.\n");
} else {
  await client.patch("siteSettings").set({homeSequence: next}).commit();
  console.log("  homeSequence patched\n");
}
