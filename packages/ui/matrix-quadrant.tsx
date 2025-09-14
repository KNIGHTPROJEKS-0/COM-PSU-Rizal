"use client"

import { memo, useState, useRef, useEffect } from "react"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import { Plus, Clock, ArrowUpDown, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import TaskCard from "./task-card"
import { useTaskFilters } from "@/hooks/use-task-filters"
import { useMobile } from "@/hooks/use-mobile"
import type { Task, SortOption, ViewMode } from "@/lib/types"
import { motion } from "framer-motion"
import AnimatedQuadrantHeader from "./animated-quadrant-header"

interface MatrixQuadrantProps {
  id: string
  title: string
  description: string
  tasks: Task[]
  onAddTask: () => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  color: string
  iconColor: string
  viewMode: ViewMode
  searchQuery?: string
  selectedTags?: string[]
}

function MatrixQuadrant({
  id,
  title,
  description,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  color,
  iconColor,
  viewMode,
  searchQuery = "",
  selectedTags = [],
}: MatrixQuadrantProps) {
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const quadrantRef = useRef<HTMLDivElement>(null)
  const [isScrollable, setIsScrollable] = useState(false)
  const isMobile = useMobile()

  // Check if the content is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (quadrantRef.current) {
        const { scrollHeight, clientHeight } = quadrantRef.current
        setIsScrollable(scrollHeight > clientHeight)
      }
    }

    checkScrollable()

    // Re-check when tasks change
    const resizeObserver = new ResizeObserver(checkScrollable)
    if (quadrantRef.current) {
      resizeObserver.observe(quadrantRef.current)
    }

    return () => {
      if (quadrantRef.current) {
        resizeObserver.unobserve(quadrantRef.current)
      }
    }
  }, [tasks, viewMode])

  // Use the custom hook for filtering and sorting tasks
  const filteredAndSortedTasks = useTaskFilters(tasks, searchQuery, sortOption, selectedTags)

  // Get unique tags from all tasks in this quadrant
  const getAllTags = () => {
    const tags = new Set<string>()
    tasks.forEach((task) => {
      if (task.tags) {
        task.tags.forEach((tag) => tags.add(tag))
      }
    })
    return Array.from(tags)
  }

  const uniqueTags = getAllTags()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col border-2 ${color} bg-card/80 backdrop-blur-sm text-card-foreground shadow-lg transition-all hover:shadow-xl rounded-lg overflow-hidden`}
      id={id}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="pb-2 p-3 sm:p-4"
        initial={{ y: -10 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="flex justify-between items-start">
          <AnimatedQuadrantHeader title={title} description={description} iconColor={iconColor} />

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                        <ArrowUpDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="sr-only">Sort tasks</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSortOption("newest")}>
                        <Clock className="mr-2 h-4 w-4" />
                        Newest first
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOption("oldest")}>
                        <Clock className="mr-2 h-4 w-4" />
                        Oldest first
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOption("deadline")}>
                        <Calendar className="mr-2 h-4 w-4" />
                        By deadline
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOption("alphabetical")}>
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Alphabetical
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>Sort tasks</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onAddTask}
                    className={`${iconColor} hover:bg-primary/10 h-7 w-7 sm:h-8 sm:w-8`}
                  >
                    <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="sr-only">Add task</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add task</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {uniqueTags.length > 0 && viewMode === "list" && (
          <div className="flex flex-wrap gap-1 mt-2 overflow-hidden">
            {uniqueTags.slice(0, isMobile ? 3 : 5).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs truncate max-w-[100px]">
                {tag}
              </Badge>
            ))}
            {uniqueTags.length > (isMobile ? 3 : 5) && (
              <Badge variant="outline" className="text-xs">
                +{uniqueTags.length - (isMobile ? 3 : 5)}
              </Badge>
            )}
          </div>
        )}
      </motion.div>

      <motion.div
        ref={quadrantRef}
        className={`flex-1 overflow-y-auto p-3 sm:p-4 pt-0 ${
          viewMode === "grid" ? "max-h-[250px] sm:max-h-[300px] md:max-h-[350px] lg:max-h-[400px]" : ""
        } ${isScrollable ? "pr-2 sm:pr-3" : ""}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Droppable droppableId={id} type="TASK">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-2 sm:space-y-3 min-h-[100px] transition-all duration-200 ${
                snapshot.isDraggingOver ? "drop-zone-active rounded-md p-2" : ""
              }`}
              aria-label={`${title} tasks`}
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => {
                    // Determine if this task should be visible based on filters
                    const isVisible = filteredAndSortedTasks.some((t) => t.id === task.id)

                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.8 : 1,
                          // Only hide tasks that don't match the filter criteria when not dragging
                          display: snapshot.isDragging || isVisible ? "block" : "none",
                        }}
                        className={`transition-transform ${snapshot.isDragging ? "dragging" : ""}`}
                      >
                        <TaskCard
                          task={task}
                          onEdit={() => onEditTask(task)}
                          onDelete={() => onDeleteTask(task.id)}
                          color={iconColor}
                          viewMode={viewMode}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )
                  }}
                </Draggable>
              ))}
              {provided.placeholder}

              {filteredAndSortedTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center h-24 sm:h-32 text-muted-foreground border border-dashed border-muted rounded-lg">
                  {tasks.length === 0 ? (
                    <>
                      <p className="text-xs sm:text-sm">No tasks yet</p>
                      <Button variant="ghost" size="sm" onClick={onAddTask} className="mt-2 text-xs sm:text-sm h-8">
                        Add Task
                      </Button>
                    </>
                  ) : (
                    <p className="text-xs sm:text-sm">No matching tasks</p>
                  )}
                </div>
              )}
            </div>
          )}
        </Droppable>
      </motion.div>

      <motion.div
        className="pt-2 pb-2 sm:pt-3 sm:pb-3 px-3 sm:px-4 text-xs text-muted-foreground"
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <div className="w-full flex justify-between items-center">
          <span>
            {filteredAndSortedTasks.length} {filteredAndSortedTasks.length === 1 ? "task" : "tasks"}
            {filteredAndSortedTasks.length !== tasks.length && ` (filtered from ${tasks.length})`}
          </span>
          {isScrollable && <span className="text-xs opacity-70">Scroll for more</span>}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(MatrixQuadrant)
