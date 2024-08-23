import * as React from 'react'
import { useAuth } from '@clerk/clerk-react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function DashboardLayout() {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate()

  console.log('userId:', userId)

  React.useEffect(() => {
    if (isLoaded && !userId) {
      navigate('/sign-in',{ replace: true })
    }
  }, [isLoaded])

  if (!isLoaded) return 'Loading...'

  return <Outlet />
}