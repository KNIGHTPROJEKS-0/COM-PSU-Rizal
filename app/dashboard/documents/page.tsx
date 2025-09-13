"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  Upload, 
  Download, 
  Share2,
  Search,
  Filter,
  Plus,
  Folder,
  Clock
} from 'lucide-react'
import { Loader2 } from 'lucide-react'

export default function DocumentsPage() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth')
      return
    }

    if (user) {
      fetchDocuments()
    }
  }, [user, isAuthenticated, isLoading])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      
      // Mock documents data
      const mockDocuments = [
        { 
          id: 1, 
          name: 'Assignment 1 - Mathematics', 
          type: 'PDF', 
          size: '2.3 MB', 
          uploadedAt: '2025-09-13',
          status: 'Submitted'
        },
        { 
          id: 2, 
          name: 'Research Paper - Computer Science', 
          type: 'DOCX', 
          size: '1.8 MB', 
          uploadedAt: '2025-09-12',
          status: 'Draft'
        },
        { 
          id: 3, 
          name: 'Lab Report - Physics', 
          type: 'PDF', 
          size: '3.1 MB', 
          uploadedAt: '2025-09-11',
          status: 'Graded'
        },
        { 
          id: 4, 
          name: 'Project Proposal', 
          type: 'PPTX', 
          size: '5.2 MB', 
          uploadedAt: '2025-09-10',
          status: 'Under Review'
        }
      ]
      
      setDocuments(mockDocuments)
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth')
  }

  const handleUpload = () => {
    // Implement document upload functionality
    console.log('Upload document')
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
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => router.push('/dashboard/social')}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Social
                  </button>
                  <button className="px-3 py-2 rounded-md text-sm font-medium bg-gray-800 text-white">
                    Documents
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={handleUpload}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
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
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-gray-400 mt-2">Organize, share, and collaborate on your academic documents.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={handleUpload}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upload Document</CardTitle>
              <Upload className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-400">Add new files</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Files</CardTitle>
              <Clock className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-400">View recent</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shared</CardTitle>
              <Share2 className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-400">Collaborative docs</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Search</CardTitle>
              <Search className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-400">Find documents</p>
            </CardContent>
          </Card>
        </div>

        {/* Documents List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Documents</CardTitle>
                    <CardDescription>Manage your academic documents</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {documents.length > 0 ? (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div 
                        key={doc.id} 
                        className="p-4 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-purple-400" />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium text-lg">{doc.name}</h3>
                              <div className="flex items-center mt-1 space-x-4">
                                <span className="text-sm text-gray-400">{doc.type}</span>
                                <span className="text-sm text-gray-400">{doc.size}</span>
                                <span className="text-sm text-gray-400">{doc.uploadedAt}</span>
                              </div>
                              <div className="mt-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  doc.status === 'Submitted' ? 'bg-green-500/20 text-green-400' :
                                  doc.status === 'Draft' ? 'bg-yellow-500/20 text-yellow-400' :
                                  doc.status === 'Graded' ? 'bg-blue-500/20 text-blue-400' :
                                  'bg-purple-500/20 text-purple-400'
                                }`}>
                                  {doc.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-500" />
                    <h3 className="mt-2 text-sm font-medium text-gray-300">No documents yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by uploading your first document.
                    </p>
                    <div className="mt-6">
                      <Button 
                        onClick={handleUpload}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Storage Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Used</span>
                    <span className="text-sm font-medium">12.4 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Available</span>
                    <span className="text-sm font-medium">987.6 MB</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '1.2%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 mt-6">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-500/20">
                        <Upload className="h-4 w-4 text-purple-400" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">
                        Uploaded Assignment 1
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500/20">
                        <Share2 className="h-4 w-4 text-green-400" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">
                        Shared Research Paper
                      </p>
                      <p className="text-xs text-gray-500">1 day ago</p>
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
