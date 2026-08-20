/*
  I DUE STYRAX SI NOMINANO A VICENDA, E IL NERO COSTA QUANTO IL ROSSO.
  20/08/2026, due decisioni del titolare in una.

    node scripts/patch-styrax-link.mjs            mostra cosa farebbe
    node scripts/patch-styrax-link.mjs --write    lo fa

  UNO. Voleva UNA sola Creatura con la scelta del colore. Un sistema di varianti
  sarebbe arrivato allo schema, al raggruppamento del catalogo, alla pagina, al
  carrello, al listino dell'endpoint, alla mail dell'ordine e al launch-check —
  per una coppia sola, che per giunta non è d'accordo su prezzo e disponibilità:
  il rosso è un pezzo unico, il nero no. Ha scelto le due pagine che si nominano
  a vicenda. Il campo `relatedPieces` si compila DA UNA PARTE SOLA: la pagina
  legge il riferimento nei due sensi, quindi la riga compare su tutte e due.

  DUE. Il nero costava 975, che era un prezzo NOSTRO, e il rosso lo ha messo lui
  a 250 nel foglio DA APPROVARE. Ha deciso che il nero costa quanto il rosso, e
  975 se ne va insieme al segno «inventato» sul prezzo.

  QUELLO CHE RESTA SEGNATO, e non è una svista: `descriptionIt` sul nero è la
  nostra traduzione della sua descrizione inglese, e lui non l'ha ancora letta.
  E la riga nuova che collega i due capi è una FRASE NOSTRA, quindi entra in
  `inventedCopy` come `relatedPieceLine`: il launch-check la nomina finché non
  la approva o non la riscrive in LE PAROLE DEL SITO.

  NON TOCCA IL ROSSO. Sul sito il rosso porta ancora 775, che è nostro: il suo
  foglio dice 250 e quel prezzo non è stato ancora applicato, perché non è stato
  chiesto. Lo script lo DICE e non lo fa.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");

const BLACK = "styrax";
const RED = "styrax-red";
const NEW_PRICE = 250;
const COPY_FLAG = "relatedPieceLine";

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

const [black, red, settings] = await Promise.all([
  client.fetch(/* groq */ `*[_type == "garment" && slug.current == $s][0]{_id, name, price, inventedFields, "related": relatedPieces[]->slug.current}`, {s: BLACK}),
  client.fetch(/* groq */ `*[_type == "garment" && slug.current == $s][0]{_id, name, price, inventedFields}`, {s: RED}),
  client.fetch(/* groq */ `*[_id == "siteSettings"][0]{_id, inventedCopy}`),
]);

for (const [label, doc] of [["nero", black], ["rosso", red], ["siteSettings", settings]]) {
  if (!doc?._id) {
    console.error(`\n  Non trovo ${label}. Niente è stato scritto.\n`);
    process.exit(1);
  }
}

const tx = client.transaction();
const done = [];

/* 1. il prezzo del nero */
if (black.price !== NEW_PRICE) {
  tx.patch(black._id, (p) => p.set({price: NEW_PRICE}));
  done.push(`prezzo del nero: ${black.price} -> ${NEW_PRICE}`);
} else {
  done.push(`prezzo del nero: già ${NEW_PRICE}, non toccato`);
}

/* 2. il segno «inventato» sul prezzo del nero */
const invented = black.inventedFields ?? [];
if (invented.includes("price")) {
  const after = invented.filter((f) => f !== "price");
  tx.patch(black._id, (p) => p.set({inventedFields: after}));
  done.push(`segni sul nero: ${invented.join(", ")} -> ${after.join(", ") || "(nessuno)"}`);
} else {
  done.push(`segni sul nero: il prezzo non era segnato, non toccato`);
}

/* 3. il collegamento, da una parte sola */
const related = (black.related ?? []).filter(Boolean);
if (!related.includes(RED)) {
  tx.patch(black._id, (p) =>
    p.setIfMissing({relatedPieces: []}).append("relatedPieces", [
      {_type: "reference", _ref: red._id, _key: `related-${RED}`},
    ]),
  );
  done.push(`collegamento: ${BLACK} -> ${RED} (la riga compare su tutte e due le pagine)`);
} else {
  done.push(`collegamento: c'era già`);
}

/* 4. la frase nuova è nostra */
const copy = settings.inventedCopy ?? [];
if (!copy.includes(COPY_FLAG)) {
  tx.patch(settings._id, (p) => p.set({inventedCopy: [...copy, COPY_FLAG]}));
  done.push(`inventedCopy: + ${COPY_FLAG}`);
} else {
  done.push(`inventedCopy: ${COPY_FLAG} c'era già`);
}

console.log(`\n  ${WRITE ? "SCRIVO" : "PROVA A VUOTO"} su ${process.env.PUBLIC_SANITY_PROJECT_ID}/${process.env.PUBLIC_SANITY_DATASET}\n`);
for (const line of done) console.log(`    ${line}`);

console.log(`\n  E IL ROSSO RESTA COM'È: prezzo ${red.price} (nostro, segnato ${(red.inventedFields ?? []).join(", ") || "-"}).`);
console.log(`  Il suo foglio DA APPROVARE dice ${NEW_PRICE}. Applicarlo non è stato chiesto e questo script non lo fa.\n`);

if (!WRITE) {
  console.log("  Niente è stato scritto. Rilancia con --write.\n");
  process.exit(0);
}

await tx.commit();
console.log("  Fatto. Il webhook di Sanity fa ripartire la build.\n");
