import axios from 'axios'
import { DateTime, Duration } from 'luxon'
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
import {
  MILLISECONDS_PER_MINUTE,
  MILLISECONDS_PER_SECOND,
  useMinutesLate,
} from './time'

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

const messagePayloadToResource = (
  data: MessagePayload,
  minutesLate: number
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
    time: DateTime.fromISO(time).plus(
      Duration.fromMillis(MILLISECONDS_PER_MINUTE * minutesLate)
    ),
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
  const { data: minutesLate } = useMinutesLate()

  const fetchMessageAsync = async () => {
    const { data, status } = await axios.get(
      getStrapiURL(`/api/messages/${id}`),
      {
        headers: { Authorization: `Bearer ${session?.jwt}` },
      }
    )

    return status === 200 && minutesLate
      ? messagePayloadToResource(data, minutesLate)
      : undefined
  }

  return useQuery<MessageResource | undefined>(
    ['messages', id],
    fetchMessageAsync,
    {
      enabled: Number.isFinite(id) && minutesLate !== undefined,
    }
  )
}

export const useMessages = () => {
  // Should be a valid session, already checked by layout
  const { data: session } = useSession()
  const { data: minutesLate } = useMinutesLate()

  const fetchMessagesAsync = async () => {
    const { data, status } = await axios.get(
      getStrapiURL('/api/messages?sort=time:desc'),
      {
        headers: { Authorization: `Bearer ${session?.jwt}` },
      }
    )

    return status === 200 && minutesLate
      ? data.map((payload: MessagePayload) =>
          messagePayloadToResource(payload, minutesLate)
        )
      : []
  }

  return useQuery<ReadonlyArray<MessageResource>>(
    ['messages', 'list'],
    fetchMessagesAsync,
    {
      refetchInterval: 15 * MILLISECONDS_PER_SECOND,
      enabled: minutesLate !== undefined,
    }
  )
}
