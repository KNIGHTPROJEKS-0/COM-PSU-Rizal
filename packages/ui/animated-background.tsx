"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  opacity: number
}

interface AnimatedBackgroundProps {
  isDarkMode: boolean
  className?: string
}

export default function AnimatedBackground({ isDarkMode, className }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)

  // Ensure hydration completes before animation starts
  useEffect(() => {
    setMounted(true)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Initialize particles
    const initParticles = () => {
      const particleCount = Math.min(Math.floor(window.innerWidth * 0.05), 100) // Responsive particle count
      particlesRef.current = []

      for (let i = 0; i < particleCount; i++) {
        const colors = isDarkMode
          ? ["rgba(255, 165, 0, 0.6)", "rgba(255, 140, 0, 0.5)", "rgba(255, 69, 0, 0.4)"]
          : ["rgba(255, 165, 0, 0.4)", "rgba(255, 140, 0, 0.3)", "rgba(255, 69, 0, 0.2)"]

        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 5 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.1,
        })
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      if (isDarkMode) {
        gradient.addColorStop(0, "rgba(15, 23, 42, 1)")
        gradient.addColorStop(0.3, "rgba(51, 25, 0, 0.8)")
        gradient.addColorStop(0.6, "rgba(102, 51, 0, 0.6)")
        gradient.addColorStop(1, "rgba(153, 76, 0, 0.4)")
      } else {
        gradient.addColorStop(0, "rgba(255, 248, 240, 1)")
        gradient.addColorStop(0.3, "rgba(255, 237, 213, 0.9)")
        gradient.addColorStop(0.6, "rgba(255, 218, 185, 0.7)")
        gradient.addColorStop(1, "rgba(255, 200, 150, 0.5)")
      }
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x > canvas.width || particle.x < 0) {
          particle.speedX = -particle.speedX
        }
        if (particle.y > canvas.height || particle.y < 0) {
          particle.speedY = -particle.speedY
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      })

      ctx.strokeStyle = isDarkMode ? "rgba(255, 165, 0, 0.05)" : "rgba(255, 140, 0, 0.03)"
      ctx.lineWidth = 1

      const gridSize = 50
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    // Handle window resize
    window.addEventListener("resize", () => {
      resizeCanvas()
      initParticles()
    })

    resizeCanvas()
    initParticles()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [mounted, isDarkMode])

  return (
    <div className={cn("fixed inset-0 -z-10 transition-colors duration-500", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: mounted ? 1 : 0, transition: "opacity 1s ease-in-out" }}
      />
    </div>
  )
}
