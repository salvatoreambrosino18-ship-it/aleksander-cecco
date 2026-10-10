/*
  POST /api/stripe-webhook — Stripe tells the shop a card payment went through,
  and the shop tells him.

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

  IF STRIPE TAKES THE MONEY AND THE EMAIL FAILS, THE ORDER IS NOT LOST, and the
  mechanism is Stripe's rather than ours, because ours would need a database
  this site does not have. Every failure on this side answers 500. Stripe treats
  anything but a 2xx as undelivered and sends the event again, with backoff, for
  up to three days in live mode; it emails the account when an endpoint keeps
  failing; and the payment itself is in the dashboard from the first second
  whatever happens here. So the failure modes are "late" and "loud", never
  "silent":

  - Resend down or refusing: 500, logged with Resend's reason, retried.
  - A Resend variable missing: 500, logged with the NAME of the missing one.
  - STRIPE_WEBHOOK_SECRET missing: 500, so the events queue at Stripe until it
    is set rather than being thrown away by a 200.

  The only way to get a 200 without the email is a request that is not a paid
  Checkout Session at all.

  THE SIGNATURE IS CHECKED BEFORE ANYTHING IS READ. This URL is public; without
  the check anyone could POST a made-up order and have it emailed to him as
  paid. Stripe signs `<timestamp>.<raw body>` with the endpoint's secret
  (HMAC-SHA256), and a body that does not verify, or that was signed more than
  five minutes ago, is refused with 400 and never parsed. The raw body is read
  as text, once, before JSON: re-serialising parsed JSON does not reproduce the
  bytes that were signed.

  DELIVERED AT LEAST ONCE, EMAILED ONCE. Stripe may send the same event twice.
  The send carries an idempotency key made from the session id, so Resend
  drops a repeat within 24 hours. A retry that arrives after that, for a send
  that had in fact gone through, would mean the order twice — which is the
  right side to err on.

  NO CALL BACK TO STRIPE. Everything the letter needs is in the signed event:
  the address, the buyer, the amounts Stripe charged, and the lines, which
  /api/checkout writes into the session's metadata when it creates it. That is
  one fewer thing that can fail between the money and the email, and it means
  this endpoint needs no API key of its own.
*/
import {letter, send, type Row} from "./_mail";

type Env = {
  /** The endpoint's signing secret, `whsec_…`, from the Stripe dashboard. */
  STRIPE_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  /** His inbox. Named for the email path it was created for; the same address. */
  ENQUIRY_TO_EMAIL?: string;
  /**
   * LOCAL TESTING ONLY. Verifies, parses and writes the letter, then answers
   * with it instead of sending it. Unset in production, where it does nothing.
   *
   *   npx wrangler pages dev dist --binding MAIL_DRY_RUN=1 --binding STRIPE_WEBHOOK_SECRET=whsec_test
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

const countryName = (code: string) => {
  try {
    return new Intl.DisplayNames(["en-GB"], {type: "region"}).of(code) ?? code;
  } catch {
    return code;
  }
};

/** An address as it goes on a parcel: one fact per line, country spelled out. */
function addressLines(name: string, a: Address | null | undefined): string {
  if (!a) return "(no address)";
  return [
    name,
    a.line1,
    a.line2,
    [a.postal_code, a.city].filter(Boolean).join(" "),
    a.state,
    a.country ? countryName(a.country) : "",
  ]
    .map((s) => (s ?? "").trim())
    .filter(Boolean)
    .join("\n");
}

/** The letter he receives for one paid session. Exported so it can be looked at. */
export function ownerLetter(session: Session) {
  const meta = session.metadata ?? {};
  const currency = (session.currency ?? "eur").toUpperCase();
  const money = (n: number) =>
    new Intl.NumberFormat("en-GB", {style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 2}).format(n);
  const cents = (n: number | null | undefined) => (Number(n) || 0) / 100;

  const lines = readLines(meta);
  const ship = session.collected_information?.shipping_details ?? session.shipping_details ?? session.shipping ?? null;
  const buyer = session.customer_details ?? {};
  const name = (ship?.name || buyer.name || meta.buyer || "").trim();
  const email = (buyer.email ?? "").trim();
  const phone = (buyer.phone ?? "").trim();
  const shipCountry = (ship?.address?.country ?? "").toUpperCase();
  /* What /api/checkout priced the parcel for. `shipping` is "IT europe 15". */
  const pricedFor = (meta.destination || (meta.shipping ?? "").split(" ")[0] || "").toUpperCase();
  const shipping = cents(session.total_details?.amount_shipping ?? session.shipping_cost?.amount_total);
  const total = cents(session.amount_total);
  const count = lines.reduce((sum, l) => sum + l.qty, 0);

  const rows: Row[] = [];
  /*
    THE ONE THING THAT MUST STOP HIM PACKING. /api/checkout locks the address
    to the country it priced, so this should never fire; if it ever does, the
    parcel was paid for at the wrong rate and he needs to see that before he
    sees anything else.
  */
  if (pricedFor && shipCountry && pricedFor !== shipCountry) {
    rows.push([
      "Check",
      `Shipping was charged for ${countryName(pricedFor)}, but the address is in ${countryName(shipCountry)}. Sort this out before shipping.`,
    ]);
  }
  for (const l of lines) {
    rows.push([
      l.name,
      l.unit > 0
        ? `${l.qty} x ${money(l.unit)}${l.size ? `  size ${l.size}` : ""}  =  ${money(l.unit * l.qty)}`
        : `${l.qty}${l.size ? `  size ${l.size}` : ""}`,
    ]);
  }
  rows.push(
    ["Shipping", `${shipping === 0 ? "Free" : money(shipping)}${shipCountry ? `  to ${countryName(shipCountry)}` : ""}`],
    ["Total paid", money(total)],
    ["Name", name || "(none given)"],
    ["Email", email || "(none given)"],
  );
  if (phone) rows.push(["Phone", phone]);
  rows.push(
    ["Ship to", addressLines(name, ship?.address)],
    ["Language", meta.lang === "it" ? "Italiano" : "English"],
    ["Stripe", session.payment_intent || session.id],
  );
  if (meta.note) rows.push(["Note", meta.note]);

  const dashboard = session.payment_intent
    ? `https://dashboard.stripe.com/${session.livemode === false ? "test/" : ""}payments/${session.payment_intent}`
    : "";

  const what =
    lines.length === 1 && lines[0].qty === 1
      ? `${lines[0].name}${lines[0].size ? ` ${lines[0].size}` : ""}`
      : `${count} ${count === 1 ? "piece" : "pieces"}`;

  const {html, text} = letter({
    lang: "en",
    heading: session.livemode === false ? "Paid order (test)" : "Paid order",
    rows,
    lines: [
      "Paid by card through Stripe. The money is already taken: there is nothing to collect.",
      ...(dashboard ? [`The payment in Stripe: ${dashboard}`] : []),
      ...(email ? [`Reply to this message and it goes straight to ${email}.`] : []),
    ],
  });

  return {
    subject: `${session.livemode === false ? "[TEST] " : ""}Paid order: ${what} — ${money(total)}`,
    html,
    text,
    replyTo: email || undefined,
  };
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

  const order = ownerLetter(session);

  if (env.MAIL_DRY_RUN) {
    return new Response(JSON.stringify({dryRun: true, to: "ENQUIRY_TO_EMAIL", ...order}, null, 1), {
      headers: {"Content-Type": "application/json; charset=utf-8"},
    });
  }

  /* Names only, never values: see the same rule in enquiry.ts. */
  const missing = (["RESEND_API_KEY", "RESEND_FROM", "ENQUIRY_TO_EMAIL"] as const).filter((key) => !env[key]);
  if (missing.length > 0) {
    console.error(`[stripe-webhook] PAID ORDER NOT EMAILED (${session.id}), missing: ${missing.join(", ")}. Stripe will retry.`);
    return reply(500, "mail not configured");
  }

  const sent = await send(env, {
    to: [env.ENQUIRY_TO_EMAIL!],
    replyTo: order.replyTo,
    subject: order.subject,
    html: order.html,
    text: order.text,
    idempotencyKey: `paid-order/${session.id}`,
  });
  if (!sent.ok) {
    console.error(`[stripe-webhook] PAID ORDER NOT EMAILED (${session.id}): ${sent.reason}. Stripe will retry.`);
    return reply(500, "mail failed");
  }

  console.log(`[stripe-webhook] paid order emailed: ${session.id}`);
  return reply(200, "ok");
};

/* Stripe only ever POSTs. */
export const onRequestGet: PagesFunction<Env> = async () =>
  new Response(null, {status: 405, headers: {Allow: "POST"}});
