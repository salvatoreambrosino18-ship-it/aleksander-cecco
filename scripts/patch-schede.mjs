/*
  LE SCHEDE DA APPROVARE, APPLICATE. 20/08/2026.

    node scripts/patch-schede.mjs            mostra cosa cambierebbe
    node scripts/patch-schede.mjs --write     lo fa

  Dodici schede tornate compilate. Due (Styrax nero e rosso) sono già state
  applicate, due descrizioni (Vest e Oblivion) anche, tre sono capi nuovi che
  non esistono ancora nel dataset. Restano OTTO capi, ed è quello che fa questo
  script: prezzo, taglie, composizione e descrizione, con le sue parole.

  I PREZZI CROLLANO, e non è un errore di battitura: i nostri erano derivati da
  un calcolo di ore e materiale (sezione 32) e stavano fra due e cinque volte
  sopra i suoi. I suoi sono i suoi.

  LE TAGLIE ARRIVANO IN DUE SISTEMI. W30-32-34 sui pantaloni, W27 su Severya,
  ONE su Arak e Glovyes che lui descrive come regolabili. Scritte come le ha
  scritte lui; l'ordine sul sito lo decide `sortSizes`.

  COSA NON TOCCA, E PERCHÉ:
  - i NOMI che abbiamo inventato noi (Armonyen, Aleya, Vesper). Lui la casella
    NOME l'ha usata quando voleva — Corvinus è diventato Arak Top — quindi
    lasciarla com'era può voler dire «va bene» o può voler dire che non l'ha
    guardata. Due cose diverse, e finché non lo sappiamo il segno resta.
  - le COMPOSIZIONI che ha lasciato in bianco: restano nostre e restano segnate.
  - l'italiano delle composizioni che ha dato solo in inglese (Aleya): la
    traduzione è nostra, quindi `materials` resta segnato anche lì.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");
const T = (it, en) => ({_type: "localeText", it, en});

const PLAN = [
  {
    slug: "capo-01",
    price: 450,
    description: T(
      "Questa Creatura subisce il processo Shrunked, dove acquisisce una texture viva e vissuta, enfatizzando tratti e rughe.",
      "This Creature undergoes the Shrunked process, where it acquires a living and weathered texture, emphasizing features and wrinkles.",
    ),
    clear: ["price", "description"],
  },
  {slug: "capo-02", price: 500, clear: ["price"]},
  {slug: "capo-03", price: 300, clear: ["price"]},
  {
    slug: "capo-07",
    price: 200,
    sizes: ["W30", "W32", "W34"],
    materials: T("Pelle di agnello", "Lambskin leather"),
    description: T(
      "Aleya, questa creatura mostra la crudezza del nostro essere, realizzata in pelle di agnello lavata in colore antico.",
      "Aleya, this Creature shows the Raw of our being, made from washed lambskin leather in antiqued color.",
    ),
    /* `materials` NON si spegne: l'inglese è suo, l'italiano è nostro. */
    clear: ["price", "description"],
  },
  {
    slug: "severya",
    price: 300,
    sizes: ["W27"],
    description: T(
      "Severya, questa Creatura è stata realizzata lasciando la forma naturale dell'animale, dove l'insieme di tagli crudi formano un solo corpo armonico.",
      "Severya, this Creature was made leaving the natural shape of the animal, where the set of raw cuts form a single harmonious body.",
    ),
    clear: ["price", "description"],
  },
  {
    slug: "glovyes",
    price: 250,
    sizes: ["ONE"],
    description: T(
      "Glovyes, questa Creature è prodotta con pelle di agnello morbida, calza come un guanto dando un armatura armonica alle proprie gambe.",
      "Glovyes, this Creature is made with soft lambskin leather, fit's like a glove giving an harmonic armour to the legs.",
    ),
    clear: ["price", "description", "sizes"],
  },
  {slug: "capo-11", price: 870, sizes: ["W30", "W32", "W34"], clear: ["price"]},
  {
    slug: "capo-12",
    price: 250,
    sizes: ["ONE"],
    description: T(
      "Arak, questo pezzo subisce il processo Shrunked. Seguendo l'anatomia del corpo, diventerà la propria armatura.",
      "Arak, this piece undergoes the Shrunked trial. Following the anatomy of the body, it will become its own armor.",
    ),
    clear: ["price", "description"],
  },
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

const short = (s, n = 62) => (!s ? "(vuoto)" : s.length > n ? s.slice(0, n - 1) + "…" : s);

console.log(`\n  ${WRITE ? "SCRIVO" : "PROVA A VUOTO"} su ${process.env.PUBLIC_SANITY_PROJECT_ID}/${process.env.PUBLIC_SANITY_DATASET}`);
console.log(`  ${PLAN.length} capi\n`);

const tx = client.transaction();
let euro = 0;

for (const item of PLAN) {
  const g = await client.fetch(
    /* groq */ `*[_type == "garment" && slug.current == $s][0]{_id, name, price, sizes, materials, description, availability, inventedFields}`,
    {s: item.slug},
  );
  if (!g?._id) {
    console.error(`  Non trovo ${item.slug}. Niente è stato scritto.\n`);
    process.exit(1);
  }

  const set = {};
  const lines = [];

  if (item.price != null && g.price !== item.price) {
    set.price = item.price;
    euro += (g.price ?? 0) - item.price;
    lines.push(`prezzo        ${String(g.price ?? "—").padEnd(6)} ->  ${item.price}`);
  }
  if (item.sizes && (g.sizes ?? []).join(" ") !== item.sizes.join(" ")) {
    set.sizes = item.sizes;
    lines.push(`taglie        ${((g.sizes ?? []).join(" ") || "(nessuna)").padEnd(6)} ->  ${item.sizes.join(" ")}`);
  }
  if (item.materials) {
    set.materials = item.materials;
    lines.push(`composizione  ${short(g.materials?.en)}`);
    lines.push(`              ->  ${short(item.materials.en)}   (l'italiano è nostro, resta segnato)`);
  }
  if (item.description) {
    set.description = item.description;
    lines.push(`descrizione   ${short(g.description?.en ?? g.description?.it)}`);
    lines.push(`              ->  ${short(item.description.en)}`);
  }

  const invented = g.inventedFields ?? [];
  const after = invented.filter((f) => !item.clear.includes(f));
  if (after.join(",") !== invented.join(",")) {
    set.inventedFields = after;
    lines.push(`segni         ${invented.join(", ") || "(nessuno)"}  ->  ${after.join(", ") || "(NESSUNO — è tutto suo)"}`);
  }

  console.log(`  ${g.name}  (${item.slug})`);
  if (lines.length === 0) console.log("    già a posto, niente da fare");
  for (const l of lines) console.log(`    ${l}`);
  console.log("");

  if (Object.keys(set).length > 0) tx.patch(g._id, (p) => p.set(set));
}

console.log(`  In tutto il listino cala di ${euro} euro sui capi toccati.\n`);
console.log("  DUE COSE CHE QUESTO SCRIPT NON DECIDE:");
console.log("    - i nomi nostri (Armonyen, Aleya, Vesper) restano segnati: lui la");
console.log("      casella NOME l'ha cambiata dove voleva, quindi il silenzio non è un sì.");
console.log("    - la sua scheda di Aleya si intitola «Aleya Pants». Titolo o nome?\n");

if (!WRITE) {
  console.log("  Niente è stato scritto. Rilancia con --write.\n");
  process.exit(0);
}
await tx.commit();
console.log("  Fatto. Il webhook di Sanity fa ripartire la build.\n");
