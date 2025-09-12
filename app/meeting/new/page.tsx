"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Copy, Video, Users, Calendar, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NewMeeting() {
  const router = useRouter()
  const [meetingTitle, setMeetingTitle] = useState("")
  const [meetingLink, setMeetingLink] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const [requirePassword, setRequirePassword] = useState(false)
  const [password, setPassword] = useState("")
  const [enableWaitingRoom, setEnableWaitingRoom] = useState(false)

  // Generate a random meeting ID
  useEffect(() => {
    const generateMeetingId = () => {
      return Math.random().toString(36).substring(2, 10)
    }
    
    setMeetingLink(`https://com-psu-rizal.com/meeting/${generateMeetingId()}`)
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingLink)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const startMeeting = () => {
    // Extract the meeting ID from the link
    const meetingId = meetingLink.split("/").pop()
    router.push(`/meeting/${meetingId}`)
  }

  const scheduleMeeting = () => {
    // For now, just show an alert
    alert("Meeting scheduled! This feature will be implemented in a future update.")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Start a New Meeting</h1>
        <p className="text-gray-400">Create a meeting link to share with your team</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Meeting Details */}
        <div className="space-y-6">
          <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Meeting Details
              </CardTitle>
              <CardDescription>Set up your meeting preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meeting-title">Meeting Title</Label>
                <Input
                  id="meeting-title"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="Team Standup, Client Meeting, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meeting-link">Meeting Link</Label>
                <div className="flex gap-2">
                  <Input
                    id="meeting-link"
                    value={meetingLink}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    className="border-white/20"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                {isCopied && (
                  <p className="text-sm text-green-400">Copied to clipboard!</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="require-password">Require Password</Label>
                <Switch
                  id="require-password"
                  checked={requirePassword}
                  onCheckedChange={setRequirePassword}
                />
              </div>

              {requirePassword && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter meeting password"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label htmlFor="waiting-room">Enable Waiting Room</Label>
                <Switch
                  id="waiting-room"
                  checked={enableWaitingRoom}
                  onCheckedChange={setEnableWaitingRoom}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule Meeting
              </CardTitle>
              <CardDescription>Schedule this meeting for later</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">
                Schedule your meeting for a specific date and time. You'll receive a calendar invitation.
              </p>
              <Button 
                onClick={scheduleMeeting}
                className="w-full"
                variant="outline"
              >
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Meeting Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-900/50">
                <h3 className="font-medium mb-2">Security</h3>
                <p className="text-sm text-gray-400">
                  {requirePassword 
                    ? "Password protection is enabled for this meeting." 
                    : "Enable password protection for added security."}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gray-900/50">
                <h3 className="font-medium mb-2">Waiting Room</h3>
                <p className="text-sm text-gray-400">
                  {enableWaitingRoom 
                    ? "Participants will wait in a virtual waiting room until admitted." 
                    : "Enable waiting room to control who joins the meeting."}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gray-900/50">
                <h3 className="font-medium mb-2">Recording</h3>
                <p className="text-sm text-gray-400">
                  Record this meeting to the cloud for later review. (Available in Pro plan)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Ready to Start?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">
                Share the meeting link with participants and start your video call.
              </p>
              <Button 
                onClick={startMeeting}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
              >
                Start Meeting
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}