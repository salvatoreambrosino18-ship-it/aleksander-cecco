/*
  MONUMENTUS PANTS TORNA IN VENDITA. 21/08/2026: la scheda è arrivata.

    node scripts/patch-monumentus-pants.mjs            mostra cosa farebbe
    node scripts/patch-monumentus-pants.mjs --write    lo fa

  Il capo era stato RITIRATO ieri perché l'unico prezzo che aveva era nostro
  (1150, derivato da ore e materiale) ed era la cifra più alta del negozio in
  mezzo ai suoi 200 e 670. Adesso il prezzo ce l'ha messo lui: 870.

  È PROPRIO QUESTO CAPO, verificato e non dato per scontato: il foglio porta
  stampato `capo-05` nell'intestazione — lo stampa il nostro generatore leggendo
  il dataset, non lui — la miniatura è la prima fotografia di capo-05, e le tre
  foto in fondo sono pantaloni lunghi, non i pantaloncini del Tibia Cut. Il
  refuso «Monuments» sta solo nel nome del file che ha salvato lui.

  QUELLO CHE HA SCRITTO: prezzo 870, taglie W30-32-34, disponibile subito.
  QUELLO CHE HA LASCIATO NOSTRO: composizione, traduzione italiana della
  descrizione, e «indossato da». Quei tre segni restano.
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

const g = await client.fetch(
  /* groq */ `*[_type == "garment" && slug.current == "capo-05"][0]{_id, name, price, sizes, availability, inventedFields}`,
);
if (!g?._id) {
  console.error("\n  Non trovo capo-05. Niente è stato scritto.\n");
  process.exit(1);
}

const after = (g.inventedFields ?? []).filter((f) => f !== "price");
console.log(`\n  ${WRITE ? "SCRIVO" : "PROVA A VUOTO"} su ${process.env.PUBLIC_SANITY_PROJECT_ID}/${process.env.PUBLIC_SANITY_DATASET}\n`);
console.log(`  ${g.name}`);
console.log(`    prezzo        ${g.price} -> 870        (suo)`);
console.log(`    taglie        ${(g.sizes ?? []).join(" ")} -> W30 W32 W34   (sue)`);
console.log(`    disponibilità ${g.availability} -> readyNow   TORNA IN VENDITA`);
console.log(`    segni         ${(g.inventedFields ?? []).join(", ")} -> ${after.join(", ")}\n`);

if (!WRITE) {
  console.log("  Niente è stato scritto. Rilancia con --write.\n");
  process.exit(0);
}
await client
  .patch(g._id)
  .set({price: 870, sizes: ["W30", "W32", "W34"], availability: "readyNow", inventedFields: after})
  .commit();
console.log("  Fatto. Il webhook di Sanity fa ripartire la build.\n");
