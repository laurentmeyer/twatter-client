import { useQuery } from 'react-query'
import { fetchAPI } from '../../lib/api'

interface Payload {
  id: number
  attributes: {
    text: string
  }
}

export interface MessageResource {
  id: number
  text: string
}

const payloadToResource = (data: Payload): MessageResource => ({
  id: data.id,
  text: data.attributes.text,
})

const fetchMessages = (): Promise<MessageResource[]> =>
  fetchAPI('/messages', { populate: '*' }).then((response) =>
    response.data.map(payloadToResource)
  )

export function useMessages() {
  return useQuery(['messages'], fetchMessages)
}
