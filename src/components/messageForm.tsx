import axios from 'axios'
import { DateTime, Duration } from 'luxon'
import { useSession } from 'next-auth/react'
import styled from 'styled-components'
import { getStrapiURL } from '../../lib/api'
import { MILLISECONDS_PER_MINUTE, useMinutesLate } from '../resources/time'
import { useCurrentUser } from '../resources/user'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from './button'
import SvgIcon from './svgIcon'

/*
 * Types.
 */

interface Preview {
  image: string
  file: File | null
}

/*
 * Constants.
 */

const photoPath = [
  'M19.75 2H4.25C3.01 2 2 3.01 2 4.25v15.5C2 20.99 3.01 22 4.25 22h15.5c1.24 0 2.25-1.01 2.25-2.25V4.25C22 3.01 20.99 2 19.75 2zM4.25 3.5h15.5c.413 0 .75.337.75.75v9.676l-3.858-3.858c-.14-.14-.33-.22-.53-.22h-.003c-.2 0-.393.08-.532.224l-4.317 4.384-1.813-1.806c-.14-.14-.33-.22-.53-.22-.193-.03-.395.08-.535.227L3.5 17.642V4.25c0-.413.337-.75.75-.75zm-.744 16.28l5.418-5.534 6.282 6.254H4.25c-.402 0-.727-.322-.744-.72zm16.244.72h-2.42l-5.007-4.987 3.792-3.85 4.385 4.384v3.703c0 .413-.337.75-.75.75z',
]

/*
 * Styles.
 */

const StyledImageWrapper = styled.div`
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

const StyledUploadIcon = styled(SvgIcon)``

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
  const minutesLate = useMinutesLate()
  const imageUrl = user?.author.image?.url ?? '/empty.jpeg'

  const addTweet = async () => {
    setIsSendDisabled(true)
    const data = {
      author: user?.author.id,
      time: DateTime.now()
        .minus(
          Duration.fromMillis(MILLISECONDS_PER_MINUTE * (minutesLate ?? 0))
        )
        .toLocaleString(DateTime.TIME_24_WITH_SECONDS),
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
      <StyledImageWrapper>
        <Image
          style={{ borderRadius: '50%' }}
          src={imageUrl}
          alt={user?.author.image?.alternativeText ?? user?.author.handle}
          width={49}
          height={49}
        />
      </StyledImageWrapper>
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
              <StyledUploadIcon
                paths={photoPath}
                width={'18.75px'}
                height={'18.75px'}
                fill={'rgb(29,161,242)'}
              />
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
          <Button
            onClick={addTweet}
            width=""
            padding="12px 30px"
            disabled={isSendDisabled}
          >
            Tweet
          </Button>
        </StyledButtonsWrapper>
      </StyledFormWrapper>
    </>
  )
}
