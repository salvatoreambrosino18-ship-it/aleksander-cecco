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
  ============ NAMING THE CREATURE (2026-08-02) ============

  The owner's Instagram gives ten Creature their real names and compositions.
  What is possible here is matching our imported PHOTOGRAPHS against his written
  CAPTIONS: the Instagram images themselves are not available, so a match is
  only made where a caption names a feature that can be SEEN in our frames.

  RENAMED, because the evidence is decisive:

  - Rubedo. His caption: "Red and Black faded colour. 500 handmade scar-stitch.
    Oblivion hole on the back." Our IMG_3475 is the back view and shows exactly
    that hole, an almond opening in the upper back, and the sleeves fade from
    dark to bright red. Nothing else in the set is red. Sold as a private order
    and 1/1, so it carries no enquiry action.

  NOT RENAMED, and listed for the owner rather than guessed. The full reasoning
  is in DESIGN-PLAN section 24; briefly, two shirts compete for two names
  (Armonyen and Corvinus) with nothing in the captions to separate them, two
  pairs of black trousers compete for Tibia Cut and the Scrap Pants, and one
  garment document bundles a tube top with a skirt where the caption names only
  the skirt (Severya).

  MATERIALS. The generic line is dead: "100% Italian leather" named a country
  and not a composition. Only Rubedo gets a real one, from his own caption. For
  every unmatched Creature the field is left as a marked {MATERIALS} placeholder
  ON PURPOSE. Filling them all with "vegetable-tanned" would just be a new
  generic line, asserted about pieces nobody has verified.
*/
/*
  STAGE ASSIGNMENT, and the limit of it. The owner's division is by MATERIAL AND
  COLOUR: Tenebrae is the black washed veg tan work, Lux the pale pieces.

  Colour is directly observable in our frames and every imported Creature except
  Rubedo is black, so none of them can be Lux under his own definition. Tannage
  is NOT observable, so "tenebrae" here is assigned on the half of the criterion
  that can be seen, and he should confirm the other half when he names them.

  Rubedo is deliberately left UNSET. It is named for a third alchemical stage
  that the collection title does not include, and forcing it into one of two
  would be a guess. The gap asks the question.

  No Lux Creature has been imported yet, which is itself worth knowing: the pale
  pieces exist in the photography (the arrival frame, the cream trousers on
  model) but none of them is a garment document.
*/
const GARMENTS = [
  {
    id: "piece-camicia-pelle-nera",
    stage: "tenebrae",
    slug: "capo-01",
    files: [
      ["products/0d454a66-7c17-4d8d-a6f0-9872225ab82b", "Camicia in pelle nera stropicciata, vista frontale, appesa a un muro di cemento chiaro."],
      ["products/286368a0-df23-4ae8-b80d-5bc953183102", "La stessa camicia in pelle nera vista piu da vicino, contro il muro di cemento."],
    ],
  },
  {
    id: "piece-giacca-orlo-smerlato",
    stage: "tenebrae",
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
    stage: "tenebrae",
    slug: "capo-03",
    files: [["products/IMG_3465", "Gilet in pelle nera con zip centrale, appeso a una gruccia davanti a una serranda."]],
  },
  {
    id: "piece-top-leggero",
    stage: "tenebrae",
    slug: "capo-04",
    files: [["products/IMG_3466", "Top nero leggero e trasparente, tenuto in mano davanti a un muro di cemento."]],
  },
  {
    id: "piece-pelle-drappeggiata",
    stage: "tenebrae",
    slug: "capo-05",
    files: [
      ["products/IMG_3467", "Capo in pelle nera appeso a una parete di cemento, sotto una croce di metallo."],
      ["products/IMG_3468", "Dettaglio ravvicinato dello stesso capo in pelle nera, con zip e pieghe profonde."],
    ],
  },
  {
    id: "piece-giacca-rossa",
    slug: "rubedo",
    /*
      CONFIRMED against the photograph, not inferred: IMG_3475 is the back view
      and carries the "Oblivion hole" his caption describes.
    */
    name: "Rubedo",
    /*
      OUTSIDE MONUMENTUS, confirmed by the owner 2026-08-02. It is named for the
      third alchemical stage, which the collection title does not include, so it
      belongs to no collection and its page says exactly that.
    */
    collection: null,
    stage: "rubedo",
    materials: {it: "Pelle di agnello", en: "Lambskin leather"},
    // His caption, verbatim. Approved copy, so it carries no mark in English.
    description: {
      en: "Red and Black faded colour. 500 handmade scar-stitch. Oblivion hole on the back.",
      it: "Colore rosso e nero sfumato. 500 scar-stitch fatti a mano. Oblivion hole sulla schiena.",
    },
    availability: "privateOrder",
    files: [
      ["products/IMG_3476", "Modella con giacca in pelle rossa e pantaloni neri lucidi, braccia incrociate, in laboratorio."],
      ["products/IMG_3475", "La stessa giacca rossa vista di spalle, tra i capi appesi del laboratorio."],
      ["products/IMG_3477", "Modella a figura intera con la giacca in pelle rossa, nel laboratorio."],
      ["archive/IMG_3479", "La camicia rossa appesa sotto un crocifisso, vista frontale."],
      ["archive/IMG_3481", "Il retro della camicia rossa, con l'apertura a mandorla fra le scapole."],
      ["archive/IMG_3478", "Dettaglio della camicia rossa: la manica lunga e l'orlo tagliato a punte."],
      ["archive/IMG_3480", "La camicia rossa su un manichino, vista ravvicinata."],
    ],
  },
  {
    id: "piece-pantaloni-pelle",
    stage: "tenebrae",
    slug: "capo-07",
    files: [
      ["products/IMG_3691", "Pantaloni ampi in pelle nera, vista frontale, con zip a vista e orlo grezzo."],
      ["products/IMG_3692", "Gli stessi pantaloni in pelle nera visti da dietro, con due tasche con zip."],
    ],
  },
  {
    id: "piece-completo-fascia-gonna",
    stage: "tenebrae",
    slug: "capo-08",
    files: [
      ["products/aa52ef49-6c71-4a9b-b832-24cb5827376d", "Modella in top a fascia e gonna di pelle nera, con ombre lunghe sul muro."],
      ["products/05b164db-ab89-4d66-bebc-98d8a31ec147", "La stessa uscita in piena luce, con stivali alti."],
      ["products/7682a1f5-5ce2-4527-b02f-d3213bee8af8", "Dettaglio della gonna in pelle nera con orlo a punte, indossata."],
      ["archive/IMG_0212", "La gonna con la trama di serpente e il top a fascia, in piena luce."],
    ],
  },

  /* ================= ADDED 2026-08-02: the rest of the catalogue =================

     The old site carried sixteen products and eight were imported. These are the
     rest, found by going back through products/ and archive/ frame by frame.

     NAMED where a caption names something visible in the photograph, and left as
     a marked placeholder where it does not. The reasoning per piece is in
     DESIGN-PLAN section 39.

     ENGLISH DESCRIPTIONS ARE HIS CAPTIONS, VERBATIM. The Italian is deliberately
     LEFT EMPTY rather than translated: he approved the Italian of the brand text
     he was shown, not translations we invent afterwards, and approvedLanguages is
     global. An empty field shows as missing (see pick in lib/locales.ts), which is
     the honest outcome and makes the gap visible instead of forging approval.
  */
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
      CONFIDENT, and the evidence is the setting. His caption reads "The Forest
      Calling. Name of the creature: Styrax", and this is the only frame in the
      whole set shot in a forest. The composition also matches the other caption,
      "Handmade Goat Sherling & Leather Top".
    */
    id: "piece-styrax",
    slug: "styrax",
    name: "Styrax",
    stage: "tenebrae",
    materials: {it: "Pelliccia di capra e pelle", en: "Goat shearling and leather"},
    description: {en: "Handmade Goat Sherling & Leather Top."},
    files: [
      ["archive/IMG_0204", "Il top in pelliccia di capra e pelle, indossato, in un bosco di rami spogli."],
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
    // Pale, so Lux. Cropped and very wide; which of the owner's names it carries
    // is his to say (section 39).
    id: "piece-chiari-corti",
    slug: "capo-10",
    stage: "lux",
    files: [
      ["archive/IMG_3619", "Pantaloni chiari corti e ampi appesi a una gruccia sotto una croce di ferro."],
      ["archive/IMG_3625", "Il retro degli stessi pantaloni chiari, con due tasche con zip."],
      ["homepage/IMG_3463", "Pantaloni chiari in pelle appesi dentro una cornice di metallo nero."],
      ["homepage/IMG_3464", "Dettaglio della cintura e delle tasche con zip sui pantaloni chiari."],
    ],
  },
  {
    // Pale and full length, a different length from capo-10, so recorded as a
    // separate piece rather than merged with it.
    id: "piece-chiari-lunghi",
    slug: "capo-11",
    stage: "lux",
    files: [
      ["archive/IMG_3474", "Uomo a figura intera con maglia trasparente e pantaloni chiari molto ampi."],
      ["archive/IMG_3472", "Gli stessi pantaloni chiari visti di profilo, nel laboratorio."],
      ["archive/IMG_1902", "Gli stessi pantaloni visti da dietro, mentre cammina nella luce."],
      ["homepage/IMG_1898", "Uomo di spalle con i pantaloni chiari ampi, in laboratorio."],
    ],
  },
  {
    id: "piece-top-allacciato",
    slug: "capo-12",
    stage: "tenebrae",
    files: [
      ["experimental/IMG_3116", "Top in pelle nera con collo alto allacciato, su un manichino, davanti ai cartamodelli."],
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
      which was the alternative. `mediaIsProvisional` marks it in the studio and
      the shot list carries the request. Replace it and delete the crop.
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
*/
const ARCHIVE = [
  ["experimental/IMG_2897", "Studio ravvicinato di pieghe profonde in un tessuto scuro, quasi astratto."],
  ["homepage/IMG_3434", "La firma del marchio impressa nella pelle nera, accanto a una zip."],
  ["archive/IMG_2235", "Capo in pelle nera aperto e disteso sul cemento, a forma di mantella."],
  ["products/IMG_0207", "Dettaglio della pelliccia nera con la linguetta di pelle e i fili di cucitura."],
  ["archive/IMG_2242", "Gilet smanicato in pelle nera disteso sul cemento."],
  ["products/IMG_3468", "Dettaglio ravvicinato di un capo in pelle nera, con zip e pieghe profonde."],
  ["archive/IMG_2244", "Un secondo gilet in pelle nera disteso sul cemento, visto di sbieco."],
  ["products/IMG_3455", "Dettaglio dell'orlo tagliato a punte, contro il cemento."],
  ["archive/IMG_2229", "Dettaglio di un capo in pelle scura con una zip lunga, disteso."],
  ["experimental/f797a2c2-9d6b-4416-b251-6503cdf63e67", "I pezzi del cartamodello in pelle chiara, tagliati e disposti sul banco."],
  ["archive/IMG_9577", "La giacca in pelle marrone distesa al sole sul cemento, vista da dietro."],
  ["archive/IMG_3643", "Pantaloni chiari e gilet appesi insieme davanti a una serranda."],
];
/*
  THE ARRIVAL. One photograph, the whole first screen.

  CHANGED 2026-08-02 to a DARK frame, and the reason is structural rather than
  aesthetic. The page now opens in INK, because the wipe runs nigredo to albedo
  (section 22). The previous arrival, IMG_3463, is the PALE trousers: a Lux
  piece, bright, sitting on a black page, so the very first screen contradicted
  the direction of the site's one inversion. Darkness first, light after, is his
  own order, and the arrival is where it has to start.

  IMG_2378 measured darkest among the usable frames in homepage/: overall
  luminance 0.081 against 0.179 for IMG_3463, and 0.046 in the top-left band
  where the signature and MENU sit, which is the cleanest chrome contrast in the
  whole set. Portrait 3024x4032, so it survives the 100svh crop on a phone.

  It also rescues the last of the three frames orphaned when the home tile grid
  was replaced (section 21). IMG_3434 stays orphaned because it is landscape.

  This settles the arrival question in section 34 the free way: no splash
  screen, no held black, no delayed first paint. The page simply opens out of
  darkness because the photograph is dark.
*/
const OPENING = [
  "homepage/IMG_2378",
  "Dettaglio ravvicinato della cintura di un capo in pelle grigio chiaro, con passante e zip, contro pelle nera.",
];
/*
  WORN: the pieces on people, the horizontal band halfway down the home page.

  REBUILT 2026-08-02. It used to be five frames of TWO garments, which made the
  brand look smaller on the page most visitors see than it actually is. It now
  draws one frame from EVERY Creature that has an on-model photograph, which is
  five of the sixteen, plus the one on-model frame that belongs to no Creature.

  Five garments instead of two. Still not the whole catalogue, because only five
  Creature have ever been photographed on a body: that is a shoot request, not a
  code problem, and it is in the shot list.

  All portrait, because a band frame is a tall crop and a landscape source loses
  its subject in it. That still rules out IMG_1898.
*/
const WORN = [
  ["products/aa52ef49-6c71-4a9b-b832-24cb5827376d", "Modella in top a fascia e gonna di pelle nera, con ombre lunghe sul cemento.", "piece-completo-fascia-gonna"],
  ["archive/IMG_0204", "Il top in pelliccia di capra e pelle indossato, in un bosco di rami spogli.", "piece-styrax"],
  ["products/IMG_3477", "Modella a figura intera con la camicia in pelle rossa, nel laboratorio.", "piece-giacca-rossa"],
  ["archive/IMG_3474", "Uomo a figura intera con pantaloni chiari molto ampi, in laboratorio.", "piece-chiari-lunghi"],
  ["archive/IMG_9592", "La giacca in pelle marrone indossata, vista da dietro, con il collo alto.", "piece-ghezard"],
  ["homepage/IMG_3485", "Uomo con gilet in pelle nera e pantaloni corti in pelle, al sole sul cemento.", null],
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
  Shipping and returns, written by US in his register: short, declarative, no
  hedging and no apology. The fact the owner gave is that returns are accepted
  and the customer pays the return shipping, so that is exactly what it says and
  nothing more. No window, no conditions, no "please note": none of that has
  been agreed and inventing it would be inventing policy.

  The third line, added 2026-08-02, is an EXTENSION of his stated rule rather
  than a new one: he said the customer pays to send it back, and outside the EU
  that cost also includes customs. At these prices the difference is material
  and leaving it unsaid would be the omission, not the honesty.

  Ours, so it stays marked as an unapproved draft in BOTH languages.
*/
const SHIPPING_RETURNS = {
  it: [
    "Spedito in tutto il mondo.",
    "Resi accettati. La spedizione di reso è a carico del cliente.",
    "Fuori dall'Unione Europea, anche eventuali oneri doganali sono a carico del cliente.",
  ].join("\n"),
  en: [
    "Shipped worldwide.",
    "Returns accepted. The customer pays the return shipping.",
    "Outside the EU, any customs or import charges are the customer's too.",
  ].join("\n"),
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
  THE DESIGNER. Him at the machine, a hide on the table, in black and white. It
  is the strongest trust signal on the site (DESIGN-PLAN sections 32, 33, 41)
  and it does the work no copy can: it shows that one person really makes these.
*/
const DESIGNER_PORTRAIT = [
  "experimental/ciro-designer",
  "Il fondatore al lavoro alla macchina da cucire, con una pelle intera stesa sul tavolo.",
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
const index = new Map();
async function buildIndex() {
  /*
    PROVISIONAL frames live in this repository, not in the owner's Drive, which
    is his and is read only. See assets/provisional/README.md: each one is a
    request for a real photograph rather than a decision to keep it.
  */
  index.set("provisional/hat-from-portrait", "__repo__/assets/provisional/hat-from-portrait.jpg");

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
    // Named by the owner, 2026-08-02. {COLLECTION_NAME} is retired.
    name: "MONUMENTUS: Tenebrae & Lux",
    slug: {_type: "slug", current: "monumentus"},
    statement: {_type: "localeText", it: OWNER_IT.collection, en: OWNER_EN.collection},
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
      // His name where a caption could be matched to a photograph, a marked
      // placeholder where it could not. Never a guessed name.
      name: g.name ?? "{GARMENT_NAME}",
      slug: {_type: "slug", current: g.slug},
      referenceCode: "{REF_CODE}",
      collection: g.collection === null ? undefined : {_type: "reference", _ref: COLLECTION_ID},
      stage: g.stage ?? null,
      currency: "EUR",
      /*
        Composition per Creature, or nothing. The old "100% Italian leather"
        line named a country rather than a material and is gone; filling every
        unmatched piece with "vegetable-tanned" instead would only be a newer
        generic line asserted about pieces nobody has verified.
      */
      materials: g.materials
        ? {_type: "localeText", ...g.materials}
        : {_type: "localeText", it: "{MATERIALI}", en: "{MATERIALS}"},
      measurements: "{MISURE_DI_RIFERIMENTO}",
      description: g.description
        ? {_type: "localeText", ...g.description}
        : {_type: "localeText", it: "{DESCRIZIONE_IT}", en: "{DESCRIPTION_EN}"},
      media: g.files.map(([rel, alt], i) => ({
        ...mediaObject(assets.get(rel), alt, ov(rel), `m${i}`),
        ...(g.provisional ? {isProvisional: true} : {}),
      })),
      availability: g.availability ?? "madeToOrder",
      orderRank: `0|${rank}:`,
    });
    console.log(`  creature      ${(g.name ?? g.slug).padEnd(22)} ${g.files.length} photographs`);
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

    // His words, in the two places each run belongs.
    homeStatement: {_type: "localeText", it: OWNER_IT.brand, en: OWNER_EN.brand},
    makingStatement: {_type: "localeText", it: OWNER_IT.making, en: OWNER_EN.making},

    // The about page: his text complete, unbroken, in his order.
    designerPortrait: mediaObject(
      assets.get(DESIGNER_PORTRAIT[0]),
      DESIGNER_PORTRAIT[1],
      ov(DESIGNER_PORTRAIT[0]),
      "designer",
    ),
    aboutOpeningMedia: mediaObject(
      assets.get(ABOUT_OPENING[0]),
      ABOUT_OPENING[1],
      ov(ABOUT_OPENING[0]),
      "aboutOpening",
    ),
    aboutOpeningLine: {_type: "localeString", it: OWNER_IT.openingLine, en: OWNER_EN.openingLine},
    about: {_type: "localeText", ...ABOUT_TEXT},
    // The story is HIS now, so it is not our draft in any language.
    aboutIsDraft: false,

    // Ours, and still drafts in both languages.
    footerShipping: {_type: "localeText", ...FOOTER_COPY.footerShipping},
    footerOrigin: {_type: "localeText", ...FOOTER_COPY.footerOrigin},
    shippingReturns: {_type: "localeText", ...SHIPPING_RETURNS},
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
