/*
  VIA I DUE PUNTI E I TRATTINI DALLE FRASI NOSTRE.

    node scripts/patch-no-colons.mjs            dice cosa farebbe
    node scripts/patch-no-colons.mjs --write    lo scrive nel database

  LA REGOLA (2026-08-16, sezione 134): sul sito non ci sono due punti e non ci
  sono trattini, in nessuna delle due lingue. Dove un due punti reggeva la
  frase, la frase si riscrive; non si sostituisce il segno con una virgola dove
  la virgola legge male.

  DUE ECCEZIONI, e questo script le rispetta tutte e due.

  1. IL TRATTINO DENTRO UNA PAROLA COMPOSTA resta. `Vegetable-tanned`,
     `Chrome-tanned` e `re-dyed` sono parole, non punteggiatura.
  2. LE FRASI SUE NON SI TOCCANO. Questo script scrive SOLO campi che sono
     nostri, elencati uno per uno qui sotto, e non tocca `about`,
     `homeStatement`, `openingLines`, `philosophy`, ne' le descrizioni inglesi
     dei capi, che sono le sue. Quelle vengono elencate a parte perche' le
     decida lui.

  IL TESTO ALTERNATIVO E' NOSTRO ED E' SUL SITO. Non si vede, ma lo legge chi
  usa uno screen reader, quindi conta come ogni altra frase. Li' il due punti
  separa sempre un nome dalla sua descrizione, e la virgola legge bene.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");

/* Riscritture esatte, una per frase. Niente regole automatiche sulla prosa. */
const REWRITES = [
  ["viene da un'ora di strada: non è un principio sulle distanze",
   "viene da un'ora di strada. Non è un principio sulle distanze"],
  ["Si sceglie lì una pelle alla volta: il modo lento, e l'unico per sapere",
   "Si sceglie lì una pelle alla volta. È il modo lento, e l'unico per sapere"],
  ["It is chosen there one hide at a time: the slow way, and the only way to know",
   "It is chosen there one hide at a time. That is the slow way, and the only way to know"],
  ["invece di essere nascosto: una cucitura che si vede",
   "invece di essere nascosto. Una cucitura che si vede"],
  ["durare più di chi lo compra — ed è la parte che non sappiamo rendere più veloce",
   "durare più di chi lo compra, ed è la parte che non sappiamo rendere più veloce"],
  ["outlast the person who buys it — and that is the part we cannot make any faster",
   "outlast the person who buys it, and that is the part we cannot make any faster"],
  ["attraversa cinque momenti: il cartamodello", "attraversa cinque momenti. Il cartamodello"],
  ["passes through five moments: the pattern", "passes through five moments. The pattern"],
  ["La pelle si comporta come vuole: si tende", "La pelle si comporta come vuole. Si tende"],
  ["The leather behaves as it wants: it stretches", "The leather behaves as it wants. It stretches"],
  ["Non è una scelta di stile: la pelle si tiene appesa",
   "Non è una scelta di stile. La pelle si tiene appesa"],
  ["That is not styling: leather is kept hung", "That is not styling. Leather is kept hung"],
  ["Si muove come resina, lentamente: inevitabilmente diventi",
   "Si muove come resina, lentamente, e inevitabilmente diventi"],
  ["Colore: Nero.", "Colore nero."],
  ["Colore: Rosso.", "Colore rosso."],
];

/*
  IL TESTO ALTERNATIVO, dove il due punti separa il nome dalla descrizione. Una
  regola sola, applicata solo all'alt, e solo quando quello che precede i due
  punti è corto come un nome.
*/
const altFix = (s) =>
  typeof s === "string" ? s.replace(/^([^:.]{2,32}):\s+/, "$1, ") : s;

const rewrite = (s) => {
  if (typeof s !== "string") return s;
  let out = s;
  for (const [from, to] of REWRITES) out = out.split(from).join(to);
  return out;
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

/* I CAMPI NOSTRI, uno per uno. Tutto quello che non è qui non viene toccato. */
const OUR_FIELDS = [
  "aboutNotes", "processNotes", "processText", "processClosing", "aboutMaterial",
  "shippingReturns", "footerShipping", "footerOrigin", "aboutOpeningLine",
];
/* I media i cui alt sono nostri (lo sono tutti: `altIsDraft` è vero su 68). */
const MEDIA_FIELDS = [
  "openingMedia", "makingMedia", "processMedia", "cutoutMedia", "homeSequence",
  "aboutMedia", "designerPortrait", "aboutOpeningMedia", "contactMedia",
  "processPairMedia", "instagramFrames",
];

const settings = await client.fetch(/* groq */ `*[_id == "siteSettings"][0]`);
const next = {};
const changed = [];

const walk = (v, fixAlt) => {
  if (typeof v === "string") return fixAlt ? v : rewrite(v);
  if (Array.isArray(v)) return v.map((x) => walk(x, fixAlt));
  if (v && typeof v === "object") {
    const o = {};
    for (const [k, val] of Object.entries(v)) {
      o[k] = k === "alt" ? walkAlt(val) : walk(val, fixAlt);
    }
    return o;
  }
  return v;
};
const walkAlt = (v) => {
  if (typeof v === "string") return altFix(v);
  if (v && typeof v === "object") {
    const o = {};
    for (const [k, val] of Object.entries(v)) o[k] = k.startsWith("_") ? val : altFix(val);
    return o;
  }
  return v;
};

for (const field of [...OUR_FIELDS, ...MEDIA_FIELDS]) {
  if (settings[field] === undefined || settings[field] === null) continue;
  const after = walk(settings[field], false);
  if (JSON.stringify(after) !== JSON.stringify(settings[field])) {
    next[field] = after;
    changed.push(field);
  }
}

/* Le descrizioni ITALIANE dei capi sono nostre; le inglesi sono sue. */
const garments = await client.fetch(
  /* groq */ `*[_type == "garment"]{_id, name, "slug": slug.current, description, media, inventedFields}`,
);
const gPatches = [];
for (const g of garments) {
  const patch = {};
  const ours = (g.inventedFields ?? []).some((f) => f === "descriptionIt" || f === "description");
  if (ours) {
    const it = rewrite(g.description.it);
    if (it !== g.description.it) patch.description = {...g.description, it};
  }
  /*
    E GLI ALT DEI CAPI. Sono nostri come quelli delle impostazioni, e la prima
    versione di questo script se li era dimenticati: guardava solo i media di
    siteSettings, e su un capo restava un due punti che nessuno vedeva perche'
    l'alt non si vede.
  */
  if (Array.isArray(g.media)) {
    const media = g.media.map((m) => (m?.alt ? {...m, alt: walkAlt(m.alt)} : m));
    if (JSON.stringify(media) !== JSON.stringify(g.media)) patch.media = media;
  }
  if (Object.keys(patch).length) gPatches.push({g, patch});
}

console.log("\n  Campi delle impostazioni da riscrivere");
console.table(changed.map((f) => ({campo: f})));
console.log("  Capi da riscrivere (descrizione italiana e testo alternativo)");
console.table(gPatches.map((p) => ({capo: p.g.name ?? p.g.slug})));

if (!WRITE) {
  console.log("\n  PROVA. Rilancia con --write per salvarlo.\n");
} else {
  const tx = client.transaction();
  if (changed.length) tx.patch(settings._id, (p) => p.set(next));
  for (const {g, patch} of gPatches) tx.patch(g._id, (p) => p.set(patch));
  if (changed.length || gPatches.length) await tx.commit();

  const anon = createClient({
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.PUBLIC_SANITY_DATASET,
    apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
    useCdn: false,
    perspective: "published",
  });
  await new Promise((r) => setTimeout(r, 2000));
  const s2 = await anon.fetch(/* groq */ `*[_id == "siteSettings"][0]{${[...OUR_FIELDS, ...MEDIA_FIELDS].join(",")}}`);
  const left = JSON.stringify(s2).match(/[:—–]/g) ?? [];
  console.log(`\n  Salvato. Segni rimasti nei campi nostri delle impostazioni: ${left.length}\n`);
}
