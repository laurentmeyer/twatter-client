import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useQuery } from 'react-query'
import { getStrapiURL } from '../../lib/api'
import type { ImagePayload } from './image'
import type { MessagePayload, MessageResource } from './message'
import { authorPayloadToResource } from '../helpers/payloadToResource'
import { useMinutesLate } from './time'
import { isDefined } from '../../lib/utils'

/*
 * Types.
 */

export interface AuthorPayload {
  id: number
  handle: string
  firstName: string | null
  lastName: string | null
  followersCount: number | null
  imageUrl: string | null
  description: string | null
  image?: ImagePayload
  background?: ImagePayload
  messages?: ReadonlyArray<MessagePayload>
}

export interface AuthorResource {
  id: number
  handle: string
  displayName: string
  firstName: string
  lastName: string
  messages: ReadonlyArray<MessageResource>
  followersCount: number
  imageUrl: string
  imageAlt: string
  backgroundUrl: string
  backgroundAlt: string
  description: string
}

/*
 * Hooks.
 */

export const useAuthor = (id: number) => {
  // Should be a valid session, already checked by layout
  const { data: session } = useSession()
  const minutesLate = useMinutesLate()

  const fetchAuthorAsync = async () => {
    const { data } = await axios.get(getStrapiURL(`/api/authors/${id}`), {
      headers: { Authorization: `Bearer ${session?.jwt}` },
    })

    if (!isDefined(minutesLate))
      throw new Error('Cannot fetch author without minutesLate')

    return authorPayloadToResource(data, minutesLate)
  }

  return useQuery(['authors', id], fetchAuthorAsync, {
    enabled: Number.isFinite(id) && isDefined(minutesLate),
  })
}
