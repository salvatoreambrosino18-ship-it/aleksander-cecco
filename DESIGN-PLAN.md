# Aleksander Cecco - Design Plan (Approved)

## How to use this file

This is the approved design plan and the handoff document for building the
Aleksander Cecco site. A fresh session, started inside this directory
(`~/aleksander-cecco`), continues from here. This file is the single source of
truth for direction until the code exists.

Scope note: this is a personal client project with its own repository, this
directory. It has no relationship to any other repo on this machine, and none of
that other repo's branch, commit, or platform rules apply here.

Direction was approved after one review round. The corrections from that round
are applied throughout and summarized in section 10.

---

## 0. The brief, and the constraints that cannot move

A showcase site for Aleksander Cecco, an independent clothing brand. It presents
collections and individual garments. It does not take payment. A visitor who
wants a piece submits an enquiry form that names the size; the enquiry arrives by
email and the brand closes the sale directly. Most visitors arrive from Instagram
on a phone and already know the aesthetic. The site's one job is to make the
garments look as serious as they are and make it effortless to ask for one.

Non-negotiable constraints:

1. Pure white and pure black only. No third color anywhere, and no gray
   half-state, including states, errors, and focus rings.
2. Bilingual Italian and English, with a visible switch. Both first class. No
   auto-detect that hides the switch.
3. The brand owner must add, edit, and remove garments and collections without
   touching code. This is what Sanity is for.
4. Mobile is the primary target. Design mobile first, then scale up.
5. Photography is professional studio work. The layout serves the images. Images
   are never cropped into small decorative thumbnails.
6. No em dashes in any copy written for the site.

Aesthetic: Rick Owens, Vivienne Westwood. Gothic in the architectural sense, not
the costume sense. Severity, verticality, extreme scale contrast, generous
emptiness. Drama comes from composition, scale, and orchestrated transition, not
from scattered decorative effects. One large deliberate movement beats five small
ones.

Stack: Astro with TypeScript, Sanity as the CMS, Tailwind for layout with all
tokens wired into the theme config, GSAP with ScrollTrigger for the motion, Lenis
for smooth scroll only if it does not fight mobile, Cloudflare Pages for deploy,
Resend for enquiry email. Content updates trigger a rebuild through a Sanity
webhook pointed at a Cloudflare deploy hook. Verify current versions and setup
against official docs before installing anything.

---

## 1. Principles the whole build serves

- The inversion is the architecture, not a feature. White and black are the two
  states of one document, and scrolling is what moves between them.
- Two type registers, and they mean different things. Archivo (variable width
  axis) carries voice: condensed and enormous for names, normal and quiet for
  prose. JetBrains Mono carries fact: sizes, materials, measurements, prices,
  reference codes. If it came off the garment, it is mono. Nothing is mono for
  decoration.
- The image is the subject; the layout is the frame. No dense thumbnail grids. A
  garment is shown at the largest scale the viewport allows, one thing at a time.
- One large movement per moment. Motion budget goes to the inversion and to
  deliberate photography reveals. No universal fade-up on every element.
- Severity through emptiness. Wide margins, few elements per screen, a strict
  grid marked by hairlines, verticality over horizontality.

---

## 2. Token system

One source of truth: a `tokens.css` of custom properties plus the Tailwind theme
config derived from it. No hardcoded colors or sizes in markup, and no arbitrary
Tailwind values scattered through classes.

### Color

```css
:root {
  --ink:   #0A0A0A;   /* near-black; photography reads darker than the page */
  --paper: #FAFAF8;   /* warm near-white; studio work never looks gray */
}
/* semantic pair. two discrete themes. the inversion swaps which one is active. */
[data-theme="light"] { --fg: var(--ink);   --bg: var(--paper); }
[data-theme="dark"]  { --fg: var(--paper); --bg: var(--ink);   }

--hairline: color-mix(in srgb, var(--fg) 20%, transparent); /* 1px, 20% of fg */
--focus:    var(--fg);  /* ring is drawn as a bg halo plus an fg line, both tokens,
                           so it reads on photography and stays black/white only */
```

There is no interpolated color state in the system. There are only two discrete
themes. That is deliberate, see section 3: it guarantees the page is only ever
pure white or pure black, never a muddy gray in between. States and errors have no
color to reach for; an error thickens a hairline to solid `--fg` and speaks in
`--fg` text.

### Type

```css
--font-display: "Archivo Variable", system-ui, sans-serif; /* self-hosted, OFL */
--font-mono:    "JetBrains Mono", ui-monospace, monospace;  /* self-hosted, OFL */

/* the width axis is the instrument */
/* openers and names: font-variation-settings 'wdth' 62-75, 'wght' 500-700 */
/* body:              'wdth' 100, 'wght' 400 */

/* scale: a deliberately large jump between display and body */
--t-hero:  clamp(3.5rem, 22vw, 20rem);   /* collection name, section opener; condensed */
--t-h1:    clamp(2.25rem, 9vw, 6rem);
--t-h2:    clamp(1.5rem, 5vw, 3rem);
--t-body:  clamp(1rem, 0.98rem + 0.2vw, 1.125rem);
--t-small: 0.875rem;
--t-mono:  0.8125rem;   /* uppercase, letter-spacing 0.08em */
```

The gap from `--t-hero` (up to 20rem) to `--t-body` (near 1rem) is the scale
contrast the direction demands. It is not softened.

### Space and grid

```css
--unit: clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem);   /* single rhythm unit */
/* spacing scale = unit x {1,2,3,5,8,13,21}: restrained, near-Fibonacci, severe */
--margin: 6vw;                                     /* mobile */
/* desktop --margin: clamp(3rem, 8vw, 10rem) -> wide margins */
--grid-cols: 12;                                   /* desktop; mobile is 1 col */
--hairline-w: 1px;
```

Hairline rules mark the grid, not boxes. A single vertical hairline, the spine,
is the recurring structural mark (see concept A).

### Motion

```css
--wipe-pin: 100vh;   /* scroll distance the boundary wash stays pinned while the edge travels */
--edge-ease: none;   /* the edge is scrubbed to the gesture; linear feels most physical */
--dur-reveal: 900ms;
--ease-reveal: cubic-bezier(.16, 1, .3, 1);   /* expo-out; images rise into place */

@media (prefers-reduced-motion: reduce) {
  /* no pin, no edge travel; polarity flips discretely at the boundary. */
  /* reveals become static. the site stays coherent with all motion off. */
}
```

---

## 3. The inversion, built as a wipe (the corrected heart of the site)

The first plan proposed a scrubbed color cross-fade between ink and paper. That is
wrong for this brand and is removed. At the midpoint a cross-fade makes the entire
page mid-gray, which violates the white-and-black-only rule and is the one thing
that would make this look cheap. It is also a full-document repaint on every
scroll frame, a real risk on the mobile devices that are the primary target.

The inversion is a wipe. The page is only ever pure white or pure black. A hard
horizontal edge travels across the viewport, driven by scroll. There is no color
interpolation anywhere and therefore no gray state can exist.

### Mechanism

- The site is a sequence of settled sections. Each settled section is wholly one
  polarity, set by `data-theme`. Inside a settled section nothing about the theme
  animates, so the long content scroll (where the photographs live) is cheap on
  mobile: no per-frame theme work while a visitor reads a collection.
- Between two collections sits a dedicated full-viewport boundary wash. It is a
  screen of type, the spine, and emptiness. No photograph is on screen while the
  flip happens.
- The wash is pinned with ScrollTrigger for `--wipe-pin`. During the pin, a hard
  horizontal edge travels across the viewport, scrubbed to scroll. The incoming
  polarity is on one side of the edge, the outgoing polarity on the other. When
  the edge completes its travel, the pin releases and the next section continues
  in the new polarity.
- Implementation: two stacked full-viewport layers, pixel aligned, holding the
  same wash content (title, season code, spine, hairlines). The bottom layer is
  the outgoing theme, the top layer is the incoming theme. The top layer is
  revealed by the moving hard edge using compositor-friendly properties only
  (a scroll-driven `clip-path: inset(...)`, or a transform-driven mask). Each
  layer is a single flat theme, so each is only ever pure white or pure black.
- Because both layers hold the same aligned content, the spine and the typography
  appear continuous while the edge recolors them as it passes. The letterforms
  and the spine flipping along a moving line is the drama.
- The logo participates. The two supplied signature files (white-on-black,
  black-on-white) sit one per layer, aligned, so the mark inverts with the edge
  rather than snapping.

### Does the wipe work with the spine and typography crossing the boundary

Yes, on one condition that is built in, not discovered later: the flip happens on
a dedicated wash screen of type and lines, never while a photograph is on screen.
Photographs live in the settled sections before and after the wash, each already
on its correct final polarity. Photographs are never inverted, never blended, and
never sliced by the edge; they are placed at large scale on a settled black or
white page. If a future layout ever demands the flip happen over an image, that
gets raised before building rather than sliding a hard edge through a photograph.

### Reduced motion

With `prefers-reduced-motion`, there is no pin and no edge travel. Each section
still resolves to its correct polarity, so the reader sees a calm series of
correct white and black chapters. The site is complete with motion fully off.
That is the test it is held to.

### Performance gate (standing rule, see section 7)

The wipe is confined to a short pinned boundary that contains only type and lines.
The long content scroll is static-theme. Even so, the wipe is tested on a real
phone before any section that uses it is called done. If it drops frames on
mobile, the wipe changes, not the frame-rate target.

---

## 4. Layout concepts

Three systems. Wireframes are mobile-first, the primary target, with the desktop
move noted. There is no invented AC monogram anywhere: the mark is the full
signature, and the corner uses either a small crop of the signature or nothing.

### Concept A - The Spine (recommended structural system)

A single hairline runs the full height of the document, offset into the left
margin. Names bleed off it to the right at huge condensed scale; mono facts hang
off it. Extreme verticality, generous emptiness, one clear axis.

```
┌───────────────┐  theme: LIGHT (pure paper)
│ {sig crop?}IT|EN│  optional small crop of the signature, or nothing. no monogram.
│               │
│               │
│    [ LOGO ]   │  full signature logo, black-on-white
│               │
│  ▓▓▓▓▓▓▓▓▓▓▓  │  ONE photograph, full width, tall. nothing competes. no scroll cue.
│  ▓  hero   ▓  │
│  ▓▓▓▓▓▓▓▓▓▓▓  │
├───────────────┤
│┊ COLLECTION   │  spine begins, runs the whole page; giant condensed name, bleeds right
│┊ O N E        │
│┊ SS26  (mono) │  season code hangs off the spine
│┊ statement..  │  short localized statement, body width
│┊ ▓▓▓▓▓▓▓▓▓▓   │  garment image, large, reveals on scroll (settled LIGHT)
│┊ ▓ piece  ▓   │
│┊ NAME  REF01  │  mono ref on the spine
└───────────────┘
      ... scroll ...
┌───────────────┐  BOUNDARY WASH (pinned). the edge travels top to bottom.
│███████████████│  incoming DARK above the edge
│███ COLLECTION │  same title and spine, now white-on-black
│▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀│  <- hard edge, scrubbed to scroll
│┊  COLLECTION  │  outgoing LIGHT below the edge (black-on-white)
│┊  T W O       │
└───────────────┘
      ... edge completes, pin releases ...
┌───────────────┐  theme: DARK (pure ink), settled
│┊ COLLECTION   │
│┊ T W O        │  white-on-black
│┊ ▓▓▓▓▓▓▓▓▓▓   │  garment photo on a settled black page
└───────────────┘
```

Desktop: the spine sits at the left margin; names cross the 12-col grid; images
occupy cols 4 to 12 or full-bleed; mono data pins to the spine column; wide outer
margins.

### Concept B - The Diptych (recommended for the garment page)

The inversion made literal as facing pages: an image plane and a data plane. Weak
as a whole-site system because it repeats over many collections, but exactly right
for one garment, where image and fact belong side by side.

```
MOBILE (stacked)             DESKTOP (diptych)
┌───────────────┐           ┌──────────────┬─────────────┐
│┊ NAME    IT|EN │           │ ▓▓▓▓▓▓▓▓▓▓▓ │ NAME        │
│┊ REF 001 (mono)│           │ ▓ image 1 ▓ │ REF 001 mono│
│┊ ▓▓▓▓▓▓▓▓▓▓▓  │           │ ▓▓▓▓▓▓▓▓▓▓▓ │             │
│┊ ▓ image 1 ▓  │ full      │             │ materials   │
│┊ ▓▓▓▓▓▓▓▓▓▓▓  │ scale     │ ▓▓▓▓▓▓▓▓▓▓▓ │ measurements│
│┊ ▓▓▓▓▓▓▓▓▓▓▓  │ gallery   │ ▓ image 2 ▓ │ (mono block)│
│┊ ▓ image 2 ▓  │ one per   │ ▓▓▓▓▓▓▓▓▓▓▓ │ description  │
│┊ ▓▓▓▓▓▓▓▓▓▓▓  │ screen    │             │ €PRICE      │
│┊ MATERIALS..  │           │ (images     │ [ ENQUIRE ] │ sticky
│┊ MEAS.. €PRICE│           │  scroll)    │  panel      │
│┊ [ ENQUIRE ]  │ primary   └──────────────┴─────────────┘
└───────────────┘
```

### Concept C - The Column (considered, set aside)

Everything in one centered column with enormous vertical emptiness, images one at
a time like film frames, full-screen washes between chapters. Beautiful, but as a
whole system it dissolves the grid and the spine and hides the mono data register
that makes this brand feel engineered rather than only moody. Not adopted whole.
Its one borrowed idea, the full-viewport boundary wash, is exactly where the wipe
now lives.

Recommendation: Concept A as the structural system across the site, Concept B for
`/pieces/[slug]`, the boundary wash from C as the home of the wipe. One coherent
architecture, not three.

---

## 5. Pages

- `/` Opens on the signature logo and one photograph, nothing else, no scroll cue.
  Then collections in sequence on the spine, each boundary a wipe.
- `/collections` The collections as full-scale entries, each a name plus cover
  image plus season, stacked. Not a grid of chips.
- `/collections/[slug]` The statement, then its garments at large scale,
  alternating across the grid on desktop, single column on mobile.
- `/pieces/[slug]` Concept B. Full gallery at large scale, mono technical block,
  sticky enquiry action on desktop.
- `/about`, `/contact` Prose in the body register, contact and Instagram as mono
  facts, inside the same spine system.
- Enquiry Opens pre-filled with the garment name and reference code. No size selector for now (pending the one-of-one vs
  remade-on-request decision); the measurements field is the authoritative fact
  about fit. Email, optional message. The button says "Send enquiry" (IT: "Invia richiesta"). The
  confirmation states what happens next and roughly when, using the reply-window
  token (see section 9), never an invented number. The error state names what
  failed and what to do, in `--fg` only, no apology, no color.
- 404 Same architecture, one photograph, a real way back.
- i18n Astro i18n with `/it` (default) and `/en` path prefixes, a switch that
  preserves the current path, both first class, no auto-detect redirect. Sanity
  field-level localization feeds both.
- Quality floor carried structurally: aspect-ratio boxes from Sanity image
  metadata so there is no layout shift, responsive `srcset` via the Sanity image
  pipeline, lazy below the fold, semantic headings in order, localized metadata,
  Open Graph images, and a sitemap.

---

## 6. Content model (Sanity)

Designed so the studio is pleasant for a non-technical owner: clear field labels
in Italian and English, helpful descriptions, sensible previews, drag to reorder.

- Collection: name, slug, season, statement (localized), cover image, display
  order, published flag.
- Garment: name, slug, reference code, parent collection, category (Uomo /
  Donna, required, for catalogue filtering), price, currency (default EUR),
  materials (localized, default "100% pelle italiana" / "100% Italian leather"),
  measurements (the authoritative fact about the piece), description (localized),
  image gallery with alt text (localized and required), sold-out flag, display
  order. A size field is deliberately absent, pending the one-of-one vs
  remade-on-request decision (see the need-from-you list).
- Site settings: Instagram URL, contact email, about text (localized), shipping
  and returns text (localized), the two logo files.

Alt text is a required field.

---

## 7. Standing rules

1. Pure white and pure black only. No gray half-state, no third color, ever,
   including states, errors, and focus rings.
2. No em dashes in any site copy.
3. Test motion on a real phone before calling any section done, not only in a
   resized desktop window. If the wipe drops frames on mobile, the wipe changes,
   not the frame-rate target.
4. Cloudflare Web Analytics only, cookieless. No other third-party script, none at
   all, without asking the owner first.
5. Commit `.env.example` with variable names only. Never commit `.env`. Build
   against env placeholders throughout and swap real keys in when each piece is
   wired.
6. Do not invent brand assets or copy. No monogram, no garment names, no prices,
   no measurements, no response-time promise. Use the marked placeholder tokens in
   section 9 and keep that list current.
7. Motion fully respects `prefers-reduced-motion`. The site is coherent with all
   motion off. If it is not beautiful without motion, motion will not save it.
8. Structure the enquiry action so that swapping it for a real checkout later
   touches one component, not the whole site.
9. Nothing paid. The domain is the only paid item on this project. Everything
   else must run on a genuinely free tier that is permanent: not a trial, not a
   trial that lapses into payment, and nothing that requires a card on file. If
   any choice would need payment, an expiring trial, or a card, stop and ask
   before building it. No paid fonts, plugins, analytics, or hosting. Details and
   the current free-tier audit are in section 12.

---

## 8. Build order

1. Scaffold the Astro project and the Sanity schemas. Wire all tokens into the
   Tailwind theme config. Commit `.env.example`.
2. Build page by page, mobile first, and show each page before moving on.
3. Motion goes in last, once the static layout is already right. The wipe, the
   photography reveals, and the restrained hover states, each disabled or reduced
   under `prefers-reduced-motion`.
4. Wire services as keys arrive: Sanity, then Resend for the enquiry email (server
   validation, rate limiting), then Cloudflare Pages plus the deploy hook, then
   the Sanity webhook to that hook, then Cloudflare Web Analytics.

Confirm current versions and setup steps against official docs before installing
anything.

---

## 9. What I need from you (running list)

Confirmed already:

- Locale: `/it` default (DECIDED 2026-08-01: Italian stays the default; the brand
  is Italian and produces in Italy), `/en` fully available through the switch,
  switch always visible, no auto-detect redirect.
- Currency: EUR.
- Analytics: Cloudflare Web Analytics, and nothing else without asking.
- Env: build against placeholders, commit `.env.example`, never `.env`.

Placeholder tokens, to be filled by the owner. Everything here ships as a clearly
marked placeholder string until supplied. Nothing in this list is invented.

- `{SIGNATURE_LOGO_BLACK_ON_WHITE}`, `{SIGNATURE_LOGO_WHITE_ON_BLACK}`: the two
  logo files.
- `{SIGNATURE_CROP}`: optional small crop of the signature for the corner mark, or
  leave it empty. No invented monogram.
- Per collection: `{COLLECTION_NAME}`, `{SEASON_CODE}`,
  `{COLLECTION_STATEMENT_IT}`, `{COLLECTION_STATEMENT_EN}`.
- Per garment: `{GARMENT_NAME}`, `{REF_CODE}`, `{PRICE_EUR}`,
  `{AVAILABLE_SIZES}`, `{MATERIALS_IT}`, `{MATERIALS_EN}`, `{MEASUREMENTS}`,
  `{DESCRIPTION_IT}`, `{DESCRIPTION_EN}`, `{ALT_TEXT_IT}`, `{ALT_TEXT_EN}`.
- Site: `{ABOUT_IT}`, `{ABOUT_EN}`, `{SHIPPING_RETURNS_IT}`,
  `{SHIPPING_RETURNS_EN}`, `{CONTACT_EMAIL}`, `{INSTAGRAM_URL}`.
- `{REPLY_WINDOW}`: the enquiry confirmation reply window, kept as a token, not a
  number. The brand is not committed to a response time until the owner agrees
  one.

Service credentials, needed only when each piece is wired, never to scaffold:

- `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_READ_TOKEN`.
- `RESEND_API_KEY`, `RESEND_FROM` (a verified sending domain), `ENQUIRY_TO_EMAIL`.
- `CLOUDFLARE_DEPLOY_HOOK_URL`, plus the Sanity webhook pointed at it.
- Cloudflare Web Analytics site token.

Legal: entity details for a privacy page covering the enquiry form and the
cookieless page count.

### Added during the build (kept current)

- Sanity projectId and dataset: the immediate item. The studio is built and
  validated but cannot run for click-through until a real project exists. Create
  a free project and send the projectId and the dataset name (both are public
  identifiers, not secrets). Steps are in the README.
- Size system (OPEN QUESTION for the brand owner, not to be decided internally):
  are garments one-of-one or remade on request? The XS-XXL placeholder has been
  removed. Under one-of-one: no size field is needed (the sold flag is the
  state), and the enquiry asks only for contact details. Under remade-on-request:
  a real size system is added. The schema is structured so either answer is an
  addition, not a rewrite.
- Contact email is a PLACEHOLDER: info@example.com is prefilled in site settings
  and the studio warns whenever it is still in place. It must not ship. Replace
  with the real address before launch.
- About copy is a DRAFT pending client sign-off (not committed as final):
    IT: Aleksander Cecco nasce dalla pelle italiana, lavorata a mano, un pezzo
    alla volta. Nessun capo è uguale a un altro: ogni creatura porta i segni
    della propria costruzione. Prodotto in Italia, in quantità minime.
    EN: Aleksander Cecco begins with Italian leather, worked by hand, one piece
    at a time. No two garments are alike: every creature carries the marks of its
    own making. Made in Italy, in very small numbers.
  Confirm or replace before it goes into site settings.
- Category labels in English: the two values are Uomo and Donna. Decide whether
  the English catalogue shows them translated (Men / Women) or keeps the Italian
  labels. Frontend-only, minor.
- Logo files: still not present in ~/aleksander-cecco/assets/logo/. Needed for
  page building (the hero, the wipe, and the siteSettings logo fields). Drop the
  two files (white on black, black on white) there before that milestone.

---

## 10. Corrections applied after review

Direction was approved with three corrections, all applied above.

1. The gray problem. The scrubbed ink-to-paper cross-fade is removed because its
   midpoint is mid-gray, which breaks the white-and-black-only rule, and because a
   full-document repaint per scroll frame is a mobile risk. Replaced with a wipe:
   two stacked full-viewport layers, each a single flat theme, a hard edge
   traveling across the viewport on compositor-friendly properties, no color
   interpolation. The flip is confined to a dedicated boundary wash of type and
   lines so the spine and typography cross it continuously and no photograph is
   ever under the edge. The discrete flip remains the reduced-motion behavior.
2. No invented monogram. There is no AC monogram in this identity; the mark is the
   full signature. The corner uses a small crop of the signature or nothing.
3. The scroll-cue arrow is cut. A confident hero does not explain that it scrolls.

Earlier self-critique from the first plan, still in force: no persistent top nav
bar competing with the hero; no thumbnail grid on the collections pages, garments
are shown at large scale; no universal fade-up on scroll, motion is spent on the
wipe and on deliberate photography reveals.

---

## 11. Decisions taken during the build (2026-08-01)

- Toolchain versions verified against current docs before installing: Astro
  7.1.6, Tailwind v4 via @tailwindcss/vite (the @astrojs/tailwind integration is
  gone in v4), Sanity v6.8, @sanity/orderable-document-list v2 (React 19).
- Studio architecture: a standalone studio/ folder deployed to Sanity hosting,
  so the Astro site stays a pure static, JS-light build for Cloudflare.
- Fonts: self-hosted, Latin-subset variable woff2. Archivo carries both the wdth
  (62-125) and wght (100-900) axes (verified before and after subsetting); one
  file serves condensed display and normal body. JetBrains Mono carries wght
  (100-800). Only the first-screen font (Archivo) is preloaded.
- Alt text: required in both Italian and English on every image, honouring the
  brief's insistence that alt is mandatory. Relaxable to Italian-only on request.
- The site remains static output for now. The Cloudflare adapter and server
  output are added only when the enquiry API route (Resend) is wired.

Content-model corrections (2026-08-01, second round):

- Garment "category" (Uomo / Donna, required) added for catalogue filtering. It
  is a controlled value, not localized; the English display label is a
  frontend-only choice (see the need-from-you list).
- The XS-XXL size field is removed. Size handling is deferred to the one-of-one
  vs remade-on-request decision; measurements is the authoritative fact and the
  sold flag is the state, so either answer is an addition, not a rewrite.
- Materials prefill "100% pelle italiana" / "100% Italian leather" on a new
  garment, editable per piece.
- Instagram set to @aleksandercecco (https://www.instagram.com/aleksandercecco).
- Contact email prefilled with the placeholder info@example.com plus a studio
  warning; flagged in the need-from-you list so it cannot ship by accident.
- About copy is held as an unapproved draft in the need-from-you list, not baked
  into the schema.

---

## 12. Cost and free-tier constraint (audit, 2026-08-01)

Standing constraint (see rule 9): nothing paid except the domain. Free tiers must
be permanent, with no trial-into-payment and no card on file. Re-verify each
service's terms before wiring it, since plans change.

Hosting: Cloudflare Pages free tier. Permits commercial use. Do not switch
hosting without asking.

Sanity (currently a 30-day Growth trial that will drop to Free):

- Nothing built depends on a Growth-only feature. The studio, the schemas, the
  structure and singleton, Vision, the drag-to-reorder plugin
  (@sanity/orderable-document-list, open source), the custom field-level
  localization, and publish webhooks all work on Free.
- Free plan headroom (2026), all generous for this brand: up to 20 seats, 10,000
  documents, about 100GB assets and bandwidth, 1M CDN plus 250K API requests per
  month, webhooks included, free forever. Use a single "production" dataset (Free
  allots one).
- Not on Free, and not used here: scheduled publishing, comments and tasks, and
  roles beyond Administrator and Viewer.
- Watch item, not a blocker: image bandwidth. Studio photography served through
  the Sanity CDN counts toward the 100GB. If traffic ever pressures it, download
  the images at build time and serve them from Cloudflare instead.

Enquiry email (to choose at wiring time, not decided). The endpoint is a
server-validated, rate-limited Cloudflare Pages Function that calls an email API.
Volume is tiny (the brand receiving enquiries).

- Resend Free: 3,000 per month, 100 per day, one verified domain (the domain you
  are buying, verified via free DNS records), permanent, no card expected
  (confirm at signup). Clean API. Recommended.
- Brevo Free: about 300 per day, no card, API or SMTP; free sends may carry Brevo
  branding. Higher daily cap.
- A form-to-email service (Web3Forms, Formspree) avoids an email account but adds
  a third-party dependency with lower free caps and less control; likely not
  wanted given the no-extra-third-party stance.

Pick one when the form is wired. MailChannels is excluded on purpose: its free
Cloudflare route ended in 2024.

Fonts, plugins, analytics: all free. Self-hosted OFL fonts, open-source Sanity
plugins, Cloudflare Web Analytics (cookieless, free). No paid font, plugin,
analytics, or card-required service is used.

---

## 13. Handoff to a local machine (2026-08-01)

Built in an ephemeral cloud environment and pushed to GitHub. To continue on your
own machine: clone the repo, run `npm install` at the root and `cd studio &&
npm install`, then copy `.env.example` to `.env` and `studio/.env.example` to
`studio/.env` and fill them in (see the README).

Pinned versions (as installed):

- Site: Astro 7.1.6; Tailwind 4.3.3 with @tailwindcss/vite 4.3.3 (there is no
  @astrojs/tailwind in v4). Dev tools: @astrojs/check 0.9.10, typescript 6.0.3,
  @types/node 26.x.
- Studio: sanity 6.8.0, @sanity/vision 6.8.0, @sanity/orderable-document-list
  2.0.18, react and react-dom 19.2.8, styled-components 6.4.4; typescript 7.0.2,
  @types/react 19.2.x.

Fonts (self-hosted, no CDN):

- public/fonts/archivo-latin-var.woff2: Archivo variable, carrying wght 100-900
  and wdth 62-125 (verified before and after subsetting). One file serves both
  condensed display and normal body.
- public/fonts/jetbrains-mono-latin-var.woff2: JetBrains Mono variable, wght
  100-800.
- Both were downloaded as OFL TTFs from the google/fonts repository and subset
  with fonttools (pyftsubset) to a Latin unicode range plus the euro sign and
  general punctuation, output as woff2 with hinting dropped. The exact command
  and unicode range are in the README under Fonts. OFL license texts sit in
  public/fonts/.
- Note: @fontsource-variable/archivo and @fontsource-variable/jetbrains-mono are
  in package.json as a fallback font source but are NOT used by the build (the
  site serves the subset woff2 above). Safe to remove with
  `npm remove @fontsource-variable/archivo @fontsource-variable/jetbrains-mono`.

Environment facts that will NOT be true on your machine:

- GitHub codeload (codeload.github.com, the tarball host) is blocked here (HTTP
  403 through the agent proxy). That is why `npm create astro` could not fetch a
  template, and the project was set up with Astro's documented MANUAL setup
  instead. On your machine `npm create astro@latest` works normally; the manual
  setup is standard and needs no undoing.
- raw.githubusercontent.com IS reachable here, which is how the font TTFs were
  fetched. Only the codeload tarball host is blocked.
- Git operations here route through a local agent proxy (a global url.insteadOf
  rewrites github.com to http://local_proxy@127.0.0.1:.../git/...). The remote
  stored in .git/config is the plain
  https://github.com/salvatoreambrosino18-ship-it/aleksander-cecco.git with no
  token; on your machine it uses your own Git credentials directly.
- Built on Node 22. Use Node 20 or 22.
