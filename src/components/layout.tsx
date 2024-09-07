import { ReactNode } from 'react'
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Navbar from 'react-bootstrap/Navbar'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
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

  const twitterXButton = (
    <NavBarButton
      iconName="TwitterX"
      label="X"
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
    <NavBarButton
      iconName="BoxArrowLeft"
      label="Exit"
      variant="primary"
      onClick={() => signOut()}
    />
  )

  const navButtons = (
    <>
      {twitterXButton}
      {googleButton}
      {profileButton}
      {signOutButton}
    </>
  )

  return (
    <>
      <Navbar className="bg-body-tertiary d-md-none">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="w-100 p-3 justify-content-around d-flex align-items-center">
            {navButtons}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Row>
        <Col className="d-none d-md-block ps-5" md={4} lg={3} xl={2}>
          <Nav defaultActiveKey="/home" className="d-grid gap-0 row-gap-2">
            <Nav.Item>
              <Image
                fluid
                src={trainingSession?.clientLogo.url || '/empty.jpeg'}
                alt={trainingSession?.clientLogo.alternativeText || ''}
              />
            </Nav.Item>
            {navButtons}
          </Nav>
        </Col>
        <Col className="d-flex justify-content-center">
          <Col xs={12} md={11} lg={10} xl={8} xxl={7}>
            <main>{children}</main>
          </Col>
        </Col>
      </Row>
    </>
  )
}
