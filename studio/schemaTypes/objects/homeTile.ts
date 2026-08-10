import {defineType, defineField} from 'sanity'

/*
  HOME TILE: one frame in the sequence below the opening photograph.

  The form comes from the primary reference, measured rather than remembered:
  Rick Owens stacks full-bleed tiles, at 1440x900 and then in pairs of 720x900
  side by side and touching on desktop, and 390x844 then 390x488 on a phone.
  There is no carousel: no arrows, no dots, nothing advances by itself, and the
  reader simply scrolls. See DESIGN-PLAN section 14.

  A tile is any photograph. If a garment is attached the tile links to it, which
  is how the sequence stays a way into the work rather than decoration.
*/
export const homeTile = defineType({
  name: 'homeTile',
  title: 'Riquadro / Tile',
  type: 'object',
  fields: [
    defineField({
      name: 'media',
      title: 'Fotografia / Photograph',
      type: 'media',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'garment',
      title: 'Capo collegato / Linked garment',
      type: 'reference',
      to: [{type: 'garment'}],
      description:
        'Facoltativo. Se collegato, il riquadro porta alla pagina del capo. / Optional. When linked, the tile leads to that garment.',
    }),
  ],
  /*
    The subtitle carries the FILENAME (2026-08-10). The band is discussed by
    filename — that is what a contact sheet lists and what the asset library
    shows — so a preview that only says "linked" cannot be matched to the frame
    being talked about. An unlinked tile says so in words, because it is the one
    fault a tile can have: the band exists to lead into the work, and a tile
    with no piece behind it leads nowhere.
  */
  preview: {
    select: {
      media: 'media.poster',
      alt: 'media.alt.it',
      garment: 'garment.name',
      file: 'media.poster.asset.originalFilename',
    },
    prepare({media, alt, garment, file}) {
      const link = garment || 'SENZA CAPO / NO PIECE LINKED'
      return {
        title: garment || alt || '(riquadro / tile)',
        subtitle: [file, link].filter(Boolean).join('  /  '),
        media,
      }
    },
  },
})
