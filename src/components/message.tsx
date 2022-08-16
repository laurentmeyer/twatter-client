import { MessageResource } from '../resources/message'
import styled from 'styled-components'
import Image from 'next/image'
import { DateTime } from 'luxon'
import SvgIcon from './svgIcon'
import Link from 'next/link'

/*
 * Types.
 */

interface Props {
  message: MessageResource
}

/*
 * Styles.
 */

const StyledMessageWrapper = styled.div`
  display: flex;
  padding: 10px 15px;
`

const StyledImageDiv = styled.div`
  margin-right: 10px;
`

const StyledContentDiv = styled.div`
  width: 80%;
`

const StyledMetadataDiv = styled.div`
  display: flex;
`

const StyledAuthorNameLink = styled(Link)`
  font-size: 15px;
  font-weight: 700;
  margin-right: 8px;
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

const StyledMessageDiv = styled.div``

const StyledIconsDiv = styled.div`
  display: flex;
  /* grid-column-gap: 12px; */
  justify-content: space-around;
`

const StyledIconWrapper = styled.div`
  align-items: center;
`

const StyledSvgIcon = styled(SvgIcon)``

const imageStyle = {
  borderRadius: '50%',
}

/*
 * Images.
 */

const retweetPath = [
  'M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z',
]
const likePath = [
  'M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z',
]

/*
 * Component.
 */

export const Message = ({ message }: Props) => {
  const { text, author } = message
  const imageUrl = author?.image?.url ?? '/empty.jpeg'

  return (
    <StyledMessageWrapper>
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
          <StyledAuthorNameLink href={`/authors/${author.id}`}>
            <a>{`${author.firstName} ${author.lastName}`}</a>
          </StyledAuthorNameLink>

          <StyledAuthorHandleDiv>{`@${author.handle}`}</StyledAuthorHandleDiv>
          <StyledTimeDiv>
            {message.time.toLocaleString(DateTime.TIME_SIMPLE)}
          </StyledTimeDiv>
        </StyledMetadataDiv>
        <StyledMessageDiv>{text}</StyledMessageDiv>
        <StyledIconsDiv>
          <StyledIconWrapper>
            <StyledSvgIcon
              paths={likePath}
              width="18.75px"
              height="18.75px"
              fill="rgb(101, 119, 134)"
            />
            {message.likesCount}
          </StyledIconWrapper>
          <StyledIconWrapper>
            <StyledSvgIcon
              paths={retweetPath}
              width="18.75px"
              height="18.75px"
              fill="rgb(101, 119, 134)"
            />
            {message.repliesCount}
          </StyledIconWrapper>
        </StyledIconsDiv>
      </StyledContentDiv>
    </StyledMessageWrapper>
  )
}
