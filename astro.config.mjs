// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Scaffold config: static build with the token system and self-hosted fonts.
// Added in later milestones, deliberately not here yet:
//   - i18n routing (/it default, /en), during page building
//   - the Cloudflare adapter + server output, when the enquiry API route is wired
//   - the Sanity integration, after the content model is approved
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'https://example.com',
  vite: {
    plugins: [tailwindcss()],
  },
});
