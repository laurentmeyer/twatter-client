import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useQuery } from 'react-query'
import { getStrapiURL } from '../../lib/api'
import { isDefined } from '../../lib/utils'
import { ImageResource } from './image'

/*
 * Constants.
 */

export const MILLISECONDS_PER_SECOND = 1000

/*
 * Types.
 */

interface TrainingSession {
  clientLogo: ImageResource
}

/*
 * Hooks.
 */

export const useTrainingSession = () => {
  const { data: session } = useSession()

  const fetchTrainingSessionAsync = async () => {
    const { data } = await axios.get(getStrapiURL('/api/training-session'), {
      headers: { Authorization: `Bearer ${session?.jwt}` },
    })

    if (!isDefined(data)) {
      console.log('Cannot fetch training session')
    }

    const { clientLogo } = data

    return { clientLogo }
  }

  const { data } = useQuery<TrainingSession>(
    ['training-session'],
    fetchTrainingSessionAsync,
    {
      enabled: isDefined(session),
    }
  )

  return data
}
