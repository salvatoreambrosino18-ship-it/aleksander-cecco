/*
  ANCHE IL ROSSO COSTA 250. 20/08/2026.

    node scripts/patch-styrax-red-price.mjs            mostra cosa farebbe
    node scripts/patch-styrax-red-price.mjs --write    lo fa

  Il nero è passato a 250 con `patch-styrax-link.mjs`, che il rosso NON lo
  toccava: il prezzo del rosso è nel suo foglio DA APPROVARE, ma applicarlo non
  era stato chiesto e uno script non decide da solo. Nel frattempo il sito
  mostrava il nero a 250 e il rosso a 775 — cioè il contrario della sua
  decisione, che è che i due Styrax costano uguale.

  250 È SUO, scritto di suo pugno nella casella PREZZO del foglio, sopra il
  nostro 775. Quindi non è solo il numero che cambia: sparisce anche il segno
  «inventato» sul prezzo, perché quel prezzo adesso è di chi fa i capi.

  RESTANO SEGNATI `materials` e `descriptionIt`, e non è una dimenticanza: la
  composizione l'abbiamo scritta noi e lui ha lasciato la riga in bianco, la
  traduzione italiana della descrizione è nostra e non l'ha ancora letta.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");
const SLUG = "styrax-red";
const NEW_PRICE = 250;

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

const red = await client.fetch(
  /* groq */ `*[_type == "garment" && slug.current == $s][0]{_id, name, price, inventedFields}`,
  {s: SLUG},
);

if (!red?._id) {
  console.error(`\n  Non trovo ${SLUG}. Niente è stato scritto.\n`);
  process.exit(1);
}

const invented = red.inventedFields ?? [];
const after = invented.filter((f) => f !== "price");
const tx = client.transaction();

if (red.price !== NEW_PRICE) tx.patch(red._id, (p) => p.set({price: NEW_PRICE}));
if (invented.includes("price")) tx.patch(red._id, (p) => p.set({inventedFields: after}));

console.log(`\n  ${WRITE ? "SCRIVO" : "PROVA A VUOTO"} su ${process.env.PUBLIC_SANITY_PROJECT_ID}/${process.env.PUBLIC_SANITY_DATASET}\n`);
console.log(`    ${red.name}: prezzo ${red.price} -> ${NEW_PRICE}`);
console.log(`    ${red.name}: segni ${invented.join(", ") || "(nessuno)"} -> ${after.join(", ") || "(nessuno)"}\n`);

if (!WRITE) {
  console.log("  Niente è stato scritto. Rilancia con --write.\n");
  process.exit(0);
}

await tx.commit();
console.log("  Fatto. Il webhook di Sanity fa ripartire la build.\n");
