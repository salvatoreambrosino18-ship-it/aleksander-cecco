/*
  TRE CREATURE NUOVE: ABYSSYS, MONUMENTUS TENEBRAE TIBIA CUT, TOMAR.
  21/08/2026, dal materiale che il titolare ha consegnato il 20.

    node scripts/import-creature-nuove.mjs            misura e dice tutto, non scrive
    node scripts/import-creature-nuove.mjs --write    carica e crea

  ADDITIVO E BASTA. Non tocca nessun capo che esiste già, e se uno di questi tre
  documenti c'è già lo SALTA invece di riscriverlo: è la lezione che
  `import-photos.mjs` ha insegnato il 20/08, e per cui adesso quel file si
  rifiuta di partire.

  LE FOTOGRAFIE SI CARICANO COME SONO ARRIVATE. Il titolare non manda gli
  originali più grandi e non glieli chiediamo più; quali fotogrammi restino
  sotto misura è scritto in docs/FOTO-SOTTO-MISURA.md, perché il giorno in cui
  arrivasse un file migliore sia uno scambio e non un'indagine. Niente viene
  riconvertito qui: i byte che carichiamo sono i suoi.

  LA PRIMA DELLA LISTA APRE LA PAGINA ed è l'immagine del link condiviso. Non è
  l'ordine della cartella: lui non ha risposto e la regola l'abbiamo scelta noi
  — apre l'indossata, a meno che non sia molto più morbida delle piatte, e
  allora apre la piatta e l'indossata viene subito dopo. Per questo Tibia Cut e
  Tomar aprono su una fotografia del capo appeso: le loro indossate stanno a
  1320 pixel di larghezza contro i 3024 delle altre.

  LA POLARITÀ SI MISURA, non si sceglie: due bande, quella in alto dove sta il
  marchio e quella in basso dove sta la didascalia (sezione 58).

  TAGLIA, DROP E «PER CHI È» RESTANO VUOTI, tranne lo stage di Tibia Cut, che
  è nel nome che ha dato lui: Monumentus TENEBRAE Tibia Cut. Tutto il resto
  sarebbe un nostro plausibile al posto di una sua risposta, e questo progetto
  preferisce l'assenza: un capo senza «per chi è» compare sotto ogni filtro, un
  capo senza drop lo dice in chiaro sulla sua pagina.
*/
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";
import {measureOverlay} from "./lib/measure-overlay.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const WRITE = process.argv.includes("--write");
const SRC = path.join(ROOT, "docs/da-ciro/Da approvare art,descr,prezzi");
const T = (it, en) => ({_type: "localeText", it, en});

const PIECES = [
  {
    id: "piece-abyssys",
    slug: "abyssys",
    name: "Abyssys",
    price: 150,
    sizes: ["XS", "S"],
    rank: 119000,
    materials: T("Lino cerato", "Waxed linen"),
    description: T(
      "Una Creatura dagli Abissi, questo pezzo è cerato a mano, per mostrare l'ossidazione che il mare ed il sale portano al capo.",
      "A Creature from the Abysses, this piece is waxed by hand, to show the oxidation that the sea and salt bring to the garment.",
    ),
    /* materials: l'italiano è nostro. La descrizione è sua in tutte e due. */
    invented: ["materials"],
    files: [
      ["ABYSSYS.JPG", "La camicia scura indossata sugli scogli, davanti al mare, alla luce del tramonto."],
      ["ABYSSYS(1).JPG", "La stessa camicia indossata, figura intera, fra gli scogli e l'acqua scura."],
      ["ABYSSYS(2).JPG", "La camicia distesa su fondo bianco, vista da davanti, con le maniche aperte e l'orlo smerlato."],
      ["ABYSSYS(3).JPG", "La stessa camicia vista da dietro, su fondo bianco."],
    ],
  },
  {
    id: "piece-tibia-cut",
    slug: "tibia-cut",
    name: "Monumentus Tenebrae Tibia Cut",
    price: 670,
    sizes: ["W30", "W32", "W34"],
    stage: "tenebrae",
    rank: 120000,
    materials: T("Pelle di pecora conciata al vegetale", "Vegetable-tanned sheepskin"),
    description: T(
      "Pantaloncini in pelle fatti a mano. Questo pezzo è realizzato in pelle di pecora conciata al vegetale, assemblato con un taglio grezzo semicircolare, seguendo forme naturali per essere confortevole e monumentale. Ogni creazione è unica nel suo genere, non ci sono due uguali.",
      "Handmade Leather Shorts. This piece is made from a veg tan Sheepskin leather, assembled with a semicircular raw cut, following natural shapes to be Comfortable and Monumental. Each creation is one of a kind, no two are the same. Handmade Piece.",
    ),
    /*
      descriptionIt: il suo italiano diceva «pelle di pecora marrone chiaro» e
      alla domanda n.4 ha risposto NO, le foto sono giuste. Quella riga l'abbiamo
      corretta noi sul suo inglese, quindi il segno resta finché non la legge.
    */
    invented: ["materials", "descriptionIt"],
    files: [
      ["TIBIA.CUT.WEBP", "I pantaloncini in pelle appesi a una gruccia davanti a una serranda, visti da davanti."],
      ["TIBIA.CUT(1).jpg", "I pantaloncini indossati, figura intera, con le braccia incrociate, in un interno scuro."],
      ["TIBIA.CUT.jpg", "Gli stessi pantaloncini indossati, di profilo, con gli stivali."],
      ["TIBIA.CUT(1).WEBP", "I pantaloncini appesi, inquadratura più stretta sulla cintura."],
      ["TIBIA.CUT(2).WEBP", "I pantaloncini appesi, di tre quarti, con l'orlo tagliato vivo."],
    ],
  },
  {
    id: "piece-tomar",
    slug: "tomar",
    name: "Tomar",
    price: 200,
    sizes: ["W30", "W32", "W34"],
    rank: 121000,
    materials: T("Pelle di agnello", "Lambskin leather"),
    description: T(
      "Tomar, questa Creatura è realizzata con due tipi di pelle di agnello, creando un contrasto armonico di luce, tocco e consistenza.",
      "Tomar, this Creature is made from two types of lambskin leather, creating an harmonic contrast of light, touch and texture.",
    ),
    /*
      descriptionIt: il suo italiano diceva «con il giusto tipo di pelle di pelle
      di agnello» — «due type» tradotto male e un «pelle di» doppio. Alla domanda
      n.5 ha confermato: due tipi. Corretto in italiano da noi, e in inglese
      «due type» -> «two types», che è esattamente la sua risposta.
    */
    invented: ["materials", "descriptionIt"],
    files: [
      ["TOMAR.WEBP", "I pantaloncini in pelle appesi a una catena davanti a un muro chiaro."],
      ["TOMAR.FIT.PNG", "I pantaloncini indossati, figura intera, in un interno scuro."],
      ["TOMAR(1).WEBP", "Gli stessi pantaloncini appesi, visti da davanti."],
      ["TOMAR(2).WEBP", "I pantaloncini appesi, di lato, con l'orlo a punta."],
      ["TOMAR(1).JPG", "Dettaglio della cintura, con la zip e una scritta a mano sulla pelle."],
      ["TOMAR.JPG", "Dettaglio di una tasca e della cucitura sulla pelle nera lucida."],
    ],
  },
];

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

/* Ogni file esiste? Un errore qui non deve emergere a metà caricamento. */
const all = PIECES.flatMap((p) => p.files.map(([f]) => path.join(SRC, f)));
const missing = all.filter((f) => !fs.existsSync(f));
if (missing.length) {
  console.error("\n  Mancano dei file:\n" + missing.map((f) => "    " + f).join("\n") + "\n");
  process.exit(1);
}

console.log(`\n  ${WRITE ? "CARICO E CREO" : "PROVA A VUOTO"} su ${process.env.PUBLIC_SANITY_PROJECT_ID}/${process.env.PUBLIC_SANITY_DATASET}`);
console.log(`  ${PIECES.length} capi, ${all.length} fotografie\n`);

console.log("  Misuro la polarità (Chrome headless, due bande per fotogramma)...");
const measured = await measureOverlay(all);

let fights = 0;
for (const piece of PIECES) {
  console.log(`\n  ${piece.name}  (/creature/${piece.slug})`);
  console.log(`    ${piece.price} EUR   taglie ${piece.sizes.join(" ")}   ${piece.stage ? "stage " + piece.stage : "stage vuoto"}, drop vuoto, per-chi-è vuoto`);
  console.log(`    segnato come nostro: ${piece.invented.join(", ")}`);
  piece.files.forEach(([file], i) => {
    const m = measured.get(path.join(SRC, file));
    const flag = m.captionSafeOnImage ? "" : "   <-- didascalia SOTTO la foto";
    console.log(
      `    ${i === 0 ? "APRE" : String(i + 1).padStart(4)}  ${file.padEnd(20)} ` +
        `marchio ${m.overlay.padEnd(5)} didascalia ${m.overlayCaption.padEnd(5)} ` +
        `contrasto ${String(m.captionContrast).padStart(5)}${flag}`,
    );
    if (!m.captionSafeOnImage) fights++;
  });
}

console.log(
  `\n  ${fights === 0 ? `Tutte e ${all.length} le bande reggono una didascalia sopra la foto.` : `${fights} fotogrammi su ${all.length} non reggono la didascalia sopra: va sotto, ed è previsto.`}\n`,
);

if (!WRITE) {
  console.log("  Niente è stato caricato e niente è stato creato. Rilancia con --write.\n");
  process.exit(0);
}

const assets = new Map();
for (const file of all) {
  const stream = fs.createReadStream(file);
  const asset = await client.assets.upload("image", stream, {filename: path.basename(file)});
  assets.set(file, asset._id);
  console.log(`    caricata  ${path.basename(file).padEnd(20)} ${asset.metadata?.dimensions?.width}x${asset.metadata?.dimensions?.height}`);
}

for (const piece of PIECES) {
  const existing = await client.fetch(/* groq */ `*[_id == $id][0]{_id}`, {id: piece.id});
  if (existing) {
    console.log(`\n  ${piece.name}: esiste già (${piece.id}), SALTATO. Niente è stato riscritto.`);
    continue;
  }
  const doc = {
    _id: piece.id,
    _type: "garment",
    name: piece.name,
    slug: {_type: "slug", current: piece.slug},
    price: piece.price,
    currency: "EUR",
    sizes: piece.sizes,
    availability: "readyNow",
    materials: piece.materials,
    description: piece.description,
    inventedFields: piece.invented,
    orderRank: `0|${piece.rank}:`,
    ...(piece.stage ? {stage: piece.stage} : {}),
    media: piece.files.map(([file, alt], i) => {
      const m = measured.get(path.join(SRC, file));
      return {
        _type: "media",
        _key: `m${i}`,
        poster: {_type: "image", asset: {_type: "reference", _ref: assets.get(path.join(SRC, file))}},
        alt: {_type: "localeString", it: alt},
        altIsDraft: true,
        overlay: m.overlay,
        overlayCaption: m.overlayCaption,
        captionPlacement: m.captionSafeOnImage ? "over" : "below",
      };
    }),
  };
  await client.create(doc);
  console.log(`\n  creato  ${piece.name}  ${piece.files.length} fotografie`);
}

console.log("\n  Fatto. Il webhook di Sanity fa ripartire la build.\n");
