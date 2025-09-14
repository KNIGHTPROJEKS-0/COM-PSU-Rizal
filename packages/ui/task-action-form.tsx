"use client"

import { useFormStatus } from "react-dom"
import { useRef } from "react"
import { addTaskAction } from "@/lib/actions/task-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { QuadrantType } from "@/lib/types"

interface TaskActionFormProps {
  quadrant: QuadrantType
  onSuccess: () => void
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Adding..." : "Add Task"}
    </Button>
  )
}

export default function TaskActionForm({ quadrant, onSuccess }: TaskActionFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const { toast } = useToast()

  async function clientAction(formData: FormData) {
    // Add the quadrant to the form data
    formData.append("quadrant", quadrant)

    const result = await addTaskAction(formData)

    if (result.success) {
      toast({
        title: "Task added",
        description: `"${formData.get("title")}" added to quadrant`,
        duration: 2000,
      })
      formRef.current?.reset()
      onSuccess()
    } else {
      toast({
        variant: "destructive",
        title: "Error adding task",
        description: result.error || "There was a problem adding your task. Please try again.",
      })
    }
  }

  return (
    <form ref={formRef} action={clientAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input id="title" name="title" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="deadline">Deadline</Label>
        <Input id="deadline" name="deadline" type="datetime-local" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input id="tags" name="tags" placeholder="work, personal, urgent" />
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  )
}
