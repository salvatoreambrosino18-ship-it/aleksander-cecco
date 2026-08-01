/*
  Locales. Italian is the default and English is fully first class: both are
  reachable by an always-visible switch, and nothing auto-detects or redirects
  by language (DESIGN-PLAN section 5).

  Routing is one dynamic [lang] segment per page, so every page exists once in
  the source and twice in the build: /it/... and /en/...
*/

export const LOCALES = ["it", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "it";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** The other locale. With two locales this is the switch target. */
export function otherLocale(locale: Locale): Locale {
  return locale === "it" ? "en" : "it";
}

/** Build a path inside a locale: localePath("en", "pieces/x") -> "/en/pieces/x" */
export function localePath(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

/**
 * Swap the locale segment of the current path, keeping everything after it.
 * This is what makes the switch preserve the page the reader is on.
 */
export function switchLocalePath(pathname: string, to: Locale): string {
  const segments = pathname.replace(/^\/+/, "").split("/");
  if (isLocale(segments[0])) segments[0] = to;
  else segments.unshift(to);
  const joined = segments.filter(Boolean).join("/");
  // keep any trailing slash the incoming path had, so the switch does not
  // bounce between /en and /en/ on the dev server
  return `/${joined}${pathname.endsWith("/") && joined ? "/" : ""}`;
}

/** Read the locale out of a route param, falling back to the default. */
export function toLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** A field-level localized value from Sanity ({it, en}). */
export type LocaleField = {it?: string | null; en?: string | null} | null | undefined;

/**
 * Pick a localized value. No silent fallback to the other language: an empty
 * field is empty, so a missing translation shows as missing rather than
 * quietly serving Italian to an English reader.
 */
export function pick(field: LocaleField, locale: Locale): string | null {
  const value = field?.[locale];
  return typeof value === "string" && value.trim() !== "" ? value : null;
}
