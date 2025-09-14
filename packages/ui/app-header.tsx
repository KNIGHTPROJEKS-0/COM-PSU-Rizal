"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Menu, HelpCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface AppHeaderProps {
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
  searchQuery: string
  setSearchQuery: (value: string) => void
  showOnboarding: () => void
  totalTasks: number
}

export default function AppHeader({
  isDarkMode,
  setIsDarkMode,
  searchQuery,
  setSearchQuery,
  showOnboarding,
  totalTasks,
}: AppHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Focus search input when pressing "/"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement instanceof HTMLInputElement === false &&
        document.activeElement instanceof HTMLTextAreaElement === false
      ) {
        e.preventDefault()
        const searchInput = document.getElementById("search-input")
        if (searchInput) {
          searchInput.focus()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-orange-gradient text-white px-4 py-2 rounded-md z-50 font-medium"
      >
        Skip to content
      </a>
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-orange-gradient tracking-tight">
              Collaboration Online Meet
            </h1>
            <p className="text-sm text-muted-foreground">PSU Rizal Campus Video Conferencing & Collaboration App</p>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col gap-6 pt-6">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="dark-mode-mobile" checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                  <Label htmlFor="dark-mode-mobile">{isDarkMode ? "Dark mode" : "Light mode"}</Label>
                  {isDarkMode ? (
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Sun className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <Button variant="outline" onClick={showOnboarding} className="flex items-center gap-2 bg-transparent">
                  <HelpCircle className="h-4 w-4" />
                  Show Help
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative w-full sm:w-64 hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-input"
              type="text"
              placeholder="Search tasks... (Press / to focus)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>

          <div className="hidden md:flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                    <Label htmlFor="dark-mode" className="sr-only">
                      Dark mode
                    </Label>
                    {isDarkMode ? (
                      <Moon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Sun className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>{isDarkMode ? "Switch to light mode" : "Switch to dark mode"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={showOnboarding}>
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Show help</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </header>
  )
}
