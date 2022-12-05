import Image from 'next/image'
import { NextPage } from 'next'
import Link from 'next/link'
import styled from 'styled-components'
import { ArticleResource, useArticles } from '../src/resources/article'

/*
 * Styles.
 */

const StyledListWrapper = styled.div`
  padding: 50px 10px 0px 10px;

  display: grid;
  row-gap: 30px;
`

const StyledTitleWrapper = styled.div`
  grid-area: title;
  color: #1a0dab;
  font-size: 20px;
  font-weight: 400;
`

const StyledArticleWrapper = styled.div`
  display: grid;
  grid-template-areas: 'article-details thumbnail';
  grid-template-columns: auto 92px;
  grid-template-rows: 92px;
  column-gap: 30px;

  &:hover ${StyledTitleWrapper} {
    text-decoration: underline;
  }
`

const StyledThumbnailWrapper = styled.div`
  grid-area: thumbnail;
  position: relative;
`

const StyledArticleDetailsWrapper = styled.div`
  grid-area: article-details;

  display: grid;
  grid-template-areas: 'source' 'title' 'excerpt' 'date';
`

const StyledArticleSourceWrapper = styled.div`
  grid-area: source;

  display: grid;
  grid-template-areas: 'source-logo source-name';
  grid-template-columns: 16px auto;
  grid-template-rows: 16px;
  column-gap: 8px;
  color: #202124;
  font-size: 12px;
  font-weight: 400;
  font-family: arial, sans-serif;
`

const StyledSourceLogoWrapper = styled.div`
  grid-area: source-logo;
  position: relative;
`

const StyledSourceNameWrapper = styled.div`
  grid-area: source-name;
`

const StyledArticleExcerptWrapper = styled.div`
  grid-area: excerpt;
`

const StyledArticleDateWrapper = styled.div`
  grid-area: date;
  color: #70757a;
  font-size: 14px;
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
  const { source, thumbnail } = article

  return (
    <Link key={article.id} href={`/news/${article.id}`} passHref>
      <StyledArticleWrapper key={article.id}>
        <StyledArticleDetailsWrapper>
          <StyledArticleSourceWrapper>
            <StyledSourceLogoWrapper>
              <Image
                src={source?.logo?.url || '/empty.jpeg'}
                alt={source?.logo?.alternativeText || ''}
                fill
                objectFit="scale-down"
              />
            </StyledSourceLogoWrapper>
            <StyledSourceNameWrapper>
              {source?.name || 'Le Parisien'}
            </StyledSourceNameWrapper>
          </StyledArticleSourceWrapper>
          <StyledTitleWrapper>
            <Link href={`/news/${article.id}`}>{article.title}</Link>
          </StyledTitleWrapper>
          <StyledArticleExcerptWrapper>
            Trololololololo
          </StyledArticleExcerptWrapper>
          <StyledArticleDateWrapper>3 days ago</StyledArticleDateWrapper>
        </StyledArticleDetailsWrapper>
        {thumbnail && (
          <StyledThumbnailWrapper>
            <Image
              src={thumbnail.url}
              alt={thumbnail.alternativeText}
              fill
              style={{
                borderRadius: '15px',
              }}
              objectFit="cover"
            />
          </StyledThumbnailWrapper>
        )}
      </StyledArticleWrapper>
    </Link>
  )
}
