"use client"

import { motion } from "framer-motion"
import { memo, useState } from "react"
import { Clock, MoreVertical, Edit, Trash, GripVertical } from "lucide-react"
import { CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Task, ViewMode } from "@/lib/types"

// Helper function to ensure we have a valid Date object
const ensureDate = (dateOrString: Date | string | undefined): Date | undefined => {
  if (!dateOrString) return undefined

  if (dateOrString instanceof Date) {
    return dateOrString
  }

  // If it's a string, try to convert it to a Date
  try {
    return new Date(dateOrString)
  } catch (e) {
    console.error("Invalid date format:", dateOrString)
    return undefined
  }
}

interface TaskCardProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
  color: string
  viewMode: ViewMode
  dragHandleProps: any
}

function TaskCard({ task, onEdit, onDelete, color, viewMode, dragHandleProps }: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Ensure deadline is a proper Date object if it exists
  const deadline = ensureDate(task.deadline)

  // Format deadline if it exists
  const formattedDeadline = deadline
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(deadline)
    : null

  // Calculate if deadline is approaching (within 24 hours)
  const isDeadlineApproaching = deadline
    ? deadline.getTime() - Date.now() < 24 * 60 * 60 * 1000 && deadline.getTime() > Date.now()
    : false

  // Calculate if deadline is passed
  const isDeadlinePassed = deadline ? deadline.getTime() < Date.now() : false

  // Calculate days remaining until deadline
  const getDaysRemaining = () => {
    if (!deadline) return null

    const now = new Date()
    const diffTime = deadline.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Overdue"
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    return `${diffDays} days`
  }

  const daysRemaining = getDaysRemaining()

  // Handle delete with confirmation
  const handleDeleteClick = () => {
    setIsMenuOpen(false)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    setShowDeleteConfirm(false)
    onDelete()
  }

  return (
    <>
      <motion.div
        className={`${viewMode === "grid" ? "" : "border-l-4"} ${color.replace("text-", "border-l-")} 
        bg-card hover:bg-accent/5 transition-all duration-200 group 
        task-card-draggable w-full overflow-hidden rounded-lg`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
        whileTap={{ scale: 0.98 }}
      >
        <CardHeader className="p-3 pb-0 flex flex-row justify-between items-start">
          <div className="flex items-center gap-2 min-w-0">
            <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing flex-shrink-0">
              <GripVertical className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-medium text-foreground line-clamp-1 break-words min-w-0">{task.title}</h3>
          </div>
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground flex-shrink-0 ml-1">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Task options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive focus:text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="p-3 pt-2">
          {task.description && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2 break-words">{task.description}</p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0 max-w-[120px] truncate">
                    {tag}
                  </Badge>
                ))}
                {task.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    +{task.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {formattedDeadline && (
              <div
                className={`flex items-center text-xs gap-1 flex-shrink-0 ${
                  isDeadlinePassed
                    ? "text-destructive"
                    : isDeadlineApproaching
                      ? "text-yellow-500 dark:text-yellow-400"
                      : "text-muted-foreground"
                }`}
              >
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span className="whitespace-nowrap">{formattedDeadline}</span>
                {daysRemaining && (
                  <Badge
                    variant={isDeadlinePassed ? "destructive" : "outline"}
                    className="ml-1 text-[10px] px-1 py-0 whitespace-nowrap"
                  >
                    {daysRemaining}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </motion.div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="max-w-[90vw] w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(TaskCard)
