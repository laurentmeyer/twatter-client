import { DateTime, Duration } from 'luxon'
import { isDefined } from '../../lib/utils'
import { ArticlePayload, ArticleResource } from '../resources/article'
import type { AuthorPayload, AuthorResource } from '../resources/author'
import type { ImagePayload, ImageResource } from '../resources/image'
import { MessagePayload, MessageResource } from '../resources/message'
import { SourcePayload, SourceResource } from '../resources/source'
import { MILLISECONDS_PER_MINUTE } from '../resources/trainingSession'

// This file avoids circular dependencies.

/*
 * Images.
 */

export const imagePayloadToResource = (data: ImagePayload): ImageResource => ({
  url: data.url,
  alternativeText: data.alternativeText,
})

/*
 * Authors.
 */

export const authorPayloadToResource = (
  data: AuthorPayload,
  // TODO get rid of minutes late here
  minutesLate: number
): AuthorResource => {
  const {
    handle,
    firstName,
    lastName,
    description,
    followersCount,
    background,
    messages = [],
  } = data

  const image = data.image && imagePayloadToResource(data.image)
  const imageUrl = image?.url || sanitize(data.imageUrl)
  const backgroundImage = background && imagePayloadToResource(background)

  return {
    id: data.id,
    handle,
    firstName: sanitize(firstName),
    lastName: sanitize(lastName),
    displayName: firstName && lastName ? `${firstName} ${lastName}` : handle,
    description: sanitize(description),
    followersCount: followersCount || 0,
    imageUrl: sanitize(imageUrl),
    imageAlt: sanitize(image && image.alternativeText),
    backgroundUrl: sanitize(backgroundImage?.url),
    backgroundAlt: sanitize(backgroundImage?.alternativeText),
    messages: messages
      .map((message) => messagePayloadToResource(message, minutesLate))
      .filter(isDefined),
  }
}

/*
 * Messages.
 */

export const messagePayloadToResource = (
  data: MessagePayload,
  minutesLate: number
): MessageResource | undefined => {
  const {
    id,
    author,
    text,
    image,
    likesCount = 0,
    replies = [],
    replyTo,
  } = data

  const time = DateTime.fromISO(data.time).plus(
    Duration.fromMillis(MILLISECONDS_PER_MINUTE * minutesLate)
  )

  if (time > DateTime.now()) return undefined

  return {
    id,
    text,
    time,
    likesCount,
    image: image && imagePayloadToResource(image),
    author: author ? authorPayloadToResource(author, minutesLate) : undefined,
    isReply: Boolean(replyTo),
    replies: replies
      .map((r) => messagePayloadToResource(r, minutesLate))
      .filter(isDefined),
  }
}

/*
 * Sources.
 */

export const sourcePayloadToResource = (
  data: SourcePayload
): SourceResource => {
  const { id, name, logo, icon } = data

  return {
    id,
    name,
    logo: logo && imagePayloadToResource(logo),
    icon: icon && imagePayloadToResource(icon),
  }
}

/*
 * Articles.
 */

export const articlePayloadToResource = (
  data: ArticlePayload,
  minutesLate: number
): ArticleResource | undefined => {
  const { id, source, title, content, thumbnail } = data

  const time = DateTime.fromISO(data.time).plus(
    Duration.fromMillis(MILLISECONDS_PER_MINUTE * minutesLate)
  )

  if (time > DateTime.now()) return undefined

  return {
    id,
    content,
    time,
    source: source ? sourcePayloadToResource(source) : undefined,
    thumbnail: thumbnail ? imagePayloadToResource(thumbnail) : undefined,
    title,
  }
}

/*
 * Helpers.
 */

function sanitize(s: string | undefined | null) {
  return s === 'null' || !s ? '' : s
}
