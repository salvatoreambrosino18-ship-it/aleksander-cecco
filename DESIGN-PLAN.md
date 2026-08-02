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

A second, larger correction followed on 2026-08-01, after the reference sites
were measured rather than remembered: typography demoted, media made the default
state of every screen, the signature made the opening gesture, chrome hidden
behind a menu, and video admitted to the content model. Sections 1, 2, 4, 5, 6
and 7 are rewritten for it and the evidence is in section 14. Where this file
disagrees with itself, section 14 and the sections it revised win.

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

Note added 2026-08-01: "extreme scale contrast" was read as giant typography and
that reading was wrong. Measured against the references, the contrast is between
a photograph filling the entire screen and type at 11px, not between one type
size and another. The brief is unchanged; the interpretation is corrected in
sections 1, 2 and 14. Filippo Sorcinelli joins the reference set, and on the
evidence it is the closest of the three to where this site is going.

Stack: Astro with TypeScript, Sanity as the CMS, Tailwind for layout with all
tokens wired into the theme config, GSAP with ScrollTrigger for the motion, Lenis
for smooth scroll only if it does not fight mobile, Cloudflare Pages for deploy,
Resend for enquiry email. Content updates trigger a rebuild through a Sanity
webhook pointed at a Cloudflare deploy hook. Verify current versions and setup
against official docs before installing anything.

---

## 1. Principles the whole build serves

Revised 2026-08-01 against the reference sites, measured rather than remembered.
The evidence is in section 14; these principles are what it changes.

- A screen is a photograph. Media is the default state of the site and text is
  the exception. Full bleed, edge to edge, no card, no frame, no margin, no
  rounded corner. Wide margins exist for running text only, never for media.
- Typography is demoted, deliberately and hard. Names, seasons, captions and
  navigation are small uppercase labels with wide tracking. There is no giant
  word anywhere on this site. On Rick Owens the largest type on the whole
  homepage is 11px; drama comes from the picture, not from the type size.
- The signature is the opening gesture. The mark, stretched nearly edge to edge
  and sitting in emptiness, is what replaces the giant collection name. It is
  the one thing on the site allowed to be large, and it is hairline thin.
- Statements are short lines, not blurbs. Section copy is two or three poetic
  lines in the Sorcinelli register, set in the statement size, uppercase, light.
  Never a marketing paragraph.
- Chrome disappears. No persistent navigation bar. One small MENU label opens a
  full-screen panel; the language switch lives with it. Nothing competes with
  the imagery.
- The mono register survives, narrowed. JetBrains Mono carries only hard facts
  that came off the garment: reference code, sizes, sample measurements,
  materials, price. Nothing is mono for decoration. See section 14 for the
  honest note that the references use a single typeface for everything.
- The inversion is still the architecture. White and black are the two states of
  one document. It now reads as the rhythm between image chapters rather than a
  scroll toy: settled media chapters, then a flat screen of type where the page
  flips.
- Severity through emptiness, on the text screens. Few elements, generous
  vertical space, verticality over horizontality. The spine marks those screens
  and stops at the edge of any photograph.

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

Revised 2026-08-01. The old scale ran to 20rem, which is 29 times the largest
type measured anywhere on the Rick Owens homepage. It is replaced, not softened.

```css
--font-display: "Archivo Variable", system-ui, sans-serif; /* self-hosted, OFL */
--font-mono:    "JetBrains Mono", ui-monospace, monospace;  /* self-hosted, OFL */

/* The width axis is texture now, not volume. It is never used to shout. */
/* labels:     'wdth' 92,  'wght' 500, uppercase, tracking 0.08em */
/* statements: 'wdth' 100, 'wght' 300, uppercase, tracking 0.02em */
/* prose:      'wdth' 100, 'wght' 400, sentence case */

--t-label:     0.6875rem;                                   /* 11px. names, seasons, captions, menu */
--t-mono:      0.75rem;                                     /* 12px. garment data only */
--t-body:      clamp(0.9375rem, 0.9rem + 0.2vw, 1.0625rem); /* running prose only: about, shipping */
--t-statement: clamp(1.125rem, 0.95rem + 1.1vw, 1.75rem);   /* 18px to 28px. the poetic line */
--t-chapter:   clamp(1.5rem, 1.2rem + 1.6vw, 2.25rem);      /* 24px to 36px. rare, wash and 404 */

/* the signature, the one thing allowed to be large */
--sig-hero-w:   min(92vw, 74rem);  /* opening gesture, nearly edge to edge */
--sig-corner-h: var(--s-u2);       /* corner mark, unchanged */
```

Reference points behind those numbers: Rick Owens sets its entire homepage at
10 to 11px with 0.08em tracking, 88% uppercase; Sorcinelli sets its statement
lines at 22px, weight 300, 0.027em tracking, uppercase; Vivienne Westwood's
hero line is 32px. `--t-statement` and `--t-chapter` bracket that range.

The ratio from the largest text to body is now about 3:1, where it used to be
20:1. That is the point. Scale contrast moves from the type to the pictures: a
photograph occupies the whole screen, a name occupies 11px.

`--t-hero`, `--t-h1` and `--t-h2` are removed. Nothing in the build should
reintroduce a display size; if something needs emphasis it gets case, tracking,
weight, position, or a whole screen of its own.

### Space and grid

```css
--unit: clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem);   /* single rhythm unit */
/* spacing scale = unit x {1,2,3,5,8,13,21}: restrained, near-Fibonacci, severe */
--margin: 6vw;                                     /* mobile, TEXT ONLY */
/* desktop --margin: clamp(3rem, 8vw, 10rem) -> wide margins, TEXT ONLY */
--hairline-w: 1px;

/* media occupies the screen; these are the only sizes it needs */
--media-h-screen: 100svh;          /* a chapter: one photograph, one screen */
--media-h-tall:   88svh;           /* a piece in a sequence, so the next one shows */
--caption-inset:  var(--s-u3);     /* how far a label sits off the media edge */
```

Margins apply to running text and to the technical block. They never apply to
media: a photograph or a video runs edge to edge, always, at every breakpoint.

The 12 column grid is removed. It was never visible in the layouts it was meant
to serve, and nothing in the references is built on one. Media is full bleed;
text is a single measure inside the margins; the one structural mark is the
spine.

The spine runs on text surfaces only. It marks statement screens, technical
blocks, about and contact, and the boundary wash. It stops at the edge of any
full-bleed media and picks up again after it, so the hairline is never drawn
across the owner's photography (DECIDED 2026-08-01).

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
  screen of small type, the spine, and emptiness. No photograph is on screen
  while the flip happens. Revised 2026-08-01: this screen is now also the site's
  pause. The chapters either side of it are full-bleed media with almost no
  text, so the wash is where the reader breathes, and where the season code and
  the next collection name are read. It carries the signature and a label, not a
  giant word.
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
- Because both layers hold the same aligned content, the spine, the signature
  and the labels appear continuous while the edge recolors them as it passes.
  With type now small, the drama is the field flipping and the hairline
  signature flipping with it, not letterforms filling the screen.
- The logo participates, and it needs no second file. The supplied signature
  (`assets/logo/logo-signature.svg`) paints with `fill="currentColor"`, so it
  takes the foreground color of whatever layer it sits in and inverts with the
  page for free. The same single SVG is placed in both wash layers; the edge
  recolors it as it passes, exactly like the type and the spine. The earlier
  plan called for two files (white-on-black and black-on-white) cross-faded one
  per layer. That is unnecessary and is removed: one file, two inherited
  colors. The PNG next to it is a raster fallback of the same mark, not a
  second polarity.

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

Rewritten 2026-08-01 against the reference study (section 14). The three
"concepts" are gone. They were three ways to arrange type on a page, and the
references are not arranged around type at all. There is now one architecture:

**Full-bleed media is the page. Text surfaces are the exception between the
pictures.** Every screen is one of two kinds, and the whole site is built from
them alternating.

- MEDIA SURFACE. One photograph or one looping video, edge to edge, no margin,
  filling the screen. Carries at most a label: a name, a season, a reference
  code, at 11px uppercase with wide tracking, inset by `--caption-inset`. The
  label is solid paper or solid ink, chosen per media item by the owner in the
  studio, never gray, never on a scrim. No spine crosses it.
- TEXT SURFACE. Flat paper or flat ink, no image. Margins apply, the spine runs,
  and the content is a statement of two or three short lines, or a technical
  block of mono facts, or running prose. This is where emptiness does its work.

Wireframes are mobile first, the primary target. Desktop notes follow each.

### Home

```
┌───────────────┐  TEXT SURFACE. no nav bar. no scroll cue.
│          MENU │  11px uppercase, the only chrome on the site
│               │
│               │
│ ~~~signature~~│  THE OPENING GESTURE: the mark at --sig-hero-w,
│               │  nearly edge to edge, hairline, in emptiness
│               │
├───────────────┤
│███████████████│  MEDIA SURFACE, 100svh, full bleed
│███████████████│  the collection cover: still now, video later
│███████████████│
│███ COLLEZIONE │  11px label over the media, polarity per item
│███ UNO   SS26 │
├───────────────┤
│┊ short line   │  TEXT SURFACE: the statement, 2 to 3 lines
│┊ second line  │  --t-statement, uppercase, light. spine returns.
├───────────────┤
│███████████████│  MEDIA SURFACE: next collection
│███ COLLEZIONE │
│███ DUE   AW26 │
└───────────────┘
```

Desktop: identical structure. The media stays 100vh and full bleed; it does not
become a column or a card. The signature scales with `--sig-hero-w` and is
capped so its strokes stay hairline (see the open question in section 9).

### Collection, `/collections/[slug]`

```
┌───────────────┐
│          MENU │
├───────────────┤
│███████████████│  cover media, full bleed, 100svh
│███ COLLEZIONE │
│███ UNO   SS26 │
├───────────────┤
│┊ short line   │  TEXT SURFACE: the statement
│┊ second line  │
├───────────────┤
│███████████████│  garment 1, full bleed, --media-h-tall
│███ NOME  R001 │  label doubles as the link to the piece
├───────────────┤
│███████████████│  garment 2
│███ NOME  R002 │
└───────────────┘
```

Desktop: garments may pair two up, each still full height and touching, as on
the primary reference (two 720x900 videos side by side, no gutter). Never a card
grid, never a thumbnail.

### Garment, `/pieces/[slug]`

The diptych is withdrawn. Splitting the screen into an image plane and a data
plane is a product-page pattern, not something any reference does; it also caps
the photograph at half the viewport, which contradicts the first principle.

```
┌───────────────┐
│          MENU │
├───────────────┤
│███████████████│  image 1, full bleed, 100svh
│███████████████│
│███ NOME  R001 │  name and reference over the media
├───────────────┤
│███████████████│  image 2, or the video with its poster
├───────────────┤
│███████████████│  image 3
├───────────────┤
│┊ MATERIALI    │  TEXT SURFACE: the technical block, mono
│┊ 100% pelle.. │
│┊ TAGLIE       │
│┊ S  M  L  SU  │  sizes as mono facts
│┊ MISURA       │
│┊ MISURE DEL   │  sample piece measurements, labelled as such
│┊ CAPO CAMPIONE│
│┊ EUR 000      │
│┊ [ RICHIEDI ] │  one action. or the not-offered line in its place
└───────────────┘
```

Desktop: the images stay full bleed and stacked. The technical block sits inside
the margins as two columns, facts left, action right, and does not float or
stick over the photography.

### Collections index, `/collections`

Each collection is one full-bleed media screen with its label. Scrolling the
index is scrolling through the collections themselves.

### About and contact

Text surfaces throughout: statement lines, then running prose in the body
register inside the margins, then contact and Instagram as mono facts. One
photograph may open the page, full bleed, if the owner supplies one.

### The menu

```
┌───────────────┐  full screen, flat ink or flat paper, no media
│         CHIUDI│
│               │
│ COLLEZIONI    │  11px uppercase, wide tracking, stacked, generous
│ CAPI          │
│ CHI SIAMO     │
│ CONTATTI      │
│               │
│ IT | EN       │  the language switch lives here
└───────────────┘
```

The switch is no longer in a corner on every screen. It is always reachable in
one tap from the menu label, which is the only persistent chrome. This keeps the
brief's "always visible switch" honest without a bar competing with the imagery:
the menu label is always visible, and the switch is always one tap away. If you
want the literal always-visible switch back, say so and it returns next to MENU
at 11px.

---

## 5. Pages

- `/` Opens on the signature stretched nearly edge to edge, in emptiness, with
  the MENU label and nothing else. No photograph on the first screen, no scroll
  cue. Then the collections in sequence as full-bleed media chapters, each
  boundary a wipe on a text surface.
- `/collections` One full-bleed media screen per collection, label over the
  media. Not a grid, not chips, not cards.
- `/collections/[slug]` Cover media, then the statement on a text surface, then
  its garments as full-bleed media, one per screen on mobile and optionally two
  up and touching on desktop.
- `/pieces/[slug]` The gallery full bleed and stacked at full screen, then the
  mono technical block on a text surface, with one enquiry action. The diptych
  is withdrawn (section 4).
- `/about`, `/contact` Statement lines, then prose in the body register, then
  contact and Instagram as mono facts. Text surfaces, spine present.
- Menu The only chrome. A MENU label opens a full-screen panel holding the four
  destinations and the language switch. No persistent bar anywhere.
- Enquiry Opens pre-filled with the garment name and reference code. It names a
  size: the sizes the owner marked available on that garment, plus "Su misura /
  Made to measure" when offered. Choosing made to measure reveals three mono
  number fields, chest, shoulders and length, in centimetres, and nothing else
  changes. Garments are remade on request, so the size is the buyer's choice;
  the measurements field describes the sample piece, not what the buyer
  receives. Email, optional message. The button says "Send enquiry" (IT: "Invia richiesta"). The
  confirmation states what happens next and roughly when, using the reply-window
  token (see section 9), never an invented number. The error state names what
  failed and what to do, in `--fg` only, no apology, no color. When a garment is
  flagged not currently offered, the piece stays fully visible and at full scale;
  only the enquiry action is disabled, replaced by one short line in the same
  place, either the owner's own explanation or the `{NOT_OFFERED_NOTE}` default.
- 404 One full-bleed photograph, one label, and a real way back.
- i18n Astro i18n with `/it` (default) and `/en` path prefixes, a switch that
  preserves the current path, both first class, no auto-detect redirect. Sanity
  field-level localization feeds both. The switch now lives inside the menu
  (section 4), one tap from any screen.
- Quality floor carried structurally: aspect-ratio boxes from Sanity image
  metadata so there is no layout shift, responsive `srcset` via the Sanity image
  pipeline, lazy below the fold, semantic headings in order, localized metadata,
  Open Graph images, and a sitemap. Full-bleed media raises the stakes on all of
  it: a screen-filling image is the largest thing the site downloads, so the
  poster still is what ships first and the video, when it exists, loads after.
- Headings under a demoted type scale: the heading a screen reader announces and
  the 11px label a reader sees are the same element. Small type is a visual
  decision, never a semantic one, so heading order stays correct even though
  nothing looks like a heading.

---

## 6. Content model (Sanity)

Designed so the studio is pleasant for a non-technical owner: clear field labels
in Italian and English, helpful descriptions, sensible previews, drag to reorder.

- Collection: name, slug, season, statement (localized), cover media, display
  order, published flag.
- Statement (revised 2026-08-01): it is two or three short lines in the
  Sorcinelli register, not a paragraph. The field is a localized text area whose
  studio description says exactly that and shows the line count expected. Line
  breaks are meaningful and are preserved; the layout sets each line on its own
  line at `--t-statement`. It is not rich text and it is not a blurb. The copy
  itself stays a marked placeholder until the owner writes it; the brand's voice
  is not something to invent here.
- Garment: name, slug, reference code, parent collection, category (Uomo /
  Donna, required, for catalogue filtering), available sizes, price, currency
  (default EUR), materials (localized, default "100% pelle italiana" / "100%
  Italian leather"), measurements of the sample piece, description (localized),
  image gallery with alt text (localized and required), not-currently-offered
  flag with an optional one-line explanation (localized), display order.
- Sizes: the garments are remade on request, not one-of-one. The size list is a
  set of standard sizes plus "Su misura / Made to measure", and the owner ticks
  which of them a given garment offers. The list lives in exactly one editable
  file, `studio/schemaTypes/constants/sizes.ts`, and the range in it is
  PROVISIONAL until the owner supplies the real one (see the need-from-you
  list). Made to measure is not a size but a switch: it is what makes the
  enquiry form ask for chest, shoulders and length in centimetres, so its value
  string stays stable.
- Measurements: the reference measurements of the sample piece that was
  photographed, not of the garment a buyer receives. Since pieces are remade to
  the requested size, this is context for judging cut and proportion, and the
  studio label says so in both languages.
- Not currently offered: this replaces the old sold-out flag, and it is not a
  sold state. Nothing sells out when everything is remade. The flag means the
  brand is not taking requests for that piece right now: the garment stays
  visible, only the enquiry action is disabled, with a short explanation.
- Media, the shared building block (NEW 2026-08-01, video-ready). Every place
  the site shows something visual uses one object, so adding video later changes
  no layout and no schema:

  ```
  media {
    poster:  image     REQUIRED. the still. also the video's poster and fallback.
    alt:     localeString  REQUIRED (it + en), on the poster.
    video:   file      OPTIONAL. short muted loop, mp4 (h.264) or webm.
    overlay: 'paper' | 'ink'   REQUIRED. the polarity of any label laid over it.
    caption: localeString  OPTIONAL. one short line, if this media needs words.
  }
  ```

  Rules that come with it: the poster is required even when a video exists, so
  every screen has something to show before playback and with motion disabled.
  Video is muted, looping, `playsinline`, `preload="none"`, and never autoplays
  under `prefers-reduced-motion`, where the poster simply stands. The player is
  NOT built yet; only the schema and the layout are shaped for it.
- Overlay polarity is an owner decision, per media item (DECIDED 2026-08-01).
  The studio asks "testo sopra: bianco o nero" and the site obeys. No scrim, no
  gradient, no gray: solid paper or solid ink over the picture. A human looking
  at the photograph beats a luminance heuristic on a frame that is bright in one
  corner and dark in the other.
- Collection uses one media (the cover). Garment uses an ordered list of media
  (the gallery). The existing gallery image field becomes this object; alt text
  stays required in both languages.
- Site settings: Instagram URL, contact email, about text (localized), shipping
  and returns text (localized), one logo file (the signature SVG inherits color,
  so there is no second polarity file, see section 3).

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
9. Media is the default state of a screen and it is always full bleed. No card,
   no frame, no margin, no rounded corner on any photograph or video, at any
   breakpoint. Margins are for running text.
10. No display type. Nothing on this site is set larger than `--t-chapter`
   except the signature. If a screen feels weak, the answer is a better
   photograph or more emptiness, never a bigger word.
11. Text over media is solid paper or solid ink, chosen per media item in the
   studio. No scrim, no gradient, no gray, no blend mode. If neither polarity is
   legible on a given photograph, that photograph carries no text.
12. Video stays cheap and free. Short muted loops as Sanity file assets, poster
   always required, nothing autoplays under reduced motion. Sanity's free tier
   allows roughly 100GB of asset bandwidth a month and video is the one thing on
   this site capable of eating it, so keep loops under about 15 seconds and only
   where they earn their place. If usage ever approaches the cap, the fix is
   fewer and shorter loops, or serving them from Cloudflare, not a paid plan.
13. Nothing paid. The domain is the only paid item on this project. Everything
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

- `{SIGNATURE_LOGO}`: SUPPLIED. `assets/logo/logo-signature.svg` (plus a PNG
  raster of the same mark). One file serves both polarities because it paints
  with `currentColor`. There is no second, inverted file to ask for.
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
- `{NOT_OFFERED_NOTE_IT}`, `{NOT_OFFERED_NOTE_EN}`: the one line shown in place
  of the enquiry button when a garment is flagged not currently offered and the
  owner has not written a per-garment explanation. Neutral, short, no promise
  about when it returns.

Service credentials, needed only when each piece is wired, never to scaffold:

- `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_READ_TOKEN`.
- `RESEND_API_KEY`, `RESEND_FROM` (a verified sending domain), `ENQUIRY_TO_EMAIL`.
- `CLOUDFLARE_DEPLOY_HOOK_URL`, plus the Sanity webhook pointed at it.
- Cloudflare Web Analytics site token.

Legal: entity details for a privacy page covering the enquiry form and the
cookieless page count.

### Added during the build (kept current)

- Sanity projectId and dataset: SUPPLIED 2026-08-01. projectId `lq2xg1yd`,
  dataset `production`. Both are public identifiers, not secrets, and they live
  in the untracked `.env` and `studio/.env` (copies of the committed
  `.env.example` files). Still to confirm in the Sanity console: the dataset is
  Public, and the CORS origins `http://localhost:3333` and
  `http://localhost:4321` are allowed.
- Size range: STILL PENDING, and the only thing blocking the size system. The
  one-of-one question is ANSWERED (2026-08-01): garments are remade on request,
  so a size field exists again. What is missing is the real range. The list
  currently in `studio/schemaTypes/constants/sizes.ts` is a provisional S, M, L
  plus "Su misura / Made to measure"; it is not the brand's list and must not
  ship as one. Send the real sizes (letter sizes, Italian numeric sizes, or per
  garment) and only that one file changes. The XS-XXL placeholder is not coming
  back.
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
- Test photography (NEEDED NOW, 2026-08-01, to judge the revised layouts). The
  minimum set is in section 14. Nothing about the media-first direction can be
  judged against placeholders.
- Signature weight at hero scale (OPEN, for the owner's eye). The mark is a
  filled path, not a stroke, so stretching it to `--sig-hero-w` scales its
  thickness with it: hairline on a phone, noticeably heavier at 1440px and
  above. Three ways out, and this is a judgement call about the mark, not a
  technical one: cap the hero width so the strokes stay thin, accept the heavier
  desktop presence, or supply a lighter-weight version of the signature for
  large sizes. Decide once there is real photography to see it against.
- Statement copy per collection: two or three short lines each, in the brand's
  own voice, IT and EN. Held as `{COLLECTION_STATEMENT_IT}` and
  `{COLLECTION_STATEMENT_EN}`. Not invented here; see section 4 for the register.
- Logo files: SUPPLIED and committed, in `assets/logo/`:
  `logo-signature.svg` (2712x615 viewBox, `fill="currentColor"`, so it inverts
  with the page) and `logo-signature.png` (the same mark, 2712x615, RGBA). One
  mark, not a pair. Nothing further is needed here.

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

Content-model corrections (2026-08-01, third round). The brand answered the open
question: the garments are remade on request, they are not one-of-one. That
answer moves four things:

- Size field restored, as an array of ticked options on each garment, not free
  text. The list is standard sizes plus "Su misura / Made to measure" and lives
  in one file, `studio/schemaTypes/constants/sizes.ts`, exported as
  `SIZE_OPTIONS` with the made-to-measure sentinel as `MADE_TO_MEASURE`. The
  range in that file is provisional and flagged in the need-from-you list.
  Validation warns rather than blocks while it is provisional.
- Made to measure drives the enquiry form. Selecting it reveals chest, shoulders
  and length in centimetres. Not built yet; the value string is fixed now so the
  form can key on it.
- Measurements re-labelled. It is the sample piece's reference measurements, not
  the buyer's garment, and the studio label and description now say that in both
  languages.
- The sold-out flag is gone, replaced by `notOffered`. Nothing sells out when
  every piece is remade. The new flag means "not taking requests for this piece
  right now": the garment stays visible, the enquiry action is disabled, and an
  optional localized `notOfferedNote` (shown only when the flag is on) carries
  the explanation, falling back to the `{NOT_OFFERED_NOTE}` tokens. No content
  migration is needed: the dataset holds no published garments yet.
- Category (Uomo / Donna) is unchanged.
- Consequence of the logo correction: `siteSettings` now has one `logo` field
  instead of `logoBlackOnWhite` and `logoWhiteOnBlack`.

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

## 13. The working environment (local machine, verified 2026-08-01)

This section previously described the ephemeral cloud container the project was
scaffolded in. That container is gone and none of its constraints apply. The
working environment is now the owner's own Mac, and everything below was checked
on that machine on 2026-08-01 rather than carried over.

Machine: macOS (Darwin 25.5.0), repo at `/Users/salvatoreambrosino/aleksander-cecco`.

Verified working here:

- Node v24.14.0, npm 11.9.0. `npm install` (root and `studio/`), `npm run check`
  (0 errors, 0 warnings, 0 hints), `npm run build` (static build into `dist/`),
  `npm run dev` (site on http://localhost:4321) and `cd studio && npm run dev`
  (studio on http://localhost:3333) all pass on this Node. The earlier note said
  "use Node 20 or 22"; 24 is what is installed and what the toolchain is now
  verified against. Set the Cloudflare Pages Node version to match a current LTS
  (22 or 24), not 20.
- No proxy of any kind. `git config` has no `url.*.insteadOf` rewrite, no
  `http.proxy`, and the shell has no proxy variables; npm goes straight to
  https://registry.npmjs.org/.
- GitHub is fully reachable, `codeload.github.com` included (HTTP 200). The old
  note said codeload was blocked, which is why the project was scaffolded with
  Astro's documented manual setup instead of `npm create astro@latest`. That
  block was the container's, not this machine's. The manual setup is standard,
  is what is in the repo, and needs no undoing.
- Git 2.50.1 (Apple Git-155). Remote is
  `https://github.com/salvatoreambrosino18-ship-it/aleksander-cecco.git`,
  credentials come from the macOS keychain (`credential.helper=osxkeychain`),
  and `git ls-remote origin` authenticates without prompting. The GitHub CLI
  (`gh`) is not installed; nothing in this project needs it.
- Sanity project `lq2xg1yd`, dataset `production`, set in the untracked `.env`
  and `studio/.env`.

Pinned versions (verified installed on this machine, not just declared):

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

Running it, from a clean clone: `npm install` at the root, `cd studio && npm
install`, copy `.env.example` to `.env` and `studio/.env.example` to
`studio/.env` and fill in the Sanity ids above, then `npm run dev` for the site
and `npm run dev` inside `studio/` for the studio. Full instructions are in the
README.

A note for a future session reading this file: do not trust an environment claim
in a handoff note, including this one. Check it. The constraints in the previous
version of this section were real where they were written and wrong everywhere
else.

---

## 14. Reference study, verified live on 2026-08-01

STATUS: VERIFIED, NOT REMEMBERED. The three sites were rendered in headless
Chrome at 1440x900 and 390x844 on 2026-08-01, with consent and promo overlays
removed rather than accepted, and every number below was read out of the live
DOM with `getComputedStyle`. A future session should treat these as findings of
record and NOT re-derive them from memory or from what these brands are
generally said to do. Re-measure only if the direction is being questioned
again, and date the result when you do. Hover states and transitions were NOT
observed: headless rendering does not hover.

### Findings that corrected the brief (verified 2026-08-01)

Three things widely assumed about Rick Owens were checked against the live site
and are false as of this date. They are recorded here because each one was about
to be designed into our site:

1. There is NO stretched wordmark. The mark is a small script signature centered
   in the header, about 180px wide on a 1440px viewport. Our stretched-signature
   hero is our own decision and must be argued on its own merits, never as "what
   Rick Owens does".
2. The chrome does NOT disappear. A persistent sticky header, 1440x60, stays at
   the top of the page. It survives by being 11px and using mix-blend-mode so it
   inverts over whatever is beneath it. What is hidden behind "Menu" is the
   87-link navigation, not the header.
3. Most tiles carry NO caption at all. 26 visible text runs on the entire
   homepage, and they are navigation and category labels. The imagery is
   overwhelmingly wordless. "Full-screen video with a small caption over it"
   overstates how much text is on that site.

### How the three references are weighted

Ranked by how much each one actually tells us about this brand's situation, on
the evidence rather than on reputation:

1. FILIPPO SORCINELLI, primary. A hairline handwritten signature over full-bleed
   media is literally our asset and literally our situation. The single most
   useful measurement in this study is its mobile behavior: the mark grows from
   19% of the viewport width on desktop to 49% on a phone. The mark gets
   proportionally BIGGER as the screen gets smaller. That is the model for our
   opening gesture and for the corner mark.
2. RICK OWENS, secondary. Consulted for two things only: the type scale (10 to
   11px, 0.08em tracking, 88% uppercase, nothing larger anywhere) and the
   video-first structure (full-bleed autoplay loops, poster always present, no
   gutters, no cards).
3. VIVIENNE WESTWOOD, last, and close to dropped. A conventional e-commerce site
   with a 325x375 product card grid. It is a mood reference for the clothes and
   is not a model for this site. Nothing in the build should cite it.

### On monochrome (DECIDED 2026-08-01)

None of the references is monochrome; the Rick Owens homepage is currently
saturated acid green. Pure white and pure black is the OWNER'S constraint, not
something inherited from the references, and it stays. It is also the thing that
keeps this site from being a pastiche of the three: the signature already exists
in both polarities, the inversion is the one structural idea the site owns, and
the palette is what makes the result this brand's rather than a copy of anyone.

### Verification finding: chrome legibility (2026-08-02, RESOLVED)

Found while checking the built pages against the brand's own photographs, and
recorded rather than papered over. RESOLVED the same day by the owner's
decision, recorded at the end of this subsection.

The fixed chrome (signature top left, MENU top right) floats over full-bleed
photography and takes its polarity from the image beneath it. One polarity value
per image is not always enough, for two reasons:

1. `object-fit: cover` re-crops every photograph to the viewport, so the band
   under the chrome on a phone is a centre column of the file, and at desktop it
   is a different region again. A value measured against the file can be wrong
   on the device. Four of the nine seeded images had their value corrected once
   the measurement was redone at phone crop.
2. The signature and MENU sit at opposite corners of the same band. On the
   collection cover at desktop, the left corner falls on a dark garment and the
   right corner on a pale wall, so whichever polarity is chosen one of the two
   is weak. The seeded set shows this on `/collections` and the collection page
   at 1440px: the signature reads well, MENU is marginal.

RESOLUTION (owner, 2026-08-02): MENU moves next to the signature, both top
left. The two marks now share one small local background, so a single polarity
value is always right for both, and the defect is removed rather than worked
around. The rejected alternatives are kept here because they explain why this
one was chosen: accepting a marginal MENU on some frames; putting the chrome on
a flat band of page colour, which reintroduces the persistent bar the direction
removed; or suppressing chrome over hostile frames, which needs a rule for where
the chrome goes instead.

Measured effect of the move, across all nine seeded frames: the weakest chrome
contrast rises from about 2.4, which is unreadable, to 5.51. One overlay value
changed as a result (IMG_2378, back to paper), because the corner the marks
occupy is dark leather even though the full width of that band is not.

A second benefit, not the reason for the move but worth recording: the caption
sits bottom left and the marks now sit top left, so both live in the same column
of the frame. One overlay value is therefore far more likely to serve both. The
two-band conflict is not gone in principle. Nothing in this set trips it now.

WHAT REMAINS, and it is inherent to putting any mark over photography: the
signature is a wide mark and can still straddle a boundary inside its own
corner. On the collection cover at 390px the tail of the mark crosses onto the
pale mannequin and goes faint. Three levers exist and all belong to the owner:
choose the other polarity for that frame, move the image hotspot in the studio
so the crop puts an even area under the marks, or accept it.

### Decisions confirmed by the owner (2026-08-01)

- Overlay polarity is picked per media item by the owner in the studio.
- Caption placement is picked per media item too: over the image, or below it on
  the page (ADDED 2026-08-02). This exists because the brand's own photography
  demanded it, not for symmetry. Three of the nine seeded frames are shot against
  bright concrete with a dark garment in shot, so the band where a caption sits
  contains both extremes: the polarity that wins on the mean still falls to a
  contrast of 1.1 to 1.6 somewhere in that band, which is unreadable. Forcing a
  value would have shipped an illegible caption over the owner's photography.
  When a caption sits below, the overlay value still governs the fixed chrome
  passing over the image, and is then read off the top band instead.
- The spine is scoped to text surfaces and stays off the photography.
- The diptych is withdrawn: capping the photograph at half the viewport
  contradicts the first principle.
- The 12 column grid is removed and the display scale is cut.
- The mono register is KEPT for now, on one condition, which is the test set in
  section 1 and is binding: mono marks facts that came off the garment and
  nothing else. If it ever starts reading as decoration rather than as data,
  drop to a single family and say so.

### Isaac Sellam (isaacsellam.com), verified 2026-08-02

Sent by the brand owner, described as: "you arrive on a photograph of a jacket,
you scroll, and the story appears." Rendered and measured like the others.

- The description is accurate. The sequence is exactly PHOTOGRAPH, then STORY,
  then PIECES: a full-bleed hero image (1440x990 desktop, 390x928 mobile, cover,
  filling the viewport), then a centred prose block of four sentence-case lines
  about the designer, then a labelled carousel of product cards with names and
  prices.
- One type size for the entire page: every text run measures 17.85px on desktop
  and 15.75px on mobile. No display type, but also no demotion to 11px labels.
  Uppercase is only 23% desktop and 5% mobile, against 88% on Rick Owens and 91%
  on Sorcinelli. The story is set in sentence case, as running prose.
- Palette: near-black page, text rgb(233,233,233), which is a light GREY, not
  white. Photography is black and white. We cannot copy the grey.
- Persistent header, 131px, with a logo lockup and ten visible nav items. No
  hidden menu on desktop. This is the most conventional chrome of the four
  references.
- It has a scroll cue: a chevron at the foot of the hero. Our plan cut that
  deliberately (section 10). Noted, not adopted.
- Product cards are 327x491 on desktop and 164x245 on mobile, two across. That
  is a thumbnail grid, which our brief forbids. Sellam is evidence for the
  SEQUENCE, not for the presentation of the pieces.
- 18 images, zero video.

Weighting: consulted for narrative order only. On type, palette, chrome and the
treatment of pieces it is further from this brand than Sorcinelli or Rick Owens.

### The home sequence question (OPEN, DEFERRED 2026-08-02)

Our home opens on the signature in emptiness and only then reaches a photograph.
Sellam opens on the photograph. The owner sent Sellam as a model, so this is a
real divergence and it is the owner's call, not a technical one. Both options,
with the tradeoff, are in the report accompanying this revision. The build keeps
the home page as a plain sequence of sibling blocks precisely so that reordering
it is a move, not a rewrite.

DEFERRED 2026-08-02, deliberately and not by oversight: the brand owner is to
see the current version, signature first, before the question is settled, since
he chose the reference and should say whether the signature opening reads as a
stronger arrival than the photograph does. Nothing is to be implemented until
then. The STORY SLOT comment stays in src/pages/[lang]/index.astro and the swap
stays cheap: move the opening block below the first cover, drop a story text
surface into the slot, no component or data change.

### Filippo Sorcinelli (filipposorcinelli.com)

- Page background near-black (rgb 16,16,16). The homepage is a sequence of
  full-bleed 1440x900 stills plus one video, all object-fit cover, edge to edge.
- 91% uppercase. Statement lines at 22px, weight 300, tracking 0.6px, laid over
  the image at lower left, in two or three short lines: "Ogni tavolo una storia.
  / Ogni sguardo un ricordo." This is the register section 4 now calls for.
- The identity mark is a hairline handwritten signature, white, top left, over
  full-bleed media: 275px wide on desktop (19% of the viewport) and 190px on
  mobile (49%). Proportionally much larger on the phone. This is the closest
  living analogue to our own asset and it is the evidence for the signature-led
  opening, more than Rick Owens is.
- Chrome: a 142px header with 17 visible links on desktop, collapsing to three
  icons and a hamburger on mobile. Overlay text is mid-gray at partial opacity,
  which we cannot copy under the black-and-white rule.

### Rick Owens (rickowens.eu/en-us)

- Body font-size 10px. The largest text run anywhere near the top of the
  document is 11px, letter-spacing 0.88px (0.08em), uppercase. There is no
  display type on the homepage at all.
- 88% of visible text runs are uppercase. 26 text runs on the entire page, and
  they are navigation and category labels (SALE, FW26 TOWER, EYEWEAR, BAGS,
  SHOES). Most media carries NO caption.
- 14 videos, every one autoplay, loop, muted, with a poster. Desktop: one
  1440x900 video, then pairs of 720x900 side by side, touching, no gutter.
  Mobile: 390x844 then a stack of 390x488. Zero margins anywhere.
- Persistent sticky header, 1440x60, using mix-blend-mode so it inverts over
  whatever is beneath. Menu, Search, wordmark, Account, Bag. The 87-link
  navigation is what is hidden behind "Menu", not the header itself.
- The wordmark is a small script signature centered in that header, about 180px
  wide at 1440. It is NOT stretched edge to edge. Our stretched-signature hero
  is our own decision, and should not be justified as "what Rick Owens does".
- The homepage imagery is saturated acid green and yellow. These references are
  not monochrome. White and black is this brand's constraint, not theirs.

### Vivienne Westwood (viviennewestwood.com/en-us)

- The weakest of the three for this direction, and it should not carry equal
  weight. 45 images, zero video, 16px Helvetica body, largest type 32px.
- One full-bleed hero with centered uppercase type over it, then a conventional
  product grid of 325x375 cards, standard e-commerce chrome, a newsletter modal.
- It supports "full-bleed hero with type over it" and contradicts "imagery is
  everything, no grids". Treated as a mood reference for the clothes, not as a
  model for the site.

### What was generic, honestly

Asked which parts of the original plan were fashionable ideas rather than
choices made for this brand, the answer is: more than is comfortable.

- The 20rem display scale. Pure "editorial fashion site" reflex. Nothing in any
  reference is set larger than 32px. This was the biggest error in the plan and
  it drove the wireframes, the type tokens and the whole home page.
- "Extreme scale contrast" as a principle. It sounded severe and it was
  borrowed. The references get their severity from a photograph filling the
  screen next to 11px type, which is a contrast of media against text, not of
  type against type.
- The 12 column grid. Design-system furniture. It appeared in the token list and
  in the desktop notes and was never visible in a single wireframe. Removed.
- The diptych for the garment page. A standard product-page pattern dressed up
  as a concept, and it caps the photograph at half the viewport. Withdrawn.
- The spine, partly. No reference has a hairline rule anywhere. It survives
  because it is genuinely useful on text screens and because it gives the wash a
  structure, but it has been scoped to text surfaces and kept off the
  photography (DECIDED 2026-08-01).
- Two typefaces, partly. The references use one family and let case, tracking
  and weight do the work; Rick Owens sets an entire site in one weight of one
  face. Our mono register is kept because a made-to-measure brand has real hard
  data to show and mono marks it honestly, but it is now narrowed to that data
  only. If it ever reads as decoration, drop to one family.
- "One large movement per moment" as the motion thesis. Reasonable, but the
  references do not choreograph scroll at all: they play video. Motion budget
  should be reconsidered when motion is built, after the layouts are right.

What was NOT generic, and stands: white and black only, bilingual and both first
class, enquiry instead of checkout, mobile first, the refusal to invent brand
assets or copy, images never cropped into decorative thumbnails, and the
inversion itself, which comes from the brief's own idea that the page has two
states.

### Minimum test photography set

To judge the revised layouts, the studio needs, at minimum:

1. One collection cover: portrait, at least 2000px on the long edge. Ideally the
   frame that would later carry a video.
2. Two garments, three images each: full length on model or form (portrait), one
   detail or texture crop, one back or alternate view.
3. One landscape or wide frame, to prove what a horizontal composition does when
   forced full bleed on a phone.
4. One clearly BRIGHT image and one clearly DARK image, so the per-media overlay
   polarity is exercised in both directions rather than assumed.
5. Optional but valuable: one short muted video loop (8 to 15 seconds, mp4
   h.264, ideally under 8MB) with its poster still, so the video-shaped layout is
   real before the player exists.
6. Alt text in Italian and English for every one of them, since it is required.

That is nine stills, optionally one loop. Fewer than that and the layouts get
judged against placeholders, which is how the last set of wireframes went wrong.

---

## 15. Ambient sound (schema only, 2026-08-02)

The owner wants storm sound on entry. The field exists in site settings; the
player does not, and no audio file has been supplied yet.

Why it cannot work the way it was asked for: every current browser blocks audio
that begins without a user gesture. A site that tries is muted by the browser,
so the effect would simply not happen for most visitors. It would also be the
wrong thing to do to someone opening the site on a phone in public.

Intended behaviour when it is built:

- A small corner control, in the label register, in the same paper or ink as
  everything else. No icon set, no third color.
- OFF by default, always. Sound begins only when the visitor asks for it.
- The on/off state persists across pages, so a visitor who turned it on does not
  have to keep turning it on. Persisted client side (localStorage), no cookie,
  no third-party script, nothing to consent to.
- It stays off under `prefers-reduced-motion`, and the control says so rather
  than silently ignoring the request.
- One short loop, muted-friendly: the page is complete and coherent in silence,
  exactly as it is complete with motion disabled.

What is built now: an optional `ambientAudio` file field on site settings, with
help text in both languages explaining the constraint, so the owner is not left
expecting autoplay. Nothing plays audio anywhere in the site yet.

---

## 16. Deployment (Cloudflare Pages, free tier, 2026-08-02)

Static build, deployed from the GitHub repository, so a push to `main` updates
the site. No custom domain: the address is `<project>.pages.dev` until the name
is decided and bought.

### What is free, verified against the docs on 2026-08-02

- Cloudflare Pages Free: 500 builds a month, 1 concurrent build, up to 20,000
  files per site, 25 MiB per asset, requests to static assets unlimited and
  free. This site builds 15 pages and a handful of assets, so nothing is close
  to a limit. Free is a plan, not a trial.
- Deploy hooks are a Pages project feature and cost nothing. The hook URL needs
  no authentication, which is exactly why it is a secret: anyone holding it can
  trigger builds. It lives in `.env` and in the Sanity webhook, nowhere else.
- Sanity webhooks are included and fire on publish. Free plan, single dataset.
- Images are served from the Sanity CDN, which counts against the free asset
  bandwidth allowance already audited in section 12.

Nothing in this deployment needs a card, a trial, or a paid plan. If a step ever
asks for payment details, stop and raise it rather than entering them.

### The build

- Build command `npm run build`, output directory `dist`, root directory the
  repository root.
- Node version set through a `NODE_VERSION` environment variable, 22 or 24. The
  toolchain is verified on 24.
- Environment variables, all PUBLIC and none of them secret:
  `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`,
  `PUBLIC_SANITY_API_VERSION`, `PUBLIC_SITE_URL`.
- `SANITY_WRITE_TOKEN` must NEVER be added to Cloudflare. It exists so the seed
  script can write from this machine. The site itself only reads, and reads a
  public dataset, so it needs no token at all.

### Keeping an unfinished site out of search results

The site carries visible {PLACEHOLDER} copy and seeded test content, so it is
kept out of the index by two independent locks:

1. `<meta name="robots" content="noindex, nofollow">` on every page, and a
   `robots.txt` generated to match. Both follow one switch,
   `PUBLIC_ALLOW_INDEXING`, which is unset (and therefore off) everywhere.
2. `X-Robots-Tag: noindex, nofollow` on every response, from `public/_headers`.
   Deliberately manual: a header cannot be generated from an environment
   variable in a static build, and a second lock that has to be removed by hand
   is the right kind of friction in front of an unfinished site.

Note the deliberate choice inside `robots.txt`: crawling is ALLOWED. A
`Disallow: /` would stop a crawler fetching the page, which means it never sees
the noindex answer, and a URL linked from anywhere could still be listed with
nothing under it. Allowing the crawl and replying "noindex" is what actually
keeps a page out of the index. The sitemap is generated but not advertised.

### TO REMOVE AT LAUNCH, in full

1. Set `PUBLIC_ALLOW_INDEXING=true` in the Cloudflare Pages environment
   variables for the production branch, and redeploy. This flips the meta tag
   and makes `robots.txt` advertise the sitemap.
2. Delete these two lines from `public/_headers`, and commit:

   ```
   /*
     X-Robots-Tag: noindex, nofollow
   ```

3. Confirm on the live site: `curl -sI https://<site>/it | grep -i x-robots-tag`
   returns nothing, and `curl -s https://<site>/robots.txt` shows the `Sitemap:`
   line.
4. Only then submit the sitemap anywhere.

Do not do any of this while {PLACEHOLDER} copy is still visible on the site.

### Content publish triggers a rebuild

A deploy hook on the Pages project, called by a Sanity webhook that fires on
publish. The hook URL is a secret: it goes in `.env` as
`CLOUDFLARE_DEPLOY_HOOK_URL` and into the Sanity webhook form, and nowhere else.
If it leaks, delete the hook and create another; the only damage is unwanted
builds against the 500 a month.

### Deployment verified live, 2026-08-02

Live at https://aleksander-cecco.pages.dev on the free tier, pages.dev
subdomain, no custom domain.

Working, checked against the deployed site rather than locally:

- Both languages: `/it/` and `/en/` render, `lang` attributes correct, canonical
  and hreflang all pointing at the pages.dev origin, so PUBLIC_SITE_URL is set
  correctly in Cloudflare.
- A garment page loads its photographs from the Sanity CDN in the deployed
  build: `srcset` offers six widths from 640 to 2560, every one returns 200, and
  the page renders them in a real browser at 390px with no horizontal overflow.
- Both noindex locks are live: `X-Robots-Tag: noindex, nofollow` on every
  response, including robots.txt, the sitemap and the fonts, plus the meta tag
  in every page.
- robots.txt is served, allows crawling on purpose, and does NOT advertise the
  sitemap. The sitemap itself exists with 14 URLs, 7 pages in each language.
- The custom 404 answers with a real 404 status.
- Fonts carry the immutable cache header.
- The bare root now answers a real 301 to /it via `_redirects`.

BROKEN, and it needs the owner: PUBLISHING IN SANITY DOES NOT REBUILD THE SITE.

Evidence, in order:

1. A field was published in Sanity. Six minutes later the live site was
   unchanged.
2. A git push to `main` put the same change live in about 40 seconds, so the
   build pipeline, the git trigger and the build-time Sanity fetch all work.
3. The field was restored in Sanity. Five more minutes with no push, and the
   live site still showed the old value.

So the failing link is the trigger, not the build. Two things to check, and the
first one is almost certainly it:

- `CLOUDFLARE_DEPLOY_HOOK_URL` is EMPTY in `.env`. The key is there, the value
  never landed. If the same paste went missing when the Sanity webhook was
  configured, the webhook is pointing at nothing.
- In sanity.io/manage > API > Webhooks: the hook must be enabled, on dataset
  `production`, HTTP method POST, triggering on create, update AND delete, with
  no filter. Its delivery log shows the response code for each attempt, which
  says immediately whether it is firing and being refused, or not firing at all.

The check can be re-run at any time with `node scripts/verify-webhook.mjs`. It
publishes a marker, watches the live site, restores the field, and never reads
or prints the hook URL.

### The publish chain, wired and tested (2026-08-02)

How it is wired, so no future session has to rediscover it:

```
publish in Sanity Studio
  -> Sanity webhook (sanity.io/manage > API > Webhooks)
     dataset production, POST, on create/update/delete, no filter
  -> Cloudflare Pages deploy hook (Pages project > Settings > Builds)
  -> Pages build: npm run build, which fetches content from Sanity at build time
  -> deploy to https://aleksander-cecco.pages.dev
```

There are TWO triggers and they are independent. A push to `main` builds the
site from the repository. A publish in Sanity builds it through the webhook. Both
produce the same output, because content is fetched during the build either way.

CONFIRMED WORKING. The webhook did not exist during the first attempt, which is
why that test failed. With it in place, two independent observations:

- A studio edit at 15:03:02Z was live by 15:04:29Z, about 90 seconds.
- A published change through the API was live roughly 7 minutes later.

NOT YET RELIABLE, and worth knowing before trusting it. A third change,
published at 15:20:25Z, had still not appeared 21 minutes later, while the
dataset plainly held the new value. A git push then put it live in about 40
seconds, as git pushes consistently have. So the build is not the problem; the
trigger is intermittent.

Where to look when it lags, neither of which is visible from this machine:

- Sanity: sanity.io/manage > API > Webhooks, the delivery log for that hook.
  It lists each attempt and its response code, which distinguishes "never fired"
  from "fired and was refused".
- Cloudflare: the Pages project build log. The free plan runs ONE build at a
  time, and triggers that arrive while a build is running can be cancelled
  rather than queued, which would explain a change that never lands while
  neighbouring ones do.

Until that is understood, treat a git push as the dependable way to force a
deploy. `node scripts/verify-webhook.mjs` re-runs the test end to end: it
publishes a unique marker, watches the live site, restores the field, and never
reads or prints the hook URL.

A caution learned the hard way: the automated verdict from that script and the
manual observation disagreed once, the script reporting a timeout for a marker
this session had already seen live. Trust the live page over the script, and
report both when they differ.

