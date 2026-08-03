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
  "draftAlt": count(*[_type == "garment"].media[altIsDraft == true]),
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
if (result.customs !== false) {
  problems.push("site settings         the customs line is still unconfirmed");
}
if (!result.contact || /@example\./i.test(result.contact)) {
  problems.push("site settings         the contact address is a placeholder");
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
