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
};

type Locale = "it" | "en";

const RANGES = {
  chest: [50, 200],
  shoulders: [25, 90],
  length: [30, 200],
} as const;

const TEXT = {
  it: {
    title: "Richiesta",
    ok: "Richiesta ricevuta. Ti rispondiamo via email.",
    replyWindow: "{REPLY_WINDOW}",
    back: "Torna al capo",
    invalid: "Controlla i dati inseriti.",
    name: "Serve un nome.",
    email: "Serve un indirizzo email valido.",
    chest: "Il torace va indicato in centimetri, tra 50 e 200.",
    shoulders: "Le spalle vanno indicate in centimetri, tra 25 e 90.",
    length: "La lunghezza va indicata in centimetri, tra 30 e 200.",
    tooFast: "Riprova: il modulo e stato inviato troppo in fretta.",
    notSent: "Non siamo riusciti a inviare la richiesta. Riprova piu tardi.",
    notConfigured: "L'invio delle richieste non e ancora attivo su questo sito.",
    draft: "Bozza non approvata",
  },
  en: {
    title: "Enquiry",
    ok: "Enquiry received. We will reply by email.",
    replyWindow: "{REPLY_WINDOW}",
    back: "Back to the piece",
    invalid: "Please check what you entered.",
    name: "A name is needed.",
    email: "A valid email address is needed.",
    chest: "Chest is in centimetres, between 50 and 200.",
    shoulders: "Shoulders are in centimetres, between 25 and 90.",
    length: "Length is in centimetres, between 30 and 200.",
    tooFast: "Please try again: the form was submitted too quickly.",
    notSent: "We could not send your enquiry. Please try again later.",
    notConfigured: "Sending enquiries is not switched on for this site yet.",
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
  const backHref = slug ? `/${locale}/pieces/${slug}/` : `/${locale}/`;

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
  for (const key of ["chest", "shoulders", "length"] as const) {
    const value = Number(fields[key].replace(",", "."));
    const [min, max] = RANGES[key];
    if (!Number.isFinite(value) || value < min || value > max) problems.push(text[key]);
  }

  if (problems.length > 0) {
    return new Response(
      page(locale, {heading: text.invalid, lines: problems, backHref}),
      {status: 422, headers: {"Content-Type": "text/html; charset=utf-8"}},
    );
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
    `Chest: ${fields.chest} cm`,
    `Shoulders: ${fields.shoulders} cm`,
    `Length: ${fields.length} cm`,
    "",
    fields.note ? `Note:\n${fields.note}` : "Note: (none)",
  ].join("\n");

  try {
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
      console.error(`[enquiry] Resend refused the message: ${sent.status}`);
      return new Response(
        page(locale, {heading: text.title, lines: [text.notSent], backHref}),
        {status: 502, headers: {"Content-Type": "text/html; charset=utf-8"}},
      );
    }
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
      lines: [text.ok],
      placeholder: text.replyWindow,
      backHref,
      draft: true, // the confirmation copy is an unapproved draft
    }),
    {status: 200, headers: {"Content-Type": "text/html; charset=utf-8"}},
  );
};

/* Anything other than a POST belongs on the form page, not here. */
export const onRequestGet: PagesFunction<Env> = async () =>
  new Response(null, {status: 405, headers: {Allow: "POST"}});
