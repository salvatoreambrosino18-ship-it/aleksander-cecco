import sharp from "sharp";
import path from "node:path";
const OUT = "/private/tmp/claude-501/-Users-salvatoreambrosino-aleksander-cecco/0cf24dcf-7723-4307-9f34-6c7ef4f987fe/scratchpad/crops";
const [src, name, nStr] = process.argv.slice(2);
const n = Number(nStr || 4);
const img = sharp(src);
const {width, height} = await img.metadata();
const step = Math.floor(height / n);
for (let i = 0; i < n; i++) {
  const top = i * step;
  const h = i === n - 1 ? height - top : step;
  await sharp(src)
    .extract({left: 0, top, width, height: h})
    .resize({width: 820})
    .toFile(path.join(OUT, `${name}${i}.png`));
}
console.log(`${name}: ${n} slices of ${step}px from ${width}x${height}`);
