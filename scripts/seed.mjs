/*
  Seed the Sanity dataset with test content, images included.

    npm run seed

  Why this exists: the revised layouts cannot be judged against placeholders,
  and filling the studio by hand nine times is not a good use of anyone's
  evening. Everything it writes is deliberately, visibly a placeholder.

  IDEMPOTENT. Run it as often as you like:
    - images are matched by their sha1, so a file already uploaded is reused
      rather than duplicated;
    - documents use fixed ids and createOrReplace, so a second run overwrites
      the same three documents instead of adding more.

  WHAT IS REAL AND WHAT IS NOT, deliberately:
    - REAL: the photographs, their alt text (written from looking at each file),
      the overlay polarity (computed from the pixels, see OVERLAY NOTES below),
      and the Instagram URL.
    - PLACEHOLDER, and marked as such inside the content: every name, reference
      code, statement, description, materials, measurement and price. They read
      as {LIKE_THIS} on the page so seeded data can never be mistaken for the
      brand's voice.
    - The contact email is the studio's own placeholder, info@example.com, which
      the site already refuses to render as a working link.

  OVERLAY NOTES. The overlay value per image is not a guess. Each file was
  measured: the bottom band of the frame, where a caption lands, was sampled and
  the WCAG contrast of paper (#FAFAF8) and ink (#0A0A0A) against it compared.
  The measured luminance and the resulting contrast are recorded next to each
  entry.

  Three frames (IMG_3116, IMG_3691, IMG_3692) are shot against bright concrete
  with a dark garment in the frame, so their caption band holds both extremes:
  the winning polarity still drops to a contrast of 1.1 to 1.6 somewhere in the
  band, which is unreadable. Rather than force a value, those three carry
  captionPlacement "below": the label leaves the picture and sits on the page.
  For them the overlay value then serves the fixed chrome that still passes over
  the image, and is chosen from the TOP band, which is why IMG_3116 takes paper
  while the other two take ink.
*/
import {createHash} from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PHOTO_DIR = path.join(ROOT, "seed-photos");

process.loadEnvFile(path.join(ROOT, ".env"));

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset) throw new Error("PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET must be set in .env");
if (!token) throw new Error("SANITY_WRITE_TOKEN must be set in .env (a token with write access)");

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  useCdn: false,
});

/* ------------------------------------------------------------------ images */

/*
  alt: written from looking at each photograph, not generated. If a file is ever
  replaced, look at the new one and rewrite the alt rather than leaving this.
  overlay: computed, with the measured caption-band luminance in the comment.
*/
const PHOTOS = {
  "IMG_3619.jpg": {
    overlay: "paper", // caption band L 0.164, paper contrast 4.70 (worst 3.12)
    alt: {
      it: "Pantaloni ampi in tela chiara, visti di fronte, appesi a una gruccia contro un muro di cemento e una serranda metallica.",
      en: "Wide-leg trousers in pale canvas, seen from the front, hanging from a hanger against a concrete wall and a metal roller shutter.",
    },
  },
  "IMG_3625.jpg": {
    overlay: "paper", // caption band L 0.142, paper contrast 5.25 (worst 3.40)
    alt: {
      it: "Gli stessi pantaloni chiari visti da dietro, con due tasche con zip sul retro.",
      en: "The same pale trousers seen from behind, with two zipped pockets at the back.",
    },
  },
  "IMG_2368.jpg": {
    overlay: "paper", // caption band L 0.088, paper contrast 7.30 (worst 4.47)
    alt: {
      it: "Dettaglio della vita di un capo in pelle grigio chiaro, con passanti e due tasche con zip, appoggiato su una superficie scura accanto a un capo in pelle nera.",
      en: "Close-up of the waist of a pale grey leather piece, with belt loops and two zipped pockets, resting on a dark surface next to a black leather piece.",
    },
  },
  "IMG_2378.jpg": {
    overlay: "paper", // caption band L 0.058, paper contrast 9.33 (worst 7.42)
    alt: {
      it: "Dettaglio ravvicinato della chiusura con zip e di un passante su pelle grigio chiaro, sopra un capo in pelle nera su una superficie scura e lucida.",
      en: "Close-up of a zip fastening and a belt loop on pale grey leather, over a black leather piece on a dark reflective surface.",
    },
  },
  "IMG_3691.jpg": {
    // Caption band L 0.330: ink wins on the mean (7.13) but collapses to 1.40 at
    // the dark end, so the caption comes off the picture entirely. The overlay
    // value here therefore serves the CHROME band (L 0.494), where ink wins.
    captionPlacement: "below",
    overlay: "ink",
    alt: {
      it: "Pantaloni ampi in pelle nera, visti di fronte, con zip a vista e orlo grezzo, appesi contro un muro di cemento.",
      en: "Wide-leg black leather trousers, seen from the front, with an exposed zip and a raw hem, hanging against a concrete wall.",
    },
  },
  "IMG_3692.jpg": {
    // Caption band L 0.387, ink 8.19 on the mean but 1.60 at the dark end.
    // Caption below; overlay serves the chrome band (L 0.403), where ink wins.
    captionPlacement: "below",
    overlay: "ink",
    alt: {
      it: "Gli stessi pantaloni in pelle nera visti da dietro, con due tasche con zip e l'orlo tagliato irregolare.",
      en: "The same black leather trousers seen from behind, with two zipped pockets and an irregular cut hem.",
    },
  },
  "IMG_1834.jpg": {
    overlay: "paper", // caption band L 0.016, paper contrast 15.27 (worst 10.79)
    alt: {
      it: "Dettaglio ravvicinato di una cintura in pelle nera sopra pannelli di lino scuro, il capo appeso a un ramo con una catena e una gruccia di filo.",
      en: "Close-up of a black leather waistband over dark linen panels, the garment hanging from a branch by a chain and a wire hanger.",
    },
  },
  "IMG_2127.jpg": {
    overlay: "paper", // caption band L 0.024, paper contrast 13.56 (worst 10.99)
    alt: {
      it: "Dettaglio di pannelli in pelle grigio verde con una cucitura curva, distesi su una superficie scura.",
      en: "Close-up of grey-green leather panels with a curved seam, laid out on a dark surface.",
    },
  },
  "IMG_3116.jpg": {
    // Caption band L 0.240, ink 5.44 on the mean but 1.13 at the dark end: the
    // worst of the three. Caption below. Its chrome band is dark (L 0.163), so
    // unlike the other two this one takes PAPER for the chrome passing over it.
    captionPlacement: "below",
    overlay: "paper",
    alt: {
      it: "Top smanicato in pelle nera increspata con collo alto arricciato, su un manichino chiaro; a sinistra una camicia scura su una gruccia e sul muro dietro i cartamodelli.",
      en: "A sleeveless top in crinkled black leather with a high gathered collar, on a pale mannequin; a dark shirt hangs to the left and paper patterns are pinned on the wall behind.",
    },
  },
};

async function uploadPhoto(filename) {
  const filePath = path.join(PHOTO_DIR, filename);
  const buffer = await fs.promises.readFile(filePath);
  const sha1 = createHash("sha1").update(buffer).digest("hex");

  // Sanity stores sha1hash on every asset, so this is the honest dedupe key:
  // the same bytes are never uploaded twice, whatever the file is called.
  const existing = await client.fetch(`*[_type == "sanity.imageAsset" && sha1hash == $sha1][0]{_id}`, {sha1});
  if (existing?._id) {
    console.log(`  reused   ${filename}  (${existing._id})`);
    return existing._id;
  }

  const asset = await client.assets.upload("image", buffer, {filename, contentType: "image/jpeg"});
  console.log(`  uploaded ${filename}  (${asset._id})`);
  return asset._id;
}

/** A media object as the schema expects it. */
function mediaItem(assetId, filename, key) {
  const photo = PHOTOS[filename];
  return {
    _type: "media",
    _key: key,
    poster: {_type: "image", asset: {_type: "reference", _ref: assetId}},
    alt: {_type: "localeString", ...photo.alt},
    overlay: photo.overlay,
    captionPlacement: photo.captionPlacement ?? "over",
  };
}

/* --------------------------------------------------------------- documents */

const COLLECTION_ID = "seed-collection-uno";
const GARMENT_A_ID = "seed-garment-a";
const GARMENT_B_ID = "seed-garment-b";

async function seed() {
  console.log(`Seeding ${projectId}/${dataset}`);
  console.log("\nImages:");

  const assets = {};
  for (const filename of Object.keys(PHOTOS)) {
    assets[filename] = await uploadPhoto(filename);
  }

  // Replace any collection that is not ours rather than adding a second one.
  const strays = await client.fetch(
    `*[_type == "collection" && !(_id in [$id, $draftId])]{_id, name}`,
    {id: COLLECTION_ID, draftId: `drafts.${COLLECTION_ID}`},
  );
  if (strays.length) {
    console.log("\nRemoving collections that are not the seed collection:");
    for (const stray of strays) {
      console.log(`  deleted  ${stray._id}  ${stray.name ?? "(no name)"}`);
      await client.delete(stray._id);
      await client.delete(`drafts.${stray._id}`).catch(() => {});
    }
  }

  console.log("\nDocuments:");

  await client.createOrReplace({
    _id: COLLECTION_ID,
    _type: "collection",
    name: "{COLLECTION_NAME}",
    slug: {_type: "slug", current: "collezione-placeholder"},
    season: "{SEASON}",
    statement: {
      _type: "localeText",
      it: "{STATEMENT_RIGA_UNO}\n{STATEMENT_RIGA_DUE}\n{STATEMENT_RIGA_TRE}",
      en: "{STATEMENT_LINE_ONE}\n{STATEMENT_LINE_TWO}\n{STATEMENT_LINE_THREE}",
    },
    // A 3:4 frame as the cover: the fullest view of a garment in the set.
    cover: mediaItem(assets["IMG_3116.jpg"], "IMG_3116.jpg", "cover"),
    published: true,
    orderRank: "0|100000:",
  });
  console.log(`  collection  ${COLLECTION_ID}  (published)`);

  const collectionRef = {_type: "reference", _ref: COLLECTION_ID};

  /*
    Garment A: available, several sizes including made to measure.
    Gallery order puts the 9:16 frames first: they are the phone ratio and
    survive a full-bleed screen without losing most of the garment.
  */
  await client.createOrReplace({
    _id: GARMENT_A_ID,
    _type: "garment",
    name: "{GARMENT_NAME_A}",
    slug: {_type: "slug", current: "capo-placeholder-a"},
    referenceCode: "{REF_CODE_A}",
    collection: collectionRef,
    category: "uomo",
    sizes: ["s", "m", "l", "su-misura"],
    price: 1111, // deliberately fake, repeated digits: not a real price
    currency: "EUR",
    materials: {_type: "localeText", it: "{MATERIALI_IT}", en: "{MATERIALS_EN}"},
    measurements: "{MISURE_CAMPIONE} torace 00 / spalle 00 / lunghezza 00",
    description: {_type: "localeText", it: "{DESCRIZIONE_IT}", en: "{DESCRIPTION_EN}"},
    media: [
      mediaItem(assets["IMG_3619.jpg"], "IMG_3619.jpg", "a1"),
      mediaItem(assets["IMG_3625.jpg"], "IMG_3625.jpg", "a2"),
      mediaItem(assets["IMG_2368.jpg"], "IMG_2368.jpg", "a3"),
      mediaItem(assets["IMG_2378.jpg"], "IMG_2378.jpg", "a4"),
    ],
    notOffered: false,
    orderRank: "0|100000:",
  });
  console.log(`  garment A   ${GARMENT_A_ID}  (available, 4 sizes incl. made to measure)`);

  /*
    Garment B: two sizes, no made to measure, and not currently offered, so the
    disabled action and its explanation are exercised against real photography.
    No price at all, which exercises the {PRICE_EUR} placeholder path.
  */
  await client.createOrReplace({
    _id: GARMENT_B_ID,
    _type: "garment",
    name: "{GARMENT_NAME_B}",
    slug: {_type: "slug", current: "capo-placeholder-b"},
    referenceCode: "{REF_CODE_B}",
    collection: collectionRef,
    category: "donna",
    sizes: ["m", "l"],
    currency: "EUR",
    materials: {_type: "localeText", it: "{MATERIALI_IT}", en: "{MATERIALS_EN}"},
    measurements: "{MISURE_CAMPIONE} torace 00 / spalle 00 / lunghezza 00",
    description: {_type: "localeText", it: "{DESCRIZIONE_IT}", en: "{DESCRIPTION_EN}"},
    media: [
      mediaItem(assets["IMG_3691.jpg"], "IMG_3691.jpg", "b1"),
      mediaItem(assets["IMG_3692.jpg"], "IMG_3692.jpg", "b2"),
      mediaItem(assets["IMG_1834.jpg"], "IMG_1834.jpg", "b3"),
      mediaItem(assets["IMG_2127.jpg"], "IMG_2127.jpg", "b4"),
    ],
    notOffered: true,
    notOfferedNote: {
      _type: "localeString",
      it: "{NOTA_NON_DISPONIBILE_IT}",
      en: "{NOT_OFFERED_NOTE_EN}",
    },
    orderRank: "0|200000:",
  });
  console.log(`  garment B   ${GARMENT_B_ID}  (not currently offered, 2 sizes)`);

  // The singleton id the studio structure opens (studio/structure.ts).
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    instagramUrl: "https://www.instagram.com/aleksandercecco/",
    contactEmail: "info@example.com", // placeholder; the site refuses to link it
    about: {_type: "localeText", it: "{CHI_SIAMO_IT}", en: "{ABOUT_EN}"},
    shippingReturns: {_type: "localeText", it: "{SPEDIZIONI_RESI_IT}", en: "{SHIPPING_RETURNS_EN}"},
  });
  console.log("  siteSettings (Instagram real, email placeholder)");

  const counts = await client.fetch(`{
    "collections": count(*[_type == "collection"]),
    "garments": count(*[_type == "garment"]),
    "settings": count(*[_type == "siteSettings"]),
    "assets": count(*[_type == "sanity.imageAsset"])
  }`);
  console.log("\nPublished now:", JSON.stringify(counts));
}

seed().catch((error) => {
  console.error("\nSeed failed:", error.message);
  process.exit(1);
});
