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
    defineField({
      name: 'video',
      title: 'Video (facoltativo / optional)',
      type: 'file',
      description:
        'Loop breve, muto, sotto i 15 secondi. MP4 (h.264) o WebM. La riproduzione arriva piu avanti; per ora conta lo schema. / Short muted loop, under 15 seconds. MP4 (h.264) or WebM. Playback comes later; for now what matters is the schema.',
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
