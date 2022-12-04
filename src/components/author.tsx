import Image from 'next/image'
import styled from 'styled-components'
import { StyledBottomMarginWrapper } from '../../styles/common'
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
    displayName,
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
      <StyledBottomMarginWrapper>
        <StyledBackgroudWrapper>
          <Image
            src={backgroundUrl || '/background.jpg'}
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
              src={imageUrl || '/empty.jpeg'}
              alt={imageAlt || handle}
              fill
            />
          </Avatar>
        </ImgFlex>
        <StyledAuthorInfoWrapper>
          <h2>{displayName}</h2>
          {`@${handle}`}
          <br />
          {description}
          <br />
          <strong>{followersCount.toString()}</strong>
          {' followers'}
        </StyledAuthorInfoWrapper>
      </StyledBottomMarginWrapper>
      <MessageList messages={messages} />
    </>
  )
}
