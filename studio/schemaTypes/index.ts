import {localeString} from './objects/localeString'
import {localeText} from './objects/localeText'
import {media} from './objects/media'
import {homeTile} from './objects/homeTile'
import {instagramFrame} from './objects/instagramFrame'
import {mosaicNote} from './objects/mosaicNote'
import {collection} from './documents/collection'
import {garment} from './documents/garment'
import {archivePiece} from './documents/archivePiece'
import {siteSettings} from './documents/siteSettings'
import siteCopy from './documents/siteCopy'

export const schemaTypes = [
  // objects
  localeString,
  localeText,
  media,
  homeTile,
  instagramFrame,
  mosaicNote,
  // documents
  collection,
  garment,
  archivePiece,
  siteSettings,
  siteCopy,
]
