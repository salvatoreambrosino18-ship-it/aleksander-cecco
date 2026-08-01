import {defineType, defineField} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const garment = defineType({
  name: 'garment',
  title: 'Capo / Garment',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome / Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'referenceCode',
      title: 'Codice / Reference code',
      type: 'string',
      description: 'Codice del capo. Mostrato in monospazio. / Garment reference code. Shown in monospace.',
    }),
    defineField({
      name: 'collection',
      title: 'Collezione / Collection',
      type: 'reference',
      to: [{type: 'collection'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Prezzo / Price (EUR)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Valuta / Currency',
      type: 'string',
      initialValue: 'EUR',
      options: {list: [{title: 'EUR', value: 'EUR'}]},
      readOnly: true,
    }),
    defineField({
      name: 'availableSizes',
      title: 'Taglie disponibili / Available sizes',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'Le taglie effettivamente disponibili per questo capo. Popolano il modulo di richiesta. / The sizes actually available for this garment. They populate the enquiry form.',
      options: {
        list: [
          {title: 'XS', value: 'XS'},
          {title: 'S', value: 'S'},
          {title: 'M', value: 'M'},
          {title: 'L', value: 'L'},
          {title: 'XL', value: 'XL'},
          {title: 'XXL', value: 'XXL'},
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'materials',
      title: 'Materiali / Materials',
      type: 'localeText',
    }),
    defineField({
      name: 'measurements',
      title: 'Misure / Measurements',
      type: 'text',
      rows: 3,
      description: 'Non tradotto. Mostrato in monospazio. / Not translated. Shown in monospace.',
    }),
    defineField({
      name: 'description',
      title: 'Descrizione / Description',
      type: 'localeText',
    }),
    defineField({
      name: 'images',
      title: 'Galleria / Image gallery',
      type: 'array',
      of: [{type: 'galleryImage'}],
      validation: (Rule) => Rule.min(1).error('At least one image is required'),
    }),
    defineField({
      name: 'soldOut',
      title: 'Esaurito / Sold out',
      type: 'boolean',
      initialValue: false,
    }),
    orderRankField({type: 'garment'}),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {title: 'name', ref: 'referenceCode', collection: 'collection.name', media: 'images.0'},
    prepare({title, ref, collection, media}) {
      const parts = [ref, collection].filter(Boolean)
      return {title, subtitle: parts.join('  /  '), media}
    },
  },
})
