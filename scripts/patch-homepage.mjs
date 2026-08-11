/*
  HIS APPROVED HOMEPAGE COPY, WRITTEN INTO THE DATASET (section 99).

    node scripts/patch-homepage.mjs           dry
    node scripts/patch-homepage.mjs --write

  From a document he sent on 2026-08-12. VERBATIM: his words, his spelling, his
  line breaks, including the small English errors — "Our leathers is tanned",
  "It marks, it change" — which are HIS and are not ours to correct. They are
  raised with the owner as a question rather than fixed here, on the same rule
  that protects his voice everywhere else: it protects his mistakes too, until
  he chooses.

  THE ITALIAN IS OURS, a translation of his English, and `approvedLanguages`
  drops back to ["en"] so every Italian brand block on the site marks itself as
  an unapproved translation until he reads it. That flag went to ["en", "it"]
  when the Italian was his; it is not any more.
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

/* His, exactly as written. Do not tidy. */
const OPENING_EN = `Meet our "Creatures"
entities with their own breath,
born from the earth and worn on the body.`;

const OPENING_IT = `Incontra le nostre "Creature"
entita con un respiro proprio,
nate dalla terra e portate sul corpo.`;

const PROJECT_EN = `Aleksander Cecco is born to tell what is slowly being forgotten: nature and its unpredictable forms, its textures, its imperfect perfection.
The project lives between alchemy, esotericism and the primal link between human being and nature.`;

const PROJECT_IT = `Aleksander Cecco nasce per raccontare cio che lentamente si sta dimenticando: la natura e le sue forme imprevedibili, le sue texture, la sua perfezione imperfetta.
Il progetto vive tra alchimia, esoterismo e il legame primordiale tra essere umano e natura.`;

const PHILOSOPHY = [
  {
    title: "OUR SKINS",
    en: `Our leathers is tanned by plants, bark, leaves, roots.
No chemicals, less waters.`,
    it: `Le nostre pelli sono conciate con piante, cortecce, foglie, radici.
Niente sostanze chimiche, meno acqua.`,
  },
  {
    title: "REASONS",
    en: `To respect the one who wears it.
To respect the Mother Nature.`,
    it: `Per rispetto di chi la indossa.
Per rispetto della Madre Terra.`,
  },
  {
    title: "REBORN",
    en: `Plant-tanned skin lives, the animal reborn with the human.
It marks, it change, it scars.
Imperfect, unpredictable, alive.`,
    it: `La pelle conciata al vegetale vive, l'animale rinasce con l'essere umano.
Si segna, cambia, si cicatrizza.
Imperfetta, imprevedibile, viva.`,
  },
];

const patch = {
  openingLines: {_type: "localeText", en: OPENING_EN, it: OPENING_IT},
  homeStatement: {_type: "localeText", en: PROJECT_EN, it: PROJECT_IT},
  philosophy: PHILOSOPHY.map((r, i) => ({
    _type: "reason",
    _key: `reason-${i}`,
    title: r.title,
    text: {_type: "localeText", en: r.en, it: r.it},
  })),
  /* His English is approved. The Italian above is ours until he reads it. */
  approvedLanguages: ["en"],
};

async function main() {
  const before = await client.getDocument("siteSettings");
  console.log(`\nHomepage copy: ${client.config().dataset}`);
  console.log(WRITE ? "  WRITING\n" : "  DRY RUN\n");
  console.log(`  openingLines   ${before.openingLines ? "replacing" : "new"}`);
  console.log(`  homeStatement  replacing (was ${(before.homeStatement?.en ?? "").slice(0, 46)}...)`);
  console.log(`  philosophy     ${PHILOSOPHY.length} reasons, ${before.philosophy ? "replacing" : "new"}`);
  console.log(`  approvedLanguages ${JSON.stringify(before.approvedLanguages)} -> ["en"]`);
  /*
    makingStatement is NOT touched. It is still his, it is still the whole
    passage on /process and paragraph three of about, and only the HOME block
    that used one line of it was replaced. Deleting it here would take that
    passage off two other pages.
  */
  if (!WRITE) {
    console.log("\n  Re-run with --write.\n");
    return;
  }
  await client.patch("siteSettings").set(patch).commit();
  console.log("\n  Written. LOOK AT THE HOME PAGE in both languages.\n");
}

main().catch((e) => {
  console.error("\npatch-homepage failed:", e.message);
  process.exit(1);
});
