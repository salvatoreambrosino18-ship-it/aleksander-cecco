/*
  The media object as the site sees it, and the one rule that turns the owner's
  overlay choice into a polarity.
*/
import type {LocaleField} from "./locales";
import type {SanityImage} from "./image";

export type OverlayPolarity = "paper" | "ink";
export type CaptionPlacement = "over" | "below";

export type MediaItem = {
  poster: SanityImage;
  alt: LocaleField;
  /** True while the description was generated and no person has checked it. */
  altIsDraft: boolean | null;
  /**
   * The color of text over this picture, and of the fixed chrome while it
   * passes over it. The owner picks it per image.
   */
  overlay: OverlayPolarity;
  /**
   * The polarity of the fixed chrome — signature and MENU — as it passes over
   * this frame, measured at EVERY width rather than at a phone's (s77). Falls
   * back to `overlay` in the query when a frame predates it.
   */
  overlayChrome: OverlayPolarity;
  /**
   * The polarity of the CAPTION band at the bottom of the frame, measured
   * separately from the chrome band at the top (DESIGN-PLAN section 58). Falls
   * back to `overlay` in the query when a frame predates it.
   */
  overlayCaption: OverlayPolarity;
  /**
   * Where the label goes. "below" takes the text off a photograph whose
   * caption band is too contrasted for either color to survive.
   */
  captionPlacement: CaptionPlacement;
  caption: LocaleField;
  /** A stopgap frame: a crop of another photograph, awaiting a real one. */
  isProvisional: boolean | null;
  hasVideo: boolean;
  /** The loop's own URL. Null until he shoots one; the poster carries the frame. */
  videoUrl: string | null;
  dimensions: {width: number; height: number} | null;
};

/**
 * Overlay to theme. "paper" means white text over the picture, which is the
 * ink theme (foreground = paper). Reading this backwards would make every
 * caption illegible, so it lives in one function and nowhere else.
 */
export function overlayTheme(overlay: OverlayPolarity | null | undefined): "light" | "dark" {
  return overlay === "ink" ? "light" : "dark";
}
