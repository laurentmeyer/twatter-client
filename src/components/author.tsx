import Image from 'react-bootstrap/Image'
import { AuthorResource } from '../resources/author'
import { Message } from './message'

/*
 * Types.
 */

interface Props {
  author: AuthorResource
}

/*
 * Component.
 */

export const Author = ({ author }: Props) => {
  const {
    handle,
    imageUrl,
    imageAlt,
    backgroundUrl,
    displayName,
    description,
    followersCount,
  } = author

  const messages = author.messages
    .filter(({ isReply }) => !isReply)
    .map((message) => ({
      ...message,
      author: author,
    }))

  return (
    <>
      <div className="border-bottom">
        <Image
          className="w-100"
          style={{ height: 200 }}
          src={backgroundUrl || '/background.jpg'}
          alt={'background'}
          fluid
        />
        <div>
          <Image
            style={{
              height: 120,
              border: '4px solid white',
              borderRadius: '50%',
              backgroundColor: 'grey',
              margin: '-60px 0 0 12px',
            }}
            src={imageUrl || '/empty.jpeg'}
            alt={imageAlt || handle}
            fluid
          />
        </div>
        <div className="px-3">
          <h3>{displayName}</h3>
          <div className="text-secondary">{`@${handle}`}</div>
          <div className="">{description}</div>
          <div>
            <span className="fw-bold">{followersCount.toString()}</span>
            {' Followers'}
          </div>
        </div>
      </div>
      <div>
        {messages.map((message) => (
          <div className=" border-bottom" key={message.id}>
            <Message message={message} />
          </div>
        ))}
      </div>
    </>
  )
}
