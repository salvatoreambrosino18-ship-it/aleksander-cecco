import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  /*
    THE HOSTED STUDIO URL, claimed 2026-08-18 (section 128).

    It sat commented out for a fortnight, which meant the owner had no address
    to log in to and the guide carried <DA COMPLETARE> where the link should be.
    A studio nobody can reach is the same as no studio.

    The name was already decided in this comment; deploying only acts on it.
    The studio is behind Sanity's own login and shows content to invited members
    only, so claiming the hostname publishes an empty login screen, not the
    dataset.
  */
  studioHost: 'aleksander-cecco',
  /* Pinned so a redeploy never stops to ask which application this is. */
  deployment: {
    appId: 'h58x11m6ihytg96ljynrpjy5',
  },
})
