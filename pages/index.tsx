import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useQuery, useQueryClient } from 'react-query'
import { MessageForm } from '../src/components/messageForm'
import { MessageList } from '../src/components/messageList'
import {
  fetchMessagesAsync,
  messagePayloadFlatToResource,
  MessagePayloadFlat,
  MessageResource,
} from '../src/resources/message'
import { useChannel, useEvent } from '@harelpls/use-pusher'

const Home: NextPage = () => {
  const { data: session, status: sessionStatus } = useSession()
  const { data: messages, status: messagesStatus } = useQuery(
    ['messages', 'list'],
    () => fetchMessagesAsync(session?.jwt)
  )
  const queryClient = useQueryClient()

  const channel = useChannel('messages')

  useEvent(channel, 'post', async (data: MessagePayloadFlat | undefined) => {
    if (!data) return

    console.log('data', data)

    const message = messagePayloadFlatToResource(data)

    console.log('message', message)

    queryClient.setQueryData(
      ['messages', 'list'],
      (oldData: ReadonlyArray<MessageResource> | undefined) =>
        oldData ? [message, ...oldData] : [message]
    )
    // console.log('content', all)
  })

  if (messagesStatus === 'loading' || sessionStatus === 'loading')
    return <>{'Loading ...'}</>

  if (
    messagesStatus === 'error' ||
    messagesStatus === 'idle' ||
    sessionStatus === 'unauthenticated'
  )
    return <>{'Error'}</>

  return (
    <>
      <MessageForm />
      <MessageList messages={messages} />
    </>
  )
}

export default Home
