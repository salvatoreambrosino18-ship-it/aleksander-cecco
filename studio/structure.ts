import type {StructureResolver} from 'sanity/structure'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

/*
  L'ORDINE DI QUESTO ELENCO E' L'ORDINE IN CUI LE COSE SI TOCCANO
  (2026-08-18, sezione 128).

  Prima era: Collezioni, Capi, Archivio, Impostazioni — cioe' l'ordine in cui
  erano stati scritti gli schemi, che non vuol dire niente per chi ci lavora.

  Adesso e' l'ordine della sua settimana. I CAPI per primi: e' l'unica cosa che
  cambia davvero spesso, perche' ogni fotografia nuova e ogni prezzo nuovo sta
  li'. Poi i DROP, che cambiano quando esce una collezione. Poi la HOME E LE
  PAGINE, che cambiano quando cambiano le fotografie. Poi LE PAROLE, che si
  riscrivono di rado. L'ARCHIVIO per ultimo, perche' e' roba gia' venduta.

  I titoli sono in italiano e basta. Erano bilingui — «Capi / Garments» — e
  l'inglese li' non serviva a nessuno: lo studio lo usa lui.
*/
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Il sito')
    .items([
      orderableDocumentListDeskItem({
        type: 'garment',
        title: 'I capi',
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'collection',
        title: 'I drop',
        S,
        context,
      }),
      S.divider(),
      S.listItem()
        .title('La home e le pagine')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('La home e le pagine'),
        ),
      S.listItem()
        .title('Le parole del sito')
        .id('siteCopy')
        .child(
          S.document().schemaType('siteCopy').documentId('siteCopy').title('Le parole del sito'),
        ),
      S.divider(),
      orderableDocumentListDeskItem({
        type: 'archivePiece',
        title: 'Archivio (venduti)',
        S,
        context,
      }),
    ])
