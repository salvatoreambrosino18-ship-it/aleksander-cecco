/*
  WHOSE WORDS ARE THESE.

  The site carries three kinds of brand copy and must never let a reader, or the
  owner, mistake one for another (standing rule 6, and DESIGN-PLAN section 22).

    approved     the owner's own words, unaltered, in the language he wrote
                 them. Shown plainly, with no mark of any kind.
    translation  his words carried into the other language by us. The meaning is
                 his, the wording is not, so it is marked as an unapproved
                 TRANSLATION until he reads it. This is the whole reason the
                 mark distinguishes a translation from a draft: telling an
                 Italian reader "unapproved draft" would imply the brand has not
                 decided what it thinks, which is false.
    draft        words we wrote. Marked as an unapproved draft, as before.

  Two independent facts decide it, which is why one boolean could not:

  - WHICH LANGUAGES the owner has personally approved. He wrote in English, so
    `approvedLanguages` is ["en"] and Italian is a translation everywhere, even
    though Italian is the site's default locale. When he approves the Italian he
    ticks it in the studio and every mark on the site goes away at once.
  - WHETHER WE AUTHORED this particular block, regardless of language. The
    footer lines are ours in both languages and stay drafts in both.
*/
import type {Locale} from "./locales";
import type {SiteSettings} from "./content";

export type VoiceState = "approved" | "translation" | "draft";

/**
 * What kind of copy is this block, in this language?
 *
 * @param authored true when WE wrote the words, not the owner. Such a block is
 *   a draft in every language and no amount of approving a language fixes it.
 */
export function voiceState(
  settings: Pick<SiteSettings, "approvedLanguages">,
  locale: Locale,
  authored = false,
): VoiceState {
  if (authored) return "draft";
  // Default to ["en"], not to "everything is approved": if the field is empty
  // the honest answer is that only the language he wrote in is his.
  const approved = settings.approvedLanguages?.length ? settings.approvedLanguages : ["en"];
  return approved.includes(locale) ? "approved" : "translation";
}

/** Approved copy carries no mark. Everything else does. */
export function isMarked(state: VoiceState): boolean {
  return state !== "approved";
}
