/*
  POST /api/checkout — the card path. A Cloudflare Pages Function, the second
  piece of server-side code on this site.

  IT SHIPS DARK, AND THAT IS THE POINT OF THE FILE. Nothing here can sell
  anything until STRIPE_SECRET_KEY exists in the Cloudflare project. It is
  absent today and is meant to stay absent until the reissued terms of sale are
  transcribed into src/content/legal.ts. Until then this endpoint answers "not
  switched on", the cart never renders a pay button, and the site sells exactly
  as it did yesterday.

  THERE USED TO BE A SECOND SWITCH, STRIPE_SHIPPING_COUNTRIES, and it is gone on
  purpose. It existed to force a decision nobody had taken: which countries the
  brand ships to, and at what price. He took it on 2026-09-07 — 15 euro in
  Europe, 35 to the rest of the world, free from 500 — so the list belongs in
  src/lib/shipping.ts with the rates it goes with, not in a dashboard field
  where it could quietly disagree with them.

  WHERE THE PRICE OF A PARCEL COMES FROM. Not from this file and not from an
  environment variable: from /order-catalogue.json, which this endpoint already
  fetches to price the pieces, and which the build writes from
  src/lib/shipping.ts. The cart page draws its picker from that same module. So
  the figure the buyer is shown and the figure Stripe is given have one origin,
  and the endpoint cannot invent a shipping price any more than it can invent
  the price of a coat.

  STRIPE CANNOT PRICE BY DESTINATION, WHICH IS WHY THE CART ASKS. Stripe's own
  documentation is flat about it: "The hosted page integration doesn't support
  dynamically customizing shipping options." It collects the address AFTER the
  session exists, and there is no callback to reprice. So the destination is
  asked for on our page, BEFORE the session is made, and then
  `allowed_countries` is locked to that one country — otherwise a buyer could
  pick Italy for the 15 euro rate and type a Japanese address into Stripe.

  EVERY ORDERABLE PIECE CAN BE PAID FOR, the 1 of 1 pieces included (the owner
  lifted their exclusion on 2026-10-10). A unique piece is CLAIMED in the HOLDS
  database before its session is made, and the session is made to expire, so
  two people pressing pay at the same instant cannot both be charged for one
  coat. The flag comes from src/lib/order.ts through /order-catalogue.json, and
  the lock is explained in _holds.ts.

  HOSTED CHECKOUT, NOT EMBEDDED ELEMENTS. The buyer leaves for stripe.com and
  comes back. That means no Stripe script and no Stripe cookie ever loads on
  this domain, so the site keeps having no cookies at all and needs no banner,
  and the clause saying the seller does not collect card details through the
  website stays literally true. Elements would end all three in one commit.

  NO STRIPE SDK. The library is Node-shaped and large, and this is one HTTPS
  call with a form-encoded body. enquiry.ts calls Resend the same way.

  NO RATE LIMITER, DELIBERATELY, and this is the one place this file differs
  from enquiry.ts on purpose. That endpoint limits because it spends a finite
  resource — a hundred Resend emails a day — so a loop of requests could deny
  the business its only sales channel. Creating a Checkout Session spends
  nothing, sends nothing and reserves nothing; an abandoned session is garbage
  Stripe collects. Stripe's own limits apply on top. If that ever stops being
  true the limiter in enquiry.ts is the one to reuse, not a second one.
*/
import {loadCatalogue, priceLines, shippingFor} from "./_catalogue";
import {attach, claim, release, SESSION_SECONDS, status, type HoldsEnv} from "./_holds";

type Env = HoldsEnv & {
  /** The Stripe secret key, `sk_live_…` or `sk_test_…`. */
  STRIPE_SECRET_KEY?: string;
};

/** The one switch. Without it the card path does not exist. */
function live(env: Env): {key: string} | null {
  const key = env.STRIPE_SECRET_KEY?.trim();
  return key ? {key} : null;
}

const LOCALES = ["it", "en"] as const;
type Locale = (typeof LOCALES)[number];
const toLocale = (v: unknown): Locale =>
  LOCALES.includes(String(v) as Locale) ? (String(v) as Locale) : "en";

/** What the shipping line is called on Stripe's page, in their language. */
const SHIPPING_LABEL: Record<Locale, {free: string; paid: string}> = {
  it: {free: "Spedizione inclusa", paid: "Spedizione"},
  en: {free: "Shipping included", paid: "Shipping"},
};

/*
  IS THE CARD PATH ON?

  The cart is static HTML written at build time and cannot see a Cloudflare
  environment variable; this endpoint can. So the page asks. The button is
  hidden in the document and revealed only by a `true` from here, which means
  ONE switch — the variables in the Cloudflare project — rather than a build
  flag and a runtime key that can disagree with each other.

  It fails closed in every direction: a network error, a bad status, a body that
  is not what it should be, and the button stays hidden. The cart page's own
  comment already says why that is the right way round — a control that cannot
  do its job is worse than no control.

  Not cached: flipping the switch in Cloudflare has to take effect on the next
  page view, not in five minutes.
*/
/*
  AND WHICH 1 OF 1 PIECES ARE GONE OR BEING PAID FOR, so the cart can say so
  beside the piece before anybody presses pay, rather than after a round trip
  to a refusal. `unique: false` means the lock itself is not available (no
  binding, or the database did not answer), and then no unique piece can be
  paid for at all — the same answer the POST would give.
*/
export const onRequestGet: PagesFunction<Env> = async ({env}) => {
  const enabled = live(env) !== null;
  let holds: {unique: boolean; sold: string[]; held: string[]} = {unique: false, sold: [], held: []};
  if (enabled && env.HOLDS) {
    try {
      holds = {unique: true, ...(await status(env.HOLDS))};
    } catch (error) {
      console.error(`[checkout] HOLDS unreadable: ${(error as Error).message}`);
    }
  }
  return new Response(JSON.stringify({enabled, ...holds}), {
    headers: {"Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store"},
  });
};

export const onRequestPost: PagesFunction<Env> = async ({request, env}) => {
  const form = await request.formData();
  const locale = toLocale(form.get("lang"));
  const origin = new URL(request.url).origin;
  const cart = `${origin}/${locale}/cart/`;

  /*
    EVERY REFUSAL GOES BACK TO THE CART, not to an error page of its own.

    The cart is where the working alternative already is: the same basket, the
    same fields, and a send button that puts the order in his inbox the way it
    has always done. A buyer who cannot pay by card has not lost anything, and
    the page says so in one sentence. Building a second confirmation page in
    this file to say "no" would be a second page style to keep in step with the
    first for the sake of an outcome the buyer can recover from in one tap.
  */
  const back = (why: string) => {
    console.error(`[checkout] refused: ${why}`);
    return Response.redirect(`${cart}?problem=1`, 303);
  };

  const on = live(env);
  if (!on) return back("STRIPE_SECRET_KEY is unset: the card path is not switched on");

  const catalogue = await loadCatalogue(request);
  if (!catalogue) {
    return back("order-catalogue.json unreachable or missing its shipping block, refusing rather than guessing");
  }

  const lines = priceLines(form, catalogue.items);
  if (lines.length === 0) return back("nothing in the basket that this site sells");

  const currency = (lines[0]?.currency ?? "EUR").toLowerCase();
  if (lines.some((l) => (l.currency ?? "EUR").toLowerCase() !== currency)) {
    return back("basket mixes currencies, which no single Stripe session can take");
  }

  /*
    WHERE IT IS GOING, chosen on our cart and re-decided here.

    The picker on the cart is a convenience for the buyer and a display of the
    figure; it is not evidence. This is a form field, so it is whatever arrived
    in the POST, and a country we do not ship to is a REFUSAL rather than a
    fallback to free — the one mistake in this file that would cost real money
    on every order to a country nobody priced.
  */
  const goods = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const destination = String(form.get("destination") ?? "").trim().toUpperCase();
  const ship = shippingFor(catalogue.shipping, goods, destination);
  if (!ship) {
    return back(
      destination
        ? `no shipping price for "${destination}": not a country this shop sends to`
        : "no destination chosen, and shipping cannot be priced without one",
    );
  }

  /*
    THE 1 OF 1 PIECES ARE CLAIMED FIRST, before Stripe is asked for anything,
    and the whole basket is refused if one of them is taken: a buyer who came
    for Styrax Red Goat and a vest is not charged for the vest alone. The cart
    is told which piece and why, so it can say "being bought right now" or
    "sold" rather than "something went wrong".
  */
  const uniques = lines.filter((l) => l.unique).map((l) => l.slug);
  let hold: {token: string; count: number} | null = null;
  if (uniques.length > 0) {
    if (!env.HOLDS) {
      console.error("[checkout] refused: HOLDS is not bound, so a 1 of 1 piece cannot be locked and is not sold");
      return Response.redirect(`${cart}?unavailable=${encodeURIComponent(uniques[0])}&why=unavailable`, 303);
    }
    const claimed = await claim(env.HOLDS, on.key, uniques, String(form.get("holder") ?? ""));
    if (!claimed.ok) {
      console.warn(`[checkout] refused ${claimed.refusal.slug}: ${claimed.refusal.why} (${claimed.refusal.detail})`);
      return Response.redirect(
        `${cart}?unavailable=${encodeURIComponent(claimed.refusal.slug)}&why=${claimed.refusal.why}`,
        303,
      );
    }
    hold = {token: claimed.token, count: uniques.length};
  }
  /* Whatever goes wrong from here on, a claim made above is given back. */
  const giveBack = async () => {
    if (hold && env.HOLDS) await release(env.HOLDS, hold.token).catch(() => {});
  };

  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("locale", locale);
  /* The button on Stripe's own page. The one on ours carries the wording the
     Codice del Consumo asks for; see the cart page. */
  body.set("submit_type", "pay");
  body.set("success_url", `${cart}?paid=1`);
  body.set("cancel_url", cart);
  /*
    A SESSION THAT HOLDS A 1 OF 1 EXPIRES, so an abandoned checkout gives the
    piece back on its own. Stripe's minimum is 30 minutes and the hold outlives
    it by two, so the hold can never lapse while the session can still be paid.
  */
  if (hold) body.set("expires_at", String(Math.floor(Date.now() / 1000) + SESSION_SECONDS));

  /*
    THE EMAIL THE BUYER ALREADY TYPED. They filled it in on the cart before
    pressing pay, so asking again on Stripe's page would be the shop forgetting
    something it was just told.
  */
  const email = String(form.get("email") ?? "").trim();
  if (email && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    body.set("customer_email", email);
  }

  lines.forEach((line, i) => {
    /*
      THE PRICE IS THE PRICE. The owner's figures are what the buyer pays, VAT
      included — his decision, taken 2026-09-07 — so nothing is added at
      checkout and no price on the site moves. `tax_behavior=inclusive` records
      that the 22 percent is already inside the number, which is what an Italian
      consumer price has to be anyway and what any later VAT reporting will
      need to know.
    */
    body.set(`line_items[${i}][price_data][currency]`, currency);
    body.set(`line_items[${i}][price_data][unit_amount]`, String(Math.round(line.price * 100)));
    body.set(`line_items[${i}][price_data][tax_behavior]`, "inclusive");
    /* The size belongs in the name: it is what he needs to read to cut the
       parcel, and Stripe's own notification email prints this line. */
    body.set(
      `line_items[${i}][price_data][product_data][name]`,
      line.size ? `${line.name} — ${line.size}` : line.name,
    );
    body.set(`line_items[${i}][quantity]`, String(line.qty));
  });

  /*
    LOCKED TO THE ONE COUNTRY THEY PICKED, and this is the whole safety of the
    design. Offer a list and Stripe lets them enter any address on it, while the
    shipping figure was fixed when the session was made: pick Italy for 15 euro,
    type a Tokyo address, and the parcel costs 35 to send and 15 to have been
    paid for. One country in the list, and the address they can type is the
    address they were priced for.

    The visible cost is that changing your mind means going back to the cart.
    That is the correct direction: the alternative is a shop that is wrong about
    money and does not know it.
  */
  body.set("shipping_address_collection[allowed_countries][0]", destination);

  /*
    WHAT STRIPE'S PAGE ASKS FOR, which is everything the e-mail form used to:
    the email (Checkout always asks), the full name and the full address (the
    shipping address block asks for both, in the one country above), and the
    PHONE, which a courier wants on the label and which Checkout makes required
    once it is switched on. The paid order letter prints all four.
  */
  body.set("phone_number_collection[enabled]", "true");

  /*
    ONE SHIPPING OPTION, THE ONE THEY WERE QUOTED. Its amount was computed from
    the table the build wrote, not from anything in the POST, so the figure the
    cart displayed and the figure Stripe charges come from the same numbers.
  */
  body.set("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
  body.set("shipping_options[0][shipping_rate_data][fixed_amount][amount]", String(Math.round(ship.amount * 100)));
  body.set("shipping_options[0][shipping_rate_data][fixed_amount][currency]", currency);
  body.set(
    "shipping_options[0][shipping_rate_data][display_name]",
    ship.amount === 0 ? SHIPPING_LABEL[locale].free : SHIPPING_LABEL[locale].paid,
  );

  /* What he needs beside the money, in the Stripe dashboard and in its email. */
  const name = String(form.get("name") ?? "").trim().slice(0, 120);
  if (name) body.set("metadata[buyer]", name);
  const note = String(form.get("note") ?? "").trim().slice(0, 480);
  if (note) body.set("metadata[note]", note);
  body.set("metadata[lang]", locale);
  body.set("metadata[shipping]", `${destination} ${ship.zone} ${ship.amount}`);
  body.set("metadata[pieces]", lines.map((l) => `${l.qty}x ${l.slug}${l.size ? `/${l.size}` : ""}`).join(", ").slice(0, 480));
  /*
    WHAT THE PAID ORDER EMAIL IS WRITTEN FROM. /api/stripe-webhook reads these
    back out of the signed event, so the letter he packs from names exactly the
    lines and the country this endpoint priced, without calling Stripe again.
    One line per key because a value holds 500 characters and a basket does
    not fit in one; Stripe allows 50 keys and the catalogue is far below that.
  */
  body.set("metadata[destination]", destination);
  lines.slice(0, 40).forEach((l, i) => {
    body.set(
      `metadata[line_${i}]`,
      JSON.stringify({k: l.slug, n: l.name.slice(0, 200), s: l.size, q: l.qty, p: l.price, ...(l.unique ? {u: 1} : {})}),
    );
  });

  let session: {id?: string; url?: string; error?: {message?: string}};
  try {
    /*
      NO Stripe-Version HEADER. Pinning one means guessing a version string, and
      a wrong guess is an error on every request rather than on an unusual one.
      The account's own default applies, which is what the dashboard shows him.
    */
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${on.key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    session = await res.json();
    if (!res.ok || !session?.url || !session.id) {
      await giveBack();
      return back(`Stripe refused the session (${res.status}): ${session?.error?.message ?? "no url returned"}`);
    }
  } catch (error) {
    await giveBack();
    return back(`Stripe unreachable: ${(error as Error).message}`);
  }

  /*
    THE CLAIM LEARNS ITS SESSION, so a later claim can ask Stripe whether it
    was paid. If that write fails the session is expired on the spot rather
    than left payable under a hold nobody can check: the buyer is sent back to
    try again, which is better than a 1 of 1 that might be sold twice.
  */
  if (hold && env.HOLDS) {
    let kept = false;
    let why = "taken over by a newer click from the same browser";
    try {
      kept = await attach(env.HOLDS, hold.token, session.id, hold.count);
    } catch (error) {
      why = (error as Error).message;
    }
    if (!kept) {
      await fetch(`https://api.stripe.com/v1/checkout/sessions/${session.id}/expire`, {
        method: "POST",
        headers: {Authorization: `Bearer ${on.key}`},
      }).catch(() => {});
      await giveBack();
      return back(`hold for ${session.id} not recorded (${why}); session expired`);
    }
  }

  /*
    303, not 302. The buyer arrived here by POSTing a form; a 303 tells the
    browser to GET the next thing, so Stripe's page is not re-posted to and the
    back button lands on the cart rather than on a resubmission warning.
  */
  return Response.redirect(session.url, 303);
};
