/*
  The media object as the site sees it, and the one rule that turns the owner's
  overlay choice into a polarity.
*/
import type {LocaleField} from "./locales";
import type {SanityImage} from "./image";

export type OverlayPolarity = "paper" | "ink";

export type MediaItem = {
  poster: SanityImage;
  alt: LocaleField;
  /** The color of text laid over this picture. The owner picks it per image. */
  overlay: OverlayPolarity;
  caption: LocaleField;
  hasVideo: boolean;
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
