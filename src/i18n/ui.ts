/*
  Interface strings only: labels the site itself needs to work in two languages.
  No brand copy lives here. Anything the owner must write (statements, about
  text, garment descriptions, the enquiry reply window) comes from Sanity or
  stays a marked placeholder token. No em dashes, per standing rule 2.
*/
import type {Locale} from "../lib/locales";

const ui = {
  it: {
    skipToContent: "Vai al contenuto",
    home: "Aleksander Cecco, home",
    menu: "Menu",
    close: "Chiudi",
    languageLabel: "Lingua",
    collections: "Collezioni",
    allCreatures: "Tutte le Creature",
    archive: "Archivio",
    about: "Chi siamo",
    contact: "Contatti",
    instagram: "Instagram",
    email: "Email",
    footerNav: "Collegamenti",
    collection: "Collezione",
    category: "Categoria",
    materials: "Materiali",
    referenceMeasurements: "Misure di riferimento",
    madeToMeasure: "Su misura",
    // How a Creature can be had. His register: short, declarative, no hedging.
    availability: "Come si ottiene",
    // The inscription on a Creature page, in his own caption format:
    // "Creature: Tomar. Composition: 100% lambskin. Handmade."
    creature: "Creatura",
    composition: "Composizione",
    handmadeMadeToMeasure: "Fatto a mano. Su misura.",
    outsideCollections: "Fuori dalle collezioni.",
    // A buyer who cannot try anything on needs a way to use these numbers.
    fitGuidance: "Confrontale con un capo che gia possiedi e che ti veste come vuoi.",
    madeToOrder: "Su ordinazione.",
    unique: "Unica. 1 di 1.",
    privateOrder: "Ordine privato.",
    notTakingRequests: "Non in lavorazione ora.",
    // "Creatura" is the owner's own word for a piece, not ours (2026-08-02).
    madeToMeasureValue: "Costruita sulle tue misure.",
    draftNotice: "Bozza non approvata",
    /*
      Distinct from draftNotice on purpose. The brand HAS decided what it says;
      it said it in English. Marking the Italian "unapproved draft" would imply
      otherwise. It is an unapproved translation, which is a different claim.
    */
    translationNotice: "Traduzione non approvata",
    // Home sequence section labels. These name a region, they are not brand
    // copy: the brand's own words for each section come from Sanity.
    theWork: "Il lavoro",
    worn: "Addosso",
    theMaking: "La lavorazione",
    /* The owner's word for a piece. Plural "Creature", singular "Creatura". */
    creatures: "Creature",
    // Footer block headings.
    support: "Assistenza",
    worldwideShipping: "Spedizioni in tutto il mondo",
    madeInItaly: "Fatto a mano nel Sud Italia",
    price: "Prezzo",
    enquire: "Invia richiesta",
    yourName: "Nome",
    yourMeasurements: "Le tue misure",
    note: "Note",
    details: "Scheda tecnica",
    shippingReturns: "Spedizioni e resi",
    notFound: "Niente qui.",
    backHome: "Torna all'inizio",
  },
  en: {
    skipToContent: "Skip to content",
    home: "Aleksander Cecco, home",
    menu: "Menu",
    close: "Close",
    languageLabel: "Language",
    collections: "Collections",
    allCreatures: "All Creature",
    archive: "Archive",
    about: "About",
    contact: "Contact",
    instagram: "Instagram",
    email: "Email",
    footerNav: "Links",
    collection: "Collection",
    category: "Category",
    materials: "Materials",
    referenceMeasurements: "Reference measurements",
    madeToMeasure: "Made to measure",
    availability: "How it can be had",
    creature: "Creature",
    composition: "Composition",
    handmadeMadeToMeasure: "Handmade. Made to measure.",
    outsideCollections: "Outside the collections.",
    fitGuidance: "Compare these with a garment you already own and like the fit of.",
    madeToOrder: "Made to order.",
    unique: "Unique. 1 of 1.",
    privateOrder: "Private order.",
    notTakingRequests: "Not in the making now.",
    madeToMeasureValue: "Built to your measurements.",
    draftNotice: "Unapproved draft",
    translationNotice: "Unapproved translation",
    theWork: "The work",
    worn: "Worn",
    theMaking: "The making",
    creatures: "Creature",
    support: "Support",
    worldwideShipping: "Worldwide shipping",
    madeInItaly: "Handmade in South Italy",
    price: "Price",
    enquire: "Send enquiry",
    yourName: "Name",
    yourMeasurements: "Your measurements",
    note: "Note",
    details: "Technical details",
    shippingReturns: "Shipping and returns",
    notFound: "Nothing here.",
    backHome: "Back to the beginning",
  },
} as const;

export type UIKey = keyof (typeof ui)["it"];

export function t(locale: Locale, key: UIKey): string {
  return ui[locale][key];
}

/*
  The menu destinations. The "all Creature" entry that DESIGN-PLAN section 4
  always wanted is here now, because as of 2026-08-02 the page it points at
  exists: with sixteen Creature the catalogue needs a view of everything, and
  the rule against linking a menu at a page that was never built still holds.
*/
export const MENU_DESTINATIONS = [
  {key: "allCreatures", path: "creature"},
  {key: "collections", path: "collections"},
  {key: "archive", path: "archive"},
  {key: "about", path: "about"},
  {key: "contact", path: "contact"},
] as const satisfies ReadonlyArray<{key: UIKey; path: string}>;
