import {defineType, defineField} from 'sanity'

/*
  UNA RIGA DENTRO IL MOSAICO / A LINE INSIDE THE MOSAIC.

  Non e' un paragrafo di una pagina: e' un BLOCCO, largo quanto una colonna,
  messo accanto a una fotografia e a un capo ritagliato. I riferimenti scrivono
  cosi' — Rick Owens infila la prosa fra le immagini, non sopra o sotto di esse
  (DESIGN-PLAN sezione 107, fotogrammi RO28, RO31, RO33).

  IL TITOLO E' FACOLTATIVO ed e' quasi sempre meglio lasciarlo vuoto. Serve solo
  quando due righe di seguito parlano di cose diverse; un titolo sopra un solo
  paragrafo e' un'etichetta su un'etichetta.

  COME SI SCRIVE, guardando come scrivono loro:
  - il materiale per primo: cos'e', da dove viene, cosa gli e' stato fatto;
  - un fatto, non un aggettivo. "Conciata con corteccia" e non "conciata con
    cura";
  - frasi corte, una cosa per frase;
  - se una cosa non e' risolta, si dice. Loro scrivono "we still have a ways to
    go" sulla pagina della sostenibilita';
  - mai una lode al marchio.

  Not a paragraph on a page but a BLOCK, one column wide, set beside a
  photograph and a cut-out. The heading is optional and usually better empty.
  Material first, a fact rather than an adjective, short sentences, and where
  something is unresolved it says so.
*/
export const mosaicNote = defineType({
  name: 'mosaicNote',
  title: 'Riga nel mosaico',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Titolino sopra la riga',
      type: 'localeString',
      description:
        "Facoltativo, e quasi sempre da lasciare vuoto.",
    }),
    defineField({
      name: 'text',
      title: 'La riga',
      type: 'localeText',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {heading: 'heading.it', it: 'text.it', en: 'text.en'},
    prepare({heading, it, en}) {
      const body = (it || en || '').replace(/\s+/g, ' ')
      return {
        title: heading || body.slice(0, 48) + (body.length > 48 ? '…' : ''),
        subtitle: heading ? body.slice(0, 60) : undefined,
      }
    },
  },
})
