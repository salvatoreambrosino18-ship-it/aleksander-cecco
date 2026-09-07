/*
  DID THE BUILD ACTUALLY BUILD THE SITE?

    node scripts/verify-build.mjs      (runs automatically after `npm run build`)

  WHY THIS EXISTS (section 78). On 2026-08-10 a block comment inside a GROQ
  projection made every query throw. `query()` is written never to fail a build
  — deliberately, so the frame renders before the owner has published anything
  and a build survives an offline laptop — so every page rendered from
  placeholders instead. The home page shipped `{OPENING_PHOTOGRAPH}`.

  The build printed a wall of green, said "Complete!", and exited zero.

  **A whole site built from placeholders is indistinguishable from a correct
  build by every signal except looking at the content.** Not the exit code, not
  the page count, not the asset list, not the file sizes. The warnings scroll
  past above the success line and nobody reads upward from a green.

  Two checks, both cheap, both loud:

    1. DID ANY QUERY THROW? The precise signal. `query()` appends to
       .sanity-failures.log; anything in it is a fault, because a thrown query
       is never the intended path — the intended path is a query that succeeds
       and returns nothing.

    2. DOES THE OUTPUT CONTAIN THE OWNER'S PHOTOGRAPHS? The broad signal, which
       catches the same disaster arriving by a route nobody predicted. This site
       is photographs; a dist/ with no image on the CDN is not this site,
       whatever the reason.

  Neither check knows anything about GROQ comments. That is the point: the next
  version of this failure will not be a comment.

  (And note what happened while this file was being written: the sentence above
  originally quoted the offending comment syntax literally, which closed THIS
  file's own block comment early and made it a syntax error. The class of bug is
  not exotic. It is one character sequence in the wrong string.)
*/
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const FAILURE_LOG = path.join(ROOT, ".sanity-failures.log");

const problems = [];

/* 1. the precise signal */
if (fs.existsSync(FAILURE_LOG)) {
  const log = fs.readFileSync(FAILURE_LOG, "utf8").trim();
  if (log) {
    problems.push(
      `A Sanity query FAILED during this build, so pages rendered from placeholders:\n\n${log
        .split("\n")
        .map((l) => `      ${l}`)
        .join("\n")}`,
    );
  }
}

/* 2. the broad signal */
if (!fs.existsSync(DIST)) {
  problems.push("There is no dist/. The build did not produce a site.");
} else {
  let pages = 0;
  let withPhotographs = 0;
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith(".html")) {
        pages++;
        if (fs.readFileSync(p, "utf8").includes("cdn.sanity.io/images/")) withPhotographs++;
      }
    }
  };
  walk(DIST);

  if (pages === 0) {
    problems.push("dist/ contains no HTML at all.");
  } else if (withPhotographs === 0) {
    problems.push(
      `${pages} pages built and NOT ONE references a photograph on the CDN.\n` +
        "      This site is photographs. That is a site built from placeholders.",
    );
  }
}

/*
  3. DOES THE BANNER PROMISE THE NUMBER THE TILL CHARGES?

  The free-shipping threshold exists twice and cannot exist once. The code's
  copy is in src/lib/shipping.ts and reaches the payment endpoint through
  /order-catalogue.json. The other is a SENTENCE THE OWNER WRITES, in Sanity,
  in his own words, in two languages — and he can change it from his phone.

  Nothing links them. If he ever types 400 into that sentence, the banner on
  every page promises free shipping over 400 and the checkout goes on charging
  under 500, and no test, no type and no exit code notices: the site builds
  green and lies on every page. That is precisely the failure the top of this
  file was written about, arriving by a different road.

  So this reads the number the build actually shipped, out of the catalogue, and
  the sentence the build actually rendered, out of the banner, and refuses when
  they name different figures.

  IT DOES NOT REQUIRE HIM TO MENTION A NUMBER AT ALL. A sentence with no digits
  in it is vaguer, not wrong, and he is allowed to write one. What he is not
  allowed to do is publish a DIFFERENT number from the one the shop charges,
  because that is a promise the shop will not keep.
*/
const CATALOGUE = path.join(DIST, "order-catalogue.json");
let checked = null;
if (fs.existsSync(CATALOGUE) && fs.existsSync(DIST)) {
  let threshold = null;
  try {
    threshold = JSON.parse(fs.readFileSync(CATALOGUE, "utf8"))?.shipping?.freeFrom ?? null;
  } catch {
    threshold = null;
  }

  if (typeof threshold !== "number") {
    problems.push(
      "order-catalogue.json carries no shipping.freeFrom, so /api/checkout has no\n" +
        "      threshold to price against and would refuse every card order.",
    );
  } else {
    /*
      IT LOOKS FOR THE BANNER RATHER THAN ASSUMING WHERE IT IS, AND SAYS SO WHEN
      IT CANNOT FIND ONE.

      The first version of this check read dist/<lang>/index.html and moved on
      quietly if the banner was not in it. The banner is not in it: the home page
      opens on a full-bleed photograph and suppresses the chrome, so the element
      only exists on the other ninety pages. The check therefore passed every
      build without ever having looked at anything — a guard that reports
      success because it failed to run, which is the exact shape of the fault
      the top of this file exists to catch. It was found by deliberately
      breaking the banner and watching nothing happen.

      So: the pages are searched, and finding NO banner is itself a problem.
    */
    const banners = new Map();
    for (const lang of ["it", "en"]) {
      const dir = path.join(DIST, lang);
      if (!fs.existsSync(dir)) continue;
      const seek = (d) => {
        for (const entry of fs.readdirSync(d, {withFileTypes: true})) {
          if (banners.has(lang)) return;
          const f = path.join(d, entry.name);
          if (entry.isDirectory()) seek(f);
          else if (entry.name.endsWith(".html")) {
            const hit = /class="[^"]*banner-line[^"]*"[^>]*>([^<]*)</.exec(fs.readFileSync(f, "utf8"));
            if (hit) banners.set(lang, {sentence: hit[1].trim(), where: path.relative(DIST, f)});
          }
        }
      };
      seek(dir);

      const found = banners.get(lang);
      if (!found) {
        problems.push(
          `No ${lang.toUpperCase()} shipping banner was found in any built page, so the\n` +
            "      promise the shop makes about free shipping could not be checked against the\n" +
            `      ${threshold} the checkout charges by. Either the banner was removed on purpose\n` +
            "      and this check should go with it, or it stopped rendering and nobody noticed.",
        );
        continue;
      }

      const wrong = (found.sentence.match(/\d+/g) ?? []).filter((n) => Number(n) !== threshold);
      if (wrong.length > 0) {
        problems.push(
          `The ${lang.toUpperCase()} banner names ${wrong.join(", ")} and the shop charges by ${threshold}.\n` +
            `      It reads: "${found.sentence}" (${found.where})\n` +
            "      That sentence is his, in Sanity under Spedizione gratuita. Either it says\n" +
            `      ${threshold}, or src/lib/shipping.ts changes to agree with it. A banner that\n` +
            "      promises one number while the checkout charges by another is a promise the\n" +
            "      shop breaks on every order between the two.",
        );
      }
    }
    checked = threshold;
  }
}

if (problems.length) {
  console.error("\n  THE BUILD COMPLETED AND THE SITE IS WRONG.\n");
  for (const problem of problems) console.error(`    - ${problem}\n`);
  console.error("  Nothing has been deployed. Fix the cause, do not delete the log.\n");
  process.exit(1);
}

/* A green line that names what it looked at. "Passed" without a number is how
   the banner check spent its first build verifying nothing. */
console.log(
  `  verify-build: queries clean, photographs present, banner and checkout agree on ${
    checked ?? "?"
  }.`,
);
