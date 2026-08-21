/*
  QUASI TUTTO QUELLO CHE RESTAVA DIVENTA SUO. 21/08/2026, quattro sue risposte.

    node scripts/patch-sue-parole.mjs            mostra cosa farebbe
    node scripts/patch-sue-parole.mjs --write    lo fa

  1. LE TREDICI COMPOSIZIONI IN ITALIANO, approvate una per una così come sono.
     Erano l'ultimo blocco grosso di roba nostra: le abbiamo scritte noi
     traducendo il suo inglese, e adesso le ha lette e le tiene. Il segno
     `materials` se ne va da tutti e tredici.

  2. ARMONYEN È LA SUA CAMICIA. «Armonyen» era una parola sua fin dall'inizio —
     la sua camicia «designed for both him and her» — ma nessuno aveva mai
     confermato che fosse QUESTA camicia, e l'unico file che portava quel nome
     era la pagina esportata dal nostro foglio, cioè una prova circolare. Adesso
     l'ha detto: è la camicia nera stropicciata appesa al ramo.

  3. LA BORSA SI CHIAMA VEGMENTUM. «Vesper» ce l'eravamo inventato noi, ed era
     l'ultima parola coniata rimasta in catalogo. Adesso ha un nome suo.

     LO SLUG NON SI TOCCA E NON SI TOCCHERÀ: la pagina è /creature/capo-09 e la
     parola «vesper» non compare da nessuna parte tranne che nel campo NOME —
     non nello slug, non nei nomi dei file (sono UUID), non nei testi
     alternativi, che descrivono la borsa e non la nominano. Quindi non muore
     nessun link e in `public/_redirects` non va aggiunto niente.

  QUELLO CHE RESTA SEGNATO SULLA BORSA — prezzo, descrizione, taglia — è ancora
  nostro: le ha dato un nome, non una scheda.
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
  console.error("\n  Manca SANITY_WRITE_TOKEN in .env, e con --write serve.\n");
  process.exit(1);
}

console.log(`\n  ${WRITE ? "SCRIVO" : "PROVA A VUOTO"} su ${process.env.PUBLIC_SANITY_PROJECT_ID}/${process.env.PUBLIC_SANITY_DATASET}\n`);

const all = await client.fetch(
  /* groq */ `*[_type == "garment" && !(_id in path("drafts.**"))]|order(orderRank){_id, name, "slug": slug.current, inventedFields}`,
);

const tx = client.transaction();

/* 1 — le composizioni */
const withMaterials = all.filter((g) => (g.inventedFields ?? []).includes("materials"));
console.log(`  LE COMPOSIZIONI: ${withMaterials.length} capi\n`);
for (const g of withMaterials) {
  const after = g.inventedFields.filter((f) => f !== "materials");
  tx.patch(g._id, (p) => p.set({inventedFields: after}));
  console.log(`    ${g.name.padEnd(32)} ${g.inventedFields.join(", ")}  ->  ${after.join(", ") || "(NIENTE, è tutto suo)"}`);
}

/* 2 — Armonyen */
const armonyen = all.find((g) => g.slug === "capo-01");
const armAfter = (armonyen.inventedFields ?? []).filter((f) => f !== "materials" && f !== "name");
tx.patch(armonyen._id, (p) => p.set({inventedFields: armAfter}));
console.log(`\n  ARMONYEN: il nome è suo, confermato\n    segni -> ${armAfter.join(", ") || "(NIENTE, è tutto suo)"}`);

/* 3 — Vegmentum */
const bag = all.find((g) => g.slug === "capo-09");
const bagAfter = (bag.inventedFields ?? []).filter((f) => f !== "materials" && f !== "name");
tx.patch(bag._id, (p) => p.set({name: "Vegmentum", inventedFields: bagAfter}));
console.log(`\n  LA BORSA: ${bag.name} -> Vegmentum`);
console.log(`    slug ${bag.slug}  INVARIATO — nessun redirect, nessun link rotto`);
console.log(`    segni -> ${bagAfter.join(", ") || "(nessuno)"}`);

if (!WRITE) {
  console.log("\n  Niente è stato scritto. Rilancia con --write.\n");
  process.exit(0);
}
await tx.commit();
console.log("\n  Fatto. Il webhook di Sanity fa ripartire la build.\n");
