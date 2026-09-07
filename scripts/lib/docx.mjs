/*
  UN .DOCX, SCRITTO A MANO.

  Non c'è un convertitore su questa macchina: né pandoc né libreoffice, e
  `textutil` di macOS accetta l'HTML ma butta via le immagini. Un .docx è però
  soltanto uno zip con dentro dell'XML, e la parte che serve a un documento di
  testo è piccola. Questo file è quella parte, e sta qui perché ora i documenti
  Word sono due — il foglio di benvenuto per il titolare e la richiesta per
  l'avvocato — e la busta è la stessa.

  QUELLO CHE STA QUI È LA BUSTA, NON IL DOCUMENTO. La lettura del markdown NON
  è qui, ed è giusto così: i due documenti non parlano la stessa lingua. Il
  foglio di benvenuto è titoli, paragrafi e schermate; la richiesta all'avvocato
  è fatta per metà di clausole citate alla lettera, che vanno viste come
  citazioni e non come testo nostro. Un lettore unico buono per tutti e due
  sarebbe stato più lungo di tutti e due.
*/
import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Grassetto e `codice` dentro una riga, il resto è testo.
 *
 * `extra` sono proprietà applicate a OGNI pezzo della riga, per i blocchi che
 * hanno un carattere loro — una citazione resta una citazione anche nelle
 * parole in grassetto che contiene.
 */
export function runs(text, extra = "") {
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
        extra +
        (o.b ? "<w:b/>" : "") +
        (o.mono ? '<w:rFonts w:ascii="Menlo" w:hAnsi="Menlo"/><w:sz w:val="19"/>' : "");
      return `<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ""}<w:t xml:space="preserve">${esc(t)}</w:t></w:r>`;
    })
    .join("");
}

export const para = (style, inner) =>
  `<w:p>${style ? `<w:pPr><w:pStyle w:val="${style}"/></w:pPr>` : ""}${inner}</w:p>`;

/** Uno stile di paragrafo. `pPr` è XML in più dentro <w:pPr>, per rientri e filetti. */
export const style = (id, name, size, bold, before, after, color, pPr = "") =>
  `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${name}"/><w:pPr>` +
  `<w:spacing w:before="${before}" w:after="${after}" w:line="276" w:lineRule="auto"/>${pPr}</w:pPr>` +
  `<w:rPr><w:rFonts w:ascii="Archivo" w:hAnsi="Archivo"/>` +
  `<w:sz w:val="${size}"/>${bold ? "<w:b/>" : ""}${color ? `<w:color w:val="${color}"/>` : ""}</w:rPr></w:style>`;

/**
 * Impacchetta il documento.
 *
 * `media` sono `{name, rid}` più `buffer` oppure `from` (un percorso da cui
 * copiare). `styles` è l'elenco degli stili, già in XML.
 */
export function writeDocx({out, body, styles, media = [], root}) {
  const dir = fs.mkdtempSync(path.join(root, ".docx-"));
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

  write(
    "word/styles.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Archivo" w:hAnsi="Archivo"/><w:sz w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults>
${styles.join("\n")}
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
  for (const m of media) {
    const target = path.join(dir, "word/media", m.name);
    if (m.buffer) fs.writeFileSync(target, m.buffer);
    else fs.copyFileSync(m.from, target);
  }

  fs.rmSync(out, {force: true});
  execFileSync("zip", ["-r", "-X", "-q", out, "."], {cwd: dir});
  fs.rmSync(dir, {recursive: true, force: true});
  return fs.statSync(out).size;
}
