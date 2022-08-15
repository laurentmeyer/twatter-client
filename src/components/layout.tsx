import { ReactNode } from 'react'
import { signOut } from 'next-auth/react'

export default function Layout(args: { children: ReactNode }) {
  return (
    <>
      <button onClick={() => signOut()}>Sign out</button>
      <main>{args.children}</main>
    </>
  )
}
