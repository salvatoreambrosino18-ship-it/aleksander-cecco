/*
  POST /api/stripe-webhook — Stripe tells the shop a card payment went through,
  and the shop tells him, and then tells the buyer.

  WHY IT EXISTS. Until this file a card payment reached the Stripe dashboard
  and nowhere else: the buyer was charged, came back to the cart, and the
  person who has to cut and pack the parcel heard nothing from the site. The
  email order always landed in his inbox; the paid one has to land there too,
  in the same shape, or the better way to buy is the one he cannot see.

  WHAT HE RECEIVES. The order email he already knows, from the same sender, to
  the same inbox, with "Paid order" where it said "Order" and the facts a
  parcel needs: each piece with its size and quantity, who bought it, their
  email and phone, the full shipping address, the shipping charged and the total
  Stripe took. Reply goes to the buyer, as before.

  WHAT THE BUYER RECEIVES, and why it is ours rather than only Stripe's. Stripe
  sends a receipt only if the account has receipts switched on, and a receipt
  is a statement of money: it does not say what happens next or who to write
  to. So the buyer also gets a short letter from the site's sender, in the
  language they bought in: what they bought, where it is going, that we write
  when it leaves, and the seller's identity with the terms of sale. A reply to
  it goes to the address the footer publishes.

  HIS LETTER GOES FIRST, AND ONLY HIS IS ALLOWED TO HOLD UP THE ANSWER. The
  order reaching him is the thing that must never be lost; the buyer's letter
  is a courtesy on top of a receipt. So a failure sending his answers 500 and
  stops there, and a failure sending theirs is retried only when retrying could
  help (see below).

  IF STRIPE TAKES THE MONEY AND THE EMAIL FAILS, THE ORDER IS NOT LOST, and the
  mechanism is Stripe's rather than ours, because ours would need a database
  this site does not have. Every failure on this side answers 500. Stripe treats
  anything but a 2xx as undelivered and sends the event again, with backoff, for
  up to three days in live mode; it emails the account when an endpoint keeps
  failing; and the payment itself is in the dashboard from the first second
  whatever happens here. So the failure modes are "late" and "loud", never
  "silent":

  - Resend down or refusing his letter: 500, logged with Resend's reason, retried.
  - A Resend variable missing: 500, logged with the NAME of the missing one.
  - STRIPE_WEBHOOK_SECRET missing: 500, so the events queue at Stripe until it
    is set rather than being thrown away by a 200.
  - The buyer's letter failing for a reason that may pass (Resend down, rate
    limited): 500, and the retry re-sends his letter as a no-op (idempotency,
    below) and tries theirs again.
  - The buyer's letter REFUSED (a sender Resend will not send from to
    strangers, an address it rejects): 200, because three days of retries would
    be refused in the same words — and he is sent a one-line note saying the
    buyer did not get it, so he can write to them himself.

  The only way to get a 200 without his letter is a request that is not a paid
  Checkout Session at all.

  THE SIGNATURE IS CHECKED BEFORE ANYTHING IS READ. This URL is public; without
  the check anyone could POST a made-up order and have it emailed to him as
  paid. Stripe signs `<timestamp>.<raw body>` with the endpoint's secret
  (HMAC-SHA256), and a body that does not verify, or that was signed more than
  five minutes ago, is refused with 400 and never parsed. The raw body is read
  as text, once, before JSON: re-serialising parsed JSON does not reproduce the
  bytes that were signed.

  DELIVERED AT LEAST ONCE, EMAILED ONCE. Stripe may send the same event twice.
  Every send carries an idempotency key made from the session id, so Resend
  drops a repeat within 24 hours. A retry that arrives after that, for a send
  that had in fact gone through, would mean the letter twice — which is the
  right side to err on.

  NO CALL BACK TO STRIPE. Everything the letters need is in the signed event:
  the address, the buyer, the amounts Stripe charged, and the lines, which
  /api/checkout writes into the session's metadata when it creates it. That is
  one fewer thing that can fail between the money and the email, and it means
  this endpoint needs no API key of its own.
*/
import {letter, send, type Row} from "./_mail";
import {COMPANY_LINE} from "../../src/lib/company";

type Env = {
  /** The endpoint's signing secret, `whsec_…`, from the Stripe dashboard. */
  STRIPE_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  /** His inbox. Named for the email path it was created for; the same address. */
  ENQUIRY_TO_EMAIL?: string;
  /**
   * LOCAL TESTING ONLY. Verifies, parses and writes both letters, then answers
   * with them instead of sending them. Unset in production, where it does
   * nothing.
   *
   *   npx wrangler pages dev dist --compatibility-date=2026-08-02 \
   *     --binding MAIL_DRY_RUN=1 --binding STRIPE_WEBHOOK_SECRET=whsec_test
   */
  MAIL_DRY_RUN?: string;
};

/** Stripe's own default tolerance for a signature's age. */
const TOLERANCE_SECONDS = 300;

const reply = (status: number, body: string) =>
  new Response(body, {status, headers: {"Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store"}});

/* ------------------------------------------------------------ signature */

const bytes = (s: string) => new TextEncoder().encode(s);
const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

/** Compare without stopping at the first difference, so timing says nothing. */
function sameString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Whether `payload` was signed by Stripe with `secret`, recently.
 *
 * The header is `t=<unix seconds>,v1=<hex>[,v1=<hex>…]`. More than one v1
 * appears while a secret is being rolled, and any one matching is enough.
 */
export async function verifySignature(
  secret: string,
  header: string,
  payload: string,
  nowSeconds = Date.now() / 1000,
): Promise<boolean> {
  let timestamp = NaN;
  const signatures: string[] = [];
  for (const part of header.split(",")) {
    const at = part.indexOf("=");
    if (at < 0) continue;
    const key = part.slice(0, at).trim();
    const value = part.slice(at + 1).trim();
    if (key === "t") timestamp = Number(value);
    else if (key === "v1") signatures.push(value);
  }
  if (!Number.isFinite(timestamp) || signatures.length === 0) return false;
  if (Math.abs(nowSeconds - timestamp) > TOLERANCE_SECONDS) return false;

  const key = await crypto.subtle.importKey("raw", bytes(secret), {name: "HMAC", hash: "SHA-256"}, false, ["sign"]);
  const expected = hex(await crypto.subtle.sign("HMAC", key, bytes(`${timestamp}.${payload}`)));
  return signatures.some((s) => sameString(s, expected));
}

/* ---------------------------------------------------------------- order */

type Address = {
  line1?: string | null;
  line2?: string | null;
  postal_code?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
};

/** The parts of a Checkout Session this file reads. Stripe sends far more. */
type Session = {
  id: string;
  livemode?: boolean;
  payment_status?: string;
  payment_intent?: string | null;
  currency?: string | null;
  amount_total?: number | null;
  total_details?: {amount_shipping?: number | null} | null;
  shipping_cost?: {amount_total?: number | null} | null;
  customer_details?: {name?: string | null; email?: string | null; phone?: string | null} | null;
  /*
    WHERE THE ADDRESS IS DEPENDS ON THE API VERSION the endpoint was created
    with, which is chosen in the dashboard and not by this file: newer versions
    put it under `collected_information`, older ones at the top level, and the
    oldest called it `shipping`. All three are read, newest first.
  */
  collected_information?: {shipping_details?: {name?: string | null; address?: Address | null} | null} | null;
  shipping_details?: {name?: string | null; address?: Address | null} | null;
  shipping?: {name?: string | null; address?: Address | null} | null;
  metadata?: Record<string, string> | null;
};

export type OrderLine = {slug: string; name: string; size: string; qty: number; unit: number};

/**
 * The pieces, as /api/checkout wrote them into the session.
 *
 * `line_0`, `line_1`… each hold one line as JSON. A session made before that
 * existed has only `pieces` ("1x abyssys/S, 2x tomar"), which still says what
 * to pack, without names or prices; it is read as a fallback rather than
 * refused, because refusing would turn an old paid order into no email.
 */
export function readLines(metadata: Record<string, string>): OrderLine[] {
  const lines: OrderLine[] = [];
  for (let i = 0; i < 50; i++) {
    const raw = metadata[`line_${i}`];
    if (!raw) break;
    try {
      const l = JSON.parse(raw) as {k?: string; n?: string; s?: string; q?: number; p?: number};
      lines.push({slug: String(l.k ?? ""), name: String(l.n ?? l.k ?? "?"), size: String(l.s ?? ""), qty: Number(l.q) || 1, unit: Number(l.p) || 0});
    } catch {
      /* one unreadable line must not cost the whole letter */
    }
  }
  if (lines.length > 0) return lines;
  for (const part of (metadata.pieces ?? "").split(",")) {
    const m = part.trim().match(/^(\d+)x\s+([^/\s]+)(?:\/(\S+))?$/);
    if (m) lines.push({slug: m[2], name: m[2], size: m[3] ?? "", qty: Number(m[1]), unit: 0});
  }
  return lines;
}

/** Everything both letters are written from, read once out of the session. */
export type Order = {
  id: string;
  test: boolean;
  reference: string;
  lang: "it" | "en";
  currency: string;
  lines: OrderLine[];
  count: number;
  name: string;
  email: string;
  phone: string;
  address: Address | null;
  shipCountry: string;
  pricedFor: string;
  shipping: number;
  total: number;
  note: string;
};

export function readOrder(session: Session): Order {
  const meta = session.metadata ?? {};
  const cents = (n: number | null | undefined) => (Number(n) || 0) / 100;
  const lines = readLines(meta);
  const ship = session.collected_information?.shipping_details ?? session.shipping_details ?? session.shipping ?? null;
  const buyer = session.customer_details ?? {};
  return {
    id: session.id,
    test: session.livemode === false,
    reference: session.payment_intent || session.id,
    lang: meta.lang === "it" ? "it" : "en",
    currency: (session.currency ?? "eur").toUpperCase(),
    lines,
    count: lines.reduce((sum, l) => sum + l.qty, 0),
    name: (ship?.name || buyer.name || meta.buyer || "").trim(),
    email: (buyer.email ?? "").trim(),
    phone: (buyer.phone ?? "").trim(),
    address: ship?.address ?? null,
    shipCountry: (ship?.address?.country ?? "").toUpperCase(),
    /* What /api/checkout priced the parcel for. `shipping` is "IT europe 15". */
    pricedFor: (meta.destination || (meta.shipping ?? "").split(" ")[0] || "").toUpperCase(),
    shipping: cents(session.total_details?.amount_shipping ?? session.shipping_cost?.amount_total),
    total: cents(session.amount_total),
    note: meta.note ?? "",
  };
}

const INTL = {it: "it-IT", en: "en-GB"} as const;

const countryIn = (lang: "it" | "en") => (code: string) => {
  try {
    return new Intl.DisplayNames([INTL[lang]], {type: "region"}).of(code) ?? code;
  } catch {
    return code;
  }
};

const moneyIn = (lang: "it" | "en", currency: string) => (n: number) =>
  new Intl.NumberFormat(INTL[lang], {style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 2}).format(n);

/** An address as it goes on a parcel: one fact per line, country spelled out. */
function addressLines(name: string, a: Address | null, country: (code: string) => string): string {
  if (!a) return "(no address)";
  return [name, a.line1, a.line2, [a.postal_code, a.city].filter(Boolean).join(" "), a.state, a.country ? country(a.country) : ""]
    .map((s) => (s ?? "").trim())
    .filter(Boolean)
    .join("\n");
}

/** "Abyssys S" for one piece, "2 pieces" for more, in the reader's language. */
function summary(order: Order, lang: "it" | "en"): string {
  const [only] = order.lines;
  if (order.lines.length === 1 && only.qty === 1) return `${only.name}${only.size ? ` ${only.size}` : ""}`;
  if (lang === "it") return `${order.count} ${order.count === 1 ? "pezzo" : "pezzi"}`;
  return `${order.count} ${order.count === 1 ? "piece" : "pieces"}`;
}

/** The letter he receives for one paid session. In English, like the order email. */
export function ownerLetter(order: Order) {
  const money = moneyIn("en", order.currency);
  const country = countryIn("en");
  const rows: Row[] = [];
  /*
    THE ONE THING THAT MUST STOP HIM PACKING. /api/checkout locks the address
    to the country it priced, so this should never fire; if it ever does, the
    parcel was paid for at the wrong rate and he needs to see that before he
    sees anything else.
  */
  if (order.pricedFor && order.shipCountry && order.pricedFor !== order.shipCountry) {
    rows.push([
      "Check",
      `Shipping was charged for ${country(order.pricedFor)}, but the address is in ${country(order.shipCountry)}. Sort this out before shipping.`,
    ]);
  }
  for (const l of order.lines) {
    rows.push([
      l.name,
      l.unit > 0
        ? `${l.qty} x ${money(l.unit)}${l.size ? `  size ${l.size}` : ""}  =  ${money(l.unit * l.qty)}`
        : `${l.qty}${l.size ? `  size ${l.size}` : ""}`,
    ]);
  }
  rows.push(
    ["Shipping", `${order.shipping === 0 ? "Free" : money(order.shipping)}${order.shipCountry ? `  to ${country(order.shipCountry)}` : ""}`],
    ["Total paid", money(order.total)],
    ["Name", order.name || "(none given)"],
    ["Email", order.email || "(none given)"],
  );
  if (order.phone) rows.push(["Phone", order.phone]);
  rows.push(
    ["Ship to", addressLines(order.name, order.address, country)],
    ["Language", order.lang === "it" ? "Italiano" : "English"],
    ["Stripe", order.reference],
  );
  if (order.note) rows.push(["Note", order.note]);

  const dashboard = order.reference.startsWith("pi_")
    ? `https://dashboard.stripe.com/${order.test ? "test/" : ""}payments/${order.reference}`
    : "";

  const {html, text} = letter({
    lang: "en",
    heading: order.test ? "Paid order (test)" : "Paid order",
    rows,
    lines: [
      "Paid by card through Stripe. The money is already taken: there is nothing to collect.",
      ...(dashboard ? [`The payment in Stripe: ${dashboard}`] : []),
      ...(order.email ? [`Reply to this message and it goes straight to ${order.email}.`] : []),
    ],
  });

  return {
    subject: `${order.test ? "[TEST] " : ""}Paid order: ${summary(order, "en")} — ${money(order.total)}`,
    html,
    text,
    replyTo: order.email || undefined,
  };
}

const BUYER = {
  it: {
    subject: "Il tuo ordine",
    heading: "Ordine confermato",
    size: "taglia",
    shipping: "Spedizione",
    free: "Gratuita",
    total: "Totale pagato",
    shipTo: "Spedito a",
    reference: "Riferimento",
    paid: "Pagamento ricevuto. Grazie.",
    next: "Ti scriviamo quando il pacco parte.",
    write: "Per qualsiasi domanda rispondi a questa email.",
    terms: "Condizioni di vendita e diritto di recesso:",
  },
  en: {
    subject: "Your order",
    heading: "Order confirmed",
    size: "size",
    shipping: "Shipping",
    free: "Free",
    total: "Total paid",
    shipTo: "Shipping to",
    reference: "Reference",
    paid: "Payment received. Thank you.",
    next: "We will write to you when the parcel leaves.",
    write: "For anything at all, reply to this email.",
    terms: "Terms of sale and the right of withdrawal:",
  },
} as const;

/**
 * The letter the buyer receives, in the language they bought in.
 *
 * Every figure is the one Stripe charged or the one /api/checkout priced, so
 * it cannot say anything the receipt contradicts. It names the seller and
 * links the terms because it is the written confirmation of a sale made at a
 * distance; whether it must carry more than that is a question for the lawyer
 * (docs/RICHIESTA-LEGALE-PAGAMENTI.md), not a sentence to improvise here.
 */
export function buyerLetter(order: Order, opts: {origin: string}) {
  const lang = order.lang;
  const t = BUYER[lang];
  const money = moneyIn(lang, order.currency);
  const country = countryIn(lang);
  const rows: Row[] = order.lines.map((l) => [
    l.name,
    l.unit > 0
      ? `${l.qty} x ${money(l.unit)}${l.size ? `  ${t.size} ${l.size}` : ""}`
      : `${l.qty}${l.size ? `  ${t.size} ${l.size}` : ""}`,
  ]);
  rows.push(
    [t.shipping, order.shipping === 0 ? t.free : money(order.shipping)],
    [t.total, money(order.total)],
    [t.shipTo, addressLines(order.name, order.address, country)],
    [t.reference, order.reference],
  );
  const {html, text} = letter({
    lang,
    heading: t.heading,
    rows,
    lines: [t.paid, t.next, t.write, `${t.terms} ${opts.origin}/${lang}/terms/`, COMPANY_LINE],
  });
  return {subject: `${order.test ? "[TEST] " : ""}${t.subject}: ${summary(order, lang)}`, html, text};
}

/*
  WHERE A BUYER'S REPLY GOES: the address the footer publishes, which is his
  panel value and reaches this Function through /order-catalogue.json. The
  fallback is the address that value holds today, so a catalogue that does not
  answer costs the letter its freshest reply-to, never the letter.
*/
const CONTACT_FALLBACK = "info@aleksandercecco.com";

async function contactAddress(request: Request): Promise<string> {
  try {
    const res = await fetch(new URL("/order-catalogue.json", request.url).toString(), {cf: {cacheTtl: 300}} as RequestInit);
    if (!res.ok) return CONTACT_FALLBACK;
    const body = (await res.json()) as {contact?: string | null};
    return body.contact?.trim() || CONTACT_FALLBACK;
  } catch {
    return CONTACT_FALLBACK;
  }
}

/* -------------------------------------------------------------- handler */

/*
  THE EVENTS THAT MEAN "PAID". A card payment completes the session already
  paid. `async_payment_succeeded` is the same news arriving later for a method
  that settles slowly; none is offered today, and handling it costs one line
  that stops a future one from charging somebody silently. A completed session
  that is NOT yet paid is acknowledged and left: its money is not there, and its
  async event will come.
*/
const PAID_EVENTS = new Set(["checkout.session.completed", "checkout.session.async_payment_succeeded"]);

export const onRequestPost: PagesFunction<Env> = async ({request, env}) => {
  const secret = env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is unset: answering 500 so Stripe keeps the event and retries");
    return reply(500, "not configured");
  }

  const payload = await request.text();
  if (!(await verifySignature(secret, request.headers.get("stripe-signature") ?? "", payload))) {
    console.warn("[stripe-webhook] refused: signature missing, wrong or too old");
    return reply(400, "bad signature");
  }

  let event: {id?: string; type?: string; data?: {object?: Session}};
  try {
    event = JSON.parse(payload);
  } catch {
    return reply(400, "not json");
  }

  const session = event.data?.object;
  if (!PAID_EVENTS.has(event.type ?? "") || !session?.id) return reply(200, "ignored");
  if (session.payment_status !== "paid") {
    console.log(`[stripe-webhook] ${session.id} completed but not paid yet (${session.payment_status}); waiting for its async event`);
    return reply(200, "not paid yet");
  }

  const order = readOrder(session);
  const origin = new URL(request.url).origin;
  const owner = ownerLetter(order);
  const buyer = order.email ? buyerLetter(order, {origin}) : null;
  const contact = await contactAddress(request);

  if (env.MAIL_DRY_RUN) {
    return new Response(JSON.stringify({dryRun: true, owner, buyer: buyer && {...buyer, to: order.email, replyTo: contact}}, null, 1), {
      headers: {"Content-Type": "application/json; charset=utf-8"},
    });
  }

  /* Names only, never values: see the same rule in enquiry.ts. */
  const missing = (["RESEND_API_KEY", "RESEND_FROM", "ENQUIRY_TO_EMAIL"] as const).filter((key) => !env[key]);
  if (missing.length > 0) {
    console.error(`[stripe-webhook] PAID ORDER NOT EMAILED (${session.id}), missing: ${missing.join(", ")}. Stripe will retry.`);
    return reply(500, "mail not configured");
  }

  const toOwner = await send(env, {
    to: [env.ENQUIRY_TO_EMAIL!],
    replyTo: owner.replyTo,
    subject: owner.subject,
    html: owner.html,
    text: owner.text,
    idempotencyKey: `paid-order/${session.id}`,
  });
  if (!toOwner.ok) {
    console.error(`[stripe-webhook] PAID ORDER NOT EMAILED (${session.id}): ${toOwner.reason}. Stripe will retry.`);
    return reply(500, "mail failed");
  }
  console.log(`[stripe-webhook] paid order emailed: ${session.id}`);

  if (!buyer) {
    console.warn(`[stripe-webhook] ${session.id} carries no buyer email; no confirmation sent`);
    return reply(200, "ok, no buyer email");
  }

  const toBuyer = await send(env, {
    to: [order.email],
    replyTo: contact,
    subject: buyer.subject,
    html: buyer.html,
    text: buyer.text,
    idempotencyKey: `paid-confirmation/${session.id}`,
  });
  if (toBuyer.ok) {
    console.log(`[stripe-webhook] buyer confirmation sent: ${session.id}`);
    return reply(200, "ok");
  }
  if (toBuyer.retryable) {
    console.error(`[stripe-webhook] BUYER CONFIRMATION NOT SENT (${session.id}): ${toBuyer.reason}. Stripe will retry.`);
    return reply(500, "confirmation failed");
  }

  /*
    REFUSED FOR GOOD. Retrying is pointless, so the order is acknowledged and
    he is told, in one line, that the buyer heard nothing from us. Best effort:
    his order letter already arrived, so this note failing changes nothing he
    has to do.
  */
  console.error(`[stripe-webhook] BUYER CONFIRMATION REFUSED (${session.id}): ${toBuyer.reason}`);
  const note = letter({
    lang: "en",
    heading: "Confirmation not sent",
    rows: [
      ["Order", `${summary(order, "en")}  ${order.reference}`],
      ["Buyer", order.email],
      ["Why", toBuyer.reason.slice(0, 200)],
    ],
    lines: ["The paid order above reached you; the buyer's confirmation did not. Write to them yourself."],
  });
  await send(env, {
    to: [env.ENQUIRY_TO_EMAIL!],
    replyTo: order.email,
    subject: `${order.test ? "[TEST] " : ""}Buyer not confirmed: ${summary(order, "en")}`,
    ...note,
    idempotencyKey: `paid-confirmation-failed/${session.id}`,
  });
  return reply(200, "ok, confirmation refused");
};

/* Stripe only ever POSTs. */
export const onRequestGet: PagesFunction<Env> = async () =>
  new Response(null, {status: 405, headers: {Allow: "POST"}});
