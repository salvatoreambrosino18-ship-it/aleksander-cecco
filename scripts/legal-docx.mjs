/*
  LA RICHIESTA ALL'AVVOCATO, IN WORD.

    npm run legal-docx        costruisce docs/RICHIESTA-LEGALE-PAGAMENTI.docx

  PERCHE' WORD E NON PDF, che è la stessa ragione del foglio di benvenuto: va
  mandata come allegato a una persona che deve ANNOTARLA. Un PDF si legge; un
  .docx si apre, si commenta a margine e torna indietro con dentro le risposte.
  Metà di questo documento è fatta per essere emendata, non letta.

  DA DOVE VIENE IL TESTO. Da docs/RICHIESTA-LEGALE-PAGAMENTI.md e da nessun'altra
  parte, così l'allegato che gli arriva e il file che sta nel repository non
  possono raccontare due storie diverse.

  LE CITAZIONI DEVONO SEMBRARE CITAZIONI, ed è l'unica cosa in questo file che
  vale la pena di guardare. Quattro quinti delle righe citate qui dentro sono
  clausole scritte da lui, riportate alla lettera perché possa emendare invece di
  cercare. Se arrivassero come testo normale, in un documento dove tutto il resto
  è nostro, la prima cosa che dovrebbe fare aprendo il file sarebbe capire quali
  parole sono già sue. Quindi hanno un rientro, un filetto a sinistra e un
  carattere leggermente più piccolo: si vede a colpo d'occhio dove finisce quello
  che chiediamo e comincia quello che ha già scritto.
*/
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {para, runs, style, writeDocx} from "./lib/docx.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "docs/RICHIESTA-LEGALE-PAGAMENTI.md");
const OUT = path.join(ROOT, "docs/RICHIESTA-LEGALE-PAGAMENTI.docx");

/* ------------------------------------------------------------ il markdown */

const body = [];
let buffer = [];
/** null | "p" | "quote" | "bullet" */
let kind = null;

const STYLE_OF = {p: null, quote: "Quote", bullet: "Bullet"};

const flush = () => {
  if (!buffer.length) {
    kind = null;
    return;
  }
  const text = buffer.join(" ");
  /* Il corsivo della citazione va su OGNI pezzo, comprese le parole in
     grassetto: una clausola citata resta citata anche dove è enfatizzata. */
  const extra = kind === "quote" ? "<w:i/>" : "";
  body.push(para(STYLE_OF[kind] ?? null, runs(text, extra)));
  buffer = [];
  kind = null;
};

const start = (next, text) => {
  if (kind !== next) flush();
  kind = next;
  buffer.push(text);
};

for (const raw of fs.readFileSync(SRC, "utf8").split("\n")) {
  const line = raw.trimEnd();

  if (line === "") {
    flush();
  } else if (line === "---") {
    /* Un filetto vero fra un articolo e il successivo: in un documento che si
       legge saltando da una clausola all'altra, lo stacco è la navigazione. */
    flush();
    body.push(para("Rule", ""));
  } else if (line.startsWith("### ")) {
    flush();
    body.push(para("Heading3", runs(line.slice(4))));
  } else if (line.startsWith("## ")) {
    flush();
    body.push(para("Heading2", runs(line.slice(3))));
  } else if (line.startsWith("# ")) {
    flush();
    body.push(para("Title", runs(line.slice(2))));
  } else if (line === ">") {
    /* Riga vuota DENTRO una citazione: l'art. 7 ha due commi e devono restare
       due paragrafi, o si leggono come uno solo. */
    const was = kind;
    flush();
    kind = was;
  } else if (line.startsWith("> ")) {
    start("quote", line.slice(2));
  } else if (/^[-*] /.test(line)) {
    flush();
    kind = "bullet";
    buffer.push(`•  ${line.slice(2)}`);
  } else if (/^\d+\. /.test(line)) {
    flush();
    kind = "bullet";
    buffer.push(line.replace(/^(\d+)\. /, "$1.  "));
  } else if (/^\s+\S/.test(raw) && (kind === "bullet" || kind === "quote")) {
    /* Continuazione rientrata di un punto elenco o di una citazione. */
    buffer.push(line.trim());
  } else {
    start("p", line);
  }
}
flush();

/* -------------------------------------------------------------- gli stili */

const QUOTE_BORDER =
  '<w:pBdr><w:left w:val="single" w:sz="12" w:space="12" w:color="9A9A9A"/></w:pBdr>' +
  '<w:ind w:left="454"/>';

const styles = [
  style("Title", "Title", 40, true, 0, 240),
  style("Heading2", "heading 2", 30, true, 400, 160),
  style("Heading3", "heading 3", 25, true, 300, 120),
  style("Quote", "Quote", 21, false, 120, 160, "3A3A3A", QUOTE_BORDER),
  style("Bullet", "List Paragraph", 22, false, 40, 80, null, '<w:ind w:left="340" w:hanging="340"/>'),
  style(
    "Rule",
    "Rule",
    12,
    false,
    120,
    240,
    null,
    '<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="4" w:color="C8C8C8"/></w:pBdr>',
  ),
];

const size = writeDocx({out: OUT, body, styles, root: ROOT});

const quotes = body.filter((b) => b.includes('w:val="Quote"')).length;
console.log(
  `\n  docs/RICHIESTA-LEGALE-PAGAMENTI.docx  ${Math.round(size / 1024)} KB` +
    `  ${body.length} blocchi, ${quotes} clausole citate\n`,
);
