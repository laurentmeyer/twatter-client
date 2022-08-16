import axios from 'axios'
import { getStrapiURL } from '../../lib/api'
import {
  authorPayloadToResource,
  AuthorResource,
  makeUnknownAuthor,
} from './author'
import { ImagePayload } from './image'

/*
 * Types.
 */

export interface UserPayload {
  id: number
  username: string
  email: string
  author?: {
    id: number
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

export interface UserResource {
  id: number
  username: string
  email: string
  author: AuthorResource
}

/*
 * Helpers.
 */

export const userPayloadToResource = (data: UserPayload): UserResource => {
  const { author, email, username } = data

  if (!author) {
    console.error(`User ${data.id} has no author`)
    return {
      id: data.id,
      username,
      email,
      author: makeUnknownAuthor(),
    }
  }

  const { id, ...attributes } = author

  return {
    id,
    username,
    email,
    author: authorPayloadToResource({
      id,
      attributes,
    }),
  }
}

export const fetchMeAsync = async (jwt?: string) => {
  const { data, status } = await axios.get(
    getStrapiURL(`/api/users/me?populate[author][populate]=%2A`),
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  )

  return status === 200 ? userPayloadToResource(data) : undefined
}
