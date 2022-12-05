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

const StyledNameWrapper = styled.div`
  margin-top: 10px;
  font-family: 'TwitterChirp', Arial, sans-serif;
  font-size: 20px;
  line-height: 24px;
  font-weight: 800;
`

const StyledHandleWrapper = styled.div`
  color: rgb(83, 100, 113);
  font-size: 15px;
  line-height: 20px;
  font-weight: 400;
`

const StyledDescriptionWrapper = styled.div`
  margin-top: 12px;

  color: rgb(15, 20, 25);
  font-size: 15px;
  line-height: 20px;
  font-weight: 400;
`

const StyledFollowersWrapper = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;

  color: rgb(83, 100, 113);
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
`

const StyledFollowersCountSpan = styled.span`
  color: rgb(15, 20, 25);
  font-size: 14px;
  line-height: 16px;
  font-weight: 700;
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
          <StyledNameWrapper>{displayName}</StyledNameWrapper>
          <StyledHandleWrapper>{`@${handle}`}</StyledHandleWrapper>
          <StyledDescriptionWrapper>{description}</StyledDescriptionWrapper>
          <StyledFollowersWrapper>
            <StyledFollowersCountSpan>
              {followersCount.toString()}
            </StyledFollowersCountSpan>
            {' Followers'}
          </StyledFollowersWrapper>
        </StyledAuthorInfoWrapper>
      </StyledBottomMarginWrapper>
      <MessageList messages={messages} />
    </>
  )
}
