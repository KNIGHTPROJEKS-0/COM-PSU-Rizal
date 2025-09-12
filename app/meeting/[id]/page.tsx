"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  MoreHorizontal
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function MeetingRoom() {
  const router = useRouter()
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{id: number, user: string, message: string, time: string}>>([])
  const [newMessage, setNewMessage] = useState("")
  const [participants, setParticipants] = useState(1)
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  // Simulate participants joining
  useEffect(() => {
    const interval = setInterval(() => {
      if (participants < 12) {
        setParticipants(prev => prev + 1)
      }
    }, 10000)
    
    return () => clearInterval(interval)
  }, [participants])

  // Simulate chat messages
  useEffect(() => {
    const messages = [
      {id: 1, user: "Alex Johnson", message: "Hi everyone! Ready to start?", time: "10:00 AM"},
      {id: 2, user: "Maria Garcia", message: "Yes, I've shared the documents in the chat", time: "10:01 AM"},
      {id: 3, user: "David Chen", message: "Thanks Maria, I can see them", time: "10:02 AM"},
    ]
    
    setChatMessages(messages)
  }, [])

  const toggleMute = () => setIsMuted(!isMuted)
  const toggleVideo = () => setIsVideoOff(!isVideoOff)
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing)
  const toggleChat = () => setShowChat(!showChat)
  
  const sendMessage = () => {
    if (newMessage.trim() === "") return
    
    const newMsg = {
      id: chatMessages.length + 1,
      user: "You",
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    setChatMessages(prev => [...prev, newMsg])
    setNewMessage("")
  }

  const leaveMeeting = () => {
    router.push("/")
  }

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="p-4 flex justify-between items-center bg-black/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-sm font-medium">Meeting in progress</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4" />
            <span>{participants} participants</span>
          </div>
        </div>
        
        {/* Video Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4 p-4">
          {/* Local Video */}
          <div className="relative rounded-lg overflow-hidden bg-gray-900">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-amber-900/20"></div>
            <div className="absolute bottom-4 left-4 bg-black/50 rounded-full px-3 py-1 text-sm">
              You
            </div>
            {isVideoOff ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center">
                  <VideoOff className="w-12 h-12 text-gray-400" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center">
                  <Video className="w-12 h-12 text-gray-400" />
                </div>
              </div>
            )}
          </div>
          
          {/* Remote Participant 1 */}
          <div className="relative rounded-lg overflow-hidden bg-gray-900">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-amber-900/20"></div>
            <div className="absolute bottom-4 left-4 bg-black/50 rounded-full px-3 py-1 text-sm">
              Alex Johnson
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center">
                <Video className="w-12 h-12 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Remote Participant 2 */}
          <div className="relative rounded-lg overflow-hidden bg-gray-900">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-amber-900/20"></div>
            <div className="absolute bottom-4 left-4 bg-black/50 rounded-full px-3 py-1 text-sm">
              Maria Garcia
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center">
                <Video className="w-12 h-12 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Screen Share */}
          <div className="relative rounded-lg overflow-hidden bg-gray-900 col-span-2">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-amber-900/20"></div>
            <div className="absolute top-4 left-4 bg-black/50 rounded-full px-3 py-1 text-sm flex items-center gap-2">
              <ScreenShare className="w-4 h-4" />
              Maria is sharing screen
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-gray-700 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Monitor className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400">Presentation slides</p>
              </div>
            </div>
          </div>
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
            {chatMessages.map((msg) => (
              <div key={msg.id} className="text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{msg.user}</span>
                  <span className="text-xs text-gray-400">{msg.time}</span>
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
              <Button size="icon" onClick={sendMessage} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Icons that might be missing from imports
function Monitor({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="12" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  )
}

function Send({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="22" x2="11" y1="2" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" x2="6" y1="6" y2="18" />
      <line x1="6" x2="18" y1="6" y2="18" />
    </svg>
  )
}