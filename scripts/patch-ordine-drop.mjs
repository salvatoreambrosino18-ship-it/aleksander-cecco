/*
  LE TRE CREATURE NUOVE IN TESTA AL DROP. 21/08/2026.

    node scripts/patch-ordine-drop.mjs            mostra cosa farebbe
    node scripts/patch-ordine-drop.mjs --write    lo fa

  `orderRank` è l'ordine che il titolare trascina nello studio, ed è l'ordine
  del catalogo, della pagina del drop e del «precedente / successivo» in fondo a
  ogni capo. I tre capi nuovi erano nati in coda perché sono arrivati per
  ultimi; il lavoro nuovo va davanti.

  DOVE SI VEDE, e non è solo la pagina del drop:
    /new                     mostra i primi sei del drop: adesso apre sui tre nuovi
    /creature                dentro ogni movimento l'ordine è questo, ma prima
                             passa da `byStage`: Tibia Cut sale in testa ai
                             Tenebrae, Abyssys e Tomar restano in fondo perché
                             non hanno stage
    /collections/monumentus  stesso ordine
    precedente / successivo  cambia chi viene dopo chi

  L'ORDINE FRA I TRE non è alfabetico: apre Abyssys, che ha la fotografia più
  forte del gruppo — una figura al mare, l'unica delle tre scattata fuori dal
  laboratorio.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");
/* Sotto il 101000 di Armonyen, che era il primo. */
const PLAN = [
  ["abyssys", 100100],
  ["tibia-cut", 100200],
  ["tomar", 100300],
];

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

const tx = client.transaction();
for (const [slug, rank] of PLAN) {
  const g = await client.fetch(
    /* groq */ `*[_type == "garment" && slug.current == $s][0]{_id, name, orderRank, stage}`,
    {s: slug},
  );
  if (!g?._id) {
    console.error(`  Non trovo ${slug}. Niente è stato scritto.\n`);
    process.exit(1);
  }
  tx.patch(g._id, (p) => p.set({orderRank: `0|${rank}:`}));
  console.log(`  ${g.name.padEnd(32)} ${g.orderRank} -> 0|${rank}:   stage ${g.stage ?? "(nessuno)"}`);
}

if (!WRITE) {
  console.log("\n  Niente è stato scritto. Rilancia con --write.\n");
  process.exit(0);
}
await tx.commit();
console.log("\n  Fatto. Il webhook di Sanity fa ripartire la build.\n");
