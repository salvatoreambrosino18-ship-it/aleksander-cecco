import {defineType, defineField} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const collection = defineType({
  name: 'collection',
  title: 'Drop',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Come si chiama',
      type: 'string',
      description: 'Nome della collezione. Non tradotto.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'season',
      title: 'Stagione',
      type: 'string',
      description:
        "FACOLTATIVO. Il marchio non lavora a stagioni. Una collezione può essere semplicemente un corpo di lavoro con un nome. Lascia vuoto se non c'è una data. / OPTIONAL. The brand does not work in seasons. A collection can simply be a named body of work. Leave empty when there is no date.",
    }),
    defineField({
      name: 'statement',
      title: 'Il testo del drop',
      type: 'localeText',
      description:
        'DUE O TRE RIGHE BREVI, non un paragrafo. Ogni riga va a capo dove vuoi tu, e le interruzioni di riga contano e il sito le rispetta.',
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
      title: 'La fotografia di copertina',
      type: 'media',
      description:
        'A tutto schermo, senza margini. Puo essere una foto o un video con la sua immagine di copertina.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'published',
      title: 'Si vede sul sito',
      type: 'boolean',
      description:
        'Solo le collezioni pubblicate appaiono sul sito.',
      initialValue: false,
    }),
    orderRankField({type: 'collection'}),

    defineField({
      name: 'slug',
      title: 'L\'indirizzo della pagina',
      type: 'slug',
      description: 'Generato dal nome. Usato nel percorso della pagina.',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {title: 'name', subtitle: 'season', media: 'cover.poster'},
  },
})
