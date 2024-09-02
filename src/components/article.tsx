import React from 'react'
import ReactMarkdown from 'react-markdown'
import { ArticleResource } from '../resources/article'
import styles from '../../styles/markdown-styles.module.css'
import Image from 'react-bootstrap/Image'
import remarkUnwrapImages from 'remark-unwrap-images'
import { Col, Row } from 'react-bootstrap'

/*
 * Types.
 */

interface ArticleProps {
  article: ArticleResource
}

/*
 * Component.
 */

export const Article = ({ article }: ArticleProps) => {
  const { source } = article

  return (
    <div className="d-grid p-4">
      {source && source.logo && (
        <Row className="justify-content-evenly">
          <Col xs={5}>
            <Image
              src={source.logo.url}
              alt={source.logo.alternativeText}
              fluid
            />
          </Col>
        </Row>
      )}
      <h2 className="text-center my-3">{article.title}</h2>
      <ReactMarkdown
        className={styles.reactMarkDown}
        remarkPlugins={[remarkUnwrapImages]}
        linkTarget="_blank"
      >
        {article.content}
      </ReactMarkdown>
    </div>
  )
}
