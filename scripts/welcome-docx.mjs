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
import {fileURLToPath} from "node:url";
import {esc, para, runs, style, writeDocx} from "./lib/docx.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "docs/BENVENUTO.md");
const OUT = path.join(ROOT, "docs/BENVENUTO.docx");
const SHOTS_DIR = path.join(ROOT, "docs/benvenuto-shots");

const SIGNATURE_SVG = path.join(ROOT, "assets/logo/logo-signature.svg");

const SHOTS = [
  ["1-schermata-iniziale.png", "La schermata che vedi entrando"],
  ["2-prezzo-e-taglie.png", "Un capo aperto. Le fotografie in cima, il prezzo sotto"],
  ["3-fotografie.png", "Le taglie, subito sotto il prezzo"],
  ["4-publish.png", "Il pulsante Publish, in basso a destra"],
];

/*
  LA BUSTA STA IN scripts/lib/docx.mjs, insieme al lettore di grassetto e alla
  costruzione dello zip: da quando i documenti Word sono due, un .docx scritto a
  mano due volte sarebbe due .docx che possono divergere.
*/

/* ------------------------------------------------------------ il markdown */

/*
  LA FIRMA IN COPERTINA, dallo stesso SVG che il sito mette in cima a ogni
  pagina. Word non sa disegnare un SVG, quindi si trasforma in PNG qui: e' la
  stessa immagine, non un disegno rifatto per l'occasione.
*/
let signature = null;
if (fs.existsSync(SIGNATURE_SVG)) {
  const sharp = (await import("sharp")).default;
  signature = await sharp(fs.readFileSync(SIGNATURE_SVG), {density: 600}).resize({width: 900}).png().toBuffer();
}

const lines = fs.readFileSync(SRC, "utf8").split("\n");
const body = [];
const extraMedia = [];
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

if (signature) {
  const cx = 2200000;
  const meta = {w: 900, h: Math.round((900 * 1) / 1)};
  extraMedia.push({buffer: signature, name: "signature.png", rid: "rIdSig"});
  body.unshift(
    `<w:p><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">` +
      `<wp:extent cx="${cx}" cy="${Math.round(cx * 0.28)}"/><wp:docPr id="99" name="Aleksander Cecco"/>` +
      `<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">` +
      `<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">` +
      `<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">` +
      `<pic:nvPicPr><pic:cNvPr id="99" name="Aleksander Cecco"/><pic:cNvPicPr/></pic:nvPicPr>` +
      `<pic:blipFill><a:blip r:embed="rIdSig"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>` +
      `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${Math.round(cx * 0.28)}"/></a:xfrm>` +
      `<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>` +
      `</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`,
  );
}

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

const size = writeDocx({
  out: OUT,
  body,
  root: ROOT,
  styles: [
    style("Title", "Title", 44, true, 0, 240),
    style("Heading2", "heading 2", 30, true, 360, 160),
    style("Heading3", "heading 3", 24, true, 240, 120),
    style("Caption", "caption", 18, false, 0, 240, "6B6B6B"),
  ],
  media: [
    ...media.map((m) => ({...m, from: path.join(SHOTS_DIR, m.file)})),
    ...extraMedia,
  ],
});

console.log(
  `\n  docs/BENVENUTO.docx  ${Math.round(size / 1024)} KB  ${body.length} blocchi, ${media.length} schermate\n`,
);
