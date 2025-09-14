"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Copy, Check, AlertCircle } from "lucide-react"
import type { Task, QuadrantType } from "./eisenhower-matrix"

interface ImportExportProps {
  tasks: Record<QuadrantType, Task[]>
  onImport: (tasks: Record<QuadrantType, Task[]>) => void
}

export default function ImportExport({ tasks, onImport }: ImportExportProps) {
  const [open, setOpen] = useState(false)
  const [importData, setImportData] = useState("")
  const [copied, setCopied] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)

  const handleExport = () => {
    // Convert dates to ISO strings for export
    const exportTasks = Object.entries(tasks).reduce(
      (acc, [quadrant, quadrantTasks]) => {
        acc[quadrant] = quadrantTasks.map((task) => ({
          ...task,
          deadline: task.deadline ? task.deadline.toISOString() : undefined,
          createdAt: task.createdAt.toISOString(),
        }))
        return acc
      },
      {} as Record<string, any[]>,
    )

    return JSON.stringify(exportTasks, null, 2)
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(handleExport())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(handleExport())
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "eisenhower-matrix-tasks.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const handleImport = () => {
    try {
      setImportError(null)
      setImportSuccess(false)

      if (!importData.trim()) {
        setImportError("Please enter data to import")
        return
      }

      const parsedData = JSON.parse(importData)

      // Validate structure
      if (!parsedData || typeof parsedData !== "object") {
        setImportError("Invalid data format")
        return
      }

      const validQuadrants: QuadrantType[] = [
        "urgent-important",
        "not-urgent-important",
        "urgent-not-important",
        "not-urgent-not-important",
      ]

      // Check if all required quadrants exist
      for (const quadrant of validQuadrants) {
        if (!parsedData[quadrant] || !Array.isArray(parsedData[quadrant])) {
          setImportError(`Missing or invalid quadrant: ${quadrant}`)
          return
        }
      }

      // Convert the imported data to the correct format with Date objects
      const importedTasks = Object.entries(parsedData).reduce(
        (acc, [quadrant, quadrantTasks]) => {
          if (validQuadrants.includes(quadrant as QuadrantType)) {
            acc[quadrant as QuadrantType] = (quadrantTasks as any[]).map((task) => ({
              ...task,
              deadline: task.deadline ? new Date(task.deadline) : undefined,
              createdAt: new Date(task.createdAt),
              tags: task.tags || [],
            }))
          }
          return acc
        },
        {} as Record<QuadrantType, Task[]>,
      )

      onImport(importedTasks)
      setImportSuccess(true)
      setImportData("")
    } catch (error) {
      setImportError("Invalid JSON format. Please check your data.")
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" className="gap-1" onClick={() => setOpen(true)}>
        <Download className="h-4 w-4" />
        Import/Export
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Import/Export Tasks</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="export">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="export">Export</TabsTrigger>
              <TabsTrigger value="import">Import</TabsTrigger>
            </TabsList>

            <TabsContent value="export" className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Export your tasks as JSON to back them up or transfer to another device.
              </div>

              <div className="flex gap-2">
                <Button onClick={handleDownload} className="gap-1">
                  <Download className="h-4 w-4" />
                  Download JSON
                </Button>

                <Button variant="outline" onClick={handleCopyToClipboard} className="gap-1">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
              </div>

              <Textarea readOnly value={handleExport()} className="font-mono text-xs h-[200px]" />
            </TabsContent>

            <TabsContent value="import" className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Import tasks from a JSON file. This will merge with your existing tasks.
              </div>

              {importError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{importError}</AlertDescription>
                </Alert>
              )}

              {importSuccess && (
                <Alert
                  variant="default"
                  className="bg-green-500/10 border-green-500 text-green-700 dark:text-green-400"
                >
                  <Check className="h-4 w-4" />
                  <AlertDescription>Tasks imported successfully!</AlertDescription>
                </Alert>
              )}

              <Textarea
                placeholder="Paste your JSON data here..."
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                className="font-mono text-xs h-[200px]"
              />

              <Button onClick={handleImport} className="gap-1">
                <Upload className="h-4 w-4" />
                Import Tasks
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
