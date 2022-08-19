import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useQuery } from 'react-query'
import { getStrapiURL } from '../../lib/api'

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
    const { data, status } = await axios.get(
      getStrapiURL('/api/training-session'),
      {
        headers: { Authorization: `Bearer ${session?.jwt}` },
      }
    )

    return status === 200 ? data.data.attributes.minutesLate : undefined
  }

  return useQuery(['training-session', 'minutesLate'], fetchMinutesLateAsync)
}
