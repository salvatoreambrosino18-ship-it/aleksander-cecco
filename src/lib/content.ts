/*
  Content queries and their types. One place for every GROQ string, so the
  content model and the pages stay in step.
*/
import {query} from "./sanity";
import type {LocaleField} from "./locales";
import type {MediaItem} from "./media";

/*
  A placeholder address must never ship as a working link. The real address
  arrived on 2026-08-03 (aleksandercecco@gmail.com), so nothing matches this any
  more; it stays because the failure it prevents, a live mailto to a fake
  address, is silent and embarrassing, and because example.com is reserved by
  RFC 2606 precisely so it can be recognised.
*/
const PLACEHOLDER_EMAIL = /@example\.(com|org|net)$/i;

// Selected once and reused: the media object is the same shape everywhere.
const MEDIA_PROJECTION = /* groq */ `
  poster,
  alt,
  "altIsDraft": coalesce(altIsDraft, false),
  "isProvisional": coalesce(isProvisional, false),
  overlay,
  // TWO bands now, not three (section 87): the chrome stopped crossing the
  // photograph, so overlayChrome is gone from the schema and from here. The
  // caption's own value stays and still falls back to the value above.
  // GROQ takes // comments only: a /* */ block here parses as an error, the
  // query fails, and the whole site builds from placeholders. It did, once.
  // AND NO BACKTICKS: this whole projection is a template literal, so one
  // backtick in a comment ends the string and the file stops parsing. The
  // typechecker caught exactly that, here, on 2026-08-11.
  "overlayCaption": coalesce(overlayCaption, overlay),
  "captionPlacement": coalesce(captionPlacement, "over"),
  caption,
  // THE FILE ITSELF, so a loop can actually play (section 83). This was
  // "hasVideo": defined(video.asset) for a year — a boolean nothing could
  // render, while the plan claimed film would drop in without a rebuild. The
  // boolean is gone rather than kept beside the URL: two ways to ask the same
  // question is how the answers drift apart (section 84).
  "videoUrl": video.asset->url,
  "dimensions": poster.asset->metadata.dimensions
`;

export type MosaicNote = {
  heading: LocaleField;
  text: LocaleField;
};

export type HomeTile = {
  media: MediaItem;
  garment: {name: string; slug: string | null} | null;
};

/** A frame in the gallery. No year: it is a gallery, not an archive (s.18). */
export type GalleryImage = {
  title: string | null;
  media: MediaItem[] | null;
};

export type SiteSettings = {
  instagramUrl: string | null;
  contactEmail: string | null;
  openingMedia: MediaItem | null;
  /** His three lines over the first photograph (section 99). Verbatim. */
  openingLines: LocaleField;
  /** His three reasons, which replaced THE MAKING (section 99). */
  philosophy: Array<{title: string | null; text: LocaleField}> | null;
  /** The short about-the-brand lines on the home page, not the full story. */
  homeStatement: LocaleField;
  /** The worn band: the pieces on people, scrolled sideways. */
  homeSequence: HomeTile[] | null;
  makingMedia: MediaItem[] | null;
  /** SOLVET ET COAGULA: the work being done, in the order it is done. */
  processMedia: MediaItem[] | null;
  /**
   * THE PIECES CUT OUT ON PALE GROUND (section 116), the third kind of image
   * the reference rows are made of. Three today, covering two garments; the
   * three that came back REDRAWN by the tool are deliberately not in here.
   */
  cutoutMedia: HomeTile[] | null;
  /** The stages, in the order of the work. OURS, flagged as processText. */
  processText: LocaleField;
  /**
   * THE NARRATIVE IN THE COLUMNS (section 118). Short blocks that sit INSIDE
   * the mosaic beside the photographs, which is how the references thread prose
   * through an editorial page. OURS in every language, flagged `aboutNotes` and
   * `processNotes` in `inventedCopy`; his own sentences are untouched and stay
   * first on both pages.
   */
  aboutNotes: MosaicNote[] | null;
  processNotes: MosaicNote[] | null;
  /** A chosen handful, not a live feed. See the schema for why. */
  instagramFrames: Array<{media: MediaItem; postUrl: string | null}> | null;
  /*
    EDITORIAL NUMBERS, HIS (2026-08-18, section 128). These were constants in
    page files: how many pieces the drop announcement shows, how many a
    collection chapter shows, and which photograph heads /process. All optional
    — null means the page keeps the number it had.
  */
  newDropCount: number | null;
  chapterCount: number | null;
  processPairMedia: MediaItem | null;
  makingStatement: LocaleField;
  /**
   * The languages whose brand copy is the owner's own words. Anything else is
   * our translation and is marked as such on the page. See lib/voice.ts.
   */
  approvedLanguages: string[] | null;
  /** True while the two footer lines are still ours rather than his. */
  footerCopyIsDraft: boolean | null;
  /** The two people who make it, named in his own approved text. */
  creators: string[] | null;
  partnerName: string | null;
  partnerUrl: string | null;
  designerPortrait: MediaItem | null;
  designerText: LocaleField;
  aboutOpeningMedia: MediaItem | null;
  aboutOpeningLine: LocaleField;
  /**
   * The one photograph on /contact (section 108). Optional: with none set the
   * page picks a frame and says, in `inventedCopy`, that the choice is ours.
   */
  contactMedia: MediaItem | null;
  aboutMedia: MediaItem[] | null;
  about: LocaleField;
  /** True only if the brand story was written by us rather than by the owner. */
  aboutIsDraft: boolean | null;
  /** His own words and his own fact, so it carries no mark. */
  shippingFree: LocaleField;
  shippingReturns: LocaleField;
  footerShipping: LocaleField;
  footerOrigin: LocaleField;
  /**
   * The keys of every string on the site we wrote rather than he did. It has
   * existed in the dataset since section 59 and the SITE could not see it until
   * 2026-08-13 (section 108) — so the footer marked both its lines with one
   * boolean while the per-line answer was sitting in the data unread.
   */
  inventedCopy: string[] | null;
};

const SITE_SETTINGS_QUERY = /* groq */ `
  *[_type == "siteSettings"][0]{
    instagramUrl,
    contactEmail,
    openingMedia{${MEDIA_PROJECTION}},
    openingLines,
    philosophy[]{title, text},
    homeStatement,
    homeSequence[]{
      media{${MEDIA_PROJECTION}},
      "garment": garment->{name, "slug": slug.current}
    },
    makingMedia[]{${MEDIA_PROJECTION}},
    processMedia[]{${MEDIA_PROJECTION}},
    // The third kind of image (section 116): a garment cut out on pale ground.
    // Same shape as a worn tile, because a cut-out also wants to link to its
    // piece, and a second object type saying the same thing is one too many.
    cutoutMedia[]{
      media{${MEDIA_PROJECTION}},
      "garment": garment->{name, "slug": slug.current}
    },
    processText,
    aboutNotes[]{heading, text},
    processNotes[]{heading, text},
    instagramFrames[]{"media": media{${MEDIA_PROJECTION}}, postUrl},
    newDropCount,
    chapterCount,
    processPairMedia{${MEDIA_PROJECTION}},
    makingStatement,
    "approvedLanguages": coalesce(approvedLanguages, ["en"]),
    "footerCopyIsDraft": coalesce(footerCopyIsDraft, true),
    creators,
    partnerName,
    partnerUrl,
    designerPortrait{${MEDIA_PROJECTION}},
    designerText,
    aboutOpeningMedia{${MEDIA_PROJECTION}},
    aboutOpeningLine,
    contactMedia{${MEDIA_PROJECTION}},
    aboutMedia[]{${MEDIA_PROJECTION}},
    about,
    "aboutIsDraft": coalesce(aboutIsDraft, false),
    shippingFree,
    shippingReturns,
    footerShipping,
    footerOrigin,
    inventedCopy
  }
`;

const EMPTY_SETTINGS: SiteSettings = {
  instagramUrl: null,
  contactEmail: null,
  openingMedia: null,
  openingLines: null,
  philosophy: null,
  homeStatement: null,
  homeSequence: null,
  makingMedia: null,
  processMedia: null,
  cutoutMedia: null,
  processText: null,
  aboutNotes: null,
  processNotes: null,
  instagramFrames: null,
  makingStatement: null,
  approvedLanguages: null,
  footerCopyIsDraft: null,
  creators: null,
  partnerName: null,
  partnerUrl: null,
  designerPortrait: null,
  designerText: null,
  aboutOpeningMedia: null,
  contactMedia: null,
  aboutOpeningLine: null,
  aboutMedia: null,
  about: null,
  aboutIsDraft: null,
  shippingFree: null,
  shippingReturns: null,
  footerShipping: null,
  footerOrigin: null,
  inventedCopy: null,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await query<SiteSettings>(SITE_SETTINGS_QUERY, {}, EMPTY_SETTINGS);
  return {...EMPTY_SETTINGS, ...settings};
}

/**
 * Is this value still the studio placeholder rather than the brand's own?
 * Placeholders render as marked placeholders, never as working links.
 */
export function isPlaceholderEmail(email: string | null): boolean {
  return !email || PLACEHOLDER_EMAIL.test(email.trim());
}

/**
 * Copy that is still a placeholder token, e.g. "{ABOUT_EN}". Seeded and
 * unwritten content reads as {LIKE_THIS}, and the site marks it as such rather
 * than letting it pass for the brand's own voice (standing rule 6).
 */
export function isPlaceholderText(value: string | null): boolean {
  return Boolean(value && /^\{[A-Z0-9_]+\}$/.test(value.trim()));
}

/* ------------------------------------------------------------- collections */

export type Collection = {
  name: string;
  slug: string;
  season: string | null;
  statement: LocaleField;
  cover: MediaItem | null;
};

/* -------------------------------------------------------------- projection */

export type Garment = {
  name: string;
  slug: string;
  referenceCode: string | null;
  /** tenebrae | lux, or null. Drives catalogue ORDER, never a visible label. */
  stage: string | null;
  /** men | women | both, or null. A catalogue FILTER only, never a route. */
  wornBy: string | null;
  /** XS..XL, in his order. EMPTY means one size and no choice (section 101). */
  sizes: string[] | null;
  price: number | null;
  currency: string | null;
  materials: LocaleField;
  measurements: string | null;
  description: LocaleField;
  /** readyNow | unique | privateOrder | notOffered. See the garment schema. */
  availability: string | null;
  availabilityNote: LocaleField;
  collection: {name: string; slug: string | null; season: string | null} | null;
  media: MediaItem[] | null;
};

const GARMENT_PROJECTION = /* groq */ `
  name,
  "slug": slug.current,
  referenceCode,
  stage,
  wornBy,
  sizes,
  price,
  currency,
  materials,
  measurements,
  description,
  // Default readyNow since 2026-08-12 (section 98): made to measure left the
  // shop, so a document with no value set is a piece that exists.
  "availability": coalesce(availability, "readyNow"),
  availabilityNote,
  "collection": collection->{name, "slug": slug.current, season},
  media[]{${MEDIA_PROJECTION}}
`;

/** Every garment that can have a page: it needs a slug and at least one image. */
export async function getGarments(): Promise<Garment[]> {
  return query<Garment[]>(
    /* groq */ `*[_type == "garment" && defined(slug.current) && count(media) > 0]
      | order(orderRank asc){${GARMENT_PROJECTION}}`,
    {},
    [],
  );
}

export async function getGarment(slug: string): Promise<Garment | null> {
  return query<Garment | null>(
    /* groq */ `*[_type == "garment" && slug.current == $slug][0]{${GARMENT_PROJECTION}}`,
    {slug},
    null,
  );
}

const COLLECTION_PROJECTION = /* groq */ `
  name,
  "slug": slug.current,
  season,
  statement,
  cover{${MEDIA_PROJECTION}}
`;

/** Published collections, in the order the owner dragged them into. */
export async function getCollections(): Promise<Collection[]> {
  return query<Collection[]>(
    /* groq */ `*[_type == "collection" && published == true && defined(slug.current)]
      | order(orderRank asc){${COLLECTION_PROJECTION}}`,
    {},
    [],
  );
}

export async function getCollection(slug: string): Promise<Collection | null> {
  return query<Collection | null>(
    /* groq */ `*[_type == "collection" && slug.current == $slug][0]{${COLLECTION_PROJECTION}}`,
    {slug},
    null,
  );
}

/** Garments in one collection, in the owner's order. */
export async function getGarmentsInCollection(slug: string): Promise<Garment[]> {
  return query<Garment[]>(
    /* groq */ `*[_type == "garment" && collection->slug.current == $slug && count(media) > 0]
      | order(orderRank asc){${GARMENT_PROJECTION}}`,
    {slug},
    [],
  );
}

/*
  Catalogue order: tenebrae, then lux, then anything unassigned, and the owner's
  own drag order within each group. This is what "the catalogue divides by
  material and colour" means in practice (DESIGN-PLAN section 28). It is done
  here rather than in GROQ so the sequence lives next to the type that defines
  it, and so an unassigned Creature sorts last instead of vanishing.
*/
const STAGE_ORDER = ["tenebrae", "lux"];

export function byStage<T extends {stage: string | null}>(items: T[]): T[] {
  const rank = (item: T) => {
    const index = STAGE_ORDER.indexOf(item.stage ?? "");
    return index === -1 ? STAGE_ORDER.length : index;
  };
  // Stable: Array.prototype.sort is stable, so the owner's drag order survives
  // inside each group.
  return [...items].sort((a, b) => rank(a) - rank(b));
}

/*
  NEXT AND PREVIOUS, in the same order the index and the collection use. Without
  it every Creature is a dead end and seeing two means going back to the index
  in between, which was the single most-repeated action on the site.

  It WRAPS, deliberately: the sixteenth leads to the first. A sequence that
  stops has an end, and an end invites leaving.
*/
export function neighbours<T extends {slug: string; stage: string | null}>(
  all: T[],
  slug: string,
): {previous: T | null; next: T | null} {
  const ordered = byStage(all);
  const index = ordered.findIndex((item) => item.slug === slug);
  if (index === -1 || ordered.length < 2) return {previous: null, next: null};
  return {
    previous: ordered[(index - 1 + ordered.length) % ordered.length]!,
    next: ordered[(index + 1) % ordered.length]!,
  };
}

/** The gallery, in the owner's order. Sequence and rhythm, not chronology. */
export async function getGallery(): Promise<GalleryImage[]> {
  return query<GalleryImage[]>(
    /* groq */ `*[_type == "archivePiece" && count(media) > 0]
      | order(orderRank asc){title, media[]{${MEDIA_PROJECTION}}}`,
    {},
    [],
  );
}
