/*
  WHAT SHIPPING COSTS — decided once, here, and nowhere else.

  His figures, 2026-09-07: 15 euro in Europe, 35 to the rest of the world, and
  free from 500 euro whatever the destination.

  ONE HOME, AND HOW IT REACHES THE ENDPOINT. This module is the only place the
  threshold, the two rates and the two country lists exist. The cart page
  imports it directly to draw the picker and show the figure. The payment
  endpoint does NOT import it: it reads the same numbers out of
  /order-catalogue.json, which the build writes from this file, because that is
  already the pattern this site uses for handing the server a fact it is allowed
  to believe. So the shop and the till cannot disagree about the price of a
  parcel, for the same reason they cannot disagree about the price of a coat.

  THE THRESHOLD IS "AT OR ABOVE", NOT "ABOVE", and it was a real decision.
  Oblivion is priced at exactly 500. Under a strict "above" it would be the one
  piece on the site expensive enough to look like it qualifies and cheap enough
  not to, and the buyer who notices is the buyer who read the banner. So 500
  itself is free.

  THAT LEAVES THE BANNER SAYING SOMETHING SLIGHTLY DIFFERENT, and the direction
  matters. His sentence says "over 500 euro" / "sopra i 500 euro", which
  promises less than this gives. Nobody is ever charged more than the published
  promise; at worst they are charged less. That is the only direction in which a
  mismatch is safe, and it is why this can ship before he edits the sentence.
  He should still edit it — "from 500 euro" / "da 500 euro in su" — and
  verify-build.mjs refuses a build where the banner names a DIFFERENT number,
  which is the mismatch that is not safe.

  RATES ARE PER ORDER, NOT PER PIECE. Stripe's shipping rates are a fixed amount
  for the whole order and cannot vary by item count, so two coats to Japan cost
  the same 35 as one. If that ever needs to change, it changes here: the
  endpoint hands Stripe a single figure that this file computed, so the shape of
  the calculation is ours, not Stripe's.
*/

/** Euro, INCLUSIVE: an order of exactly this much ships free. */
export const FREE_FROM = 500;

export const RATES = {europe: 15, world: 35} as const;

export type Zone = keyof typeof RATES;

/*
  EUROPE IS HIS RULE, TO THE LETTER: the twenty-seven, plus the United Kingdom,
  Switzerland and Norway. Nothing has been added to it by us — see the note on
  EDGES below for the five countries that argue for a place here and are
  deliberately not in either list until he says so.
*/
export const EUROPE: readonly string[] = [
  // the twenty-seven
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  // and the three he named
  "GB", "CH", "NO",
];

/*
  THE REST OF THE WORLD, which is not "everywhere": it is everywhere a courier
  will reliably take a leather garment and Stripe will take a card. A country
  absent from this list is not refused on principle, it simply has not been
  started, and adding one is a single line.
*/
export const WORLD: readonly string[] = [
  "US", "CA", "MX",
  "BR", "CL", "AR", "UY", "CO", "PE",
  "JP", "KR", "CN", "HK", "TW", "SG", "MY", "TH", "VN", "PH", "ID", "IN",
  "AU", "NZ",
  "IL", "AE", "SA", "QA", "KW", "BH", "OM",
  "ZA", "MA", "EG",
  "TR", "RS",
];

/*
  EDGES, LEFT OPEN ON PURPOSE. Iceland and Liechtenstein are EEA, exactly as
  Norway is; Monaco, San Marino, Andorra and the Vatican sit inside the EU
  customs area and cost about what Italy costs to reach. His rule as written
  puts all six at 35 euro, which is wrong for every one of them, so rather than
  guess they are in NEITHER list: a buyer there sees no card button and orders
  by e-mail, which is what happens today and charges nobody anything wrong.
  The day he answers, they move into EUROPE and this note goes.

  DELIBERATELY EXCLUDED, and not oversights: RU, BY, IR, KP, SY, CU, AF, MM and
  VE, which are some combination of sanctioned, unreachable by courier and
  refused by Stripe; and UA, where the war has made courier service to much of
  the country unreliable rather than impossible, which makes it his call.
*/

/** Which zone a country is in, or null when we do not ship there. */
export function zoneOf(country: string): Zone | null {
  const code = country.trim().toUpperCase();
  if (EUROPE.includes(code)) return "europe";
  if (WORLD.includes(code)) return "world";
  return null;
}

/** Every country a card order may name, for the picker and for the endpoint. */
export const DESTINATIONS: readonly string[] = [...EUROPE, ...WORLD];

/**
 * What a basket of `goodsTotal` costs to send to `country`.
 *
 * `goodsTotal` is the PIECES ONLY. Shipping is never part of the sum that
 * decides whether shipping is free, or a 485 euro basket would cross the line
 * by being charged for the very thing the line decides.
 *
 * Returns null for a country we do not ship to, which the caller must treat as
 * a refusal rather than as free.
 */
export function shippingFor(
  goodsTotal: number,
  country: string,
): {zone: Zone; amount: number} | null {
  const zone = zoneOf(country);
  if (!zone) return null;
  return {zone, amount: goodsTotal >= FREE_FROM ? 0 : RATES[zone]};
}

/** The whole table, as /order-catalogue.json carries it to the endpoint. */
export const SHIPPING = {
  freeFrom: FREE_FROM,
  rates: RATES,
  europe: EUROPE,
  world: WORLD,
} as const;
