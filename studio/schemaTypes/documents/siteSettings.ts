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
      THE HOME SEQUENCE, revised 2026-08-02 (DESIGN-PLAN section 21). The page
      is now a descent with five movements, and these fields are four of them:

        1. openingMedia    the arrival. one photograph, the whole screen.
        2. homeStatement   who the brand is, in three lines.
        3. homeSequence    the pieces on people, scrolled sideways.
        4. makingMedia +
           makingStatement the work behind them.
        5. (the collections and the footer follow, from their own documents)
    */
    defineField({
      name: 'openingMedia',
      title: 'Fotografia di apertura / Opening photograph',
      type: 'media',
      description:
        "La prima cosa che si vede: una fotografia a tutto schermo, non la firma. Scegliere un'immagine verticale, alta almeno 2000px, con la parte alta uniforme (chiara o scura) perche' la firma e il MENU ci passano sopra. / The first thing seen: one full-screen photograph, not the signature. Choose a vertical frame, at least 2000px tall, with an even top band (either light or dark) because the signature and MENU sit over it.",
    }),
    defineField({
      name: 'homeStatement',
      title: 'Chi siamo, in breve (home) / About the brand, short (home)',
      type: 'localeText',
      description:
        "Due o tre righe brevi, non un paragrafo. Gli a capo contano: ogni riga va a capo sulla pagina. / Two or three short lines, not a paragraph. Line breaks are meaningful: each line is set on its own line.",
    }),
    defineField({
      name: 'homeSequence',
      title: 'Addosso: i capi indossati / Worn: the pieces on people',
      type: 'array',
      of: [{type: 'homeTile'}],
      description:
        "La fascia orizzontale a meta' home. Fotografie di persone che indossano i capi: si scorre di lato, niente frecce e niente puntini. Da quattro a sei. Collegare ogni fotografia al suo capo, dove esiste. / The horizontal band halfway down the home page. Photographs of people wearing the pieces: it scrolls sideways, with no arrows and no dots. Four to six. Link each frame to its piece where one exists.",
      validation: (Rule) =>
        Rule.max(8).warning('More than eight is a long sideways scroll; four to six reads best.'),
    }),
    defineField({
      name: 'makingMedia',
      title: 'La lavorazione / The making',
      type: 'array',
      of: [{type: 'media'}],
      description:
        "Due o tre fotografie del lavoro: la pelle grezza, il banco, le mani. Non i capi finiti, che si vedono gia' sopra. / Two or three photographs of the work: the raw hide, the bench, the hands. Not finished garments, which are already shown above.",
      validation: (Rule) => Rule.max(4).warning('Two or three frames say it; more turns a claim into a gallery.'),
    }),
    defineField({
      name: 'makingStatement',
      title: 'La lavorazione, il testo / The making, the text',
      type: 'localeText',
      description:
        'Una o due righe brevi sul come sono fatti i capi. / One or two short lines about how the pieces are made.',
    }),
    /*
      One switch for every line of home-page copy that was written FOR the brand
      rather than BY it, exactly like aboutIsDraft. While it is on, each of
      those texts is marked as an unapproved draft on the page: readable, so the
      owner can judge it by reading it, but never passing as the brand's voice.
    */
    defineField({
      name: 'homeCopyIsDraft',
      title: 'Testi della home non approvati / Home copy not approved',
      type: 'boolean',
      description:
        "Acceso finche' il titolare non approva i testi della home (chi siamo in breve, lavorazione, righe del fondo pagina). / On until the owner approves the home page copy (the short about, the making, and the footer lines).",
      initialValue: true,
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
      The footer's four blocks. Instagram and the contact address are already
      fields above; these two carry the remaining pair. They are one short line
      each, not a policy: the full shipping text lives in shippingReturns.
    */
    defineField({
      name: 'footerShipping',
      title: 'Fondo pagina: spedizioni / Footer: shipping',
      type: 'localeText',
      description:
        "Una riga sola. Nessuna promessa di tempi o costi finche' non sono decisi. / One line only. No promise about timing or cost until those are decided.",
    }),
    defineField({
      name: 'footerOrigin',
      title: 'Fondo pagina: dove nasce / Footer: where it is made',
      type: 'localeText',
      description: 'Una riga sola. / One line only.',
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
