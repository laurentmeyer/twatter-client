import type { NextPage } from 'next'
import { useQueryClient } from 'react-query'
import { MessageForm } from '../src/components/messageForm'
import { MessageList } from '../src/components/messageList'
import { useMessages } from '../src/resources/message'
import { useChannel, useEvent } from '@harelpls/use-pusher'

const Home: NextPage = () => {
  const { data: messages, status: status } = useMessages()
  const queryClient = useQueryClient()
  const channel = useChannel('messages')

  useEvent(channel, 'post', async (data?: string) => {
    if (data === 'invalidate')
      queryClient.invalidateQueries(['messages', 'list'])
  })

  switch (status) {
    case 'success': {
      if (!messages) throw new Error('Cannot fetch messages')

      return (
        <>
          <MessageForm />
          <MessageList messages={messages} />
        </>
      )
    }

    case 'loading':
      return <>Loading</>

    case 'idle':
      return <>Idle</>

    case 'error':
      return <>Error</>

    default:
      throw new Error('Unreachable code')
  }
}

export default Home
