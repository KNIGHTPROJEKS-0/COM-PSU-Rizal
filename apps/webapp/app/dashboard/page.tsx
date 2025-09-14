"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@com-psu-rizal/shared/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  console.log('DashboardPage rendered with auth state:', { user, isAuthenticated, isLoading });

  useEffect(() => {
    console.log('Dashboard useEffect triggered with auth state:', { user, isAuthenticated, isLoading });
    
    if (!isLoading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to /auth');
      router.push('/auth')
      return
    }

    if (user && !redirecting) {
      console.log('User authenticated, redirecting to role-specific dashboard:', user.role);
      setRedirecting(true)
      // Redirect based on user role
      if (user.role === 'faculty' || user.role === 'admin') {
        console.log('Redirecting to /dashboard/admin');
        router.push('/dashboard/admin')
      } else {
        console.log('Redirecting to /dashboard/student');
        router.push('/dashboard/student')
      }
    }
  }, [user, isAuthenticated, isLoading, redirecting, router])

  if (isLoading || redirecting) {
    console.log('Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  console.log('Showing dashboard redirect message');
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-white mx-auto" />
        <p className="text-white mt-4">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}