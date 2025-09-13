"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  MessageSquare, 
  Bell, 
  Search,
  Plus,
  Settings
} from 'lucide-react'
import { Loader2 } from 'lucide-react'

export default function SocialMediaPage() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth')
      return
    }

    if (user) {
      setLoading(false)
    }
  }, [user, isAuthenticated, isLoading])

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth')
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
                  <button 
                    onClick={() => router.push('/dashboard')}
                    className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700 hover:text-white"
                  >
                    Dashboard
                  </button>
                  <button className="px-3 py-2 rounded-md text-sm font-medium bg-gray-800 text-white">
                    Social
                  </button>
                  <button 
                    onClick={() => router.push('/dashboard/documents')}
                    className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700 hover:text-white"
                  >
                    Documents
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
          <h1 className="text-3xl font-bold text-white">Social Media Hub</h1>
          <p className="text-gray-300 mt-2">Connect, share, and engage with the COM-PSU-Rizal community.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Create Post</CardTitle>
              <Plus className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-300">Share your thoughts</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-300">Connect with peers</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-300">Stay updated</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Search</CardTitle>
              <Search className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-300">Find content</p>
            </CardContent>
          </Card>
        </div>

        {/* Social Feed Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Social Feed</CardTitle>
                <CardDescription className="text-gray-300">Latest posts from the community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                        <span className="text-white font-bold">A</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">Admin User</h4>
                        <p className="text-sm text-gray-300">2 hours ago</p>
                        <p className="mt-2 text-gray-300">Welcome to the new social media integration! Share your academic experiences and connect with fellow students.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold">S</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">Student User</h4>
                        <p className="text-sm text-gray-300">4 hours ago</p>
                        <p className="mt-2 text-gray-300">Excited about the new document management system! It's going to make organizing my assignments so much easier.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-300">Posts</span>
                    <span className="text-sm font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-300">Following</span>
                    <span className="text-sm font-medium">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-300">Followers</span>
                    <span className="text-sm font-medium">23</span>
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
