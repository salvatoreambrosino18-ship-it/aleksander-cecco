/*
  IL FOGLIO DI BENVENUTO, IMPAGINATO COME IL SITO.

    npm run welcome-pdf              costruisce docs/BENVENUTO.pdf
    npm run welcome-pdf -- --html    lascia anche l'HTML, per guardarlo prima

  DA DOVE VIENE OGNI COSA, e nessuna è ridisegnata per l'occasione. La firma è
  `assets/logo/logo-signature.svg`, la stessa che sta in cima a ogni pagina del
  sito. I caratteri sono i due file in `public/fonts/`, gli stessi che il sito
  scarica. I colori sono i due di `src/styles/tokens.css` e non ce n'è un terzo.
  Le dimensioni del testo sono i valori fissi degli stessi token, presi al loro
  estremo da desktop perché una pagina stampata non ha un viewport.

  TUTTO DENTRO IL FILE. I due woff2 e la firma sono incorporati in base64, così
  il PDF è un oggetto solo che si può mandare per messaggio e che si aprirà
  identico fra due anni, anche se questa cartella non esiste più.

  LE FOTOGRAFIE DEL PANNELLO SONO OPZIONALI E VANNO MESSE A MANO. Servono per
  fargli riconoscere quello che sta guardando, e per farle bisogna entrare nel
  pannello, cosa che si fa con le sue credenziali. Se i file non ci sono, il
  documento si costruisce lo stesso e quelle sezioni semplicemente non ci sono:
  meglio un foglio senza figure che un foglio con quattro riquadri vuoti.

  Metti i file qui, con questi nomi, e rilancia:

    docs/benvenuto-shots/1-schermata-iniziale.png
    docs/benvenuto-shots/2-prezzo-e-taglie.png
    docs/benvenuto-shots/3-fotografie.png
    docs/benvenuto-shots/4-publish.png

  IL MARKDOWN LO CONVERTE QUESTO FILE, in venti righe, e non una libreria. Il
  documento è nostro e sappiamo esattamente cosa contiene: titoli, grassetti,
  paragrafi, righe orizzontali e link. Aggiungere una dipendenza per quello
  sarebbe aggiungere una dipendenza.
*/
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {chromium} from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KEEP_HTML = process.argv.includes("--html");

/*
  QUALE DOCUMENTO. Di default il foglio di benvenuto; `--doc=<nome>` ne
  impagina un altro dalla stessa cartella con la stessa veste.

  IL BRIEF LEGALE USA LA STESSA IMPAGINAZIONE, e non e' un vezzo. Chi lo legge
  scrive documenti che finiranno su questo sito, e un foglio che ha gia' l'aria
  del sito dice da solo di che cosa si sta parlando. Le tabelle sono l'unica
  cosa in piu' che serve, perche' il brief ne ha due.
*/
const arg = process.argv.find((a) => a.startsWith("--doc="));
const DOC = arg ? arg.slice(6) : "BENVENUTO";

const b64 = (p) => fs.readFileSync(path.join(ROOT, p)).toString("base64");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

/* ------------------------------------------------------- le fotografie */

/*
  LE DIDASCALIE DESCRIVONO QUELLO CHE SI VEDE NELLA FOTOGRAFIA, non quello che
  il nome del file promette. Guardando gli scatti veri, il secondo mostra le
  fotografie e il prezzo e il terzo mostra le taglie, quindi le prime
  didascalie erano sbagliate su entrambi.
*/
const SHOTS = [
  ["1-schermata-iniziale.png", "La schermata che vedi entrando"],
  ["2-prezzo-e-taglie.png", "Un capo aperto. Le fotografie in cima, il prezzo sotto"],
  ["3-fotografie.png", "Le taglie, subito sotto il prezzo"],
  ["4-publish.png", "Il pulsante Publish, in basso a destra"],
];
const shotsDir = path.join(ROOT, "docs/benvenuto-shots");
const shots =
  DOC === "BENVENUTO"
    ? SHOTS.filter(([file]) => fs.existsSync(path.join(shotsDir, file)))
    : [];

/* --------------------------------------------------------- il markdown */

const escapeHtml = (s) =>
  s.replace(/[&<>]/g, (c) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;"})[c]);

const inline = (s) =>
  escapeHtml(s)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>');

function toHtml(md) {
  const out = [];
  for (const block of md.split(/\n{2,}/)) {
    const t = block.trim();
    if (!t) continue;
    if (t === "---") {
      out.push('<hr>');
    } else if (/^\|.*\|$/m.test(t) && t.split("\n").length > 2) {
      /*
        UNA TABELLA. Il brief legale ne ha due e sono la parte che il legale
        legge per prima, quindi vanno impaginate e non appiattite. La seconda
        riga di una tabella markdown e' fatta di trattini e serve solo a
        separare l'intestazione: si salta.
      */
      const rows = t.split("\n").filter((r) => r.trim().startsWith("|"));
      const cells = (r) =>
        r.trim().replace(/^\||\|$/g, "").split("|").map((c) => inline(c.trim()));
      const head = cells(rows[0]);
      const body = rows.slice(2).map(cells);
      out.push(
        `<table><thead><tr>${head.map((c) => `<th>${c}</th>`).join("")}</tr></thead>` +
          `<tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`,
      );
    } else if (t.startsWith("### ")) {
      out.push(`<h3>${inline(t.slice(4))}</h3>`);
    } else if (t.startsWith("## ")) {
      out.push(`<h2>${inline(t.slice(3))}</h2>`);
    } else if (t.startsWith("# ")) {
      out.push(`<h1>${inline(t.slice(2))}</h1>`);
    } else {
      /*
        Un blocco può contenere più righe che vanno tenute separate: una riga
        in grassetto seguita dalla sua spiegazione è la forma di quasi tutto
        questo documento, e unirle in un paragrafo solo le appiattirebbe.

        MA IL GRASSETTO SI CONVERTE SUL BLOCCO INTERO, non riga per riga. La
        prima versione convertiva ogni riga da sola, e un `**` aperto su una
        riga e chiuso su quella dopo non trovava mai il suo compagno: nel PDF
        si leggeva «il **diritto di recesso**» con gli asterischi in mezzo alla
        frase sull'informativa privacy. Le interruzioni di riga si mettono
        DOPO, quando i segni sono già diventati tag.
      */
      const lines = t.split("\n").map((l) => l.trim());
      const leadsWithBold = lines[0].startsWith("**");
      const inner = inline(lines.join("\n")).replace(/\n/g, "<br>");
      out.push(`<p${leadsWithBold ? ' class="lead"' : ""}>${inner}</p>`);
    }
  }
  return out.join("\n");
}

/* ------------------------------------------------------------ la pagina */

const md = read(`docs/${DOC}.md`);
const signature = read("assets/logo/logo-signature.svg")
  .replace(/<\?xml[^>]*\?>/, "")
  .trim();

const shotsHtml = shots.length
  ? `<hr>
<h2>Come si presenta il pannello</h2>
${shots
  .map(
    ([file, caption]) => `<figure class="shot">
  <img src="data:image/png;base64,${b64(path.join("docs/benvenuto-shots", file))}" alt="">
  <figcaption>${escapeHtml(caption)}</figcaption>
</figure>`,
  )
  .join("\n")}`
  : "";

const html = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<title>${DOC} / Aleksander Cecco</title>
<style>
  @font-face {
    font-family: "Archivo";
    src: url(data:font/woff2;base64,${b64("public/fonts/archivo-latin-var.woff2")}) format("woff2");
    font-weight: 100 900;
    font-display: block;
  }
  @font-face {
    font-family: "JetBrains Mono";
    src: url(data:font/woff2;base64,${b64("public/fonts/jetbrains-mono-latin-var.woff2")}) format("woff2");
    font-weight: 100 800;
    font-display: block;
  }

  /* i due colori del sito, e non ce n'è un terzo */
  :root { --ink: #0a0a0a; --paper: #fafaf8; --hairline: rgba(10,10,10,0.2); }

  @page { size: A4; margin: 20mm 18mm 18mm; }

  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: var(--paper); color: var(--ink); }
  body {
    font-family: "Archivo", system-ui, sans-serif;
    font-variation-settings: "wght" 400;
    font-size: 10.5pt;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  /* LA FIRMA, la stessa dell'intestazione del sito, in inchiostro su carta. */
  .mark { width: 46mm; display: block; margin-bottom: 14mm; }
  .mark svg { width: 100%; height: auto; display: block; color: var(--ink); }

  /*
    I QUATTRO REGISTRI DEL SITO E NESSUN QUINTO. Display per il titolo, label
    per le intestazioni e le didascalie, body per la prosa, mono per gli
    indirizzi, che qui sono dati.
  */
  h1 {
    font-variation-settings: "wght" 300;
    font-size: 21pt;
    line-height: 1.2;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    margin: 0 0 6mm;
  }
  h2 {
    font-variation-settings: "wght" 500;
    font-size: 8.5pt;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 10mm 0 3mm;
    padding-top: 3mm;
    border-top: 1px solid var(--ink);
    break-after: avoid;
  }
  h3 {
    font-variation-settings: "wght" 500;
    font-size: 8.5pt;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 6mm 0 2mm;
    break-after: avoid;
  }
  p { margin: 0 0 3.5mm; max-width: 62em; break-inside: avoid; }
  /* una riga in grassetto che apre un blocco è un'etichetta, non un grido */
  p.lead strong:first-child { font-variation-settings: "wght" 500; }
  strong { font-variation-settings: "wght" 600; font-weight: normal; }
  a { color: var(--ink); text-decoration: none; border-bottom: 1px solid var(--hairline); }
  code {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 9pt;
    letter-spacing: 0.02em;
  }
  /*
    Gli indirizzi sono dati, quindi mono, come i prezzi sul sito. Si spezzano
    dove serve perché su carta non si può scorrere.
  */
  a[href^="http"] {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 9pt;
    word-break: break-all;
  }
  hr {
    border: 0;
    border-top: 1px solid var(--ink);
    margin: 9mm 0 0;
    /* la riga orizzontale del markdown è già data dal bordo di h2 */
    display: none;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0 0 5mm;
    font-size: 9pt;
    break-inside: avoid;
  }
  th {
    text-align: left;
    font-variation-settings: "wght" 500;
    font-size: 8pt;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-bottom: 1px solid var(--ink);
    padding: 0 4mm 1.5mm 0;
    vertical-align: bottom;
  }
  td {
    padding: 1.8mm 4mm 1.8mm 0;
    border-bottom: 1px solid var(--hairline);
    vertical-align: top;
  }
  td:first-child { width: 34%; }

  .shot { margin: 0 0 8mm; break-inside: avoid; }
  .shot img {
    width: 100%;
    display: block;
    border: 1px solid var(--hairline);
  }
  .shot figcaption {
    font-variation-settings: "wght" 500;
    font-size: 8pt;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding-top: 2mm;
  }

  footer {
    margin-top: 12mm;
    padding-top: 3mm;
    border-top: 1px solid var(--ink);
    font-variation-settings: "wght" 500;
    font-size: 8pt;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
</style>
</head>
<body>
  <div class="mark">${signature}</div>
  ${toHtml(md)}
  ${shotsHtml}
  <footer>Aleksander Cecco</footer>
</body>
</html>`;

const htmlPath = path.join(ROOT, `docs/${DOC}.html`);
fs.writeFileSync(htmlPath, html);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file://${htmlPath}`, {waitUntil: "networkidle"});
await page.evaluate(() => document.fonts.ready);
await page.pdf({
  path: path.join(ROOT, `docs/${DOC}.pdf`),
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
});
await browser.close();

if (!KEEP_HTML) fs.unlinkSync(htmlPath);

const size = fs.statSync(path.join(ROOT, `docs/${DOC}.pdf`)).size;
console.log(`\n  docs/${DOC}.pdf  ${(size / 1024).toFixed(0)} KB`);
if (shots.length) {
  console.log(`  con ${shots.length} fotografie del pannello\n`);
} else if (DOC === "BENVENUTO") {
  console.log(`  SENZA le fotografie del pannello. Mettile in docs/benvenuto-shots/ e rilancia.\n`);
} else {
  console.log("");
}
