/*
  HIS WORDS WIN OVER OURS.

  Every sentence this site speaks used to live in `ui.ts`, which is code: to
  change one, somebody had to open an editor, commit and deploy. That is the
  whole reason this file exists. The owner can now rewrite any of them in the
  studio, in either language, and the site takes his version.

  HOW IT WORKS, and why it is a top-level await rather than a prop threaded
  through twenty components. `t(locale, key)` is called from page frontmatter,
  from components, and from inside nested components; there is no single place
  to pass an argument through. So the overrides are fetched ONCE, here, while
  the module is being evaluated, and `t()` reads them synchronously afterwards.
  The build is one process and this module is evaluated once in it, so that is
  one query per build, not one per page.

  IT FAILS TO OURS, NEVER TO NOTHING. An unreachable dataset, a missing
  document, an empty field or a field he has only written in one language all
  resolve to the built-in string. There is no state in which a control loses
  its label because a query timed out, and no state in which leaving a field
  blank empties a page — blank means "use the default", which is what an editor
  expects a blank field to mean and what the field description tells him.

  WHAT IS NOT HERE. Field labels, error messages, state words and the
  accessibility strings stay in `ui.ts` and are not offered to him. They are not
  things the brand says, they are the working parts of the interface: an empty
  "Email" label above an email box is a broken form, not an editorial choice.
  The line is drawn in ui.ts itself, key by key, and written down there.
*/
import {sanity, sanityConfigured} from "../lib/sanity";

/** `{ [key]: { it?: string; en?: string } }`, exactly as the studio stores it. */
export type CopyOverrides = Record<string, {it?: string | null; en?: string | null} | null>;

async function load(): Promise<CopyOverrides> {
  if (!sanityConfigured || !sanity) return {};
  try {
    const doc = await sanity.fetch<Record<string, unknown> | null>(
      /* groq */ `*[_id == "siteCopy"][0]`,
    );
    if (!doc) return {};
    const out: CopyOverrides = {};
    for (const [key, value] of Object.entries(doc)) {
      if (key.startsWith("_")) continue;
      if (value && typeof value === "object" && ("it" in value || "en" in value)) {
        out[key] = value as {it?: string; en?: string};
      }
    }
    return out;
  } catch {
    /* Never the reason a build fails. His words are an improvement on ours,
       not a dependency of the page rendering at all. */
    return {};
  }
}

export const copyOverrides: CopyOverrides = await load();
