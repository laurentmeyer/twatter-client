import { MessageResource } from '../resources/message'
import styled from 'styled-components'
import Image from 'next/future/image'
import { DateTime } from 'luxon'
import SvgIcon from './svgIcon'
import Link from 'next/link'
import { ReactNode } from 'react'
import { useChannel, useEvent } from '@harelpls/use-pusher'
import { useQueryClient } from 'react-query'

/*
 * Styles.
 */

const StyledMessageWrapper = styled.div`
  display: flex;
  padding: 10px 15px;
`

const StyledAuthorImageDiv = styled.div`
  position: relative;
  margin-right: 10px;
  height: 49px;
  width: 49px;
`

const StyledMessageImageDiv = styled.div`
  position: relative;
  min-height: 300px;
  background-color: rgb(204, 213, 219);
  border-radius: 10px;
  margin-bottom: 10px;
`

const StyledContentDiv = styled.div`
  width: 80%;
`

const StyledMetadataDiv = styled.div`
  display: flex;
`

const StyledAuthorNameAnchor = styled.a`
  font-size: 15px;
  font-weight: 700;
  margin-right: 8px;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`

const StyledAuthorHandleDiv = styled.div`
  font-size: 15px;
  font-weight: 400;
  color: rgb(101, 119, 134);
  margin-right: 8px;
`

const StyledTimeDiv = styled.div`
  font-size: 15px;
  font-weight: 400;
  color: rgb(101, 119, 134);
`

const StyledMessageDiv = styled.div`
  margin-bottom: 10px;
`

const StyledIconsDiv = styled.div`
  display: flex;
  justify-content: space-around;
`

const StyledIconWrapper = styled.div`
  align-items: center;
`

const StyledTokenAnchor = styled.a`
  color: rgb(14, 92, 140);

  &:hover {
    text-decoration: underline;
  }
`

/*
 * Images.
 */

const commentPath = [
  'M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z',
]
const likePath = [
  'M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z',
]

/*
 * Types.
 */

interface Props {
  message: MessageResource
  // TODO add minutesLate here
}

/*
 * Component.
 */

export const Message = ({ message }: Props) => {
  const { text, author, image, isReply } = message
  const queryClient = useQueryClient()
  const channel = useChannel('messages')

  useEvent(channel, 'post', async (data?: string) => {
    if (data === 'invalidate')
      queryClient.invalidateQueries(['messages', message.id])
  })

  if (!author) throw new Error(`Message ${message.id} has no author`)

  const authorImageUrl = author.imageUrl || '/empty.jpeg'

  return (
    <StyledMessageWrapper>
      <StyledAuthorImageDiv>
        <Image
          style={{ borderRadius: '50%', objectFit: 'cover' }}
          src={authorImageUrl}
          alt={author.imageAlt || author.handle}
          fill
        />
      </StyledAuthorImageDiv>
      <StyledContentDiv>
        <StyledMetadataDiv>
          <Link href={`/authors/${author.id}`}>
            <StyledAuthorNameAnchor>
              {author.displayName}
            </StyledAuthorNameAnchor>
          </Link>
          <StyledAuthorHandleDiv>{`@${author.handle}`}</StyledAuthorHandleDiv>
          <StyledTimeDiv>
            {message.time.toLocaleString(DateTime.TIME_SIMPLE)}
          </StyledTimeDiv>
        </StyledMetadataDiv>
        <StyledMessageDiv>{tokenize(text)}</StyledMessageDiv>
        {image && (
          <StyledMessageImageDiv>
            <Image
              style={{ objectFit: 'contain' }}
              src={image.url}
              alt={image.alternativeText}
              fill
            />
          </StyledMessageImageDiv>
        )}
        <StyledIconsDiv>
          {!isReply && (
            <StyledIconWrapper>
              <SvgIcon
                paths={commentPath}
                width="18.75px"
                height="18.75px"
                fill="rgb(101, 119, 134)"
              />
              {message.replies.length}
            </StyledIconWrapper>
          )}
          <StyledIconWrapper>
            <SvgIcon
              paths={likePath}
              width="18.75px"
              height="18.75px"
              fill="rgb(101, 119, 134)"
            />
            {message.likesCount}
          </StyledIconWrapper>
        </StyledIconsDiv>
      </StyledContentDiv>
    </StyledMessageWrapper>
  )
}

/*
 * Helpers.
 */

function tokenize(text: string): ReactNode {
  const regexp =
    /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g

  const nodes: Array<ReactNode> = []

  for (const token of text.split(regexp)) {
    if (!token) continue

    if (token.match(regexp))
      nodes.push(
        <StyledTokenAnchor
          href={token}
          key={token}
          target="_blank"
          rel="noopener noreferrer"
        >
          {token}
        </StyledTokenAnchor>
      )
    else nodes.push(token)
  }

  return <>{nodes}</>
}
