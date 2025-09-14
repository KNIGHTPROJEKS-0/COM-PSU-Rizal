import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Task, QuadrantType } from "../types"
import { toast } from "@/hooks/use-toast"

// Helper function to ensure dates are properly converted
const ensureDateProperties = (task: any): Task => {
  return {
    ...task,
    createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
    deadline: task.deadline ? new Date(task.deadline) : undefined,
    tags: task.tags || [],
  }
}

interface TaskState {
  tasks: Record<QuadrantType, Task[]>
  addTask: (task: Omit<Task, "id" | "createdAt">, quadrant: QuadrantType) => Task
  editTask: (task: Task, quadrant: QuadrantType) => void
  deleteTask: (taskId: string, quadrant: QuadrantType) => Task | undefined
  moveTask: (taskId: string, source: QuadrantType, destination: QuadrantType, index: number) => void
  importTasks: (importedTasks: Record<QuadrantType, Task[]>) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: {
        "urgent-important": [],
        "not-urgent-important": [],
        "urgent-not-important": [],
        "not-urgent-not-important": [],
      },

      addTask: (task, quadrant) => {
        try {
          const newTask: Task = {
            ...task,
            id: Date.now().toString(),
            createdAt: new Date(),
            tags: task.tags || [],
          }

          set((state) => ({
            tasks: {
              ...state.tasks,
              [quadrant]: [...state.tasks[quadrant], newTask],
            },
          }))

          return newTask
        } catch (error) {
          console.error("Error adding task:", error)
          toast({
            variant: "destructive",
            title: "Error adding task",
            description: "There was a problem adding your task. Please try again.",
          })
          throw error
        }
      },

      editTask: (task, quadrant) => {
        try {
          set((state) => ({
            tasks: {
              ...state.tasks,
              [quadrant]: state.tasks[quadrant].map((t) => (t.id === task.id ? ensureDateProperties(task) : t)),
            },
          }))
        } catch (error) {
          console.error("Error updating task:", error)
          toast({
            variant: "destructive",
            title: "Error updating task",
            description: "There was a problem updating your task. Please try again.",
          })
          throw error
        }
      },

      deleteTask: (taskId, quadrant) => {
        try {
          const taskToDelete = get().tasks[quadrant]?.find((task) => task.id === taskId)

          set((state) => ({
            tasks: {
              ...state.tasks,
              [quadrant]: state.tasks[quadrant].filter((task) => task.id !== taskId),
            },
          }))

          return taskToDelete
        } catch (error) {
          console.error("Error deleting task:", error)
          toast({
            variant: "destructive",
            title: "Error deleting task",
            description: "There was a problem deleting your task. Please try again.",
          })
          throw error
        }
      },

      moveTask: (taskId, source, destination, index) => {
        try {
          // Create a deep copy of the current state to avoid mutation issues
          const currentTasks = JSON.parse(JSON.stringify(get().tasks))

          // Find the task in the source quadrant
          const sourceTaskIndex = currentTasks[source].findIndex((task: Task) => task.id === taskId)

          // If task not found, exit early
          if (sourceTaskIndex === -1) {
            console.error(`Task with ID ${taskId} not found in ${source} quadrant`)
            return
          }

          // Remove the task from the source quadrant
          const [movedTask] = currentTasks[source].splice(sourceTaskIndex, 1)

          // Ensure the destination index is valid
          const safeIndex = Math.min(Math.max(0, index), currentTasks[destination].length)

          // Ensure dates are properly converted before adding to destination
          const taskWithProperDates = ensureDateProperties(movedTask)

          // Add the task to the destination quadrant at the specified index
          currentTasks[destination].splice(safeIndex, 0, taskWithProperDates)

          // Update the state with the new task arrangement
          set({ tasks: currentTasks })

          // Log the move for debugging
          console.log(`Moved task ${taskId} from ${source} to ${destination} at index ${safeIndex}`)
        } catch (error) {
          console.error("Error moving task:", error)
          toast({
            variant: "destructive",
            title: "Error moving task",
            description: "There was a problem moving your task. Please try again.",
          })
        }
      },

      importTasks: (importedTasks) => {
        try {
          // Ensure all dates are properly converted
          const processedTasks = Object.entries(importedTasks).reduce(
            (acc, [quadrant, quadrantTasks]) => {
              acc[quadrant as QuadrantType] = quadrantTasks.map(ensureDateProperties)
              return acc
            },
            {} as Record<QuadrantType, Task[]>,
          )

          set({ tasks: processedTasks })
        } catch (error) {
          console.error("Error importing tasks:", error)
          toast({
            variant: "destructive",
            title: "Error importing tasks",
            description: "There was a problem importing your tasks. Please try again.",
          })
        }
      },
    }),
    {
      name: "eisenhower-tasks",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert string dates back to Date objects
          const parsedTasks = Object.entries(state.tasks).reduce(
            (acc, [quadrant, quadrantTasks]) => {
              acc[quadrant as QuadrantType] = quadrantTasks.map(ensureDateProperties)
              return acc
            },
            {} as Record<QuadrantType, Task[]>,
          )

          state.tasks = parsedTasks
        }
      },
    },
  ),
)
