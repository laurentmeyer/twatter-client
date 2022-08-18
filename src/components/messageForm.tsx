import axios from 'axios'
import { useSession } from 'next-auth/react'
import { getStrapiURL } from '../../lib/api'
import { useCurrentUser } from '../resources/user'

export const MessageForm = () => {
  const { status: sessionStatus, data: sessionData } = useSession()
  const { data: userData } = useCurrentUser(sessionData?.jwt)

  if (sessionStatus !== 'authenticated') return <>{'Loading...'}</>

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = {
      author: userData?.author.id,
      time: '14:42:18.543',
      text: '',
    }

    const formData = new FormData()

    e.currentTarget.text

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const { name, type, value, files } of e.target as any) {
      if (type === 'text') {
        data.text = value
      } else if (type === 'file') {
        for (const file of files)
          formData.append(`files.${name}`, file, file.name)
      }
    }

    formData.append('data', JSON.stringify(data))

    await axios.post(getStrapiURL(`/api/messages/`), formData, {
      headers: { Authorization: `Bearer ${sessionData?.jwt}` },
    })
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" name="text" />
        <input type="file" name="image" />
        <input type="submit" value="Submit" />
      </form>
    </>
  )
}
