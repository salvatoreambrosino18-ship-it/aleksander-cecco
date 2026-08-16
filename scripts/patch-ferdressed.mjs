/*
  "EXPERIMENTAL LINE BY FERDRESSED", NOT "IN COLLABORATION WITH".

    node scripts/patch-ferdressed.mjs            dry
    node scripts/patch-ferdressed.mjs --write

  The owner's correction (2026-08-16). The two phrases are different claims:
  a collaboration is two labels meeting on one project, and this line came out
  of Ferdressed. The credit block on /about is a UI string and changes in
  i18n/ui.ts; the same phrase also closes his origin passage, which is HIS
  text and lives here.

  His sentence already opens "began as an experimental line", so the literal
  substitution would say it twice. The phrase moves to the front of the
  sentence instead, which is where the correction belongs anyway — the line is
  Ferdressed's, and the two creators are the knowledge inside it.
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

const EDITS = {
  en: [
    "The project began as an experimental line between the knowledge and vision of the two creators, Ciro Cecco and Ferdinando Palmieri, in collaboration with Ferdressed.",
    "The project began as an experimental line by Ferdressed, between the knowledge and vision of the two creators, Ciro Cecco and Ferdinando Palmieri.",
  ],
  it: [
    "Il progetto nasce come linea sperimentale tra la conoscenza e la visione dei due creatori, Ciro Cecco e Ferdinando Palmieri, in collaborazione con Ferdressed.",
    "Il progetto nasce come linea sperimentale di Ferdressed, tra la conoscenza e la visione dei due creatori, Ciro Cecco e Ferdinando Palmieri.",
  ],
};

const settings = await client.getDocument("siteSettings");
const next = {...settings.about};
for (const [loc, [from, to]] of Object.entries(EDITS)) {
  const text = settings.about?.[loc] ?? "";
  if (!text.includes(from)) {
    console.log(`  ${loc}: the old sentence is not there — already done, or it moved`);
    continue;
  }
  next[loc] = text.replace(from, to);
  console.log(`\n  ${loc}\n    - ${from}\n    + ${to}`);
}

if (!WRITE) {
  console.log("\n  DRY RUN. Re-run with --write.\n");
} else {
  await client.patch("siteSettings").set({about: next}).commit();
  console.log("\n  siteSettings.about patched\n");
}
