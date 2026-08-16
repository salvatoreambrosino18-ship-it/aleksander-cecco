/*
  WHAT CAN BE ORDERED, AND FOR HOW MUCH — decided once, here.

  This used to be written out twice: in `/order-catalogue.json`, which the
  endpoint prices from, and in the order page, which showed a reader what they
  were choosing. The page's own comment said the two filters "have to stay the
  same", which is a rule a file can state and cannot keep — a piece offered on
  one and absent from the other is an order the endpoint silently refuses to
  price, and nothing would report it.

  So the filter lives in one function and both callers ask it. There is nothing
  clever in it; the value is that there is only one of it.

  IT CARRIES ONLY WHAT AN ORDER NEEDS. No descriptions, no measurements, no
  photographs: this is a till roll, not the catalogue. The cart page adds a
  frame and a link on top of it, because a person checking their cart is
  checking they chose the right object, and on this site the object is the
  photograph.
*/
import {getGarments, isPlaceholderText, type Garment} from "./content";

export type OrderItem = {
  slug: string;
  name: string;
  price: number;
  currency: string;
  /** The sizes he makes it in. `ONE` means one size and offers no choice. */
  sizes: string[];
  /** How many of it can be ordered. A 1 of 1 is one, by definition. */
  max: number;
};

/**
 * Whether this Creature can be put in a cart at all.
 *
 * `notOffered` is a piece on the site to be looked at and `privateOrder` was
 * made once for somebody: neither belongs on an order form, and letting one
 * through would take an order the owner cannot fill.
 *
 * AND IT NEEDS A PRICE. The single-piece order works without one — it asks him
 * for a piece and he answers with a figure — but a cart has a TOTAL, and a line
 * with no price either breaks the sum or silently counts as nothing.
 */
export function isOrderable(g: Garment): boolean {
  return (
    (g.availability === "readyNow" || g.availability === "unique") &&
    typeof g.price === "number" &&
    g.price > 0 &&
    !isPlaceholderText(g.name)
  );
}

export function toOrderItem(g: Garment): OrderItem {
  return {
    slug: g.slug,
    name: g.name,
    price: g.price as number,
    currency: g.currency ?? "EUR",
    sizes: g.sizes ?? [],
    /* unique means one exists: quantity cannot go above one. */
    max: g.availability === "unique" ? 1 : 10,
  };
}

/** Every Creature that can be ordered, in the catalogue's own order. */
export async function orderCatalogue(): Promise<OrderItem[]> {
  const garments = await getGarments();
  return garments.filter(isOrderable).map(toOrderItem);
}
