/*
  Interface strings only: labels the site itself needs to work in two languages.
  No brand copy lives here. Anything the owner must write (statements, about
  text, garment descriptions, the enquiry reply window) comes from Sanity or
  stays a marked placeholder token. No em dashes, per standing rule 2.
*/
import type {Locale} from "../lib/locales";
import {copyOverrides} from "./overrides";

/*
  THE MADE-TO-MEASURE LINE IS GONE (2026-08-16, section 130), and so is the flag
  that marked it as our draft. The OWNER decided there is no made to measure at
  all — in the same breath as XS, S, M, L on everything — so a sentence of ours
  offering it "on request" stopped being an unapproved draft and became a FALSE
  OFFER, on every piece page and on /contact. Both went in the same change, and
  so did its studio field: a field an editor can fill that no page reads is a
  promise the studio cannot keep.

  THE SENTENCE, recorded so it can come back without archaeology:
    "Su misura, solo su richiesta: scrivici e ne parliamo."
    "Made to measure on request only: write to us and we will talk."
*/

/*
  AND THE WAIT WENT WITH IT (2026-08-16, section 131). THE OWNER'S DECISION:
  **available now is what the site says.** Every piece page carried "DISPONIBILE
  SUBITO." and, one line below, a sentence promising the piece would be MADE
  after the order — two claims about the terms of sale that cannot both be true,
  on the page where a person commits.

  `deliveryLine` was the second one. It stood on a piece, on its order form, in
  the cart and on /contact, and it is gone from all four, from the studio field
  that fed it, and from the order confirmation. Nothing replaced it: what a
  buyer needs to know is that the piece exists, which the availability line
  already says.

  THE SENTENCE, recorded so it can come back without archaeology:
    "Ogni pezzo è fatto dopo l'ordine: massimo due settimane prima della spedizione."
    "Each piece is made after the order: two weeks at most before it ships."

  AND THE TWO INSCRIPTION LABELS WENT THE SAME WAY (2026-08-16, section 135):
  `creature` was "Creatura" / "Creature" and `composition` was "Composizione" /
  "Composition". They introduced the name and the material on a piece's page,
  each followed by a colon, and the colon was the last one section 134 had left
  standing. Removing it while keeping the label gives "Creatura Armonyen",
  which is not Italian. The labels went instead, and the facts they introduced
  stayed.

  This also settles item 4 on THE OPEN LIST — "two weeks: working hours or
  elapsed?" — by removing the claim that raised it.
*/

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
    processTitle: "Solvet et Coagula",
    handcrafted: "Lavorato a mano nel Sud Italia.",
    outsideCollections: "Fuori dalle collezioni.",
    /*
      THE OTHER COLOUR EXISTS (2026-08-20). OURS, flagged `relatedPieceLine`.
      The piece's NAME is printed after this, as a link, so the line has to end
      where a name can follow it: "Esiste anche come Styrax Red Goat."
    */
    alsoExistsAs: "Esiste anche come",
    // A buyer who cannot try anything on needs a way to use these numbers.
    fitGuidance: "Confrontale con un capo che già possiedi e che ti veste come vuoi.",
    availableNow: "Disponibile subito.",
    thisPieceMeasurements: "Misure di questo capo",
    /* SIZES, back on his third answer (sections 100 and 101). */
    sizeQuestion: "Taglia",
    oneSize: "Taglia unica.",
    chooseSize: "Scegli la taglia",
    /*
      NESSUNA TAGLIA È SCELTA IN PARTENZA (2026-08-16, sezione 130), quindi
      serve una frase per quando uno preme senza averla scelta.
    */
    chooseSizeFirst: "Scegli prima la taglia",
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
    contactBuy: "Per comprare un capo non serve scrivere. Ogni Creatura ha il suo modulo d'ordine.",
    /*
      IL CARRELLO (2026-08-16, sezione 129). NOSTRE, segnate `orderCopy`. Il
      totale non è un prezzo nuovo: è la somma dei prezzi che sono già sulle
      pagine dei capi.
    */
    cart: "Carrello",
    cartIntro: "Questi sono i pezzi che hai scelto. Qui non si paga. Confermiamo tutto per email.",
    cartEmpty: "Il carrello è vuoto.",
    cartQuantity: "Quantità",
    cartTotal: "Totale",
    cartYourDetails: "I tuoi dati",
    cartAdd: "Aggiungi al carrello",
    cartAdded: "Nel carrello",
    cartRemove: "Togli",
    cartPieces: "I pezzi",
    cartOnePiece: "Pezzo unico. Ne esiste uno solo.",
    cartNoPayment: "Il pagamento non si fa qui. Ti rispondiamo per email e lo definiamo insieme.",
    cartSend: "Invia l'ordine",
    /*
      QUANDO IL BROWSER NON ESEGUE SCRIPT. Non è una scusa: è l'unica frase
      onesta che questa pagina può dire, e dice anche dove andare invece.
    */
    cartNeedsScript: "Il carrello ha bisogno di JavaScript, che in questo browser è spento. Ogni Creatura si può comprare lo stesso, dalla sua pagina.",
    wornLine: "Addosso, alla luce del giorno.",
    /*
      IL PREZZO STA SUL PULSANTE (sezione 4) E IL TRATTINO NO (sezione 134).
      Diceva «Acquista — 950 €». La parola al posto del segno tiene la
      decisione e toglie la punteggiatura.
    */
    /*
      LE PAGINE LEGALI E LE DUE RIGHE CHE CI PORTANO (2026-08-17, sezione 137).

      I DUE TITOLI sono i nomi dei documenti dell'avvocato, non frasi del
      marchio, e non stanno in OWNER_EDITABLE: il titolare può riscrivere cosa
      dice il negozio, non come si chiama un atto legale.

      LE ALTRE DUE RIGHE SONO NOSTRE, ed è il punto delicato. L'avvocato non ha
      scritto né la frase sul consenso né il riassunto del recesso, perché
      nessuna delle due è un testo legale: sono la traduzione in una riga di
      quello che il documento dice per esteso, nel posto dove serve saperlo.
      Segnate `consentLine` e `returnsShort` in `inventedCopy`, quindi
      launch-check le conta fra le cose ancora nostre.

      MA NON PORTANO IL SEGNO DI BOZZA SULLA PAGINA, e la ragione va detta.
      Quel segno vuol dire «questa frase l'abbiamo scritta noi e aspetta la tua
      approvazione». Su una riga che spiega dove finiscono i dati di chi compra
      si leggerebbe come «non siamo sicuri di questo», che è esattamente il
      contrario di quello che una riga sul trattamento dei dati deve
      trasmettere. Il segno resta nel registro, dove serve a noi, e non sulla
      cassa, dove danneggerebbe il lettore.

      IL RIASSUNTO DEL RECESSO NON SOSTITUISCE IL DOCUMENTO e per questo
      finisce con il link. Dice i tre fatti che cambiano una decisione di
      acquisto: quanto tempo hai, da quando, e chi paga il ritorno.
    */
    privacyTitle: "Informativa privacy",
    termsTitle: "Condizioni di vendita",
    consentLine: "I dati che lasci qui servono solo a gestire questo ordine.",
    consentLink: "Leggi l'informativa privacy",
    returnsShort:
      "Quattordici giorni per cambiare idea, da quando ricevi il capo. La spedizione del reso è a tuo carico.",
    returnsLink: "Condizioni di vendita e recesso",
    forPrice: "per",
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
    processTitle: "Solvet et Coagula",
    handcrafted: "Handcrafted in South Italy.",
    outsideCollections: "Outside the collections.",
    alsoExistsAs: "Also exists as",
    fitGuidance: "Compare these with a garment you already own and like the fit of.",
    availableNow: "Available now.",

    thisPieceMeasurements: "This piece's measurements",
    sizeQuestion: "Size",
    oneSize: "One size.",
    chooseSize: "Choose a size",
    chooseSizeFirst: "Choose a size first",
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
    contactBuy: "To buy a piece you do not have to write. Every Creature has its own order form.",
    cart: "Cart",
    cartIntro: "These are the pieces you chose. There is no payment here. We confirm everything by email.",
    cartEmpty: "Your cart is empty.",
    cartQuantity: "Quantity",
    cartTotal: "Total",
    cartYourDetails: "Your details",
    cartAdd: "Add to cart",
    cartAdded: "In the cart",
    cartRemove: "Remove",
    cartPieces: "The pieces",
    cartOnePiece: "One of one. Only this one exists.",
    cartNoPayment: "Payment does not happen here. We reply by email and settle it with you.",
    cartSend: "Send the order",
    cartNeedsScript: "The cart needs JavaScript, which is switched off in this browser. Every Creature can still be bought from its own page.",
    wornLine: "On bodies, in daylight.",
    /* See the Italian above (section 137) for why these four are not editable. */
    privacyTitle: "Privacy policy",
    termsTitle: "Terms of sale",
    consentLine: "The details you leave here are used only to handle this order.",
    consentLink: "Read the privacy policy",
    returnsShort:
      "Fourteen days to change your mind, from the day you receive the piece. Return shipping is at your expense.",
    returnsLink: "Terms of sale and withdrawal",
    forPrice: "for",
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
  "newsletterLine", "outsideCollections", "fitGuidance", "alsoExistsAs",
  "availableNow", "oneSize", "unique", "privateOrder", "notTakingRequests", "wornLine",
  "cartIntro", "cartOnePiece", "cartNoPayment", "cartEmpty", "nothingYet", "notFound",
  // the titles that head a part of a page
  "theWork", "theProject", "bodyOfLight", "worn", "theMaking", "processTitle",
  "newsletter", "otherDrops", "enterDrop", "allCreatures", "cart", "cartPieces",
  "cartYourDetails", "support", "worldwideShipping", "shippingReturns", "footerNav",
  // his own words for his own things
  "creatures", "collections", "newDrop", "acquire", "uniqueAction", "cartAdd",
  // the menu, the catalogue's own words, the buttons, and the labels under a piece
  "menuHome", "gallery", "process", "about", "contact", "designer", "creators", "experimentalLineBy", "filterAll", "filterEveryone", "filterMen", "filterWomen", "movementAvailable", "movementOneOfOne", "movementSold", "soldOut", "noneMatch", "noneMatchHint", "placeOrder", "cartSend", "backHome", "newsletterClosed", "materials", "availability", "price", "priceFrom", "thisPieceMeasurements", "referenceMeasurements", "collection", "details",
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
