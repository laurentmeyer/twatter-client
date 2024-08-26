import { useRouter } from 'next/router'
import { useState } from 'react'
import styled from 'styled-components'
// import { Button } from '../../src/components/button'
import { Message } from '../../src/components/message'
import { MessageForm } from '../../src/components/messageForm'
import { MessageList } from '../../src/components/messageList'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useMessage } from '../../src/resources/message'
import { StyledBottomMarginWrapper } from '../../styles/common'

/*
 * Styles.
 */

const StyledMessageWrapper = styled.div`
  padding: 15px;
`

/*
 * Component.
 */

const MessagePage = () => {
  const router = useRouter()
  const [commentModalIsOpen, setCommentModalIsOpen] = useState(false)
  const handleClose = () => setCommentModalIsOpen(false)
  const id = Number(router.query.id)

  const { data: message, status } = useMessage(id)

  switch (status) {
    case 'success':
      if (message)
        return (
          <>
            {commentModalIsOpen && (
              <Modal show={commentModalIsOpen} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {' '}
                  <MessageForm
                    placeHolder="Reply to this tweet"
                    onTweet={() => setCommentModalIsOpen(false)}
                    replyTo={message.id}
                  />
                </Modal.Body>
              </Modal>
            )}
            <StyledBottomMarginWrapper>
              <StyledMessageWrapper>
                <Message message={message} />
                <Button onClick={() => setCommentModalIsOpen(true)}>
                  Reply
                </Button>
              </StyledMessageWrapper>
            </StyledBottomMarginWrapper>
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
