import type { NextPage } from 'next'
import { useQueryClient } from 'react-query'
import { MessageForm } from '../src/components/messageForm'
import { MessageList } from '../src/components/messageList'
import { useMessages } from '../src/resources/message'
import { useChannel, useEvent } from '@harelpls/use-pusher'
import { DateTime } from 'luxon'

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
      if (!messages) throw new Error('Cannot fetch author')

      const pastMessages = messages.filter(
        (message) => message.time <= DateTime.now()
      )

      return (
        <>
          <MessageForm />
          <MessageList messages={pastMessages} />
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
