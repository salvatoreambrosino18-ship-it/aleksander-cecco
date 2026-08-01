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
      description: 'Ad esempio SS26. Mostrata in monospazio. / For example SS26. Shown in monospace.',
    }),
    defineField({
      name: 'statement',
      title: 'Testo / Statement',
      type: 'localeText',
      description: 'Breve testo introduttivo della collezione. / Short introductory text for the collection.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Immagine di copertina / Cover image',
      type: 'galleryImage',
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
    select: {title: 'name', subtitle: 'season', media: 'coverImage'},
  },
})
