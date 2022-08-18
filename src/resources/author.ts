import axios from 'axios'
import { getStrapiURL } from '../../lib/api'
import {
  ImagePayload,
  ImageResource,
  imagePayloadToResource,
  ImagePayloadFlat,
  imagePayloadFlatToResource,
} from './image'

/*
 * Types.
 */

export interface AuthorPayloadFlat {
  id: number
  handle: string
  firstName: string
  lastName: string
  description?: string
  followersCount?: number
  image?: ImagePayloadFlat
}

export interface AuthorPayload {
  id: number
  attributes: {
    handle: string
    firstName: string
    lastName: string
    description?: string
    followersCount?: number
    image?: {
      data: ImagePayload
    }
  }
}

export interface AuthorResource {
  id: number
  handle: string
  firstName: string
  lastName: string
  image?: ImageResource
  description?: string
  followersCount?: number
}

/*
 * Helpers.
 */

export const authorPayloadFlatToResource = (
  data: AuthorPayloadFlat
): AuthorResource => {
  const { handle, firstName, lastName, description, followersCount, image } =
    data

  return {
    id: data.id,
    handle,
    firstName,
    lastName,
    description,
    followersCount,
    image: image && imagePayloadFlatToResource(image),
  }
}

export const authorPayloadToResource = (
  data: AuthorPayload
): AuthorResource => {
  const { handle, firstName, lastName, description, followersCount, image } =
    data.attributes

  return {
    id: data.id,
    handle,
    firstName,
    lastName,
    description,
    followersCount,
    image: image?.data && imagePayloadToResource(image.data),
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

  return status === 200 ? authorPayloadToResource(data) : undefined
}
