/*
  SVUOTA UN PROGETTO CLOUDFLARE PAGES DEI SUOI DEPLOYMENT.

    node scripts/pages-purge.mjs --snapshot     salva la configurazione, non tocca niente
    node scripts/pages-purge.mjs                conta i deployment, non ne cancella nessuno
    node scripts/pages-purge.mjs --delete       li cancella davvero

  PERCHE' ESISTE. Un progetto Pages con molti deployment non si lascia
  cancellare dal pannello, e non c'e' un comando wrangler che cancelli i
  deployment in blocco. L'unica strada e' l'API, un deployment alla volta.

  FAI PRIMA `--snapshot`, SEMPRE. Scrive `pages-project-snapshot.json` con la
  configurazione del progetto come la vede l'API, comprese le variabili
  d'ambiente di produzione e di anteprima. Una volta cancellato il progetto,
  quella configurazione non si recupera da nessuna parte, e i valori segreti
  l'API li restituisce oscurati: quelli vanno riletti dal pannello PRIMA, non
  dopo.

  IL TOKEN. Serve un token API creato NELL'ACCOUNT CHE POSSIEDE IL PROGETTO,
  con il permesso `Account -> Cloudflare Pages -> Edit`. Si crea su
  https://dash.cloudflare.com/profile/api-tokens con «Create Token», poi
  «Create Custom Token». Niente altro serve.

    export CLOUDFLARE_API_TOKEN=...
    export CF_ACCOUNT_ID=0f406c1182fa9f5b822938dc3a3c708d
    export CF_PAGES_PROJECT=aleksander-cecco

  NON CANCELLA IL PROGETTO. Svuota e basta. La cancellazione del progetto e' un
  bottone nel pannello e conviene premerlo guardando, perche' e' il momento in
  cui il sito va giu'.

  I LIMITI DELL'API sono 1200 richieste ogni 5 minuti. Il parallelismo e' basso
  apposta e un 429 viene aspettato invece che ignorato: un giro un po' piu'
  lento e' meglio di un giro che si ferma a meta' e va rifatto.
*/
import fs from "node:fs";

const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT = process.env.CF_ACCOUNT_ID;
const PROJECT = process.env.CF_PAGES_PROJECT;
const DELETE = process.argv.includes("--delete");
const SNAPSHOT = process.argv.includes("--snapshot");

if (!TOKEN || !ACCOUNT || !PROJECT) {
  console.error(`
  Mancano le variabili d'ambiente.

    export CLOUDFLARE_API_TOKEN=...      token con Account -> Cloudflare Pages -> Edit
    export CF_ACCOUNT_ID=...             l'account che possiede il progetto
    export CF_PAGES_PROJECT=...          il nome del progetto Pages
`);
  process.exit(1);
}

const BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/pages/projects/${PROJECT}`;
const headers = {Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json"};

/** Una chiamata all'API che aspetta se viene messa in coda, invece di arrendersi. */
async function call(url, init = {}, attempt = 0) {
  const res = await fetch(url, {...init, headers});
  if (res.status === 429 || res.status >= 500) {
    if (attempt >= 6) throw new Error(`${res.status} dopo sette tentativi su ${url}`);
    const wait = Number(res.headers.get("retry-after")) * 1000 || 2000 * 2 ** attempt;
    await new Promise((r) => setTimeout(r, wait));
    return call(url, init, attempt + 1);
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) {
    const why = (body.errors ?? []).map((e) => `${e.code} ${e.message}`).join("; ");
    /*
      UN 403 O UN 404 QUI VUOL DIRE QUASI SEMPRE UNA COSA SOLA, e vale la pena
      dirla invece di stampare un codice: il token e' stato creato nell'account
      sbagliato. E' esattamente l'errore che questo trasloco sta cercando di
      risolvere, quindi e' anche quello che si rifara' per primo.
    */
    const hint =
      res.status === 403 || res.status === 404
        ? "\n  Di solito significa che il token e' di un altro account, o che non ha Cloudflare Pages -> Edit."
        : "";
    throw new Error(`${res.status} ${why || "errore non descritto"}${hint}`);
  }
  return body.result;
}

/*
  UN ERRORE DELL'API E' UNA NOTIZIA, NON UNA TRACCIA DELLO STACK. Un gestore su
  `unhandledRejection` non basta: il rifiuto di un `await` di primo livello in un
  modulo ES non ci passa, e infatti la prima versione stampava lo stack. Ogni
  attesa di primo livello passa da qui.
*/
const guard = (promise) =>
  promise.catch((error) => {
    console.error(`\n  Fermato. ${error?.message ?? error}\n`);
    process.exit(1);
  });

/* ------------------------------------------------------------- snapshot */

if (SNAPSHOT) {
  const project = await guard(call(BASE));
  const out = "pages-project-snapshot.json";
  fs.writeFileSync(out, JSON.stringify(project, null, 2));

  const envOf = (which) =>
    Object.entries(project?.deployment_configs?.[which]?.env_vars ?? {}).map(
      ([k, v]) => ({dove: which, nome: k, tipo: v?.type ?? "?", valore: v?.value ?? "(oscurato)"}),
    );

  console.log(`\n  Scritto ${out}\n`);
  console.log("  Configurazione della build");
  console.table([
    {campo: "comando", valore: project?.build_config?.build_command ?? "(vuoto)"},
    {campo: "cartella di uscita", valore: project?.build_config?.destination_dir ?? "(vuoto)"},
    {campo: "cartella radice", valore: project?.build_config?.root_dir || "(la radice)"},
    {campo: "ramo di produzione", valore: project?.production_branch ?? "?"},
    {campo: "repository", valore: project?.source?.config?.repo_name ?? "(nessuna, direct upload)"},
    {campo: "sottodominio", valore: project?.subdomain ?? "?"},
    {campo: "domini personalizzati", valore: (project?.domains ?? []).join(", ") || "(nessuno)"},
  ]);
  console.log("  Variabili d'ambiente");
  console.table([...envOf("production"), ...envOf("preview")]);
  console.log(`
  I VALORI SEGRETI SONO OSCURATI DALL'API. Quelli che risultano «(oscurato)»
  vanno riletti a mano dal pannello prima di cancellare, perche' dopo non
  esistono piu' da nessuna parte.
`);
}

/* --------------------------------------------------------- i deployment */

async function all() {
  const out = [];
  for (let page = 1; ; page++) {
    const batch = await call(`${BASE}/deployments?per_page=25&page=${page}`);
    if (!batch?.length) break;
    out.push(...batch);
    process.stdout.write(`\r  trovati ${out.length} deployment...`);
    if (batch.length < 25) break;
  }
  process.stdout.write("\n");
  return out;
}

const deployments = await guard(all());
if (deployments.length === 0) {
  console.log("\n  Nessun deployment. Il progetto si puo' cancellare dal pannello.\n");
  process.exit(0);
}

const oldest = deployments.at(-1)?.created_on?.slice(0, 10);
const newest = deployments[0]?.created_on?.slice(0, 10);
console.log(`\n  ${deployments.length} deployment, dal ${oldest} al ${newest}.`);

if (!DELETE) {
  console.log("\n  PROVA. Non e' stato cancellato niente. Rilancia con --delete.\n");
  process.exit(0);
}

/*
  `force=true` serve per l'ultimo deployment di ogni ramo e per quello in
  produzione, che altrimenti l'API rifiuta di cancellare. Il parallelismo e'
  sei: abbastanza per non metterci un'ora, poco per non farsi mettere in coda.
*/
let done = 0;
const failed = [];
const queue = [...deployments];

await Promise.all(
  Array.from({length: 6}, async () => {
    while (queue.length) {
      const d = queue.pop();
      try {
        await call(`${BASE}/deployments/${d.id}?force=true`, {method: "DELETE"});
      } catch (error) {
        failed.push({id: d.id, perche: error.message.slice(0, 90)});
      }
      done++;
      process.stdout.write(`\r  cancellati ${done} di ${deployments.length}...`);
    }
  }),
);
process.stdout.write("\n");

if (failed.length) {
  console.log(`\n  ${failed.length} non cancellati.`);
  console.table(failed.slice(0, 10));
  console.log("  Rilancia lo script: quelli rimasti vengono ritentati.\n");
  process.exit(1);
}
console.log("\n  Fatto. Adesso il progetto si puo' cancellare dal pannello.\n");
