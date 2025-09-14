"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const pathname = usePathname()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Set loaded to true after initial render
    setLoaded(true)
    
    // Trigger ultra-fast transition on route change
    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  // For the initial load, we don't want any transition
  if (!loaded) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      className={`transition-all duration-100 ease-out ${
        isTransitioning ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
      } ${className}`}
    >
      {children}
    </div>
  )
}

// Subtle loading overlay component for glass transitions
export function PageLoadingOverlay({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-md flex items-center justify-center transition-all duration-100">
      <div className="glass-enhanced rounded-2xl p-6 flex flex-col items-center gap-3 animate-pulse">
        <div className="loading-spinner w-6 h-6" />
        <p className="text-white/80 text-sm">Loading...</p>
      </div>
    </div>
  )
}

// Smooth navigation hook
export function useSmoothNavigation() {
  const [isNavigating, setIsNavigating] = useState(false)

  const navigateWithTransition = (callback: () => void, delay = 100) => {
    setIsNavigating(true)
    setTimeout(() => {
      callback()
      setTimeout(() => setIsNavigating(false), 200)
    }, delay)
  }

  return { isNavigating, navigateWithTransition }
}