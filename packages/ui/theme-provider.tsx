"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  enableSystem?: boolean
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
  systemTheme?: "dark" | "light"
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  systemTheme: undefined,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [systemTheme, setSystemTheme] = useState<"dark" | "light" | undefined>(undefined)

  useEffect(() => {
    const root = window.document.documentElement

    // Remove all class names related to themes
    root.classList.remove("light", "dark")

    // Check for stored theme preference
    const storedTheme = localStorage.getItem("theme") as Theme | null
    if (storedTheme) {
      setTheme(storedTheme)
    }

    // Determine system preference
    if (enableSystem) {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setSystemTheme(systemPreference)
    }
  }, [enableSystem])

  useEffect(() => {
    const root = window.document.documentElement

    // Apply theme
    if (theme === "system" && enableSystem) {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemPreference)
      localStorage.setItem("theme", theme)
    } else {
      root.classList.add(theme)
      localStorage.setItem("theme", theme)
    }
  }, [theme, enableSystem])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme)
    },
    systemTheme,
  }

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
