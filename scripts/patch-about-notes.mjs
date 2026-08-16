/*
  /ABOUT GETS ITS OWN STORY.

    node scripts/patch-about-notes.mjs            dry
    node scripts/patch-about-notes.mjs --write

  The owner's reading (2026-08-16): /about was reading like /process. It was,
  and the duplication is exact rather than a matter of tone. Two of the three
  aboutNotes said what a processNote already says:

    about  "A hide is not a rectangle. The cut follows the edge the animal
            already had, which is why the hem stops where the skin stops."
    process THE CUT: "One skin, one piece, cut by hand ... where the skin runs
            out, the garment stops."

    about  "Nothing here is finished. Plant-tanned leather goes on moving
            after it is sold."
    process WHAT LASTS: "Vegetable-tanned leather can be fed, repaired and
            re-dyed, and at the end it goes back into the ground."

  Both are the making, and the making has a page. What /about had no note for
  at all was the thing only /about can say: WHERE. So the two go, and two
  facts of his take their place.

  THE TWO FACTS ARE HIS AND ARE WORTH MORE THAN ANYTHING WE COULD INVENT. The
  brand is born in Naples. The leather is tanned in Solofra, an hour up the
  road, where hides have been tanned for centuries, and it is chosen there one
  hide at a time.

  SOLOFRA IS WRITTEN AS A FACT ABOUT THE MATERIAL, not as a claim about the
  brand, and that is deliberate: it is the only concrete evidence behind the
  sustainability argument this site makes anywhere. A town that has tanned
  hides for centuries, an hour from where the garment is cut, is a supply
  chain a reader can picture and check. "Sustainable" is a word a reader can
  do nothing with. The schema already asks for this — "never an adjective
  about the brand" — and this is the note that most needed it.

  ORDER IS THE STORY: where it is from, what it is made of, what it is called
  after. The alchemy note stays and moves last, because it is the only one of
  the three that was ever about /about, and it now closes rather than opens.

  Still OURS and still flagged `aboutNotes` in `inventedCopy`, which is
  untouched: these are our sentences carrying his facts, and launch-check goes
  on refusing until he has read them.
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

const NAPLES = {
  _key: "n-naples",
  _type: "mosaicNote",
  text: {
    _type: "localeText",
    en: "Naples. The brand is born here and has not left. What it is made of comes from an hour up the road, which is not a principle about distance, only where the material happens to be.",
    it: "Napoli. Il marchio nasce qui e qui è rimasto. Quello di cui è fatto viene da un'ora di strada: non è un principio sulle distanze, è solo dove la materia si trova.",
  },
};

const SOLOFRA = {
  _key: "n-solofra",
  _type: "mosaicNote",
  text: {
    _type: "localeText",
    en: "The leather comes from Solofra, an hour from Naples, where hides have been tanned for centuries. It is chosen there one hide at a time: the slow way, and the only way to know what a skin is before it becomes a garment.",
    it: "La pelle viene da Solofra, a un'ora da Napoli, dove si conciano pelli da secoli. Si sceglie lì una pelle alla volta: il modo lento, e l'unico per sapere che cos'è una pelle prima che diventi un capo.",
  },
};

/* The two that /process already says, by subject and nearly by sentence. */
const RETIRE = ["n-x57srtcj", "n-q50o4mkj"];

const settings = await client.getDocument("siteSettings");
const current = settings.aboutNotes ?? [];
const kept = current.filter((n) => !RETIRE.includes(n._key));
const next = [NAPLES, SOLOFRA, ...kept];

const line = (n) => (n.text?.en ?? "").slice(0, 74);
console.log("\n  before:");
current.forEach((n, i) => console.log(`    ${i}  ${n._key.padEnd(12)} ${line(n)}...`));
console.log("\n  after:");
next.forEach((n, i) => console.log(`    ${i}  ${n._key.padEnd(12)} ${line(n)}...`));
console.log(`\n  ${current.length - kept.length} retired, ${next.length - kept.length} written, ${next.length} total`);
console.log(`  inventedCopy still flags aboutNotes: ${(settings.inventedCopy ?? []).includes("aboutNotes")}`);

if (!WRITE) {
  console.log("  DRY RUN. Re-run with --write.\n");
} else {
  await client.patch("siteSettings").set({aboutNotes: next}).commit();
  console.log("  aboutNotes patched\n");
}
