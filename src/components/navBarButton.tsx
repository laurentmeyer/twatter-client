import * as icons from 'react-bootstrap-icons'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

/*
 * Types.
 */

interface Props {
  label: string
  variant?: string
  onClick: () => void
  iconName: keyof typeof icons
}

/*
 * Component.
 */

export const NavBarButton = ({
  iconName,
  variant = 'light',
  label,
  onClick,
}: Props) => {
  const Icon = icons[iconName]

  return (
    <Button
      className={'fw-bold fs-5 d-flex '}
      variant={variant}
      onClick={onClick}
    >
      <Row className="px-2">
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
