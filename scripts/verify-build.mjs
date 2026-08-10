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

if (problems.length) {
  console.error("\n  THE BUILD COMPLETED AND THE SITE IS WRONG.\n");
  for (const problem of problems) console.error(`    - ${problem}\n`);
  console.error("  Nothing has been deployed. Fix the cause, do not delete the log.\n");
  process.exit(1);
}

console.log("  verify-build: queries clean, photographs present.");
