import axios from 'axios'
import { DateTime } from 'luxon'
import { useSession } from 'next-auth/react'
import { useQuery } from 'react-query'
import { getStrapiURL } from '../../lib/api'
import { isDefined } from '../../lib/utils'
import { messagePayloadToResource } from '../helpers/payloadToResource'
import type { AuthorPayload, AuthorResource } from './author'
import { ImagePayload, ImageResource } from './image'
import { MILLISECONDS_PER_SECOND, useTrainingSession } from './trainingSession'

/*
 * Types.
 */

export interface MessagePayload {
  id: number
  text: string
  time: string
  replyTo?: MessagePayload | null
  likesCount?: number
  author?: AuthorPayload
  image?: ImagePayload
  replies?: ReadonlyArray<MessagePayload>
}

export interface MessageResource {
  id: number
  text: string
  time: DateTime
  likesCount: number
  isReply: boolean
  author?: AuthorResource
  image?: ImageResource
  replies: ReadonlyArray<MessageResource>
}

/*
 * Hooks.
 */

export const useMessage = (id: number) => {
  // Should be a valid session, already checked by layout
  const { data: session } = useSession()
  const trainingSession = useTrainingSession()

  const fetchMessageAsync = async () => {
    const { data } = await axios.get(getStrapiURL(`/api/messages/${id}`), {
      headers: { Authorization: `Bearer ${session?.jwt}` },
    })

    if (!isDefined(trainingSession))
      throw new Error('Cannot fetch message without minutesLate')

    return messagePayloadToResource(data, trainingSession.minutesLate)
  }

  return useQuery<MessageResource | undefined>(
    ['messages', id],
    fetchMessageAsync,
    {
      enabled: Number.isFinite(id) && isDefined(trainingSession),
    }
  )
}

export const useMessages = () => {
  // Should be a valid session, already checked by layout
  const { data: session } = useSession()
  const trainingSession = useTrainingSession()

  const fetchMessagesAsync = async () => {
    const { data } = await axios.get(
      getStrapiURL('/api/messages?sort=time:desc'),
      {
        headers: { Authorization: `Bearer ${session?.jwt}` },
      }
    )

    if (!isDefined(trainingSession))
      throw new Error('Cannot fetch messages without minutesLate')

    return data
      .map((payload: MessagePayload) =>
        messagePayloadToResource(payload, trainingSession.minutesLate)
      )
      .filter(isDefined)
  }

  return useQuery<ReadonlyArray<MessageResource>>(
    ['messages', 'list'],
    fetchMessagesAsync,
    {
      refetchInterval: 15 * MILLISECONDS_PER_SECOND,
      enabled: isDefined(trainingSession),
    }
  )
}
