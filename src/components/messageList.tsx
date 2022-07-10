import { MessageResource } from '../resources/message'
import { Message } from './message'

interface MessageListProps {
  messages: ReadonlyArray<MessageResource>
}

export const MessageList = ({ messages }: MessageListProps) => (
  <ul>
    {messages.map((message) => (
      <Message text={message.text} key={message.id} />
    ))}
  </ul>
)
