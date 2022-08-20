import { MessageResource } from '../resources/message'
import Link from 'next/link'
import { Message } from './message'
import React from 'react'
import styled from 'styled-components'

/*
 * Types.
 */

interface Props {
  message: MessageResource
}

/*
 * Styles.
 */

const StyledSpan = styled.div`
  cursor: pointer;

  border-bottom: 1px solid rgb(230, 236, 240);

  &:hover {
    background-color: rgb(245, 248, 250);
  }
`

/*
 * Component.
 */

export function MessageListItem({ message }: Props) {
  return (
    <Link href={`/messages/${message.id}`} passHref>
      <StyledSpan>
        <Message message={message} />
      </StyledSpan>
    </Link>
  )
}
