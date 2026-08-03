/*
  POST /api/enquiry — a Cloudflare Pages Function, the only server-side code on
  this site.

  Why a Pages Function and not an Astro server route: the Astro Cloudflare
  adapter no longer supports Cloudflare Pages and targets Workers, so adopting
  it would mean migrating the whole deployment off Pages and losing the URL, the
  git integration, the deploy hook and the Sanity webhook wired to it. A Pages
  Function needs none of that, costs nothing, and runs on the free plan
  (100,000 requests a day, far beyond a brand receiving enquiries).

  It answers with a whole HTML page rather than JSON, so the form works with no
  JavaScript at all. The page is small and self-contained: it cannot import the
  site's stylesheet, whose filename is content-hashed at build, so it carries
  the few tokens it needs. Pure paper and ink, the same two values as the site.
*/

type Env = {
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  ENQUIRY_TO_EMAIL?: string;
  /**
   * OPTIONAL KV namespace for rate limiting. When it is not bound the limiter
   * falls back to the Cache API, which needs no configuration at all. See the
   * RATE LIMITING block below.
   */
  ENQUIRY_LIMITS?: KVNamespace;
};

/* ---------------------------------------------------------- rate limiting */

/*
  WHY THIS EXISTS. This endpoint is the brand's ONLY sales channel and it spends
  a finite resource: the Resend free allowance is 100 emails a day. Before this,
  anyone could POST in a loop and drain that allowance in under a minute, after
  which no real buyer could reach the brand until the next day. That is a denial
  of the business, not of a website, and it cost nothing to mount.

  THE LIMITS, and why these numbers:

  - 5 per IP per hour. Nobody legitimately sends six enquiries in an hour. An
    enthusiastic buyer asking about three or four Creature in one sitting is
    still comfortably under it.
  - 20 per IP per day. Covers a genuine returning visitor across a whole day
    while making a slow drip attack from one address pointless.
  - 40 SENDS site-wide per day, against Resend's 100. A circuit breaker for
    distributed abuse, deliberately set well below the allowance so that
    tripping it still leaves the brand able to receive mail tomorrow. Realistic
    volume for a brand with eight pieces is a small number per week, so 40 is
    roughly two orders of magnitude of headroom.

  WHAT IS COUNTED WHERE, and it is not the same thing:

  - The per-IP counters count ATTEMPTS, before validation. An attacker looping
    invalid payloads is still abuse and should be shed as early as possible.
  - The global counter counts SENDS only, because it exists to protect the
    Resend allowance and an invalid submission never reaches Resend.

  STORAGE, on the free tier and with no configuration required:

  - If a KV namespace is bound as ENQUIRY_LIMITS it is used. KV is shared across
    locations, which makes the limit close to global. Free tier: 100,000 reads
    and 1,000 writes a day. A sustained flood from one address writes ONCE per
    window and then only reads, so a flood cannot exhaust the write budget.
  - Otherwise the Cache API is used, which exists in the Workers runtime with no
    binding, no dashboard step and no cost. It is per location rather than
    global, so a distributed attacker gets one bucket per Cloudflare colo. That
    is materially weaker and materially better than nothing, and it means this
    protection works the moment it deploys rather than after someone remembers
    to create a namespace.

  IT FAILS OPEN. If the store errors, the request is allowed. Blocking every
  enquiry because a cache misbehaved would do more damage than the attack this
  prevents, and there is no way for an attacker to force that state anyway.

  A NOTE FOR LOCAL TESTING: `wrangler dev` gives a Cache API that does not
  persist, so limits will not appear to work locally unless KV is bound. That is
  the local runtime, not this code.
*/
const LIMITS = {
  perIpPerHour: {max: 5, ttl: 60 * 60},
  perIpPerDay: {max: 20, ttl: 60 * 60 * 24},
  globalSendsPerDay: {max: 40, ttl: 60 * 60 * 24},
} as const;

type Store = {
  read(key: string): Promise<number>;
  bump(key: string, ttl: number, current: number): Promise<void>;
};

function makeStore(env: Env, origin: string): Store {
  if (env.ENQUIRY_LIMITS) {
    const kv = env.ENQUIRY_LIMITS;
    return {
      async read(key) {
        return Number((await kv.get(key)) ?? 0) || 0;
      },
      async bump(key, ttl, current) {
        // expirationTtl is set from the CURRENT write, so a bucket expires a
        // fixed window after it opened rather than sliding forever.
        await kv.put(key, String(current + 1), {expirationTtl: ttl});
      },
    };
  }

  /*
    No binding: the Cache API, which needs none.

    THE KEY MUST BE ON THIS SITE'S OWN ORIGIN. A synthetic host was tried first
    (https://ratelimit.invalid/...) and it works under `wrangler dev` and does
    NOTHING in production: Cloudflare's cache is scoped to the zone, so a put()
    for a hostname the zone does not serve is silently dropped, every read then
    misses, and the limiter fails open forever while looking perfectly healthy.
    It was caught by testing the deployed endpoint rather than the local one,
    which is the only place the difference shows.
  */
  const base = `${origin}/__rate/`;
  return {
    async read(key) {
      const hit = await caches.default.match(new Request(base + encodeURIComponent(key)));
      if (!hit) return 0;
      return Number(await hit.text()) || 0;
    },
    async bump(key, ttl, current) {
      await caches.default.put(
        new Request(base + encodeURIComponent(key)),
        new Response(String(current + 1), {
          headers: {"Cache-Control": `max-age=${ttl}`, "Content-Type": "text/plain"},
        }),
      );
    },
  };
}

/** The window a counter belongs to, so buckets roll over instead of sliding. */
function windowKey(prefix: string, seconds: number): string {
  return `${prefix}:${Math.floor(Date.now() / 1000 / seconds)}`;
}

/**
 * Check every per-IP limit and record the attempt. Returns the seconds to wait
 * when the caller should be refused, or null when it may proceed.
 */
async function limitAttempt(store: Store, ip: string): Promise<number | null> {
  try {
    for (const [name, {max, ttl}] of [
      ["h", LIMITS.perIpPerHour],
      ["d", LIMITS.perIpPerDay],
    ] as const) {
      const key = windowKey(`ip:${name}:${ip}`, ttl);
      const used = await store.read(key);
      if (used >= max) return ttl;
      await store.bump(key, ttl, used);
    }
    return null;
  } catch (error) {
    // Fails OPEN, deliberately. See the note above.
    console.warn(`[enquiry] rate limit store unavailable, allowing: ${(error as Error).message}`);
    return null;
  }
}

/** The site-wide send counter, checked and incremented around an actual send. */
async function globalSends(store: Store) {
  const {max, ttl} = LIMITS.globalSendsPerDay;
  const key = windowKey("global:sends", ttl);
  try {
    const used = await store.read(key);
    return {
      exhausted: used >= max,
      async record() {
        await store.bump(key, ttl, used).catch(() => {});
      },
    };
  } catch {
    return {exhausted: false, async record() {}};
  }
}

type Locale = "it" | "en";

/*
  MEASUREMENT RANGES, in centimetres, which is what is stored and sent.

  A buyer working in inches is NOT rejected (DESIGN-PLAN section 38). Before
  this, chest was validated between 50 and 200 with no unit choice, so an
  American entering 40 was told "Chest is in centimetres, between 50 and 200"
  for a perfectly normal chest. That is a valid customer turned away by a
  validator, and it is the kind of lost sale that appears in no log anywhere.
*/
const RANGES = {
  chest: [50, 200],
  shoulders: [25, 90],
  length: [30, 200],
} as const;

const PER_INCH = 2.54;

/*
  The range shown back to someone who chose inches is rounded INWARD: ceil the
  minimum, floor the maximum. Anyone who obeys the message therefore passes,
  where rounding outward would print a range that then gets rejected.
*/
function shownRange(key: keyof typeof RANGES, unit: "cm" | "in"): [number, number] {
  const [min, max] = RANGES[key];
  if (unit === "cm") return [min, max];
  return [Math.ceil(min / PER_INCH), Math.floor(max / PER_INCH)];
}

const TEXT = {
  it: {
    title: "Richiesta",
    ok: "Richiesta ricevuta. Ti rispondiamo via email.",
    replyWindow: "Rispondiamo entro un giorno, ora italiana.",
    back: "Torna alla Creatura",
    invalid: "Controlla i dati inseriti.",
    name: "Serve un nome.",
    email: "Serve un indirizzo email valido.",
    measure: {chest: "Torace", shoulders: "Spalle", length: "Lunghezza"},
    range: (field: string, min: number, max: number, unit: string) =>
      `${field}: indica un valore tra ${min} e ${max} ${unit}.`,
    tooFast: "Riprova: il modulo e stato inviato troppo in fretta.",
    notSent: "Non siamo riusciti a inviare la richiesta. Riprova piu tardi.",
    notConfigured: "L'invio delle richieste non e ancora attivo su questo sito.",
    tooMany: "Troppe richieste da qui. Riprova piu tardi.",
    draft: "Bozza non approvata",
  },
  en: {
    title: "Enquiry",
    ok: "Enquiry received. We will reply by email.",
    replyWindow: "We reply within one day, Italian time.",
    back: "Back to the Creature",
    invalid: "Please check what you entered.",
    name: "A name is needed.",
    email: "A valid email address is needed.",
    measure: {chest: "Chest", shoulders: "Shoulders", length: "Length"},
    range: (field: string, min: number, max: number, unit: string) =>
      `${field}: enter a value between ${min} and ${max} ${unit}.`,
    tooFast: "Please try again: the form was submitted too quickly.",
    notSent: "We could not send your enquiry. Please try again later.",
    notConfigured: "Sending enquiries is not switched on for this site yet.",
    tooMany: "Too many enquiries from here. Try again later.",
    draft: "Unapproved draft",
  },
} as const;

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]!);

/**
 * The answer page. Deliberately tiny and self-contained, in the site's two
 * colours and two registers, with the placeholder marked exactly as it is
 * everywhere else.
 */
function page(locale: Locale, opts: {heading: string; lines: string[]; placeholder?: string; backHref: string; draft?: boolean}) {
  const text = TEXT[locale];
  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${escape(opts.heading)} / Aleksander Cecco</title>
<style>
  :root { --ink:#0a0a0a; --paper:#fafaf8; --fg:var(--ink); --bg:var(--paper);
          --u:0.75rem; --margin:6vw; }
  @media (min-width:48rem){ :root{ --margin:clamp(3rem,8vw,10rem);} }
  html,body{margin:0;background:var(--bg);color:var(--fg);}
  body{font-family:"Archivo Variable",system-ui,sans-serif;font-size:1rem;line-height:1.5;
       padding:calc(var(--u)*6) var(--margin);min-height:100svh;
       display:flex;flex-direction:column;gap:calc(var(--u)*3);}
  .label{font-size:0.6875rem;text-transform:uppercase;letter-spacing:0.08em;font-weight:500;}
  .mark{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:0.75rem;
        text-transform:uppercase;letter-spacing:0.08em;
        border-bottom:1px dashed var(--fg);align-self:flex-start;}
  p{margin:0;max-width:60ch;}
  .draft{border-left:1px dashed var(--fg);padding-left:calc(var(--u)*2);}
  a{color:var(--fg);}
  a:focus-visible{outline:2px solid var(--fg);outline-offset:2px;box-shadow:0 0 0 2px var(--bg);}
</style>
</head>
<body>
  <p class="label">${escape(opts.heading)}</p>
  ${opts.draft ? `<p class="mark">${text.draft}</p>` : ""}
  ${opts.lines.map((line) => `<p${opts.draft ? ' class="draft"' : ""}>${escape(line)}</p>`).join("\n  ")}
  ${opts.placeholder ? `<p class="mark">${escape(opts.placeholder)}</p>` : ""}
  <p class="label"><a href="${escape(opts.backHref)}">${text.back}</a></p>
</body>
</html>`;
}

export const onRequestPost: PagesFunction<Env> = async ({request, env}) => {
  const form = await request.formData();
  const get = (key: string) => String(form.get(key) ?? "").trim();

  const locale: Locale = get("lang") === "en" ? "en" : "it";
  const text = TEXT[locale];
  const slug = get("slug").replace(/[^a-z0-9-]/gi, "");
  const backHref = slug ? `/${locale}/creature/${slug}/` : `/${locale}/`;

  /*
    RATE LIMIT, before validation and before anything expensive. Counting
    attempts rather than sends is deliberate: a loop of invalid payloads is
    still abuse, and the cheapest place to shed it is here.
  */
  const store = makeStore(env, new URL(request.url).origin);
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const retryAfter = await limitAttempt(store, ip);
  if (retryAfter !== null) {
    console.warn(`[enquiry] rate limited ${ip}`);
    return new Response(page(locale, {heading: text.title, lines: [text.tooMany], backHref}), {
      status: 429,
      headers: {"Content-Type": "text/html; charset=utf-8", "Retry-After": String(retryAfter)},
    });
  }

  const fields = {
    name: get("name"),
    email: get("email"),
    chest: get("chest"),
    shoulders: get("shoulders"),
    length: get("length"),
    note: get("note").slice(0, 2000),
    garmentName: get("garmentName"),
    garmentRef: get("garmentRef"),
  };

  const problems: string[] = [];

  // Spam, caught two cheap ways: a field people cannot see, and the fact that
  // nobody fills five fields in under three seconds.
  const rendered = Number(get("renderedAt"));
  if (get("website") !== "" || (Number.isFinite(rendered) && Date.now() - rendered < 3000)) {
    problems.push(text.tooFast);
  }

  if (fields.name.length < 1 || fields.name.length > 120) problems.push(text.name);
  // Loose on purpose: an address either routes or it does not, and a stricter
  // pattern rejects real addresses more often than it catches invented ones.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email) || fields.email.length > 254) {
    problems.push(text.email);
  }
  /*
    Whatever unit they chose, CENTIMETRES are what get validated, stored and
    sent. The error names the range in THEIR unit, because telling someone who
    chose inches that a chest must be "between 50 and 200" is the original bug
    wearing a different hat.
  */
  const unit: "cm" | "in" = get("unit") === "in" ? "in" : "cm";
  const cm: Record<"chest" | "shoulders" | "length", number> = {chest: 0, shoulders: 0, length: 0};

  /*
    TAKING A PIECE AS IT IS (2026-08-03). Some Creature already exist and can be
    had immediately, and asking for one of those needs no measurements at all.
    Requiring them anyway is precisely the defect section 31 costed: a server
    refusing a legitimate purchase, 422, with nothing in any log to show a sale
    was lost.

    Default is "remade", so every made to order piece behaves exactly as before
    and a submission that omits the field entirely is unchanged.

    The server does NOT check that this Creature really is one of the ready
    ones. It cannot: it has no content database, by design (the site is static).
    The worst a forged value can do is deliver an enquiry with no measurements
    in it, which the owner reads and answers like any other.
  */
  const asIs = get("fulfilment") === "asIs";

  for (const key of asIs ? ([] as const) : (["chest", "shoulders", "length"] as const)) {
    // A comma is a decimal separator in most of the languages this site meets.
    const entered = Number(fields[key].replace(",", "."));
    const value = unit === "in" ? entered * PER_INCH : entered;
    const [min, max] = RANGES[key];
    if (!Number.isFinite(value) || value < min || value > max) {
      const [lo, hi] = shownRange(key, unit);
      problems.push(text.range(text.measure[key], lo, hi, unit));
    } else {
      cm[key] = Math.round(value * 10) / 10;
    }
  }

  if (problems.length > 0) {
    return new Response(
      page(locale, {heading: text.invalid, lines: problems, backHref}),
      {status: 422, headers: {"Content-Type": "text/html; charset=utf-8"}},
    );
  }

  /*
    The site-wide circuit breaker. It guards the Resend allowance rather than
    this endpoint, so it counts SENDS and is checked only once a submission is
    valid and about to cost one.
  */
  const sends = await globalSends(store);
  if (sends.exhausted) {
    console.error("[enquiry] DAILY SEND CAP REACHED: refusing to spend more of the Resend allowance");
    return new Response(page(locale, {heading: text.title, lines: [text.tooMany], backHref}), {
      status: 429,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Retry-After": String(LIMITS.globalSendsPerDay.ttl),
      },
    });
  }

  if (!env.RESEND_API_KEY || !env.RESEND_FROM || !env.ENQUIRY_TO_EMAIL) {
    // Honest, not silent: nobody is told an email was sent when none was.
    console.warn("[enquiry] not configured: RESEND_API_KEY, RESEND_FROM or ENQUIRY_TO_EMAIL missing");
    return new Response(
      page(locale, {heading: text.title, lines: [text.notConfigured], backHref}),
      {status: 503, headers: {"Content-Type": "text/html; charset=utf-8"}},
    );
  }

  const piece = [fields.garmentName, fields.garmentRef].filter(Boolean).join(" / ") || "(no piece)";
  const body = [
    `Piece: ${piece}`,
    `Language: ${locale}`,
    "",
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    "",
    // What they are actually asking for, stated before the numbers rather than
    // left to be inferred from their absence.
    asIs ? "Wants: this piece as it is, no measurements given" : "Wants: made to these measurements",
    // Always centimetres. The original is echoed only when it was not, so the
    // owner can sanity-check a conversion without doing arithmetic himself.
    ...(asIs
      ? []
      : [
          `Chest: ${cm.chest} cm${unit === "in" ? ` (entered ${fields.chest} in)` : ""}`,
          `Shoulders: ${cm.shoulders} cm${unit === "in" ? ` (entered ${fields.shoulders} in)` : ""}`,
          `Length: ${cm.length} cm${unit === "in" ? ` (entered ${fields.length} in)` : ""}`,
        ]),
    "",
    fields.note ? `Note:\n${fields.note}` : "Note: (none)",
  ].join("\n");

  try {
    // One line per attempt, so a live test can be followed in the function log.
    console.log(`[enquiry] sending for "${piece}" (${locale})`);
    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json"},
      body: JSON.stringify({
        from: env.RESEND_FROM,
        to: [env.ENQUIRY_TO_EMAIL],
        reply_to: fields.email, // a reply goes straight to the person who asked
        subject: `Richiesta / Enquiry: ${piece}`,
        text: body,
      }),
    });

    if (!sent.ok) {
      // Log WHY, not just that it failed. Resend answers with a JSON body that
      // names the reason ("domain not verified", "invalid from", a bad key),
      // and without it an operator is guessing from a 502. It goes to the
      // Cloudflare function log, never to the visitor.
      const reason = await sent.text().catch(() => "(no body)");
      console.error(`[enquiry] Resend refused the message: ${sent.status} ${reason.slice(0, 500)}`);
      return new Response(
        page(locale, {heading: text.title, lines: [text.notSent], backHref}),
        {status: 502, headers: {"Content-Type": "text/html; charset=utf-8"}},
      );
    }

    // Counted only here, on a send that actually happened. A refusal by Resend
    // did not spend the allowance and must not spend the budget either.
    await sends.record();
  } catch (error) {
    console.error(`[enquiry] could not reach Resend: ${(error as Error).message}`);
    return new Response(
      page(locale, {heading: text.title, lines: [text.notSent], backHref}),
      {status: 502, headers: {"Content-Type": "text/html; charset=utf-8"}},
    );
  }

  return new Response(
    page(locale, {
      heading: text.title,
      /*
        The reply window is a real commitment now: the owner set it at one day
        MAXIMUM (2026-08-02), so the copy promises no more than that and is a
        line rather than a marked placeholder. {REPLY_WINDOW} is retired.
      */
      lines: [text.ok, text.replyWindow],
      backHref,
      draft: true, // the wording is still ours, so it stays marked as a draft
    }),
    {status: 200, headers: {"Content-Type": "text/html; charset=utf-8"}},
  );
};

/* Anything other than a POST belongs on the form page, not here. */
export const onRequestGet: PagesFunction<Env> = async () =>
  new Response(null, {status: 405, headers: {Allow: "POST"}});
