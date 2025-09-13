'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Icons
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  FileText,
  User,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react'

interface StudentVerification {
  id: string
  student_id: string
  status: 'pending' | 'verified' | 'rejected'
  document_url: string | null
  notes: string | null
  submitted_at: string
  verified_at: string | null
  verified_by: string | null
  student: {
    id: string
    email: string
    first_name: string
    last_name: string
    phone: string | null
    created_at: string
  } | null
}

export default function StudentVerificationPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  
  const [verifications, setVerifications] = useState<StudentVerification[]>([])
  const [filteredVerifications, setFilteredVerifications] = useState<StudentVerification[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selectedVerification, setSelectedVerification] = useState<StudentVerification | null>(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth')
        return
      }

      if (user?.role === 'student') {
        router.push('/dashboard/student')
        return
      }

      fetchVerifications()
    }
  }, [isAuthenticated, isLoading, user, router])

  useEffect(() => {
    let filtered = [...verifications]
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(v => v.status === statusFilter)
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(v => {
        const fullName = `${v.student?.first_name} ${v.student?.last_name}`.toLowerCase()
        const email = v.student?.email.toLowerCase() || ''
        return fullName.includes(term) || email.includes(term)
      })
    }
    
    setFilteredVerifications(filtered)
  }, [verifications, searchTerm, statusFilter])

  const fetchVerifications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('student_verification')
        .select(`
          *,
          student:student_id(id, email, first_name, last_name, phone, created_at)
        `)
        .order('submitted_at', { ascending: false })

      if (error) throw error
      
      setVerifications(data || [])
    } catch (error) {
      console.error('Error fetching verifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateVerificationStatus = async (id: string, status: 'verified' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('student_verification')
        .update({
          status,
          notes: notes || null,
          verified_at: new Date().toISOString(),
          verified_by: user?.id
        })
        .eq('id', id)

      if (error) throw error
      
      // Update local state
      setVerifications(prev => 
        prev.map(v => v.id === id ? {
          ...v,
          status,
          notes: notes || null,
          verified_at: new Date().toISOString(),
          verified_by: user?.id
        } : v)
      )
      
      setSelectedVerification(null)
      setNotes('')
    } catch (error) {
      console.error('Error updating verification status:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>
      case 'verified':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20"><CheckCircle className="w-3 h-3 mr-1" /> Verified</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (loading && verifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (selectedVerification) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => {
            setSelectedVerification(null)
            setNotes('')
          }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Verifications
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Student Verification Details</CardTitle>
                    <CardDescription>Review student verification documents</CardDescription>
                  </div>
                  {getStatusBadge(selectedVerification.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-shrink-0 h-16 w-16">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                        <span className="text-white text-xl font-medium">
                          {selectedVerification.student?.first_name?.[0]}{selectedVerification.student?.last_name?.[0]}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {selectedVerification.student?.first_name} {selectedVerification.student?.last_name}
                      </h3>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {selectedVerification.student?.email}
                        </div>
                        {selectedVerification.student?.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {selectedVerification.student?.phone}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Joined {new Date(selectedVerification.student?.created_at || '').toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-sm font-medium mb-2">Verification Document</h4>
                    {selectedVerification.document_url ? (
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-blue-500" />
                        <a 
                          href={selectedVerification.document_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center"
                        >
                          View Document <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No document uploaded</p>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-sm font-medium mb-2">Submission Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Submitted</p>
                        <p>{new Date(selectedVerification.submitted_at).toLocaleString()}</p>
                      </div>
                      {selectedVerification.verified_at && (
                        <div>
                          <p className="text-gray-400">Verified/Rejected</p>
                          <p>{new Date(selectedVerification.verified_at).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedVerification.notes && (
                    <div className="border-t border-gray-700 pt-4">
                      <h4 className="text-sm font-medium mb-2">Notes</h4>
                      <p className="text-sm">{selectedVerification.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Verification Action</CardTitle>
                <CardDescription>Approve or reject this verification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium mb-1">Notes (Optional)</label>
                    <textarea
                      id="notes"
                      rows={4}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm"
                      placeholder="Add notes about this verification"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      disabled={selectedVerification.status !== 'pending'}
                    />
                  </div>
                  
                  {selectedVerification.status === 'pending' ? (
                    <div className="flex flex-col space-y-2">
                      <Button 
                        className="bg-green-600 hover:bg-green-700 text-white w-full"
                        onClick={() => updateVerificationStatus(selectedVerification.id, 'verified')}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Verify Student
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => updateVerificationStatus(selectedVerification.id, 'rejected')}
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Reject Verification
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-sm text-gray-400">
                        This verification has already been {selectedVerification.status}.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Student Verification</h1>
            <p className="text-gray-400">Verify student identities and documents</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard/admin/students')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Students
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Student Verifications</CardTitle>
                <CardDescription>Review and manage student verification requests</CardDescription>
              </div>
              
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search students..."
                    className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  onClick={fetchVerifications}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4">Student</th>
                        <th className="text-left py-3 px-4">Submitted</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Document</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredVerifications.length > 0 ? (
                        filteredVerifications.map((verification) => (
                          <tr key={verification.id} className="hover:bg-gray-800/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8">
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                                    <span className="text-white text-xs font-medium">
                                      {verification.student?.first_name?.[0]}{verification.student?.last_name?.[0]}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-3">
                                  <p className="font-medium">{verification.student?.first_name} {verification.student?.last_name}</p>
                                  <p className="text-gray-400 text-xs">{verification.student?.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-300">
                              {new Date(verification.submitted_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              {getStatusBadge(verification.status)}
                            </td>
                            <td className="py-3 px-4">
                              {verification.document_url ? (
                                <a 
                                  href={verification.document_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline flex items-center"
                                >
                                  <FileText className="w-4 h-4 mr-1" /> View
                                </a>
                              ) : (
                                <span className="text-gray-400">None</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedVerification(verification)}
                              >
                                Review
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-400">
                            {loading ? (
                              <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500 mr-2"></div>
                                Loading verifications...
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <User className="h-8 w-8 mb-2 text-gray-500" />
                                No verification requests found
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="grid">
                {filteredVerifications.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredVerifications.map((verification) => (
                      <Card key={verification.id} className="overflow-hidden hover:border-gray-600 cursor-pointer transition-all"
                        onClick={() => setSelectedVerification(verification)}
                      >
                        <CardContent className="p-0">
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                                    <span className="text-white font-medium">
                                      {verification.student?.first_name?.[0]}{verification.student?.last_name?.[0]}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-3">
                                  <p className="font-medium">{verification.student?.first_name} {verification.student?.last_name}</p>
                                  <p className="text-gray-400 text-xs">{verification.student?.email}</p>
                                </div>
                              </div>
                              {getStatusBadge(verification.status)}
                            </div>
                            
                            <div className="text-xs text-gray-400 flex items-center mb-2">
                              <Calendar className="w-3 h-3 mr-1" />
                              Submitted {new Date(verification.submitted_at).toLocaleDateString()}
                            </div>
                            
                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700">
                              {verification.document_url ? (
                                <a 
                                  href={verification.document_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline flex items-center text-xs"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <FileText className="w-3 h-3 mr-1" /> View Document
                                </a>
                              ) : (
                                <span className="text-gray-400 text-xs">No document</span>
                              )}
                              
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="text-xs h-7"
                              >
                                Review
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-400">
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500 mr-2"></div>
                        Loading verifications...
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <User className="h-12 w-12 mb-2 text-gray-500" />
                        <p>No verification requests found</p>
                        <p className="text-sm mt-1">When students submit verification documents, they will appear here</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}