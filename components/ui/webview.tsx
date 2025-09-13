"use client"

import { useState, useRef, useEffect } from "react"

interface WebViewProps {
  source: { uri: string } | { html: string }
  className?: string
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: (error: any) => void
  onMessage?: (event: MessageEvent) => void
}

export function WebView({
  source,
  className = "",
  style = {},
  onLoad,
  onError,
  onMessage,
}: WebViewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const handleLoad = () => {
      setIsLoading(false)
      if (onLoad) onLoad()
    }

    const handleError = (e: ErrorEvent) => {
      setIsLoading(false)
      setError("Failed to load content")
      if (onError) onError(e)
    }

    iframe.addEventListener("load", handleLoad)
    iframe.addEventListener("error", handleError)

    return () => {
      iframe.removeEventListener("load", handleLoad)
      iframe.removeEventListener("error", handleError)
    }
  }, [onLoad, onError])

  useEffect(() => {
    if (onMessage) {
      const handleMessage = (event: MessageEvent) => {
        onMessage(event)
      }

      window.addEventListener("message", handleMessage)
      return () => {
        window.removeEventListener("message", handleMessage)
      }
    }
  }, [onMessage])

  const iframeStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    border: "none",
    ...style,
  }

  // Handle different source types
  let src = ""
  let content = ""

  if ("uri" in source) {
    src = source.uri
  } else if ("html" in source) {
    content = source.html
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-red-50 ${className}`} style={style}>
        <div className="text-red-500 p-4 text-center">
          <p className="font-medium">Error loading content</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  if (isLoading && src) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} style={style}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={style}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      {src ? (
        <iframe
          ref={iframeRef}
          src={src}
          style={iframeStyle}
          className={isLoading ? "opacity-0" : "opacity-100"}
        />
      ) : (
        <iframe
          ref={iframeRef}
          srcDoc={content}
          style={iframeStyle}
          className={isLoading ? "opacity-0" : "opacity-100"}
        />
      )}
    </div>
  )
}