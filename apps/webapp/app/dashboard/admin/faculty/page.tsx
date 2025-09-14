"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@com-psu-rizal/shared/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Loader2, Users2 } from 'lucide-react'
import AdminLayout from '@com-psu-rizal/ui/admin/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@com-psu-rizal/ui/ui/card'

export default function FacultyPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth')
      return
    }

    // Redirect students to student dashboard
    if (user && user.role === 'student') {
      router.push('/dashboard/student')
      return
    }

    // Allow both faculty and admin users
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
          <Users2 className="h-8 w-8 mr-2 text-blue-500" />
          <h1 className="text-2xl font-bold">Faculty</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>All Faculty</CardTitle>
              <CardDescription>Complete list of faculty members</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Faculty list will be displayed here.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Departments</CardTitle>
              <CardDescription>Academic departments</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Department information will be displayed here.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Faculty Schedules</CardTitle>
              <CardDescription>Teaching and office hours</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Faculty schedules will be displayed here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}