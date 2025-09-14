"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"
import type { QuadrantType } from "./eisenhower-matrix"

interface QuickAddTaskProps {
  onAddTask: (title: string, quadrant: QuadrantType) => void
}

export default function QuickAddTask({ onAddTask }: QuickAddTaskProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [quadrant, setQuadrant] = useState<QuadrantType>("urgent-important")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAddTask(title.trim(), quadrant)
      setTitle("")
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Quick Add
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px]" align="end">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <h4 className="font-medium">Quick Add Task</h4>
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              autoFocus
            />
            <RadioGroup value={quadrant} onValueChange={(value) => setQuadrant(value as QuadrantType)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent-important" id="q1" />
                <Label htmlFor="q1" className="text-red-500">
                  Do First
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not-urgent-important" id="q2" />
                <Label htmlFor="q2" className="text-blue-500">
                  Schedule
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent-not-important" id="q3" />
                <Label htmlFor="q3" className="text-yellow-500">
                  Delegate
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not-urgent-not-important" id="q4" />
                <Label htmlFor="q4" className="text-gray-500">
                  Eliminate
                </Label>
              </div>
            </RadioGroup>
            <div className="flex justify-end">
              <Button type="submit" disabled={!title.trim()}>
                Add Task
              </Button>
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
