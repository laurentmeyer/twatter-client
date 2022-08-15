import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { fetchMessageAsync } from '../../src/resources/message'
import { Message } from '../../src/components/message'

const MessagePage = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const { id } = router.query

  const { data: message, status } = useQuery(['message', session, id], () =>
    fetchMessageAsync(Number(id), session?.jwt)
  )

  switch (status) {
    case 'success':
      if (message) return <Message message={message} />
      else throw new Error('Cannot fetch message')

    case 'loading':
      return <>Loading</>

    case 'idle':
      return <>Idle</>

    case 'error':
    default:
      return <>Error</>
  }
}

export default MessagePage
