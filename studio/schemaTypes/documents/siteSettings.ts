import {defineType, defineField, defineArrayMember} from 'sanity'

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
        "L'indirizzo a cui scrivono i visitatori. Mostrato sul sito. / The address visitors write to. Shown on the site.",
      // SUPPLIED by the owner 2026-08-03. The placeholder that stood here for
      // two days is gone; a new project starts empty rather than starting with
      // a fake address that has to be remembered about.
      initialValue: 'aleksandercecco@gmail.com',
      validation: (Rule) => [
        Rule.email(),
        /*
          The example.com guard stays, and it is not dead code: it is what makes
          a placeholder impossible to ship if anyone ever types one in again.
          It cost the top slot on the launch checklist for two days.
        */
        Rule.custom((value) =>
          typeof value === 'string' && /@example\.(com|org|net)$/i.test(value.trim())
            ? 'That is a placeholder address. The site will refuse to link it.'
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
    /*
      HIS OPENING LINES (2026-08-12, section 99). Three short lines over the
      first photograph, approved and verbatim from his own document. They used
      to be borrowed from the current drop's statement, which meant the home
      page's first words changed whenever a drop did and were never written for
      that screen.
    */
    defineField({
      name: 'openingLines',
      title: 'Righe di apertura / Opening lines',
      type: 'localeText',
      description:
        "Le tre righe sulla prima fotografia. Vanno a capo come le scrivi. / The three lines over the first photograph. Line breaks are kept exactly as you type them.",
    }),
    /*
      THE THREE REASONS (section 99). His replacement for THE MAKING: three
      titled passages, in his order and his words. An array rather than one
      text field because each has a heading he chose — OUR SKINS, REASONS,
      REBORN — and a heading is not punctuation.
    */
    defineField({
      name: 'philosophy',
      title: 'Le tre ragioni / The three reasons',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'reason',
          fields: [
            defineField({name: 'title', title: 'Titolo / Title', type: 'string'}),
            defineField({name: 'text', title: 'Testo / Text', type: 'localeText'}),
          ],
          preview: {select: {title: 'title', subtitle: 'text.en'}},
        }),
      ],
      description:
        'Titolo e testo, nel suo ordine. Sostituisce il vecchio blocco THE MAKING. / A title and a passage, in his order. Replaces the old THE MAKING block.',
    }),
    defineField({
      name: 'homeStatement',
      title: 'Chi siamo, in breve (home) / About the brand, short (home)',
      type: 'localeText',
      description:
        "Due o tre righe brevi, non un paragrafo. Gli a capo contano: ogni riga va a capo sulla pagina. / Two or three short lines, not a paragraph. Line breaks are meaningful: each line is set on its own line.",
    }),
    /*
      THE ORDER OF THE BAND IS THIS LIST, and nothing else (2026-08-10).

      It always was — a Sanity array is dragged into order — but nothing said
      so, and a sequence whose control is invisible gets changed by asking a
      developer. That is the failure being fixed here: the owner resequences his
      own photographs by dragging, and the page follows on the next publish.

      There is deliberately NO separate number field. Two places that both claim
      to hold the order is how they end up disagreeing, and the drag order is
      the one the reader actually sees.
    */
    defineField({
      name: 'homeSequence',
      title: 'Addosso: i capi indossati / Worn: the pieces on people',
      type: 'array',
      of: [{type: 'homeTile'}],
      description:
        "La fascia orizzontale a meta' home. Fotografie di persone che indossano i capi: si scorre di lato, niente frecce e niente puntini. Da quattro a sei. Collegare ogni fotografia al suo capo, dove esiste. L'ORDINE E' QUESTO ELENCO: trascina le fotografie per riordinarle, la prima in alto e' quella piu' a sinistra nella fascia. / The horizontal band halfway down the home page. Photographs of people wearing the pieces: it scrolls sideways, with no arrows and no dots. Four to six. Link each frame to its piece where one exists. THE ORDER IS THIS LIST: drag the photographs to reorder them; the first from the top is the leftmost frame in the band.",
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
      WHICH LANGUAGES CARRY THE OWNER'S OWN VOICE (2026-08-02).

      He wrote the brand text in English. The Italian on the site is our
      translation of it, and Italian is the DEFAULT locale, so most visitors
      read a version he has never approved. That has to be visible.

      Ticking a language here says: the brand copy in this language is his, as
      he wrote it. Untick it and every brand text in that language is marked on
      the site as an unapproved translation. It is not a draft: the brand knows
      what it says, it said it in English, and only the wording is ours.

      This replaced a single homeCopyIsDraft boolean, which could not tell the
      two apart and would have labelled his own English an unapproved draft.
    */
    defineField({
      name: 'approvedLanguages',
      title: 'Lingue approvate dal titolare / Languages the owner has approved',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Italiano', value: 'it'},
          {title: 'English', value: 'en'},
        ],
        layout: 'grid',
      },
      description:
        "Spuntare una lingua quando i testi del marchio in quella lingua sono parole del titolare. Le lingue non spuntate vengono mostrate sul sito come traduzione non approvata. / Tick a language when the brand texts in it are the owner's own words. Languages left unticked are shown on the site as an unapproved translation.",
      initialValue: ['en'],
    }),
    /*
      Copy WE wrote, in every language, which no approved language can fix. Only
      the two footer lines are ours now; the rest of the brand voice is his.
    */
    defineField({
      name: 'footerCopyIsDraft',
      title: 'Righe del fondo pagina non approvate / Footer lines not approved',
      type: 'boolean',
      description:
        "Acceso finche' il titolare non approva le due righe che abbiamo scritto noi in fondo alla pagina (spedizioni, origine). / On until the owner approves the two footer lines we wrote (shipping, origin).",
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
    /*
      THE DESIGNER. A buyer sending EUR 1,500 to one person they have never met
      needs to see that person (DESIGN-PLAN sections 32 and 41). This is not the
      about page: that is the brand's story, this is who makes it.
    */
    /*
      THE TWO CREATORS (2026-08-04). The brand is two people and he named them
      in his own approved text, so {DESIGNER_BIOGRAPHY} is answered and the
      about page is built around a partnership rather than a single designer.
    */
    defineField({
      name: 'creators',
      title: 'Chi lo fa / The creators',
      type: 'array',
      of: [{type: 'string'}],
      description:
        "I nomi, come li ha scritti lui. / The names, as he wrote them.",
    }),
    defineField({
      name: 'partnerName',
      title: 'In collaborazione con / In collaboration with',
      type: 'string',
    }),
    defineField({
      name: 'partnerUrl',
      title: 'Link del partner / Partner link',
      type: 'url',
    }),
    defineField({
      name: 'designerPortrait',
      title: 'Ritratto / Portrait',
      type: 'media',
      description:
        "Una fotografia di chi fa le Creature, meglio se al lavoro. / One photograph of the person who makes the Creature, ideally at work.",
    }),
    defineField({
      name: 'designerText',
      title: 'Chi lo fa: il testo / The designer: the text',
      type: 'localeText',
      description:
        "Parole sue. Lasciare vuoto finche' non le ha scritte: la pagina mostra un segnaposto invece di inventare una biografia. / His own words. Leave empty until he has written them: the page shows a placeholder rather than inventing a biography.",
    }),
    defineField({
      name: 'aboutOpeningMedia',
      title: 'Chi siamo: fotografia di apertura / About: opening photograph',
      type: 'media',
      description:
        "La prima schermata della pagina, a tutto schermo, con una sola riga sopra. / The first screen of the page, full bleed, with a single line over it.",
    }),
    defineField({
      name: 'aboutOpeningLine',
      title: 'Chi siamo: la riga di apertura / About: the opening line',
      type: 'localeString',
      description:
        "Una frase sola, sopra la fotografia di apertura. Breve. / One sentence only, over the opening photograph. Short.",
    }),
    defineField({
      name: 'about',
      title: 'Chi siamo / About',
      type: 'localeText',
      description:
        "La storia del marchio, per intero. Una riga vuota separa i paragrafi, e ogni paragrafo prende una schermata di testo fra le fotografie. Righe e paragrafi vengono rispettati. / The brand story, complete. A blank line separates paragraphs, and each paragraph takes a screen of text between the photographs. Line and paragraph breaks are kept.",
    }),
    /*
      Turned OFF on 2026-08-02: the story is now the owner's own text, so it is
      no longer a draft in any language. What remains is the translation
      question, which approvedLanguages answers on its own.

      The field stays because the distinction it makes is still real: it means
      "these words are ours, not his". Turn it back on the day anyone writes
      brand story copy on the owner's behalf again.
    */
    defineField({
      name: 'aboutIsDraft',
      title: 'La storia e stata scritta da noi / The story was written by us',
      type: 'boolean',
      description:
        "Acceso solo se il testo NON e del titolare. Il sito lo marca come bozza in tutte le lingue. Per la sola questione della traduzione usare invece le lingue approvate. / On only when the text is NOT the owner's. The site then marks it as a draft in every language. For the translation question alone, use the approved languages field instead.",
      initialValue: false,
    }),
    /*
      SHIPPING, IN THREE PIECES, because they have three different standings and
      one field could not tell them apart (2026-08-03).

      1. shippingFree     HIS OWN FACT and his own words. Unmarked.
      2. shippingReturns  the returns rule: his facts, our wording. Marked as
                          ours, as it always has been.
      3. shippingCustoms  who pays customs outside the EU. He says it is
                          normally the customer and is confirming that with his
                          partner, so it ships PROVISIONAL and says so. A policy
                          nobody has confirmed is the one thing worse to invent
                          than copy.
    */
    defineField({
      name: 'shippingFree',
      title: 'Spedizione gratuita / Free shipping',
      type: 'localeText',
      description:
        "Parole del titolare. Una riga. / The owner's own words. One line.",
    }),
    defineField({
      name: 'shippingReturns',
      title: 'Spedizioni e resi / Shipping and returns',
      type: 'localeText',
    }),
    defineField({
      name: 'shippingCustoms',
      title: 'Dogana fuori dall\'Unione Europea / Customs outside the EU',
      type: 'localeText',
      description:
        "Una riga. Finche' non e confermata il sito la mostra come da confermare. / One line. While it is unconfirmed the site shows it as such.",
    }),
    defineField({
      name: 'shippingCustomsIsProvisional',
      title: 'La riga sulla dogana e da confermare / The customs line is unconfirmed',
      type: 'boolean',
      description:
        "Acceso finche' il titolare non conferma chi paga la dogana fuori dall'Unione Europea. / On until the owner confirms who pays customs outside the EU.",
      initialValue: true,
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
    /*
      Interface and brand copy WE wrote, listed rather than shown. Same rule as
      `inventedFields` on a Creature: invisible to a visitor, and the launch
      check refuses while anything is here (DESIGN-PLAN section 59).
    */
    /*
      SOLVET ET COAGULA, the process (2026-08-03). His own folder, his own name
      for it, and the one part of the site that shows the work being done rather
      than finished. The text is his making lines, already on the site; the
      frames carry no captions, because naming each stage would be our words
      laid over his process.
    */
    /*
      INSTAGRAM, CURATED RATHER THAN LIVE (2026-08-03).

      A live feed needs the Graph API, a Business account, an app and a
      long-lived token that must be refreshed every sixty days: free in money,
      and it empties itself silently the first time nobody refreshes it. Every
      embed widget is a third-party script, which standing rules 4 and 13 rule
      out. So he drops three to six frames here and they link to his profile.
      Nothing expires, nothing scripts, nothing costs.
    */
    defineField({
      name: 'instagramFrames',
      title: 'Instagram: i riquadri / Instagram: the frames',
      type: 'array',
      of: [{type: 'instagramFrame'}],
      description:
        "Fino a sei. Sul sito diventano QUADRATI: sposta il punto focale (hotspot) sulla fotografia per decidere cosa sopravvive al quadrato. Ogni riquadro puo portare al suo post; vuoto, porta al profilo. Non e un feed automatico: le scegli tu. / Up to six. They render SQUARE on the site: set the photograph's hotspot to decide what survives the square. Each frame can link to its own post; empty, it links to the profile. Not an automatic feed: you choose them.",
      validation: (Rule) => Rule.max(6).warning('More than six stops being a selection.'),
    }),
    /*
      THE PROCESS PAGE HAD NO WORDS (2026-08-11, section 81). It carried the
      formula, his three lines about the making, and then eight photographs.
      A reader was shown the work and never told what they were looking at.

      This is OURS and flagged: it names the stages the photographs actually
      show, in his register, and claims nothing he has not said. When he writes
      his own account of the process it replaces this and the flag comes off.
    */
    defineField({
      name: 'processText',
      title: 'Il processo, il testo / The process, the text',
      type: 'localeText',
      description:
        "Che cosa succede, per fasi, nell'ordine del lavoro. Poche righe brevi: le fotografie fanno il resto. / What happens, stage by stage, in the order of the work. A few short lines: the photographs do the rest.",
    }),
    defineField({
      name: 'processMedia',
      title: 'Il processo / The process',
      type: 'array',
      of: [{type: 'media'}],
      description:
        "Le fotografie del lavoro in corso, nell'ordine del processo: cartamodello, taglio, tintura, asciugatura, montaggio. Senza didascalie. / Photographs of the work in progress, in the order of the process: pattern, cut, dye, dry, build. No captions.",
    }),
    defineField({
      name: 'inventedCopy',
      title: 'Testi scritti da noi, da approvare / Copy we wrote, to be approved',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Fondo pagina: spedizioni / Footer: shipping', value: 'footerShipping'},
          {title: 'Fondo pagina: origine / Footer: origin', value: 'footerOrigin'},
          {title: 'Spedizioni e resi / Shipping and returns', value: 'shippingReturns'},
          {title: 'Dogana / Customs', value: 'shippingCustoms'},
          {title: 'Home: le righe di sezione / Home: the section lines', value: 'homeLines'},
          {title: 'Richiesta: i testi / Enquiry: the copy', value: 'enquiryCopy'},
          {title: 'Disponibilita: la spiegazione / Availability: the explanation', value: 'availabilityCopy'},
          {title: 'Instagram: quali fotografie / Instagram: which frames', value: 'instagramFrames'},
          {title: 'Ordine: il disegno delle misure / Order: the measuring diagram', value: 'measureDiagram'},
          {title: 'Processo: il testo delle fasi / Process: the stages text', value: 'processText'},
          {title: 'Shop: la riga di apertura / Shop: the intro line', value: 'shopIntro'},
          {title: 'Drops: la riga di apertura / Drops: the intro line', value: 'dropsIntro'},
          {title: 'Contatti: la riga di apertura / Contact: the intro line', value: 'contactIntro'},
          {title: 'Chi siamo: la traduzione delle origini / About: the origin translation', value: 'aboutOrigin'},
          {title: "Chi siamo: l'ordine dei nomi, modificato dal testo approvato / About: name order, edited from approved text", value: 'aboutNameOrder'},
        ],
        layout: 'grid',
      },
    }),
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
