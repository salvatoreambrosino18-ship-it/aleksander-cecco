/*
  HIS COLLECTION STATEMENT, AND WHICH LINE OF IT A PLACE IS ENTITLED TO.

  He writes a drop statement in lines, and the first line announces:

    Presentiamo MONUMENTUS: Tenebrae & Lux.
    Nigredo e Albedo esplorati come texture viventi.
    I capi sono entità alchemiche in cui decomposizione e purificazione si
    incontrano.

  The words are his and are never edited. What IS ours is the decision about
  where each line is allowed to appear, and that decision had drifted:

  - The announcement was stripped from the arrival in s.72, because an
    announcement belongs where the thing is announced rather than on a screen
    the reader has not asked a question on yet.
  - The home page's chapters block then printed the SAME statement whole, three
    lines including the announcement, four screens further down. So the page
    both suppressed the line and shipped it, and printed the arrival's own line
    a second time on the way past.

  This module is the single place that knows the rule, so a page asks for a line
  rather than slicing the text itself. Two callers doing their own regex is how
  the two halves of one page came to disagree.

  Nothing here shortens, joins, or rewrites a line. It only chooses.
*/

/*
  The announcement, in both languages he writes in. Anchored, so a line that
  merely contains the word is untouched, and \b so "presentiamoci" is not an
  announcement. If he ever opens with a third form, this is the one place to add
  it and every page follows.
*/
const ANNOUNCEMENT = /^(we present|presentiamo)\b/i;

/** His statement split on his own line breaks. Blank lines are not lines. */
export function statementLines(statement: string | null): string[] {
  return (statement ?? "")
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Every line except the announcement: the ones that DESCRIBE the drop rather
 * than declare it. This is what a page shows when it is not the drop's own.
 */
export function describingLines(statement: string | null): string[] {
  return statementLines(statement).filter((line) => !ANNOUNCEMENT.test(line));
}

/**
 * The announcement line itself, or null. Its home is the drop's own page and
 * the list of drops; nowhere else asks for it.
 */
export function announcementLine(statement: string | null): string | null {
  return statementLines(statement).find((line) => ANNOUNCEMENT.test(line)) ?? null;
}

/**
 * One line of his, chosen so a single page never prints the same line twice.
 *
 * `spent` is the lines that page has already used. The arrival takes the first
 * describing line; the chapters block four screens below asks for the next one
 * and gets a different sentence rather than an echo. When a drop has only one
 * describing line, repeating it is better than showing nothing, so the last
 * resort is the first line rather than null.
 */
export function unspentLine(statement: string | null, spent: readonly string[]): string | null {
  const lines = describingLines(statement);
  return lines.find((line) => !spent.includes(line)) ?? lines[0] ?? null;
}
