import Image from 'next/image'
import { NextPage } from 'next'
import Link from 'next/link'
import styled from 'styled-components'
import { ArticleResource, useArticles } from '../src/resources/article'

/*
 * Styles.
 */

const StyledListWrapper = styled.div`
  display: grid;
`

const StyledLinkWrapper = styled.div`
  display: grid;
  /* grid-area:  */
`

const StyledSourceWrapper = styled.div`
  flex-direction: column;
`

const StyledSourceName = styled.div`
  color: red;
`

/*
 * Page.
 */

const GoggleHome: NextPage = () => {
  const { data: articles } = useArticles()

  return (
    <StyledListWrapper>{articles?.map(renderArticleLink)}</StyledListWrapper>
  )
}

export default GoggleHome

/*
 * Helpers.
 */

function renderArticleLink(article: ArticleResource) {
  const { source } = article

  return (
    <StyledLinkWrapper key={article.id}>
      <StyledSourceWrapper>
        <Image
          src={source?.logo?.url || '/empty.jpeg'}
          alt={source?.logo?.alternativeText || ''}
          width={16}
          height={16}
        />
        <StyledSourceName>{source?.name || 'Le Parisien'}</StyledSourceName>
      </StyledSourceWrapper>
      <Link href={`/news/${article.id}`}>{article.title}</Link>
    </StyledLinkWrapper>
  )
}
