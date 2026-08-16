/*
  LE PAROLE ACCANTO ALL'ULTIMA FOTOGRAFIA DI PROCESSO.

    node scripts/patch-process-closing.mjs            dice cosa farebbe
    node scripts/patch-process-closing.mjs --write    lo scrive nel database

  PERCHÉ (2026-08-16, sezione 130, richiesta del titolare). Le quattro righe nel
  mosaico finiscono a metà pagina, e da lì Processo continua per una dozzina di
  fotografie senza più una parola. Questa chiude la pagina, di fianco all'ultima.

  COSA DICE, E PERCHÉ QUESTA COSA. Le regole del blocco sono scritte nello
  schema `mosaicNote`: il materiale per primo, un fatto e non un aggettivo,
  frasi corte, mai una lode al marchio. Le quattro righe che ci sono già
  raccontano la concia, il taglio, la cucitura e cosa resta.

  Quello che NON è detto da nessuna parte sul sito è **come si tiene un capo in
  pelle**, ed è la cosa che un compratore deve sapere e che nessun'altra pagina
  gli dà. Sta bene proprio lì perché nelle sue fotografie i capi sono quasi
  sempre appesi: la riga descrive quello che si sta guardando e poi dice perché.

  È NOSTRA. Segnata `processClosing` in `inventedCopy`, come le altre righe del
  mosaico, quindi `npm run launch-check` la conta e rifiuta finché lui non la
  approva o la riscrive. Se la svuota, la pagina torna a finire con le
  fotografie e basta — e quella è una scelta, non un guasto.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");

const CLOSING = {
  _type: "mosaicNote",
  /* Nessun titolino: lo schema dice che sopra un paragrafo solo è un'etichetta
     su un'etichetta, e questo è un paragrafo solo. */
  text: {
    _type: "localeText",
    it:
      "Nelle fotografie i capi sono quasi sempre appesi. Non è una scelta di stile: " +
      "la pelle si tiene appesa, larga, lontana dal calore. Piegata prende una piega, e la piega resta.",
    en:
      "In the photographs the pieces are almost always hanging. That is not styling: " +
      "leather is kept hung, with room around it, away from heat. Folded, it takes a crease and keeps it.",
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
  /* groq */ `*[_id == "siteSettings"][0]{_id, processClosing, inventedCopy}`,
);
if (!settings?._id) {
  console.error("\n  siteSettings non c'è.\n");
  process.exit(1);
}

/*
  IL SEGNO STA CON LA FRASE. Se la scriviamo noi, `processClosing` entra fra le
  cose nostre; se lui la cancella, il segno esce, perché un segno su un campo
  vuoto è il gate che rifiuta per una frase che non esiste.
*/
const flags = new Set(settings.inventedCopy ?? []);
flags.add("processClosing");

console.log("\n  Processo: le parole accanto all'ultima fotografia");
console.table([
  {campo: "prima", valore: settings.processClosing?.text?.it ?? "(vuoto)"},
  {campo: "dopo", valore: CLOSING.text.it},
  {campo: "segnata come nostra", valore: "sì, processClosing"},
]);

if (!WRITE) {
  console.log("\n  PROVA. Rilancia con --write per salvarlo.\n");
} else {
  await client
    .patch(settings._id)
    .set({processClosing: CLOSING, inventedCopy: [...flags]})
    .commit();

  const anon = createClient({
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.PUBLIC_SANITY_DATASET,
    apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
    useCdn: false,
    perspective: "published",
  });
  await new Promise((r) => setTimeout(r, 2000));
  const seen = await anon.fetch(/* groq */ `*[_id == "siteSettings"][0].processClosing.text.it`);
  if (!seen) {
    console.error("\n  ATTENZIONE: salvato, ma il sito non lo vede.\n");
    process.exit(1);
  }
  console.log("\n  Salvato, e il sito lo vede.\n");
}
