/*
  Interface strings only: labels the site itself needs to work in two languages.
  No brand copy lives here. Anything the owner must write (about text, garment
  descriptions, the enquiry reply window) comes from Sanity or stays a marked
  placeholder token. No em dashes, per standing rule 2.
*/
import type {Locale} from "../lib/locales";

const ui = {
  it: {
    skipToContent: "Vai al contenuto",
    home: "Home",
    languageLabel: "Lingua",
    switchToOther: "English",
    instagram: "Instagram",
    email: "Email",
    footerNav: "Collegamenti",
  },
  en: {
    skipToContent: "Skip to content",
    home: "Home",
    languageLabel: "Language",
    switchToOther: "Italiano",
    instagram: "Instagram",
    email: "Email",
    footerNav: "Links",
  },
} as const;

export type UIKey = keyof (typeof ui)["it"];

export function t(locale: Locale, key: UIKey): string {
  return ui[locale][key];
}
