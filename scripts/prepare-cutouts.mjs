/*
  CUT-OUTS, MADE READY FOR THE PAGE.

    node scripts/prepare-cutouts.mjs <in-dir> <out-dir> [--figures]

  It does three things, in this order, and the first is the one that matters.

  1. THE GROUND IS KNOCKED OUT TO ALPHA, so the page shows through.

     The tool the owner uses returns a cut-out on PURE WHITE. The site's paper
     is #fafaf8. Those two whites do not match, so every cut-out read as a
     rectangle pasted onto the page — a hard edge all the way round, exactly
     the "card" this site refuses everywhere else.

     FLATTENING ONTO PAPER DOES NOT FIX IT, and that was the first attempt:
     `flatten` fills TRANSPARENT pixels, and these files have no transparency at
     all. The white is painted, so flatten is a no-op and the box survives.

     A GLOBAL WHITE KEY WOULD EAT THE GARMENTS. The two pieces that most need
     this treatment are a WHITE mesh top and CREAM trousers; keying every white
     pixel would hollow them out. So the fill starts at the BORDER and spreads
     only through connected near-white pixels. An interior white is enclosed by
     the garment's own edge and is never reached.

     The cleared pixels keep the PAPER colour as well as alpha 0, so anything
     downstream that drops alpha — a JPEG conversion, an old viewer — lands on
     the site's ground rather than on white. The failure mode is the old
     behaviour, not a worse one.

  2. IT IS TRIMMED TO THE FIGURE AND RE-PADDED EVENLY, so the white around the
     shape is the composition's rather than the tool's. `RO40` gives a cut-out
     room; it does not give it a tight box.

  3. `--figures` SPLITS A COMPOSITE. The tool sometimes returns several figures
     in one file. Columns with no ink for a run of 14px or more are treated as
     the gap between figures.

  WHAT THIS SCRIPT DOES NOT DO IS DECIDE WHETHER A CUT-OUT IS HONEST. Three of
  the first six came back with the garment REDRAWN — a raw hem straightened, a
  zip's teeth gone, a fur rebuilt as strands. That is a judgement made by
  looking, against the source photograph, at the hem. See
  docs/SURVEY-MATERIALE-NUOVO.md. Running this on a redrawn cut-out produces a
  beautifully prepared lie.
*/
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PAPER = {r: 250, g: 250, b: 248};
/*
  HOW FAR FROM WHITE STILL COUNTS AS GROUND. 14 was arrived at by running the
  set: below about 8 the tool's own JPEG-ish noise leaves a speckled halo, and
  above about 20 the fill starts eating the pale trousers where they meet the
  ground in shadow.
*/
const TOL = Number(process.env.CUTOUT_TOLERANCE ?? 14);

export async function knockout(inFile) {
  const {data, info} = await sharp(inFile).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  const {width: W, height: H, channels: C} = info;
  const near = (i) =>
    data[i] >= 255 - TOL && data[i + 1] >= 255 - TOL && data[i + 2] >= 255 - TOL;

  const bg = new Uint8Array(W * H);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const p = y * W + x;
    if (bg[p] || !near(p * C)) return;
    bg[p] = 1;
    stack.push(p);
  };
  for (let x = 0; x < W; x++) {
    push(x, 0);
    push(x, H - 1);
  }
  for (let y = 0; y < H; y++) {
    push(0, y);
    push(W - 1, y);
  }
  while (stack.length) {
    const p = stack.pop();
    const x = p % W;
    const y = (p / W) | 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  let cleared = 0;
  for (let p = 0; p < W * H; p++) {
    if (!bg[p]) continue;
    const i = p * C;
    data[i] = PAPER.r;
    data[i + 1] = PAPER.g;
    data[i + 2] = PAPER.b;
    data[i + 3] = 0;
    cleared++;
  }
  return {
    buffer: await sharp(data, {raw: {width: W, height: H, channels: C}}).png().toBuffer(),
    W,
    H,
    clearedPct: (cleared / (W * H)) * 100,
    bg,
  };
}

/** Column runs that carry ink, so a composite can be split into its figures. */
function figureRuns(bg, W, H, gap = 14) {
  const ink = new Array(W).fill(0);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!bg[y * W + x]) ink[x]++;
  const runs = [];
  let start = null;
  let blank = 0;
  for (let x = 0; x < W; x++) {
    if (ink[x] > 3) {
      if (start === null) start = x;
      blank = 0;
    } else if (start !== null) {
      blank++;
      if (blank > gap) {
        runs.push([start, x - blank]);
        start = null;
      }
    }
  }
  if (start !== null) runs.push([start, W - 1]);
  return runs.filter(([a, b]) => b - a > 40);
}

/** Trim the transparent ground back to the figure, then pad it evenly. */
async function trimAndPad(buf, outFile) {
  const t = await sharp(buf).trim({threshold: 1}).toBuffer();
  const m = await sharp(t).metadata();
  const pad = Math.round(Math.max(m.width, m.height) * 0.12);
  await sharp(t)
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: {...PAPER, alpha: 0},
    })
    .png({compressionLevel: 9})
    .toFile(outFile);
  return sharp(outFile).metadata();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [inDir, outDir] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const SPLIT = process.argv.includes("--figures");
  if (!inDir || !outDir) throw new Error("usage: prepare-cutouts.mjs <in-dir> <out-dir> [--figures]");
  fs.mkdirSync(outDir, {recursive: true});

  const files = fs.readdirSync(inDir).filter((f) => /\.png$/i.test(f)).sort();
  for (const [n, f] of files.entries()) {
    const ko = await knockout(path.join(inDir, f));
    const stem = `cut-${String(n + 1).padStart(2, "0")}`;
    const runs = SPLIT ? figureRuns(ko.bg, ko.W, ko.H) : [[0, ko.W - 1]];
    for (const [i, [a, b]] of runs.entries()) {
      const name = runs.length > 1 ? `${stem}${String.fromCharCode(97 + i)}.png` : `${stem}.png`;
      const slice = await sharp(ko.buffer)
        .extract({left: a, top: 0, width: b - a + 1, height: ko.H})
        .png()
        .toBuffer();
      const m = await trimAndPad(slice, path.join(outDir, name));
      console.log(
        `${f.slice(0, 30).padEnd(32)} -> ${name.padEnd(12)} ${m.width}x${m.height}` +
          `  ground ${ko.clearedPct.toFixed(1)}%`,
      );
    }
  }
}
