import axios from 'axios'
import { useQuery } from 'react-query'
import { getStrapiURL } from '../../lib/api'
import { authorPayloadToResource } from '../helpers/payloadToResource'
import type { AuthorPayload, AuthorResource } from './author'

/*
 * Types.
 */

export interface UserPayload {
  id: number
  username: string
  email: string
  author?: AuthorPayload
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
  const { author, email, username, id } = data

  if (!author) throw new Error(`User ${data.id} has no author`)

  return {
    id,
    username,
    email,
    author: authorPayloadToResource(author),
  }
}

const fetchCurrentUserAsync = async (jwt: string | undefined) => {
  if (!jwt) return undefined

  const { data } = await axios.get(
    getStrapiURL(`/api/users/me?populate[0]=author`),
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  )

  return userPayloadToResource(data)
}

/*
 * Hooks.
 */

export const useCurrentUser = (jwt?: string) => {
  return useQuery<UserResource | undefined>(
    ['users', 'me'],
    async () => fetchCurrentUserAsync(jwt),
    {
      enabled: Boolean(jwt),
    }
  )
}
