import {defineType, defineField} from 'sanity'

/*
  One Instagram square (section 71): a photograph plus the address of ITS OWN
  post. The square crop happens on the site through the photograph's hotspot,
  so the owner controls what survives the square. No token, no script,
  nothing that expires: these are ordinary uploads that happen to look like
  what they link to.
*/
export const instagramFrame = defineType({
  name: 'instagramFrame',
  title: 'Riquadro Instagram / Instagram frame',
  type: 'object',
  fields: [
    defineField({
      name: 'media',
      title: 'Fotografia / Photograph',
      type: 'media',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'postUrl',
      title: 'Link del post / Post link',
      type: 'url',
      description:
        "L'indirizzo del post su Instagram: aprilo, copia l'indirizzo dalla barra, incollalo qui. Vuoto, il riquadro porta al profilo. / The post's own address on Instagram: open it, copy the address bar, paste it here. Empty, the frame links to the profile.",
    }),
  ],
  preview: {
    select: {title: 'media.alt.it', media: 'media.poster'},
    prepare({title, media}) {
      return {title: title || '(riquadro / frame)', media}
    },
  },
})
