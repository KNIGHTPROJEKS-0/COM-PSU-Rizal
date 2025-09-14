"use client"

import { useState, useEffect } from "react"
import { FileText, Search, Eye, Download, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getDocuments, deleteDocument } from "@/lib/actions"
import type { Document } from "@/lib/types"

export function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await getDocuments()
        setDocuments(
          docs.map((doc) => ({
            ...doc,
            url: "/placeholder.svg?height=400&width=300", // Ensure consistent placeholder URL
          })),
        )
      } catch (error) {
        console.error("Error fetching documents:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id)
      setDocuments(documents.filter((doc) => doc.id !== id))
    } catch (error) {
      console.error("Error deleting document:", error)
    }
  }

  const filteredDocuments = documents.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
          <div className="h-32 w-full max-w-2xl bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search documents..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredDocuments.length === 0 ? (
        <Card className="bg-slate-50 dark:bg-slate-900 border border-dashed">
          <CardContent className="py-8 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              {searchQuery ? "No documents match your search" : "No documents uploaded yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-2" />
                    <span className="font-medium truncate max-w-[180px]">{doc.name}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <span className="sr-only">Open menu</span>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                        >
                          <path
                            d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center">
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <Download className="mr-2 h-4 w-4" />
                        <span>Download</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center text-red-600 dark:text-red-500"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="p-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  {doc.summary && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium mb-1">Summary</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{doc.summary}</p>
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
