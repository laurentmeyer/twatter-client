import axios from 'axios'
import { useSession } from 'next-auth/react'
import styled from 'styled-components'
import { getStrapiURL } from '../../lib/api'
import { useCurrentUser } from '../resources/user'
import Image from 'next/image'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import Button from 'react-bootstrap/Button'
import { CardImage } from 'react-bootstrap-icons'

/*
 * Types.
 */

interface Preview {
  image: string
  file: File | null
}

/*
 * Styles.
 */

const StyledImageWrapper = styled.div`
  position: relative;
  height: 49px;
  width: 49px;
  margin-right: 8px;
`

const StyledFormWrapper = styled.div`
  width: 100%;
`

const StyledButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const StyledTextArea = styled.textarea`
  background: rgb(255, 255, 255) none repeat scroll 0% 0%;
  caret-color: rgb(0, 0, 0);
  width: 100%;
  outline: currentcolor none medium;
  border: medium none;
  resize: none;
  font-size: 16px;
  font-weight: 500;
  color: rgb(0, 0, 0);
  overflow: auto;

  margin: 0;
  font-family: inherit;
  line-height: inherit;
`

const StyledFileInput = styled.div`
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  margin-right: 8px;
  &:hover {
    background-color: 'rgba(29, 161, 242, 0.1)';
  }
`

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

    await axios.post(getStrapiURL(`/api/messages/`), formData, {
      headers: { Authorization: `Bearer ${sessionData?.jwt}` },
    })

    // todo: chose between two versions depending on reactivity
    queryClient.invalidateQueries(['messages', 'list'])
    // setTimeout(() => queryClient.invalidateQueries(['messages', 'list']), 1000)

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
      <div>
        <StyledImageWrapper>
          <Image
            style={{ borderRadius: '50%', objectFit: 'cover' }}
            src={user?.author.imageUrl || '/empty.jpeg'}
            alt={user?.author.imageAlt || user?.author.handle || 'alt'}
            fill
          />
        </StyledImageWrapper>
      </div>
      <StyledFormWrapper>
        <StyledTextArea
          rows={5}
          placeholder={placeHolder}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            e.target.value ? setIsSendDisabled(false) : setIsSendDisabled(true)
          }}
        />
        <StyledButtonsWrapper>
          <StyledFileInput>
            <label htmlFor="photo">
              <CardImage size={24} className="text-primary " />
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handlePhoto}
              style={{ display: 'none' }}
            />
          </StyledFileInput>
          <Button onClick={addTweet} disabled={isSendDisabled}>
            Tweet
          </Button>
        </StyledButtonsWrapper>
      </StyledFormWrapper>
    </>
  )
}
