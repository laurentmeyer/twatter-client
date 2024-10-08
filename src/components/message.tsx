import { MessageResource } from '../resources/message'
import Image from 'react-bootstrap/Image'

import { DateTime } from 'luxon'
import Link from 'next/link'
import { ReactNode } from 'react'
import { useChannel, useEvent } from '@harelpls/use-pusher'
import { useQueryClient } from 'react-query'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { ChatFill, HeartFill, Repeat } from 'react-bootstrap-icons'
import { Container } from 'react-bootstrap'
import { ProfileImage } from './profileImage'

/*
 * Types.
 */

interface Props {
  message: MessageResource
  retweetSrc?: MessageResource
  children?: ReactNode
}

/*
 * Component.
 */

export const Message = ({ message, retweetSrc, children }: Props) => {
  const { text, author, image, isReply, id, isRetweetOf } = message
  const queryClient = useQueryClient()
  const channel = useChannel('messages')

  useEvent(channel, 'post', async (data?: string) => {
    if (data === 'invalidate')
      queryClient.invalidateQueries(['messages', message.id])
  })

  const authorImageUrl = author
    ? author.imageUrl || '/empty.jpeg'
    : '/unknown.png'
  const authorImageAlt = author?.imageAlt || author?.handle || 'unknown author'

  const authorHandle = `@${author?.handle || 'undefined'}`

  const authorLink = author ? (
    <Link
      href={`/authors/${author.id}`}
      className="custom-link-over-stretched-link fw-bold link-dark link-underline link-underline-opacity-0 link-underline-opacity-100-hover"
    >
      {author.displayName}
    </Link>
  ) : (
    <span className="fw-bold">Undefined</span>
  )

  const messageTime = message.time.toLocaleString(DateTime.TIME_SIMPLE)

  const messageLink = !isReply && author && (
    <Link href={`/messages/${id}`} className="stretched-link" />
  )

  const retweetedMessageLink = retweetSrc && author && (
    <Link href={`/messages/${id}`} className="stretched-link" />
  )

  const messageImage = image && (
    <div className="custom-message-image-container border rounded bg-light text-center">
      <Image
        className="custom-message-image"
        fluid
        src={image.url}
        alt={image.alternativeText}
      />
    </div>
  )

  const actionsRow = (
    <div className="d-flex justify-content-around text-secondary">
      <span>
        <ChatFill className="me-1" />
        {message.replies.length}
      </span>
      {!isRetweetOf && (
        <span>
          <Repeat className="me-1" />
          {message.retweets.length}
        </span>
      )}
      <span>
        <HeartFill className="me-1" />
        {message.likesCount}
      </span>
    </div>
  )

  const containerClassName = isReply
    ? 'position-relative py-2'
    : 'position-relative py-2 custom-hover-background'

  if (retweetSrc) {
    return (
      <Container className="custom-retweet-container border rounded-2 p-1">
        <Row className="m-0">
          <Col xs={1} className="p-1 ms-2">
            <ProfileImage src={authorImageUrl} alt={authorImageAlt} />
          </Col>
          <Col className="d-flex align-items-end p-1">
            {authorLink}
            <div className="ms-1 text-secondary text-opacity-75">
              {authorHandle} {messageTime}
            </div>
          </Col>
        </Row>
        <Row className="m-2">
          {tokenizeTweetText(text)}
          {messageImage}
        </Row>
        {retweetedMessageLink}
      </Container>
    )
  }

  return (
    <Container className={containerClassName}>
      <Row>
        <Col xs={3} md={2} className="px-4">
          <ProfileImage src={authorImageUrl} alt={authorImageAlt} />
        </Col>
        <Col className="d-grid gap-0 row-gap-2">
          <div className="d-flex">
            {authorLink}
            <div className="ms-1 text-secondary text-opacity-75">
              {authorHandle} {messageTime}
            </div>
          </div>
          {tokenizeTweetText(text)}
          {messageImage}
          {isRetweetOf && (
            <Message retweetSrc={message} message={isRetweetOf} />
          )}
          {!isReply && actionsRow}
        </Col>
      </Row>
      {children}
      {messageLink}
    </Container>
  )
}

/*
 * Helpers.
 */

function tokenizeTweetText(text: string): ReactNode {
  const regexp =
    /(https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g

  const nodes: Array<ReactNode> = []

  const splitText = text.split(regexp)

  for (const token of splitText) {
    if (!token) continue

    if (token.match(regexp))
      nodes.push(
        <Link
          className="custom-link-over-stretched-link link-underline link-underline-opacity-0 link-underline-opacity-100-hover"
          href={token}
          key={token}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation()
            e.nativeEvent.stopImmediatePropagation()
          }}
        >
          {token}
        </Link>
      )
    else nodes.push(token)
  }

  return <span>{nodes}</span>
}
