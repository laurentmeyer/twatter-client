import axios from 'axios'
import { useQuery } from 'react-query'
import { getStrapiURL } from '../../lib/api'
import { authorPayloadToResource, AuthorResource } from './author'
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

  if (!author) throw new Error(`User ${data.id} has no author`)

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

const fetchCurrentUserAsync = async (jwt?: string) => {
  if (!jwt) return undefined

  const { data, status } = await axios.get(
    getStrapiURL(`/api/users/me?populate[author][populate]=%2A`),
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  )

  return status === 200 ? userPayloadToResource(data) : undefined
}

/*
 * Hooks.
 */

export const useCurrentUser = (jwt?: string) =>
  useQuery(['users', 'me'], async () => fetchCurrentUserAsync(jwt))
