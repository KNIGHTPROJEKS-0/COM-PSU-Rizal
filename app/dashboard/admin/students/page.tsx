"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  Search,
  Mail,
  Phone,
  Calendar,
  UserCheck,
  UserX,
  MessageSquare,
  ShieldCheck,
  FileCheck
} from 'lucide-react'
import { Loader2, Clock, XCircle } from 'lucide-react'

export default function StudentManagementPage() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const router = useRouter()
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [verificationStatus, setVerificationStatus] = useState<Record<string, string>>({})

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

    // Allow only faculty and admin users
    if (user && (user.role === 'faculty' || user.role === 'admin')) {
      fetchData()
    }
  }, [user, isAuthenticated, isLoading])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Simulate fetching data
      // In a real implementation, you would fetch actual data from your API
      const mockStudents = [
        { id: 1, name: 'John Smith', email: 'john.smith@psu.edu', phone: '+1 (555) 123-4567', enrollmentDate: '2023-09-01', status: 'active', classes: 3 },
        { id: 2, name: 'Emily Johnson', email: 'emily.johnson@psu.edu', phone: '+1 (555) 234-5678', enrollmentDate: '2023-09-01', status: 'active', classes: 2 },
        { id: 3, name: 'Michael Brown', email: 'michael.brown@psu.edu', phone: '+1 (555) 345-6789', enrollmentDate: '2023-09-01', status: 'inactive', classes: 1 },
        { id: 4, name: 'Sarah Davis', email: 'sarah.davis@psu.edu', phone: '+1 (555) 456-7890', enrollmentDate: '2023-09-15', status: 'active', classes: 4 },
        { id: 5, name: 'David Wilson', email: 'david.wilson@psu.edu', phone: '+1 (555) 567-8901', enrollmentDate: '2023-09-15', status: 'active', classes: 3 },
      ]
      
      setStudents(mockStudents)
      
      // Mock verification statuses - in a real implementation, fetch from student_verification table
      setVerificationStatus({
        '1': 'verified',
        '2': 'pending',
        '3': 'rejected',
        '4': 'verified',
        '5': 'pending'
      })
    } catch (error) {
      console.error('Error fetching student data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth')
  }

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                  <button 
                    onClick={() => router.push('/dashboard/admin')}
                    className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700 hover:text-white"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => router.push('/dashboard/admin/classes')}
                    className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700 hover:text-white"
                  >
                    Classes
                  </button>
                  <button className="px-3 py-2 rounded-md text-sm font-medium bg-gray-800 text-white">
                    Students
                  </button>
                  <button 
                    onClick={() => router.push('/dashboard/social')}
                    className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700 hover:text-white"
                  >
                    Social
                  </button>
                  <button 
                    onClick={() => router.push('/dashboard/documents')}
                    className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700 hover:text-white"
                  >
                    Documents
                  </button>
                  <button className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700 hover:text-white">
                    Analytics
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={() => router.push('/dashboard/social')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Students
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
          <h1 className="text-3xl font-bold text-white">Student Management</h1>
          <p className="text-gray-300 mt-2">Manage and interact with your students</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Students</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-gray-300">Across all classes</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Students</CardTitle>
              <UserCheck className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">138</div>
              <p className="text-xs text-gray-300">Currently enrolled</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Inactive Students</CardTitle>
              <UserX className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-gray-300">On leave or graduated</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">New This Month</CardTitle>
              <Calendar className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-300">Recently enrolled</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="border-gray-700 text-white hover:bg-gray-800 flex items-center"
                onClick={() => router.push('/dashboard/admin/students/verification')}
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                Verification Requests
              </Button>
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                Export Data
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Add Student
              </Button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Student Directory</CardTitle>
            <CardDescription className="text-gray-300">Manage your students and their information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Enrollment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Verification
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Classes
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                              <span className="text-white font-medium">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{student.name}</div>
                            <div className="text-sm text-gray-300">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {student.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(student.enrollmentDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.status === 'active' 
                            ? 'bg-green-900/50 text-green-400' 
                            : 'bg-red-900/50 text-red-400'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {verificationStatus[student.id] && (
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            verificationStatus[student.id] === 'verified' 
                              ? 'bg-blue-900/50 text-blue-400' 
                              : verificationStatus[student.id] === 'pending'
                                ? 'bg-yellow-900/50 text-yellow-400'
                                : 'bg-red-900/50 text-red-400'
                          }`}>
                            <span className="flex items-center">
                              {verificationStatus[student.id] === 'verified' && <ShieldCheck className="h-3 w-3 mr-1" />}
                              {verificationStatus[student.id] === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                              {verificationStatus[student.id] === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                              {verificationStatus[student.id]}
                            </span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {student.classes} classes
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                            onClick={() => router.push(`/dashboard/social?to=${student.id}`)}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          >
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}