import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { SessionProvider } from 'next-auth/react'
import Layout from '../src/components/layout'
import { PusherProvider } from '@harelpls/use-pusher'

const queryClient = new QueryClient()
const pusherConfig = {
  clientKey: process.env.NEXT_PUBLIC_PUSHER_CLIENTKEY,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <PusherProvider {...pusherConfig}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PusherProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default MyApp
