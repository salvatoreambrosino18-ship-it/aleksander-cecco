/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID: string;
  readonly PUBLIC_SANITY_DATASET: string;
  readonly PUBLIC_SANITY_API_VERSION: string;
  readonly SANITY_READ_TOKEN: string;
  readonly PUBLIC_SITE_URL: string;
  readonly RESEND_API_KEY: string;
  readonly RESEND_FROM: string;
  readonly ENQUIRY_TO_EMAIL: string;
  readonly PUBLIC_CF_WEB_ANALYTICS_TOKEN: string;
  /** "true" only at launch. Anything else keeps the site out of search results. */
  readonly PUBLIC_ALLOW_INDEXING: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    /** Cloudflare's request runtime, where server secrets live in production. */
    runtime?: {env: Record<string, unknown>};
  }
}
