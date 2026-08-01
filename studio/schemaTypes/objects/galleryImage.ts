import {defineType, defineField} from 'sanity'

// An image with required, localized alt text. Alt is mandatory in both
// languages so the site is never inaccessible to screen reader users in
// either locale (see the brief). Relax to Italian-only if you prefer.
export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Immagine / Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Testo alternativo / Alt text',
      description:
        'Descrizione per screen reader e SEO. Obbligatorio in italiano e inglese. / Description for screen readers and SEO. Required in Italian and English.',
      type: 'localeString',
      validation: (Rule) =>
        Rule.custom((alt: {it?: string; en?: string} | undefined) => {
          if (!alt?.it || !alt?.en) {
            return 'Alt text is required in Italian and English'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {title: 'alt.it', media: 'asset'},
  },
})
