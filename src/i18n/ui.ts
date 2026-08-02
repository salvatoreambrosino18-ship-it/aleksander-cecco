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
    // "Creatura" is the owner's own word for a piece, not ours (2026-08-02).
    madeToMeasureValue: "Ogni Creatura è realizzata sulle misure di chi la indosserà",
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
    notFound: "Pagina non trovata",
    backHome: "Torna all'inizio",
  },
  en: {
    skipToContent: "Skip to content",
    home: "Aleksander Cecco, home",
    menu: "Menu",
    close: "Close",
    languageLabel: "Language",
    collections: "Collections",
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
    madeToMeasureValue: "Every Creature is built to the measurements of the person who will wear it",
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
    notFound: "Page not found",
    backHome: "Back to the beginning",
  },
} as const;

export type UIKey = keyof (typeof ui)["it"];

export function t(locale: Locale, key: UIKey): string {
  return ui[locale][key];
}

/*
  The menu destinations. Deliberately three, not four: the wireframe in
  DESIGN-PLAN section 4 lists a "Capi" (all garments) entry, but no such page
  exists in the page list, and linking a menu at a page that was never planned
  is how dead ends get built. Add it here the day that page exists.
*/
export const MENU_DESTINATIONS = [
  {key: "collections", path: "collections"},
  {key: "archive", path: "archive"},
  {key: "about", path: "about"},
  {key: "contact", path: "contact"},
] as const satisfies ReadonlyArray<{key: UIKey; path: string}>;
