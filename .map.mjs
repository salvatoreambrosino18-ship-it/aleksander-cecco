import {chromium} from "playwright";
const b = await chromium.launch();
const p = await b.newPage({viewport:{width:1728,height:962}});
await p.goto(process.argv[2], {waitUntil:"load"});
await p.waitForTimeout(2500);
// scroll through so everything reveals
for (let y=0; y<await p.evaluate(()=>document.body.scrollHeight); y+=800){ await p.mouse.wheel(0,800); await p.waitForTimeout(120); }
await p.waitForTimeout(1500);
const rows = await p.evaluate(() => [...document.querySelectorAll("figure")].map((f,i) => {
  const img = f.querySelector("img"); const v = f.querySelector("video");
  const box = f.getBoundingClientRect();
  return {i, file: img ? decodeURIComponent(img.src).split("/").pop().split("?")[0].slice(0,46) : null,
    video: v ? v.src.split("/").pop().slice(0,12) : null,
    w: Math.round(box.width), cls: f.className.slice(0,40),
    alt: img ? (img.alt||"").slice(0,70) : null};
}));
console.table(rows);
await p.screenshot({path: process.argv[3], fullPage:true});
await b.close();
