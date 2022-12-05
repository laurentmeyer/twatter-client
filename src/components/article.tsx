import React from 'react'
import ReactMarkdown from 'react-markdown'
import { ArticleResource } from '../resources/article'
import styles from '../../styles/markdown-styles.module.css'
import styled from 'styled-components'
import Image from 'next/image'

/*
 * Styles.
 */

const StyledWrapper = styled.div`
  display: grid;
  padding: 0 20px;
`

const StyledHeader = styled.h1`
  justify-self: center;
  text-align: center;
  font-size: 2rem;
`

const StyledSourceLogoWrapper = styled.div`
  width: 200px;
  height: 150px;
  position: relative;
  justify-self: center;
`

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
    <StyledWrapper>
      {source && source.logo && (
        <StyledSourceLogoWrapper>
          <Image
            src={source.logo.url}
            alt={source.logo.alternativeText}
            fill
            objectFit="contain"
          />
        </StyledSourceLogoWrapper>
      )}
      <StyledHeader>{article.title}</StyledHeader>
      <ReactMarkdown className={styles.reactMarkDown}>
        {article.content}
      </ReactMarkdown>
    </StyledWrapper>
  )
}
