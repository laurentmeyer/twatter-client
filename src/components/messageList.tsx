import { MessageResource } from '../resources/message'
import { Message } from './message'

/*
 * Types.
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
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </>
  )
}
