import type { NextPage } from 'next'
import { useQueryClient } from 'react-query'
import { MessageForm } from '../src/components/messageForm'
import { MessageList } from '../src/components/messageList'
import { useMessages } from '../src/resources/message'
import { useChannel, useEvent } from '@harelpls/use-pusher'
import styled from 'styled-components'

const StyledWrapper = styled.div`
  padding: 15px;
  border-bottom: 10px solid rgb(230, 236, 240);
  display: flex;
`

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

      const replies = messages.flatMap((message) =>
        message.replies.map(({ id }) => id)
      )

      const nonReplyMessages = messages.filter(
        (message) => !replies.includes(message.id)
      )

      return (
        <>
          <StyledWrapper>
            <MessageForm placeHolder="What's happening?" />
          </StyledWrapper>
          <MessageList messages={nonReplyMessages} />
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
