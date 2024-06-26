import { ImagePayload, ImageResource } from './image'

/*
 * Types.
 */

export interface SourcePayload {
  id: number
  name: string
  logo?: ImagePayload
  icon?: ImagePayload
}

export interface SourceResource {
  id: number
  name: string
  logo?: ImageResource
  icon?: ImageResource
}
