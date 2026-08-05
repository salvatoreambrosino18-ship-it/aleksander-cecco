/*
  ONE MIGRATION (section 71): instagramFrames goes from [media] to
  [{media, postUrl}], so each square can carry its own post's address. The
  six existing frames are wrapped in place, postUrl empty (the owner pastes
  his links in the studio). Never reads Drive, never writes media content,
  never deletes.
*/
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.loadEnvFile(path.join(ROOT, ".env"));

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const s = await client.fetch(`*[_id=="siteSettings"][0]{instagramFrames}`);
const frames = s?.instagramFrames ?? [];
if (frames.length === 0) {
  console.log("no frames; nothing to migrate");
  process.exit(0);
}
if (frames.every((f) => f._type === "instagramFrame")) {
  console.log("already migrated");
  process.exit(0);
}
const wrapped = frames.map((media, i) => ({
  _type: "instagramFrame",
  _key: media._key ?? `igf${i}`,
  media: {...media, _key: undefined},
  postUrl: null,
}));
await client.patch("siteSettings").set({instagramFrames: wrapped}).commit();
console.log(`migrated ${wrapped.length} frames to instagramFrame`);
