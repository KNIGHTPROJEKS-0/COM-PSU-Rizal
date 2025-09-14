"use client"

import { WebView } from "@/components/ui/webview"

export function WebViewHtmlDemo() {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>WebView HTML Demo</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
          color: #333;
          text-align: center;
        }
        p {
          color: #666;
          line-height: 1.6;
        }
        button {
          background-color: #007AFF;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
        }
        button:hover {
          background-color: #0056CC;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>WebView HTML Demo</h1>
        <p>This content is rendered directly from HTML string inside the WebView component.</p>
        <p>You can include any valid HTML, CSS, and JavaScript here.</p>
        <button onclick="sendMessage()">Send Message to Parent</button>
        
        <script>
          function sendMessage() {
            // Send message to parent window
            window.parent.postMessage({
              type: 'WEBVIEW_MESSAGE',
              data: 'Hello from WebView content!'
            }, '*');
          }
        </script>
      </div>
    </body>
    </html>
  `

  const handleMessage = (event: MessageEvent) => {
    console.log("Received message from WebView:", event.data)
    if (event.data && event.data.type === 'WEBVIEW_MESSAGE') {
      alert(`Message from WebView: ${event.data.data}`)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">HTML Content WebView Demo</h2>
      <div className="h-96 w-full border rounded-lg overflow-hidden">
        <WebView
          source={{ html: htmlContent }}
          onMessage={handleMessage}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  )
}