/*
  THE LOOKING HARNESS.

    npm run shots                capture every route, both languages, 390 + 1440
    npm run shots -- --audit     capture AND run the checks; exits non-zero on a fault
    npm run shots -- --prove     prove the audit can go red, then stop
    npm run shots -- --only=/it/contact,/it   just these routes
    npm run shots -- --dark      also capture with prefers-color-scheme: dark

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

const AUDIT = flag("audit") || flag("prove");
const PROVE = flag("prove");
const DARK = flag("dark");
const ONLY = value("only")?.split(",").map((s) => s.trim()).filter(Boolean) ?? null;

/*
  The two widths the site is designed against (DESIGN-PLAN section 14): a phone
  at 390 and a desktop at 1440. Not a sweep — these are the two the references
  were measured at, and a number nobody measured is a number nobody can judge.
*/
const VIEWPORTS = [
  {name: "390", width: 390, height: 844},
  {name: "1440", width: 1440, height: 900},
];

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
      [".sig-arrival .sig-draw", "[the drawn mark]"],
    ]) {
      const el = document.querySelector(sel);
      if (el) push(el, label);
    }
    return out;
  });
  if (!boxes.length) return [];

  await page.addStyleTag({
    content:
      "figcaption{visibility:hidden!important}#site-chrome{visibility:hidden!important}.sig-arrival{visibility:hidden!important}",
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
      faults.push({
        kind: "on-photo",
        detail: `${worst.toFixed(2)}:1 worst case — "${box.label}"`,
      });
    }
  }
  await page.reload({waitUntil: "networkidle"});
  return faults;
}

/* ------------------------------------------------------------------- shots */

async function main() {
  if (!fs.existsSync(DIST)) {
    console.error("\n  No dist/. Run `npm run build` first.\n");
    process.exit(1);
  }

  const {server, port} = await serve();
  const origin = `http://127.0.0.1:${port}`;
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
        const page = await context.newPage();

        for (const route of list) {
          const target = origin + route;
          await page.goto(target, {waitUntil: "networkidle"});

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

          // Photographs reveal on intersection; scroll the page so every frame
          // has been seen before the full-page capture, then return to the top.
          await page.evaluate(async () => {
            const step = window.innerHeight;
            for (let y = 0; y < document.body.scrollHeight; y += step) {
              window.scrollTo(0, y);
              await new Promise((r) => setTimeout(r, 30));
            }
            window.scrollTo(0, 0);
            await new Promise((r) => setTimeout(r, 120));
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

          const dir = path.join(OUT, scheme === "dark" ? "dark" : "light", viewport.name);
          fs.mkdirSync(dir, {recursive: true});
          const name = (route === "/" ? "root" : route.slice(1).replace(/\//g, "_")) + ".png";
          const file = path.join(dir, name);
          await page.screenshot({path: file, fullPage: true});

          let line = `  ${viewport.name.padStart(4)}  ${route}`;

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

            const all = [...faults, ...bandFaults, ...photoFaults];
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
    server.close();
  }

  if (AUDIT && failures) process.exit(1);
}

await main();
