import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button } from '../../src/components/button'
import { Message } from '../../src/components/message'
import { MessageForm } from '../../src/components/messageForm'
import { MessageList } from '../../src/components/messageList'
import { Modal } from '../../src/components/modal'
import { useMessage } from '../../src/resources/message'

const MessagePage = () => {
  const router = useRouter()
  const [commentModalIsOpen, setCommentModalIsOpen] = useState(false)
  const id = Number(router.query.id)

  const { data: message, status } = useMessage(id)

  switch (status) {
    case 'success':
      if (message)
        return (
          <>
            {commentModalIsOpen && (
              <Modal handleClose={() => setCommentModalIsOpen(false)}>
                <MessageForm
                  placeHolder="Reply to this tweet"
                  onTweet={() => setCommentModalIsOpen(false)}
                  replyTo={message.id}
                />
              </Modal>
            )}
            <Message message={message} />
            <Button
              onClick={() => setCommentModalIsOpen(true)}
              width=""
              padding="12px 30px"
            >
              Reply
            </Button>
            {message.replies.length > 0 && (
              <MessageList messages={message.replies} />
            )}
          </>
        )
      else throw new Error('Cannot fetch message')

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

export default MessagePage
