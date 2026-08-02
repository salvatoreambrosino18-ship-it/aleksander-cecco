import {defineType, defineField} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const garment = defineType({
  name: 'garment',
  title: 'Creatura / Creature',
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
      // Editable per Creature; this is only the starting value on a new one.
      // Corrected 2026-08-02: the owner's text says vegetable-tanned, which is a
      // tanning process, not just a country of origin.
      initialValue: {it: '100% pelle conciata al vegetale', en: '100% vegetable-tanned leather'},
    }),
    defineField({
      name: 'measurements',
      title: 'Misure di riferimento / Reference measurements',
      type: 'text',
      rows: 3,
      description:
        'Le misure del capo fotografato, per far capire taglio e proporzioni. NON sono le misure di chi compra: ogni capo e fatto su misura e le misure del cliente arrivano con la richiesta. Non tradotto. Mostrato in monospazio. / The measurements of the photographed piece, so a visitor can judge cut and proportion. NOT the buyer measurements: every piece is made to measure and the customer measurements arrive with the enquiry. Not translated. Shown in monospace.',
    }),
    defineField({
      name: 'description',
      title: 'Descrizione / Description',
      type: 'localeText',
    }),
    defineField({
      name: 'media',
      title: 'Galleria / Gallery',
      type: 'array',
      of: [{type: 'media'}],
      description:
        'Ogni elemento occupa uno schermo intero, senza margini. Trascina per riordinare. / Each item fills a whole screen, edge to edge. Drag to reorder.',
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
      media: 'media.0.poster',
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
