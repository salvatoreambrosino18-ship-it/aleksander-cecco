import {defineType, defineField} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

/*
  ARCHIVE PIECE. Past work, kept as evidence that a body of work exists.

  Deliberately NOT a garment: an archive piece cannot be enquired about, has no
  price and no reference measurements, and giving it a disabled enquiry button
  would be noise on every frame.

  The archive is a SEQUENCE, not a store of everything. It reads as a series of
  full-screen frames, so its length is the whole design: eight to twelve pieces
  hold attention, thirty do not. The right way to shorten it is to delete
  documents, not to hide them.
*/
export const archivePiece = defineType({
  name: 'archivePiece',
  title: 'Archivio / Archive piece',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nome del pezzo / Piece name',
      type: 'string',
      description:
        'Facoltativo. Se vuoto, la frase resta muta e si vede solo la fotografia. / Optional. Left empty, the frame stays silent and only the photograph shows.',
    }),
    defineField({
      name: 'year',
      title: 'Anno / Year',
      type: 'string',
      description:
        "Facoltativo, ma e' quasi tutto quello che distingue un archivio da una raccolta di immagini. / Optional, but it is close to the only thing that separates an archive from a pile of images.",
    }),
    defineField({
      name: 'media',
      title: 'Fotografie / Photographs',
      type: 'array',
      of: [{type: 'media'}],
      description:
        'Di solito una sola. Ogni immagine occupa uno schermo. / Usually just one. Each image fills a screen.',
      validation: (Rule) => Rule.min(1).error('At least one photograph is required'),
    }),
    orderRankField({type: 'archivePiece'}),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {title: 'title', year: 'year', media: 'media.0.poster'},
    prepare({title, year, media}) {
      return {
        title: title || '(senza nome / untitled)',
        subtitle: year || '(senza anno / no year)',
        media,
      }
    },
  },
})
