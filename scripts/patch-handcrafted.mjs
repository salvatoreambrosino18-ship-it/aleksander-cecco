/*
  HANDCRAFTED, NOT HANDMADE — everywhere, in both languages.

    node scripts/patch-handcrafted.mjs            dry
    node scripts/patch-handcrafted.mjs --write

  The owner's word (2026-08-16). The two are not synonyms in a shop: handmade
  says only "not a machine", handcrafted says a skill was applied. For a label
  whose whole argument is repetition, patience and precision, the second is the
  claim actually being made.

  WHY THE ITALIAN IS "LAVORATO A MANO" AND NOT "ARTIGIANALE". Artigianale is
  the dictionary translation of handcrafted, and it cannot be used here: the
  sentence it would land in already ends "Ogni processo è artigianale", so the
  paragraph would say artigianale twice in two lines. "Lavorato a mano" carries
  the same shift the English does — lavorato is worked, fatto is merely made —
  and it fits every sentence shape without touching the grammar around it.

  Agreement is preserved rather than flattened: fatto/fatta/fatti keep their
  endings as lavorato/lavorata/lavorati, because the word agrees with pelle,
  with punti and with pezzo differently and a blanket replace would be wrong
  Italian in four places.

  The UI strings live in src/i18n/ui.ts and changed there. This is the rest:
  his statements and his garment descriptions.
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

const CAP = (src, word) => (src[0] === src[0].toUpperCase() ? word[0].toUpperCase() + word.slice(1) : word);

function rewrite(text, loc) {
  if (typeof text !== "string") return text;
  if (loc === "en") return text.replace(/handmade/gi, (m) => CAP(m, "handcrafted"));
  // fatto / fatta / fatti a mano -> lavorato / lavorata / lavorati a mano
  return text.replace(/\bfatt([oaie])\s+a\s+mano/gi, (m, end) => CAP(m, `lavorat${end.toLowerCase()} a mano`));
}

const LOCALE_FIELDS = {
  siteSettings: ["footerOrigin", "makingStatement", "about"],
  garment: ["description"],
};

const docs = await client.fetch(`*[_type in ["siteSettings","garment"]]`);
const patches = [];
for (const doc of docs) {
  const set = {};
  for (const field of LOCALE_FIELDS[doc._type] ?? []) {
    const val = doc[field];
    if (!val) continue;
    for (const loc of ["en", "it"]) {
      const next = rewrite(val[loc], loc);
      if (next !== undefined && next !== val[loc]) {
        set[`${field}.${loc}`] = next;
        console.log(`\n  ${doc._id}  ${field}.${loc}`);
        console.log(`    - ${val[loc].replace(/\n/g, " ⏎ ").slice(0, 150)}`);
        console.log(`    + ${next.replace(/\n/g, " ⏎ ").slice(0, 150)}`);
      }
    }
  }
  if (Object.keys(set).length) patches.push({id: doc._id, set});
}

console.log(`\n  ${patches.length} document(s) to patch`);
if (!WRITE) {
  console.log("  DRY RUN. Re-run with --write.\n");
} else {
  let tx = client.transaction();
  for (const p of patches) tx = tx.patch(p.id, (x) => x.set(p.set));
  await tx.commit();
  console.log("  patched\n");
}
