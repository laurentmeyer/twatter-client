import { MessageResource } from '../resources/message'

interface Props {
  message: MessageResource
}

export const Message = ({ message }: Props) => {
  const { text, author } = message

  return (
    <>
      {author && `Author: @${author.handle}`}
      <p />
      {text}
    </>
  )
}
