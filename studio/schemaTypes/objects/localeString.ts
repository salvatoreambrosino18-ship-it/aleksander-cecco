import {defineType, defineField} from 'sanity'

// Field-level localization: a short single-line string in both languages.
// Reuse this for any localized one-line field.
export const localeString = defineType({
  name: 'localeString',
  title: 'Testo localizzato / Localized text',
  type: 'object',
  fields: [
    defineField({name: 'it', title: 'Italiano', type: 'string'}),
    defineField({name: 'en', title: 'English', type: 'string'}),
  ],
})
