# Aleksander Cecco

Showcase site for the Aleksander Cecco clothing brand. Static, motion-heavy,
bilingual (Italian default, English). No payments: a visitor enquires about a
garment by email. Built with Astro and Tailwind v4, content in Sanity, deployed
to Cloudflare Pages, enquiry email through Resend.

The design direction and all product decisions live in `DESIGN-PLAN.md`. That
file is the source of truth. Read it first.

## Repository layout

```
.                     the Astro website (static build for Cloudflare Pages)
  src/styles/         tokens.css (single source of truth) + global.css + fonts.css
  src/layouts/        Base.astro
  src/pages/          pages (only a scaffold placeholder so far)
  public/fonts/       self-hosted, subset variable fonts (woff2) + OFL licenses
studio/               standalone Sanity Studio (its own package, deploys to Sanity)
  schemaTypes/        the content model
DESIGN-PLAN.md        approved design plan and running "need from you" list
```

## Prerequisites

- Node 20.x or 22.x (built on Node 22).
- A Sanity account (free) for the content, a Cloudflare account for hosting, and
  a Resend account for enquiry email. None are needed just to run the website
  locally against an empty or placeholder dataset.

## First-time setup

### 1. Create the Sanity project

The studio cannot run until a real project exists. The project id and dataset
name are public identifiers, not secrets.

Web console (recommended, touches no files):

1. Go to https://www.sanity.io/manage and sign in.
2. Create a new project, for example "Aleksander Cecco".
3. Ensure it has a dataset named `production` with visibility Public.
4. Copy the Project ID from the project overview.
5. In the project API settings, add CORS origins (allow credentials) for:
   `http://localhost:3333` (studio dev), `http://localhost:4321` (site dev), and
   later the production site and studio URLs.

You now have a Project ID and the dataset name `production`.

### 2. Environment files

Website (repo root): copy `.env.example` to `.env` and fill in at least:

```
PUBLIC_SANITY_PROJECT_ID=your_project_id
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2026-03-01
PUBLIC_SITE_URL=https://your-domain
```

Studio: copy `studio/.env.example` to `studio/.env` and fill in:

```
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
```

Never commit `.env`. Only `.env.example` files are tracked.

## Install and run

### Website (repo root)

```
npm install
npm run dev        # http://localhost:4321
npm run check      # astro + TypeScript diagnostics
npm run build      # static build into dist/
npm run preview    # serve the production build locally
```

### Studio (studio/)

```
cd studio
npm install
npm run dev        # http://localhost:3333, log in via the browser popup
npm run deploy     # deploy to Sanity hosting (see below)
npm run typecheck  # tsc --noEmit
```

## Fonts

Both typefaces are self-hosted and never loaded from a CDN. The files in
`public/fonts/` are Latin subsets in woff2, produced with `fonttools`
(`pyftsubset`). Archivo is a single variable file carrying both the width axis
(wdth 62-125) and weight axis (wght 100-900); JetBrains Mono carries weight
(wght 100-800). To regenerate a subset from a fresh OFL release:

```
pip install fonttools brotli
pyftsubset SOURCE.ttf --output-file=public/fonts/NAME.woff2 --flavor=woff2 \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+2000-206F,U+20AC,U+2122" \
  --no-hinting --drop-tables+=DSIG
```

Only the first-screen font (Archivo) is preloaded, in `src/layouts/Base.astro`.

## Deploy

### Website: Cloudflare Pages

- Connect this repository in Cloudflare Pages.
- Build command: `npm run build`. Output directory: `dist`. Root directory: repo
  root. Set a Node version of 20 or 22.
- Add the `PUBLIC_*` variables (and any server secrets, once the enquiry route is
  wired) in the Pages project settings.
- Create a Deploy Hook and copy its URL into `CLOUDFLARE_DEPLOY_HOOK_URL`.

### Studio: Sanity hosting

```
cd studio
npx sanity login
# set studioHost once in studio/sanity.cli.ts, then:
npm run deploy     # publishes to https://<studioHost>.sanity.studio
```

Add the deployed studio URL to the project CORS origins.

### Content updates trigger a rebuild

In the Sanity project, add a webhook that fires on publish and calls the
Cloudflare deploy hook URL. Publishing content then rebuilds and redeploys the
static site.

### Analytics

Cloudflare Web Analytics only (cookieless). Put its token in
`PUBLIC_CF_WEB_ANALYTICS_TOKEN`. No other third-party script is added without
asking the owner first.

## Project status

Done:

- Version control, Astro + TypeScript + Tailwind v4 scaffold, the full design
  token system, self-hosted subset variable fonts.
- Sanity content model (collections, garments, site settings) in a standalone
  studio, with field-level Italian and English localization and drag-to-reorder.

Not wired yet (in planned order):

- Pages, mobile first (home, collections, collection, garment, about, contact,
  404), and i18n routing (/it default, /en).
- The enquiry API route (Resend, server validation, rate limiting) and the
  Cloudflare adapter with server output that it requires.
- Motion: the scroll-driven wipe inversion, photography reveals, hover states,
  all reduced or disabled under prefers-reduced-motion.
- Localized metadata, Open Graph images, sitemap, and the analytics beacon.

## Environment variables

| Variable | Where | Secret | Purpose |
| --- | --- | --- | --- |
| PUBLIC_SANITY_PROJECT_ID | site | no | Sanity project id |
| PUBLIC_SANITY_DATASET | site | no | Sanity dataset (production) |
| PUBLIC_SANITY_API_VERSION | site | no | Sanity API date, e.g. 2026-03-01 |
| SANITY_READ_TOKEN | site | yes | Only for private or draft reads |
| PUBLIC_SITE_URL | site | no | Canonical, Open Graph, sitemap |
| RESEND_API_KEY | site | yes | Enquiry email sending |
| RESEND_FROM | site | yes | Verified sender address |
| ENQUIRY_TO_EMAIL | site | yes | Where enquiries are delivered |
| PUBLIC_CF_WEB_ANALYTICS_TOKEN | site | no | Cloudflare Web Analytics |
| CLOUDFLARE_DEPLOY_HOOK_URL | webhook | yes | Called by the Sanity publish webhook |
| SANITY_STUDIO_PROJECT_ID | studio | no | Sanity project id |
| SANITY_STUDIO_DATASET | studio | no | Sanity dataset (production) |
