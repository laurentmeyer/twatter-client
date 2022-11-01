import axios from 'axios'
import { DateTime } from 'luxon'
import { useSession } from 'next-auth/react'
import { useQuery } from 'react-query'
import { getStrapiURL } from '../../lib/api'
import { isDefined } from '../../lib/utils'
import { articlePayloadToResource } from '../helpers/payloadToResource'
import { SourcePayload, SourceResource } from './source'
import { MILLISECONDS_PER_SECOND, useMinutesLate } from './time'

/*
 * Types.
 */

export interface ArticlePayload {
  id: number
  title: string
  content: string
  time: string
  source: SourcePayload | null
}

export interface ArticleResource {
  id: number
  title: string
  content: string
  time: DateTime
  source?: SourceResource
}

/*
 * Hooks.
 */

export const useArticle = (id: number) => {
  // Should be a valid session, already checked by layout
  const { data: session } = useSession()
  const minutesLate = useMinutesLate()

  const fetchArticleAsync = async () => {
    const { data } = await axios.get(getStrapiURL(`/api/articles/${id}`), {
      headers: { Authorization: `Bearer ${session?.jwt}` },
    })

    if (!isDefined(minutesLate))
      throw new Error('Cannot fetch article without minutesLate')

    return articlePayloadToResource(data, minutesLate)
  }

  return useQuery<ArticleResource | undefined>(
    ['article', id],
    fetchArticleAsync,
    {
      enabled: Number.isFinite(id) && isDefined(minutesLate),
    }
  )
}

export const useArticles = () => {
  // Should be a valid session, already checked by layout
  const { data: session } = useSession()
  const minutesLate = useMinutesLate()

  const fetchArticlesAsync = async () => {
    const { data } = await axios.get(
      getStrapiURL('/api/articles?sort=time:desc'),
      {
        headers: { Authorization: `Bearer ${session?.jwt}` },
      }
    )

    if (!isDefined(minutesLate))
      throw new Error('Cannot fetch articles without minutesLate')

    return data
      .map((payload: ArticlePayload) =>
        articlePayloadToResource(payload, minutesLate)
      )
      .filter(isDefined)
  }

  return useQuery<ReadonlyArray<ArticleResource>>(
    ['messages', 'list'],
    fetchArticlesAsync,
    {
      refetchInterval: 15 * MILLISECONDS_PER_SECOND,
      enabled: isDefined(minutesLate),
    }
  )
}
