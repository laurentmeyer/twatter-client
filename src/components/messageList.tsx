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
  console.log(messages)
  return (
    <>
      {messages.map((message) => {
        const messageNode = <Message message={message} />

        if (message.isReply) return messageNode

        return (
          <Link key={message.id} href={`/messages/${message.id}`} passHref>
            <StyledSpan>{messageNode}</StyledSpan>
          </Link>
        )
      })}
    </>
  )
}
