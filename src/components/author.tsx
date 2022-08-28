import Image from 'next/image'
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
  display: flex;
  flex-direction: column;
`

const StyledBackgroudImage = styled.div`
  background-color: teal;
  width: 100%;
  padding-bottom: 33%;
`

const StyledBackgroudTest = styled.div``

/*
 * Component.
 */

export const Author = ({ author }: Props) => {
  const { handle, image, messages } = author

  return (
    <>
      <StyledAuthorWrapper>
        <StyledBackgroudImage>
          <StyledBackgroudTest />
        </StyledBackgroudImage>
        <Image
          src={image?.url ?? '/empty.jpeg'}
          alt={image?.alternativeText ?? handle}
          width={'400px'}
          height={'400px'}
        />
      </StyledAuthorWrapper>
      <MessageList messages={messages} />
    </>
  )
}
