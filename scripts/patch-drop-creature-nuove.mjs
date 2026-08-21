/*
  LE TRE CREATURE NUOVE ENTRANO NEL DROP. 21/08/2026, confermato dal titolare.

    node scripts/patch-drop-creature-nuove.mjs            mostra cosa farebbe
    node scripts/patch-drop-creature-nuove.mjs --write    lo fa

  Abyssys, Monumentus Tenebrae Tibia Cut e Tomar sono nate senza drop, ed era
  voluto: lui aveva nominato un drop su una scheda sola — «Solvet et Coagula»,
  su quella di Arak — e non aveva mai detto chi altro ci stesse dentro. Mettercele
  sarebbe stato un nostro plausibile al posto di una sua risposta.

  Adesso la risposta c'è: MONUMENTUS: Tenebrae & Lux.

  COSA CAMBIA SULLE PAGINE. Sparisce la riga «Fuori dalle collezioni», che è la
  frase che il sito dice apposta invece di lasciare un buco, e al suo posto
  compare il nome del drop. E i tre capi entrano nella pagina del drop corrente,
  /new, che mostra i capi della prima collezione: finché erano fuori da tutto,
  i tre pezzi più nuovi del negozio erano gli unici assenti dalla pagina che
  annuncia le novità.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");
const SLUGS = ["abyssys", "tibia-cut", "tomar"];
const DROP = "monumentus";

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

if (WRITE && !process.env.SANITY_WRITE_TOKEN) {
  console.error("\n  Manca SANITY_WRITE_TOKEN in .env, e con --write serve.\n");
  process.exit(1);
}

const drop = await client.fetch(/* groq */ `*[_type == "collection" && slug.current == $s][0]{_id, name}`, {s: DROP});
if (!drop?._id) {
  console.error(`\n  Non trovo il drop ${DROP}. Niente è stato scritto.\n`);
  process.exit(1);
}

console.log(`\n  ${WRITE ? "SCRIVO" : "PROVA A VUOTO"} su ${process.env.PUBLIC_SANITY_PROJECT_ID}/${process.env.PUBLIC_SANITY_DATASET}`);
console.log(`  drop: ${drop.name}\n`);

const tx = client.transaction();
for (const slug of SLUGS) {
  const g = await client.fetch(
    /* groq */ `*[_type == "garment" && slug.current == $s][0]{_id, name, "drop": collection->name}`,
    {s: slug},
  );
  if (!g?._id) {
    console.error(`  Non trovo ${slug}. Niente è stato scritto.\n`);
    process.exit(1);
  }
  tx.patch(g._id, (p) => p.set({collection: {_type: "reference", _ref: drop._id}}));
  console.log(`  ${g.name.padEnd(32)} ${g.drop ?? "(fuori dalle collezioni)"} -> ${drop.name}`);
}

if (!WRITE) {
  console.log("\n  Niente è stato scritto. Rilancia con --write.\n");
  process.exit(0);
}
await tx.commit();
console.log("\n  Fatto. Il webhook di Sanity fa ripartire la build.\n");
