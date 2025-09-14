"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@com-psu-rizal/shared/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Loader2, Settings as SettingsIcon } from 'lucide-react'
import AdminLayout from '@com-psu-rizal/ui/admin/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@com-psu-rizal/ui/ui/card'

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth')
      return
    }

    if (user && user.role === 'student') {
      router.push('/dashboard/student')
      return
    }

    if (user && (user.role === 'faculty' || user.role === 'admin')) {
      setLoading(false)
    }
  }, [user, isAuthenticated, isLoading, router])

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <SettingsIcon className="h-8 w-8 mr-2 text-blue-500" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic configuration options</CardDescription>
            </CardHeader>
            <CardContent>
              <p>General settings will be displayed here.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
              <CardDescription>Personalization options</CardDescription>
            </CardHeader>
            <CardContent>
              <p>User preferences will be displayed here.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Advanced configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <p>System settings will be displayed here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}