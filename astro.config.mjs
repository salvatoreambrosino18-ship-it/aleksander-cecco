// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

// The config file runs before Astro loads .env, so read it here: `site` feeds
// canonical links, Open Graph and the sitemap, and must not silently fall back
// to a placeholder domain in a real build.
const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? '', process.cwd(), '');

// Static build with the token system, self-hosted fonts, and bilingual routing.
// Added in later milestones, deliberately not here yet:
//   - the Cloudflare adapter + server output, when the enquiry API route is wired
export default defineConfig({
  site: PUBLIC_SITE_URL || 'https://example.com',

  // Italian is the default and English is fully first class. Both carry a path
  // prefix, so neither language is the "unmarked" one, and nothing redirects by
  // detected language (DESIGN-PLAN section 5). Pages are authored once under a
  // [lang] segment and built for every locale.
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  // The bare root is not a language, so it sends the reader to the default one.
  // This is a path redirect, not language auto-detection.
  redirects: {
    '/': '/it',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
