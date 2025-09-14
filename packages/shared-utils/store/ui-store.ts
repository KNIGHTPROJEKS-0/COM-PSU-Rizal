import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ViewMode } from "../types"

interface UIState {
  isDarkMode: boolean
  viewMode: ViewMode
  searchQuery: string
  selectedTags: string[]
  isOnboardingShown: boolean

  setDarkMode: (isDarkMode: boolean) => void
  setViewMode: (viewMode: ViewMode) => void
  setSearchQuery: (query: string) => void
  setSelectedTags: (tags: string[]) => void
  setOnboardingShown: (shown: boolean) => void
  toggleTag: (tag: string) => void
  clearSelectedTags: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isDarkMode: true,
      viewMode: "grid",
      searchQuery: "",
      selectedTags: [],
      isOnboardingShown: false,

      setDarkMode: (isDarkMode) => set({ isDarkMode }),
      setViewMode: (viewMode) => set({ viewMode }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedTags: (selectedTags) => set({ selectedTags }),
      setOnboardingShown: (isOnboardingShown) => set({ isOnboardingShown }),

      toggleTag: (tag) =>
        set((state) => ({
          selectedTags: state.selectedTags.includes(tag)
            ? state.selectedTags.filter((t) => t !== tag)
            : [...state.selectedTags, tag],
        })),

      clearSelectedTags: () => set({ selectedTags: [] }),
    }),
    {
      name: "eisenhower-ui-preferences",
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        viewMode: state.viewMode,
        isOnboardingShown: state.isOnboardingShown,
      }),
    },
  ),
)
