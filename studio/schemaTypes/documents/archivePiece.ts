import {defineType, defineField} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

/*
  A GALLERY IMAGE. Revised 2026-08-02 by the owner's decision, and the change is
  a change of kind, not of degree (DESIGN-PLAN section 18, rewritten).

  It was an ARCHIVE: past work, dated, one frame per distinct piece, evidence
  that a body of work exists. Section 18 set a condition on that, and the
  condition was right for an archive: without a year it was a mood board rather
  than a record.

  It is a GALLERY now: the brand's imagery, held as a sequence. An archive wants
  chronology and provenance; a gallery wants rhythm. So the YEAR field is gone
  entirely, the name is optional and usually absent, and a frame is allowed to
  be here simply because it is a good photograph. The condition in section 18 no
  longer applies, because it was measuring the wrong object.

  Still deliberately NOT a garment: a gallery image cannot be enquired about,
  has no price and no reference measurements.
*/
export const archivePiece = defineType({
  name: 'archivePiece',
  title: 'Immagine della galleria',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Come si chiama',
      type: 'string',
      description:
        'Facoltativo. Se vuoto, la frase resta muta e si vede solo la fotografia.',
    }),
    defineField({
      name: 'media',
      title: 'Le fotografie',
      type: 'array',
      of: [{type: 'media'}],
      description:
        "Di solito una sola. Trascina per riordinare. In una galleria l'ordine e il ritmo sono tutto. / Usually just one. Drag to reorder. In a gallery the order and the rhythm are the whole design.",
      validation: (Rule) => Rule.min(1).error('At least one photograph is required'),
    }),
    orderRankField({type: 'archivePiece'}),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {title: 'title', media: 'media.0.poster'},
    prepare({title, media}) {
      return {title: title || '(senza nome / untitled)', media}
    },
  },
})
