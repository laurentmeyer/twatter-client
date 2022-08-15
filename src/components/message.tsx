import { MessageResource } from '../resources/message'
import styled from 'styled-components'
import Image from 'next/image'
import { DateTime } from 'luxon'

/*
 * Types.
 */

interface Props {
  message: MessageResource
}

/*
 * Styles.
 */

const StyledWrapper = styled.div`
  display: flex;
`

const StyledImageDiv = styled.div`
  margin-right: 10px;
`

const StyledContentDiv = styled.div`
  width: 80%;
`

const StyledMetadataDiv = styled.div``

const StyledAuthorNameDiv = styled.div``

const StyledAuthorHandleDiv = styled.div``

const StyledTimeDiv = styled.div``

const StyledMessageDiv = styled.div``

const imageStyle = {
  borderRadius: '50%',
}

/*
 * Component.
 */

export const Message = ({ message }: Props) => {
  const { text, author } = message
  const imageUrl = author?.image?.url ?? '/empty.jpeg'

  return (
    <StyledWrapper>
      <StyledImageDiv>
        <Image
          style={imageStyle}
          src={imageUrl}
          alt={author.image?.alternativeText ?? author.handle}
          width={49}
          height={49}
        />
      </StyledImageDiv>
      <StyledContentDiv>
        <StyledMetadataDiv>
          <StyledAuthorNameDiv>{`${author.firstName} ${author.lastName}`}</StyledAuthorNameDiv>
          <StyledAuthorHandleDiv>{`@${author.handle}`}</StyledAuthorHandleDiv>
          <StyledTimeDiv>
            {message.time.toLocaleString(DateTime.TIME_SIMPLE)}
          </StyledTimeDiv>
        </StyledMetadataDiv>
        <StyledMessageDiv>{text}</StyledMessageDiv>
      </StyledContentDiv>
    </StyledWrapper>
  )
}
