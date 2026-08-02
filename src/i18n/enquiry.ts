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

  The reply window is deliberately NOT here. The brand is not committed to a
  response time nobody has agreed, so the confirmation carries the
  {REPLY_WINDOW} placeholder until the owner sets one.
*/
import type {Locale} from "../lib/locales";

export const ENQUIRY_COPY_IS_DRAFT = true;

type EnquiryCopy = {
  intro: string;
  measureTitle: string;
  measures: Array<{label: string; how: string}>;
  confirmation: string;
};

const copy: Record<Locale, EnquiryCopy> = {
  it: {
    intro: "Ogni Creatura viene costruita su misura. Lasciaci le tue misure e ti scriviamo noi.",
    measureTitle: "Come prendere le misure",
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
    confirmation: "Richiesta ricevuta. Ti rispondiamo via email.",
  },
  en: {
    intro: "Every Creature is built to measure. Leave your measurements and we will write back.",
    measureTitle: "How to measure",
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
    confirmation: "Enquiry received. We will reply by email.",
  },
};

export function enquiryCopy(locale: Locale): EnquiryCopy {
  return copy[locale];
}
