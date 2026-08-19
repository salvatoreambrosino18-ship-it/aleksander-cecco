/*
  DA APPROVARE. Il documento che il titolare compila, non che legge.

    node scripts/approval-pdf.mjs              scrive docs/DA-APPROVARE.pdf
    node scripts/approval-pdf.mjs --html       tiene anche l'HTML, per guardarlo

  A COSA SERVE. Sul sito una cosa sua e una cosa nostra si leggono uguali. E'
  voluto: un marchio che mostra «{PREZZO}» sembra una prova generale, quindi
  quello che manca e' stato scritto in modo plausibile e segnato nel database
  invece che mostrato (sezione 59). Il prezzo di questa scelta e' che il
  titolare non puo' vedere la differenza guardando il sito, ed e' proprio la
  differenza che deve vedere.

  Questo foglio e' l'altra meta' di quel patto, per lui invece che per noi:
  ogni campo di ogni capo, con accanto chi lo ha scritto, e una riga bianca
  dove correggerlo.

  DUE SEGNI E NON TRE. «SUO» e' silenzioso, «NOSTRO» e' in nero pieno. La
  gerarchia e' quella giusta: quello che deve saltare all'occhio non e' cio'
  che va bene, e' cio' che aspetta una risposta.

  LE FOTOGRAFIE CI SONO PERCHE' RICONOSCA IL CAPO SENZA APRIRE NIENTE. Sono le
  stesse del sito, prese dal CDN di Sanity in bassa risoluzione: il foglio deve
  restare un allegato di posta, non un catalogo da stampare.

  L'ORDINE E' QUELLO DEL CATALOGO, `orderRank`, cosi' scorrere il foglio e
  scorrere il sito sono lo stesso movimento.

  DA DOVE VENGONO I DATI. Tutti dal dataset pubblicato, mai da una copia:
  `inventedFields` per ogni capo e `inventedCopy` per le frasi del sito sono le
  stesse liste che legge launch-check, quindi questo foglio e il cancello non
  possono dire due cose diverse.
*/
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";
import {chromium} from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const KEEP_HTML = process.argv.includes("--html");
const PROJECT = process.env.PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.PUBLIC_SANITY_DATASET;

const b64 = (p) => fs.readFileSync(path.join(ROOT, p)).toString("base64");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"})[c]);

/*
  L'URL DI UN'IMMAGINE DAL SUO RIFERIMENTO. `image-<hash>-<w>x<h>-<ext>` e' il
  formato dei riferimenti di Sanity e questa e' la sola cosa che serve saperne.
  `fm=jpg` e non `auto=format`: Chrome, stampando, reincapsula un webp come PNG
  senza perdite e il PDF passava da 17 MB. Un jpg resta un jpg. La larghezza e'
  quella che serve alla carta, non allo schermo: 46mm a 250dpi sono circa
  450px, e un pixel in piu' e' peso che nessuno vede.
*/
function imageUrl(asset, w) {
  const ref = asset?._ref ?? asset?.asset?._ref;
  if (!ref) return null;
  const [, id, dims, ext] = ref.split("-");
  return `https://cdn.sanity.io/images/${PROJECT}/${DATASET}/${id}-${dims}.${ext}?w=${w}&fit=max&fm=jpg&q=58`;
}

/* ------------------------------------------------------------- i dati */

const client = createClient({
  projectId: PROJECT,
  dataset: DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  useCdn: false,
  perspective: "published",
});

const garments = await client.fetch(/* groq */ `
  *[_type == "garment" && defined(slug.current)] | order(orderRank asc){
    name, "slug": slug.current, price, currency, sizes, availability, wornBy,
    inventedFields, description, materials,
    "cover": media[0].poster,
    "details": media[needsCaption == true]{poster, "alt": alt.it},
    "provisional": media[isProvisional == true]{poster, "alt": alt.it}
  }`);

const settings = await client.fetch(/* groq */ `*[_id == "siteSettings"][0]`);
const flagged = settings?.inventedCopy ?? [];

/*
  LE FRASI NOSTRE VIVONO IN DUE POSTI e questo foglio deve mostrarle tutte e
  due senza che lui debba sapere quale sia quale. Alcune stanno in Sanity
  (`shopIntro`, `aboutOrigin`, ...) perche' le puo' gia' riscrivere; altre
  stanno in `src/i18n/ui.ts` e sul sito compaiono solo se la casella in Sanity
  e' vuota. Il testo che conta e' quello che il sito DICE, quindi si guarda
  prima Sanity e poi il nostro file.
*/
const uiDefaults = (() => {
  const src = read("src/i18n/ui.ts");
  const italian = src.slice(src.indexOf("  it: {"), src.indexOf("  en: {"));
  const out = {};
  for (const m of italian.matchAll(/^\s{4}([a-zA-Z]+):\s*$/gm)) out[m[1]] = null;
  for (const m of italian.matchAll(/^\s{4}([a-zA-Z]+):\s*"((?:[^"\\]|\\.)*)",?\s*$/gm))
    out[m[1]] = m[2].replace(/\\"/g, '"');
  /* Le stringhe spezzate su piu' righe, che il regex sopra non prende. */
  for (const m of italian.matchAll(/^\s{4}([a-zA-Z]+):\s*\n\s+"((?:[^"\\]|\\.)*)",?\s*$/gm))
    out[m[1]] = m[2].replace(/\\"/g, '"');
  return out;
})();

/*
  I NOMI DELLE CASELLE, IN ITALIANO, PRESI DAL PANNELLO. Lo studio ha gia' una
  lista di etichette umane per queste chiavi (`inventedCopy`, options.list), ed
  e' quella che il titolare vede quando spunta una casella. Stampare
  `footerShipping` su un foglio per lui sarebbe fargli tradurre due volte.
*/
const copyLabels = (() => {
  const src = read("studio/schemaTypes/documents/siteSettings.ts");
  const out = {};
  for (const m of src.matchAll(/title:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")\s*,\s*\n?\s*value:\s*'([a-zA-Z]+)'/g))
    out[m[3]] = (m[1] ?? m[2]).replace(/\\'/g, "'").split(" / ")[0];
  /*
    Queste quattro sono segnate in `inventedCopy` ma non compaiono nella lista
    a spunte del pannello, quindi non hanno un'etichetta da cui copiare. Sono i
    blocchi di testo piu' lunghi del sito e sono anche i piu' facili da
    riconoscere leggendoli, ma un titolare che scorre un foglio deve sapere DI
    QUALE PAGINA si parla prima di leggere il paragrafo, non dopo.
  */
  return {
    aboutNotes: "Le righe di Chi siamo",
    processNotes: "Le righe di Processo",
    processClosing: "La chiusura di Processo",
    aboutMaterial: "La sezione sulla pelle, in Chi siamo",
    ...out,
  };
})();

/*
  ALCUNE CHIAVI NON SONO IL NOME DI UN CAMPO ma il nome di una DECISIONE che
  copre piu' campi. `contactCopy` e' la spunta per due frasi che stanno in
  ui.ts, `contactWhere` e `contactBuy`, e cercare `settings.contactCopy` non
  trova niente perche' quel campo non esiste. Senza questa mappa il foglio le
  dava per morte e non gliele mostrava affatto.
*/
const GROUPED = {contactCopy: ["contactWhere", "contactBuy"]};

/** Il testo italiano di una chiave, da qualunque delle due sorgenti venga. */
function copyValue(key) {
  if (GROUPED[key]) {
    const parts = GROUPED[key].map((k) => uiDefaults[k]).filter(Boolean);
    if (parts.length) return parts.join("\n");
  }
  const v = settings?.[key];
  if (typeof v === "string" && v.trim()) return v;
  if (v && typeof v === "object" && !Array.isArray(v)) {
    if (typeof v.it === "string" && v.it.trim()) return v.it;
    /* enquiryCopy e simili: un oggetto di sotto-campi. */
    const parts = Object.values(v)
      .filter((x) => x && typeof x === "object" && typeof x.it === "string" && x.it.trim())
      .map((x) => x.it);
    if (parts.length) return parts.join("\n");
  }
  if (Array.isArray(v) && v.length) {
    const parts = v
      .map((item) => item?.text?.it ?? item?.it ?? item?.caption?.it ?? null)
      .filter(Boolean);
    if (parts.length) return parts.join("\n");
    return `(${v.length} elementi impostati nel pannello)`;
  }
  if (key === "enquiryCopy") {
    /*
      QUESTA STA IN UN FILE SUO, `src/i18n/enquiry.ts`, e non in ui.ts. Senza
      questo ramo il foglio la dava per «vuota», che e' l'unico errore che un
      documento del genere non puo' permettersi: dire al titolare che non c'e'
      niente dove il sito invece parla.
    */
    const src = read("src/i18n/enquiry.ts");
    const it = src.slice(src.indexOf("it: {"), src.indexOf("en: {"));
    const parts = [...it.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]).filter((x) => x.length > 15);
    if (parts.length) return parts.join("\n");
  }
  return uiDefaults[key] ?? null;
}

/* ------------------------------------------------------- i pezzetti HTML */

const OURS = `<span class="tag ours">NOSTRO</span>`;
const HIS = `<span class="tag his">suo</span>`;
const tag = (isOurs) => (isOurs ? OURS : HIS);

/*
  UNA RIGA: ETICHETTA, VALORE, DI CHI E', E LO SPAZIO PER RISPONDERE.

  UN CAMPO VUOTO DICE SEMPRE «MANCA», anche quando e' segnato come nostro.
  Prima diceva NOSTRO, perche' tecnicamente la casella e' responsabilita'
  nostra, ed era la risposta giusta alla domanda sbagliata: al titolare non
  serve sapere di chi e' la colpa di una casella vuota, gli serve sapere che
  sulla pagina non c'e' niente. «MANCA» e' l'azione, «NOSTRO» e' l'archivio.
*/
function field(label, value, isOurs, {missing = null} = {}) {
  const empty = value === null || value === undefined || String(value).trim() === "";
  const shown = empty
    ? `<span class="missing">${esc(missing ?? "manca")}</span>`
    : esc(value).replace(/\n/g, "<br>");
  return `<tr class="${isOurs || empty ? "wants" : ""}">
    <th>${esc(label)}</th>
    <td class="val">${shown}</td>
    <td class="who">${empty ? `<span class="tag ours">MANCA</span>` : tag(isOurs)}</td>
  </tr>
  ${
    isOurs || empty
      ? `<tr class="answer"><th></th><td colspan="2"><span class="rule"></span></td></tr>`
      : ""
  }`;
}

const AVAIL = {
  readyNow: "Disponibile subito",
  unique: "Pezzo unico",
  sold: "Venduto",
  notOffered: "Non in vendita sul sito",
  privateOrder: "Su richiesta",
};

function piece(g, i) {
  const ours = new Set(g.inventedFields ?? []);
  const cover = imageUrl(g.cover, 460);

  /*
    LA DESCRIZIONE E' LA RIGA PIU' DELICATA DEL FOGLIO. Su nove capi su
    quindici l'italiano NON C'E' e la pagina italiana non mostra niente,
    perche' `pick` non ripiega sull'inglese (locales.ts). Quindi qui non basta
    dire di chi e': va detto che sul sito, in italiano, quel capo non ha
    descrizione, e va mostrato l'inglese perche' lui possa tradurlo o
    riscriverlo invece di ripartire da zero.
  */
  const descIt = g.description?.it ?? null;
  const descEn = g.description?.en ?? null;
  const descOurs = descIt ? ours.has("descriptionIt") : true;

  const rows = [
    field("Nome", g.name, ours.has("name")),
    field("Prezzo", g.price ? `${g.price} ${g.currency ?? "EUR"}` : null, ours.has("price"), {
      missing: "nessun prezzo, e il capo si può comprare",
    }),
    field("Taglie", (g.sizes ?? []).join("  ") || null, ours.has("sizes"), {
      missing: "nessuna taglia scelta",
    }),
    field("Disponibilità", AVAIL[g.availability] ?? AVAIL.readyNow, false),
    field("Composizione", g.materials?.it ?? null, ours.has("materials")),
    field("Descrizione in italiano", descIt, descOurs, {
      missing: "in italiano non c'è, e sul sito italiano non compare niente",
    }),
  ];

  if (!descIt && descEn) {
    rows.push(`<tr class="hint"><th></th><td colspan="2">
      <span class="lbl">In inglese il sito dice</span><br>${esc(descEn)}</td></tr>`);
  }
  if (g.wornBy) {
    rows.push(
      field(
        "Indossato da",
        {men: "Uomo", women: "Donna", everyone: "Tutti"}[g.wornBy] ?? g.wornBy,
        ours.has("wornBy"),
      ),
    );
  }

  const details = (g.details ?? []).map(
    (d, n) => `<div class="detail">
      ${d.poster ? `<img src="${imageUrl(d.poster, 250)}" alt="">` : ""}
      <div class="detail-ask">
        <span class="lbl">Dettaglio ${n + 1}, la riga sotto la foto</span>
        <span class="rule"></span>
        <span class="rule"></span>
      </div>
    </div>`,
  );

  return `<section class="piece">
    <div class="piece-head">
      <span class="num">${String(i + 1).padStart(2, "0")}</span>
      <h2>${esc(g.name ?? g.slug)}</h2>
      <span class="slug">${esc(g.slug)}</span>
    </div>
    <div class="piece-body">
      <div class="shot">${cover ? `<img src="${cover}" alt="">` : `<div class="noshot">nessuna fotografia</div>`}</div>
      <table class="fields">${rows.join("")}</table>
    </div>
    ${
      g.provisional?.length
        ? `<div class="warn"><strong>La fotografia è provvisoria.</strong> È un ritaglio preso da un'altra
           immagine, messo lì per non lasciare la pagina vuota. Serve una fotografia vera di questo capo.</div>`
        : ""
    }
    ${
      details.length
        ? `<div class="details"><span class="lbl">Le fotografie di dettaglio aspettano una tua riga</span>
           ${details.join("")}</div>`
        : ""
    }
  </section>`;
}

/* ------------------------------------------------ quello che resta in fondo */

const noItalianDesc = garments.filter((g) => !g.description?.it);
const oneSizeOurs = garments.filter((g) => (g.inventedFields ?? []).includes("sizes"));
const noPrice = garments.filter(
  (g) => !g.price && !["notOffered", "privateOrder"].includes(g.availability ?? "readyNow"),
);
const provisional = garments.filter((g) => g.provisional?.length);
const captionCount = garments.reduce((n, g) => n + (g.details?.length ?? 0), 0);

/*
  QUATTRO DELLE DICIOTTO CHIAVI SEGNATE NON SONO FRASI (2026-08-19). Non hanno
  un valore in Sanity e nessuna pagina le stampa: `shippingCustoms` non esiste
  nemmeno nello schema, `aboutMadeToMeasure` e' rimasta dalla su misura tolta
  dalla sezione 130, `aboutOrigin` e `dropsIntro` hanno una casella nel
  pannello che nessuna pagina legge.

  NON SI POSSONO METTERE NELLA SUA LISTA. Gli chiederebbero di approvare frasi
  che non esistono, e la prima riga di questo foglio dice che ogni riga e' una
  cosa che il sito dice davvero. La regola per distinguerle e' un fatto, non un
  elenco di nomi scritto a mano: se non c'e' un valore in Sanity E non c'e' un
  testo nostro da nessuna parte, il sito non dice niente e non c'e' niente da
  approvare. Restano segnate nel database, e vanno tolte da `inventedCopy` con
  una patch, non da qui.
*/
const live = flagged.filter((key) => copyValue(key));
/*
  Una chiave senza testo puo' essere ancora una DECISIONE vera: quale
  fotografia sta nei Contatti, quali fotografie di Instagram, se approvare la
  frase piu' corta di Chi siamo. Non ha una riga da riscrivere, ha una scelta
  da confermare, e si riconosce dal fatto che il pannello le da' un nome.
*/
const choices = flagged.filter((key) => !copyValue(key) && copyLabels[key]);
const dead = flagged.filter((key) => !copyValue(key) && !copyLabels[key]);

const copyRows = live
  .map((key) => {
    const value = copyValue(key);
    return `<tr class="wants">
      <th>${esc(copyLabels[key] ?? key)}</th>
      <td class="val">${esc(value).replace(/\n/g, "<br>")}</td>
      <td class="who">${OURS}</td>
    </tr>
    <tr class="answer"><th></th><td colspan="2"><span class="rule"></span></td></tr>`;
  })
  .join("");

const closing = `
<section class="closing">
  <h2 class="big">Quello che resta</h2>
  <p>Questa è la stessa lista che tiene chiuso il negozio. Ogni riga qui sotto è
  una cosa che abbiamo scritto noi o che manca, e nessuna si vede guardando il sito.</p>

  <h3>Le didascalie dei dettagli, ${captionCount}</h3>
  <p>Stanno già accanto alle fotografie qui sopra, capo per capo. Sono ${captionCount}
  fotografie ravvicinate senza una riga sotto. La foto è nostra, la frase è tua.</p>

  <h3>Le descrizioni che in italiano non ci sono, ${noItalianDesc.length}</h3>
  <p>Su questi capi la pagina italiana non mostra nessuna descrizione. Non è una
  frase da approvare, è una frase che non esiste. L'inglese c'è ed è riportato
  accanto a ogni capo, così puoi tradurlo o scriverne uno tuo.</p>
  <p class="names">${noItalianDesc.map((g) => esc(g.name ?? g.slug)).join(" &nbsp;·&nbsp; ")}</p>

  <h3>Le taglie decise da noi, ${oneSizeOurs.length}</h3>
  <p>Su questi abbiamo scritto taglia unica guardando la fotografia, senza averli in mano.
  Se sbagliamo, correggi.</p>
  <p class="names">${oneSizeOurs.map((g) => esc(g.name ?? g.slug)).join(" &nbsp;·&nbsp; ")}</p>

  ${
    noPrice.length
      ? `<h3>Il prezzo che manca, ${noPrice.length}</h3>
         <p>Questo capo si può mettere nel carrello e non ha nessun prezzo. Le condizioni
         di vendita pubblicate sul sito dicono che ogni pagina prodotto indica il prezzo,
         quindi finché manca il sito promette una cosa che non fa.</p>
         <p class="names">${noPrice.map((g) => esc(g.name ?? g.slug)).join(" &nbsp;·&nbsp; ")}</p>`
      : ""
  }

  ${
    provisional.length
      ? `<h3>La fotografia provvisoria, ${provisional.length}</h3>
         <p>Un capo ha come unica immagine un ritaglio preso da un'altra fotografia.
         Regge la pagina e non è una vera fotografia di quel capo.</p>
         <p class="names">${provisional.map((g) => esc(g.name ?? g.slug)).join(" &nbsp;·&nbsp; ")}</p>`
      : ""
  }

  <h3>Le frasi del sito, ${live.length}</h3>
  <p>Le abbiamo scritte noi, sono online adesso, e le puoi cambiare tutte dal pannello,
  dentro <strong>Le parole del sito</strong>. Il nome a sinistra è quello della casella.</p>
  <table class="fields copy">${copyRows}</table>
  ${
    choices.length
      ? `<h3>Le scelte che abbiamo fatto al posto tuo, ${choices.length}</h3>
         <p>Queste non sono frasi da riscrivere. Sono decisioni che il sito ha preso da solo
         perché nessuno gliene aveva data una, e restano segnate come nostre finché non le
         confermi. Si cambiano dal pannello, nella stessa schermata delle parole.</p>
         <table class="fields copy">${choices
           .map(
             (key) => `<tr class="wants"><th>${esc(copyLabels[key])}</th>
               <td class="val"><span class="missing">scelta da noi</span></td>
               <td class="who">${OURS}</td></tr>
               <tr class="answer"><th></th><td colspan="2"><span class="rule"></span></td></tr>`,
           )
           .join("")}</table>`
      : ""
  }
  ${
    dead.length
      ? `<p style="margin-top:4mm">Ce ne sono altre ${dead.length} segnate nel database che il sito
         non usa più. Le togliamo noi, non serve che tu faccia niente.</p>`
      : ""
  }
</section>`;

/* ------------------------------------------------------------ il foglio */

const signature = read("assets/logo/logo-signature.svg")
  .replace(/<\?xml[^>]*\?>/, "")
  .replace(/fill="[^"]*"/g, 'fill="currentColor"');

const html = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<title>Da approvare / Aleksander Cecco</title>
<style>
  @font-face {
    font-family: "Archivo";
    src: url(data:font/woff2;base64,${b64("public/fonts/archivo-latin-var.woff2")}) format("woff2");
    font-weight: 100 900; font-display: block;
  }
  @font-face {
    font-family: "JetBrains Mono";
    src: url(data:font/woff2;base64,${b64("public/fonts/jetbrains-mono-latin-var.woff2")}) format("woff2");
    font-weight: 100 800; font-display: block;
  }

  :root { --ink:#0a0a0a; --paper:#fafaf8; --hairline:rgba(10,10,10,.2); }
  @page { size: A4; margin: 16mm 14mm 14mm; }
  * { box-sizing: border-box; }
  html, body { margin:0; padding:0; background:var(--paper); color:var(--ink); }
  body {
    font-family:"Archivo", system-ui, sans-serif; font-variation-settings:"wght" 400;
    font-size:10pt; line-height:1.5; -webkit-font-smoothing:antialiased;
  }

  .mark { width:44mm; display:block; margin-bottom:10mm; }
  .mark svg { width:100%; height:auto; display:block; color:var(--ink); }

  h1 { font-variation-settings:"wght" 300; font-size:22pt; line-height:1.15;
       letter-spacing:.02em; text-transform:uppercase; margin:0 0 5mm; }
  .lede { font-size:11pt; max-width:44em; margin:0 0 4mm; }
  .lbl { font-variation-settings:"wght" 500; font-size:7.5pt; letter-spacing:.08em;
         text-transform:uppercase; }

  /* I DUE SEGNI. Nostro grida, suo no: la gerarchia segue chi deve rispondere. */
  .tag { font-variation-settings:"wght" 500; font-size:7pt; letter-spacing:.09em;
         text-transform:uppercase; white-space:nowrap; padding:.6mm 1.6mm; display:inline-block; }
  .tag.ours { background:var(--ink); color:var(--paper); }
  .tag.his  { color:var(--ink); opacity:.45; }

  .legend { border:1px solid var(--ink); padding:5mm; margin:6mm 0 0; max-width:44em; }
  .legend p { margin:0 0 2.5mm; }
  .legend p:last-child { margin:0; }

  /* UNA PAGINA PER CAPO: cosi' si puo' staccare, annotare e rimandare indietro. */
  .piece { break-before:page; break-inside:avoid; }
  .piece-head { display:flex; align-items:baseline; gap:3mm; border-bottom:1px solid var(--ink);
                padding-bottom:2mm; margin-bottom:4mm; }
  .piece-head .num { font-family:"JetBrains Mono", monospace; font-size:9pt; opacity:.5; }
  .piece-head h2 { font-variation-settings:"wght" 400; font-size:15pt; letter-spacing:.02em;
                   text-transform:uppercase; margin:0; flex:1; }
  .piece-head .slug { font-family:"JetBrains Mono", monospace; font-size:8pt; opacity:.5; }

  .piece-body { display:flex; gap:6mm; align-items:flex-start; }
  .shot { width:52mm; flex:none; }
  .shot img { width:100%; height:auto; display:block; }
  .noshot { border:1px solid var(--hairline); padding:8mm 3mm; text-align:center;
            font-size:8pt; opacity:.5; }

  table.fields { border-collapse:collapse; width:100%; }
  table.fields th { text-align:left; vertical-align:top; width:34mm; padding:1.6mm 3mm 1.6mm 0;
    font-variation-settings:"wght" 500; font-size:7.5pt; letter-spacing:.07em;
    text-transform:uppercase; }
  table.fields td { vertical-align:top; padding:1.6mm 0; }
  table.fields td.val { font-size:9.5pt; }
  table.fields td.who { width:20mm; text-align:right; white-space:nowrap; }
  table.fields tr.wants td.val { font-variation-settings:"wght" 500; }
  table.fields tr.hint td { font-size:8.5pt; opacity:.62; padding-top:0; }
  table.fields tr.answer td { padding:0 0 2.5mm; }
  table.fields tr + tr th, table.fields tr + tr td { border-top:1px solid var(--hairline); }
  table.fields tr.answer th, table.fields tr.answer td,
  table.fields tr.hint th, table.fields tr.hint td { border-top:0; }

  /* LA RIGA BIANCA. E' il motivo per cui questo e' un modulo e non un rapporto. */
  .rule { display:block; border-bottom:1px solid var(--hairline); height:5.5mm; }

  .missing { font-variation-settings:"wght" 500; }

  .warn { border-top:1px solid var(--ink); margin-top:4mm; padding-top:2.5mm; font-size:9pt; }

  .details { margin-top:5mm; border-top:1px solid var(--ink); padding-top:3mm; }
  .detail { display:flex; gap:4mm; align-items:flex-start; margin-top:3mm; break-inside:avoid; }
  .detail img { width:30mm; height:auto; display:block; flex:none; }
  .detail-ask { flex:1; }
  .detail-ask .rule { margin-top:2.5mm; }

  .closing { break-before:page; }
  .closing h2.big { font-variation-settings:"wght" 300; font-size:18pt; letter-spacing:.02em;
    text-transform:uppercase; margin:0 0 4mm; border:0; padding:0; }
  .closing h3 { font-variation-settings:"wght" 500; font-size:8.5pt; letter-spacing:.08em;
    text-transform:uppercase; margin:7mm 0 2mm; padding-top:2.5mm;
    border-top:1px solid var(--ink); break-after:avoid; }
  .closing p { margin:0 0 2.5mm; max-width:46em; }
  .names { font-family:"JetBrains Mono", monospace; font-size:8.5pt; }
  table.copy th { font-family:"JetBrains Mono", monospace; text-transform:none;
                  letter-spacing:0; font-size:8pt; width:34mm; }
</style>
</head>
<body>
  <div class="mark">${signature}</div>

  <h1>Da approvare</h1>
  <p class="lede">Questo foglio è il tuo sito messo in fila, un capo per pagina, con
  accanto a ogni riga chi l'ha scritta. Non c'è niente da leggere fino in fondo. Si
  scorre, e dove trovi <span class="tag ours">NOSTRO</span> scrivi la cosa giusta sulla
  riga bianca sotto.</p>

  <div class="legend">
    <p><span class="tag his">suo</span> &nbsp; L'hai scritta tu, o è un fatto tuo. Non serve
    farci niente.</p>
    <p><span class="tag ours">NOSTRO</span> &nbsp; L'abbiamo scritta noi per costruire la
    pagina. È online adesso e sembra vera come le altre. Aspetta te.</p>
    <p><span class="tag ours">MANCA</span> &nbsp; Non c'è niente, e la pagina lo mostra
    vuoto o non lo mostra affatto.</p>
  </div>

  <p class="lede" style="margin-top:6mm">Il sito non fa vedere questa differenza a chi
  visita, ed è voluto. Un negozio pieno di caselle vuote sembra una prova generale. Il
  prezzo di quella scelta è che neanche tu la vedi, e questo foglio esiste per quello.</p>

  <p class="lede">${garments.length} Creature, nell'ordine in cui stanno nel catalogo.</p>

  ${garments.map(piece).join("")}
  ${closing}
</body>
</html>`;

const htmlPath = path.join(ROOT, "docs/DA-APPROVARE.html");
const pdfPath = path.join(ROOT, "docs/DA-APPROVARE.pdf");
fs.writeFileSync(htmlPath, html);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file://${htmlPath}`, {waitUntil: "networkidle"});
await page.evaluate(() => document.fonts.ready);
/* Le fotografie vengono dal CDN: se una non arriva, meglio saperlo adesso. */
const broken = await page.evaluate(() =>
  [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).length,
);
await page.pdf({path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true});
await browser.close();

if (!KEEP_HTML) fs.unlinkSync(htmlPath);

const kb = (fs.statSync(pdfPath).size / 1024).toFixed(0);
console.log(`\n  docs/DA-APPROVARE.pdf  ${kb} KB`);
console.log(`  ${garments.length} capi, ${captionCount} didascalie, ${live.length} frasi del sito + ${choices.length} scelte (${dead.length} morte: ${dead.join(", ") || "nessuna"})`);
console.log(`  senza descrizione italiana: ${noItalianDesc.length}   senza prezzo: ${noPrice.length}`);
if (broken > 0) {
  console.error(`\n  ATTENZIONE: ${broken} fotografie non sono arrivate dal CDN.\n`);
  process.exit(1);
}
console.log("  tutte le fotografie sono arrivate\n");
