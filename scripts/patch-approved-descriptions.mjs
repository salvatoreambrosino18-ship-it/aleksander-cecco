/*
  DUE DESCRIZIONI DIVENTANO SUE. 20/08/2026, risposte n.6 e n.7 del titolare.

    node scripts/patch-approved-descriptions.mjs            mostra cosa farebbe
    node scripts/patch-approved-descriptions.mjs --write    lo fa

  MONUMENTUS VEST (n.6). Sul sito c'era la NOSTRA frase: «un gilet ricavato da
  una pelle sola». La sua scheda dice il contrario — è fatto interamente di
  scarti assemblati uno per uno — e alla domanda «tengo la tua?» ha risposto sì.
  Non è una riscrittura, è una correzione di fatto: la nostra descriveva un
  oggetto costruito in un altro modo.

  OBLIVION (n.7). La sua descrizione nuova sostituisce quella vecchia, che
  parlava dei 500 punti-cicatrice e del foro Oblivion. Confermato.

  TRASCRITTE COM'ERANO SCRITTE, refusi compresi: «un apertura» senza apostrofo,
  «cuciture» minuscolo a inizio riga, «sculps» in inglese. La regola di questo
  sito è che le sue parole non si toccano (voice.ts): correggerle le renderebbe
  in parte nostre, e allora andrebbero di nuovo segnate. Se vuole le virgole
  giuste, gliele chiediamo e le cambia lui.

  I PREZZI DI QUESTE DUE SCHEDE NON SONO QUI. Vest 950 -> 300 e Oblivion
  1450 -> 500 stanno nel passaggio delle dodici schede, che non è stato ancora
  autorizzato. Questo script tocca solo quello che le risposte 6 e 7 decidono.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");

const PLAN = [
  {
    slug: "capo-03",
    clear: "description",
    description: {
      _type: "localeText",
      it:
        "Tenebrae Vest, questa Creatura è interamente realizzata con scarti.\n" +
        "Assemblati uno ad uno, con pazienza e precisione insieme formano pattern biologici.\n" +
        "Ogni creazione è unica, nessuna è uguale all'altra",
      en:
        "Tenebrae Vest, this Creature is entirely made from scraps.\n" +
        "Assembled one by one, with patience and precision together they form biological patterns.\n" +
        "Each creation is one of a kind, no two are the same",
    },
  },
  {
    slug: "capo-02",
    clear: "descriptionIt",
    description: {
      _type: "localeText",
      it:
        "Oblivion, questa creatura è realizzata con pelle di agnello ed ha un taglio che scolpisce le linee del corpo.\n" +
        "Sulla schiena e nell'interno braccia presenta un apertura da far intravedere il proprio corpo.\n" +
        "cuciture mediche fatte a mano lungo la schiena e sul busto.",
      en:
        "Oblivion, this Creature is made with lambskin leather and has a cut that sculps the lines of the body.\n" +
        "On the back and on the inner arms it features openings to give a glimpse of the body itself.\n" +
        "Hand stitched medical seams run along the back and on the torso.",
    },
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

console.log(`\n  ${WRITE ? "SCRIVO" : "PROVA A VUOTO"} su ${process.env.PUBLIC_SANITY_PROJECT_ID}/${process.env.PUBLIC_SANITY_DATASET}\n`);

const tx = client.transaction();
for (const item of PLAN) {
  const g = await client.fetch(
    /* groq */ `*[_type == "garment" && slug.current == $s][0]{_id, name, inventedFields}`,
    {s: item.slug},
  );
  if (!g?._id) {
    console.error(`  Non trovo ${item.slug}. Niente è stato scritto.\n`);
    process.exit(1);
  }
  const invented = g.inventedFields ?? [];
  const after = invented.filter((f) => f !== item.clear);
  tx.patch(g._id, (p) => p.set({description: item.description, inventedFields: after}));
  console.log(`    ${g.name}`);
  console.log(`      descrizione: sua, in italiano e in inglese`);
  console.log(`      segni: ${invented.join(", ") || "(nessuno)"} -> ${after.join(", ") || "(nessuno)"}`);
}

if (!WRITE) {
  console.log("\n  Niente è stato scritto. Rilancia con --write.\n");
  process.exit(0);
}
await tx.commit();
console.log("\n  Fatto. Il webhook di Sanity fa ripartire la build.\n");
