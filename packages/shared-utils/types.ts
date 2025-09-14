export type QuadrantType =
  | "urgent-important"
  | "not-urgent-important"
  | "urgent-not-important"
  | "not-urgent-not-important"

export type Task = {
  id: string
  title: string
  description: string
  deadline?: Date
  createdAt: Date
  tags?: string[]
}

export type ViewMode = "grid" | "list"

export type SortOption = "newest" | "oldest" | "deadline" | "alphabetical"

export interface TaskFormValues {
  title: string
  description: string
  deadline?: Date
  tags?: string[]
}
