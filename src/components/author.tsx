import Image from 'next/image'
import { AuthorResource } from '../resources/author'

interface Props {
  author: AuthorResource
}

export const Author = ({ author }: Props) => {
  const { handle, image } = author

  return (
    <>
      {handle}
      <Image
        src={image?.url ?? '/empty.jpeg'}
        alt={image?.alternativeText ?? handle}
        width={'400px'}
        height={'400px'}
      />
    </>
  )
}
