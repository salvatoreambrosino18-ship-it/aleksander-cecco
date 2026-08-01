/*
  Content queries and their types. One place for every GROQ string, so the
  content model and the pages stay in step.
*/
import {query} from "./sanity";
import type {LocaleField} from "./locales";

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
