import { MessageResource } from '../resources/message'
import { MessageListItem } from './messageListItem'

export const MessageList = (props: {
  messages: ReadonlyArray<MessageResource>
}) => {
  const { messages } = props

  return (
    <>
      {messages.map((message) => (
        <MessageListItem key={message.id} message={message} />
      ))}
    </>
  )
}
