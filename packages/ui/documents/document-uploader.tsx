"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { uploadDocument } from "@/lib/actions"

export function DocumentUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadSuccess(false)
      setUploadError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      await uploadDocument(formData)
      setUploadSuccess(true)
      setFile(null)
    } catch (error) {
      console.error("Error uploading document:", error)
      setUploadError("Failed to upload document. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-full">
            <Upload className="h-8 w-8 text-blue-600 dark:text-blue-500" />
          </div>

          <h3 className="text-xl font-semibold mb-2">Upload Document</h3>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-6 max-w-md">
            Upload your documents for AI-powered analysis, summarization, and insights.
          </p>

          {uploadError && (
            <Alert variant="destructive" className="mb-4 w-full max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          <div className="w-full max-w-md">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center mb-4">
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  <span className="font-medium truncate max-w-[250px]">{file.name}</span>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Drag and drop your file here, or click to browse
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </label>
                </div>
              )}
            </div>

            {file && (
              <Button className="w-full" onClick={handleUpload} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Document"
                )}
              </Button>
            )}

            {uploadSuccess && (
              <p className="text-green-600 dark:text-green-500 text-sm mt-2 text-center">
                Document uploaded successfully!
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
