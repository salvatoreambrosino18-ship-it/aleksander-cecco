import {defineType, defineField} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {SIZE_OPTIONS} from '../constants/sizes'

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
      name: 'category',
      title: 'Categoria / Category',
      type: 'string',
      description: 'Usata per filtrare il catalogo. / Used to filter the catalogue.',
      options: {
        list: [
          {title: 'Uomo', value: 'uomo'},
          {title: 'Donna', value: 'donna'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sizes',
      title: 'Taglie disponibili / Available sizes',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'I capi sono rifatti su richiesta. Seleziona le taglie offerte per questo capo. "Su misura" apre nel modulo di richiesta i campi torace, spalle e lunghezza in centimetri. / Pieces are remade on request. Select the sizes offered for this garment. "Made to measure" reveals chest, shoulders and length in centimetres in the enquiry form.',
      options: {list: SIZE_OPTIONS, layout: 'grid'},
      // The real size range is still pending from the owner, so this warns
      // rather than blocks. See schemaTypes/constants/sizes.ts.
      validation: (Rule) =>
        Rule.min(1).warning('Select at least one size, otherwise the enquiry form has nothing to offer.'),
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
      name: 'materials',
      title: 'Materiali / Materials',
      type: 'localeText',
      // Editable per piece; this is only the starting value on a new garment.
      initialValue: {it: '100% pelle italiana', en: '100% Italian leather'},
    }),
    defineField({
      name: 'measurements',
      title: 'Misure del capo campione / Measurements of the sample piece',
      type: 'text',
      rows: 3,
      description:
        'Misure di riferimento del capo fotografato, NON del capo che ricevera chi acquista: ogni capo viene rifatto sulla taglia richiesta. Non tradotto. Mostrato in monospazio. / Reference measurements of the photographed sample piece, NOT of the garment the buyer receives: each piece is remade in the size requested. Not translated. Shown in monospace.',
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
    // Not a sold state: the garments are remade on request, so nothing sells
    // out. This means "we are not taking requests for this piece right now".
    defineField({
      name: 'notOffered',
      title: 'Non disponibile su richiesta / Not currently offered',
      type: 'boolean',
      initialValue: false,
      description:
        'Il capo resta visibile sul sito, ma il pulsante di richiesta e disattivato con una breve spiegazione. / The garment stays visible on the site, but the enquiry button is disabled with a short explanation.',
    }),
    defineField({
      name: 'notOfferedNote',
      title: 'Spiegazione / Explanation',
      type: 'localeString',
      description:
        'Una riga, mostrata al posto del pulsante di richiesta. Se vuota il sito usa il testo predefinito. / One line, shown in place of the enquiry button. If empty the site uses the default text.',
      hidden: ({parent}) => !parent?.notOffered,
    }),
    orderRankField({type: 'garment'}),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {
      title: 'name',
      ref: 'referenceCode',
      collection: 'collection.name',
      media: 'images.0',
      notOffered: 'notOffered',
    },
    prepare({title, ref, collection, media, notOffered}) {
      const parts = [ref, collection, notOffered ? 'NON DISPONIBILE / NOT OFFERED' : null].filter(
        Boolean,
      )
      return {title, subtitle: parts.join('  /  '), media}
    },
  },
})
