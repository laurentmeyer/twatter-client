import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useQuery } from 'react-query'
import { getStrapiURL } from '../../lib/api'
import { isDefined } from '../../lib/utils'

/*
 * Constants.
 */

export const MILLISECONDS_PER_MINUTE = 60 * 1000
export const MILLISECONDS_PER_SECOND = 1000

/*
 * Hooks.
 */

export const useMinutesLate = () => {
  const { data: session } = useSession()

  const fetchMinutesLateAsync = async () => {
    const { data } = await axios.get(getStrapiURL('/api/training-session'), {
      headers: { Authorization: `Bearer ${session?.jwt}` },
    })

    const { minutesLate } = data.data.attributes

    if (!isDefined(minutesLate)) {
      console.log('Cannot fetch minutesLate')
    }

    return minutesLate
  }

  const { data } = useQuery<number>(
    ['training-session', 'minutesLate'],
    fetchMinutesLateAsync,
    {
      enabled: isDefined(session),
    }
  )

  return data
}
