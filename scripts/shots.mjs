/*
  THE LOOKING HARNESS.

    npm run shots                capture every route, both languages, 390 + 1440
    npm run shots -- --audit     capture AND run the checks; exits non-zero on a fault
    npm run shots -- --prove     prove the audit can go red, then stop
    npm run shots -- --only=/it/contact,/it   just these routes
    npm run shots -- --dark      also capture with prefers-color-scheme: dark
    npm run shots -- --chrome=gradient|plate|band   render a treatment for the
                                 corner mark over photography, WITHOUT shipping
                                 one (section 86)
    npm run shots -- --weigh     what each route costs on 400 kbps / 400ms:
                                 transfer bytes by kind, FCP and LCP (section 91)
    npm run shots -- --slice=8   also cut each capture into 8 strips you can
                                 actually look at (section 108). A 20,000px page
                                 opened whole is a thumbnail, and a judgement
                                 made from a thumbnail is a judgement about a
                                 thumbnail.

  WHY THIS FILE EXISTS AT ALL, and why it is committed.

  Two tools have now died in temporary folders and each death cost a real
  defect. The icon renderer went first (section 74's addendum): the handoff
  pointed at `scratchpad/icons.mjs`, the scratchpad was cleaned, and the next
  session would have improvised the very renderer that shipped a corner-stamped
  touch icon. The screenshot harness went the same way, and the cost was larger
  and quieter — a whole design pass was verified structurally and never
  actually WATCHED, which are different claims. A 252px black band sat under the
  home page's footer through several sessions because nobody could see it.

  So: `scripts/`, in the repository, next to the thing it protects. If you find
  yourself about to write a one-off renderer or capturer, add a flag to this
  instead.

  THE PORT TRAP, fixed at the root. The old harness hardcoded its target origin
  and an hour was lost to a stale port constant. This one has no port constant
  to go stale: it starts its OWN static server on port 0, lets the operating
  system assign the port, and reads it back off the listening socket. It also
  still refuses to capture if the page it landed on is not the page it asked for
  — belt as well as braces, because a redirect to a 404 photographs perfectly
  well and looks like a working page.

  THE SERVER LIFETIME TRAP. A server started with `&` dies when its shell call
  ends, and every later check then reports a dead site. Here the server is a
  child of this process and is closed in a finally block, so its life is exactly
  this script's life and there is no orphan to find later.

  WHAT IT SERVES: `dist/`, the real build. Not the dev server, which resolves
  differently, and not a remote origin, which caches (section 74: Cloudflare's
  edge served a stale body minutes after deploy).

  DO NOT BUILD WHILE THIS IS RUNNING. `npm run check` ends in `astro build`, and
  a build CLEARS dist/ before rewriting it. Running one during a walk made real
  pages 404 for a window; the harness photographed the site's own 404 page and
  reported its caption as a fault on four Creature pages that were fine. Every
  navigation and every reload now asserts what it landed on, so this is a loud
  refusal rather than four phantom faults buried in a long log — but the simplest
  answer is still to let the walk finish first.
*/
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {chromium} from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const OUT = path.join(ROOT, "shots");

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const value = (name) => argv.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");
const ORIGIN = value("origin");

const AUDIT = flag("audit") || flag("prove");
const PROVE = flag("prove");
const DARK = flag("dark");
const ONLY = value("only")?.split(",").map((s) => s.trim()).filter(Boolean) ?? null;
/*
  --force=light|dark renders the site as if every PAGE SURFACE were that
  polarity, for studying an assignment before committing to it (2026-08-10).

  It overrides only the surfaces that carry a page polarity — <html>, the text
  sections, the footer wrapper and the wash's two layers. It deliberately does
  NOT touch figcaption, #site-chrome or the drawn mark: those take a polarity
  MEASURED against a photograph, and a picture does not become brighter because
  the page around it did. Flipping them would make the study lie.
*/
const FORCE = value("force");

/*
  --chrome=gradient|plate|band RENDERS A TREATMENT FOR THE CORNER MARK, for
  studying it before anyone commits to one (2026-08-11, section 86).

  WHY THIS IS A FLAG AND NOT A BRANCH. 71 of 97 photograph placements measure
  under 4.5:1 for the fixed signature and MENU WHICHEVER polarity is chosen —
  the brand's own name is unreadable on most of the site, and standing rule 11,
  which forbids the standard fix, was written before anyone had seen this
  photography. The rule deserves to be re-examined against a picture rather than
  against an argument, and this is how the pictures get made. Nothing here is
  shipped; the site is untouched.

    none      (default) as the site is today
    gradient  the conventional scrim: a soft band under the chrome, in the
              OPPOSITE polarity to the mark, fading to nothing. It is the thing
              every reference does, and it is what the rule forbids: between
              solid ink and solid paper it paints every value in between.
    plate     a solid plate behind the marks only. Two colours, no gradient, no
              gray — the rule survives intact — and it puts two opaque
              rectangles on his photograph.
    band      the chrome stops floating: it takes its own height in the flow, in
              page ground, and the photograph begins under it. No mark ever sits
              on a photograph, so nothing needs measuring. It costs the top edge
              of every full-bleed frame.

  It deliberately does not touch captions: they are a different band with a
  different measured value, and mixing the two would make the study lie.
*/
const CHROME = value("chrome");

/*
  --weigh RENDERS EACH ROUTE ON A THROTTLED CONNECTION AND REPORTS WHAT IT COST
  (2026-08-12, section 91).

  Section 79 refused the splash screen on Slow 4G numbers, and section 69 found
  a 1.8 MB catalogue the same way — both times measured in a session and by a
  tool that did not survive it, so every later session has had to take those
  numbers on trust or guess. This is that measurement, committed, so a claim
  about weight can be re-made instead of remembered.

  THE PROFILE IS THE ONE THIS PROJECT HAS ALWAYS QUOTED: 400 kbps down, 400ms
  round trip. Chrome's own "Slow 4G" preset has moved over the years; the number
  in section 79 is 400 kbps and comparisons are worthless if the profile drifts,
  so it is pinned here rather than taken from a preset name.

  It reports TRANSFER bytes — what actually crossed the wire, compressed — split
  by kind, plus first contentful paint and largest contentful paint. Photographs
  come from Sanity's CDN over the real internet, so the image figures include
  that latency and are the honest number a visitor pays rather than a local one.
*/
const WEIGH = flag("weigh");

/*
  --rhythm MEASURES THE EMPTINESS OF EVERY SECTION (2026-08-13, section 105).

  The owner looked at the deployed site at desktop width and said the text
  sections were empty. He was right, and nothing in this harness could have told
  anyone: the audit checks contrast, overflow, spill and flat BANDS between two
  painted grounds, and a section that is mostly air is none of those. It is
  valid, legible, and wrong.

  So this walks the page's own top-level sections and reports, for each: how
  tall it is, how tall the content inside it actually is, and the difference.
  A section whose content is 120px inside a 900px box is the complaint, stated
  as a number, and it can be re-measured after a fix rather than argued about.
*/
const RHYTHM = flag("rhythm");
/* How many strips to cut each capture into, for looking at it. See the note at
   the capture below; 0 or 1 means the whole page and nothing else. */
const SLICE = Number(value("slice") ?? 0);
const SLOW_4G = {download: (400 * 1024) / 8, upload: (400 * 1024) / 8, latency: 400};

/*
  The two widths the site is designed against (DESIGN-PLAN section 14): a phone
  at 390 and a desktop at 1440. Not a sweep — these are the two the references
  were measured at, and a number nobody measured is a number nobody can judge.
*/
const VIEWPORTS = (
  value("viewports")?.split(",").map((v) => v.trim()).filter(Boolean) ?? ["390", "1440"]
).map((name) => {
  /*
    The two the references were measured at stay the default (section 14). The
    owner reads the site at 1920, so a width can be named on the command line
    rather than being unmeasurable: `--viewports=1440,1920`.
  */
  const preset = {"390": {width: 390, height: 844}, "1440": {width: 1440, height: 900}, "1920": {width: 1920, height: 1080}};
  return {name, ...(preset[name] ?? {width: Number(name), height: 900})};
});

/* ------------------------------------------------------------------ server */

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

function serve() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    let file = path.join(DIST, decodeURIComponent(url.pathname));
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      // The real host serves the 404 page; so does this, so a broken link
      // photographs as the site's own 404 rather than as a server error.
      const notFound = path.join(DIST, "404.html");
      res.writeHead(404, {"content-type": "text/html; charset=utf-8"});
      res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : "not found");
      return;
    }
    res.writeHead(200, {"content-type": MIME[path.extname(file)] ?? "application/octet-stream"});
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => {
    // Port 0: the OS picks. There is no constant here to go stale.
    server.listen(0, "127.0.0.1", () => resolve({server, port: server.address().port}));
  });
}

/* ------------------------------------------------------------------ routes */

function routes() {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name === "index.html") {
        const route = p.replace(DIST, "").replace(/\/index\.html$/, "") || "/";
        out.push(route);
      }
    }
  };
  walk(DIST);
  return out.sort();
}

/* ------------------------------------------------------------------- audit */

/*
  WHAT IS CHECKED, and why each one is here rather than being a nice idea.

  overflow    The page scrolls sideways. The site is a column of full-bleed
              photographs; a horizontal scrollbar is always a fault.
  spill       An element sticks out past its own container. This is the shape of
              the worn-band caption bug: a component built for page context used
              inside a 416px strip frame, taking the page's margins with it.
  contrast    Text against the ground it actually sits on. The site's rule is
              solid ink or solid paper, no scrim and no gray (standing rule 11),
              so anything under 4.5 is either the wrong polarity or a caption on
              a photograph that cannot carry one.
  bands       A run of flat page ground taller than a third of the viewport with
              CONTENT on both sides of it. This is the 252px black band under
              the home page's footer, stated as a rule a machine can apply.
*/
const AUDIT_SCRIPT = `(() => {
  const faults = [];
  const near = (a, b) => Math.abs(a - b) < 12;

  const lum = (rgb) => {
    const c = rgb.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const parse = (s) => {
    const m = s && s.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(/[,\\s/]+/).filter(Boolean).map(Number);
    if (p.length >= 4 && p[3] === 0) return null;
    return [p[0], p[1], p[2]];
  };
  const ratio = (a, b) => {
    const [hi, lo] = lum(a) > lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)];
    return (hi + 0.05) / (lo + 0.05);
  };
  const describe = (el) => {
    const id = el.id ? '#' + el.id : '';
    const cls = (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className) || '';
    return el.tagName.toLowerCase() + id + (cls ? '.' + String(cls).trim().split(/\\s+/).slice(0, 3).join('.') : '');
  };

  // 1. the page scrolls sideways
  const de = document.documentElement;
  if (de.scrollWidth > de.clientWidth + 1) {
    faults.push({kind: 'overflow', detail: de.scrollWidth + 'px of content in a ' + de.clientWidth + 'px viewport'});
  }

  // 2. an element spills out of its own container
  for (const el of document.querySelectorAll('main *')) {
    const parent = el.parentElement;
    if (!parent) continue;
    const cs = getComputedStyle(parent);
    if (cs.overflowX !== 'visible') continue;
    if (getComputedStyle(el).position === 'absolute' || getComputedStyle(el).position === 'fixed') continue;
    const a = el.getBoundingClientRect();
    const b = parent.getBoundingClientRect();
    if (a.width === 0 || b.width === 0) continue;
    const over = Math.max(b.left - a.left, a.right - b.right);
    if (over > 2) {
      faults.push({kind: 'spill', detail: describe(el) + ' sticks ' + Math.round(over) + 'px out of ' + describe(parent)});
    }
  }

  // 3. text that cannot be read against what it sits on
  const seen = new Set();
  for (const el of document.querySelectorAll('main *')) {
    const text = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ');
    if (!text) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const fg = parse(cs.color);
    if (!fg) continue;
    // walk up for the first ancestor that actually paints
    let bg = null;
    for (let p = el; p; p = p.parentElement) {
      const c = parse(getComputedStyle(p).backgroundColor);
      if (c) { bg = c; break; }
    }
    if (!bg) continue;
    // Text over a photograph has no computable background: the site solves that
    // with a measured per-image polarity, and a machine cannot second-guess it.
    let overMedia = false;
    for (let p = el; p; p = p.parentElement) {
      if (p.tagName === 'FIGCAPTION' && getComputedStyle(p).position === 'absolute') { overMedia = true; break; }
    }
    if (overMedia) continue;
    const r = ratio(fg, bg);
    const key = describe(el) + '|' + text.slice(0, 24);
    if (r < 4.5 && !seen.has(key)) {
      seen.add(key);
      faults.push({kind: 'contrast', detail: describe(el) + ' at ' + r.toFixed(2) + ':1 — "' + text.slice(0, 48) + '"'});
    }
  }

  return faults;
})()`;

/*
  THE BAND CHECK runs on pixels, not on the DOM, because the bug it is for is
  invisible to the DOM: a transparent margin has no element to inspect. It reads
  one column near the left edge of a full-page capture, classifies each row as
  ink, paper or neither, and reports a flat run with content above AND below it.

  It samples at x = 3px, which on this site is outside every text margin and so
  is page ground wherever the page is not a full-bleed photograph.
*/
function bandsFromColumn(columns, height, viewportHeight, skip = []) {
  const classify = (r, g, b) => (r < 40 && g < 40 && b < 40 ? "ink" : r > 230 && g > 230 && b > 230 ? "paper" : "media");
  const rows = [];
  for (let y = 0; y < height; y++) {
    /*
      THREE COLUMNS, NOT ONE (2026-08-10). One column at the left edge called a
      very dark PHOTOGRAPH flat ink and reported Severya's black studio wall as
      a hole. Page ground is uniform ACROSS the row; a photograph almost never
      is. All three must agree or the row is a picture.
    */
    const kinds = columns.map((col) => classify(col[y * 3], col[y * 3 + 1], col[y * 3 + 2]));
    rows.push(kinds.every((k) => k === kinds[0]) ? kinds[0] : "media");
  }
  const runs = [];
  let start = 0;
  for (let y = 1; y <= height; y++) {
    if (y === height || rows[y] !== rows[start]) {
      runs.push({kind: rows[start], from: start, to: y, height: y - start});
      start = y;
    }
  }
  /*
    WHAT COUNTS AS A HOLE, tightened on its first real run (2026-08-10).

    The first version flagged any flat run between two others, which is most of
    the site: a text surface between two full-bleed photographs is flat ground
    with content on both sides, and it reported 258 of them. The gap SIZE was
    never the tell either — legitimate section padding at 1440 is u13 above plus
    u5 below, about 216px, against the real bug's 252px.

    The tell is POLARITY. The bug was ink showing between two PAINTED PAPER
    surfaces: a hole through to a ground nobody chose. So both neighbours must
    themselves be flat and the same as each other, and neither may be a
    photograph — a photograph is not a claim about polarity, it is a picture,
    and the page is allowed to be either colour on the far side of one.
  */
  const faults = [];
  const min = Math.round(viewportHeight / 3);
  const flat = (kind) => kind === "ink" || kind === "paper";
  for (let i = 1; i < runs.length - 1; i++) {
    const run = runs[i];
    if (!flat(run.kind) || run.height < min) continue;
    const before = runs[i - 1];
    const after = runs[i + 1];
    if (!flat(before.kind) || !flat(after.kind)) continue;
    if (before.kind === run.kind || after.kind === run.kind) continue;
    if (before.kind !== after.kind) continue;
    /*
      THE WASH IS NOT A HOLE. Its section is a viewport plus --wipe-pin tall and
      holds a position:sticky child one viewport high, so a FULL-PAGE capture
      photographs the pinned layer once and leaves the remaining viewport as
      bare section. A reader never sees it: sticky keeps the layer over the
      viewport for the whole pinned distance, and it unpins exactly as its
      bottom meets the section's. Verified by scrolling the wash in a browser at
      five positions before this exception was written — the exception is for a
      capture artefact, not for a bug that was talked out of existence.
    */
    if (skip.some(([top, bottom]) => run.from < bottom && run.to > top)) continue;
    faults.push({
      kind: "band",
      detail: `${run.height}px of flat ${run.kind} at y=${run.from} between ${before.kind} and ${after.kind}`,
    });
  }
  return {runs, faults};
}

/*
  RELOAD, AND PROVE YOU LANDED (2026-08-11).

  The initial navigation has always refused to capture when it lands off-path.
  The two pixel checks below each reload the page afterwards to undo the styles
  they inject — and those reloads had NO such guard. Across a 170-page run one
  of them came back as the site's own 404 page, and the next check dutifully
  measured the 404 page's caption and reported it as a fault on four Creature
  pages that were perfectly fine.

  A harness that silently measures the wrong page is the exact failure the
  landed-URL check exists to prevent; it was simply only applied to the first
  navigation. Every reload now asserts its status, so this becomes a refusal
  with a message instead of four phantom faults in a long log.
*/
async function reloadOrRefuse(page) {
  const res = await page.reload({waitUntil: "networkidle"});
  if (res && !res.ok()) {
    throw new Error(`reload of ${page.url()} returned ${res.status()} — refusing to measure the wrong page`);
  }
}

/*
  TEXT ON A PHOTOGRAPH, measured in pixels (2026-08-10).

  The DOM check above deliberately skips these: an overlay caption has no
  computable background, and the earlier note here said a machine could not
  second-guess the owner's per-image choice. That was wrong — a machine can do
  exactly this, and doing it found that every overlay on the home page's first
  screen sits under 2:1.

  THE METHOD, which is the whole trick: hide every overlay, photograph the bare
  picture, and measure the ground inside each overlay's box. Measuring the
  normal capture measures the caption's own glyphs and reports a confident
  1.00:1 for everything, which is what the first attempt did.

  THE MEASURE IS WORST-CASE: the ratio against whichever extreme inside the box
  is closest to the text colour. A caption crossing a photograph that is bright
  at one end and dark at the other fails here even when most of it is fine —
  which is correct, because the reader reads the whole line, and it is the same
  measure section 58 used when it found eight captions below AA.
*/
async function overlayContrast(page, sharp, tmpFile) {
  const boxes = await page.evaluate(() => {
    const out = [];
    const push = (el, label) => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      out.push({
        label,
        color: getComputedStyle(el).color,
        x: Math.round(r.x),
        y: Math.round(r.y + window.scrollY),
        w: Math.round(r.width),
        h: Math.round(r.height),
      });
    };
    for (const cap of document.querySelectorAll("figcaption")) {
      if (getComputedStyle(cap).position !== "absolute") continue;
      for (const el of cap.querySelectorAll("*")) {
        const text = [...el.childNodes]
          .filter((n) => n.nodeType === 3 && n.textContent.trim())
          .map((n) => n.textContent.trim())
          .join(" ");
        if (text) push(el, text.slice(0, 44));
      }
    }
    // The fixed chrome and the drawn mark also pass over photography.
    for (const [sel, label] of [
      ["#site-chrome .signature", "[the corner mark]"],
      [".sig-draw", "[the drawn mark]"],
    ]) {
      const el = document.querySelector(sel);
      if (el) push(el, label);
    }
    return out;
  });
  if (!boxes.length) return [];

  /*
    TRANSPARENT TEXT, NOT A HIDDEN ELEMENT (corrected 2026-08-11, section 86).

    This hid `#site-chrome` outright and then measured the pixels inside the
    mark's box. That is correct only while the chrome is nothing but glyphs —
    and it silently stops being correct the moment anything is put BEHIND the
    glyphs, because `visibility:hidden` takes the element's own background, its
    pseudo-elements and its children's backgrounds with it. Measured that way, a
    scrim and no scrim produce byte-identical numbers, and the check reports the
    naked photograph either way.

    Found while rendering scrim treatments for the very question this check
    exists to answer: gradient and plate came back to two decimal places
    identical to the baseline on four routes. A check that cannot see the fix it
    is being used to evaluate is worse than no check, because it argues against
    the fix with a number.

    Every mark here paints in `currentColor` — the signature SVG is
    `fill: currentColor` and MENU is text — so making the colour transparent
    removes exactly the glyphs and leaves every ground, plate and scrim painted.
    On today's site the two are identical, because there is nothing behind the
    glyphs to keep.
  */
  /*
    BORDERS COUNT AS THE MARK, NOT AS THE GROUND. An action on this site is a
    word with a hairline UNDER it, drawn from `var(--fg)` rather than from
    currentColor, so making the text transparent left the underline painted
    inside the measured box — and a solid line in exactly the text colour reads
    as a perfect 1.00:1. The first run of this correction invented a fault on
    "Tutte le Creature" at both widths, which is the harness lying in the
    direction of alarm rather than of comfort, and is still lying.
  */
  const HIDE_MARKS =
    "color:transparent!important;fill:transparent!important;" +
    "border-color:transparent!important;text-decoration-color:transparent!important";
  await page.addStyleTag({
    content:
      `figcaption, figcaption *{${HIDE_MARKS}}` +
      `#site-chrome, #site-chrome *{${HIDE_MARKS}}` +
      `.sig-draw, .sig-draw *{${HIDE_MARKS}}`,
  });
  await page.waitForTimeout(120);
  await page.screenshot({path: tmpFile, fullPage: true});

  const meta = await sharp(tmpFile).metadata();
  const channel = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const lum = (r, g, b) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

  const faults = [];
  for (const box of boxes) {
    const left = Math.max(0, box.x);
    const top = Math.max(0, box.y);
    const width = Math.min(box.w, meta.width - left);
    const height = Math.min(box.h, meta.height - top);
    if (width < 2 || height < 2) continue;
    const {data, info} = await sharp(tmpFile)
      .extract({left, top, width, height})
      .removeAlpha()
      .raw()
      .toBuffer({resolveWithObject: true});
    let lo = 1;
    let hi = 0;
    for (let i = 0; i < data.length; i += info.channels) {
      const l = lum(data[i], data[i + 1], data[i + 2]);
      if (l < lo) lo = l;
      if (l > hi) hi = l;
    }
    const rgb = box.color.match(/\d+/g)?.map(Number) ?? [0, 0, 0];
    const fg = lum(rgb[0], rgb[1], rgb[2]);
    const worst = Math.min(ratio(fg, lo), ratio(fg, hi));
    if (worst < 4.5) {
      /*
        IS THERE A LEGIBLE SIDE AT ALL? (2026-08-12, section 115.)

        This check used to say only that a mark failed, and every session that
        read it then had to guess between two very different problems: a frame
        whose `overlay` is simply set the wrong way round, and a frame whose box
        holds BOTH extremes so that no colour survives it. Section 87 turned on
        exactly that distinction — 71 of 97 placements had no legible side — and
        the number came from a one-off script that no longer exists.

        Rick Owens' answer to a mark on a photograph is to re-colour it for what
        it lands on (`RO01` white, `RO02` dark blue). So the useful question is
        not "did this fail" but "would the other polarity have worked", and this
        answers it in the same pass, from the same pixels, at no extra cost.

        The two candidates are the site's only two colours. There is no third
        and there is no scrim; standing rule 11 and section 86.
      */
      const paper = lum(250, 250, 248);
      const ink = lum(10, 10, 10);
      const other = Math.abs(fg - paper) < Math.abs(fg - ink) ? ink : paper;
      const otherWorst = Math.min(ratio(other, lo), ratio(other, hi));
      const verdict =
        otherWorst >= 4.5
          ? `FLIP IT: the other polarity clears at ${otherWorst.toFixed(2)}:1`
          : `NO LEGIBLE SIDE (${otherWorst.toFixed(2)}:1 the other way)`;
      faults.push({
        kind: "on-photo",
        detail: `${worst.toFixed(2)}:1 worst case — "${box.label}" — ${verdict}`,
      });
    }
  }
  await reloadOrRefuse(page);
  return faults;
}

/*
  A THIRD COLOUR (2026-08-10).

  Standing rule 11: this site is solid ink and solid paper, never a gray and
  never a hue. The one thing that can break it without appearing in any
  stylesheet is a browser DEFAULT — the order form's radio buttons were
  painting themselves in the operating system's accent blue, rgb(0,117,255), on
  the page where money changes hands, and no check the project had could see
  it: the markup was right, the contrast was fine, and a UA default is not in
  the CSS to grep for.

  Same trick as the overlay check: hide the photography, then any pixel left
  that is off the greyscale axis is a colour the brand does not have. The
  threshold is generous — antialiasing and JPEG ringing produce small channel
  spreads, and 45 is comfortably above them and far below any real hue.
*/
async function thirdColour(page, sharp, tmpFile) {
  await page.addStyleTag({content: "img,picture,video,svg{visibility:hidden!important}"});
  await page.waitForTimeout(120);
  await page.screenshot({path: tmpFile, fullPage: true});
  const {data, info} = await sharp(tmpFile).removeAlpha().raw().toBuffer({resolveWithObject: true});
  const found = new Map();
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const spread = Math.max(r, g, b) - Math.min(r, g, b);
    if (spread > 45) {
      const key = `rgb(${r}, ${g}, ${b})`;
      found.set(key, (found.get(key) ?? 0) + 1);
    }
  }
  await reloadOrRefuse(page);
  if (!found.size) return [];
  const worst = [...found.entries()].sort((a, b) => b[1] - a[1])[0];
  const total = [...found.values()].reduce((a, b) => a + b, 0);
  return [{kind: "colour", detail: `${total} pixels off the greyscale axis, mostly ${worst[0]}`}];
}

/* ------------------------------------------------------------------- shots */

async function main() {
  /*
    --origin=https://... LOOKS AT THE DEPLOYED SITE INSTEAD OF dist/ (2026-08-21).

    Everything else here captures the local build, which is the right default:
    it is fast, it needs no network and it is what you iterate against. But a
    local build is not the thing anyone visits. The redirects in
    `public/_redirects` are applied by CLOUDFLARE and do not exist in dist at
    all, Sanity content can be newer than the last local build, and a deploy can
    simply fail while the folder on this laptop looks perfect.

    So the same harness, pointed at the real origin. No local server is started
    and dist/ is not read; --weigh and the audits work exactly as before,
    against what a visitor actually gets.
  */
  const remote = ORIGIN ? ORIGIN.replace(/\/$/, "") : null;

  if (!remote && !fs.existsSync(DIST)) {
    console.error("\n  No dist/. Run `npm run build` first, or pass --origin=https://...\n");
    process.exit(1);
  }

  const {server, port} = remote ? {server: null, port: 0} : await serve();
  const origin = remote ?? `http://127.0.0.1:${port}`;
  if (remote) console.log(`\n  Looking at ${origin} — the deployed site, not dist/.`);
  const browser = await chromium.launch();
  let failures = 0;

  try {
    const all = routes();
    let list = all;
    if (ONLY) list = list.filter((r) => ONLY.includes(r));
    // Prove against a real content page, never the language redirect at "/".
    if (PROVE) list = [list.find((r) => r === "/it") ?? list.find((r) => r !== "/") ?? list[0]];

    console.log(`\n  Serving ${path.relative(ROOT, DIST)} at ${origin}`);
    console.log(`  ${list.length} routes x ${VIEWPORTS.length} widths${DARK ? " x 2 schemes" : ""}\n`);

    fs.mkdirSync(OUT, {recursive: true});

    const schemes = DARK ? ["light", "dark"] : ["light"];

    for (const scheme of schemes) {
      for (const viewport of VIEWPORTS) {
        const context = await browser.newContext({
          viewport: {width: viewport.width, height: viewport.height},
          deviceScaleFactor: 1,
          colorScheme: scheme,
          reducedMotion: "no-preference",
        });
        /*
          EVERY VISIT IS A FIRST VISIT (2026-08-12, section 92).

          The signature draws itself over the home arrival ONCE PER VISIT and
          then marks `ac-sig-drawn` in sessionStorage; on every later view the
          element is `display:none`. One browser context walks all 89 routes, so
          the ceremony happened on the FIRST home page the walk reached — `/`,
          which redirects to `/en` — and by the time `/en` came round as its own
          route there was nothing left to measure.

          The full-site audit therefore reported ZERO faults on a site whose only
          fault is that mark, while auditing `/en` alone in a fresh session
          reported it at 1.74:1 and 1.49:1. The site had not changed; the visit
          order had. A first-time reader, which is who the check is for, sees it
          every time.

          Clearing the key before the page's own scripts run makes every route a
          first visit, which is the state worth checking.
        */
        await context.addInitScript(() => {
          try {
            sessionStorage.removeItem("ac-sig-drawn");
          } catch {}
        });

        const page = await context.newPage();

        /*
          THE THROTTLE AND THE TAPE MEASURE (section 91). One CDP session for
          the page, kept for the whole run: `Network.emulateNetworkConditions`
          is what DevTools itself uses, and `encodedDataLength` on a finished
          response is the compressed bytes that actually crossed the wire —
          which is the number a visitor pays and the one `Content-Length` lies
          about for anything gzipped.
        */
        let weigh = null;
        if (WEIGH) {
          /*
            LCP HAS TO BE OBSERVED, NOT ASKED FOR. `getEntriesByType` returns
            largest-contentful-paint entries only to a page that registered a
            buffered observer; asked cold it answers zero, which is what the
            first run of this reported for every route — a measurement that
            looked like an answer and was an empty list.
          */
          await context.addInitScript(() => {
            window.__lcp = 0;
            new PerformanceObserver((list) => {
              window.__lcp = Math.round(list.getEntries().at(-1).startTime);
            }).observe({type: "largest-contentful-paint", buffered: true});
          });
          const cdp = await context.newCDPSession(page);
          await cdp.send("Network.enable");
          await cdp.send("Network.emulateNetworkConditions", {
            offline: false,
            downloadThroughput: SLOW_4G.download,
            uploadThroughput: SLOW_4G.upload,
            latency: SLOW_4G.latency,
          });
          const kinds = new Map();
          weigh = {kinds, reset: () => kinds.clear()};
          cdp.on("Network.responseReceived", (e) => {
            weigh.typeOf ??= new Map();
            weigh.typeOf.set(e.requestId, {type: e.type, url: e.response.url});
          });
          cdp.on("Network.loadingFinished", (e) => {
            const meta = weigh.typeOf?.get(e.requestId);
            if (!meta) return;
            const kind =
              meta.type === "Image"
                ? "images"
                : meta.type === "Font"
                  ? "fonts"
                  : meta.type === "Document"
                    ? "html"
                    : meta.type === "Stylesheet"
                      ? "css"
                      : meta.type === "Script"
                        ? "js"
                        : "other";
            kinds.set(kind, (kinds.get(kind) ?? 0) + e.encodedDataLength);
          });
        }

        for (const route of list) {
          const target = origin + route;
          if (weigh) weigh.reset();
          /*
            A throttled load is not a fast one: 400 kbps against a megabyte of
            photographs is minutes, not seconds, and the default 30s navigation
            timeout turned the first weighing run into a crash three routes in.
          */
          await page.goto(target, {waitUntil: "networkidle", timeout: WEIGH ? 240000 : 30000});

          if (FORCE) {
            const fg = FORCE === "dark" ? "#fafaf8" : "#0a0a0a";
            const bg = FORCE === "dark" ? "#0a0a0a" : "#fafaf8";
            const other = FORCE === "dark" ? "light" : "dark";
            await page.addStyleTag({
              content:
                `html[data-theme="${other}"], section[data-theme="${other}"], div[data-theme="${other}"], .wash-layer[data-theme="${other}"] {` +
                `--fg:${fg}!important;--bg:${bg}!important;` +
                `--hairline:color-mix(in srgb, ${fg} 20%, transparent)!important;` +
                `--focus:${fg}!important;color-scheme:${FORCE};}`,
            });
            await page.waitForTimeout(120);
          }

          /*
            THE CHROME TREATMENTS (section 86). Injected, never shipped. Each
            one is written in the site's own tokens so what is photographed is
            what the site would actually paint.
          */
          if (CHROME && CHROME !== "none") {
            const css = {
              /*
                The scrim's height is twice the chrome band, so it is finished
                before it reaches anything a reader is looking at, and its
                strongest point is 55% — the least that lifts the worst measured
                frame over 4.5:1. Its colour follows the MARK's own measured
                polarity, because a scrim under a white mark must be dark and
                under a black mark must be light.
              */
              gradient:
                `#site-chrome{position:sticky;isolation:isolate}` +
                `#site-chrome::before{content:"";position:absolute;left:0;right:0;top:0;` +
                `height:calc(var(--chrome-h)*2);z-index:-1;pointer-events:none;` +
                `background:linear-gradient(to bottom,rgba(10,10,10,.55),rgba(10,10,10,0))}` +
                `#site-chrome[data-theme="light"]::before{` +
                `background:linear-gradient(to bottom,rgba(250,250,248,.75),rgba(250,250,248,0))}`,
              /*
                WHAT IT TAKES TO ACTUALLY PASS, arrived at by arithmetic and
                then confirmed here. White text at 0.958 luminance needs the
                brightest pixel under it at or below 0.174 to reach 4.5:1, and
                veiling bright concrete (~0.95) down to that means an ink layer
                at roughly 82% — so this is 85%. It is no longer a scrim; it is
                a black bar with a soft bottom edge. Rendering it is the point:
                the "minimal" version and the version that works are not the
                same object, and only one of them is what the references do.
              */
              "gradient-strong":
                `#site-chrome{position:sticky;isolation:isolate}` +
                `#site-chrome::before{content:"";position:absolute;left:0;right:0;top:0;` +
                `height:calc(var(--chrome-h)*2);z-index:-1;pointer-events:none;` +
                `background:linear-gradient(to bottom,rgba(10,10,10,.92) 0%,rgba(10,10,10,.85) 45%,rgba(10,10,10,0) 100%)}` +
                `#site-chrome[data-theme="light"]::before{` +
                `background:linear-gradient(to bottom,rgba(250,250,248,.95) 0%,rgba(250,250,248,.9) 45%,rgba(250,250,248,0) 100%)}`,
              /*
                A plate is the chrome's own --bg, which is by definition the
                opposite of the mark it carries. Solid: no value between the two
                colours exists anywhere in this treatment.
              */
              plate:
                `#site-chrome > a, #site-chrome .menu > summary{` +
                `background:var(--bg);padding:calc(var(--s-u1)*0.75) var(--s-u2);}`,
              /*
                The chrome takes its own height in the flow — the negative margin
                that makes it an overlay is removed — and paints page ground. The
                marks are then on paper, at 19.6:1, and the photograph starts
                below them. Nothing is measured because nothing overlaps.

                THIS IS THE STUDY AGAIN, NOT THE SHIPPED STATE (2026-08-12,
                section 115). It shipped between sections 87 and 115; the chrome
                floats now, so `band` renders the alternative the owner can look
                at — which is the direction this flag pointed when it was
                written, and the reason it was kept rather than deleted when it
                won.
              */
              band:
                `#site-chrome{margin-bottom:0!important;background:var(--paper);` +
                `--fg:#0a0a0a!important;color:#0a0a0a!important}`,
              /*
                FLOAT — THE REVERSE OF WHAT SHIPPED, added 2026-08-12 (section
                111). Every treatment above was written while the chrome
                floated, to test ways of making a mark legible ON photography.
                `band` won and shipped, so all four now render either the
                current state or a scrim on top of it, and NONE of them renders
                the question the reference sites actually raise: what does this
                page look like when the photograph starts at pixel zero and the
                mark sits on it?

                This is that. The negative margin comes back, the band stops
                painting, and the mark takes paper.

                IT SHIPPED (2026-08-12, section 115), and this flag is now
                mostly redundant: the site floats by default and takes each
                image's measured `overlay` rather than forcing paper. What it
                still does that the site does not is FORCE PAPER on every route
                including the ones that open on text, which is occasionally
                useful for seeing the mark against a page it never sits on.
                To study the alternative, use `--chrome=band`.
              */
              float:
                `#site-chrome{margin-bottom:calc(var(--chrome-h) * -1)!important;` +
                `background:transparent!important;` +
                `--fg:#fafaf8!important;color:#fafaf8!important}`,
            }[CHROME];
            if (!css) throw new Error(`unknown --chrome=${CHROME} (none|gradient|plate|band|float)`);
            await page.addStyleTag({content: css});
            await page.waitForTimeout(120);
          }

          /*
            REFUSE IF WE LANDED SOMEWHERE UNINTENDED. A 404 photographs
            perfectly well and looks like a working page; so does a redirect.
            The old harness learned this the expensive way.

            An INTENDED redirect is one that lands on another route this build
            actually produced — `/` sending a reader to `/en` is the site's
            language default doing its job, and this caught it on its first run.
            That is announced and skipped, because the destination is captured
            under its own name. A landing anywhere else is a fault, and the
            harness stops rather than filling a folder with pictures of a 404.
          */
          const landed = new URL(page.url()).pathname.replace(/\/$/, "") || "/";
          const asked = route.replace(/\/$/, "") || "/";
          if (landed !== asked) {
            const known = all.some((r) => (r.replace(/\/$/, "") || "/") === landed);
            if (!known) {
              throw new Error(`asked for ${asked}, landed on ${landed} — refusing to capture`);
            }
            console.log(`  ${viewport.name.padStart(4)}  ${route} -> ${landed} (redirect, captured there)`);
            continue;
          }

          /*
            SETTLE THE PAGE BEFORE PHOTOGRAPHING IT.

            Photographs reveal on intersection and load lazily, so the page has
            to be walked before it can be captured. Walking it is not enough:
            the first version scrolled in viewport steps with a 30ms pause and
            then shot immediately, and an IntersectionObserver does not
            necessarily fire for every element at that speed. A frame that never
            got `data-revealed` stays at opacity 0, the page ground shows
            through the empty media box, and the band check reports 792px of
            flat ink between two papers — which it did, on the home page, once.
            A flaky harness that invents defects is worse than no harness.

            So: walk, then WAIT for the two things that make a frame visible —
            every image decoded, and every [data-reveal] actually marked. Both
            are polled with a ceiling, because a genuinely broken image must
            still be photographed rather than hang the run.
          */
          await page.evaluate(async () => {
            const step = window.innerHeight;
            for (let y = 0; y < document.body.scrollHeight; y += step) {
              window.scrollTo(0, y);
              await new Promise((r) => setTimeout(r, 60));
            }
            window.scrollTo(0, 0);

            const settled = () => {
              const images = [...document.images].every((i) => i.complete);
              const frames = [...document.querySelectorAll("[data-reveal]")];
              const revealed =
                !document.documentElement.hasAttribute("data-reveal-live") ||
                frames.every((f) => f.hasAttribute("data-revealed"));
              return images && revealed;
            };
            const deadline = Date.now() + 6000;
            while (!settled() && Date.now() < deadline) {
              await new Promise((r) => setTimeout(r, 100));
            }
            // one more frame for the reveal transition itself
            await new Promise((r) => setTimeout(r, 950));
          });

          if (PROVE) {
            /*
              PROVE THE AUDIT RED BEFORE TRUSTING A GREEN. Injects one of each
              fault the DOM checks can see, into a real page, and requires the
              audit to catch every one. A checker nobody has seen fail is a
              checker nobody should believe.
            */
            await page.evaluate(() => {
              const main = document.querySelector("main");
              const box = document.createElement("div");
              box.style.cssText = "position:relative;overflow:visible;width:100px;background:#0a0a0a";
              const spill = document.createElement("p");
              spill.id = "prove-spill";
              spill.textContent = "spill";
              spill.style.cssText = "width:400px";
              const faint = document.createElement("p");
              faint.id = "prove-contrast";
              faint.textContent = "unreadable";
              faint.style.cssText = "color:#111111;background:#0a0a0a";
              const wide = document.createElement("div");
              wide.id = "prove-overflow";
              wide.style.cssText = "width:200vw;height:4px";
              box.append(spill, faint);
              main.append(box, wide);
            });
            const faults = await page.evaluate(AUDIT_SCRIPT);
            const kinds = new Set(faults.map((f) => f.kind));
            const wanted = ["overflow", "spill", "contrast"];
            const missed = wanted.filter((k) => !kinds.has(k));
            console.log(`  PROVE on ${route} @${viewport.name}`);
            for (const k of wanted) {
              console.log(`    ${missed.includes(k) ? "NOT CAUGHT" : "caught    "}  ${k}`);
            }
            // and the pixel check, on a synthetic column
            const fake = Buffer.alloc(3 * 900);
            const paint = (from, to, v) => { for (let y = from; y < to; y++) { fake[y*3]=v; fake[y*3+1]=v; fake[y*3+2]=v; } };
            paint(0, 300, 250); paint(300, 600, 10); paint(600, 900, 250);
            const {faults: band} = bandsFromColumn([fake, fake, fake], 900, 844);
            console.log(`    ${band.length ? "caught    " : "NOT CAUGHT"}  band`);
            if (missed.length || !band.length) {
              throw new Error("the audit failed to go red on an injected defect — do not trust its greens");
            }
            console.log("\n  The audit goes red on every defect it claims to catch.\n");
            return;
          }

          const dir = path.join(
            OUT,
            CHROME && CHROME !== "none"
              ? `chrome-${CHROME}`
              : FORCE
                ? `force-${FORCE}`
                : scheme === "dark"
                  ? "dark"
                  : "light",
            viewport.name,
          );
          fs.mkdirSync(dir, {recursive: true});
          const name = (route === "/" ? "root" : route.slice(1).replace(/\//g, "_")) + ".png";
          const file = path.join(dir, name);
          await page.screenshot({path: file, fullPage: true});

          /*
            --slice=N CUTS A CAPTURE INTO SCREENS YOU CAN ACTUALLY LOOK AT
            (2026-08-13, section 108).

            A full-page capture of /new at 1920 is 20,826 pixels tall. Opened or
            pasted whole it is downscaled to a thumbnail, and every judgement
            made from it is a judgement about a thumbnail — which is how a
            design pass gets "verified" without anyone seeing the page. Slicing
            it into N strips at a readable width is the difference between
            reading the site and glancing at it.

            IT IS A FLAG ON THIS TOOL RATHER THAN A SCRIPT BESIDE IT because
            three looking-tools have now died in temporary folders and each
            death cost a real defect (see the header). The fourth was written in
            this session, at the repository root, and was folded in here rather
            than left to be deleted by the next tidy-up.
          */
          if (SLICE > 1) {
            const {default: sharp} = await import("sharp");
            const meta = await sharp(file).metadata();
            const step = Math.floor(meta.height / SLICE);
            const outDir = path.join(dir, name.replace(/\.png$/, ""));
            fs.mkdirSync(outDir, {recursive: true});
            for (let i = 0; i < SLICE; i++) {
              const top = i * step;
              await sharp(file)
                .extract({
                  left: 0,
                  top,
                  width: meta.width,
                  height: i === SLICE - 1 ? meta.height - top : step,
                })
                .resize({width: 820})
                .toFile(path.join(outDir, `${String(i).padStart(2, "0")}.png`));
            }
          }

          let line = `  ${viewport.name.padStart(4)}  ${route}`;

          if (weigh) {
            const paint = await page.evaluate(() => ({
              fcp: Math.round(performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0),
              lcp: window.__lcp ?? 0,
            }));
            const kb = (n) => (n / 1024).toFixed(0).padStart(5);
            const total = [...weigh.kinds.values()].reduce((a, b) => a + b, 0);
            line +=
              `\n        ${kb(total)} KB total —` +
              ` html ${kb(weigh.kinds.get("html") ?? 0)}` +
              ` css ${kb(weigh.kinds.get("css") ?? 0)}` +
              ` fonts ${kb(weigh.kinds.get("fonts") ?? 0)}` +
              ` images ${kb(weigh.kinds.get("images") ?? 0)}` +
              ` js ${kb(weigh.kinds.get("js") ?? 0)}` +
              `\n        FCP ${paint.fcp}ms   LCP ${paint.lcp}ms   (400 kbps, 400ms RTT)`;
          }

          if (RHYTHM) {
            const sections = await page.evaluate(() => {
              const out = [];
              for (const el of document.querySelectorAll("main > *")) {
                const box = el.getBoundingClientRect();
                if (box.height < 40) continue;
                /*
                  The content's own extent: the union of every leaf that paints
                  something — text, a photograph, a rule. Padding and empty
                  flex space fall outside it, which is exactly what is being
                  measured.
                */
                let top = Infinity;
                let bottom = -Infinity;
                for (const node of el.querySelectorAll("p, h1, h2, h3, a, span, img, video, li, input, button, textarea, label")) {
                  const r = node.getBoundingClientRect();
                  if (r.height < 2 || r.width < 2) continue;
                  top = Math.min(top, r.top);
                  bottom = Math.max(bottom, r.bottom);
                }
                const content = bottom > top ? bottom - top : 0;
                const label = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 34) || el.className.slice(0, 34);
                out.push({label, height: Math.round(box.height), content: Math.round(content)});
              }
              return out;
            });

            /*
              A PAIRED SECTION READS 0% EMPTY AND ITS TEXT HALF CAN STILL BE
              MOSTLY AIR (2026-08-13, section 108).

              The measure above takes the union of every painting leaf inside a
              section. Since the photograph fills its half edge to edge, that
              union is the whole box, so every paired composition on the site
              now reports 0px empty however little the passage says. It is
              exactly section 5's trap: two questions — "is this section empty?"
              and "is the TEXT in this section adrift in it?" — that had the
              same answer for as long as the picture was shorter than the row,
              and stopped having it the day that changed.

              So the halves are measured separately. `gap` is the row height
              less the passage's own height: the padding is in it deliberately
              (192px at every desktop width, u8 top and bottom), so anything
              much above that is the floor holding a short passage open, and
              that is the number to argue about.
            */
            const halves = await page.evaluate(() => {
              const out = [];
              for (const sec of document.querySelectorAll(".paired")) {
                const inner = sec.querySelector(".paired-inner");
                if (!inner) continue;
                const row = Math.round(sec.getBoundingClientRect().height);
                const media = sec.querySelector(".paired-media");
                const text = Math.round(inner.getBoundingClientRect().height);
                out.push({
                  row,
                  text,
                  media: media ? Math.round(media.getBoundingClientRect().height) : 0,
                  label: (inner.textContent || "").trim().replace(/\s+/g, " ").slice(0, 30),
                });
              }
              return out;
            });
            let air = 0;
            let tall = 0;
            const lines = [];
            for (const s of sections) {
              const empty = Math.max(0, s.height - s.content);
              air += empty;
              tall += s.height;
              const share = s.height > 0 ? empty / s.height : 0;
              lines.push(
                `        ${String(s.height).padStart(5)}px  content ${String(s.content).padStart(5)}px` +
                  `  empty ${String(empty).padStart(5)}px (${(share * 100).toFixed(0)}%)  ${s.label}`,
              );
            }
            console.log(`  ${viewport.name.padStart(4)}  ${route}`);
            for (const l of lines) console.log(l);
            for (const h of halves) {
              /*
                The photograph must equal the row: it is absolutely positioned
                so it cannot set the height, and if it ever differs from the row
                the composition has a hole in it again. Printed rather than
                assumed, because that is the fault section 108 fixed and the one
                most likely to come back.
              */
              const holed = h.media !== h.row ? `  MEDIA ${h.media} != ROW` : "";
              console.log(
                `        paired  row ${String(h.row).padStart(5)}px  text ${String(h.text).padStart(5)}px` +
                  `  gap ${String(h.row - h.text).padStart(5)}px${holed}  ${h.label}`,
              );
            }
            console.log(
              `        TOTAL ${tall}px, ${air}px empty = ${((air / Math.max(tall, 1)) * 100).toFixed(0)}%` +
                `, ${(air / viewport.height).toFixed(1)} screens\n`,
            );
          }

          if (AUDIT) {
            const faults = await page.evaluate(AUDIT_SCRIPT);

            // the pixel band check, from the capture we just took
            const {default: sharp} = await import("sharp");
            const img = sharp(file);
            const meta = await img.metadata();
            const xs = [3, Math.round(meta.width / 2), meta.width - 4];
            const cols = [];
            for (const x of xs) {
              cols.push(
                await sharp(file)
                  .extract({left: x, top: 0, width: 1, height: meta.height})
                  .removeAlpha()
                  .raw()
                  .toBuffer(),
              );
            }
            // Where the wash pins: its remainder is a capture artefact, not a hole.
            const washRanges = await page.evaluate(() =>
              [...document.querySelectorAll('[data-wash]')].map((w) => {
                const r = w.getBoundingClientRect();
                return [r.top + window.scrollY, r.bottom + window.scrollY];
              }),
            );
            const {faults: bandFaults} = bandsFromColumn(cols, meta.height, viewport.height, washRanges);

            // Runs LAST: it hides the overlays and reloads, so nothing after it
            // may depend on the page's state.
            const photoFaults = await overlayContrast(page, sharp, path.join(OUT, ".bare.png"));
            const colourFaults = await thirdColour(page, sharp, path.join(OUT, ".nomedia.png"));

            const all = [...faults, ...bandFaults, ...photoFaults, ...colourFaults];
            if (all.length) {
              failures += all.length;
              line += `   ${all.length} FAULT${all.length > 1 ? "S" : ""}`;
              console.log(line);
              for (const f of all) console.log(`        ${f.kind.padEnd(9)} ${f.detail}`);
              continue;
            }
          }
          console.log(line);
        }

        await context.close();
      }
    }

    if (AUDIT && !PROVE) {
      console.log(
        failures
          ? `\n  ${failures} faults. Shots are in ${path.relative(ROOT, OUT)}/ — go and look at them.\n`
          : `\n  No faults the machine can see. That is not the same as looking. Shots are in ${path.relative(ROOT, OUT)}/.\n`,
      );
    } else if (!PROVE) {
      console.log(`\n  Shots in ${path.relative(ROOT, OUT)}/. GO AND LOOK AT THEM.\n`);
    }
  } finally {
    await browser.close();
    server?.close();
  }

  if (AUDIT && failures) process.exit(1);
}

await main();
