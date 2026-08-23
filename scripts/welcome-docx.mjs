/*
  IL FOGLIO DI BENVENUTO, IN WORD.

    npm run welcome-docx        costruisce docs/BENVENUTO.docx

  PERCHE' NON UN PDF. Il PDF si legge e basta. Lui questo foglio lo vuole
  annotare, e un file Word si apre, si commenta e si rimanda indietro. Il PDF
  resta dov'e' per chi lo vuole stampare; `scripts/welcome-pdf.mjs` non e' stato
  toccato.

  PERCHE' A MANO E NON CON UNO STRUMENTO. Su questa macchina non c'e' ne'
  pandoc ne' libreoffice, e `textutil` di macOS converte l'HTML in .docx ma
  BUTTA VIA LE IMMAGINI: il file esce di tre chili e senza `word/media`. Le
  quattro schermate del pannello sono meta' del valore di questo foglio, quindi
  il .docx si scrive qui, che e' un archivio zip con dentro dell'XML e i PNG.

  DA DOVE VIENE IL TESTO. Da `docs/BENVENUTO.md` e da nessun'altra parte, cosi'
  il foglio e il documento non possono raccontare due storie diverse. Il
  markdown che serve e' poco: titoli, grassetto, paragrafi, righe di codice.

  LE SCHERMATE SONO OPZIONALI. Se i file non ci sono il documento si costruisce
  lo stesso e quelle pagine non ci sono. Meglio un foglio senza figure che un
  foglio con quattro riquadri vuoti.
*/
import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "docs/BENVENUTO.md");
const OUT = path.join(ROOT, "docs/BENVENUTO.docx");
const SHOTS_DIR = path.join(ROOT, "docs/benvenuto-shots");

const SHOTS = [
  ["1-schermata-iniziale.png", "La schermata che vedi entrando"],
  ["2-prezzo-e-taglie.png", "Un capo aperto. Le fotografie in cima, il prezzo sotto"],
  ["3-fotografie.png", "Le taglie, subito sotto il prezzo"],
  ["4-publish.png", "Il pulsante Publish, in basso a destra"],
];

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Grassetto e `codice` dentro una riga, il resto e' testo. */
function runs(text) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push([text.slice(last, m.index), {}]);
    const token = m[0];
    if (token.startsWith("**")) out.push([token.slice(2, -2), {b: true}]);
    else out.push([token.slice(1, -1), {mono: true}]);
    last = m.index + token.length;
  }
  if (last < text.length) out.push([text.slice(last), {}]);
  return out
    .filter(([t]) => t !== "")
    .map(([t, o]) => {
      const props =
        (o.b ? "<w:b/>" : "") + (o.mono ? '<w:rFonts w:ascii="Menlo" w:hAnsi="Menlo"/><w:sz w:val="19"/>' : "");
      return `<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ""}<w:t xml:space="preserve">${esc(t)}</w:t></w:r>`;
    })
    .join("");
}

const para = (style, inner) =>
  `<w:p>${style ? `<w:pPr><w:pStyle w:val="${style}"/></w:pPr>` : ""}${inner}</w:p>`;

/* ------------------------------------------------------------ il markdown */

const lines = fs.readFileSync(SRC, "utf8").split("\n");
const body = [];
let buffer = [];

const flush = () => {
  if (!buffer.length) return;
  body.push(para(null, runs(buffer.join(" "))));
  buffer = [];
};

for (const line of lines) {
  const t = line.trimEnd();
  if (t === "") {
    flush();
  } else if (t === "---") {
    flush();
    body.push(para(null, ""));
  } else if (t.startsWith("### ")) {
    flush();
    body.push(para("Heading3", runs(t.slice(4))));
  } else if (t.startsWith("## ")) {
    flush();
    body.push(para("Heading2", runs(t.slice(3))));
  } else if (t.startsWith("# ")) {
    flush();
    body.push(para("Title", runs(t.slice(2))));
  } else {
    buffer.push(t);
  }
}
flush();

/* ---------------------------------------------------------- le schermate */

const present = SHOTS.filter(([f]) => fs.existsSync(path.join(SHOTS_DIR, f)));
const media = [];
if (present.length) {
  body.push(para("Heading2", runs("Il pannello, in quattro schermate")));
  present.forEach(([file, caption], i) => {
    const id = i + 1;
    media.push({file, name: `image${id}.png`, rid: `rIdImg${id}`});
    /*
      Larghezza fissa a 15 cm, che su A4 con i margini di Word e' la colonna
      piena. L'altezza segue la proporzione del file, letta dall'intestazione
      PNG: sedici byte dentro ci sono larghezza e altezza, big endian.
    */
    const buf = fs.readFileSync(path.join(SHOTS_DIR, file));
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    const cx = 5400000;
    const cy = Math.round((cx * h) / w);
    body.push(
      `<w:p><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">` +
        `<wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${id}" name="${esc(caption)}"/>` +
        `<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">` +
        `<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">` +
        `<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">` +
        `<pic:nvPicPr><pic:cNvPr id="${id}" name="${esc(caption)}"/><pic:cNvPicPr/></pic:nvPicPr>` +
        `<pic:blipFill><a:blip r:embed="rIdImg${id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>` +
        `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm>` +
        `<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>` +
        `</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`,
    );
    body.push(para("Caption", runs(caption)));
  });
}

/* ------------------------------------------------------------ l'archivio */

const dir = fs.mkdtempSync(path.join(ROOT, ".docx-"));
const write = (rel, content) => {
  const full = path.join(dir, rel);
  fs.mkdirSync(path.dirname(full), {recursive: true});
  fs.writeFileSync(full, content);
};

write(
  "[Content_Types].xml",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Default Extension="png" ContentType="image/png"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`,
);

write(
  "_rels/.rels",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`,
);

write(
  "word/_rels/document.xml.rels",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
${media.map((m) => `<Relationship Id="${m.rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${m.name}"/>`).join("\n")}
</Relationships>`,
);

const style = (id, name, size, bold, before, after, color) =>
  `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${name}"/><w:pPr>` +
  `<w:spacing w:before="${before}" w:after="${after}" w:line="276" w:lineRule="auto"/></w:pPr>` +
  `<w:rPr><w:rFonts w:ascii="Helvetica Neue" w:hAnsi="Helvetica Neue"/>` +
  `<w:sz w:val="${size}"/>${bold ? "<w:b/>" : ""}${color ? `<w:color w:val="${color}"/>` : ""}</w:rPr></w:style>`;

write(
  "word/styles.xml",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Helvetica Neue" w:hAnsi="Helvetica Neue"/><w:sz w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults>
${style("Title", "Title", 44, true, 0, 240)}
${style("Heading2", "heading 2", 30, true, 360, 160)}
${style("Heading3", "heading 3", 24, true, 240, 120)}
${style("Caption", "caption", 18, false, 0, 240, "6B6B6B")}
</w:styles>`,
);

write(
  "word/document.xml",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">
<w:body>
${body.join("\n")}
<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr>
</w:body></w:document>`,
);

if (media.length) fs.mkdirSync(path.join(dir, "word/media"), {recursive: true});
for (const m of media) fs.copyFileSync(path.join(SHOTS_DIR, m.file), path.join(dir, "word/media", m.name));

fs.rmSync(OUT, {force: true});
execFileSync("zip", ["-r", "-X", "-q", OUT, "."], {cwd: dir});
fs.rmSync(dir, {recursive: true, force: true});

const kb = Math.round(fs.statSync(OUT).size / 1024);
console.log(`\n  docs/BENVENUTO.docx  ${kb} KB  ${body.length} blocchi, ${media.length} schermate\n`);
