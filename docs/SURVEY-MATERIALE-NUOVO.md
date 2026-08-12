# The new material, verified file by file

Two folders arrived on 2026-08-12 under `~/Desktop/Aleksander Cecco/`:
`MODELLI/` (three AI-processed cut-outs) and `video/` (eight clips, seven
photographs). Everything below was measured or looked at directly. Nothing here
is inferred from a filename.

---

## MODELLI — the cut-outs, and THREE OF SIX FIGURES ARE ALTERED

Three PNG files, but **six figures**: the files are composites, not one garment
each. Each figure was put beside the photograph it came from and compared on the
things that carry — the raw hem, the seams, the hardware, the drape.

**The originals were found in the site's own dataset**, which is the
authoritative copy of his photography. Frame keys below are the site's images.

### USABLE — the garment is his and it is unaltered

**1. Man, white mesh top and cream trousers** — `cut-1`, whole file.
Original: the studio frontal (`3024x4032`). **Match.** The rucked hem of the
mesh top, the drawstring position, every crease and soil mark on the trousers,
the rings, the necklace — all correspond. The trouser hems are cut at the floor
line where the original showed the shoes; nothing is invented, only cropped.
**1150px tall, 394px wide. Edge clean; a faint halo in the hair.**

**2. Woman, black leather shirt and pale jeans** — `cut-2`, left figure.
Original: the shutter-wall frontal (`1200x1600`). **Match, and the hem proves
it:** the raw scalloped edge corresponds notch for notch, the press-studs sit in
the same positions, and the FERDRESSED label is in the same place at the
waistband. **648px tall, ~330px wide.** The label's lettering has been smoothed
away by upscaling — a resolution loss, not a redraw.

**3. Woman seated, black leather shirt worn as a dress** — `cut-2`, middle.
Original: the sea-rock frame (`1067x1600`). **Match.** Same pose, same garment,
same collar and cuff. **648px tall, ~400px wide.** One defect: **a severed foot
from the neighbouring figure is left floating at the right edge of the file** —
a compositing artefact, easily cropped.

### ALTERED — NOT USED, awaiting the owner's decision

**4. Man, frontal, black shirt and cream shorts** — `cut-2`, right figure.
**This is not a cut-out. The pose does not exist in any photograph.** The only
frame of this outfit shows him in three-quarter profile against a white wall,
wearing sunglasses, one hand raised. The cut-out is frontal, symmetrical, legs
apart, hands at the waist, no sunglasses, direct gaze.

*What was lost, measured against the real garment on its hanger:* the shorts
have **no belt loops, no yoke seam and no waistband topstitching** — all three
are plainly there on the original. The chunky metal zip with visible teeth has
become **a smooth black bar**. The leather's real creasing has become a generic
swirled marbling. **The hands are malformed**, fingers merging into the sleeve.

**5. Woman, black fur top and leather trousers** — `cut-3`, left figure.
Original: the forest frame (`1200x1600`). **The fur is re-rendered.** His
photograph shows a dense, matted pelt lying flat with a blunt, uneven raw edge.
The cut-out has **separated spiky strands fanning out along the bottom edge** —
a different material. The studded leather collar is changed, and the face is
regenerated: **eyes open in the cut-out, closed in the photograph.**

**6. Woman, red Rubedo shirt and black leather trousers** — `cut-3`, right.
Original: the studio full-length (`2882x3843`). **The raw hem is redrawn.** His
is a deep, asymmetric scallop with long irregular tongues; the cut-out is a
**symmetric batwing curve of clean arcs meeting at a centre point.** The bell
sleeves have gained **regular, evenly-spaced corrugated ripples** that do not
exist in the original, and the leather has been given a hard specular sheen.
The model's proportions are also changed.

> **On a brand whose claim is the raw cut, this is the worst of the three.**
> RUBEDO is the piece whose own caption says *500 handmade scar-stitch*. Its
> tidied hem is a lie about exactly the thing the piece is sold on.

### THE RULE THIS SETS

**A background-removal tool is a re-drawing tool wearing a cutting tool's
name.** Three of six figures came back changed, and the changes were always in
the same direction: edges regularised, hardware simplified, surfaces made
glossy. **Every future cut-out gets compared to its original at the hem before
it is used.** The three that passed passed on the hem; the three that failed
failed on the hem.

---

## video — EIGHT CLIPS, AND NONE OF THEM LOOPS

Measured with `ffprobe`, then frame-by-frame: first, middle and last frames
extracted from each, and the camera's own stillness measured on the border of
the frame (a fixed camera keeps its background constant).

**Against the section 83 spec** — phone still on a support, one thing moving,
beginning and end alike, no audio, camera original.

| file | length | format | verdict |
|---|---|---|---|
| `IMG_0143` | 3.07s | **720x1280**, h264 30fps, audio | **NO.** The only low-resolution clip, and the camera drifts throughout. |
| `IMG_0263` | 6.39s | 3840x2160 HEVC 60fps, audio | **NO, but the closest.** Camera nearly fixed (border drift 5.9). Hands enter, handle the garment and leave — so the first frame has an arm and the last has none. |
| `IMG_0271 copy` | 24.13s | 3840x2160 HEVC 60fps, audio | **NO as a loop.** Hand-held, framing travels from full figure to close crop and back. **It is a film, and a good one.** |
| `IMG_0271` | — | **0 bytes** | **Empty file.** The `copy` is the real one. |
| `IMG_1426` | 5.79s | 3840x2160 HEVC 60fps, audio | **NO.** Hand-held pan across the garment. |
| `IMG_2046` | 7.10s | 3840x2160 HEVC 60fps, audio | **NO.** Walking hand-held move; the frame changes completely. |
| `IMG_7508` | 7.84s | 3840x2160 HEVC 60fps, audio | **NO.** Walk-around of a full look. |
| `IMG_9150` | 9.18s | 1920x1080 HEVC 60fps, audio | **NO.** Hand-held; a zip being opened, camera travelling. |

**Then the folder was searched for ANY loopable window**, not just whole clips:
every window of 2.5s or more was scored on how closely its two ends match and
how still the camera holds across it. **The best window in the entire folder is
`IMG_0263` at 1.5s–4.0s, and it still fails both thresholds.**

> **So no clip is put on a loop anywhere, and none is forced.** The camera
> original problem is solved — these are 4K60 files, not the 464px messaging-app
> copy — but the *stillness* problem is not. **What is missing is a tripod, not
> a camera.**

**Every first frame can serve as its own poster**: all eight open on the subject
in frame, correctly exposed. None opens on a blur or a lens cap.

**Audio is present on every clip** and is stripped wherever one is used: the
site plays nothing.

### The seven photographs

| file | size | what it shows | where it belongs |
|---|---|---|---|
| `IMG_0001` | 1536x2048 | Black leather shirt worn, from behind, against the shutter — hands clasped, zipped cuffs visible | **BODY OF LIGHT.** A worn frame the band does not have. |
| `IMG_0019` | 1536x2048 | Leather mini skirt and knee boots, from behind, hard sunlight on concrete | **BODY OF LIGHT** |
| `IMG_0129` | 1536x2048 | Leather trousers on a hanger, close, waistband and scalloped yoke | Catalogue / a Creature's detail frame |
| `IMG_0135` | 1536x2048 | The same trousers full length on the hanger, raw hems | Catalogue |
| `IMG_5998` | **4284x5712** | Man against a whitewashed wall at dusk, black leather shirt, cream cropped trousers, harbour and red sky behind | **The strongest new frame.** Full-bleed capable at any width. |
| `IMG_7470` | **4284x5712** | Woman in the red fur top and black leather shorts, studio, rails behind | **BODY OF LIGHT** |
| `IMG_7556` | **4284x5712** | The same look from behind, three-quarter, boots | **BODY OF LIGHT** |

**Note on the count:** eight `.mov` entries but one is a 0-byte file, and seven
`.heic` rather than eight.
