export interface ImagePayloadFlat {
  id: number
  url: string
  alternativeText: string
}

export interface ImagePayload {
  id: number
  attributes: {
    url: string
    alternativeText: string
  }
}

export interface ImageResource {
  url: string
  alternativeText: string
}

export const imagePayloadFlatToResource = (
  data: ImagePayloadFlat
): ImageResource => ({
  url: data.url,
  alternativeText: data.alternativeText,
})

export const imagePayloadToResource = (data: ImagePayload): ImageResource => ({
  url: data.attributes.url,
  alternativeText: data.attributes.alternativeText,
})
