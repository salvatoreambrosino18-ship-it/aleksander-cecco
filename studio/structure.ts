import type {StructureResolver} from 'sanity/structure'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

// Drag-to-reorder lists for collections and garments, plus a single
// site-settings document. Designed to be legible on a phone.
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Contenuti / Content')
    .items([
      orderableDocumentListDeskItem({
        type: 'collection',
        title: 'Collezioni / Collections',
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'garment',
        title: 'Capi / Garments',
        S,
        context,
      }),
      S.divider(),
      S.listItem()
        .title('Impostazioni / Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])
