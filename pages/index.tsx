import type { NextPage } from 'next'
import { MessageForm } from '../src/components/messageForm'
import { MessageList } from '../src/components/messageList'
import { useMessages } from '../src/resources/message'

const Home: NextPage = () => {
  const { data, status: messagesStatus } = useMessages()

  if (messagesStatus === 'loading') return <>{'Loading ...'}</>

  if (messagesStatus === 'error' || messagesStatus === 'idle')
    return <>{'Error'}</>

  return (
    <>
      <MessageForm />
      <MessageList messages={data} />
    </>
  )
}

export default Home
