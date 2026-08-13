/*
  WHAT A MOSAIC IS MADE OF, and how the kinds are interleaved.

  The type lived in Mosaic.astro while one page used it. Two pages weave their
  own now — /about and /process — and a third reads the same set, so the shape
  and the weaving rule belong somewhere both can import rather than being
  copied. A copied rule is two rules with one name.
*/
import type {HomeTile, MosaicNote} from "./content";
import type {LocaleField} from "./locales";
import type {MediaItem} from "./media";

/**
 * A block in the run. Three kinds, which is what the reference rows are made
 * of: prose, a garment cut out on pale ground, and a photograph.
 */
export type MosaicBlock =
  | {kind: "frame"; media: MediaItem}
  | {
      /** A garment cut out on the page's own paper. Given room, never a box. */
      kind: "product";
      media: MediaItem;
      /** The piece's name, and where it goes. Rendered as `RO36` does it. */
      label?: string | null;
      href?: string | null;
    }
  | {
      kind: "note";
      /** A heading is optional: most of these are a paragraph and nothing else. */
      heading?: string | null;
      text: string;
      /** Set only where the text is ours and still unapproved. */
      marked?: boolean;
      /** The draft/translation notice, already localised by the caller. */
      notice?: string | null;
    };

/**
 * WHERE THE OTHER KINDS GO, and it is not decoration.
 *
 * Mosaic's placement cycle pairs blocks 1+2, 3+4 and 7+8 into shared rows, so a
 * block placed at index 1, 3 or 6 lands BESIDE a photograph rather than alone in
 * a row of its own. Put a cut-out or a note anywhere else and the page has one —
 * but the MIXED ROW, which is the whole point, is still missing.
 *
 * Indices past the first cycle repeat at +8, so a long run keeps mixing instead
 * of turning into photographs after the eighth block.
 */
export const MIXED_SLOTS = [1, 3, 6, 9, 11, 14, 17, 19, 22];

/**
 * Weave photographs together with the other kinds so that every mixed slot that
 * has something to put in it gets one. Extras of either kind simply continue,
 * so the page degrades to a run of photographs, or to a run of prose, without a
 * rewrite.
 */
export function weaveMosaic(frames: MediaItem[], guests: MosaicBlock[]): MosaicBlock[] {
  const out: MosaicBlock[] = [];
  const queue = [...guests];
  let f = 0;
  for (let i = 0; queue.length || f < frames.length; i++) {
    if (MIXED_SLOTS.includes(i) && queue.length) {
      out.push(queue.shift()!);
    } else if (f < frames.length) {
      out.push({kind: "frame", media: frames[f++]});
    } else if (queue.length) {
      out.push(queue.shift()!);
    } else {
      break;
    }
    /* A guard: nothing here should ever run away, but a mosaic is a loop. */
    if (i > 400) break;
  }
  return out;
}

/**
 * INTERLEAVE THE GUESTS SO THE KINDS ALTERNATE (2026-08-13, section 118).
 *
 * The mixed slots are few, and if all the cut-outs are queued before all the
 * notes the page gets a run of objects and then a run of prose — two blocks of
 * one kind, which is the thing the mosaic exists to avoid. Zipping them means
 * consecutive mixed rows carry different kinds.
 */
export function zip<T>(a: T[], b: T[]): T[] {
  const out: T[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== undefined) out.push(a[i]);
    if (b[i] !== undefined) out.push(b[i]);
  }
  return out;
}

/** A cut-out tile as a mosaic block, with its piece's name and route. */
export function productBlock(tile: HomeTile, href: string | null): MosaicBlock {
  return {
    kind: "product",
    media: tile.media,
    label: tile.garment?.name ?? null,
    href,
  };
}

/** A written block as a mosaic block, already localised by the caller. */
export function noteBlock(
  n: MosaicNote,
  pick: (f: LocaleField) => string | null,
  marked: boolean,
  notice: string | null,
): MosaicBlock | null {
  const text = pick(n.text);
  if (!text) return null;
  return {kind: "note", heading: pick(n.heading), text, marked, notice};
}
