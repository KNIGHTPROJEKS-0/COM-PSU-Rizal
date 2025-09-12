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
  Plus,
  BarChart3,
  Clock,
  Award
} from 'lucide-react'
import { Loader2 } from 'lucide-react'

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const router = useRouter()
  const [classes, setClasses] = useState<any[]>([])
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
        { id: 1, name: 'Mathematics 101', students: 24, assignments: 5 },
        { id: 2, name: 'Physics 201', students: 18, assignments: 3 },
        { id: 3, name: 'Computer Science 301', students: 32, assignments: 7 },
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

  const handleCreateClass = () => {
    // Navigate to create class page
    router.push('/dashboard/admin/classes/new')
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
                    Students
                  </button>
                  <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                    Analytics
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={handleCreateClass}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Class
                  </Button>
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
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-gray-400">Active this semester</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">74</div>
              <p className="text-xs text-gray-400">Across all classes</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <FileText className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-gray-400">Pending grading</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-gray-400">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Classes and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Classes Section */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Classes</CardTitle>
                    <CardDescription>Manage your active classes</CardDescription>
                  </div>
                  <Button 
                    onClick={handleCreateClass}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Class
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {classes.length > 0 ? (
                  <div className="space-y-4">
                    {classes.map((cls) => (
                      <div 
                        key={cls.id} 
                        className="p-4 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
                        onClick={() => router.push(`/dashboard/admin/classes/${cls.id}`)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{cls.name}</h3>
                            <div className="flex items-center mt-2 space-x-4">
                              <div className="flex items-center text-sm text-gray-400">
                                <Users className="w-4 h-4 mr-1" />
                                {cls.students} students
                              </div>
                              <div className="flex items-center text-sm text-gray-400">
                                <FileText className="w-4 h-4 mr-1" />
                                {cls.assignments} assignments
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-500" />
                    <h3 className="mt-2 text-sm font-medium text-gray-300">No classes yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating a new class.
                    </p>
                    <div className="mt-6">
                      <Button 
                        onClick={handleCreateClass}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Class
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-500/20">
                        <FileText className="h-4 w-4 text-purple-400" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">
                        New assignment submitted
                      </p>
                      <p className="text-sm text-gray-500">
                        Math 101 - Problem Set 3
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        2 minutes ago
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/20">
                        <Users className="h-4 w-4 text-blue-400" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">
                        New student enrolled
                      </p>
                      <p className="text-sm text-gray-500">
                        John Smith in Physics 201
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        1 hour ago
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500/20">
                        <Award className="h-4 w-4 text-green-400" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">
                        Assignment graded
                      </p>
                      <p className="text-sm text-gray-500">
                        CS 301 - Final Project
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        3 hours ago
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-yellow-500/20">
                        <Clock className="h-4 w-4 text-yellow-400" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">
                        Class meeting reminder
                      </p>
                      <p className="text-sm text-gray-500">
                        Mathematics 101 - Tomorrow 10:00 AM
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        1 day ago
                      </p>
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