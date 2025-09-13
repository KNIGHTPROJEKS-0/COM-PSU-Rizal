"use client"

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TestRolePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth')
      return
    }

    const fetchUserData = async () => {
      if (user?.id) {
        try {
          // This would normally be an API call to get user data
          console.log('User ID:', user.id)
          console.log('User Email:', user.email)
          console.log('User Role:', user.role)
          setUserData({
            id: user.id,
            email: user.email,
            role: user.role
          })
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
    }

    fetchUserData()
  }, [user, isAuthenticated, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">User Role Test</h1>
      
      {userData ? (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Current User Information</h2>
          <div className="space-y-2">
            <p><strong>User ID:</strong> {userData.id}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Role:</strong> {userData.role}</p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Role-based Navigation</h3>
            <div className="space-y-2">
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={() => router.push('/dashboard/admin')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              >
                Go to Admin Dashboard
              </button>
              <button 
                onClick={() => router.push('/dashboard/student')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Go to Student Dashboard
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  )
}