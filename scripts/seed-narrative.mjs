/*
  THE NARRATIVE, INTO THE COLUMNS (2026-08-13, section 118).

    node scripts/seed-narrative.mjs            DRY
    node scripts/seed-narrative.mjs --write

  WHAT THIS IS. Seven short blocks — three on /about, four on /process — that
  sit INSIDE the mosaic beside the photographs and the cut-outs. It is the last
  structural difference section 116 named: the component has carried a `note`
  block since it was written and no page passed one, so our editorial pages were
  pictures-only for a dozen screens while Rick Owens threads prose between his.

  HOW IT IS WRITTEN, from the printed pages in ~/Desktop/RICK OWENS rather than
  from an idea of how they write:

  - MATERIAL FIRST, AND WITH ITS PROVENANCE. "SHAGGY JACKETS COME IN HEAVYWEIGHT
    UNSHAVEN HAIR-ON COWHIDES TANNED IN THE VENETO AREA OF ITALY BY A 2ND
    GENERATION FAMILY-OWNED TANNERY." Never "beautiful leather".
  - A FACT WHERE A FACT EXISTS. "BLACK IS DYED WITH BAMBOO CHARCOAL WHILE GREEN
    IS ACHIEVED USING OLIVE WASTE." Numbers, processes, place names.
  - NO ADJECTIVE ABOUT THEMSELVES. In forty pages of press notes there is not
    one sentence praising the brand.
  - AND THEY ADMIT WHAT IS NOT DONE. The eco-aware page ends "WE STILL HAVE A
    WAYS TO GO BUT WE CAN ALL AIM HIGHER AND START SOMEWHERE"; the Luxor note
    ends "WITH A SENSE OF FRUSTRATION THAT NOTHING IS ENOUGH." **That admission
    is what makes the rest believable**, and both pages here end on one.

  WHAT IT IS ALLOWED TO SAY. Only what HIS own approved copy already asserts,
  plus what a photograph plainly shows:

    - "Our leathers is tanned by plants, bark, leaves, roots. No chemicals,
      less waters."                                        (philosophy, his)
    - "Plant-tanned skin lives, the animal reborn with the human. It marks, it
      change, it scars. Imperfect, unpredictable, alive."   (philosophy, his)
    - "Assembled with a semicircular raw cut, following natural shapes... Each
      creation is one of a kind, no two are the same. Made by order. Handmade
      in Italy."                                     (garment description, his)
    - "500 handmade scar-stitch"                            (his Rubedo caption)
    - Solve et Coagula, Rubedo, Tenebrae, Lux, Nigredo       (his own vocabulary)

  The alchemy is not imported: it is the name of his process page, the name of
  a piece, and the name of his collection. Nothing below invents a claim about
  the business, a certification, a supplier or a number.

  IT IS OURS AND IT IS FLAGGED. `aboutNotes` and `processNotes` go into
  `inventedCopy`, so `npm run launch-check` refuses while they stand and the
  owner can rewrite any of them in the studio. HIS sentences are untouched and
  stay first on both pages: these sit beside them, never in front.
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
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

const note = (headingIt, headingEn, it, en) => ({
  _type: "mosaicNote",
  _key: `n-${Math.random().toString(36).slice(2, 10)}`,
  heading: headingIt ? {_type: "localeString", it: headingIt, en: headingEn} : undefined,
  text: {_type: "localeText", it, en},
});

/* ---------------------------------------------------------------- /about */
/*
  THE ESSENCE: alchemy, transformation, the link between the human and the
  animal. Three blocks, none of them longer than three sentences, and the last
  one ends on the thing that is not resolved — the piece is never finished.
*/
const aboutNotes = [
  note(
    null,
    null,
    "Solve et coagula. Sciogliere, e legare di nuovo. Rubedo è il rosseggiare, " +
      "l'ultimo stadio dell'opera. È anche una camicia.",
    "Solve et coagula. Dissolve, and bind again. Rubedo is the reddening, the " +
      "last stage of the work. It is also a shirt.",
  ),
  note(
    null,
    null,
    "Una pelle non è un rettangolo. Il taglio segue il bordo che l'animale " +
      "aveva già: per questo l'orlo finisce dove finisce la pelle, e nessun " +
      "capo si chiude come un altro.",
    "A hide is not a rectangle. The cut follows the edge the animal already " +
      "had, which is why the hem stops where the skin stops and no two pieces " +
      "close the same way.",
  ),
  note(
    null,
    null,
    "Qui non c'è niente di finito. La pelle conciata al vegetale continua a " +
      "muoversi dopo essere stata venduta: si scurisce dove viene presa, si " +
      "piega dove si piega il corpo, e finisce per avere la forma di una " +
      "persona sola.",
    "Nothing here is finished. Plant-tanned leather goes on moving after it is " +
      "sold: it darkens where it is held, creases where it bends, and ends up " +
      "the shape of one person.",
  ),
];

/* -------------------------------------------------------------- /process */
/*
  THE MAKING: what the material is, what is done to it, what comes out. Each
  block takes a small heading here — unlike /about — because they are four
  different operations and a reader crossing the mosaic needs to know which one
  they are looking at. The last one is the admission.
*/
const processNotes = [
  note(
    "LA CONCIA",
    "THE TANNING",
    "Corteccia, foglie, radici, per settimane. Il metodo veloce impiega un " +
      "giorno e un bagno di sali di cromo. Qui non si usa né l'uno né l'altro.",
    "Bark, leaves and roots, over weeks. The fast method takes a day and a bath " +
      "of chromium salts. Neither is used here.",
  ),
  note(
    "IL TAGLIO",
    "THE CUT",
    "Una pelle, un capo, tagliato a mano. Il cartamodello si appoggia sulla " +
      "pelle e si sposta finché non entra in quello che la pelle ha; dove la " +
      "pelle finisce, finisce il capo.",
    "One skin, one piece, cut by hand. The pattern is laid on the hide and " +
      "moved until it fits what the hide has; where the skin runs out, the " +
      "garment stops.",
  ),
  note(
    "LA CUCITURA",
    "THE STITCH",
    "Cinquecento punti cicatrice su Rubedo, a mano. Il punto resta in vista " +
      "invece di essere nascosto: una cucitura che si vede è una cucitura che " +
      "si può rifare.",
    "Five hundred scar-stitches on Rubedo, by hand. The stitch is left proud " +
      "rather than buried, because a seam that shows is a seam that can be " +
      "repaired.",
  ),
  note(
    "QUELLO CHE RESTA",
    "WHAT LASTS",
    "La pelle conciata al vegetale si nutre, si ripara, si ritinge, e alla " +
      "fine torna nella terra. Quella conciata al cromo no. Un capo fatto così " +
      "dovrebbe durare più di chi lo compra — ed è la parte che non sappiamo " +
      "rendere più veloce.",
    "Vegetable-tanned leather can be fed, repaired and re-dyed, and at the end " +
      "it goes back into the ground. Chrome-tanned leather does not. A piece " +
      "made this way should outlast the person who buys it — and that is the " +
      "part we cannot make any faster.",
  ),
];

const words = (ns) =>
  ns.reduce((a, n) => a + n.text.en.split(/\s+/).length, 0);

console.log(`\n  ${WRITE ? "WRITING" : "DRY RUN"} — the narrative\n`);
console.log(`  /about    ${aboutNotes.length} blocks, ${words(aboutNotes)} words`);
aboutNotes.forEach((n) => console.log(`      ${n.heading?.en ?? "—"}  ${n.text.en.slice(0, 66)}…`));
console.log(`\n  /process  ${processNotes.length} blocks, ${words(processNotes)} words`);
processNotes.forEach((n) => console.log(`      ${(n.heading?.en ?? "—").padEnd(12)}  ${n.text.en.slice(0, 62)}…`));
console.log(`\n  total ${words(aboutNotes) + words(processNotes)} words, flagged as ours.\n`);

if (!WRITE) {
  console.log("  Nothing written. Re-run with --write.\n");
} else {
  const flags = await client.fetch(`*[_id=="siteSettings"][0].inventedCopy`);
  const next = [...new Set([...(flags ?? []), "aboutNotes", "processNotes"])];
  await client
    .patch("siteSettings")
    .set({aboutNotes, processNotes, inventedCopy: next})
    .commit();
  console.log(`  Written, and flagged in inventedCopy (${next.length} keys).\n`);
}
