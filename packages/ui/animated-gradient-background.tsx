"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedGradientBackgroundProps {
  isDarkMode: boolean
  className?: string
}

export default function AnimatedGradientBackground({ isDarkMode, className }: AnimatedGradientBackgroundProps) {
  const [mounted, setMounted] = useState(false)

  // Ensure hydration completes before animation starts
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className={cn("fixed inset-0 -z-10 transition-colors duration-500", className, {
        "bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100": !isDarkMode && mounted,
        "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950": isDarkMode && mounted,
      })}
    >
      {/* Animated gradient orbs */}
      <div className={cn("absolute inset-0 opacity-70 transition-opacity duration-500", { "opacity-40": isDarkMode })}>
        <div className="absolute top-[10%] left-[15%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-r from-blue-300 to-purple-300 blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] right-[15%] w-[25vw] h-[25vw] max-w-[400px] max-h-[400px] rounded-full bg-gradient-to-r from-red-200 to-yellow-200 blur-[100px] animate-blob animation-delay-4000" />
        <div className="absolute bottom-[10%] left-[35%] w-[20vw] h-[20vw] max-w-[300px] max-h-[300px] rounded-full bg-gradient-to-r from-green-200 to-teal-200 blur-[100px] animate-blob" />
      </div>

      {/* Grid overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-10 transition-opacity duration-500",
          { "opacity-5": isDarkMode },
        )}
      />
    </div>
  )
}
