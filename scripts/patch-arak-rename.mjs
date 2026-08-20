/*
  CORVINUS DIVENTA ARAK TOP. 20/08/2026, risposta n.8 del titolare.

    node scripts/patch-arak-rename.mjs            mostra cosa farebbe
    node scripts/patch-arak-rename.mjs --write    lo fa

  «Corvinus» era un nome NOSTRO: preso dal suo vocabolario pubblico e assegnato
  da noi, segnato in `inventedFields` proprio perché non l'aveva detto lui. La
  scheda DA APPROVARE gliel'ha chiesto nella casella NOME e lui ha risposto
  «Arak Top». Quindi il segno se ne va insieme al nome vecchio.

  LO SLUG NON SI TOCCA. La pagina resta /creature/capo-12 in tutte e due le
  lingue, nessun link muore e in `public/_redirects` NON va aggiunto niente —
  una riga lì coprirebbe una pagina viva, che è esattamente come si era rotto
  Rubedo. Cambia il titolo della scheda, l'H1, la tessera nel catalogo, la riga
  nel carrello e il nome nella mail d'ordine: tutti leggono questo campo.

  IL DROP «Solvet et Coagula» NON È QUI. È legato al rinominare la pagina
  Processo e si decide a parte.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");
const SLUG = "capo-12";
const NEW_NAME = "Arak Top";

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
  /* groq */ `*[_type == "garment" && slug.current == $s][0]{_id, name, "slug": slug.current, inventedFields}`,
  {s: SLUG},
);
if (!g?._id) {
  console.error(`\n  Non trovo ${SLUG}. Niente è stato scritto.\n`);
  process.exit(1);
}

const invented = g.inventedFields ?? [];
const after = invented.filter((f) => f !== "name");
const tx = client.transaction();
if (g.name !== NEW_NAME) tx.patch(g._id, (p) => p.set({name: NEW_NAME}));
if (invented.includes("name")) tx.patch(g._id, (p) => p.set({inventedFields: after}));

console.log(`\n  ${WRITE ? "SCRIVO" : "PROVA A VUOTO"} su ${process.env.PUBLIC_SANITY_PROJECT_ID}/${process.env.PUBLIC_SANITY_DATASET}\n`);
console.log(`    nome:  ${g.name} -> ${NEW_NAME}`);
console.log(`    segni: ${invented.join(", ") || "(nessuno)"} -> ${after.join(", ") || "(nessuno)"}`);
console.log(`    slug:  ${g.slug}  (INVARIATO, nessun redirect)\n`);

if (!WRITE) {
  console.log("  Niente è stato scritto. Rilancia con --write.\n");
  process.exit(0);
}
await tx.commit();
console.log("  Fatto. Il webhook di Sanity fa ripartire la build.\n");
