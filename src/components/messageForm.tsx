import axios from 'axios'
import { useSession } from 'next-auth/react'
import { getStrapiURL } from '../../lib/api'
import { useCurrentUser } from '../resources/user'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import Button from 'react-bootstrap/Button'
import { CardImage } from 'react-bootstrap-icons'
import { Col, Row } from 'react-bootstrap'
import { ProfileImage } from './profileImage'
import loadImage from 'blueimp-load-image'

/*
 * Props.
 */

interface MessageFormProps {
  placeHolder: string
  replyTo?: number
  onTweet?: () => void
}

/*
 * Component.
 */

export const MessageForm = ({
  placeHolder,
  replyTo,
  onTweet,
}: MessageFormProps) => {
  const [text, setText] = useState('')
  const [isSendDisabled, setIsSendDisabled] = useState(true)
  const [imageFile, setImageFile] = useState<File>()

  const { data: sessionData } = useSession()
  const { data: user } = useCurrentUser(sessionData?.jwt)

  const queryClient = useQueryClient()

  const onSendTweet = async () => {
    setIsSendDisabled(true)
    const data = {
      author: user?.author.id,
      text,
      replyTo,
    }

    const formData = new FormData()

    formData.append('data', JSON.stringify(data))

    if (imageFile) formData.append(`files.image`, imageFile, imageFile.name)

    try {
      await axios.post(getStrapiURL(`/api/messages/`), formData, {
        headers: { Authorization: `Bearer ${sessionData?.jwt}` },
      })
    } catch (error) {
      console.error(error)
    }

    queryClient.invalidateQueries(['messages', 'list'])

    setIsSendDisabled(false)
    setText('')
    setImageFile(undefined)
    if (onTweet) onTweet()
  }

  const onAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]

    if (!file) return

    const data = await loadImage(file, { canvas: true })
    const canvas = data.image as HTMLCanvasElement

    canvas.toBlob((blob) => {
      if (!blob) return

      setImageFile(new File([blob], file.name))
    })
  }

  return (
    <>
      <Row>
        <Col xs={2}>
          <ProfileImage
            src={user?.author.imageUrl || '/empty.jpeg'}
            alt={user?.author.imageAlt || user?.author.handle || 'alt'}
          />
        </Col>
      </Row>
      <textarea
        className="custom-reply-text-area w-100 border border-0"
        rows={5}
        placeholder={placeHolder}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          e.target.value ? setIsSendDisabled(false) : setIsSendDisabled(true)
        }}
      />
      <div className="d-flex gap-3 justify-content-end align-items-center">
        <label htmlFor="photo">
          <CardImage size={24} className="text-primary" />
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          onChange={onAddImage}
          style={{ display: 'none' }}
        />
        <Button onClick={onSendTweet} disabled={isSendDisabled}>
          Tweet
        </Button>
      </div>
    </>
  )
}
