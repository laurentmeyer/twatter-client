import axios from 'axios'
import { DateTime } from 'luxon'
import { getStrapiURL } from '../../lib/api'
import {
  AuthorPayload,
  AuthorPayloadFlat,
  authorPayloadFlatToResource,
  authorPayloadToResource,
  AuthorResource,
} from './author'
import {
  ImagePayload,
  ImagePayloadFlat,
  imagePayloadFlatToResource,
  imagePayloadToResource,
  ImageResource,
} from './image'

/*
 * Types.
 */

export interface MessagePayloadFlat {
  id: number
  text: string
  time: string
  public: boolean
  likesCount?: number
  repliesCount?: number
  author: AuthorPayloadFlat | null
  image?: ImagePayloadFlat
}

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

export const messagePayloadFlatToResource = (
  data: MessagePayloadFlat
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
    author: authorPayloadFlatToResource(author),
  }
}

export const messagePayloadToResource = (
  data: MessagePayload
): MessageResource => {
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

  if (!authorData) throw new Error(`Message ${data.id} has no author`)

  return {
    id: data.id,
    text,
    isPublic,
    time: DateTime.fromISO(time),
    likesCount: likesCount ?? 0,
    repliesCount: repliesCount ?? 0,
    image: image?.data && imagePayloadToResource(image.data),
    author: authorPayloadToResource(authorData),
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

export const fetchMessagesAsync = async (jwt?: string) => {
  const {
    data: { data },
    status,
  } = await axios.get(
    getStrapiURL('/api/messages?populate[author][populate]=*&sort=time:desc'),
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  )

  return status === 200 ? data.map(messagePayloadToResource) : []
}
