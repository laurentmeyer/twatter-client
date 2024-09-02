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

/*
 * Types.
 */

interface Preview {
  image: string
  file: File | null
}

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
  const [preview, setPreview] = useState<Preview>({ image: '', file: null })

  const { data: sessionData } = useSession()
  const { data: user } = useCurrentUser(sessionData?.jwt)

  const queryClient = useQueryClient()

  const addTweet = async () => {
    setIsSendDisabled(true)
    const data = {
      author: user?.author.id,
      text,
      replyTo,
    }

    const formData = new FormData()

    formData.append('data', JSON.stringify(data))

    const { file } = preview

    if (file) formData.append(`files.image`, file, file.name)

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
    setPreview({ image: '', file: null })
    if (onTweet) onTweet()
  }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]

    if (!file) return

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onloadend = () => {
      if (typeof reader.result === 'string')
        setPreview({ image: reader.result, file })
    }
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
          onChange={handlePhoto}
          style={{ display: 'none' }}
        />
        <Button onClick={addTweet} disabled={isSendDisabled}>
          Tweet
        </Button>
      </div>
    </>
  )
}
