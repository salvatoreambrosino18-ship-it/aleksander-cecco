# Aleksander Cecco - Design Plan (Approved)

## HANDOFF — read this page, then the launch checklist under it

Written 2026-08-10 when the code was finished, and **rewritten 2026-08-11 after
the owner made every page paper** — which the first version of this page went on
contradicting for a day (section 84). **Everything remaining belongs to the
owner.** This page is meant to stand alone: nothing below assumes you were here
before, and the numbered sections it points at are depth, not prerequisites.

**If you are looking for what is still undecided, it is THE OPEN LIST at the
foot of this page, and it is the only place such a thing may live.** A proposal
in a session report, a commit body or a chat message is a proposal this project
will lose; four of them nearly were.

**If a comment in the code and this page disagree, one of them is out of date
and the answer is to LOOK AT THE SITE.** A wrong comment compiles.

### 1. What this is

A SHOP for **Aleksander Cecco**, a leather atelier in South Italy. Live at
https://aleksander-cecco.pages.dev, two languages (Italian and English, both
first class), deliberately kept out of search results until it can lawfully
sell. Astro + Sanity + Cloudflare Pages; content in Sanity, one Pages Function
for the order flow, no other services.

**The brand is TWO PEOPLE** — Ciro Cecco and Ferdinando Palmieri, in
collaboration with Ferdressed. About is built around that, not around one
portrait. The pieces are called **Creature**, his word, and the site uses it as
a noun everywhere.

The shape, which is settled:

- **A flat menu**: HOME NEW CREATURE PROCESS ABOUT CONTACT, then INSTAGRAM and
  IT/EN — two groups separated by whitespace alone, no rules, no sub-items.
- **/new** is the current drop, in his own drag order in the studio.
- **One catalogue page** carries all seventeen Creature in three movements
  (available, 1 of 1, sold out) with a CSS-only filter by who a piece is for.
- **A piece → order flow**: "Acquire — €X" → an order page that takes a NAME
  AND AN EMAIL → "Order received". Email via Resend from one Function. **No
  payment exists**; Stripe slots into one return statement in that Function when
  he has a fiscal position.
- **THE BUYER CHOOSES A SIZE AND HE MAKES THE PIECE IN IT** (section 101, and
  section 100 records the THREE answers this question has had in ten days —
  read that before touching it). XS to XL, plus ONE SIZE as an explicit tick
  rather than an empty list. Made to measure survives as one line on each piece
  inviting an email. **The wait is stated as a maximum — two weeks — where a
  person decides and where they confirm.** Published measurements are no longer
  fit information; only Oblivion's survive, as reference.
- **/process** is the single home of imagery. There is no gallery route.
- A free-shipping banner on every commerce page; not on the culture pages.

Two typefaces, **four type voices and no fifth**: label, body, display, and mono
for DATA ONLY (prices, measurements, counts). Two colours, **ink `#0a0a0a` and
paper `#fafaf8`**, and nothing else — no gray, no scrim, no accent. Every page's
ground is paper (section 2); ink is what text and marks are set in, and the
polarity of anything sitting ON a photograph is measured per image.

### 2. EVERY PAGE IS PAPER, and the boundary is written by the reader

**The owner decided this (s82), having been told what it costs. It is the
newest structural decision on the site and the one most likely to be undone by
a session reading older pages of this file.**

There is one ground: paper, `#fafaf8`, on every page, in both languages, at
every width. No page passes a `theme`. The only inversion left anywhere is the
menu panel, which inverts against the page it covers.

**The home page still has its structural moment, and it is now his hand.** The
wash is one held screen at the same boundary as before, and crossing it means
**writing the brand's name with your own scroll**: the signature is traced by
the reader's own scroll progress, stroke by stroke, in the order a pen would
take. The mark used to be decorative on top of a colour inversion; it is the
whole event now. With JavaScript off or motion reduced it is simply the
finished mark on a held screen, which still reads.

**What was removed, so nobody rebuilds it by accident:** twenty-five
`theme="dark"` declarations across six pages, the wash's two stacked layers,
its clip-path, its polarity props, and `--ease-inversion`, the curve the
inversion travelled on.

**What was paid, and it should be said plainly rather than explained away:** ink
and paper are no longer two halves of an argument, and Tenebrae and Lux are now
words in his statement rather than something the site performs. Sections 77 to
80 contain the argument for the other arrangement — ENTER IN DARKNESS, BUY IN
LIGHT — and it was a good one. It is closed. Read it as history, not as a rule.

**What survived and is NOT the same thing: polarity over photography.** A
caption or a mark sitting ON a frame takes the measured polarity of the pixels
under it (`overlay`, `overlayCaption` per image). That is legibility, it is
load-bearing, and it is untouched by any of the above. Do not tidy it away while
removing page polarity.

**THE CHROME NO LONGER SITS ON PHOTOGRAPHY AT ALL** (section 87, the owner's
call). The signature and MENU take their own height in page ground at the top of
every page; the photograph begins under them; the mark reads 19.6:1 everywhere.
`overlayChrome` and the tool that measured it are gone. **This is not a scrim
and standing rule 11 is intact** — nothing is laid over a photograph and no
value between ink and paper is painted anywhere. A veil was rendered, measured
and rejected (section 86); nobody is to reintroduce one believing they are
restoring something.

### 2b. WHAT MOVES, and it is four things

The site's motion is one system: one curve, each gesture once, everything
degrading to nothing under reduced motion or with JavaScript off.

- **A photograph arrives** as it enters — opacity and 24px, never scale.
- **The tile becomes the piece**: tapping a catalogue tile carries that
  photograph into the Creature's arrival (section 94). One element is named, at
  the moment a finger lands on it.
- **The grid settles** when a filter changes, so the page has visibly answered.
- **A line is drawn** under anything you point at, focus, or press — the last
  covering the buyer on a phone, who had no acknowledgement at all.
- **His hand writes**, twice and once each: the signature signs the arrival on
  paper (section 96), and the reader writes it again with their own scroll at
  the boundary wash.

Nothing moves that must be read, and nothing competes with a photograph. **A
fifth gesture needs an argument in this file**, not a preference.

### 3. The state: it cannot launch, and that is correct

`npm run launch-check` reads the live dataset and **refuses** while anything
invented is still in it. On 2026-08-13: **79 things still ours rather than his**,
plus 69 images whose alt text no human has approved. **Run the command rather
than trusting these two numbers** — the first was 47 two days earlier and 77
this morning, they move whenever he files photographs or we write a line on his
behalf, and a number in a document is a number going stale. Two of the 79 are
not copy we wrote but CHOICES we made inside his material and flagged as such:
`aboutMadeToMeasure` (section 108) and `contactFrame`.

Everything invented is deliberately **invisible to a visitor** — braces and
"unapproved draft" marks make a real brand look like a rehearsal — so the whole
bargain rests on that command refusing. Every flag lives in the studio, on
`inventedFields` per Creature and `inventedCopy` on site settings.

Three things gate launch and none of them is code:

1. **Legal.** Untouched. It gates the Resend secrets AND the newsletter. The
   order form takes three BODY MEASUREMENTS; that needs a real privacy notice
   with a named controller.
2. **His content.** Prices, compositions, measurements, seven unnamed Creature,
   descriptions. Listed exactly in the checklist below.
3. **A fiscal position**, before payment can exist at all.

### 4. What must not be redone

Each of these was decided, usually against a rendered alternative, and several
were decided by the OWNER. Reopening one costs a session and lands where it
started.

- **One polarity** (s82, the OWNER's call, made against a rendered alternative
  and against the whole of s77–s80). Every page is paper. The argument for two
  is closed, not paused.
- **Prose is COMPOSED with a photograph, never sequenced between it** (s82). The
  four references were re-measured for running prose specifically and **a column
  of words alone on flat ground appears in none of them.** Which passages may
  hold a screen is decided by REGISTER, not by taste: `register="body"` must be
  paired; `register="statement"` — a short held line at display size — may hold
  a screen alone, which is why `/new` and a drop's page were left alone.
  **AND NO PARAGRAPH GETS ITS OWN SCREEN ANYWHERE (s107, s108).** The references
  set MANY paragraphs in one narrow column beside one photograph and never give
  a paragraph a screen; /about, /process and /contact are each one column beside
  one frame for that reason. Adding a second paired surface to a page to carry a
  second short passage is the mistake /process was making — merge the column.
- **In a paired surface the PHOTOGRAPH NEVER SETS THE HEIGHT** (s108). It is
  absolutely positioned so the passage decides the room and the picture fills
  it. `min-height: 56svh` is the floor and the only thing between the
  composition and a letterbox. `npm run shots -- --rhythm` prints the row
  against its photograph; if they ever differ, the hole is back.
- **The spine is a margin rule and does not travel** (s82). A hairline in the
  middle of an empty screen is a divider between two dead zones. It is dropped
  only where a composition already has a real edge: the seam of a paired
  surface, at desktop, where that seam exists.
- **The four-across catalogue grid** (s65), rendered against three and chosen.
  **Two across on a phone** is the owner's call (s67); a tile keeps the
  photograph's own 3:4, never a viewport height.
- **The flat menu** (s67). Sub-items under Creature were CONSIDERED AND REJECTED
  by the owner: a menu entry that drops a visitor mid-page is disorienting. DROP
  returns to the menu only at five or six drops.
- **Gender is a filter, never a structure** (s67). Never a route, never a
  section. Unset is legitimate and shows under every filter; do not guess the
  eleven that are unset.
- **The four type voices** (s67). A fifth is not to be added. The largest type
  getting smaller was the price, and it was paid deliberately.
- **1 of 1 pieces carry no remake option** (s67), confirmed by the owner: they
  are private commissions, bought only as they are.
- **The gallery dissolution** (s65). Imagery lives on /process.
- **The order framing** (s65). It is an order, not an enquiry.
- **The splash screen, refused three times** (s79) — the third time with numbers.
  The best version of it was: draw the signature on paper while the arrival
  photograph decodes, so the ceremony occupies time already being spent. It was
  measured against the live site rather than argued:

      Slow 4G  400kbps   FCP 1284ms   photo ready 3512ms   window 2228ms
      Fast 3G  1.6Mbps   FCP  540ms   photo ready 1749ms   window 1209ms
      unthrottled        FCP  148ms   photo ready  213ms   window   65ms

  The signature's own draw is ~2.9s. So the window is shorter than the ceremony
  on every connection, and on a normal or repeat visit it is 65ms — anything
  filling it is manufactured delay. **And the window is not empty:** screenshots
  at 1400ms and 2200ms on Slow 4G show the photograph already painting, the
  signature already writing over it, and the drop name, his line, the price and
  the way in all present. A paper screen would cover working content, not fill a
  gap. It would also invert the page before the wipe, spending the site's one
  meaningful inversion at random.

  **He already has the arrival he is describing, on a phone.** Where it fails is
  the desktop crop, where the mark crosses pale concrete at 1.39:1. That is a
  photograph problem, not a missing feature.
- **The display token at 28px** (s68). It sits above every reference's measured
  maximum; the numbers are recorded. Do not re-litigate it.
- **The catalogue's numbered breaking point** (s73): pieces > 24 or drops > 3 →
  paginate by drop; drops ≥ 5 → DROP returns to the menu. **Test the counts, do
  not re-judge the design.**
- **The fixed-path icons** (s78). Deleting them is correct-sounding and wrong;
  see the traps.
- Reference measurements (s14), sizes (s17, 41), ready-versus-remade (s31, 41,
  49), caption polarity (s58), the Drive survey BY CONTENT (s47, 64), the drop
  filter condition (s62, 65), **his biography and the legal text (never ours)**.

### 5. Traps that have already bitten

- **A PHOTOGRAPH CAN CHANGE UNDERNEATH A KEY THAT HAS NOT CHANGED, AND NO BUILD
  CHECK CAN SEE IT** (s80). The most valuable failure this project has produced,
  because every signal was green and only LOOKING caught it.

  A file called `HOMEPAGE.JPG` appeared in a Drive folder behind a key that had
  resolved to a 4284x5712 leather detail for a week. It was a **screenshot of
  the owner's other shop** — two phone frames side by side, menu and cart
  visible. The import resolved the key to it and made it the drop's cover.

  **Nothing complained, and nothing could have.** It is a valid image at a valid
  key. The alt text comes from the plan and did not change, so the page went on
  claiming to show a leather detail. `npm run build` was green. `verify-build`
  passed — there were plenty of photographs. The browser audit reported nothing,
  because a screenshot of a website is a perfectly legible photograph with good
  contrast. Types clean, launch-check clean. It was found by opening the
  rendered page and seeing another website inside the chapter block.

  **Why no check can catch this in general.** Every automated check here asks
  whether the OUTPUT is well formed. This is a failure of REFERENCE: the output
  is exactly what the plan asked for, and the plan asked for the wrong picture.
  A machine would have to know what the photograph is supposed to depict, and
  the only record of that is the alt text — which comes from the same plan and
  is therefore wrong in the same way.

  **What defends against it, and why neither is enough:**

  1. **Pinning.** A frame that matters more than its filename is pinned to its
     asset id (`SALVAGED`) rather than resolved through a folder. Total for the
     frames it covers, useless for the rest, and pinning everything would throw
     away the reason the import exists.
  2. **The upload list.** Every non-dry import prints what it UPLOADED and asks
     you to recognise each line. An upload is the exact moment a key starts
     pointing somewhere new, because a photograph already in the dataset is
     matched by sha1 and never uploaded twice. A good signal, and still only a
     signal: it fires on legitimate additions too, it says nothing when a key is
     re-pointed at a file already in the dataset, and it depends on being read.

  **THE ONLY REAL DEFENCE IS A PERSON LOOKING AT THE RENDERED PAGE AFTER AN
  IMPORT.** Not the diff, not the log, not the counts — the page. `npm run
  shots` exists to make that cheap. Budget the five minutes; this cost a drop
  cover, and it was live.

- **A GATE THAT ASKS THE WRONG QUESTION LOOKS EXACTLY LIKE A GATE THAT WORKS**
  (s80). For months `launch-check` asked, of every value, *is this ours rather
  than his?* — and never asked *is this value there at all?*

  Both questions had the same answer for as long as the seed data lasted,
  because everything seeded had been given a plausible INVENTED value, and an
  invented value is flagged. So the gate looked complete and was confirmed by
  every case that existed.

  Rubedo separated them. It returned to the catalogue with no price and no
  measurements — nothing invented, nothing to flag — and shipped `{PRICE_EUR}`
  and `{MEASUREMENTS}` onto a live page carrying a buy action, while the gate
  reported everything accounted for. A visible placeholder is the precise
  failure the invisible-and-flagged bargain exists to prevent.

  **The general shape, worth more than the fix:** when two questions have the
  same answer across every case you have, you cannot tell which one your check
  is actually asking. The gap hides until the first case that separates them
  arrives — and it arrives as a live page. Write down which question a check
  asks, then go looking for the case where that differs from the question you
  meant.

- **A DECISION THAT LIVES ONLY IN A SESSION REPORT IS A DECISION THE PROJECT
  WILL LOSE** (s84, and it is the reason THE OPEN LIST exists). Four open
  proposals were carried in a chat message and nowhere else; a fresh session
  reading this file could not find them, because they were never in it. The
  same failure in slower motion is a COMMENT THAT OUTLIVES ITS DECISION: after
  s82 removed page polarity, the handoff's own front page, the `theme` prop the
  handoff points at, and three comments on the home page all went on arguing
  ENTER IN DARKNESS, BUY IN LIGHT to whoever read them next. Every check was
  green, because a wrong comment compiles. **When a decision changes, the same
  commit must change every place that argues the old one** — and the place to
  look is whatever the handoff tells a stranger to read.

- **`Astro.slots.has("default")` ANSWERS A DIFFERENT QUESTION THAN THE ONE YOU
  MEAN** (s84). It is true when children were PASSED, not when they render
  anything. A Creature page passes `{index === 0 && (...)}` to every frame, so
  every frame after the first rendered an empty `<figcaption>` — and in the
  "below" placement that is `frame py-u3`, about 50–70px of blank paper opening
  between two full-bleed photographs on the shop's most important page. Thirty
  three of them in the English build alone. Valid markup, no content, no check
  that could see it: it is section 80's shape again, a question whose answer
  matched the one you wanted until the first case that separated them. Render
  the slot and ask whether it produced anything.

- **A WHOLE SITE BUILT FROM PLACEHOLDERS IS INDISTINGUISHABLE FROM A CORRECT
  BUILD BY EVERY SIGNAL EXCEPT LOOKING AT THE CONTENT** (s78) — not the exit
  code, page count, asset list, file sizes, timings or the wall of green.
  `npm run build` now refuses on it. Do not delete `.sanity-failures.log` to
  make a build pass.
- **GROQ takes `//` comments only.** A block comment in a projection triggers
  exactly the failure above.
- **Never address a plain nested object by a dotted path in a Sanity mutation**
  (s78). It replaced four media objects with a bare string. Read whole, write
  whole. Document history is what saved it.
- **An unhashed path outlives its deletion by the edge's TTL** (s78). Deleting a
  URL does not remove it from the internet; it hands it to whatever cache still
  holds it. Cloudflare served the old broken touch icon for 4.9 days after the
  origin began 404ing it.
- **A fetch from the origin is NOT proof of what was deployed** (s74). Always add
  a cache-buster query when checking an unhashed path; `Cache-Control: no-cache`
  on the request does not defeat the edge.
- **Verify generated binaries by LOOKING at them** (s74). A correct SVG says
  nothing about the PNG rendered from it.
- **`wrangler pages dev` sends REAL email** — `.env` holds live Resend keys.
  Always `--binding ENQUIRY_DRY_RUN=1`, and prove the dry run fired by its log
  line; `--log-level error` silently suppresses it.
- **Never set the Resend secrets or open the newsletter before the privacy
  notice exists** (s36, 62).
- **Tailwind utilities beat `@layer components`, always** (s67). Anything a rule
  there hides must get its `display` from that rule.
- **`@utility` with a nested range media query compiles to NOTHING, silently**
  (s70). Grep the compiled CSS for any new rule before trusting it.
- **`sizes` lies silently** (s69): a quarter-width tile declaring `100vw`
  downloads sixteen times the pixels and nothing flags it.
- **Prove every check can fail before trusting its pass.** The audit has lied
  five ways historically; the browser harness added a sixth by photographing
  before the page had settled and inventing a defect that was not there, and a
  seventh by reloading into a 404 and measuring THAT page's caption.
- **DO NOT BUILD WHILE THE HARNESS IS RUNNING** (s79). `npm run check` ends in
  `astro build`, and a build CLEARS dist/ before rewriting it. A walk in flight
  then serves 404s for real pages and photographs the site's own 404 page —
  which is what produced four phantom faults on four Creature pages that were
  fine. Every navigation AND every reload now asserts what it landed on, so it
  is a loud refusal instead of noise in a long log.
- **Local servers must be owned by the process that needs them.** One started
  with `&` dies with its shell call.

### 6. The tools, and the rule about them

    npm run build          builds AND refuses a placeholder build
    npm run check          types, then a build
    npm run launch-check   the state of the content, in one command
    npm run shots          a real browser: --audit --prove --only= --force=light|dark
                           --chrome=  renders a treatment without shipping one
                           --weigh    what a route costs at 400 kbps (section 91)
                           --rhythm   how empty each section is, and each half of
                                      a paired one (sections 105, 108)
                           --slice=N  cuts a capture into strips you can look at;
                                      a 20,000px page opened whole is a thumbnail
                           --viewports=1440,1920  name the widths (default 390,1440)
    npm run icons          both icon shapes from one SVG: --check compares them
    npm run detail-crops   construction crops from his own frames: DRY by default
    npm run patch-loop     the one video onto /process: DRY by default
    npm run measure-captions  the caption band's polarity and placement, per frame
    npm run import         Drive → Sanity, READ ONLY, flags every invented value

One-shot patches to the dataset, run with `node scripts/…`, DRY by default, each
recording verbatim what it changed and why:

    patch-made-to-measure.mjs  "Su Misura" out of his approved text (section 108)
    patch-contact-frame.mjs    flags OUR choice of the /contact photograph, and
                               un-flags it the moment he sets `contactMedia`
    patch-name-order.mjs       Ciro before Ferdinando, inside his sentence (s65)

`npm run measure-chrome` was DELETED on 2026-08-11 (section 87): the chrome
stopped floating over photography, so there is no band left to measure.

**Three tools have now died in temporary folders and each death cost a real
defect, and a fourth was written at the repository root on 2026-08-13 before
being folded in as `--slice` (section 108).** If you are about to write a
renderer or a capturer, add a flag to one of these instead. And `--prove` must go red before you believe a green.

**AFTER EVERY IMPORT, LOOK AT THE PAGES.** Not the log, not the counts — the
rendered pages. A screenshot of another website became the drop's cover with
every check green, because a photograph can change underneath a key that has
not changed and no build check can see it. `npm run shots -- --only=/it` is a
minute. The full trap is in the list below.

### 7. How the pieces fit

Sanity holds content. Push to `main` deploys reliably; publishing in Sanity
deploys intermittently (s16). The order flow — its email, its confirmation and
the slot where payment will go — is entirely in `functions/api/enquiry.ts`. The
photographs live in Sanity, never in the repository. The domain move is the
OWNER's task; when it lands, `PUBLIC_SITE_URL`, `RESEND_FROM` and
`ENQUIRY_TO_EMAIL` are the three values that change here.

### 8. Outstanding, and all of it is his

- The **worn band's order** (five frames; it is a studio field — drag
  `homeSequence`, first from the top is leftmost). Frame 5 has no linked piece.
- His **Instagram post links** — four frames, none carries a `postUrl`, so every
  square currently falls back to the profile.
- **`collection.season`** is empty; the drops card renders it the moment he sets
  it.
- His `about` field **repeats `homeStatement` and `makingStatement` verbatim**,
  so one sentence meets a reader on three pages. Ask him. Do not invent copy.
  (Also item 2 on THE OPEN LIST, because it needs a decision and not only a
  photograph or a price. Everything else in this section is material he owes.)
- The **opening photograph** cannot carry legible text of either colour: its
  caption band measures 1.5:1 worst case. The site stopped asking it to — the
  arrival's four lines sit on paper under the picture now (section 89) and the
  corner mark sits in the band above it (section 87). **What is still his**: a
  frame with a quiet band would let the words go back onto the photograph, and
  it is the only thing that clears the last two faults on the site, the drawn
  signature over the arrival at 1.49:1. This is photographic, not technical —
  **do not reach for a scrim.**

### OPEN, AWAITING A DECISION — THE OPEN LIST

*(Deliberately unnumbered: the numbered sections of this file run to 84 and
"section 9" already means one of them. Refer to this as THE OPEN LIST.)*

**Every question this project is holding open, in one place. Nothing that needs
a decision may live anywhere else** — not in a session report, not in a chat
message, not in a commit body. A proposal that is not written here does not
exist, and four of them nearly did not: they were carried in a message and a
fresh session could not find them (see the first trap in section 5).

The rule for this list: **an item leaves it only by being decided**, and the
decision is written INTO it, with where the argument lives. Nothing is deleted
for going quiet.

**The six carried over from before this session**

1. **The footer's shipping line — MY HALF IS BUILT AND HIS WORDS ARE IN THE
   FOOTER (2026-08-13, section 108).** The blocker was that `footerCopyIsDraft`
   is one boolean over both footer lines, so his sentence in that slot would
   have been labelled our draft. The per-line flag turned out not to need
   building: `inventedCopy` has carried `footerShipping` and `footerOrigin` as
   separate keys since section 59, and the SITE simply never projected the
   field. It does now, and each line asks about itself.
   **WHAT IS STILL HIS, and it is the smaller half**: the ORIGIN line, "Fatto a
   mano nel Sud Italia." / "Handmade in South Italy." Ours, still marked, and
   free for him to approve or replace.
2. **`about` repeats `homeStatement` and `makingStatement` verbatim**, so one
   sentence meets a reader on three pages. Home was cut to a single line and
   /process keeps the whole passage (s81), which reduced it but did not settle
   it. **His to settle; do not rewrite his words to remove a repetition.**
3. **Reference codes: used, or abandoned?** If the brand does not use them
   `referenceCode` comes out of the inscription.
   **CORRECTED 2026-08-13 (section 108): this list said "Every Creature shows
   `{REF_CODE}`" and no page does.** The token appears nowhere in the built
   HTML — the field is absent and every use of it is guarded — so this is a
   decision he can take at his own pace rather than a placeholder on a live
   page. Nothing is broken while he takes it.
4. **Two weeks: working hours or elapsed?** One answer moves every price in
   section 32 by a factor of two and a half. It blocks nothing on the site and
   governs what a price means.
5. **Four open identifications** (section 48): two vests carrying one name, two
   pale trouser documents carrying two of his names, whether MONUMENTUS is the
   collection or a product family, and whether the men's/women's folder split is
   meant to reach the site after Uomo/Donna was removed on his own words.
6. **Two marks left for his eye.** The signature's weight at hero scale
   (section 9 — the mark is a filled path, so its strokes thicken as it grows,
   and the cap in `--sig-hero-w` is a guess nobody has judged), and the home
   sequence's order (section 14, deferred 2026-08-02 — the worn band is a studio
   drag order and frame 5 still has no linked piece).

**The four brought to this session (2026-08-11), and what became of them**

7. **Detail points on the photography — REFUSED, and the refusal is ACCEPTED
   (2026-08-11).** A Mammut-style interactive point, tapped for its
   construction. The need is real and is the best observation the proposal
   carried: his photographs are atmosphere, not evidence, and a buyer sending
   three body measurements for a four-figure made-to-measure piece cannot see
   the cut. The FORM fails on four counts, argued in section 84 — and the
   finding that closed it is that **the mechanism already exists and has never
   been used: fifty-six Creature frames, zero captions.**
   **WHAT IS NOW OPEN IS HIS, NOT OURS**: three detail photographs per piece,
   each with one line of his own words. The brief is `docs/SCATTI-DETTAGLIO.md`,
   written in Italian for him — what to shoot, how close, in what light, what to
   write under each, and where it goes in the studio. **It costs him an
   afternoon and it is the highest-value thing left in the project.**
   **HALVED 2026-08-11 (section 86), by looking at the files instead of assuming:
   41 of 83 frames carry a croppable detail at or above the size the site
   already publishes.** Eight pieces are covered by cropping what he has shot —
   the scar-stitch, the hole, the seams, the zips, the hems, and his own
   handwriting inside Rubedo's collar. Eight still need him: styrax, styrax-red,
   glovyes, capo-09, severya, capo-07, capo-04, capo-14. **The thirteen crops
   were imported on 2026-08-11 and are live with empty captions** — see item 12,
   which is where this item now continues. The sentence under each is still the
   part only he can give.
8. **Photographs that expand as they enter — NOT BUILT, and the owner has
   declined to overturn it (2026-08-11).** He wants the effect; the one place it
   could mean something is a Creature's arrival, and that is exactly the frame
   that must never animate — it is the LCP element (s24, s69). Every other frame
   on that page is the same piece continuing, and a continuation cannot arrive.
   His words on reading the argument: three gestures that each mean something,
   rather than four where one is a tic. **It stays here rather than closed: it
   is his to overturn whenever he wants it, and nobody else's.**
9. **The process page as a scroll-driven sequence — REFUSED as scroll-driving.
   The real fault it uncovered is now FIXED (2026-08-11, section 85).** The
   eight making frames were a narrative — pattern, cut, dye, dry, build — with
   up to two unrelated artistic frames dealt between every stage, so the
   sequence existed in the data and was unreadable on the page. **The owner
   decided to unweave it**: eight making frames consecutive in work order, the
   artistic frames as a coda. It partly reopens s65 and section 85 records
   exactly which part. Nothing was added — no captions, no words, no motion.
10. **VIDEO — refused (section 90) and then SHIPPED PROVISIONALLY on the
    owner's call (section 93). It is live on /process now and must come off
    before launch.** At 1440 it is plainly the weakest frame on the site; at 390
    it passes. The replacement is one message: the camera original.
    The survey that refused it: `video aleksander cecco.mp4`: 26s, **464 x 832**, 30fps, with
    an audio track, 4.29 MB. It shows the right thing — one continuous take of a
    garment being hung, his own work — and it cannot go on the site: its long
    edge is 832 against a 1200 floor, so at the size a phone actually paints it
    the leather has no grain; nothing in it loops (first to last differs by 84.7
    of 255, and the best six-second window still ends 33.9 away); its first
    frame is a different picture from the arrival's poster; and its caption band
    swings across the clip to 2.59:1 for white and 1.07:1 for black — the exact
    trap section 83 predicted, measured. **Nothing was imported or re-encoded**:
    re-encoding fixes the audio and the megabytes and neither is the problem.
    **THE ASK IS NOW ONE MESSAGE**: the camera ORIGINAL, sent by AirDrop or
    Drive rather than WhatsApp or Instagram, which re-compress on send. That
    file is 1080 x 1920 on his phone. With it, the window is already chosen —
    1.5s to 7.5s — and it belongs on /process, never on the arrival, which needs
    a locked-off frame of one material moving rather than a cut from a take.

**Opened 2026-08-11**

11. **THE MARK OVER HIS PHOTOGRAPHY — DECIDED AND BUILT (2026-08-11, section
    87).** 118 of 152 audit faults were the brand's own mark; 71 of 97
    placements had no legible side; the worst was 1.00:1. **The owner took the
    BAND**: the chrome stopped floating, takes its own height in page ground,
    and reads 19.6:1 everywhere with no per-image judgement ever again. It cost
    the full-bleed top edge on the two culture pages, and it deleted
    `overlayChrome`, its 97 measurements, `measure-chrome`, the chrome observer
    and half of section 83's video trap.
    **THE NO-SCRIM RULE SURVIVES INTACT.** The band is not a scrim and not a
    weaker one; nothing is laid over a photograph and no value between ink and
    paper is painted anywhere. What was overturned is the ASSUMPTION under the
    rule — that the chrome must float over full-bleed photography (section 14,
    the owner's own call of 2026-08-01, made before this photography existed).
    Nobody is to reintroduce a veil later believing they are restoring
    something.
12. **THIRTEEN DETAIL CROPS ARE ON THE SITE AND THIRTEEN SENTENCES ARE NOT
    (2026-08-11, section 88).** The crops came out of his own files; the caption
    under each is empty because the sentence is his. Every one is flagged
    `needsCaption` and named by `npm run launch-check` until he writes it.
    **The list to send him is `docs/RIGHE-DA-SCRIVERE.md`**: thirteen lines,
    each naming the piece, the detail and the URL of the page it sits on, so he
    can open a page, look at the photograph and write the sentence.
    `docs/SCATTI-DETTAGLIO.md` is the longer brief and also names the exact
    detail missing from each of the eight pieces whose photographs are too small
    to crop. **This is now the highest-value item he owns, and it is an hour of
    shooting plus thirteen lines rather than an afternoon.**

13. **THE OPENING PHOTOGRAPH — the fault it caused is CLOSED (section 96), and
    the ask is smaller now.** The drawn signature no longer sits on it: the
    ceremony moved onto the paper beneath, ink at 19.6:1, immune to any
    photograph he ever shoots. **The site audits clean.**
    What is still worth having from him, and it is no longer a defect: an
    opening frame with a quiet band would let the arrival's four lines go back
    ONTO the picture (they sit under it since section 89), which is the stronger
    composition. Wanted, not needed.
14. **THE CAMERA ORIGINAL OF THE ONE VIDEO.** A 464px messaging-app copy is live
    on /process tonight, marked provisional, and it is the weakest frame on the
    site at 1440 (section 93). The original is 1080x1920 and one message away;
    `docs/SCATTI-DETTAGLIO.md` section 3 is the ask in Italian. **This is the
    only thing on the site marked to be replaced before launch.**

15. **THE SIZES, SIXTEEN PIECES, and it is sixteen ticks.** Every purchasable
    Creature needs XS-to-XL chosen or ONE SIZE ticked, and `launch-check`
    refuses until each is answered (section 101). **An empty list is not One
    Size**: it is nobody having decided, and the two are deliberately different
    states.
16. **THREE ERRORS IN HIS OWN ENGLISH, shipped unaltered (section 99).** "Our
    leathers is tanned", "it change", "the Mother Nature". They are his, they
    are on the home page, and the rule that protects his voice protects his
    mistakes until he chooses. **Ask him; do not fix.** Two of the three read
    like the way this brand has always sounded.
17. **CLOSED 2026-08-12 (section 103): the photograph of Ferdinando** is
    `IMG_3485.PNG`, which was already in the dataset as the worn band's
    unidentified frame 5. It is first in BODY OF LIGHT now, linked to no
    Creature, because it is a person rather than a piece.
18. **CLOSED 2026-08-12 (section 103): his four photographs** were compared
    against every asset by picture rather than by hash. Three were already here;
    `hp4-our-skins` was new, is uploaded, and is composed with the three
    reasons.
19. **THE WITHDRAWAL RIGHT, now the first question in the lawyer brief.** A
    piece made after the order in the size the buyer chose sits between
    made-to-measure and off-the-shelf, and the brief asks it as a question
    rather than assuming either answer. **It governs returns copy that is
    already live on every piece page.**

20. **A LOCKED-OFF CLIP FOR THE ARRIVAL, if he wants film on the home page.**
    The answer changed on 2026-08-13 (section 106): the argument that killed it
    was contrast over the photograph, and there is no longer any text over that
    photograph to break. What remains is that nothing in the take he sent loops,
    which no resolution fixes. **Ask for: 6-10 seconds, camera still, one
    material moving, first and last frame identical, no audio, camera original.**

21. **THE MATERIAL THAT WOULD LET THE REST FOLLOW** (section 107,
    `docs/MATERIALE-DA-FOTOGRAFARE.md`, in Italian, ordered by impact). One
    consistent pale-ground shot of every piece — the single change that would do
    most, because the catalogue grid is where the references' light actually
    lives; a six-second locked-off loop whose ends match; eight to ten
    full-length on-model frames shot the same way; the detail frames still
    missing for eight pieces; and any archive photography at all.
    **This list is worth more than anything built against it.**
22. **"SU MISURA" / "Made to Measure" IS OUT OF HIS TEXT — EDITED BY US, FLAGGED,
    AND THE ORIGINAL RECORDED (2026-08-13, section 108).** It was a question for
    him; it stopped being one when the sentence was a false claim about the terms
    of sale on a page a buyer reads, on /about AND on /process. **Two words
    deleted, nothing added, nothing reordered**, so what is left is still
    entirely his words in his order. Flagged `aboutMadeToMeasure` in
    `inventedCopy` exactly as the name order was (section 65); `npm run
    launch-check` counts it.
    **THE ORIGINAL, so it can be put back without archaeology**: "In pelle 100%
    conciata al vegetale, Su Misura, fatta a mano nel Sud Italia." / "In 100%
    vegetable-tanned leather, Made to Measure, handmade in South Italy." It is
    recorded in `scripts/patch-made-to-measure.mjs`, in both seeding scripts,
    and in the `inventedCopy` field description in the studio, which is where he
    would act on it.
    **WHAT IS STILL HIS**: approve the shorter line, or write a different one, or
    put his back. The flag stays until he says.
23. **THE CONTACT PHOTOGRAPH IS OUR CHOICE (2026-08-13, section 108).** /contact
    is composed with one frame now instead of being a column of words on flat
    ground. He can set `contactMedia` in the studio and it wins; with nothing set
    the page takes the last frame of the about sequence, and that fallback is
    flagged `contactFrame` and named by `launch-check` until he chooses.
    **With this dataset every frame is already used somewhere**, so "pick an
    unused one" was never available — which is item 21 again, in one page.

---

## THE LAUNCH CHECKLIST (2026-08-03)

**Everything standing between this repository and a site the public can use**,
in the order the dependencies actually run. The rest of this file is the
reasoning behind it; this is the state.

**Where it stands (2026-08-10).** Built, deployed and working at
https://aleksander-cecco.pages.dev, in two languages, with **seventeen
Creature**, a working order flow and a real contact address, deliberately kept
out of search results. The gallery route was dissolved into /process (s65); the
count and the route above are the current ones. **The code is finished.** What
remains is the owner's, and **the site cannot lawfully accept an order yet** —
that single fact governs the order below.

### 1. NEEDS A LAWYER, and it gates everything downstream

Nothing in this group can be written by the owner or by a developer. Until it
exists, step 3 must not be run.

- [ ] **Privacy notice.** The form collects **a name and an email address** —
      body measurements left the site on 2026-08-12 (section 98), which removes
      the special category that made this harder. It still needs a named data
      controller, the legal basis, what is collected, why, how long it is kept,
      and how to ask for deletion.
- [ ] **Terms of sale and a refund policy.** All four reference sites carry
      them. This brand sells at four figures, made to measure, internationally.
- [ ] **Right of withdrawal, and the answer probably CHANGED on 2026-08-12.**
      Distance selling in the EU has a statutory cooling-off period, and
      made-to-measure goods can be exempt from it. **The shop no longer sells
      made to measure** (section 98): every piece is sold as it exists, and
      goods sold as they are usually are NOT exempt. The question is simpler
      now and the answer is probably stricter. It changes the returns copy on
      the site.
- [ ] **A statement covering the analytics**, even though Cloudflare Web
      Analytics is cookieless.

### 2. THE OWNER MUST SUPPLY

Ordered by what blocks the most. Nothing here can be invented on his behalf.

**Blocks launch**

- [ ] **Legal entity details**: registered name, address, VAT number. Feeds
      group 1 and the site currently gives a buyer no way to establish that the
      business exists.
- [ ] **The seven unnamed Creature**: `capo-01`, `capo-07`, `capo-08`,
      `capo-09`, `capo-12`, `capo-13`, `capo-14`. **This is a filing job, not a
      shoot**: the photographs exist, they are simply not in a folder that says
      what they are. Renaming them the way he renamed MONUMENTUS, OBLIVION and
      STYRAX closes it (section 48).
- [ ] **Compositions** for the twelve Creature still showing `{MATERIALS}`.
- [ ] **Prices.** Every Creature shows `{PRICE_EUR}`.
- [ ] **THE SIZES HE MAKES EACH PIECE IN.** Sixteen purchasable Creature have
      none chosen and `launch-check` refuses on every one. It is sixteen ticks
      in the studio: XS to XL, or ONE SIZE for anything that fits everyone.
      **This replaced the measurements blocker** — with a size choice deciding
      fit, the fifteen invented measurement sets were deleted rather than left
      flagged, and only Oblivion's own numbers remain, as reference.
- [ ] **Reference codes**, or a decision that the brand does not use them, in
      which case `{REF_CODE}` is removed rather than filled.
- [ ] **Which pieces are available now**, by putting their frames in the
      `Disponibilita immediata` folder. The folder exists and is empty, the
      import reads it by content, and nothing on the site claims availability
      until he files something (section 49).
- [ ] **REPLACE EVERYTHING INVENTED.** On 2026-08-03 the site stopped showing
      braces and started showing a finished product: sixteen prices, twelve
      compositions, sixteen sets of measurements, seven names and thirteen
      descriptions were WRITTEN BY US. None of it is his. It is invisible to a
      visitor by design and flagged everywhere it can be acted on, and
      **`npm run launch-check` refuses while any flag is set, so this checklist
      cannot be completed until it passes.** The full list is section 59.

**Does not block launch, but the site is weaker without it**

- [ ] **THIRTEEN SENTENCES, one under each detail crop now on the site**, and
      **eight pieces still to photograph** — down from three photographs of all
      seventeen, because 41 of 83 frames already carried a croppable detail
      (section 88). The crops are live with empty captions, flagged
      `needsCaption`, and `npm run launch-check` names every one until he writes
      it. `docs/SCATTI-DETTAGLIO.md` is the brief, in Italian, ready to send:
      the thirteen lines to write, where they go in the studio, and the exact
      detail missing from each of the eight pieces. **Start with Rubedo** — his
      own Instagram caption already contains two of the thirteen, and the third
      is his handwriting inside the collar. This is the highest-value item he
      owns.
- [ ] **Approve or replace the intro lines** (shop, drops, contact, worn, home
      chapters) and the ORDER-flow copy, all flagged in inventedCopy.
- [ ] **Choose the four Instagram frames.** The section is live and the four in
      it are OUR selection of his photographs, flagged as `instagramFrames`.
- [ ] **The closer texture frame** for the home arrival, the reason the current
      one repeats `capo-12`'s only photograph (section 54).
- [ ] **A real photograph of the hat.** Its only frame is a crop of the designer
      portrait and is marked provisional on the page (section 46).
- [ ] **On-model frames** for the eleven Creature that have never been worn in a
      photograph. This caps the home page's worn band at five.
- [ ] **One landscape frame for the gallery**, which has none, so the page is a
      uniform wall of pairs at desktop (section 56).
- [ ] **His biography**, and the separate decision of whether his name appears
      in public at all (section 44). `{DESIGNER_BIOGRAPHY}` until then.
- [ ] **Two weeks: working hours or elapsed?** One question that moves every
      price in section 32 by a factor of two and a half.
- [ ] **The customs line**, which he is confirming with his partner and which
      ships marked unconfirmed until he does.
- [ ] **The eleven photographs** that vanished with `products/`. The site runs
      on salvaged copies from Sanity; if the originals are on his phone the
      salvage lines come out (section 47).
- [ ] **Four open identifications**: two vests carrying one name, two pale
      trouser documents carrying two of his names, whether MONUMENTUS is the
      collection or a product family, and whether the men's/women's folder split
      is meant to reach the site after Uomo/Donna was removed on his own words.

**Accounts he must open**

- [ ] **The domain**, `aleksandercecco.com`, approved and being bought.
- [ ] **A Resend account created with aleksandercecco@gmail.com**, and an API
      key. The address matters: with no verified domain the only permitted
      sender is `onboarding@resend.dev`, which delivers ONLY to the address that
      owns the account.

### 3. MINE TO DO

**Blocks launch**

- [x] **Fix the caption contrast over photography.** DONE 2026-08-11 (sections
      87 and 89). The chrome left the photograph entirely; the caption band was
      measured per frame by `npm run measure-captions`, nine frames changed, six
      moved onto the page, and the arrival's four lines came off the picture
      with the frame shortened to 88svh so they still meet a reader on the first
      screen. **The site audits at 2 faults, down from 152**, and both are the
      decorative drawn signature over the arrival — photographic, and his.
- [ ] **Privacy notice page and a consent line on the enquiry form.** Depends
      entirely on group 1.
- [ ] **Set the three Resend secrets in Cloudflare and redeploy.** Only after
      the privacy notice exists (section 36). Functions pick up secrets on a new
      deployment only.
- [ ] **The domain switch**, four steps, written out in section 29, once DNS is
      live. Step 3 of it is the secrets above and carries the same gate.
- [ ] **Remove the two noindex locks**, LAST, after everything else is true
      (section 16). One environment variable and two lines in `public/_headers`.

**Should be done, does not block**

- [ ] **Open the newsletter, once there is a privacy notice.** The capture form
      is live on the home page and COLLECTS NOTHING. Switching it on needs, in
      addition to the notice: separate unbundled opt-in consent, a working
      unsubscribe in every message, the sender's identity and postal address,
      a retained record of when and how each consent was given, and double opt-in
      as the defensible EU standard (section 62).
- [ ] **The payment step, when he has a fiscal position**: Stripe Checkout in
      the Function's confirmation slot, amount from the dataset. First paid
      thing on the project; ask before building (section 65).
- [ ] **Wire the Cloudflare Web Analytics token.** Decided in section 9, still
      not done, cookieless and free.
- [x] **Remove the three Resend values from the local `.env`.** DONE
      2026-08-13. Wrangler reads that file, so a form submitted against a local
      dev server sent REAL email. The three keys are emptied and the previous
      contents were moved to `~/.aleksander-cecco-resend.bak` (mode 600, outside
      the repository) rather than destroyed — the API key exists nowhere else
      yet, because the Cloudflare secrets are still gated on the privacy notice.
      The Function refuses to send with any of the three missing and logs that
      it is not configured, which is the correct local behaviour.
- [x] **Make the check gate catch what it missed.** DONE, and it was already
      done: `npm run check` has been `astro check && tsc -p functions --noEmit
      && astro build` since before 2026-08-13. Verified rather than assumed
      (section 108); the item was stale, not open.
- [x] **Give a paired surface a `priority` frame.** DONE 2026-08-13 (section
      108). It is a prop, not a rule: on home and about the first paired surface
      is the SECOND thing on the page and marking it priority would compete with
      a real arrival. The /process mosaic's first frame gave its `priority` up in
      the same change — two images declaring high fetch priority is two images
      competing, and the winner is not the one on screen.
- [x] **Correct the accents in the older Italian interface strings.** DONE
      2026-08-13 (section 108). Two errors, and only two: "che gia possiedi" and
      "Ogni pezzo e fatto". Found by scanning for a list of known unaccented
      forms rather than by reading, because a human reads past "e" for "è" every
      time.
- [x] **Decide the footer's shipping line.** DONE 2026-08-13 (section 108).
      His sentence is in the footer and carries no mark. The per-line flag did
      not need building: `inventedCopy` has held `footerShipping` and
      `footerOrigin` separately since section 59 and the site never projected the
      field. **What remains is HIS**: approving the origin line, which is listed
      under his items, not mine.

### 4. THE GATE

`npm run launch-check` reads the live dataset and exits non-zero while anything
invented remains. It cannot see the legal group or the service wiring, which are
human items above, but nothing invented can pass it. **Run it before believing
this list is finished.**

### 4b. THE ORDER, IN ONE LINE

Legal entity → privacy notice → contrast fix → domain → Resend secrets →
end-to-end test of a real enquiry → owner approves the marked copy → remove the
noindex locks.

Everything before "remove the noindex locks" can happen while the site stays
invisible. Nothing after it can be undone quietly.

---

## How to use this file

This is the approved design plan and the handoff document for building the
Aleksander Cecco site. **The launch checklist above is the current state; this
file is the reasoning behind it.** A fresh session, started inside this directory
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
- `{REPLY_WINDOW}`: RETIRED 2026-08-02. The owner committed to one day maximum,
  so the confirmation says "We reply within one day." and promises no more.
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
  (0 errors, 0 warnings, 0 hints; re-verified 2026-08-02, see the note below),
  `npm run build` (static build into `dist/`), `npm run dev` (site on
  http://localhost:4321) and `cd studio && npm run dev` (studio on
  http://localhost:3333) all pass on this Node. The earlier note said
  "use Node 20 or 22"; 24 is what is installed and what the toolchain is now
  verified against. Set the Cloudflare Pages Node version to match a current LTS
  (22 or 24), not 20.

  A correction worth recording, because the claim above was false for a while
  and nobody noticed. When the enquiry form landed (section 19), the Pages
  Function arrived in `functions/` and the root `tsconfig.json` included it via
  `**/*` while nothing supplied the Workers types. `npm run check` reported four
  errors from that day onward, and this file went on saying it ran clean. The
  fix, 2026-08-02:

  - `@cloudflare/workers-types` is a devDependency.
  - `functions/tsconfig.json` checks the function against the Workers runtime:
    `lib` of ES2022 plus WebWorker, `types` of `@cloudflare/workers-types`, and
    NO browser DOM lib, because that function never runs in a browser.
  - The root `tsconfig.json` excludes `functions` for the same reason in
    reverse: the site is browser code and must keep the DOM lib and must not be
    handed Workers globals.
  - `npm run check` runs both: `astro check && tsc -p functions --noEmit`.

  Applying the Workers types globally instead was tried first and also reported
  zero errors, which is precisely why it was rejected: it would have typed 46
  files of browser code against the wrong runtime to make one file pass.

  The gate was then confirmed to actually fail, rather than assumed to work: a
  deliberate type error and a call to a nonexistent method were added to the
  function, `npm run check` reported both and exited nonzero, and the file was
  restored. The error named `Request<unknown, CfProperties<unknown>>`, which is
  the Workers `Request`, confirming the function is checked against the runtime
  it really runs in. Do this whenever a gate is repaired: a gate that passes has
  proved nothing until it has been seen to fail.
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

STANDING NOTE, so a future session does not chase this as a bug: the publish
chain is INTERMITTENT by nature on this plan. Cloudflare Pages Free runs one
build at a time, and a trigger arriving while a build is running can be dropped
rather than queued. A publish that does not appear is therefore expected
behaviour under load, not a defect to debug. A git push is the reliable
fallback and has never failed to deploy, in about 40 seconds each time. If
deploys ever need to be dependable rather than convenient, that is a reason to
revisit the plan tier, and it is the first thing on this project that would cost
money, so it needs asking first.

Until that is understood, treat a git push as the dependable way to force a
deploy. `node scripts/verify-webhook.mjs` re-runs the test end to end: it
publishes a unique marker, watches the live site, restores the field, and never
reads or prints the hook URL.

A caution learned the hard way: the automated verdict from that script and the
manual observation disagreed once, the script reporting a timeout for a marker
this session had already seen live. Trust the live page over the script, and
report both when they differ.

---

## 17. Sizes removed, and why they must not come back (2026-08-02)

DECIDED by the brand owner. There are no sizes. Every garment is made to
measure, always, and nothing is produced in advance.

This REVERSES the decision of 2026-08-01 recorded in sections 6 and 11, which
kept a size list with made-to-measure as one option among several. That reading
was wrong: made to measure is not an option on this brand, it is the whole
method. A size field implies stock that exists before someone asks for it, and
the brand story says outright that no garment exists before it is requested.

What was removed: `garment.sizes`, `studio/schemaTypes/constants/sizes.ts`,
`src/lib/sizes.ts`, the sizes row in the technical block, and the size strings
in the interface. The `{AVAILABLE_SIZES}` token is retired.

DO NOT REINTRODUCE SIZES. If a future session finds a garment that seems to need
one, the answer is a reference measurement on that garment, not a size system.
The only thing that replaced the row is a constant line saying every piece is
built to the wearer's measurements, which is a fact about the brand rather than
a property of a document.

`measurements` survives and is renamed "reference measurements". With no sizes
it matters MORE, not less: it is the only way a visitor can judge cut and
proportion from a photograph. It describes the piece that was photographed, and
never the buyer.

The enquiry, when it is built, collects: contact details, chest, shoulders and
length in centimetres, and a note. That creates a copy requirement that did not
exist before, and it is not optional: the site has to explain HOW to take those
three measurements, or most people will send numbers that mean nothing.

### Seasons are optional, collections are not (2026-08-02)

DECIDED by the brand owner. Collections stay: they are how the brand organises
its work, and that is not a season question. `collection.season` becomes
OPTIONAL, so a collection can exist as a named body of work with no date
attached. It is left empty for now. This keeps the statement, which is where the
brand voice lives on a page, and keeps the chapter rhythm the inversion moves
between.

### Alt text policy (2026-08-02)

DECIDED by the brand owner, reversing the both-languages requirement of
section 11. Italian is required; English is optional and falls back to Italian.
Drafts are generated from the photographs and flagged `altIsDraft` until a human
approves them.

The reasoning is worth keeping, because the old rule looked stricter and was
worse: 69 images at two hand-written languages is 138 strings, and the realistic
outcome of demanding that is the word "foto" typed 138 times. An accurate
generated description that a screen reader user can actually use beats a
technically-compliant string that says nothing. The flag exists so approved text
can always be told from text nobody has read.

### The brand story is an unapproved draft (2026-08-02)

The story now in site settings was written for the brand, not by it, and the
brand owner has not seen it. `siteSettings.aboutIsDraft` is ON, and while it is
on the about page marks the text as a draft in the placeholder register. The
text stays fully readable, because the owner judges it by reading it on the
page. Replacing it is: paste the approved text, turn the flag off.

---

## 18. The archive, the home sequence, and the import (2026-08-02)

### The archive earns its place, on one condition

Built, and curated to nine frames from the twenty-seven unique archive images.
For a brand with no stock and no seasons the archive is the only evidence that a
body of work exists, which makes it close to the most important section on the
site. But thirty-five undated frames is a mood board, not an archive: one fact
per frame is what separates the two.

Form: a vertical sequence of full-bleed frames at `--media-h-tall`, so the next
one always peeks and the eye is pulled down. Never a grid. Never a thumbnail.
On the numbers, the whole archive is a scroll of about nine screens, against the
twenty-seven it would have been.

Curation rules used, so a future session can repeat them:

- one frame per distinct piece, never two views of the same garment;
- nothing below 2000px on the long edge, which excluded six low-resolution
  archive files outright;
- spread across kinds: outerwear, flat-lay, on-model, and one accessory.

WHAT THE OWNER MUST DECIDE, and it is marked `{NOME_PEZZO}` and `{ANNO}` on
every frame until he does: the year of each piece, its name if it has one, and
whether the pieces chosen are the ones he would choose. A year is the difference
between an archive and a pile of images, so if no years arrive, the honest
answer is to fold the best frames into the home sequence and drop the section.

### The home sequence is not a carousel

Built in the Rick Owens form, from the measurements in section 14 rather than
from memory of the site. What that reference actually does is NOT a horizontal
band: it stacks full-bleed tiles, 390x844 then 390x488 on a phone, and pairs
720x900 side by side and touching on desktop. No arrows, no dots, no
auto-advance, nothing moves by itself. The reader scrolls.

Ours measures 390x490 on a phone and 720px + 720px with no gap on desktop, which
is the reference to within two pixels. A tile may link to a garment, which is
what keeps the sequence a way into the work rather than decoration.

### Importing the owner's photographs

`npm run import` is deliberately separate from `npm run seed`: seed makes
disposable fixtures, import puts real work in, and merging them means one
careless seed overwrites real content. It reads the owner's Google Drive folder
READ ONLY, converts HEIC into the system temp directory with `sips`, and writes
nothing to the source or to the repository.

It decides three things by looking rather than guessing, and leaves the rest:

- grouping, from contact sheets of all 69 unique images: 39 photographs became 8
  garments and 9 archive pieces;
- Italian alt text per photograph, flagged `altIsDraft`;
- overlay polarity, measured in the top left of the phone crop where the chrome
  actually sits. Every imported frame lands above 4.3 contrast.

Names, reference codes, prices, descriptions and measurements are not invented
and ship as `{PLACEHOLDER}` tokens.

Two traps, both hit and both worth remembering: file URLs need encoding because
the source folder has spaces in its name, and extensions cannot be hard-coded
because the same batch mixes JPG, WEBP and HEIC, with two files carrying an
extension their neighbours do not. Files are resolved by folder and stem.

---

## 19. The enquiry form (2026-08-02)

Built and wired end to end. The form is the reason the site exists, so it is the
one thing that works without JavaScript from end to end: a static page per
garment per language, posting to a Cloudflare Pages Function that validates,
sends, and answers with a whole page.

### Why a Pages Function and not an Astro server route

The Astro Cloudflare adapter no longer supports Cloudflare Pages; it targets
Workers. Adopting it would have meant migrating the whole deployment off Pages,
losing the pages.dev URL, the git integration, the deploy hook and the Sanity
webhook already wired to it. That is an infrastructure decision for the owner,
not a side effect of building a form, so the form uses a Pages Function instead
and the site stays fully static. If a future session wants Astro server routes,
that migration is the price and it needs asking first.

### What it does

- Validates on the server, because nothing from a browser is trusted: name,
  a deliberately loose email check, and three measurements in centimetres with
  human ranges (chest 50-200, shoulders 25-90, length 30-200).
- Two spam checks that cost a person nothing: a field hidden from people but not
  from bots, and a refusal of anything submitted within three seconds of the
  page rendering.
- Answers with a small self-contained page in the right language: confirmed,
  or what to fix, or an honest failure. It never says an email was sent when
  none was.
- The reply is addressed back to the visitor, so answering goes straight to them.

Verified locally against Wrangler, which runs the same runtime Cloudflare does:
valid-but-unconfigured returns 503 and says so, invalid returns 422 listing every
reason in the right language, the spam trap returns 422, and a refused key
returns 502. The success page is the one path that cannot be tested without a
real key.

### BLOCKED ON THE DOMAIN

The form is complete and sends nothing, for one reason: Resend will not deliver
to arbitrary recipients from an unverified domain.

- With no domain, the only usable sender is `onboarding@resend.dev`, and Resend
  restricts delivery to the address that owns the Resend account. That is enough
  to prove the chain works, and useless for a brand receiving enquiries from
  strangers, because it can only ever email the owner.
- Once a domain exists: add it in Resend, add the DNS records it asks for (SPF
  and DKIM, both free), and set `RESEND_FROM` to something at that domain.
  Nothing in the code changes. Only the three secrets change.
- Resend Free stays free at 3,000 emails a month and 100 a day, no card. This
  brand will not approach that.

Until then the three secrets are unset, and the form tells anyone who submits it
that sending is not switched on yet, in their language. That is deliberate: a
form that silently swallowed enquiries would be worse than one that admits it.

### Still to write

The reply window. The confirmation says an email will come and marks
`{REPLY_WINDOW}` where the timing belongs. The brand is not committed to a
response time nobody has agreed.

---

## 20. The inversion wipe, built (2026-08-02)

Built as section 3 specifies: two stacked full-viewport layers, each a flat pure
theme, a hard edge scrubbed to scroll, confined to a boundary screen of the
signature, a label and the spine. No photograph is ever under the edge.

### Built without GSAP, and why

The stack in section 0 names GSAP with ScrollTrigger. The wipe needs neither,
and the owner chose the lighter route:

- Pinning is `position: sticky` on a child of a section one viewport plus
  `--wipe-pin` tall. Native sticky is what mobile browsers are built to do
  smoothly, and it is what GSAP's pin emulates with transforms.
- The edge is one CSS custom property, `--edge`, written by a rAF-throttled
  scroll handler and consumed by `clip-path: inset(0 0 calc(100% - var(--edge)) 0)`.
  Nothing moves, nothing reflows, and the layers repaint only flat colour and a
  little type.

Cost: zero kilobytes, against roughly fifty for GSAP plus ScrollTrigger on a
site whose whole argument is that photographs load fast. If later motion ever
needs a real timeline, the wash is self-contained and can be swapped.

### The three states, all verified

| state | wash height | pinned | incoming layer |
| --- | --- | --- | --- |
| normal | 2 viewports | sticky | clipped by the edge |
| prefers-reduced-motion | 1 viewport | no | hidden, polarity flips discretely |
| JavaScript off | 1 viewport | no | hidden, polarity flips discretely |

The pinned distance is added ONLY once the script has taken charge, keyed off
`data-wash-live` on the root. Without that, a reader with scripts off would
scroll a whole viewport for nothing, which is worse than having no effect.

### One bug worth remembering

The first version attached its scroll listener behind a counter of intersecting
elements. An IntersectionObserver fires once per observed element on setup,
including when it is NOT intersecting, so the counter started at minus one, the
listener never attached, and the edge sat at zero through the whole pinned
distance while everything else looked correct. It is a Set now. Anything
gating on "is it on screen" should be written the same way.

### Measurement

At 4x CPU throttling, scrubbing the full pinned distance: no frame over 20ms.
That is an approximation of a phone, not a phone. The real device test belongs
to the owner and is the one that counts (standing rule 3).

---

## 21. The home page as a narrative sequence (2026-08-02)

The owner's judgement, and it is the right one: the site read like a postcard
rather than a site. Every screen was a closed composition and nothing pulled the
reader down through it. The instruction was to restructure first and add motion
to the new structure afterwards, so the photography reveals are deliberately NOT
built here.

### What was actually wrong, mechanically

Not taste. Geometry. Every block was exactly one viewport tall, so every block
sealed itself and each boundary read as an ending. The fix is boring and it
works: only the ARRIVAL is a full screen, because an arrival should be. Every
media block after it is `--media-h-tall` (88svh), so the next frame is always
already peeking, and the text surfaces are sized to their content instead of to
the viewport. The collection covers changed from `screen` to `tall` for exactly
this reason.

### The sequence

1. ARRIVAL, one photograph, the whole screen.
2. THE WORK, the brand in three lines, on a text surface.
3. WORN, the pieces on people, scrolled sideways.
4. THE MAKING, two frames and a line, plus the route to asking for a piece.
   [ the boundary wash: paper above, ink below ]
5. THE COLLECTIONS as chapters, then the footer.

### The opening photograph, and why this frame

RESOLVED, and it settles the question section 14 deferred: the home page opens
on a photograph, not on the signature. The signature is now persistent corner
chrome (SiteHeader already drew it on every page), so the brand is still named
without spending the first screen on it. The STORY SLOT comment is deleted.

The frame is `homepage/IMG_3463`, the pale leather trousers hanging inside a
black steel frame against concrete. Chosen against the other ten frames in
`homepage/` on four counts that are about this layout, not about taste:

- Portrait and 3024x4032, so it survives the 100svh crop on a phone. This is
  what rules out IMG_1898, which is the best photograph in the folder and is
  landscape, so a phone crop takes a narrow centre column of it.
- The composition is NOT closed. The garment hangs high, the steel frame and the
  concrete floor continue past the bottom edge, and the eye is carried down.
  That is the whole point of the rebuild.
- Evenly lit top band, so one overlay value serves both marks.
- Monochrome in fact, so nothing competes with the black and white rule. This is
  what rules out IMG_3477, which is portrait and high resolution but is
  dominated by a red jacket, and the first screen is not where a third colour
  should arrive.

Rejected, and worth recording because the owner named them: the two files called
HOMEPAGE and homepage (1) are flat-lay leather details. They are beautiful and
they are the most closed compositions in the whole set, which is the exact
failure being corrected. HOMEPAGE is now the collection cover instead, where a
material statement belongs. IMG_3485 is a strong figure but is 1320x1778, below
the 2000px floor for a full-screen frame; it is used in the worn band, where the
crop is smaller and the resolution is ample.

### Chrome legibility on the arrival frame, measured

Measured at the exact rectangle the marks occupy at 390px (x 24 to 169, y 22 to
42, derived from `--margin`, `--s-u3` and `--sig-corner-h`, not guessed): mean
luminance 0.162, so PAPER scores 4.75 and INK 3.98. Paper is correct and is what
the importer chose.

It is marginal, and honestly so. Within that same rectangle the darkest decile
is 0.025 and the brightest is 0.309, because the marks lie across a corrugated
shutter whose slats alternate light and dark. A striped background is the worst
case for any single polarity, and no per-image value can fix it. This is the
residual issue section 14 already records. The three levers all belong to the
owner: choose ink instead, move the image hotspot in the studio so the crop puts
an even area under the marks, or accept it.

A caution for whoever measures next: a first pass over a broader 260x70 band
gave the opposite answer (ink 6.64, paper 2.97) because it reached into the
bright shutter to the right of the marks. The region measured has to be the
rectangle the marks actually occupy. `scripts/lib/measure-overlay.mjs` samples
y 3% to 9% of the file, which is close but is not derived from the tokens; it
agreed here (4.54 against 4.75) and may not always.

### The worn band: the one horizontal region

Two known problems with horizontal scroll inside a vertical page, both answered
in code rather than left to chance. The reasoning lives in `global.css` under
`.worn`; the short version:

- It fights the vertical gesture. The band is 62svh, well under a screen, so
  there is always page above and below it to grab. `overscroll-behavior-x:
  contain` stops the scroll chaining outward at the ends, which on a phone would
  otherwise trigger the browser's back-swipe and navigate away from the site.
  `touch-action` is deliberately NOT overridden: every mobile engine already
  locks a drag to its dominant axis, and `pan-x` risks swallowing vertical
  scroll outright.
- Nobody notices it exists. The frames are `--worn-w`, which is deliberately
  never a whole viewport (78vw on a phone, min(32vw, 26rem) on desktop), so one
  frame is always cut by the right edge. A frame sliced by the screen edge says
  "this continues" in the same language the vertical sequences already use with
  `--media-h-tall`. Snapping is `proximity`, not `mandatory`: it settles the
  strip as the reader lets go, which teaches the gesture, where mandatory would
  fight every partial drag. No arrows and no dots, as instructed.
- The scrollbar is hidden because a native one paints an OS grey, which is a
  third colour. That makes the region focusable by requirement, so it carries
  `role="region"`, an accessible name and `tabindex="0"`.

Verified in a headless render at 390px: band height 469 (62svh of a 757 viewport),
`scrollWidth` 1950 against `clientWidth` 500, so it scrolls internally with no
page-level horizontal overflow, and all nine frames in view decode.

Is horizontal right for these photographs? Yes, and the argument is narrative
rather than decorative: by that point the reader has met four screen-filling
vertical frames, and a change of axis is the cheapest way to say "these are a
different kind of thing" without a heading explaining it. The pieces on a body
also read as a group, which is what a strip does and six more full screens would
not. If the answer ever changes, the component is self-contained and a vertical
sequence is a swap, not a rewrite.

Honest limit: the on-model photography covers two garments plus one unlinked
frame. More people in more pieces is the single most useful thing that could be
shot for this page.

### The fourth section: the making

Proposed and built. What the page was missing between the band and the footer is
EVIDENCE. Section 2 claims the work is a transformation, hides becoming
something else; nothing on the page showed it, and a claim without evidence is a
slogan. The two frames are the same hide twice: the skin as it arrives, then the
same skin with a collar built onto it. That pair is the brand's whole argument in
two pictures, and it is the only place the home page distinguishes this label
from any other leather brand.

It also earns the one thing the home page never said: how to get a piece. After
the hand that makes it, "every piece is built to the measurements of the person
who will wear it" lands, and the route into the work follows it.

Deliberately not the `experimental/` bench frames: those belong to the about
page, and the home page should promise that story rather than spend it.

### The footer

Four blocks, Instagram, support, shipping, origin. The STRUCTURE is Isaac
Sellam's, which the owner sent as a reference; every word is written for this
brand and the register is this site's own, labels at 11px and facts in mono.
Nothing is restated from his wording.

### Everything written here is an unapproved draft

One switch, `siteSettings.homeCopyIsDraft`, default ON, covering the short about
lines, the making line and the two footer lines, in both languages. While it is
on the page marks each as a draft in the same way `aboutIsDraft` already does:
fully readable, because the owner judges copy by reading it, and impossible to
mistake for the brand's approved voice. Nothing in the copy goes beyond what the
owner stated: Italian leather, alchemy and transformation, minimal construction,
forms from nature, made by hand one piece at a time, nothing made in advance,
worldwide shipping.

### Frames that lost their place

The previous home tile grid is gone, and three frames went with it:
`homepage/IMG_3434` and `homepage/IMG_2378` (leather details) and
`homepage/IMG_1898` (the landscape on-model frame). Their assets are still in
the dataset, simply unreferenced. They are good photographs and the new
structure has no slot for them, so where they belong, the archive, a collection,
or the about page, is the owner's call.


---

## 22. The brand's own words (2026-08-02)

The owner supplied his text. It REPLACES everything that had been written on his
behalf, which was only ever a placeholder standing in for exactly this. Nothing
from the earlier drafts survives anywhere on the site, and the earlier material
that came with them is withdrawn with them: no Naples, no "German and Northern
European sensibilities", no "forms taken from nature" in our phrasing. His text
is the source now.

### The rule for handling it

His sentences appear UNALTERED and in HIS ORDER. The only editorial act allowed
is deciding where each contiguous run of them is placed. No sentence is trimmed,
merged, reworded or paraphrased. Anything failing that test is our writing and
carries a mark.

Where each run goes, and it is all in `scripts/import-photos.mjs` under
`OWNER_EN`:

| his lines | subject | where |
| --- | --- | --- |
| 1-2 | the brand's reason for being | home, "the work" |
| 3-4 | the Creature | about only |
| 5-7 | the collection | the MONUMENTUS statement |
| 8-10 | the making | home, "the making" |

The ABOUT PAGE carries all ten, complete and unbroken. That is deliberate and it
is not redundancy: every other placement is an excerpt WE chose, so there has to
be one page where his text exists whole and a reader can judge it without our
edit in the way.

### Three kinds of copy, and why one boolean could not hold them

`src/lib/voice.ts`. The site distinguishes:

- APPROVED, his own words in the language he wrote them. No mark of any kind.
- TRANSLATION, his words carried into the other language by us. Marked
  "unapproved translation".
- DRAFT, words we wrote. Marked "unapproved draft".

The translation/draft distinction is the point, not pedantry. He wrote in
English and Italian is the site's DEFAULT locale, so most visitors read wording
he has never seen. Labelling that an "unapproved draft" would tell an Italian
reader the brand has not decided what it thinks, which is false: it has decided,
in English, and only the wording is ours.

Two independent facts decide the state, which is why the old single
`homeCopyIsDraft` boolean was replaced:

- `siteSettings.approvedLanguages`, currently `["en"]`. Tick Italian in the
  studio when he approves it and every mark on the site disappears at once.
- a per-block "we wrote this" flag, which no approved language can override.
  Only `footerCopyIsDraft` is still on; `aboutIsDraft` is now off.

### Nigredo, Albedo, and the wipe

ANSWERED, and the answer is yes, on conditions.

The collection is MONUMENTUS: Tenebrae & Lux, and his text names the two
alchemical stages in order: Nigredo the blackening, then Albedo the whitening.
The wipe travelled paper to ink, which ran that sequence backwards. It now runs
INK TO PAPER. The home page begins in darkness and resolves into light.

Why this is not heavy-handed: nothing was added. Two props changed on one
component that already existed, and no copy anywhere explains it. A reader who
knows the terms may feel it; a reader who does not sees a page that inverts
once, exactly as before. That is the test the owner set and it is the only
honest way to pass it.

Three conditions, and they are binding:

1. DIRECTION, NOT ADDITION. The meaning is carried by the direction of a
   movement the site already made. The moment it needs a second element to
   carry it, it has failed.
2. ONE PER JOURNEY. One wipe, at the boundary it already occupied. The
   temptation will be to invert between every chapter; resist it. A
   transformation that happens five times is not a transformation, it is a
   transition effect. The collection page therefore has NO wipe (section 23).
3. IT MUST SURVIVE THE COLLECTION. The inversion is the site's permanent
   architecture (section 1), not MONUMENTUS's iconography. It reads as "the page
   has two states" on its own terms, so a second collection does not inherit a
   meaning belonging to the first. If the wipe ever has to be explained, or ever
   stops making sense without MONUMENTUS, it has become branding and should be
   pulled back to being structure.

The honest risk, recorded rather than hidden: this is the kind of idea that
invites elaboration, and every elaboration would break condition 1. The
safeguard is that it costs two props, so it can be reversed in a minute.

### Facts corrected across the site

- Collection name: MONUMENTUS: Tenebrae & Lux. `{COLLECTION_NAME}` is retired.
  Its slug is `/collections/monumentus`, previously `collezione-01`.
- Material: 100% VEGETABLE-TANNED leather, in the garment schema default and in
  every imported Creature. Vegetable-tanned is a process; "Italian leather" named
  only a country and was the wrong fact.
- Origin: handmade in SOUTH ITALY. Naples is NOT used anywhere, because his text
  says South Italy and the owner has not confirmed the city.
- The pieces are CREATURE. Singular Creatura in Italian.

### Where "Creature" replaced garment or piece

Visible interface text, all changed:

| file | string |
| --- | --- |
| `src/i18n/ui.ts` | `madeToMeasureValue`, both languages |
| `src/i18n/ui.ts` | `madeInItaly` is now "Handmade in South Italy" |
| `src/i18n/enquiry.ts` | the form intro, both languages |
| `src/i18n/enquiry.ts` | the "length" measuring instruction, both languages |
| `functions/api/enquiry.ts` | the "back" link on every reply page, both languages |
| `studio/schemaTypes/documents/garment.ts` | the document is now "Creatura / Creature" in the studio |

NOT changed, deliberately:

- The Sanity document type id is still `garment`. It is an internal identifier;
  renaming it means migrating every document to buy nothing a reader can see.
- The route is still `/pieces/[slug]`. This one is a real decision and it is the
  owner's: `/creature/[slug]` is more faithful, and the cheapest moment to
  change a URL is now, before launch, while the site is noindexed and no link
  has been shared. It touches the route, the enquiry sub-route, the Pages
  Function's back link, the sitemap and every internal link, so it is not done
  on our own authority.
- The enquiry email subject and body still say "Piece:". That text is read by
  the owner, not by a visitor.

### A register decision, made against the plan

His writing is long and discursive. `--t-statement` is uppercase, and
uppercasing a sixty-word sentence turns a manifesto into shouting and makes it
hard to read. So `Statement.astro` gained a `register` prop: his prose passages
are set in the BODY register, sentence case, and only his short declamatory
passages take the statement register. The about page chooses per paragraph on a
word count.

This bends section 1, which says statement copy is always short uppercase lines.
The plan was written before anyone had seen the brand's actual voice. The
register exists to serve the voice; the voice does not get cut to fit it.

### A build gotcha worth knowing

`src/lib/sanity.ts` reads with `useCdn: true`, so a build run immediately after
`npm run import` can serve the PREVIOUS content: it happened here, and the first
build after the rename still produced `/collections/collezione-01`. The dataset
was already correct. Rebuild a minute later, or check the dataset directly with
a `useCdn: false` client before concluding anything is broken. This is distinct
from the intermittent publish webhook in section 16 and has a different cause.

### Still open

- The Italian is our translation and is marked as such everywhere. It needs him.
- Two Italian conventions collide: the older interface strings drop accents
  ("e" for "è"), while the new brand copy carries them correctly. The brand copy
  should win and the interface strings should be corrected; it is small and was
  not done in the same pass as the content.
- His own English says "The garments are alchemical entities" in the collection
  statement even though he names the pieces Creature. The translation keeps
  "capi" to stay faithful. Worth asking whether he wants that sentence to say
  Creature.

---

## 23. The about page as a story, and the collection page (2026-08-02)

### About, rebuilt

The instruction was: one photograph with a single line over it, then descend
through the pieces artistically rather than as a list, telling the story as you
go, and give the writing room.

FORM. The opening frame is `homepage/IMG_3436`, black leather at close range
with the brand's signature embossed into it, and the line over it is "Living
textures." That is the shortest complete sentence the owner wrote, used
unaltered, so the opening line is his and carries no mark. It also rescues one
of the three frames orphaned when the home tile grid was replaced (section 21).

Below it the page alternates: a screen of text, a photograph, the next screen of
text. The paragraphs come from HIS blank lines, so he controls where the page
breathes; we do not re-cut his writing to fit a layout. Each paragraph picks its
register by length, short ones declamatory and long ones as prose, on a word
count rather than on a judgement about which sentence matters more.

The translation mark appears ONCE, at the top of the story, not beside every
paragraph. Repeating it down the page would turn one honest caveat into noise.

Only the opening photograph is a sealed screen; every frame after it is 88svh,
so the next block always peeks. Same rule as the home page, same reason.

Note that "Living textures." then recurs in its proper place inside the full
text a few screens later. That repetition is deliberate: it is his sentence in
his order, and a refrain that opens a page and returns in context is not an
error to edit out.

### The collection page: what was weak, before anything changed

Asked for the critique first, so it is recorded before the fix:

1. ON DESKTOP IT WAS ONE COLUMN at every width, so a portrait photograph was
   cropped to a roughly 1440x790 letterbox and most of the frame was discarded.
   Section 4 specified pairs, two up and touching, from the very beginning and
   it had simply never been built. This was the worst of the five because it
   damaged the photography itself, which is the thing the whole site exists to
   serve.
2. NO RHYTHM. Cover, statement, then one identical block per Creature. With
   names still placeholders it read as a stack of same-shaped rectangles, which
   is the postcard problem in its purest form.
3. THE STATEMENT CARRIED NO MARK, so our Italian translation of the owner's own
   words would have passed as the brand's voice. A correctness bug, not a taste
   one.
4. NO ENDING. After the last Creature the page stopped dead at the footer, with
   nothing said about how a piece is actually got.
5. THE SAME GESTURE THREE TIMES. The home page, the collections index and the
   collection page all open with a full-bleed cover carrying a small label.
   Three pages, one move.

### What changed, and what did not

Fixed: (1) pairs on desktop, one column on a phone, no gutter, as measured on
the primary reference. An odd count leaves the last Creature alone at half
width, which is correct and is not a gap to fill. (3) the statement now runs
through the same voice model as everything else. (4) a close carrying one fact,
that every Creature is built to the wearer's measurements, and one route.

NOT fixed, and recorded rather than papered over: (5). The collections index and
the collection cover still make the same opening move. The honest fix is
probably that the index stops being a page of covers at all, since with one
collection it is a list of one, but that is a structural question and it should
wait until there is a second collection to design against.

POLARITY, and it is a judgement call worth stating. The collection page is ink
throughout and has NO wipe. The home page performs the inversion once; a
collection is where the work is looked at, not a second performance of the same
transformation, and section 22's second condition says one per journey. Ink
because these photographs are dark leather in hard light and the page should
serve them. It is one prop to reverse if the owner reads it differently.

---

## 24. The Instagram history: names, states, voice, motion (2026-08-02)

The owner's published posts are the deepest look at the brand's own language the
project has had. They are his approved public words: quoted verbatim they are
approved copy, and everywhere else they are the style the site should be written
in.

### Naming the Creature

What is possible here has a hard limit worth stating: the CAPTIONS are in hand,
the Instagram IMAGES are not. So a match can only be made where a caption names
a feature that can be SEEN in one of our imported frames. Anything else would be
a guess dressed as a decision.

RENAMED, one, and the evidence is decisive:

- **Rubedo**, our `piece-giacca-rossa`, now at `/creature/rubedo`. His caption:
  "Red and Black faded colour. 500 handmade scar-stitch. Oblivion hole on the
  back." IMG_3475 is our back view and shows precisely that: an almond opening
  in the upper back, with sleeves fading from dark to bright red. Nothing else
  in the imported set is red. Composition lambskin, from his own words; caption
  verbatim as the description; private order, so no enquiry action.

NOT RENAMED, and these are questions for the owner rather than gaps:

| our piece | what it is | candidates | why it is not settled |
| --- | --- | --- | --- |
| `capo-01` | black crumpled leather shirt, hung from a bare branch | Armonyen, Corvinus | two shirt names, two black shirts, nothing in either caption that separates them |
| `capo-02` | black fitted shirt, bell sleeves, pointed hem, shot under a crucifix | Corvinus, Armonyen | same pattern as Rubedo in black. Corvinus is "your protector in those dark nights", which suits the crucifix, but suiting is not evidence |
| `capo-03` | black vest, visible scrap panels, central zip | Monumentus Tenebrae Scrap Vest | the scrap construction is plainly visible, but his caption names a set, "Scrap Vest and Pants", and we cannot tell which trousers are its Pants |
| `capo-04` | crinkled dark vest, held in hand | none confidently | no caption matches a second vest |
| `capo-05` | black trousers hung from a chain inside the steel frame | Tibia Cut, Scrap Pants | two names, two pairs of black trousers |
| `capo-07` | wide black trousers, scalloped raw hem | Tibia Cut, Scrap Pants | same problem inverted |
| `capo-08` | tube top AND snake-textured skirt, on model | Severya | the SKIRT is confidently Severya ("Handmade Snake Skirt") but our document bundles it with the top. Split the document, or name it Severya and note the top? |

Named by him but not matched to any imported garment: **Tomar**, **Styrax**,
**Ghezard**, **Monumentus Lux co-ord**.

Two observations offered as leads, not decisions:

- **Ghezard** is "Goat Shearling featuring a Washed brown Leather", and
  `archive/IMG_9568` is a brown leather jacket with a fur collar. It is in the
  ARCHIVE, not among the garments.
- **Tenebrae and Lux may be a division of material, not a mood.** Every black
  washed veg tan piece is Tenebrae; the pale and cream pieces, including the
  arrival photograph and the on-model cream trousers, would then be **Monumentus
  Lux**. If that is right it also means the arrival frame is a Lux piece, and it
  is worth the owner confirming.

RAISED, because it undermines something already built: the **making** section on
the home page uses `products/IMG_0206` and `IMG_0208`, a black shearling pelt
with a leather collar attached, on the argument that it is raw hide before and
after construction. **Styrax is "Handmade Goat Sherling & Leather Top."** If
those frames are Styrax, they are a finished Creature lying flat, not material,
and the section's argument is wrong. The owner should say which.

### Materials

The generic line is dead. "100% Italian leather" named a country, not a
composition, and his captions are precise per piece: lambskin, goat shearling,
black washed veg tan sheepskin, waxed linen.

Only Rubedo carries a real composition. Every unmatched Creature now shows a
marked `{MATERIALS}` placeholder, DELIBERATELY. Filling them all with
"vegetable-tanned" would be a newer generic line asserted about pieces nobody
has verified: the same mistake with a better vocabulary. The schema default for
a NEW Creature is vegetable-tanned, which is a starting point the owner edits,
not a claim the site makes.

### How a Creature can be had

The old `notOffered` boolean knew two states; his captions describe four, and
`garment.availability` now holds them: `madeToOrder`, `unique` (1 of 1),
`privateOrder`, `notOffered`.

Only made-to-order carries the enquiry action. A unique piece and a private
commission are already made and already someone's, and offering to build another
would be a lie. They stay visible at full scale, which is the rule that has
always governed a withdrawn action here, and the line states what the piece is
with no apology attached.

### Motion

Built on the structure rather than instead of it.

**Photography reveals.** A full-bleed frame rises `--reveal-shift` (24px) and
resolves once, over `--dur-reveal` on the expo-out curve already in the tokens.
No scale: scaling a photograph is a zoom, and a zoom is a slideshow. No stagger,
no blur, no bounce. A presence arriving in a room does not bounce.

Three things never reveal, and each exclusion is the point:

- the ARRIVAL photograph on any page. It is the LCP element, and an arrival that
  arrives late is not an arrival.
- TEXT. If everything moves, nothing does.
- the frames INSIDE the worn band. The band reveals as one presence. Six frames
  animating individually while a reader drags them sideways is the bouncing this
  is meant to avoid.

**Safety.** The hidden state hangs off `data-reveal-live`, which the script sets
before anything is hidden. No JavaScript, a blocked script, or no
IntersectionObserver, and every photograph is simply visible. On a site that is
entirely photographs, getting this wrong produces a blank page, so it is not
left to chance. Frames unobserve on first sight and never re-hide.

**Measured.** 4x CPU throttle, scrolling the whole home page: median frame
8.2ms, p95 10.3ms, worst 10.7ms, nothing over 50ms. Reduced motion verified at
runtime with the preference emulated, not assumed: neither script marks the
root, zero of four reveal targets are hidden, and the wash collapses to exactly
one viewport with no dead scroll. Standing rule 3 still applies: the real phone
test belongs to the owner and is the one that counts.

**PAGE TRANSITIONS ARE NOT BUILT**, and that is the judgement rather than an
omission. Astro's view transitions would swap the document on navigation, which
does three things this site cannot afford: it cross-fades a whole page of
photographs directly against the reveals, so two motions compete for the same
moment; it discards the scroll position the pinned wipe depends on; and it
spends kilobytes of JavaScript on a static site whose entire argument is that
photographs load fast. The brief said "if they survive without competing", and
they do not. If it is wanted anyway, the honest version is a very short fade on
the incoming page only, with the reveals disabled during it.

### Voice applied to our own strings

His register is short, declarative, material-precise. Where our strings were
softer they are rewritten:

| string | was | now |
| --- | --- | --- |
| enquiry intro (EN) | "Every Creature is built to measure. Leave your measurements and we will write back." | HIS OWN LINE, verbatim, from the Armonyen post: "Send us your measurements and we'll take care of creating it specifically for you." |
| `madeToMeasureValue` | "Every Creature is built to the measurements of the person who will wear it" | "Built to your measurements." |
| `notFound` | "Page not found" | "Nothing here." |

The three MEASURING INSTRUCTIONS are deliberately not compressed. They are the
one place on the site where a person has to act on what they read, and clarity
beats style.

### Noted, not built

- **Tyrrhenian Women** is a next drop. Not built, per instruction. Recorded here
  as evidence that collections continue, which matters for section 22's third
  condition: the wipe must keep working when MONUMENTUS is not the only one.
- **Creative team credits** (photographer, MUA, model handles) are NOT on the
  site. They are a question for the owner: crediting the people who made the
  images is normal and generous, and it is also his call and nobody else's.

---

## 25. Does it feel like the studio, or like a shop? (2026-08-02)

The instruction was to check every design decision against the mood of his
photographs, concrete and shutters and chains and crucifixes and bare branches,
and to flag anywhere the site reads as a clean e-commerce template instead.

Flagged, worst first. Nothing here is changed yet; several are the owner's call.

1. **THE FOOTER IS A SHOP FOOTER, and it is ours.** Four blocks in a four column
   grid, Instagram / Support / Worldwide shipping / Made in Italy. That is the
   standard commerce footer, the structure was taken from a shop, and "Support"
   is a customer-service word for a brand that has no support desk. It is the
   most template-like thing on the site and it was built to a brief. Worth
   replacing with something in his register: a line, an address, the handle.
2. **THE CREATURE PAGE HAS A SPEC TABLE.** A definition list of Collection,
   Category, Made to measure, Materials, Reference measurements, Price, How it
   can be had. His own caption for the same kind of object is one line:
   "Creature: Tomar. Composition: 100% lambskin. Handmade." Seven labelled rows
   is a product sheet; his is an inscription.
3. **CATEGORY IS UOMO / DONNA, and his own words contradict it.** The Armonyen
   caption says the shirt is "designed for both him and her." A gendered
   catalogue taxonomy exists to filter a shop. This is the clearest case on the
   list, because the evidence against it is his, not mine.
4. **PRICE IS RENDERED AS A CURRENCY.** `Intl.NumberFormat` produces a shop
   price. Nothing in his posts prices a piece publicly; they are made to measure
   and some are private orders. Recommend removing price from the page entirely
   and letting it belong to the conversation the enquiry starts.
5. **"SEND ENQUIRY" IS A BORDERED BUTTON.** A hairline box is the one closed
   shape in the whole system and it reads as a call to action. There is a real
   argument for it, since it is the site's single action, but in his register it
   would be a line and not a box.
6. **THE COLLECTIONS INDEX** repeats the same full-bleed cover gesture as the
   home page and the collection page, already recorded in section 23.

What is NOT off-mood, and is worth saying because restraint can look like
absence: the photographs carry the studio on their own, and the page furniture
around them stays deliberately neutral. The concrete, the chains and the
crucifixes are IN the frames. Adding studio texture to the page itself, a
concrete ground, a rule that looks like a chain, would be costume, and the brief
has warned against the costume reading of gothic since section 0.

---

## 26. The mood flags, answered (2026-08-02)

Three of the five flags in section 25 were decided and are applied. Two are the
owner's and are recorded here with the evidence, unchanged in the interface.

### 1. The footer is an inscription, not a grid

"Support" is gone: it is a customer-service word for a brand with no support
desk. The four facts survive as four short declarative lines in one column,
in his register, with no headings and no grid at any width.

The width point is the substance of the change, not a detail. A footer that is
one column at 390px and four columns at 1440px was never an inscription; it was
a responsive shop footer waiting for room. It is one column everywhere now.

The two written lines tightened into his voice, which drops the subject and
states the fact: "We ship worldwide." became "Shipped worldwide.", and "Every
Creature is handmade in South Italy." became "Handmade in South Italy." They
are still OURS and still marked as unapproved drafts in both languages.

### 2. The Creature page is an inscription, not a spec sheet

His caption for one of his own objects is a single line:

> Creature: Tomar. Composition: 100% lambskin. Handmade.

So the page says exactly that, at statement size:

```
CREATURE: RUBEDO.
COMPOSITION: LAMBSKIN LEATHER.
HANDMADE. MADE TO MEASURE.
PRIVATE ORDER.
```

The seven row definition list is gone. What remains below it is four subordinate
facts in mono: collection, category, reference measurements, price.

Two decisions inside that:

- The MEASUREMENTS are NOT hidden behind a disclosure. Section 17 is explicit
  that with no sizes they matter more, not less, because they are the only way
  to judge cut and proportion from a photograph. Subordinate means smaller and
  later, not one click away.
- They are demoted BY SIZE, not by opacity. The inscription is `--t-statement`
  (18 to 28px) against `--t-mono` (12px), which is a 2x contrast on its own. A
  first pass used `opacity: 0.6` on the labels and that is a GRAY HALF-STATE,
  which standing rule 1 forbids outright. It was caught before it shipped and is
  recorded here because it shows how easily the rule gets broken by habit: every
  design system fades secondary text, and this one cannot.

The subordinate block is sized to shrink. If the owner rules against category
and price it becomes measurements alone, which is the right end state.

### 3. The action speaks the system's own form language

The enquiry action was a bordered box, the only closed shape in the system, and
it read as a shop's call-to-action button.

The system already had a form language and nobody had noticed: a field on the
enquiry form is a label with a solid hairline UNDER it, and the one way this
site emphasises anything is to THICKEN a hairline (`.field[data-invalid]`
doubles exactly that line). So the action is now drawn as a field. Same weight,
same colour, same rule, and hover and focus double it.

The thing you press looks like the things you fill in, which is the truest
description of what it does. `hairline-box` is deleted rather than left unused.

### 4 and 5, waiting on the owner, evidence recorded

- **Category (Uomo / Donna).** The evidence points at REMOVING it, and the
  evidence is his: the Armonyen caption says the shirt is "designed for both him
  and her." A gendered taxonomy exists to filter a shop. Nothing is changed
  until he rules. If it goes, `garment.category` and its schema field go with
  it, and the frontend question in section 9 about translating the labels
  disappears rather than being answered.
- **Price.** Nothing in his posts prices a piece publicly; they are made to
  measure and some are private orders. If price moves into the enquiry
  conversation, `garment.price` and `currency` leave the page and probably the
  schema, and `{PRICE_EUR}` retires from the placeholder list.

### A cause fixed rather than documented again

`useCdn` is now FALSE on the site's build-time Sanity client. With it on, a build
started soon after content changed served the PREVIOUS content: it happened
three times in one session, once producing an old collection slug and twice an
old footer wording, each time while the dataset plainly held the new value, and
each time it cost minutes chasing a bug that did not exist.

The CDN bought nothing. These queries run once per deploy, not once per visitor,
so there is no traffic to amortise a cache over, and what it cost was
correctness: a static build is a photograph of the dataset, and a photograph of
a stale cache is worse than useless because it looks fine. Quota is not a
concern (section 12): 250,000 API requests a month against a handful per build.

---

## 27. Two open identifications, and what each would change

### If the making frames are Styrax

`products/IMG_0206` and `IMG_0208` are used as the home page's MAKING section on
the argument that they are one hide before and after construction: the skin as
it arrives, then the same skin with a collar built onto it. **Styrax is
"Handmade Goat Sherling & Leather Top."** If those frames are Styrax, they are a
finished Creature lying flat and the argument is false.

Precisely what is and is not affected, because it is narrower than it looks:

- NO VISIBLE COPY IS WRONG. The section renders the owner's own making text,
  which claims nothing about those two frames. The false claim lives in the
  component comment, in the import script, and in section 21 of this file.
- WHAT BREAKS IS THE SECTION'S REASON TO EXIST. It was argued into the page as
  EVIDENCE: the site claims the work is a transformation, and those two frames
  showed it. Two photographs of a finished garment prove nothing, and the
  section becomes two more pictures in a page that already has enough.

If the owner confirms Styrax, the fix is prepared and small:

1. The frames move to where a finished Creature belongs, a Creature page or the
   collection, and gain their real name and composition.
2. The making section takes real process frames, which already exist and are
   already imported: `experimental/IMG_2626` (a wide brush laid on leather just
   dyed dark) and `experimental/IMG_3406` (offcuts, stones and tools on the
   bench). Both are literally the work being done.
3. `experimental/387ba92d` (the paper pattern pieces) is the third candidate if
   two frames read thin.
4. The about page keeps the remainder; the overlap is acceptable because the
   about page is the long story and the home page is the promise of it.
5. Sections 21 and 24 of this file get corrected, not quietly edited.

Cost: one array in `scripts/import-photos.mjs`, one re-import, three comment
corrections. Roughly fifteen minutes, and no layout or schema change at all.

If instead he confirms they are RAW MATERIAL, nothing moves and section 21
stands as written.

### The Tenebrae and Lux hypothesis

RECORDED AS A HYPOTHESIS. Deliberately NOT in the interface, because it is a
reading of the evidence and not something the owner has said.

The reading: **Tenebrae and Lux may divide the work by MATERIAL rather than by
mood.** His captions attach "Monumentus Tenebrae" to black washed veg tan
pieces, and "Monumentus Lux" to a co-ord. Our own photography splits the same
way with nothing forcing it: the black leather Creature on one side, and the
pale and cream pieces, including the arrival photograph and the on-model cream
trousers, on the other.

If it holds, the alchemical stages are the brand's own catalogue taxonomy rather
than a metaphor laid over one, and his third name confirms the shape: the red
piece is called **Rubedo**, which is the third stage. Nigredo, Albedo, Rubedo.
Tenebrae, Lux, and the red one.

WHAT WOULD CHANGE IF HE CONFIRMS IT:

1. A `stage` field on each Creature, with exactly three values: `tenebrae`,
   `lux`, `rubedo`. Controlled, not free text, and not localized: they are the
   brand's own words in both languages.
2. The collection page GROUPS by stage instead of listing in drag order, in the
   sequence tenebrae then lux, which is the alchemical order and the order of
   his own title. Rubedo sits last or apart, since it is one piece and a private
   order.
3. Rubedo's membership becomes a real question. It is named for a stage the
   collection title does not include, so it may belong outside MONUMENTUS:
   Tenebrae & Lux entirely.
4. The archive could carry the same field, which would make the archive
   searchable by stage without inventing a category of our own.
5. **The wipe would gain a second reading, and this is the danger.** The home
   page already runs ink to paper, nigredo to albedo. If the collection page
   also ordered tenebrae then lux, a reader would meet the same movement twice
   and it would start to look like a system announcing itself. Section 22's
   second condition holds: ONE inversion per journey. The collection page groups
   by stage but does NOT invert, and no wipe is added to it.
6. Nothing in the CATALOGUE STRUCTURE would need migrating: it is one added
   field on an existing document type, and eight documents.

WHAT WOULD NOT CHANGE: the interface says none of this. There is no stage label
on a Creature page, no "Tenebrae" heading, no explanation. If the division is
real a reader feels it in the photographs and in the order, exactly as with the
wipe, and is never told.

---

## 28. The owner's decisions, applied (2026-08-02)

### The catalogue divides by stage, and Uomo/Donna is gone

Confirmed by the owner: Tenebrae is the black washed veg tan work, Lux the pale
pieces. `garment.stage` replaces `garment.category`, which his own Armonyen
caption contradicted ("designed for both him and her").

WHAT THE STAGE DOES: it orders the collection page, tenebrae then lux, then
anything unassigned, keeping his drag order inside each group (`byStage` in
`src/lib/content.ts`).

WHAT IT DOES NOT DO: appear anywhere as a label. The stage is already inside the
names he gives his Creature, "Monumentus Tenebrae tibia cut pants", so a page
that also printed "Stage: Tenebrae" would be the site explaining itself. A
reader meets the black Creature and then the pale ones and feels the division,
exactly as with the wipe. No heading, no divider, no legend.

AND NO WIPE ON THE COLLECTION PAGE. A page that orders itself darkness then
light is already the same idea; a second inversion on top of it would turn a
structure into a mannerism. Section 22's second condition holds.

ASSIGNMENT, and its limit. His criterion is material AND colour. Colour is
observable in our frames and every imported Creature except Rubedo is black, so
none can be Lux under his own definition; all seven are marked tenebrae. Tannage
is NOT observable, so half the criterion is assumed and he should confirm it
when he names them.

**Rubedo is deliberately unassigned.** It is named for a third alchemical stage
the collection title does not include, and forcing it into one of two would be a
guess. It sorts last and the gap asks the question.

**No Lux Creature exists as a document.** The pale pieces are in the photography
(the arrival frame, the cream trousers on model) but none of them has been
imported as a garment, so the Lux half of the catalogue is currently empty.

### Italian is his now

He authorised the translation on condition it stays faithful rather than
adapted, and supplied the text. It replaced ours word for word, including where
his differs: "texture viventi" not "texture vive", "indossate sul corpo" not
"portate sul corpo", "in cui" not "dove", "Su Misura" capitalised as he
capitalises it.

`approvedLanguages` is now `["en", "it"]`. Every translation mark on brand copy
is gone from the site. What is still marked is copy WE wrote, which is now only
the two footer lines and the shipping and returns text.

### Shipping and returns

Written by us in his register, and marked as ours in both languages. It carries
his two facts and nothing else:

> Shipped worldwide.
> Returns accepted. The customer pays the return shipping.

No window, no conditions, no "please note". None of that has been agreed, and
inventing policy is worse than inventing copy.

### Settled and needing nothing further

- **Prices are visible on the site.** The price field stays. Nothing was added
  to it: every Creature still shows the `{PRICE_EUR}` placeholder.
- **No credits section.** The creative team stays on Instagram. The question
  raised in section 24 is closed.
- **Creature names** stay marked placeholders. He will assign them himself.

---

## 29. The domain switch, prepared (aleksandercecco.com)

Approved and being bought. Nothing below is done yet: it is the order to do it
in once DNS is live, written now so it is not reconstructed under pressure.

**1. Point the domain at Cloudflare Pages.**
Pages project, Custom domains, add `aleksandercecco.com` and `www`. Cloudflare
will either take over the nameservers or ask for a CNAME, depending on where it
is registered. Then change `PUBLIC_SITE_URL` to `https://aleksandercecco.com` in
the production environment variables and REDEPLOY, because that value feeds the
canonical links, the hreflang pair, Open Graph and the sitemap, and all four are
baked in at build time.

**2. Verify the sending domain in Resend.**
Resend, Domains, add `aleksandercecco.com`, then add the DNS records it hands
back: SPF as TXT, DKIM as TXT or CNAME, and DMARC if wanted. All free, all on
the same zone. Wait for the domain to read verified before going on.

**3. Set the three secrets and redeploy.**
`RESEND_API_KEY`, `RESEND_FROM` (an address at the verified domain), and
`ENQUIRY_TO_EMAIL`, on the production branch, encrypted. THEN REDEPLOY: Pages
Functions pick up new secrets only on a new deployment, which cost a deploy to
learn once already (commit 6ae60b1). Until all three are set the form answers
503 and says sending is not switched on, which is deliberate.

**4. Replace the placeholder address and test end to end.**
`siteSettings.contactEmail` is still `info@example.com` and the studio warns
about it. Put the real address in, then submit the form on the live site and
confirm three things: the enquiry arrives, the reply-to is the visitor rather
than the brand, and the confirmation page says the right thing in both
languages.

STILL OUTSTANDING AFTERWARDS, and not part of this switch:

- `{REPLY_WINDOW}` is unset, so the confirmation names no timing.
- The two noindex locks stay until launch. They are section 16 and are
  deliberately separate from the domain move.

---

## 30. The old price list, analysed (2026-08-02)

Analysis only. Nothing was priced on the site; every Creature still shows
`{PRICE_EUR}`.

### The conversion arithmetic

The list is converted, not chosen. **The rate is 1.18, not 1.086.**

At 1.18, seven of the thirteen figures come back as EXACT round euro prices:
150, 250, 250, 250, 250, 300, 350, 350, 450. The rest land within 1.3 euro of a
round figure, and the drift in the implied rate (1.1783 to 1.1840) is what
automatic conversion looks like when prices are fetched at slightly different
moments.

The clincher is not the roundness but the STEP: the recovered set is

`125, 150, 175, 250, 300, 350, 450, 675, 875`

and every one of those is a multiple of 25. A person choosing prices lands on
multiples of 25. A currency conversion does not produce a set that is uniformly
divisible by 25 after you divide it back out.

At 1.086 nothing lands: the worst figure is 12 euro from any round number, and
no multiple-of-25 structure appears at all.

So the hypothesis is right and the rate is wrong. The dollar figures are also
stale by however far the rate has moved since, which is a second reason not to
carry them anywhere.

| Creature | USD shown | EUR chosen |
| --- | --- | --- |
| leather hat | 148 | 125 |
| snakeskin mini bag | 177 | 150 |
| patchwork tibia cut pants | 207 | 175 |
| Glovyes leg warmers | 295 | 250 |
| Styrax top, red fox fur | 295 | 250 |
| Styrax top, goat shearling | 295 | 250 |
| Severya python skirt | 295 | 250 |
| Tenebrae scraps vest | 354 | 300 |
| Tomar shorts | 413 | 350 |
| Aleya bootcut pants | 413 | 350 |
| Armonyen shirt | 531 | 450 |
| Monumentus Tenebrae tibia cut pants | 796 | 675 |
| Tenebrae leather pants | 1031 | 875 |
| Lux leather pants | 1031 | 875 |

### The list is also identification evidence

Worth handing to the owner alongside the ambiguity table in section 24:

- There are **two different tibia cut pieces**, a patchwork one and a Monumentus
  Tenebrae one. That may resolve the two-pairs-of-black-trousers ambiguity.
- **Tenebrae leather pants and Lux leather pants both exist**, which independently
  confirms the stage division and confirms pale leather trousers are a Creature.
- **Styrax is a top in goat shearling.** This sharpens the open question in
  section 27: our `IMG_0206` and `IMG_0208` are black shearling with a leather
  collar, and if they are Styrax then the making section is built on a finished
  Creature rather than raw material.
- **Severya is python**, matching the scaled skirt in `capo-08`.
- Names not seen before: **Glovyes**, **Aleya**, and Tomar as SHORTS.

### Where the list is internally inconsistent

1. **The same cut spans 175 to 675 euro.** Patchwork tibia cut at 175, Monumentus
   Tenebrae tibia cut at 675, nearly four times. If "tibia cut" names the hem and
   nothing else, then the cut is not what is priced and the material and labour
   are, which is fine but means the name carries no price information. The
   suspicious end is the CHEAP one: 175 euro is less than the scraps vest at 300,
   and trousers are more work than a vest by any measure. Something is wrong with
   175, not with 675.
2. **Styrax costs the same in red fox fur and in goat shearling.** Those raw
   materials are not remotely comparable in cost. Either the price tracks the
   pattern and the labour only, in which case the material precision in his
   captions is decorative rather than commercial, or the fur version is
   underpriced. It cannot be both.
3. **Exotic material is priced like ordinary material.** A python skirt at 250
   sits at exactly the same price as leg warmers. Snakeskin bag at 150.
4. **Tenebrae and Lux leather pants both at 875 is the one coherent entry** and
   is worth keeping: same pattern, same labour, two finishes, one price. That is
   a rule, and it is the only one in the list.
5. **Rubedo is absent.** The 1/1 private order is not on it at all, so the list
   cannot express the availability model the site now has. A private commission
   is not priced from a catalogue.
6. **The deepest problem: it prices garments as if they were stock.** Everything
   is made to measure by one person. A flat catalogue price ignores that the
   binding constraint is his hours, not his materials, and that his capacity is
   fixed. At 175 euro, handmade leather trousers imply an hourly rate below
   minimum wage unless they take under two hours, which they do not.

### What a coherent structure would look like

1. **Price from time and material, then round.** Hours times the rate he is
   willing to work for, plus material at yield, plus a remake allowance. That is
   the only defensible floor, and everything else is positioning on top of it.
2. **Tier by construction, not by garment type.** Accessories, then single-panel
   garments, then constructed garments, then tailored ones with collars, cuffs
   and plackets. His own list already half does this: the shirt is top.
3. **Material as a modifier on the tier, not baked into one number.** Same
   Creature, different hide, different price. This is what makes the material
   precision in his captions mean something commercially instead of decoratively.
4. **Decide made-to-measure explicitly.** Either the base price includes it or it
   is a stated supplement. Right now it is neither, which means it is absorbed
   invisibly and unevenly.
5. **Three availability states need three price behaviours.** Made to order gets
   a price; unique gets a price that WAS, or none; private order gets no public
   price at all. The site already models the states, so the prices have to match
   or a 1/1 will show a catalogue figure for something nobody can buy.
6. **One currency, EUR.** He is in Italy, invoicing in euro, selling by enquiry.
   There is no checkout that needs a local price, and automatic conversion is
   precisely the artefact diagnosed above. Let the visitor's bank convert.

### What he would have to supply to price properly

1. Rough hours for three representative Creature: a shirt, a pair of trousers,
   an accessory.
2. The hourly rate he wants for his own time.
3. Material cost per hide or skin, and how many Creature come out of one.
4. Whether anything on the old list actually SOLD at those numbers, or whether
   they were aspirational.
5. Whether made to measure is included or supplementary.
6. What a 1/1 or a private commission is priced on.
7. Whether the fox fur and goat shearling parity on Styrax was deliberate.
8. Which of the thirteen still exist as offerable Creature, since only eight
   garments are imported and the names do not all line up.

---

## 31. Ready or remade: the contradiction, and its cost

The owner now says all pieces are ready and can be bought. Hours earlier he said
nothing exists before it is requested, and section 17 deleted the size system on
that basis. Both cannot be true of the same Creature at the same time. NOTHING
HAS BEEN REINTRODUCED; this is the cost of each answer so he can choose.

### What a catalogue must express to be honest

Five questions a buyer asks, and the site currently answers only two:

1. Does this exact object exist right now?
2. If it exists, will it fit ME?
3. Can it be remade for me?
4. If remade, will it be identical? (his own answer: "similar, but never identical")
5. How do I get it?

### The smallest schema: no new fields at all

The existing `availability` enum widens from four values to five. That is the
whole change.

| value | exists now | remade | measurements mean |
| --- | --- | --- | --- |
| `readyOnly` | yes | no | THIS object's measurements. A fit spec. |
| `madeToOrder` | no | yes | the photographed sample, as context |
| `readyOrRemade` | yes | yes | this object's, and context for a remake |
| `privateOrder` | gone | no | historical |
| `notOffered` | n/a | n/a | n/a |

Why one enum and not two booleans: two booleans give sixteen combinations, most
of them nonsense, and allow a document to say it neither exists nor can be made.
Five named values cannot express a contradiction.

**No size field returns.** Section 17 holds and was right in advance: "If a
future session finds a garment that seems to need one, the answer is a reference
measurement on that garment, not a size system." A ready piece's measurements
ARE its size.

**One field changes meaning, and that is the trap.** `measurements` currently
means "the sample that was photographed, not what you receive". For a ready
piece it means "the object you will receive". Same field, opposite claim. The
LABEL must follow `availability`; the field does not need to be duplicated.

### Exactly which strings become wrong

Under READING A (made to measure only, the current site): **nothing.** The site
is internally consistent today. Cost of confirming A: zero.

Under READING B (everything ready), these become false:

| where | string | why it breaks |
| --- | --- | --- |
| `functions/api/enquiry.ts` | chest/shoulders/length **validation** | NOT copy. The server REJECTS a submission without three measurements, 422. A buyer of a ready piece cannot complete the form at all. |
| `creature/[slug]/enquiry.astro` | the three inputs carry `required` | the browser blocks submission before the server sees it |
| `i18n/enquiry.ts` | "Send us your measurements and we'll take care of creating it specifically for you." | **HIS approved words.** False for a ready piece, and only he can change them. |
| `i18n/enquiry.ts` | `measureTitle` + three measuring instructions | instructions for something not being done |
| `i18n/ui.ts` | `madeToMeasureValue` "Built to your measurements." | false. Shown on the home page AND every collection page. |
| `i18n/ui.ts` | `handmadeMadeToMeasure` "Handmade. Made to measure." | half false, and it is in every Creature's inscription |
| `i18n/ui.ts` | `referenceMeasurements` "Reference measurements" | wrong noun: they are the actual measurements |
| `i18n/ui.ts` | `madeToOrder` "Made to order." | the default state would be wrong for every piece |
| his brand text | "In 100% vegetable-tanned leather, **Made to Measure**, handmade in South Italy." | **HIS approved words**, on the home page and the about page |

Under READING C (mixed, per Creature): the same list, but every one of those
strings stops being a constant and becomes a function of `availability`, and the
enquiry form needs the measurements block shown or hidden per Creature with the
server validating conditionally.

### The cost of each answer

- **A, made to measure only.** Zero. Nothing changes. He simply confirms.
- **B, everything ready.** Half a day of work, plus owner sign-off on TWO lines
  of his own approved text. The expensive part is not the copy, it is that the
  enquiry endpoint hard-requires three measurements: under B that is a server
  rejecting a legitimate purchase, not a wording problem.
- **C, mixed.** About a day. Not much more than B, because B already forces the
  conditional path to exist; C just means both branches are reachable. This is
  also the only reading that survives him changing his mind again, which on the
  evidence of the last few hours is worth something.

RECOMMENDATION: ask him for C even if today the answer is A or B, because C
costs one extra half day now and prevents this entire conversation recurring.

---

## 32. Pricing: three levers, and the arithmetic behind them

Analysis only. No price is on the site; every Creature still shows
`{PRICE_EUR}`.

### Correction to the earlier arithmetic

RECORDED AS INSTRUCTED: the old figures were dollars chosen as dollars, not
euro converted to dollars. The conversion hypothesis in section 30 was wrong.

The honest footnote, because the anomaly is still there and someone will find it
again: dividing that list by 1.18 returns a set that is uniformly a multiple of
25, with seven exact hits. That is a real pattern and this correction does not
explain it. The likely reconciliation is that the old storefront displayed
converted dollars against euro he had set, and the dollar figures are what he
remembers seeing. It does not matter for any decision: **the euro-equivalent is
roughly the same either way, and every conclusion below is unchanged.**

### The constraint, stated plainly

About two weeks per Creature, and it is not known whether that is working hours
or elapsed time. Leather is not a major cost, so this is almost entirely labour.

| reading | hours | at EUR 15/h | at EUR 25/h | at EUR 40/h |
| --- | --- | --- | --- | --- |
| 2 weeks elapsed, ~3h/day | 30 | 530 | 830 | 1,280 |
| 2 weeks elapsed, ~5h/day | 50 | 830 | 1,330 | 2,080 |
| 2 weeks working, 8h/day | 80 | 1,280 | 2,080 | 3,280 |

Those rates are billed rates, and a self-employed maker in Italy keeps roughly
half of one after contributions and tax. EUR 15/h billed is below a living wage
once unbilled time (admin, photography, Instagram, answering enquiries, which is
easily a third of the week) is carried by the same hours.

### What the eight Creature would cost, by shape

Hours are banded by construction, not guessed to the hour. PRICE = hours x rate
+ EUR 80 material.

| Creature | hours | @15/h | @25/h | @40/h |
| --- | --- | --- | --- | --- |
| capo-01 black leather shirt | 40-60 | 680-980 | 1,080-1,580 | 1,680-2,480 |
| capo-02 shirt, bell sleeves | 40-60 | 680-980 | 1,080-1,580 | 1,680-2,480 |
| capo-03 scrap vest, pieced | 25-40 | 455-680 | 705-1,080 | 1,080-1,680 |
| capo-04 vest | 15-25 | 305-455 | 455-705 | 680-1,080 |
| capo-05 leather trousers | 30-45 | 530-755 | 830-1,205 | 1,280-1,880 |
| Rubedo, 500 hand stitches | 70-100 | 1,130-1,580 | 1,830-2,580 | 2,880-4,080 |
| capo-07 wide leather trousers | 30-45 | 530-755 | 830-1,205 | 1,280-1,880 |
| capo-08 tube top + python skirt | 20-30 | 380-530 | 580-830 | 880-1,280 |

### What the old list actually paid him, per hour

Material deducted, hours banded as above:

| item | EUR | hours | EUR per hour |
| --- | --- | --- | --- |
| patchwork tibia cut pants | 175 | 30-45 | **2.1-3.2** |
| snakeskin mini bag | 150 | 8-14 | 5.0-8.8 |
| Tenebrae scraps vest | 300 | 25-40 | 5.5-8.8 |
| leather hat | 125 | 4-8 | 5.6-11.2 |
| Severya python skirt | 250 | 20-30 | 5.7-8.5 |
| Armonyen shirt | 450 | 40-60 | 6.2-9.2 |
| Monumentus Tenebrae tibia cut | 675 | 30-45 | 13.2-19.8 |
| Tenebrae leather pants | 875 | 30-45 | 17.7-26.5 |

**On any plausible reading the old list paid him between two and nine euro an
hour for most of the range.** Only the two most expensive pieces cleared
thirteen. Pricing work below the cost of making it does not survive success: the
better it sells the faster he goes broke, and the busier he is the less time he
has to fix it. This is the finding, and it should not be softened.

### The three levers, and what each really costs him

**1. Repeat known pieces at a lower tier.**
Buys a sellable tier without lowering the price of new work, and it does not
contradict the brand: his own text already says "A work of repetition, patience,
and precision."
The cost is not money, it is attention. Every hour repeating is an hour not
experimenting, and the tenth Tomar is not interesting to make. It also caps that
piece forever: once a repeat price exists, the original cannot be sold at three
times as much to someone else.
Before pricing this tier he must TIME AN ACTUAL REPEAT. First repeats are rarely
much faster, and a tier priced on an imagined speedup loses money on every unit.

**2. A genuinely lower entry tier of accessories.**
The strongest lever, and the cheapest. Few hours, uses offcuts he already
generates (the scrap vest proves the offcuts exist), and it is the only way a
young audience owns anything of the brand.
His own old list already validates it: the hat at EUR 125 for four to eight
hours is the only line item that approaches a defensible rate.
The cost is positioning. Rick Owens sells EUR 300 accessories underneath a EUR
3,000 clothing brand, and the clothing legitimises the accessory, never the
reverse. If accessories become most of the revenue the brand becomes an
accessories brand. The garments must stay visible and expensive for this to
work, which means the site must not let accessories dominate it.

**3. Price for an international audience.**
This is the lever that resolves the constraint rather than working around it.
80 hours at EUR 25 plus material is EUR 2,080. Isaac Sellam's leather jackets
are EUR 2,016 to 2,270. **The labour-derived price and the international market
price are the same number.** The labour price is not too high; the Italian
market is the wrong market for labour-priced work.
What it costs him is operations, not craft: customs paperwork, IOSS or local VAT
handling, returns from outside the EU, longer payment cycles, and answering
enquiries in English at Asian hours. The one-day reply promise gets harder and
more valuable at the same time.

### What changes on the site if the buyer is Tokyo, Seoul, Berlin or New York

1. **Trust replaces mood as the primary design problem.** A Neapolitan buyer can
   visit the studio. A Tokyo buyer is sending EUR 1,500 to one person they have
   never met. Process photography, the maker's hands and face, a real address
   and a real reply stop being atmosphere and start being evidence.
2. **The default locale is wrong.** `/` redirects to `/it`. For an
   English-speaking international buyer the site opens in a language they do not
   read. Section 5 forbids auto-detect, and rightly, but the DEFAULT is a
   separate decision and is currently Italian by inheritance rather than by
   choice.
3. **Duties and shipping must be explicit.** "Shipped worldwide" is not enough
   at this price from outside the EU. Who pays customs is a question the site
   does not answer.
4. **Payment.** Enquiry to invoice to bank transfer is heavy friction for an
   international buyer. A payment link is the obvious answer and it is the first
   thing on this project that would cost money (standing rule 13), so it needs
   asking before building.
5. **Measurements in centimetres only.** An American buyer thinks in inches.
6. **Fit confidence**, which loops directly back to section 31. An international
   buyer cannot try anything on, so whichever answer he gives there matters more
   abroad than at home.

### What he must supply

Unchanged from section 30, plus one: **is two weeks working hours or elapsed
time?** Every number above moves by a factor of two and a half on that answer
alone, and it is a single question.

---

## 33. What the references have that we do not (re-fetched 2026-08-02)

Structure only, not styling. Sellam and Rick Owens re-fetched live; Sorcinelli
has become a fragrance shop and is now weak evidence for a clothing site.

| structural piece | Sellam | Rick Owens | Sorcinelli | us | verdict |
| --- | --- | --- | --- | --- | --- |
| Legal / privacy / terms / refund | yes | yes | yes | **NONE** | **MANDATORY** |
| Newsletter | yes | yes | yes | no | valuable, not free |
| The designer (a page about the person) | "THE DESIGNER" | no | "About us" | no | **RECOMMEND** |
| Care instructions | no | no | no | no | **RECOMMEND anyway** |
| Stockists / store locator | yes | "Stores" | no | no | furniture, he has none |
| Archive AND sample sales | "ARCHIVES AND SAMPLE SALES" | no | no | archive only | **RAISE** |
| Search | yes | yes | no | no | furniture at eight pieces |
| Account, cart, wishlist | yes | yes | yes | no | furniture, we do not sell |
| Region / currency switcher | no | yes | no | no | furniture, EUR decided |
| Editorial (runway, interviews, exhibitions) | no | yes | no | no | furniture at this size |
| Size guide | not visible | not visible | n/a | no | note: NEITHER reference publishes one |

Four conclusions worth acting on:

1. **Legal is not furniture and it is the single hardest launch blocker.** All
   three references carry privacy, terms and refund pages. We collect a name, an
   email and three BODY MEASUREMENTS through a form that works today, with no
   privacy notice, no consent line and no legal entity named. That is a GDPR
   obligation, not a nicety, and it is already live behind a noindex.
2. **A designer page is cheap and does real work**, and it is the international
   trust lever from section 32. Sellam has one. Ours would be one photograph of
   him or his hands, and a short text in his voice. It is not the About page:
   that is the brand's story, this is the person.
3. **Care instructions are recommended even though no reference has one.**
   Vegetable-tanned leather changes with wear, which is the brand's entire
   argument ("living textures", "similar, but never identical"). Telling a buyer
   how to live with it is on-brand and useful, and it is a page of text.
4. **Sellam sells his archive.** We have an archive page with nine pieces and no
   years. If archive pieces could be marked available, that is inventory that
   already exists, photographed, unsold, and it directly serves the entry-tier
   problem in section 32.

---

## 34. Video, and the arrival

### Video is the real gap, and the references agree

Rick Owens carries five or six video blocks on the homepage; the plan measured
fourteen autoplay loops in section 14. Both video-carrying references move
INSIDE the frame rather than moving the frame. We have stills only.

### Where video can live on the free tier

Two options and they trade against each other:

- **Sanity assets** (the `media.video` field already exists). The owner can
  upload it himself, which is constraint 3 in section 0 and matters. The risk is
  bandwidth: the free tier is about 100GB a month and a 4MB loop viewed 10,000
  times is 40GB. Section 12 already anticipated exactly this.
- **Cloudflare Pages, files committed under `public/`.** Static asset requests
  are unlimited and free (section 16), with a 25 MiB per-file ceiling. No
  bandwidth risk at all. The cost is that the owner cannot add a video without a
  developer, and every clip lives in git history forever.

RECOMMENDATION: start on Sanity, because owner-manageable beats theoretically
cheaper, and move to Pages if bandwidth approaches the cap. That is what section
12 already committed to and there is no reason to reverse it.

### How it has to behave

- Poster always required and always shipped first. The poster is the LCP
  candidate and goes through the Sanity image pipeline with a real srcset.
- `muted loop playsinline preload="none"`. Muted is not a preference, it is the
  only way autoplay is permitted at all.
- Play only when on screen, pause when off, via IntersectionObserver. A phone
  should never download a loop the reader never reaches.
- Never autoplay under `prefers-reduced-motion`. The poster simply stands.
- Never autoplay when `navigator.connection.saveData` is set.
- **On a slow phone:** the poster paints immediately, the video begins
  downloading only when the frame is in view, and if it never arrives the poster
  stands and nothing looks broken or empty. That is the whole design: the video
  is an enhancement over a page that is already complete.

### The shot list to send the owner

The three existing clips are unusable: three to five seconds is too short to
loop without a visible jump, 720p is too soft for a full-bleed frame on a 3x
phone screen, and the audio will be stripped anyway.

**Rules for all of them**

- **Vertical, 9:16.** The site is mobile-first and full bleed; a landscape clip
  gets destroyed by the crop.
- **4K if the phone offers it, otherwise 1080x1920 minimum. 24 or 30fps, never
  60.** Sixty is a bigger file for no visible benefit here.
- **Film 20 to 30 seconds. We cut an 8 to 15 second loop out of the middle.**
- **It must loop.** Film a CONTINUOUS UNCHANGING action: leather moving in a
  draught, hands stitching in rhythm. Do not begin with a hand entering the
  frame and end with it leaving; there is no loop point in that.
- **Lock the phone down.** Tripod, or wedge it against something. No handheld,
  no walking, no zoom, no pan. The camera is a witness, not a participant.
- **Lock exposure and focus.** Tap and hold until AE/AF locks. Auto-exposure
  hunting mid-shot is the single thing that makes phone video look amateur, and
  it destroys a loop because the two ends no longer match.
- **No slow motion, no filters, no in-app grading.**
- **The light he already uses.** Hard directional sun in the studio. Do not add
  lamps.
- **Send the originals**, uncompressed, one file per shot, named per the list.

**The five shots, in priority order**

1. **THE ARRIVAL.** One Creature hanging in the black steel frame, filmed
   straight on, camera locked, in a draught so the leather moves a few
   centimetres. 30 seconds. This is the most valuable clip on the list: it is
   the answer to the arrival question below.
2. **THE WALK.** A person wearing a Creature walking toward or away from the
   camera through the shaft of sunlight, one continuous pass, 15 seconds. For
   the worn band.
3. **THE HANDS.** Close on hands stitching or cutting, locked off, 30 seconds of
   continuous rhythm. This is the clip that PROVES "500 handmade scar-stitch",
   and it is the one an international buyer needs most (section 32).
4. **THE HIDE.** A whole hide being lifted, turned or laid down. One movement,
   10 seconds. Shows scale and weight, which no still can.
5. **A DETAIL IN MOTION.** A zip, a fringe, a cut hem swinging. 10 seconds.
   Optional, and only if it genuinely moves.

### The arrival: argued, and the answer is no

Should a held black precede the first photograph?

FOR: the brand is built on thresholds and transformation, and the site currently
starts with the reader already inside.

AGAINST, and it is decisive:

1. **The wipe is already the site's threshold.** Section 22's second condition
   is one inversion per journey. A held black before the first photograph would
   be a second threshold within thirty seconds of the first, and the two would
   compete rather than compound.
2. **It costs the first paint.** The arrival photograph is the LCP element and
   is deliberately excluded from the reveal for exactly that reason. Putting a
   held black in front of it contradicts a decision already made on evidence.
3. **The primary visitor is on a phone on mobile data, arriving from
   Instagram.** A splash spends their attention before showing them anything.
4. **The second visit is worse than the first.** Making it once-per-session
   needs storage and produces two different sites.
5. It is the most dated gesture in fashion web design.

**But the want behind the question is real, and there is a free answer.**

The page opens in INK, because the wipe now runs nigredo to albedo. The arrival
photograph is `IMG_3463`, the PALE trousers: a Lux piece, bright, on a black
page. **The arrival currently contradicts the wipe's own direction.** Opening on
a dark Tenebrae frame would make the page appear to emerge out of black, give
the threshold its moment, cost nothing, and put the sequence in his own order:
darkness first, light after.

RECOMMENDATION: no splash. Swap the arrival frame for a dark one, which is free
and is an owner choice about which photograph. Then film shot 1 above, and the
hanging Creature moving in a draught becomes the real arrival: a presence, held,
before the reader scrolls. That is the threshold the question is asking for, and
it arrives as content rather than as an effect.

---

## 35. Everything else, ordered by whether it blocks launch

### Blocks launch, needs the owner

1. **Legal entity details and a privacy policy.** The form collects a name, an
   email and three body measurements TODAY. GDPR. Hardest blocker (section 33).
2. **The real contact email.** `info@example.com` is still in site settings and
   must never ship. The studio warns; the site shows a marked placeholder.
3. **Ready or remade** (section 31). Everything about the enquiry path depends
   on the answer.
4. **Creature names, compositions, prices.** Seven of eight show placeholders.
5. **Two weeks: working hours or elapsed?** One question, and every price in
   section 32 moves by two and a half times on the answer.
6. **Tannage**, to confirm the seven tenebrae assignments.
7. **Archive years**, or fold the best frames into the home sequence and drop
   the section (section 18 already set that condition).

### Blocks launch, mine

8. **A privacy notice and a consent line on the enquiry form.** Depends on 1.
9. **RATE LIMITING ON THE ENQUIRY ENDPOINT.** Section 8 specified it and it was
   never built: the function has a spam trap and a three-second floor and
   nothing else. Anyone can POST in a loop and burn the Resend free allowance of
   100 a day, which is a denial of the brand's only sales channel. This is the
   most serious unflagged gap in the build.
10. **Remove the two noindex locks** (section 16), last, after everything else.
11. **The domain switch**, four steps, ready in section 29.
12. **Resolve the visible draft marks.** Live pages currently show "Unapproved
    draft" in the footer and on the enquiry page. Either he approves the wording
    or it is rewritten, but shipping a launch with visible draft marks is worse
    than either.
13. **Cloudflare Web Analytics token.** Cheap, cookieless, decided long ago in
    section 9, still not wired.

### Does not block launch

14. Video, and the shot list (section 34).
15. A designer page (section 33).
16. Care instructions (section 33).
17. Archive pieces marked available, the Sellam sample-sale idea (section 33).
18. An accessories entry tier (section 32).
19. Newsletter. Needs a free, GDPR-safe, no-third-party-script provider, which
    conflicts with standing rules 4 and 13. Defer until someone asks for it.
20. The collections index still repeats the home page's opening gesture
    (section 23 flag 5), unresolved and waiting for a second collection.
21. Accents in the older Italian interface strings, inconsistent with the brand
    copy (flagged in section 22, still not fixed).
22. **`npm run seed` is now a footgun.** It deletes any collection that is not
    the seed collection, which means running it against the current dataset
    destroys real content. It should refuse to run unless a flag is passed.


---

## 36. Legal is deferred, and what that means concretely (2026-08-02)

DEFERRED BY THE OWNER. Recorded here so it cannot be mistaken for done, and so
the consequence is written down rather than assumed.

**THE SITE CANNOT ACCEPT A REAL ENQUIRY UNTIL A PRIVACY NOTICE EXISTS.** The
form collects a name, an email address and three body measurements. That is
personal data under GDPR, and body measurements are the kind of data a person
reasonably expects to be told about. Collecting it with no privacy notice, no
named data controller and no consent line is not a missing page: it is
collecting personal data without the disclosure that makes collecting it lawful.

Today this is contained by accident rather than by design: the three Resend
secrets are unset, so a submission is refused with a 503 and no data leaves
Cloudflare. **The moment those secrets are set, the site starts receiving and
storing personal data, and at that moment the absence becomes real.** Step 3 of
the domain switch in section 29 is therefore gated on this, and section 29
should not be run past step 2 until it is resolved.

**THE RATE LIMIT DOES NOT SUBSTITUTE FOR IT.** They solve unrelated problems.
Section 35 item 9 protects the Resend allowance from abuse; it says nothing
about whether the brand is allowed to hold a stranger's chest measurement. A
rate-limited form that unlawfully collects data collects it more slowly.

What is needed, minimally: the legal entity name and address, a privacy notice
naming the controller, what is collected, why, how long it is kept and how to
ask for deletion, and one line plus a link on the enquiry form itself.

---

## 37. If the buyer is not Italian: two costings (2026-08-02)

Costed, NOT built.

### 1. The root redirect to /it

`public/_redirects` sends `/` to `/it` with a 301, and `Base.astro` points
`hreflang="x-default"` at the Italian home. Both say Italian is the site's
default, which was inherited rather than chosen. Section 5 forbids language
AUTO-DETECTION and that stands; the DEFAULT is a separate decision.

| option | what it is | cost | verdict |
| --- | --- | --- | --- |
| **A. Default to `/en`** | change the redirect and `x-default`. | Two lines and a redeploy. Italian visitors, including the owner, land in English and use the switch. No technical risk, no new page, no new concept. | **RECOMMENDED** if the intended buyer is international. It is a positioning decision wearing a technical costume. |
| **B. A chooser at the root** | `/` serves a screen with the signature and two words, ITALIANO and ENGLISH. | One new page, plus a click before anyone sees a photograph. It is not a splash but it lands in the same place: a barrier in front of the work, which section 34 argued against. Also a thin root page for search engines. | **NO.** It buys neutrality and spends the arrival. |
| **C. `/` serves English directly, no redirect** | the root becomes a copy of the English home; `/it` and `/en` also exist. | Cheap, but three URLs for two pages, needing a canonical on the root pointing at `/en`, and every internal link has to pick one. Muddies a structure that is currently clean. | **NO**, unless A is rejected for a reason that also rules out a redirect. |
| **D. Keep `/it`, make the switch louder** | move the language switch out of the menu. | Contradicts section 4, which removed persistent chrome deliberately, and does not fix the first impression: the visitor still reads Italian before they find the switch. | **NO.** |
| **E. Geo-routing at the edge** | Cloudflare can route on country. | Country is not language, an Italian in Berlin gets the wrong one, and it is auto-detection in everything but name. | **NO**, and it breaks section 5. |

Note that A costs nothing to reverse, which is the main argument for trying it.

### 2. What else assumes an Italian buyer

Beyond the three already named (duties, payment friction, centimetres):

1. **The enquiry form actively REJECTS American measurements.** Chest is
   validated between 50 and 200, which is centimetres. A US buyer typing 40, in
   inches, is told "Chest is in centimetres, between 50 and 200." The number
   they entered is a perfectly normal chest. This is not a units label problem,
   it is a valid customer being turned away by a validator, and it is the worst
   item on this list.
2. **`hreflang="x-default"` points at Italian**, so search engines are told the
   Italian page is the one to show a visitor of unknown language.
3. **No timezone on the reply promise.** "We reply within one day" from a
   one-person studio in Italy means something different in Seoul. It is not
   wrong, it is just unqualified.
4. **The returns line understates the cost outside the EU.** "The customer pays
   the return shipping" is true and incomplete: a non-EU return can also mean
   customs charges and re-import paperwork. At these prices that difference is
   material.
5. **No address anywhere.** With legal deferred (section 36) the site says
   "South Italy" and nothing else. A buyer sending EUR 1,500 to one person has
   no way to establish the business exists.
6. **Currency is EUR only, correctly**, but nothing on the site says so before
   the price appears. A US visitor sees a number whose currency they have to
   infer.
7. **Italian is the default locale**, so the first impression for a
   non-Italian is a language they may not read. Same root as costing 1.
8. **No fit guidance of any kind**, and no reference does this either. An
   international buyer cannot try anything on and cannot visit, so whichever
   answer section 31 gets matters more abroad than at home.
9. **The measurement instructions assume someone with a tape measure and
   nobody to help.** "From the outer edge of one shoulder to the other, across
   the back" is hard alone. A buyer who guesses produces a garment that does not
   fit, which becomes a return, which is item 4.
10. **Payment is unnamed.** The site never says how a piece is paid for. In
    Italy a bank transfer is unremarkable; elsewhere it reads as a warning sign.

The pattern: items 1, 5, 8, 9 and 10 are all **trust and completability**, which
is exactly what section 32 predicted would replace mood as the primary design
problem the moment the buyer stops being able to visit the studio.


---

## 38. Units, the default locale, and the rest of section 37 (2026-08-02)

### A buyer in inches is no longer turned away

The highest-value fix on the list, because it was a lost sale that appeared in
no log. Chest was validated between 50 and 200 with no unit choice, so an
American entering 40, a completely ordinary chest in inches, was told "Chest is
in centimetres, between 50 and 200" and could not proceed.

How it works now:

- ONE unit for all three numbers, chosen by the person filling the form. Nobody
  measures a chest in inches and shoulders in centimetres, and asking three
  times would be three chances to get it wrong.
- A RADIO GROUP, not a script. The whole form works with no JavaScript
  (section 19) and the server does the conversion. That is also why the field
  labels no longer read "(cm)": without JavaScript a label cannot follow a
  radio, so the unit is stated once and governs everything under it.
- The inputs carry `step="any"` and NO min/max, because the accepted range
  depends on a unit the browser cannot know about without script.
- CENTIMETRES are validated, stored and sent. The email carries centimetres and
  echoes the original only when it was inches, so the owner can sanity-check a
  conversion without doing arithmetic.
- The error names the range in THE UNIT THEY CHOSE. Telling someone who picked
  inches that a chest must be "between 50 and 200" is the original bug wearing a
  different hat. The inch range is rounded INWARD, ceil the minimum and floor
  the maximum, so anyone who obeys the message passes.

Verified against the real Workers runtime: 40/18/28 in returns 200 where it
previously returned 422; the same numbers as centimetres are still refused,
because a 40cm chest is not a chest; an out-of-range inch value reports "between
20 and 78 in" in English and "tra 20 e 78 in" in Italian; and a 102/46/71 cm
buyer is unaffected.

### English is the routing default

Changed because the positioning is settled (section 32): the labour price and
the international market price are the same number, so the intended buyer is not
Italian. The bare root, the Astro i18n default, the sitemap default and
`hreflang="x-default"` all point at English now.

Italian is unchanged in every other respect: its own prefix, first class, the
owner's own approved words, reachable in one tap from the menu. Nothing detects
a language and nothing reads a header. This is a path default, not a redirect by
detection, and section 5 still holds.

**One trap inside this change, worth remembering.** `DEFAULT_LOCALE` was doing
two unrelated jobs: which language the site routes to, and which language ALT
TEXT falls back to. Those answers are now different. Alt text is authored in
ITALIAN with English optional (section 17), so flipping one constant would have
silently emptied the alt text on every English page: an English reader with no
English alt would have fallen back to the empty English field instead of the
Italian description. They are now two constants, `DEFAULT_LOCALE` and
`ALT_FALLBACK_LOCALE`, and the second must never be collapsed into the first.

### The rest of section 37, where it did not need the owner

- **Timezone on the reply promise.** "We reply within one day, Italian time."
  One day from a one-person studio means something different in Seoul, and the
  promise was unqualified rather than wrong.
- **Returns outside the EU.** A third line: "Outside the EU, any customs or
  import charges are the customer's too." That is an EXTENSION of his stated
  rule rather than a new one. He said the customer pays to send it back; outside
  the EU that cost also includes customs, and at these prices the difference is
  material. Still our wording, so still marked.
- **Fit guidance.** One line beside the reference measurements: compare them
  with a garment you already own and like the fit of. Deliberately phrased to be
  true under BOTH answers to the open question in section 31, since it works
  whether the numbers describe the photographed sample or the object that will
  arrive.
- **Measuring help.** The instructions assumed a tape measure and no help. They
  now say a piece of string works, that the shoulders need a second person, and
  that a best guess plus a note in the message is better than a wrong number
  entered confidently.

STILL WAITING ON THE OWNER, unchanged: the address (item 5) and payment
(item 10). Legal remains deferred and gated exactly as section 36 describes;
nothing here relaxes it.

### A live-fire hazard found while testing, and NOT fixed

The local `.env` holds all three Resend secrets, and current Wrangler reads
`.env`. **Submitting the enquiry form against `wrangler pages dev` therefore
sends REAL EMAIL.** Three test submissions during the work above were accepted
by Resend and delivered to `ENQUIRY_TO_EMAIL`, from "Sam <s@example.com>", and
spent three of the hundred-a-day allowance.

This is the same class of trap as the seed script: a local command with an
outward-facing side effect and nothing saying so. It is recorded rather than
fixed because the fix is a judgement call, not a mechanism:

- The secrets arguably should not be on the laptop at all. Section 29 step 3
  puts them in the Cloudflare Pages environment, which is where they belong;
  local `.env` needs `PUBLIC_*` and `SANITY_WRITE_TOKEN` and nothing else.
- Alternatively the function could refuse to send when it can see it is running
  locally, but "detect localhost" is exactly the kind of environment sniffing
  that goes wrong quietly.

RECOMMENDATION: remove the three Resend values from local `.env` and keep them
only in Cloudflare. Then local testing exercises the 503 path, which is what
section 19 always assumed it did.


---

## 39. The no-grid rule, revised openly (2026-08-02)

### The revision

**"No thumbnail grid" was OUR rule, not the brief's.** It was derived from the
references in section 14 before there was a real catalogue, when the dataset
held two seeded fixtures and the only risk worth guarding against was reducing
a garment to a card. With sixteen Creature the same rule produces a different
failure: no view of the work as a body, and every piece four taps from the door.

It is revised rather than abandoned, and the distinction matters:

- **A view of everything now exists**, at `/[lang]/creature`. It is where you go
  to see the catalogue.
- **The one-per-screen treatment survives** on the collection page, which is the
  narrative, and on the home sequence.
- **The thing the rule was protecting is still protected.** Two per row maximum,
  never three, because three across is the width at which a garment becomes a
  thumbnail. No cards, no borders, no gaps, no shadows, no rounded corners, no
  prices, no filters, no sort control.

The primary reference already licenses this: Rick Owens pairs 720x900 frames
side by side and TOUCHING, measured in section 14 and never built until now.

### What makes it density rather than a spreadsheet

- **Touching.** No gutter at all. The seam between two Creature is a hard edge,
  which is the same language the wipe speaks.
- **An alternating rhythm.** Rows alternate `--media-h-tall` (88svh) and
  `--media-h-short` (62svh on a phone, 68svh on desktop), computed per ROW so a
  pair always agrees with itself. Two frames of different heights side by side
  would leave a hole, which is the one thing a page with no gaps cannot have.
- **11px inscriptions** over the frame, in the owner's per-image polarity. Name
  and reference code. No price: this page is for seeing the work.
- **Order is the stage order** (section 28): tenebrae, then lux, then
  unassigned. Nothing labels it.

### Navigation depth, which was the real bug

The old Shopify site put every product two taps from the door and this one had
lost that. From the home page it is now: **home, All Creature, a Creature. Two
taps.** The menu also carries the index, and the collection page ends with a
route to it, so there is no path that reaches a dead end.

The menu had three destinations for a site with six sections. It has five now:
All Creature, Collections, Archive, About, Contact.

---

## 40. Filling the catalogue: what was named and what was not

The old site carried sixteen products; eight were imported. Going back through
`products/` and `archive/` frame by frame found the rest. **Sixteen Creature
now**, from 72 assets.

### Named, with the evidence

| Creature | frames | why it is certain |
| --- | --- | --- |
| **Glovyes** | 4 | Leg warmers are unmistakable: two separate tubes with crossing straps, not joined at the waist. Nothing else in the set is that shape. |
| **Styrax** | 1 | His caption: "The Forest Calling. Name of the creature: Styrax." `archive/IMG_0204` is the ONLY frame in the entire set shot in a forest, and it shows a shearling and leather top, which is the other caption exactly. |
| **Ghezard** | 4 | "Goat Shearling featuring a Washed brown Leather." The only brown piece in the set, and the fur lining is visible at the zip. |
| **Rubedo** | 7, was 3 | Four hanging frames added, including `archive/IMG_3481` which shows the Oblivion hole in the upper back, and `IMG_3479` which confirms it is a SHIRT (collar, placket, cuffs) as his caption says. |

### Not named, and the reason for each

| id | what it is | why not named |
| --- | --- | --- |
| `capo-09` | the bag, 2 frames | The only bag in the set, so it is the bag from the price list. That list calls it a "snakeskin mini bag" and this leather reads as pebbled rather than snake, so the name is his to confirm. |
| `capo-10` | pale trousers, cropped and very wide, 4 frames | Pale, so Lux. Which of Lux leather pants, Aleya bootcut or Tomar shorts it is cannot be read off a photograph. |
| `capo-11` | pale trousers, full length, 4 frames | Recorded SEPARATELY from capo-10 because the lengths plainly differ: capo-10 ends mid-calf on a hanger, capo-11 pools at the ankle on a body. If they are one piece, merge them; if not, they need two names. |
| `capo-12` | black leather halter top on a mannequin | A finished piece with no caption to match it to. |
| `capo-13` | dark piece, leather waistband and fabric panels | Same. |
| `capo-01` to `capo-08` | as before | Unchanged, and the ambiguity table in section 24 still stands. |

### THE HAT DOES NOT EXIST IN ANY FOLDER

Every file in `products/`, `archive/`, `experimental/` and `homepage/` has now
been looked at. **There is no photograph of the leather hat.** It is on the price
list at EUR 125 and it is, with the bag, one of the two entry-tier pieces the
pricing analysis in section 32 said the brand needs. It cannot go on the site
until it is photographed, and photographing it should be near the top of his
list.

### Materials, and a deliberate gap in Italian

Styrax and Ghezard carry his own composition lines. Their DESCRIPTIONS are his
captions verbatim in English and **deliberately empty in Italian**: he approved
the Italian of the brand text he was SHOWN, not translations invented
afterwards, and `approvedLanguages` is global. An empty field shows as missing
(see `pick` in `lib/locales.ts`), which is honest and makes the gap visible
instead of forging approval. Materials ARE translated, because a composition is
a fact like a reference code, not a voice.

### The archive shrank, and that is a promotion

From nine frames to five. Ghezard, the bag, the pale trousers and the red shirt
became Creature with pages of their own, so keeping them in the archive as well
would have shown the same object twice under two different ideas of what it is.
What remains is what the archive was always for: work with no page of its own.

The import now also DELETES documents it no longer owns, scoped to the `piece-`
and `archive-` ids it generates. `createOrReplace` writes what is in the plan
and says nothing about what has left it, which is how those four would otherwise
have lingered.


---

## 41. Three questions settled, and the designer page (2026-08-02)

### READY OR REMADE: SETTLED. Do not reopen.

The owner's answer: **the sixteen pieces on the site are EXAMPLES, and every one
is remade to the buyer's measurements. There are no ready pieces in fixed
sizes.**

Consequences, recorded so the third round of this conversation does not happen:

- Section 31's costing is spent. Reading A was correct, the cost was zero, and
  **nothing in the enquiry path was wrong**: the form asking for chest,
  shoulders and length is right; his own line about sending measurements is
  right; "Handmade. Made to measure." on every inscription is right.
- `measurements` means what it always meant: the REFERENCE measurements of the
  photographed piece, not of the object a buyer receives.
- **No size system returns.** Section 17 stands, now for the second time and on
  the owner's own word rather than on inference.
- The `availability` enum keeps its four values. Widening it to five was
  contingency and the contingency did not fire.

### ACCESSORIES ARE CREATURE

No `kind` field, no accessories section. The hat and the bag take their place in
the index like everything else. If pricing tiers need to tell them apart later
that is a PRICING concern and not a taxonomy one, and it does not belong in the
content model.

### THE ARCHIVE IS A GALLERY

The owner wants the brand's imagery held as a gallery, not a dated record of
past work. **The condition set in section 18 is withdrawn**: it demanded a year
per frame or the section should be dropped, and that was right for an archive
and wrong for what this is.

WHAT CHANGES, because a gallery and an archive are different objects:

| | archive | gallery |
| --- | --- | --- |
| wants | chronology and provenance | sequence and rhythm |
| the year | required, or it is a mood board | REMOVED from the schema |
| the name | identifies a piece | optional, usually absent, the frame is silent |
| curation | one frame per distinct piece, to avoid double-counting | a frame earns its place by being a good photograph |
| order | chronological | editorial, and it is the whole design |
| form | uniform full screens, a record | alternating tall and short, so it reads as a sequence rather than a contact sheet |

Implemented: `year` is gone from the schema and every frame, the label is
Gallery / Galleria in both languages, and the page alternates
`--media-h-tall` and `--media-h-short`.

TWO CONSEQUENCES WORTH DECIDING, not done:

1. **It should probably grow.** The old curation rule capped it at one frame per
   piece and that rule is gone, so five frames is now thin for something whose
   whole purpose is rhythm. There are roughly a dozen unused frames that would
   qualify. Say the word and it fills.
2. **The route is still `/archive`** while the label says Gallery. Renaming a
   URL was your call last time and this is the same kind of decision, so it is
   left as a question rather than done.

### The designer page

Built, at `/[lang]/designer`, and in the menu. It is the strongest
international-trust lever in section 33: a buyer who cannot visit the studio is
sending four figures to a stranger, and this is the page that makes him not one.

The portrait does the work: him at the sewing machine, a whole hide across the
table, in black and white. Chrome contrast measured at 9.02.

**NO INVENTED BIOGRAPHY.** The only text is his own making lines, which are the
one thing he has written that is genuinely about how HE works rather than about
the brand. Everything else is a marked `{DESIGNER_BIOGRAPHY}` placeholder.

WHAT TO ASK HIM, phrased to send:

1. Come ti chiami? Il file della fotografia si chiama "ciro-designer", quindi ti
   chiami Ciro? E Aleksander Cecco e il nome del marchio e non il tuo?
   (What is your name? The photograph is filed as "ciro-designer", so are you
   Ciro, and is Aleksander Cecco the brand's name rather than yours?)
2. Come hai imparato? Due frasi tue, non un curriculum.
   (How did you learn? Two sentences in your own words, not a CV.)
3. Da quanto tempo fai questo lavoro?
   (How long have you been doing this?)
4. Lavori da solo o con qualcuno?
   (Do you work alone, or with someone?)
5. Perche la pelle e non altro?
   (Why leather and not something else?)
6. Vuoi altre fotografie di te al lavoro, o basta questa?
   (Do you want more photographs of yourself working, or is this one enough?)

**A find worth reporting: the leather hat is IN this photograph**, on the table
in the foreground. It exists. It has no product shot, which is a filming request
rather than a gap in the catalogue.

---

## 42. The audit fixes (2026-08-02)

**The collection page is a narrative again.** Fixing "it carries one photograph"
by pairing fifteen Creature two across created a worse problem: two pages
showing the same fifteen frames in nearly the same layout. The pairs belong on
the index, where density is the point. This page is now cover, statement, FIVE
Creature one per screen, then the count and the route to the rest. Five is
roughly four screens, which is a chapter; fifteen is a catalogue and the
catalogue has its own page. Which five is his, being the first five in his own
drag order, so curating this page is reordering the collection.

**Next and previous** on every Creature, in the same order as the index, and it
WRAPS: a sequence that stops has an end and an end invites leaving. Sixteen dead
ends became a sequence, and the most repeated action on the site (back to the
index, pick another) is gone.

**The count on the index.** Sixteen, in mono, under the heading. A visitor who
has seen four photographs on the home page has no other way to know the
catalogue is real.

**The worn band draws from everything on-model.** It showed five frames of TWO
garments, which made the brand look smaller on the page most visitors see than
it actually is. It now carries one frame from every Creature that has an
on-model photograph, five of the sixteen, plus the one on-model frame belonging
to no Creature. Five garments instead of two.

Only five Creature have EVER been photographed on a body. That is the ceiling
here and it is a shoot request, not a code problem.

---

## 43. Launch checklist, reordered (2026-08-02)

**1. THERE IS NO WORKING WAY TO REACH A HUMAN.** `contactEmail` is still
`info@example.com`, so the site renders a marked placeholder and the only route
to the brand is Instagram. This is now the TOP of the checklist, above legal, on
the owner's instruction and correctly: legal makes the site unlawful to operate,
this makes it useless. A visitor who wants a Creature cannot ask for one.

2. Legal entity and privacy notice, still deferred, still gated exactly as
   section 36 describes.
3. Creature names, compositions and prices.
4. Two weeks: working hours or elapsed.
5. The remaining launch items in section 35, unchanged.

### Added to the shot list (section 34)

- **The leather hat.** It exists, it is in the designer portrait on the table,
  and it has no photograph of its own. With the bag it is an entry-tier piece.
- **Five single-frame Creature**: Styrax, `capo-03`, `capo-04`, `capo-12`,
  `capo-13`. One photograph is not enough to buy from at these prices.
- **On-model frames for the other eleven Creature.** Only five have ever been
  worn in a photograph, which caps the worn band at five no matter what the code
  does.

---

## 44. The maker's name (2026-08-03)

**His name is CIRO CECCO. Aleksander Cecco is the BRAND, not the person.**

Recorded so nobody asks again. Question 1 of the six in section 41 is answered
and should be dropped from what gets sent to him.

**HIS NAME IS NOT ON THE SITE AND MUST NOT BE ADDED.** Whether the maker is
named in public is HIS decision and not ours, and he has not made it. The
designer page shows the portrait and his own words about the work, and where a
name would go there is a `{DESIGNER_BIOGRAPHY}` placeholder. Verified in the
build: the string "Ciro" appears nowhere in the deployed output, in either
language.

Add it only when the owner confirms he wants it there.

---

## 45. The gallery, filled (2026-08-03)

Twelve frames, up from five. The old one-frame-per-piece rule went with the
archive (section 18); the only test left is the owner's own: **a frame earns its
place by being a good photograph.**

**ONE RULE KEPT**, to stop the gallery quietly becoming the index a second time:
NEVER a Creature's lead frame. Where a piece recurs here it recurs through a
SECONDARY photograph, so a reader arriving from the index still meets something
they have not seen.

### The order, which is the design

It runs dark to light, which is the site's own logic and is never stated:

1. `experimental/IMG_2897`, a near-abstract study of deep folds. Opens in the dark.
2. `homepage/IMG_3434`, the signature embossed in black leather. Recorded here as LANDSCAPE and it is not: see the correction in section 56.
3. `archive/IMG_2235`, the black cape open on concrete.
4. `products/IMG_0207`, the fur with its trailing threads. Texture, close.
5. `archive/IMG_2242`, a vest laid out.
6. `products/IMG_3468`, zip and folds, close.
7. `archive/IMG_2244`, the second vest, oblique.
8. `products/IMG_3455`, the pointed hem against concrete.
9. `archive/IMG_2229`, the long zip.
10. `experimental/f797a2c2`, the cut pattern pieces on the bench. The turn: pale hide, the work before it is a garment.
11. `archive/IMG_9577`, the brown jacket flat in sunlight. The one warm frame.
12. `archive/IMG_3643`, pale trousers and a vest hanging in daylight. Closes in light.

Nigredo to Albedo, again, and nothing says so.

### Rejected, and why

| frame | why not |
| --- | --- |
| `archive/IMG_3627`, `homepage/IMG_3627` | near-identical to `IMG_3625`, which is already a frame of `capo-10`. Redundancy, not rhythm. |
| `homepage/homepage (1)` | good, but very close to `IMG_2378`, which is now the ARRIVAL. It would compete with the first thing a visitor sees. |
| `homepage/IMG_3463`, `IMG_3464` | now `capo-10`'s lead frames. The gallery does not repeat the index. |
| every Creature LEAD frame | same rule. |
| `archive/IMG_3475`, `3476`, `3477`, `IMG_1898` | duplicate stems of frames already used from `products/` and `homepage/`. |
| all `(1)` files | literal duplicate copies. |
| `archive/IMG_0209`-`0214`, `IMG_1834`, `IMG_3472`, `3478`-`3481`, `9572`, `9592`, `4d8045b4` | all became Creature frames when the catalogue filled (section 40). |

**The honest limit:** twelve was reached only because the gallery is now allowed
to use secondary frames of pieces that also have Creature pages. Of the entire
Drive, only THREE genuinely unused good frames remained (`IMG_2897`, `f797a2c2`,
`IMG_3434`). A gallery that grows past twelve needs new photography, not better
curation.

### The route

`/archive` is now `/gallery` in both languages, with 301s from the old paths, so
the label and the URL say the same thing. The i18n key was renamed too: leaving
`archive:` as the key for a label reading "Gallery" is exactly the drift that
confuses a later session.

---

## 46. The hat, on a provisional frame (2026-08-03)

The hat is on the price list at EUR 125, it is one of the two entry-tier pieces
section 32 called for, and it has never been photographed on its own. It DOES
appear in the designer portrait, sitting on the bench in the foreground.

So `capo-14` exists, and its only frame is a **900x1200 crop out of
`experimental/ciro-designer.jpg`**.

**IS THE CROP GOOD ENOUGH? Yes, just.** The cap is sharp, the patchwork panels
and the stitched brim read clearly, and it sits on a whole hide with the machine
and his hands behind it, so it looks like a photograph rather than a salvage. It
is black and white, like the portrait it came from and unlike everything else.

**IS IT UP TO STANDARD? No.** 900x1200 is well below the 2000px floor every
other frame meets, and at full screen on a large display it will be visibly
soft. Sanity will not upscale past the source, so the browser does the
stretching.

It ships because the alternative was a Creature with no photograph at all, and
it is marked in three places so it cannot quietly become permanent:

- `media.isProvisional` in the studio, on that frame.
- A **"Provisional photograph"** notice on the Creature page, in the placeholder
  register, in both languages.
- `assets/provisional/README.md`, which names the file, says what it is a crop
  of, and states the condition for deleting it.

Provisional frames live in the REPOSITORY, not in the Drive, because the Drive
is the owner's and the import reads it strictly read only.

**Replace it and delete the crop.** The real shot is in the shot list.

---

## 47. The Drive reorganised into product families (surveyed 2026-08-03)

The owner regrouped his photographs into product families. This section is the
survey of that move, made by measuring every file rather than by reading the
folder names, and the precedence rule that follows from it.

**The families, in his words:** MONUMENTUS is the men's co-ord sets, split
across two folders (LUX & TENEBRAE, and TIBIA CUT, the shorts, separated
deliberately); OBLIVION is the shirts; STYRAX is the tops; SOLVET ET COAGULA is
the process behind the work. The folder is spelled `SOLVET ET COAUGULA
(PROCESS)` on disk, and anything resolving a path has to match the disk.

TWO CONTRADICTIONS ARE OPEN WITH THE OWNER and nothing here resolves them. His
own approved text presents MONUMENTUS as the COLLECTION ("We present MONUMENTUS:
Tenebrae & Lux"), and MONUMENTUS is now also a product family; both cannot be
the top level. And organising by men's sets and women's shirts reintroduces the
gendered division deleted on 2026-08-02 on the strength of his own words about
Armonyen being "designed for both him and her" (section 26). The taxonomy is not
changed until he answers.

### What the move cost, and it is not small

**`products/` is gone.** The import resolves frames from four folders
(`products`, `archive`, `homepage`, `experimental`) and one of them no longer
exists. Of 64 frame references in the import plan, 22 stopped resolving: 11
because the file moved into a family folder the resolver does not search, and
**11 files that exist nowhere on the Drive any more**.

| Creature or use | files gone | left with |
| --- | --- | --- |
| `capo-01`, the black leather shirt | `0d454a66…`, `286368a0…` | nothing |
| `capo-07`, the wide black trousers | `IMG_3691`, `IMG_3692` | nothing |
| `capo-08`, tube top and snake skirt | `aa52ef49…`, `05b164db…`, `7682a1f5…` | one frame |
| the MAKING section | `IMG_0206`, `IMG_0208` | nothing |
| the GALLERY, frame 4 | `IMG_0207` | nothing |
| the WORN band | `aa52ef49…` | five of six |

The site is UNAFFECTED: those assets are in Sanity and every page still renders.
What is blocked is `npm run import`, which now throws while resolving, before it
uploads or writes anything. It fails safe, and it fails completely.

The assets can be recovered from Sanity if the originals are gone for good, but
that is a different mechanism from the one the import has (it reads the Drive and
uploads), so it is a decision to take rather than a patch to apply. Ask the owner
whether those eleven files still exist on his phone first.

### The survey, by measurement

111 files, **80 unique images**. Every cross-folder duplicate is BYTE-IDENTICAL:
there is not one case where the same photograph exists at two different sizes or
encodings in two folders, so precedence is only ever about which path we name,
never about which copy is better.

| folder | files | note |
| --- | --- | --- |
| MONUMENTUS LUX & TENEBRAE | 9 | black and pale pieces together |
| MONUMENTUS TIBIA CUT | 5 | one cut, two finishes |
| OBLIVION | 14 | the black shirt set and the red one |
| SOLVET ET COAUGULA (PROCESS) | 8 | five never seen before |
| STYRAX TOP | 8 | all new |
| archive, experimental, homepage | 55 | unchanged |
| (root) | 11 | the OBLIVION shirt set, unfiled |

The root holds `IMG_3451` to `IMG_3458`; OBLIVION holds `3452` to `3457`. So the
lead frame and one never-used frame of the same shirt are the only members of
that set left outside the folder. `IMG_3458` shows a hand opening the slit in the
shirt's upper back, which is the same "oblivion hole" the red shirt has and is
presumably where the family name comes from.

### The precedence rule (proposed 2026-08-03)

1. **The family folder wins over a legacy folder.** `products/archive/homepage/
   experimental` were OUR grouping by page role. The family folders are HIS
   statement of what the object is, and that is the better authority for a key.
2. **Dedupe by content hash, never by filename.** The obvious rule, "ignore any
   ` (n)` copy", is wrong here and there is exactly one counter-example:
   `homepage/HOMEPAGE.HEIC` (4284x5712) and `homepage/homepage (1).HEIC`
   (3024x4032) are DIFFERENT PHOTOGRAPHS. Every other ` (n)` file is
   byte-identical to its sibling. A name-based rule silently drops a real frame.
3. **The root is "unfiled", not a folder.** Do not mint a root category:
   `IMG_3451` and `IMG_3458` are OBLIVION pending his move.
4. **A stem in two family folders is a question about the garment, not the
   file.** Leave it keyed where it is and ask.
5. **The legacy folders stay** for what only exists there, which is still most of
   the catalogue.

**Why this is cheap:** the import uploads by sha1 and reuses any asset already in
the dataset (`import-photos.mjs`), and every cross-folder duplicate is
byte-identical, so re-keying uploads nothing and changes no image on the site.
Only the path we resolve by changes.

### What SOLVET ET COAGULA holds, and what it refutes

Eight frames, five of them new: a cardboard pattern weighted with two porous
stones on a black hide with the cut chalked around it (`IMG_3387`, 4284x5457);
black trouser panels cut, outlines still on the hide; the 40mm brush on
freshly blackened cloth (`IMG_2626`); black pieces hung wet and twisted on a bar;
shearling being pinned and taped onto a mannequin; pale garments on the bench
with the tape measures. Pattern, cut, dye, dry, build, finish.

**This settles section 27 against the making section.** Its two frames,
`IMG_0206` and `IMG_0208`, are argued in section 21 as one hide before and after
construction. Pulled out of Sanity and compared against the new folder, they are
the SAME OBJECT as the STYRAX TOP flat frames, and the same piece the model
wears in the forest: a finished Creature, not raw material. No visible copy is
wrong; the section's reason to exist is. The prepared fix in section 27 is also
partly wrong, because `experimental/IMG_3406`, nominated there as a replacement
"offcuts and tools" frame, is the BAG on the bench, which would repeat the
mistake with a different object.

Replacement, when the making section is next touched: `IMG_3387` then the
mannequin frame, which is the cut being drawn and the piece taking shape. Note
that only `IMG_3387` and `IMG_2626` clear the 2000px floor comfortably.

### Resolution, and a pattern worth knowing

Twenty-three files sit below the 2000px long-edge floor, and they cluster: every
STYRAX TOP frame, both TIBIA CUT on-model frames, `DESIGNER.jpg`, and the
`IMG_020x` archive set are all exactly 1200x1600. That is the signature of a
messaging app, not of a camera. **When a file matters and measures 1200x1600, ask
him for the original before treating it as the best available.**

---

## 48. The photographs carry his names (2026-08-03)

The owner renamed the files in MONUMENTUS LUX & TENEBRAE, MONUMENTUS TIBIA CUT,
OBLIVION and STYRAX TOP with the Creature names. **This closes PART of the
naming gap that has blocked the catalogue since the beginning, and the size of
the part matters.** Thirteen of the seventeen
documents then in the dataset carried a `{GARMENT_NAME}` placeholder. Six of
them could take a name from his filenames, because only six have frames in the
folders he renamed. See section 55 for the correction and the arithmetic.

Every file was matched to what it already is on the site by content hash, so
nothing here is a reading of a photograph.

### MONUMENTUS LUX & TENEBRAE

| his filename | was | ours |
| --- | --- | --- |
| `Monumentus Vest (Tenebrae).JPG` | IMG_3465 | capo-03 |
| `Monumentus Vest (Tenebrae.WEBP` | IMG_3466 | capo-04 |
| `Monumentus Pants (Tenebrae).WEBP` | IMG_3467 | capo-05 |
| `Monumentus tenebrae.WEBP` | IMG_3468 | capo-05, and gallery frame 6 |
| `Monumentus pants (Lux).WEBP` | IMG_3463 | capo-10 |
| `Monumentus pants (Lux) .WEBP` | IMG_3464 | capo-10 |
| `Monumentus Lux .HEIC` | IMG_3474 | capo-11, and the worn band |
| `monumentus lux.HEIC` | IMG_1898 | capo-11 |
| `idea behind monunetus drop.PNG` | NEW | not a photograph, see below |

### MONUMENTUS TIBIA CUT, the shorts, separated deliberately

| his filename | was | ours |
| --- | --- | --- |
| `Mnmnts. Lux Tibia cut.WEBP` | IMG_2957 | no document |
| `Mnmnts Tenebrae Tibia Cut.WEBP` | IMG_2958 | no document |
| `Mnmnts Lux tibia cut.jpg` | PHOTO-2026-07-14-…-51 | no document |
| `Mnmnts Ten Tibia Cut.PNG` | IMG_3485 | the worn band frame that belonged to nothing |
| `PHOTO-2026-07-14-20-39-52.jpg` | unchanged | no document |

**The tibia cut is a Creature we never created**, in both finishes, and the
worn-band frame nobody could name turns out to be the Tenebrae one.

### OBLIVION

All seven black frames are `Oblivion Black lambskin` or `oblv black lamb` with
a suffix, and all seven red ones are `oblv blood red lamb` or
`oblv blood red lambskin`. So: **the black shirt is OBLIVION in black lambskin,
and the red one is the same shirt in blood red lambskin.**

### STYRAX TOP

`Stryax black goat .jpg` and `Stryax black goat  (1).jpg` (his spelling, two
spaces) were the two flat frames; `Stryax red goat.jpg` is the red one. **The
red variant is GOAT, not the fox the old price list implies**, which matters
because section 30 flagged the identical pricing of "red fox" and "goat
shearling" as incoherent. On his own naming they are the same material.

### What the names settle, and what they do not

SETTLED: capo-02 is Oblivion, in black lambskin. capo-03 and capo-04 are both
Monumentus Vest. capo-05 is Monumentus Pants, so a piece our alt text called
"a draped black garment" is trousers. capo-10 is Monumentus Pants (Lux) and
capo-11 is Monumentus Lux.

NOT SETTLED, and these are his:

1. **Two vests, one name.** capo-03 is smooth leather with a central silver zip;
   capo-04 is crinkled with snap fasteners, held on a hanger. Two objects, one
   filename. Two documents until he separates them.
2. **Two pale trouser names.** "Monumentus pants (Lux)" and "Monumentus Lux" may
   be one Creature photographed twice.
3. **capo-01, capo-07, capo-08, capo-09, capo-12, capo-13, the hat, Glovyes and
   Ghezard are not in any family folder**, so nine of sixteen are still unnamed
   or named only from his Instagram.

### Severya is lambskin, and it clears the pricing anomaly

The designer photograph shows him writing **"SEVERYA / LAMBSKIN / 100%"** onto
the snake-textured piece in silver pen, in his own hand. Read off the file, not
inferred.

Section 30 listed "Severya python skirt" at EUR 250 and called it incoherent
that exotic material was priced like ordinary material. **It was never exotic
material.** The snake is a texture in lambskin, the same hide as the Oblivion
shirts, and at 250 the piece was priced consistently with the rest of the list
all along. One of the four internal inconsistencies in that section dissolves;
the others stand.

The piece is part of `capo-08`, which bundles a tube top with the skirt, so the
document is still unnamed: naming a pair after one of them, or splitting it, is
his call and section 24 already asked it.

### Two files that are not photographs of Creature

- `idea behind monunetus drop.PNG` is a screenshot of his own collection text,
  the one already on the site. Useful as confirmation that our copy is his,
  verbatim; it must never be imported as a frame. It also reads "handmade in
  Italy" where his other text says South Italy, which is his to reconcile.
- `homepage/IMG_3117.HEIC` is new: a square 1263x1263 close study of black
  crinkled leather. See section 52.

### A trap his renaming created

Section 18 recorded that extensions cannot be hard-coded, because one batch
mixes .JPG, .WEBP and .heic. His renaming produced the inverse: **two files with
one stem and two extensions**, `oblv blood red lamb.JPG` and
`oblv blood red lamb.HEIC`, plus a case-only pair. Resolving by stem would have
put the wrong photograph on a page silently. An ambiguous stem is now an error
that names the alternatives, and the plan disambiguates with the extension.

---

## 49. Availability is two states, and the enquiry has to change with it

The owner: the white trousers are sold, so they are made to order; the black
trousers are available immediately. He is making folders that separate the two,
and the first, `Disponibilita immediata`, exists and is empty.

**This reopens section 41, which closed the question on his previous answer, and
section 31 costed exactly this outcome.** The fifth value that costing
anticipated is now in the schema. Nothing about the earlier reasoning was
wasted: reading C is what got built, and it cost the half day section 31 said it
would.

### What is visible on the page

- `readyNow` says "Available now." / "Disponibile subito." in the inscription,
  beside the four states already there.
- **The measurements label follows the state.** On a made to order piece they
  are the reference measurements of the photographed sample. On a piece that
  already exists they are the measurements of the object that will arrive. Same
  field, opposite claim, so the LABEL changes and the field does not duplicate.
  This is the trap section 31 named and it is the whole reason the state cannot
  be only a badge.
- One sentence of ours explains the choice, marked as ours.

### What changes in the enquiry, which is the part that matters

Section 31 found the real defect: **the endpoint hard-requires chest, shoulders
and length, so a buyer of a ready piece cannot complete the form at all.** A 422
for a legitimate purchase, with nothing in any log to show a sale was lost.

- The form asks what is being requested: take this one as it is, or have it
  remade. A radio group, not a script, like the unit chooser beside it, because
  the whole path works with JavaScript off.
- The three measurements stop being `required` on a ready piece, and the line
  under them says to leave them empty if taking it as it is. The fields stay
  VISIBLE: a form that hides its own questions cannot explain itself without
  JavaScript.
- The server validates on the answer. Default is "remade", so every made to
  order piece behaves exactly as before and a submission omitting the field is
  unchanged.
- The email says which was asked for, before the numbers rather than left to be
  inferred from their absence.

The server does NOT verify that the piece really is one of the ready ones. It
cannot: the site is static and the function has no content database. The worst a
forged value does is deliver an enquiry with no measurements in it.

Verified against the Workers runtime: as-is with a bad email reports only the
email; remade with no measurements still reports all three ranges in the chosen
unit. Neither reached the send step, so nothing was emailed.

### The copy, ours, marked as ours

| | Italian | English |
| --- | --- | --- |
| state | Disponibile subito. | Available now. |
| explanation | Questa Creatura è già fatta. Puoi prenderla così com'è, oppure fartela rifare sulle tue misure. | This Creature is already made. Take it as it is, or have it remade to your measurements. |
| the question | Questa Creatura è già fatta. Come la vuoi? | This Creature is already made. How do you want it? |
| choice 1 | La prendo così com'è | I will take this one as it is |
| choice 2 | La voglio sulle mie misure | Remake it to my measurements |
| the fields | Le misure servono solo se la vuoi rifatta. Se la prendi così com'è, lascia i tre campi vuoti. | The measurements are only needed for a remake. If you are taking this one as it is, leave the three fields empty. |
| measurements label | Misure di questo capo | This piece's measurements |

`AVAILABILITY_COPY_IS_DRAFT` marks the explanation on every screen that shows
it. The one-word states are labels like their four siblings and are unmarked;
what is marked is the sentence that makes a promise about how the brand sells.

### Which Creature are ready: NOT GUESSED

The folder is empty, so every Creature keeps made to order and nothing on the
site claims otherwise. The import reads membership by CONTENT hash, so a copy
under any name counts, which is what he will actually do with a Drive folder.

He said "the black trousers", and there are two candidates: capo-05, which his
filename calls Monumentus Pants (Tenebrae), and the Tenebrae tibia cut, which
has no document yet. Filing one frame settles it without anyone asking.

---

## 50. The red shirt leaves the catalogue (2026-08-03)

The owner's decision, and the reason is the material: he cannot source that
hide. He searched for a month and goes to Solofra tomorrow to look for something
close.

A Creature that cannot be made is not something the site can offer, so it
becomes **a gallery frame: work that was made, not work that can be had**. One
frame, the back view with the opening between the shoulder blades, which is the
piece's whole signature and the only frame of it that reads as an object rather
than as a look. It sits last, after the gallery has turned pale, because it is
the one red thing on the site and it should be the last word rather than an
interruption.

**REVERSIBLE, and that is a design decision rather than a courtesy.** If he finds
a similar leather it comes back, so it is one flag,
`RED_SHIRT_IS_A_CREATURE` in `scripts/import-photos.mjs`. Flip it to true and
re-import: the document, its name, its composition, its seven photographs and
its place in the worn band all return. Nothing was deleted from the plan.

WHAT ELSE MOVED WITH IT:

- Its tile leaves the worn band. A band of "pieces on people" that links to
  something nobody can have would be an advertisement for a disappointment.
- `/creature/rubedo` 301s to the gallery in both languages.
- The name is worth correcting while it goes: **his filenames call it "oblv
  blood red lamb", so it was never Rubedo.** That was our inference from the
  alchemical stage (section 24 named it from a caption that never used the
  word). It is an Oblivion in blood red lambskin. The slug stays `rubedo` only
  because the document is leaving.

---

## 51. About absorbs the designer, and shipping gets his own fact

### One story, one page

The owner: the about page and the designer page are two sections telling one
story. They are one page now. The story first, then the person who makes it,
**portrait last, at the bottom**, so the page arrives at him rather than opening
on him.

The route is gone and 301s to about; the menu carries five entries where it
carried six. The reason the designer page existed (an international buyer needs
to see that one real person makes these, sections 32 and 33) is served better at
the end of the story than on a page nobody was sent to.

### His own choice of portrait

`experimental/DESIGNER.jpg` replaces `ciro-designer.jpg`, on his authority. He is
bent over the bench inscribing "SEVERYA / LAMBSKIN / 100%" onto a piece in his
own hand.

It earns the place twice. **What it shows is the very act the Creature page is
modelled on**: section 26 took that inscription format from his captions, and
here he is writing it on the object, so the page and the photograph say the same
thing without either explaining it. And his face is not identifiable in it,
which sits with section 44: whether the maker is named or shown in public is his
decision and he has not made it.

Measured rather than assumed: chrome contrast ink 6.2, comfortably legible,
against 9.02 for the portrait it replaces.

**THE FULL-RESOLUTION ORIGINAL IS BEING ASKED FOR.** At 1200x1600 it is below
the 2000px floor every other full-bleed frame meets, and 1200x1600 is the
signature of a messaging app rather than a camera (section 47). It is usable: it
upscales about 1.6x on a phone and 1.2x at 1440, which is sharper in practice
than the hat crop already shipping at 900x1200. The original almost certainly
exists on his phone.

### Shipping, in three pieces

One field could not hold three different standings.

| | what it is | how it is marked |
| --- | --- | --- |
| free shipping over 500 euro | HIS fact, HIS words | not marked at all |
| returns, customer pays return shipping | his facts, our wording | marked as ours |
| customs outside the EU | a fact he has NOT confirmed | marked unconfirmed |

The third is a new kind of mark and the distinction is real: a draft is wording
nobody has approved, this is a FACT nobody has confirmed. He says customs
outside the EU are normally the customer's and is checking with his partner.
Stating it as settled is how a buyer gets a bill nobody warned them about;
withholding it entirely is how they get the same bill with no warning at all.
"We think, and are checking" is the honest position while it is true.

The Italian of the free shipping line is a translation and is NOT marked, on the
rule section 40 already set: a composition, a price and a shipping threshold are
FACTS like a reference code, not voice, and translating a fact is not putting
words in his mouth.

NOT DONE, and worth deciding: the footer still says "Shipped worldwide.", which
is ours and marked. His line is better and truer, but `footerCopyIsDraft` covers
both footer lines at once, so putting his words there would mark them as our
draft. It needs either a per-line flag or his approval of the other line.

---

## 52. The arrival is the drop, and it belongs to the owner

The owner wants the home page to open on the texture of the new drop, and he is
shooting a closer frame for it.

**The mechanism already existed and it needed one fix.** The arrival has been
`openingMedia` in site settings since the home page was rebuilt (section 21), so
changing it is one field in the studio and always was. What was NOT true is the
promise around it: the import wrote that field on every run, so the owner could
set the image and an unrelated import would silently revert it. It now leaves a
value he has set alone, and `--set-arrival` forces the plan's frame in.

That is the difference between "it is a field" and "it is his field".

FOR NOW: `experimental/IMG_3116`, the photograph he sent, the black crinkled
leather halter top on a pale mannequin in front of the paper patterns. It is
also capo-12's only frame, so the first screen and that Creature show the same
object until the closer frame arrives.

RECORDED, NOT USED: `homepage/IMG_3117.HEIC` is new and is a close study of
exactly that crinkled texture, which is what he describes wanting. It is 1263px
SQUARE, so it is both below the 2000px floor and the wrong shape: a phone crop
of a square takes a narrow column of it and a desktop crop takes a letterbox.
When he shoots the closer frame, **vertical and at least 2000px on the long
edge** is what makes it usable full screen.

---

## 53. What is still outstanding after 2026-08-03

### Blocked on him

1. **Legal entity and privacy notice.** Unchanged, still the hardest blocker,
   still gated exactly as section 36 describes.
2. **The real contact email.** `info@example.com` is still in site settings.
3. **Names to photographs for STYRAX**, and for the nine Creature that are in no
   family folder.
4. **Materials for most pieces.** Four are known now (Oblivion black lambskin,
   the red one, Styrax goat, Ghezard); the rest are `{MATERIALS}`.
5. **Real working hours**, the one question that moves every price in section 32
   by a factor of two and a half.
6. **His biography.** He says he will write it. `{DESIGNER_BIOGRAPHY}` until he
   does, and his name stays off the site until he says otherwise (section 44).
7. **Which pieces are available now**, answered by filing frames rather than by
   telling anyone.
8. **The two contradictions in section 47**, MONUMENTUS as both collection and
   family, and the gendered division the families reintroduce.
9. **Eleven photographs** that vanished with `products/`. If they are on his
   phone the salvage lines come out.

### Blocked on us, and it is one thing

**THE IMPORT HAS NOT BEEN RUN.** Everything in sections 48 to 52 is in the code
and none of it is in the dataset: the site still shows the old names, the red
shirt in the catalogue, the old portrait, the old making frames and no shipping
fields. A dry run passes clean (63 frames, 8 salvaged, every overlay above 4.3
contrast), so the step is ready and deliberate rather than pending.

It is left for the owner of this repository to run, because it rewrites his
production dataset: it deletes the red shirt's document, renames fifteen
Creature and replaces the making section. `npm run import` does it;
`npm run import -- --set-arrival` also installs the drop frame as the arrival.

---

## 54. The import run, and what is actually live (2026-08-03)

Run with `--set-arrival` after the owner exported a backup (31 documents, 77
assets, 158MB). Verified against the DEPLOYED site rather than a local build,
because a local build proves the code and not the deploy.

The Sanity webhook fired on its own this time, so the publish chain worked
without a git push. Section 16's standing note is unchanged: that is convenient
rather than dependable.

### What changed, verified live

| | |
| --- | --- |
| Creature | 16, down from 17 |
| named | 9, up from 3 |
| gallery | 13 frames, up from 12 |
| assets | 82, three uploaded (`IMG_3387`, the mannequin frame, `DESIGNER.jpg`) |

**SIX Creature were renamed, not fifteen.** Only documents with frames in the
folders he renamed could take a name from them: capo-02 (Oblivion), capo-03 and
capo-04 (both Monumentus Vest), capo-05 and capo-10 (both Monumentus Pants) and
capo-11 (Monumentus Lux). With Glovyes, Styrax and Ghezard, which were already
named from his captions, that is nine of sixteen. **Seven still show
`{GARMENT_NAME}`**: capo-01, capo-07, capo-08, capo-09, capo-12, capo-13 and the
hat. Materials moved the same way, from one real composition to four.

The red shirt's document is gone, it is absent from the index, `/creature/rubedo`
301s to the gallery in both languages, and its back view is the gallery's last
frame. The designer route 301s to about, which now ends on his own portrait.
Shipping renders in three standings on the contact page: his free-shipping line
unmarked, returns marked as ours, customs marked "Not yet confirmed".

### The two availability states, verified without publishing anything

No Creature is `readyNow`, because his folder is empty, so nothing on the live
site claims to be available now and every piece reads exactly as before.

The new state was verified by patching the query LOCALLY for one build and
reverting it, so no wrong claim was ever published. It renders correctly in both
languages: "Available now." / "Disponibile subito.", the explanation carrying
its draft mark, the measurements label switching to "This piece's measurements" /
"Misure di questo capo", the enquiry action present, and on the form the choice
between taking it as it is and having it remade. The three measurement inputs
lose `required` on that piece and keep it on every other, which was checked in
the built HTML rather than assumed.

### The arrival repeats a Creature's only photograph, and it stays

`IMG_3116` is the arrival AND capo-12's single frame, so the same photograph
appears twice in one journey. Measured rather than judged by eye:

- On the home page it appears ONCE. The second occurrence in the markup is the
  Open Graph tag, which means a link shared to Instagram now previews the drop
  rather than an old detail. That is a daily gain for a brand whose visitors
  arrive from there.
- The repeat costs nothing until a reader reaches capo-12, which is the
  ELEVENTH of sixteen tiles on the index, and it does not appear on the
  collection page at all.
- Whole-frame luminance 0.063 against 0.053 for the arrival it replaced, so the
  page still opens out of darkness (section 34) and the chrome measures 5.88.

WHAT IS GENUINELY WRONG WITH IT, stated plainly: it breaks the rule section 45
set for the gallery, never a Creature's LEAD frame, and it lands on the weakest
page in the catalogue. capo-12 has no name, no composition and no second view,
so a reader who taps it meets the identical full-screen photograph and learns
nothing. The frame is also a product shot of a finished piece rather than the
TEXTURE he asked to open on.

KEPT ANYWAY, and the reasoning is that the defect is bounded and temporary: he
is shooting the closer frame, the swap is one field in the studio, and reverting
would spend the Open Graph gain to fix a collision most visitors never reach.

If it should go sooner, there are two moves and both are one field:

1. Back to `homepage/IMG_2378`, which belongs to no Creature so it never
   repeats, and which was chosen on measurement for this exact slot.
2. Forward to `homepage/IMG_3117`, the square 1263px texture study, which IS
   what he described and is the darkest of the three at 0.012. The cost is a 2x
   upscale on a phone, which damages a texture far less than it would damage a
   silhouette, but it is still below the standard every other full-bleed frame
   meets.

The real fix is neither: it is capo-12 getting a name, a composition and a
second frame, which is his.

---

## 55. Two corrections, and the contact address (2026-08-03)

### THERE IS A CONTACT ADDRESS: aleksandercecco@gmail.com

**Item 1 on the launch checklist comes off** (section 43). The site had no
working way to reach a human, which made it useless independently of whether it
was lawful, and it was the top item above legal for exactly that reason.

Done: the address is in site settings and live on the contact page as a working
mailto. `info@example.com` is gone from the studio, the seed fixtures, the site
and the import. The guard that refused to link a placeholder STAYS, generalised
from one string to `@example.com`, which is reserved by RFC 2606 precisely so it
can be recognised. It is not dead code: it is what stops this recurring, and it
cost the top slot on the checklist for two days.

The import writes the address only when site settings carry none, the same rule
the arrival follows: it is his field, and an unrelated import must not walk over
a change he made in the studio.

### An enquiry still will not arrive, and here is exactly why

Nothing above sends anything. The contact address is what a visitor writes to
themselves; the FORM posts to the Pages Function, which needs three secrets that
live in Cloudflare and nowhere else. All three are unset in production.

**In Resend:**

1. Create the account, or sign in, **with aleksandercecco@gmail.com**. This
   matters more than it looks: with no verified domain the only sender Resend
   permits is `onboarding@resend.dev`, and it will deliver ONLY to the address
   that owns the account. If the account is owned by that address, enquiries
   arrive. If it is owned by any other address, they do not, and the failure is
   a 403 from Resend rather than anything visible on the site.
2. Create an API key with send permission. Copy it once; it is not shown again.
3. When the domain exists (section 29), add and verify it, then change
   `RESEND_FROM` to an address at that domain. Nothing in the code changes.

**In Cloudflare Pages** (Settings, Environment variables, PRODUCTION branch,
encrypted), then **redeploy**, because Pages Functions pick up new secrets only
on a new deployment, which cost a deploy to learn once already:

```
RESEND_API_KEY    = the key from step 2
RESEND_FROM       = onboarding@resend.dev      (until the domain is verified)
ENQUIRY_TO_EMAIL  = aleksandercecco@gmail.com
```

Until all three are set the form answers 503 and says sending is not switched on
yet, in the visitor's language, which is deliberate.

**AND THE GATE IN FRONT OF THIS HAS NOT MOVED.** Section 36 stands: the moment
those secrets are set the site begins receiving names, email addresses and three
body measurements, and there is still no privacy notice and no named data
controller. Setting them is therefore step 3 of the domain switch and it is
gated on legal, which the owner deferred. The address existing does not change
that; it only means the site is no longer useless while it waits.

Local `.env` still holds all three values, so `wrangler pages dev` sends REAL
email (section 38). That is unchanged and still recommended against.

### The rename count: six, not fifteen

Recorded because the plan should not carry a wrong number, and because the
difference is the whole picture of what he still owes.

- Before the import: 17 documents, 4 named (Rubedo, Glovyes, Styrax, Ghezard),
  **13 carrying `{GARMENT_NAME}`**.
- His renaming touched four folders. Only SIX documents have frames in them, so
  only six could take a name: capo-02, capo-03, capo-04, capo-05, capo-10,
  capo-11.
- After: 16 documents, **9 named, 7 still placeholders** (capo-01, capo-07,
  capo-08, capo-09, capo-12, capo-13, capo-14).

The seven are the pieces with no frame in any family folder, which is the same
list section 48 already gave for a different reason. **Naming them is a filing
job, not a photography job**: the frames exist, they are just not in a folder
that says what they are.

---

## 56. The design pass, rendered and looked at (2026-08-03)

Every page rendered in headless Chrome at 390x844 and 1440x900 and LOOKED AT,
rather than reasoned about from the markup. Four things were wrong. Three more
are wrong and are left, with the reason.

A note on the method, because it wasted a pass: a full-page capture of a page
nobody scrolled is a picture of empty boxes. Images below the fold are lazy and
the reveal script hides a frame until it has been seen, so the first captures
showed a black index and a two-frame gallery. The harness now walks the whole
page, waits for every image to decode, and then captures.

### Fixed

**1. The about page said the same paragraph twice.** Folding the designer page
into the story (section 51) brought its making lines with it, and those same
sentences are already on that page inside his complete text a few screens above.
Removed: what belongs to the PERSON rather than to the brand is the portrait and
a biography he has not written, so that is all the section carries. Its heading
and the placeholder are now one block instead of two, which was stacking two
lots of vertical padding and reading as an empty box waiting for text.

**2. The chrome went invisible over the portrait.** The overlay measurement
samples the TOP of a frame, because that is where the fixed chrome sits when a
photograph opens a page. The portrait is at the END of a page: the reader scrolls
INTO it, and the chrome then sits over a black hood while the value says ink,
measured from the pale concrete at the top of the file. Overridden to paper,
with the reasoning recorded at `OVERLAY_OVERRIDE` in the import. This is the
residual issue section 14 names, in a new place: one number cannot describe a
band that moves.

**3. The Creature index was scaffolding laid over the photography.** Section 39
specified a name and a reference code over every frame. Against the real
catalogue that is sixteen `{REF_CODE}` placeholders and seven `{GARMENT_NAME}`
placeholders: twenty-three marks on the one page a visitor browses, on top of
the brand's own photographs. The reference code is gone from that page for good,
because a code belongs on the piece's own page and two lines over every frame is
the product grid the brief forbids. The name now appears only when EVERY
Creature has one, because nine labelled and seven not reads as a bug rather than
a decision. **It heals itself**: naming the last seven brings the labels back
with no code change. Until then the page is what the primary reference measurably
is (section 14): imagery, overwhelmingly wordless.

**4. The gallery destroyed its own photographs at desktop.** A single full-bleed
frame at 1440 is a 1.8:1 letterbox and eleven of the twelve frames are 3:4
portraits, so the page was showing horizontal bands cut from the middle of them:
the fur frame stopped reading as an object at all. On a phone the same frames
are correct, which is why it survived. Now the SHAPE OF THE PHOTOGRAPH decides:
a landscape frame runs full width, portraits pair two across and touching, which
is exactly what the primary reference does at that width (section 14) and why
the index already looked right. The page also stopped printing `{NOME_PEZZO}` on every frame, in Italian, on the
English page too: section 41 says outright that in a gallery the name is optional
and usually absent and the frame is silent.

### A claim in section 45 that was wrong, and what it costs

Section 45 records `IMG_3434` as "LANDSCAPE, and the only one, so it reads as a
breath between two tall frames". **It is portrait.** The file measures 5712x4284
in its raw pixels, which is what that note was written from, and it carries an
EXIF rotation: converted for upload it becomes 4284x5712 and the site has always
displayed it upright. Every one of the thirteen gallery frames is portrait.

Two consequences, neither hidden. The "breath" that section describes has never
existed on the page. And the rule added above, landscape runs full width, finds
nothing to apply to today: at desktop the gallery is now a uniform wall of pairs,
which resembles the Creature index more than it should. That is the same
complaint section 23 flag 5 already carries about the collections index and it
is now true of a second page.

The rule stays, because it is right and because it will apply the moment a
landscape frame is added. What it does not do is manufacture a rhythm the
photography does not contain: the honest fix is a landscape frame in the
gallery, which is a shooting request, not a layout one.

### Found and left, with the reason

**The chrome is illegible over the index's first tile at DESKTOP.** The overlay
value serves the phone crop, which is the primary target (standing rule 4), and
the desktop crop of that frame puts a black shirt under the marks. Fixing it
needs either a per-breakpoint value, which doubles a field the owner has to
think about, or the owner moving the image hotspot, which is one of the three
levers section 14 already gives him. Not worth a schema field.

**A section heading passes under the MENU label on the home page.** At one scroll
position "COLLECTIONS" and "MENU" overlap. It is inherent to chrome that floats
over content without a bar behind it, it lasts one scroll moment, and every fix
contradicts the direction: an opaque band reintroduces the persistent bar
section 4 removed, and hiding the chrome on scroll makes the only navigation on
the site disappear.

**A Creature page can be seven full screens of one garment.** Oblivion has seven
photographs and each one fills the viewport. That is section 4 working as
specified, not a defect, and the alternative is thumbnails.

### Confirmed working

The gallery's alternating tall and short rhythm at phone scroll speed; the home
page's seams, where only the arrival is a sealed screen and everything after it
is 88svh so the next frame always peeks; the worn band's one-frame-cut-by-the-
edge; and the wordless index at both widths.

---

## 57. The final verification pass (2026-08-03)

Twenty-one pages, both languages, at 390x844 and 1440x900, rendered in headless
Chrome and audited on things that are objectively true or false in the composited
page rather than declared in the markup.

### Clean at both widths

| | |
| --- | --- |
| headings | one h1 per page, no skipped level, on all 21 |
| alt text | every image has a real one, none empty |
| layout shift | every image ships intrinsic `width`/`height`; **CLS 0.000** measured |
| horizontal overflow | none, at either width |
| focus | every interactive element takes focus and shows a ring |
| routes | 21 pages plus the 404, both languages, all correct |

### Performance, production build on Slow 4G with a 4x CPU throttle

1.6 Mbps, 150ms RTT, cold cache. The build ships **no JavaScript bundle at all**,
20 KB of CSS and 124 KB of subset fonts across 79 pages.

| page | first paint | LCP | CLS | transferred |
| --- | --- | --- | --- | --- |
| home | 660ms | 660ms | 0.000 | 576 KB |
| all Creature | 676ms | 1860ms | 0.000 | 521 KB |
| gallery | 680ms | 2356ms | 0.000 | 875 KB |
| about | 664ms | 664ms | 0.000 | 326 KB |
| a Creature | 676ms | 676ms | 0.000 | 688 KB |

One oddity recorded rather than explained: on the home page Chrome reports the
LCP element as a 468px text node, not the arrival photograph, which section 24
designed around being the LCP element. The photograph is served correctly (828px
AVIF, 42 KB, for a 390px viewport at DPR 2) and its resource finishes in about
550ms, so the page is fast either way. Why the image never becomes an LCP
candidate is unexplained, and guessing at it would be worse than saying so.

### The one real defect, and it is mine

**Captions over photography fail contrast.** Eight frames measured below WCAG AA
at 390 and worse at 1440: "MONUMENTUS: Tenebrae & Lux" at 1.53:1 on the
collections index, "Ghezard" at 1.36:1, "Monumentus Lux" at 1.42:1, and the
Creature names over their own first frames at about 1.78:1.

The cause is structural, not a bad value: the overlay polarity is measured at
the TOP band of a frame, because that is where the fixed chrome sits, and
captions sit at the BOTTOM. Section 14 named this risk ("the two-band conflict
is not gone in principle. Nothing in this set trips it now") and the content
added since then trips it. The fix is a second measured value, and it is item
one on my part of the launch checklist.

### Two measurement mistakes worth recording

Both produced confident wrong answers before being caught, which is the reason
this section exists at all.

1. **The first audit reported 21 pages clean with zero contrast issues.** It had
   measured nothing: the photographs come from the Sanity CDN and a cross-origin
   image taints a canvas, so every sample threw and was swallowed. A check that
   cannot fail is not a check.
2. **The first contrast numbers were sampled from the wrong pixels**, because
   the mapping from element to image ignored `object-fit: cover`. Corrected, the
   numbers barely moved, which is luck rather than vindication.

A third, earlier the same day: full-page screenshots of pages nobody had
scrolled showed empty boxes, because images are lazy and the reveal script hides
frames until seen. The first read of the Creature index was a black rectangle.

### A gate that was not gating

`npm run check` reported **0 errors, 0 warnings, 0 hints** on a component that
used `isPlaceholderText` without importing it. `npm run build` caught it
immediately with a ReferenceError. Astro's checker does not resolve identifiers
inside template expressions the way it does in TypeScript files.

This is section 13's lesson repeating: a gate that passes has proved nothing
until it has been seen to fail. The check script should run a build, and that is
on the checklist.

---

## 58. The caption band, and four wrong answers before the right one

Eight captions were below WCAG AA, the worst at 1.36:1 and the collection's own
name at 1.53:1, unreadable over dark leather. The cause was structural: a
photograph carries the fixed chrome at the TOP and a caption at the BOTTOM, and
one measured polarity served both.

Both bands are measured now. **Twenty of the site's forty-three frames disagree
between them**, so this was systemic rather than a handful of bad values.

Getting there took four attempts, recorded because each was wrong in a way worth
knowing:

1. **One rectangle of the file.** A caption is not at a fixed place in the file:
   `object-fit: cover` crops the same photograph differently in every container.
2. **The worst cell of the bottom third.** So strict it pushed thirty of
   forty-three captions off the pictures entirely.
3. **The rectangle the caption occupies, per container.** Closer, and still
   wrong at desktop, because it sampled sixty percent of the width while a
   caption is a short word at the left inset.
4. **A word-sized window slid across the plausible extent, worst reading wins**,
   with the bar at 8.0 rather than the AA minimum of 4.5. The margin is not
   timidity: the text's real width depends on the word, the font metrics and the
   viewport, and no model of it can be exact, so the bar carries the residual
   error.

The last holdout was simpler and worse: a SALVAGED frame has no file to measure,
and "unmeasurable" defaulted to "safe", which is how capo-01 kept an unreadable
caption through every round of fixing exactly this. Unmeasurable now means the
caption goes below the frame.

**Where no polarity survives, the caption sits on the page below the photograph**
rather than on it. That is rule 11 applied literally ("if neither polarity is
legible on a given photograph, that photograph carries no text") through the
mechanism section 14 added for it. Twenty-five captions sit below, eighteen on
the picture.

VERIFIED: 21 pages, both languages, at 390 and 1440, **0 contrast failures**.

**A tension this introduces, recorded rather than hidden:** a caption below a
frame puts a band of page colour between two touching frames on the catalogue
screen, which softens the no-gutter density section 39 specified. Legibility won.
If the density matters more, the answer is photographs with an even band at the
bottom, which is a shooting note rather than a code change.

### And the audit was wrong twice more

A third and fourth measurement mistake, in the tool rather than the site:

- The audit measured captions placed BELOW a frame against the photograph's
  pixels, because the element-to-image mapping happily lands a below-caption
  deep inside a portrait image that overflows its box. That invented a page of
  failures that did not exist.
- Before that it reported 21 pages clean having measured nothing at all: the
  images are cross-origin and tainted the canvas, and every sample threw and was
  swallowed.

Both are fixed. The lesson is the one section 13 already carries and this
session earned twice more: **a check that cannot fail has proved nothing.**

---

## 59. What was invented, and how it cannot become permanent (2026-08-03)

The owner asked to see a finished product rather than a site full of braces. So
the gaps were filled. **None of the values below are his.**

### The bargain

- **Nothing on the page says a value is provisional.** A visitor cannot act on
  that distinction and it makes a real brand look like a rehearsal. The
  "Unapproved draft", "Not yet confirmed" and "Provisional photograph" marks are
  gone from every page (`src/lib/marks.ts`, one switch to bring them back).
- **Everything provisional is flagged where it can be acted on**: `inventedFields`
  on each Creature, `inventedCopy` on site settings, this section, and
  `npm run launch-check`, which **refuses while any flag is set**.

Invisible to a visitor, impossible to ship past.

### The names

Taken from HIS OWN vocabulary where a piece fits a name he has used publicly and
we could never confirm, because his words in his register beat anything we would
coin. These are ASSIGNMENTS, not identifications: section 24 refused to guess,
and this is that guess, flagged.

| Creature | invented name | where it comes from |
| --- | --- | --- |
| `capo-01` | **Armonyen** | his shirt name, "designed for both him and her" |
| `capo-07` | **Aleya** | his "Aleya bootcut pants" |
| `capo-08` | **Severya** | his snake skirt, and the inscription he wrote on it |
| `capo-12` | **Corvinus** | his, "your protector in those dark nights" |
| `capo-09` | **Vesper** | OURS, coined in the pattern of his one-word Latinate names |
| `capo-13` | **Nocte** | OURS, same |
| `capo-14` | **Vertex** | OURS, same |

### The prices

Derived from section 32 rather than chosen: hours by construction, a rate he can
live on, material, rounded to a multiple of 25, tiered accessories then
single-panel then constructed then tailored. **The old dollar list is NOT used**:
section 32 showed it paid him two to nine euro an hour.

| | EUR |
| --- | --- |
| Vertex (the hat) | 275 |
| Vesper (the bag) | 425 |
| Glovyes | 475 |
| Corvinus, Nocte | 675 |
| Severya | 875 |
| Monumentus Vest (both) | 950 |
| Styrax | 975 |
| Monumentus Pants, Aleya, Monumentus Lux | 1,150 |
| Armonyen, Oblivion | 1,450 |
| Ghezard | 1,850 |

That band, 275 to 1,850, is the labour-derived range section 32 found and the
international band it matched against Isaac Sellam.

### Also invented

- **Compositions** for twelve Creature, in his material vocabulary.
- **Reference measurements** for all sixteen, in his flat-measurement idiom.
- **Descriptions** for thirteen, two lines each, in his register.
- **The price line on the home arrival**, which names the lowest real price in
  the catalogue so it cannot drift while the prices are right.
- **The footer lines, the shipping and returns text, the customs line, the
  enquiry copy and the availability explanation**, all previously marked on the
  page and now flagged instead.

### NOT invented, and it will not be

- **His biography.** A price is a number somebody replaces; a life is not, and
  words put in his mouth are a different kind of object. The about page is
  designed around the absence: a heading and the photograph of him working,
  which tells a reader what a biography would anyway. He says he will write it.
- **Anything legal.** No privacy notice, no terms, no company details. Inventing
  those would expose him, and they need a lawyer (checklist group 1).
- **Reference codes.** A numbering system is a fact about how a brand works, not
  a plausible value, so the field is empty and the pages simply do not show one.

---

## 60. The shop, and what the tab shows (2026-08-03)

### The catalogue screen sells; the gallery does not

The Creature index and the gallery did the same thing at desktop. They are
different objects now:

- **The index is the shop.** Name and price under every frame, and a second
  photograph on hover. The price belongs here and only here, because this is
  where a reader compares and a comparison without prices is a mood board.
- **The gallery is wordless**, because it is not selling anything.

The hover is CSS: no script, no bundle, and a touch reader loses nothing because
the second frame is on the Creature's own page. Under `prefers-reduced-motion` it
swaps with no transition rather than not at all, because a second view of a
garment is information and reduced motion asks for less movement, not less
information.

**FILTER BY DROP: built into the ordering, not shown.** There is one drop. A
filter control offering one option is the furniture this site removes
everywhere else, and it is the same argument section 23 flag 5 makes about the
collections index. The grouping is ready; the control appears when a second drop
exists.

### The mark in the tab

The browser showed a default. It shows a square crop of HIS signature now, in
both polarities, following the reader's system theme because a tab is drawn on
the browser's chrome rather than on this page. A crop, never a monogram: section
9 forbade inventing one, and a 2712x615 script mark shrunk to 16px is a smudge.
The app icons are rasterised from the same file through the same headless Chrome
the project already uses, so no new dependency and nothing paid.

### Titles, and the share image

Titles are `Thing / Aleksander Cecco`, narrow to wide, so six open tabs are six
different words rather than six truncated brand names.

**Every page carries a share image now**, not only the ones that thought to pass
one. Traffic arrives from Instagram, so a shared link is the first impression,
and a link with no card is a worse one than any photograph. It falls back to the
arrival, which means the card changes when he changes that one studio field.

### Text selection

Already correct and worth recording as checked rather than assumed: `::selection`
paints `--fg` on `--bg`, so a selection inverts the page instead of introducing
the browser's default blue. There is no third colour anywhere in it.

---

## 61. The menu, the email, and the last thing a buyer sees (2026-08-03)

### The menu inverts

It was a flat list of links. Three things make it a moment, and each is
something the site already owns:

1. **It inverts.** The panel is the opposite polarity to the page under it, so
   opening the menu performs the site's one structural idea in miniature. No
   fade, no slide.
2. **The spine runs through it**, because it is a text surface.
3. **It answers what a menu is usually opened to ask.** The address and the
   handle are on it as mono facts, because a reader opening a menu on a brand
   site is often looking for how to reach a person.

Destinations carry a hairline that thickens on hover and focus, which is this
system's one emphasis gesture (section 26).

FOUND BY RENDERING IT: the CLOSE control kept the PAGE polarity while the panel
inverted, so it was ink on ink and invisible. It takes the panel's polarity now,
measured at 18.94:1 on both.

### The email is a brand artefact

He reads it every time somebody wants a piece, which makes it one of the few
things on this project he sees more often than the site. It was plain text.

It is the site's register now, with the constraints an inbox imposes and the
reason for each: **paper, not ink**, because a client that strips styles falls
back to black on white and an ink-on-ink email is unreadable; **no web fonts**,
so case, tracking and weight carry the register; **every style inline**, because
`<style>` blocks get stripped; **a plain text alternative alongside**, because
some clients show it and it is what lands in a search inside his mailbox.

### The confirmation

It was a heading, a line and a link back, which is a receipt. It is the last
thing a buyer experiences, so it says the three things a person wants at that
instant: it arrived, a person will answer, and the promise with its limit on it.
No draft mark: somebody who has just sent their measurements should not be told
the brand has not decided what it says.

The form also says it is SENDING. An enhancement, never a dependency: with no
JavaScript nothing changes. The button is not disabled, because a disabled
control is removed from the accessibility tree mid-action; `aria-busy` and a
changed label say the same thing without taking it away from anyone.

### A hazard realised, and the fix

**Testing that confirmation sent a real email to the owner's inbox** and spent
one of his hundred a day. Section 38 recorded exactly this hazard, twice, and it
was still walked into, because the only safe local test was "submit something
invalid", which cannot exercise the success path.

`ENQUIRY_DRY_RUN` now exists: opt-in, does nothing unless passed, and renders
exactly what a real send renders.

    npx wrangler pages dev dist --binding ENQUIRY_DRY_RUN=1

It is NOT environment sniffing, which section 38 rejected for good reasons. An
unset binding cannot accidentally disable the only sales channel.

---

## 62. Solvet et Coagula, Instagram, and the list (2026-08-03)

### The process page

Eight frames existed and two were in use. They are a page now, in the order the
work happens: pattern, cut, dye, dry, build, the parts, the finished garments.

**No captions, and that is the discipline.** Naming each stage would be our words
laid over his process. The only text is his own making lines, once. The page
invents nothing. It is also the trust lever section 32 named: the moment a buyer
cannot visit the studio, process photography stops being atmosphere and becomes
evidence.

### Instagram: curated, not live

DECIDED, and the reasoning is the cost rather than the money. A live feed needs
the Graph API, a Business account, an app and a **long-lived token refreshed
every sixty days**; it is free and it empties the section silently the first time
nobody refreshes it. Every embed widget is a third-party script, which standing
rules 4 and 13 forbid.

So: three to six frames he chooses, linking to his profile. Nothing expires,
nothing scripts, nothing costs. The four in place now are OUR selection of his
photographs and are flagged as `instagramFrames`.

### The newsletter, built and not switched on

His model is drops: two pieces, released, gone. With no list every drop reaches
only whoever opens Instagram that day, which is the largest structural gap on
this project and nobody had named it.

The capture form is on the home page and **collects nothing**: it posts to the
same Function, which answers 503 and says sign-up is not open.

**WHAT SWITCHING IT ON REQUIRES, beyond what the enquiry already carries.**
Marketing email is a different legal basis, not a smaller one:

- consent that is **separate and unbundled** from an enquiry, opt-in, unticked;
- a **working unsubscribe** in every message;
- the **sender's identity and a postal address** in every message;
- a **retained record** of when and how each consent was given;
- **double opt-in**, which is the defensible EU standard;
- the list itself is personal data, with a **retention rule**.

All of it sits behind the privacy notice that already blocks the enquiry.

### The drop filter, and when it appears

Agreed: a filter with one option is furniture. The grouping is in the ordering
already. **The control appears when a second drop exists**, which is the same
condition section 23 flag 5 sets for the collections index.

---

## 63. The 404, the empty states, and the tools that lie

### The pages nobody designs

**The 404 shows the current drop**, not whichever collection cover it found
first: it follows the same studio field as the home arrival, so it is never
stale. And it offers three ways ON rather than one way back, because "back to
the beginning" assumes a reader who came from the beginning, and somebody
arriving on a dead link from Instagram did not.

**The empty states** printed `{NO_CREATURE_PUBLISHED}` and `{GALLERY_EMPTY}` at
a visitor. Nobody designs these and everybody eventually sees one, mid-import or
after a filter that matches nothing. They now say what is true and offer the
page that is never empty.

### Proving a check can fail

The standing lesson of this project, earned five times in one session: **a check
that cannot go red is worse than no check**, because it converts ignorance into
confidence.

So each gate has now been watched failing:

| gate | proven red by | proven green |
| --- | --- | --- |
| `npm run check` | removing an import the template uses | restoring it |
| the page audit | reverting the caption polarity to the chrome's, rebuilding, 10 failures at 1440 | restoring it, 0 |
| `npm run launch-check` | its current state: 25 items, exit 1 | the `problems.length === 0` branch |

The audit's own history is the argument: it has reported a clean pass having
measured nothing (tainted canvas), measured the wrong pixels (ignoring
`object-fit: cover`), measured captions that were not on the picture at all, and
flagged an empty alt on a decorative image as a defect. Every one of those was
found by asking what would make it go red rather than by trusting a green.

---

## 64. The sweep, and the home page left alone (2026-08-03)

### Every unused photograph, accounted for

Every file on the Drive was compared BY CONTENT against everything the site
uses, rather than by path, which is what made an earlier attempt report
thirty-four unused when most were the same photograph under an old name.
Eighteen are genuinely unused. Only two are imagery.

| what | how many | where they belong |
| --- | --- | --- |
| **Taken into the gallery** | 2 | `IMG_2378`, the frame that opened the site until the drop replaced it and the darkest thing in the set, and `homepage (1)`, rejected once for being too close to it while that was the arrival. With neither on the home page the pair reads as one material studied twice. |
| **Taken into Styrax** | 2 | Two more from the same forest shoot. PRODUCT, so they belong to the Creature, and section 43 asked for more frames on the pieces that had one or two. Styrax has five now. |
| Product, for Creature that do not exist yet | 4 | The Tenebrae and Lux tibia cut, their on-model frame, and the red goat Styrax. These are the undocumented Creature section 48 names; they need a document, not a gallery slot. |
| Product, alternates | 3 | More Styrax frames than the page needs. |
| Not a photograph | 1 | `idea behind monunetus drop.PNG` is a screenshot of his own collection text. It must never be imported as a frame. |
| Redundant | 1 | `IMG_3627` is near-identical to a frame already used on `capo-10`. |
| Earmarked | 1 | `IMG_3117`, the square texture study, is the arrival's replacement when he shoots the closer frame. |
| **His face** | 2 | `ciro-designer.jpg` and its crop. NOT swept into anything. Whether the maker is shown in public is his decision and he has not made it (section 44); his own choice of portrait keeps his face out of frame, and putting the earlier one in a gallery would quietly reverse that. |

### The home page is quiet, not thin, and nothing was added

ASKED FOR AND DECLINED, with the reasoning recorded because the request was
reasonable and the answer is a judgement rather than a fact.

The gap that prompted it was real and is closed: the first screen carried
nothing at all, and it now carries his own two opening lines, the price the work
starts at and one route in. What was left was not absence.

Three arguments against adding more:

1. **There is no unplaced approved text.** All ten of his sentences are already
   on the site: lines 1-2 as "the work", 8-10 as "the making", the collection
   statement on the arrival and again on the chapters, and all ten whole on the
   about page. More words means NEW words in his register, which is the most
   sensitive thing on this site to invent. A price is a number he swaps out; a
   poetic line over a photograph is his brand's voice ventriloquised on the
   screen most visitors see first.
2. **The reference does not support it, on our own measurements.** Section 14
   measured Rick Owens at 26 text runs for a whole homepage, "most media carries
   NO caption", "overwhelmingly wordless". Sorcinelli sets two lines over a
   frame because those two lines are the only text on the page. Layering poetic
   captions on top of four blocks of his prose is the opposite of what makes
   either reference sparse.
3. **An empty field invites his words; a filled one does not.** The Sanity
   fields exist. Filling them with ours now leaves something that looks finished
   and therefore never gets replaced.

If the page should carry more, the lever is his: more sentences, or the on-model
photography that caps the worn band at five frames. Both are already on the
checklist.

---

## 65. The shop, closed to within reach of his own (overnight, 2026-08-04)

The owner's model: his other shop, same photographer, same concrete-and-shutter
photography, black page, four across, uppercase names with prices, a thin free-
shipping banner, everything purchasable, readable as a shop in one second. Ours
read as an exhibition. The night's brief was to close that distance without
becoming Shopify, and these decisions were settled in advance by the owner.

### The gallery dissolved

Imagery has ONE home now: the process page weaves the eight making frames with
the fifteen artistic frames into a single descent, the formula SOLVET ET
COAGULA as its title inside at chapter size. The menu says Process / Processo,
because the formula in a menu is illegible to anyone who does not already know
the brand. /gallery and the old /archive and /creature/rubedo hops all 301
straight to /process, no chains. Products only ever live in the shop. The weave
is deterministic: process frames are the spine in work order, artistic frames
dealt evenly between them in the gallery's dark-to-light order.

### The menu, the banner

Six destinations: Home, Creature, Drops, Process, About, Contact. Home leads
because the signature-as-home-link is a convention only designers know. Drops
is his model and his industry's word, both languages.

One thin line tops every page: FREE WORLDWIDE SHIPPING OVER 500 EURO, his real
policy in his own words (`shippingFree`, unmarked). Static, not fixed: it says
its one thing at arrival and scrolls away, so it is not the persistent bar
section 4 removed.

### Section 39 revised again: four across

The two-across ceiling was OURS, set when the catalogue was two seeded
fixtures. Three and four were both rendered at 1440 and looked at. FOUR wins:
two full rows in the first screen (the one-second shop read), sixteen pieces as
a clean four-by-four where three leaves an orphan, and the garments survive
tiling because the photography is tight on the subject. Tablet gets two across,
because four at 768px is a 192px tile and that IS the thumbnail the rule
forbids. Phone untouched. Tiles take the photograph's own 3:4 at desktop, and
name and price sit BELOW the frame on the page, uniformly: the placement his
shop uses and the one that can never fail contrast.

### The atelier version of buying

The enquiry became the ORDER. On an available or made-to-order piece the action
reads "Acquire — €X"; it leads to /creature/[slug]/order (old enquiry URLs
301), which carries one photograph, the name and price at statement size, the
shipping terms BEFORE the form, then the buyer's details; made-to-order still
carries the measurements and his approved line, untouched. The confirmation
reads as an order placed: "Order received. We confirm it by email within one
day, Italian time. Payment and delivery are arranged in that reply." The email
is an order sheet with the price in the subject.

NOT a cart (sixteen one-off pieces cannot fill one) and NO payment (the owner
has no fiscal position yet). Nothing is collected that the enquiry did not
already collect: THE LEGAL GATE IS UNCHANGED.

**THE PAYMENT STEP, RECORDED:** the intended future step is STRIPE CHECKOUT,
slotted into exactly one return statement in `functions/api/enquiry.ts` (the
comment marks it): create a session for the piece, amount from the DATASET
never the form, return URL landing on the same confirmation. First paid thing
on the project, so it is asked about first.

### Words where a shop needs them

Intro lines for the shop, the drops index, contact, the worn band and the home
chapters. All ours, all his register, all flagged (`shopIntro`, `dropsIntro`,
`contactIntro`, plus `homeLines`), all counted by launch-check, which rose from
26 to 29 and is the point: nothing invented can quietly become permanent. The
process page deliberately gained nothing: the formula and his making lines are
its whole text. Each drop's own page already opens in his approved statement,
which is better than any intro we could write.

### The buyer's walk, and what it fixed

Walked as a first-time visitor from Instagram on a phone. The arrival now
answers all four questions in one screen (what: his two lines; cost: From €275;
have: Made to measure; next: All Creature). Two failures found and fixed: the
piece page answered "what does it cost" seven screens down, so the price now
sits under the name on the FIRST frame; and the inscription said "Made to
order." directly beneath "Handmade. Made to measure.", a tautology, so the
availability line now appears only when it says something the constant line
does not.

### The drop filter, condition restated

Grouping exists in the ordering; the CONTROL appears when a second drop exists.
A filter offering one option is furniture (unchanged from section 62).

### The night's tool failures, for the record

1. **The screenshot harness reported a 900px page that measured 3405.** It was
   navigating to a PORT FROM THE PREVIOUS SESSION, and its sanity guard passed
   vacuously on the error page (zero images = "nothing failed"). It now refuses
   to capture when it lands anywhere but the requested path, and names where it
   landed. An hour of "failures" were the tool.
2. **Servers started with `&` die with their shell.** The preview server must
   run as a tracked background task; half the "site is down" results were this.
3. **`--log-level error` suppressed the dry-run warning**, so a test that sent
   no email was indistinguishable from one that sent a real one. The dry run is
   now proven by its log line before any success is believed.
4. The audit was re-proven able to go red tonight (a planted duplicate h1 was
   caught, then restored) before its greens were trusted.

### Verified overnight

21 pages × two languages × 390 and 1440: zero issues (headings, alt, focus,
overflow, CLS, contrast). No-JS: wash inert, no hidden frames, both forms
usable, "Place the order" reachable. Reduced motion exercised on every capture.
All redirects live on production, one hop each. Cold Slow-4G + 4x CPU: first
paint 668-792ms, CLS 0.000 everywhere, LCP 712ms-2.4s, and the home LCP is the
arrival photograph again. Order flow tested against the Workers runtime with
the dry run proven to fire. `npm run check` went red on a real JSX error
mid-session and green after the fix; launch-check red at 29, correctly.

---

## 66. The third reorganisation, the rescue, and the rewrite (2026-08-04)

### The Drive files by status now

68 files, 61 unique. `NEW` = the current drop's pieces (all frames already in
the dataset). `1 of 1   Sample sale` = two buyable one-offs with nine
never-seen frames, hi-res. `ARCHIVE   SOLD OUT` = the red shirt and the pale
Lux trousers. `Everything is done artisanally by us` = both designer portraits
plus two video stills with baked black bars (recorded, not imported; the
folder NAME is his own sentence). Kept: TIBIA CUT, STYRAX TOP, PROCESS,
homepage. Gone entirely: archive/, experimental/, OBLIVION/, MONUMENTUS L&T/,
the root files — 28 images that now exist only in Sanity.

### The import no longer depends on files persisting

A missing key is RESCUED from the dataset by the original filename stored on
its asset (dedupe-by-sha1 keeps the first upload's name forever, so renamed
files are findable only that way; three stem shapes are tried, including the
long disk-folder prefix by suffix match). Every rescue is logged with what it
matched. The reserved `dataset/` alias declares a frame that lives only in
Sanity. Truly-nowhere still aborts before writing. 29 frames rescued on the
first run; nothing was deleted.

### What his folders dictated

- **Severya** is the snake skirt alone now: his sample-sale folder gives it
  four product frames and its own life; the name is his, from the inscription
  in his own hand, and is no longer flagged. Slug /severya; /capo-08 redirects.
  READY NOW from his folder.
- **Styrax Red Goat** is a new Creature (settling the old red-variant
  question): 1 of 1, ready, four frames including the catalogue's first lining
  shot. Invented price 775, flagged with the rest.
- **capo-10 and capo-11 are SOLD OUT in his own words** — availability
  notOffered, note "Sold out." CONFIRMED by the owner 2026-08-04.
- A 1 of 1 cannot offer "remade to your measurements". ANSWERED by the owner
  2026-08-04: they are private commissions, made once, bought as they are.
  Implemented in section 67.
- Seventeen Creature.

### Drop, invariable; the route stays

Italian does not pluralise the loanword: the label is Drop everywhere on the
Italian side. English keeps Drops. THE ROUTE STAYS /collections: his own
shop's platform serves a Drops-labelled page from /collections/*, so the
label/route mismatch is one he already trades in, and a rename buys nothing a
visitor sees for two more redirect lines.

### The announcement went home

"We present MONUMENTUS: Tenebrae & Lux." is his approved sentence; the words
never changed. Its PLACEMENT was ours and the owner named it as what he
disliked. It now lives where an announcement lives: on the drop's pages, which
open with his full statement. The arrival carries the drop's NAME as a label
and his second line, which describes rather than announces. The drops index
became a real page: cover, his statement whole, the piece count, the way in.

### The writing standard, measured from the references

Fetched live: Rick Owens, Isaac Sellam, Sorcinelli, and his own shop. What
their writing shares: navigation is bare nouns; buttons are one word ("Join",
"Iscriviti", "View"); facts are stated flat WITH THEIR LIMITS ("every piece is
unique and Made in France", "Fino a esaurimento scorte e non oltre il 31
agosto"); poetry is two mirrored fragments, never prose; and NOBODY EXPLAINS
THE SITE TO THE VISITOR — the only visitor-addressed copy is transactional.
The weakest line on any of them is chatty ("Join the tribe and be the first to
know what's going on here!"), which is the register to avoid.

The rewrite, all still flagged:

| string | was | is |
| --- | --- | --- |
| shopIntro EN | Each piece is handmade in South Italy. Ready now, or built to your measurements. | Made to measure, or ready now. Handmade in South Italy. |
| shopIntro IT | Ogni pezzo è fatto a mano... | Su misura, o disponibile subito. Fatto a mano nel Sud Italia. |
| contactIntro EN | Write to us. A person replies, within one day, Italian time. | A person replies. Within one day, Italian time. |
| newsletterLine EN | Every Creature exists in very small numbers. Leave your address and we will tell you... | A few pieces, a few times a year. We write when a drop is ready. |
| newsletterAction | Keep me posted / Tienimi aggiornato | Subscribe / Iscriviti |
| readyExplanation EN | This Creature is already made. Take it as it is, or... | Already made. Take it as it is, or have it remade to your measurements. |
| fulfilmentQuestion EN | This Creature is already made. How do you want it? | As it is, or to your measurements? |
| takeAsIs / haveItRemade | I will take this one as it is / Remake it to my measurements | As it is / To my measurements |
| measurementsForRemakeOnly EN | The measurements are only needed for a remake. If you are taking... | Measurements are for a remake only. Taking it as it is, leave them empty. |
| listClosed EN | Sign-up is not open yet. Write to us and we will tell you when it is. | Sign-up is not open yet. |
| dropsIntro | The work is released in drops. A few pieces at a time, then the next. | CUT: category pages carry no editorial on any reference, and the card opens with his statement |
| dropsHomeLine | The current drop, in full. | CUT: it explained the page |

Launch-check: 29, including the two new sample-sale pieces' invented values.

### Verified cold

25 pages × two languages × 390 and 1440, zero issues. The audit was proven
able to go red first (planted duplicate h1, caught, restored).

---

## 67. The rebuild from the top: two people, a flat menu, one catalogue (2026-08-04)

Decided by the owner top down and implemented, not re-derived. What follows is
the record of what changed and, where implementing a decision broke something
he could not have foreseen, what broke.

### The brand is two people

**{DESIGNER_BIOGRAPHY} is answered.** The project is an experimental line
between the knowledge and vision of **Ferdinando Palmieri** and **Ciro Cecco**,
in collaboration with **Ferdressed**. Both names are publishable because they
wrote them. About is now built around a brand made by two people rather than a
designer page with one portrait: a creators list in the one display size, and
the collaboration credited with an outbound link, because an established shop
vouching for a young label is the strongest trust signal an international buyer
gets. The Italian is our faithful translation and is flagged as ours
(`aboutOrigin` in `inventedCopy`) until he approves it.

Three new fields carry it in site settings: `creators`, `partnerName`,
`partnerUrl`. Adding a third creator is a line in the studio, not a deploy.

### The menu, flat, on the Rick Owens model

Two groups separated by whitespace alone. **No rules, no headings, no
sub-items, no dropdowns.**

    HOME  NEW  CREATURE  PROCESS  ABOUT  CONTACT

    INSTAGRAM  IT / EN

One typeface, one size, uppercase, wide tracking, tight leading, left aligned.
The hairlines that used to separate entries are gone; whitespace does that work
now, which is the whole point of the model. The email left the panel: it lives
on Contact, which is a menu entry.

**Sub-items under Creature were considered and rejected by the owner**: a menu
entry that drops a visitor into the middle of a page is disorienting, and
sectioning belongs inside the page. That is why the catalogue has three visible
headings instead.

**DROP left the menu.** The drop index is reached from NEW and from each
Creature. It returns to the menu when there are five or six drops rather than
three.

### /new follows the current drop with no code

The current drop is the FIRST collection in his own drag order in the studio.
Reordering the collections in Sanity is what publishes a new drop; nothing in
this repository changes. The page carries his statement WHOLE (every other
placement on the site is an excerpt we chose; this is the page it was written
for), then the pieces full bleed with name and price, then the route to the
other drops at its foot.

### One catalogue page, and gender is a filter

A control row in the manner of his own shop: filter by who a piece is for, and
the piece count. All of it CSS — radios plus `:has()`, no script, no bundle —
so the catalogue filters with JavaScript off exactly as the order form submits
with it off. The count is precomputed per combination and the matching one
revealed, because CSS cannot count.

Three movements, with visible headings, in the order a buyer cares about:

1. **AVAILABLE** — ready now and made to order
2. **1 OF 1** — private commissions, made once, bought as they are
3. **SOLD OUT** — at the bottom, marked, carrying no price and no order route

A movement whose every tile fails the filter takes its heading with it, phrased
as "has no tile that would survive this filter" rather than by reading computed
display, which CSS cannot do.

**Gender is a filter, never a structure.** `wornBy` is a field on the garment,
surfaced only here. It is never a route and never a section. Where his own
folders said which, they were used; where they did not, it is UNSET rather than
guessed, and an unset piece appears under every filter, which is the honest
behaviour when nobody has said which. **Eleven of seventeen are unset** — the
list is in the report and in the studio, flagged.

Four across at desktop, **two across on a phone**. A tile keeps the
photograph's own 3:4 at every width instead of a viewport height: two across a
390px screen is a 195px column, and a viewport-tall frame there is a chimney.

### The 1 of 1 pieces, confirmed by the owner

They are **private commissions, each made once to someone's measurements. They
can be bought only as they are.** So: no remake option anywhere on them. The
order page for a unique piece hides the fulfilment choice AND the entire
measurements fieldset, and posts `fulfilment=asIs` as a hidden field, with the
server still deciding what to require rather than trusting the browser to have
hidden the right thing. The copy says what the piece IS ("A private commission.
1 of 1, made once.") instead of implying it can be repeated.

capo-10 and capo-11 are **sold out, confirmed**. The awaiting-confirmation flag
is gone.

### The type voices, six to four

| Voice | Before | After | What moved |
| --- | --- | --- | --- |
| label | 11px, `wdth 92` | 11px, `wdth 100` | Unchanged in size. The narrow width axis was a fifth voice hiding inside the first; deleted. |
| mono | 12px, "facts off the garment" | 12px, **DATA ONLY** | Three things dressed as data stopped being mono: "Built to your measurements." on two pages, and the shipping terms on the order page, which are prose. |
| body | 15–17px | 15–17px | Unchanged. Now carries his words and ours both. |
| statement | 18–28px | **renamed display** | Same size. One name for one job. |
| chapter | 24–36px | **deleted** | Absorbed into display. |
| — | `--wdth-label: 92` | **deleted** | Left one width axis, `--wdth-normal: 100`. |

**What had to break to get there:** the site's largest type is now smaller. The
chapter register (24–36px) was the wash line, the 404 and the process title;
they all sit at 18–28px now. That is a real loss of scale at the top of those
three pages and it is deliberate — rule 10 has always pointed this direction,
and case, tracking and position carry the emphasis that size used to. Nothing
else broke: every call site migrated, and four sizes now run the whole site.

### Three defects found by looking at what shipped

Verification found these; reading the source would not have.

- **The filter did nothing.** Every hiding rule lives in `@layer components`
  and Tailwind's utilities are a LATER layer, so `.block` on a tile and `.flex`
  on the empty state beat them outright. The count beside the control changed
  while the grid below it did not — the page asserted a number it was not
  showing. **Rule: `display` for anything a rule here hides lives with the
  rule, never on a utility class.**
- **The count rendered twice**: per-drop counts were emitted even while the
  drop control is hidden for a single drop, so the page read "17 Creature17
  Creature". Only selectable combinations are emitted now.
- **One across on a phone**, not two as asked. Fixed with the 3:4 tile; the
  catalogue went from 13807px to 4254px deep at 390.

### What did NOT break, and was checked rather than assumed

Two photographs now sit under the fixed chrome at once on a phone, and they can
disagree about polarity. Section 14 already answers it: the signature and MENU
sit together and end at x=158, inside the first column, so one polarity value
is still always right for both. Measured, not eyeballed — the computed mark
colour over a light photograph at scroll 500 is `rgb(10, 10, 10)`, ink.

### Verified cold

Deleted `dist` and `.astro`, clean build, 85 pages. 27 pages × two languages ×
390 and 1440: **zero issues at both widths**. The audit was proven able to go
red first on this exact build (planted an `img` with no alt, caught as 2
issues, restored to 0). The filter was proven with **scripting disabled in the
browser**: 17 tiles and "17 Creature" at rest, 12 and "12 Creature" under
WOMEN, 16 and "16 Creature" under MEN.

**Launch-check: 30**, up from 29. The six flagged `wornBy` values and
`aboutOrigin` are new; nothing was cleared.

---

## 68. The four references, re-measured for the deepening (2026-08-04)

STATUS: VERIFIED, NOT REMEMBERED. All four sites rendered in headless Chrome at
1440x900 and 390x844 on 2026-08-04, overlays REMOVED rather than accepted,
every number read out of the live DOM with `getComputedStyle`. The harness
refuses to measure a page whose title says 404, because two sites answered a
spoofed user agent with a 404 while serving the real headless UA fine — a
study of an error page poisons everything after it, and it nearly happened.
Sellam and Ferdressed had never been measured; section 14 covered the others
and its findings stand.

### Scale: the largest type each site ever shows

| site | largest @1440 | weight / case / tracking | largest @390 | body |
| --- | --- | --- | --- | --- |
| Rick Owens | **11px** (menu; nothing larger exists) | 400 / upper / 0.08em | 11px | 11px |
| Sorcinelli | **22px** home statements, **24px** about lines, 21px page titles | 300 / upper / ~0.027em | 20px | 12px |
| Isaac Sellam | **18.7px** footer labels, 17.9px prose and product titles | 400–500 / mixed | 16.5px | 17.9px |
| Ferdressed | **24px** hero line and section heads | 400 / upper / wide | 20px | 16px |
| **ours** | **28px** display | 300 / upper / 0.02em | **19.5px** | 15–17px |

**The scale question, answered with the numbers.** Our display (28px desktop,
19.5px phone) sits at or above every reference's measured maximum (24 / 20).
The register is NOT undersized; the collapse landed it exactly at the
references' ceiling. What the collapse deleted (36px chapter) would have been
half again larger than anything any reference shows. Size stays.

**What actually is timid: deployment.** The references title their pages in
their large voice — Sorcinelli "Perfumes" at 21px, the about lines at 24px,
Sellam products at 17.9px, Ferdressed sections at 24px. WE title almost every
page at 11px: catalogue, contact, NEW, the garment's own page, collections,
404 were all label-sized. The large voice existed and was barely used. That —
not the token — is what read as timid, and it is what this session changes.

### Rhythm and immersion, measured

- **Sorcinelli's home is ONE viewport. It does not scroll.** A full-screen
  slideshow with one 22px statement and four nav words: a room, not a page.
  The single strongest emptiness any reference shows.
- Rick Owens: 4.1 viewports desktop, 6.2 on the phone, 7 media frames — ALL
  seven full-bleed on the phone. Repetition of frames, one type size,
  emptiness by monotony. 52 text runs on the whole home page.
- Sellam: 4.7 viewports, one 100vw hero then a dense product river; body prose
  at 17.9px is its voice of confidence.
- Ferdressed: 4.0 viewports; a black full-bleed video-texture hero carrying
  one widely-tracked line — OUR arrival vocabulary, on the shop that vouches
  for us; shipping banner BELOW the wordmark at 10px; section heads 24px over
  product grids.

### What the study licenses

1. Page titles and the catalogue's three movement headings move into the
   display voice (the deployment correction above).
2. The transactional action gets body SIZE with label dress (`type-label
   text-body`): Sellam and Ferdressed set actions at 15–17px; ours was 11px —
   identical to the helper text beside it, a caption where a commitment
   belongs. Four sizes remain the whole set: this composes two existing
   tokens and coins nothing.
3. The shipping banner leaves the two culture pages (process, about): it is
   Ferdressed's device, and even Ferdressed sets it under the wordmark, not
   as the first pixel of the world. It stays on every commerce surface.
4. Interior pages join the EXISTING arrival system: first text surface marked
   `data-reveal`, same 900ms curve, same reduced-motion and no-JS guarantees,
   no new mechanism.

---

## 69. The deepening: scale deployed, the spell kept, the tiles lightened (2026-08-04)

The design-deepening session. Structure untouched; judgement applied page by
pixel, licensed by the section 68 study. Every change below is reversible and
none invents content.

### Deepenings

- **Page titles into the display voice.** Catalogue, contact, NEW (both
  states), the garment's own page, collections index and page, the 404, the
  about fallback. All were 11px labels; the references title pages at 18-24px.
  The catalogue's three movement headings joined them, because the movements
  are the architecture the owner chose over menu sub-items, and architecture
  at caption size is invisible.
- **The transactional action** (`Acquire — €X`, `Place the order`) is
  `type-label text-body`: body size in label dress, 15.2px on a phone against
  the 11px it shared with the helper text beside it. Sellam and Ferdressed
  set actions at 15-17px. Four sizes remain the whole set.
- **The banner left process and about** (`shopChrome={false}`): logistics
  before the first pixel of a world breaks it. It stays on every commerce
  surface.
- **Arrivals on the text-led pages**: process, contact, collections, the
  catalogue enter on the photography's own 900ms curve via `arrive` on the
  first TextSurface. No new mechanism; reduced-motion and no-JS guarantees
  are the reveal's own. Media-led pages already had their ceremony: the
  priority frame lands instantly, and that stays.

### Corrections (found by looking, not by reading)

- **First-paint chrome polarity** on text-led pages was read off the first
  TILE's photograph, so the signature and MENU painted ink-on-ink over the
  catalogue's black opening until the observer met a photograph. The chrome
  now takes the page's own theme there.
- **The tile perf regression.** Every frame declared `sizes="100vw"`; a 195px
  tile pulled a 640px file (the smallest rung), and twelve hover frames rode
  along on devices that can never hover. Catalogue on Slow 4G: 1812 KB and
  8.7s LCP against the plan's recorded 521 KB / 1.86s. Fixed three ways:
  tiles declare `(min-width:80rem) 25vw, 50vw`, rungs 360/480 exist, and the
  hover frame sits behind `<source media="(hover: hover)">` with a
  transparent-pixel fallback. The regression arrived with the catalogue
  rebuild; the recorded baseline simply predated it.
- **The audit caught my own hover-gate markup** (aria-hidden moved to the
  <picture>, leaving the img an unflagged empty alt, 24 issues) — fixed in
  the markup, never in the audit.

### Looked at and deliberately left alone

- **The display token.** 28px desktop / 19.5px phone sits at or above every
  reference's measured maximum. The "loss of scale" was real but the answer
  was deployment, not a bigger token.
- **The menu and every caption at 11px.** Rick Owens runs an entire site at
  11px; navigation is where severity lives.
- **The footer, identical everywhere.** A colophon; consistency reads as
  confidence, and Rick Owens' is identical everywhere too.
- **The home page** (s64 stands) and **the wash**.
- **The chrome over scrolled text**: mid-scroll the signature can cross its
  own ink. Every fix (opaque bar, blend, hiding) was already rejected for
  better reasons than the collision; recorded, accepted.
- **The 9:16 stills in 3:4 tiles** (capo-07, capo-10) lose 25% of their
  height in the INDEX only; the full frame lives on the piece's own page.

### Verified

Audit proven red on this exact build (planted a missing alt; and the hover
gate's own 24 real issues were caught unprompted, which is the audit earning
its keep), then 27 pages × both languages × 390 and 1440, zero issues.
Slow 4G + 4x CPU, deployed origin, cold cache: home LCP 1956ms, catalogue
median 1964ms over three runs (recorded 1860ms; the band overlaps and the
first run beat it), about 868-940ms, piece 1604-1932ms, process 752ms,
CLS 0.000 everywhere. Catalogue transfer 1039 KB against 521 KB recorded —
the denser grid puts twice the frames near the fold; each frame is now
cheaper than before the fix. Launch-check: 30, unchanged.

---

## 70. Seen on a real phone, and the signature writes itself (2026-08-04)

The owner reviewed the site on an iPhone at 390 and found three things the
harness never looked at from quite that angle. All three were measured
before and after; then the one commissioned effect, and two licenses.

### The corrections, with numbers

- **The chrome is STICKY, not fixed.** Fixed put the marks at y=0, where the
  static banner also lives, and the two-line Italian banner ran straight
  through the signature (banner 0-44px, marks at y=31, measured). Sticky
  starts the chrome BELOW the banner and pins it the moment the banner
  scrolls away; zero-footprint via negative margin so it stays an overlay.
  After: banner 0-30, chrome 30-97, nothing crosses anything.
- **The banner never wraps**: one line at every width, 10px and 0.05em below
  30rem. A longer future banner gets shortened editorially. (First attempt
  used @utility with a nested range query, which compiled to NOTHING,
  silently — the class was in the HTML and no rule in the CSS. Rewritten as
  unlayered plain CSS. Check the compiled output, not the source.)
- **CHIUDI is MENU's own pixels.** The open summary was repositioned with
  token arithmetic; it also turned out the header signature beside it was
  INVISIBLE over the open panel — the chrome keeps the page polarity and the
  panel is its opposite, always — yet still intercepted taps. The summary
  now keeps its flow position (122,58 open and closed, measured at 390), and
  the header signature link is visibility:hidden while the panel is up; the
  panel's own signature at its foot carries the mark.
- **The catalogue shows product in the first viewport at 390**: header and
  movement spacing tighten on the phone only; first pair now starts ~345 CSS
  px into an 844 viewport. Desktop unchanged.

### The name order, not silently

Ciro Cecco before Ferdinando Palmieri, owner's request: creators list and
BOTH languages of the approved origin sentence. Because the order sits
inside an approved sentence, the edit is flagged `aboutNameOrder` (new
schema option) and launch-check counts it — 31 now — until Ciro confirms.
`scripts/patch-name-order.mjs` made the patch; patch-text and import-photos
carry the same order.

### The signature writes itself

Once per visit, on the home arrival: the mark draws stroke by stroke as if
a hand were writing it, then settles into exactly the static mark. The SVG
is OUTLINES (traced), not pen strokes; a true centerline redraw was priced
and NOT done — the outline of a thin script hugs the pen path closely
enough that tracing it reads as writing. pathLength="1" normalises each
path; each carries --sig-delay/--sig-dur computed at build from its share
of the path data (1823/204/373ms of ink, 400ms breath, 140ms lifts, ~500ms
settle per path). Armed by three lines of inline script + sessionStorage;
reduced motion, no JavaScript, or a second view this visit and the element
is display:none — the arrival is what it always was. The corner signature
never animates. Verified: draws on first view, absent on reload; home LCP
1552ms and CLS 0.000 after deploy, no regression.

### Licenses (reversible)

- `.tile:active` dims the frame slightly on hover-less devices: the surface
  answers the finger. No motion, nothing downloaded.
- The menu's inversion arrives as one 240ms hard top-down edge — the wash's
  language. Closing stays instant: opening is a ceremony, closing is
  obedience.

### Verified

Audit proven red (planted h1), then 27 pages × both languages × 390 and
1440, zero issues. Deployed perf: home 1552ms LCP, catalogue 1424ms, CLS
0.000, no regression from section 69's numbers.

---

## 71. The monogram from the mark, and Instagram earning its shape (2026-08-05)

### The tab: section 9 reversed, by the owner

The no-monogram rule held until the owner himself called the windowed
signature crop what it was: an illegible smudge at 16px. The monogram was
BUILT FROM THE MARK, as asked: the signature SVG dissected (the C of Cecco
is its own path and lifts out whole; the whole of "Aleksander" is ONE
continuous outline, so the A needed a polygon clip along its right flank to
shed the crossing 'l'), composed diagonally, rendered at 16/32/64/180 in
both polarities, and JUDGED.

**The honest verdict, recorded**: the extracted letterforms are beautiful at
64 and above, hold at 32, and at 16px read as a calligraphic gesture, not as
the letters AC. So the favicon ships the fallback the owner named — a
simplified redraw, the A's entry sweep and written lean (skewX -8), the C as
one open arc, centerline strokes at width 42 — which reads AC at every size
including 16. **Both candidates and their size matrices live in
docs/monogram/ awaiting his pick; swapping is one file** (favicon.svg +
apple-touch-icon.png). The full signature stays everywhere else.

### Instagram reads as Instagram

- **Squares** (`height="square"`, hotspot-cropped): the recognition signal
  is the shape, no logo, no feed, no token.
- **Per-frame post links**: `instagramFrames` migrated from `[media]` to
  `[{media, postUrl}]` (new `instagramFrame` object; four frames wrapped in
  place by `scripts/patch-instagram.mjs`). Empty falls back to the profile.
  The import PRESERVES postUrl by key — it exists only in the studio and an
  import must not erase his work. The guide teaches: photograph, hotspot,
  paste the post's address.
- **The strip, not the grid**: one row of squares with a frame cut by the
  edge is Instagram's own grammar, the worn band already taught the site
  this language (mechanics shared: peek, proximity snap, contained
  overscroll, focusable named region), and at 390 it costs one row where
  the grid cost three. Handle above it in the display voice. Complete with
  zero (absent), one, four (fills a desktop row exactly, no scroll) or six
  (scrolls, cut-frame cue).

### Verified

Audit proven red (planted missing alt beside the strip), then 27 pages ×
both languages × 390 and 1440, zero issues. Deployed perf: home 1896ms LCP,
catalogue 1816ms, CLS 0.000 — inside the section-70 noise band, no
regression. Launch-check 31, unchanged: the frames stay flagged
`instagramFrames` until he approves the selection, and `aboutNameOrder`
still awaits Ciro. One build trap found: a JSX comment inside an opening
tag passes `astro build` but fails `astro check`; the sticky-chrome comment
moved above its element.

---

## 72. His words arrive, the A alone, the flick, and three motions (2026-08-05)

### The first real content replaced invented, and the number moved

Six pieces carry his approved words verbatim (spelling and rhythm untouched,
including "costumizable"): the Oblivion shirt — with his REAL measurements,
free-text field so his Armpit fits with no schema change — the Styrax pair
(Red 1 of 1 / Black Available), and the Monumentus description on exactly
the confirmed pieces: capo-05, capo-11 (the long trousers) and capo-10 (the
tibia cut, "stopped at the shin"). Never the vests. English his and
approved; the Italian translations are OURS, flagged per piece with the new
`descriptionIt` option. The name order is APPROVED and cleared.

**Launch-check 31 → 30**: seven flags cleared, six honest translation flags
added. Still carrying invented descriptions, to ask him for specifically:
**Armonyen, the two Monumentus Vests, Aleya, Severya, Glovyes, Vesper (the
bag), Corvinus, Vertex (the hat), Nocte.** Ghezard's description was already
his.

### The A alone (superseding 71's composition)

He chose the EXTRACTED monogram — his hand over easy legibility — and asked
for the A without the 'l' remnant. The eye failed twice at guessing the cut;
a rasterised scanline of the letter region gave the true anatomy (the apex
at (560,175), the l descending BETWEEN the legs to (445,520)), and the cut
threads the corridor with ~10 units to spare. Verified against the uncut
original at identical scale: every kept edge is the pen's, except a few
fused units where the l physically touched the leg — invisible below 360px,
recorded here rather than hidden. Favicon and touch icon carry the
recomposition; the redrawn candidate remains in docs/monogram/.

### Browse without clicking (his request)

On hover-less devices each tile is a flick strip: up to four frames,
mandatory snap, 94% wide so the next peeks. Pan scrolls, tap navigates —
the preview cannot trap. Hover devices keep the existing swap; their extra
frames are display:none and never fetched. Not focusable, on purpose:
seventeen extra tab stops would be hostile and every frame lives on the
piece's page. REJECTED: tap-cycling (a tap that does two things is a trap),
dots (foreign chrome), a mouse strip (hover already serves it). Two honest
limits: the peek cue is subdued by the gutterless grid (discovery is
tactile), and headless Chrome cannot emulate `hover` — the branch was
verified by flipping only the media condition on the shipped rules, which
caught a real specificity bug (the un-hide lost to the hide) before ship.

### Three motions, each deletable as one block

- **The page turn**: cross-document view transitions, 200ms crossfade,
  CSS only, `prefers-reduced-motion: no-preference` gated. The element
  morph was rejected (no reliable pair-naming without JS; 17 named tiles
  cost phone frames).
- **The ceremony**: the order confirmation arrives element by element in
  writing order, the promise last — the emotional peak finally has one.
  Verified through the real Workers runtime, DRY RUN line seen.
- **The movement headings** arrive on the reveal's curve.
- REJECTED: image-load fades (needs per-image JS; the reveal owns that
  moment), the banner's exit (scroll-linked motion on a logistics line).

### Verified

Audit proven red, 27 pages × both languages × 390 and 1440, zero issues.
Deployed Slow 4G: home 1692ms, catalogue 1892ms, piece 1000ms, CLS 0.000,
catalogue transfer unchanged — the flick adds nothing on hover devices and
only lazy frames on touch. Launch-check 30.

---

## 73. The measuring diagram, and the catalogue's breaking point (2026-08-05)

### The diagram (owner-directed, ours until approved)

The order page's measurements fieldset now opens with a hairline drawing:
a plain sleeveless silhouette — nobody's piece in particular — with three
tailor's dimension lines in the order the form asks: shoulders across the
top, chest across the widest point, length down the side. One stroke
weight, currentColor, no fill, NO TEXT — the written instructions beside it
stay the source of truth in both languages, so the drawing never needs
translating. aria-hidden, because it repeats what the words already say.
It is an INVENTED VISUAL on the page where clarity beats style: flagged
`measureDiagram` in inventedCopy (launch-check 30 → 31) until the owner
approves or redraws it. Component: src/components/MeasureDiagram.astro;
remove by deleting the component, its import, and the flag.

A verification lesson recorded: the first red-proof planted its defect in
capo-01's order page, which the audit DOES NOT COVER (it audits
capo-02/order). The green that followed proved nothing. Re-planted in the
audited page: caught, 2 issues, restored to 0. **When proving the audit can
go red, plant inside a page in its PATHS list, and check the list first.**

### THE CATALOGUE'S BREAKING POINT, as numbers a session can test

The single-page catalogue with three movements (s67) and the menu without
DROP (s67) are decisions that are right at seventeen pieces and three
drops, and stop being right at a measurable size. The thresholds:

- **Pieces > 24, or drops > 3 → the catalogue paginates by drop.** At 24,
  the desktop grid is six rows (~4.5 viewports with headings — the ceiling
  of every measured reference: RO home 4.1, Sellam 4.7, Ferdressed 4.0);
  the phone grid is twelve rows (~7 viewports, one past RO's 6.2). Past
  either number the page outgrows everything the references pace to.
- **Drops ≥ 5 → DROP returns to the menu**, which is the owner's own rule
  from s67 ("when there are five or six drops rather than three"), recorded
  here as the number 5.
- The tile flick caps at 4 frames and the drop filter row was built for
  ≤4 drop controls; both assumptions break at the same thresholds and are
  part of the same rework.

A future session at the third drop should TEST these counts rather than
re-judge the design: `count(garments) > 24 || count(collections) > 3`
means the restructure is due, and it is one session's work, not an
emergency.

---

## 74. The stale icons, and why a fixed filename is a liability (2026-08-05)

The owner reported the tab still showing the old signature crop. Fetched
from the ORIGIN rather than inspected locally, because the local build had
been right the whole time and that is precisely how this survived:

| served file | state |
| --- | --- |
| `/favicon.svg` | CORRECT — the extracted monogram, byte-identical to local |
| `/apple-touch-icon.png` | BROKEN — a 180×180 downscale of a 1500×900 PAGE SCREENSHOT; the mark sat tiny in a corner |
| `/icon-512.png` | STALE (Aug 3) — the OLD signature crop, referenced by the manifest |

### The cause, in two parts

1. **A shared renderer with a mutable viewport.** The touch icon was made by
   screenshotting a page at whatever size `render.mjs` happened to be set to.
   In s71 that was 180×180 and the output was right; in s72 it was 1500×900
   for the letter-cut work, and resizing that screenshot to 180 produced a
   corner-stamp. **I verified the SVG by eye and assumed the PNGs followed.**
2. **An icon nothing in code pointed at.** `icon-512.png` was reachable only
   from a hand-written `public/site.webmanifest`. Every search for the icons
   used "favicon|apple-touch" against the layout, so the file appeared in no
   result, in either rebuild. A static manifest is a reference the compiler
   cannot see.

### The fix, and the general principle

- Both PNGs regenerated by `scripts/icons.mjs` (`npm run icons`), which decodes
  the PNG's IHDR to prove dimensions rather than trusting the pipeline.
  **It was written as a scratchpad file and lost with the scratchpad** — see the
  addendum at the end of this section.
- All icons moved to `src/assets/icons/` and imported with `?url`, so the
  build content-hashes their names. **The unhashed `public/` copies are
  deleted**: no fixed path remains that could serve a stale byte, and
  `/favicon.svg` now 404s by design.
- `site.webmanifest` is a GENERATED endpoint importing those hashed URLs, so
  the manifest cannot drift from the icons, and a missing icon fails the
  build instead of shipping quietly.
- `/_astro/*` gets `immutable` caching — safe only BECAUSE the names change
  with the content.

### The trap this proved, with evidence

`max-age=0, must-revalidate` **did not stop the edge serving a stale body**:
minutes after the deploy landed, `GET /site.webmanifest` returned the OLD
manifest, while `GET /site.webmanifest?cb=…` returned the new one. So
"I fetched the file directly from the origin, therefore it is not cache" is
FALSE on this host: fetching bypasses the browser, not Cloudflare's edge.
Any check of an unhashed path must carry a cache-buster, and the owner's
original report was very likely a true edge-cached copy of the old icon.

Verified after deploy by fetching the three hashed files from the origin and
rendering them at 180/64/32/16: all three are the monogram, checksums equal
to `dist/`. Audit proven red in a page inside PATHS, then 27 pages × both
languages × 390 and 1440, zero issues.

### Addendum (2026-08-10): the renderer was written in a scratchpad and lost

The script that fixed this was written to a session scratchpad, and the
scratchpad was cleaned. Two sentences above pointed a future session at
`scratchpad/icons.mjs`, a file that no longer existed anywhere.

**An instruction pointing at nothing is worse than no instruction**, because
the next session reads it, finds nothing, and improvises a renderer — which is
the exact act that produced the corner-stamped touch icon in the first place.
A tool the handoff tells you to run is not scratch work; it belongs in
`scripts/`, in the repository, next to the thing it protects.

It is now `scripts/icons.mjs` / `npm run icons`, rebuilt and hardened:

- **No browser.** It rasterises the SVG directly, so the size is an argument
  rather than a viewport, and the class of bug in cause (1) above cannot recur
  — there is no shared renderer left to inherit a viewport from.
- It still decodes IHDR for the true pixel size, and adds two checks the
  original did not have: **ink coverage** (catches a blank square) and **span**
  (catches the corner stamp itself, which would have failed at 12%×7%).
- **One source, two grounds.** Only the SVG's coverage is used, not its fill,
  so `favicon.svg` alone produces the ink-on-paper touch icon and the
  paper-on-ink 512 the manifest's `background_color` requires. The monogram
  swap of s71 stays what it was promised to be: replace one file, run one
  command.
- `--check` renders and compares against disk without writing, for CI or for a
  session that only wants to know.
- It writes `docs/monogram/icons-at-sizes.png` and tells you to LOOK. The
  automated checks prove the file is not blank and not inverted; they cannot
  tell you the A has stopped reading as an A.

Both PNGs were regenerated by it and are byte-different from the browser's
output by antialiasing alone (mean delta 0.48/255 at 180, 0.17 at 512; visually
identical side by side). They were replaced deliberately rather than left
alone: a `--check` that always reports drift is an alarm nobody will read, and
the icons are now exactly what the committed script produces.

---

## 75. The band's real contents, the black band, and a page going quiet (2026-08-10)

### The worn band was not what anyone thought it was

A sequence was given for the band that named a red shirt and a man with a
raised finger. **The band holds neither.** Both photographs exist — they are in
the INSTAGRAM strip (`instagramFrames`), a different field rendered as squares
further down the same page. `IMG_3477.JPG` is the red leather shirt;
`Mnmnts Lux tibia cut.jpg` is the man in profile with his index finger raised.

The band (`homeSequence`) holds five frames, in this order:

| # | file | piece | what it shows |
| --- | --- | --- | --- |
| 1 | `aa52ef49-…-24cb5827376d.jpg` | Severya | woman, full length, hard low sun on concrete, black leather bandeau and slit skirt |
| 2 | `IMG_0204.jpg` | Styrax | woman in bare woodland, goat-fur halter, one arm raised behind her head |
| 3 | `archive_IMG_3474.jpg` | Monumentus Lux | man in the studio, sheer white top, very wide sand crushed-leather trousers |
| 4 | `archive_IMG_9592.jpg` | Ghezard | man from behind, brown leather jacket, tall hooked collar. **The only ink overlay** |
| 5 | `IMG_3485.PNG` | **none linked** | man cropped at the chin, black waistcoat and long leather shorts, raw hem |

Frame 2's raised ARM is the likeliest source of the remembered finger. Frame 5
has no garment attached, which makes it the one tile in a band whose whole
purpose is leading into the work that leads nowhere; it looks like the
Monumentus Vest.

**The order was always a studio field** — a Sanity array is dragged — but
nothing said so, and a sequence whose control is invisible gets changed by
asking a developer. The field now says it, in both languages, and names the
mapping: first from the top is leftmost in the band. There is deliberately NO
second number field: two places claiming to hold one order is how they come to
disagree. The tile preview carries the FILENAME, because that is how the band
is discussed.

### The black band was a margin

`SiteFooter` separated itself with `mt-u21`, and **a margin is transparent**: it
shows the BODY background, which resolves from `<html data-theme>` — the
polarity the page STARTED in. Every page that begins and ends in one polarity
hid this for as long as it existed. The home page is the only one that inverts,
so between its light drop statement and its light footer sat 21 units of solid
ink: **175px on a phone, 252px on a desktop**, explained nowhere.

The footer now paints the gap it owns, inside a `flow-root` wrapper —
load-bearing, because without it the child's top margin collapses straight back
out to the body and the bug returns wearing a wrapper.

**The general rule, worth more than the fix:** on a page whose ground can
disagree with a section, that section owns its own spacing. A transparent margin
is a hole through to a polarity nobody chose.

The same class of bug sat next to it. A `captionPlacement: "below"` caption took
the PAGE margins even inside a strip frame: in the worn band that gave a 416px
frame 175px of left padding and 115px of right, leaving a garment's name 126px
to wrap inside. Contained frames now take the caption inset, the same edge an
"over" caption already uses on the same photograph.

### One page, two rules, his voice twice

The home page stripped "Presentiamo" from the arrival in s72 and then printed
the whole statement — announcement included — four screens below, along with the
arrival's own line a second time. `src/lib/statement.ts` now holds the rule in
one place, because two callers doing their own regex is exactly how the two
halves of one page came to disagree:

- The announcement belongs to the pages that are FOR it (`/new`, the drop's own
  page) and to the drop CARD on `/collections`, which announces.
- No page prints a line it has already spent.

The chapters block takes the strongest line left, which for MONUMENTUS is the
alchemical-entities sentence: it says what the garments ARE, where the arrival's
line names the stages they move between.

### The audit, and what it found

The visible text of all 43 Italian pages, extracted and compared. Two real
repetitions, both structural:

1. **`about` CONTAINS `homeStatement` and `makingStatement` verbatim** —
   paragraphs 1 and 3 of his brand story. With /process printing
   `makingStatement` whole and home printing it whole too, a reader going
   home → process → about met the same three sentences three times. Home now
   makes the claim in one line and points at /process, which is the page the
   passage is for.
2. **The drop statement appeared whole on four pages.** Now: whole on `/new` and
   the drop's page, the announcement alone on the index, one unspent line on
   home.

**STILL OPEN, and it is the owner's to settle:** one sentence still meets a
reader on three pages, because his `about` field repeats the other two fields
word for word. Nothing here can fix that without inventing copy. Either he is
content with it, or `homeStatement`/`makingStatement` want their own wording.

**`/collections` is now the thinnest page on the site** (15 words). That is a
list of one drop, not a copy failure, and it fills as drops accumulate. Its
`season` is empty in the studio; the card renders it the moment he sets it.

### Separation, registers, and two strokes

**Separation was never about the size of the gaps** — they were already u13
everywhere. What differed was where the space was attached and whether a
movement was a text surface at all. The worn band's heading was the one text
block on the home page that was not one, so the SPINE did not pass through it
and it began wherever the previous block's padding ended. Every movement now
opens the same way: u13 above the heading, a small space below, the spine
through it.

**The registers were misused, not miscounted.** Mono is DATA ONLY by its own
token. The language switch was mono, at the foot of a menu whose every other
item is label and whose whole argument is two groups separated by whitespace
alone — a second typeface at a third size made it a third group. The skip link
was mono. Both are controls. The contact page was the worst case and was rebuilt
around it: four facts had been carrying five registers with the hierarchy
inverted, the handle and the email set at 12px mono under 11px labels that named
what the strings already said. Mono, the definition list and both labels are
gone; separation is whitespace, as the menu's is.

**`soldOut` stays mono deliberately.** It is not a count, but it occupies the
same slot as a price on the same tile, and changing register inside one slot
would read worse than the rule it bends.

**Two moments of motion, both strokes rather than fades:**

- **The wash's mark is written by the reader.** Same pen, pacing and stroke
  order as the arrival's signature, driven by the wash's own scroll progress
  instead of a clock, so it slows when they slow and stops when they stop.
  Nothing was added to the page: the wash already held the mark and already
  computed the number. `--edge-n` exists because the dash offsets are unitless
  and a percentage cannot be divided back into one inside `calc()`.
- **The underline under an action is pulled across from the left** instead of
  thickening from one pixel to two, which was a state change wearing a
  transition. It rides over the resting hairline, so nothing reflows under a
  pointer.

Both are gated so that no-JS and reduced-motion readers get the finished mark
and the full underline, with no travel. The feedback is not the motion; only
the way it arrives is.

### Not verified by eye

There is no browser in this environment and no screenshot harness — the one
section 74 mentions was itself a scratchpad casualty. Everything above was
verified structurally: built HTML inspected, compiled CSS grepped for every new
rule (the s70 trap), registers counted per page, `npm run check` clean. **The
motion and the spacing have not been watched.** A session with a browser should
look at the wash being scrubbed, the underline being pulled, and the home page's
movement boundaries before treating them as settled.

---

## 76. A browser, at last — and what it showed (2026-08-10)

Playwright is a devDependency and `scripts/shots.mjs` is committed. **Two tools
had already died in temporary folders and each death cost a real defect**; this
one lives in `scripts/` for that reason. `npm run shots [--audit|--prove|
--only=|--force=light|dark|--dark]`.

The port trap is fixed at the ROOT rather than patched: there is no port
constant to go stale, because the harness starts its own static server on port 0
and reads the assigned port off the socket. It still refuses to capture when it
lands off-path, and it did on its first run — catching that `/` redirects to
`/en`.

`--prove` injects one of each fault into a real page and requires all of them to
be caught before any green is believed.

### What it found, in order of severity

1. **A THIRD COLOUR ON THE ORDER PAGE.** The radio buttons rendered in the
   system accent, `rgb(0,117,255)`, on the page where money changes hands. No
   stylesheet mentioned `accent-color`, so nothing could grep for it, the markup
   was correct and the contrast was fine. **Fixed.** The harness now hides the
   photography and treats any remaining off-axis pixel as a fault.

2. **THE CORNER MARK IS ILLEGIBLE ON ROUGHLY HALF THE SITE.** The persistent
   signature and MENU measure **below 1.5:1 on 48 page/width combinations and
   below 3:1 on 88**, worst 1.00:1. Verified by eye on capo-09 and capo-13: a
   white mark on pale concrete. **Not fixed — it needs a content-model change,
   see the proposal below.**

3. **Every overlay on the home page's first screen is under 2:1**: the drop
   label 1.57, his line 1.60, the price 1.76, the corner mark 1.44, the drawn
   mark 1.39. The opening photograph has bright stone and a near-black garment
   in one frame, so no single polarity survives it.

4. **The Instagram glyphs were orphans.** Passed through the caption slot to
   honour the per-image placement — and every frame is set to "below", so four
   glyphs sat in a strip of bare ink UNDER the squares, detached from the
   photographs. The DOM was right and the page was wrong. **Fixed:** the glyph
   sits on the square, still in the frame's measured polarity.

5. **The scrubbed signature faded in instead of writing.** It ramped fill across
   each path's whole span, so at 10% progress the mark was already 14% filled
   under a crawling trace. **Fixed:** trace at full stroke, then settle.

6. **The footer's black band is gone**, confirmed. The wash's own 900px of ink
   in a full-page capture is a CAPTURE ARTEFACT, not a defect — verified by
   scrolling the wash at five positions: sticky keeps the layer over the
   viewport throughout and unpins exactly as its bottom meets the section's.

### The favicon, settled

The deployment is **correct**. The live HTML declares only hashed icons and
those files are byte-identical to a local build (sha1 match). A first-time
visitor with no cache gets the current monogram.

**But the old icons are still being served** — by Cloudflare's edge, at the
three deleted fixed paths:

    /apple-touch-icon.png   200, 2447 bytes   the OLD corner-stamped icon
    /icon-512.png           200, 21186 bytes  the OLD stale signature crop
    /favicon.svg            200, 22944 bytes  correct (this file never changed)

    cf-cache-status: HIT    age: 414901 (4.8 days)    s-maxage: 604800 (7 days)

With a query cache-buster all three correctly 404. **This extends section 74's
trap:** `Cache-Control: no-cache` on the REQUEST does not defeat the edge — only
a changed URL does. And the new lesson: **an unhashed path outlives its deletion
by the edge TTL.** Nothing in the current site points at those paths, so a page
visit never fetches them; they are reachable only by something that already
knows the old URL — a home-screen icon installed before s74, an old bookmark, a
cached favicon entry, or a preview bot that probes by convention.

So: the owner is seeing a cache, but "just clear your browser" is not the whole
answer. It self-heals ~2 days after this was measured; purging those three paths
in the Cloudflare dashboard ends it now.

### Proposed, not applied

- **`overlayChrome`, a third measured polarity.** `overlay` is one value for a
  whole photograph, and `overlayCaption` was added in s58 because the caption
  band at the BOTTOM disagreed with it. The top-left corner is a third band and
  has never had its own value. This is the same fix, applied to the band that
  carries the brand's own name.
- **The sizing advice on a Creature's page** is a full sentence set in the LABEL
  register — tracked uppercase at 11px, the hardest thing on the page to read.
  Label is for names, seasons, captions, buttons and the menu.
- **The drop's name appears twice within one screen** in the home page's
  chapters block: on the photograph and again as the link under the statement.

---

## 77. Enter in darkness, buy in light (2026-08-10)

**This is the site's structural argument. Do not undo it by accident.**

### The rule

There are two kinds of page, and which one you are writing decides its polarity.
Nothing else does. Not taste, not the mood of one photograph, not a preference
for white.

**INK — THE WORLD.** home (until the wipe), about, process, new, a drop's own
page. His photography here is atmospheric: dark garments, dim workshops, night
concrete. On ink the pale passages glow and the dark ones fuse with the ground,
so the page reads as one material. Rendered on paper — and it WAS rendered, both
ways, before this was decided — the same frames become heavy blocks punched into
a page and the pale passages dissolve into it.

**PAPER — THE SHOP.** the catalogue, a Creature's page, the whole order flow,
contact, the drops index. His product photography here is shot against PALE
CONCRETE. On ink every tile is a bright rectangle in a black field, and a row
that does not fill leaves a conspicuous void. On paper the concrete blends into
the page, the garments read as objects, and an unfilled row reads as air.

**THE WIPE IS THE BOUNDARY BETWEEN THEM.** That is now its whole job, and it is a
much better job than it had. Before this the wipe happened mid-home-page and
landed on the collections chapters: a beautiful gesture separating two halves of
one page, arbitrarily. Now the home page is the only page that contains both
worlds, so it inverts ONCE, and every link out of its paper half lands on a
paper page. **Nigredo then Albedo stops being a mood on one screen and becomes
the shape of the site.** The drop is called Tenebrae & Lux; the site is now
built the same way.

### What was actually wrong

Only ONE page moved: the catalogue, ink to paper. That single change is the
whole of it, because the incoherence was never a page — it was a JOIN:

    catalogue (ink) -> tap a piece -> the piece (paper) -> Acquire -> order (paper)

**The most-used path in the shop inverted on the first tap into a product, with
no wipe and no reason**, and had done for weeks. The drops index (paper) into a
drop's page (ink) inverted the other way. Nobody chose either; they accumulated,
because the rule had never been written down. It is now written on the `theme`
prop in Base.astro, which is where a future session actually decides a new
page's polarity.

### overlayChrome, and what it does not fix

`overlay` is the polarity of the signature and MENU passing over a photograph.
It was measured ONCE against a phone crop and used at every width. `object-fit:
cover` crops differently at every aspect ratio, so at 1440x900 the chrome sits
over a different part of the file — the same mistake `overlayCaption` was
invented to fix at the BOTTOM of the frame in s58, one band higher up.

`npm run measure-chrome` borrows that fix's method wholesale: simulate the
containers the site actually has, measure the rectangle the mark occupies inside
each, slide a window across it, keep the worst, let the better polarity win.

**29 of 91 photographs disagreed with the phone-measured value.** So the field
earns its place.

**But 68 of 91 sit under 4.5:1 whichever side is chosen.** The bands genuinely
hold both extremes — bright concrete beside a near-black garment, in the same
band, in most of his frames. `overlayChrome` picks the better side; it cannot
make a mark legible on a photograph that has no legible side. The honest options
left are the owner's: different opening photographs, or accepting that the
corner mark is atmosphere rather than signage. **Do not "fix" this by adding a
scrim.** Standing rule 11 has survived everything else.

### THE INCIDENT: a dotted path destroyed four fields

`measure-chrome` wrote its values with `set: {"openingMedia.overlayChrome": v}`.
For an ARRAY item addressed by key — `media[_key=="abc"].overlayChrome` — this
works exactly as documented. **For a plain nested object it REPLACED the whole
object with the string.** `siteSettings.openingMedia`, `aboutOpeningMedia`,
`designerPortrait` and `collection-01.cover` each became `"paper"` or `"ink"`:
poster, alt text, caption placement, all gone. The site then built from
placeholders, and the home page rendered `{OPENING_PHOTOGRAPH}`.

Recovered in full from Sanity's document history
(`/data/history/{dataset}/documents/{id}?time=`), which is the only reason this
cost minutes rather than the owner's content.

**Three things to carry forward:**

1. **Never address a plain nested object by a dotted path in a mutation.** Read
   the object whole, add the property, write it back whole. It cannot lose a
   sibling even if the API disagrees with you. `measure-chrome` now does this.
2. **A build that says "Complete!" is not a build that worked.** The first
   symptom was `[sanity] query failed, using placeholders` scrolling past above
   a green exit code. Grep the OUTPUT for content you expect, not the exit code.
3. **GROQ takes `//` comments only.** A `/* */` block inside a projection is a
   parse error, the query fails, and every page builds from placeholders. That
   is how this was found — and it is a second way to ship a placeholder site
   with a green build.

### What overlayChrome actually achieved, measured

Measured with the browser, worst-case contrast of the corner mark, before and
after, across every page at both widths:

    before   n=100   under 1.5:1 = 48   under 3:1 = 88   median 1.57
    after    n=116   under 1.5:1 = 48   under 3:1 = 98   median 1.82

**The median improved and the count got worse.** That is not a contradiction and
it is not a bug: the field picks the polarity with the best WORST case across
every container the site has, and the harness samples one container — the top of
the page. Optimising for the worst case across six containers can be worse in
the one you happen to look at.

**So it is not a fix, and it should not be recorded as one.** What it is:

- a correct MODEL where there was a wrong one (measured at every width instead
  of at a phone's, which was simply an error),
- 29 photographs moved off a demonstrably wrong side,
- and a per-frame control the owner can override in the studio.

The residual is photographic, not technical. Looked at with my own eyes at 390
after the change: the mark is still white on pale concrete on the pages that
failed worst. **Nothing in code will fix that.** The options are the owner's:
different opening frames, or accepting the corner mark as atmosphere rather than
signage. Do not reach for a scrim.

---

## 78. What a first-time iPhone visitor actually got (2026-08-10)

The owner kept seeing the old icon **in a private window on iOS Safari**, which
has no cache of its own to blame. The deployed HTML was verified correct in s76,
so something in the chain was untrue in practice. It was.

### Verified as a browser resolves it, not as a fetch does

WebKit (the real Safari engine) and Chromium, cold profiles, against the live
deployment, both languages and `/`:

- **The heads are identical and correct** in `it` and `en`: a hashed SVG
  `rel=icon`, a hashed `apple-touch-icon`, and the manifest.
- **No unhashed icon reference exists anywhere** — not in the live pages, not in
  any of the 85 built pages.
- **The manifest is correct** and both of its icon URLs resolve 200.
- Headless engines do not fetch tab favicons, so the displayed icon could not be
  observed directly. That is stated rather than glossed.

### What the conventional paths were actually serving

    /favicon.ico                      404, content-type: text/html, 49,969 bytes
    /favicon.svg                      200  cf-cache-status: HIT  age: 423368
    /apple-touch-icon.png             200  cf-cache-status: HIT  age: 423368
    /icon-512.png                     200  cf-cache-status: HIT  age: 423368
    /apple-touch-icon-precomposed.png 404

With a query cache-buster **all of them 404** — the origin is correct. So:
**Cloudflare's edge was serving files deleted in s74**, under a seven-day
`s-maxage`, 4.9 days into it. The bytes at `/apple-touch-icon.png` were fetched
and looked at: **the broken corner-stamped icon from before the s74 fix** — a
tiny AC in the top-left of a white square.

**That is what the owner was seeing, and it is not his cache.** The edge sits
upstream of his device; a private window changes nothing about it. And
`/favicon.ico` — the one path every browser has always probed — was answering
with 50KB of the site's own 404 page.

### The judgement, which is the part worth keeping

**Deleting the conventional paths was right for correctness and wrong for how
browsers behave.** s74's fear was real: a fixed path can go stale invisibly. But
deleting it does not remove the URL from the internet — it hands that URL to
whatever cache still holds it, which is strictly worse than serving a correct
file there.

So the site now ships **both shapes, from one source**:

    src/assets/icons/*   imported, content-hashed — what the document declares
    public/*             favicon.ico, favicon.svg, apple-touch-icon.png,
                         apple-touch-icon-precomposed.png, icon-512.png

`npm run icons` writes both and `--check` compares both, so the fixed paths
**cannot** go stale invisibly — which was the only real objection to them.
`/favicon.ico` is a genuine ICO (16/32/48, PNG payloads, container written in
the script rather than adding a dependency) and is declared FIRST, before the
SVG, so anything that understands SVG still prefers it on type and anything that
does not now has a real file to find. `public/_headers` gives every unhashed
icon path a **one-hour** shared cache instead of the host's default week: long
enough to cost nothing, short enough that a mistake at a fixed path is an hour's
problem rather than a week's.

**Do not delete these again.** The reason to delete them is correct and the
consequence is worse.

### Amendment to section 77: the drops index is INK

s77's approved assignment put `/collections` on paper with the shop. Walking the
site showed that was wrong **by s77's own rule**: the drops index inverted into a
drop's page on a tap, which is precisely the fault the catalogue move had just
fixed on the other side.

Asked properly — which of the two things is this page? — **a drops index is a
table of contents for the world.** Its cards carry his announcement and lead
into a chapter; nobody buys there. The piece count is the only shop-shaped fact
on it, and a count describes a chapter as readily as a shelf.

So it is ink, index and drop agree, and the boundary stays where the wipe is.
This is an amendment with a reason, not drift: the rule did not change, one
page's answer to it did.

---

## 79. The polarity, put the other way round — EVALUATED, NOT APPLIED (2026-08-11)

The owner asked for the home page to open **white and turn black below** — the
opposite of s77's arrangement. This section records the evaluation. **Nothing
was applied.** The site as committed is still s77: home ink, wipe, paper below.

### It does not touch the rule at all

This is the first thing to understand, and it is why the request is not the
reversal it looks like. s77's rule is **ink is the world, paper is the shop.**
His request changes only **which half of the home page comes first**. Under it:

    home top (arrival, the work, worn, the making, Instagram, list) -> PAPER
    the wipe                                                        -> paper into ink
    home bottom (the drop chapters)                                 -> INK
    everything else on the site                                     -> UNCHANGED

The shop stays paper. The world stays ink. Nothing else moves.

### And by the measure that justified the catalogue move, HIS IS BETTER

s77's argument for moving the catalogue was that a link should not invert into
its destination. Applying the same test to the home page's own outbound links:

    CURRENT (ink above the wipe)      2 agree, 6 invert
    HIS     (paper above the wipe)    6 agree, 2 invert

Exactly the mirror. The reason is structural: the home page's top half is where
almost all the SHOP links are — the arrival's "all Creature" and the worn band's
four tiles, every one of them landing on a paper page — while the bottom half is
the chapters block, whose only link is into a drop, which is ink. **The top of
the home page is where a reader enters the shop and the bottom is where they
enter the world**, and his arrangement puts each on its own ground.

Rendered both ways at 390 and looked at. His reads well: the white ground under
the arrival is clean, the text blocks are black on white, and the making
photographs — dark hide, cardboard, fur on a mannequin — hold their edges
because they all contain pale concrete. This was the outcome I expected to argue
against and did not find.

### What it costs, exactly

**One thing, and it is his to spend.** The wipe would run Albedo → Nigredo:
light into darkness, backwards from the order named in his own drop statement
(Nigredo the blackening, then Albedo the whitening — s22 set the wipe's
direction from that text). The boundary meaning survives untouched; only the
sequence inverts.

It is worth weighing that s22 also recorded the resonance as private: *"Nothing
is added and nothing says so. If a reader feels it, good; if not, the page is
still a page that inverts once."* Nobody is ever told the order. So the cost is
a private alignment, against a measurable gain in link coherence.

### The reading

**His arrangement is coherent, it is compatible with s77's rule, and on the one
measurable criterion it is better than what is committed.** It should be adopted
if he is content to reverse the alchemical order in his own symbolism — which is
his to decide, exactly as reversing s9's no-monogram rule was.

The honest summary for him: *this is not a preference against the structure, it
is a better fit to it, and it costs one private reading of the wipe.*

**If it is adopted**, four things change and nothing else:
`theme`/`footerTheme` on the home page, the wash's `from`/`to`, and the two
chapter surfaces below the wipe. The tagline in the handoff becomes wrong and
would need rewriting; the rule under it does not.

---

## 80. Rubedo returns, the polarity turns over, and a screenshot became the cover (2026-08-11)

### Rubedo is a Creature again

The owner is content having it in the catalogue even though he cannot remake it
in that hide: it has a name, photographs and a place in the work. It returns as
**`unique`** — the state built for a piece that EXISTS and CANNOT BE REPEATED.
That puts it in the "1 of 1" movement, gives it the buy action, and never offers
a remake (s67). It was `privateOrder` before, which means already somebody
else's and carries no action at all; that is a different fact.

It came back through the one flag the removal left behind
(`RED_SHIRT_IS_A_CREATURE`), exactly as s50 promised. **All seven photographs
returned.** The dry run reported five as missing and none of them was: the
OBLIVION folder left the Drive on 2026-08-04 and its contents moved into ARCHIVE
SOLD OUT, so the keys pointed at a dead folder. The tool said *"the file moved
(fix the key)"* and it was right.

The band's first frame is a photograph OF Rubedo, so with Rubedo back it finally
links to the piece it shows. The band exists to lead into the work and its first
tile is the one most likely to be tapped; it led nowhere for as long as Rubedo
was out.

### The polarity turned over — s77's rule survives intact

The home page is now **paper above the wipe, ink below**. The owner accepts the
Albedo → Nigredo order as a known cost.

**The rule did not change.** Ink is the world, paper is the shop. What changed is
which half of the home page comes first, and by the site's own measure — a link
should not invert into its destination — this is the better arrangement:

    the old way (ink above)      2 links agree, 6 invert
    this way    (paper above)    6 agree, 2 invert

The top half is where the shop is entered: the arrival's "all Creature" and the
worn band's five tiles, every one landing on paper. The bottom half is the
chapters block, whose only link goes into a drop, which is ink. **The reversal
fits the rule better than the arrangement it replaces.**

### A SCREENSHOT OF ANOTHER WEBSITE BECAME THE DROP'S COVER

The worst thing in this session, and it arrived in complete silence.

The cover's key was `homepage/HOMEPAGE`, which had resolved for a week to a
4284x5712 detail of pale leather. A **2360x1640 file called HOMEPAGE.JPG** then
appeared in that folder — **a screenshot of the owner's other shop**, two phone
frames side by side, menu and cart visible — and the import resolved the key to
it and made it the drop's cover.

**Nothing complained, and nothing could have.** It is a valid image at a valid
key. The alt text comes from the plan and did not change, so the page still
claimed to show a leather detail. The build was green, `verify-build` passed
(there were plenty of photographs), and the audit reported nothing, because a
screenshot of a website is a perfectly legible photograph. It was found by
looking at the rendered page.

**The Drive is READ ONLY to us and it is not under our control.** A key is only
as stable as the folder behind it, and the owner adds files to his own folders.
Two things now stand against it:

1. **The cover is pinned to its asset** (`salvage/monumentus-cover`), not
   resolved by folder. A frame that matters more than its filename should be.
2. **The import says what it UPLOADED**, every run, and asks you to recognise
   each one. An upload is the exact moment a key starts pointing somewhere new:
   a photograph already in the dataset is matched by sha1 and never uploaded
   twice, so a new upload for an old key IS the event. Three lines of output
   would have caught this instantly.

The screenshot is still on his Drive at `homepage/HOMEPAGE.JPG` and its asset is
still in the dataset, unused. **Ask him to take the file off the Drive**; do not
delete his files.

### The import silently wiped overlayChrome, and now cannot

`createOrReplace` writes what the plan knows and drops what it does not.
`overlayChrome` (s77) is measured by a different tool with a different model, so
it is not in the import — and the first import after it existed erased all 91
values without a word. The site fell back to `overlay`, the wrong band, and
nothing anywhere would have said so.

`npm run measure-chrome -- --write` is now **chained to the end of every
non-dry import**. Same class as the stale-document sweep: this script owns the
shape of these documents, so it owns everything the shape carries.

### Two smaller things

- **The Instagram squares declared `sizes="100vw"`** and so asked for a 1440px
  source to render at most 416 — the s69 trap exactly, a `sizes` that lies with
  nothing to flag it. They now declare `(min-width: 48rem) 26rem, 72vw`.
- **The strip fills its row at any count** (`flex: 1 0`, a 26rem ceiling, and
  `justify-content: safe center` — `safe` because a centred overflowing flex row
  can strand its first item out of scroll reach; verified in Chromium and WebKit
  at 390/768/1440).

---

## 81. The desktop nobody had composed, and what a link looks like (2026-08-11)

### The text column was pinned to the left edge

`--margin` grows at 8vw while a line of prose stays at its measure, so past
about 900px the column stopped moving and every extra pixel of screen landed on
the right. **At 1920 a paragraph occupied x=214..847 and the remaining 56% of
the screen was dead.** The site had been composed on a phone and desktop had
never been looked at.

**Widening the column is not the answer.** 40rem is already the top of a
readable measure; more characters per line is worse prose, and a larger size
would add a fifth type voice. So **the column moves instead**:

    --spine-x: max(var(--margin), calc((100vw - 40rem) / 2 - var(--s-u5)))

`max()` keeps today's behaviour wherever the margin is the larger number — every
width below roughly 900px — and there is no breakpoint to snap at, because the
two expressions cross over smoothly.

**The spine travels with it**, because `--spine-x` is what `--content-x` is
built from and what `Spine` draws at. That is why this works rather than merely
centring something: the identity is *text hangs off a vertical line*, not *text
sits at the left edge*, so carrying the line along keeps the composition intact
while placing it. `frame`'s right padding moved from `--margin` to `--spine-x`
for the same reason — a column whose left travels and whose right does not is
centred on one side only.

**The chrome does not follow.** Rendered both ways at 1920: the signature adrift
on the text's axis reads as a mistake, and in the corner it reads as chrome. It
is corner furniture (s21) and stays at `--margin`. They are different things and
may sit at different places.

    1440   spine 115 -> 340    prose 400..1040,  400 either side
    1920   spine 154 -> 580    prose 640..1280,  640 either side
    2560   spine 160 -> 900    prose 960..1600,  960 either side

**What the references say.** Three of the four barely have running prose at all
— Rick Owens is labels, Sorcinelli is one statement on one viewport, Ferdressed
is one tracked line over a hero. Only Sellam has a prose block and it CENTRES
it. So there was no reference for a left-pinned column at desktop; there never
had been.

### Nothing showed what was a link

`THE WORK`, `ABOUT`, `WORN`, `ALL CREATURE`, `DROPS` were set identically —
`type-label`, uppercase, same size — and some were section headings while others
were navigation. The only difference was a hover underline, which does not exist
on a phone. **A reader could not tell which words did anything.** That is a
functional failure, not a stylistic one.

**The rule now: a link on a TEXT SURFACE carries the resting hairline; a heading
never does.** `hairline-under` already existed for the buy action — the site's
one mark, a rule under a thing you can act on — so this coins nothing and simply
extends what an action already looks like to everything that acts.

Two exclusions, and they are the whole defence against a page of decorated
words:

- **The menu.** Everything in it is a link, so there is nothing to
  disambiguate, and ruling every item would make it a list.
- **Media captions.** The frame is the link there; a photograph you can tap is
  already understood, and a rule on his photography is a rule on his
  photography.

### The process page had no words

It carried the formula, his three lines about the making, and then eight
photographs. A reader was shown the work and never told what they were looking
at.

`processText` is a new site-settings field, **ours and flagged**, so it counts
against `launch-check` like every other sentence written on his behalf (now 34).
It names the five stages his own studio field already lists — cartamodello,
taglio, tintura, asciugatura, montaggio — in his register, and claims nothing he
has not said. When he writes his own account it replaces this and the flag comes
off.

**One paragraph, deliberately.** Four short lines tells a reader what they are
looking at; a line per photograph would be a caption gallery, which is what this
page has always refused to be.

---

## 82. Composed with the photography, not sequenced between it (2026-08-11)

### The finding that made the fix obvious

The desktop text pages were wrong twice: pinned left they read as an
afterthought, and centred — the previous session's attempt — they put a
hairline in the middle of an empty screen with a dead zone either side. Both
attempts were spacing values. The problem was not spacing.

**The four references were re-measured for RUNNING PROSE specifically**, in a
browser, at 1440, counting every text run over 120 characters:

    Rick Owens    NO brand prose on the home page. Its only long run is the
                  cookie banner.
    Sorcinelli    the same. Its long runs are the cookie banner. One 22px
                  statement, over a full-screen slideshow.
    Sellam        ONE block: 396 characters, 17.9px, CENTRED, tucked directly
                  under a full-bleed photograph with about 60px of air.
    Ferdressed    NO brand prose. Its long runs are shipping and returns policy.

**A column of words alone on flat ground appears nowhere in any of them.** Text
is over a photograph, hard against one, or a single short line holding a screen.
This site is the only one of the five with screens of prose, because the owner
writes discursive paragraphs and the others write labels.

So the sections were **sequenced between photographs when they should have been
composed with them**.

### The paired surface

`PairedSurface` gives a photograph one half of a full screen and the passage the
other, alternating sides down a page. On a phone **nothing changes**: the
photograph is a frame and the text is a surface under it, the stack that always
worked. This is a desktop composition, not a new layout.

The measure comes for free: half of 1440 less its padding is about 560px, inside
the readable band with no cap. And the passage is never alone.

Applied to the three pages that had screens of text: **about** (each paragraph
with its photograph — they already alternated, they were merely stacked),
**home** (THE WORK and THE MAKING, with the two making frames), **process** (his
making statement and the stages text).

Two things it forced:

- **`Statement` gained a `bare` mode.** Inside a pairing the passage already has
  its half, its padding and its measure; wrapping it in a second text surface
  applied the page margin inside a 720px column and squeezed the prose to three
  words a line. It did exactly that on the first attempt.
- **`makingMedia` is a SUBSET of `processMedia`**, so pairing on the first
  frames put the same photograph at the head of a composition on two pages.
  Process now anchors on frames home does not use; the mosaic still shows
  everything.

### WHICH PASSAGES MUST BE COMPOSED, AND WHICH MAY HOLD A SCREEN

The rule, and it is already encoded in the register a passage is set in:

- **`register="body"` — running prose.** Must be composed with a photograph.
  This is the case with no precedent anywhere in the references, and the one
  that produced the dead screens.
- **`register="statement"` — a short held line, uppercase, at the display size.**
  May hold a screen on its own. **Sorcinelli's entire home page is this**: one
  22px statement and four nav words, and the study called it the single
  strongest emptiness any reference shows.

So `/new` and a drop's own page are left alone deliberately: their drop
statement is three short declamatory lines in the statement register, directly
under a full-bleed cover. That is the held moment, not the dead screen, and the
difference is not a judgement call — it is which register the passage is in.

If a future session sets a long discursive passage in the statement register to
make it "hold" a screen, it will be shouting rather than holding; section 22
settled that and it has not changed.

### The spine is a margin rule, and that is now a decision

It sits at the margin, at every width, and **it does not travel**. Making it
move toward the centre was wrong in a way worth recording: a hairline in the
middle of an empty screen is neither a margin nor a structure, it is a divider
between two dead zones. **A line means something only as the edge of
something.** On a paired surface it is not drawn at all — the seam where the
photograph meets the passage is already a real edge, and two lines saying one
thing is one line too many.

### The vertical rhythm fixed itself

Measured after, at 1440: **the about page has no blank run over 420px anywhere**,
and the home page's screen-and-a-half between ABOUT and WORN is gone. Not a
spacing value — the composition closed it, which is the right kind of fix.

The one long blank left in a full-page capture is the passage's sticky
remainder, which a reader never sees.

### EVERY PAGE IS PAPER, and what happened to the wipe

The owner decided it, having read what it costs. Twenty-five `theme="dark"`
declarations gone across six pages.

**The inversion is gone, not disabled.** An edge travelling down a screen that
looks the same on both sides of it is not a quiet gesture, it is nothing, and a
gesture that no longer means anything is worse than no gesture. The two stacked
layers, the clip-path and the polarity props are all removed.

**What the home page's structural moment is now:** the same held screen at the
same boundary, and crossing it means **writing the brand's name with your own
scroll**. The mark was decorative on top of the inversion; it is now the whole
event.

That is a better fit for this site than the inversion was. The colour change
said *you are somewhere else now* in the site's voice. The writing says it in
HIS — it is his signature, his hand, the one thing on the site that is literally
him, and it is the effect he likes most. **The boundary did not lose its
meaning; it changed who speaks at it.**

What is lost, and should be said plainly rather than explained away: ink and
paper are no longer two halves of an argument, and Tenebrae and Lux are now
words in his statement rather than something the site performs. That was the
price, he was told it, and he paid it.

## 83. The loop that can play, and what to shoot (2026-08-11)

### The claim that was not true

The media object has carried an optional muted loop since the schema was
written, and this plan has said since section 6 that **video drops in without a
rebuild**. It could not. The query projected `"hasVideo": defined(video.asset)`
— a BOOLEAN — so the file's URL never reached the page and nothing could ever
render it. A year of a promise resting on a field that answered the wrong
question, which is section 80's shape once more.

The URL is projected now and `MediaSurface` renders the loop over its own
poster. The boolean is gone rather than kept alongside: two ways to ask the same
question is how the answers drift apart.

### Every guarantee sits on the poster, not on the video

- The poster is both the `poster` attribute AND the `<img>` beneath, so a
  failed, blocked or still-loading video is invisible rather than a black box.
- `preload="none"`. Asset bandwidth is the one thing capable of straining the
  free plan (standing rule 12); a loop fetches when it plays and not before.
- It plays only while on screen and pauses when it leaves. A page of loops must
  never be a page of open decoders on a phone.
- **Reduced motion gets the STILL, not a paused video.** The element is
  `display: none` and the `<img>` beneath is what a reader sees. A loop is
  motion by definition; there is no reduced version of one.
- Muted, looped, `playsinline`, no controls, `aria-hidden`, out of the tab
  order. It is a moving photograph, not a player, and it must never take over an
  iPhone's screen.

Zero `<video>` elements are in the build today. The moment a file is uploaded
into any media object, that frame becomes a loop with no code change.

### THE THREE PLACES IT BELONGS

Ordered by how much the motion earns. Nothing else on the site should carry one.

1. **THE ARRIVAL** (`openingMedia`, the home page's first screen).
   **6–10 seconds, seamless, locked off.** What it must show is the MATERIAL
   alive: leather turning under light, a garment breathing on a body, not a
   camera move. First and last frame identical or the loop announces itself.
   This is the one place a loop competes with the largest image on the site, so
   it is also the one with the hardest ceiling: **under 2 MB.** The still stays
   the LCP element and must remain a complete arrival on its own.
2. **/process, THE MAKING** (`processMedia`). **4–8 seconds each, at most TWO on
   the page.** This is where motion carries the most meaning on this site: the
   needle pulled through, dye entering leather, the brush. Close framing, no
   camera movement, one continuous action, no cuts. "Handmade" is a claim the
   site currently asks a reader to take on faith; a hand working is the only
   evidence for it that a still cannot give.
3. **A CREATURE'S SECOND FRAME** — never the first, which is the LCP element.
   **4–6 seconds, one per piece at most.** What it must show is DRAPE AND
   WEIGHT: how the piece moves on a body. That is precisely the question a buyer
   sending three body measurements cannot answer from a still, and it is the
   same gap section 84 refuses to fill with interface.

**Where video must NOT go, and each is a cost, not a taste:**

- **The catalogue tiles.** Seventeen loops on one screen is the transfer that
  produced a 1.8 MB catalogue and an 8.7s LCP on Slow 4G in section 69, with
  decoders instead of images.
- **The Instagram squares.** They are a recognition mark, not a feed, and a
  moving one imitates the embed this site refused (section 62).
- **The worn band.** A horizontal drag region playing video is the phone frame
  budget spent on the one gesture that must stay smooth.
- **The order flow.** A person entering body measurements needs no motion.

### The encoding, exactly

    MP4, h.264, yuv420p, no audio track at all (not merely muted)
    <= 1920 on the long edge, CRF ~23, under 3 MB, 4-10 seconds
    first frame IDENTICAL to the poster image

No audio track is not fussiness: it is bytes nobody hears, and an absent track
is one less thing an autoplay policy can object to.

### THE TRAP NOBODY WILL SEE COMING

**The overlay polarities are measured on the POSTER, and the loop is what a
reader is looking at.** `overlay`, `overlayChrome` and `overlayCaption` decide
whether the signature, the MENU and the caption are black or white over that
frame, and `npm run measure-chrome` measures a still. If the loop drifts — a
dark garment moving out of the top band, a light crossing pale concrete — the
brand's own name can go invisible for four of the ten seconds, on a frame whose
measured value is correct and whose audit is green.

So: **the loop must keep the same luminance under the top band and the caption
band as its poster does, for its whole length.** That is a shooting constraint,
which is why it is written here rather than left to a check. There is no check
that can catch it, for the same reason section 5's first trap has none.

### The bandwidth, said plainly

Sanity's free tier serves these assets. One 3 MB loop on the arrival, watched by
a thousand visitors, is 3 GB. Three loops on a page a visitor scrolls all of is
the same page weight as roughly thirty photographs. That is the whole reason for
the ceilings above, and it is standing rule 12 in practice.

## 84. Four proposals judged, and what the site was hiding (2026-08-11)

### The failure that opened the session, and the fix that outlives it

Four open proposals existed only in a chat message. A fresh session read the
handoff, found no proposals in it, and was right — they had never been written
down. **Section 9 exists so that cannot happen again**, and every decision
below is recorded there rather than here.

The same disease in slower motion: section 82 removed page polarity, and the
handoff's front page, the `theme` prop the handoff points a new session at, and
three comments on the home page all went on arguing ENTER IN DARKNESS, BUY IN
LIGHT to whoever read them next. All rewritten. **A wrong comment compiles**,
which is why nothing caught it.

### 1. DETAIL POINTS ON THE PHOTOGRAPHY — refused, and the need is real

The proposal: Mammut's interactive construction points, tapped on a product
photograph. The need it answers is named repeatedly in this file and is the
single most valuable observation in the request — **his photographs are
atmosphere, and a buyer cannot see the cut.** The evidence exists in his own
words: five hundred handmade scar-stitches, Oblivion's hole in the back, the
semicircular raw cut, the choker's waxed lacing.

**Four reasons the FORM fails on this site.**

1. **It is interface on his photography, which is the one thing this site has
   never allowed.** Three things may sit on a frame — a caption, the fixed
   chrome, and the Instagram glyph — and each takes a polarity MEASURED for that
   frame. A point cannot: it must be legible against pixels nobody measured, at
   a coordinate nobody measured. The worn band's brief says it in four words:
   **no arrows and no dots.**
2. **The constraints collapse it into something else.** No JavaScript and no
   hover leaves a checkbox toggling a panel through `:has()`, with 44px tap
   targets scattered across a garment. That is not a detail point; it is a
   widget wearing one, and it is exactly the decoration the request forbids.
3. **It bills the owner for the launch he is already blocking.** Each point is a
   coordinate pair and a sentence, in two languages, per frame, across seventeen
   Creature — from the person who has not yet supplied prices, compositions or
   measurements. If we write them instead, they are invented copy, they must be
   flagged, and `launch-check` refuses while any flag is set. It would make the
   gate HARDER to pass in exchange for evidence he can give in one line.
4. **The site already has the mechanism, and it has never once been used.**
   Every media object carries a `caption`, rendered in the frame's own measured
   polarity, placed over the photograph or under it by his own per-image choice.
   Counted in the live dataset on 2026-08-11: **fifty-six Creature frames, ZERO
   captions. Every process frame, ZERO captions.** (The five labels a reader
   sees on the home page are garment NAMES the worn band passes in, not
   captions.) The thing being asked for exists, ships, and is empty.

**So the answer is not a feature, it is three photographs.** Three or four
detail frames per piece — the stitch, the hole, the raw cut, the lacing — each
carrying one line of HIS words in the caption field. It renders today with no
code, in his voice, in the register the site already reads in, with nothing laid
on top of the picture. It is on THE OPEN LIST as content he owes, not as a build.

One note on the reference, because it matters: Mammut sells technical equipment
where a seam IS a specification. This brand's claim is the opposite of a
specification — it is a hand. A hand is shown, not annotated.

### 2. PHOTOGRAPHS THAT EXPAND AS THEY ENTER — not built, against the owner's wish

He wants it, and the instinct that it belongs on a Creature's page is the right
instinct. It still cannot go there, for a reason that is mechanical rather than
aesthetic.

**The moment that matters on a Creature's page is the first frame, and the first
frame is the one image on the page that must never animate.** It is the LCP
element; the reveal has excluded it since section 24 because *an arrival that
arrives late is not an arrival*. Every frame after it is the SAME PIECE
CONTINUING. Expanding those says "arriving" about something that already
arrived, three to six times down one page — which is the definition of the tic
the request was worried about, on the page with the most frames on the site.

Two smaller costs, recorded so the case is complete: scale on a full-bleed
photograph animates the largest paint on the page, which is the frame budget the
24px rise deliberately avoids; and section 24 already refused it in one line
that has not aged — **scaling a photograph is a zoom, and a zoom is a
slideshow.**

**What he actually likes about it, he already has**: a presence arriving, once,
on one curve — and the site's one true performed arrival, the signature written
by his reader's own scroll at the boundary. If a Creature's page needs more
arrival, the answer is a detail frame, not a bigger movement.

**This is the one refusal here that runs against the owner's stated wish, so it
stays on THE OPEN LIST as his to overturn rather than closed.**

### 3. /PROCESS AS A SCROLL-DRIVEN SEQUENCE — refused, and it found a real fault

Scroll-driving is refused for the reason section 79 refused the splash screen,
and the argument is the same one with different numbers: **the reader's scroll
is not ours to spend.** Pinning eight frames holds decoded full-bleed images in
composited layers on a page that already carries twenty-three photographs, on a
phone, for a gesture that adds no information.

**But the observation underneath it is correct, and the page IS hiding its
narrative.** The eight process frames are a sequence — pattern, cut, dye, dry,
build — and section 65's weave deals up to two unrelated artistic frames BETWEEN
each of them. So the order exists in the data and is unreadable on the page:
pattern, two artistic frames, cut, two artistic frames, dye.

Two ways to make it legible, both cheap, and **both reopen section 65, so both
are the owner's**:

- **(a) Unweave.** The eight making frames run consecutively; the artistic
  frames follow as a coda. The narrative becomes readable by ORDER alone — no
  captions, no words, no motion, nothing added. About ten lines in
  `process.astro`, reversible in one commit. Nothing is removed: every artistic
  frame still appears.
- **(b) Name the stages.** Five words in the caption field, one per stage frame.
  This makes the narrative explicit rather than merely readable — and it puts
  words on the one page that has refused captions since it was built, and they
  would be OURS until he approves them, which means flagged and blocking the
  launch gate.

**Recommended: (a) alone, if he wants it.** It costs nothing and takes nothing
away. It is item 9 on THE OPEN LIST.

### 4. VIDEO — specified in section 83

Three places, three lengths, the encoding, what it must never go on, and the
trap where a drifting loop makes the brand's own name invisible under a chrome
polarity measured from a still. The player itself already shipped; the plan had
claimed for a year that it had.

### WHAT THE SITE WAS HIDING, found while judging the four

**An empty caption was opening a hole between photographs on the shop's most
important page.** `Astro.slots.has("default")` is true when children were
PASSED, not when they render anything, and a Creature page passes
`{index === 0 && (...)}` to every frame. So every frame after the first rendered
an empty `<figcaption>` — in the "below" placement, `frame py-u3`, roughly 50 to
70px of blank paper between two full-bleed photographs. **Thirty-three of them
in the English build alone**, valid markup, no content, no check that could ever
see it. Fixed by rendering the slot and asking whether it produced anything;
verified at zero in the build and by looking at the page.

**The prose on a phone had lost the spine.** Section 82 correctly stopped
drawing it beside a paired surface, because the seam where the photograph meets
the passage is already a real edge. Below 64rem there IS no seam — the passage
stacks under the photograph at full width — so on a phone the about page's
entire story, and both of home's passages, were the only text on the site with
no spine, while the newsletter and the chapter headings below them kept it. A
line that stops and starts for no reason a reader can see. Drawn at the stack,
dropped at the seam. A passage with NO photograph had none at either width; it
has one now.

**Mono is on the hero, and the comment said it was not.** The home arrival
prints `priceFrom` in mono and every Creature page prints its price in mono over
the opening photograph, so the 37KB mono file is fetched during the arrival on
the two most-entered pages. Deliberately still not preloaded: on the Slow 4G
profile the photograph is the long pole at 3512ms, `font-display: swap` costs
one re-set of a short line, and a second preload would put 37KB in front of the
only image that must not be delayed. Recorded here so the next session measures
rather than guesses.

**Two things that outlived their decision were deleted**: `--ease-inversion`,
the curve the page inversion travelled on, and `hasVideo`, the boolean that
could not render a video. **Two were kept and flagged rather than deleted**:
`footerTheme`, unused since every page became paper, and `height="band"` with
its `--media-h-band` token, unused since the home page was rebuilt. Both are
noted at their definitions with the instruction to delete them if they are still
unused when the next hand passes through.

### Judged against what wins in this category

The request named three things: art direction where the static frames look
deliberate, motion that carries meaning rather than existing, and performance on
real devices.

- **Art direction.** The frames are deliberate — polarity measured per band per
  image, the tile at the photograph's own 3:4 rather than a viewport height, the
  paired composition of section 82. The weakness is not the layout and cannot be
  fixed in the layout: it is that the photography is atmosphere rather than
  evidence. That is item 7 on THE OPEN LIST, and it is content.
- **Motion.** Three gestures, all on one curve, each happening once: the
  photograph's reveal, a line drawn by a pointer, and the signature written by
  the reader at the boundary. Nothing loops, nothing repeats, nothing bounces,
  and every one of them degrades to nothing under reduced motion or with
  JavaScript off. **The risk in this category is adding a fourth**, which is
  what proposal 2 would have been.
- **Performance.** Measured on this build: **zero JavaScript bundles** — no
  framework runtime at all — one 27KB stylesheet (6.9KB gzipped) shared by every
  page, and 4KB of inline script on the heaviest page. A Creature page is 13.5KB
  of gzipped HTML. What remains is the two fonts and the photographs, which is
  the right place for the weight to be.

The fifteen contrast faults the harness reports are the known caption-polarity
defect, unchanged: it is the first item under MINE TO DO in the checklist and
needs a schema field, an import change and a re-import.

## 85. The making unwoven, and section 65 partly reopened (2026-08-11)

**Decided by the OWNER**, on the finding rather than on the proposal: the
narrative existed in the data and was unreadable on the page.

### What section 65 got right, and the one thing it did not

s65 dissolved the gallery into /process, so photographs-as-photographs live on
one page and products live only in the shop. **That is untouched and remains
correct.** What it also did was DEAL the fifteen artistic frames into the gaps
between the eight process frames, evenly, two per gap.

The eight process frames are not a set. They are a SEQUENCE — pattern, cut, dye,
dry, build, the parts, the finished garments — and the weave put two unrelated
photographs between every stage of it:

    pattern . artistic . artistic . cut . artistic . artistic . dye . ...

So the page carried a narrative it made impossible to read, and the paragraph
above it named five stages a reader then could not find. This was uncovered by a
proposal to make the page a scroll-driven sequence, which was refused (section
84): **the page did not need a mechanism, it needed its own order back.**

### What it is now

Eight making frames CONSECUTIVE, in work order, followed by the artistic frames
as a CODA in their own order — the gallery's dark-to-light descent. Nothing is
removed and nothing is added: no captions, no words, no motion, no scroll
trickery. The story is told by sequence alone, which is the only way this page
has ever been willing to tell anything.

The stages paragraph now sits directly above the eight frames it describes, with
nothing between them. That was luck rather than design, and it is the clearest
sign the weave was the fault.

### The one thing this forced, and it matters

**The composition anchors now come out of the coda, not out of the work.** A
paired surface LIFTS its photograph out of the descending sequence and shows it
at the top of the page, so anchoring on a making frame would punch a hole in the
narrative just restored — pattern, cut, then dye missing because it is upstairs
beside a paragraph.

So the two anchors are taken from the ARTISTIC frames, which are a descent
rather than a sequence and lose nothing by giving up two. Section 82's rule is
satisfied for free: an artistic frame is never in `makingMedia`, so no
photograph heads a composition on two pages. Falls back to any frame home does
not use, then to the sequence itself, so a dataset with no artistic frames still
renders a composed page.

Verified in the built HTML, in the owner's own order:

    anchor (gallery) . anchor (gallery) . process 0..7 in order . gallery coda

### What is NOT reopened

The gallery stays dissolved. Imagery stays on /process. Products stay in the
shop. **Only the interleaving is undone** — two sequences that each mean
something in their own order and mean nothing shuffled together.

### And the page still says nothing

Naming the five stages under the five frames was costed in section 84 and NOT
done. It would put words on the one page that has refused captions since it was
built, and they would be ours until he approved them. The order does the work.

## 86. What the photographs already contain, and the rule we wrote too early (2026-08-11)

Two things were reconsidered on the owner's instruction. Neither is built; both
are measured, and the renders are in an artifact he has.

### The detail photographs mostly already exist

Section 84 answered the detail-points proposal with "three new photographs per
piece, shot by him". That was right in principle and half wrong in practice, and
the way to find out was to LOOK at the files rather than to assume.

Every frame in the live dataset was read at full resolution — **83 frames**
across seventeen Creature, the arrival, the making sequence, about and the
archive — against one mechanical test: a crop is real only if it lands at
**1200px or more on its long edge**, which is the size of the smallest frames
the site already publishes full-bleed today. That threshold decides the zoom: a
1200px crop is 40% of a 3024px frame, and 71% of a 1680px one.

    41 frames  croppable to a genuine detail (>= 2400px wide)
     8 frames  marginal (1700-2399px: a "crop" is 70% of the frame)
    34 frames  too small — these are the ones he must shoot

**Twelve crops were cut and looked at**, all at or above the floor: Rubedo's
scar-stitch (1360x1612), his handwriting inside Rubedo's collar (nobody had
noticed it was in the file), the Oblivion hole on the back, three raw hems,
Capo-02's back seams and snaps, Capo-10's welt zips, Capo-05's exposed zip,
Capo-13's let-in panel, Capo-12's wrapped collar, Capo-01's collar.

Eight pieces can be covered by cropping. Eight need him: **styrax** (the choker),
**styrax-red** (the waxed lacing), **glovyes**, **capo-09**, **severya**,
**capo-07**, **capo-04**, **capo-14**. Every one of those is a piece whose frames
came in at 1200-1690px — the Instagram-sized and salvaged files of section 47.

**And the finding under the finding:** several frames ARE already detail
photographs — Ghezard's zip fills its own frame, Capo-02's seams are close-ups,
the archive holds a hand-signed label — published full-bleed today with nothing
written under them. **The gap was never the picture. It is the sentence.**

`docs/SCATTI-DETTAGLIO.md` stands, halved: crop what exists, shoot the eight.

### The mark over photography, and the rule that is actually costing us

The audit re-run across 89 routes at both widths: **152 faults, every one of them
text on a photograph** — no overflow, no spill, no band, no DOM contrast fault
anywhere on the site. **118 of the 152 are the brand's own mark.** Separately,
`measure-chrome` reports **71 of 97 placements under 4.5:1 whichever polarity is
chosen**: no legible side. The worst measurement is 1.00:1.

**THE AUDIT WAS LYING ABOUT THIS, and that had to be fixed first.** Rendering the
treatments produced numbers identical to two decimal places on four routes,
because the check hid `#site-chrome` before measuring the ground under the mark —
and `visibility:hidden` takes an element's background and pseudo-elements with
it. A scrim and no scrim measured the same. It now sets the glyphs transparent
(every mark paints in `currentColor`), so any ground behind them survives into
the measurement; verified behaviour-preserving against every baseline number. The
first attempt at that correction invented a fault of its own — an action's
hairline underline is drawn from `var(--fg)` rather than currentColor, so it sat
inside the box as a perfect 1.00:1 — and borders are neutralised too.

**A check that cannot see the fix it is being used to evaluate is worse than no
check, because it argues against the fix with a number.**

Four treatments, rendered with `npm run shots -- --chrome=`, measured on the same
eight placements (four routes x two widths):

    none            8 of 8 fail, worst 1.14:1   the brand's name, on most of the site
    gradient 55%    3 of 8 fail, worst 2.83:1   a veil on every photograph, and it still fails
    gradient 85%    0 of 8 fail                 a black bar with a soft edge, grey over his work
    plate           0 of 8 fail                 two closed boxes on the photograph
    band            0 of 8 fail, 19.6:1         the photograph loses its top edge

The 85% is arithmetic, not taste: white text at 0.958 luminance needs the
brightest pixel under it at or below 0.174 to reach 4.5:1, and veiling pale
concrete to that takes an ink layer at roughly 82%. **The minimal scrim and the
scrim that works are not the same object.**

**THE ANSWER TO THE QUESTION AS ASKED:** a scrim costs standing rule 11 —
permanently, on every page, over his work — and at the strength that clears AA it
is a bar rather than a veil. That cost is larger than it looks and **smaller than
the brand's own name being illegible on 126 of 178 screens.** If those were the
only two options the scrim would win, and the rule would deserve to go.

**They are not the only two options, and that is the finding. The rule that is
costing us is not "no scrim" — it is "the chrome floats over full-bleed
photography"** (section 14, an owner's call on 2026-08-01, written before this
photography existed either). Both treatments that fully work keep two colours and
break no rule about grey.

**Recommended, and it is the owner's to take: THE BAND.** The chrome stops
floating and takes its own height in page ground. It measures 19.6:1 everywhere,
forever, with no per-image judgement — and it DELETES work: `overlayChrome`, its
97 measurements and its import step stop being needed, and section 83's trap,
where a video loop drifts under the chrome and makes the name vanish mid-loop,
disappears with them. On shop pages it costs almost nothing, because those pages
already open with the paper shipping line and the band continues it. On the two
culture pages it costs the full-bleed top edge, and that is the whole trade.

If the culture pages must keep their edge, the site already has the pattern: a
`chromePlacement` of over/above, mirroring `captionPlacement`, defaulting to the
measurement. It costs an inconsistent top edge between pages.

Not recommended: the **plate**, because section 25 removed the last closed box
from this system deliberately and the render shows MENU turning back into a
button; and the **gradient**, because it is the only option that modifies his
photograph.

## 87. The band: the chrome stopped floating (2026-08-11)

**THE OWNER'S DECISION**, taken on the measurements in section 86 and against
rendered alternatives. His words: evidence beats a rule I made without it.

### What changed

The signature and MENU no longer sit on the photography. The header keeps its
sticky behaviour and loses `-mb-chrome`, the negative margin that gave it zero
height in the flow; it paints page ground and the photograph begins under it.
The mark is ink on paper at **19.6:1**, at every width, on every photograph he
will ever shoot.

Every corner-mark fault on the site is gone. `/it/about`, `/it/process`, the
catalogue and a Creature page now audit **clean**. What remains on the home page
is the arrival's own overlay text and the drawn signature over it — a different
band, still open as the section 58 caption-polarity item.

### THE NO-SCRIM RULE SURVIVES INTACT, and this is the part to read twice

**Standing rule 11 is untouched.** The band is not a scrim and it is not a
diluted one: nothing is laid over the photograph, nothing is faded, and no value
between ink and paper is painted anywhere on this site. The alternative that
used one was rendered, measured and rejected — at the strength that actually
clears AA (85%) it is a black bar with a soft edge, and it is the only option
that modifies his photograph.

**So nobody should later "restore" a veil under the marks believing they are
putting something back. There was never a veil.** What was reconsidered and
found wanting was not the colour rule but the ASSUMPTION under it — that the
chrome must float over full-bleed photography (section 14, 2026-08-01).

### What it deleted, which is most of the point

- **`overlayChrome`** — the field, its studio control, its projection, its type.
- **`scripts/measure-chrome.mjs`** and its npm script: there is no band to
  measure. Its chained call at the end of every import went with it.
- **The chrome observer** in Base.astro, which watched every media surface pass
  under the marks and swapped their polarity. It ran on every page, it was
  correct, and it could not solve the problem: 71 of 97 placements had no
  legible side to swap to.
- **`data-chrome-polarity`** on every media surface, and the `chrome` prop on
  six pages.
- **Section 83's loop trap.** A video whose luminance drifts under the chrome
  can no longer make the brand's name vanish mid-loop, because the name is not
  over the video. The shooting spec keeps the framing rule for the caption band;
  the chrome half of that trap is gone.

### Two consequences that had to be handled

**A screen is now a screen less the band.** `--media-h-screen` was 100svh, and
with an opaque sticky band above it the site's one sealed screen — the home
arrival — ran a band's height past the fold and stopped being sealed. It is
`calc(100svh - var(--chrome-h))`.

**The wash is held under the band, not behind it.** Its sticky child pinned at
`top: 0` would have spent its first band-height underneath opaque paper, putting
the mark being written off-centre. It pins at `top: var(--chrome-h)`.

Four pages that used `pt-chrome` to clear the floating chrome no longer need to
clear anything; they take `pt-u8`, which is the same air expressed as rhythm
rather than as an overlay's height.

## 88. Forty-one details were already in the files (2026-08-11)

Thirteen construction crops were cut from his own photographs and imported.
**Every one went in with an empty caption on purpose.**

### What was imported, and where

Each crop is spliced in **after the frame it was cut from**, never before a
piece's first frame — that frame is the arrival, the LCP image and the share
card. Nothing was removed or reordered.

    Rubedo            the hand stitching down the front panel
    Rubedo            HIS HANDWRITING INKED INSIDE THE COLLAR
    Rubedo            the opening in the upper back
    Rubedo            the raw scalloped hem
    Oblivion          the centre-back seam and its topstitching
    Oblivion          the cut hem, left raw
    Oblivion          the snaps and the stitched placket edge
    Armonyen          the collar, the snaps and the crumpled grain
    Corvinus          the wrapped collar in crinkled leather
    Nocte             a panel let into the leg, and the stamped tape
    Monumentus Vest   the scrap panels and their stitched edges
    Monumentus Pants  the two welt zips at the back waist
    Monumentus Pants  the waistband, the belt loops and the exposed zip

`npm run detail-crops` is the tool, dry by default. The rectangles are declared
as fractions of their source frame, so they survive a re-export at another size,
and every one was cut and LOOKED AT before it was written down.

### The caption is empty and that is the whole design

The picture was ours to cut. **The sentence is his** — "500 punti cicatrice,
cuciti a mano" is a fact only he knows, and writing it for him would be
inventing his voice on the one page that is meant to prove the work is real.

An empty caption cannot be told from a caption nobody wanted, because most
frames here correctly have none. So the import marks each crop `needsCaption`,
a new boolean on the media object, and **`npm run launch-check` names every one
of them until he writes it**. The gate went from 34 to 47, and the unapproved
alt count from 56 to 69. Both rises are correct: thirteen photographs now carry
a description we wrote and a sentence nobody has written.

### The guard that fired on the cases it was meant to help

The first run refused capo-03, capo-12 and capo-13 — "only one frame, so it must
stay whole". The reasoning was wrong: a crop lands AFTER its source, so the wide
view keeps its place and the detail follows it, which is exactly the arrangement
being asked for. Those three pieces have one photograph each and therefore the
most to gain from a second. **A dry run is what caught it**, which is the whole
argument for one.

### What is left for him

Eight pieces have no frame big enough to crop — styrax, styrax-red, glovyes,
severya, capo-09, capo-07, capo-04 and the hat — and `docs/SCATTI-DETTAGLIO.md`
now names the exact detail each one is missing rather than asking for three
photographs of everything. Ghezard needs nothing shot: one of its frames is
already a close-up of the zip and the fur collar. It needs the line.

## 89. The caption band, measured, and the arrival's words moved (2026-08-11)

The last code item on the checklist, closed. **The site now audits at two faults,
down from 152 this morning.**

### The 40 were itemised before anything was touched, and the inference was wrong

The previous report inferred the remaining faults were "the arrival's overlay
text and the drawn signature". Re-run and counted, they were **36**, and the
composition was different:

    12x  Monumentus Vest        worst 1.75:1   capo-04's first frame, on three routes
     8x  the price, both forms  worst 1.75:1   the same frame
     4x  MONUMENTUS: Tenebrae   worst 1.55:1   the drop name on the home arrival
     6x  the arrival's other three lines
     2x  Vertex                 worst 4.35:1   the hat
     0x  the corner mark, the drawn mark

**The drawn mark was not in the list at all**, and two frames — capo-04's first
and the home arrival — accounted for thirty of the thirty-six. An inference that
sounded right named the wrong elements and would have sent the fix at the wrong
frames. Count before fixing.

### What was wrong, and it was not the polarity

`overlayCaption` and `captionPlacement` have existed since section 58, and 62 of
69 garment frames were already `below` because their caption band has no legible
side. **The frames that were still `over` had simply never been measured.** The
home arrival carried no `overlayCaption` at all and fell back to `overlay`,
which is the value for the top of the frame.

`npm run measure-captions` is the surviving half of the deleted `measure-chrome`
pair: it slides a caption-sized window along the bottom band at every container
shape the site renders and takes the worst position any word could land in. Nine
frames changed. Six moved off the picture.

**It only measures frames that are still ON the picture.** The first dry run
wanted to rewrite `overlayCaption` on thirty-odd frames already set to `below`,
where the value is inert — churn over values the studio explicitly invites a
human to disagree with.

### THE BROWSER BEATS THE MODEL, and one frame proved it

Vertex, the hat, measured 16.89:1 in the model and **4.35:1 in the browser**. Its
only photograph is a 900px crop, and a luminance mean cannot model where a word
actually falls — which is the same failure section 58 recorded the first time.

The audit measures the pixels inside the real rendered text box, so it is the
authority, and the tool now carries a `BROWSER_OVERRIDES` list of frames the
audit contradicts it on. **Add to it from an audit run, never from an opinion.**

### The arrival: the words came off the photograph, and the frame got shorter

The arrival's caption band measures **1.5:1 worst case**. No text colour survives
it, so the four lines — his drop title, his sentence, the price, the way in —
now sit on paper directly under the picture at 19.6:1.

**And the frame became `tall` rather than `screen`, which is the other half of
the fix.** Under a full-height photograph the block would begin exactly at the
fold, and a first-time visitor would meet a silent screen: the screensaver
section 21 was written to end. At 88svh the drop's name and the start of his
sentence are on the first screen at both widths, verified by looking.

What no code can fix is the photograph. A frame with a quiet band at the bottom
would let the words go back onto the picture, and that is his to shoot.

### What is left, and it is two faults

The **drawn signature** over the arrival, 1.49:1 and 1.74:1. It is decorative,
`aria-hidden`, drawn once per visit, and the `h1` beside it carries the name in
text. It is the same photographic problem in the same place: it clears when the
opening frame does. It is on THE OPEN LIST rather than in the code, because
tuning a ceremony to one photograph is how a ceremony becomes a bug when the
photograph changes.

## 90. The one video, surveyed and refused (2026-08-12)

One file exists — `video aleksander cecco.mp4`, 4.29 MB — and the owner has
confirmed there is no other on the machine or the Drive. Measured against the
spec in section 83, and then LOOKED AT, it cannot go on the site.

### What it is

    duration    26.12s          (spec: 6-10s arrival, 4-8s process, 4-6s a piece)
    resolution  464 x 832       portrait 9:16
    frame rate  30 fps
    codec       h264 Baseline, yuv420p, 1308 kbps
    audio       AAC 44.1kHz stereo, 65 kbps   (spec: no audio track at all)
    size        4.29 MB         (spec: under 3 MB, under 2 MB on the arrival)

**What it shows**, and this part is good: one continuous take — no scene change
scores above 0.15 anywhere in it — of a hooded figure hanging a long black
leather garment against a white plaster wall, the camera moving in until the
fabric fills the frame, ending nearly black. It is the work, and it is his.

### Why it cannot carry the arrival, or anything else full bleed

**1. It is 832px on its long edge, and the site's floor is 1200.** That floor is
not a preference: it is the size of the smallest frames already published here
(section 88). A full-bleed frame on a phone is 390 CSS pixels at DPR 3, so 1170
device pixels; this clip is 464 wide. Rendered at the size a reader actually
sees it, **the leather has no grain at all** — blocked shadows and compression
smear where every crease reads on the stills beside it. That comparison was
rendered and looked at, and it is the whole decision. A site whose argument is
the material cannot show the material as mush.

**2. There is no loop in it.** First frame against last differs by 84.7 of 255;
the best six-second window anywhere in the clip still ends 33.9 from where it
started. Nothing here returns to where it began, because it is a NARRATIVE — a
person arrives, hangs a garment, the camera closes in, the light goes. A loop
that jumps is a player, and section 83's whole premise is a moving photograph.

**3. Its first frame cannot be its own poster.** The clip opens on a bright room
with a gloved hand entering the frame; the arrival's photograph is a black
crinkled bodysuit on a mannequin. They are different pictures, so the moment the
loop played the page would cut.

**4. The luminance drift is real and measured.** Sampled twice a second, the
caption band swings from 0.007 to 0.339 relative luminance: **worst case 2.59:1
for white text and 1.07:1 for black, over the same clip.** Neither colour
survives it. The arrival's words are on paper now (section 89) so they would not
be harmed — but the drawn signature still sits over that frame, and its ground
swings 0.012 to 0.320 underneath it. This is exactly the trap section 83
predicted, and here it is with numbers.

Any one of these is disqualifying on its own. The first is not fixable by
re-encoding: **you cannot add pixels that were never recorded.**

### Where it goes: nowhere, and that is not the same as never

**Nothing was imported and nothing was re-encoded.** Re-encoding would have
fixed the two things that do not matter — the audio track and the file size —
and left the two that do.

Every place a video is allowed on this site is full bleed, and every small frame
— the worn band, the Instagram strip, a catalogue tile — is forbidden a loop for
reasons that have not changed (section 83). Inventing a small video surface so
this clip has somewhere to sit would be building a role for a file rather than a
reason, which is the thing the owner explicitly asked not to be done.

### What would change the answer, and it is one message

**464 x 832, Baseline profile, 1.3 Mbps is a messaging-app re-encode**, not a
camera original. The phone that shot this recorded 1080 x 1920. Ask him for the
ORIGINAL, sent by AirDrop or Drive rather than by WhatsApp or Instagram, which
re-compress on send.

With the original in hand the survey changes completely, and the window is
already chosen: **1.5s to 7.5s**, the steadiest six seconds in the take, where
the garment is being lifted against the white wall. It would still not loop
seamlessly, so it would be a /process frame — the making, where a loop is
allowed to be an action rather than a breath — and never the arrival. The
arrival needs a locked-off frame of one material moving, which is a thing to
shoot rather than a thing to cut.

This is item 10 on THE OPEN LIST, and it is now specific: one file, one window,
one thing to ask for.

## 91. What each page actually costs, measured rather than remembered (2026-08-12)

Section 79 refused the splash screen on Slow 4G numbers and section 69 found a
1.8 MB catalogue the same way. **Both measurements were made by tools that did
not survive their session**, so every session since has quoted them on trust.
`npm run shots -- --weigh` is that measurement, committed.

The profile is pinned in the file rather than taken from a preset name — 400
kbps down, 400ms round trip, which is the number section 79 quotes — because
Chrome's own "Slow 4G" preset has moved over the years and comparisons are
worthless if the profile drifts under them. Bytes are TRANSFER bytes, compressed,
as they crossed the wire; photographs come from Sanity's CDN over the real
internet, so their figures carry real latency rather than a local read.

### The site tonight, from a cold build

    390   /it                    597 KB   images 328   FCP 2.5s   LCP  4.0s
    390   /it/creature           994 KB   images 677   FCP 2.5s   LCP  4.9s
    390   /it/creature/rubedo    519 KB   images 301   FCP 2.5s   LCP 12.9s
    390   /it/process            438 KB   images 238   FCP 2.5s   LCP 15.6s

    1440  /it                   1742 KB   images 1473  FCP 2.5s   LCP 13.2s
    1440  /it/creature           994 KB   images 677   FCP 2.5s   LCP 28.7s
    1440  /it/creature/rubedo   1434 KB   images 1216  FCP 2.5s   LCP 37.5s
    1440  /it/process            601 KB   images 401   FCP 2.7s   LCP 21.2s

**Read these correctly, and the caveat matters more than the numbers.** The
harness waits for `networkidle`, so every lazy photograph on a long page has
loaded by the time LCP is read. On a page that is twenty full-bleed frames tall
that number is "how long until nothing is still arriving", not what a reader
waits for — a reader sees the first screen and scrolls. **FCP is the honest
figure for arrival and it is 2.5 seconds on every route**, which is the HTML,
the stylesheet and the first font at 400 kbps and nothing else.

What the totals are good for is COMPARISON — between routes, and between today
and whatever a later session does to them.

### What is worth noticing in them

- **The constant floor is 152 KB**: 27 KB of stylesheet, 125 KB of fonts, on
  every route, and no JavaScript bundle at all on any page. The framework
  contributes nothing to the wire.
- **The catalogue is the heaviest phone page at 994 KB**, all of it photographs.
  Section 69 left it at 1.8 MB with an 8.7s LCP; it is roughly half that now.
- **A Creature page grew when the detail crops landed** (section 88). Rubedo
  carries eleven frames now. They are lazy and below the fold, so the arrival is
  unaffected, but the page total is a real cost of the crops and is recorded
  here rather than discovered later.
- **1440 is where the weight is**, because full-bleed frames ask for wider
  sources. The phone, which is where his readers are, is the lighter case.

### The threshold this establishes

**No change may take the catalogue at 390 above 1 MB, or FCP above 3 seconds,
without being argued in this file.** Those are the two numbers that decide
whether the site is usable on the connection his buyers actually have, and they
now have a command that produces them in a minute.

## 92. The audit could not see the site's only fault (2026-08-12)

A full walk reported **zero faults** tonight. The site has one, and the zero was
an artefact of visit order.

### What happened

The signature draws itself over the home arrival ONCE PER VISIT and then sets
`ac-sig-drawn` in sessionStorage; on every later view the element is
`display:none`. The harness walks all 89 routes in ONE browser context, and the
first route in the sorted list is `/`, which redirects to `/en`. So the ceremony
happened there, at the very start of the walk — and by the time `/en` came round
as its own route there was nothing left on the page to measure.

Audited alone in a fresh session, the same build reported the mark at 1.74:1 and
1.49:1. **The site had not changed. The visit order had.**

### Why this one stings

The mark is the site's only remaining defect, it is on the most important screen,
and **it is precisely the thing a FIRST-TIME reader sees** — which is who the
check exists for. A returning reader never sees it, and the audit had
accidentally been auditing the returning reader on every route but one.

It is the same shape as section 86, where the check hid the element it was being
used to judge, and section 84, where `slots.has()` answered a different question
from the one meant. **A green from a check that cannot reach the thing is worth
less than no check**, because it is quoted afterwards as evidence.

Every route now clears the key before the page's own scripts run, so every visit
is a first visit.

### The honest number, and it is not a regression

With the blindness fixed the full walk reports **4 faults**: the drawn signature
on `/it` and `/en`, at 390 and at 1440.

**Earlier sessions reported 2 for the same defect on the same build**, because
they had audited one language. The site did not get worse tonight; the
measurement got honest. There is one defect, on two language pages, at two
widths, and it clears the day the opening photograph has a quiet band —
item 13 on THE OPEN LIST.

## 93. The loop is on /process, provisionally (2026-08-12)

Section 90 refused this clip. The owner has shipped it anyway, **provisionally**,
the way the hat's crop ships: visible on the page, marked in the studio, named
here as something to replace.

**What went up:** 1.5s–7.5s, the steadiest window in the take, re-encoded to
6.03s at 458 KB — h264 High, yuv420p, faststart, **no audio track at all**. Its
poster is its own first frame, extracted at the same timestamp the encode starts
from, so the swap from still to motion is invisible. Appended after the eight
making frames, because it shows the garment being hung and that is the end of
the work, not a step inside it. `isProvisional` is on.

**How bad it looks, honestly, having looked:**

- **At 390 it passes.** In the vertical column it reads as a slightly soft frame
  — the wall shows compression mottling and the glove has no texture — but a
  reader scrolling would call it a photograph, and it moves, which nothing else
  on the page does.
- **At 1440 it is plainly the weakest frame on the site.** The mosaic pairs it
  beside a pattern piece whose linen weave is razor sharp, and the difference is
  not subtle: the glove is a blur, the wall is mush. Anyone comparing the two
  sees it.

That is the trade the owner took with his eyes open: motion on the making page
tonight, at the cost of the sharpest page on the site having one soft frame.

**IT MUST BE REPLACED BEFORE LAUNCH, and the GATE now says so rather than this
page.** `launch-check` only ever looked for provisional frames on a garment, so
the one thing on the site marked provisional was invisible to the command whose
job is to refuse provisional things — a note in a plan is a note. It reads
`site settings  1 provisional frame(s) in processMedia` until the file is
swapped. The camera original is 1080x1920 and one message away; `docs/SCATTI-DETTAGLIO.md` section 3 is the ask, in Italian. When
it lands, re-encode the same window and swap the asset — the media object, the
poster rule and the placement all stay.

## 94. Three things move that did not (2026-08-12)

The site's motion was judged again now that something on it actually moves, and
three things were built. The two standing rules held: nothing competes with a
photograph, and nothing that must be read moves.

### 1. THE TILE BECOMES THE PIECE

Catalogue to Creature is the most repeated journey here and the same photograph
is on both sides of it. It was a 200ms crossfade between two whole pages: the
picture you tapped dissolved, and an identical picture faded up somewhere else
on the screen. Now the browser carries it across.

**Section 72 rejected a morph and was right about the design it judged.** Naming
a pair without JavaScript means relying on `:active` or `:focus` surviving the
snapshot, which is unreliable; and seventeen permanently-named tiles cost phone
frames on the heaviest page on the site. **Neither cost applies to naming ONE
element at the moment it is tapped.** The destination hero carries the name
always — one element on a page that has one — and a tile carries it for the
length of one navigation, applied on `pointerdown`, cleared on `pageshow` so
history never leaves two elements sharing a name.

Verified in a browser rather than reasoned about: before a tap no tile resolves
a `view-transition-name`; after one, exactly the tapped tile resolves `piece`,
and so does the hero on the piece's own page.

### 2. THE GRID SETTLES WHEN A FILTER CHANGES

Choosing a filter was instant in the worst sense — half the tiles vanished
between one frame and the next, and nothing said the page had answered rather
than broken. The surviving tiles settle once, 260ms, on the site's own curve.

CSS with no state of its own: the rule matches only while a filter is chosen, so
it runs on the change and never on load. **"All" carries no animation on
purpose** — returning to everything is a release, not an act.

### 3. THE BUY ACTION ANSWERS A FINGER

The drawn underline was triggered by hover and by keyboard focus, which between
them cover every reader except the one who matters most: the buyer on a phone.
Pressing "Acquire — €975" did nothing at all, and then the page changed.
`:active` now draws the same stroke on the same curve. One line of CSS, on the
one place in this site where silence is expensive.

### What was considered and left alone

- **The order confirmation** already stages its arrival in writing order
  (section 72). It is the emotional peak and it already moves; adding to it
  would be decorating a moment that works.
- **The menu** already arrives on a hard top-down edge, the wash's own language.
- **The catalogue's tiles** already reveal as they enter. What was missing was
  not entrance but ANSWER — which is what items 2 and 3 are.
- **Anything on a photograph.** Still nothing.

## 95. The catalogue was never 994 KB (2026-08-12)

Section 91 measured the catalogue at 994 KB on a 390px viewport and set a 1 MB
threshold against it. **Both numbers were measured on the wrong device.**

The harness runs desktop Chromium at 390 wide, which reports `hover: hover`. The
tile strip — four frames per piece, section 72 — is `display:none` on hover
devices and therefore never fetched, and the hover swap frame is fetched
instead. **On an actual phone, which reports `hover: none`, the whole strip is
real.** Measured with touch emulation at DPR 2:

    2315 KB, 55 photographs

Two and a third times the threshold, on the page a buyer from Instagram lands
on, and the threshold had been written against a number that device never sees.

### What it costs to fix, measured at each step

    2315 KB   as it was
    1524 KB   the flick strip cut from four frames to two
    1230 KB   tile quality 80 -> 62
     849 KB   tile quality -> 55, and the CDN serving webp rather than the
              original jpeg once its cache is warm

**849 KB, 35 photographs, 564 KB of which are the photographs**, the rest being
the 125 KB of fonts and 27 KB of stylesheet every page carries.

**Nothing was removed that a reader uses.** The strip keeps its gesture, its peek
and its second view; frames three and four were a piece's detail crops, which
belong on the piece's own page one tap away. Quality 55 applies ONLY to tiles —
195 CSS pixels wide on a phone, thirty-six of them — and never to a full-bleed
frame, which is the whole screen and is the work.

### The measurement itself is now the finding

**A number measured on the wrong device is worse than no number**, because it
becomes a threshold. The 994 KB figure was quoted in a plan section as a limit
one night and would have been quoted as a baseline forever.

The lesson is narrow and worth keeping: **`hover` and `pointer` media queries
make the phone a different document, not a narrower one.** Anything measured in
a desktop browser at a phone's width has not been measured on a phone. The
harness's own screenshots have the same blind spot — it photographs the hover
variant of every tile — which is why the flick strip has never appeared in any
capture in this repository.

## 96. The hand signs on paper, and the last fault is gone (2026-08-12)

**The site audits clean.** Zero faults, both languages, both widths.

### What the fault was, and why tuning was refused

The drawn signature — the once-per-visit ceremony, his own hand — was positioned
absolutely over the opening photograph and took that photograph's overlay
polarity. It measured 1.49:1 and 1.69:1: four faults, the last on the site, on
the first screen a visitor sees.

No per-image value could fix it. The mark spans 92vw, and **every photograph in
this dataset is bright at one end of that span and dark at the other** — the
same finding as the chrome band in section 87, at a different scale. Tuning the
ceremony to the current opening frame was refused twice, because a ceremony
tuned to one picture becomes a bug the day the picture changes, and that picture
is his to change.

### The fix, which survives any photograph by construction

**It moved off the photograph onto the paper directly beneath it**, where his
four arrival lines already sit since section 89. Ink on paper: 19.6:1 tonight,
on his next photograph, and on every photograph after it. Nothing is measured,
nothing can drift, and the gesture is untouched — same pen, same stroke order,
same once per visit, same degradation to a plain filled mark with no JavaScript
or reduced motion.

**It reads better there**, which is the part worth saying rather than defending:
a signature belongs at the foot of a thing rather than across it. Looked at, the
arrival is now his photograph, then his drop title, his sentence, the price, the
way in — and then his name, written. That is a page signing itself.

`.sig-arrival` and its absolute positioning are gone. The harness now looks for
`.sig-draw` wherever it is, so the check does not depend on where the mark
lives.

### One thing the move broke, caught by the audit in the same minute

`--sig-hero-w` is 92vw on a phone, sized for a FULL-BLEED context where the 4vw
either side does a margin's work. Inside a framed block the page margin is
already there, the two insets add up, and the mark hung 17px off the right edge
of a 390px screen. The audit reported it as an overflow AND a spill immediately.
It takes the measure's full width instead.

**That is the second time tonight a fix landed and its own side effect was found
by the check rather than by a person** — which is the argument for having run
the audit before writing this section rather than after.

## 97. What accumulated, removed without asking (2026-08-12)

Things that were never decided, only left. Each had survived at least two
sessions of someone reading past it.

- **`--media-h-band`, and the `height="band"` branch that read it.** Nothing has
  passed `band` since the home page was rebuilt as a sequence. It was flagged
  "delete if still unused when the next hand passes through" a session ago; the
  next hand has passed through.
- **The sentence describing it**, which had been broken mid-way for as long:
  *"'screen' fills the viewport, 'tall' leaves the next one peeking, 'band' is
  'short' is the low row..."*. Two readers had corrected around a line that said
  nothing rather than noticing it.
- **`footerTheme`**, threaded through Base into SiteFooter and passed by nobody
  since section 82. The footer's own `theme` prop stays, documented as the one
  surface that would carry a local inversion if the site grew one.
- **`.sig-arrival`**, its absolute positioning and its per-image polarity, which
  section 96 made unnecessary.
- **Base.astro's opening comment**, which still described polarity as a property
  a page chooses, and its `theme` note, which still listed `overlayChrome` among
  the values that survive. Both argued for rules the site no longer follows,
  which is the exact failure section 84 named.

Nothing here changed a pixel. That is the point: they were all things a reader
would have had to disprove before trusting the file around them.

## 98. Made to measure is removed from the shop (2026-08-12)

**THE OWNER'S DECISION, in his words:** remove made to measure, everything
becomes available, and under each piece write that a made-to-measure order goes
by email.

So the shop sells OBJECTS. A Creature exists, is photographed, and is bought as
it is. Made to measure survives as one sentence inviting an email, and as
nothing else — not a state, not a form, not a branch.

### What left

- **The measurement fieldset**: chest, shoulders, length, the diagram, the
  centimetre/inch chooser and the help text under each field.
- **The as-is-or-remade question**, and the `fulfilment` field behind it.
- **`MeasureDiagram`**, deleted, and its `measureDiagram` flag with it.
- **`madeToOrder`** as a state. Thirteen Creature were carrying it and are now
  `readyNow`; the studio no longer offers the value, and the query defaults to
  `readyNow` so an unsaved document still sells.
- **The Function's measurement half**: the ranges, the inch conversion, the
  as-is branch, and three rows from the order email. **It no longer handles body
  measurements at all**, which shrinks what the privacy notice has to cover — a
  special category of personal data left the site tonight.
- **His own approved sentence**, "Send us your measurements and we will make it
  for you", which was true and is now false. Ours replaces it, marked.
- **`availabilityCopy`** and **`homeLines`**, both flagging copy that no longer
  exists.

### THE THING HIS DECISION CREATES, and it is not small

**If every piece is bought as it exists, every piece must publish its own
measurements.** While the shop sold made to measure, a piece's numbers described
the photographed sample: context, useful, survivable if missing. Now they
describe the object that will arrive, and with no sizes on this site by his own
decision (section 17) they are the ONLY fit information a buyer has. Nobody
spends four figures on a leather shirt without knowing whether it fits.

`launch-check` now REFUSES on any purchasable Creature with no measurements, and
names it. `notOffered` and `privateOrder` are exempt: they cannot be bought.

**Fifteen of sixteen purchasable pieces need his numbers.** Oblivion is the only
one whose measurements are his. Fourteen carry measurements WE invented, already
flagged; Rubedo has none at all and is the one the new check catches on its own.

### What else this decision breaks, listed because he asked

1. **The measuring diagram and its copy** are gone, as above. They were the one
   place the site taught a person to do something.
2. **The 1 of 1 state loses its distinction.** It used to mean "exists, cannot
   be remade" — which is now true of everything. It is kept because the
   catalogue's second movement is built on it and because "one of one" is a fact
   about the object, but **it no longer changes what a buyer can do**.
3. **The order email is shorter**: piece, price, name, email, note, language.
   Nothing about a body.
4. **The privacy notice gets easier.** Three body measurements were the reason
   the legal group named a special category; the form now collects a name and an
   email like a hundred thousand other shops.
5. **"Handmade. Made to measure." was the constant line** on every Creature
   page. It is "Handmade in South Italy." now.
6. **Returns copy may need re-reading by a lawyer, in the other direction.**
   Made-to-measure goods can be exempt from the EU cooling-off period; goods
   sold as they are usually are NOT. The checklist item that asked which applies
   now has a simpler answer and probably a stricter one.
7. **The catalogue's first movement** is now everything that is not sold or
   private, which is most of the site. Its heading still reads AVAILABLE, which
   is right, but it no longer distinguishes anything.

## 99. His homepage copy, verbatim (2026-08-12)

From a document he sent this morning. **Approved, and in the dataset exactly as
he wrote it** — his words, his spelling, his line breaks.

### What it replaced

- **The arrival's four lines.** They were assembled by us: the drop's name as a
  label, the first describing line of its statement, and an invented price line
  ("From €275 / Made to measure"). His three lines were written FOR that screen:
  *Meet our "Creatures" / entities with their own breath, / born from the earth
  and worn on the body.* The price line's `homeLines` flag is retired with it.
- **THE WORK became THE PROJECT**, his title, carrying his two sentences.
- **WORN became BODY OF LIGHT**, his name. Its subtitle — ours — is gone: he
  named the section and wrote no line under it, and ours beneath his title would
  be the site explaining his own words back to him.
- **THE MAKING is replaced entirely** by his three reasons: OUR SKINS, REASONS,
  REBORN. Each is composed with a making frame, because a body-register passage
  is never alone here (section 82).

### The heading question he asked

He was unsure whether the three reasons want a heading, and suggested
PHILOSOPHY. **They do not, and no heading was added.** Each reason already
carries his own title, and a heading above three headings is a label on a label.
This site names a section when the section has no voice of its own — BODY OF
LIGHT, THE PROJECT — and this one speaks for itself three times.

### His titles are not translated, and that is a decision

OUR SKINS, REASONS and REBORN are single strings with no Italian: he wrote them
as titles, not as sentences. **So THE PROJECT and BODY OF LIGHT stay in his
English on the Italian page too.** Translating two of his five titles and not the
other three would be the site speaking in two voices about one document.

### HIS ENGLISH IS NOT OURS TO CORRECT — a question for him, not a fix

Three small errors are in the text as he wrote it and are **shipped unaltered**:

    "Our leathers is tanned by plants"      -> are
    "It marks, it change, it scars"         -> changes
    "To respect the Mother Nature"          -> Mother Nature

The rule that protects his voice protects his mistakes until he chooses. Two of
these could also be read as deliberate — "the Mother Nature" is how a native
Italian speaker writes it, and this brand's English has always sounded like
that. **Ask him; do not fix.**

### The Italian is ours again

`approvedLanguages` drops from ["en", "it"] back to ["en"]. His new document is
English; the Italian on the page is our translation of it and marks itself as an
unapproved translation until he reads it. That flag was set to both languages
when the Italian was his, and it is not any more.

## 100. HOW A PIECE IS SIZED: three answers in ten days (2026-08-12)

The owner has now answered this question three times, and the answers contradict
each other. **All three are recorded here, with dates and with what each one
cost to build and to unbuild**, because the pattern is more useful than any one
of them: this is the question this project keeps reopening, and the next session
should recognise it on sight rather than treating answer four as new.

### Answer 1 — NO SIZES AT ALL (2026-08-02, section 17)

*"There are no sizes. Every garment is made to measure, always, and nothing is
produced in advance."*

It reversed a size list decided on 2026-08-01, and it was argued hard: a size
field implies stock that exists before someone asks for it. **Built:** `sizes`
deleted from the schema, `studio/schemaTypes/constants/sizes.ts` and
`src/lib/sizes.ts` deleted, the sizes row removed from the piece page, the size
strings removed from the interface, `{AVAILABLE_SIZES}` retired. Section 17
closes with **"DO NOT REINTRODUCE SIZES"** in capitals.

What replaced them: reference measurements per piece, and the measuring flow —
three body measurements, a diagram, a unit chooser.

### Answer 2 — NO MADE TO MEASURE, BUY WHAT EXISTS (2026-08-12, section 98)

*"Remove made to measure, everything becomes available."*

**Built:** the measurement fieldset, the diagram, the unit chooser, the
as-is-or-remade question and the `madeToOrder` state all deleted; thirteen
Creature moved to `readyNow`; body measurements removed from the Function
entirely; `launch-check` made to REFUSE any purchasable piece without published
measurements, because if a buyer receives the object in the photograph then its
numbers are the only fit information that exists.

It lasted **one working session**.

### Answer 3 — THE BUYER CHOOSES A SIZE (2026-08-12, section 101)

*"The buyer chooses a size, the owner makes the piece in that size, and the site
presents it simply as available."*

**Built:** a size choice per piece, sizes back in the schema — reversing section
17's capitals — the measurement gate removed again, and the fifteen invented
measurement sets deleted rather than left flagged.

### WHAT THE PATTERN SAYS, and this is the part worth keeping

Read together, the three answers are not random. Each one moves the WORK the
buyer does closer to zero: measure yourself and send three numbers → nothing,
buy what exists → choose a size. The owner is not changing his mind about the
product; he is converging on an ordinary shop, and each answer arrived after he
looked at what the site was asking a stranger to do.

**So the thing to hold loosely is the MECHANISM, and the thing to hold firmly is
the direction.** The next question that sounds like sizing — a fit guide, a
measurement chart, a size calculator — should be judged against "does this add
work for the buyer", and probably answered before he has to ask.

**And the practical lesson: build the mechanism thin.** Answer 2's gate was
written to be strict and correct and was deleted eight hours later, having never
guarded anything real. Answer 3's size field is deliberately one array on one
document, with no constants file, no library and no derived state — so that
answer four, whatever it is, costs an afternoon rather than a session.

## 101. The buyer chooses a size (2026-08-12)

**Answer three, and section 100 records all three with dates.** The buyer picks
a size, he makes the piece in it, and the site presents it the way an ordinary
shop does. Published measurements are not needed for fit.

### The range, and why these five

**XS, S, M, L, XL, and a sixth value: ONE SIZE.**

- **Letters, not numbers.** 44/46/48 is country-specific and would need a
  conversion chart on the page — which is work for the buyer, and section 100's
  reading of his three answers is that every one of them moved that work toward
  zero.
- **Five steps, no half sizes.** A hand-cut leather garment made one at a time
  cannot honour an M/L, and offering one would be a promise nobody can keep.
- **No numeric fallback and no chart.** If a buyer wants to reason from
  centimetres, Oblivion's own measurements are on its page and the made-to-
  measure line invites the email. That is the escape hatch, and it is his.

### ONE SIZE IS A VALUE, NOT AN EMPTY LIST

His own words describe pieces with an adjustable choker as One Size, so the
schema must allow a piece with no size choice — but "this piece is one size" and
"nobody has decided yet" are different facts, and an empty array said both.

That is the exact shape of the gap section 80 was written about: two questions
with one answer, indistinguishable until the case that separates them arrives as
a live page. So ONE SIZE is a tick in the same list. Empty now means undecided,
and **`launch-check` refuses on it**: sixteen purchasable pieces currently have
no sizes chosen, and that is the honest state rather than a silent default.

### The measurement gate is gone, and so are the invented sets

Section 98's gate refused any purchasable piece without published measurements.
It was correct for the eight hours in which a buyer received the object in the
photograph, and it never guarded anything real. Removed.

**Sixteen invented measurement sets were deleted rather than left flagged.**
They were plausible numbers we wrote; with fit decided by a size choice they are
not reference information either, they are fiction about an object.

**One set stays, and it is the only one that was ever real: Oblivion's.**
*Sleeves 73 cm, Length 56 cm, Shoulders 40 cm, Armpit 40 cm* — his own numbers,
about a garment he made. They stay as REFERENCE rather than as fit information,
because a person who wants to know how long a sleeve is should be able to find
out. The row simply does not appear on a piece that has none; there is no
placeholder, because a missing set is no longer a hole.

### The order

Contact details and the chosen size. A one-size piece carries no radio and no
hidden field: the order does not mention size, because there was nothing to
choose and a question with one answer is furniture. The Function clamps the
value to the six the studio offers, so a forged field cannot put a size he does
not cut into his inbox.

## 102. Two weeks, at most (2026-08-12)

His decision makes it necessary: the piece is made after the order, so the wait
is a fact the buyer must have and only he could give. **His number, our
sentence, flagged as ours.**

    Each piece is made after the order: two weeks at most before it ships.

It appears in **both places a person needs it**: on the piece, where they are
deciding, and on the confirmation, where they have committed and the question
becomes "what now". It is phrased as a MAXIMUM rather than a promise of speed —
"two weeks at most" cannot be missed by being early, and "in two weeks" can.


## 103. His four photographs, and three of them were already here (2026-08-12)

He sent four files named for their positions. **Three are re-exports of
photographs already in the dataset; one is new.**

    hp1-meet-our-creatures    3024x4032   = homepage_homepage (1).jpg   ALREADY HERE
    hp2-the-project           1536x2048   = 0d454a66-...jpg             ALREADY HERE
    hp3-body-of-light         1320x1778   = IMG_3485.PNG                ALREADY HERE
    hp4-our-skins             4284x5712   NEW — the first new photography in weeks

**sha1 said all four were new, and sha1 was useless**: a re-export changes every
byte. What answered the question was comparing the PICTURES — a downscaled
greyscale difference, then looking at the pairs. Three came back at 1.4 to 2.9
out of 255, which is JPEG noise; hp4 came back at 55, which is a different
photograph, confirmed by eye.

This is section 80's trap from the other side. There, a file that WAS new
arrived behind a key that had not changed, and every signal was green. Here,
three files that look new by every cheap signal are the same photographs.
**Neither question was answerable without looking at the picture.**

### What his placement resolved by accident

`hp3-body-of-light-ferdinando` is `IMG_3485.PNG` — **the worn band's frame 5,
the one that has had no linked piece since section 47 and sat on the open list
as an unidentified photograph.** It was never a piece. It is Ferdinando. The
tile is linked to no Creature deliberately: it is one of the two people who make
the brand, and sending a reader from his portrait to a product page would be
wrong.

### One photograph, three reasons

The first attempt gave each of his three reasons its own paired surface. With one
photograph available, the same skirt appeared twice and REBORN stood alone on
flat ground — exactly what section 82 forbids for a body-register passage.

They share one screen now, his photograph on one side and the three passages on
the other. They are one thought in three parts and his titles are the
punctuation between them, which is also what he called them.

## 104. The returns copy made silent (2026-08-12)

**The owner's instruction, and the reasoning is his:** do not try to make it
correct, because neither of us knows what correct is. Make it silent. **A site
that says less is not exposed; a site that says the wrong thing is.**

### What the site said, and why it could not stay

    "Returns accepted. The customer pays the return shipping."
    "Outside the EU, customs charges are normally paid by the customer."

Both are TERMS OF SALE. Both were written when the shop worked differently —
twice differently, in two days: made to measure with body measurements, then buy
what exists, then choose a size and he makes it. The first sentence implies a
returns regime; the second states who bears a cost. **Neither has been checked
by anyone since the shop changed**, and the customs line had carried our own
unconfirmed flag for a fortnight.

The withdrawal question is now the first item in the lawyer brief precisely
because nobody knows the answer (section 103). Copy that presumes one was live
on every piece page and on contact while the question was open.

### What it says now, and it is only what is certainly true

    Free worldwide shipping over 500 euro.     his fact, his words, unmarked
    For a return, write to us and we will      his fact, our wording, marked
    arrange it.
    Shipped worldwide. Handmade in South       the footer, unchanged
    Italy.

**No claim about withdrawal rights, no conditions, no duties.** The customs
field, its provisional flag, its studio control, its projection and its gate
check are all deleted rather than left empty — a field that exists invites
someone to fill it, and the next person to write that line should have to think
about it rather than complete it.

### What this costs, said plainly

A buyer outside the EU is no longer warned that duties may be theirs. That is a
real loss and it is the reason the line existed. It is accepted because the
warning was unconfirmed by the person who would have to honour it, and because
the terms of sale — where it belongs — are one of the documents the lawyer is
writing anyway.

## 105. The empty rooms, measured and closed (2026-08-13)

The owner looked at the deployed site at desktop width and said the text
sections were empty. **He was right, and nothing in this repository could have
told anyone**: the audit checks contrast, overflow, spill and flat bands between
two painted grounds, and a section that is mostly air is none of those. It is
valid, legible, and wrong.

`npm run shots -- --rhythm --viewports=1440,1920` now measures it — per section,
how tall it is, how tall its content is, and the difference — so this is a
number rather than an argument, before and after.

### What was actually wrong: the photograph was setting the room

`.paired` carried `min-height: 100svh`, and inside it the media's `height: 100%`
resolved to auto, so **the picture's own 3:4 set the section height**: a 720px
half is 960px tall at 1440, a 960px half is 1280px at 1920. Every paired section
was a screen and a bit whatever it held, and THE PROJECT — two sentences, 287px
of type — floated in the middle of it.

    THE PROJECT, text half        before          after
    1440                          960px tall      558px tall
                                  673px air 70%   271px air 49%
    1920                         1280px tall      640px tall
                                  993px air 78%   353px air 55%

The cap is on the MEDIA, not the section, so a longer passage still makes its own
room: the three reasons push the row past the cap and the photograph grows back
to fill it. The photograph crops to about 1.3:1, a long way from the 2.9:1
letterbox section 56 refused.

### The other rooms

- **The boundary wash was two screens**: `--wipe-pin: 100vh` on top of a held
  screen. That was right when crossing it INVERTED the page and the reader was
  paying for a change of world; since section 82 there is no inversion, and the
  owner named this screen as empty white space. **60svh**, and the mark grew
  from `min(34vw, 32rem)` to `min(48vw, 40rem)` so the screen is held for
  something rather than around nothing.
- **Blocks whose padding was written for a screen of prose**: the chapters
  heading (94% air), the chapter line (72%), the newsletter, the Instagram
  heading and the footer all went from `u13`/`u21` to `u8`/`u3`.

### The whole page, before and after

    1440    9006px -> 8603px      empty 2864px -> ~2000px
    1920   10413px -> 8725px      the page lost a screen and a half

**Read as one scroll it now reads as deliberate**: photograph, his words,
photograph and passage, the band, the three reasons beside their photograph. The
one screen that still measures 87% empty is the wash, and that is the held
moment — a reader scrolling meets a screen with his signature being written
across it, not a void.

### The unnamed tile in BODY OF LIGHT

The first frame is Ferdinando, identified this week, and it links to no Creature
because he is not a piece. But every other tile carries a name, so an unlabelled
one reads as a mistake rather than as a person.

**Three options were considered.** Labelling it with the piece he is wearing was
refused: nobody has said which piece that is, and guessing is the thing this
project does not do. Moving it out of the band was refused: the owner put it
there deliberately, replacing the red shirt. **It carries his name** — the same
label register as the garment names beside it, in a band called BODY OF LIGHT,
where a body is exactly what it shows.

## 106. Is the site under-animated? No. It was under-composed (2026-08-13)

Asked plainly, and answered plainly, because the owner has asked for more motion
for two days and most of it has been refused.

### The reading

**He is not describing a lack of motion. He is describing air, and the air was
real.** Two things say so.

**What he actually named**: "the section under the drawn signature", "three
short lines in a screenful of paper". Those are places, not moments. A person
who wants motion says the site feels dead; a person looking at 70% air says it
looks empty, and he said empty.

**And the measurements agreed with him.** THE PROJECT held 287px of type in a
960px column at 1440 and a 1280px one at 1920. The wash was two screens tall.
The page carried a screen and a half of nothing. Section 105 removed it, and it
was removed by composition — a cap on a photograph, four padding values and a
shorter hold — not by adding a single frame of animation.

**A site with three gestures and a film loop is not under-animated.** What it
was, at desktop, was under-composed: rules tuned when these sections were
full-bleed photographs with a caption, never re-judged when they became prose.

### So there is no fourth gesture, and that is the recommendation

Nothing was built here. The site already has, each happening once and all on one
curve: a photograph arriving, a tile becoming the piece it opens, the grid
settling when a filter changes, a line drawn under anything pointed at or
pressed, his signature written on the arrival, his signature written again by
the reader at the boundary, and a film loop on /process.

**A fourth would be decoration.** The honest test — does it carry meaning the
page cannot carry otherwise — is failed by everything left: there is no journey
without an answer, no state change without feedback, and no moment without a
gesture. Adding one would be answering a complaint that was about something
else, and the complaint has been fixed.

### What to say to him

That the emptiness he saw was real, that it is measured and gone — a screen and
a half of it — and that it was never a missing effect. If it still reads as
static after this, the next thing to change is the PHOTOGRAPHY on the two text
pages, not the animation: motion cannot fill a room, it can only cross one.

### THE VIDEO AS THE ARRIVAL: the answer has changed, but not because of
resolution

Section 90 refused this clip for the arrival on four counts. Three of them have
moved:

1. **Resolution** — 464px against a 1200px floor. **The camera original fixes
   this.** It is the only objection the original fixes.
2. **The luminance drift under the caption band** — this objection has largely
   DISSOLVED, and not because of the video. The arrival's words moved onto paper
   (section 89) and the drawn signature moved with them (section 96), so there
   is no longer any text over that photograph whose contrast a moving image can
   break. **What was the strongest argument against video on the arrival is
   mostly gone.**
3. **The first frame is a different picture from the poster** — solvable by
   using the loop's own first frame as the arrival's poster, which is what
   section 83 already requires.
4. **NOTHING IN THAT TAKE LOOPS.** First frame against last differs by 84.7 of
   255; the steadiest six-second window still ends 33.9 away. **The camera
   original does not fix this, because it is the content, not the encode.**

**So: yes, video on the arrival is now possible in a way it was not on 2026-08-11
— but not with this take at any resolution.** What it needs is a different
clip, and the spec is already in section 83: 6 to 10 seconds, camera locked off,
one material moving, first and last frame identical, no audio track, sent as the
camera original rather than through WhatsApp.

**That is the thing to ask him for.** If it arrives, the arrival can carry it.

## 107. Seen rather than measured: Rick Owens and Vivienne Westwood (2026-08-13)

Seventy-seven screenshots of the two reference sites, looked at page by page.
This project has measured these sites for a fortnight — type sizes, tracking,
the 19%-of-viewport signature — and had never SEEN them. What follows is what
the pictures show.

### Composition

**Rick Owens divides a screen in two, vertically, and lets each half be a whole
picture.** Not a photograph with a caption: two unrelated pictures at full
height, a portrait against white beside a portrait in acid green, each with one
word on it (EYEWEAR, BAGS). His editorial pages abandon that entirely for an
ASYMMETRIC MOSAIC: images at a third, a half, two thirds of the width, on white,
at different aspect ratios, with irregular white space around them. **Very
little of their photography is full-bleed.** It sits ON the page, framed by
white, which is what makes the white read as paper rather than as a gap.

**Vivienne Westwood composes in rows**: a full-bleed hero with centred type, then
a horizontal product carousel, then two half-width category tiles, then an
editorial row. More conventional, and denser per screen.

### Sequence

Rick Owens: full-bleed atmosphere → 2-up split → product grid → a long editorial
run that alternates text column and image cluster → full-bleed atmosphere again.
**The rhythm is not full-bleed / pair / full-bleed. It is one dense mosaic
sustained for many screens, bracketed by two atmospheric images.**

Vivienne Westwood: hero → carousel → category pair → heritage story → lookbook
grid → a large multi-column footer.

### Density

This is where the gap is widest and it is not a layout gap.

**Rick Owens puts two to four elements on every screen** of an editorial page: a
narrow text column, a process photograph, a product on white, an archival image.
**Vivienne Westwood's lookbook is a four-across grid** — eight full-length looks
visible at once, edge to edge, uncaptioned.

**Both can do this because every photograph in the run was shot the same way.**
The lookbook grid works because all thirty images share a ground, a distance and
a light. Ours cannot: our frames are concrete, studio, forest, night, at
different distances, in different light. Four of ours across a screen is a
contact sheet of different shoots.

### Product pages

**Neither folder contains one.** Fifty and twenty-eight screenshots, and not a
single product detail page in either — home, listings, editorial and lookbooks
only. **So the comparison he asked for cannot be made from this material**, and
guessing at it from a listing page would be inventing evidence.

What the listings do show: product on pale ground, three or four across, name
and price under, sizes and a QUICK BUY revealed on hover, a sticky FILTERS/SORT
bar. **Ours already matches that**, four across at xl and two on a phone.

### Text pages, which is our weakness

Their answer is the same on both sites and it is the opposite of ours.

**A narrow column — a third of the viewport at Rick Owens, closer to a half at
Westwood — carrying MANY paragraphs, beside a photograph.** Rick Owens sets an
entire show note, eight or ten paragraphs, in one column at about 11px uppercase
with tight leading. Westwood stacks five or six sentence-case serif paragraphs
against one image. **Neither ever gives a paragraph its own screen.**

Ours gave every paragraph its own screen. On /about that was four screens to
carry a hundred and twenty words.

### What was adopted tonight

- **/about is one column carrying his whole story** beside one photograph, in
  his order, unbroken — which is also what section 22 asks of that page — with
  the freed frames running below as a two-across mosaic. Four paired screens
  became one column and a mosaic.

### What cannot be adopted, and the owner's reading is right

- **The light is in the photograph, not the layout.** Their product grids read
  as light because every item is on white seamless under studio lighting. No
  arrangement of ours reproduces it; the same grid filled with our frames reads
  as a contact sheet.
- **Their density is made of material.** Dozens of video clips, thirty
  consistent lookbook frames, archival photography going back to 1971. We have
  one clip that cannot loop and no archive.
- **Copying a structure built for material we do not have produces an empty
  structure**, which is worse than what we have: our 4-across catalogue at xl
  already reads thinner than theirs for exactly this reason.

## 108. The reference pattern applied everywhere, and one word out of his text (2026-08-13)

Section 107 read the two reference sites and changed one page. This applies that
reading to the rest of the site, and it removes a sentence of his that the shop
made false.

### THE PAIRED SURFACE HAD A HOLE, AND THE CSS COMMENT DENIED IT

The most valuable thing in this session, because every check was green and the
comment argued the opposite of what the code did.

Section 105 found that the photograph was setting the room: `height: 100%` in a
grid row of automatic height resolves to auto, so a 720px half took the
picture's own 3:4 and became 960px at 1440, 1280px at 1920, whatever the passage
said. It capped the picture — `max-height: clamp(26rem, 62svh, 40rem)` — and
wrote, in the same commit:

> A LONGER PASSAGE STILL MAKES ITS OWN ROOM: the cap is on the media, not on the
> section, so the three reasons push the row past it and the photograph grows
> back to fill.

**It cannot.** A max-height is a ceiling. When the passage was TALLER than the
cap the row grew and the photograph stopped, and what filled the difference was
flat paper. Measured on the deployed build:

    home, the three reasons   1440   row 1038  photo  700   338px of empty half
    home, the three reasons   1920   row 1012  photo  682   330px
    /about, his whole story   1440   row  755  photo  660    95px

So the fix is not a better number. **The picture is taken out of the height
calculation entirely**: absolutely positioned in its half, it contributes
nothing to the row, fills whatever the passage decides, and `object-fit: cover`
does the rest. `min-height: 56svh` survives as the floor that catches a short
passage, and it is now the only thing standing between the composition and the
letterbox section 56 refused — 1.43:1 at 1440, 1.59:1 at 1920.

### AND THE FIRST VERSION OF THAT FIX DID NOTHING, SILENTLY

`position: absolute` went into `global.css`, inside `@layer components`, where
it lost to the `relative` utility `MediaSurface` puts on every figure. **This is
the trap section 5 already records — Tailwind utilities beat `@layer components`,
always (s67) — and it still cost a build.** The stylesheet compiled. The rule
was in `dist`. The selector matched. And the rows measured 960px and 1280px,
exactly the numbers the fix existed to remove.

It is a utility on the figure now, in `PairedSurface`, where nothing can outrank
it. **The general shape, which is worth more than the fix: a CSS rule that loses
a specificity contest fails exactly like a rule that was never written, and
every signal available — compiles, present, matches — is the same in both
cases.** Only geometry told the difference.

### `--rhythm` WENT BLIND THE MOMENT THE PHOTOGRAPH FILLED ITS BOX

Section 105 built `npm run shots -- --rhythm` to measure emptiness: the height of
a section against the union of every leaf inside it that paints. With the
photograph now filling its half edge to edge, that union is the whole box, so
**every paired composition on the site reports 0px empty however little the
passage says.**

It is section 5's second trap again, in a tool written to catch section 5's
second trap. Two questions — *is this section empty?* and *is the TEXT in this
section adrift inside it?* — had the same answer for as long as the picture was
shorter than the row, and stopped having it the day that changed.

So `--rhythm` now measures the halves separately, and prints the row against its
photograph so a hole cannot come back unseen:

    paired  row   504px  text   287px  gap   217px  THE PROJECT…
    paired  row  1038px  text   846px  gap   192px  OUR SKINS…

192px is the padding, u8 top and bottom, at every desktop width. Anything much
above it is the floor holding a short passage open, and that is the number worth
arguing about.

### WHAT THE REFERENCE PATTERN CHANGED ON THE REMAINING PAGES

**/process is one column carrying both passages beside one photograph.** It had
TWO paired surfaces in a row — his three making lines beside one frame, then our
stages paragraph beside another — and each was a handful of lines floating in
half a screen: the making passage measured 315px of text in a 960px row. The
page spent two full compositions and two of its photographs to say eight lines.
The two passages are one column now, in the order a reader needs them, and the
second anchor is back in the mosaic where it is a photograph rather than a
margin. The two voices stay separate inside the column: his lines are his, the
stages paragraph keeps its own draft mark directly above itself.

**/contact stops being a column of words alone on flat ground**, which is the
one arrangement `PairedSurface`'s own note says appears in none of the four
references. Measured at 1440 it was four facts and two short lines in a 1824px
page, with the footer repeating the handle and the email inside the same
screen — the page said everything it had, twice, in about a tenth of the room it
took. It is a column beside one frame now, photograph on the right so the two
addresses stay hard left where a reader looks for them.

**Which frame is OUR choice until he makes one.** `contactMedia` is a new studio
field and always wins; with nothing set the page takes the last frame of the
about sequence, and that fallback is flagged `contactFrame` in `inventedCopy`
exactly as our Instagram selection is. `npm run launch-check` names it until he
chooses. **With this dataset no frame was unused, so "pick an unused one" was
never available** — that is a material fact, not a layout one.

**Two blocks that gave a screen to something that had not earned it.** /process
opened on `min-h-[50svh]` with `justify-end` — 450px at 1440, 540px at 1920, all
of it above a display line and a label — and ended on `py-u13` around a single
12px link, 510px of paper for the one thing on the page asking to be clicked.
Both are the correction section 105 made to the home page's headings, applied to
the page it missed.

### SU MISURA COMES OUT OF HIS APPROVED TEXT, AS A MARKED EXCEPTION

The owner removed made to measure from the shop on 2026-08-12 (section 98). His
own sentence went on saying every piece is made to measure, on /about and on
/process, where a buyer reads it. **His words have not been ours to change for
twelve days and that rule is not lapsing here; it is taking one exception, with
the reason written down and the edit flagged**, on the same mechanism the name
order used (section 65).

What it said, verbatim:

    EN  In 100% vegetable-tanned leather, Made to Measure, handmade in South
        Italy. Every process is Artisan.
    IT  In pelle 100% conciata al vegetale, Su Misura, fatta a mano nel Sud
        Italia. Ogni processo è artigianale.

What it says now — **two words deleted, nothing added, nothing reordered**:

    EN  In 100% vegetable-tanned leather, handmade in South Italy. Every
        process is Artisan.
    IT  In pelle 100% conciata al vegetale, fatta a mano nel Sud Italia. Ogni
        processo è artigianale.

**Deleting was chosen over rewriting.** Anything we wrote into that gap would be
our sentence wearing his voice; a deletion leaves a true sentence that is still
entirely his words in his order.

**It was in TWO fields, not one.** The line is the third paragraph of `about`
AND the whole of `makingStatement`, which /process prints. Patching only `about`
would have left the same false claim on the other page.

**And it is seeded in two scripts.** `import-photos.mjs` and `patch-text.mjs`
both carried the original strings, so an import would have put "Su Misura" back
with every check green. Both were changed in the same commit, and both now carry
the original in a comment — capitalised, so a careless search-and-replace cannot
eat the record of what it changed.

The flag is `aboutMadeToMeasure`, the tool is `scripts/patch-made-to-measure.mjs`
(DRY by default), and the original is recorded in four places: that script, both
seeding scripts, and the `inventedCopy` field description in the studio, which
is where HE would act on it.

**Our own copy said the same false thing.** `shopIntro` — the line at the top of
the catalogue — read "Su misura, o disponibile subito." / "Made to measure, or
ready now.", offering a choice the shop stopped making. It is "Ogni pezzo esiste
già." / "Every piece already exists." now, and it was already flagged.

### THE IMPORT WAS QUIETLY UN-FLAGGING TWO OF OUR OWN STRINGS

Found while adding the new flag. `inventedCopy` is written WHOLE by
`import-photos.mjs`, so anything set in the studio and missing from that array is
silently cleared by an import. Two had drifted out of it — `processText`
(section 81) and `madeToMeasureLine` (section 98) — so a run of the import would
have stopped the gate counting our copy on two pages, with every check green.
Both are in the list now.

### ITEM 1 ON THE OPEN LIST IS CLOSED, AND IT WAS MINE

The footer said "Shipped worldwide." — ours, weaker, true of any shop — while
his own "Free worldwide shipping over 500 euro" was already approved, already in
the dataset, and already on /contact and in the banner. The blocker was that
`footerCopyIsDraft` is one boolean covering both footer lines, so putting his
words in that slot would have labelled them our draft.

**The per-line flag did not need building.** `inventedCopy` has carried
`footerShipping` and `footerOrigin` as separate keys since section 59 — the site
simply never projected the field, so the answer existed in the data and no page
could read it. It is projected now and each line asks about itself: his sentence
carries no mark, our origin line stays marked until he approves it, and our
shipping sentence survives as a fallback that would come back marked.

**What remains of item 1 is his**: the origin line, "Handmade in South Italy."

### TWO MORE OFF THE CHECKLIST, BOTH MINE

**The paired anchor on /process is `priority`.** That page opens on a title and
then a composition anchor, so its own first photograph — the LCP element — was
`loading="lazy"` at low fetch priority. It is a prop rather than a rule, because
on home and about the first paired surface is the second thing on the page and
marking it priority would compete with a real arrival. The mosaic's first frame
gave its `priority` up in the same change: two images declaring high fetch
priority is two images competing, and the one that wins is not the one on screen.

**The Italian accents.** Two errors, and only two, in the older interface
strings: "che gia possiedi" and "Ogni pezzo e fatto". Both corrected. The rest of
the file was already right, and the check that found them is worth keeping in
mind — scanning for a list of known unaccented forms rather than reading, because
a human reads past "e" for "è" every time.

**`npm run check` already includes a build.** The checklist item asking for it
was stale: the script has been `astro check && tsc -p functions --noEmit &&
astro build` since before this session.

**`{REF_CODE}` is not on any page.** THE OPEN LIST said "Every Creature shows
`{REF_CODE}`"; the built HTML contains it nowhere, because the field is absent
and every use is guarded. The decision is still his, but nothing is broken while
he takes it.
