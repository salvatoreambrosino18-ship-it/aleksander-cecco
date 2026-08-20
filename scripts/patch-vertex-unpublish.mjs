/*
  VERTEX ESCE DAL SITO, MA NON DAL DATASET. 20/08/2026, decisione del titolare:
  il cappello appartiene a un altro suo progetto.

    node scripts/patch-vertex-unpublish.mjs            mostra cosa farebbe
    node scripts/patch-vertex-unpublish.mjs --write    lo fa

  DEPUBBLICATO, NON CANCELLATO, ed è la differenza che conta. Cancellare un
  documento in Sanity non si annulla: si recupera solo da un export. Questo
  script fa quello che fa il pulsante «Unpublish» dello studio — copia il
  documento in `drafts.` e toglie quello pubblicato — quindi il capo sparisce
  dal sito e resta intero nello studio, fra le bozze. Se torna, si ripubblica
  con un clic e con le sue fotografie ancora attaccate.

  L'EXPORT È STATO FATTO PRIMA, comunque: ~/aleksander-cecco-backups/.

  I DUE REDIRECT vanno in public/_redirects a mano, e portano al catalogo. Sono
  la solita trappola di questo file: se il cappello un giorno torna, quelle due
  righe coprono la sua pagina e vanno tolte lo stesso giorno.

  NESSUNO LO PUNTA: controllato, `references()` non trova niente — non è nella
  sequenza della home, non è nella fascia dei ritagli, non è in nessun drop.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");
const SLUG = "capo-14";

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

const published = await client.fetch(
  /* groq */ `*[_type == "garment" && slug.current == $s && !(_id in path("drafts.**"))][0]`,
  {s: SLUG},
);
if (!published?._id) {
  console.error(`\n  Non trovo un ${SLUG} pubblicato. Niente è stato scritto.\n`);
  process.exit(1);
}

const referrers = await client.fetch(/* groq */ `*[references($id)]{_id, _type}`, {id: published._id});
if (referrers.length > 0) {
  console.error(`\n  ATTENZIONE: ${referrers.length} documenti lo puntano ancora:`);
  for (const r of referrers) console.error(`    ${r._type}  ${r._id}`);
  console.error("  Sistemali prima. Niente è stato scritto.\n");
  process.exit(1);
}

const draftId = `drafts.${published._id}`;
const existingDraft = await client.fetch(/* groq */ `*[_id == $id][0]{_id}`, {id: draftId});
const {_rev, _createdAt, _updatedAt, ...content} = published;
const draft = {...content, _id: draftId};

console.log(`\n  ${WRITE ? "SCRIVO" : "PROVA A VUOTO"} su ${process.env.PUBLIC_SANITY_PROJECT_ID}/${process.env.PUBLIC_SANITY_DATASET}\n`);
console.log(`    capo:        ${published.name} (${published._id})`);
console.log(`    fotografie:  ${(published.media ?? []).length}`);
console.log(`    bozza:       ${existingDraft ? "ne esiste già una, la lascio com'è" : `creo ${draftId}`}`);
console.log(`    pubblicato:  cancello ${published._id}  <-- la pagina sparisce dal sito`);
console.log(`\n    Poi, a mano, in public/_redirects:`);
console.log(`      /it/creature/${SLUG}  /it/creature  301`);
console.log(`      /en/creature/${SLUG}  /en/creature  301\n`);

if (!WRITE) {
  console.log("  Niente è stato scritto. Rilancia con --write.\n");
  process.exit(0);
}

await client.transaction().createIfNotExists(draft).delete(published._id).commit();
console.log("  Fatto. Il capo è fra le bozze e non è più sul sito.\n");
