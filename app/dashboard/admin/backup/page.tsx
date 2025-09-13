"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Loader2, Database } from 'lucide-react'
import AdminLayout from '@/components/admin/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function BackupPage() {
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

    // Only allow admin users for backup & restore
    if (user && user.role === 'admin') {
      setLoading(false)
    } else {
      // Redirect faculty to dashboard
      router.push('/dashboard/admin')
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
          <Database className="h-8 w-8 mr-2 text-blue-500" />
          <h1 className="text-2xl font-bold">Backup & Restore</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup</CardTitle>
              <CardDescription>Create system backups</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Backup options will be displayed here.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Restore</CardTitle>
              <CardDescription>Restore from backups</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Restore options will be displayed here.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Backup History</CardTitle>
              <CardDescription>Previous backup records</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Backup history will be displayed here.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
              <CardDescription>Automated backup settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Backup schedule settings will be displayed here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}