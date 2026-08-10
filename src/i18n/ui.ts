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
    /*
      DROP, INVARIABLE (2026-08-04). Italian does not pluralise the loanword:
      one drop, due drop. "Drops" on the Italian side was simply wrong, and the
      owner writes "drop" in his own messages. English keeps the plural where
      grammar wants it.
    */
    collections: "Drop",
    newDrop: "New",
    otherDrops: "Gli altri drop",
    /* The catalogue's control row and its three movements. */
    filterAll: "Tutti",
    filterEveryone: "Tutti",
    filterMen: "Uomo",
    filterWomen: "Donna",
    movementAvailable: "Disponibili",
    movementOneOfOne: "1 di 1",
    movementSold: "Esauriti",
    soldOut: "Esaurito",
    noneMatch: "Niente con questi filtri.",
    noneMatchHint: "Togli il filtro per vedere tutto.",
    allCreatures: "Tutte le Creature",
    previousCreature: "Precedente",
    nextCreature: "Successiva",
    countCreatures: "Creature",
    gallery: "Galleria",
    process: "Processo",
    designer: "Chi lo fa",
    creators: "Chi lo fa",
    inCollaborationWith: "In collaborazione con",
    about: "Chi siamo",
    contact: "Contatti",
    instagram: "Instagram",
    /*
      The name of a square's destination, not a description of its photograph:
      the alt text already says what is in the frame, and this says where the
      tap goes. Every other tile on the site leads to a piece, so a square that
      leaves the site has to say so (2026-08-10).
    */
    instagramOpen: "Apri su Instagram",
    newsletter: "Le prossime uscite",
    newsletterLine: "Pochi pezzi, poche volte l'anno. Scriviamo quando un drop è pronto.",
    newsletterAction: "Iscriviti",
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
    readyExplanation: "Già fatta. Prendila così com'è, o falla rifare sulle tue misure.",
    thisPieceMeasurements: "Misure di questo capo",
    /*
      1 OF 1 = PRIVATE COMMISSION (owner, 2026-08-04). Each was made once, to
      someone's measurements. It can be bought only as it is, so the line says
      what the piece IS rather than implying it could be repeated.
    */
    unique: "Commissione privata. 1 di 1, fatta una volta sola.",
    uniqueAction: "Acquista questo pezzo",
    uniqueIntro: "Fatta una volta sola, sulle misure di qualcun altro. Si acquista così com'è.",
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
    /*
      INTRO LINES (2026-08-04). A shop needs a sentence where an exhibition
      needs silence, and with the invented-but-flagged regime there is no
      reason left for bare pages. All OURS, all counted by inventedCopy
      (shopIntro, dropsIntro, contactIntro, homeLines), all in his register:
      short, declarative, subject dropped. Photography still carries no
      captions; these live between sections and at the tops of pages.
    */
    shopIntro: "Su misura, o disponibile subito. Fatto a mano nel Sud Italia.",
    enterDrop: "Vedi il drop",
    contactIntro: "Risponde una persona. Entro un giorno, ora italiana.",
    wornLine: "Addosso, alla luce del giorno.",
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
    newDrop: "New",
    otherDrops: "The other drops",
    filterAll: "All",
    filterEveryone: "Everyone",
    filterMen: "Men",
    filterWomen: "Women",
    movementAvailable: "Available",
    movementOneOfOne: "1 of 1",
    movementSold: "Sold out",
    soldOut: "Sold out",
    noneMatch: "Nothing matches those filters.",
    noneMatchHint: "Clear the filter to see everything.",
    allCreatures: "All Creature",
    previousCreature: "Previous",
    nextCreature: "Next",
    countCreatures: "Creature",
    gallery: "Gallery",
    process: "Process",
    designer: "The designer",
    creators: "Who makes it",
    inCollaborationWith: "In collaboration with",
    about: "About",
    contact: "Contact",
    instagram: "Instagram",
    instagramOpen: "Open on Instagram",
    email: "Email",
    newsletter: "The next drops",
    newsletterLine: "A few pieces, a few times a year. We write when a drop is ready.",
    newsletterAction: "Subscribe",
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
    readyExplanation: "Already made. Take it as it is, or have it remade to your measurements.",
    thisPieceMeasurements: "This piece's measurements",
    unique: "A private commission. 1 of 1, made once.",
    uniqueAction: "Acquire this piece",
    uniqueIntro: "Made once, to someone else's measurements. It is bought as it is.",
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
    shopIntro: "Made to measure, or ready now. Handmade in South Italy.",
    enterDrop: "See the drop",
    contactIntro: "A person replies. Within one day, Italian time.",
    wornLine: "On bodies, in daylight.",
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
/*
  THE MENU, FLAT (2026-08-04), on the primary reference's model as measured in
  section 14: one typeface, ONE SIZE (the 11px label, not a display size), one
  weight, uppercase, wide tracking, tight leading, left aligned.

  TWO GROUPS SEPARATED BY WHITESPACE ALONE. No rules, no headings, no
  sub-items, no dropdowns. Sub-items under Creature were considered and
  rejected: a menu entry that drops a visitor into the middle of a page is
  disorienting, and sectioning belongs inside the page, which is exactly what
  the catalogue's three movements now do.

  DROP IS NOT HERE. The drop index is reached from NEW and from each Creature,
  and it returns to the menu when there are five or six drops rather than three.
*/
export const MENU_DESTINATIONS = [
  {key: "menuHome", path: ""},
  {key: "newDrop", path: "new"},
  {key: "creatures", path: "creature"},
  {key: "process", path: "process"},
  {key: "about", path: "about"},
  {key: "contact", path: "contact"},
] as const satisfies ReadonlyArray<{key: UIKey; path: string}>;
