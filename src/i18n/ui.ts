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
    about: "Chi siamo",
    contact: "Contatti",
    instagram: "Instagram",
    email: "Email",
    footerNav: "Collegamenti",
    collection: "Collezione",
    category: "Categoria",
    materials: "Materiali",
    sizes: "Taglie",
    sampleMeasurements: "Misure del capo campione",
    price: "Prezzo",
    enquire: "Invia richiesta",
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
    about: "About",
    contact: "Contact",
    instagram: "Instagram",
    email: "Email",
    footerNav: "Links",
    collection: "Collection",
    category: "Category",
    materials: "Materials",
    sizes: "Sizes",
    sampleMeasurements: "Measurements of the sample piece",
    price: "Price",
    enquire: "Send enquiry",
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
  {key: "about", path: "about"},
  {key: "contact", path: "contact"},
] as const satisfies ReadonlyArray<{key: UIKey; path: string}>;
