import axios from 'axios'
import { useQuery } from 'react-query'
import { getStrapiURL } from '../../lib/api'
import {
  AuthorPayload,
  authorPayloadToResource,
  AuthorResource,
} from './author'

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
  useQuery<UserResource | undefined>(['users', 'me'], async () =>
    fetchCurrentUserAsync(jwt)
  )
