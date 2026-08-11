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

/*
  ============ WHERE THE NAMES CAME FROM ============

  2026-08-02: matched against his Instagram captions, which named four Creature
  and left the rest as marked placeholders. The ambiguity table and the full
  reasoning are in DESIGN-PLAN section 24.

  2026-08-03: superseded for MONUMENTUS, OBLIVION and STYRAX by his own
  filenames, which is what the next comment is about. Where the two disagree the
  filenames win: they are his, and a caption match was always an inference.

  STAGE, unchanged in principle. His division is by MATERIAL AND COLOUR:
  Tenebrae is the black washed veg tan work, Lux the pale pieces. Colour is
  observable in our frames and tannage is not, so it was always assigned on half
  the criterion. On the pieces he has now renamed the stage is in HIS filename,
  so those are no longer our reading of a photograph.
*/
/*
  ============ HIS OWN NAMES (2026-08-03) ============

  The owner renamed the photographs in MONUMENTUS, MONUMENTUS TIBIA CUT, OBLIVION
  and STYRAX TOP with the Creature names. That closes the naming gap that has
  blocked this catalogue from the start, and the names below are HIS, read off
  his filenames.

  WHAT IS COPIED AND WHAT IS NOT. The name and the composition are taken from
  the filename; the filename ITSELF is not. His files read "oblv blood red lamb
  (2)", "Mnmnts. Lux Tibia cut", "Stryax black goat  (1)": working shorthand with
  abbreviations, duplicate suffixes and two spellings of Styrax. Printing that on
  a page would be publishing his filing system. So each name is written out once,
  here, with the file it came from named beside it, and anything his filenames do
  not settle stays a marked placeholder exactly as before.

  WHAT THE NAMES SETTLE:
  - The black shirt is OBLIVION, in black lambskin, and the red one is the same
    shirt in blood red lambskin. "Rubedo" was OUR inference from the alchemical
    stage: no caption of his ever used it (DESIGN-PLAN section 48).
  - capo-05 is Monumentus Pants, so a piece described here only as "a draped
    black garment" is trousers.
  - Both vests carry the same name, "Monumentus Vest (Tenebrae)". They are
    plainly two different objects: one is smooth leather with a central silver
    zip, the other crinkled with snap fasteners. Two documents, one name, and
    that is his to resolve.
  - Two pale trouser documents now carry two different names of his, "Monumentus
    pants (Lux)" and "Monumentus Lux". They may be one Creature. Also his.

  SALVAGE. Some frames were lost when products/ was deleted in the same
  reorganisation (section 47). Their assets are already in Sanity, so those
  entries reference the asset directly instead of a file on disk. A salvaged
  frame is not a decision to stop looking for the original: if the owner still
  has it, the file comes back and the salvage line goes.
*/
/*
  OVERLAY OVERRIDES, and why any exist at all.

  The measurement samples the TOP of the frame, because that is where the fixed
  chrome sits when a photograph is the first thing on a page. That is right for
  an arrival and wrong for a frame you scroll INTO: the chrome then passes over
  the whole image, and a value measured from a pale top band goes illegible the
  moment a dark middle arrives under it.

  Seen on the designer portrait at the end of the about page (2026-08-03): the
  file measures ink at 6.2 from its pale concrete top, and the reader spends the
  whole block looking at the chrome sitting over a black hood, where ink is
  invisible. Paper is right for the frame as it is actually read.

  This is the residual issue section 14 already records. An override is honest
  here because the alternative, a second measured value per frame, would still
  be one number for a band that moves.
*/
const OVERLAY_OVERRIDE = {
  "artisan/DESIGNER": "paper",
};

const SALVAGED = {
  "salvage/capo-01-front": {
    asset: "image-e467af8728269850318fd2b8e98f029cd7541e35-1536x2048-jpg",
    overlay: "ink",
  },
  "salvage/capo-01-close": {
    asset: "image-5d997ce203981b7f8766d33d6c7c95727841e394-3840x5120-jpg",
    overlay: "ink",
  },
  "salvage/capo-07-front": {
    asset: "image-573a4373a1ba9502e4e8ea3aa19790ef6f71ab19-2268x4032-jpg",
    overlay: "ink",
  },
  "salvage/capo-07-back": {
    asset: "image-e55971123e53fd08c80762bbe5e2622e35b157b7-2268x4032-jpg",
    overlay: "ink",
  },
  "salvage/capo-08-shadow": {
    asset: "image-315fe57966aa901f34afbc9936746d33412befa6-3840x5120-jpg",
    overlay: "paper",
  },
  "salvage/capo-08-light": {
    asset: "image-4534436fa2124708d879fdde9199b07300a0533b-3840x5120-jpg",
    overlay: "paper",
  },
  "salvage/capo-08-hem": {
    asset: "image-6fe5b15c27642dc39ef6e81d6a7ac2dc61659a96-3024x4032-jpg",
    overlay: "paper",
  },
  "salvage/gallery-fur": {
    asset: "image-f9d9191d6a909883f12505377288734e66b80742-1200x1600-jpg",
    overlay: "ink",
  },
  /*
    THE DROP'S COVER (2026-08-11, section 80). The key was `homepage/HOMEPAGE`
    and it resolved for a week to a 4284x5712 detail of pale leather. Then a
    2360x1640 file called HOMEPAGE.JPG appeared in that folder — a SCREENSHOT OF
    THE OWNER'S OTHER SHOP, two phone frames side by side — and the import
    silently made it the drop's cover. Nothing complained: it is a valid image
    at a valid key, the alt text comes from this plan and did not change, and
    the only visible symptom was a website inside the chapter block.

    The Drive is READ ONLY to us and not under our control, so a key is only as
    stable as the folder behind it. This frame is pinned to its asset instead.
  */
  "salvage/monumentus-cover": {
    asset: "image-d84f6f53829025e5bbac9fc44196b4cdde1b2d2e-4284x5712-jpg",
    overlay: "ink",
  },
};

/*
  STAGE ASSIGNMENT. The owner's division is by MATERIAL AND COLOUR: Tenebrae is
  the black washed veg tan work, Lux the pale pieces. His filenames now carry the
  stage on the pieces he renamed, so those are no longer read off the colour in
  our frames: they are his own word for it.
*/

/*
  ============ INVENTED, AND FLAGGED (2026-08-03) ============

  The owner asked to see a finished product rather than a site full of braces,
  so everything below was written by us. NONE of it is his.

  THE RULE THAT MAKES THAT SAFE: every value here is listed in the document's
  `inventedFields`, `npm run launch-check` refuses to pass while any list is
  non-empty, and DESIGN-PLAN section 59 carries the same list in one place. The
  page says nothing, because a visitor should see a finished product; the studio
  and the launch check say everything, because nothing invented may quietly
  become permanent.

  NAMES. Taken from HIS OWN vocabulary wherever a piece matches a name he has
  used publicly and we could never confirm (Armonyen, Aleya, Severya, Corvinus),
  because his words in his register beat anything we would coin. Where nothing of
  his fits, the coinage follows the pattern of the names he does use: one word,
  Latin or Latinate, no English nouns. These are ASSIGNMENTS, not identifications
  (DESIGN-PLAN section 24 refused to guess; this is that guess, flagged).

  PRICES. Derived, not chosen, from section 32: hours by construction times a
  rate he can live on, plus material, rounded to a multiple of 25, tiered
  accessories then single-panel then constructed then tailored. The range lands
  at 275 to 1,850 euro, which is the labour-derived band section 32 found and the
  international market band it matched against Isaac Sellam. The old dollar list
  is NOT used: section 32 showed it paid him two to nine euro an hour.

  MEASUREMENTS are the photographed piece, in his flat-measurement idiom.
*/
/*
  WHO A PIECE IS FOR: a catalogue FILTER, never a route (2026-08-04). Derived
  from his own 2026-08-03 description of the families ("MONUMENTUS = men's
  co-ord sets", "OBLIVION = women's shirts") and applied only where the piece
  still carries that family name. Everything else stays unset and shows under
  every filter. Flagged, because the folder scheme that said so is superseded.
*/
const WORN_BY = {
  "capo-02": "women",
  "capo-03": "men",
  "capo-04": "men",
  "capo-05": "men",
  "capo-10": "men",
  "capo-11": "men",
};

const INVENTED = {
  "capo-01": {
    name: "Armonyen",
    price: 1450,
    materials: {it: "Pelle di agnello nera lavata, conciata al vegetale", en: "Black washed vegetable-tanned lambskin"},
    measurements: "Torace 54 cm. Spalle 44 cm. Lunghezza 72 cm. Manica 66 cm.",
    description: {en: "A shirt with nothing straight in it. Crumpled by hand, dried on the branch it was photographed on."},
    fields: ["name", "price", "materials", "measurements", "description"],
  },
  "capo-02": {
    price: 1450,
    // HIS measurements, verbatim (2026-08-05): the field is free text, so his
    // Armpit fits without a schema change.
    measurements: "Sleeves - 73 cm, Length - 56 cm, Shoulders - 40 cm, Armpit - 40 cm",
    // HIS description, verbatim; the Italian is ours, flagged descriptionIt.
    description: {en: "Washed lambskin leather shirt, in black faded colour. 500 handmade scar-stitches, and the Oblivion hole on the back.", it: "Camicia in pelle di agnello lavata, in nero sbiadito. 500 punti-cicatrice fatti a mano, e il foro Oblivion sulla schiena."},
    fields: ["price", "descriptionIt"],
  },
  "capo-03": {
    price: 950,
    materials: {it: "Pelle nera lavata, conciata al vegetale", en: "Black washed vegetable-tanned leather"},
    measurements: "Torace 56 cm. Spalle 40 cm. Lunghezza 58 cm.",
    description: {en: "A vest cut from one hide, closed by a single zip. The hem follows the edge of the skin."},
    fields: ["price", "materials", "measurements", "description"],
  },
  "capo-04": {
    price: 950,
    materials: {it: "Pelle di agnello nera stropicciata", en: "Black crinkled lambskin"},
    measurements: "Torace 54 cm. Spalle 38 cm. Lunghezza 56 cm.",
    description: {en: "The same vest in crinkled lambskin, fastened with snaps at the neck."},
    fields: ["price", "materials", "measurements", "description"],
  },
  "capo-05": {
    price: 1150,
    materials: {it: "Pelle nera lavata, conciata al vegetale", en: "Black washed vegetable-tanned leather"},
    measurements: "Vita 42 cm. Cavallo 34 cm. Lunghezza 104 cm. Fondo 26 cm.",
    // HIS Monumentus description (trousers and tibia cut only), verbatim.
    description: {en: "This piece is made from a Veg - Tanned Sheepskin leather. Assembled with a semicircular raw cut, following natural shapes to be Comfortable and Monumental. Each creation is one of a kind, no two are the same. Made by order. Handmade in Italy.", it: "Questo pezzo è realizzato in pelle di montone conciata al vegetale. Assemblato con un taglio grezzo semicircolare, seguendo le forme naturali per essere Comodo e Monumentale. Ogni creazione è un pezzo unico, non ce ne sono due uguali. Su ordinazione. Fatto a mano in Italia."},
    fields: ["price", "materials", "measurements", "descriptionIt"],
  },
  "capo-07": {
    name: "Aleya",
    price: 1150,
    materials: {it: "Pelle nera lavata, conciata al vegetale", en: "Black washed vegetable-tanned leather"},
    measurements: "Vita 44 cm. Cavallo 36 cm. Lunghezza 102 cm. Fondo 32 cm.",
    description: {en: "Wide through the leg, cut raw at the hem. Two zipped pockets at the back."},
    fields: ["name", "price", "materials", "measurements", "description"],
  },
  severya: {
    price: 875,
    materials: {it: "Pelle di agnello, stampa serpente", en: "Snake-embossed lambskin"},
    measurements: "Vita 34 cm. Lunghezza 62 cm.",
    description: {en: "Handmade snake skirt. 1 of 1, from the sample sale."},
    fields: ["price", "materials", "measurements", "description"],
  },
  "capo-09": {
    name: "Vesper",
    price: 425,
    materials: {it: "Pelle di agnello nera martellata", en: "Black pebbled lambskin"},
    measurements: "22 x 16 x 4 cm. Catena 96 cm.",
    description: {en: "Small enough for a key and a phone. Hung on a chain, closed with a shaped flap."},
    fields: ["name", "price", "materials", "measurements", "description"],
  },
  "capo-10": {
    price: 1150,
    materials: {it: "Pelle conciata al vegetale, non tinta", en: "Undyed vegetable-tanned leather"},
    measurements: "Vita 44 cm. Cavallo 38 cm. Lunghezza 76 cm. Fondo 34 cm.",
    description: {en: "This piece is made from a Veg - Tanned Sheepskin leather. Assembled with a semicircular raw cut, following natural shapes to be Comfortable and Monumental. Each creation is one of a kind, no two are the same. Made by order. Handmade in Italy.", it: "Questo pezzo è realizzato in pelle di montone conciata al vegetale. Assemblato con un taglio grezzo semicircolare, seguendo le forme naturali per essere Comodo e Monumentale. Ogni creazione è un pezzo unico, non ce ne sono due uguali. Su ordinazione. Fatto a mano in Italia."},
    fields: ["price", "materials", "measurements", "descriptionIt"],
  },
  "capo-11": {
    price: 1150,
    materials: {it: "Pelle conciata al vegetale, non tinta", en: "Undyed vegetable-tanned leather"},
    measurements: "Vita 44 cm. Cavallo 38 cm. Lunghezza 108 cm. Fondo 38 cm.",
    description: {en: "This piece is made from a Veg - Tanned Sheepskin leather. Assembled with a semicircular raw cut, following natural shapes to be Comfortable and Monumental. Each creation is one of a kind, no two are the same. Made by order. Handmade in Italy.", it: "Questo pezzo è realizzato in pelle di montone conciata al vegetale. Assemblato con un taglio grezzo semicircolare, seguendo le forme naturali per essere Comodo e Monumentale. Ogni creazione è un pezzo unico, non ce ne sono due uguali. Su ordinazione. Fatto a mano in Italia."},
    fields: ["price", "materials", "measurements", "descriptionIt"],
  },
  "capo-12": {
    name: "Corvinus",
    price: 675,
    materials: {it: "Pelle di agnello nera stropicciata", en: "Black crinkled lambskin"},
    measurements: "Torace 34 cm. Lunghezza 52 cm. Collo 36 cm.",
    description: {en: "A halter cut in one piece, tied at the throat. Your protector in those dark nights."},
    fields: ["name", "price", "materials", "measurements", "description"],
  },
  "capo-13": {
    name: "Nocte",
    price: 675,
    materials: {it: "Pelle conciata al vegetale e lino cerato", en: "Vegetable-tanned leather and waxed linen"},
    measurements: "Vita 38 cm. Lunghezza 78 cm.",
    description: {en: "Leather at the waist, linen below it. Hung from a chain because it has no fastening."},
    fields: ["name", "price", "materials", "measurements", "description"],
  },
  "capo-14": {
    name: "Vertex",
    price: 275,
    materials: {it: "Pelle nera conciata al vegetale", en: "Black vegetable-tanned leather"},
    measurements: "Circonferenza 58 cm. Visiera 7 cm.",
    description: {en: "Six panels and a stitched brim, made from what the trousers left."},
    fields: ["name", "price", "materials", "measurements", "description"],
  },
  glovyes: {
    price: 475,
    materials: {it: "Pelle di agnello nera", en: "Black lambskin"},
    measurements: "Lunghezza 46 cm. Polpaccio 38 cm.",
    description: {en: "Two separate tubes, crossed straps, a zip the length of the calf."},
    fields: ["price", "materials", "measurements", "description"],
  },
  "styrax-red": {
    price: 775,
    materials: {it: "Pelliccia di capra rossa e pelle", en: "Red goat shearling and leather"},
    measurements: "Torace 36 cm. Lunghezza 48 cm. Collo 38 cm.",
    // HIS description (2026-08-05), verbatim including "costumizable"; the
    // Italian is ours, flagged descriptionIt.
    description: {en: "This piece is made from a single whole Sheepskin with natural hair. It features an adjustable choker for a secure, costumizable fit plus waxed lacing at the attachment points. It moves like resin slowly, Inevitably you become one Creature with it. One Size. One of One. Color: Red. Handmade piece each one is unique.", it: "Questo pezzo è realizzato da un'unica pelle intera di montone con pelo naturale. Ha un choker regolabile per una vestibilità sicura e personalizzabile, più lacci cerati nei punti di attacco. Si muove come resina, lentamente: inevitabilmente diventi una sola Creatura con lui. Taglia unica. Pezzo unico. Colore: Rosso. Pezzo fatto a mano, ognuno è unico."},
    fields: ["price", "materials", "measurements", "descriptionIt"],
  },
  styrax: {
    price: 975,
    measurements: "Torace 36 cm. Lunghezza 48 cm. Collo 38 cm.",
    fields: ["price", "measurements", "descriptionIt"],
  },
  ghezard: {
    price: 1850,
    measurements: "Torace 58 cm. Spalle 46 cm. Lunghezza 70 cm.",
    fields: ["price", "measurements"],
  },
};

const GARMENTS = [
  {
    id: "piece-camicia-pelle-nera",
    stage: "tenebrae",
    slug: "capo-01",
    /*
      NOT NAMED. It is a black leather shirt, so OBLIVION by kind, but no frame
      of it is in the OBLIVION folder and both its source files went with
      products/. A name is not inferred from a folder it is absent from.
    */
    files: [
      ["salvage/capo-01-front", "Camicia in pelle nera stropicciata, vista frontale, appesa a un muro di cemento chiaro."],
      ["salvage/capo-01-close", "La stessa camicia in pelle nera vista piu da vicino, contro il muro di cemento."],
    ],
  },
  {
    id: "piece-giacca-orlo-smerlato",
    stage: "tenebrae",
    slug: "capo-02",
    // HIS NAME, from OBLIVION/"Oblivion Black lambskin.WEBP" and its siblings.
    name: "Oblivion",
    // HIS COMPOSITION, from the same filenames. Lambskin, and black.
    materials: {it: "Pelle di agnello nera", en: "Black lambskin"},
    files: [
      ["new/Oblivion Black lambskin", "Camicia in pelle nera con orlo a punte, vista frontale, appesa davanti a una serranda metallica."],
      ["new/oblv black lamb", "Fronte della camicia in pelle nera, con la fila di bottoni automatici."],
      ["dataset/IMG_3453", "Dettaglio del collo e della chiusura della camicia in pelle nera."],
      ["new/Oblivion black lambskin (1)", "Vista laterale della camicia in pelle nera, con l'orlo tagliato a punte."],
      ["dataset/IMG_3455", "Dettaglio dell'orlo a punte della camicia, contro il cemento."],
      ["new/Oblivion black lambskin (2)", "Retro della camicia in pelle nera appesa alla gruccia."],
      ["new/oblv black lamb (1)", "Dettaglio delle cuciture sulle spalle, sul retro della camicia."],
    ],
  },
  {
    id: "piece-gilet-zip",
    stage: "tenebrae",
    slug: "capo-03",
    // HIS NAME, from MONUMENTUS/"Monumentus Vest (Tenebrae).JPG".
    name: "Monumentus Vest",
    files: [["new/Monumentus Vest (Tenebrae)", "Gilet in pelle nera con zip centrale, appeso a una gruccia davanti a una serranda."]],
  },
  {
    id: "piece-top-leggero",
    stage: "tenebrae",
    slug: "capo-04",
    /*
      HIS NAME, from MONUMENTUS/"Monumentus Vest (Tenebrae.WEBP" (his unclosed
      bracket, not ours). The same name as capo-03 and a different object: this
      one is crinkled leather with snap fasteners, held up on a hanger, where
      capo-03 is smooth with a central zip. Recorded, not merged.
    */
    name: "Monumentus Vest",
    files: [["new/Monumentus Vest (Tenebrae", "Gilet in pelle nera stropicciata, con bottoni automatici al collo, tenuto in mano davanti a una serranda."]],
  },
  {
    id: "piece-pelle-drappeggiata",
    stage: "tenebrae",
    slug: "capo-05",
    // HIS NAME, from MONUMENTUS/"Monumentus Pants (Tenebrae).WEBP". The alt text
    // called this "a garment"; his filename says it is trousers.
    name: "Monumentus Pants",
    files: [
      ["new/Monumentus Pants (Tenebrae)", "Pantaloni in pelle nera appesi a una parete di cemento, sotto una croce di metallo."],
      ["new/Monumentus tenebrae", "Dettaglio ravvicinato degli stessi pantaloni in pelle nera, con zip e pieghe profonde."],
    ],
  },
  {
    id: "piece-pantaloni-pelle",
    stage: "tenebrae",
    slug: "capo-07",
    files: [
      ["salvage/capo-07-front", "Pantaloni ampi in pelle nera, vista frontale, con zip a vista e orlo grezzo."],
      ["salvage/capo-07-back", "Gli stessi pantaloni in pelle nera visti da dietro, con due tasche con zip."],
    ],
  },
  {
    /*
      SEVERYA (2026-08-04). His "1 of 1 Sample sale" folder gives the snake
      skirt its own life with four new product frames, so this document stops
      bundling it with the tube top and becomes the skirt: the thing that is
      actually for sale. The NAME is his, from the inscription photographed in
      his own hand (SEVERYA / LAMBSKIN / 100%), so it is no longer flagged. The
      on-model frames stay as evidence of the look worn. Slug changes to
      /severya; the old /capo-08 URL redirects.

      READY NOW, from his folder. A 1 of 1 arguably cannot be remade, which the
      order form's "as it is / remade" choice does not yet express; surfaced in
      the report rather than guessed at.
    */
    id: "piece-completo-fascia-gonna",
    stage: "tenebrae",
    slug: "severya",
    name: "Severya",
    // A PRIVATE COMMISSION, confirmed by the owner 2026-08-04: made once, to
    // someone's measurements, bought only as it is. Never offers a remake.
    availability: "unique",
    files: [
      ["sale/Snake skin mini skirt.JPG", "La minigonna in pelle effetto serpente, appesa davanti alla serranda, con l'orlo tagliato a punte."],
      ["sale/Snake skin mini skirt (1).JPG", "La stessa minigonna vista da vicino, con la zip centrale e la trama a squame."],
      ["salvage/capo-08-shadow", "Modella in top a fascia e minigonna di pelle nera, con ombre lunghe sul muro."],
      ["archive/IMG_0212", "La minigonna con la trama di serpente e il top a fascia, in piena luce."],
    ],
  },
  {
    // CONFIDENT. Leg warmers are unmistakable: two separate tubes, not joined.
    id: "piece-glovyes",
    slug: "glovyes",
    name: "Glovyes",
    stage: "tenebrae",
    files: [
      ["archive/IMG_0211", "Le ghette in pelle nera appese a una gruccia davanti a una serranda."],
      ["archive/IMG_0209", "Le due ghette distese sul cemento, con le cinghie incrociate."],
      ["archive/IMG_0210", "Dettaglio delle fibbie e delle cinghie sulle ghette."],
      ["archive/IMG_0214", "Le ghette viste da vicino, con le zip lungo il polpaccio."],
    ],
  },
  {
    /*
      CONFIRMED TWICE OVER. His caption named Styrax and the forest frame matched
      it; now his own filenames say "Stryax black goat" (his spelling) on the two
      flat frames, which is the same object worn in the forest shot.
    */
    id: "piece-styrax",
    slug: "styrax",
    name: "Styrax",
    stage: "tenebrae",
    materials: {it: "Pelliccia di capra e pelle", en: "Goat shearling and leather"},
    // HIS description (2026-08-05) replaced his earlier caption; the Italian
    // is ours. The garment's INVENTED entry adds descriptionIt to its flags.
    description: {en: "This piece is made from a single whole Sheepskin with natural hair. It features an adjustable choker for a secure, costumizable fit plus waxed lacing at the attachment points. It moves like resin slowly, Inevitably you become one Creature with it. One Size. Available. Color: Black. Handmade piece each one is unique.", it: "Questo pezzo è realizzato da un'unica pelle intera di montone con pelo naturale. Ha un choker regolabile per una vestibilità sicura e personalizzabile, più lacci cerati nei punti di attacco. Si muove come resina, lentamente: inevitabilmente diventi una sola Creatura con lui. Taglia unica. Disponibile. Colore: Nero. Pezzo fatto a mano, ognuno è unico."},
    files: [
      ["archive/IMG_0204", "Il top in pelliccia di capra e pelle, indossato, in un bosco di rami spogli."],
      ["styrax/Stryax black goat ", "Il top in pelliccia di capra disteso sul cemento, con il collo in pelle e i fili di cucitura."],
      ["styrax/Stryax black goat  (1)", "Dettaglio del collo in pelle con bottoni automatici, sulla pelliccia nera."],
      /*
        Two more from the same forest shoot, found by the sweep. They are
        PRODUCT, so they belong to the Creature rather than to the gallery, and
        section 43 asked for more frames on the pieces that had one or two.
      */
      ["styrax/PHOTO-2026-02-17-22-38-43 3", "Il top in pelliccia di capra indossato, di tre quarti, fra i rami."],
      ["styrax/PHOTO-2026-02-17-22-38-43 4", "Dettaglio del top in pelliccia indossato, con il collo in pelle allacciato."],
    ],
  },
  {
    /*
      CONFIDENT. "Goat Shearling featuring a Washed brown Leather" is the only
      brown piece in the entire set, and the fur lining is visible at the zip.
    */
    id: "piece-ghezard",
    slug: "ghezard",
    name: "Ghezard",
    // Brown, so neither tenebrae (black) nor lux (pale). Left unset on purpose.
    materials: {it: "Pelliccia di capra, pelle marrone lavata", en: "Goat shearling, washed brown leather"},
    description: {en: "Goat Shearling featuring a Washed brown Leather."},
    files: [
      ["archive/IMG_9568", "La giacca in pelle marrone con la fodera in pelliccia, distesa."],
      ["archive/IMG_9572", "Dettaglio della zip centrale e della pelliccia interna."],
      ["archive/IMG_9577", "Il retro della giacca marrone, disteso al sole sul cemento."],
      ["archive/IMG_9592", "La giacca marrone indossata, vista da dietro, con il collo alto."],
    ],
  },
  {
    /*
      The only bag in the set, so it is the bag from the price list. The list
      calls it a snakeskin mini bag and this leather reads as pebbled rather than
      snake, so the NAME is left as a placeholder for the owner.
    */
    id: "piece-borsa",
    slug: "capo-09",
    stage: "tenebrae",
    files: [
      ["archive/4d8045b4-5497-471d-9725-580a0bf932a3", "La borsa in pelle nera appesa a un ramo con una catena, con la patta sagomata."],
      ["archive/01323077-3c8b-4f10-bb66-6253bcf1bcb8", "La stessa borsa vista di fronte, con la catena raccolta."],
    ],
  },
  {
    // HIS NAME, from MONUMENTUS/"Monumentus pants (Lux).WEBP".
    id: "piece-chiari-corti",
    slug: "capo-10",
    stage: "lux",
    name: "Monumentus Pants",
    // HIS FOLDER: ARCHIVE SOLD OUT, CONFIRMED by the owner 2026-08-04.
    availability: "notOffered",
    availabilityNote: {it: "Sold out.", en: "Sold out."},
    files: [
      ["archive/IMG_3619", "Pantaloni chiari corti e ampi appesi a una gruccia sotto una croce di ferro."],
      ["archive/IMG_3625", "Il retro degli stessi pantaloni chiari, con due tasche con zip."],
      ["sold/Monumentus pants (Lux)", "Pantaloni chiari in pelle appesi dentro una cornice di metallo nero."],
      ["sold/Monumentus pants (Lux) ", "Dettaglio della cintura e delle tasche con zip sui pantaloni chiari."],
    ],
  },
  {
    /*
      HIS NAME, from MONUMENTUS/"Monumentus Lux .HEIC". Recorded separately from
      capo-10 because the lengths plainly differ, and now because he gave the two
      different names. If they are one Creature, merge them; that is his to say.
    */
    id: "piece-chiari-lunghi",
    slug: "capo-11",
    stage: "lux",
    name: "Monumentus Lux",
    // HIS FOLDER: ARCHIVE SOLD OUT, confirmed with capo-10.
    availability: "notOffered",
    availabilityNote: {it: "Sold out.", en: "Sold out."},
    files: [
      ["sold/Monumentus Lux ", "Uomo a figura intera con maglia trasparente e pantaloni chiari molto ampi."],
      ["archive/IMG_3472", "Gli stessi pantaloni chiari visti di profilo, nel laboratorio."],
      ["archive/IMG_1902", "Gli stessi pantaloni visti da dietro, mentre cammina nella luce."],
      ["sold/monumentus lux", "Uomo di spalle con i pantaloni chiari ampi, in laboratorio."],
    ],
  },
  {
    id: "piece-top-allacciato",
    slug: "capo-12",
    stage: "tenebrae",
    files: [
      ["experimental/IMG_3116", "Top in pelle nera stropicciata con collo alto allacciato, su un manichino chiaro, davanti ai cartamodelli."],
    ],
  },
  {
    /*
      THE HAT. It is on the price list at EUR 125 and it has never been
      photographed on its own; it exists in the DESIGNER PORTRAIT, sitting on
      the bench in the foreground.

      So its only frame is a 900x1200 crop out of that portrait. That is below
      the 2000px standard every other frame meets and it will be soft at full
      screen, and it is still better than a Creature with no photograph at all,
      which was the alternative. `isProvisional` marks it in the studio and the
      shot list carries the request. Replace it and delete the crop.
    */
    id: "piece-cappello",
    slug: "capo-14",
    stage: "tenebrae",
    provisional: true,
    files: [
      ["provisional/hat-from-portrait", "Il cappello in pelle nera appoggiato su una pelle intera, sul banco da lavoro."],
    ],
  },
  {
    id: "piece-gonna-pannelli",
    slug: "capo-13",
    stage: "tenebrae",
    files: [
      ["archive/IMG_1834", "Capo scuro con cintura in pelle e pannelli di tessuto, appeso a una catena."],
    ],
  },
  {
    /*
      STYRAX RED GOAT (2026-08-04), from his "1 of 1 Sample sale" folder, which
      also settles the old red-variant question: it is its own piece, one of
      one, for sale, with four frames including the first lining shot in the
      whole catalogue. Name and colour are his filenames; the rest is invented
      and flagged. Stage unset: red is neither Tenebrae nor Lux, exactly like
      the red shirt before it.
    */
    id: "piece-styrax-red",
    slug: "styrax-red",
    name: "Styrax Red Goat",
    availability: "unique",
    files: [
      ["sale/STYRAX RED GOAT.JPG", "Il top in pelliccia di capra rossa appeso sotto il crocifisso, contro il muro di cemento."],
      ["sale/STYRAX RED GOAT LINING.JPG", "L'interno del top rosso, con la fodera in pelle e i lacci."],
      ["styrax/STYRAX RED GOAT (1).JPG", "Il top in pelliccia rossa visto da vicino, con il collo in pelle nera."],
      ["sale/Stryax red goat ON FIT.jpg", "Il top in pelliccia rossa indossato, in un bosco di rami spogli."],
    ],
  },
];

/*
  ============ THE RED SHIRT LEFT THE CATALOGUE (2026-08-03) ============

  The owner's decision: he cannot source that hide. He searched for a month and
  goes to Solofra tomorrow to look for something close. A Creature that cannot be
  made is not something the site can offer, so it becomes a GALLERY frame: work
  that was made, not work that can be had.

  IT IS ONE FLAG, ON PURPOSE. If he finds a similar leather it comes back, so
  flip this to true and re-import: the document, its name, its composition, its
  seven photographs and its place in the worn band all return exactly as they
  were. Nothing about it has been deleted here.

  His filenames call it "oblv blood red lamb", so its name was never Rubedo:
  that was our inference from the alchemical stage (DESIGN-PLAN section 48).
*/
/*
  FLIPPED 2026-08-11 (section 80). The owner is content having it in the
  catalogue even though he cannot remake it in that hide: it has a name,
  photographs and a place in the work. It returns as `unique` — the state built
  for a piece that EXISTS and CANNOT BE REPEATED, which puts it in the "1 of 1"
  movement, gives it the buy action, and never offers a remake (section 67).
  It was `privateOrder` before, which means already somebody else's and carries
  no action at all; that is a different fact and it is not this one.
*/
const RED_SHIRT_IS_A_CREATURE = true;

const RED_SHIRT = {
  id: "piece-giacca-rossa",
  slug: "rubedo",
  name: "Rubedo",
  collection: null,
  stage: "rubedo",
  materials: {it: "Pelle di agnello rosso sangue", en: "Blood red lambskin"},
  description: {
    en: "Red and Black faded colour. 500 handmade scar-stitch. Oblivion hole on the back.",
    it: "Colore rosso e nero sfumato. 500 scar-stitch fatti a mano. Oblivion hole sulla schiena.",
  },
  availability: "unique",
  /*
    RE-KEYED 2026-08-11. All seven frames were reported missing when this came
    back, and none of them was: the OBLIVION folder went from the Drive on
    2026-08-04 and its contents moved into ARCHIVE SOLD OUT. The keys still
    pointed at the dead folder. Nothing was lost and nothing needed salvaging —
    the dry run said "the file moved (fix the key)" and it was right.
  */
  files: [
    ["sold/oblv blood red lamb.JPG", "Modella con camicia in pelle rossa e pantaloni neri lucidi, braccia incrociate, in laboratorio."],
    ["sold/oblv blood red lamb (2)", "La stessa camicia rossa vista di spalle, tra i capi appesi del laboratorio."],
    ["sold/oblv blood red lamb (1).JPG", "Modella a figura intera con la camicia in pelle rossa, nel laboratorio."],
    ["sold/Oblv blood red lamb (1).HEIC", "La camicia rossa appesa sotto un crocifisso, vista frontale."],
    ["sold/Oblivion blood red lamb", "Il retro della camicia rossa, con l'apertura a mandorla fra le scapole."],
    ["sold/oblv blood red lambskin ", "Dettaglio della camicia rossa: la manica lunga e l'orlo tagliato a punte."],
    ["sold/oblv blood red lamb.HEIC", "La camicia rossa su un manichino, vista ravvicinata."],
  ],
};

if (RED_SHIRT_IS_A_CREATURE) GARMENTS.push(RED_SHIRT);

/*
  THE GALLERY. Not an archive any more (DESIGN-PLAN section 18, rewritten), so
  the old rule of one frame per distinct piece is gone and the only test left is
  the one the owner set: a frame earns its place by being a good photograph.

  TWELVE, and the ORDER IS THE DESIGN. It runs dark to light, which is the
  site's own logic: an abstract study of folds, then the mark, then garments
  laid out, then details, then the pattern pieces where the work turns pale, and
  it closes on the one warm frame and the pale trousers in daylight. Nigredo to
  Albedo again, and nothing says so.

  ONE RULE KEPT, to stop the gallery becoming the index a second time: NEVER a
  Creature's lead frame. Where a piece recurs here it recurs through a secondary
  photograph, so a reader who has seen the index still meets something new.

  THE RED SHIRT JOINS IT (2026-08-03), one frame, not seven: the back view with
  the opening between the shoulder blades, which is the piece's whole signature
  and is the only frame of it that reads as an object rather than as a look. It
  sits at the end, after the page has turned pale, because it is the one red
  thing on the site and it is the last word rather than an interruption.
*/
const ARCHIVE = [
  ["experimental/IMG_2897", "Studio ravvicinato di pieghe profonde in un tessuto scuro, quasi astratto."],
  /*
    THE SWEEP (2026-08-03). Every photograph on the Drive was compared BY
    CONTENT against everything the site uses, which found eighteen genuinely
    unused. Only two of them are imagery; the rest are product or are not
    photographs, and the reasons are in DESIGN-PLAN section 64.

    IMG_2378 is the frame that opened the site until the drop replaced it: the
    darkest thing in the whole set, and it belongs to no Creature, so it opens
    the gallery's descent into black rather than sitting unused. `homepage (1)`
    was rejected from this page once for being too close to IMG_2378 while that
    was the ARRIVAL; with neither on the home page any more, the pair reads as
    one material studied twice, which is what a gallery is for.
  */
  ["homepage/IMG_2378", "Dettaglio ravvicinato della cintura di un capo in pelle grigio chiaro, con passante e zip, contro pelle nera."],
  ["homepage/homepage (1)", "Dettaglio ravvicinato di pelle chiara piegata, con una cucitura che la attraversa."],
  ["homepage/IMG_3434", "La firma del marchio impressa nella pelle nera, accanto a una zip."],
  ["archive/IMG_2235", "Capo in pelle nera aperto e disteso sul cemento, a forma di mantella."],
  ["salvage/gallery-fur", "Dettaglio della pelliccia nera con la linguetta di pelle e i fili di cucitura."],
  ["archive/IMG_2242", "Gilet smanicato in pelle nera disteso sul cemento."],
  ["new/Monumentus tenebrae", "Dettaglio ravvicinato di un capo in pelle nera, con zip e pieghe profonde."],
  ["archive/IMG_2244", "Un secondo gilet in pelle nera disteso sul cemento, visto di sbieco."],
  ["dataset/IMG_3455", "Dettaglio dell'orlo tagliato a punte, contro il cemento."],
  ["archive/IMG_2229", "Dettaglio di un capo in pelle scura con una zip lunga, disteso."],
  ["experimental/IMG_2894", "Studio ravvicinato di una pelle scura con pieghe profonde."],
  ["archive/IMG_9577", "La giacca in pelle marrone distesa al sole sul cemento, vista da dietro."],
  ["archive/IMG_3643", "Pantaloni chiari e gilet appesi insieme davanti a una serranda."],
  ...(RED_SHIRT_IS_A_CREATURE
    ? []
    : [["sold/Oblivion blood red lamb", "Il retro della camicia in pelle rosso sangue, con l'apertura a mandorla fra le scapole."]]),
];
/*
  THE ARRIVAL, and it is now the DROP (2026-08-03).

  The owner wants the home page to open on the texture of the new drop, and he
  is shooting a closer frame for it. Until that arrives this is the photograph he
  sent: the black crinkled leather halter top on a pale mannequin, in front of
  the paper patterns. It is `experimental/IMG_3116`, which is also capo-12's only
  frame, so the first screen and that Creature show the same object for now.

  Note that `homepage/IMG_3117` is a NEW file, a square 1263x1263 close study of
  the same crinkled leather. It is the texture frame he describes wanting, and at
  1263px square it is too small and the wrong shape for a full screen. Recorded
  rather than used.

  THIS FIELD BELONGS TO THE OWNER NOW. A brand that drops regularly changes this
  image often, and it must never need a developer: it is `openingMedia` in site
  settings, and the import will NOT overwrite a value he has set. See the write
  step at the end of this file.
*/
const OPENING = [
  "experimental/IMG_3116",
  "Top in pelle nera stropicciata con collo alto allacciato, su un manichino chiaro, davanti ai cartamodelli.",
];
/*
  WORN: the pieces on people, the horizontal band halfway down the home page.

  It draws one frame from every Creature that has an on-model photograph. The red
  shirt's tile is gone with it (2026-08-03): a band of "pieces on people" that
  links to a piece nobody can have would be an advertisement for a
  disappointment, and the frame lives on in the gallery instead.

  All portrait, because a band frame is a tall crop and a landscape source loses
  its subject in it.
*/
/*
  THE BAND, reordered by the owner 2026-08-11 (section 80).

  The red shirt leads. It is a photograph OF Rubedo, so with Rubedo back in the
  catalogue the band's first frame finally links to the piece it shows — the
  band exists to lead into the work, and its first tile is the one most likely
  to be tapped.

  The tibia frame LEFT for the Instagram strip. It carried no garment, so it was
  the one tile in the band that led nowhere.
*/
const WORN = [
  ...(RED_SHIRT_IS_A_CREATURE
    ? [["sold/oblv blood red lamb (1).JPG", "Modella a figura intera con la camicia in pelle rossa, nel laboratorio.", "piece-giacca-rossa"]]
    : []),
  ["salvage/capo-08-shadow", "Modella in top a fascia e gonna di pelle nera, con ombre lunghe sul cemento.", "piece-completo-fascia-gonna"],
  ["archive/IMG_0204", "Il top in pelliccia di capra e pelle indossato, in un bosco di rami spogli.", "piece-styrax"],
  ["sold/Monumentus Lux ", "Uomo a figura intera con pantaloni chiari molto ampi, in laboratorio.", "piece-chiari-lunghi"],
  ["archive/IMG_9592", "La giacca in pelle marrone indossata, vista da dietro, con il collo alto.", "piece-ghezard"],
];

/*
  THE MAKING, rebuilt 2026-08-03 on frames that are actually the work.

  It ran on two photographs of a black shearling laid on concrete, argued as one
  hide before and after construction. The owner's own reorganisation refutes
  that: he filed that object under STYRAX TOP, and the same piece is worn in the
  forest frames, so it is a finished Creature and the section's claim to be
  EVIDENCE was false (DESIGN-PLAN sections 27 and 47). Both files also went with
  products/, so keeping them would have meant salvaging the wrong argument.

  These two are the work itself, from his own process folder: the pattern
  weighted down on the hide with the cut chalked around it, then a piece taking
  shape on the stand. Cut, then build. The claim and the photographs now agree.
*/
/*
  SOLVET ET COAGULA, in the order of the work: the pattern drawn on the hide,
  the panels cut from it, the dye going on, the pieces hung to dry, the shape
  taken on the stand, then the parts and the finished garments on the bench.

  That order is a fact about how the work happens rather than a preference about
  how it looks, which is why this page needs no captions to be legible.
*/
const PROCESS = [
  ["process/IMG_3387", "Un cartamodello di cartone appoggiato su una pelle nera, tenuto fermo da due pietre, con il taglio segnato a gesso."],
  ["process/PHOTO-2026-03-02-17-18-45", "I pannelli dei pantaloni tagliati nella pelle nera, con i contorni ancora segnati a gesso."],
  ["process/IMG_2626", "Pennello largo appoggiato su una pelle appena tinta di scuro."],
  ["process/41e4e951-3ae6-41d9-ad81-c9bbd8ede7fa", "Capi neri appena tinti, appesi ad asciugare su una barra davanti a un muro chiaro."],
  ["process/PHOTO-2026-03-12-18-30-03", "Una pelliccia nera montata e spillata su un manichino, durante la lavorazione."],
  ["process/f797a2c2-9d6b-4416-b251-6503cdf63e67", "I pezzi del cartamodello in pelle chiara, tagliati e disposti sul banco."],
  ["process/387ba92d-448a-4763-a76b-fba6e046351a", "Due meta di un gilet in pelle chiara, distese aperte sul banco da lavoro."],
  ["process/PHOTO-2026-04-20-19-14-54", "Capi chiari finiti, distesi sul banco accanto al metro e alla riga."],
];

/*
  THE INSTAGRAM SELECTION. His photographs, chosen by US, which is why
  `instagramFrames` is flagged in inventedCopy: the heading is his handle and
  the frames link to his profile, so nothing here claims to be a live feed, but
  WHICH four appear is our editorial and he should replace it with what he
  actually wants shown.
*/
/*
  THE STRIP, rebuilt by the owner 2026-08-11 (section 80).

  Three frames left because they are all in the worn band now, and a square that
  repeats the band two screens above it is not a selection, it is an echo. What
  is left is what belongs to Instagram: the two frames that are only there, and
  the two photographs he sent for it.

  THE POST LINKS ARE IN THE PLAN NOW, not only in the studio. They were his to
  paste and they were preserved by key across imports (section 71); with the
  strip's contents changing under him, a key-matched value is a link that can
  silently attach to the wrong photograph. A link travels with its frame here.
  A frame with none is still legal and falls back to the profile.

  THE THIRD PHOTOGRAPH HE SENT IS NOT HERE. Only a screenshot exists of the man
  against the shutter, and a screenshot is about 1080px of already-compressed
  phone display. Four frames that are his beat five where one is soft.
*/
const INSTAGRAM = [
  ["tibia/Mnmnts Lux tibia cut", "Uomo con pantaloni corti chiari in pelle, contro un muro bianco.",
   "https://www.instagram.com/p/DayM6DEkYU1/"],
  ["tibia/Mnmnts Ten Tibia Cut", "Uomo con gilet in pelle nera e pantaloni corti in pelle, al sole sul cemento.",
   "https://www.instagram.com/p/DZHvqqXgkHL/"],
  ["instagram/ig-rock-sea.jpg", "Modella distesa su uno scoglio in giacca di pelle scura, il mare aperto intorno.",
   "https://www.instagram.com/p/DbJBaqyAvNt/"],
  ["instagram/ig-shutter-woman.jpg", "Modella con camicia in pelle nera dal collo alto, davanti a una serranda.",
   "https://www.instagram.com/p/DRCjLyVgsrN/"],
];

const MAKING = [
  ["process/IMG_3387", "Un cartamodello di cartone appoggiato su una pelle nera, tenuto fermo da due pietre, con il taglio segnato a gesso."],
  ["process/PHOTO-2026-03-12-18-30-03", "Una pelliccia nera montata e spillata su un manichino, durante la lavorazione."],
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
  // Pinned, not resolved: see salvage/monumentus-cover above for why.
  "salvage/monumentus-cover",
  "Dettaglio ravvicinato di una pelle chiara, con pieghe profonde e una cucitura che la attraversa.",
];

/*
  ================== THE BRAND'S OWN WORDS (supplied 2026-08-02) ==================

  Everything in OWNER_EN below is the owner's text, VERBATIM. It replaced the
  copy that had been written on his behalf, which was only ever a placeholder
  standing in for exactly this.

  THE RULE, and it is not negotiable. His sentences appear unaltered and in his
  order. The ONLY editorial act permitted here is deciding where each contiguous
  run of them is placed on the site. No sentence is trimmed, merged, reworded or
  paraphrased. Anything that fails that test is our writing and is marked as an
  unapproved draft (see FOOTER_COPY below, which is the only thing left that is).

  The runs, in his order, and where each one goes:

    1-2   the brand's reason for being   -> home, "the work"
    3-4   the Creature                   -> (about only)
    5-7   the collection                 -> collection statement
    8-10  the making                     -> home, "the making"

  The about page carries all ten, complete and unbroken. That is deliberate:
  every other placement is an excerpt WE chose, so there has to be one page
  where his text exists whole and a reader can judge it for themselves.

  ITALIAN IS OUR TRANSLATION, NOT HIS VOICE. He wrote in English. Italian is the
  site's default locale, so most visitors read words he has never approved, and
  the site says so on every block until he ticks Italian in the studio
  (siteSettings.approvedLanguages). Translating a brand's voice and presenting it
  as the brand's own is the one thing that would make this dishonest.

  Two notes on the translation, both deliberate:
  - "The garments are alchemical entities" is rendered "I capi sono entita
    alchemiche". His own English says "garments" in this one sentence even
    though he names the pieces Creature, and a faithful translation keeps what
    he wrote rather than tidying it.
  - Accents are correct Italian here (e, perche, cio, entita all carry them).
    The older interface strings drop them; that inconsistency is flagged in the
    design plan rather than silently spread.
*/
const OWNER_EN = {
  brand: [
    "Aleksander Cecco is born to tell what is slowly being forgotten: nature and its unpredictable forms, its textures, its imperfect perfection.",
    "The project lives between alchemy, esotericism and the primal link between human being and nature.",
  ].join("\n"),
  creature: [
    'We call our pieces "Creature" because for us they are living.',
    "Living textures. Entities with their own breath, born from the earth and worn on the body.",
  ].join("\n"),
  collection: [
    "We present MONUMENTUS: Tenebrae & Lux.",
    "Nigredo and Albedo explored as living textures.",
    "The garments are alchemical entities where decomposition and purification meet.",
  ].join("\n"),
  /*
    THE ONE EDIT WE HAVE MADE TO HIS OWN WORDS (2026-08-13, section 108). He
    wrote "In 100% vegetable-tanned leather, MADE TO MEASURE, handmade in South
    Italy." — capitalised here so a careless replace cannot eat the record. Two
    words were DELETED, nothing added, because the shop stopped selling made to
    measure on 2026-08-12 (section 98) and the sentence became false on a page a
    buyer reads. Flagged `aboutMadeToMeasure` in inventedCopy below; the flag
    comes off when he approves the shorter line. Restoring the phrase here
    republishes a false claim with every check green.
  */
  making: [
    "In 100% vegetable-tanned leather, handmade in South Italy. Every process is Artisan.",
    "A work of repetition, patience, and precision.",
    "This is what makes every piece similar, but never identical.",
  ].join("\n"),
  /*
    THE ORIGIN (supplied and approved 2026-08-04). His fifth passage, and the
    one that answers {DESIGNER_BIOGRAPHY}: the brand is TWO people and he named
    them himself, so the names are publishable because he published them.
    Verbatim, unaltered, in his order like everything else here.
  */
  origin: "The project began as an experimental line between the knowledge and vision of the two creators, Ciro Cecco and Ferdinando Palmieri, in collaboration with Ferdressed.",
  /** The shortest complete sentence he wrote. Two words over a photograph. */
  openingLine: "Living textures.",
};

/*
  ITALIAN, SUPPLIED AND AUTHORISED 2026-08-02. This is no longer our draft: the
  owner authorised the translation on the condition it stays faithful rather
  than adapted, and this is the text that came back. It replaces ours word for
  word, including the places where his differs from what we had written
  ("texture viventi" not "texture vive", "indossate sul corpo" not "portate sul
  corpo", "in cui" not "dove", "Su Misura" capitalised as he capitalises it).

  Consequence: approvedLanguages becomes ["en", "it"] and every translation mark
  on brand copy disappears from the site. What stays marked is the copy WE wrote,
  which is now only the two footer lines and the shipping and returns text.
*/
const OWNER_IT = {
  brand: [
    "Aleksander Cecco nasce per raccontare ciò che lentamente si sta dimenticando: la natura e le sue forme imprevedibili, le sue texture, la sua perfezione imperfetta.",
    "Il progetto vive tra alchimia, esoterismo e il legame primordiale tra essere umano e natura.",
  ].join("\n"),
  creature: [
    'Chiamiamo i nostri pezzi "Creature" perché per noi sono vive.',
    "Texture viventi. Entità con un respiro proprio, nate dalla terra e indossate sul corpo.",
  ].join("\n"),
  collection: [
    "Presentiamo MONUMENTUS: Tenebrae & Lux.",
    "Nigredo e Albedo esplorati come texture viventi.",
    "I capi sono entità alchemiche in cui decomposizione e purificazione si incontrano.",
  ].join("\n"),
  // As above (section 108): he wrote "conciata al vegetale, SU MISURA, fatta a
  // mano". The two words were deleted, not replaced, and the edit is flagged.
  making: [
    "In pelle 100% conciata al vegetale, fatta a mano nel Sud Italia. Ogni processo è artigianale.",
    "Un lavoro di ripetizione, pazienza e precisione.",
    "È questo che rende ogni pezzo simile, ma mai identico.",
  ].join("\n"),
  /*
    OUR TRANSLATION of his origin passage, flagged as `aboutOrigin` in
    inventedCopy until he approves it. The names and "Ferdressed" are proper
    nouns and are untouched; only the sentence around them is ours.
  */
  origin: "Il progetto nasce come linea sperimentale tra la conoscenza e la visione dei due creatori, Ciro Cecco e Ferdinando Palmieri, in collaborazione con Ferdressed.",
  openingLine: "Texture viventi.",
};

/** The complete text, his order, nothing cut. The about page shows this. */
const ABOUT_TEXT = {
  en: [OWNER_EN.brand, OWNER_EN.creature, OWNER_EN.making, OWNER_EN.origin].join("\n\n"),
  it: [OWNER_IT.brand, OWNER_IT.creature, OWNER_IT.making, OWNER_IT.origin].join("\n\n"),
};

/*
  The ONLY brand copy on the site still written by us. Kept separate from his
  text on purpose, and marked as an unapproved draft in BOTH languages, which no
  amount of approving a language changes. Facts corrected 2026-08-02: South
  Italy, not Italy; vegetable-tanned, not simply Italian leather. Naples is NOT
  used anywhere: his text says South Italy and the owner has not confirmed the
  city.
*/
/*
  SHIPPING, IN THREE PIECES (2026-08-03), because they have three standings.

  1. FREE SHIPPING is HIS fact and his words: free worldwide shipping over 500
     euro, always. It carries no mark. The Italian is a translation and is not
     marked either, on the rule section 40 already set: a composition, a price
     and a shipping threshold are FACTS like a reference code, not voice, and
     translating a fact is not putting words in his mouth.

  2. RETURNS is his facts in our wording: returns accepted, the customer pays
     the return shipping. Marked as ours, as it has been from the start. No
     window, no conditions, no "please note": none of that has been agreed and
     inventing it would be inventing policy.

  3. CUSTOMS OUTSIDE THE EU is a fact he has NOT confirmed. He says it is
     normally the customer and is checking with his partner. It ships marked as
     unconfirmed rather than either stated or withheld: at these prices a
     surprise customs bill is the kind of thing that ends a sale badly, and
     "we think, and are checking" is the honest position while it is true.
*/
const SHIPPING_FREE = {
  it: "Spedizione gratuita in tutto il mondo sopra i 500 euro.",
  en: "Free worldwide shipping over 500 euro.",
};

const SHIPPING_RETURNS = {
  it: "Resi accettati. La spedizione di reso è a carico del cliente.",
  en: "Returns accepted. The customer pays the return shipping.",
};

const SHIPPING_CUSTOMS = {
  it: "Fuori dall'Unione Europea, gli oneri doganali sono normalmente a carico del cliente.",
  en: "Outside the EU, customs charges are normally paid by the customer.",
};

const FOOTER_COPY = {
  // Tightened 2026-08-02 into his register: he drops the subject and states the
  // fact. "Handmade." not "we handmake". "Made to Measure." not "we offer".
  footerShipping: {
    it: "Spedito in tutto il mondo.",
    en: "Shipped worldwide.",
  },
  footerOrigin: {
    it: "Fatto a mano nel Sud Italia.",
    en: "Handmade in South Italy.",
  },
};

/*
  The about page opens on one photograph with "Living textures." over it, so the
  frame has to BE a texture. IMG_3436 is black leather at close range with the
  brand's own signature embossed into it: dark, intimate, and the mark is in the
  photograph rather than laid over it. 4284x5712, so it holds a full screen.

  It also rescues one of the three frames orphaned when the home tile grid was
  replaced (DESIGN-PLAN section 21).
*/
const ABOUT_OPENING = [
  "homepage/IMG_3436",
  "Dettaglio ravvicinato di pelle nera con la firma del marchio impressa, accanto a una zip.",
];

/*
  THE DESIGNER. HIS OWN CHOICE of portrait, supplied 2026-08-03 and used on his
  authority rather than on ours: he is bent over the bench inscribing "SEVERYA /
  LAMBSKIN / 100%" onto a piece in his own hand.

  It earns the place twice over. It is the strongest trust signal on the site
  (DESIGN-PLAN sections 32, 33, 41), and what it shows is the very act the
  Creature page is modelled on: section 26 took that inscription format from his
  captions, and here he is writing it on the object. The page and the photograph
  say the same thing without either explaining it.

  It also keeps his face out of the frame, which sits with section 44: whether
  the maker is named or shown in public is his decision and he has not made it.

  ONE RESERVATION, recorded rather than hidden: at 1200x1600 it is below the
  2000px floor every other full-bleed frame meets, and it carries the signature
  of a messaging app rather than a camera. The full-resolution original has been
  asked for. Chrome contrast measures ink at 6.2, comfortably legible, against
  9.02 for the portrait it replaces.
*/
const DESIGNER_PORTRAIT = [
  "artisan/DESIGNER",
  "Le mani di chi fa le Creature mentre scrive a mano il nome e la composizione su un capo in pelle nera.",
];

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
/*
  THE FOLDERS, and why the plan above does not name them literally.

  On 2026-08-03 the owner regrouped everything into PRODUCT FAMILIES and deleted
  products/ in the process (DESIGN-PLAN section 47). His folder names carry
  spaces, an ampersand, a spelling of his own ("COAUGULA"), and they will change
  again as the brand adds drops. So each family is indexed under BOTH its real
  name on disk and a short stable ALIAS, and the plan uses the alias. When he
  renames a folder, one line here changes and no frame reference moves.

  The legacy folders stay because most of the catalogue still only exists there.
*/
/*
  THE FOLDERS, third reorganisation (2026-08-04). He now files by STATUS, which
  is his shop's own vocabulary: NEW is the current drop, "1 of 1 Sample sale"
  is buyable one-offs, "ARCHIVE SOLD OUT" is sold. The dead aliases stay listed
  so a key that names one fails with a history rather than a mystery; their
  frames survive in the dataset and are RESCUED by position (see rescueMap).
*/
const FOLDERS = [
  // alias        folder on disk
  ["new", "NEW"],
  ["sale", "1 of 1   Sample sale"],
  ["sold", "ARCHIVE   SOLD OUT"],
  ["artisan", "Everything is done artisanally by us"],
  ["tibia", "MONUMENTUS TIBIA CUT"],
  ["styrax", "STYRAX TOP"],
  ["process", "SOLVET ET COAUGULA (PROCESS)"],
  ["homepage", "homepage"],
  // The frames he chooses for the strip, added 2026-08-11 (section 80).
  ["instagram", "INSTAGRAM"],
  // gone from the Drive 2026-08-04; kept so old keys resolve nowhere loudly
  ["monumentus", "MONUMENTUS LUX & TENEBRAE"],
  ["oblivion", "OBLIVION"],
  ["products", "products"],
  ["archive", "archive"],
  ["experimental", "experimental"],
];

/*
  AVAILABILITY, ANTICIPATED (2026-08-03). The owner is separating pieces that
  exist and can be had NOW from pieces that are made to order. He has made the
  first folder, `Disponibilita immediata`, and it is still empty.

  Membership is read by CONTENT, not by filename, because he will copy frames in
  rather than move them and Drive will name the copies whatever it likes. That
  is the same rule the survey settled on: hashes, never names (section 47).

  Until a frame appears in one of these folders every Creature keeps the default,
  made to order, which is what the whole site currently says. Nothing here
  guesses which piece is ready.
*/
const READY_FOLDERS = ["Disponibilita immediata", "Disponibilità immediata", "DISPONIBILITA IMMEDIATA"];

/** Marks a stem that two files share. Resolving one is an error, not a guess. */
const AMBIGUOUS = Symbol("ambiguous stem");

const index = new Map();
/** Content hashes of every file the owner has filed as available now. */
const readyHashes = new Set();
/** Whether an availability folder exists at all, empty or not. */
let readyFolderFound = false;

async function buildIndex() {
  /*
    PROVISIONAL frames live in this repository, not in the owner's Drive, which
    is his and is read only. See assets/provisional/README.md: each one is a
    request for a real photograph rather than a decision to keep it.
  */
  index.set("provisional/hat-from-portrait", "__repo__/assets/provisional/hat-from-portrait.jpg");

  for (const [alias, folder] of FOLDERS) {
    let entries = [];
    try {
      entries = await fs.readdir(path.join(SOURCE, folder));
    } catch {
      continue;
    }
    for (const name of entries) {
      if (name.startsWith(".")) continue;
      const stem = name.replace(/\.[^.]+$/, "");
      const key = `${alias}/${stem}`.toLowerCase();
      /*
        A stem is no longer unique. Section 18 recorded that extensions cannot
        be hard-coded, because the same batch mixes .JPG, .WEBP and .heic; his
        2026-08-03 renaming produced the inverse trap, two files with ONE stem
        and two extensions ("oblv blood red lamb.JPG" and ".HEIC"). Silently
        keeping the last one read would put the wrong photograph on a page, so
        an ambiguous stem is poisoned here and the plan must name the extension.
      */
      if (index.has(key) && index.get(key) !== `${folder}/${name}`) {
        index.set(key, AMBIGUOUS);
      } else {
        index.set(key, `${folder}/${name}`);
      }
      // The full filename always resolves, and is how the plan disambiguates.
      index.set(`${alias}/${name}`.toLowerCase(), `${folder}/${name}`);
    }
  }

  // The Drive folder name carries an accent and, on this machine, a trailing
  // space. Match loosely rather than demanding he type it exactly.
  let dirs = [];
  try {
    dirs = await fs.readdir(SOURCE, {withFileTypes: true});
  } catch {
    dirs = [];
  }
  for (const entry of dirs) {
    if (!entry.isDirectory()) continue;
    const flat = entry.name.normalize("NFD").replace(/\p{M}/gu, "").trim().toLowerCase();
    if (!READY_FOLDERS.some((f) => flat === f.normalize("NFD").replace(/\p{M}/gu, "").trim().toLowerCase())) {
      continue;
    }
    readyFolderFound = true;
    for (const name of await fs.readdir(path.join(SOURCE, entry.name))) {
      if (name.startsWith(".")) continue;
      const buffer = await fs.readFile(path.join(SOURCE, entry.name, name));
      readyHashes.add(createHash("sha1").update(buffer).digest("hex"));
    }
  }
}

/*
  RESCUE MODE (2026-08-04). The third reorganisation deleted 28 images from the
  Drive that exist only in Sanity now, and the second one nearly cost the
  catalogue. So the import stops depending on files persisting: a key whose
  file is gone is matched against the ORIGINAL FILENAME stored on the assets
  already uploaded, which is order-independent, and its overlay values are
  taken from wherever that asset currently appears. Every rescue is logged
  with what it matched. A key missing on disk AND unmatched in the dataset
  still fails loudly, because that is a photograph nobody has.
*/
const assetByFilename = new Map(); // lowercased originalFilename stem -> asset _id
const overlaysByAsset = new Map(); // asset _id -> {overlay, overlayCaption, captionPlacement}
const rescuedByKey = new Map();    // plan key -> {asset, overlay, overlayCaption, captionSafe, matched}
/*
  A key under the reserved alias `dataset/` names no file at all: it is an
  explicit statement that this frame lives only in Sanity, matched by the stem
  the file carried when it was FIRST uploaded (dedupe-by-sha1 keeps the first
  name forever, so a frame renamed on the Drive after upload is findable only
  by its original stem).
*/
const rescued = [];

async function buildRescueMap() {
  const assets = await client.fetch(`*[_type == "sanity.imageAsset"]{_id, originalFilename}`);
  for (const a of assets) {
    if (!a.originalFilename) continue;
    const stem = a.originalFilename.replace(/\.[^.]+$/, "").toLowerCase();
    if (!assetByFilename.has(stem)) assetByFilename.set(stem, a._id);
  }
  const uses = await client.fetch(
    `*[_type in ["garment", "archivePiece", "collection"] || _id == "siteSettings"]{
      "m": media[]{"a": poster.asset._ref, overlay, overlayCaption, captionPlacement},
      "c": cover{"a": poster.asset._ref, overlay, overlayCaption, captionPlacement},
      "s": [openingMedia, designerPortrait, aboutOpeningMedia]{"a": poster.asset._ref, overlay, overlayCaption, captionPlacement},
      "t": homeSequence[].media{"a": poster.asset._ref, overlay, overlayCaption, captionPlacement},
      "x": [makingMedia, processMedia, aboutMedia, instagramFrames][]{"a": poster.asset._ref, overlay, overlayCaption, captionPlacement}
    }`,
  );
  for (const doc of uses) {
    for (const m of [...(doc.m ?? []), doc.c, ...(doc.s ?? []), ...(doc.t ?? []), ...(doc.x ?? []).flat()]) {
      if (m?.a && !overlaysByAsset.has(m.a)) overlaysByAsset.set(m.a, m);
    }
  }
}

/** Try to rescue a missing key from the dataset. True when it succeeded. */
function tryRescue(key) {
  const [folder, ...rest] = key.split("/");
  const stem = rest.join("/").replace(/\.[^.]+$/, "").toLowerCase();
  // HEIC conversions were uploaded as folder_stem.jpg; the rest by their own name
  /*
    Three shapes a stored filename can take: alias_stem (HEIC converted while
    the alias matched the disk name), the bare stem (uploaded as-is), or
    DISKFOLDER_stem where the disk folder was the long original name. The third
    cannot be reconstructed from the alias, so it is found by suffix.
  */
  const candidates = [`${folder}_${stem}`, stem];
  const bySuffix = [...assetByFilename.keys()].find((k) => k.endsWith(`_${stem}`));
  if (bySuffix) candidates.push(bySuffix);
  for (const c of candidates) {
    const asset = assetByFilename.get(c);
    if (!asset) continue;
    const prior = overlaysByAsset.get(asset) ?? {};
    rescuedByKey.set(key, {
      asset,
      overlay: prior.overlay ?? "paper",
      overlayCaption: prior.overlayCaption ?? prior.overlay ?? "paper",
      captionSafe: (prior.captionPlacement ?? "over") === "over",
      matched: c,
    });
    rescued.push(`${key}  <-  dataset asset "${c}"`);
    return true;
  }
  return false;
}

/** Every plan key that named a file no longer on the Drive. Reported together. */
const missing = [];
/** Every plan key whose stem two files share. Also fatal, also reported. */
const ambiguous = [];

function resolveRel(key) {
  const found = index.get(key.toLowerCase());
  if (found === AMBIGUOUS) {
    ambiguous.push(key);
    return null;
  }
  if (!found) {
    missing.push(key);
    return null;
  }
  return found;
}

/**
 * Is this frame one the owner has filed as available now? Read by content, so
 * a copy under any name counts, and cheap: the file is read for upload anyway.
 */
async function isReadyNow(file) {
  if (!readyHashes.size || !file) return false;
  const buffer = await fs.readFile(file);
  return readyHashes.has(createHash("sha1").update(buffer).digest("hex"));
}

/**
 * HEIC cannot be uploaded: Sanity's pipeline does not handle it. sips converts
 * it natively on macOS. Output goes to the system temp directory, never into
 * the repository and never back into the owner's Drive.
 */
async function usableFile(key) {
  // A salvaged frame has no file: the asset is already in Sanity (see SALVAGED).
  if (key in SALVAGED) return null;
  const rel = resolveRel(key);
  if (rel === null) return null;
  // A provisional frame is already a usable JPEG sitting in this repository.
  if (rel.startsWith("__repo__/")) return path.resolve(rel.replace("__repo__/", ""));
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
// Files this run actually put into Sanity, as opposed to matched by sha1.
const uploadedThisRun = new Set();

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
    uploadedThisRun.add(file);
    console.log(`  uploaded ${path.basename(file)}  ${(buffer.length / 1024 / 1024).toFixed(1)}MB`);
  }
  uploaded.set(file, id);
  return id;
}

/*
  HOTSPOTS LIVE IN THE PLAN (2026-08-11, section 82).

  A hotspot decides what survives a square crop, and the Instagram frames are
  the only place the site crops to a square. The values were first set by a
  script in a scratchpad — which is how three tools have already been lost here
  — and would have been silently reverted by the next import, because
  createOrReplace writes what this file knows and drops what it does not.

  So they are here, next to the frame they belong to, and an import re-applies
  them. A frame with no entry keeps Sanity's default, which is the centre.
*/
const HOTSPOT = {
  // 1200x1600. 0.32 started the square at row 128, exactly where her hair
  // begins; 0.12 leaves about 80px of air above her head. Checked as rendered.
  "instagram/ig-shutter-woman.jpg": {x: 0.5, y: 0.12},
  // 1067x1600. She sits high and right; centring pushed her into the top edge.
  "instagram/ig-rock-sea.jpg": {x: 0.55, y: 0.33},
};

function mediaObject(assetId, altIt, overlay, key, overlayCaption, captionSafe = true, rel) {
  const spot = rel ? HOTSPOT[rel] : undefined;
  return {
    _type: "media",
    _key: key,
    poster: {
      _type: "image",
      asset: {_type: "reference", _ref: assetId},
      ...(spot ? {hotspot: {_type: "sanity.imageHotspot", ...spot, width: 0.6, height: 0.6}} : {}),
    },
    // Italian only: English falls back to it until a human writes one.
    alt: {_type: "localeString", it: altIt},
    altIsDraft: true,
    overlay,
    // The bottom band, measured separately (DESIGN-PLAN section 58).
    overlayCaption: overlayCaption ?? overlay,
    /*
      OVER the picture only when a polarity survives the worst cell of the bottom
      third; otherwise on the page below it, which is legible by construction.
      Measured, not chosen (DESIGN-PLAN section 58).
    */
    captionPlacement: captionSafe ? "over" : "below",
  };
}

/** One place the archive id is derived, so the writer and the cleanup agree. */
function archiveId(rel) {
  return `archive-${path
    .basename(rel)
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`;
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
    ...PROCESS.map(([f]) => f),
    ...INSTAGRAM.map(([f]) => f),
    ABOUT_OPENING[0],
    DESIGNER_PORTRAIT[0],
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
    if (file && file.startsWith(TMP)) converted++;
    usable.set(key, file);
  }

  /*
    EVERY missing key, not just the first. The old version threw on the first
    one, so a reorganisation that moved thirty files took thirty runs to
    diagnose. It still refuses to write anything: an import that quietly dropped
    a Creature's photographs would be worse than one that stops.
  */
  /*
    RESCUE before refusing: a key whose file left the Drive but whose asset is
    already in the dataset is reused from there. Only what is truly nowhere
    aborts the run.
  */
  await buildRescueMap();
  for (const key of [...missing]) {
    if (tryRescue(key)) missing.splice(missing.indexOf(key), 1);
  }
  if (rescued.length) {
    console.log(`\nRescued from the dataset (file gone from the Drive):`);
    for (const line of rescued) console.log(`  ${line}`);
  }

  if (missing.length || ambiguous.length) {
    if (missing.length) {
      console.error(`\n${missing.length} frames are not on the Drive under the name the plan uses:\n`);
      for (const key of missing) console.error(`  ${key}`);
      console.error(
        "\nEither the file moved (fix the key, or add its folder to FOLDERS above)" +
          "\nor it is gone (ask the owner; if it is truly gone, salvage it from Sanity" +
          "\nlike the entries in SALVAGED).\n",
      );
    }
    if (ambiguous.length) {
      console.error(`\n${ambiguous.length} keys name a stem that two files share:\n`);
      for (const key of ambiguous) console.error(`  ${key}`);
      console.error("\nName the extension too, e.g. oblivion/oblv blood red lamb.JPG\n");
    }
    process.exitCode = 1;
    return;
  }

  const salvaged = unique.filter((key) => key in SALVAGED);
  if (salvaged.length) {
    console.log(`  ${salvaged.length} salvaged from Sanity (source file gone from the Drive)`);
  }
  console.log(`  ${converted} converted, ${unique.length - converted - salvaged.length} used as they are\n`);

  console.log("Measuring where the chrome sits, to choose paper or ink per photograph:");
  const files = unique
    .filter((key) => !rescuedByKey.has(key))
    .map((key) => usable.get(key))
    .filter(Boolean);
  const overlays = await measureOverlay(files);
  for (const rel of unique) {
    if (rel in SALVAGED) {
      console.log(`  ${SALVAGED[rel].overlay.padEnd(5)} recorded      ${rel}`);
      continue;
    }
    if (rescuedByKey.has(rel)) {
      console.log(`  ${rescuedByKey.get(rel).overlay.padEnd(5)} rescued       ${rel}`);
      continue;
    }
    const m = overlays.get(usable.get(rel));
    console.log(`  ${m.overlay.padEnd(5)} contrast ${String(m.contrast).padStart(5)}  ${rel}`);
  }

  /*
    WHICH CREATURE ARE AVAILABLE NOW. Read from the owner's own folder, by
    content, so a copy of a frame under any name counts (see READY_FOLDERS).
    A Creature is available now when ANY of its frames is filed there.
  */
  const readyCreature = new Set();
  if (readyHashes.size) {
    for (const g of GARMENTS) {
      for (const [key] of g.files) {
        if (await isReadyNow(usable.get(key))) {
          readyCreature.add(g.id);
          break;
        }
      }
    }
    console.log(
      `\nAvailable now, from the owner's folder: ${readyCreature.size || "none"}` +
        (readyCreature.size ? ` (${[...readyCreature].join(", ")})` : ""),
    );
  } else {
    console.log(
      readyFolderFound
        ? "\nThe availability folder is empty, so every Creature stays made to order."
        : "\nNo availability folder on the Drive, so every Creature stays made to order.",
    );
  }

  if (DRY) {
    console.log("\n--dry: nothing uploaded, nothing written.");
    return;
  }

  console.log("\nUploading:");
  const assets = new Map();
  const freshKeys = [];
  for (const rel of unique) {
    const before = uploadedThisRun.size;
    assets.set(
      rel,
      rescuedByKey.get(rel)?.asset ??
        (rel in SALVAGED ? SALVAGED[rel].asset : await uploadOnce(usable.get(rel))),
    );
    if (uploadedThisRun.size > before) freshKeys.push(rel);
  }

  /*
    WHAT WAS NEW THIS RUN, said out loud (2026-08-11, section 80).

    A key that has resolved to the same photograph for a week can resolve to a
    different one tomorrow, because the Drive belongs to the owner and he adds
    files to it. When that happens the import uploads a new asset and swaps the
    picture without a word — which is how a screenshot of another website became
    the drop's cover.

    An upload is the exact moment that happens. Two or three lines here is the
    whole check: a human reading them knows which photographs he added, and any
    line he does not recognise is a frame that just changed underneath the plan.
  */
  if (freshKeys.length) {
    console.log("\nNEW to the dataset this run — recognise every one of these:");
    for (const rel of freshKeys) console.log(`  uploaded      ${rel}`);
    console.log("  A key you did not expect here means the Drive changed under the plan.");
  }

  const ov = (rel) =>
    OVERLAY_OVERRIDE[rel] ??
    rescuedByKey.get(rel)?.overlay ??
    (rel in SALVAGED ? SALVAGED[rel].overlay : overlays.get(usable.get(rel)).overlay);
  /*
    The caption band. A salvaged frame has no file to measure, so it keeps the
    chrome value it already had; everything else is measured at the bottom.
  */
  const ovc = (rel) =>
    rescuedByKey.get(rel)?.overlayCaption ??
    (rel in SALVAGED ? SALVAGED[rel].overlay : overlays.get(usable.get(rel)).overlayCaption);
  /*
    Can a caption sit on this photograph at all, at any crop? A SALVAGED frame
    has no file to measure, and "unmeasurable" defaulted to "yes", which is how
    capo-01 kept an unreadable caption through three rounds of fixing exactly
    this. Unmeasurable now means the caption goes below the frame, where it is
    legible by construction.
  */
  const safe = (rel) =>
    rescuedByKey.has(rel)
      ? rescuedByKey.get(rel).captionSafe
      : rel in SALVAGED
        ? false
        : overlays.get(usable.get(rel)).captionSafeOnImage;

  console.log("\nWriting documents:");

  // The collection every imported garment belongs to. Name and statement are
  // the owner's to write, so they ship as marked placeholders. No season: the
  // brand does not work in seasons (DESIGN-PLAN section 17).
  const COLLECTION_ID = "collection-01";
  await client.createOrReplace({
    _id: COLLECTION_ID,
    _type: "collection",
    // Named by the owner, 2026-08-02. {COLLECTION_NAME} is retired.
    name: "MONUMENTUS: Tenebrae & Lux",
    slug: {_type: "slug", current: "monumentus"},
    statement: {_type: "localeText", it: OWNER_IT.collection, en: OWNER_EN.collection},
    cover: mediaObject(assets.get(COLLECTION_COVER[0]), COLLECTION_COVER[1], ov(COLLECTION_COVER[0]), "cover", ovc(COLLECTION_COVER[0]), safe(COLLECTION_COVER[0])),
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
      // His name where a caption could be matched to a photograph, a marked
      // placeholder where it could not. Never a guessed name.
      name: g.name ?? INVENTED[g.slug]?.name ?? "{GARMENT_NAME}",
      slug: {_type: "slug", current: g.slug},
      /*
        No reference codes exist. Rather than invent a numbering system, which
        would be a fact about how the brand works rather than a plausible value,
        the field is left EMPTY and the pages simply do not show one.
      */
      referenceCode: undefined,
      collection: g.collection === null ? undefined : {_type: "reference", _ref: COLLECTION_ID},
      stage: g.stage ?? null,
      currency: "EUR",
      /*
        Composition per Creature, or nothing. The old "100% Italian leather"
        line named a country rather than a material and is gone; filling every
        unmatched piece with "vegetable-tanned" instead would only be a newer
        generic line asserted about pieces nobody has verified.
      */
      materials: {_type: "localeText", ...(g.materials ?? INVENTED[g.slug]?.materials ?? {})},
      measurements: INVENTED[g.slug]?.measurements,
      description: {_type: "localeText", ...(g.description ?? INVENTED[g.slug]?.description ?? {})},
      price: INVENTED[g.slug]?.price,
      // Everything on this document that we wrote rather than he did.
      wornBy: WORN_BY[g.slug],
      inventedFields: [...(INVENTED[g.slug]?.fields ?? []), ...(WORN_BY[g.slug] ? ["wornBy"] : [])],
      media: g.files.map(([rel, alt], i) => ({
        ...mediaObject(assets.get(rel), alt, ov(rel), `m${i}`, ovc(rel), safe(rel)),
        ...(g.provisional ? {isProvisional: true} : {}),
      })),
      /*
        Two real states now (DESIGN-PLAN section 49). His folder decides:
        a Creature filed as available now is `readyNow`, everything else keeps
        the default. An explicit value in the plan still wins, because "private
        order" is a fact about a piece rather than a question about stock.
      */
      availability: g.availability ?? (readyCreature.has(g.id) ? "readyNow" : "madeToOrder"),
      // "Sold out." on the sold pieces is HIS label, from his own folder name.
      availabilityNote: g.availabilityNote ? {_type: "localeString", ...g.availabilityNote} : undefined,
      orderRank: `0|${rank}:`,
    });
    console.log(
      `  creature      ${(g.name ?? g.slug).padEnd(22)} ${g.files.length} photographs` +
        (readyCreature.has(g.id) ? "  AVAILABLE NOW" : ""),
    );
  }

  rank = 100000;
  for (const [rel, alt] of ARCHIVE) {
    rank += 1000;
    const id = archiveId(rel);
    await client.createOrReplace({
      _id: id,
      _type: "archivePiece",
      title: "{NOME_PEZZO}",
      year: "{ANNO}",
      media: [mediaObject(assets.get(rel), alt, ov(rel), "m0", ovc(rel), safe(rel))],
      orderRank: `0|${rank}:`,
    });
    console.log(`  archive       ${id}`);
  }

  const settings = (await client.fetch(`*[_id == "siteSettings"][0]`)) || {};
  // The owner's per-post links survive an import (section 71): they exist
  // only in the studio, so overwriting them would erase his work.
  const existingPostUrls = new Map(
    (settings.instagramFrames ?? [])
      .filter((f) => f?._type === "instagramFrame" && f.postUrl)
      .map((f) => [f._key, f.postUrl]),
  );

  /*
    THE ARRIVAL BELONGS TO THE OWNER (2026-08-03).

    The home page opens on the current drop, and a brand that drops regularly
    changes that image often. It must never need a developer, so it is one field
    in the studio, and this script will NOT overwrite a choice he has made there.
    Run with --set-arrival to force the plan's frame in instead.

    Without this the promise would be false in the worst way: he would set the
    image, someone would run an unrelated import, and it would silently revert.
  */
  /*
    THE CONTACT ADDRESS, supplied by the owner 2026-08-03. It is written only
    when site settings carry none, for the same reason the arrival is: it is his
    field to change and an unrelated import must not walk over it. This is what
    took the top item off the launch checklist.
  */
  const CONTACT_EMAIL = "aleksandercecco@gmail.com";

  const forceArrival = process.argv.includes("--set-arrival");
  const ownerSetArrival = Boolean(settings.openingMedia?.poster?.asset?._ref) && !forceArrival;
  if (ownerSetArrival) {
    console.log("  arrival       left as the owner set it (--set-arrival overrides)");
  }

  await client.createOrReplace({
    ...settings,
    _id: "siteSettings",
    _type: "siteSettings",
    contactEmail: settings.contactEmail?.trim() || CONTACT_EMAIL,
    openingMedia: ownerSetArrival
      ? settings.openingMedia
      : mediaObject(assets.get(OPENING[0]), OPENING[1], ov(OPENING[0]), "opening", ovc(OPENING[0]), safe(OPENING[0])),
    homeSequence: WORN.map(([rel, alt, garmentId], i) => ({
      _type: "homeTile",
      _key: `t${i}`,
      media: mediaObject(assets.get(rel), alt, ov(rel), `tm${i}`, ovc(rel), safe(rel)),
      ...(garmentId ? {garment: {_type: "reference", _ref: garmentId}} : {}),
    })),
    makingMedia: MAKING.map(([rel, alt], i) => mediaObject(assets.get(rel), alt, ov(rel), `k${i}`, ovc(rel), safe(rel))),
    // Each frame wraps its media with a per-post link (section 71). The
    // owner's own postUrl values are preserved by key, never invented.
    instagramFrames: INSTAGRAM.map(([rel, alt, postUrl], i) => ({
      _type: "instagramFrame",
      _key: `igf${i}`,
      media: mediaObject(assets.get(rel), alt, ov(rel), `g${i}`, ovc(rel), safe(rel), rel),
      // The plan's link wins where it has one, because it travels with the
      // photograph. Where it has none, whatever he pasted in the studio stands.
      postUrl: postUrl ?? existingPostUrls.get(`igf${i}`) ?? null,
    })),
    processMedia: PROCESS.map(([rel, alt], i) => mediaObject(assets.get(rel), alt, ov(rel), `p${i}`, ovc(rel), safe(rel))),

    // His words, in the two places each run belongs.
    homeStatement: {_type: "localeText", it: OWNER_IT.brand, en: OWNER_EN.brand},
    makingStatement: {_type: "localeText", it: OWNER_IT.making, en: OWNER_EN.making},

    // The about page: his text complete, unbroken, in his order.
    designerPortrait: mediaObject(assets.get(DESIGNER_PORTRAIT[0]), DESIGNER_PORTRAIT[1], ov(DESIGNER_PORTRAIT[0]), "designer", ovc(DESIGNER_PORTRAIT[0]), safe(DESIGNER_PORTRAIT[0])),
    aboutOpeningMedia: mediaObject(assets.get(ABOUT_OPENING[0]), ABOUT_OPENING[1], ov(ABOUT_OPENING[0]), "aboutOpening", ovc(ABOUT_OPENING[0]), safe(ABOUT_OPENING[0])),
    aboutOpeningLine: {_type: "localeString", it: OWNER_IT.openingLine, en: OWNER_EN.openingLine},
    about: {_type: "localeText", ...ABOUT_TEXT},
    // The story is HIS now, so it is not our draft in any language.
    aboutIsDraft: false,

    // Ours, and still drafts in both languages.
    footerShipping: {_type: "localeText", ...FOOTER_COPY.footerShipping},
    footerOrigin: {_type: "localeText", ...FOOTER_COPY.footerOrigin},
    // His fact, his words, unmarked.
    shippingFree: {_type: "localeText", ...SHIPPING_FREE},
    // His facts, our wording, marked as ours.
    shippingReturns: {_type: "localeText", ...SHIPPING_RETURNS},
    // Ours AND unconfirmed until his partner confirms it.
    shippingCustoms: {_type: "localeText", ...SHIPPING_CUSTOMS},
    shippingCustomsIsProvisional: true,
    /*
      Copy WE wrote, listed rather than shown on the page (DESIGN-PLAN section
      59). `npm run launch-check` refuses while this is non-empty.
    */
    /*
      THE BRAND IS TWO PEOPLE (2026-08-04). He named them, so they are named.
      Ferdressed is his own established shop and it is linked out because an
      established shop vouching for a young label is the strongest trust signal
      an international buyer gets (section 32's argument, answered by a fact
      rather than by copy).
    */
    creators: ["Ciro Cecco", "Ferdinando Palmieri"],
    partnerName: "Ferdressed",
    partnerUrl: "https://ferdressed.com",
    inventedCopy: [
      "footerShipping",
      "footerOrigin",
      "shippingReturns",
      "shippingCustoms",
      "homeLines",
      "enquiryCopy",
      "availabilityCopy",
      "instagramFrames",
      "shopIntro",
      "dropsIntro",
      "contactIntro",
      "aboutOrigin",
      /*
        DRIFT, CORRECTED 2026-08-13. This list is written WHOLE, so anything set
        in the studio and missing here is silently un-flagged by an import. Two
        flags had drifted out of it — `processText` (section 81) and
        `madeToMeasureLine` (section 98) — and a run of this script would have
        laundered both: our copy on two pages would have stopped being counted
        by launch-check with every check green. That is section 5's second trap
        wearing a different hat.
      */
      "processText",
      "madeToMeasureLine",
      // The one edit to HIS text, section 108. See the making lines above.
      "aboutMadeToMeasure",
    ],
    footerCopyIsDraft: true,

    // BOTH now. He wrote the English and authorised the Italian above, so no
    // brand copy on the site is an unapproved translation any more.
    approvedLanguages: ["en", "it"],
  });
  console.log("  siteSettings  his words, English and Italian both approved");

  /*
    STALE DOCUMENTS THIS SCRIPT USED TO OWN.

    createOrReplace writes what is in the plan and says nothing about what has
    LEFT it. When four archive frames were promoted to Creature on 2026-08-02
    the old archivePiece documents stayed behind, so the same object would have
    appeared twice under two different ideas of what it is.

    Scoped deliberately: only ids this script generates, `piece-` and `archive-`.
    Anything a human made in the studio is not ours to remove.
  */
  const planned = new Set([
    ...GARMENTS.map((g) => g.id),
    ...ARCHIVE.map(([rel]) => archiveId(rel)),
  ]);
  const stale = await client.fetch(
    `*[_type in ["garment", "archivePiece"] && (_id match "piece-*" || _id match "archive-*")]{_id}`,
  );
  const orphans = stale.map((d) => d._id).filter((id) => !planned.has(id));
  if (orphans.length) {
    console.log("\nRemoving documents this script no longer owns:");
    for (const id of orphans) {
      console.log(`  deleted       ${id}`);
      await client.delete(id).catch(() => {});
      await client.delete(`drafts.${id}`).catch(() => {});
    }
  }

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

  /*
    THE CHROME BAND NO LONGER EXISTS (2026-08-11, section 87).

    This used to chain `measure-chrome --write` after every import, because
    createOrReplace silently dropped `overlayChrome` — a field this file does not
    know about — and the first import after that field was added wiped all 91
    values without a word.

    The field is gone: the signature and MENU stopped floating over photography
    and sit in page ground, so there is no band to measure. The hazard it guarded
    against has not gone anywhere, though, and it is worth leaving the shape of
    it here: THIS SCRIPT OWNS THESE DOCUMENTS, so it owns everything they carry.
    Anything added to the media object that this file does not write is a value
    the next import will silently delete.
  */
}

main().catch((error) => {
  console.error("\nImport failed:", error.message);
  process.exit(1);
});
