import {defineType, defineField} from 'sanity'

// Singleton (a single editable document, enforced by the studio structure).
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Impostazioni / Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'instagramUrl',
      title: 'Instagram',
      type: 'url',
      initialValue: 'https://www.instagram.com/aleksandercecco',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Email di contatto / Contact email',
      type: 'string',
      description:
        'Segnaposto fino al lancio. Sostituire prima di andare online. / Placeholder until launch. Replace before going live.',
      initialValue: 'info@example.com',
      validation: (Rule) => [
        Rule.email(),
        // Warn (not block) so the placeholder cannot ship unnoticed.
        Rule.custom((value) =>
          value === 'info@example.com'
            ? 'Placeholder email. Replace with the real contact address before launch.'
            : true,
        ).warning(),
      ],
    }),
    defineField({
      name: 'about',
      title: 'Chi siamo / About',
      type: 'localeText',
    }),
    defineField({
      name: 'shippingReturns',
      title: 'Spedizioni e resi / Shipping and returns',
      type: 'localeText',
    }),
    defineField({
      name: 'logoBlackOnWhite',
      title: 'Logo nero su bianco / Logo black on white',
      type: 'image',
      description: 'Usato nella polarita chiara. / Used in the light polarity.',
    }),
    defineField({
      name: 'logoWhiteOnBlack',
      title: 'Logo bianco su nero / Logo white on black',
      type: 'image',
      description: 'Usato nella polarita scura. / Used in the dark polarity.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Impostazioni / Site settings'}
    },
  },
})
