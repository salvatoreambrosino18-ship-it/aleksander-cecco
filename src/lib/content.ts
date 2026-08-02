/*
  Content queries and their types. One place for every GROQ string, so the
  content model and the pages stay in step.
*/
import {query} from "./sanity";
import type {LocaleField} from "./locales";
import type {MediaItem} from "./media";

/** The placeholder address prefilled in the studio. It must never ship as a link. */
export const PLACEHOLDER_EMAIL = "info@example.com";

export type SiteSettings = {
  instagramUrl: string | null;
  contactEmail: string | null;
  about: LocaleField;
  shippingReturns: LocaleField;
};

const SITE_SETTINGS_QUERY = /* groq */ `
  *[_type == "siteSettings"][0]{
    instagramUrl,
    contactEmail,
    about,
    shippingReturns
  }
`;

const EMPTY_SETTINGS: SiteSettings = {
  instagramUrl: null,
  contactEmail: null,
  about: null,
  shippingReturns: null,
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
  category: string | null;
  sizes: string[] | null;
  price: number | null;
  currency: string | null;
  materials: LocaleField;
  measurements: string | null;
  description: LocaleField;
  notOffered: boolean | null;
  notOfferedNote: LocaleField;
  collection: {name: string; slug: string | null; season: string | null} | null;
  media: MediaItem[] | null;
};

// Selected once and reused: the media object is the same shape everywhere.
const MEDIA_PROJECTION = /* groq */ `
  poster,
  alt,
  overlay,
  "captionPlacement": coalesce(captionPlacement, "over"),
  caption,
  "hasVideo": defined(video.asset),
  "dimensions": poster.asset->metadata.dimensions
`;

const GARMENT_PROJECTION = /* groq */ `
  name,
  "slug": slug.current,
  referenceCode,
  category,
  sizes,
  price,
  currency,
  materials,
  measurements,
  description,
  notOffered,
  notOfferedNote,
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
