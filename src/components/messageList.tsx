import Link from 'next/link'
import styled from 'styled-components'
import { MessageResource } from '../resources/message'
import { Message } from './message'

/*
 * Styles.
 */

const StyledSpan = styled.div`
  cursor: pointer;

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
        if (message.isReply)
          return <Message key={message.id} message={message} />

        return (
          <Link key={message.id} href={`/messages/${message.id}`} passHref>
            <StyledSpan>
              <Message message={message} />
            </StyledSpan>
          </Link>
        )
      })}
    </>
  )
}
