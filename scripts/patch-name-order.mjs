/*
  ONE PATCH: Ciro Cecco before Ferdinando Palmieri (owner's request,
  2026-08-04). The order sits INSIDE an approved sentence, so the edit is
  FLAGGED as `aboutNameOrder` in inventedCopy rather than made silently:
  launch-check counts it until Ciro confirms the new order, and the sentence
  is otherwise untouched, both languages. Never reads Drive, never writes
  media, never deletes.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) throw new Error("SANITY_WRITE_TOKEN missing");
const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  token, useCdn: false,
});

const s = await client.fetch(`*[_id=="siteSettings"][0]{about, creators, inventedCopy}`);

const swap = (text, from, to) => {
  if (!text?.includes(from)) throw new Error(`sentence not found: ${from}`);
  return text.replace(from, to);
};
const aboutEn = swap(s.about.en, "Ferdinando Palmieri and Ciro Cecco", "Ciro Cecco and Ferdinando Palmieri");
const aboutIt = swap(s.about.it, "Ferdinando Palmieri e Ciro Cecco", "Ciro Cecco e Ferdinando Palmieri");
const flags = [...new Set([...(s.inventedCopy ?? []), "aboutNameOrder"])];

await client.patch("siteSettings").set({
  "about.en": aboutEn,
  "about.it": aboutIt,
  creators: ["Ciro Cecco", "Ferdinando Palmieri"],
  inventedCopy: flags,
}).commit();
console.log("patched: creators + both sentences reordered, flagged aboutNameOrder");
console.log("flags now:", flags.length);
