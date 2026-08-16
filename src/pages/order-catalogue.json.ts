/*
  THE PRICE LIST THE SERVER IS ALLOWED TO BELIEVE.

  An order form posts what a buyer chose, and a buyer can choose anything: the
  quantity box is theirs, the size radio is theirs, and so is every hidden field
  on the page. A total computed from what arrives in the POST is a total the
  buyer wrote. The existing single-piece form already knows this — it sends
  `price` and says in its own comment that the field is display-only.

  So the endpoint resolves prices itself, from here. This is emitted by the
  BUILD, from the same query the catalogue renders, and served from the site's
  own origin: no token, no second source, and it cannot drift from what the
  shop is showing, because a price change is a rebuild and a rebuild rewrites
  this file.

  It carries only what an order needs. No descriptions, no photographs, no
  measurements: this is a till roll, not the catalogue.

  Not in the sitemap and of no use to a reader; it is machine-readable public
  data that was already public — every price on it is printed on a page.
*/
import type {APIRoute} from "astro";
import {getGarments} from "../lib/content";
import {isPlaceholderText} from "../lib/content";

export const GET: APIRoute = async () => {
  const garments = await getGarments();

  const items = garments
    /*
      ONLY WHAT CAN ACTUALLY BE BOUGHT. `notOffered` is a piece that is on the
      site to be looked at, and `privateOrder` was made once for somebody:
      neither belongs on an order form, and letting one through would take an
      order the owner cannot fill.
    */
    .filter((g) => g.availability === "readyNow" || g.availability === "unique")
    .filter((g) => typeof g.price === "number" && g.price > 0)
    .filter((g) => !isPlaceholderText(g.name))
    .map((g) => ({
      slug: g.slug,
      name: g.name,
      price: g.price,
      currency: g.currency ?? "EUR",
      sizes: g.sizes ?? [],
      /* unique means one exists: quantity cannot go above one. */
      max: g.availability === "unique" ? 1 : 10,
    }));

  return new Response(JSON.stringify({items}, null, 1), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
};
