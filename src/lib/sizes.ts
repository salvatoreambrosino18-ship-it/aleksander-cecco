/*
  Sizes on the site.

  The size LIST is not duplicated here. It lives in exactly one editable file,
  studio/schemaTypes/constants/sizes.ts, and the site renders whatever values a
  garment actually carries. So when the owner supplies the real range, that one
  studio file changes and nothing here does.

  The single exception is the made-to-measure sentinel, because it is not a size
  but a switch: it is what will make the enquiry form ask for chest, shoulders
  and length in centimetres. Its value string must match the studio constant.
*/
import type {Locale} from "./locales";

export const MADE_TO_MEASURE = "su-misura";

const MADE_TO_MEASURE_LABEL: Record<Locale, string> = {
  it: "Su misura",
  en: "Made to measure",
};

/** A stored size value as it should read on the page. */
export function sizeLabel(value: string, locale: Locale): string {
  return value === MADE_TO_MEASURE ? MADE_TO_MEASURE_LABEL[locale] : value;
}

export function offersMadeToMeasure(sizes: string[] | null | undefined): boolean {
  return Boolean(sizes?.includes(MADE_TO_MEASURE));
}

/** Standard sizes first, made to measure last: it is the exception, not a size. */
export function orderedSizes(sizes: string[] | null | undefined): string[] {
  if (!sizes?.length) return [];
  return [...sizes.filter((s) => s !== MADE_TO_MEASURE), ...sizes.filter((s) => s === MADE_TO_MEASURE)];
}
