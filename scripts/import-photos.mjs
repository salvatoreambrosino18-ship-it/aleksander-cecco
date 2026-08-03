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
  "experimental/DESIGNER": "paper",
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
    measurements: "Torace 52 cm. Spalle 42 cm. Lunghezza 64 cm. Manica 68 cm.",
    description: {en: "The Oblivion shirt in black lambskin. Pointed hem, pointed cuffs, an opening between the shoulder blades."},
    fields: ["price", "measurements", "description"],
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
    description: {en: "Trousers built from four panels, the seams left where the hide ended."},
    fields: ["price", "materials", "measurements", "description"],
  },
  "capo-07": {
    name: "Aleya",
    price: 1150,
    materials: {it: "Pelle nera lavata, conciata al vegetale", en: "Black washed vegetable-tanned leather"},
    measurements: "Vita 44 cm. Cavallo 36 cm. Lunghezza 102 cm. Fondo 32 cm.",
    description: {en: "Wide through the leg, cut raw at the hem. Two zipped pockets at the back."},
    fields: ["name", "price", "materials", "measurements", "description"],
  },
  "capo-08": {
    name: "Severya",
    price: 875,
    materials: {it: "Pelle di agnello, stampa serpente", en: "Snake-embossed lambskin"},
    measurements: "Gonna: vita 34 cm, lunghezza 62 cm. Fascia: torace 32 cm.",
    description: {en: "Handmade snake skirt, with the band that is worn above it."},
    fields: ["name", "price", "materials", "measurements", "description"],
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
    description: {en: "The Lux cut, stopped at the shin. The leather is left as it comes out of the pit."},
    fields: ["price", "materials", "measurements", "description"],
  },
  "capo-11": {
    price: 1150,
    materials: {it: "Pelle conciata al vegetale, non tinta", en: "Undyed vegetable-tanned leather"},
    measurements: "Vita 44 cm. Cavallo 38 cm. Lunghezza 108 cm. Fondo 38 cm.",
    description: {en: "Full length and very wide, pooling at the ankle."},
    fields: ["price", "materials", "measurements", "description"],
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
  styrax: {
    price: 975,
    measurements: "Torace 36 cm. Lunghezza 48 cm. Collo 38 cm.",
    fields: ["price", "measurements"],
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
      ["oblivion/Oblivion Black lambskin", "Camicia in pelle nera con orlo a punte, vista frontale, appesa davanti a una serranda metallica."],
      ["oblivion/oblv black lamb", "Fronte della camicia in pelle nera, con la fila di bottoni automatici."],
      ["oblivion/Oblivion black lambskin (3)", "Dettaglio del collo e della chiusura della camicia in pelle nera."],
      ["oblivion/Oblivion black lambskin (1)", "Vista laterale della camicia in pelle nera, con l'orlo tagliato a punte."],
      ["oblivion/oblv black lamb (2)", "Dettaglio dell'orlo a punte della camicia, contro il cemento."],
      ["oblivion/Oblivion black lambskin (2)", "Retro della camicia in pelle nera appesa alla gruccia."],
      ["oblivion/oblv black lamb (1)", "Dettaglio delle cuciture sulle spalle, sul retro della camicia."],
    ],
  },
  {
    id: "piece-gilet-zip",
    stage: "tenebrae",
    slug: "capo-03",
    // HIS NAME, from MONUMENTUS/"Monumentus Vest (Tenebrae).JPG".
    name: "Monumentus Vest",
    files: [["monumentus/Monumentus Vest (Tenebrae)", "Gilet in pelle nera con zip centrale, appeso a una gruccia davanti a una serranda."]],
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
    files: [["monumentus/Monumentus Vest (Tenebrae", "Gilet in pelle nera stropicciata, con bottoni automatici al collo, tenuto in mano davanti a una serranda."]],
  },
  {
    id: "piece-pelle-drappeggiata",
    stage: "tenebrae",
    slug: "capo-05",
    // HIS NAME, from MONUMENTUS/"Monumentus Pants (Tenebrae).WEBP". The alt text
    // called this "a garment"; his filename says it is trousers.
    name: "Monumentus Pants",
    files: [
      ["monumentus/Monumentus Pants (Tenebrae)", "Pantaloni in pelle nera appesi a una parete di cemento, sotto una croce di metallo."],
      ["monumentus/Monumentus tenebrae", "Dettaglio ravvicinato degli stessi pantaloni in pelle nera, con zip e pieghe profonde."],
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
    id: "piece-completo-fascia-gonna",
    stage: "tenebrae",
    slug: "capo-08",
    /*
      NOT NAMED, still. The SKIRT is Severya: the designer photograph shows him
      inscribing "SEVERYA / LAMBSKIN / 100%" onto it in his own hand
      (DESIGN-PLAN section 48). But this document bundles the skirt with a tube
      top, and naming the pair after one of them, or splitting it, is his call.
    */
    files: [
      ["salvage/capo-08-shadow", "Modella in top a fascia e gonna di pelle nera, con ombre lunghe sul muro."],
      ["salvage/capo-08-light", "La stessa uscita in piena luce, con stivali alti."],
      ["salvage/capo-08-hem", "Dettaglio della gonna in pelle nera con orlo a punte, indossata."],
      ["archive/IMG_0212", "La gonna con la trama di serpente e il top a fascia, in piena luce."],
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
    description: {en: "Handmade Goat Sherling & Leather Top."},
    files: [
      ["archive/IMG_0204", "Il top in pelliccia di capra e pelle, indossato, in un bosco di rami spogli."],
      ["styrax/Stryax black goat ", "Il top in pelliccia di capra disteso sul cemento, con il collo in pelle e i fili di cucitura."],
      ["styrax/Stryax black goat  (1)", "Dettaglio del collo in pelle con bottoni automatici, sulla pelliccia nera."],
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
    files: [
      ["archive/IMG_3619", "Pantaloni chiari corti e ampi appesi a una gruccia sotto una croce di ferro."],
      ["archive/IMG_3625", "Il retro degli stessi pantaloni chiari, con due tasche con zip."],
      ["monumentus/Monumentus pants (Lux)", "Pantaloni chiari in pelle appesi dentro una cornice di metallo nero."],
      ["monumentus/Monumentus pants (Lux) ", "Dettaglio della cintura e delle tasche con zip sui pantaloni chiari."],
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
    files: [
      ["monumentus/Monumentus Lux ", "Uomo a figura intera con maglia trasparente e pantaloni chiari molto ampi."],
      ["archive/IMG_3472", "Gli stessi pantaloni chiari visti di profilo, nel laboratorio."],
      ["archive/IMG_1902", "Gli stessi pantaloni visti da dietro, mentre cammina nella luce."],
      ["monumentus/monumentus lux", "Uomo di spalle con i pantaloni chiari ampi, in laboratorio."],
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
const RED_SHIRT_IS_A_CREATURE = false;

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
  availability: "privateOrder",
  files: [
    ["oblivion/oblv blood red lamb.JPG", "Modella con camicia in pelle rossa e pantaloni neri lucidi, braccia incrociate, in laboratorio."],
    ["oblivion/oblv blood red lamb (2)", "La stessa camicia rossa vista di spalle, tra i capi appesi del laboratorio."],
    ["oblivion/oblv blood red lamb (1).JPG", "Modella a figura intera con la camicia in pelle rossa, nel laboratorio."],
    ["oblivion/Oblv blood red lamb (1).HEIC", "La camicia rossa appesa sotto un crocifisso, vista frontale."],
    ["oblivion/Oblivion blood red lamb", "Il retro della camicia rossa, con l'apertura a mandorla fra le scapole."],
    ["oblivion/oblv blood red lambskin ", "Dettaglio della camicia rossa: la manica lunga e l'orlo tagliato a punte."],
    ["oblivion/oblv blood red lamb.HEIC", "La camicia rossa su un manichino, vista ravvicinata."],
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
  ["homepage/IMG_3434", "La firma del marchio impressa nella pelle nera, accanto a una zip."],
  ["archive/IMG_2235", "Capo in pelle nera aperto e disteso sul cemento, a forma di mantella."],
  ["salvage/gallery-fur", "Dettaglio della pelliccia nera con la linguetta di pelle e i fili di cucitura."],
  ["archive/IMG_2242", "Gilet smanicato in pelle nera disteso sul cemento."],
  ["monumentus/Monumentus tenebrae", "Dettaglio ravvicinato di un capo in pelle nera, con zip e pieghe profonde."],
  ["archive/IMG_2244", "Un secondo gilet in pelle nera disteso sul cemento, visto di sbieco."],
  ["oblivion/oblv black lamb (2)", "Dettaglio dell'orlo tagliato a punte, contro il cemento."],
  ["archive/IMG_2229", "Dettaglio di un capo in pelle scura con una zip lunga, disteso."],
  ["process/f797a2c2-9d6b-4416-b251-6503cdf63e67", "I pezzi del cartamodello in pelle chiara, tagliati e disposti sul banco."],
  ["archive/IMG_9577", "La giacca in pelle marrone distesa al sole sul cemento, vista da dietro."],
  ["archive/IMG_3643", "Pantaloni chiari e gilet appesi insieme davanti a una serranda."],
  ...(RED_SHIRT_IS_A_CREATURE
    ? []
    : [["oblivion/Oblivion blood red lamb", "Il retro della camicia in pelle rosso sangue, con l'apertura a mandorla fra le scapole."]]),
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
const WORN = [
  ["salvage/capo-08-shadow", "Modella in top a fascia e gonna di pelle nera, con ombre lunghe sul cemento.", "piece-completo-fascia-gonna"],
  ["archive/IMG_0204", "Il top in pelliccia di capra e pelle indossato, in un bosco di rami spogli.", "piece-styrax"],
  ...(RED_SHIRT_IS_A_CREATURE
    ? [["oblivion/oblv blood red lamb (1).JPG", "Modella a figura intera con la camicia in pelle rossa, nel laboratorio.", "piece-giacca-rossa"]]
    : []),
  ["monumentus/Monumentus Lux ", "Uomo a figura intera con pantaloni chiari molto ampi, in laboratorio.", "piece-chiari-lunghi"],
  ["archive/IMG_9592", "La giacca in pelle marrone indossata, vista da dietro, con il collo alto.", "piece-ghezard"],
  ["tibia/Mnmnts Ten Tibia Cut", "Uomo con gilet in pelle nera e pantaloni corti in pelle, al sole sul cemento.", null],
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
  "homepage/HOMEPAGE",
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
  making: [
    "In 100% vegetable-tanned leather, Made to Measure, handmade in South Italy. Every process is Artisan.",
    "A work of repetition, patience, and precision.",
    "This is what makes every piece similar, but never identical.",
  ].join("\n"),
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
  making: [
    "In pelle 100% conciata al vegetale, Su Misura, fatta a mano nel Sud Italia. Ogni processo è artigianale.",
    "Un lavoro di ripetizione, pazienza e precisione.",
    "È questo che rende ogni pezzo simile, ma mai identico.",
  ].join("\n"),
  openingLine: "Texture viventi.",
};

/** The complete text, his order, nothing cut. The about page shows this. */
const ABOUT_TEXT = {
  en: [OWNER_EN.brand, OWNER_EN.creature, OWNER_EN.collection, OWNER_EN.making].join("\n\n"),
  it: [OWNER_IT.brand, OWNER_IT.creature, OWNER_IT.collection, OWNER_IT.making].join("\n\n"),
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
  "experimental/DESIGNER",
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
const FOLDERS = [
  // alias        folder on disk
  ["monumentus", "MONUMENTUS LUX & TENEBRAE"],
  ["tibia", "MONUMENTUS TIBIA CUT"],
  ["oblivion", "OBLIVION"],
  ["styrax", "STYRAX TOP"],
  ["process", "SOLVET ET COAUGULA (PROCESS)"],
  ["products", "products"],
  ["archive", "archive"],
  ["homepage", "homepage"],
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

function mediaObject(assetId, altIt, overlay, key, overlayCaption, captionSafe = true) {
  return {
    _type: "media",
    _key: key,
    poster: {_type: "image", asset: {_type: "reference", _ref: assetId}},
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
  const files = unique.map((key) => usable.get(key)).filter(Boolean);
  const overlays = await measureOverlay(files);
  for (const rel of unique) {
    if (rel in SALVAGED) {
      console.log(`  ${SALVAGED[rel].overlay.padEnd(5)} recorded      ${rel}`);
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
  for (const rel of unique) {
    assets.set(rel, rel in SALVAGED ? SALVAGED[rel].asset : await uploadOnce(usable.get(rel)));
  }

  const ov = (rel) =>
    OVERLAY_OVERRIDE[rel] ??
    (rel in SALVAGED ? SALVAGED[rel].overlay : overlays.get(usable.get(rel)).overlay);
  /*
    The caption band. A salvaged frame has no file to measure, so it keeps the
    chrome value it already had; everything else is measured at the bottom.
  */
  const ovc = (rel) =>
    rel in SALVAGED ? SALVAGED[rel].overlay : overlays.get(usable.get(rel)).overlayCaption;
  /*
    Can a caption sit on this photograph at all, at any crop? A SALVAGED frame
    has no file to measure, and "unmeasurable" defaulted to "yes", which is how
    capo-01 kept an unreadable caption through three rounds of fixing exactly
    this. Unmeasurable now means the caption goes below the frame, where it is
    legible by construction.
  */
  const safe = (rel) =>
    rel in SALVAGED ? false : overlays.get(usable.get(rel)).captionSafeOnImage;

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
      inventedFields: INVENTED[g.slug]?.fields ?? [],
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
    inventedCopy: [
      "footerShipping",
      "footerOrigin",
      "shippingReturns",
      "shippingCustoms",
      "homeLines",
      "enquiryCopy",
      "availabilityCopy",
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
}

main().catch((error) => {
  console.error("\nImport failed:", error.message);
  process.exit(1);
});
