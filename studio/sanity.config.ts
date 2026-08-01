import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
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
  plugins: [structureTool({structure}), visionTool()],
  schema: {
    types: schemaTypes,
    // do not offer "create new" for the singleton
    templates: (prev) => prev.filter((t) => t.schemaType !== 'siteSettings'),
  },
  document: {
    // keep the singleton out of the global create menu
    newDocumentOptions: (prev) => prev.filter((i) => i.templateId !== 'siteSettings'),
  },
})
