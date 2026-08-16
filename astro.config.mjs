// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

// The config file runs before Astro loads .env, so read it here: `site` feeds
// canonical links, Open Graph and the sitemap, and must not silently fall back
// to a placeholder domain in a real build.
const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? '', process.cwd(), '');

// Static build with the token system, self-hosted fonts, and bilingual routing.
//
// The output stays FULLY STATIC, including the enquiry page. The one piece of
// server work this site needs, receiving the enquiry POST, is a Cloudflare
// Pages Function in functions/api/enquiry.ts instead of an Astro server route.
//
// Why not the Astro Cloudflare adapter: as of 2026 it no longer supports
// Cloudflare Pages and targets Workers instead. Adopting it would mean
// migrating the whole deployment off Pages, losing the pages.dev URL, the git
// integration, the deploy hook and the Sanity webhook already wired to it. That
// is an infrastructure decision for the owner, not a side effect of building a
// form. A Pages Function needs none of it and costs nothing.
export default defineConfig({
  site: PUBLIC_SITE_URL || 'https://example.com',

  // English is the routing default from 2026-08-02 and Italian is fully first
  // class. Both carry a path prefix, so neither is the "unmarked" one, and
  // nothing redirects by detected language (DESIGN-PLAN sections 5 and 37).
  // Pages are authored once under a [lang] segment and built for every locale.
  i18n: {
    defaultLocale: 'en',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  // The bare root is not a language, so it sends the reader to the default one.
  // This is a path redirect, not language auto-detection: no header is read.
  redirects: {
    '/': '/en',
  },

  // The sitemap knows about both locales, so each page lists its counterpart as
  // an hreflang alternate rather than looking like two unrelated sites.
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { it: 'it', en: 'en' },
      },
      // THE CART IS NOT A PAGE TO ARRIVE ON (2026-08-16, section 129). It holds
      // one visitor's own state and, to anything that does not run scripts —
      // which includes every crawler worth the name — it is one sentence saying
      // the cart needs JavaScript, twice, once per language. Submitting that to
      // a search engine as content is submitting a thin duplicate. The single
      // piece order forms stay listed: they are real pages about a real object.
      filter: (page) => !/\/(it|en)\/cart\/?$/.test(page),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
