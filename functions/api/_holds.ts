/*
  THE ONE OF ONE LOCK — so a piece that exists once is paid for once.

  THE PROBLEM, stated in the owner's terms. Styrax Red Goat and Severya are
  single objects. A Checkout Session is created the moment somebody presses
  pay, and Stripe will happily hold two of them open for the same coat; if both
  buyers finish, both are charged, and the second one is owed an apology and a
  refund for something they were told they had bought.

  WHY A DATABASE, and why this one. Preventing that needs ONE question answered
  atomically: "is it free, and if so it is mine". Nothing this site had could
  do that — the Cache API is per location, KV is eventually consistent, and a
  static build cannot know who is paying right now. D1 is SQLite with a single
  writer, so a conditional INSERT … ON CONFLICT DO UPDATE … WHERE is decided
  once, in order: of two requests arriving in the same millisecond exactly one
  changes the row and the other sees it changed. Bound to the Pages project as
  HOLDS (see BENVENUTO for the two dashboard steps).

  ONE ROW PER UNIQUE PIECE, and its three states:

  - HELD    `sold = 0` and `until` in the future: a Checkout Session is open
            for it. `session` is that session's id, or `pending:<token>` for
            the second between claiming and Stripe answering.
  - FREE    no row, or `sold = 0` with `until` in the past. A hold lapses on
            its own two minutes after its session expires, which Stripe makes
            final: an expired session cannot be paid.
  - SOLD    `sold = 1`, for good. Set by the webhook when the money arrives,
            and ALSO by the next claim if the webhook never came (below).

  IT DOES NOT TRUST THE WEBHOOK TO HAVE ARRIVED. If a payment completed but its
  event was lost or is still being retried, the row would look lapsed and the
  piece would be offered again. So before a lapsed hold is taken over, the
  session that held it is looked up at Stripe; if it was paid, the row becomes
  SOLD and the claim is refused. The webhook makes "sold" immediate; this makes
  it certain.

  THE SAME BROWSER CAN TAKE ITS OWN HOLD BACK. A buyer who opens Stripe's
  page, presses back and presses pay again would otherwise be told for half an
  hour that "someone else" is paying — and that someone is them. So the cart
  sends a random `holder` id it keeps in localStorage, and a claim that meets a
  live hold with the SAME holder expires that older session at Stripe first
  (so it can no longer be paid in a forgotten tab) and then takes the row. A
  double click is the same case a second apart. Another browser cannot guess a
  random id it has never seen.

  IT FAILS CLOSED. No binding, a database error, Stripe not answering about the
  previous holder: every one of them refuses the claim, and the cart says the
  piece cannot be paid for right now. A 1 of 1 not sold for an hour is a delay;
  a 1 of 1 sold twice is a refund and a broken promise.

  UNDERSCORED SO PAGES DOES NOT ROUTE IT.
*/

export type HoldsEnv = {HOLDS?: D1Database};

/** How long a Checkout Session for a unique piece stays payable. Stripe's minimum is 30 minutes. */
export const SESSION_SECONDS = 31 * 60;
/** The hold outlives its session by this much, so it can never lapse while the session can still be paid. */
const MARGIN_SECONDS = 120;

const SCHEMA = `CREATE TABLE IF NOT EXISTS unique_hold (
  slug TEXT PRIMARY KEY,
  session TEXT NOT NULL,
  holder TEXT NOT NULL DEFAULT '',
  until INTEGER NOT NULL,
  sold INTEGER NOT NULL DEFAULT 0
)`;

type Row = {slug: string; session: string; holder: string; until: number; sold: number};

export type Refusal = {slug: string; why: "sold" | "held" | "unavailable"; detail: string};

const nowSeconds = () => Math.floor(Date.now() / 1000);

/**
 * Was the session that held this piece paid? Asked of Stripe, not of us.
 * `null` means Stripe did not answer, which the caller treats as "do not sell".
 */
async function sessionWasPaid(key: string, session: string): Promise<boolean | null> {
  if (!session.startsWith("cs_")) return false;
  try {
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(session)}`, {
      headers: {Authorization: `Bearer ${key}`},
    });
    if (res.status === 404) return false;
    if (!res.ok) return null;
    const s = (await res.json()) as {status?: string; payment_status?: string};
    return s.status === "complete" && s.payment_status === "paid";
  } catch {
    return null;
  }
}

/**
 * End an open session so it can no longer be paid, before its hold is reused.
 * "paid" when it turns out to have been paid already, which ends the claim.
 */
async function expireSession(key: string, session: string): Promise<"expired" | "paid" | "error"> {
  try {
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(session)}/expire`, {
      method: "POST",
      headers: {Authorization: `Bearer ${key}`},
    });
    if (res.ok) return "expired";
    /* Refused: it is no longer open. Find out why before deciding. */
    const paid = await sessionWasPaid(key, session);
    if (paid === null) return "error";
    return paid ? "paid" : "expired";
  } catch {
    return "error";
  }
}

/**
 * Claim every unique piece in `slugs` for one checkout, or none of them.
 *
 * Returns the token the claim was made under, to attach the session to it
 * once Stripe has made one, or the first refusal. A basket holding both 1 of 1
 * pieces where only one is free claims neither: the buyer came for both.
 */
export async function claim(
  db: D1Database,
  stripeKey: string,
  slugs: string[],
  holder: string,
): Promise<{ok: true; token: string; until: number} | {ok: false; refusal: Refusal}> {
  const token = `pending:${crypto.randomUUID()}`;
  const now = nowSeconds();
  const until = now + SESSION_SECONDS + MARGIN_SECONDS;
  const taken: string[] = [];
  /* Only a real random id counts as a holder; an empty one matches nobody. */
  const me = /^[A-Za-z0-9-]{16,64}$/.test(holder) ? holder : "";

  const refuse = async (refusal: Refusal) => {
    if (taken.length > 0) await release(db, token).catch(() => {});
    return {ok: false as const, refusal};
  };

  try {
    await db.prepare(SCHEMA).run();
    for (const slug of slugs) {
      const row = await db
        .prepare("SELECT slug, session, holder, until, sold FROM unique_hold WHERE slug = ?1")
        .bind(slug)
        .first<Row>();

      if (row?.sold) return refuse({slug, why: "sold", detail: `sold under ${row.session}`});

      if (row && row.until >= now) {
        /* Live. Somebody else's, unless it is this browser's own earlier checkout. */
        if (!me || row.holder !== me) return refuse({slug, why: "held", detail: `held by ${row.session} until ${row.until}`});
        if (row.session.startsWith("cs_")) {
          const ended = await expireSession(stripeKey, row.session);
          if (ended === "error") return refuse({slug, why: "unavailable", detail: `could not expire ${row.session}`});
          if (ended === "paid") {
            await db.prepare("UPDATE unique_hold SET sold = 1 WHERE slug = ?1").bind(slug).run();
            return refuse({slug, why: "sold", detail: `${row.session} was paid by this same buyer`});
          }
        }
        /* A `pending:` row is this browser's previous click, still waiting on
           Stripe; taking it over makes that request give up (see attach). */
      } else if (row) {
        /* Lapsed. Make sure its session was not quietly paid first. */
        const paid = await sessionWasPaid(stripeKey, row.session);
        if (paid === null) return refuse({slug, why: "unavailable", detail: `could not ask Stripe about ${row.session}`});
        if (paid) {
          await db.prepare("UPDATE unique_hold SET sold = 1 WHERE slug = ?1").bind(slug).run();
          return refuse({slug, why: "sold", detail: `${row.session} was paid; the webhook had not marked it`});
        }
      }

      /*
        THE ATOMIC STEP. Insert when there is no row; otherwise take over only
        the exact row read above (`session = ?5`), and only if it is lapsed or
        this browser's own (`holder = ?6`). A request that changed the row in
        between makes this change nothing, and the claim is refused.
      */
      const result = await db
        .prepare(
          `INSERT INTO unique_hold (slug, session, holder, until, sold) VALUES (?1, ?2, ?6, ?3, 0)
           ON CONFLICT(slug) DO UPDATE SET session = excluded.session, holder = excluded.holder, until = excluded.until
           WHERE unique_hold.sold = 0 AND unique_hold.session = ?5
             AND (unique_hold.until < ?4 OR (?6 <> '' AND unique_hold.holder = ?6))`,
        )
        .bind(slug, token, until, now, row?.session ?? "", me)
        .run();
      if (result.meta.changes !== 1) return refuse({slug, why: "held", detail: "claimed by another checkout a moment ago"});
      taken.push(slug);
    }
    return {ok: true, token, until};
  } catch (error) {
    return refuse({slug: slugs[taken.length] ?? slugs[0], why: "unavailable", detail: `HOLDS error: ${(error as Error).message}`});
  }
}

/**
 * Put the real session id on the rows a claim took, so a later claim can ask
 * Stripe about it. False when the rows are no longer this claim's — taken over
 * by the same browser's newer click — and the caller must expire its session.
 */
export async function attach(db: D1Database, token: string, session: string, expected: number): Promise<boolean> {
  const result = await db.prepare("UPDATE unique_hold SET session = ?2 WHERE session = ?1 AND sold = 0").bind(token, session).run();
  return result.meta.changes === expected;
}

/** Give back what a claim or a session held, if it was not sold. */
export async function release(db: D1Database, tokenOrSession: string): Promise<void> {
  await db.prepare("DELETE FROM unique_hold WHERE session = ?1 AND sold = 0").bind(tokenOrSession).run();
}

/** Paid: the piece is gone, whatever state its row was in. */
export async function markSold(db: D1Database, slug: string, session: string): Promise<void> {
  await db.prepare(SCHEMA).run();
  await db
    .prepare(
      `INSERT INTO unique_hold (slug, session, holder, until, sold) VALUES (?1, ?2, '', 0, 1)
       ON CONFLICT(slug) DO UPDATE SET sold = 1, session = excluded.session`,
    )
    .bind(slug, session)
    .run();
}

/** What the cart needs to know before it offers a button: what is gone, what is being paid for. */
export async function status(db: D1Database): Promise<{sold: string[]; held: string[]}> {
  await db.prepare(SCHEMA).run();
  const now = nowSeconds();
  const {results} = await db.prepare("SELECT slug, sold, until FROM unique_hold").all<{slug: string; sold: number; until: number}>();
  return {
    sold: results.filter((r) => r.sold).map((r) => r.slug),
    held: results.filter((r) => !r.sold && r.until >= now).map((r) => r.slug),
  };
}
