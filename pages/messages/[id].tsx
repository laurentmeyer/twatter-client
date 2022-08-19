import { useRouter } from 'next/router'
import { Message } from '../../src/components/message'
import { useMessage } from '../../src/resources/message'

const MessagePage = () => {
  const router = useRouter()
  const id = Number(router.query.id)

  const { data: message, status } = useMessage(id)

  switch (status) {
    case 'success':
      if (message) return <Message message={message} />
      else throw new Error('Cannot fetch message')

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

export default MessagePage
