import {defineType, defineField} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const garment = defineType({
  name: 'garment',
  title: 'Capo',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Come si chiama',
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
      title: 'Codice del capo',
      type: 'string',
      description: 'Codice del capo. Mostrato in monospazio.',
    }),
    defineField({
      name: 'collection',
      title: 'A quale drop appartiene',
      type: 'reference',
      to: [{type: 'collection'}],
      description:
        "Lasciare vuoto se la Creatura non appartiene a nessuna collezione: la pagina lo dice esplicitamente invece di lasciare un buco.",
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
      title: 'Tenebrae o Lux',
      type: 'string',
      options: {
        list: [
          {title: 'Tenebrae (pelle nera lavata)', value: 'tenebrae'},
          {title: 'Lux (i pezzi chiari)', value: 'lux'},
          {title: 'Rubedo (il rosso, fuori dai drop)', value: 'rubedo'},
        ],
        layout: 'radio',
      },
      description:
        "Divide il catalogo per materiale e colore. Lasciare vuoto se la Creatura non appartiene a nessuno dei due.",
    }),
    /*
      WHO IT IS FOR (2026-08-04). A FILTER, never a route and never a section.

      Every shop studied divides by gender first, and for a catalogue of
      hundreds that is right. Ours is seventeen, and halving it to eight is not
      a useful reduction. More importantly it contradicts the product: a shirt
      cut to the measurements of the person ordering is that person's shirt,
      which is what the owner said about Armonyen and what removed Uomo/Donna
      as a taxonomy in section 26.

      LEAVE IT UNSET rather than guessing. An unset piece appears under every
      filter, which is the honest behaviour when nobody has said.
    */
    defineField({
      name: 'wornBy',
      title: 'Per chi e\'',
      type: 'string',
      options: {
        list: [
          {title: 'Uomo', value: 'men'},
          {title: 'Donna', value: 'women'},
          {title: 'Tutti e due', value: 'both'},
        ],
        layout: 'radio',
      },
      description:
        "Solo un filtro nel catalogo: non divide il sito e non compare come sezione. Lasciare vuoto se non e stato deciso.",
    }),
    /*
      THE SIZES THIS PIECE IS MADE IN (2026-08-12, section 101).

      Section 17 deleted sizes on 2026-08-02 and closed with DO NOT REINTRODUCE
      SIZES. This reintroduces them, on the owner's third answer to the same
      question (section 100 records all three): the buyer chooses a size, he
      makes the piece in that size, and the site presents it the way an ordinary
      shop does.

      FIVE VALUES AND NO MORE. XS to XL is what a small atelier can cut and what
      a European buyer reads without a chart; numeric sizing (44, 46, 48) is
      country-specific and would need one, and half-sizes on a hand-cut leather
      garment are a promise nobody can keep.

      ONE SIZE IS A VALUE, NOT AN EMPTY LIST. His own words describe pieces with
      an adjustable choker as One Size, and that is a decision he made — while an
      empty list is a decision nobody has made yet. Left as the same state, the
      site could not tell "this piece is one size" from "nobody has said", which
      is precisely the shape of gap this project keeps discovering late
      (section 80). So: tick ONE SIZE and the page says so and the order asks
      nothing; leave it empty and `launch-check` refuses until someone chooses.

      THIN ON PURPOSE (section 100). One array on one document. No constants
      file, no library, no derived state, because this question has changed
      three times in ten days and will change again.
    */
    defineField({
      name: 'sizes',
      title: 'In che taglie lo fai',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'XS', value: 'XS'},
          {title: 'S', value: 'S'},
          {title: 'M', value: 'M'},
          {title: 'L', value: 'L'},
          {title: 'XL', value: 'XL'},
          {title: 'Taglia unica', value: 'ONE'},
        ],
        layout: 'grid',
      },
      description:
        "Le taglie in cui fai questo pezzo. Se il pezzo e uno solo per tutti (per esempio con il collo regolabile) spunta TAGLIA UNICA. Vuoto vuol dire che non l'hai ancora deciso, e il sito non parte. / The sizes you make this piece in. If it fits everyone (an adjustable choker, say) tick ONE SIZE. Empty means undecided, and the launch check refuses.",
    }),
    defineField({
      name: 'price',
      title: 'Prezzo in euro',
      type: 'number',
      description:
        'Solo il numero, senza il simbolo dell\'euro. ' +
        'SENZA PREZZO il capo resta sul sito e si puo\' ancora chiedere, ma sparisce dalla pagina ' +
        '«Ordina piu\' pezzi», perche\' li\' c\'e\' un totale da fare e una riga senza prezzo lo falserebbe.',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Valuta',
      type: 'string',
      initialValue: 'EUR',
      options: {list: [{title: 'EUR', value: 'EUR'}]},
      readOnly: true,
    }),
    defineField({
      name: 'materials',
      title: 'Di cosa e\' fatto',
      type: 'localeText',
      // Editable per Creature; this is only the starting value on a new one.
      // Corrected 2026-08-02: the owner's text says vegetable-tanned, which is a
      // tanning process, not just a country of origin.
      initialValue: {it: '100% pelle conciata al vegetale', en: '100% vegetable-tanned leather'},
    }),
    defineField({
      name: 'measurements',
      title: 'Misure di riferimento',
      type: 'text',
      rows: 3,
      description:
        // Riscritto 13/08/2026: dal 12/08 il negozio non prende piu misure (sezione 98),
        // quindi la vecchia spiegazione descriveva un flusso che non esiste.
        'Le misure del capo fotografato, per far capire taglio e proporzioni. Chi compra sceglie una TAGLIA, e il sito non chiede piu le misure del corpo. Non tradotto. Mostrato in monospazio. / The measurements of the photographed piece, so a visitor can judge cut and proportion. The buyer chooses a SIZE, and the site no longer asks for body measurements. Not translated. Shown in monospace.',
    }),
    defineField({
      name: 'description',
      title: 'La descrizione del capo',
      type: 'localeText',
    }),
    defineField({
      name: 'media',
      title: 'Le fotografie',
      type: 'array',
      of: [{type: 'media'}],
      description:
        'Spunta le taglie in cui fai questo capo. Se sta bene a tutti — per esempio ha il collo ' +
        'regolabile — spunta TAGLIA UNICA. ' +
        'FINCHE\' LO LASCI VUOTO chi compra non puo\' scegliere niente, e nel modulo d\'ordine la taglia ' +
        'non compare proprio. Adesso e\' vuoto su tutti i capi: e\' la cosa piu\' utile che puoi sistemare.' +
        'del capo. E\' anche quella che si vede nel catalogo e quando qualcuno condivide il link. ' +
        'Trascina per cambiare l\'ordine: la prima in alto e\' la prima che si vede. ' +
        'Ogni fotografia occupa uno schermo intero, quindi otto fotografie sono otto schermate.',
      validation: (Rule) => Rule.min(1).error('At least one image is required'),
    }),
    /*
      HOW THIS CREATURE CAN BE HAD (2026-08-02, from the owner's own captions).

      A boolean could not say what his Instagram says. Some Creature are made to
      order; the Rubedo shirt was "sold as a private order" and is 1/1; and
      "not taking requests" is a fourth, different thing. Nothing here is a sold
      state: nothing sells out when a piece is built on request.

      Replaces the old notOffered boolean, which only knew two of the four.

      DISPONIBILE SUBITO added 2026-08-03, and it is a real state rather than a
      shade of made to order: the owner has pieces that exist and can be had
      immediately (the black trousers) beside pieces that are sold and would be
      remade (the pale ones). Section 31 costed exactly this and section 41
      closed it on the answer he gave then; he has since given a different one,
      so the fifth value the costing anticipated is here.

      IT CHANGES WHAT THE MEASUREMENTS MEAN, which is the trap section 31 named.
      On a made to order piece they describe the photographed sample. On a piece
      available now they describe the object that will arrive. The site follows
      the label rather than duplicating the field.
    */
    defineField({
      name: 'availability',
      title: 'Come si ottiene',
      type: 'string',
      initialValue: 'readyNow',
      options: {
        list: [
          {title: 'Si\', c\'e\' ed e\' in vendita', value: 'readyNow'},
          {title: 'Pezzo unico, 1 di 1', value: 'unique'},
          {title: 'Ordine privato', value: 'privateOrder'},
          {title: 'Non disponibile ora', value: 'notOffered'},
        ],
        layout: 'radio',
      },
      description:
        "Ogni Creatura esiste e si compra com'e (2026-08-12). 'Su ordinazione' non esiste piu: il su misura si chiede per email, e sulla pagina del pezzo c'e la riga che lo dice. Ordine privato e non disponibile restano visibili ma senza pulsante. / Every Creature exists and is bought as it is (2026-08-12). 'Made to order' is gone: made to measure is asked for by email, and the piece's page carries the line that says so. Private order and not available stay visible but carry no button.",
    }),
    defineField({
      name: 'availabilityNote',
      title: 'Una riga in piu\', se serve',
      type: 'localeString',
      description:
        "Una riga, al posto del pulsante di richiesta. Se vuota il sito usa la formula predefinita.",
      hidden: ({parent}) => parent?.availability === 'readyNow',
    }),
    /*
      WHAT ON THIS DOCUMENT WAS INVENTED (2026-08-03).

      The site had to stop showing braces, so names, prices, compositions,
      measurements and descriptions were written to be plausible and consistent
      with the owner's voice and with the pricing analysis in DESIGN-PLAN
      section 32. NONE of it is his.

      Nothing on the page says so, deliberately: a visitor should see a finished
      product. This field is where it says so instead, and `npm run launch-check`
      REFUSES to pass while any document still carries one. That is the whole
      mechanism: invisible to a visitor, impossible to ship past.

      Clear a name from this list the moment the real value replaces it.
    */
    defineField({
      name: 'inventedFields',
      title: 'Campi inventati, da sostituire',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Come si chiama', value: 'name'},
          {title: 'Il prezzo', value: 'price'},
          {title: 'Di cosa e\' fatto', value: 'materials'},
          {title: 'Le misure', value: 'measurements'},
          {title: 'La descrizione del capo', value: 'description'},
          {title: 'Descrizione: la traduzione italiana e nostra', value: 'descriptionIt'},
          {title: 'Codice del capo', value: 'referenceCode'},
          {title: 'Per chi e\'', value: 'wornBy'},
        ],
        layout: 'grid',
      },
      description:
        "Ogni voce qui e un valore scritto da noi, plausibile ma non suo. Il sito non lo dice al visitatore; lo dice qui, e il controllo di lancio non passa finche' la lista non e vuota. / Every entry here is a value we wrote: plausible, and not his. The site does not tell a visitor; it says so here, and the launch check does not pass until the list is empty.",
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
      invented: 'inventedFields',
    },
    prepare({title, ref, collection, media, notOffered, invented}) {
      const parts = [
        ref,
        collection,
        notOffered ? 'NON DISPONIBILE / NOT OFFERED' : null,
        invented?.length ? `INVENTATO: ${invented.join(', ')}` : null,
      ].filter(Boolean)
      return {title, subtitle: parts.join('  /  '), media}
    },
  },
})
