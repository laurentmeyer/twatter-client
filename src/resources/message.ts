import axios from 'axios'
import { useSession } from 'next-auth/react'
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

interface MessagePayload {
  id: number
  attributes: {
    text: string
    author?: {
      data: AuthorPayload
    }
  }
}

export interface MessageResource {
  id: number
  text: string
  author?: AuthorResource
}

/*
 * Helpers.
 */

const messagePayloadToResource = (data: MessagePayload): MessageResource => {
  const maybeAuthorData = data.attributes.author?.data
  const maybeAuthor = maybeAuthorData && {
    author: authorPayloadToResource(maybeAuthorData),
  }

  return {
    id: data.id,
    text: data.attributes.text,
    ...maybeAuthor,
  }
}

export const fetchMessageAsync = async (id: number, jwt?: string) => {
  const {
    data: { data },
    status,
  } = await axios.get(getStrapiURL(`/api/messages/${id}`), {
    params: {
      populate: '*',
    },
    headers: { Authorization: `Bearer ${jwt}` },
  })

  // console.log('message data', data)

  return status === 200 ? messagePayloadToResource(data) : undefined
}

const fetchMessagesAsync = async (jwt?: string) => {
  const {
    data: { data },
    status,
  } = await axios.get(getStrapiURL('/api/messages'), {
    params: { populate: '*' },
    headers: { Authorization: `Bearer ${jwt}` },
  })

  // console.log('data', data)

  return status === 200 ? data.map(messagePayloadToResource) : []
}

/*
 * Hooks.
 */

export function useMessages() {
  const { data: session } = useSession()

  return useQuery(['messages', session], () => fetchMessagesAsync(session?.jwt))
}
