"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbulb, Edit, Loader2, AlertCircle } from "lucide-react"
import { extractKeyInsights, suggestEdits } from "@/lib/ai"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DocumentInsightsProps {
  documentId: string
  documentContent: string
}

export function DocumentInsights({ documentId, documentContent }: DocumentInsightsProps) {
  const [activeTab, setActiveTab] = useState("insights")
  const [insights, setInsights] = useState<string[]>([])
  const [edits, setEdits] = useState<string>("")
  const [loading, setLoading] = useState({
    insights: false,
    edits: false,
  })
  const [error, setError] = useState({
    insights: false,
    edits: false,
  })

  useEffect(() => {
    const loadInsights = async () => {
      if (insights.length === 0 && !loading.insights) {
        setLoading((prev) => ({ ...prev, insights: true }))
        setError((prev) => ({ ...prev, insights: false }))
        try {
          const result = await extractKeyInsights(documentContent)
          setInsights(result)
        } catch (error) {
          console.error("Error loading insights:", error)
          setError((prev) => ({ ...prev, insights: true }))
        } finally {
          setLoading((prev) => ({ ...prev, insights: false }))
        }
      }
    }

    if (activeTab === "insights") {
      loadInsights()
    }
  }, [activeTab, documentContent, insights, loading.insights])

  useEffect(() => {
    const loadEdits = async () => {
      if (!edits && !loading.edits && activeTab === "edits") {
        setLoading((prev) => ({ ...prev, edits: true }))
        setError((prev) => ({ ...prev, edits: false }))
        try {
          const result = await suggestEdits(documentContent)
          setEdits(result)
        } catch (error) {
          console.error("Error loading edits:", error)
          setError((prev) => ({ ...prev, edits: true }))
        } finally {
          setLoading((prev) => ({ ...prev, edits: false }))
        }
      }
    }

    if (activeTab === "edits") {
      loadEdits()
    }
  }, [activeTab, documentContent, edits, loading.edits])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-2" />
          AI Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="insights">Key Insights</TabsTrigger>
            <TabsTrigger value="edits">Suggested Edits</TabsTrigger>
          </TabsList>

          <TabsContent value="insights">
            {loading.insights ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-500" />
              </div>
            ) : error.insights ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Failed to load insights. Please try again later.</AlertDescription>
              </Alert>
            ) : (
              <ul className="space-y-3">
                {insights.map((insight, index) => (
                  <li key={index} className="flex">
                    <span className="text-blue-600 dark:text-blue-500 font-bold mr-2">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="edits">
            {loading.edits ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-500" />
              </div>
            ) : error.edits ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Failed to load edit suggestions. Please try again later.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start">
                  <Edit className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-2">Suggested Improvements</h3>
                    <div className="text-sm whitespace-pre-wrap">{edits}</div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
