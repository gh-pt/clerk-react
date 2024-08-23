import {Outlet, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import { ClerkLoaded, ClerkLoading,ClerkProvider } from '@clerk/clerk-react'


export default function App() {
  const navigate = useNavigate();

  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

  return (
    <ClerkProvider
    routerPush={(to) => navigate(to)}
    routerReplace={(to) => navigate(to, { replace: true })}
    publishableKey={PUBLISHABLE_KEY}
    >
      <ClerkLoading>
        <p className='loading'>Loading....</p>
      </ClerkLoading>
      <ClerkLoaded>
        <Header/>
        <main className='main'>
          <Outlet />
        </main>
      </ClerkLoaded>
    </ClerkProvider>
  )
}