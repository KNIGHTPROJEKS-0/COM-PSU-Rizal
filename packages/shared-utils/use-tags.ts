"use client"

import { useMemo } from "react"
import type { Task, QuadrantType } from "@/lib/types"

export function useTags(tasks: Record<QuadrantType, Task[]>) {
  // Extract all unique tags from all tasks
  const allTags = useMemo(() => {
    const tags = new Set<string>()

    Object.values(tasks).forEach((quadrantTasks) => {
      quadrantTasks.forEach((task) => {
        if (task.tags) {
          task.tags.forEach((tag) => tags.add(tag))
        }
      })
    })

    return Array.from(tags).sort()
  }, [tasks])

  // Get tags for a specific quadrant
  const getQuadrantTags = (quadrant: QuadrantType) => {
    const tags = new Set<string>()

    tasks[quadrant].forEach((task) => {
      if (task.tags) {
        task.tags.forEach((tag) => tags.add(tag))
      }
    })

    return Array.from(tags).sort()
  }

  // Get tag counts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {}

    Object.values(tasks).forEach((quadrantTasks) => {
      quadrantTasks.forEach((task) => {
        if (task.tags) {
          task.tags.forEach((tag) => {
            counts[tag] = (counts[tag] || 0) + 1
          })
        }
      })
    })

    return counts
  }, [tasks])

  return {
    allTags,
    getQuadrantTags,
    tagCounts,
  }
}
