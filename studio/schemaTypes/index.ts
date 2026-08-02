import {localeString} from './objects/localeString'
import {localeText} from './objects/localeText'
import {media} from './objects/media'
import {homeTile} from './objects/homeTile'
import {collection} from './documents/collection'
import {garment} from './documents/garment'
import {archivePiece} from './documents/archivePiece'
import {siteSettings} from './documents/siteSettings'

export const schemaTypes = [
  // objects
  localeString,
  localeText,
  media,
  homeTile,
  // documents
  collection,
  garment,
  archivePiece,
  siteSettings,
]
