import styled from 'styled-components'
import { ReactNode } from 'react'
import SvgIcon from './svgIcon'
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'
import { useCurrentUser } from '../resources/user'
import { useTrainingSession } from '../resources/trainingSession'

/*
 * Styles.
 */

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

const StyledNavButton = styled(Button)`
  display: grid;
  width: 100%;
  grid-template-columns: 50px 1fr;
  padding: 10px 50px 10px 30px;
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
    'm236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z',
  ],
}

/*
 * Component.
 */

export default function Layout({ children }: { children: ReactNode }) {
  const { status: sessionStatus, data: sessionData } = useSession()
  const { data: userData } = useCurrentUser(sessionData?.jwt)
  const router = useRouter()
  const isGoogle = router.pathname.startsWith('/news')
  const trainingSession = useTrainingSession()

  if (sessionStatus === 'loading') return <>{'Loading ...'}</>

  if (sessionStatus === 'unauthenticated')
    return <>{'Error: unable to authenticate current user.'}</>

  return (
    <>
      <Navbar expand className="bg-body-tertiary d-lg-none">
        <Container fluid>
          <Navbar.Brand onClick={() => router.push('/')}>
            {/* <Image
              fluid
              src={trainingSession?.clientLogo.url || '/empty.jpeg'}
              alt={trainingSession?.clientLogo.alternativeText || ''}
              // width={30}
              // height={30}
            />{' '} */}
            Arjuna-medialab
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="w-100 justify-content-between">
              <Button variant="light" onClick={() => router.push('/')}>
                <SvgIcon
                  paths={paths.twitterLogo}
                  width="24px"
                  height="24px"
                  fill="rgb(0, 0, 0)"
                  viewBox="0 0 300 300"
                />
              </Button>
              <Button variant="light" onClick={() => router.push('/news')}>
                <SvgIcon
                  paths={paths.googleLogo}
                  viewBox="0 0 210 210"
                  width="26.25px"
                  height="26.25px"
                  fill="rgb(0, 0, 0)"
                />
              </Button>
              <Button
                variant="light"
                onClick={() => router.push(`/authors/${userData?.author.id}`)}
              >
                <SvgIcon
                  paths={paths.profile}
                  width="26.25px"
                  height="26.25px"
                  fill="rgb(0, 0, 0)"
                />
              </Button>
              <Button variant="primary" onClick={() => signOut()}>
                Sign out
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container fluid>
        <Row>
          <Col className="text-white d-none d-lg-block" lg={3}>
            <Nav defaultActiveKey="/home" className="flex-column">
              <Nav.Item>
                <Image
                  fluid
                  src={trainingSession?.clientLogo.url || '/empty.jpeg'}
                  alt={trainingSession?.clientLogo.alternativeText || ''}
                />
              </Nav.Item>
              <StyledNavButton variant="light" onClick={() => router.push('/')}>
                <SvgIcon
                  paths={paths.twitterLogo}
                  width="24px"
                  height="24px"
                  fill="rgb(0, 0, 0)"
                  viewBox="0 0 300 300"
                />
                <MenuTitle>{'Tweets'}</MenuTitle>
              </StyledNavButton>
              <StyledNavButton
                variant="light"
                onClick={() => router.push('/news')}
              >
                <SvgIcon
                  paths={paths.googleLogo}
                  viewBox="0 0 210 210"
                  width="26.25px"
                  height="26.25px"
                  fill="rgb(0, 0, 0)"
                />
                <MenuTitle>{'News'}</MenuTitle>
              </StyledNavButton>
              <StyledNavButton
                variant="light"
                onClick={() => router.push(`/authors/${userData?.author.id}`)}
              >
                <SvgIcon
                  paths={paths.profile}
                  width="26.25px"
                  height="26.25px"
                  fill="rgb(0, 0, 0)"
                />
                <MenuTitle>{'Profile'}</MenuTitle>
              </StyledNavButton>
              <Button variant="primary" onClick={() => signOut()}>
                Sign out
              </Button>
            </Nav>
          </Col>
          <Col lg={isGoogle ? 7 : 6}>
            <main>{children}</main>
          </Col>
        </Row>
      </Container>
    </>
  )
}
