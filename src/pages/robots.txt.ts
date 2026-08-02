import type {APIRoute} from "astro";

/*
  robots.txt, generated so it follows the same switch as the noindex tag.

  PRE-LAUNCH, which is now: the site carries {PLACEHOLDER} copy and seeded test
  content and must not appear in search results.

  Note the counter-intuitive part, because it matters: crawling is ALLOWED here
  on purpose. "Disallow: /" stops a crawler fetching the page, which means it
  never sees the noindex meta tag or the X-Robots-Tag header, and a URL that is
  linked from anywhere can still end up listed with no content under it.
  Allowing the crawl and answering "noindex" is what actually keeps a page out
  of the index. The sitemap is simply not advertised until launch.

  AT LAUNCH: set PUBLIC_ALLOW_INDEXING=true in the Cloudflare Pages environment
  variables. That flips this file and the meta tag together. The X-Robots-Tag
  header in public/_headers is a separate, deliberate second lock and has to be
  removed by hand. Both steps are in DESIGN-PLAN section 16.
*/
export const GET: APIRoute = ({site}) => {
  const allowIndexing = import.meta.env.PUBLIC_ALLOW_INDEXING === "true";
  const sitemap = site ? new URL("sitemap-index.xml", site).href : null;

  const body = allowIndexing
    ? ["User-agent: *", "Allow: /", ...(sitemap ? [`Sitemap: ${sitemap}`] : [])].join("\n")
    : [
        "# Pre-launch: this site is deliberately kept out of search results.",
        "# Crawling is allowed so the noindex response is seen and obeyed.",
        "# See DESIGN-PLAN section 16 for how to reverse this at launch.",
        "User-agent: *",
        "Allow: /",
      ].join("\n");

  return new Response(body + "\n", {headers: {"Content-Type": "text/plain; charset=utf-8"}});
};
