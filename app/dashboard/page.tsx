"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth')
      return
    }

    if (user) {
      setRedirecting(true)
      // Redirect based on user role
      if (user.role === 'faculty') {
        router.push('/dashboard/admin')
      } else {
        router.push('/dashboard/student')
      }
    }
  }, [user, isAuthenticated, isLoading])

  if (isLoading || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-white mx-auto" />
        <p className="text-white mt-4">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}