/*
  Import the brand's own photographs into Sanity.

    npm run import            import everything
    npm run import -- --dry   convert and measure, upload nothing

  This is NOT the seed script. Seed creates disposable test fixtures; this puts
  real work in. Running it removes the seeded placeholders, because their job
  (letting the layouts be judged against real photography) is done the moment
  real photography arrives. `npm run seed` puts them back if ever needed.

  READ ONLY at the source. The photographs live on the owner's Google Drive and
  stay there: nothing is copied into the repository, nothing in the source
  folder is written, renamed or deleted. HEIC files are converted into the
  system temp directory and uploaded from there.

  WHAT IT DECIDES, AND WHAT IT LEAVES TO A HUMAN
  - Grouping: which photographs belong to the same garment was decided by
    looking at every image. That is recorded in GARMENTS below.
  - Alt text: written from looking at each photograph, in Italian, and flagged
    altIsDraft so nobody mistakes it for approved copy. English is left empty
    and falls back to Italian (DESIGN-PLAN section 17).
  - Overlay polarity: MEASURED, not guessed. Each photograph is sampled where
    the chrome actually sits, the top left of the phone crop, and paper or ink
    is chosen by WCAG contrast. See measureOverlay below.
  - Names, reference codes, prices, descriptions and measurements are NOT
    invented. They ship as {PLACEHOLDER} tokens for the owner to fill in.
*/
import {createHash} from "node:crypto";
import {execFile} from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {promisify} from "node:util";
import {createClient} from "@sanity/client";
import {measureOverlay} from "./lib/measure-overlay.mjs";

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const DRY = process.argv.includes("--dry");
const SOURCE =
  process.argv.find((a) => a.startsWith("--source="))?.slice(9) ||
  "/Users/salvatoreambrosino/Library/CloudStorage/GoogleDrive-salvatoreambrosino18@gmail.com/My Drive/Aleksander Cecco";

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  useCdn: false,
});

/* ------------------------------------------------------------------ the plan */

// Grouping and alt text, both decided by looking at every photograph.
const GARMENTS = [
  {
    id: "piece-camicia-pelle-nera",
    slug: "capo-01",
    files: [
      ["products/0d454a66-7c17-4d8d-a6f0-9872225ab82b", "Camicia in pelle nera stropicciata, vista frontale, appesa a un muro di cemento chiaro."],
      ["products/286368a0-df23-4ae8-b80d-5bc953183102", "La stessa camicia in pelle nera vista piu da vicino, contro il muro di cemento."],
    ],
  },
  {
    id: "piece-giacca-orlo-smerlato",
    slug: "capo-02",
    files: [
      ["products/IMG_3451", "Giacca in pelle nera con orlo a punte, vista frontale, appesa davanti a una serranda metallica."],
      ["products/IMG_3454", "Fronte della giacca in pelle nera, con la fila di bottoni automatici."],
      ["products/IMG_3453", "Dettaglio del collo e della chiusura della giacca in pelle nera."],
      ["products/IMG_3452", "Vista laterale della giacca in pelle nera, con l'orlo tagliato a punte."],
      ["products/IMG_3455", "Dettaglio dell'orlo a punte della giacca, contro il cemento."],
      ["products/IMG_3456", "Retro della giacca in pelle nera appesa alla gruccia."],
      ["products/IMG_3457", "Dettaglio delle cuciture sulle spalle, sul retro della giacca."],
    ],
  },
  {
    id: "piece-gilet-zip",
    slug: "capo-03",
    files: [["products/IMG_3465", "Gilet in pelle nera con zip centrale, appeso a una gruccia davanti a una serranda."]],
  },
  {
    id: "piece-top-leggero",
    slug: "capo-04",
    files: [["products/IMG_3466", "Top nero leggero e trasparente, tenuto in mano davanti a un muro di cemento."]],
  },
  {
    id: "piece-pelle-drappeggiata",
    slug: "capo-05",
    files: [
      ["products/IMG_3467", "Capo in pelle nera appeso a una parete di cemento, sotto una croce di metallo."],
      ["products/IMG_3468", "Dettaglio ravvicinato dello stesso capo in pelle nera, con zip e pieghe profonde."],
    ],
  },
  {
    id: "piece-giacca-rossa",
    slug: "capo-06",
    files: [
      ["products/IMG_3476", "Modella con giacca in pelle rossa e pantaloni neri lucidi, braccia incrociate, in laboratorio."],
      ["products/IMG_3475", "La stessa giacca rossa vista di spalle, tra i capi appesi del laboratorio."],
      ["products/IMG_3477", "Modella a figura intera con la giacca in pelle rossa, nel laboratorio."],
    ],
  },
  {
    id: "piece-pantaloni-pelle",
    slug: "capo-07",
    files: [
      ["products/IMG_3691", "Pantaloni ampi in pelle nera, vista frontale, con zip a vista e orlo grezzo."],
      ["products/IMG_3692", "Gli stessi pantaloni in pelle nera visti da dietro, con due tasche con zip."],
    ],
  },
  {
    id: "piece-completo-fascia-gonna",
    slug: "capo-08",
    files: [
      ["products/aa52ef49-6c71-4a9b-b832-24cb5827376d", "Modella in top a fascia e gonna di pelle nera, con ombre lunghe sul muro."],
      ["products/05b164db-ab89-4d66-bebc-98d8a31ec147", "La stessa uscita in piena luce, con stivali alti."],
      ["products/7682a1f5-5ce2-4527-b02f-d3213bee8af8", "Dettaglio della gonna in pelle nera con orlo a punte, indossata."],
    ],
  },
];

// The archive is a SEQUENCE, curated to one frame per piece, and every frame
// chosen here is at least 2000px on its long edge. The six low-resolution
// archive files are deliberately left out (see the report).
const ARCHIVE = [
  ["archive/IMG_9568", "Giacca in pelle marrone con collo in pelliccia, distesa."],
  ["archive/IMG_3480", "Giacca in pelle rossa su un manichino, vista frontale ravvicinata."],
  ["archive/IMG_2235", "Capo in pelle nera aperto e disteso sul cemento, a forma di mantella."],
  ["archive/IMG_2242", "Gilet smanicato in pelle nera disteso sul cemento."],
  ["archive/IMG_2244", "Un secondo gilet in pelle nera disteso sul cemento, visto di sbieco."],
  ["archive/IMG_2229", "Dettaglio di un capo in pelle scura con una zip lunga, disteso."],
  ["archive/IMG_3643", "Pantaloni chiari e gilet appesi insieme davanti a una serranda."],
  ["archive/IMG_3474", "Uomo a figura intera con maglia e pantaloni chiari, in un laboratorio."],
  ["archive/01323077-3c8b-4f10-bb66-6253bcf1bcb8", "Borsa in pelle nera appesa a una catena, con patta sagomata."],
];

/*
  THE ARRIVAL. One photograph, the whole first screen, chosen 2026-08-02 from
  the eleven frames in homepage/ (DESIGN-PLAN section 21 records the comparison).

  IMG_3463 wins on four counts that are about this layout, not about taste:
  it is portrait and 3024x4032, so it survives the 100svh crop on a phone; the
  garment hangs high inside a steel frame with concrete continuing below it, so
  the composition is not sealed and the eye is carried downward; the top band is
  evenly bright, so one overlay value keeps both the signature and MENU legible;
  and it is monochrome in fact, so nothing fights the black and white rule.

  The two files the owner named HOMEPAGE are flat-lay leather details. They are
  beautiful and they are the most closed compositions in the set, which is the
  exact failure this rebuild is correcting, so they are not used here.
*/
const OPENING = [
  "homepage/IMG_3463",
  "Pantaloni chiari in pelle appesi dentro una cornice di metallo nero, davanti a un muro di cemento e a una serranda.",
];

/*
  WORN: the pieces on people, the horizontal band halfway down the home page.

  Five frames, all portrait, because a band frame is a tall crop and a landscape
  source loses its subject in it. That rules out IMG_1898, which is the best
  on-model photograph in the set and is 4032x3024.

  Honest limit, worth the owner knowing: the on-model photography covers only
  two garments (capo-08 and capo-06) plus one unlinked frame, so the band is
  thinner than it looks. More people in more pieces is the single most useful
  thing that could be shot for this page.
*/
const WORN = [
  ["products/aa52ef49-6c71-4a9b-b832-24cb5827376d", "Modella in top a fascia e gonna di pelle nera, con ombre lunghe sul cemento.", "piece-completo-fascia-gonna"],
  ["products/IMG_3477", "Modella a figura intera con la giacca in pelle rossa, nel laboratorio.", "piece-giacca-rossa"],
  ["homepage/IMG_3485", "Uomo con gilet in pelle nera e pantaloni corti in pelle, in piedi al sole sul cemento.", null],
  ["products/IMG_3475", "La stessa giacca rossa vista di spalle, tra i capi appesi del laboratorio.", "piece-giacca-rossa"],
  ["products/05b164db-ab89-4d66-bebc-98d8a31ec147", "La stessa uscita in piena luce, con stivali alti.", "piece-completo-fascia-gonna"],
];

/*
  THE MAKING. Two frames of the same hide, and the pair is the whole argument:
  the skin as it arrives, then the same skin with a collar built onto it. The
  home page claims the work is a transformation a few screens earlier; this is
  where it is shown rather than asserted.

  Deliberately NOT the experimental/ bench frames, which belong to the about
  page: the home page should promise that story, not spend it.
*/
const MAKING = [
  ["products/IMG_0206", "Una pelle nera a pelo lungo distesa sul cemento, con i fili di cucitura ancora attaccati."],
  ["products/IMG_0208", "La stessa pelle con un collo in pelle gia montato e chiuso da bottoni automatici."],
];

/*
  The collection cover. It used to be the same frame as the opening, which was
  harmless while the home page opened on the signature and unforgivable now that
  the page opens on a photograph: the arrival and the first chapter cover would
  be the same picture, twice on one screenful of scrolling.

  This is the frame the owner named HOMEPAGE. It is not the arrival, for the
  reason recorded above, but it is a strong material statement and a chapter
  cover is exactly where a material statement belongs.
*/
const COLLECTION_COVER = [
  "homepage/HOMEPAGE",
  "Dettaglio ravvicinato di una pelle chiara, con pieghe profonde e una cucitura che la attraversa.",
];

/*
  Home page copy. Written FOR the brand, never BY it, so it ships with
  homeCopyIsDraft on and the page marks every line as an unapproved draft.
  Nothing here goes beyond what the owner has stated: Italian leather, alchemy
  and transformation, minimal construction, forms from nature, made by hand one
  piece at a time, nothing made in advance, worldwide shipping.
*/
const HOME_COPY = {
  homeStatement: {
    it: "Cento per cento pelle italiana.\nAlchimia: una pelle diventa un'altra cosa.\nCostruzione minima, forme prese dalla natura.",
    en: "One hundred per cent Italian leather.\nAlchemy: a hide becomes something else.\nMinimal construction, forms taken from nature.",
  },
  makingStatement: {
    it: "Pelli intere, scelte e rimesse insieme a mano.\nNessun capo esiste prima che qualcuno lo chieda.",
    en: "Whole hides, chosen and put back together by hand.\nNo piece exists before someone asks for it.",
  },
  footerShipping: {
    it: "Spediamo in tutto il mondo.",
    en: "We ship worldwide.",
  },
  footerOrigin: {
    it: "Fatto a mano in Italia, un pezzo alla volta.",
    en: "Made by hand in Italy, one piece at a time.",
  },
};

const ABOUT_MEDIA = [
  ["experimental/IMG_2626", "Pennello largo appoggiato su una pelle appena tinta di scuro."],
  ["experimental/387ba92d-448a-4763-a76b-fba6e046351a", "Pezzi di cartamodello in tela chiara disposti sul tavolo da lavoro."],
  ["experimental/IMG_3406", "Ritagli di pelle, pietre e attrezzi sul tavolo da lavoro."],
  ["experimental/IMG_2894", "Dettaglio ravvicinato di una pelle scura con pieghe profonde."],
];

/* ------------------------------------------------------------- conversion */

const TMP = path.join(os.tmpdir(), "aleksander-cecco-import");

/*
  The plan above names files WITHOUT an extension, on purpose. In the owner's
  folders the same batch mixes .JPG, .WEBP and .heic, and two files carry an
  extension their neighbours do not (IMG_3465 is a JPG among WEBPs, IMG_3691
  and IMG_3692 are HEIC among JPGs). Hard-coding extensions produced exactly the
  failure you would expect. So: resolve by folder and stem, case-insensitively,
  against what is actually on disk.
*/
const index = new Map();
async function buildIndex() {
  for (const folder of ["products", "archive", "homepage", "experimental"]) {
    let entries = [];
    try {
      entries = await fs.readdir(path.join(SOURCE, folder));
    } catch {
      continue;
    }
    for (const name of entries) {
      if (name.startsWith(".")) continue;
      const stem = name.replace(/\.[^.]+$/, "");
      index.set(`${folder}/${stem}`.toLowerCase(), `${folder}/${name}`);
    }
  }
}
function resolveRel(key) {
  const found = index.get(key.toLowerCase());
  if (!found) throw new Error(`no file for "${key}" in ${SOURCE}`);
  return found;
}

/**
 * HEIC cannot be uploaded: Sanity's pipeline does not handle it. sips converts
 * it natively on macOS. Output goes to the system temp directory, never into
 * the repository and never back into the owner's Drive.
 */
async function usableFile(key) {
  const rel = resolveRel(key);
  const src = path.join(SOURCE, rel);
  if (!/\.heic$/i.test(rel)) return src;
  await fs.mkdir(TMP, {recursive: true});
  const out = path.join(TMP, rel.replace(/[\/\\]/g, "_").replace(/\.heic$/i, ".jpg"));
  try {
    await fs.access(out);
  } catch {
    await run("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "90", src, "--out", out]);
  }
  return out;
}

/* ----------------------------------------------------------------- upload */

const uploaded = new Map();

async function uploadOnce(file) {
  if (uploaded.has(file)) return uploaded.get(file);
  const buffer = await fs.readFile(file);
  const sha1 = createHash("sha1").update(buffer).digest("hex");
  const existing = await client.fetch(`*[_type == "sanity.imageAsset" && sha1hash == $sha1][0]{_id}`, {sha1});
  let id;
  if (existing?._id) {
    id = existing._id;
    console.log(`  reused   ${path.basename(file)}`);
  } else {
    const asset = await client.assets.upload("image", buffer, {filename: path.basename(file)});
    id = asset._id;
    console.log(`  uploaded ${path.basename(file)}  ${(buffer.length / 1024 / 1024).toFixed(1)}MB`);
  }
  uploaded.set(file, id);
  return id;
}

function mediaObject(assetId, altIt, overlay, key) {
  return {
    _type: "media",
    _key: key,
    poster: {_type: "image", asset: {_type: "reference", _ref: assetId}},
    // Italian only: English falls back to it until a human writes one.
    alt: {_type: "localeString", it: altIt},
    altIsDraft: true,
    overlay,
    captionPlacement: "over",
  };
}

/* -------------------------------------------------------------------- run */

async function main() {
  const everything = [
    ...GARMENTS.flatMap((g) => g.files.map(([f]) => f)),
    ...ARCHIVE.map(([f]) => f),
    OPENING[0],
    COLLECTION_COVER[0],
    ...WORN.map(([f]) => f),
    ...MAKING.map(([f]) => f),
    ...ABOUT_MEDIA.map(([f]) => f),
  ];
  // The same frame can legitimately appear in two places (a garment gallery and
  // the worn band, say). Upload dedupes by sha1, but measuring and logging the
  // same file twice is just noise.
  const unique = [...new Set(everything)];
  await buildIndex();
  console.log(`Importing ${unique.length} photographs from:\n  ${SOURCE}\n`);

  console.log("Converting HEIC where needed (into the system temp directory):");
  const usable = new Map();
  let converted = 0;
  for (const key of unique) {
    const file = await usableFile(key);
    if (file.startsWith(TMP)) converted++;
    usable.set(key, file);
  }
  console.log(`  ${converted} converted, ${unique.length - converted} used as they are\n`);

  console.log("Measuring where the chrome sits, to choose paper or ink per photograph:");
  const overlays = await measureOverlay([...usable.values()]);
  for (const rel of unique) {
    const m = overlays.get(usable.get(rel));
    console.log(`  ${m.overlay.padEnd(5)} contrast ${String(m.contrast).padStart(5)}  ${rel}`);
  }

  if (DRY) {
    console.log("\n--dry: nothing uploaded, nothing written.");
    return;
  }

  console.log("\nUploading:");
  const assets = new Map();
  for (const rel of unique) assets.set(rel, await uploadOnce(usable.get(rel)));

  const ov = (rel) => overlays.get(usable.get(rel)).overlay;

  console.log("\nWriting documents:");

  // The collection every imported garment belongs to. Name and statement are
  // the owner's to write, so they ship as marked placeholders. No season: the
  // brand does not work in seasons (DESIGN-PLAN section 17).
  const COLLECTION_ID = "collection-01";
  await client.createOrReplace({
    _id: COLLECTION_ID,
    _type: "collection",
    name: "{COLLECTION_NAME}",
    slug: {_type: "slug", current: "collezione-01"},
    statement: {
      _type: "localeText",
      it: "{STATEMENT_RIGA_UNO}\n{STATEMENT_RIGA_DUE}",
      en: "{STATEMENT_LINE_ONE}\n{STATEMENT_LINE_TWO}",
    },
    cover: mediaObject(
      assets.get(COLLECTION_COVER[0]),
      COLLECTION_COVER[1],
      ov(COLLECTION_COVER[0]),
      "cover",
    ),
    published: true,
    orderRank: "0|100000:",
  });
  console.log(`  collection    ${COLLECTION_ID}`);

  let rank = 100000;
  for (const g of GARMENTS) {
    rank += 1000;
    await client.createOrReplace({
      _id: g.id,
      _type: "garment",
      name: "{GARMENT_NAME}",
      slug: {_type: "slug", current: g.slug},
      referenceCode: "{REF_CODE}",
      collection: {_type: "reference", _ref: COLLECTION_ID},
      category: "donna",
      currency: "EUR",
      materials: {_type: "localeText", it: "100% pelle italiana", en: "100% Italian leather"},
      measurements: "{MISURE_DI_RIFERIMENTO}",
      description: {_type: "localeText", it: "{DESCRIZIONE_IT}", en: "{DESCRIPTION_EN}"},
      media: g.files.map(([rel, alt], i) => mediaObject(assets.get(rel), alt, ov(rel), `m${i}`)),
      notOffered: false,
      orderRank: `0|${rank}:`,
    });
    console.log(`  garment       ${g.id}  (${g.files.length} photographs)`);
  }

  rank = 100000;
  for (const [rel, alt] of ARCHIVE) {
    rank += 1000;
    const id = `archive-${path.basename(rel).replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    await client.createOrReplace({
      _id: id,
      _type: "archivePiece",
      title: "{NOME_PEZZO}",
      year: "{ANNO}",
      media: [mediaObject(assets.get(rel), alt, ov(rel), "m0")],
      orderRank: `0|${rank}:`,
    });
    console.log(`  archive       ${id}`);
  }

  const settings = (await client.fetch(`*[_id == "siteSettings"][0]`)) || {};
  await client.createOrReplace({
    ...settings,
    _id: "siteSettings",
    _type: "siteSettings",
    openingMedia: mediaObject(assets.get(OPENING[0]), OPENING[1], ov(OPENING[0]), "opening"),
    homeSequence: WORN.map(([rel, alt, garmentId], i) => ({
      _type: "homeTile",
      _key: `t${i}`,
      media: mediaObject(assets.get(rel), alt, ov(rel), `tm${i}`),
      ...(garmentId ? {garment: {_type: "reference", _ref: garmentId}} : {}),
    })),
    makingMedia: MAKING.map(([rel, alt], i) => mediaObject(assets.get(rel), alt, ov(rel), `k${i}`)),
    homeStatement: {_type: "localeText", ...HOME_COPY.homeStatement},
    makingStatement: {_type: "localeText", ...HOME_COPY.makingStatement},
    footerShipping: {_type: "localeText", ...HOME_COPY.footerShipping},
    footerOrigin: {_type: "localeText", ...HOME_COPY.footerOrigin},
    // Nobody has approved a word of it. The page says so until the owner does.
    homeCopyIsDraft: true,
  });
  console.log("  siteSettings  arrival, worn band, making, home copy (all draft)");

  // The seeded fixtures have done their job now that real work is in.
  for (const id of ["seed-garment-a", "seed-garment-b", "seed-collection-uno"]) {
    await client.delete(id).catch(() => {});
    await client.delete(`drafts.${id}`).catch(() => {});
  }
  console.log("  removed the seeded placeholders (npm run seed puts them back)");

  const counts = await client.fetch(`{
    "collections": count(*[_type == "collection"]),
    "garments": count(*[_type == "garment"]),
    "archive": count(*[_type == "archivePiece"]),
    "assets": count(*[_type == "sanity.imageAsset"])
  }`);
  console.log("\nIn the dataset now:", JSON.stringify(counts));
}

main().catch((error) => {
  console.error("\nImport failed:", error.message);
  process.exit(1);
});
