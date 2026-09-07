/*
  POST /api/checkout — the card path. A Cloudflare Pages Function, the second
  piece of server-side code on this site.

  IT SHIPS DARK, AND THAT IS THE POINT OF THE FILE. Nothing here can sell
  anything until two environment variables exist in the Cloudflare project. Both
  are absent today and are meant to stay absent until the reissued terms of sale
  are transcribed into src/content/legal.ts. Until then this endpoint answers
  "not switched on", the cart never renders a pay button, and the site sells
  exactly as it did yesterday.

    STRIPE_SECRET_KEY          the account. Without it: dark.
    STRIPE_SHIPPING_COUNTRIES  where he will send a parcel. Without it: dark.

  THE SECOND ONE IS A SWITCH ON PURPOSE, and it is the only decision in this
  file that is not ours. Today shipping is free and settled in the reply email,
  so nobody has ever had to write down which countries the brand ships to; a
  buyer in Australia sends an order and he decides afterwards. A checkout takes
  the money BEFORE he decides, so the list has to exist first. Defaulting it to
  Italy would be us making that call quietly, and defaulting it to everywhere
  would be free worldwide shipping chosen by an absent variable. So there is no
  default: unset means the card path stays shut and says so in the log.

  ONLY `readyNow` PIECES CAN BE PAID FOR. The two 1 of 1 pieces — Severya and
  Styrax Red Goat — are orderable and are NOT payable, and the flag comes from
  src/lib/order.ts through /order-catalogue.json, so this endpoint cannot drift
  from what the shop believes. The reasoning is written where the flag is.

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
import {loadCatalogue, priceLines} from "./_catalogue";

type Env = {
  /** The Stripe secret key, `sk_live_…` or `sk_test_…`. Absent today. */
  STRIPE_SECRET_KEY?: string;
  /**
   * Two-letter ISO country codes he will ship to, comma separated, e.g.
   * "IT,FR,DE,ES". His decision, not ours. See the header.
   */
  STRIPE_SHIPPING_COUNTRIES?: string;
};

/** Both switches on, or the card path does not exist. */
function live(env: Env): {key: string; countries: string[]} | null {
  const key = env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  const countries = (env.STRIPE_SHIPPING_COUNTRIES ?? "")
    .split(/[\s,]+/)
    .map((c) => c.trim().toUpperCase())
    .filter((c) => /^[A-Z]{2}$/.test(c));
  if (countries.length === 0) return null;
  return {key, countries};
}

const LOCALES = ["it", "en"] as const;
type Locale = (typeof LOCALES)[number];
const toLocale = (v: unknown): Locale =>
  LOCALES.includes(String(v) as Locale) ? (String(v) as Locale) : "en";

/** Free shipping, in the language of the page the buyer came from. */
const SHIPPING_LABEL: Record<Locale, string> = {
  it: "Spedizione inclusa",
  en: "Shipping included",
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
export const onRequestGet: PagesFunction<Env> = async ({env}) =>
  new Response(JSON.stringify({enabled: live(env) !== null}), {
    headers: {"Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store"},
  });

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
  if (!on) {
    return back(
      env.STRIPE_SECRET_KEY?.trim()
        ? "STRIPE_SHIPPING_COUNTRIES is unset or holds no valid country code, so there is no shipping destination list to offer"
        : "STRIPE_SECRET_KEY is unset: the card path is not switched on",
    );
  }

  const catalogue = await loadCatalogue(request);
  if (!catalogue) return back("order-catalogue.json unreachable, refusing rather than pricing from the form");

  const lines = priceLines(form, catalogue);
  if (lines.length === 0) return back("nothing in the basket that this site sells");

  /*
    A BASKET THAT IS NOT ALL PAYABLE IS REFUSED WHOLE, rather than quietly
    split. A buyer who put Severya and a vest in one basket and pressed pay
    would otherwise be charged for the vest and told nothing about the piece
    they actually came for. Back to the cart, where sending the order reaches
    him about both.
  */
  const unpayable = lines.filter((l) => !l.payable);
  if (unpayable.length > 0) {
    return back(`basket holds a piece that is not sold by button: ${unpayable.map((l) => l.slug).join(", ")}`);
  }

  const currency = (lines[0]?.currency ?? "EUR").toLowerCase();
  if (lines.some((l) => (l.currency ?? "EUR").toLowerCase() !== currency)) {
    return back("basket mixes currencies, which no single Stripe session can take");
  }

  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("locale", locale);
  /* The button on Stripe's own page. The one on ours carries the wording the
     Codice del Consumo asks for; see the cart page. */
  body.set("submit_type", "pay");
  body.set("success_url", `${cart}?paid=1`);
  body.set("cancel_url", cart);

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

  on.countries.forEach((code, i) => {
    body.set(`shipping_address_collection[allowed_countries][${i}]`, code);
  });

  /*
    ONE SHIPPING OPTION AT ZERO. Shipping is free today and settled in the
    reply; this says the same thing at the moment the money moves, so the buyer
    sees a total that is the total. If he ever decides to charge for it, the
    amount below is the only line that changes.
  */
  body.set("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
  body.set("shipping_options[0][shipping_rate_data][fixed_amount][amount]", "0");
  body.set("shipping_options[0][shipping_rate_data][fixed_amount][currency]", currency);
  body.set("shipping_options[0][shipping_rate_data][display_name]", SHIPPING_LABEL[locale]);

  /* What he needs beside the money, in the Stripe dashboard and in its email. */
  const name = String(form.get("name") ?? "").trim().slice(0, 120);
  if (name) body.set("metadata[buyer]", name);
  const note = String(form.get("note") ?? "").trim().slice(0, 480);
  if (note) body.set("metadata[note]", note);
  body.set("metadata[lang]", locale);
  body.set("metadata[pieces]", lines.map((l) => `${l.qty}x ${l.slug}${l.size ? `/${l.size}` : ""}`).join(", ").slice(0, 480));

  let session: {url?: string; error?: {message?: string}};
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
    if (!res.ok || !session?.url) {
      return back(`Stripe refused the session (${res.status}): ${session?.error?.message ?? "no url returned"}`);
    }
  } catch (error) {
    return back(`Stripe unreachable: ${(error as Error).message}`);
  }

  /*
    303, not 302. The buyer arrived here by POSTing a form; a 303 tells the
    browser to GET the next thing, so Stripe's page is not re-posted to and the
    back button lands on the cart rather than on a resubmission warning.
  */
  return Response.redirect(session.url, 303);
};
