import Link from 'next/link'
import styled from 'styled-components'
import { MessageResource } from '../resources/message'
import { Message } from './message'

/*
 * Styles.
 */

const StyledSpan = styled.div<{ pointer?: boolean }>`
  cursor: ${(p) => (p.pointer ? 'pointer' : 'auto')};

  border-bottom: 1px solid rgb(230, 236, 240);

  &:hover {
    background-color: rgb(245, 248, 250);
  }
`

/*
 * Props.
 */

interface Props {
  messages: ReadonlyArray<MessageResource>
}

/*
 * Component.
 */

export const MessageList = ({ messages }: Props) => {
  return (
    <>
      {messages.map((message) => {
        if (message.isReply || !message.author)
          return (
            <StyledSpan key={message.id}>
              <Message message={message} />
            </StyledSpan>
          )

        return (
          <Link key={message.id} href={`/messages/${message.id}`} passHref>
            <StyledSpan pointer>
              <Message message={message} />
            </StyledSpan>
          </Link>
        )
      })}
    </>
  )
}
