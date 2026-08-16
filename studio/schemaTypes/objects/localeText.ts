import {defineType, defineField} from 'sanity'

// Field-level localization: a multi-line block of text in both languages.
export const localeText = defineType({
  name: 'localeText',
  title: 'Testo localizzato',
  type: 'object',
  fields: [
    defineField({name: 'it', title: 'Italiano', type: 'text', rows: 4}),
    defineField({name: 'en', title: 'English', type: 'text', rows: 4}),
  ],
})
