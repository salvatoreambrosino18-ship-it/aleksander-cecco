/*
  End-to-end check of: publish in Sanity -> Sanity webhook -> Cloudflare deploy
  hook -> build -> live site.

    node scripts/verify-webhook.mjs

  It never reads, prints, or calls CLOUDFLARE_DEPLOY_HOOK_URL. It only publishes
  a change and then watches the live site, which is the honest test: if the
  marker appears, every link in the chain worked. Calling the hook directly
  would prove only that Cloudflare builds, not that Sanity asks it to.

  It changes one placeholder field on the seed collection to a unique marker,
  waits for the marker to appear live, then puts the field back and waits again.
  Two builds out of the 500 a month. The dataset ends exactly as it started.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const SITE = process.argv[2] || "https://aleksander-cecco.pages.dev";
const COLLECTION_ID = "seed-collection-uno";
const ORIGINAL = "{SEASON}";
const MARKER = "{SEASON}-CHAIN-TEST";
const TIMEOUT_MS = 15 * 60 * 1000;
const POLL_MS = 20000;

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  useCdn: false,
});

async function liveContains(needle) {
  const res = await fetch(`${SITE}/it/`, {cache: "no-store", headers: {"Cache-Control": "no-cache"}});
  const html = await res.text();
  return html.includes(needle);
}

async function waitFor(needle, label) {
  const started = Date.now();
  process.stdout.write(`  waiting for ${label} on ${SITE}/it/ `);
  while (Date.now() - started < TIMEOUT_MS) {
    if (await liveContains(needle)) {
      const secs = Math.round((Date.now() - started) / 1000);
      console.log(`\n  FOUND after ${secs}s`);
      return secs;
    }
    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, POLL_MS));
  }
  console.log("\n  TIMED OUT");
  return null;
}

console.log("Chain test: Sanity publish -> webhook -> deploy hook -> build -> live\n");

console.log(`1. publishing season = "${MARKER}"`);
await client.patch(COLLECTION_ID).set({season: MARKER}).commit();
const appeared = await waitFor(MARKER, "the marker");

console.log(`\n2. restoring season = "${ORIGINAL}"`);
await client.patch(COLLECTION_ID).set({season: ORIGINAL}).commit();
const restored = await waitFor(`>${ORIGINAL}<`, "the original value");

console.log("\nResult:");
console.log(`  publish -> live:  ${appeared === null ? "FAILED (timed out)" : `${appeared}s`}`);
console.log(`  restore -> live:  ${restored === null ? "FAILED (timed out)" : `${restored}s`}`);
console.log(
  appeared !== null && restored !== null
    ? "  CHAIN WORKS, twice, and the dataset is back to where it started."
    : "  CHAIN INCOMPLETE. Check the Sanity webhook (sanity.io/manage > API > Webhooks)\n" +
      "  for delivery attempts and their response codes, and the Pages build log.",
);
process.exit(appeared !== null && restored !== null ? 0 : 1);
