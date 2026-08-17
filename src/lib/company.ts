/*
  CHI VENDE. The legal identification of the seller.

  WHY IT EXISTS (2026-08-17, section 137). Until today the site named a PERSON
  — "Aleksander Cecco" in the footer, and nothing else. The seller is now a
  company, and a company selling at distance has to say who it is: the
  denomination, the registered office and the VAT number, on every page,
  legible without hunting. BRIEF-LEGALE section 6.3 is where this comes from.

  WHY IT IS NOT IN SANITY, which is the exception to how every other fact on
  this site is stored. Every editable field can be emptied, and this site is
  built so that an empty field renders as a visible placeholder rather than as
  silence (standing rule 6). That behaviour is right for a shipping line and
  wrong for this one: a footer reading {COMPANY} is not a missing sentence, it
  is a shop trading without identifying its seller, and it would look like a
  design bug rather than the compliance failure it is. These four facts change
  when the company changes, which is a commit, not an afternoon in the studio.

  ONE LINE, and it stays one line. The temptation is a block with labels —
  Denominazione, Sede legale, Partita IVA — which is what most Italian shop
  footers do. This footer is an inscription (section 26); a labelled table in
  it would be the shop-footer structure coming back through the legal door.
  The facts are separated by commas and the reader takes what they need.

  NOT TRANSLATED, deliberately. A company's registered denomination and its
  office are proper nouns: "Cecco Trading SRLS" is its name in both languages,
  and translating the address would make it wrong for anyone trying to use it.
  P.IVA is the one token an English reader may not know, and it is followed by
  a number that is unmistakable in context.
*/

export const COMPANY = {
  name: "Cecco Trading SRLS",
  address: "Via Torretta di Siena 16, 80058 Torre Annunziata (NA)",
  vat: "P.IVA 11133331212",
} as const;

/** The whole identification as the footer prints it, on one line. */
export const COMPANY_LINE = `${COMPANY.name}, ${COMPANY.address}, ${COMPANY.vat}`;
