import { ReactNode } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useCurrentUser } from '../resources/user'
import Link from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'
import SvgIcon from './svgIcon'
import React from 'react'
import { Button } from './button'
import { useRouter } from 'next/router'
import { useTrainingSession } from '../resources/trainingSession'

/*
 * Styles.
 */

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
`

const StyledRightColumn = styled.div`
  flex-basis: 30%;
  max-width: 30%;
`

const StyledHeader = styled.header`
  padding-left: 10px;
  padding-right: 10px;
  width: 70%;
  height: 100vh;
  margin-left: auto;
  margin-right: auto;
  position: sticky;
  top: 0;
  .active {
    fill: rgba(29, 161, 242, 1);
    color: rgba(29, 161, 242, 1);
    border-radius: 50px;
  }
  @media (max-width: 992px) {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 768px) {
    align-items: center;
  }
`

const StyledRightButtonsContainer = styled.div`
  height: 80vh;
`

const StyledClientLogoContainer = styled.div`
  position: relative;
  height: 20vh;
`

const StyledCenterColumn = styled.div<{ isTwatter?: boolean }>`
  flex-basis: ${(p) => (p.isTwatter ? '37.5%' : '50%')};
  max-width: ${(p) => (p.isTwatter ? '37.5%' : '50%')};
  border-left: 1px solid rgb(230, 236, 240);
  border-right: 1px solid rgb(230, 236, 240);
`

const MenuItem = styled.div`
  margin-top: 10px;
  color: rgba(0, 0, 0, 1);
  div {
    display: inline-block;
    padding: 10px;
  }

  &:hover div {
    color: rgba(29, 161, 242, 1);
    fill: rgba(29, 161, 242, 1);
    background: rgba(29, 161, 242, 0.1);
    border-radius: 50px;
  }
  @media (max-width: 768px) {
    margin-top: 0;
  }
`

const LogoItem = styled(MenuItem)`
  display: inline-block;
`

const MenuTitle = styled.span`
  margin-left: 20px;
  font-size: 19px;
  font-weight: bold;
  line-height: 1.3;
  text-transform: capitalize;
  @media (max-width: 768px) {
    display: none;
  }
`

const StyledButton = styled(Button)`
  margin-top: 10px;
`

/*
 * Images.
 */

const paths = {
  home: [
    'M22.58 7.35L12.475 1.897c-.297-.16-.654-.16-.95 0L1.425 7.35c-.486.264-.667.87-.405 1.356.18.335.525.525.88.525.16 0 .324-.038.475-.12l.734-.396 1.59 11.25c.216 1.214 1.31 2.062 2.66 2.062h9.282c1.35 0 2.444-.848 2.662-2.088l1.588-11.225.737.398c.485.263 1.092.082 1.354-.404.263-.486.08-1.093-.404-1.355zM12 15.435c-1.795 0-3.25-1.455-3.25-3.25s1.455-3.25 3.25-3.25 3.25 1.455 3.25 3.25-1.455 3.25-3.25 3.25z',
  ],
  profile: [
    'M12 11.816c1.355 0 2.872-.15 3.84-1.256.814-.93 1.078-2.368.806-4.392-.38-2.825-2.117-4.512-4.646-4.512S7.734 3.343 7.354 6.17c-.272 2.022-.008 3.46.806 4.39.968 1.107 2.485 1.256 3.84 1.256zM8.84 6.368c.162-1.2.787-3.212 3.16-3.212s2.998 2.013 3.16 3.212c.207 1.55.057 2.627-.45 3.205-.455.52-1.266.743-2.71.743s-2.255-.223-2.71-.743c-.507-.578-.657-1.656-.45-3.205zm11.44 12.868c-.877-3.526-4.282-5.99-8.28-5.99s-7.403 2.464-8.28 5.99c-.172.692-.028 1.4.395 1.94.408.52 1.04.82 1.733.82h12.304c.693 0 1.325-.3 1.733-.82.424-.54.567-1.247.394-1.94zm-1.576 1.016c-.126.16-.316.246-.552.246H5.848c-.235 0-.426-.085-.552-.246-.137-.174-.18-.412-.12-.654.71-2.855 3.517-4.85 6.824-4.85s6.114 1.994 6.824 4.85c.06.242.017.48-.12.654z',
  ],
  googleLogo: [
    'M0,105C0,47.103,47.103,0,105,0c23.383,0,45.515,7.523,64.004,21.756l-24.4,31.696C133.172,44.652,119.477,40,105,40c-35.841,0-65,29.159-65,65s29.159,65,65,65c28.867,0,53.398-18.913,61.852-45H105V85h105v20c0,57.897-47.103,105-105,105S0,162.897,0,105z',
  ],
  twitterLogo: [
    'M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z',
  ],
}

/*
 * Props.
 */

interface LayoutProps {
  children: ReactNode
}

/*
 * Component.
 */

export default function Layout({ children }: LayoutProps) {
  const { status: sessionStatus, data: sessionData } = useSession()
  const { data: userData } = useCurrentUser(sessionData?.jwt)
  const router = useRouter()
  const isGoogle = router.pathname.startsWith('/news')
  const trainingSession = useTrainingSession()

  if (sessionStatus === 'loading') return <>{'Loading ...'}</>

  if (sessionStatus === 'unauthenticated')
    return <>{'Error: unable to authenticate current user.'}</>

  return (
    <StyledWrapper>
      <StyledRightColumn>
        <StyledHeader>
          <StyledRightButtonsContainer>
            <StyledClientLogoContainer>
              <Image
                src={trainingSession?.clientLogo.url || '/empty.jpeg'}
                alt={trainingSession?.clientLogo.alternativeText || ''}
                objectFit="contain"
                objectPosition="unset"
                fill
              />
            </StyledClientLogoContainer>
            <Link href="/" passHref>
              <HomeButton />
            </Link>
            <Link href={`/news`} passHref>
              <GoggleButton />
            </Link>
            <Link href={`/authors/${userData?.author.id}`} passHref>
              <ProfileButton />
            </Link>
            <StyledButton
              onClick={() => signOut()}
              width="100%"
              padding="12px 30px"
            >
              Sign out
            </StyledButton>
          </StyledRightButtonsContainer>
        </StyledHeader>
      </StyledRightColumn>
      <StyledCenterColumn isTwatter={!isGoogle}>
        <main>{children}</main>
      </StyledCenterColumn>
    </StyledWrapper>
  )
}

const LogoButton = React.forwardRef<
  HTMLAnchorElement,
  React.HTMLProps<HTMLAnchorElement>
>(({ onClick, href }, ref) => {
  return (
    <a href={href} onClick={onClick} ref={ref}>
      <LogoItem>
        <div>
          <SvgIcon
            paths={paths.twitterLogo}
            width="35px"
            height="35px"
            fill="rgb(29, 161, 242)"
          />
        </div>
      </LogoItem>
    </a>
  )
})

LogoButton.displayName = 'Logo Button'

const HomeButton = React.forwardRef<
  HTMLAnchorElement,
  React.HTMLProps<HTMLAnchorElement>
>(({ onClick, href }, ref) => {
  const router = useRouter()

  return (
    <a href={href} onClick={onClick} ref={ref}>
      <MenuItem className={router.asPath === href ? 'active' : ''}>
        <div>
          <SvgIcon
            paths={paths.twitterLogo}
            width="26.25px"
            height="26.25px"
            fill="rgb(0, 0, 0)"
          />
          <MenuTitle>{'Tweets'}</MenuTitle>
        </div>
      </MenuItem>
    </a>
  )
})

HomeButton.displayName = 'Home Button'

const TwatterButton = React.forwardRef<
  HTMLAnchorElement,
  React.HTMLProps<HTMLAnchorElement>
>(({ onClick, href }, ref) => {
  const router = useRouter()

  return (
    <a href={href} onClick={onClick} ref={ref}>
      <MenuItem className={router.asPath === href ? 'active' : ''}>
        <div>
          <SvgIcon
            paths={paths.home}
            width="26.25px"
            height="26.25px"
            fill="rgb(0, 0, 0)"
          />
          <MenuTitle>{'Twatter'}</MenuTitle>
        </div>
      </MenuItem>
    </a>
  )
})

TwatterButton.displayName = 'Twatter Button'

const ProfileButton = React.forwardRef<
  HTMLAnchorElement,
  React.HTMLProps<HTMLAnchorElement>
>(({ onClick, href }, ref) => {
  const router = useRouter()

  return (
    <a href={href} onClick={onClick} ref={ref}>
      <MenuItem className={router.asPath === href ? 'active' : ''}>
        <div>
          <SvgIcon
            paths={paths.profile}
            width="26.25px"
            height="26.25px"
            fill="rgb(0, 0, 0)"
          />
          <MenuTitle>{'Profile'}</MenuTitle>
        </div>
      </MenuItem>
    </a>
  )
})

ProfileButton.displayName = 'Profile Button'

const GoggleButton = React.forwardRef<
  HTMLAnchorElement,
  React.HTMLProps<HTMLAnchorElement>
>(({ onClick, href }, ref) => {
  return (
    <a href={href} onClick={onClick} ref={ref}>
      <MenuItem>
        <div>
          <SvgIcon
            paths={paths.googleLogo}
            viewBox="0 0 210 210"
            width="26.25px"
            height="26.25px"
            fill="rgb(0, 0, 0)"
          />
          <MenuTitle>{'News'}</MenuTitle>
        </div>
      </MenuItem>
    </a>
  )
})

GoggleButton.displayName = 'Google Button'
