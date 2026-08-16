import {defineType, defineField} from 'sanity'

/*
  MEDIA: the single building block for everything visual on the site.

  A screen is a photograph (DESIGN-PLAN sections 1 and 6). Every place the site
  shows something visual uses this object, so admitting video later changed no
  layout and changes no schema again.

  - poster is REQUIRED even when a video exists. It is the still, the video's
    poster frame, the fallback when the video cannot play, and what a reader
    with reduced motion sees. Nothing ships without it.
  - video is OPTIONAL, a short muted loop. Uploaded as a Sanity file asset:
    free tier, no new vendor, no card. Keep loops short; asset bandwidth is the
    one thing on this project capable of straining the free plan (standing rule
    12).
  - overlay is REQUIRED because text laid over a photograph must be solid paper
    or solid ink, with no scrim and no gray (standing rule 11). The owner looks
    at the picture and decides. A human beats a luminance heuristic on a frame
    that is bright in one corner and dark in the other.
*/
export const media = defineType({
  name: 'media',
  title: 'Immagine o video',
  type: 'object',
  fields: [
    defineField({
      name: 'poster',
      title: 'La fotografia',
      type: 'image',
      options: {hotspot: true},
      description:
        "Sempre obbligatoria, anche con un video: è il fotogramma di copertina e il fallback. / Always required, even with a video: it is the poster frame and the fallback.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Cosa si vede in questa foto',
      type: 'localeString',
      description:
        "Descrizione per chi usa uno screen reader. L'italiano e obbligatorio; se l'inglese e vuoto il sito usa l'italiano. / Description for screen reader users. Italian is required; if English is empty the site falls back to Italian.",
      validation: (Rule) =>
        Rule.custom((alt: {it?: string; en?: string} | undefined) =>
          !alt?.it ? 'Alt text in Italian is required' : true,
        ),
    }),
    /*
      Alt text is generated from the photograph and then corrected by a human.
      Requiring two hand-written languages for every image guarantees the real
      outcome: the same word typed 138 times, which is worse for a screen reader
      user than an accurate draft. So Italian is required, English falls back to
      it, and generated drafts are FLAGGED so approved text can be told apart
      from text nobody has read yet.
    */
    defineField({
      name: 'altIsDraft',
      title: 'Testo alternativo da approvare',
      type: 'boolean',
      description:
        'Acceso vuol dire che la frase qui sopra l\'ha scritta il computer e nessuno l\'ha controllata. ' +
        'Leggila, correggila se serve, poi spegni questo. Non si vede sul sito: serve a sapere cosa manca.' +
        'Scrivi cosa c\'è davvero nell\'inquadratura, non il nome del capo. ' +
        'L\'italiano serve sempre; se lasci vuoto l\'inglese, il sito usa l\'italiano anche lì ' +
        '(è l\'unico campo che si comporta così).' +
        'ed è quello che resta se il video non parte. Trascina il cerchietto sulla foto per scegliere ' +
        'la parte che deve restare visibile quando la foto viene tagliata.',
      initialValue: false,
    }),
    /*
      A frame that is a stopgap: cropped out of another photograph, or otherwise
      not the finished thing. The hat is the first (assets/provisional). Marking
      it in the studio is what stops a placeholder quietly becoming permanent.
    */
    defineField({
      name: 'isProvisional',
      title: 'Fotografia provvisoria',
      type: 'boolean',
      initialValue: false,
      description:
        "Accendere quando l'immagine e un ritaglio o un ripiego, in attesa di una vera fotografia. / Turn on when the image is a crop or a stopgap, waiting for a real photograph.",
    }),
    defineField({
      name: 'overlay',
      title: 'Le scritte sopra questa foto: bianche o nere',
      type: 'string',
      description:
        "Il colore del testo sopra questa immagine, e del logo e del menu quando ci passano sopra. Guarda l'immagine e scegli quello leggibile. Solo bianco o nero, mai grigio. / The color of text over this media, and of the logo and menu while they pass over it. Look at the picture and pick the legible one. White or black only, never gray.",
      options: {
        list: [
          {title: 'Bianche', value: 'paper'},
          {title: 'Nere', value: 'ink'},
        ],
        layout: 'radio',
      },
      initialValue: 'paper',
      validation: (Rule) => Rule.required(),
    }),
    /*
      overlayChrome IS GONE (2026-08-11, section 87). It held the polarity of
      the signature and MENU while they floated over this photograph. They no
      longer float: the chrome takes its own height in page ground above the
      picture, so there is nothing to measure and nothing to keep in step. 97
      measurements and a whole import step went with it.

      The value below is the CAPTION's, at the other end of the frame, and it is
      still needed for exactly the reason it was added.
    */
    /*
      THE SECOND BAND (2026-08-03). `overlay` is the polarity of the fixed chrome
      at the TOP of the frame; this is the polarity of the CAPTION at the bottom.
      They are different pixels and they disagree often: measured across the site,
      one value used at both ends put eight captions below WCAG AA, the worst at
      1.36:1 and the collection's own name at 1.53:1 (DESIGN-PLAN section 58).
      Measured by the import, editable here when a human disagrees.
    */
    defineField({
      name: 'overlayCaption',
      title: 'Testo in basso: bianco o nero',
      type: 'string',
      options: {
        list: [
          {title: 'Bianca', value: 'paper'},
          {title: 'Nera', value: 'ink'},
        ],
        layout: 'radio',
      },
      description:
        'In basso la foto è quasi sempre di un colore diverso da quello in alto, quindi si sceglie a parte. ' +
        'Se lo lasci vuoto viene usato il colore scelto qui sopra, che spesso lì non si legge.' +
        'sopra questa foto. Non c\'è il grigio e non c\'è l\'ombra dietro le scritte: o bianco o nero. ' +
        'Se sbagli, la scritta sparisce dentro la foto.' +
        'Serve a non dimenticartene: una foto provvisoria non segnata resta lì per sempre.',
    }),
    /*
      Added 2026-08-02, because real photography demanded it. Three of the nine
      seeded frames are shot against bright concrete with a dark garment in the
      frame, so the band where a caption sits contains both extremes: white text
      fails on the concrete, black text fails on the garment, and no overlay
      value is correct. Forcing one would have meant shipping an unreadable
      caption. The honest answer is to take the text off the picture.
    */
    defineField({
      name: 'captionPlacement',
      title: 'Posizione del testo',
      type: 'string',
      description:
        "Sopra l'immagine quando la foto ha una zona uniforme dove leggere. Sotto, sulla pagina, quando la foto è troppo contrastata e nessun colore di testo resta leggibile. / Over the image when the photograph has an even area to read against. Below, on the page, when the photograph is too contrasted for either text color to stay legible.",
      options: {
        list: [
          {title: "Sopra l'immagine / Over the image", value: 'over'},
          {title: 'Sotto, sulla pagina', value: 'below'},
        ],
        layout: 'radio',
      },
      initialValue: 'over',
      validation: (Rule) => Rule.required(),
    }),
    /*
      A DETAIL FRAME WAITING FOR HIS SENTENCE (2026-08-11, section 88).

      The construction crops were cut from his own high-resolution files and
      imported with the caption DELIBERATELY EMPTY, because the caption is the
      part only he can write: "500 punti cicatrice, cuciti a mano" is a fact he
      knows and we do not.

      An empty caption is indistinguishable from a caption nobody wanted — most
      frames on this site correctly have none — so the waiting is recorded here
      rather than in a message, and `npm run launch-check` counts it. Turn it off
      when the sentence is written; the gate stops naming that frame.
    */
    defineField({
      name: 'needsCaption',
      title: 'Dettaglio in attesa di una riga',
      type: 'boolean',
      initialValue: false,
      description:
        "Acceso su un ritaglio di dettaglio importato senza didascalia: la riga sotto la fotografia la scrivi tu. Spegnilo quando l'hai scritta. / On for an imported detail crop with no caption: the line under the photograph is yours to write. Turn it off once you have written it.",
    }),
    defineField({
      name: 'video',
      title: 'Un video al posto della foto (quasi sempre vuoto)',
      type: 'file',
      description:
        "Loop breve e muto: 4-10 secondi, MP4 (h.264), meno di 3 MB, SENZA traccia audio, stesso taglio della fotografia qui sopra. Il sito lo riproduce sopra la fotografia, solo quando è sullo schermo. La fotografia resta cio' che vedono chi ha il risparmio dati e chi ha ridotto le animazioni. / Short muted loop: 4-10 seconds, MP4 (h.264), under 3 MB, with NO audio track at all, framed the same as the photograph above. The site plays it over the photograph, only while it is on screen. The photograph stays what a reader gets under reduced motion or when the video cannot play.",
      options: {accept: 'video/mp4,video/webm'},
    }),
    /*
      IL LOOP DECISO DA LUI, SOPRA LA MISURA (2026-08-16, sezione 131).

      Il controllo automatico è tarato per essere prudente: un video sotto i tre
      secondi parte una volta sola, perché un loop corto si legge come un
      boomerang. È la regola giusta e resta la regola.

      Questo è il modo di dirgli di no su UN video. Il titolare ha guardato il
      clip di apertura, che dura un secondo e mezzo, e ha deciso che lo vuole in
      loop accettando lo stacco al ricomincio. Senza questa casella l'unico modo
      sarebbe stato mentire al controllo automatico — scrivergli dentro un
      verdetto che non ha misurato — e allora il controllo non varrebbe più
      niente per nessun altro video.
    */
    defineField({
      name: 'videoLoopAlways',
      title: 'Questo video va in loop comunque',
      type: 'boolean',
      initialValue: false,
      description:
        'Normalmente decide il controllo automatico: se un video è troppo corto o troppo mosso parte una ' +
        'volta sola, perché un loop corto sembra un boomerang. Spuntando questa casella dici «questo lo ' +
        'voglio in loop lo stesso», e ti prendi lo stacco che si vede quando ricomincia. ' +
        'Vale solo per QUESTO video. / Normally the automatic check decides. Tick this to loop this one clip ' +
        'anyway, accepting the visible cut at the wrap.',
    }),
    defineField({
      name: 'caption',
      title: 'La riga sotto la foto',
      type: 'localeString',
      description:
        'MP4, senza audio, con la stessa inquadratura della fotografia qui sopra. Il sito lo fa partire ' +
        'da solo sopra quella foto, senza comandi e senza che nessuno lo tocchi. ' +
        'NON DEVI MISURARE NIENTE. Ogni video caricato viene controllato in automatico entro un\'ora. ' +
        'Se è abbastanza lungo e la ripresa regge, va in loop; altrimenti PARTE UNA VOLTA SOLA e si ferma ' +
        'sull\'ultima immagine, che sul sito sta benissimo lo stesso. Non puoi sbagliare: nel dubbio parte una ' +
        'volta sola. ' +
        'SE LO VUOI IN LOOP: almeno 4 secondi, macchina ferma o che si muove sempre nella stessa direzione. ' +
        'Un video corto ricomincia così spesso da sembrare un boomerang, e uno ripreso a mano che va e torna ' +
        'sembra un boomerang anche se non lo è. ' +
        'Nell\'elenco «I video» trovi cosa è stato deciso per ognuno e perché. ' +
        'Sotto i 3 MB se puoi. Chi ha spento le animazioni sul telefono vede solo la fotografia.',
    }),
  ],
  preview: {
    select: {
      title: 'alt.it',
      overlay: 'overlay',
      media: 'poster',
      video: 'video.asset',
      altIsDraft: 'altIsDraft',
    },
    prepare({title, overlay, media: posterAsset, video, altIsDraft}) {
      const marks = [
        altIsDraft ? 'ALT DA APPROVARE' : null,
        overlay === 'ink' ? 'testo nero' : 'testo bianco',
        video ? 'VIDEO' : null,
      ]
      return {
        title: title || '(senza alt / no alt)',
        subtitle: marks.filter(Boolean).join('  /  '),
        media: posterAsset,
      }
    },
  },
})
