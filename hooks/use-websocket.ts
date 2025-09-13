import { useState, useEffect, useRef } from "react"
import { MeetingService } from "@/lib/meetingService"

interface Participant {
  id: string
  meetingId: string
  name: string
  socketId: string
  isHost: boolean
  isMuted: boolean
  isCameraOff: boolean
  isScreenSharing: boolean
  joinedAt: string
}

interface ChatMessage {
  id: string
  meetingId: string
  participantId: string
  message: string
  timestamp: string
  participantName?: string
}

export function useWebSocket(
  meetingId: string,
  participantId: string,
  participantName: string
) {
  const [isConnected, setIsConnected] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Connect to WebSocket server
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const wsUrl = `${protocol}//${window.location.host}/api/ws`
    
    ws.current = new WebSocket(wsUrl)

    ws.current.onopen = () => {
      setIsConnected(true)
      // Join the meeting
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: 'join-meeting',
          meetingId,
          participantId,
          participantName,
        }))
      }
    }

    ws.current.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data)
        
        switch (data.type) {
          case 'participant-joined':
            // Refresh participants list
            const updatedParticipants = await MeetingService.getParticipants(meetingId)
            setParticipants(updatedParticipants)
            break

          case 'participant-left':
            setParticipants(prev => prev.filter(p => p.id !== data.participantId))
            break

          case 'participant-updated':
            setParticipants(prev => 
              prev.map(p => 
                p.id === data.participantId ? { ...p, ...data.updates } : p
              )
            )
            break

          case 'new-chat-message':
            // Get participant name for the message
            const sender = participants.find(p => p.id === data.message.participantId)
            setChatMessages(prev => [...prev, {
              ...data.message,
              participantName: sender?.name || 'Unknown'
            }])
            break

          case 'webrtc-signal':
            // Handle WebRTC signaling (not implemented in this example)
            break
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    ws.current.onclose = () => {
      setIsConnected(false)
    }

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error)
      setIsConnected(false)
    }

    // Fetch initial data
    const fetchData = async () => {
      const [initialParticipants, initialMessages] = await Promise.all([
        MeetingService.getParticipants(meetingId),
        MeetingService.getChatMessages(meetingId)
      ])
      
      setParticipants(initialParticipants)
      setChatMessages(initialMessages)
    }

    fetchData()

    return () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: 'leave-meeting',
          meetingId,
          participantId
        }))
      }
      ws.current?.close()
    }
  }, [meetingId, participantId, participantName])

  const sendMessage = (message: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'chat-message',
        meetingId,
        participantId,
        message
      }))
    }
  }

  return {
    participants,
    chatMessages,
    sendMessage,
    isConnected
  }
}