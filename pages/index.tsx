import type { NextPage } from 'next'
import { TwatterHome } from './twatterHome'
import GoggleHome from './news'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const router = useRouter()

  const isGoggle = router.pathname.startsWith('/news/')

  return isGoggle ? <GoggleHome /> : <TwatterHome />
}

export default Home
