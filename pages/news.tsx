import Image from 'react-bootstrap/Image'
import { NextPage } from 'next'
import Link from 'next/link'
import { ArticleResource, useArticles } from '../src/resources/article'
import RemoveMarkdown from 'remove-markdown'
import { DateTime } from 'luxon'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

/*
 * Page.
 */

const GoggleHome: NextPage = () => {
  const { data: articles } = useArticles()

  return (
    <>
      {articles?.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </>
  )
}

export default GoggleHome

/*
 * Helpers.
 */

const ArticleCard = ({ article }: { article: ArticleResource }) => {
  const { source, thumbnail, time } = article

  const minutes = Math.floor(DateTime.now().diff(time, ['minutes']).minutes)
  const hours = Math.floor(minutes / 60)

  let delayMessage: string
  if (hours === 1) {
    delayMessage = 'One hour ago'
  } else if (hours > 1) {
    delayMessage = `${hours} hours ago`
  } else if (minutes === 1) {
    delayMessage = 'One minute ago'
  } else {
    delayMessage = `${minutes} minutes ago`
  }

  const sourceName = source?.name || 'Media'
  const sourceImageUrl = source?.icon?.url || '/empty.jpeg'
  const sourceImageAlt = source?.icon?.alternativeText || ''

  return (
    <Container className="position-relative p-4">
      <div className="d-flex align-items-end">
        <div style={{ width: 16 }}>
          <Image
            fluid
            roundedCircle
            src={sourceImageUrl}
            alt={sourceImageAlt}
          />
        </div>
        <div className="ms-1 text-dark text-opacity-75">{sourceName}</div>
      </div>
      <Row>
        <Col className="d-grid">
          <Link
            href={`/news/${article.id}`}
            className="text-truncate stretched-link link-underline link-underline-opacity-0 link-underline-opacity-100-hover"
          >
            {article.title}
          </Link>
          <div className="custom-article-excerpt">
            {RemoveMarkdown(article.content, {
              useImgAltText: false,
            })}
          </div>
          <div className="text-secondary text-opacity-75">{delayMessage}</div>
        </Col>
        <Col xs={2}>
          {thumbnail && (
            <Image
              fluid
              rounded
              src={thumbnail.url}
              alt={thumbnail.alternativeText}
            />
          )}
        </Col>
      </Row>
    </Container>
  )
}
