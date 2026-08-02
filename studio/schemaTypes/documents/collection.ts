import {defineType, defineField} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const collection = defineType({
  name: 'collection',
  title: 'Collezione / Collection',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome / Name',
      type: 'string',
      description: 'Nome della collezione. Non tradotto. / Collection name. Not translated.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'Generato dal nome. Usato nel percorso della pagina. / Generated from the name. Used in the page URL.',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'season',
      title: 'Stagione / Season',
      type: 'string',
      description:
        "FACOLTATIVO. Il marchio non lavora a stagioni: una collezione puo' essere semplicemente un corpo di lavoro con un nome. Lascia vuoto se non c'e' una data. / OPTIONAL. The brand does not work in seasons: a collection can simply be a named body of work. Leave empty when there is no date.",
    }),
    defineField({
      name: 'statement',
      title: 'Testo / Statement',
      type: 'localeText',
      description:
        'DUE O TRE RIGHE BREVI, non un paragrafo. Ogni riga va a capo dove vuoi tu: le interruzioni di riga contano e il sito le rispetta. / TWO OR THREE SHORT LINES, not a paragraph. Break the lines where you want them: the line breaks are meaningful and the site keeps them.',
      validation: (Rule) =>
        Rule.custom((value: {it?: string; en?: string} | undefined) => {
          const tooLong = (['it', 'en'] as const).filter((lang) => {
            const lines = (value?.[lang] ?? '').split('\n').filter((line) => line.trim() !== '')
            return lines.length > 4
          })
          return tooLong.length
            ? 'A statement is two or three short lines, not a paragraph. Trim it.'
            : true
        }).warning(),
    }),
    defineField({
      name: 'cover',
      title: 'Copertina / Cover',
      type: 'media',
      description:
        'A tutto schermo, senza margini. Puo essere una foto o un video con la sua immagine di copertina. / Full screen, no margins. A photograph, or later a video with its poster.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'published',
      title: 'Pubblicata / Published',
      type: 'boolean',
      description:
        'Solo le collezioni pubblicate appaiono sul sito. / Only published collections appear on the site.',
      initialValue: false,
    }),
    orderRankField({type: 'collection'}),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {title: 'name', subtitle: 'season', media: 'cover.poster'},
  },
})
