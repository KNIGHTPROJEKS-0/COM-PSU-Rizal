'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabaseClient'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Upload, FileCheck, AlertCircle, CheckCircle, Clock } from 'lucide-react'

export default function StudentVerificationPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  
  const [file, setFile] = useState<File | null>(null)
  const [notes, setNotes] = useState('')
  const [uploading, setUploading] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth')
      return
    }

    if (!isLoading && isAuthenticated && user?.role !== 'student') {
      router.push('/dashboard')
      return
    }

    // Fetch current verification status
    if (user?.id) {
      fetchVerificationStatus()
    }
  }, [isLoading, isAuthenticated, user, router])

  const fetchVerificationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('student_verification')
        .select('status, document_url, notes')
        .eq('student_id', user?.id)
        .single()

      if (error) {
        console.error('Error fetching verification status:', error)
        return
      }

      if (data) {
        setVerificationStatus(data.status)
        if (data.notes) {
          setNotes(data.notes)
        }
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      setError('Please select a file to upload')
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Upload the file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('verification')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('verification')
        .getPublicUrl(filePath)

      // Update the verification record
      const { error: updateError } = await supabase
        .from('student_verification')
        .update({
          document_url: publicUrlData.publicUrl,
          status: 'pending',
          notes: notes || 'Document submitted for verification',
          updated_at: new Date().toISOString()
        })
        .eq('student_id', user?.id)

      if (updateError) {
        throw updateError
      }

      setSuccess('Your verification document has been uploaded successfully')
      setVerificationStatus('pending')
      setFile(null)
    } catch (error: any) {
      console.error('Error uploading document:', error)
      setError(error.message || 'An error occurred while uploading your document')
    } finally {
      setUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Student Verification</h1>
      
      {verificationStatus && (
        <Alert className={`mb-6 ${
          verificationStatus === 'verified' ? 'bg-blue-900/20 border-blue-800' :
          verificationStatus === 'pending' ? 'bg-yellow-900/20 border-yellow-800' :
          'bg-red-900/20 border-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {verificationStatus === 'verified' && <CheckCircle className="h-5 w-5 text-blue-500" />}
            {verificationStatus === 'pending' && <Clock className="h-5 w-5 text-yellow-500" />}
            {verificationStatus === 'rejected' && <AlertCircle className="h-5 w-5 text-red-500" />}
            <AlertTitle className="text-white">
              {verificationStatus === 'verified' ? 'Verified' :
               verificationStatus === 'pending' ? 'Pending Verification' :
               'Verification Rejected'}
            </AlertTitle>
          </div>
          <AlertDescription>
            {verificationStatus === 'verified' ? 
              'Your student status has been verified. You have full access to all student features.' :
             verificationStatus === 'pending' ? 
              'Your verification is pending review by an administrator. Some features may be limited until verification is complete.' :
              'Your verification has been rejected. Please submit new documentation or contact support for assistance.'}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-6 bg-red-900/20 border-red-800">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-900/20 border-green-800">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Submit Verification Document</CardTitle>
          <CardDescription>
            Please upload a document that verifies your student status (student ID, enrollment letter, etc.)
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="document">Verification Document</Label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors">
                <input
                  id="document"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                />
                <label htmlFor="document" className="cursor-pointer flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 mb-2 text-gray-400" />
                  <span className="text-sm font-medium">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PDF, JPG, PNG (max. 10MB)
                  </span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional information about your document"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full"
              disabled={uploading || !file || verificationStatus === 'verified'}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <FileCheck className="h-4 w-4 mr-2" />
                  Submit for Verification
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}