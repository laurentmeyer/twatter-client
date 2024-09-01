import { useRouter } from 'next/router'
import { useState } from 'react'
import { Message } from '../../src/components/message'
import { MessageForm } from '../../src/components/messageForm'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useMessage } from '../../src/resources/message'
import { Col, Row } from 'react-bootstrap'

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
                <Modal.Header closeButton />
                <Modal.Body>
                  {' '}
                  <MessageForm
                    placeHolder="Reply to this tweet"
                    onTweet={handleClose}
                    replyTo={message.id}
                  />
                </Modal.Body>
              </Modal>
            )}
            <div className="border-bottom">
              <Message message={message}>
                <Row className="my-2">
                  <Col xs={8}></Col>
                  <Col xs={2}>
                    <Button
                      className="custom-link-over-stretched-link"
                      onClick={() => setCommentModalIsOpen(true)}
                    >
                      Reply
                    </Button>
                  </Col>
                </Row>
              </Message>
            </div>
            {message.replies.map((message) => (
              <div className=" border-bottom" key={message.id}>
                <Message message={message} />
              </div>
            ))}
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
