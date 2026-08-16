/*
  Interface strings only: labels the site itself needs to work in two languages.
  No brand copy lives here. Anything the owner must write (statements, about
  text, garment descriptions, the enquiry reply window) comes from Sanity or
  stays a marked placeholder token. No em dashes, per standing rule 2.
*/
import type {Locale} from "../lib/locales";
import {copyOverrides} from "./overrides";

/*
  THE MADE-TO-MEASURE LINE IS OURS (2026-08-12, section 98). The owner removed
  made to measure from the shop and said what should stand in its place — that a
  made-to-measure order goes by email — but not in what words. So the sentence
  is ours, marked wherever it is shown, and flagged `madeToMeasureLine` in the
  studio until he writes his own.

  What replaced this flag's old job: there is no longer a sentence explaining a
  CHOICE between taking a piece as it is and having it remade, because there is
  no choice. A piece exists and is bought.
*/
export const MADE_TO_MEASURE_IS_DRAFT = true;

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
    experimentalLineBy: "Linea sperimentale di",
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
    // "Creature: Tomar. Composition: 100% lambskin. Handcrafted."
    creature: "Creatura",
    processTitle: "Solvet et Coagula",
    composition: "Composizione",
    handcrafted: "Lavorato a mano nel Sud Italia.",
    outsideCollections: "Fuori dalle collezioni.",
    // A buyer who cannot try anything on needs a way to use these numbers.
    fitGuidance: "Confrontale con un capo che già possiedi e che ti veste come vuoi.",
    /* OURS, flagged as madeToMeasureLine: made to measure is not a flow any
       more, it is an invitation to write (section 98). */
    madeToMeasureLine: "Su misura, solo su richiesta: scrivici e ne parliamo.",
    availableNow: "Disponibile subito.",
    thisPieceMeasurements: "Misure di questo capo",
    /* SIZES, back on his third answer (sections 100 and 101). */
    sizeQuestion: "Taglia",
    oneSize: "Taglia unica.",
    chooseSize: "Scegli la taglia",
    /* OURS, flagged as deliveryLine: his number, our sentence (section 102). */
    deliveryLine: "Ogni pezzo è fatto dopo l'ordine: massimo due settimane prima della spedizione.",
    /*
      1 OF 1 = PRIVATE COMMISSION (owner, 2026-08-04). Each was made once, to
      someone's measurements. It can be bought only as it is, so the line says
      what the piece IS rather than implying it could be repeated.
    */
    unique: "Commissione privata. 1 di 1, fatta una volta sola.",
    uniqueAction: "Acquista questo pezzo",
    privateOrder: "Ordine privato.",
    notTakingRequests: "Non in lavorazione ora.",
    // "Creatura" is the owner's own word for a piece, not ours (2026-08-02).
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
    /*
      HIS NAMES, IN HIS ENGLISH, ON BOTH PAGES (section 99). He titled these
      sections himself, and the three reasons carry his titles as plain strings
      with no translation at all — OUR SKINS, REASONS, REBORN. Translating two
      of his titles and not the other three would be the site speaking in two
      voices about the same document.
    */
    theProject: "THE PROJECT",
    bodyOfLight: "BODY OF LIGHT",
    worn: "Addosso",
    theMaking: "La lavorazione",
    /* The owner's word for a piece. Plural "Creature", singular "Creatura". */
    creatures: "Creature",
    // Footer block headings.
    support: "Assistenza",
    worldwideShipping: "Spedizioni in tutto il mondo",
    madeInItaly: "Lavorato a mano nel Sud Italia",
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
    /*
      CORRETTA 13/08/2026 (sezione 108). Diceva "Su misura, o disponibile
      subito", una scelta che non esiste piu dal 12/08: ogni Creatura esiste,
      e fotografata, e si compra com'e. La riga vendeva un flusso rimosso, in
      cima al catalogo. / Corrected 2026-08-13: it offered a choice the shop
      stopped making on 2026-08-12.
    */
    shopIntro: "Ogni pezzo esiste già. Lavorato a mano nel Sud Italia.",
    enterDrop: "Vedi il drop",
    contactIntro: "Risponde una persona. Entro un giorno, ora italiana.",
    /*
      QUELLO CHE MANCAVA A QUESTA PAGINA (2026-08-17, sezione 125). Aveva due
      indirizzi e due righe di spedizione, e non diceva ne DOVE si trova il
      marchio ne COSA fare se il messaggio riguarda un acquisto. NOSTRE, con i
      suoi fatti dentro, segnate `contactCopy`. / OURS, carrying his facts.
    */
    contactWhere: "Lo studio è a Napoli. La pelle si concia a un'ora di strada, a Solofra.",
    contactBuy: "Per comprare un capo non serve scrivere: ogni Creatura ha il suo modulo d'ordine.",
    /*
      L'ORDINE DI PIU PEZZI (2026-08-17, sezione 126). NOSTRI, segnati
      `orderCopy`. Il totale non e un prezzo nuovo: e la somma dei prezzi che
      sono gia sulle pagine dei capi.
    */
    orderSeveral: "Ordina piu pezzi",
    orderSeveralIntro: "Scegli i pezzi, la taglia e quante ne vuoi. Nessun pagamento qui: confermiamo tutto per email.",
    orderEmpty: "Non hai ancora scelto niente.",
    orderQuantity: "Quantita",
    orderTotal: "Totale",
    orderYourOrder: "Il tuo ordine",
    orderAdd: "Aggiungi all'ordine",
    orderAdded: "Nell'ordine",
    orderRemove: "Togli",
    orderPieces: "I pezzi",
    orderOnePiece: "Pezzo unico: ne esiste uno solo.",
    orderNoPayment: "Il pagamento non si fa qui. Ti rispondiamo per email e lo definiamo insieme.",
    orderSend: "Invia l'ordine",
    wornLine: "Addosso, alla luce del giorno.",
    acquire: "Acquista",
    placeOrder: "Invia l'ordine",
    sending: "Invio in corso",
    yourName: "Nome",
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
    experimentalLineBy: "Experimental line by",
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
    handcrafted: "Handcrafted in South Italy.",
    outsideCollections: "Outside the collections.",
    fitGuidance: "Compare these with a garment you already own and like the fit of.",
    madeToMeasureLine: "Made to measure on request only: write to us and we will talk.",
    availableNow: "Available now.",

    thisPieceMeasurements: "This piece's measurements",
    sizeQuestion: "Size",
    oneSize: "One size.",
    chooseSize: "Choose a size",
    deliveryLine: "Each piece is made after the order: two weeks at most before it ships.",
    unique: "A private commission. 1 of 1, made once.",
    uniqueAction: "Acquire this piece",
    privateOrder: "Private order.",
    notTakingRequests: "Not in the making now.",
    draftNotice: "Unapproved draft",
    provisionalPhoto: "Provisional photograph",
    provisionalFact: "Not yet confirmed",
    translationNotice: "Unapproved translation",
    theWork: "The work",
    theProject: "THE PROJECT",
    bodyOfLight: "BODY OF LIGHT",
    worn: "Worn",
    theMaking: "The making",
    creatures: "Creature",
    support: "Support",
    worldwideShipping: "Worldwide shipping",
    madeInItaly: "Handcrafted in South Italy",
    price: "Price",
    priceFrom: "From",
    order: "Order",
    // See the Italian above (section 108): the choice this line offered was
    // removed from the shop on 2026-08-12.
    shopIntro: "Every piece already exists. Handcrafted in South Italy.",
    enterDrop: "See the drop",
    contactIntro: "A person replies. Within one day, Italian time.",
    contactWhere: "The studio is in Naples. The leather is tanned an hour up the road, in Solofra.",
    contactBuy: "To buy a piece you do not have to write: every Creature has its own order form.",
    orderSeveral: "Order several pieces",
    orderSeveralIntro: "Choose the pieces, the size and how many. No payment here: we confirm everything by email.",
    orderEmpty: "You have not chosen anything yet.",
    orderQuantity: "Quantity",
    orderTotal: "Total",
    orderYourOrder: "Your order",
    orderAdd: "Add to order",
    orderAdded: "In the order",
    orderRemove: "Remove",
    orderPieces: "The pieces",
    orderOnePiece: "One of one: only this one exists.",
    orderNoPayment: "Payment does not happen here. We reply by email and settle it with you.",
    orderSend: "Send the order",
    wornLine: "On bodies, in daylight.",
    acquire: "Acquire",
    placeOrder: "Place the order",
    sending: "Placing the order",
    yourName: "Name",
    note: "Note",
    details: "Technical details",
    shippingReturns: "Shipping and returns",
    nothingYet: "Nothing here yet.",
    notFound: "Nothing here.",
    backHome: "Back to the beginning",
  },
} as const;

export type UIKey = keyof (typeof ui)["it"];

/*
  WHICH OF THESE ARE HIS TO REWRITE (2026-08-18, section 128).

  Everything the BRAND SAYS is his: sentences, section titles, the words over a
  photograph, the way a state is described. Everything the INTERFACE NEEDS to
  work is not: the label above an input, the word on a state chip, the string a
  screen reader is given, the name of a filter that maps onto a schema value.

  The test is what an empty value would mean. Blank "Handcrafted in South
  Italy." is an editorial decision — the line simply is not said. Blank "Email"
  above the email box is a broken form, and blank "Sold out" is a garment whose
  status has disappeared. So the first is offered to him in the studio and the
  second is not, and this list is the whole of that decision.

  Anything named here appears in the studio under LE PAROLE DEL SITO, empty,
  with our line shown as the placeholder. Blank means "use ours".
*/
export const OWNER_EDITABLE = [
  // the sentences the brand speaks
  "handcrafted", "madeInItaly", "shopIntro", "contactIntro", "contactWhere", "contactBuy",
  "newsletterLine", "outsideCollections", "fitGuidance", "madeToMeasureLine", "deliveryLine",
  "availableNow", "oneSize", "unique", "privateOrder", "notTakingRequests", "wornLine",
  "orderSeveralIntro", "orderOnePiece", "orderNoPayment", "nothingYet", "notFound",
  // the titles that head a part of a page
  "theWork", "theProject", "bodyOfLight", "worn", "theMaking", "processTitle",
  "newsletter", "otherDrops", "enterDrop", "allCreatures", "orderSeveral", "orderPieces",
  "orderYourOrder", "support", "worldwideShipping", "shippingReturns", "footerNav",
  // his own words for his own things
  "creature", "creatures", "collections", "newDrop", "acquire", "uniqueAction", "orderAdd",
  // the menu, the catalogue's own words, the buttons, and the labels under a piece
  "menuHome", "gallery", "process", "about", "contact", "designer", "creators", "experimentalLineBy", "filterAll", "filterEveryone", "filterMen", "filterWomen", "movementAvailable", "movementOneOfOne", "movementSold", "soldOut", "noneMatch", "noneMatchHint", "placeOrder", "orderSend", "backHome", "newsletterClosed", "composition", "materials", "availability", "price", "priceFrom", "thisPieceMeasurements", "referenceMeasurements", "collection", "details",
] as const satisfies ReadonlyArray<UIKey>;

const editable = new Set<string>(OWNER_EDITABLE);

/**
 * The string for a key, in his words where he has written them.
 *
 * Falls through to ours on: a key he cannot edit, a dataset that did not
 * answer, a field he has not filled, and a field he filled in the other
 * language only. A page never renders empty because a field is empty.
 */
export function t(locale: Locale, key: UIKey): string {
  if (editable.has(key)) {
    const his = copyOverrides[key]?.[locale];
    if (typeof his === "string" && his.trim() !== "") return his;
  }
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
