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

export const imagePayloadToResource = (data: ImagePayload): ImageResource => ({
  url: data.attributes.url,
  alternativeText: data.attributes.alternativeText,
})
