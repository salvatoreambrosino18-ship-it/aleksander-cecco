/*
  L'INDIRIZZO CHE IL SITO MOSTRA. 23/08/2026.

    node scripts/patch-email-contatto.mjs            mostra cosa farebbe
    node scripts/patch-email-contatto.mjs --write    lo fa

  In fondo a OGNI pagina, e sulla pagina dei contatti, il sito mostrava
  `aleksandercecco@gmail.com`. Un negozio che pubblica una Gmail personale
  sembra un hobby. Adesso esistono `info@` e `ordini@` sul dominio, e girano
  tutte e due sulla stessa casella, quindi non cambia dove arriva la posta:
  cambia solo cosa legge chi guarda.

  UN CAMPO SOLO. Il piè di pagina e la pagina dei contatti leggono entrambi
  `contactEmail` in Impostazioni del sito, quindi si cambia in un posto e
  cambia dappertutto. È un valore del pannello, non del codice: se un giorno
  vuole cambiarlo ancora, lo fa da solo senza chiedere niente a nessuno.

  QUELLO CHE QUESTO SCRIPT NON TOCCA, E NON DEVE:

  - LE PAGINE LEGALI. La Gmail compare nelle condizioni di vendita e
    nell'informativa perché ce l'ha messa l'avvocato, come SECONDO indirizzo
    accanto alla PEC, e su quelle righe ci si esercita il diritto di recesso.
    Cambiare un indirizzo dentro una clausola firmata non è un ritocco di
    stile. Va chiesto a lui, insieme alle altre tre cose che gli restano.

  - `ENQUIRY_TO_EMAIL`. È la casella dove ARRIVANO gli ordini e non la vede
    nessun visitatore. Il modulo manda lì e mette in `reply_to` l'indirizzo di
    chi ha scritto, quindi rispondere va a lui. Nessuna mail parte mai verso il
    compratore, e `RESEND_FROM` non lo legge nessuno.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");
const NUOVO = "info@aleksandercecco.com";

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

const s = await client.fetch(/* groq */ `*[_id == "siteSettings"][0]{_id, contactEmail}`);
console.log(`\n  ${WRITE ? "SCRIVO" : "PROVA A VUOTO"} su ${process.env.PUBLIC_SANITY_PROJECT_ID}/${process.env.PUBLIC_SANITY_DATASET}\n`);
console.log(`    contactEmail:  ${s.contactEmail}  ->  ${NUOVO}`);
console.log(`    lo leggono:    il piè di pagina di ogni pagina, e la pagina dei contatti\n`);

if (!WRITE) {
  console.log("  Niente è stato scritto. Rilancia con --write.\n");
  process.exit(0);
}
await client.patch(s._id).set({contactEmail: NUOVO}).commit();
console.log("  Fatto. Il webhook di Sanity fa ripartire la build.\n");
