import { useRouter } from 'next/router'
import { useState } from 'react'
import { Message } from '../../src/components/message'
import { MessageForm } from '../../src/components/messageForm'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { MessageResource, useMessage } from '../../src/resources/message'
import { Col, Row } from 'react-bootstrap'

/*
 * Component.
 */

const MessagePageRenderer = ({ message }: { message: MessageResource }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [isModalForRetweet, setIsModalForRetweet] = useState(false)
  const handleClose = () => setModalIsOpen(false)

  const retweetList = message.retweets.map((retweet) => {
    return {
      ...retweet,
      isRetweetOf: message,
    }
  })

  return (
    <>
      {modalIsOpen && (
        <Modal show={modalIsOpen} onHide={handleClose}>
          <Modal.Header closeButton />
          <Modal.Body>
            {' '}
            <MessageForm
              placeHolder={
                isModalForRetweet ? 'Repost this tweet' : 'Reply to this tweet'
              }
              onTweet={handleClose}
              replyTo={isModalForRetweet ? undefined : message.id}
              isRetweetOf={isModalForRetweet ? message.id : undefined}
              allowImage={!isModalForRetweet}
            />
          </Modal.Body>
        </Modal>
      )}
      <div className="border-bottom">
        <Message message={message}>
          <Row className="my-2">
            <Col xs={8}></Col>
            <Col xs={2} className="d-flex">
              <Button
                className="custom-link-over-stretched-link mx-2"
                onClick={() => {
                  setIsModalForRetweet(false)
                  setModalIsOpen(true)
                }}
              >
                Reply
              </Button>
              <Button
                className="custom-link-over-stretched-link mx-2"
                onClick={() => {
                  setIsModalForRetweet(true)
                  setModalIsOpen(true)
                }}
              >
                Retweet
              </Button>
            </Col>
          </Row>
        </Message>
      </div>
      {[...message.replies, ...retweetList]
        .sort((m1, m2) => m1.time.valueOf() - m2.time.valueOf())
        .map((message) => (
          <div className=" border-bottom" key={message.id}>
            <Message message={message} />
          </div>
        ))}
    </>
  )
}

/*
 * Page
 */

const MessagePage = () => {
  const router = useRouter()

  const id = Number(router.query.id)

  const { data: message, status } = useMessage(id)

  switch (status) {
    case 'success':
      if (message) return <MessagePageRenderer message={message} />
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
