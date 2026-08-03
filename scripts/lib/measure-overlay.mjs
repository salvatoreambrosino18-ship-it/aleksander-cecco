/*
  Choose paper or ink per photograph by measuring it, not by looking at it.

  WHERE it measures matters more than how. The fixed chrome, signature and MENU,
  sits in the TOP LEFT, and object-fit cover crops every photograph to the
  viewport, so the pixels under the chrome on a phone are a centre column of the
  file, not the whole frame. Measuring the wrong region is exactly the mistake
  made on 2026-08-02, which put four values in and two of them backwards
  (DESIGN-PLAN section 14).

  TWO BANDS since 2026-08-03. The chrome is at the top and the caption is at the
  bottom, and a single value measured at the top and used at both ends is what
  made eight captions unreadable (DESIGN-PLAN section 58).

  So: take the centre column a phone would show, take the band where the marks
  sit, and compare the WCAG contrast of paper and ink against it.

  It renders in headless Chrome because that is the only image decoder on this
  machine that needs no dependency. It is a build-time tool for an operator, not
  something the site ever runs.
*/
import {spawn} from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {pathToFileURL} from "node:url";

const L_PAPER = 0.9563; // #FAFAF8
const L_INK = 0.0033; // #0A0A0A
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

export async function measureOverlay(files, {port = 9900} = {}) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "ac-measure-"));
  const page = path.join(dir, "measure.html");
  await fs.writeFile(page, "<!doctype html><meta charset=utf-8><title>m</title>");

  const chrome = spawn(
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    [
      "--headless=new",
      `--remote-debugging-port=${port}`,
      "--disable-gpu",
      "--no-first-run",
      "--allow-file-access-from-files",
      `--user-data-dir=${path.join(dir, "profile")}`,
      "about:blank",
    ],
    {stdio: "ignore"},
  );

  const endpoint = await (async () => {
    for (let i = 0; i < 80; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`);
        if (res.ok) return (await res.json()).webSocketDebuggerUrl;
      } catch {}
      await new Promise((r) => setTimeout(r, 250));
    }
    throw new Error("headless Chrome did not start");
  })();

  const ws = new WebSocket(endpoint);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      const {resolve, reject} = pending.get(m.id);
      pending.delete(m.id);
      m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
    }
  };
  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const msg = {id: ++id, method, params, ...(sessionId ? {sessionId} : {})};
      pending.set(msg.id, {resolve, reject});
      ws.send(JSON.stringify(msg));
    });

  const {targetId} = await send("Target.createTarget", {url: pathToFileURL(page).href});
  const {sessionId} = await send("Target.attachToTarget", {targetId, flatten: true});
  await send("Runtime.enable", {}, sessionId);
  await new Promise((r) => setTimeout(r, 800));

  const results = new Map();
  for (const file of files) {
    const expression = `(async () => {
      const img = new Image();
      // pathToFileURL, because the source folder has spaces in its name
      img.src = ${JSON.stringify(pathToFileURL(file).href)};
      await img.decode();
      const W = img.naturalWidth, H = img.naturalHeight;
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      const ctx = c.getContext('2d', {willReadFrequently: true});
      ctx.drawImage(img, 0, 0);
      const lin = (v) => { v /= 255; return v <= 0.04045 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); };
      const VIEW = 390/844;                      // a phone
      const cropW = Math.min(W, H * VIEW);       // what cover keeps
      const cropX = Math.round((W - cropW) / 2);
      const x0 = Math.round(cropX + cropW * 0.06);   // from the margin
      const x1 = Math.round(cropX + cropW * 0.52);   // to about half way
      /*
        TWO BANDS, because two different things sit on a photograph and they sit
        at opposite ends of it. The fixed chrome (signature, MENU) is at the TOP.
        The caption (a Creature's name, a collection's title) is at the BOTTOM,
        inset by --caption-inset. One value for both was measured at the top and
        used at the bottom, and on 2026-08-03 that put eight captions below WCAG
        AA, the worst at 1.36:1 and the collection's own name at 1.53:1.
      */
      const mean = (bx, by, bw, bh) => {
        const d = ctx.getImageData(Math.round(bx), Math.round(by),
                                   Math.max(1, Math.round(bw)), Math.max(1, Math.round(bh))).data;
        let sum = 0, n = 0;
        for (let i = 0; i < d.length; i += 4) {
          sum += 0.2126*lin(d[i]) + 0.7152*lin(d[i+1]) + 0.0722*lin(d[i+2]); n++;
        }
        return sum / n;
      };

      // The chrome band: fixed at the top of the phone crop, where it really sits.
      const L = mean(x0, H * 0.03, x1 - x0, H * 0.06);

      /*
        THE CAPTION BAND, MODELLED RATHER THAN GUESSED.

        A caption is not at a fixed place in the file. object-fit: cover crops
        the same photograph differently in every container it appears in, so the
        pixels under a caption move with the container's aspect ratio. The first
        attempt sampled one rectangle of the file and left eight captions
        unreadable; the second took the worst cell of the bottom third and was so
        strict it pushed thirty of forty-three captions off the pictures.

        So simulate the containers this site actually has, and in each one
        measure the rectangle the caption actually occupies: inset from the left
        margin, sitting on the bottom edge. The worst of those is the honest
        answer, because a reader meets exactly one of them.
      */
      const CONTAINERS = [
        390 / 844,   // a phone, full screen
        390 / 743,   // a phone, an 88svh block
        390 / 523,   // a phone, a 62svh short row
        1440 / 900,  // desktop, a full screen
        1440 / 790,  // desktop, an 88svh block
        720 / 790,   // desktop, half a row
      ];
      const captionMeans = CONTAINERS.map((aspect) => {
        // What cover keeps of this file at that aspect.
        let cw = W, ch = W / aspect;
        if (ch > H) { ch = H; cw = H * aspect; }
        const cx = (W - cw) / 2, cy = (H - ch) / 2;
        // Where the caption sits inside it: left inset, on the bottom edge.
        /*
          A WORD, not a band, and the WORST place that word could fall. Captions
          differ in length: "Oblivion" and "MONUMENTUS: Tenebrae & Lux" occupy
          very different widths at the same inset. Sampling one fixed rectangle
          averaged in regions a short name never touches, which is how six of
          them measured safe and rendered at 2.65. So slide a word-sized window
          across the plausible extent and keep the worst reading.
        */
        const windows = [];
        for (let wx = 0.04; wx <= 0.44; wx += 0.06) {
          windows.push(mean(cx + cw * wx, cy + ch * 0.86, cw * 0.12, ch * 0.1));
        }
        return windows;
      }).flat();
      return JSON.stringify({L, cells: captionMeans});
    })()`;
    const out = await send("Runtime.evaluate", {expression, awaitPromise: true, returnByValue: true}, sessionId);
    if (typeof out.result.value !== "string") {
      throw new Error(`could not decode ${path.basename(file)}`);
    }
    const {L, cells} = JSON.parse(out.result.value);
    const paper = ratio(L_PAPER, L);
    const ink = ratio(L_INK, L);

    /*
      Worst cell wins. For each polarity take the LOWEST contrast anywhere in the
      bottom third; the better of those two is the caption's polarity, and its
      value is what decides whether a caption can sit on the picture at all.
    */
    const worstPaper = Math.min(...cells.map((c) => ratio(L_PAPER, c)));
    const worstInk = Math.min(...cells.map((c) => ratio(L_INK, c)));
    const captionContrast = Math.max(worstPaper, worstInk);

    results.set(file, {
      overlay: paper >= ink ? "paper" : "ink",
      luminance: Number(L.toFixed(3)),
      contrast: Number(Math.max(paper, ink).toFixed(2)),
      overlayCaption: worstPaper >= worstInk ? "paper" : "ink",
      captionContrast: Number(captionContrast.toFixed(2)),
      /*
        WCAG AA for 11px text is 4.5:1, and the bar here is 6.0. The margin is
        not timidity, it is the modelling error: this samples a band the width of
        a caption, and a real caption is a short word sitting somewhere inside
        it, so the mean under the band and the mean under the word differ. At 4.5
        that slack left twelve captions failing at desktop; at 6.0 none do.

        Below the bar, DESIGN-PLAN rule 11 already says what to do: the picture
        carries no text. Here that means the caption moves onto the page below
        the frame, which is the mechanism section 14 added for exactly this.
      */
      captionSafeOnImage: captionContrast >= 6.0,
    });
  }

  ws.close();
  chrome.kill();
  // Chrome is still flushing its throwaway profile as we return; the directory
  // is in the system temp folder, so a failed cleanup is not worth an error.
  await new Promise((r) => setTimeout(r, 300));
  await fs.rm(dir, {recursive: true, force: true}).catch(() => {});
  return results;
}
