/*
  MISURA OGNI VIDEO E DECIDE SE PUO' ANDARE IN LOOP.

    node scripts/check-videos.mjs            dice cosa farebbe
    node scripts/check-videos.mjs --write    lo scrive nel database
    node scripts/check-videos.mjs --all      rimisura anche quelli già fatti
    node scripts/check-videos.mjs --pending  stampa solo quanti ne mancano

  THE GAP THIS CLOSES. The owner can upload a clip and cannot trim one. The
  site used to loop whatever it was handed, and a clip that is short, or that
  wanders and comes back, reads as an Instagram boomerang: three shipped in
  August and it took two rounds of work to undo. Telling him to be careful was
  the previous answer, and it fails on the two things that are actually true —
  he will not measure a clip, and once it is live he cannot fix it.

  SO THE DEFAULT IS INVERTED. The site loops a clip only when this script says
  it may. Everything else PLAYS ONCE AND STOPS, which has no wrap and therefore
  cannot boomerang at all. A clip nobody has run this against is safe by
  omission, which is the only kind of safe that survives being forgotten.

  WHAT IT MEASURES, and the order matters because the first one decides almost
  everything:

  - LENGTH, which turned out to BE the problem. Of the clips the owner called
    boomerangs, one went perfectly straight and was still a boomerang because
    it lasted a second and a half; of the ones he accepted, one wanders badly
    and is fine because it lasts nineteen seconds. The restart is itself a
    return, so what decides is how often it happens.
  - TRAVEL, net displacement over total path, as a safety net UNDER eight
    seconds only. A short clip that oscillates hard is a boomerang even at
    three seconds; a long one that wanders is just a hand-held camera.
  - SEAM, the jump at the wrap. Kept last and kept loose: he accepted one of
    77 on a ten-second clip. It only catches a file with a scene change in it.

  It measures the WHOLE clip as uploaded, because that is what the site plays.
  Trimming is not offered: a script that silently re-cut his footage would be
  making an editorial decision nobody asked it to make, and he would have no
  way to see what had been taken out.

  ffmpeg is required, and it is checked for ONLY WHEN THERE IS SOMETHING TO
  MEASURE. On a machine without it, with work to do, the script refuses rather
  than marking everything unsafe, because "unmeasured" and "measured and bad"
  must not collapse into each other. With nothing to do it does not care, which
  is what makes an hourly clock cheap.

  A CLIP IS MEASURED ONCE, EVER. Sanity file assets are content addressed: the
  id contains the sha1 of the bytes, so a given id is one unchanging file and
  its verdict cannot go stale. Anything that already has a `videoCheck` is
  skipped, so the ordinary hourly run is one query and no downloads. Re-measure
  everything with `--all`, which is what to run AFTER CHANGING A THRESHOLD in
  this file — the old verdicts do not recompute themselves.

  WHY THIS MATTERS RATHER THAN BEING A TIDY-UP. The first version downloaded and
  decoded all seventeen clips on every run, which is four minutes and most of a
  hundred megabytes off Sanity's CDN, every hour, to reach the same answer it
  reached the hour before.
*/
import {execFileSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createClient} from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
/*
  .env in locale, variabili d'ambiente in CI. Su GitHub il file non c'è e non
  deve esserci: leggerlo e basta farebbe fallire il job prima di iniziare.
*/
try {
  process.loadEnvFile(path.join(ROOT, ".env"));
} catch {
  /* nessun .env: si usano le variabili d'ambiente già presenti */
}

const WRITE = process.argv.includes("--write");
const ALL = process.argv.includes("--all");
/*
  --pending esiste per il job orario: stampa un numero e basta, così il workflow
  può installare ffmpeg SOLO quando c'è davvero un video da misurare invece di
  scaricare mezzo Debian ogni ora per non fare niente.
*/
const PENDING = process.argv.includes("--pending");

/* --------------------------------------------------------------- soglie */

/*
  I NUMERI, E DA DOVE VENGONO. Non sono scelti a occhio: sono tarati sui video
  veri e sul giudizio del titolare, che è l'unico giudice che conta.

  QUELLI CHE HA CHIAMATO BOOMERANG:  1.0s, 1.3s, 1.5s
  QUELLI CHE HA ACCETTATO:           3.5s, 5.7s, 10.0s, 18.8s

  La cosa che salta all'occhio guardando quella riga è che NON È IL
  MOVIMENTO, È LA DURATA. Uno dei tre bocciati andava perfettamente dritto
  (travel 1.00) ed era comunque un boomerang, perché durava un secondo e
  mezzo; uno di quelli accettati va e torna di brutto (travel 0.12) e va bene,
  perché dura diciannove secondi.

  Il motivo è che il RICOMINCIARE è esso stesso un ritorno. A un secondo e
  mezzo il ricominciare è più frequente del movimento, e l'occhio non
  distingue un video che riparte da uno che torna indietro. A dieci secondi lo
  stesso identico stacco si legge come uno stacco.

  Quindi:

  - 3 SECONDI è la soglia. Il peggiore accettato sta a 3.5, il migliore
    bocciato a 1.5. Tre sta in mezzo e lascia margine da tutte e due le parti.
  - IL MOVIMENTO conta solo sotto gli 8 secondi, e come rete di sicurezza: un
    video corto che oscilla forte è un boomerang anche se dura tre secondi.
    Sopra gli otto, un movimento che va e torna è semplicemente una ripresa a
    mano, e il titolare l'ha già accettata.
  - LO STACCO deve essere enorme per contare: lui ne ha accettato uno da 77.
    Questa soglia serve solo a prendere il caso in cui dentro il file c'è un
    cambio di scena, non uno stacco.

  La versione precedente di queste soglie bocciava tre dei quattro video che
  lui aveva appena approvato. Erano sbagliate le soglie, non i video.
*/
const MIN_SECONDS = 3;
const MIN_TRAVEL = 0.35;
const TRAVEL_MATTERS_UNDER = 8;
const MAX_SEAM = 120;

/* ------------------------------------------------------------ strumenti */

function requireFfmpeg() {
  try {
    execFileSync("ffmpeg", ["-version"], {stdio: "ignore"});
    execFileSync("ffprobe", ["-version"], {stdio: "ignore"});
  } catch {
    console.error(
      "\n  ffmpeg non c'è su questa macchina.\n" +
        "  Senza non si può misurare niente, e segnare tutto come 'non sicuro'\n" +
        "  sarebbe una bugia diversa. Installa ffmpeg e rilancia.\n",
    );
    process.exit(1);
  }
}

const S = 160;
const R = 24;

/** Frames as raw greyscale, plus the 1-D projections used for motion. */
function decode(file, w, h) {
  const buf = execFileSync(
    "ffmpeg",
    ["-v", "error", "-i", file, "-vf", `scale=${w}:${h}`, "-f", "rawvideo", "-pix_fmt", "gray", "-"],
    {maxBuffer: 1 << 30},
  );
  const size = w * h;
  const n = Math.floor(buf.length / size);
  const frames = [];
  for (let i = 0; i < n; i++) frames.push(buf.subarray(i * size, (i + 1) * size));
  return frames;
}

/*
  WHERE THE CAMERA GOES, at sub-pixel resolution and cheaply. Each frame is
  reduced to a column sum and a row sum, and consecutive projections are slid
  against each other. That is O(width x radius) rather than O(area x radius^2),
  so it can run at the clip's own width — where a one-pixel drift is one pixel,
  which a small block search cannot see at all.
*/
function travelOf(file, w, h) {
  const buf = execFileSync(
    "ffmpeg",
    ["-v", "error", "-i", file, "-vf", `scale=${w}:${h}`, "-f", "rawvideo", "-pix_fmt", "gray", "-"],
    {maxBuffer: 1 << 30},
  );
  const size = w * h;
  const n = Math.floor(buf.length / size);
  const cols = [];
  const rows = [];
  for (let f = 0; f < n; f++) {
    const c = new Float64Array(w);
    const r = new Float64Array(h);
    const off = f * size;
    for (let y = 0; y < h; y++) {
      let s = 0;
      for (let x = 0; x < w; x++) {
        const v = buf[off + y * w + x];
        c[x] += v;
        s += v;
      }
      r[y] = s;
    }
    cols.push(c);
    rows.push(r);
  }
  const shift = (a, b) => {
    const N = a.length;
    const err = new Float64Array(2 * R + 1);
    let best = 0;
    let bestE = Infinity;
    for (let d = -R; d <= R; d++) {
      let s = 0;
      let k = 0;
      for (let i = R; i < N - R; i++) {
        s += Math.abs(a[i] - b[i + d]);
        k++;
      }
      const e = s / k;
      err[d + R] = e;
      if (e < bestE) {
        bestE = e;
        best = d;
      }
    }
    const j = best + R;
    if (j > 0 && j < 2 * R) {
      const den = err[j - 1] - 2 * err[j] + err[j + 1];
      if (den !== 0) return best + (0.5 * (err[j - 1] - err[j + 1])) / den;
    }
    return best;
  };
  let pathLen = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 1; i < n; i++) {
    const dx = shift(cols[i - 1], cols[i]);
    const dy = shift(rows[i - 1], rows[i]);
    pathLen += Math.hypot(dx, dy);
    cx += dx;
    cy += dy;
  }
  /* A clip that never moves has nowhere to come home from: it is a still, and
     a still loops perfectly. */
  if (pathLen < 1) return 1;
  return Math.hypot(cx, cy) / pathLen;
}

function seamOf(file) {
  const F = decode(file, S, S);
  if (F.length < 2) return 255;
  const a = F[F.length - 1];
  const b = F[0];
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
  return s / a.length;
}

/* --------------------------------------------------------------- verdetto */

function verdict({seconds, travel, seam}) {
  if (seconds < MIN_SECONDS) {
    return {
      loops: false,
      note:
        `Dura ${seconds.toFixed(1)} secondi, troppo poco per ripartire in continuo: ` +
        `ricomincerebbe così spesso da sembrare un boomerang, anche se non lo è. ` +
        `Sul sito parte una volta sola e si ferma sull'ultima immagine, e va benissimo così. ` +
        `Se lo vuoi in loop serve un video di almeno ${MIN_SECONDS} secondi.`,
    };
  }
  if (seconds < TRAVEL_MATTERS_UNDER && travel < MIN_TRAVEL) {
    return {
      loops: false,
      note:
        `È corto e la ripresa va e torna dov'era partita: messi insieme, sono le due cose ` +
        `che fanno sembrare un video un boomerang. Sul sito parte una volta sola e si ferma. ` +
        `Per il loop tieni la macchina ferma, o muovila sempre nella stessa direzione, ` +
        `oppure fai un video più lungo.`,
    };
  }
  if (seam > MAX_SEAM) {
    return {
      loops: false,
      note:
        `Quando ricomincia si vede un'altra scena, non lo stesso video che riparte. ` +
        `Sul sito parte una volta sola e si ferma.`,
    };
  }
  return {
    loops: true,
    note:
      `Va in loop: dura ${seconds.toFixed(1)} secondi, abbastanza perché il ricominciare ` +
      `si legga come uno stacco e non come un video che torna indietro.`,
  };
}

/* ------------------------------------------------------------------ main */

/*
  IL TOKEN SERVE SOLO PER SCRIVERE. Il dataset è pubblico, quindi la lettura
  funziona senza. Se manca proprio quando serve, lo si dice qui e subito: senza
  questo controllo lo scopriremmo alla riga `tx.commit()`, dopo aver scaricato e
  misurato ogni video, con un errore HTTP che non nomina la causa.
*/
if (WRITE && !process.env.SANITY_WRITE_TOKEN) {
  console.error(
    "\n  Manca SANITY_WRITE_TOKEN, e con --write serve per forza.\n" +
      "  In locale sta in .env; su GitHub in Settings > Secrets and variables > Actions.\n",
  );
  process.exit(1);
}

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_READ_TOKEN,
  useCdn: false,
});

const assets = await client.fetch(
  /* groq */ `*[_type == "sanity.fileAsset" && mimeType match "video/*"]{_id, originalFilename, url}`,
);
const measured = new Set(await client.fetch(/* groq */ `*[_type == "videoCheck"].assetId`));
const todo = ALL ? assets : assets.filter((a) => !measured.has(a._id));

if (PENDING) {
  process.stdout.write(`${todo.length}\n`);
  process.exit(0);
}

console.log(
  `\n  ${assets.length} video nel database, ${todo.length} da misurare` +
    (todo.length === 0 ? " — niente da fare\n" : "\n"),
);

/*
  ffmpeg si controlla QUI e non prima: un giro che non deve misurare niente non
  ha bisogno di ffmpeg, e su un orologio che scatta ogni ora la stragrande
  maggioranza dei giri è esattamente quella.
*/
if (todo.length > 0) requireFfmpeg();

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "videocheck-"));
const rows = [];
const tx = client.transaction();

try {
  for (const asset of todo) {
    const file = path.join(dir, `${asset._id}.mp4`);
    const res = await fetch(asset.url);
    if (!res.ok) {
      console.log(`  ${asset.originalFilename}: non scaricabile, saltato`);
      continue;
    }
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));

    const probe = execFileSync("ffprobe", [
      "-v", "error", "-select_streams", "v:0",
      "-show_entries", "stream=width,height,duration",
      "-of", "default=nw=1:nk=1", file,
    ])
      .toString()
      .trim()
      .split("\n");
    const w = Number(probe[0]);
    const h = Number(probe[1]);
    const seconds = Number(probe[2]);

    /* Analysis width capped so a 4K clip does not take a minute; the drift
       being measured is a whole-frame movement, not a texture. */
    const aw = Math.min(w, 480);
    const ah = Math.round((h / w) * aw / 2) * 2;

    const travel = travelOf(file, aw, ah);
    const seam = seamOf(file);
    const v = verdict({seconds, travel, seam});

    rows.push({
      file: asset.originalFilename,
      secondi: seconds.toFixed(1),
      "va dritto": travel.toFixed(2),
      stacco: seam.toFixed(0),
      "sul sito": v.loops ? "LOOP" : "una volta sola",
    });

    tx.createOrReplace({
      _id: `videoCheck-${asset._id}`,
      _type: "videoCheck",
      assetId: asset._id,
      filename: asset.originalFilename ?? asset._id,
      loops: v.loops,
      seconds: Number(seconds.toFixed(2)),
      travel: Number(travel.toFixed(3)),
      seam: Number(seam.toFixed(1)),
      note: v.note,
      checkedAt: new Date().toISOString(),
    });
    measured.add(asset._id);
  }
} finally {
  fs.rmSync(dir, {recursive: true, force: true});
}

if (rows.length > 0) console.table(rows);

/* Quanti controlli il sito DEVE poter vedere quando questo giro è finito: uno
   per ogni video che è stato misurato, oggi o in un giro precedente. */
const expected = assets.filter((a) => measured.has(a._id)).length;

if (!WRITE) {
  console.log("\n  PROVA. Rilancia con --write per salvarlo.\n");
} else {
  /* Una transazione vuota non è un no-op: Sanity la rifiuta, e un giro che non
     aveva niente da fare uscirebbe con un errore invece che in silenzio. */
  if (rows.length > 0) await tx.commit();

  /*
    E ADESSO CONTROLLA CHE IL SITO LI VEDA DAVVERO.

    Il sito legge Sanity SENZA token, perché il dataset è pubblico. La prima
    versione di questo script salvava i documenti con un _id tipo
    `videoCheck.file-abc`, con il PUNTO: la scrittura andava a buon fine, il
    token di scrittura li vedeva, e un lettore anonimo NO — perché Sanity
    tratta gli id con un punto come uno spazio riservato, com'è `drafts.`.

    Il risultato sarebbe stato silenzioso e sbagliato nella direzione giusta:
    ogni video sarebbe partito una volta sola per sempre, senza un errore da
    nessuna parte, e nessuno se ne sarebbe accorto. Un default sicuro nasconde
    i propri guasti, quindi il guasto va cercato apposta.
  */
  const anon = createClient({
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.PUBLIC_SANITY_DATASET,
    apiVersion: process.env.PUBLIC_SANITY_API_VERSION || "2026-03-01",
    useCdn: false,
    perspective: "published",
  });
  await new Promise((r) => setTimeout(r, 2000));
  const visible = await anon.fetch(`count(*[_type == "videoCheck"])`);
  if (visible < expected) {
    console.error(
      `\n  ATTENZIONE: dovrebbero esserci ${expected} controlli ma il sito ne vede ${visible}.\n` +
        `  Finché non li vede, OGNI video parte una volta sola. Non è rotto il sito: è questo script.\n`,
    );
    process.exit(1);
  }
  console.log(
    rows.length > 0
      ? `\n  Salvato. ${rows.length} video nuovi controllati, ${expected} in tutto, e il sito li vede.\n`
      : `\n  Niente di nuovo. ${expected} video già controllati, e il sito li vede.\n`,
  );
}
