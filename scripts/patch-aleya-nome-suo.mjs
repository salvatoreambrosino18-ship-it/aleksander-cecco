/*
  ALEYA È UN NOME SUO. 21/08/2026: il segno «inventato» se ne va.

    node scripts/patch-aleya-nome-suo.mjs            mostra cosa farebbe
    node scripts/patch-aleya-nome-suo.mjs --write    lo fa

  IL SEGNO DICEVA DUE COSE DIVERSE e una sola era vera. `import-photos.mjs` e
  DESIGN-PLAN («The names») dicono la stessa cosa: Aleya è una parola SUA — i
  suoi «Aleya bootcut pants» — e quello che avevamo scelto noi era a QUALE capo
  attaccarla. Il segno serviva per quello: non «ce lo siamo inventato», ma «non
  ha mai confermato che sia questo il capo».

  ADESSO L'HA CONFERMATO TRE VOLTE, senza che nessuno gliel'abbia chiesto, nel
  materiale consegnato il 20/08:

    - ha chiamato ALEYA nove suoi file di fotografie, di questo capo;
    - ha intitolato la sua scheda «Aleya Pants», che è la stessa parola sullo
      stesso tipo di capo di due mesi prima;
    - ha scritto il nome dentro una frase sua, in tutte e due le lingue:
      «Aleya, questa creatura mostra la crudezza del nostro essere».

  Un nome usato dal titolare tre volte, spontaneamente, sullo stesso oggetto,
  non è più un nostro plausibile. Chiederglielo sarebbe stato chiedergli di
  confermare una cosa che ha già scritto.

  ARMONYEN NO, E LA DIFFERENZA È IL PUNTO. Anche «Armonyen» è una parola sua,
  ma nessuna sua fotografia porta quel nome e l'unico file che lo contiene è la
  pagina che ha esportato dal NOSTRO foglio, dove l'intestazione l'avevamo
  scritta noi: è una prova circolare. Quel segno resta finché non risponde.
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
  /* groq */ `*[_type == "garment" && slug.current == "capo-07"][0]{_id, name, inventedFields}`,
);
if (!g?._id) {
  console.error("\n  Non trovo capo-07. Niente è stato scritto.\n");
  process.exit(1);
}

const invented = g.inventedFields ?? [];
const after = invented.filter((f) => f !== "name");

console.log(`\n  ${WRITE ? "SCRIVO" : "PROVA A VUOTO"} su ${process.env.PUBLIC_SANITY_PROJECT_ID}/${process.env.PUBLIC_SANITY_DATASET}\n`);
console.log(`  ${g.name}`);
console.log(`    segni: ${invented.join(", ") || "(nessuno)"} -> ${after.join(", ") || "(nessuno)"}\n`);

if (!WRITE) {
  console.log("  Niente è stato scritto. Rilancia con --write.\n");
  process.exit(0);
}
await client.patch(g._id).set({inventedFields: after}).commit();
console.log("  Fatto.\n");
