import axios from 'axios'
import { DateTime } from 'luxon'
import { useSession } from 'next-auth/react'
import { useQuery } from 'react-query'
import { getStrapiURL } from '../../lib/api'
import { isDefined } from '../../lib/utils'
import { articlePayloadToResource } from '../helpers/payloadToResource'
import { ImagePayload, ImageResource } from './image'
import { SourcePayload, SourceResource } from './source'
import { MILLISECONDS_PER_SECOND } from './trainingSession'

/*
 * Types.
 */

export interface ArticlePayload {
  id: number
  title: string
  content: string
  time: string
  thumbnail: ImagePayload | null
  source: SourcePayload | null
}

export interface ArticleResource {
  id: number
  title: string
  content: string
  time: DateTime
  thumbnail?: ImageResource
  source?: SourceResource
}

/*
 * Hooks.
 */

export const useArticle = (id: number) => {
  // Should be a valid session, already checked by layout
  const { data: session } = useSession()

  const fetchArticleAsync = async () => {
    const { data } = await axios.get(getStrapiURL(`/api/articles/${id}`), {
      headers: { Authorization: `Bearer ${session?.jwt}` },
    })

    return articlePayloadToResource(data)
  }

  return useQuery<ArticleResource | undefined>(
    ['article', id],
    fetchArticleAsync,
    {
      enabled: Number.isFinite(id),
    }
  )
}

export const useArticles = () => {
  // Should be a valid session, already checked by layout
  const { data: session } = useSession()

  const fetchArticlesAsync = async () => {
    const { data } = await axios.get(
      getStrapiURL('/api/articles?sort=time:desc'),
      {
        headers: { Authorization: `Bearer ${session?.jwt}` },
      }
    )

    return data.map(articlePayloadToResource).filter(isDefined)
  }

  return useQuery<ReadonlyArray<ArticleResource>>(
    ['articles', 'list'],
    fetchArticlesAsync,
    {
      refetchInterval: 15 * MILLISECONDS_PER_SECOND,
    }
  )
}
