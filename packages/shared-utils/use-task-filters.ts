"use client"

import { useMemo } from "react"
import type { Task, SortOption } from "@/lib/types"

// Helper function to ensure we have a valid Date object
const ensureDate = (dateOrString: Date | string | undefined): Date => {
  if (!dateOrString) return new Date(0) // Default date if undefined

  if (dateOrString instanceof Date) {
    return dateOrString
  }

  // If it's a string, try to convert it to a Date
  try {
    return new Date(dateOrString)
  } catch (e) {
    console.error("Invalid date format:", dateOrString)
    return new Date(0) // Default date if conversion fails
  }
}

export function useTaskFilters(tasks: Task[], searchQuery: string, sortOption: SortOption, selectedTags: string[]) {
  // Ensure tasks is always an array
  const safeTasksArray = Array.isArray(tasks) ? tasks : []

  // Filter tasks based on search query and selected tags
  const filteredTasks = useMemo(() => {
    // First filter by search query
    let filtered = safeTasksArray

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          (task.tags && task.tags.some((tag) => tag.toLowerCase().includes(query))),
      )
    }

    // Then filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((task) => task.tags && selectedTags.every((tag) => task.tags.includes(tag)))
    }

    return filtered
  }, [safeTasksArray, searchQuery, selectedTags])

  // Sort filtered tasks
  const sortedTasks = useMemo(() => {
    const tasksCopy = [...filteredTasks]

    switch (sortOption) {
      case "newest":
        return tasksCopy.sort((a, b) => {
          const dateA = ensureDate(a.createdAt)
          const dateB = ensureDate(b.createdAt)
          return dateB.getTime() - dateA.getTime()
        })
      case "oldest":
        return tasksCopy.sort((a, b) => {
          const dateA = ensureDate(a.createdAt)
          const dateB = ensureDate(b.createdAt)
          return dateA.getTime() - dateB.getTime()
        })
      case "deadline":
        return tasksCopy.sort((a, b) => {
          if (!a.deadline) return 1
          if (!b.deadline) return -1
          const dateA = ensureDate(a.deadline)
          const dateB = ensureDate(b.deadline)
          return dateA.getTime() - dateB.getTime()
        })
      case "alphabetical":
        return tasksCopy.sort((a, b) => a.title.localeCompare(b.title))
      default:
        return tasksCopy
    }
  }, [filteredTasks, sortOption])

  return sortedTasks
}
