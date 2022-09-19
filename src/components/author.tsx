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
  const { handle, image, background } = author

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
            src={background?.url ?? '/background.jpg'}
            alt={background?.alternativeText ?? 'background'}
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
              src={image?.url ?? '/empty.jpeg'}
              alt={image?.alternativeText ?? handle}
              fill
            />
          </Avatar>
        </ImgFlex>
        <StyledAuthorInfoWrapper>
          <h2>{`${author.firstName} ${author.lastName}`}</h2>
        </StyledAuthorInfoWrapper>
      </StyledAuthorWrapper>
      <MessageList messages={messages} />
    </>
  )
}
