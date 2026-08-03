/*
  Interface strings only: labels the site itself needs to work in two languages.
  No brand copy lives here. Anything the owner must write (statements, about
  text, garment descriptions, the enquiry reply window) comes from Sanity or
  stays a marked placeholder token. No em dashes, per standing rule 2.
*/
import type {Locale} from "../lib/locales";

/*
  The two-state availability copy is OURS, written 2026-08-03 and not yet seen
  by the owner, so every screen that shows it marks it as a draft in the same
  register as the brand story. The one-word states ("Available now.") are labels
  like their four siblings; what is marked is the sentence that explains the
  CHOICE a ready piece gives a buyer, because that sentence makes a promise
  about how the brand sells and only he can approve one.
*/
export const AVAILABILITY_COPY_IS_DRAFT = true;

const ui = {
  it: {
    skipToContent: "Vai al contenuto",
    home: "Aleksander Cecco, home",
    menu: "Menu",
    close: "Chiudi",
    languageLabel: "Lingua",
    collections: "Collezioni",
    allCreatures: "Tutte le Creature",
    previousCreature: "Precedente",
    nextCreature: "Successiva",
    countCreatures: "Creature",
    gallery: "Galleria",
    designer: "Chi lo fa",
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
    availableNow: "Disponibile subito.",
    /*
      OURS, and marked as ours wherever it is shown (AVAILABILITY_COPY_IS_DRAFT).
      It is the one place the site explains a choice rather than stating a fact,
      because a piece that already exists gives the buyer two different things
      and saying only "available now" would hide the second one.
    */
    readyExplanation:
      "Questa Creatura è già fatta. Puoi prenderla così com'è, oppure fartela rifare sulle tue misure.",
    thisPieceMeasurements: "Misure di questo capo",
    unique: "Unica. 1 di 1.",
    privateOrder: "Ordine privato.",
    notTakingRequests: "Non in lavorazione ora.",
    // "Creatura" is the owner's own word for a piece, not ours (2026-08-02).
    madeToMeasureValue: "Costruita sulle tue misure.",
    draftNotice: "Bozza non approvata",
    provisionalPhoto: "Fotografia provvisoria",
    // Distinct from a draft: the wording is settled, the FACT is not confirmed.
    provisionalFact: "Da confermare",
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
    priceFrom: "Da",
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
    previousCreature: "Previous",
    nextCreature: "Next",
    countCreatures: "Creature",
    gallery: "Gallery",
    designer: "The designer",
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
    availableNow: "Available now.",
    readyExplanation:
      "This Creature is already made. Take it as it is, or have it remade to your measurements.",
    thisPieceMeasurements: "This piece's measurements",
    unique: "Unique. 1 of 1.",
    privateOrder: "Private order.",
    notTakingRequests: "Not in the making now.",
    madeToMeasureValue: "Built to your measurements.",
    draftNotice: "Unapproved draft",
    provisionalPhoto: "Provisional photograph",
    provisionalFact: "Not yet confirmed",
    translationNotice: "Unapproved translation",
    theWork: "The work",
    worn: "Worn",
    theMaking: "The making",
    creatures: "Creature",
    support: "Support",
    worldwideShipping: "Worldwide shipping",
    madeInItaly: "Handmade in South Italy",
    price: "Price",
    priceFrom: "From",
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
  {key: "gallery", path: "gallery"},
  /*
    The designer is no longer a destination of its own (2026-08-03). It is the
    end of the about page: the brand's story, then the person who makes it, so
    the menu carries one entry where it carried two and the reader arrives at
    him instead of being sent to him. `designer` survives as the heading of that
    section, which is why the string stays.
  */
  {key: "about", path: "about"},
  {key: "contact", path: "contact"},
] as const satisfies ReadonlyArray<{key: UIKey; path: string}>;
