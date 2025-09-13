"use client"

import { useState, useEffect, useRef } from "react"
import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  ScreenShare, 
  ScreenShareOff,
  MessageCircle,
  Users,
  Send,
  X
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { MeetingService } from "@/lib/meetingService"

export default function MeetingRoom({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { user } = useAuth()
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [meetingTitle, setMeetingTitle] = useState("Meeting Room")
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map())
  const [isConnected, setIsConnected] = useState(false)
  const [participants, setParticipants] = useState<any[]>([
    { id: '1', name: 'You', isHost: true },
    { id: '2', name: 'Participant 1', isHost: false },
    { id: '3', name: 'Participant 2', isHost: false }
  ])
  const [chatMessages, setChatMessages] = useState<any[]>([
    { id: '1', participantName: 'Participant 1', message: 'Hello everyone!', timestamp: Date.now() - 300000 },
    { id: '2', participantName: 'Participant 2', message: 'Hi there!', timestamp: Date.now() - 120000 }
  ])
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map())

  // Unwrap params using React.use()
  const { id: meetingId } = React.use(params)

  // Initialize media devices
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        setLocalStream(stream)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error("Error accessing media devices:", error)
      }
    }

    initializeMedia()

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Fetch meeting details
  useEffect(() => {
    const fetchMeeting = async () => {
      const meeting = await MeetingService.getMeeting(meetingId)
      if (meeting) {
        setMeetingTitle(meeting.title)
      }
    }

    fetchMeeting()
  }, [meetingId])

  // Add participant to meeting
  useEffect(() => {
    if (user) {
      MeetingService.addParticipant(
        meetingId,
        user.email || "Anonymous",
        false // isHost - would need to check if user is host
      )
    }
  }, [user, meetingId])

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
      }
    }
    setIsMuted(!isMuted)
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
      }
    }
    setIsVideoOff(!isVideoOff)
  }

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing
        if (localStream) {
          localStream.getTracks().forEach(track => track.stop())
        }
        // Resume camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        setLocalStream(stream)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      } else {
        // Start screen sharing
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        })
        setLocalStream(stream)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
        // Handle screen share end
        stream.getVideoTracks()[0].addEventListener('ended', () => {
          setIsScreenSharing(false)
        })
      }
      setIsScreenSharing(!isScreenSharing)
    } catch (error) {
      console.error("Error toggling screen share:", error)
    }
  }

  const toggleChat = () => setShowChat(!showChat)
  
  const sendMessage = () => {
    if (newMessage.trim() === "") return
    // Simulate sending message
    const message = {
      id: Date.now().toString(),
      participantName: user?.email || "You",
      message: newMessage,
      timestamp: Date.now()
    }
    setChatMessages(prev => [...prev, message])
    setNewMessage("")
  }

  // Simulate connection status
  useEffect(() => {
    setIsConnected(true)
  }, [])

  const leaveMeeting = async () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    router.push("/dashboard")
  }

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="p-4 flex justify-between items-center bg-black/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            <span className="text-sm font-medium">{meetingTitle}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4" />
            <span>{participants.length} participants</span>
          </div>
        </div>
        
        {/* Video Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4 p-4">
          {/* Local Video */}
          <div className="relative rounded-lg overflow-hidden bg-gray-900">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-amber-900/20"></div>
            <video 
              ref={localVideoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 rounded-full px-3 py-1 text-sm">
              You
            </div>
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center">
                  <VideoOff className="w-12 h-12 text-gray-400" />
                </div>
              </div>
            )}
          </div>
          
          {/* Remote Participants */}
          {participants
            .filter(p => p.id !== user?.id)
            .slice(0, 3)
            .map((participant, index) => (
              <div key={participant.id} className="relative rounded-lg overflow-hidden bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-amber-900/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center">
                    <Video className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/50 rounded-full px-3 py-1 text-sm">
                  {participant.name}
                </div>
              </div>
            ))}
          
          {/* Additional participants placeholder */}
          {participants.length > 4 && (
            <div className="relative rounded-lg overflow-hidden bg-gray-900 col-span-2">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-amber-900/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-gray-700 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400">+{participants.length - 4} more participants</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="p-6 bg-black/50 backdrop-blur-sm">
          <div className="flex justify-center items-center gap-6">
            <Button 
              size="icon" 
              variant={isMuted ? "destructive" : "secondary"}
              onClick={toggleMute}
              className="rounded-full w-14 h-14"
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>
            
            <Button 
              size="icon" 
              variant={isVideoOff ? "destructive" : "secondary"}
              onClick={toggleVideo}
              className="rounded-full w-14 h-14"
            >
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </Button>
            
            <Button 
              size="icon" 
              variant={isScreenSharing ? "default" : "secondary"}
              onClick={toggleScreenShare}
              className="rounded-full w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              {isScreenSharing ? <ScreenShareOff className="w-6 h-6" /> : <ScreenShare className="w-6 h-6" />}
            </Button>
            
            <Button 
              size="icon" 
              variant="secondary"
              onClick={toggleChat}
              className="rounded-full w-14 h-14 relative"
            >
              <MessageCircle className="w-6 h-6" />
              {chatMessages.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {chatMessages.length}
                </span>
              )}
            </Button>
            
            <Button 
              size="icon" 
              variant="destructive"
              onClick={leaveMeeting}
              className="rounded-full w-14 h-14"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Chat Panel */}
      {showChat && (
        <div className="w-80 bg-gray-900/50 backdrop-blur-sm border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="font-medium">Chat</h3>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={toggleChat}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg: any) => (
              <div key={msg.id} className="text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{msg.participantName || "Unknown"}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-gray-200">{msg.message}</p>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <Input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button 
                size="icon" 
                onClick={sendMessage} 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                disabled={!isConnected}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}