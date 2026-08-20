/*
  SEVERYA È PITONE VERO. 20/08/2026, risposta n.1 del titolare: pitone, e dice
  di avere tutta la documentazione. Decisione del committente: si pubblica la
  composizione vera e il capo resta acquistabile ovunque, sotto la sua partita
  IVA e sotto la sua responsabilità.

    node scripts/patch-severya-python.mjs            mostra cosa farebbe
    node scripts/patch-severya-python.mjs --write    lo fa

  QUELLO CHE C'ERA SCRITTO ERA NOSTRO ED ERA FALSO: «Snake-embossed lambskin /
  Pelle di agnello, stampa serpente». Pelle di agnello stampata e pitone non
  sono lo stesso animale e non sono la stessa legge. La regola di questo sito
  (sezione 108) è che dire di meno non espone e dire la cosa sbagliata sì:
  quindi la riga falsa se ne va oggi, non insieme al resto.

  IL SEGNO `materials` RESTA ACCESO, ed è voluto. Lui ha scritto «Phyton
  Leather, Pelle di Pitone»: la sostanza è sua, ma «Phyton» non è una parola e
  su una pagina che adesso dichiara una specie CITES un nome di specie storpiato
  è peggio di una svista. Abbiamo scritto «Python leather / Pelle di pitone»,
  cioè la sua cosa con l'ortografia giusta — e finché la correzione è nostra il
  segno resta, e il launch-check continua a nominarlo. Gli basta un sì.

  LA DESCRIZIONE ANCORA DICE «snake skirt», ed è nostra: se ne va con il
  passaggio delle dodici schede, dove c'è la sua.

  LA DOMANDA SULL'EXPORT è nel BRIEF-LEGALE, §6.2 n.11. Non la risolviamo noi.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");
const SLUG = "severya";
const MATERIALS = {_type: "localeText", it: "Pelle di pitone", en: "Python leather"};

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
  /* groq */ `*[_type == "garment" && slug.current == $s][0]{_id, name, materials, availability, inventedFields}`,
  {s: SLUG},
);
if (!g?._id) {
  console.error(`\n  Non trovo ${SLUG}. Niente è stato scritto.\n`);
  process.exit(1);
}

console.log(`\n  ${WRITE ? "SCRIVO" : "PROVA A VUOTO"} su ${process.env.PUBLIC_SANITY_PROJECT_ID}/${process.env.PUBLIC_SANITY_DATASET}\n`);
console.log(`    prima:  ${g.materials?.it}  /  ${g.materials?.en}`);
console.log(`    dopo:   ${MATERIALS.it}  /  ${MATERIALS.en}`);
console.log(`    segni:  ${(g.inventedFields ?? []).join(", ")}  (materials RESTA, vedi in cima)`);
console.log(`    vendita: ${g.availability}  (invariata, resta acquistabile)\n`);

if (!WRITE) {
  console.log("  Niente è stato scritto. Rilancia con --write.\n");
  process.exit(0);
}
await client.patch(g._id).set({materials: MATERIALS}).commit();
console.log("  Fatto. Il webhook di Sanity fa ripartire la build.\n");
