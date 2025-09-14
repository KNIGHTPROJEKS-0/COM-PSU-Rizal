"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useQuadrantInfo } from "@/hooks/use-quadrant-info"
import type { Task, QuadrantType, TaskFormValues } from "@/lib/types"

interface TaskFormProps {
  onSubmit: (task: TaskFormValues) => void
  initialValues?: Task
  quadrant: QuadrantType
}

export default function TaskForm({ onSubmit, initialValues, quadrant }: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title || "")
  const [description, setDescription] = useState(initialValues?.description || "")
  const [deadline, setDeadline] = useState<string>(
    initialValues?.deadline
      ? new Date(initialValues.deadline.getTime() - initialValues.deadline.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16)
      : "",
  )
  const [tags, setTags] = useState<string[]>(initialValues?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [deadlineError, setDeadlineError] = useState<string | null>(null)

  const { getQuadrantTitle, getQuadrantIconColor } = useQuadrantInfo()

  // Validate deadline is in the future when set
  useEffect(() => {
    if (deadline) {
      const deadlineDate = new Date(deadline)
      const now = new Date()
      if (deadlineDate < now) {
        setDeadlineError("Deadline should be in the future")
      } else {
        setDeadlineError(null)
      }
    } else {
      setDeadlineError(null)
    }
  }, [deadline])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate title
    if (!title.trim()) {
      setError("Task title is required")
      return
    }

    // Validate description length
    if (description.length > 500) {
      setError("Description is too long (maximum 500 characters)")
      return
    }

    // Additional deadline validation
    if (deadline && deadlineError) {
      return
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline: deadline ? new Date(deadline) : undefined,
      tags,
    })

    // Reset form if not editing
    if (!initialValues) {
      setTitle("")
      setDescription("")
      setDeadline("")
      setTags([])
      setNewTag("")
    }
  }

  const addTag = () => {
    // Validate tag
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      if (tags.length >= 10) {
        setError("Maximum 10 tags allowed")
        return
      }

      if (newTag.length > 20) {
        setError("Tag is too long (maximum 20 characters)")
        return
      }

      setTags([...tags, newTag.trim()])
      setNewTag("")
      setError(null)
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault()
      addTag()
    }
  }

  // Get quadrant-specific color
  const quadrantColor = getQuadrantIconColor(quadrant)

  // Character count for description
  const descriptionCharCount = description.length
  const isDescriptionLong = descriptionCharCount > 400

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <div className={`h-3 w-3 rounded-full ${quadrantColor.replace("text-", "bg-")}`} />
          <span className={`text-sm font-medium ${quadrantColor}`}>{getQuadrantTitle(quadrant)}</span>
        </div>

        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
          </Alert>
        )}

        <Label htmlFor="title" className="text-sm">
          Task Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          className="focus-visible:ring-offset-2 bg-background text-foreground text-sm sm:text-base"
          autoFocus
          maxLength={100}
        />
        <div className="text-xs text-muted-foreground text-right">{title.length}/100</div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="description" className="text-sm">
          Description (Optional)
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about this task"
          rows={3}
          className="focus-visible:ring-offset-2 bg-background text-foreground text-sm sm:text-base"
          maxLength={500}
        />
        <div className={`text-xs ${isDescriptionLong ? "text-orange-500" : "text-muted-foreground"} text-right`}>
          {descriptionCharCount}/500
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="deadline" className="text-sm">
          Deadline (Optional)
        </Label>
        <Input
          id="deadline"
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="focus-visible:ring-offset-2 bg-background text-foreground text-sm sm:text-base"
        />
        {deadlineError && <p className="text-xs text-destructive mt-1">{deadlineError}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="tags" className="text-sm">
          Tags (Optional)
        </Label>
        <div className="flex gap-2">
          <Input
            id="tags"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add tags"
            className="focus-visible:ring-offset-2 bg-background text-foreground text-sm sm:text-base"
            maxLength={20}
          />
          <Button type="button" variant="outline" size="icon" onClick={addTag} disabled={!newTag.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Up to 10 tags, max 20 characters each</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1 px-2 py-1 text-xs">
                <span className="truncate max-w-[150px]">{tag}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTag(tag)}
                  className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {tag}</span>
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={!title.trim() || !!deadlineError} className="text-sm">
          {initialValues ? "Update Task" : "Add Task"}
        </Button>
      </div>
    </form>
  )
}
