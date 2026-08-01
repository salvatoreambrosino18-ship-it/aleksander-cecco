import {localeString} from './objects/localeString'
import {localeText} from './objects/localeText'
import {media} from './objects/media'
import {collection} from './documents/collection'
import {garment} from './documents/garment'
import {siteSettings} from './documents/siteSettings'

export const schemaTypes = [
  // objects
  localeString,
  localeText,
  media,
  // documents
  collection,
  garment,
  siteSettings,
]
