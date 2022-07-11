import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useQuery } from 'react-query'
import { getStrapiURL } from '../../lib/api'

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

const fetchMessages = async (jwt?: string) => {
  const {
    data: { data },
    status,
  } = await axios.get(getStrapiURL('/api/messages'), {
    params: { populate: '*' },
    headers: { Authorization: `Bearer ${jwt}` },
  })

  console.log('status', status)

  return status === 200 ? data.map(payloadToResource) : []
}

export function useMessages() {
  const { data: session } = useSession()

  return useQuery(['messages', session], () => fetchMessages(session?.jwt))
}
