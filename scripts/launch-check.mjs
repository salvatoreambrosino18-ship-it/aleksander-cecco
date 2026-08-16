/*
  THE LAUNCH GATE.

    npm run launch-check

  The site deliberately shows a visitor nothing about what is unapproved: braces
  and "unapproved draft" marks make a real brand look like a rehearsal, so
  everything missing was written to be plausible and flagged instead of shown
  (DESIGN-PLAN section 59).

  This is the other half of that bargain, and without it the bargain is a lie.
  It reads the live dataset and REFUSES while anything invented is still there.
  Nothing invented can quietly become permanent, because the checklist cannot be
  completed until this exits zero.

  It does not talk to Cloudflare or Resend, and it cannot see whether a lawyer
  has written a privacy notice. Those are on the checklist and they need a human.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const project = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET;
const api = process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01";

const query = /* groq */ `{
  "creature": *[_type == "garment" && count(inventedFields) > 0] | order(orderRank asc){
    "slug": slug.current, name, inventedFields
  },
  "copy": *[_id == "siteSettings"][0].inventedCopy,
  "provisional": *[_type == "garment" && count(media[isProvisional == true]) > 0]{"slug": slug.current},
  // The same flag, on the site's own media rather than a garment's. The one
  // video on /process is a 464px messaging-app copy shipped provisionally
  // (section 93), and this gate is where "replace it before launch" has to
  // live: a note in a plan is a note, and this refuses.
  "provisionalSite": *[_id == "siteSettings"][0]{
    "where": [
      {"slot": "processMedia", "n": count(processMedia[isProvisional == true])},
      {"slot": "makingMedia", "n": count(makingMedia[isProvisional == true])},
      {"slot": "aboutMedia", "n": count(aboutMedia[isProvisional == true])},
      {"slot": "openingMedia", "n": select(openingMedia.isProvisional == true => 1, 0)}
    ]
  },
  "draftAlt": count(*[_type == "garment"].media[altIsDraft == true]),
  // Detail crops imported with the caption left empty on purpose (section 88).
  // The picture is ours to cut; the sentence under it is his to write.
  "awaitingCaption": *[_type == "garment" && count(media[needsCaption == true]) > 0]
    | order(orderRank asc){"slug": slug.current, name,
      "details": media[needsCaption == true].alt.it},
  // A piece whose PRICE is absent rather than invented. See the note below:
  // the gate counted what we made up and not what is missing. Measurements are
  // deliberately NOT part of this any more — section 101 made them reference
  // information rather than fit information, so a piece without them is
  // complete and its row simply does not render.
  "hollow": *[_type == "garment" && defined(slug.current) && count(media) > 0
              && !(coalesce(availability, "readyNow") in ["notOffered", "privateOrder"])
              && !defined(price)]{"slug": slug.current, name},
  // A purchasable piece whose SIZES nobody has decided (section 101). Ticking
  // ONE SIZE is a decision; an empty list is not, and the two must not look
  // the same to anything that reads this dataset.
  "unsized": *[_type == "garment" && defined(slug.current) && count(media) > 0
               && !(coalesce(availability, "readyNow") in ["notOffered", "privateOrder"])
               && count(coalesce(sizes, [])) == 0]
              | order(orderRank asc){"slug": slug.current, name},
  "contact": *[_id == "siteSettings"][0].contactEmail,
}`;

const url = `https://${project}.api.sanity.io/v${api}/data/query/${dataset}?query=${encodeURIComponent(query)}`;
const {result} = await (await fetch(url)).json();

const problems = [];

for (const c of result.creature ?? []) {
  problems.push(`${(c.name ?? c.slug).padEnd(20)} invented: ${c.inventedFields.join(", ")}`);
}
for (const key of result.copy ?? []) {
  problems.push(`site settings         invented copy: ${key}`);
}
for (const p of result.provisional ?? []) {
  problems.push(`${p.slug.padEnd(20)} still using a provisional photograph`);
}
for (const {slot, n} of result.provisionalSite?.where ?? []) {
  if (n > 0) {
    problems.push(`site settings         ${n} provisional frame(s) in ${slot} — replace before launch`);
  }
}
/*
  MISSING IS NOT THE SAME AS INVENTED, and this gate only counted one of them
  (2026-08-11, section 80).

  Every check above asks "is this value ours rather than his?". None of them
  asked "is this value there at all?" — because everything seeded had been given
  a plausible invented value, so the two questions had the same answer for
  months. Rubedo broke that: it returned to the catalogue with no price and no
  measurements, nothing to flag as invented, and shipped `{PRICE_EUR}` and
  `{MEASUREMENTS}` onto a live page that carries a buy action, while this
  command said everything was accounted for.

  A visible placeholder is the exact failure the whole invisible-and-flagged
  bargain exists to prevent, so it belongs here rather than in a comment.

  CORRECTED 2026-08-16 (section 130), AND IT WAS CRYING WOLF ON FOURTEEN OF ITS
  OWN FIFTY-NINE ITEMS. The rule asked for a price OR measurements, and since
  section 101 deleted the invented measurement sets there is exactly ONE piece
  left with any — so it fired on fourteen pieces, thirteen of which have a
  price, and told the reader each one "shows a placeholder".

  IT DOES NOT. Section 127 stopped rendering the tokens to visitors; the built
  HTML contains no `{...}` anywhere, which was checked rather than assumed. So
  a quarter of this gate's output was a sentence that was false about the site,
  in a command whose entire value is that it can be believed. A gate nobody
  believes is the same as no gate, which is the lesson the hourly video job had
  already taught this repository the same day.

  What it asks now is the question that still matters: a piece a visitor can
  ORDER, with no price. That one is real — the Acquire line renders with no
  figure and the piece cannot go in a cart at all.
*/
for (const g of result.hollow ?? []) {
  problems.push(`${(g.name ?? g.slug).padEnd(20)} can be ordered and has NO PRICE — set one, or withdraw it`);
}
/*
  A DETAIL FRAME WITH NO SENTENCE UNDER IT (2026-08-11, section 88).

  Thirteen construction crops were cut from his own files and imported with an
  EMPTY caption, because the picture was ours to cut and the sentence is his.
  An empty caption cannot be told from a caption nobody wanted, so the import
  marks these `needsCaption` and they are named here one by one.
*/
for (const g of result.awaitingCaption ?? []) {
  for (const detail of g.details ?? []) {
    problems.push(`${(g.name ?? g.slug).padEnd(20)} detail awaiting his sentence: ${detail}`);
  }
}

/*
  NOBODY HAS CHOSEN THIS PIECE'S SIZES (2026-08-12, section 101). Ticking ONE
  SIZE is an answer; an empty list is the absence of one, and a shop that lets a
  buyer order without either is a shop that cannot make what was ordered.
*/
for (const g of result.unsized ?? []) {
  problems.push(`${(g.name ?? g.slug).padEnd(20)} has no sizes chosen — tick sizes or ONE SIZE in the studio`);
}

/*
  THE MEASUREMENT GATE LASTED ONE SESSION (2026-08-12, sections 100 and 101).

  It refused any purchasable Creature without published measurements, and it was
  right for the eight hours in which a buyer received the object in the
  photograph. The owner's third answer to the sizing question removed the reason:
  the buyer chooses a size and he makes the piece in it, so measurements stopped
  being fit information and the fifteen invented sets were deleted rather than
  left flagged for ever.

  Recorded rather than quietly dropped, because the check itself was correct and
  the lesson is about building thin (section 100), not about being wrong.
*/

console.log(`\nLaunch check: ${project}/${dataset}\n`);

if (result.draftAlt) {
  // Not a blocker: generated alt text that nobody has read is better than none,
  // and section 17 settled that deliberately. Worth knowing before launch.
  console.log(`  note: ${result.draftAlt} images carry alt text no human has approved\n`);
}

if (problems.length === 0) {
  console.log("  Nothing invented is left in the dataset.");
  console.log("  This does NOT mean the site can launch: the legal group and the");
  console.log("  service wiring are on the checklist at the top of DESIGN-PLAN.md");
  console.log("  and neither is visible from here.\n");
  process.exit(0);
}

console.log(`  ${problems.length} things are still ours rather than his:\n`);
for (const p of problems) console.log(`    ${p}`);
console.log(`
  Every one of these is invisible to a visitor by design, which is exactly why
  this refuses. Clear each flag in the studio as the real value replaces it.
`);
process.exit(1);
