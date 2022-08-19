import axios from 'axios'
import { DateTime, Duration } from 'luxon'
import { useSession } from 'next-auth/react'
import { getStrapiURL } from '../../lib/api'
import { MILLISECONDS_PER_MINUTE, useMinutesLate } from '../resources/time'
import { useCurrentUser } from '../resources/user'

export const MessageForm = () => {
  const { data: sessionData } = useSession()
  const { data: userData } = useCurrentUser(sessionData?.jwt)
  const { data: minutesLate } = useMinutesLate()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = {
      author: userData?.author.id,
      time: DateTime.now()
        .minus(Duration.fromMillis(MILLISECONDS_PER_MINUTE * minutesLate))
        .toLocaleString(DateTime.TIME_24_WITH_SECONDS),
      text: '',
    }

    const formData = new FormData()

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
