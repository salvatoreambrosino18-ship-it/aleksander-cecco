/*
  ORDER COPY.

  UNAPPROVED DRAFT. Written for the brand, not by it. ENQUIRY_COPY_IS_DRAFT
  stays true until the owner reads it, and every screen that shows it marks it
  as a draft in the same register as the brand story.

  IT SHRANK ON 2026-08-12 (section 98). The owner removed made to measure from
  the shop, so this file lost the three measuring instructions, the unit
  chooser, the as-is-or-remade question and the line explaining why the numbers
  were on screen when they were not required. What is left is one sentence: an
  order is a person asking for a piece that exists.

  His own sentence went with them. "Send us your measurements and we will make
  it for you", from the Armonyen post, was approved and is now false, so it
  cannot stay on a page that no longer takes measurements. The replacement is
  OURS until he writes one, and marked.

  It lives in code rather than in Sanity because it is interface copy. If he
  wants to edit it himself, moving it into site settings is a small change.
*/
import type {Locale} from "../lib/locales";

export const ENQUIRY_COPY_IS_DRAFT = true;

type EnquiryCopy = {
  intro: string;
  confirmation: string;
};

const copy: Record<Locale, EnquiryCopy> = {
  it: {
    intro:
      "Questa Creatura esiste ed è questa. Lasciaci il tuo nome e la tua email. Ti rispondiamo entro un giorno con pagamento e spedizione.",
    confirmation: "Richiesta ricevuta. Ti rispondiamo via email.",
  },
  en: {
    intro:
      "This Creature exists and it is this one. Leave your name and email. We answer within a day with payment and delivery.",
    confirmation: "Enquiry received. We will reply by email.",
  },
};

export function enquiryCopy(locale: Locale): EnquiryCopy {
  return copy[locale];
}
