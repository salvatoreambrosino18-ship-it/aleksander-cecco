/*
  THE ICON RENDERER.

    npm run icons           regenerate the PNGs from the SVG, and prove them
    npm run icons -- --check  render, compare against disk, write nothing

  Section 74: a 180x180 touch icon shipped that was a downscaled 1500x900 PAGE
  SCREENSHOT, the mark sitting tiny in one corner. The cause was a renderer
  shared with other work, whose viewport was whatever the last job had set. The
  SVG was checked by eye; the PNGs were assumed to have followed.

  So this exists, and it holds to three rules:

    1. ONE SOURCE. Both PNGs are rendered from favicon.svg, the same file the
       browser gets. There is no second drawing to drift from the first, and
       swapping the monogram (section 71: two candidates in docs/monogram/,
       the owner's pick pending) means replacing that one file and running this.

    2. NO VIEWPORT. There is no page and no browser. The size is an argument to
       the rasteriser, so it cannot be inherited from anything else, and the
       output IS the icon rather than a picture of one.

    3. PROVE, DO NOT TRUST. Every output is read back: its IHDR is decoded for
       the true pixel size, and its pixels are measured for ink coverage and
       polarity. A pipeline that silently produced a blank or inverted square
       would fail here rather than at the owner's home screen.

  It also writes docs/monogram/icons-at-sizes.png, the mark at 180/64/32/16 on
  both grounds. LOOK AT IT. The checks below prove the file is not empty and not
  inverted; they cannot tell you the A has stopped reading as an A.

  Note the two polarities. The touch icon is ink on paper, like the site in its
  light theme. The 512 is paper on ink, because the manifest declares
  background_color #0A0A0A and an icon on the wrong ground shows as a pale
  square floating on the brand's black.
*/
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ICONS = path.join(ROOT, "src/assets/icons");
const SOURCE = path.join(ICONS, "favicon.svg");

// tokens.css: --ink / --paper. The icons are brand furniture, not photographs,
// and these are the only two colours the brand has.
const INK = {r: 0x0a, g: 0x0a, b: 0x0a};
const PAPER = {r: 0xfa, g: 0xfa, b: 0xf8};

// The SVG carries `path { fill: #0A0A0A }` with a prefers-color-scheme override
// for the browser. A rasteriser has no colour scheme to prefer, so both grounds
// are built here from the alpha channel instead: whatever fill the SVG happens
// to declare, the mark is drawn in `mark` and the ground filled with `ground`.
const TARGETS = [
  {file: "apple-touch-icon.png", size: 180, mark: INK, ground: PAPER},
  {file: "icon-512.png", size: 512, mark: PAPER, ground: INK},
];

/*
  THE CONVENTIONAL PATHS, restored 2026-08-10 (section 78) after they were
  deleted in section 74 for a reason that was correct and incomplete.

  s74 deleted every fixed-path icon so that no URL could serve a stale byte.
  That is right about CACHES and wrong about BROWSERS. iOS Safari does not use
  an SVG `rel=icon` for a tab, and a great deal of software — Safari's own
  surfaces, link-preview bots, feed readers — asks for /apple-touch-icon.png and
  /favicon.ico at the ROOT whatever the document says.

  And deleting them made it worse than absent, not better. Cloudflare's edge had
  those paths cached with a seven-day s-maxage, so for a week after the deploy
  the origin returned 404 and the EDGE returned the old files: measured at
  `age: 423368` — 4.9 days — serving the broken corner-stamped touch icon from
  before the s74 fix, to a first-time visitor in a private window with no cache
  of their own. That is exactly what the owner kept seeing.

  So both shapes are written from the SAME SVG by this one script:

    src/assets/icons/*   imported, content-hashed, what the document declares
    public/*             fixed paths, what software asks for regardless

  The fixed paths cannot go stale invisibly — which was s74's real fear —
  because `--check` regenerates both and compares both, and a drift fails.
*/
const PUBLIC = path.join(ROOT, "public");

const SHEET = path.join(ROOT, "docs/monogram/icons-at-sizes.png");
const SHEET_SIZES = [180, 64, 32, 16];

const check = process.argv.includes("--check");

/*
  Render the SVG's SHAPE, discarding its colour.

  The rasteriser is given a density rather than a pixel size, so it is worth
  being explicit: favicon.svg has a 512 viewBox and no width/height, which makes
  its intrinsic size 512px at the CSS default of 96dpi. Multiplying the density
  supersamples; the resize then lands exactly on `size`, so the result is both
  exact and cleanly antialiased. `resize` is given both dimensions and the SVG
  is square, so nothing can letterbox.
*/
const SUPERSAMPLE = 4;

async function renderMask(size) {
  const density = Math.round(96 * (size / 512) * SUPERSAMPLE);
  const raster = await sharp(fs.readFileSync(SOURCE), {density})
    .resize(size, size, {fit: "fill"})
    .ensureAlpha()
    .raw()
    .toBuffer({resolveWithObject: true});
  return raster;
}

async function renderIcon({size, mark, ground}) {
  const {data, info} = await renderMask(size);
  // Composite by hand rather than with flatten(): the SVG's own fill is thrown
  // away and only its coverage kept, which is what makes one file serve two
  // grounds. `a` is the antialiased coverage of the stroke at this pixel.
  const out = Buffer.allocUnsafe(size * size * 3);
  for (let i = 0, o = 0; i < data.length; i += info.channels, o += 3) {
    const a = data[i + 3] / 255;
    out[o] = Math.round(ground.r + (mark.r - ground.r) * a);
    out[o + 1] = Math.round(ground.g + (mark.g - ground.g) * a);
    out[o + 2] = Math.round(ground.b + (mark.b - ground.b) * a);
  }
  return sharp(out, {raw: {width: size, height: size, channels: 3}})
    .png({compressionLevel: 9})
    .toBuffer();
}

/*
  A REAL .ico, because /favicon.ico is the one path every browser has always
  asked for and it was answering with the site's 404 page: 49,969 bytes of HTML
  with `content-type: text/html`, on every cold visit that probed it.

  The container is trivial and worth writing rather than adding a dependency:
  a 6-byte header, one 16-byte directory entry per image, then the images. PNG
  payloads inside an ICO are understood by everything current, and the three
  sizes are the ones tabs, bookmarks and pinned shortcuts actually use.
*/
async function ico(sizes, target) {
  const pngs = [];
  for (const size of sizes) pngs.push(await renderIcon({...target, size}));

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(pngs.length, 4);

  const directory = Buffer.alloc(16 * pngs.length);
  let offset = header.length + directory.length;
  pngs.forEach((png, i) => {
    const at = i * 16;
    // 0 means 256 in this field; none of our sizes reach it, but be exact.
    directory[at] = sizes[i] >= 256 ? 0 : sizes[i];
    directory[at + 1] = sizes[i] >= 256 ? 0 : sizes[i];
    directory[at + 2] = 0; // palette size
    directory[at + 3] = 0; // reserved
    directory.writeUInt16LE(1, at + 4); // colour planes
    directory.writeUInt16LE(32, at + 6); // bits per pixel
    directory.writeUInt32LE(png.length, at + 8);
    directory.writeUInt32LE(offset, at + 12);
    offset += png.length;
  });

  return Buffer.concat([header, directory, ...pngs]);
}

/*
  Read the size back out of the PNG rather than out of the variable that was
  meant to set it. IHDR is the first chunk after the 8-byte signature: 4 bytes
  length, 4 bytes type, then width and height as big-endian uint32. This is the
  one measurement the broken icon would have failed, and it costs four lines.
*/
function ihdr(png) {
  const sig = "89504e470d0a1a0a";
  if (png.subarray(0, 8).toString("hex") !== sig) throw new Error("not a PNG");
  if (png.subarray(12, 16).toString("ascii") !== "IHDR") throw new Error("no IHDR");
  return {width: png.readUInt32BE(16), height: png.readUInt32BE(20)};
}

/*
  Measure what was actually drawn.

  Coverage guards the blank square: if the rasteriser fails to find a path, or a
  future SVG lands entirely outside its own viewBox, this is 0. Polarity guards
  the invert: the mark must be the minority of the image and must sit on the
  correct side of its ground, so a 512 that came out ink-on-paper is caught
  before it is written rather than after it is installed.
*/
async function measure(png, size, {mark, ground}) {
  const lum = (c) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
  const markIsLighter = lum(mark) > lum(ground);
  const mid = (lum(mark) + lum(ground)) / 2;
  const {data, info} = await sharp(png).raw().toBuffer({resolveWithObject: true});

  let marked = 0;
  let x0 = size, y0 = size, x1 = -1, y1 = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      const l = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      const isMark = markIsLighter ? l > mid : l < mid;
      if (!isMark) continue;
      marked++;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  return {coverage: marked / (size * size), box: {x0, y0, x1, y1}};
}

async function proof(target, png) {
  const {size} = target;
  const {width, height} = ihdr(png);
  if (width !== size || height !== size) {
    throw new Error(`${target.file}: IHDR says ${width}x${height}, wanted ${size}x${size}`);
  }

  const {coverage, box} = await measure(png, size, target);

  // The extracted monogram covers ~6% of its square. The bounds are wide: this
  // is a blank-and-inverted check, not a taste check, and a redrawn candidate
  // with a heavier hand should not have to move them.
  if (coverage < 0.02) {
    throw new Error(`${target.file}: only ${(coverage * 100).toFixed(2)}% marked — the square is effectively blank`);
  }
  if (coverage > 0.6) {
    throw new Error(`${target.file}: ${(coverage * 100).toFixed(1)}% marked — the ground and the mark are the wrong way round`);
  }

  // The mark should reach most of its square. A corner stamp — section 74's
  // actual bug — leaves a box far smaller than the icon.
  const spanX = (box.x1 - box.x0 + 1) / size;
  const spanY = (box.y1 - box.y0 + 1) / size;
  if (spanX < 0.5 || spanY < 0.5) {
    throw new Error(
      `${target.file}: the mark spans only ${(spanX * 100) | 0}%x${(spanY * 100) | 0}% of the icon — this is the corner-stamp failure`,
    );
  }
  return {coverage, spanX, spanY};
}

async function sheet() {
  // Both grounds, largest first, so the eye can walk down to 16 and decide
  // whether it is still his gesture. Gap and margin in paper so the ink tiles
  // read as tiles.
  const gap = 16;
  const rows = [
    {mark: INK, ground: PAPER},
    {mark: PAPER, ground: INK},
  ];
  const width = gap + SHEET_SIZES.reduce((n, s) => n + s + gap, 0);
  const rowH = SHEET_SIZES[0] + gap;
  const height = gap + rows.length * rowH;

  const composites = [];
  for (const [row, {mark, ground}] of rows.entries()) {
    let left = gap;
    for (const size of SHEET_SIZES) {
      composites.push({
        input: await renderIcon({size, mark, ground}),
        left,
        // sit each size on a shared baseline, as in docs/monogram/*-at-sizes.png
        top: gap + row * rowH + (SHEET_SIZES[0] - size),
      });
      left += size + gap;
    }
  }

  const png = await sharp({
    create: {width, height, channels: 3, background: {r: 0x80, g: 0x80, b: 0x80}},
  })
    .composite(composites)
    .png({compressionLevel: 9})
    .toBuffer();

  fs.writeFileSync(SHEET, png);
  return {width, height};
}

async function main() {
  console.log(`\nIcons from ${path.relative(ROOT, SOURCE)}\n`);

  let drift = false;

  for (const target of TARGETS) {
    const png = await renderIcon(target);
    const {coverage, spanX, spanY} = await proof(target, png);
    const dest = path.join(ICONS, target.file);
    const polarity = target.mark === INK ? "ink on paper" : "paper on ink";
    const measured = `${target.size}x${target.size} proven by IHDR, ${(coverage * 100).toFixed(1)}% marked, spans ${(spanX * 100) | 0}%x${(spanY * 100) | 0}%, ${polarity}`;

    if (!check) {
      fs.writeFileSync(dest, png);
      console.log(`  wrote  ${target.file.padEnd(22)} ${measured}`);
      continue;
    }

    const onDisk = fs.existsSync(dest) ? fs.readFileSync(dest) : null;
    if (!onDisk) {
      drift = true;
      console.log(`  MISSING ${target.file.padEnd(21)} ${measured}`);
      continue;
    }
    const same = onDisk.equals(png);
    if (!same) drift = true;
    console.log(`  ${same ? "same  " : "DIFFERS"} ${target.file.padEnd(22)} ${measured}`);
  }

  /*
    THE FIXED PATHS, from the same renders. Written and checked in the same
    loop as the hashed ones so the two shapes cannot describe different marks.
    `precomposed` is the same bytes under the other name iOS has always probed.
  */
  const touch = TARGETS.find((t) => t.file === "apple-touch-icon.png");
  const large = TARGETS.find((t) => t.file === "icon-512.png");
  const fixed = [
    {file: "favicon.svg", bytes: fs.readFileSync(SOURCE), note: "the source SVG, verbatim"},
    {file: "favicon.ico", bytes: await ico([16, 32, 48], touch), note: "16/32/48, ink on paper"},
    {file: "apple-touch-icon.png", bytes: await renderIcon(touch), note: "180, ink on paper"},
    {file: "apple-touch-icon-precomposed.png", bytes: await renderIcon(touch), note: "180, the name iOS also probes"},
    {file: "icon-512.png", bytes: await renderIcon(large), note: "512, paper on ink"},
  ];

  for (const item of fixed) {
    const dest = path.join(PUBLIC, item.file);
    if (!check) {
      fs.writeFileSync(dest, item.bytes);
      console.log(`  wrote  public/${item.file.padEnd(31)} ${item.note}`);
      continue;
    }
    const onDisk = fs.existsSync(dest) ? fs.readFileSync(dest) : null;
    const same = onDisk?.equals(item.bytes) ?? false;
    if (!same) drift = true;
    console.log(`  ${same ? "same  " : "DIFFERS"} public/${item.file.padEnd(31)} ${item.note}`);
  }

  if (!check) {
    const {width, height} = await sheet();
    console.log(`\n  wrote  ${path.relative(ROOT, SHEET)} (${width}x${height})`);
    console.log("  LOOK AT IT. The checks above prove the file is not blank and not");
    console.log("  inverted; only your eye can say the A still reads as an A.\n");
  } else {
    console.log(
      drift
        ? "\n  The icons on disk are not what this renders. Run without --check, then LOOK.\n"
        : "\n  The icons on disk are exactly what this renders.\n",
    );
    process.exit(drift ? 1 : 0);
  }
}

await main();
