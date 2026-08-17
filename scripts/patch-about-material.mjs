/*
  LA SEZIONE SULLA PELLE, SU CHI SIAMO.

    node scripts/patch-about-material.mjs            dice cosa farebbe
    node scripts/patch-about-material.mjs --write    lo scrive nel database

  IL TITOLARE HA CHIESTO UNA SEZIONE SULLA SOSTENIBILITA'. Questa e' quella
  sezione, scritta come FATTI e non come dichiarazioni, e la forma e' essa
  stessa la ragione.

  Dal 2026 in Europa chi vende non puo' dire «sostenibile» o «ecologico» senza
  poterlo dimostrare, e il linguaggio verde generico e' proprio cio' che viene
  guardato. A rispondere di una frase scritta qui sarebbe Ciro, non noi.

  QUINDI OGNI RIGA E' UNA DI TRE COSE: un fatto sul materiale, un fatto su dove
  si concia, o una proprieta' dell'oggetto. Ognuna e' gia' vera altrove sul
  sito o nelle sue parole.

  COSA NON C'E', ed e' importante quanto cio' che c'e':

  - NESSUN AGGETTIVO SUL MARCHIO. Mai «sostenibile», mai «eco», mai «a impatto
    zero», mai «responsabile».
  - NIENTE «MENO ACQUA». Era nella richiesta e non e' scritto qui. La concia al
    vegetale e' piu' lenta e usa scarichi diversi da quella al cromo; che usi
    MENO acqua e' un confronto quantitativo, e un confronto quantitativo senza
    una misura e' esattamente il tipo di frase che le regole nuove colpiscono.
  - NIENTE «FATTO DOPO L'ORDINE». Era nella richiesta ed e' la frase che il
    sito ha appena tolto da cinque punti, il 16/08/2026, perche' il titolare ha
    deciso che i capi sono DISPONIBILI SUBITO. Rimetterla qui ricostruirebbe la
    contraddizione appena chiusa. E' una domanda per lui, non una riga da
    scrivere.
  - NESSUN NUMERO. Niente percentuali, niente litri, niente chili.
  - NIENTE «TORNA NELLA TERRA». Una frase sulla biodegradabilita' avrebbe
    bisogno di una prova che dipende dalle finiture. Sta gia' su /process come
    nostra, ed e' segnalata a parte.

  IL TITOLO E' «LA PELLE» E NON «SOSTENIBILITA'». Un titolo con quella parola
  sopra incornicia tutto quello che sta sotto come una dichiarazione ambientale,
  e invita esattamente la lettura che il resto della sezione evita. Le righe
  restano le stesse; cambia solo cosa promettono.

  E' NOSTRA. Segnata `aboutMaterial` in `inventedCopy`, quindi
  `npm run launch-check` la conta e lui puo' riscriverla dallo studio.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");

/*
  Nessun due punti e nessun trattino, come ogni altra frase del sito dal
  16/08/2026 (sezione 134).
*/
const MATERIAL = {
  _type: "mosaicNote",
  heading: {_type: "localeString", it: "La pelle", en: "The leather"},
  text: {
    _type: "localeText",
    it:
      "La concia è vegetale, con corteccia, foglie e radici, e dura settimane. Non si usano sali di cromo.\n\n" +
      "Le pelli arrivano da Solofra, a un'ora di strada da Napoli, dove si conciano da secoli.\n\n" +
      "Ogni capo esce da una pelle sola ed è tagliato a mano.\n\n" +
      "Le cuciture restano in vista, quindi si possono rifare. La pelle conciata al vegetale si nutre e si ritinge, " +
      "e un capo fatto così è pensato per essere riparato invece che sostituito.",
    en:
      "The tanning is vegetable, with bark, leaves and roots, and it takes weeks. No chrome salts are used.\n\n" +
      "The hides come from Solofra, an hour from Naples, where leather has been tanned for centuries.\n\n" +
      "Each piece comes out of a single hide and is cut by hand.\n\n" +
      "The stitching stays visible, so it can be redone. Leather tanned this way can be fed and dyed again, " +
      "and a piece made like this is meant to be repaired rather than replaced.",
  },
};

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

const settings = await client.fetch(
  /* groq */ `*[_id == "siteSettings"][0]{_id, aboutMaterial, inventedCopy}`,
);
if (!settings?._id) {
  console.error("\n  siteSettings non c'e'.\n");
  process.exit(1);
}

/*
  UN ULTIMO CONTROLLO SULLE PAROLE, prima di scrivere. Non e' teatro: la lista
  qui sotto e' esattamente cio' che una lettura ostile cercherebbe, e un giorno
  qualcuno riscrivera' queste righe senza aver letto l'intestazione di questo
  file.
*/
const BANNED = [
  "sostenibil", "ecologic", "eco-", "green", "impatto zero", "a zero impatto",
  "responsabil", "etic", "naturale al 100", "biodegradabil",
  "sustainab", "eco friendly", "eco-friendly", "zero impact", "carbon", "planet friendly",
];
const blob = `${MATERIAL.text.it} ${MATERIAL.text.en} ${MATERIAL.heading.it} ${MATERIAL.heading.en}`.toLowerCase();
const hits = BANNED.filter((w) => blob.includes(w));
const numbers = blob.match(/\d+\s?(%|litri|litres|kg|volte|times)/g) ?? [];
if (hits.length || numbers.length) {
  console.error(`\n  RIFIUTO: parole o numeri da dimostrare: ${[...hits, ...numbers].join(", ")}\n`);
  process.exit(1);
}
if (/[:—–]/.test(blob)) {
  console.error("\n  RIFIUTO: due punti o trattini lunghi nel testo.\n");
  process.exit(1);
}
/*
  E GLI ACCENTI VERI, non l'apostrofo. La prima scrittura di questo file usava
  «e'» e «cosi'» per non litigare con la shell, ed è finita sulla pagina. La
  sezione 108 aveva già corretto due accenti così, trovati leggendo.
*/
if (/\b(e|perche|cosi|gia|piu|puo|liberta|qualita)'/i.test(MATERIAL.text.it)) {
  console.error("\n  RIFIUTO: apostrofo al posto di un accento nel testo italiano.\n");
  process.exit(1);
}

const flags = new Set(settings.inventedCopy ?? []);
flags.add("aboutMaterial");

console.log("\n  Chi siamo, la sezione sulla pelle");
console.table([
  {campo: "prima", valore: settings.aboutMaterial?.text?.it ? "gia' scritta" : "(vuoto)"},
  {campo: "titolo", valore: `${MATERIAL.heading.it} / ${MATERIAL.heading.en}`},
  {campo: "righe", valore: MATERIAL.text.it.split("\n\n").length},
  {campo: "parole da dimostrare", valore: "nessuna"},
]);
console.log("\n" + MATERIAL.text.it + "\n");

if (!WRITE) {
  console.log("  PROVA. Rilancia con --write per salvarlo.\n");
} else {
  await client
    .patch(settings._id)
    .set({aboutMaterial: MATERIAL, inventedCopy: [...flags]})
    .commit();

  const anon = createClient({
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.PUBLIC_SANITY_DATASET,
    apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
    useCdn: false,
    perspective: "published",
  });
  await new Promise((r) => setTimeout(r, 2000));
  const seen = await anon.fetch(/* groq */ `*[_id == "siteSettings"][0].aboutMaterial.text.en`);
  if (!seen) {
    console.error("\n  ATTENZIONE: salvato, ma il sito non lo vede.\n");
    process.exit(1);
  }
  console.log("  Salvato, e il sito lo vede.\n");
}
