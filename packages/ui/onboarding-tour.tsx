"use client"

import { useState } from "react"
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Layout,
  ArrowDown,
  Calendar,
  Users,
  Trash2,
  PlusCircle,
  GripVertical,
  ArrowRight,
  Search,
  LayoutGrid,
  Moon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface OnboardingTourProps {
  onClose: () => void
}

export default function OnboardingTour({ onClose }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to Collaboration Online Meet",
      content:
        "This tool helps you prioritize tasks based on their urgency and importance. Let's take a quick tour to get you started.",
    },
    {
      title: "Four Quadrants of Priority",
      content:
        "The matrix is divided into four quadrants: Do First (urgent & important), Schedule (not urgent but important), Delegate (urgent but not important), and Eliminate (neither urgent nor important).",
    },
    {
      title: "Adding Tasks",
      content:
        "Click the + button in any quadrant or use the floating action button to add a new task. You can add a title, description, deadline, and tags.",
    },
    {
      title: "Managing Tasks",
      content:
        "Drag and drop tasks between quadrants to reprioritize them. Click the menu on any task to edit or delete it.",
    },
    {
      title: "Additional Features",
      content:
        "Use the search bar to find tasks, switch between grid and list views, sort tasks, and toggle between dark and light modes.",
    },
  ]

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="relative">
          <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <CardTitle>{steps[currentStep].title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="py-8 bg-muted/30 rounded-md flex flex-col items-center justify-center gap-4 border border-border">
            {currentStep === 0 && (
              <div className="text-primary h-16 w-16 flex items-center justify-center rounded-full bg-primary/10">
                <Layout className="h-8 w-8" />
              </div>
            )}
            {currentStep === 1 && (
              <div className="grid grid-cols-2 gap-2 p-2">
                <div className="h-16 w-full rounded-md bg-red-500/20 border border-red-500 flex items-center justify-center">
                  <ArrowDown className="h-6 w-6 text-red-500" />
                </div>
                <div className="h-16 w-full rounded-md bg-blue-500/20 border border-blue-500 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <div className="h-16 w-full rounded-md bg-yellow-500/20 border border-yellow-500 flex items-center justify-center">
                  <Users className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="h-16 w-full rounded-md bg-gray-500/20 border border-gray-500 flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-gray-500" />
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="flex flex-col items-center gap-2">
                <PlusCircle className="h-10 w-10 text-primary animate-pulse" />
                <div className="w-48 h-8 bg-background rounded-md border border-border flex items-center px-3 text-sm">
                  New Task
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="flex items-center gap-4">
                <div className="w-32 h-16 bg-background rounded-md border border-border flex items-center justify-center">
                  <GripVertical className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">Task</span>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <div className="w-32 h-16 bg-blue-500/20 border border-blue-500 flex items-center justify-center">
                  <span className="text-sm">Schedule</span>
                </div>
              </div>
            )}
            {currentStep === 4 && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                  <LayoutGrid className="h-6 w-6 text-muted-foreground" />
                  <Moon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="w-48 h-8 bg-background rounded-md border border-border flex items-center px-3 text-sm">
                  Search tasks...
                </div>
              </div>
            )}
          </div>

          <p>{steps[currentStep].content}</p>

          <div className="flex justify-center space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full ${index === currentStep ? "w-6 bg-primary" : "w-1.5 bg-muted"}`}
              />
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={goToPreviousStep} disabled={currentStep === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <Button onClick={goToNextStep}>
            {currentStep === steps.length - 1 ? (
              <>
                Get Started
                <Check className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
