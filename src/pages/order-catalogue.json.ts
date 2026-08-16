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
import {orderCatalogue} from "../lib/order";

export const GET: APIRoute = async () => {
  /*
    THE SAME LIST THE CART SHOWS, from the same function (section 129). It was
    written out separately here and in the order page, with a comment on each
    saying they had to match; they now cannot differ, because there is one of
    them. A piece on the cart and absent from here is an order the endpoint
    refuses to price, and nothing would have reported it.
  */
  const items = await orderCatalogue();

  return new Response(JSON.stringify({items}, null, 1), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
};
