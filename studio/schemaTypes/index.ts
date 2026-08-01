import {localeString} from './objects/localeString'
import {localeText} from './objects/localeText'
import {galleryImage} from './objects/galleryImage'
import {collection} from './documents/collection'
import {garment} from './documents/garment'
import {siteSettings} from './documents/siteSettings'

export const schemaTypes = [
  // objects
  localeString,
  localeText,
  galleryImage,
  // documents
  collection,
  garment,
  siteSettings,
]
