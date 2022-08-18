import { ReactNode } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useCurrentUser } from '../resources/user'
import Link from 'next/link'
import styled from 'styled-components'

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-evenly;
  border-bottom: solid black 1px;
`

const StyledTempContainer = styled.div`
  max-width: 500px;
  border-right: solid black 1px;
`

export default function Layout(args: { children: ReactNode }) {
  const { status: sessionStatus, data: sessionData } = useSession()
  const { data: userData } = useCurrentUser(sessionData?.jwt)

  if (sessionStatus === 'loading') return <>{'Loading ...'}</>

  if (sessionStatus === 'unauthenticated')
    return <>{'Error: unable to authenticate current user.'}</>

  return (
    <StyledTempContainer>
      <StyledHeader>
        <Link href="/">
          <a>Home</a>
        </Link>
        {userData && (
          <Link href={`/authors/${userData.author.id}`}>
            <a>{`Logged in as @${userData.author.handle}`}</a>
          </Link>
        )}
        <button onClick={() => signOut()}>Sign out</button>
      </StyledHeader>
      <main>{args.children}</main>
    </StyledTempContainer>
  )
}
