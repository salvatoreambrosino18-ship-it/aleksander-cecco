/*
  THE PRICE LIST, RESOLVED SERVER-SIDE — shared by the endpoints that take an
  order.

  WHY IT IS A FILE AND NOT A PARAGRAPH INSIDE ONE OF THEM. A total computed
  from what arrives in a POST is a total the buyer wrote. Both of this site's
  order paths therefore have to resolve prices themselves, from
  /order-catalogue.json, which the BUILD writes from the same query the shop
  renders. Two copies of that rule would drift, and the direction they drift in
  is money.

  UNDERSCORED SO PAGES DOES NOT ROUTE IT. Cloudflare Pages turns files under
  functions/ into routes; a leading underscore keeps this one a module. It
  exports no handler either, so the worst case if that ever changed is a path
  that answers nothing.

  WHAT IT DELIBERATELY DOES NOT DO YET: enquiry.ts still carries its own older
  copy of this logic, and folding it onto this module is a separate commit.
  That endpoint is the brand's only working sales channel, and rewriting it in
  the same change that adds an unrelated feature is how the thing that works
  gets broken. The behaviour here was derived from it line by line; the merge is
  mechanical and wants its own verification, not a footnote in this one.
*/

/** One line of an order, priced by the site rather than by the buyer. */
export type PricedLine = {
  slug: string;
  name: string;
  /** "" when the piece is cut in one size and there was nothing to choose. */
  size: string;
  qty: number;
  /** Whole units of `currency`, as the shop prints it. */
  price: number;
  currency: string;
  /** Whether a card button is allowed to sell this. See src/lib/order.ts. */
  payable: boolean;
};

type CatalogueItem = {
  slug: string;
  name: string;
  price: number;
  currency?: string;
  sizes?: string[];
  max?: number;
  payable?: boolean;
};

/**
 * The shipping table, exactly as src/lib/shipping.ts defines it.
 *
 * It travels in this file rather than being imported because a Pages Function
 * and the site are two builds; the catalogue is already the one channel through
 * which the server is handed a fact it may believe, and the price of a parcel
 * is the same kind of fact as the price of a coat.
 */
export type Shipping = {
  /** Euro, INCLUSIVE: an order of exactly this much ships free. */
  freeFrom: number;
  rates: {europe: number; world: number};
  europe: string[];
  world: string[];
};

export type Catalogue = {items: Map<string, CatalogueItem>; shipping: Shipping};

/**
 * The till roll, from this site's own origin.
 *
 * Returns null when it cannot be read, and the caller must REFUSE rather than
 * fall back to the figures in the POST. An order sheet with the wrong total is
 * worse than one that never arrived, because he would act on it.
 *
 * The shipping block is required for the same reason: an endpoint that cannot
 * read what a parcel costs must not guess, and must not treat "unknown" as
 * "free".
 */
export async function loadCatalogue(request: Request): Promise<Catalogue | null> {
  try {
    const res = await fetch(new URL("/order-catalogue.json", request.url).toString(), {
      cf: {cacheTtl: 300},
    } as RequestInit);
    if (!res.ok) return null;
    const body = (await res.json()) as {items?: CatalogueItem[]; shipping?: Shipping};
    if (!body?.items?.length) return null;
    const s = body.shipping;
    if (!s || typeof s.freeFrom !== "number" || !s.rates || !Array.isArray(s.europe) || !Array.isArray(s.world)) {
      return null;
    }
    return {items: new Map(body.items.map((i) => [i.slug, i])), shipping: s};
  } catch {
    return null;
  }
}

/**
 * What a basket of `goodsTotal` costs to send to `country`.
 *
 * The same rule as src/lib/shipping.ts, over the same numbers, because they
 * arrived from there. `goodsTotal` is the PIECES ONLY: shipping is never part
 * of the sum that decides whether shipping is free.
 *
 * Null means we do not ship there, and the caller must refuse. Null is not
 * zero.
 */
export function shippingFor(
  shipping: Shipping,
  goodsTotal: number,
  country: string,
): {zone: "europe" | "world"; amount: number} | null {
  const code = country.trim().toUpperCase();
  const zone = shipping.europe.includes(code)
    ? ("europe" as const)
    : shipping.world.includes(code)
      ? ("world" as const)
      : null;
  if (!zone) return null;
  return {zone, amount: goodsTotal >= shipping.freeFrom ? 0 : shipping.rates[zone]};
}

/**
 * Turn the `qty:<slug>` / `size:<slug>` pairs a cart posts into priced lines.
 *
 * Everything the buyer controls is treated as a suggestion: a slug that is not
 * in the catalogue is dropped, a size that is not offered for that piece is
 * dropped, a quantity above what exists is clamped, and the price is never read
 * from the form at all.
 */
export function priceLines(form: FormData, catalogue: Map<string, CatalogueItem>): PricedLine[] {
  const lines: PricedLine[] = [];
  for (const key of [...form.keys()].filter((k) => k.startsWith("qty:"))) {
    const slug = key.slice(4);
    const item = catalogue.get(slug);
    if (!item) continue;
    const wanted = Math.floor(Number(form.get(key)));
    if (!Number.isFinite(wanted) || wanted <= 0) continue;
    const chosen = String(form.get(`size:${slug}`) ?? "");
    lines.push({
      slug,
      name: item.name,
      size: (item.sizes ?? []).includes(chosen) ? chosen : "",
      qty: Math.min(wanted, Math.max(1, item.max ?? 10)),
      price: item.price,
      currency: item.currency ?? "EUR",
      payable: item.payable === true,
    });
  }
  return lines;
}
