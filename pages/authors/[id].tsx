import { useRouter } from 'next/router'
import { Author } from '../../src/components/author'
import { useAuthor } from '../../src/resources/author'

const AuthorPage = () => {
  const router = useRouter()
  const id = Number(router.query.id)

  const { data: author, status } = useAuthor(id)

  switch (status) {
    case 'success':
      if (author) return <Author author={author} />
      else throw new Error('Cannot fetch author')

    case 'loading':
      return <>Loading</>

    case 'idle':
      return <>Idle</>

    case 'error':
      return <>Error</>

    default:
      throw new Error('Unreachable code')
  }
}

export default AuthorPage
