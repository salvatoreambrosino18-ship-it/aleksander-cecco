/*
  QUATTRO CAPI ESCONO DAL NEGOZIO. 21/08/2026.

    node scripts/patch-ritiri.mjs            mostra cosa farebbe
    node scripts/patch-ritiri.mjs --write    lo fa

  TRE PERCHÉ L'HA DECISO LUI:
    GHEZARD  torna a dicembre.
    RUBEDO   non si può rifare: quella pelle non la trova più.
    VESPER   fuori dal negozio, e non ha dato un motivo. Quindi la pagina non
             ne inventa uno: dice solo che non è in vendita.

  IL QUARTO PERCHÉ IL PREZZO È NOSTRO:
    MONUMENTUS PANTS sta a 1150, che è una cifra NOSTRA, derivata da un calcolo
    di ore e materiale. Finché lui non ne dà una, il capo non si vende. Un capo
    che nessuno può comprare è meglio di un capo venduto a un prezzo che chi lo
    fa non ha mai deciso — e i suoi pantaloni costano 200 e 670.

  RITIRATO NON VUOL DIRE CANCELLATO. `notOffered` lascia la pagina in piedi,
  l'indirizzo vivo, le fotografie dove sono e la tessera nel catalogo sotto
  ESAURITI, senza prezzo e senza pulsante. Non tocca `public/_redirects` e non
  c'è niente da togliere il giorno che uno di questi torna: basta rimettere
  «disponibile».

  EFFETTO COLLATERALE VOLUTO: il launch-check smette di chiedere il prezzo e le
  taglie sui ritirati, quindi la riga «Rubedo si può ordinare e NON HA PREZZO»
  sparisce. Non perché sia stata risolta, ma perché non è più una domanda.

  LE DUE RIGHE SONO NOSTRE, e vale la pena saperlo: `availabilityNote` non ha
  un segno «inventato» come gli altri campi. Il MOTIVO è suo, riferito a voce;
  le parole italiane e inglesi le abbiamo scritte noi. Se vuole dirlo con parole
  sue, si cambia in due secondi dallo studio.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");
const S = (it, en) => ({_type: "localeString", it, en});

const PLAN = [
  {slug: "ghezard", why: "torna a dicembre (suo)", note: S("Torna a dicembre.", "Back in December.")},
  {
    slug: "rubedo",
    why: "non si può rifare, la pelle non si trova (suo)",
    note: S("Non si può rifare: questa pelle non si trova più.", "It cannot be made again: this leather cannot be found."),
  },
  {slug: "capo-09", why: "fuori dal negozio, nessun motivo dato", note: null},
  {slug: "capo-05", why: "il prezzo 1150 è nostro, in attesa del suo", note: null},
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
for (const item of PLAN) {
  const g = await client.fetch(
    /* groq */ `*[_type == "garment" && slug.current == $s][0]{_id, name, price, availability, availabilityNote}`,
    {s: item.slug},
  );
  if (!g?._id) {
    console.error(`  Non trovo ${item.slug}. Niente è stato scritto.\n`);
    process.exit(1);
  }
  const set = {availability: "notOffered"};
  if (item.note) set.availabilityNote = item.note;
  tx.patch(g._id, (p) => p.set(set));

  console.log(`  ${g.name}  (${item.slug})`);
  console.log(`    ${g.availability} -> notOffered   ${item.why}`);
  console.log(`    la pagina dice: ${item.note ? `«${item.note.it}» / «${item.note.en}»` : "«Non in lavorazione ora.» (la formula predefinita)"}`);
  console.log(`    prezzo ${g.price ?? "—"}: resta scritto nel dataset ma non si vede più nel catalogo\n`);
}

if (!WRITE) {
  console.log("  Niente è stato scritto. Rilancia con --write.\n");
  process.exit(0);
}
await tx.commit();
console.log("  Fatto. Il webhook di Sanity fa ripartire la build.\n");
