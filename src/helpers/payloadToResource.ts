import { DateTime } from 'luxon'
import { isDefined } from '../../lib/utils'
import { ArticlePayload, ArticleResource } from '../resources/article'
import type { AuthorPayload, AuthorResource } from '../resources/author'
import type { ImagePayload, ImageResource } from '../resources/image'
import { MessagePayload, MessageResource } from '../resources/message'
import { SourcePayload, SourceResource } from '../resources/source'

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
  data: AuthorPayload
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
    messages: messages.map(messagePayloadToResource).filter(isDefined),
  }
}

/*
 * Messages.
 */

export const messagePayloadToResource = (
  data: MessagePayload
): MessageResource => {
  const {
    id,
    author,
    text,
    time,
    image,
    likesCount = 0,
    replies = [],
    replyTo,
    isRetweetOf = undefined,
    retweets = [],
  } = data

  return {
    id,
    text,
    time: DateTime.fromISO(time),
    likesCount,
    image: image && imagePayloadToResource(image),
    author: author && authorPayloadToResource(author),
    isReply: Boolean(replyTo),
    replies: replies.map(messagePayloadToResource).filter(isDefined),
    isRetweetOf: isRetweetOf
      ? messagePayloadToResource(isRetweetOf)
      : undefined,
    retweets: retweets.map(messagePayloadToResource).filter(isDefined),
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
  data: ArticlePayload
): ArticleResource => {
  const { id, source, title, time, content, thumbnail } = data

  return {
    id,
    content,
    time: DateTime.fromISO(time),
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
