import { useQueryClient } from 'react-query'
import { MessageForm } from '../src/components/messageForm'
import { useMessages } from '../src/resources/message'
import { useChannel, useEvent } from '@harelpls/use-pusher'
import { NextPage } from 'next'
import { Message } from '../src/components/message'

export const TwatterHome: NextPage = () => {
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

      const replies = messages.flatMap((message) =>
        message.replies.map(({ id }) => id)
      )

      const nonReplyMessages = messages.filter(
        (message) => !replies.includes(message.id)
      )

      return (
        <>
          <div className="p-3 border-bottom">
            <MessageForm placeHolder="What's happening?" />
          </div>
          {nonReplyMessages.map((message) => (
            <div className="border-bottom" key={message.id}>
              <Message message={message} />
            </div>
          ))}
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

export default TwatterHome
