"use client"

import { useEffect, useRef, useState } from "react"

export default function LazyVideo({
  src,
  className,
  autoplay = false,
  loop = false,
  muted = false,
  playsInline = false,
  "aria-label": ariaLabel,
}: {
  src: string
  className?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  playsInline?: boolean
  "aria-label"?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(() => {
    if (!isMounted || !videoRef.current) return

    const video = videoRef.current

    const playVideo = async () => {
      if (autoplay) {
        try {
          await video.play()
        } catch (error) {
          console.warn("Autoplay failed:", error)
        }
      }
    }

    // Play when in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo()
          } else if (!autoplay) {
            video.pause()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
    }
  }, [isMounted, autoplay])

  if (!isMounted) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-900`}
        aria-label={ariaLabel}
      >
        <div className="h-1/3 w-1/3 animate-pulse rounded-full border-4 border-gray-700 border-t-lime-300" />
      </div>
    )
  }

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay={autoplay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      aria-label={ariaLabel}
      preload="metadata"
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}