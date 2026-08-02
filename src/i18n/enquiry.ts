/*
  Enquiry copy.

  UNAPPROVED DRAFT. Written for the brand, not by it, and the brand owner has
  not seen it. ENQUIRY_COPY_IS_DRAFT stays true until he does, and every screen
  that shows this copy marks it as a draft in the same register as the brand
  story: readable in full, because that is how it gets judged, with a marked
  notice and a rule beside it.

  It lives in code rather than in Sanity because it is interface copy with a
  fixed shape (three measurement instructions, in this order) rather than
  something the owner rewrites freely. If he wants to edit it himself, moving it
  into site settings is a small change: same strings, four more fields.

  The reply window is SET, 2026-08-02: the owner committed to one day maximum,
  so the confirmation promises "within one day" and no more. It lives in the
  Pages Function beside the rest of the confirmation copy, not here. The
  {REPLY_WINDOW} token is retired.

  ONE EXCEPTION, added 2026-08-02: the English intro is now the owner's OWN
  sentence, from the Armonyen post, and is therefore approved. It said what our
  draft was trying to say and said it better, which is the whole argument for
  taking the voice from his captions rather than inventing one. The Italian is
  our translation of it. The measuring instructions below remain ours, and are
  deliberately NOT compressed into his register: they are the one place on the
  site where a person has to act on what they read, and clarity beats style.
*/
import type {Locale} from "../lib/locales";

export const ENQUIRY_COPY_IS_DRAFT = true;

type EnquiryCopy = {
  intro: string;
  measureTitle: string;
  /** Which unit the three numbers are in. Chosen once, for all of them. */
  unitQuestion: string;
  measures: Array<{label: string; how: string}>;
  /** Practical help, because most people measure themselves alone. */
  measureHelp: string;
  confirmation: string;
};

const copy: Record<Locale, EnquiryCopy> = {
  it: {
    // Our translation of his line below.
    intro: "Inviaci le tue misure e penseremo noi a crearla apposta per te.",
    measureTitle: "Come prendere le misure",
    unitQuestion: "In che unita sono le misure",
    measures: [
      {
        label: "Torace",
        how: "misura nel punto piu ampio, sotto le ascelle, tenendo il metro aderente ma non stretto.",
      },
      {
        label: "Spalle",
        how: "da un'estremita della spalla all'altra, passando dietro la schiena.",
      },
      {
        label: "Lunghezza",
        how: "dalla base del collo fino al punto dove vuoi che la Creatura finisca.",
      },
    ],
    measureHelp:
      "Se non hai un metro da sarto va bene uno spago: misuralo poi con un metro rigido. Per le spalle fatti aiutare da qualcuno, da solo viene quasi sempre sbagliata. Nel dubbio scrivi la misura che ti sembra piu probabile e diccelo nelle note.",
    confirmation: "Richiesta ricevuta. Ti rispondiamo via email.",
  },
  en: {
    // HIS WORDS, verbatim, from the Armonyen post.
    intro: "Send us your measurements and we'll take care of creating it specifically for you.",
    measureTitle: "How to measure",
    unitQuestion: "Which unit are these in",
    measures: [
      {
        label: "Chest",
        how: "measure at the widest point, under the arms, keeping the tape snug but not tight.",
      },
      {
        label: "Shoulders",
        how: "from the outer edge of one shoulder to the other, across the back.",
      },
      {
        label: "Length",
        how: "from the base of the neck down to where you want the Creature to end.",
      },
    ],
    measureHelp:
      "No tape measure is fine: use a piece of string and measure the string against a ruler. Ask someone to help with the shoulders, because alone it is almost always wrong. If you are unsure, send your best guess and say so in the note.",
    confirmation: "Enquiry received. We will reply by email.",
  },
};

export function enquiryCopy(locale: Locale): EnquiryCopy {
  return copy[locale];
}
