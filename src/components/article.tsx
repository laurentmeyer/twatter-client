import { ArticleResource } from '../resources/article'

interface ArticleProps {
  article: ArticleResource
}

export const Article = ({ article }: ArticleProps) => (
  <div>{article.content.toString()}</div>
)
