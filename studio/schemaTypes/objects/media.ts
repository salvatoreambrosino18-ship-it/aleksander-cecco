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
  title: 'Immagine o video / Image or video',
  type: 'object',
  fields: [
    defineField({
      name: 'poster',
      title: 'Immagine / Image',
      type: 'image',
      options: {hotspot: true},
      description:
        "Sempre obbligatoria, anche con un video: e' il fotogramma di copertina e il fallback. / Always required, even with a video: it is the poster frame and the fallback.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Testo alternativo / Alt text',
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
      title: 'Testo alternativo da approvare / Alt text needs approval',
      type: 'boolean',
      description:
        'Acceso quando la descrizione e stata generata e non ancora letta da una persona. Spegnilo quando la approvi. / On when the description was generated and no person has read it yet. Turn it off once you approve it.',
      initialValue: false,
    }),
    /*
      A frame that is a stopgap: cropped out of another photograph, or otherwise
      not the finished thing. The hat is the first (assets/provisional). Marking
      it in the studio is what stops a placeholder quietly becoming permanent.
    */
    defineField({
      name: 'isProvisional',
      title: 'Fotografia provvisoria / Provisional photograph',
      type: 'boolean',
      initialValue: false,
      description:
        "Accendere quando l'immagine e un ritaglio o un ripiego, in attesa di una vera fotografia. / Turn on when the image is a crop or a stopgap, waiting for a real photograph.",
    }),
    defineField({
      name: 'overlay',
      title: 'Testo sopra / Text over this media',
      type: 'string',
      description:
        "Il colore del testo sopra questa immagine, e del logo e del menu quando ci passano sopra. Guarda l'immagine e scegli quello leggibile. Solo bianco o nero, mai grigio. / The color of text over this media, and of the logo and menu while they pass over it. Look at the picture and pick the legible one. White or black only, never gray.",
      options: {
        list: [
          {title: 'Bianco / White', value: 'paper'},
          {title: 'Nero / Black', value: 'ink'},
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
      title: 'Testo in basso: bianco o nero / Caption below: white or black',
      type: 'string',
      options: {
        list: [
          {title: 'Bianco / White (paper)', value: 'paper'},
          {title: 'Nero / Black (ink)', value: 'ink'},
        ],
        layout: 'radio',
      },
      description:
        "La polarita del nome o della didascalia in basso sulla fotografia. Se vuoto usa il valore sopra. / The polarity of the name or caption at the bottom of the photograph. Falls back to the value above when empty.",
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
      title: 'Posizione del testo / Caption placement',
      type: 'string',
      description:
        "Sopra l'immagine quando la foto ha una zona uniforme dove leggere. Sotto, sulla pagina, quando la foto e' troppo contrastata e nessun colore di testo resta leggibile. / Over the image when the photograph has an even area to read against. Below, on the page, when the photograph is too contrasted for either text color to stay legible.",
      options: {
        list: [
          {title: "Sopra l'immagine / Over the image", value: 'over'},
          {title: 'Sotto, sulla pagina / Below, on the page', value: 'below'},
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
      title: 'Dettaglio in attesa di una riga / Detail awaiting a caption',
      type: 'boolean',
      initialValue: false,
      description:
        "Acceso su un ritaglio di dettaglio importato senza didascalia: la riga sotto la fotografia la scrivi tu. Spegnilo quando l'hai scritta. / On for an imported detail crop with no caption: the line under the photograph is yours to write. Turn it off once you have written it.",
    }),
    defineField({
      name: 'video',
      title: 'Video (facoltativo / optional)',
      type: 'file',
      description:
        "Loop breve e muto: 4-10 secondi, MP4 (h.264), meno di 3 MB, SENZA traccia audio, stesso taglio della fotografia qui sopra. Il sito lo riproduce sopra la fotografia, solo quando e' sullo schermo. La fotografia resta cio' che vedono chi ha il risparmio dati e chi ha ridotto le animazioni. / Short muted loop: 4-10 seconds, MP4 (h.264), under 3 MB, with NO audio track at all, framed the same as the photograph above. The site plays it over the photograph, only while it is on screen. The photograph stays what a reader gets under reduced motion or when the video cannot play.",
      options: {accept: 'video/mp4,video/webm'},
    }),
    defineField({
      name: 'caption',
      title: 'Didascalia / Caption',
      type: 'localeString',
      description:
        'Una riga sola, se questa immagine ha bisogno di parole. Quasi sempre vuota. / One line only, if this media needs words at all. Usually empty.',
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
