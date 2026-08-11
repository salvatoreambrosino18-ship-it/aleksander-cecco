/*
  ONE FLAG: the photograph on /contact is OUR selection until he makes one
  (2026-08-13, DESIGN-PLAN section 108).

    node scripts/patch-contact-frame.mjs            DRY
    node scripts/patch-contact-frame.mjs --write

  The page composes its column with one frame (section 108). He can choose it in
  the studio — `contactMedia` — and that always wins. With nothing set the page
  falls back to the last frame of the about sequence, which is a choice WE made,
  and every choice we make on his behalf is flagged rather than left to look
  like his. Same bargain as `instagramFrames`, same gate.

  It REMOVES the flag again the moment he sets `contactMedia`, so running this
  after he chooses is how the flag comes off; nobody has to remember to clear
  it. Never reads Drive, never writes media, never deletes.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) throw new Error("SANITY_WRITE_TOKEN missing");
const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  token,
  useCdn: false,
});

const FLAG = "contactFrame";

const s = await client.fetch(
  `*[_id=="siteSettings"][0]{"chosen": defined(contactMedia), inventedCopy}`,
);

const had = (s.inventedCopy ?? []).includes(FLAG);
const flags = s.chosen
  ? (s.inventedCopy ?? []).filter((v) => v !== FLAG)
  : [...new Set([...(s.inventedCopy ?? []), FLAG])];

console.log(
  s.chosen
    ? `\n  contactMedia is set — his choice. ${FLAG} ${had ? "removed" : "was not set"}.`
    : `\n  contactMedia is empty — the page falls back and the choice is ours. ${FLAG} ${had ? "already set" : "added"}.`,
);
console.log(`  inventedCopy: ${flags.length} flags\n`);

if (!WRITE) {
  console.log("  DRY RUN. Nothing written. Re-run with --write.\n");
  process.exit(0);
}

await client.patch("siteSettings").set({inventedCopy: flags}).commit();
console.log("  written.\n");
