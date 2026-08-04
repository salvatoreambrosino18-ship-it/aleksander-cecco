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
    menuHome: "Home",
    home: "Aleksander Cecco, home",
    menu: "Menu",
    close: "Chiudi",
    languageLabel: "Lingua",
    collections: "Drops",
    allCreatures: "Tutte le Creature",
    previousCreature: "Precedente",
    nextCreature: "Successiva",
    countCreatures: "Creature",
    gallery: "Galleria",
    process: "Processo",
    designer: "Chi lo fa",
    about: "Chi siamo",
    contact: "Contatti",
    instagram: "Instagram",
    newsletter: "Le prossime uscite",
    newsletterLine: "Ogni Creatura esiste in pochi esemplari. Scrivici e ti diciamo quando esce la prossima.",
    newsletterAction: "Tienimi aggiornato",
    newsletterClosed: "Le iscrizioni non sono ancora aperte.",
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
    processTitle: "Solvet et Coagula",
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
    /*
      THE ACTION IS AN ORDER (2026-08-04). "Send enquiry" told a buyer they were
      writing a message; his own shop sells. The label carries the price, which
      is the one number a person checks before pressing anything. Copy is ours,
      flagged as enquiryCopy.
    */
    order: "Ordine",
    acquire: "Acquista",
    placeOrder: "Invia l'ordine",
    sending: "Invio in corso",
    yourName: "Nome",
    yourMeasurements: "Le tue misure",
    note: "Note",
    details: "Scheda tecnica",
    shippingReturns: "Spedizioni e resi",
    // Empty states. What is true, said plainly, never a token.
    nothingYet: "Ancora niente qui.",
    notFound: "Niente qui.",
    backHome: "Torna all'inizio",
  },
  en: {
    skipToContent: "Skip to content",
    menuHome: "Home",
    home: "Aleksander Cecco, home",
    menu: "Menu",
    close: "Close",
    languageLabel: "Language",
    collections: "Drops",
    allCreatures: "All Creature",
    previousCreature: "Previous",
    nextCreature: "Next",
    countCreatures: "Creature",
    gallery: "Gallery",
    process: "Process",
    designer: "The designer",
    about: "About",
    contact: "Contact",
    instagram: "Instagram",
    email: "Email",
    newsletter: "The next drops",
    newsletterLine: "Every Creature exists in very small numbers. Leave your address and we will tell you when the next one is made.",
    newsletterAction: "Keep me posted",
    newsletterClosed: "Sign-up is not open yet.",
    footerNav: "Links",
    collection: "Collection",
    category: "Category",
    materials: "Materials",
    referenceMeasurements: "Reference measurements",
    madeToMeasure: "Made to measure",
    availability: "How it can be had",
    creature: "Creature",
    processTitle: "Solvet et Coagula",
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
    order: "Order",
    acquire: "Acquire",
    placeOrder: "Place the order",
    sending: "Placing the order",
    yourName: "Name",
    yourMeasurements: "Your measurements",
    note: "Note",
    details: "Technical details",
    shippingReturns: "Shipping and returns",
    nothingYet: "Nothing here yet.",
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
  /*
    SIX DESTINATIONS (2026-08-04). Home leads, because the signature-as-home-link
    is a convention only designers know. The gallery is gone: its frames live on
    the process page now (DESIGN-PLAN section 65), so imagery has one home and
    products only ever live in the shop. "Process" rather than the formula,
    because SOLVET ET COAGULA in a menu is illegible to anyone who does not
    already know the brand; the formula is the page's own title, inside.
  */
  {key: "menuHome", path: ""},
  {key: "creatures", path: "creature"},
  {key: "collections", path: "collections"},
  {key: "process", path: "process"},
  {key: "about", path: "about"},
  {key: "contact", path: "contact"},
] as const satisfies ReadonlyArray<{key: UIKey; path: string}>;
