const {chromium}=require('playwright');const http=require('http');const fs=require('fs');const path=require('path');
const DIST=path.join(process.cwd(),'dist');
const MIME={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.webmanifest':'application/json','.xml':'application/xml','.txt':'text/plain','.ico':'image/x-icon','.mp4':'video/mp4'};
const s=http.createServer((q,r)=>{let f=path.join(DIST,decodeURIComponent(new URL(q.url,'http://x').pathname));if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){r.writeHead(404);return r.end()}r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r)});
s.listen(0,'127.0.0.1',async()=>{
 const port=s.address().port;const b=await chromium.launch();
 for(const w of [1440,1920]){
  const p=await b.newPage({viewport:{width:w,height:w===1920?1080:900}});
  await p.goto('http://127.0.0.1:'+port+'/it',{waitUntil:'networkidle'});
  const rows=await p.evaluate(()=>{
   const out=[];
   for(const t of document.querySelectorAll('.paired-text')){
    const box=t.getBoundingClientRect();
    const inner=t.querySelector('.paired-inner');
    const ib=inner?inner.getBoundingClientRect():box;
    out.push({label:(t.textContent||'').trim().replace(/\s+/g,' ').slice(0,30),h:Math.round(box.height),content:Math.round(ib.height)});
   }
   return out;
  });
  console.log('--- '+w);
  for(const r of rows) console.log(`   half ${String(r.h).padStart(5)}px  text ${String(r.content).padStart(4)}px  air ${String(r.h-r.content).padStart(5)}px (${Math.round((r.h-r.content)/r.h*100)}%)  ${r.label}`);
  await p.close();
 }
 await b.close();s.close();
});
