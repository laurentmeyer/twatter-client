import { ReactNode } from 'react'
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
import { NavBarButton } from './navBarButton'

/*
 * Component.
 */

export default function Layout({ children }: { children: ReactNode }) {
  const { status: sessionStatus, data: sessionData } = useSession()
  const { data: userData } = useCurrentUser(sessionData?.jwt)
  const router = useRouter()
  // const isGoogle = router.pathname.startsWith('/news')
  const trainingSession = useTrainingSession()

  if (sessionStatus === 'loading') return <>{'Loading ...'}</>

  if (sessionStatus === 'unauthenticated')
    return <>{'Error: unable to authenticate current user.'}</>

  const twitterButton = (
    <NavBarButton
      iconName="TwitterX"
      label="Twitter"
      onClick={() => router.push('/')}
    />
  )

  const googleButton = (
    <NavBarButton
      iconName="Google"
      label="News"
      onClick={() => router.push('/news')}
    />
  )

  const profileButton = (
    <NavBarButton
      iconName="Person"
      label="Profile"
      onClick={() => router.push(`/authors/${userData?.author.id}`)}
    />
  )

  const signOutButton = (
    <Button variant="primary" onClick={() => signOut()}>
      Sign out
    </Button>
  )

  return (
    <>
      <Container fluid>
        <Row>
          <Col className="d-none d-lg-block" lg={3}>
            <Nav defaultActiveKey="/home" className="d-grid gap-0 row-gap-2">
              <Nav.Item>
                <Image
                  fluid
                  src={trainingSession?.clientLogo.url || '/empty.jpeg'}
                  alt={trainingSession?.clientLogo.alternativeText || ''}
                />
              </Nav.Item>
              {twitterButton}
              {googleButton}
              {profileButton}
              {signOutButton}
            </Nav>
          </Col>
          <Col lg={7}>
            <Navbar className="bg-body-tertiary d-lg-none">
              <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="w-100 justify-content-between d-flex align-items-center">
                    {twitterButton}
                    {googleButton}
                    {profileButton}
                    {signOutButton}
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
            <main>{children}</main>
          </Col>
        </Row>
      </Container>
    </>
  )
}
