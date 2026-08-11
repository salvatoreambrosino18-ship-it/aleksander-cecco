/*
  Image handling, and the ONE place the crop strategy lives.

  CROP STRATEGY (provisional, 2026-08-01)
  --------------------------------------
  The test images come from Instagram: recompressed, and mostly square or 4:5,
  not the studio originals. Forcing a 1:1 frame into a full-screen phone box
  (about 9:19.5) discards roughly 60% of the width, so any crop decision taken
  against these files would be a decision about Instagram's crop, not about the
  brand's photography.

  So nothing is cropped server side. The URLs ask Sanity only for a width, and
  the framing happens in CSS: object-fit cover, with object-position driven by
  the hotspot the owner sets in the studio. That means the crop can be
  re-decided when a studio original at its native ratio arrives, by changing
  this file, without touching a single page or re-uploading anything.

  When the original lands, the likely change is here and only here: request an
  explicit aspect per breakpoint (`.rect()` or `fit=crop&crop=focalpoint`) so
  the bytes match the box instead of being cropped after download. Do not spread
  crop logic into components.
*/
// Named export, not the default: the default is deprecated in v2, and the
// types come from the package root rather than a deep path.
import {createImageUrlBuilder, type SanityImageSource} from "@sanity/image-url";
import {sanity} from "./sanity";

export type SanityImage = {
  asset?: {_ref?: string; url?: string};
  hotspot?: {x: number; y: number} | null;
  crop?: unknown;
} & SanityImageSource;

const builder = sanity ? createImageUrlBuilder(sanity) : null;

/** Width ladder for a full-bleed image. Tops out at a 2x desktop screen. */
/*
  360 and 480 exist for the tile grid (section 69): the smallest rung was 640,
  so a 195px-wide tile on a phone still pulled a 640px file. A full-bleed
  frame never picks below its viewport, so the small rungs cost it nothing.
*/
export const FULL_BLEED_WIDTHS = [360, 480, 640, 828, 1080, 1440, 1920, 2560] as const;

/*
  QUALITY IS A PARAMETER NOW, AND ONLY THE CATALOGUE USES IT (2026-08-12,
  section 95). Eighty is the site's number and stays the default for every
  full-bleed frame, where a photograph is the whole screen. A catalogue tile is
  195 CSS pixels wide on a phone and there are thirty-six of them; at that size
  the difference between 80 and 62 is invisible and the difference in bytes is
  not.
*/
export function imageUrl(source: SanityImage, width: number, quality = 80): string | null {
  if (!builder) return null;
  return builder.image(source).width(width).auto("format").quality(quality).url();
}

export function fullBleedSrcSet(source: SanityImage, quality = 80): string | null {
  if (!builder) return null;
  return FULL_BLEED_WIDTHS.map((w) => `${imageUrl(source, w, quality)} ${w}w`).join(", ");
}

/**
 * Where the picture holds still while the box crops around it. The owner sets
 * the hotspot in the studio; without one, the centre is the honest default.
 */
export function objectPosition(source: SanityImage): string {
  const hotspot = source?.hotspot;
  if (!hotspot) return "50% 50%";
  return `${(hotspot.x * 100).toFixed(2)}% ${(hotspot.y * 100).toFixed(2)}%`;
}

/** Intrinsic dimensions, so a box can be reserved and nothing shifts on load. */
export function dimensions(metadata?: {dimensions?: {width: number; height: number}} | null) {
  return metadata?.dimensions ?? null;
}
