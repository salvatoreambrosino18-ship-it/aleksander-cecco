/*
  THE LETTERS THIS SITE SENDS, and the one way it sends them.

  A MODULE BECAUSE THERE ARE NOW TWO LETTERS. The paid order he receives and the
  confirmation the buyer receives are both written here, in the register the
  order email established on 2026-08-03 (see enquiry.ts): paper not ink, no web
  fonts, every style inline, a plain text alternative alongside. He has read
  that layout every time somebody wanted a piece, so a paid order arrives in a
  shape he already knows how to read, and the only new word in it is "Paid".

  UNDERSCORED SO PAGES DOES NOT ROUTE IT, like _catalogue.ts.

  enquiry.ts KEEPS ITS OWN COPY of the layout until the email path is removed,
  which is a later commit. Folding a working endpoint onto a new module in the
  same change that adds an unrelated feature is how the thing that works gets
  broken.
*/

export type MailEnv = {
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
};

/** One line of a letter: the term on the left, the fact on the right. */
export type Row = [term: string, value: string];

const INK = "#0A0A0A";
const PAPER = "#FAFAF8";
const LABEL =
  `font:500 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:.08em;` +
  `text-transform:uppercase;color:${INK};`;
const MONO = `font:12px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;color:${INK};`;
const BODY = `font:400 15px/1.6 Helvetica,Arial,sans-serif;color:${INK};`;
const RULE = `border-top:1px solid ${INK};font-size:0;line-height:0;`;

const esc = (value: string) =>
  value.replace(/[&<>"]/g, (c) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"})[c]!);

/**
 * A letter in the brand's register, as HTML and as plain text.
 *
 * `rows` are facts and set in monospace, one per line; a value may hold line
 * breaks (an address does) and they are kept. `lines` are sentences and come
 * after a rule, in the body face.
 */
export function letter(opts: {
  lang: "it" | "en";
  heading: string;
  rows: Row[];
  lines?: string[];
}): {html: string; text: string} {
  const lines = opts.lines ?? [];
  const html = `<!doctype html><html lang="${opts.lang}"><body style="margin:0;padding:0;background:${PAPER};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};">
<tr><td align="left" style="padding:32px 24px;">
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:520px;">
<tr><td style="${LABEL}padding-bottom:24px;">Aleksander Cecco</td></tr>
<tr><td style="${RULE}">&nbsp;</td></tr>
<tr><td style="${LABEL}padding:24px 0 16px;">${esc(opts.heading)}</td></tr>
${opts.rows
  .map(
    ([term, value]) => `<tr><td style="padding-bottom:10px;">
<span style="${LABEL}display:inline-block;min-width:110px;vertical-align:top;">${esc(term)}</span>
<span style="${MONO}display:inline-block;vertical-align:top;white-space:pre-line;">${esc(value)}</span></td></tr>`,
  )
  .join("")}
${
  lines.length > 0
    ? `<tr><td style="${RULE}padding-top:24px;">&nbsp;</td></tr>
${lines.map((line) => `<tr><td style="${BODY}padding-top:12px;">${esc(line)}</td></tr>`).join("")}`
    : ""
}
</table></td></tr></table></body></html>`;

  // The plain alternative. Same facts, same order, no decoration.
  const text = [
    "ALEKSANDER CECCO",
    opts.heading.toUpperCase(),
    "",
    ...opts.rows.map(([term, value]) =>
      value.includes("\n") ? `${term}:\n  ${value.split("\n").join("\n  ")}` : `${term}: ${value}`,
    ),
    ...(lines.length > 0 ? ["", ...lines] : []),
  ].join("\n");

  return {html, text};
}

/**
 * Send one message through Resend, from the site's one sender.
 *
 * Never throws: the caller decides what a failure means, and for a paid order
 * it means "answer Stripe with a 500 so it tries again", which only works if
 * every failure reaches the caller as a value rather than escaping as an
 * exception the runtime turns into a page.
 *
 * `idempotencyKey` makes a repeat of the same message within 24 hours a no-op
 * at Resend. Stripe delivers an event AT LEAST once, so without it a retried
 * webhook whose first attempt did send would put the same order in his inbox
 * twice.
 */
export async function send(
  env: MailEnv,
  msg: {
    to: string[];
    replyTo?: string;
    subject: string;
    html: string;
    text: string;
    idempotencyKey?: string;
  },
): Promise<{ok: true} | {ok: false; reason: string; retryable: boolean}> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        ...(msg.idempotencyKey ? {"Idempotency-Key": msg.idempotencyKey} : {}),
      },
      body: JSON.stringify({
        from: env.RESEND_FROM,
        to: msg.to,
        ...(msg.replyTo ? {reply_to: msg.replyTo} : {}),
        subject: msg.subject,
        text: msg.text,
        html: msg.html,
      }),
    });
    if (res.ok) return {ok: true};
    // WHY, not just that: Resend's body names the reason, and it goes to the
    // function log, never to anyone outside.
    const reason = await res.text().catch(() => "(no body)");
    /*
      RETRYABLE means "the same request might work later": Resend overloaded,
      rate limited, or down. A 4xx otherwise is Resend saying THIS message is
      wrong — a sender off the verified domain, a malformed address — and
      sending it again in an hour will be refused in exactly the same words.
    */
    const retryable = res.status === 429 || res.status >= 500;
    return {ok: false, reason: `Resend ${res.status}: ${reason.slice(0, 500)}`, retryable};
  } catch (error) {
    return {ok: false, reason: `Resend unreachable: ${(error as Error).message}`, retryable: true};
  }
}
