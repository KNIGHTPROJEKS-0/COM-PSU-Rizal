"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Focus } from "lucide-react"
import type { QuadrantType } from "./eisenhower-matrix"
import MatrixQuadrant from "./matrix-quadrant"

interface FocusModeProps {
  tasks: Record<QuadrantType, any[]>
  onAddTask: (quadrant: QuadrantType) => void
  onEditTask: (task: any, quadrant: QuadrantType) => void
  onDeleteTask: (taskId: string, quadrant: QuadrantType) => void
}

export default function FocusMode({ tasks, onAddTask, onEditTask, onDeleteTask }: FocusModeProps) {
  const [open, setOpen] = useState(false)
  const [activeQuadrant, setActiveQuadrant] = useState<QuadrantType>("urgent-important")

  const quadrantInfo = {
    "urgent-important": {
      title: "Do First",
      description: "Urgent & Important",
      color: "bg-red-500/20 border-red-500",
      iconColor: "text-red-500",
      tips: [
        "Do these tasks as soon as possible",
        "These are critical activities",
        "They require immediate attention",
        "Often these are crises or deadlines",
      ],
    },
    "not-urgent-important": {
      title: "Schedule",
      description: "Not Urgent & Important",
      color: "bg-blue-500/20 border-blue-500",
      iconColor: "text-blue-500",
      tips: [
        "Schedule time to do these tasks",
        "These contribute to long-term goals",
        "Plan ahead to prevent these becoming urgent",
        "Focus on these for personal growth",
      ],
    },
    "urgent-not-important": {
      title: "Delegate",
      description: "Urgent & Not Important",
      color: "bg-yellow-500/20 border-yellow-500",
      iconColor: "text-yellow-500",
      tips: [
        "Delegate these tasks if possible",
        "These are interruptions and distractions",
        "Minimize time spent on these",
        "Can you automate or simplify these?",
      ],
    },
    "not-urgent-not-important": {
      title: "Eliminate",
      description: "Not Urgent & Not Important",
      color: "bg-gray-500/20 border-gray-500",
      iconColor: "text-gray-500",
      tips: [
        "Eliminate these tasks when possible",
        "These are time-wasters",
        "Say no to these activities",
        "Be mindful of how much time you spend here",
      ],
    },
  }

  return (
    <>
      <Button variant="outline" size="sm" className="gap-1" onClick={() => setOpen(true)}>
        <Focus className="h-4 w-4" />
        Focus Mode
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Focus className="h-5 w-5" />
              Focus Mode: {quadrantInfo[activeQuadrant].title}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <Tabs
            defaultValue="urgent-important"
            value={activeQuadrant}
            onValueChange={(value) => setActiveQuadrant(value as QuadrantType)}
            className="flex-1 flex flex-col"
          >
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="urgent-important" className="text-red-500">
                Do First
              </TabsTrigger>
              <TabsTrigger value="not-urgent-important" className="text-blue-500">
                Schedule
              </TabsTrigger>
              <TabsTrigger value="urgent-not-important" className="text-yellow-500">
                Delegate
              </TabsTrigger>
              <TabsTrigger value="not-urgent-not-important" className="text-gray-500">
                Eliminate
              </TabsTrigger>
            </TabsList>

            {Object.entries(quadrantInfo).map(([quadrant, info]) => (
              <TabsContent key={quadrant} value={quadrant} className="flex-1 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                  <div className="md:col-span-2 flex flex-col">
                    <MatrixQuadrant
                      id={quadrant}
                      title={info.title}
                      description={info.description}
                      tasks={tasks[quadrant as QuadrantType]}
                      onAddTask={() => onAddTask(quadrant as QuadrantType)}
                      onEditTask={(task) => onEditTask(task, quadrant as QuadrantType)}
                      onDeleteTask={(taskId) => onDeleteTask(taskId, quadrant as QuadrantType)}
                      color={info.color}
                      iconColor={info.iconColor}
                      viewMode="list"
                    />
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <h3 className="font-medium mb-3">Tips for {info.title}</h3>
                    <ul className="space-y-2">
                      {info.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className={`${info.iconColor} mt-1`}>•</div>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
