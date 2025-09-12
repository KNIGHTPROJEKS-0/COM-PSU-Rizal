"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Video, Mic, User, Key } from "lucide-react"
import { useRouter } from "next/navigation"

export default function JoinMeeting() {
  const router = useRouter()
  const [meetingId, setMeetingId] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [enableVideo, setEnableVideo] = useState(true)
  const [enableAudio, setEnableAudio] = useState(true)

  const joinMeeting = () => {
    if (!meetingId.trim() || !name.trim()) {
      alert("Please enter both meeting ID and your name")
      return
    }
    
    // Validate meeting ID format (simple validation)
    const meetingIdRegex = /^[a-zA-Z0-9]{8}$/
    if (!meetingIdRegex.test(meetingId)) {
      alert("Please enter a valid meeting ID (8 characters)")
      return
    }
    
    // Navigate to the meeting room
    router.push(`/meeting/${meetingId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Join a Meeting</h1>
        <p className="text-gray-400">Enter your meeting details to join</p>
      </div>

      <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Meeting Details</CardTitle>
          <CardDescription>Enter the meeting information to join</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="meeting-id">Meeting ID or Link</Label>
            <Input
              id="meeting-id"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="Enter meeting ID or paste meeting link"
            />
            <p className="text-xs text-gray-400">
              Enter the 8-character meeting ID or full meeting link
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Meeting Password (if required)</Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg bg-gray-900/50 p-4">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                <span>Video</span>
              </div>
              <Switch
                checked={enableVideo}
                onCheckedChange={setEnableVideo}
              />
            </div>
            
            <div className="flex items-center justify-between rounded-lg bg-gray-900/50 p-4">
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                <span>Audio</span>
              </div>
              <Switch
                checked={enableAudio}
                onCheckedChange={setEnableAudio}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={joinMeeting}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
          >
            Join Meeting
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">
          Don't have a meeting ID? <a href="/meeting/new" className="text-orange-400 hover:underline">Create a new meeting</a>
        </p>
      </div>
    </div>
  )
}