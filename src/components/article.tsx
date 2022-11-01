import React from 'react'
import ReactMarkdown from 'react-markdown'
import { ArticleResource } from '../resources/article'
import styles from '../../styles/markdown-styles.module.css'
import styled from 'styled-components'

/*
 * Styles.
 */

const StyledWrapper = styled.div`
  display: grid;
`

const StyledHeader = styled.h1`
  justify-self: center;
  text-align: center;
  font-size: 2.4rem;
`

interface ArticleProps {
  article: ArticleResource
}

export const Article = ({ article }: ArticleProps) => (
  <StyledWrapper>
    <StyledHeader>{article.title}</StyledHeader>
    <ReactMarkdown className={styles.reactMarkDown}>
      {article.content}
    </ReactMarkdown>
  </StyledWrapper>
)
