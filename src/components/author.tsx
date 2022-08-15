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
      {image && (
        <Image
          src={image.url}
          alt={image.alternativeText}
          width={'400px'}
          height={'400px'}
        />
      )}
    </>
  )
}
