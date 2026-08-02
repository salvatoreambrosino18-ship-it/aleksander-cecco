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
    /*
      The home page. The opening photograph is the first thing a visitor meets;
      the sequence below it is the band of tiles (see homeTile).
    */
    defineField({
      name: 'openingMedia',
      title: 'Fotografia di apertura / Opening photograph',
      type: 'media',
      description:
        'La prima cosa che si vede dopo la firma. A tutto schermo. / The first thing seen after the signature. Full screen.',
    }),
    defineField({
      name: 'homeSequence',
      title: 'Sequenza in home / Home sequence',
      type: 'array',
      of: [{type: 'homeTile'}],
      description:
        'I riquadri sotto la fotografia di apertura, in ordine. Da tre a sei: si scorre, non scorre da solo. / The tiles below the opening photograph, in order. Three to six: the reader scrolls, nothing moves by itself.',
      validation: (Rule) => Rule.max(8).warning('More than eight tiles is a long scroll before anything else.'),
    }),
    defineField({
      name: 'aboutMedia',
      title: 'Fotografie di Chi siamo / About photographs',
      type: 'array',
      of: [{type: 'media'}],
      description:
        'Immagini di processo e materiale, alternate al testo. / Process and material images, interleaved with the text.',
    }),
    defineField({
      name: 'about',
      title: 'Chi siamo / About',
      type: 'localeText',
      description:
        'La storia del marchio. Righe e paragrafi vengono rispettati. / The brand story. Line and paragraph breaks are kept.',
    }),
    /*
      The story on the site is a draft nobody has approved. While this is on,
      the about page marks it as such in the same register as a placeholder, so
      an unapproved voice can never be mistaken for the brand's own. Replacing
      it is: paste the approved text, turn this off. No code, no deploy.
    */
    defineField({
      name: 'aboutIsDraft',
      title: 'Testo non approvato / Text not approved',
      type: 'boolean',
      description:
        'Acceso finche il titolare non approva il testo. Il sito lo mostra marcato come bozza. / On until the owner approves the text. The site shows it marked as a draft.',
      initialValue: true,
    }),
    defineField({
      name: 'shippingReturns',
      title: 'Spedizioni e resi / Shipping and returns',
      type: 'localeText',
    }),
    /*
      Ambient sound. The field exists so the file has somewhere to live; the
      player is deliberately not built yet (DESIGN-PLAN section 15).

      It cannot autoplay. Every current browser blocks audio that starts without
      a user gesture, and a site that tried would simply be muted by the
      browser, or worse, would surprise someone scrolling in public. So it is
      opt-in from a small corner control, off by default.
    */
    defineField({
      name: 'ambientAudio',
      title: 'Suono ambiente / Ambient sound',
      type: 'file',
      description:
        "Facoltativo. Un file audio breve, in loop, che il visitatore puo' accendere da un piccolo comando nell'angolo. NON parte da solo: i browser bloccano l'audio automatico, quindi resta spento finche' non lo si accende. Rimane spento per chi ha chiesto di ridurre le animazioni. / Optional. A short looping audio file the visitor can switch on from a small corner control. It does NOT start on its own: browsers block automatic audio, so it stays off until switched on. It stays off for anyone who has asked for reduced motion.",
      options: {accept: 'audio/mpeg,audio/mp4,audio/ogg,audio/wav'},
    }),
    // One file only. The supplied signature SVG paints with currentColor, so it
    // inverts with the page and serves both polarities. See DESIGN-PLAN.md
    // section 3.
    defineField({
      name: 'logo',
      title: 'Logo (firma / signature)',
      type: 'image',
      description:
        'Un solo file. La firma SVG usa currentColor e si inverte con la pagina, quindi vale sia per il bianco sia per il nero. / One file only. The signature SVG uses currentColor and inverts with the page, so it serves both the white and the black polarity.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Impostazioni / Site settings'}
    },
  },
})
