import Image from 'next/future/image'
import styled from 'styled-components'
import { AuthorResource } from '../resources/author'
import { MessageList } from './messageList'

/*
 * Types.
 */

interface Props {
  author: AuthorResource
}

/*
 * Styles.
 */

const StyledAuthorWrapper = styled.div`
  border-bottom: 2px solid rgb(29, 161, 242);
`

const StyledAuthorInfoWrapper = styled.div`
  padding-left: 15px;
  padding-right: 15px;
`

const StyledBackgroudWrapper = styled.div`
  position: relative;
  height: 150px;
`

const ImgFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 15px;
  padding-right: 15px;
`

const Avatar = styled.div`
  position: relative;
  width: 117px;
  height: 117px;
  margin-top: -13%;
`

/*
 * Component.
 */

export const Author = ({ author }: Props) => {
  const {
    handle,
    imageUrl,
    imageAlt,
    backgroundUrl,
    firstName,
    lastName,
    description,
    followersCount,
  } = author

  const messages = author.messages
    .filter(({ isReply }) => !isReply)
    .map((message) => ({
      ...message,
      author: author,
    }))

  return (
    <>
      <StyledAuthorWrapper>
        <StyledBackgroudWrapper>
          <Image
            src={backgroundUrl ?? '/background.jpg'}
            alt={'background'}
            fill
          />
        </StyledBackgroudWrapper>
        <ImgFlex>
          <Avatar>
            <Image
              style={{
                border: '4px solid white',
                borderRadius: '50%',
                objectFit: 'cover',
                backgroundColor: 'grey',
              }}
              src={imageUrl ?? '/empty.jpeg'}
              alt={imageAlt ?? handle}
              fill
            />
          </Avatar>
        </ImgFlex>
        <StyledAuthorInfoWrapper>
          <h2>{`${firstName} ${lastName}`}</h2>
          {`@${handle}`}
          <br />
          {description}
          <br />
          <strong>{followersCount.toString()}</strong>
          {' followers'}
        </StyledAuthorInfoWrapper>
      </StyledAuthorWrapper>
      <MessageList messages={messages} />
    </>
  )
}
