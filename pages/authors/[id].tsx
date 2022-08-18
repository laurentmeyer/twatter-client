import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { Author } from '../../src/components/author'
import { fetchAuthorAsync } from '../../src/resources/author'

const AuthorPage = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const { id } = router.query

  const { data: author, status } = useQuery(['authors', id], () =>
    fetchAuthorAsync(Number(id), session?.jwt)
  )

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
