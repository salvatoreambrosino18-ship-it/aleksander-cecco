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
    /*
      THE STAGE (2026-08-02). The catalogue divides by material and colour, and
      the division is the owner's, confirmed: Tenebrae is the black washed veg
      tan work, Lux the pale pieces. It replaces the Uomo/Donna category, which
      his own Armonyen caption contradicted ("designed for both him and her").

      It is deliberately NOT shown as a label on a Creature page. The stage is
      already inside the names he gives them, "Monumentus Tenebrae tibia cut",
      and a page that also printed "Stage: Tenebrae" would be the site
      explaining itself. What it drives is ORDER: the collection page groups
      tenebrae then lux, and a reader feels the division without being told it
      (DESIGN-PLAN section 28).

      Optional on purpose. Rubedo is named for a third alchemical stage the
      collection title does not include, so it is left unset rather than forced
      into one of two, and the gap asks the question instead of hiding it.
    */
    defineField({
      name: 'stage',
      title: 'Tenebrae o Lux / Tenebrae or Lux',
      type: 'string',
      options: {
        list: [
          {title: 'Tenebrae (pelle nera lavata / black washed veg tan)', value: 'tenebrae'},
          {title: 'Lux (pezzi chiari / the pale pieces)', value: 'lux'},
        ],
        layout: 'radio',
      },
      description:
        "Divide il catalogo per materiale e colore. Lasciare vuoto se la Creatura non appartiene a nessuno dei due. / Divides the catalogue by material and colour. Leave empty when the Creature belongs to neither.",
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
    /*
      HOW THIS CREATURE CAN BE HAD (2026-08-02, from the owner's own captions).

      A boolean could not say what his Instagram says. Some Creature are made to
      order; the Rubedo shirt was "sold as a private order" and is 1/1; and
      "not taking requests" is a fourth, different thing. Nothing here is a sold
      state: nothing sells out when a piece is built on request.

      Replaces the old notOffered boolean, which only knew two of the four.
    */
    defineField({
      name: 'availability',
      title: 'Come si ottiene / How it can be had',
      type: 'string',
      initialValue: 'madeToOrder',
      options: {
        list: [
          {title: 'Su ordinazione / Made to order', value: 'madeToOrder'},
          {title: 'Pezzo unico, 1 di 1 / Unique, 1 of 1', value: 'unique'},
          {title: 'Ordine privato / Private order', value: 'privateOrder'},
          {title: 'Non disponibile ora / Not taking requests now', value: 'notOffered'},
        ],
        layout: 'radio',
      },
      description:
        "Unica e ordine privato restano visibili e leggibili, ma senza pulsante di richiesta: non si possono ordinare di nuovo. / Unique and private order stay visible and readable but carry no enquiry button: they cannot be ordered again.",
    }),
    defineField({
      name: 'availabilityNote',
      title: 'Riga aggiuntiva / Extra line',
      type: 'localeString',
      description:
        "Una riga, al posto del pulsante di richiesta. Se vuota il sito usa la formula predefinita. / One line, in place of the enquiry button. If empty the site uses its default wording.",
      hidden: ({parent}) => parent?.availability === 'madeToOrder',
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
