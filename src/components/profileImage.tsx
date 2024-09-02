import Image from 'react-bootstrap/Image'

interface Props {
  src: string
  alt: string
}

export const ProfileImage = ({ src, alt }: Props) => {
  return (
    <div className="custom-square-image-container">
      <Image
        fluid
        roundedCircle
        src={src}
        alt={alt}
        style={{
          objectFit: 'cover',
        }}
      />
    </div>
  )
}
