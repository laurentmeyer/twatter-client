import axios from 'axios'
import { getStrapiURL } from '../../lib/api'
import { ImagePayload, ImageResource, imagePayloadToResource } from './image'

/*
 * Types.
 */

export interface AuthorPayload {
  id: number
  attributes: {
    handle: string
    image?: {
      data: ImagePayload
    }
  }
}

export interface AuthorResource {
  id: number
  handle: string
  image?: ImageResource
}

/*
 * Helpers.
 */

export const authorPayloadToResource = (
  data: AuthorPayload
): AuthorResource => {
  const maybeImageData = data.attributes.image?.data
  const maybeImage = maybeImageData && {
    image: imagePayloadToResource(maybeImageData),
  }

  return {
    id: data.id,
    handle: data.attributes.handle,
    ...maybeImage,
  }
}

export const fetchAuthorAsync = async (id: number, jwt?: string) => {
  const {
    data: { data },
    status,
  } = await axios.get(getStrapiURL(`/api/authors/${id}`), {
    params: {
      populate: '*',
    },
    headers: { Authorization: `Bearer ${jwt}` },
  })

  // TODO remove
  console.log('author data', data)

  return status === 200 ? authorPayloadToResource(data) : undefined
}
