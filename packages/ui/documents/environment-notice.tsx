"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EnvironmentNotice() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) {
    return null
  }

  return (
    <Alert className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <div className="flex-1">
        <AlertTitle>Development Environment</AlertTitle>
        <AlertDescription>
          <p className="mb-1">
            You're running in development mode without environment variables configured. The following features are
            using fallback implementations:
          </p>
          <ul className="list-disc pl-5 text-sm">
            <li>Vercel Blob storage (document uploads use mock storage)</li>
            <li>OpenAI API (AI features use pre-defined responses)</li>
          </ul>
          <p className="mt-2 text-sm">For full functionality, please configure the required environment variables.</p>
        </AlertDescription>
      </div>
      <Button variant="ghost" size="icon" onClick={() => setDismissed(true)}>
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  )
}
