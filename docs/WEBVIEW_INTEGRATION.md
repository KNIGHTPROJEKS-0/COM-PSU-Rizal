# WebView Integration Guide

This document explains how to use the WebView component in the COM-PSU-Rizal project.

## Overview

The WebView component is a web-based equivalent of the React Native WebView, implemented using iframes for use in Next.js applications. It provides similar functionality for loading external URLs or rendering HTML content directly.

## Installation

The WebView component is already included in the project. No additional installation is required.

## Usage

### Basic URL Loading

```jsx
import { WebView } from "@/components/ui/webview";

export function MyComponent() {
  return (
    <WebView
      source={{ uri: "https://example.com" }}
      style={{ width: "100%", height: "400px" }}
    />
  );
}
```

### Loading HTML Content

```jsx
import { WebView } from "@/components/ui/webview";

export function MyComponent() {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>My Content</title>
    </head>
    <body>
      <h1>Hello World</h1>
    </body>
    </html>
  `;

  return (
    <WebView
      source={{ html: htmlContent }}
      style={{ width: "100%", height: "400px" }}
    />
  );
}
```

### Handling Events

```jsx
import { WebView } from "@/components/ui/webview";

export function MyComponent() {
  const handleLoad = () => {
    console.log("WebView loaded");
  };

  const handleError = (error) => {
    console.log("WebView error:", error);
  };

  const handleMessage = (event) => {
    console.log("Message from WebView:", event.data);
  };

  return (
    <WebView
      source={{ uri: "https://example.com" }}
      onLoad={handleLoad}
      onError={handleError}
      onMessage={handleMessage}
      style={{ width: "100%", height: "400px" }}
    />
  );
}
```

## API Reference

### Props

| Prop      | Type                                    | Description                                   |
| --------- | --------------------------------------- | --------------------------------------------- |
| source    | `{ uri: string }` or `{ html: string }` | The source to load in the WebView             |
| className | string                                  | CSS class names to apply to the container     |
| style     | React.CSSProperties                     | Inline styles to apply to the container       |
| onLoad    | function                                | Callback when the WebView finishes loading    |
| onError   | function                                | Callback when the WebView encounters an error |
| onMessage | function                                | Callback when the WebView receives a message  |

### Methods

The WebView component doesn't expose direct methods like the React Native version, but you can communicate with the content using postMessage:

```javascript
// In your HTML content
window.parent.postMessage({ type: "CUSTOM_EVENT", data: "Hello" }, "*");

// In your React component
const handleMessage = (event) => {
  if (event.data.type === "CUSTOM_EVENT") {
    console.log("Received custom event:", event.data.data);
  }
};
```

## Examples

See the demo components for complete examples:

- [WebView Demo](../components/demo/webview-demo.tsx)
- [WebView HTML Demo](../components/demo/webview-html-demo.tsx)

## Limitations

1. **Security**: Due to browser security restrictions, cross-origin communication may be limited.
2. **Performance**: Iframes can be slower than native WebView implementations.
3. **Features**: Some advanced WebView features may not be available in the web-based implementation.

## Best Practices

1. Always handle loading and error states appropriately
2. Use proper CSP headers when loading external content
3. Sanitize any HTML content before rendering
4. Implement proper error boundaries to handle WebView failures
5. Consider lazy loading for better performance

## Troubleshooting

### Content Not Loading

- Check browser console for CORS errors
- Ensure the URL is accessible
- Verify that the content allows embedding (X-Frame-Options)

### Messages Not Received

- Ensure postMessage is being called with the correct target origin
- Check that the onMessage handler is properly attached
- Verify that the message format matches expectations
