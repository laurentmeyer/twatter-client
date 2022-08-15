import type { NextPage } from 'next'
import { MessageList } from '../src/components/messageList'
import { useMessages } from '../src/resources/message'

const Home: NextPage = () => {
  const { data, status } = useMessages()

  switch (status) {
    case 'loading':
      return <>{'Loading...'}</>

    case 'success':
      return <MessageList messages={data} />

    case 'error':
    default:
      return <>{'Error'}</>
  }
}

export default Home
