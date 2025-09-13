"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BookOpen, 
  Users, 
  Calendar, 
  FileText,
  Video,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Loader2 } from 'lucide-react'

export default function StudentDashboard() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const router = useRouter()
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth')
      return
    }

    // Redirect faculty and admin to admin dashboard
    if (user && (user.role === 'faculty' || user.role === 'admin')) {
      router.push('/dashboard/admin')
      return
    }

    if (user) {
      fetchData()
    }
  }, [user, isAuthenticated, isLoading])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Simulate fetching data
      // In a real implementation, you would fetch actual data from your API
      const mockClasses = [
        { id: 1, name: 'Mathematics 101', instructor: 'Dr. Smith', time: 'MWF 10:00 AM', assignments: 2 },
        { id: 2, name: 'Physics 201', instructor: 'Prof. Johnson', time: 'TTH 2:00 PM', assignments: 1 },
        { id: 3, name: 'Computer Science 301', instructor: 'Dr. Williams', time: 'MWF 1:00 PM', assignments: 3 },
      ]
      
      setClasses(mockClasses)
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

  const handleJoinClass = (classId: number) => {
    // Navigate to class meeting page
    router.push(`/meeting/${classId}`)
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 font-bold text-xl bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                COM-PSU-Rizal
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <button className="px-3 py-2 rounded-md text-sm font-medium bg-gray-800 text-white">
                    Dashboard
                  </button>
                  <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                    Classes
                  </button>
                  <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                    Assignments
                  </button>
                  <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                    Calendar
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={handleSignOut}
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user?.email}</h1>
          <p className="text-gray-400 mt-2">Here's what's happening with your classes today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-gray-400">This semester</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <FileText className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-gray-400">Pending submissions</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-gray-400">This month</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-gray-400">Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Classes and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Classes Section */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Your Classes</CardTitle>
                <CardDescription>Your enrolled courses this semester</CardDescription>
              </CardHeader>
              <CardContent>
                {classes.length > 0 ? (
                  <div className="space-y-4">
                    {classes.map((cls) => (
                      <div 
                        key={cls.id} 
                        className="p-4 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{cls.name}</h3>
                            <p className="text-sm text-gray-400 mt-1">{cls.instructor}</p>
                            <div className="flex items-center mt-2 space-x-4">
                              <div className="flex items-center text-sm text-gray-400">
                                <Clock className="w-4 h-4 mr-1" />
                                {cls.time}
                              </div>
                              <div className="flex items-center text-sm text-gray-400">
                                <FileText className="w-4 h-4 mr-1" />
                                {cls.assignments} assignments
                              </div>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleJoinClass(cls.id)}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Join Class
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-500" />
                    <h3 className="mt-2 text-sm font-medium text-gray-300">No classes enrolled</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Contact your academic advisor to enroll in classes.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Classes and Assignments */}
          <div className="space-y-8">
            {/* Upcoming Classes */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Classes happening today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 rounded-lg border border-gray-700">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-500/20">
                        <Video className="h-5 w-5 text-purple-400" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">Mathematics 101</p>
                      <p className="text-xs text-gray-500">10:00 AM - 11:00 AM</p>
                    </div>
                    <Button 
                      size="sm"
                      className="ml-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Join
                    </Button>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-lg border border-gray-700">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500/20">
                        <Video className="h-5 w-5 text-blue-400" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">Computer Science 301</p>
                      <p className="text-xs text-gray-500">1:00 PM - 2:30 PM</p>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="ml-auto border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Join
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Assignments */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Recent Assignments</CardTitle>
                <CardDescription>Latest assignments from your classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start p-3 rounded-lg border border-gray-700">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">Problem Set 3</p>
                      <p className="text-xs text-gray-500">Mathematics 101</p>
                      <p className="text-xs text-gray-500 mt-1">Due tomorrow</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-3 rounded-lg border border-gray-700">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">Lab Report 2</p>
                      <p className="text-xs text-gray-500">Physics 201</p>
                      <p className="text-xs text-gray-500 mt-1">Due in 3 days</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-3 rounded-lg border border-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">Final Project</p>
                      <p className="text-xs text-gray-500">Computer Science 301</p>
                      <p className="text-xs text-gray-500 mt-1">Submitted</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}