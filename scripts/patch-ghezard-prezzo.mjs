/*
  GHEZARD HA UN PREZZO SUO: 800. 22/08/2026.

    node scripts/patch-ghezard-prezzo.mjs            prova a vuoto
    node scripts/patch-ghezard-prezzo.mjs --write    lo fa

  Portava 1850, che era NOSTRO — l'unica cifra del catalogo derivata da ore e
  materiale e mai confermata da lui. Ritirato non faceva danno, ma a dicembre
  torna in vendita da solo, e sarebbe tornato con quel numero addosso.

  RESTA RITIRATO. Torna a dicembre, come dice la sua riga sulla pagina; questo
  script tocca il prezzo e il segno, non la disponibilità.
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
if (WRITE && !process.env.SANITY_WRITE_TOKEN) {
  console.error("\n  Manca SANITY_WRITE_TOKEN in .env.\n");
  process.exit(1);
}

const g = await client.fetch(
  /* groq */ `*[_type == "garment" && slug.current == "ghezard"][0]{_id, name, price, availability, inventedFields, "note": availabilityNote.it}`,
);
const after = (g.inventedFields ?? []).filter((f) => f !== "price");
console.log(`\n  ${WRITE ? "SCRIVO" : "PROVA A VUOTO"}\n`);
console.log(`  ${g.name}: ${g.price} -> 800   (suo)`);
console.log(`    segni ${(g.inventedFields ?? []).join(", ") || "(nessuno)"} -> ${after.join(", ") || "(NIENTE, è tutto suo)"}`);
console.log(`    disponibilità ${g.availability} INVARIATA — «${g.note}»\n`);

if (!WRITE) {
  console.log("  Niente è stato scritto. Rilancia con --write.\n");
  process.exit(0);
}
await client.patch(g._id).set({price: 800, inventedFields: after}).commit();
console.log("  Fatto.\n");
