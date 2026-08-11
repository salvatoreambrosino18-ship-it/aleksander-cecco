/*
  ONE PATCH: "Su Misura" / "Made to Measure" comes out of his approved text
  (2026-08-13, DESIGN-PLAN section 108).

    node scripts/patch-made-to-measure.mjs            DRY, prints the diff
    node scripts/patch-made-to-measure.mjs --write    commits it

  WHY THIS EXISTS AT ALL. His words have not been ours to change since he
  supplied them, and that rule has held for twelve days. It is not lapsing here;
  it is taking a MARKED EXCEPTION, with the reason written down, on the same
  mechanism the name order used (section 65): the edit is flagged
  `aboutMadeToMeasure` in `inventedCopy`, `npm run launch-check` counts it, and
  the flag comes off only when he says the new sentence is his.

  THE REASON. On 2026-08-12 the owner removed made to measure from the shop
  (section 98). Every Creature is now sold as the object it is; made to measure
  survives as one line inviting an email and as nothing else. His sentence says
  every piece is made to measure, and a buyer reads it on /about and on
  /process. A false claim about the terms of sale is not a matter of voice.

  WHAT THE ORIGINAL SAID, verbatim, so it can be restored without archaeology:

    EN  In 100% vegetable-tanned leather, Made to Measure, handmade in South
        Italy. Every process is Artisan.
    IT  In pelle 100% conciata al vegetale, Su Misura, fatta a mano nel Sud
        Italia. Ogni processo è artigianale.

  WHAT IT SAYS NOW — two words deleted, nothing added, nothing reordered:

    EN  In 100% vegetable-tanned leather, handmade in South Italy. Every
        process is Artisan.
    IT  In pelle 100% conciata al vegetale, fatta a mano nel Sud Italia. Ogni
        processo è artigianale.

  Deleting was chosen over rewriting on purpose. Anything we WROTE in that gap
  would be our sentence wearing his voice; a deletion leaves a true sentence
  that is still entirely his words in his order.

  IT IS IN TWO FIELDS, NOT ONE. The line is the third paragraph of `about` AND
  the whole of `makingStatement`, which /process prints and the home page links
  to. Patching only `about` would have left the same false claim on /process,
  which is the shape of failure section 5's last trap is about.

  The same two strings are seeded by scripts/import-photos.mjs and
  scripts/patch-text.mjs; both were changed in the same commit, or an import
  would put "Su Misura" back with every check green.

  Never reads Drive, never writes media, never deletes.
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

/*
  The exact phrase, with its trailing comma and space, so the sentence closes
  correctly on both sides of the cut. Asserted rather than assumed: if he has
  since rewritten the line himself, this refuses instead of mangling it.
*/
const CUTS = {en: "Made to Measure, ", it: "Su Misura, "};
const FLAG = "aboutMadeToMeasure";

const s = await client.fetch(
  `*[_id=="siteSettings"][0]{about, makingStatement, inventedCopy}`,
);

const cut = (field, lang) => {
  const text = s[field]?.[lang];
  if (typeof text !== "string") throw new Error(`${field}.${lang} is not text`);
  const phrase = CUTS[lang];
  if (!text.includes(phrase)) {
    throw new Error(
      `${field}.${lang} does not contain ${JSON.stringify(phrase)} — his text has ` +
        `changed since 2026-08-13. Read it, then decide; do not force this.`,
    );
  }
  return text.replace(phrase, "");
};

const next = {
  "about.en": cut("about", "en"),
  "about.it": cut("about", "it"),
  "makingStatement.en": cut("makingStatement", "en"),
  "makingStatement.it": cut("makingStatement", "it"),
};

const flags = [...new Set([...(s.inventedCopy ?? []), FLAG])];

for (const [key, text] of Object.entries(next)) {
  const [field, lang] = key.split(".");
  const before = s[field][lang].split("\n").find((l) => l.includes(CUTS[lang]));
  const after = text.split("\n").find((l) => l.includes(lang === "it" ? "conciata" : "vegetable"));
  console.log(`\n  ${key}`);
  console.log(`    was: ${before}`);
  console.log(`    now: ${after}`);
}
console.log(`\n  inventedCopy: ${flags.length} flags, ${FLAG} ${s.inventedCopy?.includes(FLAG) ? "already set" : "added"}`);

if (!WRITE) {
  console.log("\n  DRY RUN. Nothing written. Re-run with --write.\n");
  process.exit(0);
}

await client.patch("siteSettings").set({...next, inventedCopy: flags}).commit();
console.log("\n  written: four strings, both fields, both languages, flagged " + FLAG + "\n");
