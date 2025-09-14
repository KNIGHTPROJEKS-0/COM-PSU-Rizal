"use client"

import { useState } from "react"
import { WebView } from "@/components/ui/webview"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function WebViewDemo() {
  const [url, setUrl] = useState("https://github.com/react-native-community/react-native-webview")
  const [inputUrl, setInputUrl] = useState("https://github.com/react-native-community/react-native-webview")

  const handleLoadUrl = () => {
    setUrl(inputUrl)
  }

  const handleMessage = (event: MessageEvent) => {
    console.log("Received message from WebView:", event.data)
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Enter URL"
          className="flex-1"
        />
        <Button onClick={handleLoadUrl}>Load</Button>
      </div>
      
      <div className="h-96 w-full border rounded-lg overflow-hidden">
        <WebView
          source={{ uri: url }}
          onMessage={handleMessage}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      
      <div className="text-sm text-gray-500">
        <p>WebView Demo - Loading: {url}</p>
      </div>
    </div>
  )
}