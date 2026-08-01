import {createClient} from "@sanity/client";
const c = createClient({projectId: "lq2xg1yd", dataset: "production", apiVersion: "2026-03-01", useCdn: false, perspective: "published"});
for (let i = 0; i < 60; i++) {
  const n = await c.fetch(`{"g": count(*[_type=="garment" && count(media)>0]), "c": count(*[_type=="collection"]), "s": count(*[_type=="siteSettings"])}`);
  if (n.g > 0) { console.log("PUBLISHED", JSON.stringify(n)); process.exit(0); }
  await new Promise(r => setTimeout(r, 20000));
}
console.log("TIMEOUT: still no garments with media");
