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

export const userPayloadToResource = (
  data: UserPayload,
  minutesLate: number
): UserResource => {
  const { author, email, username, id } = data

  if (!author) throw new Error(`User ${data.id} has no author`)

  return {
    id,
    username,
    email,
    author: authorPayloadToResource(author, minutesLate),
  }
}

const fetchCurrentUserAsync = async (jwt: string | undefined) => {
  if (!jwt) return undefined

  const { data } = await axios.get(
    getStrapiURL(`/api/users/me?populate[author][populate]=%2A`),
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  )

  // No need for minutes late here, since don't care about messages for current user.
  return userPayloadToResource(data, 0)
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
