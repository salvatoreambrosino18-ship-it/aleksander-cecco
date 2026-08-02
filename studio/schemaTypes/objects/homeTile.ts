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
  preview: {
    select: {media: 'media.poster', alt: 'media.alt.it', garment: 'garment.name'},
    prepare({media, alt, garment}) {
      return {
        title: garment || alt || '(riquadro / tile)',
        subtitle: garment ? 'collegato / linked' : 'senza collegamento / no link',
        media,
      }
    },
  },
})
