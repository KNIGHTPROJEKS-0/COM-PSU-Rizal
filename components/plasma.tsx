"use client"

import { useEffect, useRef } from "react"

export default function Plasma({
  color = "#8b5cf6",
  speed = 1,
  direction = "forward",
  scale = 1,
  opacity = 0.3,
  mouseInteractive = false,
}: {
  color?: string
  speed?: number
  direction?: "forward" | "reverse"
  scale?: number
  opacity?: number
  mouseInteractive?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const timeRef = useRef<number>(0)
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseInteractive) return
      mousePosRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    const animate = (timestamp: number) => {
      if (!ctx || !canvas) return

      const deltaTime = timestamp - timeRef.current
      timeRef.current = timestamp

      const width = canvas.width
      const height = canvas.height

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Create plasma effect
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4

          // Plasma algorithm
          let value =
            Math.sin((x / 50) * scale + timeRef.current * 0.001 * speed * (direction === "forward" ? 1 : -1)) +
            Math.sin((y / 30) * scale + timeRef.current * 0.002 * speed * (direction === "forward" ? 1 : -1)) +
            Math.sin(
              ((x + y) / 60) * scale +
                timeRef.current * 0.0015 * speed * (direction === "forward" ? 1 : -1)
            ) +
            Math.sin(
              Math.sqrt(x * x + y * y) / 8.0 * scale +
                timeRef.current * 0.001 * speed * (direction === "forward" ? 1 : -1)
            )

          // Normalize to 0-1 range
          value = (value + 4) / 8

          // Apply mouse interaction
          if (mouseInteractive) {
            const dx = x - mousePosRef.current.x * width
            const dy = y - mousePosRef.current.y * height
            const distance = Math.sqrt(dx * dx + dy * dy)
            const mouseInfluence = Math.max(0, 1 - distance / 300)
            value += mouseInfluence * 0.5
          }

          // Convert to RGB
          const r = parseInt(color.slice(1, 3), 16) * value * opacity
          const g = parseInt(color.slice(3, 5), 16) * value * opacity
          const b = parseInt(color.slice(5, 7), 16) * value * opacity

          data[index] = r // R
          data[index + 1] = g // G
          data[index + 2] = b // B
          data[index + 3] = 255 * opacity // A
        }
      }

      ctx.putImageData(imageData, 0, 0)

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationRef.current)
    }
  }, [color, speed, direction, scale, opacity, mouseInteractive])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
}