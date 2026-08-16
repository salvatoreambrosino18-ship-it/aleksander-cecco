import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import AnteprimaCapo from './components/AnteprimaCapo'
import Inizio from './components/Inizio'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

// projectId and dataset come from studio/.env (SANITY_STUDIO_ prefixed vars).
// Both are public identifiers, not secrets. The studio will not boot until
// SANITY_STUDIO_PROJECT_ID is set (that is expected).
const projectId = process.env.SANITY_STUDIO_PROJECT_ID as string
const dataset = (process.env.SANITY_STUDIO_DATASET as string) || 'production'

export default defineConfig({
  name: 'default',
  title: 'Aleksander Cecco',
  projectId,
  dataset,
  /*
    VISION È STATO TOLTO (2026-08-19, sezione 130). È lo strumento per scrivere
    query GROQ a mano: utile a chi costruisce il sito, incomprensibile e inutile
    per chi lo usa. Stava in alto accanto a «Structure», con lo stesso peso
    visivo delle sue cose. Chi lavora al codice lo rimette per un momento
    quando serve.
  */
  plugins: [
    structureTool({
      /* «Structure» è una parola da programmatori: qui è dove stanno le sue cose. */
      title: 'I contenuti',
      structure,
      /*
        L'ANTEPRIMA come seconda scheda, e solo sui capi: sono le pagine che
        guarda e cambia di continuo, e le uniche in cui «ho fatto la cosa
        giusta?» ha una risposta visiva.
      */
      defaultDocumentNode: (S, {schemaType}) =>
        schemaType === 'garment'
          ? S.document().views([
              S.view.form().title('Modifica'),
              S.view.component(AnteprimaCapo).title('Anteprima'),
            ])
          : S.document(),
    }),
  ],
  /*
    LA SCHERMATA INIZIALE. Il primo tool è quello su cui si apre lo studio, ed è
    per questo che sta davanti a «Structure»: entrando deve trovare qualcosa che
    gli parla, non l'elenco dei tipi di contenuto.
  */
  tools: (prev) => [
    {name: 'inizio', title: 'Inizio', component: Inizio},
    /*
      VIA GLI STRUMENTI DI SANITY CHE NON SONO IL SUO SITO (2026-08-19,
      sezione 130). «Releases» e «Scheduled Drafts» servono a programmare la
      pubblicazione di gruppi di contenuti a una data: nessuno qui lo fa, e
      stavano in alto accanto alle sue cose con lo stesso peso visivo,
      contenendo schermate che per lui non vogliono dire niente.

      Si tolgono qui e non con le opzioni `releases`/`scheduledPublishing`,
      perché quelle spengono la funzione ma lasciano la voce nel menu — provato.
      Filtrare per nome le toglie davvero, e non toglie NIENTE dei suoi
      contenuti: sono strumenti, non dati.
    */
    ...prev.filter((t) => !['releases', 'scheduled-publishing', 'scheduledPublishing'].includes(t.name)),
  ],
  /*
    RELEASES SPENTO (2026-08-19, sezione 130). È il sistema di Sanity per
    programmare la pubblicazione di gruppi di contenuti a una data. Non lo usa
    nessuno qui, e stava in alto accanto alle sue cose con lo stesso peso, con
    dentro una schermata che non vuol dire niente per lui.
  */
  schema: {
    types: schemaTypes,
    // do not offer "create new" for the singleton
    templates: (prev) => prev.filter((t) => !['siteSettings', 'siteCopy'].includes(t.schemaType)),
  },
  document: {
    // keep the singleton out of the global create menu
    newDocumentOptions: (prev) => prev.filter((i) => !['siteSettings', 'siteCopy'].includes(i.templateId as string)),
  },
})
