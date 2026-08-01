// SIZES - single source of truth. Edit this file and nothing else.
//
// The garments are remade on request, they are not one-of-one. A visitor picks
// a size in the enquiry form, so the site needs a real size list.
//
// STATUS: the list below is PROVISIONAL. The real range is still pending from
// the brand owner (see DESIGN-PLAN.md section 9, "What I need from you").
// Replace SIZE_OPTIONS with the real sizes when they arrive; no other file
// needs to change.
//
// MADE_TO_MEASURE is not a size, it is an escape hatch. When a garment offers
// it and a visitor selects it, the enquiry form (built later) reveals fields
// for chest, shoulders and length in centimetres. Keep the value string stable:
// the form keys its behaviour on it.

export const MADE_TO_MEASURE = 'su-misura'

export type SizeOption = {title: string; value: string}

// PROVISIONAL standard sizes. Awaiting the owner's real range.
export const STANDARD_SIZES: SizeOption[] = [
  {title: 'S', value: 's'},
  {title: 'M', value: 'm'},
  {title: 'L', value: 'l'},
]

// What the studio shows: the standard sizes plus made to measure.
export const SIZE_OPTIONS: SizeOption[] = [
  ...STANDARD_SIZES,
  {title: 'Su misura / Made to measure', value: MADE_TO_MEASURE},
]
