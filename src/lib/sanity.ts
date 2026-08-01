/*
  Sanity read client. Used at build time only: the site is static output, so
  every query runs during `astro build` and nothing ships to the browser.

  projectId and dataset are public identifiers, not secrets. SANITY_READ_TOKEN
  is only needed for private datasets or draft reads, and is absent by design.
*/
import {createClient} from "@sanity/client";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET;
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || "2026-03-01";

export const sanityConfigured = Boolean(projectId && dataset);

export const sanity = sanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;

/**
 * Query Sanity without ever failing the build.
 *
 * The frame and the pages must render before the owner has published anything,
 * and a build must not die because a laptop is offline. Callers get the
 * fallback and render their marked placeholders instead.
 */
export async function query<T>(groq: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  if (!sanity) {
    console.warn("[sanity] not configured (PUBLIC_SANITY_PROJECT_ID / PUBLIC_SANITY_DATASET); using placeholders");
    return fallback;
  }
  try {
    const result = await sanity.fetch<T>(groq, params);
    return (result ?? fallback) as T;
  } catch (error) {
    console.warn(`[sanity] query failed, using placeholders: ${(error as Error).message}`);
    return fallback;
  }
}
