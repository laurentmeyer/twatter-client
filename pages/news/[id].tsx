import { useRouter } from 'next/router'
import { Article } from '../../src/components/article'
import { useArticle } from '../../src/resources/article'

const ArticlePage = () => {
  const router = useRouter()
  const id = Number(router.query.id)

  const { data: article, status } = useArticle(id)

  switch (status) {
    case 'success':
      if (article) return <Article article={article} />
      else throw new Error('Cannot fetch article')

    case 'loading':
      return <>Loading</>

    case 'idle':
      return <>Idle</>

    case 'error':
      return <>Error</>

    default:
      throw new Error('Unreachable code')
  }
}

export default ArticlePage
