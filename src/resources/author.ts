import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useQuery } from 'react-query'
import { getStrapiURL } from '../../lib/api'
import {
  ImageResource,
  ImagePayloadFlat,
  imagePayloadFlatToResource,
} from './image'

/*
 * Types.
 */

export interface AuthorPayload {
  id: number
  handle: string
  firstName: string
  lastName: string
  description?: string
  followersCount?: number
  image?: ImagePayloadFlat
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

export const authorPayloadToResource = (
  data: AuthorPayload
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

/*
 * Hooks.
 */

export const useAuthor = (id: number) => {
  // Should be a valid session, already checked by layout
  const { data: session } = useSession()

  const fetchAuthorAsync = async () => {
    const { data, status } = await axios.get(
      getStrapiURL(`/api/authors/${id}`),
      {
        headers: { Authorization: `Bearer ${session?.jwt}` },
      }
    )

    return status === 200 ? authorPayloadToResource(data) : undefined
  }

  return useQuery(['authors', id], fetchAuthorAsync, {
    enabled: Number.isFinite(id),
  })
}
