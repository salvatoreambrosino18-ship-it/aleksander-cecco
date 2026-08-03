/*
  Content queries and their types. One place for every GROQ string, so the
  content model and the pages stay in step.
*/
import {query} from "./sanity";
import type {LocaleField} from "./locales";
import type {MediaItem} from "./media";

/** The placeholder address prefilled in the studio. It must never ship as a link. */
export const PLACEHOLDER_EMAIL = "info@example.com";

// Selected once and reused: the media object is the same shape everywhere.
const MEDIA_PROJECTION = /* groq */ `
  poster,
  alt,
  "altIsDraft": coalesce(altIsDraft, false),
  "isProvisional": coalesce(isProvisional, false),
  overlay,
  "captionPlacement": coalesce(captionPlacement, "over"),
  caption,
  "hasVideo": defined(video.asset),
  "dimensions": poster.asset->metadata.dimensions
`;

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
  /** The short about-the-brand lines on the home page, not the full story. */
  homeStatement: LocaleField;
  /** The worn band: the pieces on people, scrolled sideways. */
  homeSequence: HomeTile[] | null;
  makingMedia: MediaItem[] | null;
  makingStatement: LocaleField;
  /**
   * The languages whose brand copy is the owner's own words. Anything else is
   * our translation and is marked as such on the page. See lib/voice.ts.
   */
  approvedLanguages: string[] | null;
  /** True while the two footer lines are still ours rather than his. */
  footerCopyIsDraft: boolean | null;
  designerPortrait: MediaItem | null;
  designerText: LocaleField;
  aboutOpeningMedia: MediaItem | null;
  aboutOpeningLine: LocaleField;
  aboutMedia: MediaItem[] | null;
  about: LocaleField;
  /** True only if the brand story was written by us rather than by the owner. */
  aboutIsDraft: boolean | null;
  /** His own words and his own fact, so it carries no mark. */
  shippingFree: LocaleField;
  shippingReturns: LocaleField;
  /** Ours AND unconfirmed: he is checking it with his partner. */
  shippingCustoms: LocaleField;
  shippingCustomsIsProvisional: boolean | null;
  footerShipping: LocaleField;
  footerOrigin: LocaleField;
};

const SITE_SETTINGS_QUERY = /* groq */ `
  *[_type == "siteSettings"][0]{
    instagramUrl,
    contactEmail,
    openingMedia{${MEDIA_PROJECTION}},
    homeStatement,
    homeSequence[]{
      media{${MEDIA_PROJECTION}},
      "garment": garment->{name, "slug": slug.current}
    },
    makingMedia[]{${MEDIA_PROJECTION}},
    makingStatement,
    "approvedLanguages": coalesce(approvedLanguages, ["en"]),
    "footerCopyIsDraft": coalesce(footerCopyIsDraft, true),
    designerPortrait{${MEDIA_PROJECTION}},
    designerText,
    aboutOpeningMedia{${MEDIA_PROJECTION}},
    aboutOpeningLine,
    aboutMedia[]{${MEDIA_PROJECTION}},
    about,
    "aboutIsDraft": coalesce(aboutIsDraft, false),
    shippingFree,
    shippingReturns,
    shippingCustoms,
    "shippingCustomsIsProvisional": coalesce(shippingCustomsIsProvisional, true),
    footerShipping,
    footerOrigin
  }
`;

const EMPTY_SETTINGS: SiteSettings = {
  instagramUrl: null,
  contactEmail: null,
  openingMedia: null,
  homeStatement: null,
  homeSequence: null,
  makingMedia: null,
  makingStatement: null,
  approvedLanguages: null,
  footerCopyIsDraft: null,
  designerPortrait: null,
  designerText: null,
  aboutOpeningMedia: null,
  aboutOpeningLine: null,
  aboutMedia: null,
  about: null,
  aboutIsDraft: null,
  shippingFree: null,
  shippingReturns: null,
  shippingCustoms: null,
  shippingCustomsIsProvisional: null,
  footerShipping: null,
  footerOrigin: null,
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
  return !email || email.trim().toLowerCase() === PLACEHOLDER_EMAIL;
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
  price: number | null;
  currency: string | null;
  materials: LocaleField;
  measurements: string | null;
  description: LocaleField;
  /** madeToOrder | unique | privateOrder | notOffered. See the garment schema. */
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
  price,
  currency,
  materials,
  measurements,
  description,
  "availability": coalesce(availability, "madeToOrder"),
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
