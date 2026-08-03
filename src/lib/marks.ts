/*
  UNAPPROVED-COPY MARKS, and why the page stopped showing them (2026-08-03).

  The site used to print "Unapproved draft", "Not yet confirmed" and
  "Provisional photograph" next to anything the owner had not approved. That was
  right while the site was a working document being read by two people. It is
  wrong for a site meant to look finished: a visitor cannot act on the
  distinction, and it makes a real brand look like a rehearsal.

  The distinction has not been dropped, it has MOVED. Every unapproved value is
  now flagged where the people who can fix it will see it:

    - `inventedFields` on each Creature, and `inventedCopy` on site settings
    - DESIGN-PLAN section 59, which lists every one in a single place
    - `npm run launch-check`, which REFUSES while any flag is set

  So: invisible to a visitor, impossible to ship past. Flip this to true to see
  the site as a working document again; nothing else changes.
*/
export const SHOW_UNAPPROVED_MARKS = false;
