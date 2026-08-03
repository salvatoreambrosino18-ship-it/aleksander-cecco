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
      const band = (yFrom, yTo) => {
        const d = ctx.getImageData(x0, Math.round(H * yFrom), Math.max(1, x1 - x0),
                                   Math.max(1, Math.round(H * (yTo - yFrom)))).data;
        let sum = 0, n = 0;
        for (let i = 0; i < d.length; i += 4) {
          sum += 0.2126*lin(d[i]) + 0.7152*lin(d[i+1]) + 0.0722*lin(d[i+2]); n++;
        }
        return sum / n;
      };
      return JSON.stringify({L: band(0.03, 0.09), Lc: band(0.88, 0.97)});
    })()`;
    const out = await send("Runtime.evaluate", {expression, awaitPromise: true, returnByValue: true}, sessionId);
    if (typeof out.result.value !== "string") {
      throw new Error(`could not decode ${path.basename(file)}`);
    }
    const {L, Lc} = JSON.parse(out.result.value);
    const pick = (lum) => {
      const paper = ratio(L_PAPER, lum);
      const ink = ratio(L_INK, lum);
      return {
        overlay: paper >= ink ? "paper" : "ink",
        luminance: Number(lum.toFixed(3)),
        contrast: Number(Math.max(paper, ink).toFixed(2)),
      };
    };
    const top = pick(L);
    const bottom = pick(Lc);
    results.set(file, {
      ...top,
      // The band a caption actually sits in, measured separately.
      overlayCaption: bottom.overlay,
      captionContrast: bottom.contrast,
      captionLuminance: bottom.luminance,
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
