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
        'Descrizione per screen reader e SEO. Obbligatorio in italiano e inglese. / Description for screen readers and SEO. Required in Italian and English.',
      validation: (Rule) =>
        Rule.custom((alt: {it?: string; en?: string} | undefined) =>
          !alt?.it || !alt?.en ? 'Alt text is required in Italian and English' : true,
        ),
    }),
    defineField({
      name: 'overlay',
      title: 'Testo sopra / Text over this media',
      type: 'string',
      description:
        "Il colore del testo sovrapposto. Guarda l'immagine e scegli quello leggibile. Solo bianco o nero, mai grigio. / The color of any text laid over this media. Look at the picture and pick the legible one. White or black only, never gray.",
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
    select: {title: 'alt.it', overlay: 'overlay', media: 'poster', video: 'video.asset'},
    prepare({title, overlay, media: posterAsset, video}) {
      const marks = [overlay === 'ink' ? 'testo nero' : 'testo bianco', video ? 'VIDEO' : null]
      return {
        title: title || '(senza alt / no alt)',
        subtitle: marks.filter(Boolean).join('  /  '),
        media: posterAsset,
      }
    },
  },
})
