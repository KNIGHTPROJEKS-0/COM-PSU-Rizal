"use client"

import type { ReactNode } from "react"
import AdminSidebar from "./sidebar"
import AdminTopNav from "./top-nav"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [menuState, setMenuState] = useState<"full" | "collapsed" | "hidden">("full")
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Listen for menu state changes and hover state
  useEffect(() => {
    const checkMenuState = () => {
      if (typeof window !== "undefined") {
        if ((window as any).menuState) {
          setMenuState((window as any).menuState)
        }
        if ((window as any).isHovered !== undefined) {
          setIsHovered((window as any).isHovered)
        }
        if ((window as any).isMobile !== undefined) {
          setIsMobile((window as any).isMobile)
        }
      }
    }

    // Check initial state
    checkMenuState()

    // Set up interval to check for changes
    const interval = setInterval(checkMenuState, 50) // More frequent updates for hover

    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return null
  }

  // Calculate margin based on menu state and hover - only for desktop
  const getMarginLeft = () => {
    if (isMobile) {
      return "0" // No margin on mobile, sidebar is overlay
    }
    if (menuState === "hidden") {
      return "0"
    }
    // If collapsed and hovered, expand temporarily
    if (menuState === "collapsed" && isHovered) {
      return "16rem" // 256px - full width
    }
    if (menuState === "collapsed") {
      return "4rem" // 64px - collapsed width
    }
    return "16rem" // 256px - full width
  }

  return (
    <div className={`flex h-screen ${theme === "dark" ? "dark" : ""} relative`}>
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-40" 
        style={{
          backgroundImage: "url('/images/com-background-3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      />
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 z-0 bg-black bg-opacity-60" />
      
      <AdminSidebar />
      <div
        className="w-full flex flex-1 flex-col transition-all duration-300 ease-in-out min-w-0 z-10 relative"
        style={{
          marginLeft: getMarginLeft(),
        }}
      >
        <header className="h-16 border-b border-gray-200 dark:border-[#1F1F23] flex-shrink-0 bg-white bg-opacity-90 dark:bg-[#0F0F12] dark:bg-opacity-90">
          <AdminTopNav />
        </header>
        <main className="flex-1 overflow-auto p-3 sm:p-6 bg-white bg-opacity-80 dark:bg-[#0F0F12] dark:bg-opacity-80 min-w-0">{children}</main>
      </div>
    </div>
  )
}
