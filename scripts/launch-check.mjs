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
  // A piece whose price or measurements are ABSENT rather than invented. See
  // the note below: the gate counted what we made up and not what is missing.
  "hollow": *[_type == "garment" && defined(slug.current) && count(media) > 0
              && (!defined(price) || !defined(measurements))]{"slug": slug.current, name},
  // EVERY PURCHASABLE PIECE MUST PUBLISH ITS OWN MEASUREMENTS (section 98).
  // The owner removed made to measure: a Creature is now an object that exists
  // and is bought as it is, so its measurements stopped being context and
  // became the only way a buyer can know whether it fits. Nobody spends four
  // figures on a leather shirt on faith. notOffered and privateOrder are exempt:
  // they cannot be bought, so there is nothing to fit.
  // NO BACKTICKS IN HERE. This is a template literal, so one backtick in a
  // comment ends the string. It is the second time in two days (content.ts,
  // 2026-08-11) and the first time it took a while to see, because the error
  // points at whatever word follows the backtick.
  "unmeasured": *[_type == "garment" && defined(slug.current) && count(media) > 0
                  && !(coalesce(availability, "readyNow") in ["notOffered", "privateOrder"])
                  && (!defined(measurements) || measurements == "")]
                 | order(orderRank asc){"slug": slug.current, name,
                   "state": coalesce(availability, "readyNow")},
  "contact": *[_id == "siteSettings"][0].contactEmail,
  "customs": *[_id == "siteSettings"][0].shippingCustomsIsProvisional
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
*/
for (const g of result.hollow ?? []) {
  problems.push(`${(g.name ?? g.slug).padEnd(20)} has no price or no measurements — the page shows a placeholder`);
}
/*
  MEASUREMENTS ARE NOT OPTIONAL ANY MORE (2026-08-12, section 98).

  While the shop sold made to measure, a piece's measurements described the
  photographed sample and were context: useful, and survivable if missing. The
  owner has removed made to measure, so every Creature is the object that will
  arrive — and a buyer four figures deep has no other way to know whether it
  fits. There are no sizes on this site by his own decision (section 17), which
  means these numbers are the ONLY fit information that exists.

  This is deliberately louder than the `hollow` check above, which catches a
  page rendering a visible {MEASUREMENTS} placeholder. This one catches the
  quieter case: a purchasable piece whose page simply says nothing about size.
*/
for (const g of result.unmeasured ?? []) {
  problems.push(
    `${(g.name ?? g.slug).padEnd(20)} is for sale with NO MEASUREMENTS (${g.state}) — a buyer cannot tell if it fits`,
  );
}
if (result.customs !== false) {
  problems.push("site settings         the customs line is still unconfirmed");
}
if (!result.contact || /@example\./i.test(result.contact)) {
  problems.push("site settings         the contact address is a placeholder");
}
/*
  A DETAIL FRAME WITH NO SENTENCE UNDER IT (2026-08-11, section 88).

  Forty-one frames in the dataset carried a construction detail croppable at the
  size this site already publishes, so thirteen were cut and imported — the
  scar-stitch, the hole in the back, the seams, the zips, the hems, and his own
  handwriting inside Rubedo's collar. Every one went in with an EMPTY caption,
  because the picture was ours to cut and the sentence is his to write.

  An empty caption cannot be told from a caption nobody wanted: most frames on
  this site have none and should have none. So the import marks these
  `needsCaption`, and they are named here one by one, because a gap that lives
  only in a chat message is a gap this project loses (section 84).
*/
for (const g of result.awaitingCaption ?? []) {
  for (const detail of g.details ?? []) {
    problems.push(`${(g.name ?? g.slug).padEnd(20)} detail awaiting his sentence: ${detail}`);
  }
}

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
