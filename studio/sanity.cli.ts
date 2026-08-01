import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Uncomment and set once, to claim a hosted studio URL for `sanity deploy`:
  // studioHost: 'aleksander-cecco',
})
