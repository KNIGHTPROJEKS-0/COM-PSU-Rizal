"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  getClasses, 
  getEnrollments, 
  getAssignments,
  getAttendance
} from '@/lib/supabaseService'
import { Loader2, BookOpen, Users, Calendar, FileText } from 'lucide-react'

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const router = useRouter()
  const [classes, setClasses] = useState<any[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth')
      return
    }

    if (user) {
      fetchData()
    }
  }, [user, isAuthenticated, isLoading])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch classes based on user role
      const { data: classesData, error: classesError } = await getClasses()
      if (classesData) setClasses(classesData)
      
      // Fetch enrollments
      const { data: enrollmentsData, error: enrollmentsError } = await getEnrollments(user?.id || '')
      if (enrollmentsData) setEnrollments(enrollmentsData)
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth')
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Academic Dashboard</h1>
            <p className="text-gray-400">
              Welcome back, {user?.email}
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classes.length}</div>
              <p className="text-xs text-muted-foreground">
                {user?.role === 'faculty' ? 'Teaching' : 'Enrolled'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Pending submissions</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">Average grade</p>
            </CardContent>
          </Card>
        </div>

        {/* Classes Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>My Classes</CardTitle>
              <CardDescription>
                {user?.role === 'faculty' 
                  ? 'Classes you are teaching' 
                  : 'Classes you are enrolled in'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {classes.length > 0 ? (
                <div className="space-y-4">
                  {classes.map((cls) => (
                    <div 
                      key={cls.id} 
                      className="p-4 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/dashboard/classes/${cls.id}`)}
                    >
                      <h3 className="font-medium">{cls.name}</h3>
                      <p className="text-sm text-gray-400">{cls.description}</p>
                      {cls.faculty && (
                        <p className="text-xs text-gray-500 mt-1">
                          Instructor: {cls.faculty.first_name} {cls.faculty.last_name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  {user?.role === 'faculty' 
                    ? 'You are not teaching any classes yet.' 
                    : 'You are not enrolled in any classes yet.'}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest academic activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-gray-700">
                  <h3 className="font-medium">System Update</h3>
                  <p className="text-sm text-gray-400">New assignment submission feature</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
                
                <div className="p-4 rounded-lg border border-gray-700">
                  <h3 className="font-medium">Meeting Reminder</h3>
                  <p className="text-sm text-gray-400">Math 101 class meeting tomorrow</p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
                
                <div className="p-4 rounded-lg border border-gray-700">
                  <h3 className="font-medium">Grade Updated</h3>
                  <p className="text-sm text-gray-400">Your assignment was graded</p>
                  <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}