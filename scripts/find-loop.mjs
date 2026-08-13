/*
  THE STEADIEST WINDOW IN A CLIP, AND HOW VISIBLE ITS CUT WOULD BE.

    node scripts/find-loop.mjs <clip.mov> [--min=2.0] [--fps=8]

  Section 83 asks for a clip whose beginning matches its end. None of the
  owner's eight does, whole. This looks for the best SUB-WINDOW instead, and —
  the important half — reports how bad the seam would be if you looped it
  anyway, in a number rather than an adjective.

  TWO MEASUREMENTS, because they fail differently:

  - ENDS: mean absolute difference between the window's first and last frame,
    on a 160x160 greyscale reduction, 0-255. This is what a viewer sees at the
    moment the loop jumps. Under about 4 nobody notices; by 10 it reads as a
    blink; past 20 it is a cut.

  - DRIFT: the same difference measured on the BORDER of the frame only —
    the outer 12% ring, which on every one of these clips is wall, floor or
    sky. A fixed camera holds its border still. This is what separates "the
    subject moved" from "the operator moved", and it is the one that cannot be
    fixed by choosing a different window.

  The score prefers a low seam, then a still camera, then length: a two-second
  window that loops invisibly beats a five-second one that lurches.

  WHY FRAMES ARE SAMPLED AT 8fps AND NOT EVERY FRAME. These are 60fps 4K files.
  At 8fps a 24-second clip is 192 frames and the search is 18,000 pairs, which
  is a few seconds; at 60fps it is a million pairs and forty minutes. The
  chosen window is then re-measured on its EXACT first and last frames, at full
  resolution, so the number reported is the real seam and not the sampled one.
*/
import {execFileSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const arg = (n, d) => {
  const a = process.argv.find((x) => x.startsWith(`--${n}=`));
  return a ? Number(a.split("=")[1]) : d;
};

const SIZE = 160;
const BORDER = Math.round(SIZE * 0.12);
const isBorder = (i) => {
  const x = i % SIZE;
  const y = (i / SIZE) | 0;
  return x < BORDER || x >= SIZE - BORDER || y < BORDER || y >= SIZE - BORDER;
};

const reduce = async (file) =>
  sharp(file).resize(SIZE, SIZE, {fit: "fill"}).greyscale().raw().toBuffer();

function diff(a, b, borderOnly) {
  let s = 0;
  let n = 0;
  for (let i = 0; i < a.length; i++) {
    if (borderOnly && !isBorder(i)) continue;
    s += Math.abs(a[i] - b[i]);
    n++;
  }
  return s / n;
}

export async function findLoop(clip, {min = 2.0, fps = 8} = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "loop-"));
  try {
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", clip, "-vf", `fps=${fps},scale=320:-2`,
      path.join(dir, "%04d.png")]);
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".png")).sort();
    if (files.length < 4) return null;
    const F = [];
    for (const f of files) F.push(await reduce(path.join(dir, f)));

    const MIN = Math.max(2, Math.round(min * fps));
    let best = null;
    for (let i = 0; i < F.length; i++) {
      for (let j = i + MIN; j < F.length; j++) {
        const ends = diff(F[i], F[j], false);
        let drift = 0;
        for (let k = i + 1; k <= j; k++) drift = Math.max(drift, diff(F[i], F[k], true));
        /* seam first, camera second, length third and only as a tie-break. */
        const score = ends * 1.0 + drift * 0.6 - ((j - i) / fps) * 0.25;
        if (!best || score < best.score) best = {i, j, ends, drift, score};
      }
    }
    if (!best) return null;
    const start = best.i / fps;
    const end = best.j / fps;

    /* Re-measure the real seam on the exact frames, full resolution. */
    const exact = path.join(dir, "exact");
    fs.mkdirSync(exact);
    for (const [n, t] of [["a", start], ["b", end]]) {
      execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(t), "-i", clip,
        "-frames:v", "1", path.join(exact, `${n}.png`)]);
    }
    const [ra, rb] = await Promise.all([
      reduce(path.join(exact, "a.png")),
      reduce(path.join(exact, "b.png")),
    ]);
    const seam = diff(ra, rb, false);
    const verdict = seam < 4 ? "INVISIBLE" : seam < 10 ? "a blink" : seam < 20 ? "VISIBLE" : "a cut";
    return {start, end, length: end - start, seam, drift: best.drift, verdict};
  } finally {
    fs.rmSync(dir, {recursive: true, force: true});
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const clips = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  console.log("clip".padEnd(22), "window".padEnd(18), "seam".padEnd(8), "drift".padEnd(8), "reads as");
  for (const c of clips) {
    const r = await findLoop(c, {min: arg("min", 2.0), fps: arg("fps", 8)});
    if (!r) { console.log(path.basename(c).padEnd(22), "too short"); continue; }
    console.log(
      path.basename(c).slice(0, 20).padEnd(22),
      `${r.start.toFixed(2)}s-${r.end.toFixed(2)}s`.padEnd(18),
      r.seam.toFixed(1).padEnd(8),
      r.drift.toFixed(1).padEnd(8),
      r.verdict,
    );
  }
}
