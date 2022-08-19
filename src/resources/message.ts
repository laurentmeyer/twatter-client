import axios from 'axios'
import { DateTime } from 'luxon'
import { useSession } from 'next-auth/react'
import { useQuery } from 'react-query'
import { getStrapiURL } from '../../lib/api'
import {
  AuthorPayload,
  authorPayloadToResource,
  AuthorResource,
} from './author'
import {
  ImagePayloadFlat,
  imagePayloadFlatToResource,
  ImageResource,
} from './image'

/*
 * Types.
 */

export interface MessagePayload {
  id: number
  text: string
  time: string
  public: boolean
  likesCount?: number
  repliesCount?: number
  author: AuthorPayload | null
  image?: ImagePayloadFlat
}

export interface MessageResource {
  id: number
  text: string
  time: DateTime
  isPublic: boolean
  likesCount: number
  repliesCount: number
  author: AuthorResource
  image?: ImageResource
}

/*
 * Helpers.
 */

export const messagePayloadToResource = (
  data: MessagePayload
): MessageResource => {
  const {
    id,
    author,
    public: isPublic,
    text,
    time,
    image,
    likesCount,
    repliesCount,
  } = data

  if (!author) throw new Error(`Message ${id} has no author`)

  return {
    id,
    text,
    isPublic,
    time: DateTime.fromISO(time),
    likesCount: likesCount ?? 0,
    repliesCount: repliesCount ?? 0,
    image: image && imagePayloadFlatToResource(image),
    author: authorPayloadToResource(author),
  }
}

/*
 * Hooks.
 */

export const useMessage = (id: number) => {
  // Should be a valid session, already checked by layout
  const { data: session } = useSession()

  const fetchMessageAsync = async () => {
    const { data, status } = await axios.get(
      getStrapiURL(`/api/messages/${id}`),
      {
        headers: { Authorization: `Bearer ${session?.jwt}` },
      }
    )

    return status === 200 ? messagePayloadToResource(data) : undefined
  }

  return useQuery(['messages', id], fetchMessageAsync, {
    enabled: Number.isFinite(id),
  })
}

export const useMessages = () => {
  // Should be a valid session, already checked by layout
  const { data: session } = useSession()

  const fetchMessagesAsync = async () => {
    const { data, status } = await axios.get(
      getStrapiURL('/api/messages?sort=time:desc'),
      {
        headers: { Authorization: `Bearer ${session?.jwt}` },
      }
    )

    return status === 200 ? data.map(messagePayloadToResource) : []
  }

  return useQuery(['messages', 'list'], fetchMessagesAsync)
}
