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
  /*
    AN EXPLICIT DRY RUN, added 2026-08-03 after sending a real email by testing
    the confirmation page locally.

    Wrangler reads `.env`, which on this machine holds the three Resend values,
    so a VALID local submission sends an actual message to the owner's inbox and
    spends one of his hundred a day. Section 38 recorded that hazard and it was
    still walked into, twice, because the only safe local test was "submit
    something invalid", which cannot exercise the success path at all.

    So: an opt-in flag that skips the send and renders exactly what a real send
    renders. It is NOT environment sniffing (section 38 rejected that, rightly:
    detecting localhost fails quietly and in the wrong direction). It does
    nothing at all unless someone deliberately passes it:

      npx wrangler pages dev dist --binding ENQUIRY_DRY_RUN=1

    In production it is unset, and an unset binding cannot accidentally disable
    the only sales channel.
  */
  ENQUIRY_DRY_RUN?: string;
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
  MEASUREMENTS LEFT THIS FILE (2026-08-12, section 98). The owner removed made
  to measure from the shop: every Creature is bought as it exists, so an order
  carries a person and a piece and nothing else. The centimetre ranges, the inch
  conversion, the unit choice and the as-is-or-remade branch are all gone — and
  with them the one place this endpoint handled body measurements, which shrinks
  what the privacy notice has to cover.
*/

const TEXT = {
  it: {
    title: "Ordine",
    ok: "Ordine ricevuto.",
    replyWindow: "Lo confermiamo via email entro un giorno, ora italiana. Pagamento e consegna si definiscono in quella risposta.",
    /*
      THE WAIT IS GONE (2026-08-16, section 131). This told a buyer, on the
      confirmation, that the piece would be MADE after their order — while the
      piece's own page said "Available now." The owner settled it: available
      now. The reply window below still says when a person will hear back,
      which is the fact that remains true.
    */
    back: "Torna alla Creatura",
    /*
      UN ORDINE DAL CARRELLO NON HA UNA Creatura SOLA a cui tornare (sezione
      129). Prima la conferma diceva "Torna alla Creatura" e portava alla home,
      il che è sbagliato due volte: la parola e il posto.
    */
    backAll: "Tutte le Creature",
    invalid: "Controlla i dati inseriti.",
    name: "Serve un nome.",
    email: "Serve un indirizzo email valido.",
    tooFast: "Il modulo è stato inviato troppo in fretta. Riprova.",
    nothingChosen: "Scegli almeno un pezzo. Metti una quantità sopra lo zero.",
    notSent: "Non siamo riusciti a inviare l'ordine. Riprova piu tardi.",
    notConfigured: "L'invio degli ordini non e ancora attivo su questo sito.",
    listClosed: "Le iscrizioni non sono ancora aperte.",
    tooMany: "Troppe richieste da qui. Riprova piu tardi.",
    draft: "Bozza non approvata",
  },
  en: {
    title: "Order",
    ok: "Order received.",
    replyWindow: "We confirm it by email within one day, Italian time. Payment and delivery are arranged in that reply.",
    back: "Back to the Creature",
    backAll: "All Creature",
    invalid: "Please check what you entered.",
    name: "A name is needed.",
    email: "A valid email address is needed.",
    tooFast: "The form was submitted too quickly. Please try again.",
    nothingChosen: "Choose at least one piece. Set a quantity above zero.",
    notSent: "We could not send your enquiry. Please try again later.",
    notConfigured: "Sending orders is not switched on for this site yet.",
    listClosed: "Sign-up is not open yet.",
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
function page(
  locale: Locale,
  opts: {
    heading: string;
    lines: string[];
    placeholder?: string;
    backHref: string;
    draft?: boolean;
    /** What happens next, shown only on the confirmation. */
    next?: string;
    /** A cart order has no single piece behind it: name the catalogue instead. */
    backAll?: boolean;
    /**
     * Empty the visitor's cart. Set ONLY on a confirmation, because that is the
     * only moment the pieces in it have actually been ordered.
     */
    clearCart?: boolean;
  },
) {
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
  .mark-brand{padding-bottom:calc(var(--u)*2);}
  hr{border:0;border-top:1px solid var(--fg);width:100%;margin:0;}
  .next{font-size:clamp(1.125rem,0.95rem + 1.1vw,1.75rem);text-transform:uppercase;
        font-weight:300;letter-spacing:0.02em;max-width:24ch;}
  a{color:var(--fg);}
  a:focus-visible{outline:2px solid var(--fg);outline-offset:2px;box-shadow:0 0 0 2px var(--bg);}
  /* THE CEREMONY (section 72). This is the emotional peak of the site: the
     moment a person has committed to a piece. The page's elements arrive in
     writing order, each on the site's own reveal curve, the promise last.
     Inline and dependency-free like everything else on this page; reduced
     motion never enters the block. Remove by deleting it. */
  @media (prefers-reduced-motion: no-preference) {
    body>*{animation:arrive 600ms cubic-bezier(0.16,1,0.3,1) both;}
    body>*:nth-child(2){animation-delay:90ms;}
    body>*:nth-child(3){animation-delay:180ms;}
    body>*:nth-child(4){animation-delay:270ms;}
    body>*:nth-child(5){animation-delay:360ms;}
    body>*:nth-child(6){animation-delay:450ms;}
    body>*:nth-child(7){animation-delay:540ms;}
    body>*:nth-child(8){animation-delay:630ms;}
    @keyframes arrive{from{opacity:0;transform:translateY(10px);}}
  }
</style>
</head>
<body>
  <!--
    THE LAST THING A BUYER SEES (2026-08-03). This page was a heading, a line
    and a link back, which is a receipt rather than a moment. It is the end of
    the only transaction this site has, so it now says the three things a person
    actually wants at that instant: that it arrived, what happens next and
    roughly when, and that a human will be at the other end.

    Still one small self-contained document. It cannot import the site's
    stylesheet, whose filename is content-hashed at build.
  -->
  <p class="label mark-brand">Aleksander Cecco</p>
  <hr>
  <p class="label">${escape(opts.heading)}</p>
  ${opts.draft ? `<p class="mark">${text.draft}</p>` : ""}
  ${opts.lines.map((line) => `<p${opts.draft ? ' class="draft"' : ""}>${escape(line)}</p>`).join("\n  ")}
  ${opts.placeholder ? `<p class="mark">${escape(opts.placeholder)}</p>` : ""}
  ${opts.next ? `<p class="next">${escape(opts.next)}</p>` : ""}
  <hr>
  <p class="label"><a href="${escape(opts.backHref)}">${opts.backAll ? text.backAll : text.back}</a></p>
${
  opts.clearCart
    ? `  <!--
    THE CART IS EMPTIED HERE, and this is the only place it can be. The cart
    lives in the visitor's localStorage, which no server can reach; this page is
    the only moment the site knows the order was actually taken. Without it a
    buyer's cart still holds everything they just bought, the count in the
    chrome still says three, and the obvious next act is to order it again.

    A page rendered for a REFUSAL never carries this: nothing was ordered, and
    silently emptying a cart the brand could not sell to would be the worst
    possible reading of "it did not work".
  -->
  <script>try{localStorage.removeItem("ac-cart")}catch(e){}</script>`
    : ""
}
</body>
</html>`;
}

export const onRequestPost: PagesFunction<Env> = async ({request, env}) => {
  const form = await request.formData();
  const get = (key: string) => String(form.get(key) ?? "").trim();

  const locale: Locale = get("lang") === "en" ? "en" : "it";
  const text = TEXT[locale];
  const slug = get("slug").replace(/[^a-z0-9-]/gi, "");
  /*
    WHERE THE ANSWER PAGE SENDS THEM BACK TO. A single-piece order came from one
    Creature and returns to it. A cart order came from several, so it returns to
    the catalogue rather than to the home page, and says so — see `backAll`.
  */
  const backHref = slug ? `/${locale}/creature/${slug}/` : `/${locale}/creature/`;
  const backIsCatalogue = !slug;

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
    return new Response(page(locale, {heading: text.title, lines: [text.tooMany], backHref, backAll: backIsCatalogue}), {
      status: 429,
      headers: {"Content-Type": "text/html; charset=utf-8", "Retry-After": String(retryAfter)},
    });
  }

  /*
    THE LIST IS NOT OPEN (2026-08-03). The capture form exists on the home page
    and this endpoint answers it honestly rather than storing anything.

    Marketing email is a DIFFERENT legal basis from an enquiry, not a smaller
    one: consent must be separate, unbundled and opt-in; every message needs a
    working unsubscribe and the sender's identity and postal address; the record
    of when and how each consent was given has to be kept; and the list itself is
    personal data with a retention rule. Double opt-in is the defensible EU
    standard. All of that sits behind the same privacy notice that already
    blocks the enquiry, so nothing is collected until a lawyer has written one
    (DESIGN-PLAN section 62 and checklist group 1).
  */
  if (get("intent") === "newsletter") {
    return new Response(
      page(locale, {heading: text.title, lines: [text.listClosed], backHref, backAll: backIsCatalogue}),
      {status: 503, headers: {"Content-Type": "text/html; charset=utf-8"}},
    );
  }

  const fields = {
    name: get("name"),
    email: get("email"),
    /*
      THE CHOSEN SIZE (2026-08-12, section 101). Absent for a one-size piece,
      which sends no field at all, so an empty value is a fact rather than a
      failure. Clamped to what the studio offers: a forged value would otherwise
      arrive in his inbox as an order for a size he does not cut.
    */
    size: (["XS", "S", "M", "L", "XL"] as const).includes(get("size") as never)
      ? get("size")
      : "",
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
    SEVERAL PIECES AT ONCE (2026-08-17, section 126) — the cart posts here.

    It is the same endpoint on purpose. The gate that keeps orders from being
    sent is the absence of the Resend bindings, and a second endpoint would be
    a second gate to remember to close. The rate limiting, the honeypot, the
    timing check, the confirmation page and the email are all already here and
    all already correct; a basket is just a longer list of pieces.

    THE PRICES ARE NOT READ FROM THE FORM. A single-piece order sends `price`
    as a hidden field and this file has always said in its own comment that the
    figure is display-only, because a buyer can edit it. That is tolerable for
    one line the owner recognises; it is not tolerable for a total. So a basket
    is priced from /order-catalogue.json, which the BUILD writes from the same
    query the shop renders, served from this site's own origin: a slug that is
    not in it cannot be ordered, a size that is not offered for it is dropped,
    and a quantity above what exists is clamped.

    If that file cannot be fetched the order is refused rather than sent
    unpriced. An order sheet with the wrong total is worse than one that never
    arrived, because he would act on it.
  */
  const qtyKeys = [...form.keys()].filter((k) => k.startsWith("qty:"));
  const isBasket = qtyKeys.length > 0;
  type Line = {name: string; slug: string; size: string; qty: number; price: number};
  let lines: Line[] = [];
  let currency = "EUR";

  if (isBasket) {
    let catalogue: {items?: Array<{slug: string; name: string; price: number; currency?: string; sizes?: string[]; max?: number}>} | null = null;
    try {
      const res = await fetch(new URL("/order-catalogue.json", request.url).toString(), {
        cf: {cacheTtl: 300},
      } as RequestInit);
      if (res.ok) catalogue = await res.json();
    } catch {
      catalogue = null;
    }
    if (!catalogue?.items?.length) {
      console.error("[enquiry] basket: order-catalogue.json unreachable — refusing rather than pricing from the form");
      return new Response(page(locale, {heading: text.title, lines: [text.notSent], backHref, backAll: backIsCatalogue}), {
        status: 503,
        headers: {"Content-Type": "text/html; charset=utf-8"},
      });
    }
    const byslug = new Map(catalogue.items.map((i) => [i.slug, i]));
    for (const key of qtyKeys) {
      const slug = key.slice(4);
      const item = byslug.get(slug);
      if (!item) continue;
      const wanted = Math.floor(Number(get(key)));
      if (!Number.isFinite(wanted) || wanted <= 0) continue;
      const qty = Math.min(wanted, Math.max(1, item.max ?? 10));
      const offered = item.sizes ?? [];
      const chosen = get(`size:${slug}`);
      lines.push({
        name: item.name,
        slug,
        size: offered.includes(chosen) ? chosen : "",
        qty,
        price: item.price,
      });
      currency = item.currency ?? currency;
    }
    if (lines.length === 0) problems.push(text.nothingChosen);
  }

  if (problems.length > 0) {
    return new Response(
      page(locale, {heading: text.invalid, lines: problems, backHref, backAll: backIsCatalogue}),
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
    return new Response(page(locale, {heading: text.title, lines: [text.tooMany], backHref, backAll: backIsCatalogue}), {
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
      page(locale, {heading: text.title, lines: [text.notConfigured], backHref, backAll: backIsCatalogue}),
      {status: 503, headers: {"Content-Type": "text/html; charset=utf-8"}},
    );
  }

  const money = (n: number) =>
    new Intl.NumberFormat("en-GB", {style: "currency", currency, maximumFractionDigits: 0}).format(n);
  const basketTotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const basketCount = lines.reduce((sum, l) => sum + l.qty, 0);

  const piece = isBasket
    ? `${basketCount} ${basketCount === 1 ? "piece" : "pieces"}`
    : [fields.garmentName, fields.garmentRef].filter(Boolean).join(" / ") || "(no piece)";

  /*
    THE EMAIL IS A BRAND ARTEFACT (2026-08-03).

    He reads this every time somebody wants a piece, which makes it one of the
    few things on this project he sees more often than the site itself. It was
    plain text: correct, and indistinguishable from a form notification from
    anywhere.

    It is now the site's own register, with the same constraints and for the
    same reasons:

    - PAPER, NOT INK. Everywhere else this brand opens in darkness. An email
      does not: a client that strips styles falls back to black on white, and an
      ink-on-ink email is an unreadable one. Choosing the polarity that survives
      being stripped is the same argument as the poster behind a video.
    - NO WEB FONTS. They do not load in most clients, so the register is carried
      by case, tracking and weight, which is what section 14 found the
      references do anyway. Facts are in the client's monospace, the way the
      site sets facts in JetBrains Mono.
    - EVERY STYLE INLINE. <style> blocks are stripped by several clients; a
      brand artefact that only looks right in one inbox is not one.
    - A PLAIN TEXT ALTERNATIVE, sent alongside, because some clients show it and
      because it is what lands in a search result inside his mailbox.

    The subject leads with the piece and the price, since those are what he
    needs to recognise an enquiry in a list of them.
  */
  /*
    Shown price, for the ORDER SHEET only. It arrives from a hidden field, so a
    hostile client can forge it; that is acceptable because the sheet is read by
    the owner, who knows his own prices, and nothing here charges anyone. When
    the payment step exists the amount comes from the dataset, never from the
    form.
  */
  const shownPrice = isBasket
    ? money(basketTotal)
    : get("price").replace(/[^0-9€.,]/g, "").slice(0, 12);

  /*
    A BASKET IS READ AS AN ORDER SHEET, one line per piece, with the size and
    the quantity beside the name and the line total at the end — because that
    is what he has to pick and pack from. A single piece keeps the shape it
    always had.
  */
  const rows: Array<[string, string]> = isBasket
    ? [
        ...lines.map(
          (l) =>
            [
              l.name,
              `${l.qty} x ${money(l.price)}${l.size ? `  size ${l.size}` : ""}  =  ${money(l.price * l.qty)}`,
            ] as [string, string],
        ),
        ["Total", money(basketTotal)],
        ["Name", fields.name],
        ["Email", fields.email],
        ["Language", locale === "it" ? "Italiano" : "English"],
      ]
    : [
        ["Creature", piece],
        ...(shownPrice ? ([["Price", shownPrice]] as Array<[string, string]>) : []),
        ["Name", fields.name],
        ["Email", fields.email],
        ...(fields.size ? ([["Size", fields.size]] as Array<[string, string]>) : []),
        ["Language", locale === "it" ? "Italiano" : "English"],
      ];

  const esc = (value: string) =>
    value.replace(/[&<>"]/g, (c) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"})[c]!);

  const INK = "#0A0A0A";
  const PAPER = "#FAFAF8";
  const label =
    `font:500 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:.08em;` +
    `text-transform:uppercase;color:${INK};`;
  const mono = `font:12px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;color:${INK};`;

  const html = `<!doctype html><html lang="${locale}"><body style="margin:0;padding:0;background:${PAPER};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};">
<tr><td align="left" style="padding:32px 24px;">
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:520px;">
<tr><td style="${label}padding-bottom:24px;">Aleksander Cecco</td></tr>
<tr><td style="border-top:1px solid ${INK};font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="${label}padding:24px 0 16px;">Order</td></tr>
${rows
  .map(
    ([term, value]) => `<tr><td style="padding-bottom:10px;">
<span style="${label}display:inline-block;min-width:110px;">${esc(term)}</span>
<span style="${mono}">${esc(value)}</span></td></tr>`,
  )
  .join("")}
${
  fields.note
    ? `<tr><td style="border-top:1px solid ${INK};font-size:0;line-height:0;padding-top:16px;">&nbsp;</td></tr>
<tr><td style="${label}padding:16px 0 8px;">Note</td></tr>
<tr><td style="font:400 15px/1.6 Helvetica,Arial,sans-serif;color:${INK};white-space:pre-wrap;">${esc(fields.note)}</td></tr>`
    : ""
}
<tr><td style="border-top:1px solid ${INK};font-size:0;line-height:0;padding-top:24px;">&nbsp;</td></tr>
<tr><td style="${mono}padding-top:12px;">
Reply to this message and it goes straight to ${esc(fields.email)}.
</td></tr>
</table></td></tr></table></body></html>`;

  // The plain alternative. Same facts, same order, no decoration.
  const body = [
    "ALEKSANDER CECCO",
    "ORDER",
    "",
    ...rows.map(([term, value]) => `${term}: ${value}`),
    "",
    fields.note ? `Note:\n${fields.note}` : "Note: (none)",
    "",
    `Reply to this message and it goes straight to ${fields.email}.`,
  ].join("\n");

  if (env.ENQUIRY_DRY_RUN) {
    console.warn(`[enquiry] DRY RUN: not sending. Would have mailed "${piece}"${shownPrice ? ` — ${shownPrice}` : ""} (${locale}).`);
    return new Response(
      page(locale, {heading: text.title, lines: [text.ok], next: text.replyWindow, backHref, backAll: backIsCatalogue, clearCart: true}),
      {status: 200, headers: {"Content-Type": "text/html; charset=utf-8"}},
    );
  }

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
        subject: `Order: ${piece}${shownPrice ? ` — ${shownPrice}` : ""}`,
        text: body,
        html,
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
        page(locale, {heading: text.title, lines: [text.notSent], backHref, backAll: backIsCatalogue}),
        {status: 502, headers: {"Content-Type": "text/html; charset=utf-8"}},
      );
    }

    // Counted only here, on a send that actually happened. A refusal by Resend
    // did not spend the allowance and must not spend the budget either.
    await sends.record();
  } catch (error) {
    console.error(`[enquiry] could not reach Resend: ${(error as Error).message}`);
    return new Response(
      page(locale, {heading: text.title, lines: [text.notSent], backHref, backAll: backIsCatalogue}),
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
      /*
        Three beats: it arrived, a person will answer, and here is the promise
        with its limit on it. The reply window is a real commitment (one day
        maximum, Italian time) rather than a placeholder.

        NO DRAFT MARK. The wording is still ours, and it is flagged as
        `enquiryCopy` in site settings and caught by `npm run launch-check`; a
        buyer who has just sent their measurements should not be told the brand
        has not decided what it says (DESIGN-PLAN section 59).
      */
      lines: [text.ok],
      next: text.replyWindow,
      backHref,
      backAll: backIsCatalogue,
      clearCart: true,
    }),
    {status: 200, headers: {"Content-Type": "text/html; charset=utf-8"}},
  );
};

/* Anything other than a POST belongs on the form page, not here. */
export const onRequestGet: PagesFunction<Env> = async () =>
  new Response(null, {status: 405, headers: {Allow: "POST"}});
