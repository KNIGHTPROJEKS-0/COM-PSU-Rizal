"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckSquare, Plus, Calendar } from "lucide-react"
import { createTask } from "@/lib/taskade-actions"

interface TaskAutomationProps {
  documentId: string
  documentName: string
  documentSummary?: string
}

export function TaskAutomation({ documentId, documentName, documentSummary }: TaskAutomationProps) {
  const [open, setOpen] = useState(false)
  const [taskTitle, setTaskTitle] = useState(`Review: ${documentName}`)
  const [taskDescription, setTaskDescription] = useState(documentSummary || "")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState("medium")
  const [isCreating, setIsCreating] = useState(false)
  const [createdTasks, setCreatedTasks] = useState<{ id: string; title: string }[]>([])

  const handleCreateTask = async () => {
    setIsCreating(true)
    try {
      const result = await createTask({
        title: taskTitle,
        description: taskDescription,
        dueDate: dueDate || undefined,
        priority,
        documentId,
      })

      if (result.success) {
        setCreatedTasks((prev) => [...prev, { id: result.taskId, title: taskTitle }])
        setOpen(false)
        setTaskTitle(`Review: ${documentName}`)
        setTaskDescription(documentSummary || "")
        setDueDate("")
        setPriority("medium")
      }
    } catch (error) {
      console.error("Error creating task:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-2" />
          Task Automation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {createdTasks.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Created Tasks</h3>
              <ul className="space-y-2">
                {createdTasks.map((task) => (
                  <li key={task.id} className="flex items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                    <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-500 mr-2" />
                    <span className="text-sm">{task.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No tasks created yet. Create a task to track document reviews and updates.
            </p>
          )}

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
                <DialogDescription>Create a task for this document in Taskade</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input id="title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="w-full min-h-[100px] p-2 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="due-date"
                        type="date"
                        className="pl-10"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTask} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Task"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
