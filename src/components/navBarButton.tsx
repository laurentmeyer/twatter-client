import * as icons from 'react-bootstrap-icons'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

/*
 * Types.
 */

interface Props {
  label: string
  onClick: () => void
  iconName: keyof typeof icons
}

/*
 * Component.
 */

export const NavBarButton = ({ iconName, label, onClick }: Props) => {
  const Icon = icons[iconName]

  return (
    <Button className={'fw-bold fs-5 d-flex'} variant="light" onClick={onClick}>
      <Row className="px-3">
        <Col className="col-md-auto">
          <Icon size={24} />
        </Col>
        <Col className="d-none d-md-block" md={4} lg={3}>
          {label}
        </Col>
      </Row>
    </Button>
  )
}
