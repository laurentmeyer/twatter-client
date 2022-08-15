import { MessageResource } from '../resources/message'
import { Message } from './message'

export const MessageList = (props: {
  messages: ReadonlyArray<MessageResource>
}) => {
  const { messages } = props

  return (
    <ul>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </ul>
  )
}
