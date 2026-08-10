/*
  Sanity read client. Used at build time only: the site is static output, so
  every query runs during `astro build` and nothing ships to the browser.

  projectId and dataset are public identifiers, not secrets. SANITY_READ_TOKEN
  is only needed for private datasets or draft reads, and is absent by design.
*/
import {appendFileSync} from "node:fs";
import {createClient} from "@sanity/client";

/*
  Where a failed query leaves its evidence. A file rather than a counter,
  because the pages render through Vite and the verifier is a separate process:
  a module-level variable in here is not the same variable over there.
  `npm run build` clears it before the build and checks it afterwards.
*/
export const SANITY_FAILURE_LOG = ".sanity-failures.log";

function recordFailure(groq: string, message: string) {
  try {
    appendFileSync(SANITY_FAILURE_LOG, `${message}\n  in: ${groq.replace(/\s+/g, " ").slice(0, 200)}\n`);
  } catch {
    // Recording must never be the thing that breaks a build.
  }
}

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET;
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || "2026-03-01";

export const sanityConfigured = Boolean(projectId && dataset);

/*
  useCdn: FALSE, changed 2026-08-02, and the reason is worth keeping.

  With the CDN on, a build started shortly after content changed served the
  PREVIOUS content. It happened three times in one session: a collection rename
  produced the old slug, and twice a footer rewrite produced the old wording,
  each time while the dataset plainly held the new value. Every occurrence cost
  time chasing a bug that did not exist.

  The CDN buys nothing here. These queries run at BUILD time, once per deploy,
  not per visitor, so there is no traffic to amortise a cache over. What it
  costs is correctness: a static build is a photograph of the dataset, and a
  photograph of a stale cache is worse than useless because it looks fine.

  Quota is not a concern (DESIGN-PLAN section 12): the free plan allows 250,000
  API requests a month against a handful per build and 500 builds a month.
*/
export const sanity = sanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
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
    /*
      A THROWN QUERY IS NEVER INTENTIONAL, and it used to be indistinguishable
      from a healthy build (section 78).

      Returning the fallback here is deliberate and stays: the frame must render
      before the owner has published anything, and a build must not die because
      a laptop is offline. But there are two very different reasons to end up
      here, and only one of them is acceptable:

        - the dataset legitimately has nothing yet  -> fallback, carry on
        - the QUERY ITSELF failed                   -> every page on the site is
                                                       now placeholders

      The second happened: a block comment inside a GROQ projection is a parse
      error, every query threw, the whole site built from placeholders, and the
      build printed "Complete!" and exited zero. Nothing distinguished it from a
      correct build except reading the rendered content.

      So the failure is now RECORDED to a file that scripts/verify-build.mjs
      reads, and `npm run build` refuses afterwards. The warning below is kept
      because a human watching the log deserves to see it immediately; the file
      is what makes it impossible to miss.
    */
    const message = (error as Error).message;
    console.warn(`[sanity] query failed, using placeholders: ${message}`);
    recordFailure(groq, message);
    return fallback;
  }
}
