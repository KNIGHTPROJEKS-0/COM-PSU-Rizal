"use server"

import { revalidatePath } from "next/cache"
import type { Task, QuadrantType } from "@/lib/types"

export async function addTaskAction(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const quadrant = formData.get("quadrant") as QuadrantType
    const deadline = formData.get("deadline") ? new Date(formData.get("deadline") as string) : undefined
    const tagsString = formData.get("tags") as string
    const tags = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : []

    if (!title || !quadrant) {
      return { success: false, error: "Title and quadrant are required" }
    }

    // In a real app, this would interact with a database
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      deadline,
      createdAt: new Date(),
      tags,
    }

    // Revalidate the path to refresh the UI
    revalidatePath("/")

    return { success: true, task: newTask }
  } catch (error) {
    console.error("Error adding task:", error)
    return { success: false, error: "Failed to add task" }
  }
}

export async function editTaskAction(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const quadrant = formData.get("quadrant") as QuadrantType
    const deadline = formData.get("deadline") ? new Date(formData.get("deadline") as string) : undefined
    const tagsString = formData.get("tags") as string
    const tags = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : []

    if (!id || !title || !quadrant) {
      return { success: false, error: "ID, title, and quadrant are required" }
    }

    // In a real app, this would interact with a database
    const updatedTask: Task = {
      id,
      title,
      description,
      deadline,
      createdAt: new Date(), // This would normally be preserved from the original task
      tags,
    }

    // Revalidate the path to refresh the UI
    revalidatePath("/")

    return { success: true, task: updatedTask }
  } catch (error) {
    console.error("Error updating task:", error)
    return { success: false, error: "Failed to update task" }
  }
}

export async function deleteTaskAction(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const quadrant = formData.get("quadrant") as QuadrantType

    if (!id || !quadrant) {
      return { success: false, error: "ID and quadrant are required" }
    }

    // In a real app, this would interact with a database

    // Revalidate the path to refresh the UI
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error deleting task:", error)
    return { success: false, error: "Failed to delete task" }
  }
}

export async function moveTaskAction(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const sourceQuadrant = formData.get("sourceQuadrant") as QuadrantType
    const destinationQuadrant = formData.get("destinationQuadrant") as QuadrantType
    const index = Number.parseInt(formData.get("index") as string, 10)

    if (!id || !sourceQuadrant || !destinationQuadrant || isNaN(index)) {
      return { success: false, error: "All fields are required" }
    }

    // In a real app, this would interact with a database

    // Revalidate the path to refresh the UI
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error moving task:", error)
    return { success: false, error: "Failed to move task" }
  }
}
