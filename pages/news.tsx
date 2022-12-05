import Image from 'next/image'
import { NextPage } from 'next'
import Link from 'next/link'
import styled from 'styled-components'
import { ArticleResource, useArticles } from '../src/resources/article'
import RemoveMarkdown from 'remove-markdown'
import { DateTime } from 'luxon'

/*
 * Styles.
 */

const StyledListWrapper = styled.div`
  padding: 50px 10px 0px 10px;

  display: grid;
  row-gap: 30px;
`

const StyledArticleTitleWrapper = styled.div`
  grid-area: title;
  color: #1a0dab;
  font-size: 20px;
  font-weight: 400;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const StyledArticleWrapper = styled.div`
  display: grid;
  grid-template-areas: 'article-details thumbnail';
  grid-template-columns: auto 92px;
  column-gap: 30px;

  &:hover ${StyledArticleTitleWrapper} {
    text-decoration: underline;
  }
`

const StyledThumbnailWrapper = styled.div`
  grid-area: thumbnail;
  position: relative;
  height: 92px;
`

const StyledArticleDetailsWrapper = styled.div`
  grid-area: article-details;

  display: grid;
  grid-template-areas: 'source' 'title' 'excerpt' 'date';
  grid-auto-rows: auto;
  row-gap: 4px;
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

  text-overflow: ellipsis;
  overflow: hidden;
  // Addition lines for 2 line or multiline ellipsis
  display: -webkit-box !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
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

  return (
    <Link key={article.id} href={`/news/${article.id}`} passHref>
      <StyledArticleWrapper key={article.id}>
        <StyledArticleDetailsWrapper>
          <StyledArticleSourceWrapper>
            <StyledSourceLogoWrapper>
              <Image
                src={source?.icon?.url || '/empty.jpeg'}
                alt={source?.icon?.alternativeText || ''}
                fill
              />
            </StyledSourceLogoWrapper>
            <StyledSourceNameWrapper>
              {source?.name || 'Le Parisien'}
            </StyledSourceNameWrapper>
          </StyledArticleSourceWrapper>
          <StyledArticleTitleWrapper>
            <Link href={`/news/${article.id}`}>{article.title}</Link>
          </StyledArticleTitleWrapper>
          <StyledArticleExcerptWrapper>
            {RemoveMarkdown(article.content, {
              useImgAltText: false,
            })}
          </StyledArticleExcerptWrapper>
          <StyledArticleDateWrapper>{delayMessage}</StyledArticleDateWrapper>
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
