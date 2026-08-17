import {defineField, defineType} from 'sanity'

/*
  IL CONTROLLO DEI VIDEO — one document per uploaded video asset, written by
  scripts/check-videos.mjs and never by hand.

  WHY THIS EXISTS. The owner can upload a clip and cannot trim one. Until now
  the site looped whatever it was given, and a clip that is too short or that
  wanders and comes back reads as an Instagram boomerang — which happened three
  times in August and cost two rounds of work to undo. A warning on the upload
  field was the previous answer and it is not good enough: he will not measure a
  clip, and by the time it looks wrong on the site he has no way to correct it.

  SO THE GUARANTEE IS INVERTED. The site loops a clip ONLY when a measurement
  in here says it may. Anything not measured, or measured and found wanting,
  PLAYS ONCE AND STOPS — which has no wrap at all, so it cannot boomerang by
  construction rather than by care. The dangerous case became the default-safe
  one, and he does not have to understand any of it.

  These documents are read-only in the studio. They are evidence, not settings:
  editing one would only make the site disagree with the file it describes.
*/
export default defineType({
  name: 'videoCheck',
  title: 'Controllo dei video',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({name: 'assetId', title: 'Il file', type: 'string', readOnly: true}),
    defineField({name: 'filename', title: 'Nome del file', type: 'string', readOnly: true}),
    defineField({
      name: 'loops',
      title: 'Va in loop sul sito',
      type: 'boolean',
      readOnly: true,
      description:
        'Acceso vuol dire che il video riparte in continuo. Spento vuol dire che parte una volta sola e ' +
        'si ferma sull\'ultima immagine. Non si cambia a mano, lo decide la misura del file.',
    }),
    defineField({name: 'seconds', title: 'Quanto dura', type: 'number', readOnly: true}),
    defineField({
      name: 'travel',
      title: 'Quanto va dritto',
      type: 'number',
      readOnly: true,
      description:
        'Da 0 a 1. Vicino a 1 la ripresa va in una direzione sola. Vicino a 0 va e torna, ' +
        'ed è quello che sembra un boomerang.',
    }),
    defineField({
      name: 'seam',
      title: 'Quanto si vede lo stacco',
      type: 'number',
      readOnly: true,
      description: 'Quanto salta l\'immagine quando il video ricomincia. Sotto 10 non si nota.',
    }),
    defineField({
      name: 'note',
      title: 'Cosa succede e perché',
      type: 'text',
      rows: 3,
      readOnly: true,
    }),
    defineField({name: 'checkedAt', title: 'Controllato il', type: 'datetime', readOnly: true}),
  ],
  preview: {
    select: {filename: 'filename', loops: 'loops', seconds: 'seconds', note: 'note'},
    prepare({filename, loops, seconds, note}) {
      const s = typeof seconds === 'number' ? `${seconds.toFixed(1)} s` : '—'
      return {
        title: `${filename ?? 'video'}  ·  ${s}`,
        subtitle: `${loops ? 'VA IN LOOP' : 'PARTE UNA VOLTA SOLA'} — ${note ?? ''}`.slice(0, 110),
      }
    },
  },
})
