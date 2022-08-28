import { DateTime, Duration } from 'luxon'
import { isDefined } from '../../lib/utils'
import type { AuthorPayload, AuthorResource } from '../resources/author'
import type { ImagePayload, ImageResource } from '../resources/image'
import type { MessagePayload, MessageResource } from '../resources/message'
import { MILLISECONDS_PER_MINUTE } from '../resources/time'

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
  minutesLate: number
): AuthorResource => {
  const {
    handle,
    firstName,
    lastName,
    description,
    followersCount,
    image,
    messages = [],
  } = data

  const resource = {
    id: data.id,
    handle,
    firstName,
    lastName,
    description,
    followersCount,
    image: image && imagePayloadToResource(image),
    messages: [],
  }

  return {
    ...resource,
    messages: messages
      .map((message) =>
        messagePayloadToResource(message, minutesLate, resource)
      )
      .filter(isDefined),
  }
}

/*
 * Helpers.
 */

export const messagePayloadToResource = (
  data: MessagePayload,
  minutesLate: number,
  currentAuthor?: AuthorResource // API does not provide authors in case of an author's message list
): MessageResource | undefined => {
  const {
    id,
    author,
    public: isPublic,
    text,
    image,
    likesCount,
    repliesCount,
  } = data

  if (!(currentAuthor ?? author)) throw new Error(`Message ${id} has no author`)

  const time = DateTime.fromISO(data.time).plus(
    Duration.fromMillis(MILLISECONDS_PER_MINUTE * minutesLate)
  )

  if (time > DateTime.now()) return undefined

  return {
    id,
    text,
    time,
    isPublic,
    likesCount: likesCount ?? 0,
    repliesCount: repliesCount ?? 0,
    image: image && imagePayloadToResource(image),
    author: currentAuthor ?? authorPayloadToResource(author!, minutesLate),
  }
}
