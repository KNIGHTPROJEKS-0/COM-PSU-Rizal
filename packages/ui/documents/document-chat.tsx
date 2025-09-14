"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Loader2, AlertCircle } from "lucide-react"
import { createDocumentChatStream } from "@/lib/ai"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DocumentChatProps {
  documentId: string
  documentContent: string
}

interface Message {
  role: "user" | "assistant"
  content: string
}

export function DocumentChat({ documentId, documentContent }: DocumentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I can help you understand this document. What would you like to know?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const allMessages = [...messages, userMessage].filter((m) => m.role === "user" || m.role === "assistant")
      // Await the async function
      const stream = await createDocumentChatStream(documentContent, allMessages)

      let fullResponse = ""

      for await (const chunk of stream) {
        if (chunk.type === "text-delta") {
          fullResponse += chunk.text

          setMessages((prev) => {
            const newMessages = [...prev]
            if (newMessages[newMessages.length - 1]?.role === "assistant") {
              newMessages[newMessages.length - 1].content = fullResponse
            } else {
              newMessages.push({ role: "assistant", content: fullResponse })
            }
            return newMessages
          })
        }
      }
    } catch (error) {
      console.error("Error in chat:", error)
      setError("Sorry, I encountered an error. Please try again.")
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-2" />
          Document Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`
                  max-w-[80%] rounded-lg p-3 
                  ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  }
                `}
              >
                <div className="flex items-center mb-1">
                  {message.role === "assistant" ? <Bot className="h-4 w-4 mr-1" /> : <User className="h-4 w-4 mr-1" />}
                  <span className="text-xs font-medium">{message.role === "assistant" ? "DocumentsAI" : "You"}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t border-slate-200 dark:border-slate-800 p-4">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Ask a question about this document..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={isLoading}
          />
          <Button size="icon" onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
