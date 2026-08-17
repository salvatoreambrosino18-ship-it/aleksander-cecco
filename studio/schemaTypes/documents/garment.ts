import {defineType, defineField} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const garment = defineType({
  name: 'garment',
  title: 'Capo',
  type: 'document',
  /*
    L'ORDINE DI QUESTO MODULO È L'ORDINE DELLA SUA SETTIMANA (2026-08-19,
    sezione 130).

    Prima era l'ordine in cui i campi erano stati scritti, e il risultato si
    misurava: per cambiare un prezzo doveva passare sette campi, e il SECONDO
    che incontrava era «Slug (URL)», con un pulsante Generate accanto — cioè
    l'unico campo che non deve toccare mai. Le fotografie, che sono la cosa che
    cambia di più, stavano al decimo posto. Il modulo era alto 4211 pixel in
    una finestra da 702: sei schermate.

    Adesso: fotografie, prezzo, taglie, disponibilità, nome. Poi i testi. Poi,
    CHIUSO, tutto quello che si imposta una volta sola e non si tocca più.

    Niente è stato tolto: il gruppo chiuso si apre con un clic e c'è dentro
    tutto quanto, slug compreso.
  */
  fieldsets: [
    {
      name: 'testi',
      title: 'I testi del capo',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'impostazioni',
      title: 'Impostazioni del capo (si mettono una volta sola)',
      description:
        'Qui dentro c\'è quello che si decide quando crei il capo e poi non si tocca più. ' +
        'Aprilo solo se sai cosa stai cercando.',
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: [

    defineField({
      name: 'media',
      title: 'Le fotografie',
      type: 'array',
      of: [{type: 'media'}],
      /*
        QUESTA DESCRIZIONE PARLAVA DELLE TAGLIE (corretto 2026-08-16, sezione
        130). Sotto «Le fotografie» il titolare leggeva le istruzioni per
        spuntare le taglie, e poi la frase ripartiva a metà — «del capo. È anche
        quella che si vede nel catalogo» — senza un inizio. Due descrizioni si
        erano sovrapposte in una modifica precedente, e il campo più importante
        del modulo spiegava un altro campo.
      */
      description:
        'La prima della lista è quella che apre la pagina del capo. ' +
        'È anche quella che si vede nel catalogo e quando qualcuno condivide il link. ' +
        'Trascina per cambiare l\'ordine: la prima in alto è la prima che si vede. ' +
        'Ogni fotografia occupa uno schermo intero, quindi otto fotografie sono otto schermate.',
      validation: (Rule) => Rule.min(1).error('At least one image is required'),
    }),

    defineField({
      name: 'price',
      title: 'Prezzo in euro',
      type: 'number',
      description:
        'Solo il numero, senza il simbolo dell\'euro. ' +
        'SENZA PREZZO il capo resta sul sito e si può ancora ordinare dal suo modulo, ma non si può ' +
        'mettere nel CARRELLO, perché lì c\'è un totale da fare e una riga senza prezzo lo falserebbe.',
      validation: (Rule) => Rule.min(0),
    }),

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
      name: 'availability',
      title: 'Si può comprare?',
      type: 'string',
      initialValue: 'readyNow',
      options: {
        list: [
          {title: 'Sì, c\'è ed è in vendita', value: 'readyNow'},
          {title: 'Sì, ma ne esiste uno solo', value: 'unique'},
          {title: 'No, è già di qualcuno', value: 'privateOrder'},
          {title: 'No, adesso non lo faccio', value: 'notOffered'},
        ],
        layout: 'radio',
      },
      description:
        "Ogni Creatura esiste e si compra com'e. Su misura NON si fa piu, in nessuna forma, e dal 16/08/2026 il sito non lo dice piu da nessuna parte. Chi compra sceglie una taglia. Ordine privato e non disponibile restano visibili ma senza pulsante. / Every Creature exists and is bought as it is. Made to measure is not offered at all, and since 2026-08-16 the site no longer mentions it anywhere. The buyer chooses a size. Private order and not available stay visible but carry no button.",
    }),

    defineField({
      name: 'name',
      title: 'Come si chiama',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'availabilityNote',
      fieldset: 'testi',
      title: 'Una riga in più, se serve',
      type: 'localeString',
      description:
        "Una riga, al posto del pulsante di richiesta. Se vuota il sito usa la formula predefinita.",
      hidden: ({parent}) => parent?.availability === 'readyNow',
    }),

    defineField({
      name: 'materials',
      fieldset: 'testi',
      title: 'Di cosa è fatto',
      type: 'localeText',
      // Editable per Creature; this is only the starting value on a new one.
      // Corrected 2026-08-02: the owner's text says vegetable-tanned, which is a
      // tanning process, not just a country of origin.
      initialValue: {it: '100% pelle conciata al vegetale', en: '100% vegetable-tanned leather'},
    }),

    defineField({
      name: 'description',
      fieldset: 'testi',
      title: 'La descrizione del capo',
      type: 'localeText',
    }),

    defineField({
      name: 'measurements',
      fieldset: 'testi',
      title: 'Misure di riferimento',
      type: 'text',
      rows: 3,
      description:
        // Riscritto 13/08/2026: dal 12/08 il negozio non prende piu misure (sezione 98),
        // quindi la vecchia spiegazione descriveva un flusso che non esiste.
        'Le misure del capo fotografato, per far capire taglio e proporzioni. Chi compra sceglie una TAGLIA, e il sito non chiede piu le misure del corpo. Non tradotto. Mostrato in monospazio. / The measurements of the photographed piece, so a visitor can judge cut and proportion. The buyer chooses a SIZE, and the site no longer asks for body measurements. Not translated. Shown in monospace.',
    }),

    defineField({
      name: 'collection',
      fieldset: 'testi',
      title: 'A quale drop appartiene',
      type: 'reference',
      to: [{type: 'collection'}],
      description:
        "Lasciare vuoto se la Creatura non appartiene a nessuna collezione. La pagina lo dice esplicitamente invece di lasciare un buco.",
    }),

    defineField({
      name: 'wornBy',
      fieldset: 'impostazioni',
      title: 'Per chi è',
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
        "Solo un filtro nel catalogo. Non divide il sito e non compare come sezione. Lasciare vuoto se non e stato deciso.",
    }),

    defineField({
      name: 'stage',
      fieldset: 'impostazioni',
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

    defineField({
      name: 'referenceCode',
      fieldset: 'impostazioni',
      title: 'Il tuo codice interno',
      type: 'string',
      description: 'Codice del capo. Mostrato in monospazio.',
    }),

    defineField({
      name: 'currency',
      fieldset: 'impostazioni',
      title: 'Valuta',
      type: 'string',
      initialValue: 'EUR',
      options: {list: [{title: 'EUR', value: 'EUR'}]},
      readOnly: true,
    }),

    defineField({
      name: 'slug',
      fieldset: 'impostazioni',
      title: 'L\'indirizzo della pagina',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      description:
        'È la parte finale del link di questo capo, per esempio .../creature/ghezard. ' +
        'Premi GENERATE e lo scrive da solo dal nome. ' +
        'NON CAMBIARLO su un capo già online. Tutti i link a quel capo che hai già mandato in giro ' +
        'smetterebbero di funzionare.',
      /*
        Il messaggio è un'istruzione, non una diagnosi (2026-08-19, sezione 130).
        Questo campo sta dentro un gruppo chiuso, quindi un capo nuovo si rifiuta
        di pubblicare indicando un errore in un punto che lui non vede: il testo
        gli dice dove andare invece di dirgli cosa manca.
      */
      validation: (Rule) =>
        Rule.required().error(
          'Manca l\'indirizzo della pagina. Apri «Impostazioni del capo» qui sotto e premi GENERATE.',
        ),
    }),

    defineField({
      name: 'inventedFields',
      fieldset: 'impostazioni',
      title: 'Cosa qui dentro non l\'hai scritto tu',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Come si chiama', value: 'name'},
          {title: 'Il prezzo', value: 'price'},
          {title: 'Di cosa è fatto', value: 'materials'},
          {title: 'Le misure', value: 'measurements'},
          {title: 'La descrizione del capo', value: 'description'},
          {title: 'Descrizione: la traduzione italiana e nostra', value: 'descriptionIt'},
          {title: 'Codice del capo', value: 'referenceCode'},
          {title: 'Per chi è', value: 'wornBy'},
        ],
        layout: 'grid',
      },
      description:
        "Ogni voce qui e un valore scritto da noi, plausibile ma non suo. Il sito non lo dice al visitatore; lo dice qui, e il controllo di lancio non passa finché la lista non e vuota. / Every entry here is a value we wrote: plausible, and not his. The site does not tell a visitor; it says so here, and the launch check does not pass until the list is empty.",
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
