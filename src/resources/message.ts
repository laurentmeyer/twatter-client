import axios from 'axios'
import { DateTime } from 'luxon'
import { useSession } from 'next-auth/react'
import { useQuery } from 'react-query'
import { getStrapiURL } from '../../lib/api'
import {
  AuthorPayload,
  authorPayloadToResource,
  AuthorResource,
  makeUnknownAuthor,
} from './author'
import { ImagePayload, imagePayloadToResource, ImageResource } from './image'

/*
 * Types.
 */

interface MessagePayload {
  id: number
  attributes: {
    text: string
    time: string
    public: boolean
    likesCount?: number
    repliesCount?: number
    author: {
      data: AuthorPayload | null
    }
    image?: {
      data: ImagePayload
    }
  }
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

const messagePayloadToResource = (data: MessagePayload): MessageResource => {
  const {
    author,
    public: isPublic,
    text,
    time,
    image,
    likesCount,
    repliesCount,
  } = data.attributes
  const { data: authorData } = author

  if (!authorData) console.error(`Message ${data.id} has no author`)

  return {
    id: data.id,
    text,
    isPublic,
    time: DateTime.fromISO(time),
    likesCount: likesCount ?? 0,
    repliesCount: repliesCount ?? 0,
    image: image?.data && imagePayloadToResource(image.data),
    author: authorData
      ? authorPayloadToResource(authorData)
      : makeUnknownAuthor(),
  }
}

export const fetchMessageAsync = async (id: number, jwt?: string) => {
  const {
    data: { data },
    status,
  } = await axios.get(
    getStrapiURL(`/api/messages/${id}?populate[author][populate]=%2A`),
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  )

  return status === 200 ? messagePayloadToResource(data) : undefined
}

const fetchMessagesAsync = async (jwt?: string) => {
  const {
    data: { data },
    status,
  } = await axios.get(
    getStrapiURL('/api/messages?populate[author][populate]=%2A'),
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  )

  return status === 200 ? data.map(messagePayloadToResource) : []
}

/*
 * Hooks.
 */

export function useMessages() {
  const { data: session } = useSession()

  return useQuery(['messages', session], () => fetchMessagesAsync(session?.jwt))
}
